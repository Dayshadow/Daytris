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
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, w, h);

    m.update();
    //m.draw(w / 2 - (m.columns * gs) / 2, h / 2 - ((m.rows - 4) * gs) / 2, gs, f, ctx);
    ctx.fillStyle = "#efefc8";
    ctx.strokeStyle = "#efefc8"
    ctx.lineWidth = 8;
    ctx.lineJoin = "bevel";
    drawBeveledBox(w / 2 - 200 + Math.sin(f / 130) * 80,
        h / 2 - 200 + Math.cos(f / 120) * 80,
        400 + Math.sin(f / 50) * 40,
        400 + Math.cos(f / 50) * 70,
        [Math.sin(f / 60) * 80 + 80,
        Math.cos(f / 60) * 80 + 80,
        Math.sin(f / 60) * 80 + 80,
        Math.cos(f / 60) * 80 + 80],
        ctx,
        true,
        (f / 120) % Math.PI * 2)

    setTimeout(drawLoop, 1000 / 60);
    //requestAnimationFrame(drawLoop);
}
drawLoop();

ctx.fillStyle = "#efefc8";
ctx.lineWidth = 8;
ctx.lineJoin = "miter";
drawBeveledBox(w / 2 - 200 + Math.sin(f / 130) * 80, h / 2 - 200 + Math.cos(f / 120) * 80, 400, 400, [80, 40, 80, 40], ctx)