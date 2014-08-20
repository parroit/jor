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
var yaml = require('js-yaml');
var resolve = require('resolve');

var mountPlugin = require('./plugin-mounter');


var app = koa();

function start(dirName) {
    /* jshint validthis:true */

    loadPlugins.call(this, dirName);
    this.server = app.listen(3000);
}

function loadPlugins(dirName) {
    /* jshint validthis:true */
    var jor = this;

    var configFile = path.join(dirName, 'jor.yml');

    if (!fs.existsSync(configFile)) {
        return console.error('config file not found:' + configFile);
    }

    jor.config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));

    var mountPoint = jor.config.mount || ('/' + jor.config.name);
    //console.log('mountPoint: ' + mountPoint);

    mountPlugin(app, dirName, mountPoint);

    if (Array.isArray(jor.config.plugins)) {
        jor.config.plugins.forEach(function(plugin) {
            plugin = resolve.sync(plugin, {
                basedir: dirName,
                readFileSync: function(path) {
                    return '{"main": "jor.yml"}';
                },
                isFile: function(packagePath) {
                    return fs.existsSync(path.dirname(packagePath));
                }
            });

            loadPlugins.call(jor, plugin);
        });
    }
}

function stop() {
    /* jshint validthis:true */
    if (!this.server) {
        return;
    }
    this.server.close();
}

module.exports = {
    app: app,
    start: start,
    stop: stop
};
