# **[ObjectUtils](../README.md)**

## **Static Properties**

| Name | Description |
|------|-------------|

## **Methods**

| Name | Description |
|------|-------------|
| [NOOP](#noop) | Empty function |
| [createObjectTypes](#createobjecttypes) | Create objects types from string array |
| [toArray](#toarray) | Object to array |
| [forEachRange](#foreachrange) | For each by range |
| [forEach](#foreach) | The for-each function for Array/Object instance |
| [forEachAsync](#foreachasync) | The for-each async function for Array/Object instance |
| [findObjectBy](#findobjectby) | Find object by function |
| [findObjectsBy](#findobjectsby) | Find objects by function |
| [findObjectReversedBy](#findobjectreversedby) | Find object by function in reversed order |
| [findObjectsReversedBy](#findobjectsreversedby) | Find objects by function in reversed order |
| [clearKeys](#clearkeys) | Clear all of the keys for object |
| [map](#map) | The map function for Array/Object instance |
| [mapAsync](#mapasync) | The map function for Array/Object instance |
| [mapToObject](#maptoobject) | The map function for Array/Object instance |
| [countIf](#countif) | Count objects by function |
| [filter](#filter) | Filter objects by function |
| [cloneData](#clonedata) | Clone the data by JSON |
| [delegate](#delegate) | Invoke the method by target, with function name, arguments |
| [alias](#alias) | Alias the functions for object |
| [exportMethods](#exportmethods) | Export the methods from source object to target object |
| [exportMethodsBy](#exportmethodsby) | Export the methods by function |
| [exportAllMethodsBy](#exportallmethodsby) | Export all of the methods by source object |
| [cloneDeep](#clonedeep) | Clone the object deeply |
| [deepEqual](#deepequal) | Compare two objects deeply |
| [diffTwoObjects](#difftwoobjects) | Diff two objects and return diff data |
| [createKeyActionHandler](#createkeyactionhandler) | Create the handler by map |
| [format](#format) | format |
| [formatData](#formatdata) | formatData |
| [toUpperCamel](#touppercamel) | Convert text to upper camel case |
| [getCharacterLength](#getcharacterlength) | Calculate the length of character |
| [getShortText](#getshorttext) | Replace text with '...' if too long |
| [uuid](#uuid) | Generate uuid |

### **NOOP**

| Parameters | Type | Description |
|------------|------|-------------|

| Return |
|--------|
| No return value |

---

### **createObjectTypes**

| Parameters | Type | Description |
|------------|------|-------------|
| objectNames | Array | The keys of object |

| Return |
|--------|
| **Object** The Objects types |

```js
const ObjectTypes = createObjectTypes([
  'Circle',
  'Triangle',
]);
```
---

### **toArray**

| Parameters | Type | Description |
|------------|------|-------------|
| mapObject | Object | The object |

| Return |
|--------|
| **Array** The values of object |

```js
const arr = toArray({
  a: '22',
  b: '33'
});
// arr is ['22', '33']
```
---

### **forEachRange**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| **Object** The iteration instance |

```js
forEachRange({
  a: '22',
  b: '33'
})
.from(0)
.to(0)
.do(() => {});
```
---

### **forEach**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| No return value |

```js
forEach({
  a: '22',
  b: '33'
}, (value, key, index) => {
  // return true to interrupt the for-loop. 
});
```
---

### **forEachAsync**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| No return value |

```js
forEachAsync({
  a: '22',
  b: '33'
}, async (value, key, index) => {
  // return true to interrupt the for-loop.
});
```
---

### **findObjectBy**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| byFn | Function | The function used to find matched object |

| Return |
|--------|
| **Any** Matched object |

```js
findObjectBy({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return object.name === 'bar' });
```
---

### **findObjectsBy**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| byFn | Function | The function used to find matched objects |

| Return |
|--------|
| **Array\<Any\>** Matched objects |

```js
findObjectsBy({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return !!object; });
```
---

### **findObjectReversedBy**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| byFn | Function | The function used to find matched object |

| Return |
|--------|
| **Any** Matched object |

```js
findObjectReversedBy({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return object.name === 'bar' });
```
---

### **findObjectsReversedBy**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| byFn | Function | The function used to find matched objects |

| Return |
|--------|
| **Array\<Any\>** Matched objects |

```js
findObjectsReversedBy({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return !!object; });
```
---

### **clearKeys**

| Parameters | Type | Description |
|------------|------|-------------|
| object | object | The object |

| Return |
|--------|
| No return value |

```js
clearKeys({
  name: 'foo'
});
```
---

### **map**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| **Array\<Any\>** The object |

```js
map({
  a: '22',
  b: '33'
}, (value, key, index) => {
  return {
    name: key,
    data: value
};
});
```
---

### **mapAsync**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| **Array\<Any\>** The object |

```js
mapAsync({
  a: '22',
  b: '33'
}, async (value, key, index) => {
  return {
    name: key,
    data: value
};
});
```
---

### **mapToObject**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| callback | Function | The iteration function |

| Return |
|--------|
| **Object** The object |

```js
mapToObject({
  a: '22',
  b: '33'
}, (value, key, index) => {
  return {
    key,
    value
};
});
```
---

### **countIf**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| byFn | Function | The function used to find matched object |

| Return |
|--------|
| **Number** Count of matched object |

```js
countIf({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return object.name === 'bar' });
```
---

### **filter**

| Parameters | Type | Description |
|------------|------|-------------|
| objects | Object | The object |
| filterFn | Function | The function used to find matched object |

| Return |
|--------|
| **Array\<Any\>** The filtered array |

```js
filter({
  name: 'foo'
},{
  name: 'bar'
}, (object) => { return object.name === 'bar' });
```
---

### **cloneData**

| Parameters | Type | Description |
|------------|------|-------------|
| data | Object | The object |

| Return |
|--------|
| **Object** The cloned data |

```js
const cloned = cloneData({
  name: 'foo'
},{
  name: 'bar'
});
```
---

### **delegate**

| Parameters | Type | Description |
|------------|------|-------------|
| data | Object | The object |

| Return |
|--------|
| **Any** The return value of target[fnName] |

```js
const result = delegate(target, 'getNameById', [id]);
```
---

### **alias**

| Parameters | Type | Description |
|------------|------|-------------|
| model | Object | The target object |
| fnAlias | Object | The alias key-value object |

| Return |
|--------|
| No return value |

```js
alias(target, {
  addObject: 'add'
});
// Now you can use target.add rather than target.addObject
```
---

### **exportMethods**

| Parameters | Type | Description |
|------------|------|-------------|
| target | Object | The target object |
| source | Object | The source object |
| fnNames | Array\<string\> | The target object |

| Return |
|--------|
| **Object** The instance for exportedMethod |

```js
// source.getObject();
exportMethods(target, source, [
  'addObject',
]);
// Now you can use target.getObject() rather than source.getObject();
```
---

### **exportMethodsBy**

| Parameters | Type | Description |
|------------|------|-------------|
| target | Object | The target object |
| fnNames | Array\<string\> | The function names to export |
| fn | Function | The export method |

| Return |
|--------|
| **Object** target |

```js
exportMethodsBy(target, fnNames, (fnName, args) => {
  // TODO delegate the method
});
```
---

### **exportAllMethodsBy**

| Parameters | Type | Description |
|------------|------|-------------|
| target | Object | The target object |
| source | Object | The source object |
| byFn | Function | The export method |

| Return |
|--------|
| **Object** target |

```js
exportAllMethodsBy(target, fnNames, (fnName, args) => {
  // TODO delegate the method
});
```
---

### **cloneDeep**

| Parameters | Type | Description |
|------------|------|-------------|
| object | Object | The object used to clone |

| Return |
|--------|
| **Object** The cloned object |

```js
cloneDeep({});
```
---

### **deepEqual**

| Parameters | Type | Description |
|------------|------|-------------|
| object1 | Object | The object used to compare |
| object2 | Object | The object used to compare |

| Return |
|--------|
| **bool** Is equaled or not |

```js
deepEqual({foo: 'bar'}, {bar: 'foo'});
```
---

### **diffTwoObjects**

| Parameters | Type | Description |
|------------|------|-------------|
| objectsMap1 | Object | The object1 used to diff |
| objectsMap2 | Object | The object2 used to diff |
| getObjectId | Function | [optional] The function used to get object id |

| Return |
|--------|
| **Object** { add, {}, update: {}, remove: {} } |

```js
diffTwoObjects({}, {});
```
---

### **createKeyActionHandler**

| Parameters | Type | Description |
|------------|------|-------------|
| keyHandlerMap | Object | key-function object used to handle the action |

| Return |
|--------|
| **Object** { handle, apply } |

```js
const actionHandler = createKeyActionHandler({
  foo: (arg1, arg2) => {}
});
actionHandler
.handle('foo')
.apply('argument1', 'argument2');
```
---

### **format**

| Parameters | Type | Description |
|------------|------|-------------|
| text | string | The string template |

| Return |
|--------|
| **string** The formatted string |

```js
const str = format('{0}: {1}', 'id', '123-222');
```
---

### **formatData**

| Parameters | Type | Description |
|------------|------|-------------|
| text | string | The string template |
| data | Object | The text data |

| Return |
|--------|
| **string** The formatted string |

```js
const str = format('ObjectID: ${id}, Name: ${name}', {id: '123-222', name: 'Example'})
```
---

### **toUpperCamel**

| Parameters | Type | Description |
|------------|------|-------------|
| text | string | The text |

| Return |
|--------|
| **string** The formatted string |

```js
const str = toUpperCamel('name');
```
---

### **getCharacterLength**

| Parameters | Type | Description |
|------------|------|-------------|
| ch | string | The character |

| Return |
|--------|
| **Number** The length of character |

```js
const lenOfN = getCharacterLength('n');
const lenOfSymbol = getCharacterLength('>');
```
---

### **getShortText**

| Parameters | Type | Description |
|------------|------|-------------|
| text | string | The original text |
| maxLength | string | The max length of text |

| Return |
|--------|
| **string** The shortened text |

```js
const text = getShortText('n');
```
---

### **uuid**

| Parameters | Type | Description |
|------------|------|-------------|

| Return |
|--------|
| **string** The uuid |

```js
const id = uuid();
```
---

