// there is  5*5 commands --> chemin le plus long : MAXPATH 
// each one have :
//  - a weight

// a group of commands have :
//  - a weight
//  - a distance

// maximaize the weight (<= treshold) && minimize the distance

// note of a group of command : (maxWeight - weight) / maxWeight * 1 + (MAXPATH - distance) / MAXPATH * 9

def getRegroupementCommand([command1, command2, ..., commandN]) {
    return list_of_product
}

enumerer toute les combinaissons de commandes existantes :
    - pour chaque combinaison : list_of_product

    if weight(list_of_product) <= maxWeight:
        poids_note = (maxWeight - weight(list_of_product)) / maxWeight
        distance_note = (MAXPATH - distance(list_of_product)) / MAXPATH
        
pour tout les regroupements de commands qui ont un poids inferieur au seuil :
    - calculer la note distance
    - calculer la node poids
    - calculer la note du regroupement et la stocker

renvoyer le regroupement avec la meilleur note