'use strict';

function getFileName (i) {
    const name = ('00' + i).slice(-3) + '.mp3';
    return name;
    // if (i >= 600) {
    //     return i + '.mp3';
    // }
    // return 'Boris%20'
    //     + ((i < 284) ? 'Grebentshikov' : 'Grebenshchikov')
    //     + '%20-%20Aerostat%20Radio%20vol.' + i + '.mp3';
}

function getUrl (i) {
    var path = 'https://aerostatica.ru/music/' + getFileName(i);
    return path;
    // return ((i >= 600) ?
    //     'https://aerostatica.ru/music' :
    //     'http://aquarium.lipetsk.ru/MESTA/mp3/Aerostat/Aerostat_vol_' + i
    // ) + '/' + getFileName(i);
}

module.exports = {
    getFileName: getFileName,
    getUrl: getUrl
};
