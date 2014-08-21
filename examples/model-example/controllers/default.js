'use strict';

function* index() {
    return { user: 'this is index' };
}


function* login() {
    return { user: 'this is login' };
}


module.exports = {
    index: index,
    login: login
};