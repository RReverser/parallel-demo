function createChain(ops) {
	let chain = function() {};
	chain.__asyncOps = ops;
	return new Proxy(chain, AsyncContextHandler);
}

class AsyncAccessError extends TypeError {
	constructor() {
		super("Can't perform synchronous operation on remote object.");
	}
}

function invoke(chain) {
	return sendToWorker(self, 'asyncContext', chain.__asyncOps);
}

function chainWith(chain, type, args) {
	return createChain(chain.__asyncOps.concat([{ type, args }]));
}

function invokeWith(chain, type, args) {
	return invoke(chainWith(chain, type, args));
}

function thenHandler(resolve, reject) {
	return invoke(this).then(resolve, reject);
}

const AsyncContextHandler = {
	get(target, name, receiver) {
		switch (name) {
			case 'then':
				return thenHandler;

			case '__asyncOps':
				return target.__asyncOps;

			default:
				return chainWith(target, 'get', [name]);
		}
	},
	set(target, name, value, receiver) {
		invokeWith(target, 'set', [name, value]);
		return true;
	},
	has(target, name) {
		throw new AsyncAccessError();
	},
	apply(target, receiver, args) {
		return chainWith(target, 'apply', [null, args]);
	},
	construct(target, args) {
		return chainWith(target, 'construct', [args]);
	},
	getOwnPropertyDescriptor(target, name) {
		throw new AsyncAccessError();
	},
	defineProperty(target, name, desc) {
		invokeWith(target, 'defineProperty', [name, desc]);
		return true;
	},
	getPrototypeOf(target) {
		throw new AsyncAccessError();
	},
	setPrototypeOf(target, newProto) {
		throw new AsyncAccessError();
	},
	deleteProperty(target, name) {
		invokeWith(target, 'deleteProperty', [name]);
	},
	enumerate(target) {
		throw new AsyncAccessError();
	},
	preventExtensions(target) {
		invokeWith(target, 'preventExtensions', []);
		return true;
	},
	isExtensible(target) {
		throw new AsyncAccessError();
	},
	ownKeys(target) {
		throw new AsyncAccessError();
	}
};

const asyncContext = createChain([]);
