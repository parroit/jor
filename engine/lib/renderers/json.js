'use strict';

var Promise = require('bluebird');

module.exports = function renderJson(dirName, route, results){
    return {
        body: Promise.resolve(JSON.stringify(results)),
        type: 'application/json'
    };
}