'use strict';

importScripts('reflect.js');
importScripts('workerHelper.js');
importScripts('asyncContext.js');

function _asyncToGenerator(fn) {
    return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(callNext, callThrow);
                }
            }

            var callNext = step.bind(null, 'next');
            var callThrow = step.bind(null, 'throw');

            callNext();
        });
    };
}

handleWorker(self, 'exec', function (code) {
	var func = eval('(' + code + ')');
	func = _asyncToGenerator(func);
	return Promise.resolve(asyncContext).then(func);
});