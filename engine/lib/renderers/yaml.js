'use strict';

var Promise = require('bluebird');
var yaml = require('js-yaml');

module.exports = function renderJson(dirName, route, results){
    return {
        body: Promise.resolve(yaml.safeDump(results)),
        type: 'application/x-yaml'
    };
}