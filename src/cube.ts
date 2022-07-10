import {Renderable, WithPosition} from './render';

export class Cube implements Renderable, WithPosition {
	protected colour = '#000000';
	private size = 20;

	public readonly id = Math.random().toString();

	public get width() {
		return this.size;
	}

	public get height() {
		return this.size;
	}

	public points = 0;

	constructor(public x: number, public y: number, private speed: number) {}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.colour;
		ctx.shadowColor = this.colour;
		ctx.shadowBlur = 40;
		ctx.shadowOffsetY = -4;
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}

	updatePosition(d: number) {
		this.y += this.speed * d;
	}
}

export class AddPoint extends Cube {
	constructor(x: number, y: number, speed: number) {
		super(x, y, speed);
		this.colour = '#18d962';
		this.points = 10;
	}
}

export class SubtractPoint extends Cube {
	constructor(x: number, y: number, speed: number) {
		super(x, y, speed);
		this.colour = '#bf3c2e';
		this.points = -12;
	}
}
