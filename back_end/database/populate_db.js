
function populate_db(idName) {
    document.getElementById(idName).innerHTML;
    // ------------------------------------------------------------------------
    // ------------------------------ add datas -------------------------------
    // ------------------------------------------------------------------------

    // ------------------------------- add preparators ------------------------

    db.collection("preparators").doc('1').set({firstname: 'George', lastname: 'Bush', maxSupportedWeight: 30})
    db.collection("preparators").doc('2').set({firstname: 'Dan', lastname: 'Rab', maxSupportedWeight: 20})
    db.collection("preparators").doc('3').set({firstname: 'Jon', lastname: 'Doe', maxSupportedWeight: 20})

    document.getElementById(idName).innerHTML +='<p> création des préparateurs </p>'
    // ------------------------------- add products ----------------------------

    db.collection("products").doc('1').set({
        productName: 'product A',
        stock: 6,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 1, y: 2, shelf: 'A', compartment: 'B'}
    });
    db.collection("products").doc('2').set({
        productName: 'product B',
        stock: 12,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 2, y: 3, shelf: 'X', compartment: 'Y'}
    });
    db.collection("products").doc('3').set({
        productName: 'product C',
        stock: 9,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 3, y: 1, shelf: 'R', compartment: 'U'}
    });
    db.collection("products").doc('4').set({
        productName: 'product D',
        stock: 27,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 5, y: 2, shelf: 'T', compartment: 'V'}
    });
    db.collection("products").doc('5').set({
        productName: 'product E',
        stock: 7,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 4, y: 3, shelf: 'D', compartment: 'H'}
    });
    db.collection("products").doc('6').set({
        productName: 'product F',
        stock: 27,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 2, y: 2, shelf: 'F', compartment: 'E'}
    });
    db.collection("products").doc('7').set({
        productName: 'product G',
        stock: 14,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 6, y: 3, shelf: 'R', compartment: 'T'}
    });
    db.collection("products").doc('8').set({
        productName: 'product H',
        stock: 12,
        endOfStockInfo: null,
        endOfStock: false,
        position: { x: 5, y: 1, shelf: 'H', compartment: 'Z'}
    });

    document.getElementById(idName).innerHTML +='<p> création des produits </p>'

    // ------------------------------ add commands --------------------------------

    db.collection("commands").doc('1').set({
        weight: 5,
        dateOfCreation: new Date("2018-01-01T12:00:00"),
        state: 'waiting',
        numberOfProducts: 3,
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

        db.collection("commands").doc('1').collection('products').doc('4').set({
            productName: 'product D',
            position: { x: 5, y: 2, shelf: 'T', compartment: 'V'},
            scanned: false,
            number: 3,
        });

    db.collection("commands").doc('2').set({
        weight: 15,
        dateOfCreation: new Date("2018-01-01T13:00:00"),
        state: 'waiting',
        numberOfProducts: 2,
        numberOfUnscannedProducts: 2,
        preparator: null//{ firstname: 'dan', lastname: 'rab'},
    });
        db.collection("commands").doc('2').collection('products').doc('3').set({
            productName: 'product C',
            position: { x: 3, y: 1, shelf: 'R', compartment: 'U'},
            scanned: false,
            number: 3,
        });
        db.collection("commands").doc('2').collection('products').doc('6').set({
            productName: 'product F',
            position: { x: 2, y: 2, shelf: 'F', compartment: 'E'},
            scanned: false,
            number: 1,
        });


    db.collection("commands").doc('3').set({
        weight: 5,
        dateOfCreation: new Date("2018-01-01T14:00:00"),
        state: 'waiting',
        numberOfProducts: 3,
        numberOfUnscannedProducts: 3,
        preparator: null//{ firstname: 'jon', lastname: 'doe'}
    });
        db.collection("commands").doc('3').collection('products').doc('5').set({
            productName: 'product E',
            position: { x: 4, y: 3, shelf: 'D', compartment: 'H'},
            scanned: false,
            number: 2,
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

        document.getElementById(idName).innerHTML +='<p> création des commandes </p>'
}

//-------------------- success / error functions -------------------------

function success () {
    console.log("doc successfully added")
}

function error (msg) {
    console.log(msg);
}