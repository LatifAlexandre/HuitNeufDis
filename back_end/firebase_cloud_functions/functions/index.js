const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

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
                                    id: doc.id,
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
            enOfStockMoreInfo: {
                date: new Date(),
                from: 'system'
            }
        })
    });

exports.commandFinished = functions.firestore
    .document('commands/{commandId}/products/{productId}')
    .onUpdate(event => {
        // Get an object representing the document
        var newValue = event.data.data();
        // the previous value before this update
        var previousValue = event.data.previous.data();

        // We'll only update if the stock has changed.
        // This is crucial to prevent infinite loops.
        if (newValue.scanned == previousValue.scanned) return;

        // if all the products of the command are scanned
        admin.firestore.collection("commands").doc(event.params.commandId).collection('products')
        .where('scanned', '==', false).get()
        .then( function(querySnapshot) {
            if (querySnapshot.size == 0) {
                return event.data.ref.update({
                    lqmsdkjf: 'wesh'
                })
            }
        })
    });