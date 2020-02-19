importScripts('workerHelper.js');
importScripts('asyncContext.js');

handleWorker(self, 'exec', function(code) {
	var func = eval('(' + code + ')');
	return func(asyncContext);
});
