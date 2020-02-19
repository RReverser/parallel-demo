function handleWorker(worker, type, handler) {
	worker.addEventListener('message', ({ data }) => {
		if (data.type !== type) return;
		Promise.resolve()
			.then(() => handler(data.argument))
			.then(
				result => ({ result }),
				error => {
					if (!(error instanceof Error)) {
						error = new Error(String(error));
					}
					let { name, message, stack } = error;
					return {
						error: {
							type: name,
							message,
							stack
						}
					};
				}
			)
			.then(response => {
				response.type = data.type;
				response.id = data.id;
				worker.postMessage(response);
			});
	});
}

function sendToWorker(worker, type, data) {
	return new Promise(function(resolve, reject) {
		let id = Math.random()
			.toString()
			.slice(2);
		worker.addEventListener('message', function handler({ data }) {
			if (data.type === type && data.id === id) {
				worker.removeEventListener('message', handler);
				let { error } = data;
				if (error) {
					let { stack } = error;
					error = new (self[error.type] || Error)(error.message);
					error.stack = stack;
					reject(error);
				} else {
					resolve(data.result);
				}
			}
		});
		worker.postMessage({
			type,
			id,
			argument: data
		});
	});
}
