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

var engine = require('../../../engine/lib/jor-engine.js');
var path = require('path');

describe('model', function() {

    before(function(done) {
        engine.on('databasesLoaded',function(){
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

        before(function() {
            Role = engine.model.Role;
        });
    });


});
