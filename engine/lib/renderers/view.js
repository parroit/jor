'use strict';

var coViews = require('co-views');
var views = require('../views');

module.exports = function renderView(dirName, route, results){
    var render = coViews(dirName + '/views', {
        map: {
            html: 'handlebars'
        }
    });
    views.loadPartials(dirName);
    //var view = controller.name + '/' + action;

    return render(route, results);
}