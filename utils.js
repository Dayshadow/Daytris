Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

let inp = new InputHandler();
window.addEventListener('keydown', (e) => {
    inp.newKeyDown(e.code);
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
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

