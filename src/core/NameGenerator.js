class NameGenerator {

    constructor(prefix) {
        this.serialNumber = 1;
        this.prefix = typeof prefix === 'string' ? prefix : 'n';
    }

    setPrefix(prefix) {
        this.prefix = prefix;
    }

    genName() {
        const {
            serialNumber,
            prefix,
        } = this;
        const newName = `${prefix}${serialNumber.toString(16)}`;
        this.serialNumber++;
        return newName;
    }

    reset() {
        this.serialNumber = 1;
    }

}

export default NameGenerator;
