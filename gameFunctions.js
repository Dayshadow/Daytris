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