# **[Mathf](../README.md)**

## **Static Properties**

| Name | Description |
|------|-------------|
| PI2 | The well-known 3.14159265358979... value (Read Only). |
| Radian | Radians-to-degrees conversion constant (Read Only). |

## **Methods**

| Name | Description |
|------|-------------|
| [clamp](#clamp) | Clamps the given value between the given minimum float and maximum float values. Returns the given value if it is within the min and max range. |
| [lerp](#lerp) | Linearly interpolates between a and b by t. |

### **clamp**

| Parameters | Type | Description |
|------------|------|-------------|
| c | number | The value to restrict inside the range defined by the min and max values. |
| min | number | The minimum value to compare against. |
| max | number | The maximum value to compare against. |

| Return |
|--------|
| **number** The result between the min and max values. |

---

### **lerp**

| Parameters | Type | Description |
|------------|------|-------------|
| a | number | The start value. |
| b | number | The end value. |
| t | number | The interpolation value between the two floats. |

| Return |
|--------|
| **number** The interpolated float result between the two float values. |

---

