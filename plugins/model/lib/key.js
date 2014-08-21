'use strict';

function addMetaProps(Type, props) {
    mixin(Type.meta, props);
    return Type;
}

/**
      ### id(T, [name])
  
      ```javascript
      var Id = id(Num);
      ```
  **/
function key(Type, name) {
    return addMetaProps(
        subtype(Type, function(x) {
            if (typeof x === 'number') {
                return x > 0;
            }

            if (typeof x === 'string') {
                return x !== '';
            }

            return false;
        }, name), {
            key: true
        }
    );
}

module.exports = key;