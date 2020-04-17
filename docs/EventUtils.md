# [EventUtils](../README.md)

## Static Properties

## Methods

### **createEventTypes**

| Parameters | Type |
|------------|------|
| eventNames | string[] |

| Returns |
|---------|
| **object** key, value object |

```js
const Events = createEventTypes([
'AddObject',
'RemoveObject',
/\*...etc\*/
]);
```

### **registerEvent**

| Parameters | Type |
|------------|------|
| elem | Element |
| type | string |
| callback | Function |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
const unbindFn = registerEvent(elem, 'onClick', () => {
	console.log('clicked!');
});
```

### **registerEvents**

| Parameters | Type |
|------------|------|
| elem | Element |
| eventHandlers | object<string, function> |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
const unbindFn = registerEvents(elem, {
	'onClick': () => {
		console.log('clicked!');
	}
});
```

<!-- ### **$**

| Parameters | Type |
|------------|------|
| elem | Element |

| Returns |
|---------|
| **object** key, value object |

```js
const element = $(document.body);
element.on('click', () => {
	console.log('clicked!');
});
``` -->

### **stopEventChain**

| Parameters | Type |
|------------|------|
| event | Event |

| Returns |
|---------|
| No return value |

```js
stopEventChain(event);
```

### **registerElementEvents**

| Parameters | Type |
|------------|------|
| elem | Element |
| events | object |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
registerElementEvents(elem, {
	onClick: () => {
		console.log('Clicked');
	},
	onDoubleClick: {
		threshold: 300, // ms
		handler: () => {
			console.log('Double Clicked');
		}
	},
	onLongClick: {
		threshold: 300, // ms
		handler: () => {
			console.log('Long Clicked');
		}
	}
});
```
