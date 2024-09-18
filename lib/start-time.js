let sHH = new Date().getHours();
let sMM = new Date().getMinutes();

if (sHH < 10) {
    sHH = `0${sHH}`;
}

if (sMM < 10) {
    sMM = `0${sMM}`;
}

module.exports = {
    sHH,
    sMM
}
