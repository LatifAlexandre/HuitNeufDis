/*
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

db.collection('preparators').doc('0').get()
    .then(doc => {
        console.log('THEN')
        console.log(doc.data())
    })
    .catch (error => {
        console.log('catch ' + error)
    })
*/

// The hangar has a dimension of 6 * 5 -> the longest path inside is 5*6 + 6-1 = 35
function getCommandPrepGroup(maxWeight) {

    //get all the combinations of commands
    db.collection("commands").where('state', '==', 'waiting').orderBy('dateOfCreation', 'asc').get()
        .then(function(querySnapshot) {
            var commands = []
            querySnapshot.forEach( commandDoc => {
                var command = commandDoc.data()
                var commandId = commandDoc.id;
                commands.push({...command, commandId: commandId});
                // we get the products of each command and bind them to the command
                db.collection("commands").doc(commandId).collection("products").get()
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
                
                productListNoted = [];
                getAllCombinationOf(commands).forEach( combination => {
                    // if too heavy --> next
                    if (getWeight(combination) < maxWeight) {
                         // calculation of the weight note between 0 and 1
                        // heavy -> close to 1
                        var weight_note = getWeight(combination) / maxWeight;
                        
                        // we take all the product of the combination of commands
                        var products = []
                        combination.forEach( command => {
                            products = [...products, ...command.products]
                        })
                        // we sort it by order in the hangar
                        products = orderProductList(products)
                        
                        // we calculate the distance of this order of product
                        var distance = getDistanceOfProductList(products);
                        
                        var max_distance = 35 // this is the maximum distance inside the hangar, used has bound here
                        distance_note = (max_distance - getDistanceOfProductList(products)) / max_distance
                        
                        final_note = weight_note * 8 + distance_note * 2;

                        productListNoted.push({
                            products: products,
                            note: final_note,
                            weight: getWeight(combination),
                            dsitance: distance
                        })
                        
                    }
                    else {
                        console.log('--> weight ' + getWeight(combination) + ' --> too heavy')
                    }
                   
                })

                productListNoted = productListNoted.sort( (a,b) => {
                    if (a.note > b.note) return -1;
                    if (b.note > a.note) return 1;
                    return 0;
                })
                console.log(productListNoted)

                return(productListNoted[0])

            }, 1000)

            

        })
}

getCommandPrepGroup(10);

// ---- fucntion -----------

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


// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

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