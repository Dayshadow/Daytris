class Matrix {
    constructor(rows = 24, columns = 10) {

        this.rows = rows;
        this.columns = columns;

        this.spawnX = 3;
        this.spawnY = 3;

        this.framesBetweenUpdates = 30;
        this.softdropping = false;
        this.frameCounter = this.framesBetweenUpdates;

        this.inputQueue = [];
        this.DAS = 5;
        this.DASTimer = 0;
        this.DASDelay = 10;
        this.DASDelayTimer = 0;

        this.lastInput;

        this.lockDelay = 60
        this.lockTimer = this.lockDelay;
        this.stuck = false;

        this.rnd = new PieceRandomizer();
        this.currentTetrimino = new Tetrimino(this.spawnX, this.spawnY, this.rnd.pick(), 0);
        this.heldTetrimino;
        this.holdAllowable = true;


        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data.push([]);
            for (let j = 0; j < columns; j++) {
                this.data[i].push(new Mino());
            }
        }

    }
    pushTetrimino() { // this is actually mostly unnecesary, an artifact of the horrible way the code used to work
        let pushRes = pasteTetrimino(this.data, this.currentTetrimino);
        if (pushRes) {
            this.data = pushRes;
        } else {
            return null;
        }
    }
    removeTetrimino() {
        this.data = pasteTetrimino(this.data, this.currentTetrimino, true); // removes the existing tetrimino
    }
    checkRelativePos(relX, relY, rot) {
        return checkTetriminoPos(
            this.data,
            tData[this.currentTetrimino.type].rotationStates[(this.currentTetrimino.rs + rot) % 4],
            this.currentTetrimino.x + relX,
            this.currentTetrimino.y + relY
        )
    }

    respawnTetrimino() {
        let newX = 3;
        let newType = this.rnd.pick();
        let newRot = 0;
        if (checkTetriminoPos(this.data, tData[newType].rotationStates[newRot], newX, 3)) {
            this.currentTetrimino = new Tetrimino(newX, 3, newType, newRot);
            return true;
        }
        return false;
    }
    hold() {
        if (this.holdAllowable) {
            this.holdAllowable = false;
            if (this.heldTetrimino) {
                let tmp = this.currentTetrimino;
                this.currentTetrimino = this.heldTetrimino;
                this.heldTetrimino = tmp;
                this.heldTetrimino.x = this.spawnX;
                this.heldTetrimino.y = this.spawnY;
                this.heldTetrimino.setRotation(0);
            } else {
                this.heldTetrimino = this.currentTetrimino;
                this.heldTetrimino.x = this.spawnX;
                this.heldTetrimino.y = this.spawnY;
                this.heldTetrimino.setRotation(0);
                this.respawnTetrimino();
            }
        }
    }
    lockPiece() {
        this.currentTetrimino = new Tetrimino(this.currentTetrimino.x, this.currentTetrimino.y, this.currentTetrimino.type, this.currentTetrimino.rs);
        pasteTetrimino(this.data, this.currentTetrimino);
        if (!this.respawnTetrimino()) {
            this.regenerate();
        }
        this.checkLineClears();
        this.holdAllowable = true;
    }
    processStuck() {
        this.removeTetrimino()
        if (this.checkRelativePos(0, 1, 0)) {
            this.stuck = false; // making sure
            this.pushTetrimino();
            this.resetLockTimer();
            return;
        }
        this.pushTetrimino();

        if (this.stuck) {
            this.softdropping ? this.lockTimer -= 10 : this.lockTimer--;
            if (this.lockTimer <= 0) {
                this.lockPiece();
                this.stuck = false;
                this.resetLockTimer();
            }
        }
    }
    moveTetriminoDown() {
        if (this.checkRelativePos(0, 1, 0)) {
            this.currentTetrimino.y++; // if the spot below is avalible, move down one
            this.stuck = false;
            return true;
        } else {
            this.stuck = true;
            return false;
        }
    }
    hardDrop() {
        while (this.moveTetriminoDown()) { }
        this.lockPiece();
        this.resetLockTimer();
    }
    setSoftdrop(bool) {
        // this is scuffed but it makes it so that 
        // whenever this.softdropping goes from false to true, it sets the frame counter to zero
        if (bool) {
            if (!this.softdropping) {
                this.frameCounter = 0;
            }
            this.softdropping = true;
        } else {
            this.softdropping = false;
        }
    }
    moveTetriminoSideways(relX) {
        if (this.checkRelativePos(relX, 0, 0)) {
            this.currentTetrimino.x += relX;
            return true;
        }
        return false;
    }
    rotateTetrimino(clockwise = true) {
        if (clockwise && this.checkRelativePos(0, 0, 1)) {
            this.currentTetrimino.rotate()
        }
        if (!clockwise && this.checkRelativePos(0, 0, 1)) {
            this.currentTetrimino.rotate(-1);
        }
    }
    processInputs() {
        this.setSoftdrop(inp.getHeldKey("ArrowDown"));
        this.removeTetrimino();


        // code that moves the pieces once instantly
        if (inp.getPressedKey('ArrowLeft')) {
            if (this.lastInput == "ArrowRight") this.resetDASDelay();
            this.lastInput = 'ArrowLeft';
            this.moveTetriminoSideways(-1);
        } else

            if (inp.getPressedKey('ArrowRight')) {
                if (this.lastInput == "ArrowLeft") this.resetDASDelay();
                this.lastInput = 'ArrowRight';
                this.moveTetriminoSideways(1);
            }

        // code for if you continue to hold the arrow key 
        //makes it so it waits a bit before continuing
        if (inp.getHeldKey("ArrowLeft")) {
            if (this.lastInput == "ArrowRight") this.resetDASDelay();
            if (this.DASDelayTimer > 0) { // these timers are getting confusing
                this.DASDelayTimer--;
            } else if (this.DASTimer <= 0) {
                this.moveTetriminoSideways(-1);
                this.resetDASTimer();
            }
            this.lastInput = 'ArrowLeft';
        } else if (inp.getHeldKey('ArrowRight')) {
            if (this.lastInput == "ArrowLeft") this.resetDASDelay();
            if (this.DASDelayTimer > 0) {
                this.DASDelayTimer--;
            } else if (this.DASTimer <= 0) {
                this.moveTetriminoSideways(1);
                this.resetDASTimer();
            }
            this.lastInput = 'ArrowRight';
        }
        if ((!inp.getHeldKey('ArrowRight') && !inp.getHeldKey('ArrowLeft')) || (inp.getHeldKey('ArrowRight') && inp.getHeldKey('ArrowLeft'))) {
            this.resetDASDelay();
        }

        if (inp.getPressedKey("ArrowUp")) {
            this.rotateTetrimino();
        }
        if (inp.getPressedKey("KeyZ")) {
            this.rotateTetrimino(-1);
        }
        if (inp.getPressedKey("Space")) {
            this.hardDrop();
        }
        if (inp.getPressedKey("KeyC")) {
            this.hold();
        }
        if (inp.getPressedKey("Equal")) {
            this.DAS--;
            this.DAS = this.DAS.clamp(1, 40)
        }
        if (inp.getPressedKey("Minus")) {
            this.DAS++;
            this.DAS = this.DAS.clamp(1, 40)
        }
        if (inp.getPressedKey("KeyO")) {
            this.DASDelay--;
            this.DASDelay = this.DASDelay.clamp(0, 200)
        }
        if (inp.getPressedKey("KeyP")) {
            this.DASDelay++;
            this.DASDelay = this.DASDelay.clamp(0, 200)
        }
        this.pushTetrimino();
    }
    update() {
        if (this.DASTimer > 0) this.DASTimer--;

        this.processInputs();
        if (this.frameCounter <= 0) {
            this.frameCounter = this.softdropping ? this.DAS : this.framesBetweenUpdates;
            // Piece Update Code -----------------------
            this.removeTetrimino(); // deletes the minos represeneting the currentTetrimino from the previous frame
            this.moveTetriminoDown();
            this.pushTetrimino(); // insert the updated tetrimino
            // -----------------------------------------
        } else {
            this.frameCounter--;
        }
        this.processStuck();

    }
    resetLockTimer() {
        this.lockTimer = this.lockDelay;
    }
    resetDASTimer() {
        this.DASTimer = this.DAS
    }
    resetDASDelay() {
        this.DASDelayTimer = this.DASDelay;
    }
    checkLineClears() {
        let linesCleared = 0;
        for (let i = 0; i < this.data.length; i++) {
            let isFilled = this.data[i].reduce((a, b) => { return a && b.occupied }, true);
            if (isFilled) {
                shiftLinesDown(this.data, i);
                linesCleared++;
            }
        }
        console.log(linesCleared);
    }
    clearLine(index) {
        this.removeTetrimino();
        shiftLinesDown(this.data, index);
        this.pushTetrimino();
    }

    regenerate() { // clears the Matrix
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data.push([]);
            for (let j = 0; j < this.columns; j++) {
                this.data[i].push(new Mino());
            }
        }
        this.heldTetrimino = undefined;
    }

    draw(x, y, gridSize, frame, ctx, hiddenRowCount = 4) {

        let numDrawRows = this.rows - hiddenRowCount;
        let boardWidth = this.columns * gridSize;
        let boardHeight = numDrawRows * gridSize;

        ctx.fillStyle = rgb(
            Math.floor(Math.sin(frame / 120 + 12.3) * 128) + 128,
            Math.floor(Math.cos(frame / 100) * 128) + 128,
            Math.floor(Math.sin(frame / 130 + 22.424) * 128) + 128
        );
        let fontSize = 20
        ctx.font = fontSize + "px system-ui"
        let titleText = "Welcome to my questionably coded tetris clone"
        let titleWidth = titleText.length * fontSize * 0.465;
        ctx.fillText(titleText, (w / 2) - titleWidth / 2, 50);

        fontSize = 15
        ctx.font = fontSize + "px system-ui";
        ctx.fillText("Controls are:", 20, 100);
        ctx.fillText("Left + Right arrow keys to move", 20, 100 + 2 * fontSize);
        ctx.fillText("Z to spin counter clockwise", 20, 100 + 3 * fontSize);
        ctx.fillText("Hold down arrow to fall faster", 20, 100 + 4 * fontSize);
        ctx.fillText("Space to drop instantly", 20, 100 + 5 * fontSize);
        ctx.fillText("C to hold a piece for later", 20, 100 + 6 * fontSize);
        ctx.fillText("Minus key decreases the Delayed Auto Shift speed", 20, 100 + 8 * fontSize);
        ctx.fillText("Plus key increases the Delayed Auto Shift speed", 20, 100 + 9 * fontSize);
        ctx.fillText("Current frame count per DAS movement: " + this.DAS, 30, 100 + 10 * fontSize);
        ctx.fillText("O decreases the Delayed Auto Shift delay", 20, 100 + 12 * fontSize);
        ctx.fillText("P  increases the Delayed Auto Shift delay", 20, 100 + 13 * fontSize);
        ctx.fillText("Amount of frames required to hold before auto shift: " + this.DASDelay, 30, 100 + 14 * fontSize);


        if (this.heldTetrimino) {
            fontSize = 30
            ctx.font = fontSize + "px system-ui"
            let heldText = "Current Held Piece: " + this.heldTetrimino.type;
            let heldTextWidth = heldText.length * fontSize * 0.465;
            ctx.fillText(heldText, (w / 2) - heldTextWidth / 2, h * 0.95);
        }



        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.fillStyle = "rgb(20, 20, 20)"
        ctx.lineCap = "round";
        ctx.lineWidth = 80;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + boardWidth, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + boardWidth, y);
        ctx.lineTo(x + boardWidth, y + boardHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + boardWidth, y + boardHeight);
        ctx.lineTo(x, y + boardHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y + boardHeight);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.lineCap = "butt";
        ctx.fillStyle = "rgb(20, 20, 20)"
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(x, y, boardWidth, boardHeight);
        ctx.fill();
        ctx.stroke();

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j].occupied) {
                    if (i - hiddenRowCount >= 0) {
                        ctx.fillStyle = this.data[i][j].color;
                        ctx.fillRect(x + j * gridSize, y + (i - hiddenRowCount) * gridSize, gridSize, gridSize);
                    }
                }
            }
        }
        for (let i = 0; i < this.columns; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * gridSize, y);
            ctx.lineTo(x + i * gridSize, y + numDrawRows * gridSize);
            ctx.stroke();
        }
        for (let i = 0; i < numDrawRows; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + i * gridSize);
            ctx.lineTo(x + this.columns * gridSize, y + i * gridSize);
            ctx.stroke();
        }
    }
}