class PieceRandomizer {
    constructor() {
        this.currentBag = []
        this.generateBag();
    }
    generateBag() {
        this.currentBag = shuffle(["I","J","L","O","S","T","Z"])
    }
    pick() {
        if (this.currentBag.length === 0) {
            this.generateBag();
        }
        return this.currentBag.shift();
    }
}