
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
function distSquared(x1, y1, x2, y2) { // slightly faster if you only want to preserve the ratios
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
};

let inp = new InputHandler();
window.addEventListener('keydown', (e) => {
    inp.newKeyDown(e.code);
    //console.log(e.code)
    // if (!(keys.includes(e.code))) {
    //     keys.push(e.code);
    //     keys.map((x) => { return x.toLowerCase() })
    //     console.log(keys)
    // }
});
window.addEventListener('keyup', function (e) {
    inp.newKeyUp(e.code);
    // keys = keys.filter((x) => { return (x != e.code) });
});

let mouse = {
    x: 1,
    y: 1
};
let rightMouseClicked = false;
let leftMouseClicked = false;

function handleMouseDown(e) {
    //e.button describes the mouse button that was clicked
    // 0 is left, 1 is middle, 2 is right
    e.preventDefault();
    if (e.button === 2) {
        rightMouseClicked = true;
    }
    if (e.button === 0) {
        leftMouseClicked = true;
    }
}
function handleMouseUp(e) {
    e.preventDefault();
    if (e.button === 2) {
        rightMouseClicked = false;
    }
    if (e.button === 0) {
        leftMouseClicked = false;
    }
}
const mouseMove = (event) => {
    mouse.x = event.x
    mouse.y = event.y
};

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', mouseMove)
document.addEventListener('drag', mouseMove);

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function rgb(r, g, b) {
    return "rgb(" + r + ", " + g + ", " + b + ")"
}

function mod(x, m) {
    return (x + m) % m;
}

function drawBeveledBox(x, y, w, h, bevels, ctx, shaded = false) { // more flexible than just setting linejoin to bevel
    //let baseColor = ctx.fillStyle;
    let outline = [
        new Vector(x + bevels[0], y),
        new Vector(x + w - bevels[1], y),
        new Vector(x + w, y + bevels[1]),
        new Vector(x + w, y + h - bevels[2]),
        new Vector(x + w - bevels[2], y + h),
        new Vector(x + bevels[3], y + h),
        new Vector(x, y + h - bevels[3]),
        new Vector(x, y + bevels[0])
    ]
    ctx.fillStyle = "#ffffff"
    polygon(outline, ctx);
    ctx.fill();

    getShadedBorderPolygons(outline, 40)

    // let test = getCentroid(outline);
    // ctx.fillStyle = "red"
    // ctx.fillRect(test.x, test.y, 20, 20);

    //ctx.clip();

    // let shadingGradient = ctx.createLinearGradient(x - w / 5, y - h / 5, x - w / 6, y + h / 6);
    // shadingGradient.addColorStop(0, "black");
    // shadingGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
    // ctx.fillStyle = shadingGradient;
    //ctx.fill();
    //ctx.stroke();
}

function polygon(verticies, ctx) { // assuming that the verticies passed in are in clockwise order because yes
    ctx.beginPath();
    ctx.moveTo(verticies[0].x, verticies[0].y);
    for (let i = 1; i < verticies.length; i++) {
        ctx.lineTo(verticies[i].x, verticies[i].y)
    }
    ctx.closePath();
}
function getCentroid(verticies) {
    let sumX = 0;
    let sumY = 0;
    for (let vertex of verticies) {
        sumX += vertex.x;
        sumY += vertex.y;
    }
    return new Vector(sumX / verticies.length, sumY / verticies.length);
}

