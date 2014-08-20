'use strict';


function* layout() {
    return { user: 'this is layout' };
}

function* index() {
    return { text: 'text' };
}



module.exports = {
    layout: layout,
    index: index
};