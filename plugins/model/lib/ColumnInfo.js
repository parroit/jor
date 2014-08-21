'use strict';



function ColumnInfo(type){
    this.defaultValue = null;
    this.type = type;
    this.maxLength = null;
    this.nullable = false;
    this.primary = false;
}

ColumnInfo.make = function(data){
    var info = new ColumnInfo(data.type);
    info.defaultValue = data.defaultValue;
    info.maxLength = data.maxLength;
    info.nullable = data.nullable;
    this.primary = data.primary;
    return info;
};

ColumnInfo.prototype.equals = function(that){
    return this.defaultValue === that.defaultValue &&
        this.type === that.type &&
        this.maxLength === that.maxLength &&
        this.primary === that.primary &&
        this.nullable === that.nullable;
};


ColumnInfo.prototype.setNullable = function(){
    this.nullable = true;
    return this;
};


ColumnInfo.prototype.setPrimary = function(){
   this.primary = true;
   return this; 
};


module.exports = ColumnInfo;