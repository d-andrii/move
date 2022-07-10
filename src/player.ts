import {Renderable, Theme, WithPosition} from './render';

export class Player implements Renderable, WithPosition {
	public readonly id = Math.random().toString();

	public height = 20;

	constructor(public x: number, public y: number, public width: number) {}

	render(ctx: CanvasRenderingContext2D, theme: Theme) {
		ctx.fillStyle = theme === Theme.Dark ? '#eeeeee' : '#222222';
		ctx.fillRect(this.x, this.y, this.width, 20);
	}
}
