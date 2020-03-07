const triggerEventsAsync = async ({target, eventArray, args}) => {
    for(let i in eventArray) {
        let fn = eventArray[i];
        await fn.apply(target, args);
    }
}

class EventModel {
    constructor(data) {
        this._events = {};
        Object.assign(this, data);
    }

    _on(name, fn) {
        let eventArray = this._events[name];
        if(!eventArray) {
            eventArray = this._events[name] = [];
        }
        eventArray.push(fn);
        return () => {
            this.off(name, fn);
        };
    }

    on(arg1, argFn) {
        let typeofArg1 = typeof arg1;
        switch(typeofArg1) {
        case 'object':
            let unbindFns = [];
            for(let name in arg1) {
                let fn = arg1[name];
                unbindFns.push(this._on(name, fn));
            }
            return () => {
                unbindFns.forEach(unbindFn => {
                    unbindFn();
                });
            };
        case 'string':
            return this._on(arg1, argFn);
        default:
            throw new Error('Invalid arguments!');
        }
    }

    off(name, fn) {
        let eventArray = this._events[name];
        if(eventArray) {
            let index = eventArray.indexOf(fn);
            if(index >= 0) {
                eventArray.splice(index, 1);
            }
        }
    }

    trigger(name, args) {
        let eventArray = this._events[name];
        if(eventArray) {
            let target = this;
            triggerEventsAsync({
                target,
                eventArray,
                args
            });
        }
    }

    unbindEvent(name) {
        let fn = this[name];
        if(fn) {
            fn();
            delete this[name];
        }
    }
};

export default EventModel;
