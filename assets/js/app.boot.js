// app.boot.js
// Establish a single global namespace `App` and a small pub/sub via closure.
window.App = window.App || {};

(function(ns) {
  // events pub/sub
  const handlers = new Map();

  function on(eventName, fn) {
    if (!handlers.has(eventName)) handlers.set(eventName, new Set());
    handlers.get(eventName).add(fn);
  }
  function off(eventName, fn) {
    if (!handlers.has(eventName)) return;
    handlers.get(eventName).delete(fn);
  }
  function once(eventName, fn) {
    function wrapper(payload) { fn(payload); off(eventName, wrapper); }
    on(eventName, wrapper);
  }
  function emit(eventName, payload) {
    if (!handlers.has(eventName)) return;
    handlers.get(eventName).forEach(h => { try { h(payload); } catch (e) { console.error(e); } });
  }

  ns.events = { on, off, once, emit };

  // simple logger for teaching; no external deps
  ns.log = function(...args) { console.log('[App]', ...args); };

})(window.App);
