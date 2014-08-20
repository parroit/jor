/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 andrea parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var jor = require('../lib/jor.js');
var requesty = require('requesty');

var req = requesty.new();
req.using('http://localhost:3000').get();

describe('jor', function() {
    it('is defined', function() {
        jor.should.be.a('object');
    });

    describe('when server is running', function() {
        before(function() {
            jor.start(__dirname + '/../../examples/default');
        });

        after(function() {
            jor.stop();
        });


        describe('mount default app controller', function() {

            it('respond to controllers actions', function(done) {

                req.using({
                    path: '/default/index'
                }).send()

                .then(function(res) {
                    res.data.should.be.equal('<h1> this is index </h1>\nthis is index');
                })

                .then(function(res) {
                    return req.using({
                        path: '/default/login'
                    }).send();

                })

                .then(function(res) {
                    res.data.should.be.equal('<h1> this is login </h1>\nthis is login');
                })

                .then(function(res) {
                    return req.using({
                        path: '/other/layout'
                    }).send();

                })

                .then(function(res) {
                    res.data.should.be.equal('<h1> this is layout </h1>\nthis is layout');
                    done();
                })

                .catch(done);
            });
        });

        describe('handlebars plugins', function() {


            it('layout plugins workings', function(done) {

                req.using({
                    path: '/other/index'
                }).send()

                .then(function(res) {
                    res.data.should.be.equal('text\nappended-text\ntext-prepended');
                    done();
                })


                .catch(done);
            });
        });

    });
});
