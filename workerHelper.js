(function () {
	function handleWorker(worker, type, handler) {
		worker.addEventListener('message', function (event) {
			var data = event.data;
			if (data.type !== type) return;
			Promise.resolve(data.argument)
			.then(handler)
			.then(function (result) {
				return {result: result};
			}, function (error) {
				if (!(error instanceof Error)) {
					error = new Error(String(error));
				}
				return {
					error: {
						type: error.name,
						message: error.message,
						stack: error.stack
					}
				};
			})
			.then(function (response) {
				response.type = data.type;
				response.id = data.id;
				worker.postMessage(response);
			});
		});
	}

	function sendToWorker(worker, type, data) {
		return new Promise(function (resolve, reject) {
			var id = Math.random().toString().slice(2);
			worker.addEventListener('message', function handler(event) {
				var data = event.data;
				if (data.type === type && data.id === id) {
					worker.removeEventListener('message', handler);
					if (data.error) {
						var error = data.error;
						var stack = error.stack;
						error = new (self[error.type] || Error)(error.message);
						error.stack = stack;
						reject(error);
					} else {
						resolve(data.result);
					}
				}
			});
			worker.postMessage({
				type: type,
				id: id,
				argument: data
			});
		});
	}

	self.handleWorker = handleWorker;
	self.sendToWorker = sendToWorker;
})();