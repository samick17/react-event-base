import Draggable from './Draggable';

const updateDropZones = (touchObject, advancedDraggable) => {
	let dropzones = advancedDraggable.dropzones;
	for(let i = 0; i < dropzones.length; i++) {
		let dropzone = dropzones[i];
		if(dropzone.containsPoint(touchObject.current)) {
			if(touchObject.lastDropZone && touchObject.lastDropZone !== dropzone) {
				touchObject.lastDropZone.leave(touchObject);
				touchObject.lastDropZone = undefined;
			}
			if(touchObject.lastDropZone !== dropzone) {
				touchObject.source = advancedDraggable.srcValue;
				dropzone.enter(touchObject);
				touchObject.lastDropZone = dropzone;
			}
			return;
		}
	}
	if(touchObject.lastDropZone) {
		touchObject.lastDropZone.leave(touchObject);
		touchObject.lastDropZone = undefined;
	}
};

class AdvacedDraggable {
	constructor(elem) {
		this.dropzones = [];
		let touchObjectMap = this.touchObjectMap = {};
		this.srcValue = undefined;
		this.unbindDraggableEvent = Draggable(elem, {
			onStart: (point, context) => {
				let touchId = context.id;
				touchObjectMap[touchId] = {
					start: point,
					current: point,
					lastDropZone: undefined
				};
			},
			onDrag: (point, context) => {
				let touchId = context.id;
				let touchObject = touchObjectMap[touchId];
				if(touchObject) {
					touchObject.current = point;
					touchObject.isMoved = true;
					updateDropZones(touchObject, this);
					if(touchObject.lastDropZone) {
						touchObject.lastDropZone.move(touchObject);
					}
				}
			},
			onEnd: (point, context) => {
				let touchId = context.id;
				let touchObject = touchObjectMap[touchId];
				if(touchObject) {
					updateDropZones(touchObject, this);
					if(touchObject.lastDropZone) {
						touchObject.lastDropZone.drop(touchObject);
					}
				}
				delete touchObjectMap[touchId];
			}
		});
		this._unbindRemoveEvents = [];
	}

	unbind() {
		this.unbindDraggableEvent();
	}

	addDropZone(dropzone) {
		this.dropzones.push(dropzone);
		let unbindRemoveEvent = dropzone.on('remove', () => {
			this.dropzones.remove(dropzone);
			unbindRemoveEvent();
			this._unbindRemoveEvents.remove(unbindRemoveEvent);
		});
		this._unbindRemoveEvents.push(unbindRemoveEvent);
		return this;
	}

	addDropZones(dropzones) {
		if(Array.isArray(dropzones)) {
			dropzones.forEach((dropzone) => {
				this.addDropZone(dropzone);
			});
		}
		return this;
	}

	setDropZones(dropzones) {
		this._unbindRemoveEvents.forEach((unbindRemoveEvent) => {
			unbindRemoveEvent();
		});
		this._unbindRemoveEvents = [];
		this.dropzones = [];
		dropzones.forEach((dropzone) => {
			this.addDropZone(dropzone);
		});
		return this;
	}

	setValue(value) {
		this.srcValue = value;
		return this;
	}

}

export const createAdvanceDraggable = (elem) => {
	return new AdvacedDraggable(elem);
};

export default AdvacedDraggable;

/*
Usage:
import Factory from '@Models/Factory'
import { createAdvanceDraggable } from '@Models/AdvancedDraggable'

// onEnter: sourceValue, context
// onMove: context
// onLeave: context
// onDrop: context

let dropzones = Factory.createDropZones([{
	x: 0,
	y: 0,
	w: 32,
	h: 32
}...], onEnterCallback, onMoveCallback, onLeaveCallback, onDropCallback)

createAdvanceDraggable(elem)
.setValue(yourDataObject)
.setDropZones(dropzones)

createAdvanceDraggable(elem)
.setValue(yourDataObject)
.addDropZones(dropzones)

createAdvanceDraggable(elem)
.setValue(yourDataObject)
.addDropZone(new DropZone(....))

createAdvanceDraggable(elem)
.setValue(yourDataObject)
.addDropZones([new DropZone(....), ...])

*/
