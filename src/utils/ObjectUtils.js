/*
 * @category: static function
 * @name: NOOP
 * @description: Empty function
 * @returns: No return value
 */
export const NOOP = () => {};
/*
 * @category: static function
 * @description: Create objects types from string array
 * @name: createObjectTypes
 * @param: {Array} objectNames - The keys of object
 * @returns: {Object} - The Objects types
 * @example:
 * const ObjectTypes = createObjectTypes([
 *   'Circle',
 *   'Triangle',
 * ]);
 */
export const createObjectTypes = (objectNames) => {
    return objectNames.reduce((m, i, j) => {
        m[i] = 't'+j.toString(16);
        return m;
    }, {});
};
/*
 * @category: static function
 * @description: Object to array
 * @name: toArray
 * @param: {Object} mapObject - The object
 * @returns: {Array} - The values of object
 * @example:
 * const arr = toArray({
 *   a: '22',
 *   b: '33'
 * });
 * // arr is ['22', '33']
 */
export const toArray = (mapObject) => {
    let array = [];
    for(let i in mapObject) {
        array.push(mapObject[i]);
    }
    return array;
};
const _doForEachObjects = (objects, callback, fromIndex=0, endIndex) => {
    if(callback) {
        const length = objects.length;
        endIndex = endIndex || length;
        if(length) {
            for(let i = fromIndex; i < endIndex; i++) {
                callback(objects[i], i);
            }
        } else {
            let index = 0;
            for(let i in objects) {
                if(index >= fromIndex && index < endIndex) {
                    callback(objects[i], i);
                }
                index++;
            }
        }
    }
};
/*
 * @category: static function
 * @description: For each by range
 * @name: forEachRange
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: {Object} - The iteration instance
 * @example:
 * forEachRange({
 *   a: '22',
 *   b: '33'
 * })
 * .from(0)
 * .to(0)
 * .do(() => {});
 */
export const forEachRange = (objects, callback) => {
    objects = objects || [];
    _doForEachObjects(objects, callback);
    let startIndex = 0;
    let endIndex = Object.keys(objects).length;
    let instance = {
        from: (index) => {
            startIndex = index;
            return instance;
        },
        to: (index) => {
            endIndex = index;
            return instance;
        },
        do: (callback) => {
            _doForEachObjects(objects, callback, startIndex, endIndex);
        }
    };
    return instance;
};
/*
 * @category: static function
 * @description: The for-each function for Array/Object instance
 * @name: forEach
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: No return value
 * @example:
 * forEach({
 *   a: '22',
 *   b: '33'
 * }, (value, key, index) => {
 *   // return true to interrupt the for-loop. 
 * });
 */
export const forEach = (objects, callback) => {
    if(objects === null || typeof objects === 'undefined') return;
    if(Array.isArray(objects) || (objects instanceof NodeList)) {
        const length = objects.length;
        if(length) {
            for(let i = 0; i < length; i++) {
                if(callback(objects[i], i, i)) {
                    break;
                }
            }
        }
    } else {
        let index = 0;
        for(let i in objects) {
            if(callback(objects[i], i, index)) {
                break;
            }
            index++;
        }   
    }
};
/*
 * @category: static function
 * @description: The for-each async function for Array/Object instance
 * @name: forEachAsync
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: No return value
 * @example:
 * forEachAsync({
 *   a: '22',
 *   b: '33'
 * }, async (value, key, index) => {
 *   // return true to interrupt the for-loop.
 * });
 */
export const forEachAsync = async (objects, callback) => {
    if(objects === null || typeof objects === 'undefined') return;
    if(Array.isArray(objects) || (objects instanceof NodeList)) {
        const length = objects.length;
        if(length) {
            for(let i = 0; i < length; i++) {
                if(await callback(objects[i], i, i)) {
                    break;
                }
            }
        }
    } else {
        let index = 0;
        for(let i in objects) {
            if(await callback(objects[i], i, index)) {
                break;
            }
            index++;
        }
    }
};
/*
 * @category: static function
 * @description: Find object by function
 * @name: findObjectBy
 * @param: {Object} objects - The object
 * @param: {Function} byFn - The function used to find matched object
 * @returns: {Any} - Matched object
 * @example:
 * findObjectBy({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return object.name === 'bar' });
 */
