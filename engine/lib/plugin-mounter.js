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
var Router = require('koa-router');
var mount = require('koa-mount');
var requireDir = require('require-dir');
var koaBody = require('koa-body')();

function mountPlugin(app, dirName, mountPoint) {
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
        mountCtrl(app, ctrl, render, mountPoint);
    }
}

function responder(controller, action, render) {
    var fn = controller[action];

    return function * () {
        var result = yield fn;
        var view = controller.name + '/' + action;

        this.body = yield render(view, result);
    };
}

function mountAction(action, controller, router, render) {
    var fn = controller[action];

    if (typeof fn === 'function') {
        var method = (fn.jor && fn.jor.method) || 'get';
        var route = router[method].bind(router);
        if (~['post','put','patch'].indexOf(method)) {
            route('/' + action, koaBody, responder(controller, action, render) );    
        } else {
            route('/' + action, responder(controller, action, render) );    
        }
        
    }
}

function mountCtrl(app, controller, render, mountPoint) {
    var router = new Router();
    var action;

    for (action in controller) {
        mountAction(action, controller, router, render);
    }

    if (mountPoint[mountPoint.length - 1] !== '/') {
        mountPoint += '/';
    }
    mountPoint += controller.name;

    //console.log('mountPoint for %s : %s', controller.name, mountPoint);
    app.use(mount(mountPoint, router.middleware()));
}

module.exports = mountPlugin;
