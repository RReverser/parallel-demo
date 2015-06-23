'use strict';

(function clock() {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
  requestAnimationFrame(clock);
})();

function onInput() {
  parallel(function *() {
    // get inputs
    var x = yield asyncDocument.getElementById('x').value;
    var y = yield asyncDocument.getElementById('y').value;

    // VERY useful calculations
    for (var finish = Date.now() + 3000; Date.now() < finish;);
    var result = x * y;

    // output result
    asyncDocument.getElementById('output').value = result;
  });
}

document.getElementById('form').addEventListener('input', onInput);