export const findObjectBy = (objects, byFn) => {
    for(let key in objects) {
        const object = objects[key];
        if(byFn(object)) {
            return object;
        }
    }
};
/*
 * @category: static function
 * @description: Find objects by function
 * @name: findObjectsBy
 * @param: {Object} objects - The object
 * @param: {Function} byFn - The function used to find matched objects
 * @returns: {Array\<Any\>} - Matched objects
 * @example:
 * findObjectsBy({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return !!object; });
 */
export const findObjectsBy = (objects, byFn) => {
    const matchedObjects = [];
    for(let key in objects) {
        const object = objects[key];
        if(byFn(object)) {
            matchedObjects.push(object);
        }
    }
    return matchedObjects;
};
/*
 * @category: static function
 * @description: Find object by function in reversed order
 * @name: findObjectReversedBy
 * @param: {Object} objects - The object
 * @param: {Function} byFn - The function used to find matched object
 * @returns: {Any} - Matched object
 * @example:
 * findObjectReversedBy({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return object.name === 'bar' });
 */
export const findObjectReversedBy = (objects, byFn) => {
    const keys = Object.keys(objects);
    for(let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i];
        let object = objects[key];
        if(byFn(object)) {
            return object;
        }
    }
};
/*
 * @category: static function
 * @description: Find objects by function in reversed order
 * @name: findObjectsReversedBy
 * @param: {Object} objects - The object
 * @param: {Function} byFn - The function used to find matched objects
 * @returns: {Array\<Any\>} - Matched objects
 * @example:
 * findObjectsReversedBy({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return !!object; });
 */
export const findObjectsReversedBy = (objects, byFn) => {
    const matchedObjects = [];
    const keys = Object.keys(objects);
    for(let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i];
        let object = objects[key];
        if(byFn(object)) {
            matchedObjects.push(object);
        }
    }
    return matchedObjects;
};
/*
 * @category: static function
 * @description: Clear all of the keys for object
 * @name: clearKeys
 * @param: {object} object - The object
 * @returns: No return value
 * @example:
 * clearKeys({
 *   name: 'foo'
 * });
 */
export const clearKeys = (object) => {
    forEach(object, (_value, key) => {
        delete object[key];
    });
};
/*
 * @category: static function
 * @description: The map function for Array/Object instance
 * @name: map
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: {Array\<Any\>} - The object
 * @example:
 * map({
 *   a: '22',
 *   b: '33'
 * }, (value, key, index) => {
 *   return {
 *     name: key,
 *     data: value
 * };
 * });
 */
export const map = (objects, callback) => {
    const result = [];
    forEach(objects, (value, key, index) => {
        result.push(callback(value, key, index));
    });
    return result;
};
/*
 * @category: static function
 * @description: The map function for Array/Object instance
 * @name: mapAsync
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: {Array\<Any\>} - The object
 * @example:
 * mapAsync({
 *   a: '22',
 *   b: '33'
 * }, async (value, key, index) => {
 *   return {
 *     name: key,
 *     data: value
 * };
 * });
 */
export const mapAsync = async (objects, callback) => {
    const result = [];
    await forEachAsync(objects, async (value, key, index) => {
        const newValue = await callback(value, key, index);
        result.push(newValue);
    });
    return result;
};
/*
 * @category: static function
 * @description: The map function for Array/Object instance
 * @name: mapToObject
 * @param: {Object} objects - The object
 * @param: {Function} callback - The iteration function
 * @returns: {Object} - The object
 * @example:
 * mapToObject({
 *   a: '22',
 *   b: '33'
 * }, (value, key, index) => {
 *   return {
 *     key,
 *     value
 * };
 * });
 */
