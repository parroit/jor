/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';
var knex = require('knex');
var tcomb = require('tcomb');
var tcombCommons = require('tcomb-commons');
var requireDir = require('require-dir');
var modelCommons = requireDir('./lib/tcomb');




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

    model.t = {};

    if (typeof global.struct === 'undefined') {
        tcomb.mixin(model.t, tcomb);
    }

    if (typeof global.maxLength === 'undefined') {
        tcomb.mixin(model.t, tcombCommons);
    }

    if (typeof global.key === 'undefined') {
        tcomb.mixin(model.t, modelCommons);
    }
};
