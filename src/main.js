// EventEmitter-sphere example usage

import { Prim, Thread } from 'sphere-runtime';
import { EventEmitter } from 'events';
import { InputEventEmitter } from 'inputevents';
const kb = Keyboard.Default;
const mouse = Mouse.Default;
const font = Font.Default;
const screen = Surface.Screen;

let ee = new EventEmitter();
let ie = new InputEventEmitter();

let lines = [];

// just using this for click event position demonstration
class Button {
	constructor(x,y,text) {
		this.x = x-3;
		this.y = y-3;
		this.text = text;
		this.wMargin = 8;
		this.hMargin = 8;
		this.width = font.widthOf(text) + this.wMargin*2;
		this.height = font.height + this.hMargin*2;
		this.color = Color.DarkGray;
		this.textColor = Color.Black;
	}
	inside(x,y) {
		return x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height

	}
	render() {
		Prim.drawSolidRectangle(screen, this.x, this.y, this.width, this.height, this.color);
		font.drawText(screen, this.x+this.wMargin, this.y+this.hMargin, this.text, this.textColor);
	}
}
let btn = new Button(400, 40, "Button text");

export default class EventEmitterTest extends Thread {
	constructor() {
		super();
		ie.setButtonEvent(kb, Key.Escape, Sphere.shutDown);
		ee.addListener("buttonClicked", () => {
			lines.push("Button click event fired");
			btn.textColor = Color.SlateGray;
			btn.color = Color.LightGray;
		})

		ie.setButtonEvent(kb, Key.Up, () => {
			lines.push("Up arrow pressed");
		}, () => {
			lines.push("Up arrow released");
		});

		ie.setButtonEvent(kb, Key.Down, () => {
			lines.push("Down arrow pressed");
		}, () => {
			lines.push("Down arrow released");
		});

		ie.setButtonEvent(kb, Key.Left, () => {
			lines.push("Left arrow pressed");
		}, () => {
			lines.push("Left arrow released");
		});

		ie.setButtonEvent(kb, Key.Right, () => {
			lines.push("Right arrow pressed");
		}, () => {
			lines.push("Right arrow released");
		});

		ie.setButtonEvent(kb, Key.Space, () => {
			lines.push("Space pressed (event is set to only fire once)");
		}, () => {
			lines.push("Space released (event is set to only fire once)");
		}, true);

		ie.setButtonEvent(kb, Key.Enter, () => {
			lines.push("Enter pressed (event is set to only fire once)");
		}, () => {
			lines.push("Enter released (event is set to only fire once)");
		}, true);

		ie.setButtonEvent(mouse, MouseKey.Left, null, (x,y) => {
			lines.push(`Left mouse button released at screen position (${x},${y})`);
			if(btn.inside(x,y)) {
				ee.emit("buttonClicked");
				ee.off("buttonClicked");
			}
		});
	}
	on_update() {
		while(font.height*lines.length > screen.height) {
			lines.splice(0,1);
		}
	}
	on_render() {
		btn.render();
		for(const l in lines) {
			font.drawText(screen, 0, l*font.height, lines[l], Color.White);
		}
	}
}
