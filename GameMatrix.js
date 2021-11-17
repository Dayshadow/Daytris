class Matrix {
    constructor(rows = 24, columns = 10) {

        this.rows = rows;
        this.columns = columns;

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
        if (pushRes !== null) {
            this.data = pushRes;
        } else {
            return null;
        }
    }

    moveTetriminoDown() {
        // -------------------example code mostly for testing-------------------------------
        if (this.stuck) {
            let newX = Math.floor(Math.random() * 7);
            let newType = this.rnd.pick();
            let newRot = Math.floor(Math.random() * 4);
            if (checkTetriminoPos(this.data, tData[newType].rotationStates[newRot], newX, 0)) {
                this.currentTetrimino = new Tetrimino(newX, 0, newType, newRot);
            } else {
                this.regenerate();
            }
            this.stuck = false;
        }
        // ----------------------------------------------------------------------------------


        this.data = pasteTetrimino(this.data, this.currentTetrimino, true); // removes the existing tetrimino
        this.currentTetrimino.rotate();
        if (checkTetriminoPos(this.data, this.currentTetrimino.data, this.currentTetrimino.x, this.currentTetrimino.y + 1)) { 
            this.currentTetrimino.y++; // if the spot below is avalible, move there
        } else {
            this.stuck = true; // this is temporary, I will implement lock delay
        }
        this.pushTetrimino();
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