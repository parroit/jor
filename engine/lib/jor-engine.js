/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 andrea parodi
 * Licensed under the MIT license.
 */

'use strict';

var koa = require('koa');
var fs = require('fs');
var path = require('path');
var resolve = require('resolve');
var Plugin = require('./Plugin');
var pluginMounter = require('./plugin-mounter');
var EventEmitter = require('events').EventEmitter;



var engine = module.exports = new EventEmitter();
var app = engine.koa = koa();

engine.plugins = [];

engine.start = function start(dirName) {
    var main;
    if ( (main = loadPlugin(dirName)) ) {
        this.root = main;
        this.server = app.listen(3000);   
        this.config = main.config; 
    }
    
};

engine.stop = function stop() {
    if (!this.server) {
        return;
    }

    this.server.close();
};

function biEmit(plugin, event){
    engine.emit(event, plugin);
    plugin.emit(event);
}

function loadPlugin(dirName) {

    var plugin = new Plugin(dirName);
    if (!plugin.loadConfig()) {
        return null;
    }

    if (plugin.config.init) {
        var initFile = path.join(dirName, plugin.config.init);     
        var initFn  = require(initFile);
        initFn(engine, plugin);
    }

    biEmit(plugin,'controllersMounting');
    pluginMounter.mountControllers(engine, plugin);
    biEmit(plugin,'controllersMounted');

    biEmit(plugin,'staticsMounting');
    pluginMounter.mountStaticFiles(engine, plugin);
    biEmit(plugin,'staticsMounted');

    
    if (Array.isArray(plugin.config.plugins)) {
        biEmit(plugin,'pluginsLoading');
        
        plugin.config.plugins.forEach(function(pluginName) {
            var pluginDirName = resolve.sync(pluginName, {
                basedir: dirName,
                readFileSync: function(path) {
                    return '{"main": "jor.yml"}';
                },
                isFile: function(packagePath) {
                    return fs.existsSync(path.dirname(packagePath));
                }
            });

            var subPlugin = loadPlugin(pluginDirName);
            engine.plugins.push(subPlugin);
        });

        biEmit(plugin,'pluginsLoaded');
    }

    return plugin;
}

