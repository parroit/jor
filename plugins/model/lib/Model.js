'use strict';

function Model(schema, db){
    this.schema = schema;
    this.db = db;

}

var proto = Model.prototype;

proto.$ = function(){
    return this.db(this.schema.meta.name);
};


proto.select = function(whereClause){
    var create = this.create.bind(this);
    var qry = this.$().select();

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

};

proto.delete = function(instance){

};



module.exports = Model;