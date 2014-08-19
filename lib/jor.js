/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 andrea parodi
 * Licensed under the MIT license.
 */

'use strict';
var views = require('co-views');
var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');

var app = koa();
var render = views(__dirname + '/../views', {
    map: {
        html: 'handlebars'
    }
});

var ctrl = require('../controllers/default');
ctrl.name = 'default';
mountCtrl(app, ctrl);

app.listen(3000);


function mountAction(action, controller, router) {
    var fn = controller[action];

    if (typeof fn === 'function') {
        router.get('/' + action, function * () {
            var result = yield fn;
            var view = controller.name + '/' + action;

            this.body = yield render(view, result);
        });
    }
}

function mountCtrl(app, controller) {
    var router = new Router();
    var action;

    for (action in controller) {
        mountAction(action, controller, router);
    }

    app.use(mount('/' + controller.name, router.middleware()))
}
