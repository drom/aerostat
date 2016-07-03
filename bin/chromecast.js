#!/usr/bin/env node
'use strict';

var path = require('path'),
    yargs = require('yargs'),
    chromecasts = require('chromecasts')();

var argv = yargs.argv;

if (argv.url !== undefined && argv.device !== undefined) {

chromecasts.on('update', function (player) {
    var url;
    if (player.name === argv.device) {
        url = argv.url;
        player.play(
            url,
            {type: 'audio/x-mp3'},
            function (err) {
                console.log(err);
            }
        );
    }
});

}
