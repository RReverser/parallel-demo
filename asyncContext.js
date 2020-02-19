'use strict';

const ASYNC_OPS = new WeakMap();

function createChain(ops) {
	let chain = function() {};
	ASYNC_OPS.set(chain, ops);
	return new Proxy(chain, AsyncContextHandler);
}

class AsyncAccessError extends TypeError {
	constructor() {
		super("Can't perform synchronous operation on remote object.");
	}
}

function invokeOps(ops) {
	return sendToWorker(self, 'asyncContext', ops);
}

function chainOps(chain, type, args) {
	return ASYNC_OPS.get(chain).concat([{ type, args }]);
}

function chainWith(chain, type, args) {
	return createChain(chainOps(chain, type, args));
}

function invokeWith(chain, type, args) {
	return invokeOps(chainOps(chain, type, args));
}

const { then } = Promise.prototype;

const AsyncContextHandler = {
	get(target, name, receiver) {
		if (name === 'then') {
			return then.bind(invokeOps(ASYNC_OPS.get(target)));
		}
		return chainWith(target, 'get', [name]);
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