export const mapToObject = (objects, callback) => {
    const result = {};
    forEach(objects, (value, key, index) => {
        const newValue = callback(value, key, index);
        result[newValue.key] = newValue.value;
    });
    return result;
};
/*
 * @category: static function
 * @description: Count objects by function
 * @name: countIf
 * @param: {Object} objects - The object
 * @param: {Function} byFn - The function used to find matched object
 * @returns: {Number} - Count of matched object
 * @example:
 * countIf({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return object.name === 'bar' });
 */
export const countIf = (objects, byFn) => {
    let count = 0;
    forEach(objects, object => {
        if(byFn(object)) {
            count++;
        }
    });
    return count;
};
/*
 * @category: static function
 * @description: Filter objects by function
 * @name: filter
 * @param: {Object} objects - The object
 * @param: {Function} filterFn - The function used to find matched object
 * @returns: {Array\<Any\>} - The filtered array
 * @example:
 * filter({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * }, (object) => { return object.name === 'bar' });
 */
export const filter = (objects, filterFn) => {
    const result = [];
    forEach(objects, object => {
        if(filterFn(object)) {
            result.push(object);
        }
    });
    return result;
};
/*
 * @category: static function
 * @description: Clone the data by JSON
 * @name: cloneData
 * @param: {Object} data - The object
 * @returns: {Object} - The cloned data
 * @example:
 * const cloned = cloneData({
 *   name: 'foo'
 * },{
 *   name: 'bar'
 * });
 */
export const cloneData = (data) => {
    return JSON.parse(JSON.stringify(data));
};
/*
 * @category: static function
 * @description: Invoke the method by target, with function name, arguments
 * @name: delegate
 * @param: {Object} data - The object
 * @returns: {Any} - The return value of target[fnName]
 * @example:
 * const result = delegate(target, 'getNameById', [id]);
 */
export const delegate = (target, fnName, args) => {
    if(target) {
        try {
            const splittedFns = fnName.split('.');
            let caller = target;
            for(let i = 0; i < splittedFns.length - 1; i++) {
                let fn = splittedFns[i];
                caller = caller[fn];
            }
            const fn = splittedFns[splittedFns.length - 1];
            return caller[fn].apply(caller, args);
        } catch(err) {

        }
    }
};
/*
 * @category: static function
 * @description: Alias the functions for object
 * @name: alias
 * @param: {Object} model - The target object
 * @param: {Object} fnAlias - The alias key-value object
 * @returns: No return value
 * @example:
 * alias(target, {
 *   addObject: 'add'
 * });
 * // Now you can use target.add rather than target.addObject
 */
export const alias = (model, fnAlias) => {
    forEach(fnAlias, (value, key) => {
        model[value] = function() {
            return delegate(model, key, arguments);
        };
    });
};
/*
 * @category: static function
 * @description: Export the methods from source object to target object
 * @name: exportMethods
 * @param: {Object} target - The target object
 * @param: {Object} source - The source object
 * @param: {Array\<string\>} fnNames - The target object
 * @returns: {Object} - The instance for exportedMethod
 * @example:
 * // source.getObject();
 * exportMethods(target, source, [
 *   'addObject',
 * ]);
 * // Now you can use target.getObject() rather than source.getObject();
 */
export const exportMethods = (target, source, fnNames) => {
    forEach(fnNames, fnName => {
        target[fnName] = function() {
            return delegate(source, fnName, arguments);
        };
    });
    return {
        setSource: (srcObject) => {
            source = srcObject;
        }
    };
};
/*
 * @category: static function
 * @description: Export the methods by function
 * @name: exportMethodsBy
 * @param: {Object} target - The target object
 * @param: {Array\<string\>} fnNames - The function names to export
 * @param: {Function} fn - The export method
 * @returns: {Object} - target
 * @example:
 * exportMethodsBy(target, fnNames, (fnName, args) => {
 *   // TODO delegate the method
 * });
 */
