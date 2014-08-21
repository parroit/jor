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

function* testJSON() {
    return { result: 'test', arr:[1,2,3] };
}

function* testYaml() {
    return { result: 'test', arr:[1,2,3] };
}



function* testXML() {
    return [ {result: 'test'}, {arr:[{a:1},{a:2},{a:3}] } ];
}



function* testText() {
    return 'testText';
}


function* testPromise() {
    return new Promise(function(resolve,reject){
        resolve('testText');
    });
}


function* failPromise() {
    return new Promise(function(resolve,reject){
        reject(new Error('rejected promise'));
    });

}




module.exports = {
    layout: layout,
    index: index,
    testPost: jor.post(testPost),
    testJSON: jor.json(testJSON),
    testYaml: jor.yaml(testYaml),
    testText: jor.text(testText),
    testPromise: jor.text(testPromise),
    failPromise: jor.text(failPromise),
    testXML: jor.xml(testXML)
};