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
    // response.json(preparatorId)
    admin.firestore().collection('preparators').doc(preparatorId).get()
    .then(doc => {
        var preparator = doc.data()
        response.json(preparator)
    })
});

// ---------------- get a group of command according to a preparator's criterion ---------------

exports.getCommandPrepGroup = functions.https.onRequest((request, response) => {
    
    const maxWeight = Number(request.query.maxWeight);
    const prepFirstName = request.query.firstname;
    const prepLastName = request.query.lastname;
    var weight = 0;
    var commandPrepGroup = [];
    
    // .where('state', '==', 'waiting').
    admin.firestore().collection("commands").where('state', '==', 'waiting').orderBy('dateOfCreation', 'asc').get()
        .then(function(querySnapshot) {
            // we enumerate all the commands
            querySnapshot.forEach(function(doc) {
                var command = doc.data();
                var commandId = doc.id;
                // it the command if light enough
                if (command.weight + weight <= maxWeight) {
                    // we increment the weight
                    weight += command.weight;
                    // we get all the products of this command
                    admin.firestore().collection("commands").doc(doc.id).collection("products").get()
                        .then( function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                var product = doc.data();
                                commandPrepGroup.push({
                                    commandId: commandId,
                                    productId: doc.id,
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
                response.json(orderProductList(commandPrepGroup));
            }, 1000)
                
        });
});

function orderProductList(productList) {
    return productList.sort(function(p1, p2) {
     //if p1 and p2 are at the same place
     if (p1.position.x == p2.position.x && p1.position.y == p2.position.y) {
         console.log(` ${p1.productName} (${p1.position.x}, ${p1.position.y}) == ${p2.productName} (${p2.position.x}, ${p2.position.y})` )
         return 0;
     }
     //if p1 is before p2   
     if (p1.position.x < p2.position.x || 
         (p1.position.x == p2.position.x && (p1.position.x % 2 == 0 ? p1.position.y > p2.position.y : p1.position.y < p2.position.y))) {
         console.log(` ${p1.productName} (${p1.position.x}, ${p1.position.y}) is before ${p2.productName} (${p2.position.x}, ${p2.position.y})` )
         return -1;
     }
     //if p1 is after p2
     else {
         console.log(` ${p1.productName} (${p1.position.x}, ${p1.position.y}) is after ${p2.productName} (${p2.position.x}, ${p2.position.y})` )
         return 1;
     }
    })
 }

// -------------------------- when a preparator scan a product command  -------------------------

exports.scanProduct = functions.https.onRequest((request, response) => {

    const commandId = request.query.commandId;
    const productId = request.query.productId;

    admin.firestore().collection('commands').doc(commandId).collection('products').doc(productId).get()
    .then( doc => {
        if (doc.data().scanned) {
            response.send(`the product ${productId} in the command ${productId} is already scanned`)
        } else {
            // put scanned on true in the related product *in the command*
            admin.firestore().collection('commands').doc(commandId).collection('products').doc(productId).update({
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