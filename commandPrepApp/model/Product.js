export default class Product {
    id;
    name;
    position;
    key;
    commandId;
    constructor(id, name, position, key, commandId) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.key = key;
        this.commandId = commandId;
    }
  }