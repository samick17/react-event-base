import EventModel from './EventModel';
import { map, forEach, forEachAsync, delegate, filter } from '../utils/ObjectUtils';

class ObjectManager extends EventModel {

    constructor(data) {
        super(data);
        this._clear();
    }

    get objects() {
        return this._objects;
    }

    get length() {
        return this._length;
    }

    _add(objId, object, index) {
        if(this.canAddObject(objId, object, index)) {
            this._objects[objId] = object;
            this._length++;
            this.doOnAddObject(objId, object, index);
        } else {
            console.log('Cannot add object', objId, object, index);
        }
    }

    canAddObject(objId, object, index) {
        const isInInObjects = this.containsId(objId);
        return !isInInObjects;
    }

    doOnAddObject(objId, object, index) {
    }
    doOnRemoveObject(objId) {}

    add(object, index) {
        const objId = object.getId();
        this._add(objId, object, index);
    }

    addAll(objects) {
        forEach(objects, object => this.add(object));
    }

    remove(object) {
        const objId = object.getId();
        this.removeById(objId);
    }

    _removeById(id) {
        this.doOnRemoveObject(id);
        const object = this._objects[id];
        delete this._objects[id];
        this._length--;
        return object;
    }

    removeById(id) {
        if(this.containsId(id)) {
            return this._removeById(id);
        }
    }

    removeByIds(ids) {
        forEach(ids, id => {
            this.removeById(id);
        });
    }

    _clear() {
        this._length = 0;
        this._objects = {};
    }

    clear() {
        this._clear();
    }

    getById(id) {
        return this._objects[id];
    }

    getByIds(ids) {
        const objects = [];
        forEach(ids, id => {
            const object = this.getById(id);
            if(object) {
                objects.push(object);
            }
        });
        return objects;
    }

    getObjectIds() {
        return Object.keys(this._objects);
    }

    containsId(id) {
        return id in this._objects;
    }

    contains(object) {
        return this.containsId(object.getId());
    }

    update(id, data) {
        let obj = this.getById(id);
        if(obj) obj.update(data);
    }

    refresh(dataArray) {
        this._clear();
        forEach(dataArray, obj => {
            let objId = obj.getId();
            this._add(objId, obj);
        });
    }

    map(callback) {
        return map(this._objects, callback);
    }

    forEach(callback) {
        return forEach(this._objects, callback);
    }

    forEachAsync(callback) {
        return forEachAsync(this._objects, callback);
    }

    filter(byFn) {
        return filter(this._objects, byFn);
    }

    forEachReversed(callback) {
        return forEach(this._objects, callback);
    }

    getObjectsArray() {
        let objects = [];
        this.forEach(obj => {
            objects.push(obj);
        });
        return objects;
    }

    log() {
        this.forEach(obj => {
            obj.log();
        });
    }

    delegate(fn, args) {
        this.forEach(obj => {
            delegate(obj, fn, args);
        });
    }

    toJson() {
        let jsonData = {};
        this.forEach(obj => {
            if(!obj.isStatic && obj.toJson) {
                jsonData[obj.getId()] = obj.toJson();
            }
        });
        return jsonData;
    }

    // This will call "clone" function for each object
    cloneObjects() {
        return map(this.objects, object => object.clone());
    }

    reload(objectManager) {
        this._clear();
        this.addAll(objectManager.objects);
        this._length = objectManager._length;
    }

}

export default ObjectManager;
