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

  // Theme manager
  const theme = (function() {
    const THEME_KEY = 'pmlog:theme';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'light';

    function applyTheme() {
      document.documentElement.classList.toggle('dark-mode', currentTheme === 'dark');
      const icon = document.querySelector('#theme-toggle .fas');
      if (icon) {
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    function toggleTheme() {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme();
    }

    function init() {
      applyTheme();
      const toggleButton = document.getElementById('theme-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
      }
    }
    
    return { init };
  })();

  ns.theme = theme;

  // Simple Pub/Sub event bus
  const events = (function () {
    const topics = {};
    return {
      on: function (topic, listener) {
        if (!topics[topic]) {
          topics[topic] = [];
        }
        topics[topic].push(listener);
      },
      off: function (topic, listener) {
        if (!topics[topic]) {
          return;
        }
        const index = topics[topic].indexOf(listener);
        if (index > -1) {
          topics[topic].splice(index, 1);
        }
      },
      emit: function (topic, data) {
        if (!topics[topic]) {
          return;
        }
        topics[topic].forEach(function (listener) {
          listener(data);
        });
      }
    };
  })();

  window.App.events = events;

  /**
   * Expected App structure:
   * App = {
   *   config: { ... },
   *   utils: { ... },
   *   storage: { ... },
   *   events: { on, off, emit },
   *   render: {
   *     projects: { ... },
   *     projectPage: { ... }
   *   },
   *   // main.index.js and main.project.js attach their own init functions
   * }
   */
  document.addEventListener('DOMContentLoaded', () => {
    ns.theme.init();
  });

})(window.App);
