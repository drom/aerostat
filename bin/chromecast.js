#!/usr/bin/env node
'use strict';

var chromecasts = require('chromecasts')();

chromecasts.on('update', function (player) {
    console.log(player);
});
