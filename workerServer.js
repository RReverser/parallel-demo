var worker = new Worker('worker.js');

addEventListener('close', () => worker.terminate());

AsyncContextServer.attach(worker);

function parallel(func) {
	sendToWorker(worker, 'exec', func.toString());
}