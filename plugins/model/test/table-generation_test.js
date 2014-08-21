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

var model = require('../index');


var Role = struct({
    id: key(Int),
    description: maybe(maxLength(45, Str))
}, 'Role');

var User = struct({
    username: key(maxLength(20, Str)),
    firstName: maybe(Str),
    lastName: maybe(maxLength(100, Str)),
    password: Str,
    age: Num,
    born: maybe(Dat)
}, 'User');


describe('model', function() {
    it('is defined', function() {
        model.should.be.a('object');
    });

    describe('tableInfo', function() {

        it('is defined', function() {
            model.tableInfo.should.be.a('function');
        });

        it('return info from table', function(done) {
            model.tableInfo(Role)
                .then(function(columns) {
                    columns.should.be.deep.equal({
                        id: {
                            defaultValue: null,
                            type: 'int',
                            maxLength: null,
                            nullable: false
                        },
                        description: {
                            defaultValue: null,
                            type: 'varchar',
                            maxLength: 45,
                            nullable: true
                        }
                    });
                })
                .return().then(done)
                .catch(done);

        });

    });

    describe('typeInfo', function() {

        it('is defined', function() {
            model.typeInfo.should.be.a('function');
        });

        it('return info from object', function(done) {
            model.typeInfo(Role)
                .then(function(columns) {
                    columns = JSON.parse(JSON.stringify(columns))
                    columns.should.be.deep.equal({
                        id: {
                            defaultValue: null,
                            type: 'int',
                            maxLength: null,
                            nullable: false
                        },
                        description: {
                            defaultValue: null,
                            type: 'varchar',
                            maxLength: 45,
                            nullable: true
                        }
                    });
                    done();
                })
                .catch(done);

        });

    });

    describe('diffInfos', function() {

        it('is defined', function() {
            model.diffInfos.should.be.a('function');
        });

        it('return diff between two infos', function() {
            var left = {
                id: {
                    defaultValue: null,
                    type: 'int',
                    maxLength: null,
                    nullable: false
                },
                description: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true
                },
                name: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true
                }

            };

            var right = {
                id: model.ColumnInfo.make({
                    defaultValue: null,
                    type: 'int',
                    maxLength: null,
                    nullable: false
                }),

                description: model.ColumnInfo.make({
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 55,
                    nullable: true
                }),

                surname: model.ColumnInfo.make({
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true
                })
            };

            var diffs = model.diffInfos(left, right);
            diffs.removed.should.be.deep.equal(['name']);
            JSON.parse(JSON.stringify(diffs.changed)).should.be.deep.equal({
                 description: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 55,
                    nullable: true
                },
            });
            
            JSON.parse(JSON.stringify(diffs.inserted)).should.be.deep.equal({
                surname: {
                    defaultValue: null,
                    type: 'varchar',
                    maxLength: 45,
                    nullable: true
                }
            });
        });

    });



    describe('createTable', function() {

        it('is defined', function() {
            model.createTable.should.be.a('function');
        });

        it('return create table sql', function() {
            //console.dir(User.meta);
            var sql = model.createTable(User).toString();
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
