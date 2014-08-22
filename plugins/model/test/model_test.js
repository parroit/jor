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
var should = chai.should();

var engine = require('../../../engine/lib/jor-engine.js');
var path = require('path');

describe('model', function() {

    before(function(done) {
        engine.on('databasesLoaded', function() {
            
            done();
        });
        engine.start(__dirname + '/../../../examples/model-example');
    });

    after(function() {
        engine.stop();
    });

    it('init plugin on start', function() {
        engine.model.should.be.a('object');
    });

    it('init databases on start', function() {
        //console.dir(engine.model.databases)
        engine.model.databases.length.should.be.equal(1);
    });

    it('add databases to plugins', function() {
        engine.plugins[0].database.schema.should.be.a('object');
    });


    it('init models on start', function() {
        engine.model.Role.constructor.name.should.be.equal('Model');
    });

    it('add models to plugins', function() {
        engine.plugins[0].Role.constructor.name.should.be.equal('Model');
    });

    describe('Model instances', function() {
        var Role;

        before(function(done) {
            Role = engine.model.Role;
            
            Role.delete({id:42})
            .return().then(done)
            .catch(done);
        });

        it('save schema', function() {
            Role.schema.meta.name.should.be.equal('Role');
        });

        it('could discover key field', function() {
            Role._key().should.be.equal('id');
        });

        it('save db', function() {
            Role.db.schema.should.be.a('object');
        });

        it('select rows', function(done) {
            Role.select()

            .then(function(set) {
                set.length.should.be.equal(1);
                //set[0].schema.meta.should.be.a('object');
                done();
            })

            .catch(done);
        });

        it('get by keys', function(done) {
            Role.get(1)

            .then(function(role) {
                role.id.should.be.equal(1);
                done();
            })

            .catch(done);
        });

        it('get return undefined if not found', function(done) {
            Role.get(12)

            .then(function(role) {
                should.equal(role, undefined);
                done();
            })

            .catch(done);
        });

        it('where rows', function(done) {
            Role.select({
                id: 12
            })

            .then(function(set) {
                set.length.should.be.equal(0);
                //set[0].schema.meta.should.be.a('object');
                done();
            })

            .catch(done);
        });

        it('where rows raw', function(done) {
            Role.select('id > 12')

            .then(function(set) {
                set.length.should.be.equal(0);
                //set[0].schema.meta.should.be.a('object');
                done();
            })

            .catch(done);
        });

        it('insert instances', function(done) {
            Role.get(42)

            .then(function(role) {
                should.equal(role, undefined);
                
            })

            .then(function() {
                return Role.save({
                    id:42,
                    description: 'testing'

                });
            })

            .then(function() {
                return Role.get(42);
            })

            .then(function(role) {
                role.id.should.be.equal(42);
                role.description.should.be.equal('testing');
                done();
            })


            .catch(done);
        });

         it('update instances', function(done) {
            Role.get(42)

            .then(function(role) {
               role.id.should.be.equal(42);
                
            })

            .then(function() {
                return Role.save({
                    id:42,
                    description: 'changed'

                });
            })

            .then(function() {
                return Role.get(42);
            })

            .then(function(role) {
                role.id.should.be.equal(42);
                role.description.should.be.equal('changed');
                done();
            })

            .catch(done);
        });


         it('delete instances', function(done) {
            Role.get(42)
             
             .then(function(role) {
               role.id.should.be.equal(42);
                
            })
            
            .then(function() {
                return Role.delete({
                    id:42
                });
            })

            .then(function() {
                return Role.get(42);
            })
                
            .then(function(role) {
                should.equal(role, undefined);
                done();    
            })
            
            .catch(done);
        });
    });


});
