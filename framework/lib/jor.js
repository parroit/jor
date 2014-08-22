/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var methods = require('methods');
var renderers = ['json', 'xml', 'text', 'view', 'yaml'];
var tcomb = require('tcomb');
var tcombCommons = require('tcomb-commons');

function mkFunction(tagName, tagValue) {
    return function(fn) {
        var jorTags = fn.jor || (fn.jor = {});
        jorTags[tagName] = tagValue;
        return fn;
    };
}

methods.forEach(function(method) {
    exports[method] = mkFunction('method', method);
});


renderers.forEach(function(renderer) {
    exports[renderer] = mkFunction('renderer', renderer);
});

exports.types = {};

exports.mountTypes = function(modelCommons) {
    if (!exports.types.struct) {
        tcomb.mixin(exports.types, tcomb);
        tcomb.mixin(exports.types, tcombCommons);
        tcomb.mixin(exports.types, modelCommons);
    
    }
    
};


exports.define = function define(name, fields) {
    return tcomb.struct(fields, name);
};
