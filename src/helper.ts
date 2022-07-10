import {WithPosition} from './render';

export const rand = (x: number, y: number) => Math.random() * (y - x) + x;
export const randInt = (x: number, y: number) => Math.floor(rand(x, y));
export const clamp = (x: number, min: number, max: number) =>
	Math.max(min, Math.min(x, max));

export const intersect = (a: WithPosition, b: WithPosition) => {
	const lx = Math.max(a.x, b.x);
	const rx = Math.min(a.x + a.width, b.x + b.width);
	const ty = Math.max(a.y, b.y);
	const by = Math.min(a.y + a.height, b.y + b.height);

	return lx < rx && ty < by;
};
