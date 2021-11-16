class Matrix {
    constructor(rows = 24, columns = 10) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];
        // this.data = new Array(rows).fill(new Array(columns)); // do no do this, it copies values by reference
        for (let i = 0; i < rows; i++) {
            this.data.push([]);
            for (let j = 0; j < columns; j++) {
                this.data[i].push(new Mino());
            }
        }

    }
    testLog() {
        console.log(this.data);
    }
    update() {

    }
    checkClears() {

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
                    ctx.fillStyle = this.data[i][j].color;
                    ctx.fillRect(x + j * gridSize, y + i * gridSize, gridSize, gridSize);
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