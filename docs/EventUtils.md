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
| htmlElement | Element |
| type | string |
| callback | Function |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
const unbindFn = registerEvent(htmlElement, 'onClick', () => {
	console.log('clicked!');
});
```

### **registerEvents**

| Parameters | Type |
|------------|------|
| htmlElement | Element |
| eventHandlers | object<string, function> |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
const unbindFn = registerEvents(htmlElement, {
	'onClick': () => {
		console.log('clicked!');
	}
});
```

### **$**

| Parameters | Type |
|------------|------|
| htmlElement | Element |

| Returns |
|---------|
| **object** key, value object |

```js
const element = $(document.body);
element.on('click', () => {
	console.log('clicked!');
});
```

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
| htmlElement | Element |
| events | object |

| Returns |
|---------|
| **Function** the unbind function for registered event. |

```js
registerElementEvents(htmlElement, {
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
