import React from 'react';
import EventModel from '../core/EventModel';
import { debounce, throttle } from '../utils/PerfUtils';
import { getPassiveOptions } from '../utils/DOMUtils';

class BaseComponent extends React.Component {

	_eventModel = new EventModel();
	_elemEvents = [];

	componentDidMount() {
		const component = this;
		component.isViewChanged = false;
		component.isInit = true;
		component.isUnmounting = false;
		if(typeof component.updateRate === 'number' && component.updateRate > 0) {
			const updateThreshold = component.updateRate;
			function updateView(callback) {
				callback = callback || (() => {});
				component.originForceUpdate(() => {
					callback();
					component.isViewChanged = false;
				});
			};
			const postUpdateView = debounce((fn) => {
				if(component.isViewChanged) {
					updateView(fn);
				}
			}, updateThreshold + 5);
			const updateViewThrottle = throttle((fn) => {
				updateView(fn);
				postUpdateView(fn);
			}, updateThreshold);
			component._forceUpdate = (fn) => {
				component.isViewChanged = true;
				updateViewThrottle(fn);
			};
		} else {
			delete component._forceUpdate;
		}
		component.onMount();
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
	registerClickEvent(elem, fn, withOptions=false) {
		const comp = this;
		this.onTouchStart = fn;
		const options = withOptions ? getPassiveOptions() : undefined;
		elem.addEventListener('touchstart', fn, options);
		comp._elemEvents.push({
			type: 'touchstart',
			elem: elem,
			fn: fn
		});
		elem.addEventListener('mousedown', fn, options);
		comp._elemEvents.push({
			type: 'mousedown',
			elem: elem,
			fn: fn
		});
	}
	unregisterAllClickEvent() {
		const comp = this;
		comp._elemEvents.forEach((elemEvent) => {
			elemEvent.elem.removeEventListener(elemEvent.type, elemEvent.fn);
		});
		comp._elemEvents = [];
	}
	/**/

	setState(state, fn) {
		if(!(this.isInit && !this.isUnmounting)) return;
		super.setState(state, fn);
	}

	originForceUpdate(fn) {
		super.forceUpdate(fn);
	}

	_forceUpdateHandler(fn) {
		if(this._forceUpdate) {
			this._forceUpdate(fn);
		} else {
			this.originForceUpdate(fn);
		}
	}

	forceUpdate(fn) {
		if(!(this.isInit && !this.isUnmounting)) return;
		this._forceUpdateHandler(fn);
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
