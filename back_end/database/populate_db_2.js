
function populate_db_2(idName) {

    var nbOfProducts = 30;
    var nbOfCommands = 10;
    var nbProductByCommandMin = 5;
    var nbProductByCommandMax = 10;
    console.log('hello from pop2')

    // creation of the preparators
    db.collection("preparators").doc('1').set({firstname: 'Sabri', lastname: 'Boussetha', maxSupportedWeight: 20})
    db.collection("preparators").doc('2').set({firstname: 'Baptiste', lastname: 'Briot', maxSupportedWeight: 30})
    db.collection("preparators").doc('3').set({firstname: 'Ricardo', lastname: 'Rodriguez', maxSupportedWeight: 20})
    db.collection("preparators").doc('4').set({firstname: 'Aurélien', lastname: 'Desvillette', maxSupportedWeight: 12})
    db.collection("preparators").doc('5').set({firstname: 'Olivia', lastname: 'Dupont', maxSupportedWeight: 20})

    // creation of the products localy
    var products = [];
    for (let i = 0; i < nbOfProducts; i++) {
        products.push({
            stock: randomInt(3,30),
            endOfStock: false,
            endOfStockInfo: null,
            productName: `Product ${i}`,
            position: { x: randomInt(1,6), y: randomInt(1,5), shelf: randomLetter(), compartment: randomLetter()}
        })
    }
    // storage into the product collection
    for (let i = 0; i < products.length; i++){
        db.collection("products").doc(String(i)).set(products[i]);
    }

    // creation of the commands
    for (let i = 0; i < nbOfCommands; i++) {

        numberOfProducts = randomInt(nbProductByCommandMin, nbProductByCommandMax);

        db.collection("commands").doc(String(i)).set({
            weight: randomInt(5,15),
            dateOfCreation: new Date(),
            state: 'waiting',
            numberOfProducts: numberOfProducts,
            numberOfUnscannedProducts: numberOfProducts,
            preparator: null
        })
        // creation of the products associated to a command
        for (let j = 0; j < numberOfProducts; j++) {

            var randomProductId = randomInt(0, products.length - 1)
            var randomProduct = products[randomProductId]

            db.collection("commands").doc(String(i)).collection('products').doc(String(j)).set({
                productName: randomProduct.productName,
                productId: String(randomProductId),
                position: randomProduct.position,
                scanned: false,
            });
        }
    }
}

//-------------------- success / error functions -------------------------

function success () {
    console.log("doc successfully added")
}

function error (msg) {
    console.log(msg);
}

// -------------------------- functions --------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * max ) + min
}

function randomLetter() {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return possible.charAt(Math.floor(Math.random() * possible.length));
  }

