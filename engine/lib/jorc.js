#!/home/parroit/.nvm/v0.11.13/bin/node --harmony

'use strict';

var program = require('commander');

program
  .version('0.1.0')
  .option('-f, --folder <path>', 'path to folder containing jor.yml file')
  .parse(process.argv);

var engine = require('./jor-engine.js');

engine.start(program.folder || process.cwd());