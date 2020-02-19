'use strict';

const AsyncContextServer = {
	attach: function(worker) {
		handleWorker(worker, 'asyncContext', ops => {
			if (!ops.length) {
				return;
			}
			return ops.reduce((target, op) => {
				let newTarget = Reflect[op.type](target, ...op.args);
				if (typeof newTarget === 'function') {
					newTarget = newTarget.bind(target);
				}
				return newTarget;
			}, self);
		});
	}
};
