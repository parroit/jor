'use strict';

// Load Handlebars
var Handlebars = require('handlebars');
var includeFolder = require('include-folder');
var path = require('path');

// Register helpers
require('handlebars-layouts')(Handlebars);

exports.loadPartials = function(dirName){
    // Register partials
    
    var partials = includeFolder(path.join(dirName,'partials'));
    var partialName;

    for (partialName in partials) {
        Handlebars.registerPartial(partialName, partials[partialName]);    
    }

    

};
