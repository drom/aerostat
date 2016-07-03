'use strict';

function getFileName (i) {
    return 'Boris%20'
        + ((i < 284) ? 'Grebentshikov' : 'Grebenshchikov')
        + '%20-%20Aerostat%20Radio%20vol.' + i + '.mp3';
}

function getUrl (i) {
    return 'http://aquarium.lipetsk.ru/MESTA/mp3/Aerostat/'
        + 'Aerostat_vol_' + i + '/'
        + getFileName(i);
}

module.exports = {
    getFileName: getFileName,
    getUrl: getUrl
};
