#!/usr/bin/env node
'use strict';

var yargs = require('yargs'),
    lib = require('../lib'),
    chromecasts = require('chromecasts');

var argv = yargs.argv;

if (argv.number !== undefined && argv.device !== undefined) {

chromecasts().on('update', function (player) {
    var url;
    if (player.name === argv.device) {
        url = lib.getUrl(argv.number);
        player.play(
            url,
            {type: 'audio/x-mp3'},
            function (stat1) {
                console.log(stat1);
                if (argv.skip) {
                    player.seek(
                        Number(argv.skip),
                        function (stat2) {
                            console.log(stat2);
                        }
                    );
                }
            }
        );
    }
});

}
