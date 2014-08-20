/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 andrea parodi
 * Licensed under the MIT license.
 */

'use strict';
var coViews = require('co-views');
var views = require('./views');
var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');
var requireDir = require('require-dir');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');


var app = koa();

function start(dirName) {
    /* jshint validthis:true */
    mountPlugin(app, dirName);
    this.server = app.listen(3000);

    var configFile = path.join(dirName,'jor.yml');
    this.config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    console.dir(this.config);
}

function stop() {
    /* jshint validthis:true */
    this.server.close();
}

module.exports = {
    app: app,
    start: start,
    stop: stop
};


function mountPlugin(app, dirName) {
    var ctrls = requireDir(dirName + '/controllers');
    var ctrl, ctrlName;
    var render = coViews(dirName + '/views', {
        map: {
            html: 'handlebars'
        }
    });
    views.loadPartials(dirName);
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
