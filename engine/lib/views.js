'use strict';

// Load Handlebars
var Handlebars = require('handlebars');
var includeFolder = require('include-folder');
var path = require('path');
var fs = require('fs');

// Register helpers
require('handlebars-layouts')(Handlebars);

exports.loadPartials = function(dirName){
    // Register partials
    
    var partialsPath = path.join(dirName,'partials');
    if (fs.existsSync(partialsPath)) {
        var partials = includeFolder(partialsPath);
        var partialName;

        for (partialName in partials) {
            Handlebars.registerPartial(partialName, partials[partialName]);    
        }
    
    }
    
    

};
