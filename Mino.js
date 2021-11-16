class Mino{
    constructor(occupied = false, color = undefined) {
        this.occupied = occupied;
        this.color = color;
    }
    set(color) {
        this.occupied = true;
        this.color = color;
    }
    deactivate() {
        this.occupied = false;
        this.color = undefined;
    }
}