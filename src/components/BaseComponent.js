import React from 'react';
import EventModel from '../core/EventModel';

class BaseComponent extends React.Component {

	_eventModel = new EventModel();
	_elemEvents = [];

	componentDidMount() {
		this.isInit = true;
		this.isUnmounting = false;
		this.onMount();
	}

	componentWillUnmount() {
		this.isInit = false;
		this.isUnmounting = true;
		this.unregisterAllClickEvent();
		this.onUnmount();
	}

	// override this method
	onMount() {}

	// override this method
	onUnmount() {}

	/**/
	registerClickEvent(elem, callback) {
		const comp = this;
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
		const comp = this;
		comp._elemEvents.forEach((elemEvent) => {
			elemEvent.elem.removeEventListener(elemEvent.type, elemEvent.callback);
		});
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
		return this._eventModel.on(name, fn);
	}

	off(name, fn) {
		this._eventModel.off(name, fn);
	}

	trigger(name, args) {
		this._eventModel.trigger(name, args);
	}

	unbindEvent(name) {
		const fn = this[name];
        if(fn) {
            fn();
            delete this[name];
        }
	}

}

export default BaseComponent;
