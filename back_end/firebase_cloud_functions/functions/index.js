const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// ----------------------------------------------------------------------------------------------
// ---------------------------------- HTTP TRIGGERED FUNCTIONS ----------------------------------
// ----------------------------------------------------------------------------------------------

// --------------------------------- get a preparator from its id -----------------------------------

exports.getPreparator = functions.https.onRequest((request, response) => {

    const preparatorId = request.query.id;
    console.log(`--> call of getPreparator with id=${preparatorId}`)
    
    // response.json(preparatorId)
    admin.firestore().collection('preparators').doc(preparatorId).get()
    .then(doc => {
        console.log('\tget ' + JSON.stringify(doc.data()))
        var preparator = doc.data()
        response.json(preparator)
    })
});



// -------------------------- when a preparator scan a product command  -------------------------

exports.scanProduct = functions.https.onRequest((request, response) => {

    const commandId = request.query.commandId;
    const commandProductId = request.query.commandProductId;
    const productId = request.query.productId;

    console.log(`--> call of scanProduct with commandId=${commandId} and commandProductId=${commandProductId}, productId=${productId}`)

    admin.firestore().collection('commands').doc(commandId).collection('products').doc(commandProductId).get()
    .then( doc => {
        if (doc.data().scanned) {
            response.send(`the product ${commandProductId} in the command ${commandId} is already scanned`)
        } else {
            // put scanned on true in the related product *in the command*
            admin.firestore().collection('commands').doc(commandId).collection('products').doc(commandProductId).update({
                scanned: true
            })
        
            // in the product command, decrement the number of unscanned products
            admin.firestore().collection('commands').doc(commandId).get().then(doc => {
                admin.firestore().collection('commands').doc(commandId).update({
                    numberOfUnscannedProducts: doc.data().numberOfUnscannedProducts - 1
                })
            })
        
            // decrement the stock of the product in the products collection
            admin.firestore().collection('products').doc(productId).get().then(doc => {
                admin.firestore().collection('products').doc(productId).update({
                    stock: doc.data().stock -1
                })
            })
        
            response.send('done')
        }
    })


});

// ----------------------------- end of stock alert from a preparator ---------------------------

exports.endOfStockAltert = functions.https.onRequest((request, response) => {

    
    const productId = request.query.productId;
    const firstname = request.query.firstname;
    const lastname = request.query.lastname;

    console.log(`--> call of endOfStockAltert with productId=${productId}, firstname=${firstname} and lastname=${lastname}`)

    admin.firestore().collection('products').doc(productId).update({
        endOfStock: true,
        endOfStockInfo: {
            date: new Date(),
            from: firstname + ' ' + lastname
        }
    });

    response.send('done');
});

// ------------------------- get all the product with an end of stock flag ----------------------

// --------------------------- signal when a product is reaprovisonned --------------------------

// ------------------------------------- get all the commands -----------------------------------

// ----------------------------------------------------------------------------------------------
// ---------------------------FIRESTORE UPDATE TRIGERRED FUNCTIONS-------------------------------
// ----------------------------------------------------------------------------------------------


// ---------------------------- when a product stock < 5; the product is end of stock -------------

exports.productEndOfStock = functions.firestore
.document('products/{productId}')
.onUpdate(event => {
    // Get an object representing the document
    var newValue = event.data.data();
    // the previous value before this update
    var previousValue = event.data.previous.data();

    // We'll only update if the stock has changed.
    // This is crucial to prevent infinite loops.
    if (newValue.stock == previousValue.stock || newValue.stock > 5) return;

    // Then return a promise of a set operation to update the count
    return event.data.ref.update({
        endOfStock: true,
        endOfStockInfo: {
            date: new Date(),
            from: 'system'
        }
    })
});

// ------------ when all the products of a command are scanned, the command is finished -----------

exports.commandFinished = functions.firestore
.document('commands/{commandId}')
.onUpdate(event => {
    // Get an object representing the document
    var newValue = event.data.data();
    // the previous value before this update
    var previousValue = event.data.previous.data();

    // We'll only update if the stock has changed.
    // This is crucial to prevent infinite loops.
    if (newValue.numberOfUnscannedProducts == previousValue.numberOfUnscannedProducts
        || newValue.numberOfUnscannedProducts != 0) return;

    // Then return a promise of a set operation to update the count
    return event.data.ref.update({
        state: 'finished'
    })
});


// ---------------------------------------------------------------------------------------------
//                    THE ALGORITHM TO CALCULATE THE BEST GROUP OF COMMANDS
// ---------------------------------------------------------------------------------------------

// ---------------- get a group of command according to a preparator's criterion ---------------

