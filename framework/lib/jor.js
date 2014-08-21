/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var methods = require('methods');
var renderers = ['json', 'xml','text','view','yaml'];

function mkFunction(tagName, tagValue) {
    return function(fn) {
        var jorTags = fn.jor || (fn.jor = {});
        jorTags[tagName] = tagValue;
        return fn;
    };
}

methods.forEach(function(method) {
    exports[method] = mkFunction('method',method);
});


renderers.forEach(function(renderer) {
    exports[renderer] = mkFunction('renderer',renderer);
});
