/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 andrea parodi
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs');
var Router = require('koa-router');
var mount = require('koa-mount');
var requireDir = require('require-dir');
var koaBody = require('koa-body')();
var renderers = requireDir(__dirname + '/renderers');
var serveStatic = require('koa-static');


function mountStaticFiles(engine, plugin) {
    var staticFolder = plugin.dirName + '/static';

    if (fs.existsSync(staticFolder)) {
        engine.koa.use(mount(plugin.mountPoint, serveStatic(staticFolder)));
    }

}

function mountControllers(engine, plugin) {
    var ctrlsFolder = plugin.dirName + '/controllers';
    if (fs.existsSync(ctrlsFolder)) {
        var ctrls = requireDir(ctrlsFolder);

        var ctrl, ctrlName;
        for (ctrlName in ctrls) {
            ctrl = ctrls[ctrlName];
            ctrl.name = ctrlName;
            mountCtrl(engine.koa, ctrl, plugin.dirName, plugin.mountPoint);
        }
    }
}

function responder(controller, action, dirName) {
    var fn = controller[action];

    return function * () {
        var result = yield fn;

        var route = controller.name + '/' + action;
        var rendererName = (fn.jor && fn.jor.renderer) || 'view';
        var renderer = renderers[rendererName];
        var renderResults = renderer(dirName, route, result);
        this.set('content-type', renderResults.type);
        this.body = yield renderResults.body;
    };
}

function mountAction(action, controller, router, dirName) {
    var fn = controller[action];

    if (typeof fn === 'function') {
        var method = (fn.jor && fn.jor.method) || 'get';
        var route = router[method].bind(router);
        if (~['post', 'put', 'patch'].indexOf(method)) {
            route('/' + action, koaBody, responder(controller, action, dirName));
        } else {
            route('/' + action, responder(controller, action, dirName));
        }

    }
}

function mountCtrl(app, controller, dirName, mountPoint) {
    var router = new Router();
    var action;

    for (action in controller) {
        mountAction(action, controller, router, dirName);
    }

    if (mountPoint[mountPoint.length - 1] !== '/') {
        mountPoint += '/';
    }
    mountPoint += controller.name;

    //console.log('mountPoint for %s : %s', controller.name, mountPoint);
    app.use(mount(mountPoint, router.middleware()));
}

module.exports = {
    mountControllers: mountControllers,
    mountStaticFiles: mountStaticFiles
};
