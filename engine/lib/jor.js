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


module.exports = {
    app: app,
    start: function(){
        mountPlugin(app, __dirname +'/../../examples/default');
        app.listen(3000);
       
    }
};


function mountPlugin(app, dirName) {
    var ctrls = requireDir(dirName + '/controllers');
    var ctrl, ctrlName;
    var render = views(dirName + '/views', {
        map: {
            html: 'handlebars'
        }
    });

    for (ctrlName in ctrls) {
        ctrl = ctrls[ctrlName];
        ctrl.name = ctrlName;
        mountCtrl(app, ctrl, render);
    }
}

function mountAction(action, controller, router, render) {
    var fn = controller[action];

    if (typeof fn === 'function') {
        router.get('/' + action, function * () {
            var result = yield fn;
            var view = controller.name + '/' + action;

            this.body = yield render(view, result);
        });
    }
}

function mountCtrl(app, controller, render) {
    var router = new Router();
    var action;

    for (action in controller) {
        mountAction(action, controller, router, render);
    }

    app.use(mount('/' + controller.name, router.middleware()));
}
