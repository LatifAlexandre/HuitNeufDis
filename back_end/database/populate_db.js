

// ------------------------------------------------------------------------
// ------------------------------ add datas -------------------------------
// ------------------------------------------------------------------------

// ------------------------------- add preparators ------------------------

db.collection("preparators").doc('1').set({firstname: 'george', lastname: 'bush', maxSupportedWeight: 30})
db.collection("preparators").doc('2').set({firstname: 'dan', lastname: 'rab', maxSupportedWeight: 50})
db.collection("preparators").doc('3').set({firstname: 'jon', lastname: 'doe', maxSupportedWeight: 40})

// ------------------------------- add products ----------------------------

db.collection("products").doc('1').set({
    productName: 'product A',
    stock: 22,
    endOfStockInfo: null,
    position: { x: 1, y: 2, shelf: 'A', compartment: 'B'}
});
db.collection("products").doc('2').set({
    productName: 'product B',
    stock: 12,
    endOfStockInfo: null,
    position: { x: 2, y: 3, shelf: 'X', compartment: 'Y'}
});
db.collection("products").doc('3').set({
    productName: 'product C',
    stock: 53,
    endOfStockInfo: null,
    position: { x: 3, y: 1, shelf: 'R', compartment: 'U'}
});
db.collection("products").doc('4').set({
    productName: 'product D',
    stock: 27,
    endOfStockInfo: null,
    position: { x: 5, y: 2, shelf: 'T', compartment: 'V'}
});
db.collection("products").doc('5').set({
    productName: 'product E',
    stock: 110,
    endOfStockInfo: null,
    position: { x: 4, y: 3, shelf: 'D', compartment: 'H'}
});
db.collection("products").doc('6').set({
    productName: 'product F',
    stock: 27,
    endOfStockInfo: null,
    position: { x: 2, y: 2, shelf: 'F', compartment: 'E'}
});
db.collection("products").doc('7').set({
    productName: 'product G',
    stock: 14,
    endOfStockInfo: null,
    position: { x: 6, y: 3, shelf: 'R', compartment: 'T'}
});
db.collection("products").doc('8').set({
    productName: 'product H',
    stock: 12,
    endOfStockInfo: null,
    position: { x: 5, y: 1, shelf: 'H', compartment: 'Z'}
});

// ------------------------------ add commands --------------------------------

db.collection("commands").doc('1').set({
    weight: 5,
    dateOfCreation: new Date("2018-01-01T12:00:00"),
    state: 'waiting',
    numberOfUnscannedProducts: 3,
    preparator: null//{ firstname: 'george', lastname: 'bush'}
});
    db.collection("commands").doc('1').collection('products').doc('1').set({
        productName: 'product A',
        position: { x: 1, y: 2, shelf: 'A', compartment: 'B'},
        scanned: false,
        number: 2,
    });
    db.collection("commands").doc('1').collection('products').doc('2').set({
        productName: 'product B',
        position: { x: 2, y: 3, shelf: 'X', compartment: 'Y'},
        scanned: false,
        number: 1,
    });
    db.collection("commands").doc('1').collection('products').doc('3').set({
        productName: 'product C',
        position: { x: 3, y: 1, shelf: 'R', compartment: 'U'},
        scanned: false,
        number: 3,
    });

db.collection("commands").doc('2').set({
    weight: 15,
    dateOfCreation: new Date("2018-01-01T13:00:00"),
    state: 'waiting',
    numberOfUnscannedProducts: 2,
    preparator: null//{ firstname: 'dan', lastname: 'rab'},
});
    db.collection("commands").doc('2').collection('products').doc('4').set({
        productName: 'product D',
        position: { x: 5, y: 2, shelf: 'T', compartment: 'V'},
        scanned: false,
        number: 3,
    });
    db.collection("commands").doc('2').collection('products').doc('5').set({
        productName: 'product E',
        position: { x: 4, y: 3, shelf: 'D', compartment: 'H'},
        scanned: false,
        number: 2,
    });

db.collection("commands").doc('3').set({
    weight: 5,
    dateOfCreation: new Date("2018-01-01T14:00:00"),
    state: 'waiting',
    numberOfUnscannedProducts: 3,
    preparator: null//{ firstname: 'jon', lastname: 'doe'}
});
    db.collection("commands").doc('3').collection('products').doc('6').set({
        productName: 'product F',
        position: { x: 2, y: 2, shelf: 'F', compartment: 'E'},
        scanned: false,
        number: 1,
    });
    db.collection("commands").doc('3').collection('products').doc('7').set({
        productName: 'product G',
        position: { x: 6, y: 3, shelf: 'R', compartment: 'T'},
        scanned: false,
        number: 2,
    });
    db.collection("commands").doc('3').collection('products').doc('8').set({
        productName: 'product H',
        position: { x: 5, y: 1, shelf: 'H', compartment: 'Z'},
        scanned: false,
        number: 1,
    });

//-------------------- success / error functions -------------------------

function success () {
    console.log("doc successfully added")
}

function error (msg) {
    console.log(msg);
}