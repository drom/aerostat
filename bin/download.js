#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    eachLimit = require('async/eachLimit'),
    lib = require('../lib'),
    yargs = require('yargs');

function getDest (i) {
    return path.resolve(process.cwd(), './' + lib.getFileName(i));
}

function download (index, cb) {
    var url = lib.getUrl(index);
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

function getFiles(min, max) {
    var arr = [];
    var i;
    for (i = min; i <= max; i++) {
        arr.push(i);
    }
    eachLimit(arr, 10, download, function (err) {
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
