'use strict';

var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

function Plugin(dirName){
    EventEmitter.call(this);
    this.dirName = dirName;
    this.config = null;
    this.mountPoint = null;
    this.name = null;
}

var proto = Plugin.prototype = new EventEmitter();

proto.loadConfig = function() {
    var configFile = path.join(this.dirName, 'jor.yml');

    if (!fs.existsSync(configFile)) {
        console.error('config file not found:' + configFile);
        return false;
    }

    this.config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    this.mountPoint = this.config.mount || ('/' + this.config.name);
    this.name = this.config.name;

    return true;
};

module.exports = Plugin;