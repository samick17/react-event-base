class IdGenerator {

    serialNumber = 0
    idPrefix = 'o'

    setIdPrefix(idPrefix) {
        this.idPrefix = idPrefix;
    }

    genId() {
        let newId = this.serialNumber;
        this.serialNumber++;
        return this.idPrefix + newId.toString(16);
    }

}

export default IdGenerator;
