'use strict';

var vgtrk = {
  728: 2412573,
  729: 2413715,
  730: 2415041,
  731: 2416394,
  732: 2417826,
  733: 2419236,
  734: 2420681,
  735: 2422028,
  736: 2423356,
  737: 2424713,
  738: 2426109,
  739: 2427545,
  740: 2429056,
  741: 2430386,
  742: 2431753,
  743: 2433117,
  744: 2434511,
  745: 2435875,
  746: 2437276,
  747: 2438715
};

function getFileName (i) {
    return ('00' + i).slice(-3) + '.mp3';
    // if (i >= 600) {
    //     return i + '.mp3';
    // }
    // return 'Boris%20'
    //     + ((i < 284) ? 'Grebentshikov' : 'Grebenshchikov')
    //     + '%20-%20Aerostat%20Radio%20vol.' + i + '.mp3';
}

function getUrl (i) {
    if (i >= 728) {
      return 'https://audio.vgtrk.com/listen?id=' + vgtrk[i];
    }
    return 'https://aerostatica.ru/music/' + getFileName(i);
    // return ((i >= 600) ?
    //     'https://aerostatica.ru/music' :
    //     'http://aquarium.lipetsk.ru/MESTA/mp3/Aerostat/Aerostat_vol_' + i
    // ) + '/' + getFileName(i);
}

module.exports = {
    getFileName: getFileName,
    getUrl: getUrl
};
