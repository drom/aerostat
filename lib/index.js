'use strict';

function getFileName (i) {
    if (i >= 600) {
        return i + '.mp3';
    }
    return 'Boris%20'
        + ((i < 284) ? 'Grebentshikov' : 'Grebenshchikov')
        + '%20-%20Aerostat%20Radio%20vol.' + i + '.mp3';
}

function getUrl (i) {
    return 'http://' + (
        (i >= 600) ?
        'aerostatica.ru/music' :
        'aquarium.lipetsk.ru/MESTA/mp3/Aerostat/Aerostat_vol_' + i
    ) + '/' + getFileName(i);
}

module.exports = {
    getFileName: getFileName,
    getUrl: getUrl
};
