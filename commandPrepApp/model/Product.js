export default class Product {
    id;
    name;
    position;
    key;
    commandId;
    commandProductId;
    constructor(id, name, position, key, commandId, commandProductId) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.key = key;
        this.commandId = commandId;
        this.commandProductId = commandProductId;
    }
  }