/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();
var jor = require('jor');
var eng = {};

require('../index')(eng);
var migrations = require('../lib/migrations');
var ColumnInfo = require('../lib/ColumnInfo');
migrations.init(eng.model.db);

jor.types.mixin(global,jor.types);

var Role = struct({
    id: key(Int),
    description: maybe(maxLength(45, Str))
}, 'Role');


var Role2 = struct({
    id: key(Str),
    name: maybe(maxLength(45, Str))
}, 'Role');

var User = struct({
    username: key(maxLength(20, Str)),
    firstName: maybe(Str),
    lastName: maybe(maxLength(100, Str)),
    password: Str,
    age: Num,
    born: maybe(Dat)
}, 'User');


describe('migrations', function() {
    it('is defined', function() {
        migrations.should.be.a('object');
    });

    after(function(){
        eng.model.db.destroy();
    });

    describe('tableInfo', function() {

        it('is defined', function() {
            migrations.tableInfo.should.be.a('function');
        });

        it('return info from table', function(done) {
            migrations.tableInfo(Role)
                .then(function(columns) {
                    columns.should.be.deep.equal({
                        id: {
                            defaultValue: null,
                            type: 'int',
                            maxLength: null,
                            nullable: false,
                            primary: true
                        },
                        description: {
                            defaultValue: null,
                            type: 'varchar',
                            maxLength: 45,
                            nullable: true,
                            primary: false
                        }
                    });
                    done();
                })
                .catch(done);

        });

    });

    describe('typeInfo', function() {

        it('is defined', function() {
            migrations.typeInfo.should.be.a('function');
        });

        it('return info from object', function(done) {
            migrations.typeInfo(Role)
                .then(function(columns) {
                    columns = JSON.parse(JSON.stringify(columns));
                    columns.should.be.deep.equal({
                        id: {
                            defaultValue: null,
                            type: 'int',
                            maxLength: null,
                            nullable: false,
                            primary: true
                        },
                        description: {
                            defaultValue: null,
                            type: 'varchar',
                            maxLength: 45,
                            nullable: true,
                            primary: false
                        }
                    });
                    done();
                })
                .catch(done);

        });

    });

    describe('diffInfos', function() {

        it('is defined', function() {
            migrations.diffInfos.should.be.a('function');
        });

        it('return diff between two infos', function() {
            var left = {
                id: {
                    defaultValue: null,
                    type: 'int',
                    maxLength: null,
                    nullable: false,
                    primary: false
                },
                description: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true,
                    primary: false
                },
                name: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true,
                    primary: false
                }

            };

            var right = {
                id: ColumnInfo.make({
                    defaultValue: null,
                    type: 'int',
                    maxLength: null,
                    nullable: false,
                    primary: false
                }),

                description: ColumnInfo.make({
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 55,
                    nullable: true,
                    primary: false
                }),

                surname: ColumnInfo.make({
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true,
                    primary: false
                })
            };

            var diffs = migrations.diffInfos(left, right);
            diffs.removed.should.be.deep.equal(['name']);
            JSON.parse(JSON.stringify(diffs.changed)).should.be.deep.equal({
                 description: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 55,
                    nullable: true,
                    primary: false
                },
            });

            JSON.parse(JSON.stringify(diffs.inserted)).should.be.deep.equal({
                surname: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true,
                    primary: false
                }
            });
        });

    });


    describe('alterTable', function() {

        it('is defined', function() {
            migrations.alterTable.should.be.a('function');
        });

        it('return create table sql', function(done) {
            //console.dir(User.meta);
            migrations.alterTable(Role2)

            .then(function(sql){
               sql = sql.toString(); 
               var expected =
                'alter table `Role` drop `description`;\n'+
                'alter table `Role` drop `id`;\n\n'+

                'alter table `Role` add `id` varchar(255), add `name` varchar(45) null;\n'+
                'alter table `Role` add primary key role_id_primary(`id`)';

                sql.should.be.equal(expected);
                done();
            })
            .catch(done);
            
        });

    });

    describe('createTable', function() {

        it('is defined', function() {
            migrations.createTable.should.be.a('function');
        });

        it('return create table sql', function() {
            //console.dir(User.meta);
            var sql = migrations.createTable(User).toString();
            var expected =
                'create table `User` (' +
                '`username` varchar(20), ' +
                '`firstName` varchar(255) null, ' +
                '`lastName` varchar(100) null, ' +
                '`password` varchar(255), ' +
                '`age` float(8, 2), ' +
                '`born` datetime null' +
                ');\n' +
                'alter table `User` add primary key user_username_primary(`username`)';



            sql.should.be.equal(expected);
        });

    });
});