function scaleFromPoint(pos, pointPos, scalingFactor) {
    return new Vector(((pos.x - pointPos.x) * scalingFactor) + pointPos.x, ((pos.y - pointPos.y) * scalingFactor) + pointPos.y)
}
function getShadedBorderPolygons(verticies, borderWidth, lightAngle = Math.PI) { // not the best implementation
    let centriod = getCentroid(verticies);
    let ov = getOutwardsVectors(verticies);
    let f = (v, m) => { // messing around
        if (m > 0) {
            m--;
            f(getLineCenters(v), m)
        }
    }
    let mdp = getLineCenters(verticies);
    f(mdp, 50)



    for (let i = 0; i < ov.length; i++) { // for every line of the polygon

        // generate the outwards quad
        let outQuad = quad(
            verticies[i].x, verticies[i].y,
            verticies[i].x + ov[i].x * borderWidth, verticies[i].y + ov[i].y * borderWidth,
            verticies[(i + 1) % ov.length].x + ov[(i + 1) % ov.length].x * borderWidth, verticies[(i + 1) % ov.length].y + ov[(i + 1) % ov.length].y * borderWidth,
            verticies[(i + 1) % ov.length].x, verticies[(i + 1) % ov.length].y,
        )
        let outQuadDir = new Vector();
        // ctx.fillStyle = "lightgrey"
        // ctx.strokeStyle = "lightgrey"
        // ctx.lineWidth = 1
        // polygon(outQuad, ctx)
        // ctx.stroke();
        // ctx.fill();
        // generate the inwards quad
        let inQuad = quad(
            verticies[i].x, verticies[i].y,
            verticies[i].x - ov[i].x * borderWidth, verticies[i].y - ov[i].y * borderWidth,
            verticies[(i + 1) % ov.length].x - ov[(i + 1) % ov.length].x * borderWidth, verticies[(i + 1) % ov.length].y - ov[(i + 1) % ov.length].y * borderWidth,
            verticies[(i + 1) % ov.length].x, verticies[(i + 1) % ov.length].y,
        )
        // ctx.fillStyle = "grey"
        // ctx.strokeStyle = "grey"
        // ctx.lineWidth = 1
        // polygon(inQuad, ctx)
        // ctx.stroke();
        // ctx.fill();
    }
    //ctx.fillStyle = "red"
    //polygon(upQuads, ctx);
    //ctx.fill()

}

function getOutwardsVectors(verticies) {
    let ret = [];
    for (let i = 0; i < verticies.length; i++) { // assume convex
        let x0 = verticies[i].x // First vertex x and y
        let y0 = verticies[i].y
        let x1 = verticies[(i + 1) % verticies.length].x // Second vertex x and y
        let y1 = verticies[(i + 1) % verticies.length].y // (modulo is used to wrap the last vertex back to the first)
        let x2 = verticies[(i + 2) % verticies.length].x // Third vertex x and y
        let y2 = verticies[(i + 2) % verticies.length].y

        let line1Vec = new Vector(x1 - x0, y1 - y0) // Gets the vector for the line between the first and second verticies
        let line2Vec = new Vector(x2 - x1, y2 - y1) // Gets the vector for the line between the second and third verticies
        let outwardsVec = line1Vec.getBisector(line2Vec).rotate(-Math.PI / 2); // Bisects the two lines and faces the angle outwards
        ret.push(outwardsVec);
    }
    let last = ret.pop();
    ret.unshift(last); // Just shifts everything over by one so each vector lines up with each vertex by index
    return ret;
}

function getLineCenters(verticies) { // surprisingly close to that last function
    let ret = [];
    for (let i = 0; i < verticies.length; i++) {
        let x0 = verticies[i].x // First vertex x and y
        let y0 = verticies[i].y
        let x1 = verticies[(i + 1) % verticies.length].x // Second vertex x and y
        let y1 = verticies[(i + 1) % verticies.length].y // (modulo is used to wrap the last vertex back to the first)


        let line1Vec = new Vector(x1 - x0, y1 - y0) // Gets the vector for the line between the first and second verticies
        let midPoint = line1Vec.multiplyBy(0.5); // halves it (duh)
        midPoint = midPoint.addVector(new Vector(x0, y0));
        ret.push(midPoint);
    }
    // let last = ret.pop();
    // ret.unshift(last); // Just shifts everything over by one so each vector lines up with each vertex by index

    ctx.lineWidth = 2
    ctx.strokeStyle = "green"
    polygon(ret, ctx)
    ctx.stroke();
    return ret;
}
function quad(x0, y0, x1, y1, x2, y2, x3, y3) {
    return [
        new Vector(x0, y0),
        new Vector(x1, y1),
        new Vector(x2, y2),
        new Vector(x3, y3),
    ]
}
function vecFromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle))
}