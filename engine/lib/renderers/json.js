'use strict';

var Promise = require('bluebird');

module.exports = function renderJson(dirName, route, results){
    
    return Promise.resolve(JSON.stringify(results));
}