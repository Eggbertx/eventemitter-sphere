import { Thread } from 'sphere-runtime';
import { EventEmitter } from "./events";


function deviceName(device) {
	let name = "";
	if(device.capsLock !== undefined) name = "k"; // Device is a keyboard
	else if(device.name !== undefined) name = "j"; // Device is a joystick
	else if(device.x !== undefined) name = "m"; // Device is a mouse
	return name;
}

function buttonName(device, button) {
	return deviceName(device) + button;
}

export class ButtonEvent extends Thread {
	constructor() {
		super();
		this.emitter = new EventEmitter(Infinity);
		this.start();
	}

	addGetKeyEvent(device, cb, once) {
		let listener = this.emitter.addListener(deviceName(device) + "getKey", cb, once);
		listener.device = device;
		return listener;
	}

	addHoldEvent(device, button, cb) {
		let listener = this.emitter.addListener(buttonName(device, button), cb, false, () => {
			if(button > 0) {
				return device.isPressed(button);
			} else {
				for(let k = 0; k < 256; k++) {
					if(device.isPressed(k)) return k;
				}
			}
		});
		listener.device = device;
		return listener;
	}

	addPressEvent(device, button, cb, once) {
		let listener = this.emitter.addListener(buttonName(device, button), cb, once, () => {
			return false
			let key = device.getKey();
			device.getKey();
			return key == button;
		});
	}

	addReleaseEvent(device, button, cb, once) {

	}

	on_update() {
		for(const event of this.emitter.events) {
			if(event.device == undefined) break;
			let key = event.device.getKey();
			if(key) {
				this.emitter.emit(deviceName(event.device) + "getKey", key);
			}
		}
	}
}

/**
 * Event emitter for keyboard, mouse, and joystick events
 * 
 * @param {number} maxListeners Maximum number of listeners that can be created before an error is thrown
 * @todo make the once parameter work
 */
export class InputEventEmitter extends EventEmitter {
	constructor(maxListeners) {
		super(maxListeners);
	}

	/**
	 * Creates an event that is triggered when the given button is pressed
	 * 
	 * @param {Keyboard|Mouse|Joystick} device
	 * @param {any} button
	 * @param {Function} cb The function that will be run when the button is pressed
	 * @param {boolean} once If true, the listener will be disposed of when it is triggered
	 */
	addPressEvent(device, button, cb, once) {
		let listener = this.addListener(buttonName(device, button), cb, once, () => {
			return device.isPressed(button);
		});
		listener.device = device;
		return listener;
	}

	/**
	 * Like InputEventEmitter#addPressEvent but it is triggered when the given button is released
	 */
	addReleaseEvent(device, button, cb) {
		let listener;
		listener = this.addPressEvent(device, button, () => {
			this.addListener(buttonName(device, button) + "r", cb, true, () => {
				let released = !device.isPressed(button);
				if(released) 
					this.addReleaseEvent(device, button, cb, true);
				return released;
			}, true);
		}, true);
		return listener;
	}
}