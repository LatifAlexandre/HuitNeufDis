# Regroupement de commandes - Application 2018

Voici l'algorithme développé pour regrouper les commandes.
C'est une *cloud function* de firestore, écrite en javascript.

## algorithme

L'algorithme d'optimisation fonctionne de la sorte :
**Phase de récupération de données**

    - il récupère chacunes des commandes stockées sur la base de donnée
    - il récupère, pour chaque commande, les produits qui lui sont associé, car ils sont ailleur sur la base de donnée
    - il créé un Array de commandes, chaque commande contient un attribut products qui contient les produits associés à cette commande

**Phase de recherche**

    - l'agorithme énumère l'ensemble des combinaisons de commandes possibles (soit pour n commandes, toute les combinaison de 1 commandes, 2 commandes, 3 commandes, jusqu'a n commandes)
    - Si le poids de la combinaison de commande excède le poids maximum du préparateur, elle est directement éliminé
    - sinon, une note lui est attribué, en fonction de la distance de parcours et de son poids.
    - les produits de la combinaison de commande ayant la meilleur note sont renvoyé, ordonnées selon leur ordre de picking dans le hangar.

### notation d'un regroupement de commandes

Pour noter un regroupement de commande, 2 critères sont pris en compte :

    - son poids, que l'on veut maximiser (si il n'éxcède pas le poids maximum du préparateur)
    - la distance à parcourir pour récupérer les produits de ces commandes, que l'on veut minmiser

#### note de poids

Pour la note de poids, nous avons simplement divisé le poids du regroupement par le poids maximum du préparateur : ` var weight_note = getWeight(combination) / maxWeight;`

Il en résulter un flottant entre 0 et 1, 1 étant un poids proche de la limite du préparateur

#### note de distance

pour la distance, le calcul de la note est un peu plus compliqué.
Il est d'abord nécessaire de classer les produits du regroupement de commande en fonction de leurs emplacement dans le hangar.
En effet, pour un ensemble de produit quelconque, il n'y à qu'un seul ordre de récupération dans le hangar, les sens de circulation étant imposé.

Une fois la liste de produit ordonné, il suffit de calculer la distance nécessaire pour les récupérer.
Ce calcul est fait en sommant la distance entre l'entré et le premier produit, et de l'ensemble des distance des produits adjacents, en les prenant 2 à 2, et enfin d'ajouter la distance entre le dernier produit et la sortie.

