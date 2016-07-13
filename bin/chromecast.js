#!/usr/bin/env node
'use strict';

var yargs = require('yargs'),
    lib = require('../lib'),
    chromecasts = require('chromecasts');

var argv = yargs
    .usage('$0 [args]')
    .option('number', {
        alias: 'n',
        demand: true,
        describe: 'Aerostat Number to chromecast',
        type: 'number'
    })
    .option('device', {
        alias: 'd',
        demand: true,
        describe: 'Name of chromecast device',
        type: 'string'
    })
    .options('skip', {
        alias: 's',
        describe: 'skip Number of seconds'
    })
    .help('help')
    .argv;

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
