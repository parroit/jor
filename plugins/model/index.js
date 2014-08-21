/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';
var knex = require('knex');
var tcomb = require('tcomb');
var ColumnInfo = require('./lib/ColumnInfo');


if (typeof global.struct === 'undefined') {
    tcomb.mixin(global, tcomb);
}

var tcombCommons = require('tcomb-commons');
if (typeof global.maxLength === 'undefined') {
    tcomb.mixin(global, tcombCommons);
}

var requireDir = require('require-dir');
var modelCommons = requireDir('./lib');
if (typeof global.key === 'undefined') {
    tcomb.mixin(global, modelCommons);
}


var db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'tests'
    }
});

var types = {
    Str: function(tb, name, prop, original) {
        return tb.string(name, original && original.maxLength);
    },
    Dat: function(tb, name, prop) {
        return tb.dateTime(name);
    },
    Num: function(tb, name, prop) {
        return tb.float(name);
    },
    Int: function(tb, name, prop) {
        return tb.integer(name);
    }
}

var typeInfos = {
    Str: function(prop, original) {
        var info = new ColumnInfo('varchar');
        if(original && original.maxLength) {
            info.maxLength = original.maxLength;
        }
        return info;
    },
    Dat: function(prop) {
        return new ColumnInfo('datetime');
    },
    Num: function(prop) {
        return new ColumnInfo('float');
    },
    Int: function(tb, name, prop) {
        return new ColumnInfo('int');
    }
}




function buildColumn(table, name, prop, original) {
    var meta = prop.meta
        // console.dir(prop);

    if (meta.kind === 'maybe') {
        return buildColumn(table, name, meta.type, prop).nullable();
    }

    var columnBuilder = types[meta.name];
    if (!columnBuilder) {
        if (meta.kind === 'subtype') {
            var column = buildColumn(table, name, meta.type, prop);
            if (meta.key) {
                return column.primary();
            } else {
                return column;
            }
        }
        throw new Error('Unknown column type:' + meta.name);
    }
    return columnBuilder(table, name, meta, original && original.meta);


}


function buildInfo(name, prop, original) {
    var meta = prop.meta
        // console.dir(prop);

    if (meta.kind === 'maybe') {
        return buildInfo(name, meta.type, prop).setNullable();
    }

    var columnBuilder = typeInfos[meta.name];
    if (!columnBuilder) {
        if (meta.kind === 'subtype') {
            var column = buildInfo(name, meta.type, prop);
            if (meta.key) {
                return column.setPrimary();
            } else {
                return column;
            }
        }
        throw new Error('Unknown column type:' + meta.name);
    }
    return columnBuilder(meta, original && original.meta);


}

function createTable(type) {
    var meta = type.meta;
    return db.schema.createTable(meta.name, function(table) {
        Object.keys(meta.props).forEach(function(name) {
            buildColumn(table, name, meta.props[name]);
        });


    });
}


function tableInfo(type) {
    var meta = type.meta;
    var keyName;
    return db.raw('show index from ' + meta.name + ' where Key_name = \'PRIMARY\'')

    .then(function(resp) {
      keyName = resp[0][0].Column_name;
      return db(meta.name).columnInfo();
    })

    .then(function(resp) {
        var columnName;
        for (columnName in resp) {
            resp[columnName].primary = columnName === keyName;
        }
        return resp;
    });

}

function typeInfo(type) {
    var meta = type.meta;
    var result = {};
    Object.keys(meta.props).forEach(function(name) {
        result[name] = buildInfo(name, meta.props[name]);
    });


    return new Promise(function(resolve,reject){
        resolve(result);
    });
}

function diffInfos(left, right) {
    var result = {
        removed: [],
        inserted: {},
        changed: {}
    }

    var name;
    for (name in left) {
        if (name in right) {
            if (! right[name].equals(left[name]) ) {
                result.changed[name] = right[name];
            }
        } else {
            result.removed.push(name);
        }
    }

    for (name in right) {
        if (! (name in left) ) {
            
            result.inserted[name] = right[name];
        }
    }


    return result;
}


module.exports = {
    createTable: createTable,
    tableInfo: tableInfo,
    typeInfo: typeInfo,
    diffInfos: diffInfos,
    ColumnInfo: ColumnInfo
}
