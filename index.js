'use strict';

(function handler() {
	document.getElementById('time').textContent = new Date().toString();
	requestAnimationFrame(handler);
})();

parallel(function () {
	var i = 0;
	while (true) {
		asyncDocument.getElementById('number').textContent = Math.random();
		var end = Date.now() + 5000;
		while (Date.now() < end);
		asyncDocument.title = (i += 5) + ' seconds gone';
	}
});