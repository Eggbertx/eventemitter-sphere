/**
 * An event system influenced by Node.js's EventEmitter class
 * 
 * @author Eggbertx
 * @version 0.2
 */

const defaultMaxListeners = 10;

// This should (usually) only be created by EventEmitter#addListener
export class Listener {
	constructor(name, cb = () => {}, onDispose = () => {}, once = false, when = false) {
		this.name = name;
		this.onDispose = onDispose;
		this.cb = cb;
		this.once = once;
		this.when = when;
		this.jobToken = Dispatch.onUpdate(() => {
			let doEmit = false;
			switch(typeof when) {
				case "boolean":
					doEmit = this.when;
					break;
				case "function":
					doEmit = this.when();
					break;
			}
			if(doEmit) {
				this.cb();
				if(once) {
					this.jobToken.cancel();
					this.onDispose();
				}
			}
		});
	}

	emit(...args) {
		this.cb(...args);
		if(this.once) this.dispose();
	}

	dispose() {
		this.when = false;
		this.jobToken.cancel();
		this.onDispose();
	}
}

/**
 * Object for emitting events and handling event callbacks
 * 
 * @param {number} maxListeners Maximum number of listeners that can be created before an error is thrown
 */
export class EventEmitter {
	constructor(maxListeners) {
		this.events = [];

		// make the max listeners property private and validate it when changed
		let _maxListeners = defaultMaxListeners;
		Object.defineProperty(this, "maxListeners", {
			get: () => _maxListeners,
			set: (max) => {
				if(max < 0 || isNaN(max))
					throw new RangeError(`The supplied maxListeners property (${max}) must be a positive number`);
				_maxListeners = max;
			}
		});
		if(maxListeners !== undefined) this.maxListeners = maxListeners;
	}

	/**
	 * Adds a listener
	 * 
	 * @param {string} name The listener's name, used by `EventEmitter#emit()` and `EventEmitter#removeListener()`
	 * @param {Function} cb The function that will be called by `EventEmitter#emit()`
	 * @param {boolean} once If true, the event will only run once and will be removed after it is emitted
	 * @param {boolean|Function} when `cb` will be called when `check` === true or returns true if it is a function
	 * @return Listener
	 */
	addListener(name, cb, once, when) {
		if(this.events.length > this.maxListeners)
			throw new RangeError("Number of max listeners exceeded");

		let len = this.events.length;
		let listener = new Listener(name, cb, () => {
			this.events.splice(len);
		}, once, when);
		this.events.push(listener);
		return listener;
	}

	/** Alias of EventEmitter#addListener */
	on(name, cb, once, when) {
		return this.addListener(...arguments);
	}

	dispose() {
		for (const event of this.events) {
			event.dispose();
		}
	}

	/**
	 * Calls any listeners with the given name
	 * 
	 * @param {string} name the name of the listener to be called
	 * @param {...any} args Optional arguments to pass to the listener
	 * @return {boolean} true if at least one listener is called, otherwise false
	 */
	emit(name, ...args) {
		let numEmitted = 0;
		for(const event of this.events) {
			if(event.name === name) {
				event.emit(...args);
				numEmitted++;
				if(event.once) event.dispose();
			}
		}
		return numEmitted;
	}

	/**
	 * Returns the number of listeners with the given name or number or total
	 * 
	 * @param {string} name
	 * @return {number} The number of listeners
	 */
	numListeners(name) {
		if(!name) return this.events.length;

		let num = 0;
		for(const event of this.events) {
			if(event.name === name) num++;
		}
		return num;
	}

	/**
	 * Removes at least one of the listeners with the given name, if any exist
	 * 
	 * @param {string} name The listener name
	 * @param {boolean} all If {this} true, removes all listeners with the given name instead of just the first
	 * @return {number} The number of listeners that were removed
	 */
	removeListener(name, all) {
		let numRemoved = 0;
		for(const event of this.events) {
			if(event.name === name) {
				event.dispose();
				numRemoved++;
				if(!all) break;
			}
		}
		return numRemoved;
	}

	/** Alias of EventEmitter#removeListener */
	off(name, all) {
		return this.removeListener(...arguments);
	}
}