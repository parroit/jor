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

function shouldRespond(path, expect, body, responseType) {
    responseType = responseType || 'text/html';

    return function() {

        return req.using({
            path: path
        }).send(body)

        .then(function(res) {

            res.headers['content-type'].should.be.equal(responseType);
            res.data.should.be.deep.equal(expect);
        });

    };

}

describe('jor', function() {
    it('is defined', function() {
        jorEngine.should.be.a('object');
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

        it('render json', function(done) {
            shouldRespond('/other/testJSON',  {result:'test',arr:[1,2,3]}, undefined, 'application/json')()

            .return().then(done)

            .catch(done);
        });

        it('render yaml', function(done) {
            shouldRespond('/other/testYaml',  'result: test\narr:\n  - 1\n  - 2\n  - 3\n', undefined, 'application/x-yaml')()

            .return().then(done)

            .catch(done);
        });

        it('render text', function(done) {
            shouldRespond('/other/testText', 'testText', undefined, 'text/plain')()

            .return().then(done)

            .catch(done);
        });

        it('render xml', function(done) {
            shouldRespond('/other/testXML', '<result>test</result><arr><a>1</a><a>2</a><a>3</a></arr>', undefined, 'application/xml')()

            .return().then(done)

            .catch(done);
        });

        describe('post method', function() {
            before(function() {
                req.headers({
                    'content-type':'application/json'
                });
                req.post();
            });

            after(function() {
                req.get();
            });

            it('respond to post method', function(done) {
                shouldRespond('/other/testPost', 'var-value', '"var-value"')()

                .return().then(done)

                .catch(done);
            });

        });


        it('accept controller returning promises', function(done) {
            shouldRespond('/other/testPromise', 'testText', undefined, 'text/plain')()

            .return().then(done)

            .catch(done);
        });

        it('mount static folder', function(done) {
            shouldRespond('/test.txt', 'test.txt', undefined, 'text/plain')()

            .return().then(done)

            .catch(done);
        });

         it('accept controller rejecting promises', function(done) {

            req.using({
                path: '/other/failPromise'
            }).send()

            .then(function(res) {
                done(new Error('should respond with 500 error'));
            })
            
            .catch(function(err){
                err.statusCode.should.be.equal(500);
                done();
            });
        });
    });
});
