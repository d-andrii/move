import './style.css';
import {rand, randInt, clamp, intersect} from './helper';
import {Size, Theme} from './render';
import {AddPoint, Cube, SubtractPoint} from './cube';
import {Player} from './player';

class App {
	private ctx: CanvasRenderingContext2D;
	private cubes: Cube[] = [];
	private player: Player;

	private startTime = 0;
	private prevTime = 0;
	private lastAddedTime = 0;

	private get height() {
		return this.ctx.canvas.height;
	}

	private get width() {
		return this.ctx.canvas.width;
	}

	constructor(
		canvas: HTMLCanvasElement,
		public theme: Theme,
		public size: Size,
	) {
		this.ctx = canvas.getContext('2d')!;

		this.addPoint(AddPoint);

		const playerSize = 100;
		this.player = new Player(
			this.width / 2 - playerSize / 2,
			this.height - (this.size === Size.Mobile ? 140 : 60),
			playerSize,
		);

		canvas.addEventListener('mousemove', (event) => this.onMouseMove(event.x));
		canvas.addEventListener('touchmove', (event) => {
			event.preventDefault();
			if (event.touches.length) {
				this.onMouseMove(event.touches.item(0)!.pageX);
			}
		});
	}

	private addPoint(builder: typeof AddPoint | typeof SubtractPoint) {
		this.cubes.push(
			new builder(
				randInt(0, this.width),
				-40 - randInt(100, 400),
				rand(0.05, 0.07),
			),
		);
	}

	private onMouseMove(x: number) {
		this.player.x = clamp(
			x - this.player.width / 2,
			0,
			this.width - this.player.width,
		);
	}

	private run(time: number) {
		if (this.player.width >= this.width || this.player.width <= 0) {
			return;
		}
		requestAnimationFrame((t) => this.run(t));

		const d = time - this.prevTime;
		this.prevTime = time;

		//#region Adding more points
		if (
			time - this.lastAddedTime >
			Math.max(Math.max(20000 - (time - this.startTime), 0) / 10, 200)
		) {
			this.lastAddedTime = time;
			this.addPoint(Math.random() > 0.4 ? AddPoint : SubtractPoint);
		}
		//#endregion

		//#region Updating positions
		const toRemove: string[] = [];
		for (const cube of this.cubes) {
			cube.updatePosition(d);
			if (intersect(cube, this.player)) {
				this.player.width += cube.points;
				this.player.x += -(cube.points / 2);
				toRemove.push(cube.id);
			} else if (cube.y > this.height) {
				toRemove.push(cube.id);
			}
		}
		this.cubes.forEach((item) => item.updatePosition(d));
		this.cubes = this.cubes.filter((item) => !toRemove.includes(item.id));
		//#endregion

		//#region Rendering
		this.ctx.clearRect(0, 0, this.width, this.height);
		switch (this.theme) {
			case Theme.Light:
				this.ctx.fillStyle = '#eeeeee';
				break;
			case Theme.Dark:
				this.ctx.fillStyle = '#000000';
				break;
		}
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.cubes.forEach((item) => item.render(this.ctx));
		this.player.render(this.ctx, this.theme);
		//#endregion
	}

	start() {
		requestAnimationFrame((t) => {
			this.startTime = t;
			this.prevTime = t;
			this.lastAddedTime = t;
			this.run(t);
		});
	}
}

function main() {
	const canvas = document.querySelector('canvas')!;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const themeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
	const mobileMatcher = window.matchMedia('(max-width: 500px)');
	const app = new App(
		canvas,
		themeMatcher.matches ? Theme.Dark : Theme.Light,
		mobileMatcher.matches ? Size.Mobile : Size.Desktop,
	);

	themeMatcher.addEventListener(
		'change',
		(event) => (app.theme = event.matches ? Theme.Dark : Theme.Light),
	);
	mobileMatcher.addEventListener(
		'change',
		(event) => (app.size = event.matches ? Size.Mobile : Size.Desktop),
	);

	document
		.getElementById('theme')!
		.addEventListener(
			'click',
			() => (app.theme = app.theme === Theme.Dark ? Theme.Light : Theme.Dark),
		);

	const rules = document.getElementById('rules')!;
	setTimeout(() => {
		rules.style.opacity = '0';
		setTimeout(() => rules.remove(), 1000);
	}, 4000);

	app.start();
}

window.addEventListener('load', main);
