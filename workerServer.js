'use strict';

var worker = new Worker('worker.js');

AsyncContextServer.attach(worker);

function parallel(func) {
	sendToWorker(worker, 'exec', func.toString());
}
