// EventEmitter-sphere example usage

import { Thread } from 'sphere-runtime';
import { EventEmitter } from 'events';
import { InputEventEmitter } from 'inputevents';
const kb = Keyboard.Default;
const font = Font.Default;

let e = new EventEmitter();
let l;
let ie = new InputEventEmitter();
let text = "";

class User {
	constructor() {
		this.emitter = new EventEmitter();
		this.name = "";
	}

	onDidChangeName(callback) {
		return this.emitter.on('did-change-name', callback);
	}

	setName(name) {
		if(name !== this.name) {
			this.name = name;
			this.emitter.emit('did-change-name', name)
		}

		return this.name
	}

	destroy() {
		this.emitter.dispose()
	}
}

export default class EventEmitterTest extends Thread {
	constructor() {
		super();


		let user = new User();
		const subscription = user.onDidChangeName((name) => SSj.log(`My name is ${name}`));
		ie.addReleaseEvent(Keyboard.Default, Key.N, () => {
			user.setName("Something");
		});
		// user.setName("New name");
		// subscription.dispose();
		/* e.addListener("keyPressed", key => {
			SSj.log("pressed key");
		}, false, () => {
			return kb.getKey() != null;
		}); */

		/* let q = e.addListener("quitter", Sphere.shutDown, true, () => {
			return kb.isPressed(Key.Escape);
		}); */


		ie.addPressEvent(Keyboard.Default, Key.Escape, () => {
			Sphere.shutDown();
		});
		ie.addReleaseEvent(Keyboard.Default, Key.R, () => {
			SSj.log("R key released");
		});
		ie.addPressEvent(Keyboard.Default, Key.Up, () => {
			SSj.log("Moving north");
		});
		
	}

	on_update() {
		// SSj.log(e.events.length)
		if(kb.isPressed(Key.R)) e.emit("pressR");
		/* if(Sphere.now() % 32 == 0) text += Sphere.now() + ",";
		if(Sphere.now() == 128) dispatch.pause();
		if(Sphere.now() == 160) dispatch.resume(); */
	}

	on_render() {
		
	}
}
