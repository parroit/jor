'use strict';

function* index() {
    return { user: 'this is index' };
}

function* layout() {
    return { user: 'this is layout' };
}

function* login() {
    return { user: 'this is login' };
}


module.exports = {
    index: index,
    layout: layout,
    login: login
};