importScripts('reflect.js');
importScripts('workerHelper.js');
importScripts('asyncContext.js');

function _asyncToGenerator(fn) {
	return function() {
		const gen = fn.apply(this, arguments);
		return new Promise((resolve, reject) => {
			const callNext = step.bind(null, 'next');
			const callThrow = step.bind(null, 'throw');

			function step(key, arg) {
				try {
					var info = gen[key](arg);
				} catch (error) {
					return reject(error);
				}
				if (info.done) {
					resolve(info.value);
				} else {
					Promise.resolve(info.value).then(callNext, callThrow);
				}
			}

			callNext();
		});
	};
}

handleWorker(self, 'exec', function(code) {
	var func = eval('(' + code + ')');
	func = _asyncToGenerator(func);
	return Promise.resolve().then(() => func(asyncContext));
});
