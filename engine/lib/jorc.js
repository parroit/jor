#! /usr/bin/env node
'use strict';

if (isHarmony()) {
    startEngine();
} else {
    harmonize();
}


function startEngine(){
    var program = require('commander');

    program
      .version('0.1.0')
      .option('-f, --folder <path>', 'path to folder containing jor.yml file')
      .parse(process.argv);

    var engine = require('./jor-engine.js');

    engine.start(program.folder || process.cwd());

}



function isHarmony(){
    return 'function' === typeof Map;
}

function harmonize(){
    var spawn = require('child_process').spawn;
    var args = [ __filename].concat(process.argv.slice(2));

    spawn(process.argv[0], ['--harmony'].concat(args), {stdio: [0,1,2]});
}