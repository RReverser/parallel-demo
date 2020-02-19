'use strict';

function handleWorker(worker, expectedType, handler) {
	worker.addEventListener(
		'message',
		async ({ data: { id, type, argument } }) => {
			if (type !== expectedType) return;
			let response = { id };
			try {
				response.result = await handler(argument);
			} catch (error) {
				if (!(error instanceof Error)) {
					error = new Error(String(error));
				}
				let { name, message, stack } = error;
				response.error = {
					name,
					message,
					stack
				};
			}
			worker.postMessage(response);
		}
	);
}

function sendToWorker(worker, type, argument) {
	return new Promise(function(resolve, reject) {
		let id = Math.random()
			.toString()
			.slice(2);
		worker.addEventListener('message', function handler({ data }) {
			if (data.id !== id) return;
			worker.removeEventListener('message', handler);
			let { error } = data;
			if (error) {
				let { name, message, stack } = error;
				error = new (self[name] || Error)(message);
				error.stack = stack;
				reject(error);
			} else {
				resolve(data.result);
			}
		});
		worker.postMessage({
			id,
			type,
			argument
		});
	});
}