export const exportMethodsBy = (target, fnNames, fn) => {
    forEach(fnNames, fnName => {
        target[fnName] = function() {
            return fn(fnName, arguments);
        };
    });
    return target;
};
/*
 * @category: static function
 * @description: Export all of the methods by source object
 * @name: exportAllMethodsBy
 * @param: {Object} target - The target object
 * @param: {Object} source - The source object
 * @param: {Function} byFn - The export method
 * @returns: {Object} - target
 * @example:
 * exportAllMethodsBy(target, fnNames, (fnName, args) => {
 *   // TODO delegate the method
 * });
 */
export const exportAllMethodsBy = (target, source, byFn) => {
    forEach(source, (_, fnName) => {
        target[fnName] = function() {
            return byFn(fnName, arguments);
        };
    });
    return target;
};
/*
 * @category: static function
 * @description: Clone the object deeply
 * @name: cloneDeep
 * @param: {Object} object - The object used to clone
 * @returns: {Object} - The cloned object
 * @example:
 * cloneDeep({});
 */
export const cloneDeep = (object) => {
    const cloneValue = (value) => {
        const typeOfVal = typeof value;
        switch(typeOfVal) {
            case 'undefined':
                // do nothing
            break;
            case 'string':
            case 'number':
            case 'boolean':
            return value;
            case 'object':
            if(value === null || value === undefined) {
                // do nothing
            } else if(Array.isArray(value)) {
                let newValue = [];
                forEach(value, v => {
                    newValue.push(cloneValue(v));
                });
                return newValue;
            } else {
                const cloned = {};
                forEach(value, (v, k) => {
                    const newVal = cloneValue(v);
                    if(typeof newVal !== 'undefined') {
                        cloned[k] = newVal;
                    }
                });
                return cloned;
            }
            break;
            default:
            break;
        }
    };
    return cloneValue(object);
};
/*
 * @category: static function
 * @description: Compare two objects deeply
 * @name: deepEqual
 * @param: {Object} object1 - The object used to compare
 * @param: {Object} object2 - The object used to compare
 * @returns: {bool} - Is equaled or not
 * @example:
 * deepEqual({foo: 'bar'}, {bar: 'foo'});
 */
export const deepEqual = (object1, object2) => {
    if(object1 === object2) {
        return true;
    } else {
        if(object1.constructor.name === object2.constructor.name && object1.constructor.name === 'Object') {
            return JSON.stringify(object1) === JSON.stringify(object2);
        } else {
            try {
                return JSON.stringify(object1) === JSON.stringify(object2);
            } catch(err) {
                return false;
            }
        }
    }
};
/*
 * @category: static function
 * @description: Diff two objects and return diff data
 * @name: diffTwoObjects
 * @param: {Object} objectsMap1 - The object1 used to diff
 * @param: {Object} objectsMap2 - The object2 used to diff
 * @param: {Function} getObjectId - [optional] The function used to get object id
 * @returns: {Object} - { add, {}, update: {}, remove: {} }
 * @example:
 * diffTwoObjects({}, {});
 */
export const diffTwoObjects = (objectsMap1, objectsMap2, getObjectId) => {
    const itemsAdded = {};
    const itemsUpdated = {};
    const itemsRemoved = {};
    getObjectId = getObjectId || (obj => obj.id);
    forEach(objectsMap1, object => {
        const objId = getObjectId(object);
        if(objId in objectsMap2) {
            itemsUpdated[objId] = {
                origin: object
            };
        } else {
            itemsRemoved[objId] = object;
        }
    });
    forEach(objectsMap2, object => {
        const objId = getObjectId(object);
        if(objId in objectsMap1) {
            const updatedContext = itemsUpdated[objId];
            if (updatedContext) {
                if (deepEqual(updatedContext.origin, object)) {
                    delete itemsUpdated[objId];
                } else {
                    updatedContext.new = object;
                }
            }
        } else {
            itemsAdded[objId] = object;
        }
    });
    return {
        add: itemsAdded,
        update: itemsUpdated,
        remove: itemsRemoved
    };
};
/*
 * @category: static function
 * @description: Create the handler by map
 * @name: createKeyActionHandler
 * @param: {Object} keyHandlerMap - key-function object used to handle the action
 * @returns: {Object} - { handle, apply }
 * @example:
 * const actionHandler = createKeyActionHandler({
 *   foo: (arg1, arg2) => {}
 * });
 * actionHandler
 * .handle('foo')
 * .apply('argument1', 'argument2');
 */
