# [EventModel](./Core.md)

## Usage

```js

import { EventModel } from 'react-event-base/Core';

const model = new EventModel();

const unbindModelEvents = model.on({
	'addObject': (object) => {
		// do something
	},
	// ... more event handler
});
// unbind the event handlers
unbindModelEvents();

// trigger the event with args
model.trigger('addObject', [{
	id: '0',
	name: 'obj1'
}]);

```

```js

import { EventModel } from 'react-event-base/Core';
import EventUtils from 'react-event-base/EventUtils';

const Events = EventUtils([
	'addObject',
	'removeObject'
]);
const model = new EventModel();

const unbindModelEvents = model.on({
	[Events.addObject]: (object) => {
		// do something
	},
	// ... more event handler
});
// unbind the event handlers
unbindModelEvents();

// trigger the event with args
model.trigger(Events.addObject, [{
	id: '0',
	name: 'obj1'
}]);

```
