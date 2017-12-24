#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    lib = require('../lib'),
    yargs = require('yargs');

function getDest (i) {
    return path.resolve(process.cwd(), './a' + ('00000' + i).slice(-4) + '.mp3');
}

function download (url, dest, cb) {
    var type = url.slice(0, 5);
    ({ 'http:': http, https: https })[type].get(url, function (response) {
        process.stdout.write('start:' + dest + '...');
        if (response.statusCode === 200) {
            var file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb);
                process.stdout.write('done\n');
            });
        } else {
            process.stdout.write('(' + response.statusCode + ')\n');
        }
    });
}

function getFiles(min, max) {
    var i = min;
    function rec () {
        download(lib.getUrl(i), getDest(i), function (err) {
            if (err) {
                throw err;
            }
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

var argv = yargs
    .usage('$0 [args]')
    .option('min', {
        demand: true,
        describe: 'first Aerostat number to download',
        type: 'number'
    })
    .option('max', {
        demand: false,
        default: 5000,
        describe: 'last Aerostat number to download',
        type: 'number'
    })
    .help('help')
    .argv;

if (argv.min !== undefined && argv.max !== undefined) {
    getFiles(argv.min, argv.max);
}