export const createKeyActionHandler = (keyHandlerMap) => {
    let fn;
    const actionHandler = {
        handle: function(action) {
            fn = keyHandlerMap[action] || (() => {});
            return actionHandler;
        },
        apply: function() {
            const args = arguments;
            fn.apply(args[0], args);
        }
    };
    return actionHandler;
};
/*
 * @category: static function
 * @description: format
 * @name: format
 * @param: {string} text - The string template
 * @returns: {string} - The formatted string
 * @example:
 * const str = format('{0}: {1}', 'id', '123-222');
 */
export function format(text) {
    const args = Array.from(arguments).slice(1);
    return text.replace(/{(\d+)}/g, (_matched, indexStr) => {
        let index = parseInt(indexStr, 10)
        return args[index];
    });
};
/*
 * @category: static function
 * @description: formatData
 * @name: formatData
 * @param: {string} text - The string template
 * @param: {Object} data - The text data
 * @returns: {string} - The formatted string
 * @example:
 * const str = format('ObjectID: ${id}, Name: ${name}', {id: '123-222', name: 'Example'})
 */
 export function formatData(text, data) {
    return text.replace(/\${(.*?)}/g, (_, key) => {
        return data[key] || '';
    });
 };
/*
 * @category: static function
 * @description: Convert text to upper camel case
 * @name: toUpperCamel
 * @param: {string} text - The text
 * @returns: {string} - The formatted string
 * @example:
 * const str = toUpperCamel('name');
 */
export function toUpperCamel(text) {
    return text[0].toUpperCase() + text.substring(1);
};
/*
 * @category: static function
 * @description: Calculate the length of character
 * @name: getCharacterLength
 * @param: {string} ch - The character
 * @returns: {Number} - The length of character
 * @example:
 * const lenOfN = getCharacterLength('n');
 * const lenOfSymbol = getCharacterLength('>');
 */
export const getCharacterLength = (ch) => {
    let chCode = ch.charCodeAt();
    if (chCode >= 0 && chCode <= 128) {
        return 1;
    } else {
        return 2;
    }
};
/*
 * @category: static function
 * @description: Replace text with '...' if too long
 * @name: getShortText
 * @param: {string} text - The original text
 * @param: {string} maxLength - The max length of text
 * @returns: {string} - The shortened text
 * @example:
 * const text = getShortText('n');
 */
export const getShortText = (text, maxLength) => {
    let currentLength = 0;
    let endIndex = 0;
    for (let i in text) {
        let ch = text[i];
        let chLength = getCharacterLength(ch);
        if (currentLength + chLength <= maxLength) {
            currentLength += chLength;
            endIndex++;
        } else {
            endIndex--;
            break;
        }
    }
    if (endIndex === text.length) {
        return text;
    } else {
        return text.substring(0, endIndex) + '...';
    }
};
/*
 * @category: static function
 * @description: Generate uuid
 * @name: uuid
 * @returns: {string} - The uuid
 * @example:
 * const id = uuid();
 */
export const uuid = () => {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & (0x3 | 0x8))).toString(16);
    });
};

function _genCode() {
    const d = Math.round(Math.random() * 9999999) % 10;
    if(d <= 4) {
        // 0 - 9
        const code = 48 + (Math.round(Math.random() * 9999999) % 10);
        return String.fromCharCode(code);
    } else {
        // 0 - 25
        const code = 65 + (Math.round(Math.random() * 9999999) % 26);
        return String.fromCharCode(code);
    }
}
export const genCode = (len) => {
    let code = '';
    for(let i = 0; i < len; i++) {
        code += _genCode();
    }
    return code;
};
