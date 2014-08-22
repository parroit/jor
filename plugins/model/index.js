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
var Model = require('./lib/Model');
var jor = require('jor');
var fs = require('fs');
var path = require('path');

module.exports = function(engine, plugin) {
    var model = engine.model = (engine.model || {});
    model.databases = [];
    jor.mountTypes(modelCommons);


    engine.on('engineStarted', function(plugins) {
        plugins.forEach(function(plugin) {
            var db = null;

            if (plugin.config.db) {
                db = knex(plugin.config.db);
                model.databases.push(db);
            }

            plugin.database = db;
            
            var modelsFolder = path.join(plugin.dirName, 'models');
            
            if (fs.existsSync(modelsFolder)) {
                var schemas = requireDir(modelsFolder);
                Object.keys(schemas).forEach(function(name){
                    plugin[name] = model[name] = new Model(schemas[name],db);

                });
            }
        });

        engine.emit('databasesLoaded',model.databases);
    });

    
};
