let keys = [];
window.addEventListener('keydown', (e) => {
    if (!(keys.includes(e.code))) {
        keys.push(e.code);
        keys.map((x) => { return x.toLowerCase() })
        console.log(keys)
    }
});
window.addEventListener('keyup', function (e) {
    keys = keys.filter((x) => { return (x != e.code) });
    console.log(keys)
});

function paste2d(srcArr, pasteArr, x, y, replaceValue) {
    let ret = srcArr;
    if (!(y + pasteArr.length > srcArr.length) && !(x + pasteArr[0].length > srcArr[0].length)) {
        for (let i = y; i < y + pasteArr.length; i++) {
            for (let j = x; j < x + pasteArr[0].length; j++) {
                if (pasteArr[i - y][j - x]) {
                    ret[i][j] = replaceValue;
                }
            }
        }
        return ret;
    }
    return null;
}
