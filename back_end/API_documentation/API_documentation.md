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

### get a group of command according to a preparator's criterion - UPDATE

take as get inputs the preparator name and the max weight he can supports

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=..&firstname=..&lastname=..
```

#### example :

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=15&firstname=jon&lastname=doe
```

### when a preparator scan a product command - UPDATE

you need to specify :
    - the commad id :  `commandId`
    - the product id **IN** the command : `commandProductId`
    - the generic product id :  `productId`

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?commandId=..&commandProductId=..&productId=..
```

#### example :
```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?commandId=2&commandProductId=1&productId=3
```

### end of stock alert from a preparator

```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=..&firstname=..&lastname=..
```

#### example :
```
https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=2&firstname=jon&lastname=doe
```