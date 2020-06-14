class NameGenerator {

    constructor(prefix) {
        this.serialNumber = 1;
        this.prefix = typeof prefix === 'string' ? prefix : 'Name';
    }

    setPrefix(prefix) {
        this.prefix = prefix;
    }

    genName() {
        const {
            serialNumber,
            prefix,
        } = this;
        const newName = `${prefix}${serialNumber}`;
        this.serialNumber++;
        return newName;
    }

}

export default NameGenerator;
