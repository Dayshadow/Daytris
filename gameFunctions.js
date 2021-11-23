function pasteTetrimino(srcArr, tetrimino, remove = false) {
    let ret = srcArr.slice(); // the slice is so that it doesn't reference the original array
    let pasteArr = tetrimino.data.slice();
    for (let i = tetrimino.y; i < tetrimino.y + pasteArr.length; i++) {
        for (let j = tetrimino.x; j < tetrimino.x + pasteArr[0].length; j++) {
            if (pasteArr[i - tetrimino.y][j - tetrimino.x]) {
                if (!remove) {
                    ret[i][j].set(tetrimino.color);
                } else {
                    ret[i][j].deactivate();
                }
            }
        }
    }
    return ret;
}

function checkTetriminoPos(matrixData, tetriminoData, x, y) {
    let src = matrixData.slice(); // the slice is so that it doesn't reference the original array
    let tet = tetriminoData.slice();
    for (let i = y; i < y + tet.length; i++) {
        for (let j = x; j < x + tet[0].length; j++) {
            if (tet[i - y][j - x]) {
                if (src[i] === undefined) return false;
                if (src[i][j] === undefined) return false;
                if (src[i][j].occupied && tet[i - y][j - x]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function shiftLinesDown(data, deletedIndex) {
    let arrayWidth = data[0].length;
    data.splice(deletedIndex, 1);
    let tmpArr = [];
    for (let i = 0; i < arrayWidth; i++) {
        tmpArr.push(new Mino());
    }
    data.unshift(tmpArr);
}

function drawTetriminoOutline(tetriminoData, x, y, minoSize, internalRectSize, ctx) {
    ctx.strokeStyle = "#474747";
    ctx.fillStyle = "#474747"

    for (let row = 0; row < tetriminoData.length; row++) {
        for (let column = 0; column < tetriminoData[row].length; column++) {
            if (tetriminoData[row][column]) {

                let newX = x + column * minoSize + minoSize / 2//((minoSize - internalRectSize) / 2);
                let newY = y + row * minoSize + minoSize / 2//((minoSize - internalRectSize) / 2);
                //ctx.fill();
                ctx.beginPath();
                ctx.arc(newX, newY, minoSize / 2, 0, Math.PI * 2);
                ctx.fill();
                //strokeRoundedRect(rectX, rectY, internalRectSize, internalRectSize, 6, ctx);
            }
        }
    }
}
function drawTetrimino(tetrimino, x, y, minoSize, ctx, centered = false) {
    ctx.strokeStyle = rgba(40, 40, 40, 0.3)
    let origColor = ctx.fillStyle;
    ctx.fillStyle = tetrimino.color;
    //console.log(x, y)

    for (let row = 0; row < tetrimino.data.length; row++) {
        for (let column = 0; column < tetrimino.data[row].length; column++) {
            if (tetrimino.data[row][column]) {
                let newX = x + (column * minoSize) - (centered ? (tetrimino.data[0].length * minoSize) / 2 : 0);
                let newY = y + (row * minoSize) - (centered ? (tetrimino.data.length * minoSize) / 2 - (minoSize / 2): 0);
                console.log(x + (column * minoSize))
                ctx.beginPath();
                ctx.rect(newX, newY, minoSize, minoSize);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
    ctx.fillStyle = origColor;
}


function strokeRoundedRect(x, y, w, h, _lineWidth, ctx) {
    ctx.lineCap = "round";
    ctx.lineWidth = _lineWidth //80;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.lineCap = "butt"
}

function getWallKick(tetriminoType, initState, targetState, testIndex) {
    return tData[tetriminoType].wallKicks.initState[initState].targetState[targetState].testIndex[testIndex];
}