La distance utilisé pour cacluler la distance entre 2 positions dans le hangar est la distance de Manathan, qui nous semblait être la meilleur approximiation de la distance réel.
[distance de Manhattan](https://fr.wikipedia.org/wiki/Distance_de_Manhattan)

Une fois cette distance connue, nous l'utilisons pour assigner la note de distance au regroupement, avec ce calcul : `distance_note = (max_distance - getDistanceOfProductList(products)) / max_distance`

Comme l'on veut minimiser la distance, nous voulons une note qui soit grande si la distance est petite.
C'est pour cela que nous soustrayons la distance du plus long parcours dans le hangar, par la distance du regroupement de commande.
En effet *minimiser la distance* revient a *maximiser le nombre de mètres à ne pas parcourir*.

Puis nous divisons cela par la distance maximum, pour avoir un résultat entre 0 et 1.

#### note finale

la note finale est la moyenne de la note de distance et de la note de poids. Cette moyenne est pondérée : `final_note = weight_note * 8 + distance_note * 2;` 
Nous avons choisi un pondération de 8 pour le poids et de 2 pour la distance, mais nous aurions très bien pu en prendre une autre.
La pondération dépend du besoin du client


# Code source

## fonction appelé depuis le client 

```javascript
exports.getCommandPrepGroup2 = functions.https.onRequest((request, response) => {
    
    const maxWeight = Number(request.query.maxWeight);
    const prepFirstName = request.query.firstname;
    const prepLastName = request.query.lastname;

    // we get all the commands on the database
    admin.firestore().collection("commands").where('state', '==', 'waiting').orderBy('dateOfCreation', 'asc').get()
    .then(function(querySnapshot) {
        var commands = []
        querySnapshot.forEach( commandDoc => {
            var command = commandDoc.data()
            var commandId = commandDoc.id;
            command.commandId = commandId
            commands.push(command);
            // we get the products of each command and bind it
            admin.firestore().collection("commands").doc(commandId).collection("products").get()
                .then( querySnapshot => {
                    products = []
                    querySnapshot.forEach( productDoc => {
                        var product = productDoc.data();
                        var commandProductId = productDoc.id;
                        products.push ({
                            commandId: commandId,
                            commandProductId: commandProductId,
                            productId: product.productId,
                            productName: product.productName,
                            position: product.position
                        });
                    })

                    // we add the products to its related command
                    var index = commands.findIndex( command => command.commandId == commandId)
                    commands[index].products = products;
                })
        })

        setTimeout( () => {

            // now, commmands is a list of command, each command have a weight
            // and a list of products
            
            productListNoted = [];

            // we enumerate the list of all the possible combination of commands
            // so all the combination of 1  command + all combination of 2 commands + ... 
            getAllCombinationOf(commands).forEach( combination => {
                // if too heavy --> we pass to the next combination
                if (getWeight(combination) < maxWeight) {
                     // we give a note to the weight, centered and reduced
                    var weight_note = getWeight(combination) / maxWeight;
                    // if the weight is big, the weight_note is close to one
                    // we want to maxmimize it
                    
                    // we take all the product of the combination of commands
                    var products = []
                    combination.forEach( command => {
                        products = [...products, ...command.products]
                    })
                    // we sort it by the order of picking in the hangar
                    products = orderProductList(products)
                    
                    // we calculate the distance of this order of product
                    var distance = getDistanceOfProductList(products);
                    
                    var max_distance = 35 // this is the maximum distance in the hangar, used has boundarie here
                    // (the hangar has a dimension of 6 * 5)
                    
                    distance_note = (max_distance - getDistanceOfProductList(products)) / max_distance
                    // we want to minimize the distance
                    // the note is the max_distance - distance of the combination of command
                    //so, if the distance is short, the note is close to one
                    
                    // the finale note of a combination of command is an average with weigthing of these two notes
                    // (here the weigthings give a bigger importance to the weight than the distance,
                    // but we could imagine a different weighting according to the needs)
                    final_note = weight_note * 8 + distance_note * 2; 

                    // we store it
                    productListNoted.push({
                        products: products,
                        note: final_note,
                        weight: getWeight(combination),
                        dsitance: distance
                    })
                }
               
            })

            // we sort the product list noted by note
            productListNoted = productListNoted.sort( (a,b) => {
                if (a.note > b.note) return -1;
                if (b.note > a.note) return 1;
                return 0;
            })

            
            // if there is no products to send back, we send an empty array
            if (productListNoted.length == 0) {
                response.json([])
            }
            else {
                console.log(JSON.stringify(productListNoted[0]))

                productListNoted[0].products.forEach( product => {
                    // we change the state of the command and its preparator
                    admin.firestore().collection("commands").doc(product.commandId).update({
                        preparator: { firstname: prepFirstName, lastname: prepLastName},
                        state: 'in_progress'
                    })
                })

                // we return the best list of products
                response.json(productListNoted[0].products)
            }

        }, 1000)
    })
});
```

## autres fonctions, utiles à la première

```javascript
// return the distance to take to pick all the products of the list
// from the entry of the hangar to the exit
// the list on products given have to be sorted by their position in the hangar
function getDistanceOfProductList(products) {
    // we begin at 1,1
    // we finish at 6,1
	var distance = 0;
	var lastPos = {
		x: 1,
		y: 1
	}
	products.forEach( product => {
		distance += getDistance(lastPos, product.position)
		latPost = product.position;
	})
	distance += getDistance(products[products.length-1].position, {x: 6, y: 1})

	return distance
}
```

```javascript
// we use the manathan distance
function getDistance(pos1, pos2) {
    return Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y)
}
```

```javascript
function orderProductList(productList) {
    return productList.sort(function(p1, p2) {
     //if p1 and p2 are at the same place
     if (p1.position.x == p2.position.x && p1.position.y == p2.position.y) {
         return 0;
     }
     //if p1 is before p2   
     if (p1.position.x < p2.position.x || 
         (p1.position.x == p2.position.x && (p1.position.x % 2 == 0 ? p1.position.y > p2.position.y : p1.position.y < p2.position.y))) {
         return -1;
     }
     //if p1 is after p2
     else {
         return 1;
     }
    })
 }
 ```

 ```javascript
 function getWeight(commandCombination) {
    var weight = 0;
    commandCombination.forEach( command => {
        weight += command.weight;
    })
    return weight;
}
```
 ```javascript
function getAllCombinationOf(array) {
    var combinations = []       
    for (let i = 1; i <= array.length; i++){
        console.log(i)
        combinations.push( ...k_combinations(array, i))
    }
    return combinations
}
```

```javascript
function k_combinations(set, k) {
// fonction développé par Akseli Palén.
}
```
github : [Githbud de k_combinations](https://gist.github.com/axelpale/3118596)