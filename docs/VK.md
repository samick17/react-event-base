# **[VK](../README.md)**

## **Static Properties**

| Name | Description |
|------|-------------|

## **Methods**

| Name | Description |
|------|-------------|
| [registerKeyDownEventHandlers](#registerkeydowneventhandlers) | Register KeyDown Event Handlers for window |

### **registerKeyDownEventHandlers**

| Parameters | Type | Description |
|------------|------|-------------|
| handlers | Array | The event handlers |
| logKey | bool | True will print key if there is no matched handler |

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

