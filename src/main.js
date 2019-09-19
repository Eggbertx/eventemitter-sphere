// EventEmitter-sphere example usage

import { Thread, Console } from 'sphere-runtime';
import { EventEmitter } from 'events';
import { ButtonEvent, InputEventEmitter } from 'inputevents';
const kb = Keyboard.Default;
const font = Font.Default;

let e = new EventEmitter();
let l;
let ie = new InputEventEmitter();
let be = new ButtonEvent();
let text = "";
let console = new Console();

export default class EventEmitterTest extends Thread {
	constructor() {
		super();

		console.visible = true;

		ie.addPressEvent(Keyboard.Default, Key.Escape, Sphere.shutDown);
		ie.addReleaseEvent(Keyboard.Default, Key.N, () => {
			console.log("N pressed")
		});
		
		
		let q = e.addListener("quitter", Sphere.shutDown, true, () => {
			return kb.isPressed(Key.Escape);
		});


		ie.addReleaseEvent(Keyboard.Default, Key.R, () => {
			console.log("R key released");
		});
		ie.addPressEvent(Keyboard.Default, Key.Up, () => {
			console.log("Up key pressed");
		});

		be.addGetKeyEvent(Keyboard.Default, (key) => {
			console.log("Key pressed: " + key);
		});

		/* be.addHoldEvent(Keyboard.Default, Key.X, () => {
			console.log("X key held via ButtonEvent#addHoldEvent");
		});

		be.addPressEvent(Keyboard.Default, Key.P, () => {
			console.log("P key pressed via ButtonEvent#addPressEvent");
		}); */
	}

	on_update() {

	}
}
