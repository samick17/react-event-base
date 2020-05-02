# **[VK](../README.md)**

## **Methods**

| Name | Description |
|------|-------------|
| [registerKeyDownEventHandlers](#registerkeydowneventhandlers) | Register KeyDown Event Handlers for window |

### **registerKeyDownEventHandlers**

| Parameters | Type | Description |
|------------|------|-------------|
| handlers | Array | The event handlers |

| Return |
|--------|
| The function which is used to unregister the event handler |

```js
registerKeyDownEventHandlers([
{
  keys: ['ctrl', '+'],
  handler: () => {
    console.log('new tab');
  }
},
{
  keys: ['ctrl', '-'],
  handler: () => {
    console.log('close the tab');
	 }
}
]);
```
---

