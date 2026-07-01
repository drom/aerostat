#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Readable, Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const lib = require('../lib');

function fmtMB(bytes) {
  return (bytes / 1048576).toFixed(1);
}

function bar(state) {
  const width = 24;
  const total = state.total;
  const ratio = total ? Math.min(1, state.received / total) : 0;
  const filled = Math.round(ratio * width);
  const graph = '#'.repeat(filled) + '-'.repeat(width - filled);
  const pct = total ? (Math.round(ratio * 100) + '%').padStart(4) : '  ?%';
  const size = total
    ? fmtMB(state.received) + '/' + fmtMB(total) + ' MB'
    : fmtMB(state.received) + ' MB';
  return state.name + ' [' + graph + '] ' + pct + '  ' + size;
}

// Live multi-line renderer: one bar per download slot on a TTY, plain log lines otherwise.
function makeRenderer(width) {
  const tty = process.stdout.isTTY;
  const slots = new Array(width).fill(null);
  let drawn = 0;
  let last = 0;

  function clear() {
    if (drawn > 0) {
      process.stdout.write('\x1b[' + drawn + 'A');
    }
    process.stdout.write('\x1b[J');
    drawn = 0;
  }

  function draw() {
    let out = '';
    let n = 0;
    for (const s of slots) {
      if (s) {
        out += bar(s) + '\n';
        n++;
      }
    }
    process.stdout.write(out);
    drawn = n;
  }

  return {
    log(msg) {
      if (!tty) {
        process.stdout.write(msg + '\n');
        return;
      }
      clear();
      process.stdout.write(msg + '\n');
      draw();
    },
    update(slot, state, force) {
      slots[slot] = state;
      if (!tty) {
        return;
      }
      const now = Date.now();
      if (!force && now - last < 80) {
        return;
      }
      last = now;
      clear();
      draw();
    },
    clearSlot(slot) {
      slots[slot] = null;
      if (tty) {
        clear();
        draw();
      }
    }
  };
}

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

// resolves true when the episode is missing (404) => caller should stop
function download(i, slot, render) {
  const src = lib.getUrl(i);
  const dst = lib.getDest(i);
  const name = path.basename(dst);
  return fetch(src).then(function (res) {
    if (res.status === 404) {
      render.log('(404) ' + name);
      return true;
    }
    if (!res.ok) {
      render.log('(' + res.status + ') ' + name);
      return false;
    }
    const total = Number(res.headers.get('content-length')) || 0;
    let received = 0;
    render.update(slot, { name, received, total }, true);
    const count = new Transform({
      transform(chunk, enc, cb) {
        received += chunk.length;
        render.update(slot, { name, received, total });
        cb(null, chunk);
      }
    });
    return pipeline(Readable.fromWeb(res.body), count, fs.createWriteStream(dst))
      .then(function () {
        render.clearSlot(slot);
        render.log('done: ' + name + ' (' + fmtMB(received) + ' MB)');
        return false;
      });
  }).catch(function (err) {
    render.clearSlot(slot);
    render.log('error: ' + name + ' (' + err.message + ')');
    return false;
  });
}

function getFiles(min, max, par) {
  const nums = [];
  for (let i = min; i <= max; i++) {
    nums.push(i);
  }
  const width = Math.max(1, par);
  const render = makeRenderer(width);
  let idx = 0;
  let stopped = false;
  function worker(slot) {
    if (stopped || idx >= nums.length) {
      return Promise.resolve();
    }
    const i = nums[idx++];
    return download(i, slot, render).then(function (stop) {
      if (stop) {
        stopped = true;
        return;
      }
      return worker(slot);
    });
  }
  const runners = [];
  for (let w = 0; w < width; w++) {
    runners.push(worker(w));
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
