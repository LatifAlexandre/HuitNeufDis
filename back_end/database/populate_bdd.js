// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyALwGeXTcqkbvs86zsBb11ZAzsimsLdbHs",
    authDomain: "huitneufdis-1e9f6.firebaseapp.com",
    databaseURL: "https://huitneufdis-1e9f6.firebaseio.com",
    projectId: "huitneufdis-1e9f6",
    storageBucket: "huitneufdis-1e9f6.appspot.com",
    messagingSenderId: "941586994592"
    });
    

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// add datas
for (var i = 0; i < 10; i++) {
    addProduct(`product n°${i}`, 15, 1,'F')
}


// ----- functions -----
function addProduct(productName, stock, posX, posY) {
    db.collection("products").add({
        productName: productName,
        stock: stock,
        position: {
            x: posX,
            y: posY
        }
    })
    .then(function(docRef) {
        console.log("product written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding product: ", error);
    });
}
