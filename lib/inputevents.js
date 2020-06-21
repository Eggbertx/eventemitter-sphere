const dummyFunc = () => {};

/**
 * Event emitter for keyboard, mouse, and joystick events
 */
export class InputEventEmitter {
	constructor() {
		this.buttonStates = [];
		this.events = [];

		let jobToken = Dispatch.onUpdate(() => {
			for(let s = 0; s < this.buttonStates.length; s++) {
				let state = this.buttonStates[s];
				let fired = false;

				if(state.device.isPressed(state.button) && !state.pressed) {
					this.buttonStates[s].pressed = true;
					if(state.device == Mouse.Default)
						state.onPress(Mouse.Default.x, Mouse.Default.y);
					else state.onPress();
				} else if(!this.buttonStates[s].device.isPressed(state.button) && state.pressed) {
					this.buttonStates[s].pressed = false;
					if(state.device == Mouse.Default)
						state.onRelease(Mouse.Default.x, Mouse.Default.y);
					else state.onRelease();
					fired = true;
				}

				if(fired && state.once) {
					this.removeButtonEvent(state.device, state.button);
				}
			}
		});

		this.dispose = () => {
			this.buttonStates = [];
			this.events = [];
			jobToken.cancel();
		}
	}
	/**
	 * Creates an event that is triggered when the given button is pressed on the given device
	 *
	 * @param {Keyboard|Mouse|Joystick} device
	 * @param {any} button
	 * @param {Function} onPress The function that will be run when the button is pressed
	 * @param {Function} onRelease The function that will be run when the button is released
	 * @param {boolean} once If true, the listener will be disposed of when it is triggered
	 */
	setButtonEvent(device, button, onPress, onRelease, once) {
		onPress = onPress?onPress:dummyFunc;
		onRelease = onRelease?onRelease:dummyFunc;
		once = once === true;

		for(const s in this.buttonStates) {
			// if the device/button event is already registered, overwrite it with the new function callbacks.
			if(this.buttonStates[s].device == device && this.buttonStates[s].button == button) {
				this.buttonStates[s].onPress = onPress;
				this.buttonStates[s].onRelease = onRelease;
				this.buttonStates[s].once = once;
				return;
			}
		}
		// it doesn't exist, register a new one
		this.buttonStates.push({
			device: device,
			button: button,
			onPress: onPress,
			onRelease: onRelease,
			once: once,
			pressed: device.isPressed(button)
		});
	}

	/**
	 * Removes the input event for the given device/button
	 * 
	 * @param {Keyboard|Mouse|Joystick} device
	 * @param {any} button
	 */
	removeButtonEvent(device, button) {
		for(const s in this.buttonStates) {
			if(this.buttonStates[s].device == device && this.buttonStates[s].button == button) {
				// Sphere.abort("removing")
				this.buttonStates.splice(s, 1);
				return;
			}
		}
	}
}