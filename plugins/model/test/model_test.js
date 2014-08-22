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

var modelInit = require('../index');

/*
require('../lib/migrations');


var model = {};
modelInit(model);
model.model.db.destroy();
*/

describe('modelInit', function() {
    it('is defined', function() {
       modelInit.should.be.a('function');
    });
});
