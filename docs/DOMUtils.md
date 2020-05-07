# **[DOMUtils](../README.md)**

## **Static Properties**

| Name | Description |
|------|-------------|

## **Methods**

| Name | Description |
|------|-------------|
| [createElement](#createelement) | Create element from string |
| [registerEvent](#registerevent) | Create element from string |
| [htmlToImage](#htmltoimage) | Create element from string |
| [svgToImage](#svgtoimage) | Create element from string |
| [scrollTo](#scrollto) | Create element from string |
| [calculateSizeByAspect](#calculatesizebyaspect) | Create element from string |

### **createElement**

| Parameters | Type | Description |
|------------|------|-------------|
| innerHtml | string | The dom string |

| Return |
|--------|
| **Element** The web element |

```js
const element = createElement(<div/>);
```
---

### **registerEvent**

| Parameters | Type | Description |
|------------|------|-------------|
| element | Element | The target element |
| name | string | The event type |
| callback | Function | The handler function |

| Return |
|--------|
| **Function** The function which is used to unregister the event handler |

```js
const unregisterFn = registerEvent(body, 'click', (e) => {});
```
---

### **htmlToImage**

| Parameters | Type | Description |
|------------|------|-------------|
| svgText | string | The target innerText of Element |
| scale | Number | [optional] The scaling, default is 1 |

| Return |
|--------|
| **Object** The ImageAdapter |

```js
const imageAdapter = htmlToImage(innerHtml, scale);
```
---

### **svgToImage**

| Parameters | Type | Description |
|------------|------|-------------|
| svgText | string | The svg xml text |
| options | Object | [optional] {MaxWidth, MaxHeight} |

| Return |
|--------|
| **Object** The ImageAdapter |

```js
const imageAdapter = svgToImage(svgText, options);
```
---

### **scrollTo**

| Parameters | Type | Description |
|------------|------|-------------|
| element | Element | The target element |
| name | Object | {fromValue, toValue, animationTime, propertyName} |

| Return |
|--------|
| No return value |

```js
const element = document.querySelector('.scroll');
const fromValue = 0;
const toValue = 800;
const animationTime: 300;
const propertyName = 'scrollLeft';
scrollTo(element, {fromValue, toValue, animationTime, propertyName});
```
---

### **calculateSizeByAspect**

| Parameters | Type | Description |
|------------|------|-------------|
| maxSize | Object | The maximum size of size |
| aspect | Number | The aspect ratio |
| callback | Function | The handler function |

| Return |
|--------|
| **Function** The function which is used to unregister the event handler |

```js
const maxSize = {
  width: window.innerWidth,
  height: window.innerHeight
};
const aspect = 16 / 9;
const size = calculateSizeByAspect(maxSize, aspect);
```
---

