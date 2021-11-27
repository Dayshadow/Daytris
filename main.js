const c = document.getElementById("Game_Surface");
const ctx = c.getContext("2d");
let w = c.width = window.innerWidth;
let h = c.height = window.innerHeight;

let m = new Matrix();
m.pushTetrimino();

const gs = Math.floor(h / 30);

let f = 0;
function drawLoop() {
    f++;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = rgb(247, 247, 237);
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = rgb(0, 0, 0);


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


    m.update();
    m.draw(w / 2 - (m.columns * gs) / 2, h / 2 - ((m.rows - 4) * gs) / 2, gs, f, ctx);

    setTimeout(drawLoop, 1000 / 60);
    //requestAnimationFrame(drawLoop);
}
drawLoop();
