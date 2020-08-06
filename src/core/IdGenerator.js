class IdGenerator {

    constructor(prefix) {
        this.serialNumber = 0;
        this.prefix = typeof prefix === 'string' ? prefix : 'o';
    }

    setIdPrefix(prefix) {
        this.prefix = prefix;
    }

    genId() {
        let newId = this.serialNumber;
        this.serialNumber++;
        return this.prefix + newId.toString(16);
    }

    reset() {
        this.serialNumber = 0;
    }

}

export default IdGenerator;
