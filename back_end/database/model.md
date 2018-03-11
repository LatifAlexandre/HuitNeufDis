model of the bdd
================

## ++preparators

### preparator
- firstname
- lastname
- maxSupportedWeight

## ++products
 
### product
- productName
- stock <-- trigger (if < 5 then endOfStock true from 'system')
- enOfStockMoreInfos : null or
    - date
    - by : name of the prepartor / 'system'
- position
    - x : 1, 2, 3
    - y : 1, 2, 3
    - shelf :
    - compartments: 

## ++commands

### command

- weight
- dateOfCreation
- state : 'waiting' | 'in_progress' | 'finished' <-- trigger when a product become scanned
- numberOfUnscannedProducts
++ products []
    - id
        - productName
        - position
        - scanned
        - number
- preparator :
    - firstname
    - lastname

----------------------------------------------------

### commandPrepGroup
    ++products <-- listed by position
        - id
        - productName
        - position