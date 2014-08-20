'use strict';

function* index() {
    return { user: 'this is first plugin' };
}


module.exports = {
    index: index
};