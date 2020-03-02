export const PI2 = Math.PI * 2;
export const Radian = Math.PI / 180;
export const clamp = (c, min, max) => {
	return c < min ? min : c > max ? max : c
};
export const lerp = (a, b, t) => {
	return a + clamp(t, 0, 1) * (b - a);
};