exports.getCommandPrepGroup = functions.https.onRequest((request, response) => {
    
    const maxWeight = Number(request.query.maxWeight);
    const prepFirstName = request.query.firstname;
    const prepLastName = request.query.lastname;

    console.log(`--> call of getCommandPrepGroup with maxWeight=${maxWeight}, firstname=${prepFirstName} and lastname=${prepLastName}`)

    var weight = 0;
    var commandPrepGroup = [];
    
    // .where('state', '==', 'waiting').
    admin.firestore().collection("commands").where('state', '==', 'waiting').orderBy('dateOfCreation', 'asc').get()
        .then(function(querySnapshot) {
            // we enumerate all the commands
            querySnapshot.forEach(function(doc) {
                var command = doc.data();
                var commandId = doc.id;
                // if the command is light enough
                if (command.weight + weight <= maxWeight) {
                    // we increment the weight
                    weight += command.weight;
                    // we get all the products of this command
                    admin.firestore().collection("commands").doc(commandId).collection("products").get()
                        .then( function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                console.log(`\t command ${commandId}/product ${doc.id} is added`)
                                var product = doc.data();
                                commandPrepGroup.push({
                                    commandId: commandId,
                                    commandProductId: doc.id,
                                    productId: product.productId,
                                    productName: product.productName,
                                    position: product.position
                                });
                            })
                        })

                    // we change the state of the command and its preparator
                    admin.firestore().collection("commands").doc(doc.id).update({
                        preparator: { firstname: prepFirstName, lastname: prepLastName},
                        state: 'in_progress'
                    })
                }
            });

            // we return the product array
            setTimeout( () => {
                console.log('\t the products are returned as JSON')
                response.json(orderProductList(commandPrepGroup));
            }, 1000)
                
        });
});

exports.getCommandPrepGroup2 = functions.https.onRequest((request, response) => {
    
    const maxWeight = Number(request.query.maxWeight);
    const prepFirstName = request.query.firstname;
    const prepLastName = request.query.lastname;

    console.log(`--> call of getCommandPrepGroup2 with maxWeight=${maxWeight}, firstname=${prepFirstName} and lastname=${prepLastName}`)

    // we get all the commands on the database
    admin.firestore().collection("commands").where('state', '==', 'waiting').orderBy('dateOfCreation', 'asc').get()
    .then(function(querySnapshot) {
        var commands = []
        querySnapshot.forEach( commandDoc => {
            var command = commandDoc.data()
            var commandId = commandDoc.id;
            command.commandId = commandId
            commands.push(command);
            // we get the products of each command and bind them to the command
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

            // now, commmands is a list of command, each command have some informations
            // but we are interested here with the weight and the product positions of a command
            
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
                    
                    var max_distance = 35 // this is the maximum distance inthe hangar, used has bound here (the hangar has a dimension of 6 * 5)
                    distance_note = (max_distance - getDistanceOfProductList(products)) / max_distance
                    // we want to minimize the distance
                    // the note is the max_distance - distance of the combination of command
                    //so, if the distance is short, the note is close to one
                    
                    // the finale note of a combination of command is an average with ponderation of these two notes
                    // (here the ponderation are equal, but we could imagine a more accurate distribution according to the needs)
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

                response.json(productListNoted[0].products)
            }

        }, 1000)
    })
});

// ----------------------  associated functions ----------------------------------

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

// we use the manathan distance
function getDistance(pos1, pos2) {
    return Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y)
}

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

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function getWeight(commandCombination) {
    var weight = 0;
    commandCombination.forEach( command => {
        weight += command.weight;
    })
    return weight;
}

function getAllCombinationOf(array) {
    var combinations = []       
    for (let i = 1; i <= array.length; i++){
        console.log(i)
        combinations.push( ...k_combinations(array, i))
    }
    return combinations
}

/**
 * Copyright 2012 Akseli Palén.
 * Created 2012-07-15.
 * Licensed under the MIT license.
 * 
 * <license>
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * </lisence>
 * 
 * Implements functions to calculate combinations of elements in JS Arrays.
 * 
 * Functions:
 *   k_combinations(set, k) -- Return all k-sized combinations in a set
 *   combinations(set) -- Return all combinations of the set
 */


/**
 * K-combinations
 * 
 * Get k-sized combinations of elements in a set.
 * 
 * Usage:
 *   k_combinations(set, k)
 * 
 * Parameters:
 *   set: Array of objects of any type. They are treated as unique.
 *   k: size of combinations to search for.
 * 
 * Return:
 *   Array of found combinations, size of a combination is k.
 * 
 * Examples:
 * 
 *   k_combinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 * 
 *   k_combinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 * 
 *   k_combinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 * 
 *   k_combinations([1, 2, 3], 4)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], 0)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], -1)
 *   -> []
 * 
 *   k_combinations([], 0)
 *   -> []
 */
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	// There is no way to take e.g. sets of 5 elements from
	// a set of 4.
	if (k > set.length || k <= 0) {
		return [];
	}
	
	// K-sized set has only one K-sized subset.
	if (k == set.length) {
		return [set];
	}
	
	// There is N 1-sized subsets in a N-sized set.
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	// Algorithm description:
	// To get k-combinations of a set, we want to join each element
	// with all (k-1)-combinations of the other elements. The set of
	// these k-sized sets would be the desired result. However, as we
	// represent sets with lists, we need to take duplicates into
	// account. To avoid producing duplicates and also unnecessary
	// computing, we use the following approach: each element i
	// divides the list into three: the preceding elements, the
	// current element i, and the subsequent elements. For the first
	// element, the list of preceding elements is empty. For element i,
	// we compute the (k-1)-computations of the subsequent elements,
	// join each with the element i, and store the joined to the set of
	// computed k-combinations. We do not need to take the preceding
	// elements into account, because they have already been the i:th
	// element so they are already computed and stored. When the length
	// of the subsequent list drops below (k-1), we cannot find any
	// (k-1)-combs, hence the upper limit for the iteration:
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


/**
 * Combinations
 * 
 * Get all possible combinations of elements in a set.
 * 
 * Usage:
 *   combinations(set)
 * 
 * Examples:
 * 
 *   combinations([1, 2, 3])
 *   -> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 * 
 *   combinations([1])
 *   -> [[1]]
 */
function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}