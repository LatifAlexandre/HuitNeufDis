// query test
/*
db.collection("products").doc('1').get()
    .then( function(doc) {
        console.log(doc.data())
    })
*/
/*
db.collection("products").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
});
*/
/*
db.collection("commands").where("state", "==", "waiting").orderBy("dateOfCreation", "asc").get()
    .then( function(querySnapshot) {
        querySnapshot.forEach( function (doc) {
            console.log(doc.data())
        })
    })*/

    /*
var commandPrepGroup = [
    {
        "id": "1",
        "productName": "product D",
        "position": {
            "y": 2,
            "x": 5,
            "compartment": "V",
            "shelf": "T"
        }
    },
    {
        "id": "2",
        "productName": "product E",
        "position": {
            "y": 3,
            "x": 4,
            "compartment": "H",
            "shelf": "D"
        }
    },
    {
        "id": "1",
        "productName": "product A",
        "position": {
            "y": 2,
            "x": 1,
            "compartment": "B",
            "shelf": "A"
        }
    },
    {
        "id": "2",
        "productName": "product B",
        "position": {
            "y": 3,
            "x": 2,
            "compartment": "Y",
            "shelf": "X"
        }
    },
    {
        "id": "3",
        "productName": "product C",
        "position": {
            "y": 1,
            "x": 3,
            "compartment": "U",
            "shelf": "R"
        }
    },
    {
        "id": "1",
        "productName": "product F",
        "position": {
            "y": 2,
            "x": 2,
            "compartment": "E",
            "shelf": "F"
        }
    },
    {
        "id": "2",
        "productName": "product G",
        "position": {
            "y": 3,
            "x": 6,
            "compartment": "T",
            "shelf": "R"
        }
    },
    {
        "id": "3",
        "productName": "product H",
        "position": {
            "y": 1,
            "x": 5,
            "compartment": "Z",
            "shelf": "H"
        }
    }
]

console.log("not sorted", commandPrepGroup)
setTimeout( () => {
    console.log("sorted", orderProductList(commandPrepGroup))
}, 2000)

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
*/
/*
db.collection("commands").doc('1').collection('products')
.where('scanned', '==', false).get()
.then( function(querySnapshot) {
    console.log(querySnapshot.size)
   if (querySnapshot.size == 0) {
        console.log("ok")
   }
})
*/

//https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup

db.collection('commands').doc('1').get().then(doc => {
    db.collection('commands').doc('1').update({
        numberOfUnscannedProducts: doc.data().numberOfUnscannedProducts - 1
    })
})

db.collection('products').doc('2').get().then(doc => {
    db.collection('products').doc('2').update({
        stock: doc.data().stock -1
    })
})