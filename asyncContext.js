var createChain = function (ops) {
	var chain = function () {};
	chain.__asyncOps = ops;
	return new Proxy(chain, AsyncContextHandler);
};

function AsyncAccessError() {
	TypeError.call(this, 'Can\'t perform synchronous operation on remote object.');
}

AsyncAccessError.prototype = Object.create(TypeError.prototype);

function invoke(chain) {
	return sendToWorker(self, 'asyncContext', chain.__asyncOps);
}

function chainWith(chain, type, args) {
	return createChain(chain.__asyncOps.concat([{
		type: type,
		args: args
	}]));
}

function invokeWith(chain, type, args) {
	return invoke(chainWith(chain, type, args));
}

function thenHandler(resolve, reject) {
	return invoke(this).then(resolve, reject);
}

var AsyncContextHandler = {
	get: function (target, name, receiver) {
		switch (name) {
			case 'then':
				return thenHandler;

			case '__asyncOps':
				return target.__asyncOps;

			default:
				return chainWith(target, 'get', [name]);
		}
	},
	set: function (target, name, value, receiver) {
		invokeWith(target, 'set', [name, value]);
		return true;
	},
	has: function (target, name) {
		throw new AsyncAccessError();
	},
	apply: function (target, receiver, args) {
		return chainWith(target, 'apply', [null, args]);
	},
	construct: function (target, args) {
		return chainWith(target, 'construct', [args]);
	},
	getOwnPropertyDescriptor: function (target, name) {
		throw new AsyncAccessError();
	},
	defineProperty: function (target, name, desc) {
		invokeWith(target, 'defineProperty', [name, desc]);
		return true;
	},
	getPrototypeOf: function (target) {
		throw new AsyncAccessError();
	},
	setPrototypeOf: function (target, newProto) {
		throw new AsyncAccessError();
	},
	deleteProperty: function (target, name) {
		invokeWith(target, 'deleteProperty', [name]);
	},
	enumerate: function (target) {
		throw new AsyncAccessError();
	},
	preventExtensions: function (target) {
		invokeWith(target, 'preventExtensions', []);
		return true;
	},
	isExtensible: function (target) {
		throw new AsyncAccessError();
	},
	ownKeys: function (target) {
		throw new AsyncAccessError();
	}
};

self.asyncContext = createChain([]);
self.asyncDocument = asyncContext.document;
