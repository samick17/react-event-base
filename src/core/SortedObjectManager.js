import ObjectManager from './ObjectManager';
import { map, forEach, forEachAsync } from '../utils/ObjectUtils';

class SortedObjectManager extends ObjectManager {

	constructor(data) {
		super(data);
		this._indices = [];
	}

	get objectOrders() {
		return this._indices;
	}

	canAddObject(objId, object, index) {
        const isInInObjects = this.containsId(objId);
        return !isInInObjects && (typeof index === 'undefined' || (typeof index === 'number' && index >= 0 && index <= this._indices.length));
    }

	doOnAddObject(objId, object, index) {
		if(typeof index === 'number') {
			this._indices.splice(index, 0, objId);
		} else {
			this._indices.push(objId);
		}
	}

	doOnRemoveObject(objId) {
		const index = this._indices.indexOf(objId);
		if(index >= 0) {
			this._indices.splice(index, 1);
		}
	}

	clear() {
		super.clear();
		this._indices = [];
	}

	removeByIndex(index) {
		const id = this._indices[index];
		return this.removeById(id);
	}

	getObjectIds() {
		return this.objectOrders;
	}

	getByIndex(index) {
		const id = this._indices[index];
		return this._objects[id];
	}

	indexOf(object) {
		const objId = object.getId();
		return this._indices.indexOf(objId);
	}

	setObjectIndex(object, newIndex) {
		const objId = object.getId();
		if(this.containsId(objId) && newIndex >= 0 && newIndex < this.length) {
			const objIndex = this._indices.indexOf(objId);
			this._indices.splice(objIndex, 1);
			this._indices.splice(newIndex, 0, objId);
		}
	}

	forEach(callback) {
		return forEach(this._indices, (id, key, index) => {
			const object = this._objects[id];
			object && callback(object, id, index);
		});
	}

	forEachAsync(callback) {
		return forEachAsync(this._indices, async(id, key, index) => {
			const object = this._objects[id];
			object && await callback(object, id, index);
		});
	}

	forEachReversed(callback) {
		forEach([...this._indices].reverse(), (id, key, index) => {
			const object = this._objects[id];
			return object && callback(object, id, index);
		});
	}

	map(callback) {
		return map(this._indices, id => {
			return callback(this._objects[id], id);
		});
	}

	reload(objectManager) {
        this._clear();
        this.addAll(objectManager.objects);
        this._length = objectManager._length;
        this._indices = objectManager._indices.slice();
    }

}

export default SortedObjectManager;
