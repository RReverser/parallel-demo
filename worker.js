'use strict';

importScripts('reflect.js');
importScripts('workerHelper.js');
importScripts('asyncContext.js');

handleWorker(self, 'exec', function (code) {
	return Promise.resolve().then(eval('(' + code + ')'));
});