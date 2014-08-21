'use strict';



var jor = require('jor');

function* layout() {
    return { user: 'this is layout' };
}

function* index() {
    return { text: 'text' };
}


function* testPost() {
    //jshint validthis: true
    return { result: this.request.body.toString('utf8') };
}



module.exports = {
    layout: layout,
    index: index,
    testPost: jor.post(testPost)
};