'use strict';
var jor = require('jor');
var t = jor.types;

var Role = {
    id: t.key(t.Int),
    description: t.maybe(t.maxLength(45, t.Str))
};

module.exports = jor.define('Role', Role);
