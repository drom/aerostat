#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    eachLimit = require('async/eachLimit'),
    lib = require('../lib'),
    chromecasts = require('chromecasts'),
    yargs = require('yargs');

function getDest (i) {
    return path.resolve(process.cwd(), './' + lib.getFileName(i));
}

function download (index, cb) {
    var url = lib.getUrl(index);
    console.log(url);
    if (url === undefined) {
      cb();
      return;
    }
    var dest = getDest(index);
    var type = url.slice(0, 5);
    ({ 'http:': http, https: https })[type].get(url, function (response) {
        process.stdout.write('start: ' + dest + '\n');
        if (response.statusCode === 200) {
            var file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb);
                process.stdout.write('done: ' + dest + '\n');
            });
        } else {
            process.stdout.write('(' + response.statusCode + ')\n');
        }
    });
}

function getFiles(min, max, par) {
    var arr = [];
    var i;
    for (i = min; i <= max; i++) {
        arr.push(i);
    }
    eachLimit(arr, par, download, function (err) {
        if (err) {
            throw err;
        }
        if (i === max) {
            console.log('all done');
        } else {
            console.log('done');
            // i++;
            // rec();
        }
    });
}

var argv = yargs
    .usage('$0 [args]')
    .option('min', {
        demand: false,
        describe: 'first Aerostat number to download',
        type: 'number'
    })
    .option('max', {
        demand: false,
        default: 5000,
        describe: 'last Aerostat number to download',
        type: 'number'
    })
    .option('par', {
        demand: false,
        default: 1,
        describe: 'number of parallel downloads',
        type: 'number'
    })
    .option('number', {
        alias: 'n',
        demand: false,
        describe: 'Aerostat Number to chromecast',
        type: 'number'
    })
    .option('device', {
        alias: 'd',
        demand: false,
        describe: 'Name of chromecast device',
        type: 'string'
    })
    .options('skip', {
        alias: 's',
        describe: 'skip Number of seconds'
    })
    .help('help')
    .argv;

if (argv.min !== undefined && argv.max !== undefined) {
    getFiles(argv.min, argv.max, argv.par);
}

if (argv.number !== undefined && argv.device !== undefined) {

chromecasts().on('update', function (player) {
    var url;
    console.log('found: ' + player.name);
    if (player.name === argv.device) {
        url = lib.getUrl(argv.number);
        player.play(
            url,
            {type: 'audio/x-mp3'},
            function (err1) {
                if (err1) { throw err1; }
                if (argv.skip) {
                    player.seek(
                        Number(argv.skip),
                        function (err2) {
                            if (err2) { throw err2; }
                        }
                    );
                }
            }
        );
    }
});

}
