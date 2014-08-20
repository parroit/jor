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

var jor = require('../lib/jor.js');

describe('jor', function(){
    it('is defined', function(){
      jor.should.be.a('function');
    });

});
