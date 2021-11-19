class Matrix {
    constructor(rows = 24, columns = 10) {

        this.rows = rows;
        this.columns = columns;

        this.spawnX = 3;
        this.spawnY = 3;

        this.framesBetweenUpdates = 40;
        this.softdropping = false;
        this.frameCounter = this.framesBetweenUpdates;

        this.inputQueue = [];
        this.DAS = 3;
        this.DASTimer = 0;
        this.DASDelay = 8;
        this.DASDelayTimer = 0;

        this.lastInput;

        this.lockDelay = 60
        this.lockTimer = this.lockDelay;
        this.stuck = false;

        this.rnd = new PieceRandomizer();
        this.currentTetrimino = new Tetrimino(this.spawnX, this.spawnY, this.rnd.pick(), 0);
        this.dropPosition;
        this.heldTetrimino;
        this.holdAllowable = true;

        this.linesCleared = 0;

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
            tData[this.currentTetrimino.type].rotationStates[mod(this.currentTetrimino.rs + rot , 4)],
            this.currentTetrimino.x + relX,
            this.currentTetrimino.y + relY
        )
    }
    moveRelative(relX, relY, isClockwise) {
        this.currentTetrimino.rotate(isClockwise)
        this.currentTetrimino.x = this.currentTetrimino.x + relX;
        this.currentTetrimino.y = this.currentTetrimino.y + relY;
        console.log(this.currentTetrimino)
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
        this.getDropPosition();
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
    getDropPosition() {
        this.removeTetrimino();
        for (let i = 0; i < this.data.length; i++) {
            //console.log("checked")
            if (!this.checkRelativePos(0, i, 0)) {
                this.pushTetrimino();
                this.dropPosition = { x: this.currentTetrimino.x, y: this.currentTetrimino.y + i }
                return;
            }
        }
        this.dropPosition = undefined;
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
    rotateTetrimino(isClockwise = true) {
        if (isClockwise ? this.checkRelativePos(0, 0, 1) : this.checkRelativePos(0, 0, -1)) {
            this.currentTetrimino.rotate(isClockwise)
        } else {
            for (let i = 0; i < 4; i++) {
                console.log("test attempt: " + (i + 1))
                let wk = getWallKick(
                    this.currentTetrimino.type,
                    this.currentTetrimino.rs,
                    mod(this.currentTetrimino.rs + (isClockwise ? 1 : -1), 4),
                    i
                )
                if (this.checkRelativePos(wk.x, -wk.y, isClockwise ? 1 : -1)) {
                    this.moveRelative(wk.x, -wk.y, isClockwise);
                    break;
                }
            }
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
            this.rotateTetrimino(false);
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
            this.frameCounter = this.softdropping ? this.DAS : this.framesBetweenUpdates; // makes the game update faster if you are holding down (scuffed?)
            // Piece Update Code -----------------------
            this.removeTetrimino(); // deletes the minos represeneting the currentTetrimino from the previous frame
            this.moveTetriminoDown();
            this.pushTetrimino(); // insert the updated tetrimino
            // -----------------------------------------
        } else {
            this.frameCounter--;
        }
        this.getDropPosition();
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
        this.linesCleared += linesCleared;
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
        this.linesCleared = 0;
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
            let heldText = "Current Held Piece: ";
            let heldTextWidth = heldText.length * fontSize * 0.465;
            drawTetriminoOutline(this.heldTetrimino.data, (w / 2) + heldTextWidth / 2, h * 0.9, gridSize * 0.5, gridSize, ctx)
            ctx.fillText(heldText, (w / 2) - heldTextWidth / 2, h * 0.92);
        }


        fontSize = 40
        ctx.font = fontSize + "px system-ui"
        let linesClearedText = "Lines Cleared: " + this.linesCleared;
        let linesClearedTextWidth = linesClearedText.length * fontSize * 0.465;
        ctx.fillText(linesClearedText, (w / 2) - linesClearedTextWidth / 2, h * 0.97);

        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.fillStyle = "rgb(20, 20, 20)"
        strokeRoundedRect(x, y, boardWidth, boardHeight, 80, ctx)

        ctx.fillStyle = "rgb(20, 20, 20)"
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(x, y, boardWidth, boardHeight);
        ctx.fill();
        ctx.stroke();

        if (this.dropPosition) {
            //if (!(this.dropPosition.x == this.currentTetrimino.x && this.dropPosition.y == this.currentTetrimino.y)) {
            drawTetriminoOutline(
                this.currentTetrimino.data,
                x + this.dropPosition.x * gridSize,
                y + (this.dropPosition.y - hiddenRowCount - 1) * gridSize,
                gridSize,
                gridSize / 2,
                ctx)
            //}
        }

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