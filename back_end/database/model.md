model of the bdd
================

## ++preparators

### preparator
- firstname
- lastname
- maxSupportedWeight

## ++products
 
### product
- weight
- productName
- stock <-- trigger (if < 5 then endOfStock true from 'system')
- endOfStock : boolean
- enOfStockMoreInfos
    - date
    - by : name of the prepartor / 'system'
- position
    - x : 1, 2, 3
    - y : 1, 2, 3
    - armoire :
    - casier: 

## ++commands

### command

- weight
- dateOfCreation
- state : 'waiting' | 'in progress' | 'finished'
- products []
    - id
    - productName
    - position
    - scanned
    - number
- preparator :
    - firstname
    - lastname

## ++commandPrepGroups

### commandPrepGroup
    - products [] <-- listed by position
        - id
        - productName
        - position