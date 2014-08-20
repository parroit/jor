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

var jorEngine = require('../lib/jor-engine.js');
var requesty = require('requesty');

var req = requesty.new();
req.using('http://localhost:3000').get();

function shouldRespond(path, expect) {
    return function() {

        return req.using({
            path: path
        }).send()

        .then(function(res) {
            res.data.should.be.equal(expect);
        });

    };

}

describe('jor', function() {
    it('is defined', function() {
        jorEngine.should.be.a('object');
    });

     it('is fail', function() {
        jorEngine.should.be.a('function');
    });
    describe('when server is running', function() {
        before(function() {
            jorEngine.start(__dirname + '/../../examples/default');
        });

        after(function() {
            jorEngine.stop();
        });



        it('mount default app controller', function(done) {

            shouldRespond('/default/index', '<h1> this is index </h1>\nthis is index')()

            .then(shouldRespond('/default/login', '<h1> this is login </h1>\nthis is login'))

            .then(shouldRespond('/other/layout', '<h1> this is layout </h1>\nthis is layout'))
                .return().then(done)

            .catch(done);
        });

        describe('install handlebars plugins', function() {

            it('layout plugins is working', function(done) {
                shouldRespond('/other/index', 'text\nappended-text\ntext-prepended')()

                .return().then(done)

                .catch(done);
            });
        });

        it('install local plugins', function(done) {
            shouldRespond('/first/default/index', '<h1> this is first plugin </h1>\nthis is first plugin')()

            .return().then(done)

            .catch(done);
        });

        it('install node_modules plugins', function(done) {
            shouldRespond('/second/default/index', '<h1> this is second plugin </h1>\nthis is second plugin')()

            .return().then(done)

            .catch(done);
        });



    });
});
