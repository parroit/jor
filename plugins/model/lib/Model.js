'use strict';
var util = require('./migrations');

function Model(schema, db){
    this._info = util.getTypeInfo(schema);
    this.schema = schema;
    this.db = db;

}

var proto = Model.prototype;

proto._query = function(){
    return this.db(this.schema.meta.name);
};

proto._key = function(){
    var info = this._info;
    return Object.keys(info).find(function(name){
        return info[name].primary;
    });
};

proto._keyWhere = function(key){
    var where = {};
    where[this._key()] = key;
    return where;
};

proto.get = function(key){
    
    return this.select(this._keyWhere(key)).then(function(rows){
        return rows.length === 0 ?
            undefined :
            rows[0];
    });
};

proto.select = function(whereClause){
    var create = this.create.bind(this);
    var qry = this._query().select();

    if (typeof whereClause === 'object') {
        qry = qry.where(whereClause);
    }

    if (typeof whereClause === 'string') {
        qry = qry.whereRaw(whereClause);
    }

    return qry.then(function(rows){
        return rows.map(create);
    });
};

proto.create = function(data){
    var instance =  this.schema(data);
    //instance.schema = this.schema;
    return instance;
};

proto.save = function(instance){
    var validated =  this.schema(instance);
    var key = instance[this._key()];
    var qry = this._query();
    var keyWhere = this._keyWhere(key);

    return this.get(key)

    .then(function(exists){
        if (exists) {
            return qry
                .update(instance)
                .where( keyWhere );
        } 
        
        return  qry.insert(instance);
        
    });
};

proto.delete = function(instance){
    var key = instance[this._key()];
    var qry = this._query();
    var keyWhere = this._keyWhere(key);
    
    
    return qry.delete().where(keyWhere);

};



module.exports = Model;