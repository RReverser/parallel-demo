'use strict';

(function clock() {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString();
    requestAnimationFrame(clock);
})();

function onInput() {
  parallel(function *({ document }) {
    // get inputs
    var x = yield document.getElementById('x').value;
    var y = yield document.getElementById('y').value;

    // VERY useful calculations
    for (var finish = Date.now() + 3000; Date.now() < finish;);
    var result = x * y;

    // output result
    document.getElementById('output').value = result;
  });
}

document.getElementById('form').addEventListener('input', onInput);