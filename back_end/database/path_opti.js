// there is  5*5 commands --> chemin le plus long : MAXPATH 
// each one have :
//  - a weight

// a group of commands have :
//  - a weight
//  - a distance

// maximaize the weight (<= treshold) && minimize the distance

// note of a group of command : weight / maxWeight * 1 + (MAXPATH - distance) / MAXPATH * 9

// def getRegroupementCommand([command1, command2, ..., commandN]) {
//     return list_of_product
// }

// enumerer toute les combinaissons de commandes existantes :
//     if weight(command_combinaison) <= maxWeight:
//         poids_note = (maxWeight - weight(command_combinaison)) / maxWeight
//         distance_note = (MAXPATH - distance(command_combinaison)) / MAXPATH
//         note = poids_note * poids_ponderation + distance_note * distance_ponderation

// getAllCommandIdCombinations()

// getListOfProduct(command_combinaison)

// weight(command_combinaison)

// distance(list_of_product)

commands = [
    {
        weight: 5,
        dateOfCreation: new Date("2018-01-01T12:00:00"),
        state: 'waiting',
        numberOfProducts: 3,
        numberOfUnscannedProducts: 3,
        preparator: null,
        position:{
            x: 1,
            y: 2
        }

    },
    {
        weight: 15,
        dateOfCreation: new Date("2018-01-01T13:00:00"),
        state: 'waiting',
        numberOfProducts: 3,
        numberOfUnscannedProducts: 3,
        preparator: null,
        position:{
            x: 5,
            y: 3
        }
    },
    {
        weight: 5,
        dateOfCreation: new Date("2018-01-01T14:00:00"),
        state: 'waiting',
        numberOfProducts: 3,
        numberOfUnscannedProducts: 3,
        preparator: null,
        position:{
            x: 2,
            y: 4
        }
    }
]

products2 = [
	{
		position: {
			x: 2,
			y: 2
		},
		position: {
			x: 4,
			y: 3
		}
	}
]

products = [
		{
			"commandId": "1",
			"commandProductId": "1",
			"productId": "1",
			"productName": "product A",
			"position": {
				"y": 2,
				"x": 1,
				"compartment": "B",
				"shelf": "A"
			}
		},
		{
			"commandId": "1",
			"commandProductId": "2",
			"productId": "2",
			"productName": "product B",
			"position": {
				"x": 2,
				"compartment": "Y",
				"shelf": "X",
				"y": 3
			}
		},
		{
			"commandId": "2",
			"commandProductId": "3",
			"productId": "6",
			"productName": "product F",
			"position": {
				"y": 2,
				"x": 2,
				"compartment": "E",
				"shelf": "F"
			}
		},
		{
			"commandId": "2",
			"commandProductId": "1",
			"productId": "3",
			"productName": "product C",
			"position": {
				"x": 3,
				"compartment": "U",
				"shelf": "R",
				"y": 1
			}
		},
		{
			"commandId": "2",
			"commandProductId": "2",
			"productId": "3",
			"productName": "product C",
			"position": {
				"y": 1,
				"x": 3,
				"compartment": "U",
				"shelf": "R"
			}
		},
		{
			"commandId": "4",
			"commandProductId": "2",
			"productId": "5",
			"productName": "product E",
			"position": {
				"y": 3,
				"x": 4,
				"compartment": "H",
				"shelf": "D"
			}
		},
		{
			"commandId": "4",
			"commandProductId": "3",
			"productId": "5",
			"productName": "product E",
			"position": {
				"y": 3,
				"x": 4,
				"compartment": "H",
				"shelf": "D"
			}
		},
		{
			"commandId": "4",
			"commandProductId": "1",
			"productId": "5",
			"productName": "product E",
			"position": {
				"y": 3,
				"x": 4,
				"compartment": "H",
				"shelf": "D"
			}
		},
		{
			"commandId": "3",
			"commandProductId": "1",
			"productId": "5",
			"productName": "product E",
			"position": {
				"y": 3,
				"x": 4,
				"compartment": "H",
				"shelf": "D"
			}
		},
		{
			"commandId": "3",
			"commandProductId": "3",
			"productId": "8",
			"productName": "product H",
			"position": {
				"y": 1,
				"x": 5,
				"compartment": "Z",
				"shelf": "H"
			}
		},
		{
			"commandId": "1",
			"commandProductId": "3",
			"productId": "4",
			"productName": "product D",
			"position": {
				"y": 2,
				"x": 5,
				"compartment": "V",
				"shelf": "T"
			}
		},
		{
			"commandId": "3",
			"commandProductId": "2",
			"productId": "7",
			"productName": "product G",
			"position": {
				"x": 6,
				"compartment": "T",
				"shelf": "R",
				"y": 3
			}
		}
	]

function getAllCombinationOf(array) {
    var combinations = []       
    for (let i = 1; i <= array.length; i++){
        console.log(i)
        combinations.push( ...k_combinations(array, i))
    }
    return combinations
}

function getWeight(commandCombination) {
    var weight = 0;
    commandCombination.forEach( command => {
        weight += command.weight;
    })
    return weight;
}

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

getAllCombinationOf(commands).forEach( command => {
    console.log('-------------')
    console.log(command)
    console.log('weight ' + getWeight(command))
})

console.log(getDistance(commands[0], commands[1]))

console.log(getDistanceOfProductList(products2))

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