export const NOOP = () => {};
export const createObjectTypes = (eventNames) => {
    return eventNames.reduce((m, i, j) => {
        m[i] = 't'+j.toString(16);
        return m;
    }, {});
};
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
export const forEach = (objects, callback) => {
    objects = objects || [];
    const length = objects.length;
    if(length) {
        for(let i = 0; i < length; i++) {
            if(callback(objects[i], i, i)) {
                break;
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
export const forEachAsync = async (objects, callback) => {
    return await forEach(objects, async (object, key, index) => {
        return await callback(object, key, index);
    });
};
export const findObjectBy = (objects, byFn) => {
    for(let key in objects) {
        const object = objects[key];
        if(byFn(object)) {
            return object;
        }
    }
};
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
export const clearKeys = (object) => {
    forEach(object, (_value, key) => {
        delete object[key];
    });
};
export const map = (objects, callback) => {
    objects = objects || [];
    const length = objects.length;
    let result = [];
    if(length) {
        for(let i = 0; i < length; i++) {
            result.push(callback(objects[i], i));
        }
    } else {
        for(let i in objects) {
            result.push(callback(objects[i], i));
        }
    }
    return result;
};
export const mapAsync = async (objects, callback) => {
    objects = objects || [];
    const length = objects.length;
    let result = [];
    if(length) {
        for(let i = 0; i < length; i++) {
            result.push(await callback(objects[i], i));
        }
    } else {
        for(let i in objects) {
            result.push(await callback(objects[i], i));
        }
    }
    return result;
};
export const mapToObject = (objects, callback) => {
    objects = objects || [];
    const length = objects.length;
    let result = {};
    if(length) {
        for(let i = 0; i < length; i++) {
            let data = callback(objects[i], i);
            result[data.key] = data.value;
        }
    } else {
        for(let i in objects) {
            let data = callback(objects[i], i);
            result[data.key] = data.value;
        }
    }
    return result;
};
export const countIf = (objects, byFn) => {
    let count = 0;
    forEach(objects, object => {
        if(byFn(object)) {
            count++;
        }
    });
    return count;
};
export const filter = (objects, filterFn) => {
    const result = [];
    forEach(objects, object => {
        if(filterFn(object)) {
            result.push(object);
        }
    });
    return result;
};
export const cloneData = (data) => {
    return JSON.parse(JSON.stringify(data));
};
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
export const alias = (model, fnAlias) => {
    forEach(fnAlias, (value, key) => {
        model[value] = function() {
            return delegate(model, key, arguments);
        };
    });
};
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
export const exportMethodsBy = (target, fnNames, fn) => {
    forEach(fnNames, fnName => {
        target[fnName] = function() {
            return fn(fnName, arguments);
        };
    });
    return target;
};
export const exportAllMethodsBy = (target, source, byFn) => {
    forEach(source, (_, fnName) => {
        target[fnName] = function() {
            return byFn(fnName, arguments);
        };
    });
    return target;
};
export const cloneDeep = (object) => {
    const cloneValue = (value) => {
        const typeOfVal = typeof value;
        switch(typeOfVal) {
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
