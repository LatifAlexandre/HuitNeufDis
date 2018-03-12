export default class User {
    id;
    firstname;
    lastname;
    maxSupportedWeight;
    constructor(id, firstname, lastname, maxSupportedWeight) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.maxSupportedWeight = maxSupportedWeight;
    }
  }