API documentation
=================

###  get a preparator
by giving its id

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getPreparator?id=..
```

#### example : 
```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getPreparator?id=1
```

### get a group of command according to a preparator's criterion

take as get inputs the preparators name and the max weight he can supports

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=..&firstname=..&lastname=..
```

#### example :

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=15&firstname=jon&lastname=doe
```

### when a preparator scan a product command
you need to specify the product id and its related command id

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=..&commandId=..
```

#### example :
```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?productId=1&commandId=1
```

### end of stock alert from a preparator

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=..&firstname=..&lastname=..
```

#### example :
```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=2&firstname=jon&lastname=doe
```