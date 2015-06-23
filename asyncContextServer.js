var AsyncContextServer = {
	attach: function (worker) {
		handleWorker(worker, 'asyncContext', function (ops) {
			if (!ops.length) {
				return;
			}
			return ops.reduce(function (target, op) {
				var newTarget = Reflect[op.type].apply(Reflect, [target].concat(op.args));
				if (newTarget instanceof Function) {
					newTarget = newTarget.bind(target);
				}
				return newTarget;
			}, self);
		});
	}
};