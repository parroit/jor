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
var requireDir = require('require-dir');

var app = koa();

var render = views(__dirname + '/../views', {
    map: {
        html: 'handlebars'
    }
});

mountAllCtrls(app);
app.listen(3000);


function mountAllCtrls(app) {
    var ctrls = requireDir('../controllers');
    var ctrl, ctrlName;
    for (ctrlName in ctrls) {
        ctrl = ctrls[ctrlName];
        ctrl.name = ctrlName;
        mountCtrl(app, ctrl);
    }
}

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
