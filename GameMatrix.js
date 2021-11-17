class Matrix {
    constructor(rows = 24, columns = 10) {

        this.rows = rows;
        this.columns = columns;

        this.framesBetweenUpdates = 10;
        this.softdropping = false;
        this.frameCounter = this.framesBetweenUpdates;

        this.inputQueue = [];
        this.DAS = 5;
        this.DASTimer = 0;

        this.lockDelay = 60
        this.lockTimer = this.lockDelay;
        this.stuck = false;

        this.rnd = new PieceRandomizer();
        this.currentTetrimino = new Tetrimino(3, 0, this.rnd.pick(), 0);

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

    processStuck() {
        // -------------------example code mostly for testing-------------------------------
        if (this.stuck) {
            if (this.lockTimer <= 0 /*&& !this.checkRelativePos(0, 1, 0)*/) {
                this.currentTetrimino = new Tetrimino(this.currentTetrimino.x, this.currentTetrimino.y, this.currentTetrimino.type, this.currentTetrimino.rs);
                pasteTetrimino(this.data, this.currentTetrimino);
                let newX = 3;
                let newType = this.rnd.pick();
                let newRot = 0;
                if (checkTetriminoPos(this.data, tData[newType].rotationStates[newRot], newX, 3)) {
                    this.currentTetrimino = new Tetrimino(newX, 3, newType, newRot);
                } else {
                    this.regenerate();
                }

                this.resetLockTimer();
                this.stuck = false;
            } else {
                if (this.softdropping) {
                    this.lockTimer -= 10;
                } else {
                    this.lockTimer--;
                }
            }
        }
        // ----------------------------------------------------------------------------------

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
        this.lockTimer = 0;
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

        if (inp.getHeldKey("ArrowLeft")) {
            if (this.DASTimer == 0) {
                this.moveTetriminoSideways(-1);
                this.resetDASTimer();
            } 
        }
        if (inp.getHeldKey('ArrowRight')) {
            if (this.DASTimer == 0) {
                this.moveTetriminoSideways(1);
                this.resetDASTimer();
            }
        }
        if (inp.getPressedKey("ArrowUp")) {
            this.rotateTetrimino();
        }
        if (inp.getPressedKey("Space")) {
            this.hardDrop();
        }
        this.pushTetrimino();
    }
    processInputQueue() { // unused
        for (let i = this.inputQueue.length - 1; i >= 0; i--) {
            if (this.inputQueue[i] == "r") {
                this.moveTetriminoSideways(1);
                this.inputQueue.splice(i, 1);
            }
            if (this.inputQueue[i] == "l") {
                this.moveTetriminoSideways(-1);
                this.inputQueue.splice(i, 1);
            }
        }
    }
    
    update() {
        if (this.DASTimer > 0) this.DASTimer--;
        this.processInputs();
        if (this.frameCounter <= 0) {
            this.frameCounter = this.softdropping ? Math.floor(this.framesBetweenUpdates / 4) : this.framesBetweenUpdates;
            // Piece Update Code -----------------------
            console.log(inp);
            this.removeTetrimino(); // deletes the minos represeneting the currentTetrimino from the previous frame
            this.moveTetriminoDown();
            //this.processInputQueue(); unnecesary
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
    checkLineClears() {

    }

    regenerate() { // clears the Matrix
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data.push([]);
            for (let j = 0; j < this.columns; j++) {
                this.data[i].push(new Mino());
            }
        }
    }

    draw(x, y, gridSize, ctx, hiddenRowCount = 4) {

        let numDrawRows = this.rows - hiddenRowCount;
        let boardWidth = this.columns * gridSize;
        let boardHeight = numDrawRows * gridSize;

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