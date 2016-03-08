#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    yargs = require('yargs');

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

function getDest (i) {
    return path.resolve(process.cwd(), './a' + ('00000' + i).slice(-4) + '.mp3');
}

function download (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        process.stdout.write('start:' + dest + '...');
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
            process.stdout.write('done\n');
        });
    });
}

function getFiles(min, max) {
    var i = min;
    function rec () {
        download(getUrl(i), getDest(i), function (err) {
            if (i === max) {
                console.log('all done');
            } else {
                i++;
                rec();
            }
        });
    }
    rec();
}

var argv = yargs.argv;

if (argv.min !== undefined && argv.max !== undefined) {
    getFiles(argv.min, argv.max);
}
