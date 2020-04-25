# react-event-base

> The event-driven and common library for React Project

[![NPM](https://img.shields.io/npm/v/reacted.svg)](https://www.npmjs.com/package/reacted) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Support the project

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/samick17)
[![Donate](https://img.shields.io/badge/Donate-BuyMeCoffee-Blue.svg)](https://www.buymeacoffee.com/samick)

## Install

```bash
npm install --save react-event-base
```

## Import module

```js
import {
	BaseComponent,
	EventUtils,
	ObjectUtils,
	DOMUtils,
	IOUtils,
	PerfUtils,
	VK,
	EventModel,
	ObjectManager,
	SortedObjectManager,
	IdGenerator,
	Mathf,
	Draggable,
	DropZone,
	AdvancedDraggable
} from 'react-event-base';
```

## Import specified module

```js
import { BaseComponent } from 'react-event-base/Components';
import { createEventTypes } from 'react-event-base/EventUtils';
import { createObjectTypes } from 'react-event-base/ObjectUtils';
import { calculateSizeByAspect } from 'react-event-base/DOMUtils';
import { getMimeTypeByArrayBuffer } from 'react-event-base/IOUtils';
import { debounce } from 'react-event-base/PerfUtils';
import { registerKeyDownEventHandlers } from 'react-event-base/VK';
import { clamp, lerp } from 'react-event-base/Mathf';
import { Draggable, DropZone, AdvancedDraggable } from 'react-event-base/DragAndDrop';
import { EventModel, ObjectManager, SortedObjectManager, IdGenerator } from 'react-event-base/Core';
```

## Docs

 - [Components](./docs/Components.md)
   - [BaseComponent](./docs/Components/BaseComponent.md)
 - [EventUtils](./docs/EventUtils.md)
 - [ObjectUtils](./docs/ObjectUtils.md)
 - [DOMUtils](./docs/DOMUtils.md)
 - [IOUtils](./docs/IOUtils.md)
 - [PerfUtils](./docs/PerfUtils.md)
 - [VK](./docs/VK.md)
 - [Mathf](./docs/Mathf.md)
 - [DragAndDrop](./docs/DragAndDrop.md)
   - [Draggable](./docs/DragAndDrop/Draggable.md)
   - [DropZone](./docs/DragAndDrop/DropZone.md)
   - [AdvancedDraggable](./docs/DragAndDrop/AdvancedDraggable.md)
 - [Core](./docs/Core.md)
 	- [EventModel](./docs/Core/EventModel.md)
 	- [ObjectManager](./docs/Core/ObjectManager.md)
 	- [SortedObjectManager](./docs/Core/SortedObjectManager.md)
 	- [IdGenerator](./docs/Core/IdGenerator.md)

## License

MIT © [samick17](https://github.com/samick17)
