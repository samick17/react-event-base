# **[EventUtils](../README.md)**

## **Static Properties**

| Name | Description |
|------|-------------|

## **Methods**

| Name | Description |
|------|-------------|
| [createEventTypes](#createeventtypes) | Create event types from string array |
| [registerEvent](#registerevent) | Register event for element |
| [registerEvents](#registerevents) | Register events for element |
| [stopEventChain](#stopeventchain) | Stop the event handler & bubbling |
| [registerElementEvents](#registerelementevents) | Register onClick/onDoubleClick/onLongClick event for element |

### **createEventTypes**

| Parameters | Type | Description |
|------------|------|-------------|
| eventNames | Array | The keys of event |

| Return |
|--------|
| **Object** The Event types object |

```js
const Events = createEventTypes([
  'AddObject',
  'RemoveObject',
]);
```
---

### **registerEvent**

| Parameters | Type | Description |
|------------|------|-------------|
| elem | Element | Element |
| type | string | The event type |
| fn | Function | The event handler |

| Return |
|--------|
| **Function** The function which is used to unregister the event handler |

---

### **registerEvents**

| Parameters | Type | Description |
|------------|------|-------------|
| elem | Element | Element |
| events | Object | The key-value event handler object |

| Return |
|--------|
| **Function** The function which is used to unregister the event handler |

---

### **stopEventChain**

| Parameters | Type | Description |
|------------|------|-------------|
| event | Event | Event |

| Return |
|--------|
| No return value |

---

### **registerElementEvents**

| Parameters | Type | Description |
|------------|------|-------------|
| elem | Element | Element |
| events | Object | The key-value event handler object |

| Return |
|--------|
| **Function** The function which is used to unregister the event handler |

---

