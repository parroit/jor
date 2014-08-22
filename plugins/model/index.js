/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';
var knex = require('knex');
var requireDir = require('require-dir');
var modelCommons = requireDir('./lib/tcomb');
var jor = require('jor');

function define(name,fields){
    return tcomb.struct(fields, name);
}


module.exports = function(engine) {
    var model = engine.model = (engine.model || {});
    
    model.db = knex({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database: 'tests'
        }
    });

    jor.mountTypes(modelCommons);     
};
