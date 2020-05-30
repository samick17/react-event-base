class NameGenerator {

    constructor(prefix) {
        this.serialNumber = 0;
        this.prefix = typeof prefix === 'string' ? prefix : 'Name';
    }

    setPrefix(prefix) {
        this.prefix = prefix;
    }

    genId() {
        const {
            serialNumber,
            prefix,
        } = this;
        this.serialNumber++;
        return `${prefix}${serialNumber}`;
    }

}

export default NameGenerator;
