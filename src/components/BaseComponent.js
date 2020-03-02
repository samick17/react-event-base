import React from 'react';
import BaseModel from '../core/BaseModel';

class BaseComponent extends React.Component {

	eventSubject = new BaseModel();
	_elemEvents = [];

	componentDidMount() {
		this.isInit = true;
	}

	componentWillUnmount() {
		this.isUnmounting = true;
		this.unregisterAllClickEvent();
	}

	/**/
	registerClickEvent(elem, callback) {
		let comp = this;
		comp.onClick = (evt) => {
			evt.stopPropagation();
			evt.preventDefault();
			comp.launch();
			return false;
		}
		this.onTouchStart = callback;
		elem.addEventListener('touchstart', callback);
		comp._elemEvents.push({
			type: 'touchstart',
			elem: elem,
			callback: callback
		});
		elem.addEventListener('mousedown', callback);
		comp._elemEvents.push({
			type: 'mousedown',
			elem: elem,
			callback: callback
		});
	}
	unregisterAllClickEvent() {
		let comp = this;
		comp._elemEvents.forEach((elemEvent) => {
			elemEvent.elem.removeEventListener(elemEvent.type, elemEvent.callback);
		})
		comp._elemEvents = [];
	}
	/**/

	setState(state, callback) {
		if(!(this.isInit && !this.isUnmounting)) return;
		super.setState(state, callback);
	}

	forceUpdate(callback) {
		if(!(this.isInit && !this.isUnmounting)) return;
		super.forceUpdate(callback);
	}

	on(name, fn) {
		return this.eventSubject.on(name, fn);
	}

	off(name, fn) {
		this.eventSubject.off(name, fn);
	}

	trigger(name, args) {
		this.eventSubject.trigger(name, args);
	}

	unbindEvent(name) {
		let fn = this[name];
        if(fn) {
            fn();
            delete this[name];
        }
	}

}

export default BaseComponent;
