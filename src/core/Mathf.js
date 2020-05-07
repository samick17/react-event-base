/*
 * @category: static property
 * @name: PI2
 * @description: The well-known 3.14159265358979... value (Read Only).
 */
export const PI2 = Math.PI * 2;
/*
 * @category: static property
 * @name: Radian
 * @description: Radians-to-degrees conversion constant (Read Only).
 */
export const Radian = Math.PI / 180;
/*
 * @category: static function
 * @name: clamp
 * @description: Clamps the given value between the given minimum float and maximum float values. Returns the given value if it is within the min and max range.
 * @param: {number} c - The value to restrict inside the range defined by the min and max values.
 * @param: {number} min - The minimum value to compare against.
 * @param: {number} max - The maximum value to compare against.
 * @returns: {number} - The result between the min and max values.
 */
export const clamp = (c, min, max) => {
	return c < min ? min : c > max ? max : c;
};
/*
 * @category: static function
 * @name: lerp
 * @description: Linearly interpolates between a and b by t.
 * @param: {number} a - The start value.
 * @param: {number} b - The end value.
 * @param: {number} t - The interpolation value between the two floats.
 * @returns: {number} - The interpolated float result between the two float values.
 */
export const lerp = (a, b, t) => {
	return a + clamp(t, 0, 1) * (b - a);
};
