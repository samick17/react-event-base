class IdGenerator {

    constructor(prefix) {
        this.serialNumber = 1;
        this.prefix = typeof prefix === 'string' ? prefix : 'o';
    }

    setIdPrefix(prefix) {
        this.prefix = prefix;
    }

    genId() {
        const {
            serialNumber,
            prefix,
        } = this;
        const newId = `${prefix}${serialNumber.toString(16)}`;
        this.serialNumber++;
        return newId;
    }

    reset() {
        this.serialNumber = 1;
    }

}

export default IdGenerator;
