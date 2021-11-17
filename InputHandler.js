class InputHandler {
    constructor() {
        this.heldKeys = {};
        this.pressedKeys = {};
    }
    getHeldKey(key) {
        return !!this.heldKeys[key];
    }
    getPressedKey(key) {
        let ret = this.pressedKeys[key];
        this.pressedKeys[key] = false;
        return !!ret;
    }
    newKeyDown(key) {
        let isRepeating = !!this.heldKeys[key]; // fancy trick that converts it to bool, and is true if it exists
        this.heldKeys[key] = true;
        if (!isRepeating) {
            this.pressedKeys[key] = true;
        }
    }
    newKeyUp(key) {
        this.heldKeys[key] = false;
    }
}