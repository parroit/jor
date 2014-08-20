/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var methods = require('methods');
chai.expect();
chai.should();

var jor = require('../lib/jor.js');
var renderers = ['json', 'html', 'xml', 'text', 'view', 'yml'];

describe('jor', function() {
    it('is defined', function() {
        jor.should.be.a('object');
    });

     it('is fail', function() {
        jor.should.be.a('function');
    });


    describe('html methods', function() {
        methods.forEach(function(method) {
            describe(method, function() {
                it('is defined', function() {
                    jor[method].should.be.a('function');
                });

                it('decorate function', function() {

                    var fn = jor[method](function() {});
                    fn.should.be.a('function');
                    fn.jor.method.should.be.equal(method);
                });
            });
        });
    });

    describe('response rendering modes', function() {
        renderers.forEach(function(renderer) {
            describe(renderer, function() {
                it('is defined', function() {
                    jor[renderer].should.be.a('function');
                });

                it('decorate function', function() {

                    var fn = jor[renderer](function() {});
                    fn.should.be.a('function');
                    fn.jor.renderer.should.be.equal(renderer);
                });
            });
        });
    });

});
