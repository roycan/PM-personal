/**
 * Injects FullCalendar CSS and JS into the page on demand.
 * This avoids loading a large library until it's needed.
 */
(function (ns) {
    'use strict';

    const FULLCALENDAR_VERSION = '6.1.11';
    const CSS_URL = `https://cdn.jsdelivr.net/npm/fullcalendar@${FULLCALENDAR_VERSION}/main.min.css`;
    const JS_URL = `https://cdn.jsdelivr.net/npm/fullcalendar@${FULLCALENDAR_VERSION}/main.min.js`;

    let loaded = false;
    let loading = false;
    const subscribers = [];

    function load(callback) {
        if (loaded) {
            callback();
            return;
        }
        subscribers.push(callback);
        if (loading) {
            return;
        }
        loading = true;

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = CSS_URL;
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = JS_URL;
        script.onload = () => {
            loaded = true;
            loading = false;
            subscribers.forEach(cb => cb());
            subscribers.length = 0; // Clear subscribers
        };
        script.onerror = () => {
            console.error('Failed to load FullCalendar.');
            loading = false;
        };
        document.body.appendChild(script);
    }

    ns.vendor = ns.vendor || {};
    ns.vendor.fullcalendarLoader = {
        load
    };

})(window.App);
