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
    
    admin.firestore().collection("commands").orderBy('dateOfCreation', 'asc').get()
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
                    admin.firestore().collection("commands").doc(doc.id).set({
                        preparator: { firstname: prepFirstName, lastname: prepLastName},
                        state: 'in_progress'
                    })
                }
            });

            // we return the product array
            setTimeout( () => {
                response.json(commandPrepGroup);
            }, 2000)
                
        });
    
    

});
