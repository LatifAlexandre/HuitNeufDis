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

// ------------------------------------------------------------------------
// ------------------------------ add datas -------------------------------
// ------------------------------------------------------------------------

// ------------------------------- add preparators ------------------------

db.collection("preparators").doc('1').set({firstname: 'george', lastname: 'bush', maxSupportedWeight: 30}).then(success).catch(error)
db.collection("preparators").doc('2').set({firstname: 'dan', lastname: 'rab', maxSupportedWeight: 50}).then(success).catch(error)
db.collection("preparators").doc('3').set({firstname: 'jon', lastname: 'doe', maxSupportedWeight: 40}).then(success).catch(error)

// ------------------------------- add products ----------------------------

db.collection("products").doc('1').set({
    productName: 'product A',
    stock: 22,
    enOfStockMoreInfo: null,
    position: { x: 1, y: 2, shelf: 'A', compartment: 'B'}
});
db.collection("products").doc('2').set({
    productName: 'product B',
    stock: 12,
    enOfStockMoreInfo: null,
    position: { x: 4, y: 5, shelf: 'X', compartment: 'Y'}
});
db.collection("products").doc('3').set({
    productName: 'product C',
    stock: 53,
    enOfStockMoreInfo: null,
    position: { x: 8, y: 9, shelf: 'R', compartment: 'U'}
});
db.collection("products").doc('4').set({
    productName: 'product D',
    stock: 27,
    enOfStockMoreInfo: null,
    position: { x: 7, y: 2, shelf: 'T', compartment: 'V'}
});
db.collection("products").doc('5').set({
    productName: 'product E',
    stock: 110,
    enOfStockMoreInfo: null,
    position: { x: 6, y: 5, shelf: 'D', compartment: 'H'}
});

// ------------------------------ add commands --------------------------------

db.collection("commands").doc('1').set({
    weight: 25,
    dateOfCreation: new Date("2018-01-01T12:00:00"),
    state: 'waiting',
    preparator: { firstname: 'george', lastname: 'bush'}
});
    db.collection("commands").doc('1').collection('products').doc('1').set({
        productName: 'product A',
        position: { x: 1, y: 2, shelf: 'A', compartment: 'B'},
        scanned: false,
        number: 2,
    });
    db.collection("commands").doc('1').collection('products').doc('2').set({
        productName: 'product B',
        position: { x: 4, y: 5, shelf: 'X', compartment: 'Y'},
        scanned: false,
        number: 1,
    });
    db.collection("commands").doc('1').collection('products').doc('3').set({
        productName: 'product C',
        position: { x: 8, y: 9, shelf: 'R', compartment: 'U'},
        scanned: false,
        number: 3,
    });

db.collection("commands").doc('2').set({
    weight: 12,
    dateOfCreation: new Date("2018-01-01T13:00:00"),
    state: 'waiting',
    preparator: { firstname: 'dan', lastname: 'rab'}
});
    db.collection("commands").doc('2').collection('products').doc('1').set({
        productName: 'product D',
        position: { x: 7, y: 2, shelf: 'T', compartment: 'V'},
        scanned: false,
        number: 3,
    });
    db.collection("commands").doc('2').collection('products').doc('2').set({
        productName: 'product E',
        position: { x: 6, y: 5, shelf: 'D', compartment: 'H'},
        scanned: false,
        number: 2,
    });

// ----- functions -----
/*
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
}*/



function success () {
    console.log("doc successfully added")
}

function error (msg) {
    console.log(msg);
}