#! /usr/bin/env node

'use strict';

var program = require('commander');

program
  .version('0.1.0')
  .option('-f, --folder <path>', 'path to folder containing jor.yml file')
  .parse(process.argv);

var engine = require('./jor-engine.js');

engine.start(program.folder);