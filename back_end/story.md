# the preparator Jon Doe (id 3), ask a bunch of products (max weight is 30 kg)

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=20&firstname=jon&lastname=doe

# he scan the products of one after the other

## command 1

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=1&commandId=1

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=4&commandId=2

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=2&commandId=1

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=3&commandId=1



# and signal an end of stock for the product 5

https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=5&firstname=Jon&lastname=Doe