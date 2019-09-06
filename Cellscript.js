Object.assign(Sphere.Game, {
	version: 2,
	apiLevel: 1,

	name: "EventEmitter-sphere",
	author: "Eggbertx",
	summary: "A simple implementation of the Node.js EventEmitter class in miniSphere",
	resolution: '800x600',

	main: '@/scripts/main.js',
});

install('@/scripts',	files('src/*.js'));
install('@/lib',		files('lib/*.js'));
