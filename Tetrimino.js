class Tetrimino {
    constructor(x, y, type, rotation_state = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.rs = rotation_state;
        this.color = tData[this.type].color;
        this.data = tData[this.type].rotationStates[this.rs];
    }
    setRotation(state) {
        this.rs = state
        this.data = tData[this.type].rotationStates[this.rs];
    }
    rotate(clockwise = true) {
        if (clockwise) {
            this.rs = (this.rs + 1) % 4
            this.data = tData[this.type].rotationStates[this.rs];
        } else {
            this.rs = (this.rs - 1) % 4
            this.data = tData[this.type].rotationStates[this.rs];
        }
    }

}