'use strict';

const AsyncContextServer = {
	attach: function(worker) {
		handleWorker(worker, 'asyncContext', ops => {
			if (!ops.length) {
				return;
			}
			return ops.reduce((target, op) => {
				let newTarget = Reflect[op.type].apply(
					Reflect,
					[target].concat(op.args)
				);
				if (newTarget instanceof Function) {
					newTarget = newTarget.bind(target);
				}
				return newTarget;
			}, self);
		});
	}
};
