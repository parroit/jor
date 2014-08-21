'use strict';

var Promise = require('bluebird');
var xml = require('xml');

module.exports = function renderJson(dirName, route, results){
    return {
        body: Promise.resolve(xml(results)),
        type: 'application/xml'
    };
}