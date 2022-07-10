export enum Theme {
	Light,
	Dark,
}

export interface WithPosition {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Renderable {
	readonly id: string;

	render(ctx: CanvasRenderingContext2D, theme: Theme): void;
}
