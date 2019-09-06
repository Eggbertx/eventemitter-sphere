# EventEmitter-sphere

An event system influenced by Node.js's EventEmitter class

## Basic usage
```JavaScript
// main.js
import { Thread } from 'sphere-runtime';
import { EventEmitter } from 'events';

const maxListeners = 32;
const escOnlyOnce = true;
let ei = new EventEmitter(maxListeners);

export default class Game extends Thread {
	constructor() {
		super();
		ei.addListener("escEvent", () => {
			Sphere.shutDown();
		}, escOnlyOnce);
	}

	on_update() {
		if(kb.isPressed(Key.Escape)) ei.emit("escEvent");
	}
}
```
This creates an event that is emitted in on_update when the escape key is pressed

The `EventEmitter#addListener` function also takes an optional parameter that emits the listener when it equals true or is a function that returns true.

Example:
```JavaScript
ei.addListener("escEvent", Sphere.shutDown, escOnlyOnce, () => {
	return kb.isPressed(Key.Escape);
});
```

## One-time events
Rather than an EventEmitter#once method like node.js's EventEmitter, this implementation takes a boolean variable (`escOnlyOnce` in the above examples) and the event is disposed of after execution if it is true.