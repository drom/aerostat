#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const lib = require('../lib');

const HELP = [
  'Usage: aerostat-dl [args]',
  '',
  'Options:',
  '  --min <n>   first Aerostat number to download          [number]',
  '  --max <n>   last Aerostat number to download   [number] [default: 5000]',
  '  --par <n>   number of concurrent downloads        [number] [default: 1]',
  '  --help      show help',
  ''
].join('\n');

function parseArgs(argv) {
  const opts = { max: 5000, par: 1 };
  for (let i = 0; i < argv.length; i++) {
    let key = argv[i];
    let val;
    const eq = key.indexOf('=');
    if (key.startsWith('--') && eq !== -1) {
      val = key.slice(eq + 1);
      key = key.slice(0, eq);
    }
    switch (key) {
    case '--min': opts.min = Number(val !== undefined ? val : argv[++i]); break;
    case '--max': opts.max = Number(val !== undefined ? val : argv[++i]); break;
    case '--par': opts.par = Number(val !== undefined ? val : argv[++i]); break;
    case '--help':
    case '-h': opts.help = true; break;
    default:
      process.stderr.write('unknown option: ' + key + '\n');
      opts.help = true;
    }
  }
  return opts;
}

function download(src, dst) {
  return fetch(src).then(function (res) {
    if (!res.ok) {
      process.stdout.write('(' + res.status + ') ' + src + '\n');
      return;
    }
    process.stdout.write('start: ' + dst + '\n');
    return pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dst))
      .then(function () {
        process.stdout.write('done: ' + dst + '\n');
      });
  }).catch(function (err) {
    process.stdout.write('error: ' + dst + ' (' + err.message + ')\n');
  });
}

function getFiles(min, max, par) {
  const nums = [];
  for (let i = min; i <= max; i++) {
    nums.push(i);
  }
  let idx = 0;
  function worker() {
    if (idx >= nums.length) {
      return Promise.resolve();
    }
    const i = nums[idx++];
    return download(lib.getUrl(i), lib.getDest(i)).then(worker);
  }
  const runners = [];
  const width = Math.max(1, par);
  for (let w = 0; w < width; w++) {
    runners.push(worker());
  }
  Promise.all(runners).then(function () {
    console.log('all done');
  });
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(HELP);
    return;
  }
  if (opts.min !== undefined) {
    getFiles(opts.min, opts.max, opts.par);
  } else {
    process.stdout.write(HELP);
  }
}

main();
