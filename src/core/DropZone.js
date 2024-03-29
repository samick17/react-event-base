import { NOOP } from '../utils/ObjectUtils';
import EventModel from './EventModel';
import IdGenerator from './IdGenerator';
import { createEventTypes } from '../utils/EventUtils';

export const Events = createEventTypes([
	'BoundingChange',
	'Enter',
	'Move',
	'Leave',
	'Drop',
	'Remove'
]);

const isPointInRect = (point, rect) => {
	return point.x >= rect.x && point.x <= rect.x + rect.w &&
	point.y >= rect.y && point.y <= rect.y + rect.h;
};

const dropZonIdGenerator = new IdGenerator();
const genId = () => {
	return dropZonIdGenerator.genId();
};

class DropZone extends EventModel {

	_id = genId();
	_jobs = [];
	_isJobRunning = false;
	_updateRectFn = NOOP;

	get id() {
		return this._id;
	}

	constructor(onEnter, onMove, onLeave, onDrop) {
		super({});
		this.rect = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};
		this.onEnter = onEnter;
		this.onMove = onMove;
		this.onLeave = onLeave;
		this.onDrop = onDrop;
	}

	setRect(x, y, w, h) {
		this.rect = {
			x: x,
			y: y,
			w: w,
			h: h
		};
		this.trigger(Events.BoundingChange);
	}

	/* setRect by element */
	_updateRect = () => {
		const element = this.linkedElement;
		const bounding = element.getBoundingClientRect();
		this.setRect(bounding.x, bounding.y, bounding.width, bounding.height);
	}

	updateRect() {
		this._updateRectFn();
	}

	link(element) {
		this.linkedElement = element;
		this._updateRectFn = this._updateRect;
		this.updateRect();
	}

	unlink() {
		this._updateRectFn = NOOP;
	}

	containsPoint(point) {
		return isPointInRect(point, this.rect);
	}

	enter(context) {
		this._jobs.push({
			callback: this.onEnter,
			args: [context]
		});
		this.executeJobs();
		this.trigger(Events.Enter, [context]);
	}

	move(context) {
		this._jobs.push({
			callback: this.onMove,
			args: [context]
		});
		this.executeJobs();
		this.trigger(Events.Move, [context]);
	}

	leave(context) {
		this._jobs.push({
			callback: this.onLeave,
			args: [context]
		});
		this.executeJobs();
		this.trigger(Events.Leave, [context]);
	}

	drop(context) {
		this._jobs.push({
			callback: this.onDrop,
			args: [context]
		});
		this.executeJobs();
		this.trigger(Events.Drop, [context]);
	}

	executeJobs() {
		if(this._isJobRunning) return;
		else this._executeJobs();
	}

	async _executeJobs() {
		this._isJobRunning = true;
		try {
			let lenOfJobs = this._jobs.length;
			if(lenOfJobs > 0) {
				let job = this._jobs.splice(0, 1)[0];
				await job.callback.apply(this, job.args);
			}
		} catch(err) {
			console.log(err);
		} finally {
			this._isJobRunning = false;
			if(this._jobs.length > 0) {
				await this._executeJobs();
			}
		}
	}

	remove() {
		this.trigger(Events.Remove);
	}
}

export const createDropZone = ({onEnter, onMove, onLeave, onDrop}={}) => {
	return new DropZone(onEnter, onMove, onLeave, onDrop);
};
