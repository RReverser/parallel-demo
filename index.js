'use strict';

(function clock() {
	document.getElementById(
		'clock'
	).textContent = new Date().toLocaleTimeString();
	requestAnimationFrame(clock);
})();

function onInput() {
	parallel(async ({ document }) => {
		// get inputs
		let [x, y] = await Promise.all([
			document.getElementById('x').value,
			document.getElementById('y').value
		]);

		// VERY useful calculations
		for (let finish = Date.now() + 3000; Date.now() < finish; );
		let result = x * y;

		// output result
		document.getElementById('output').value = result;
	});
}

document.getElementById('form').addEventListener('input', onInput);
