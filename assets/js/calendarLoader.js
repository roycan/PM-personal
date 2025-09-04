// calendarLoader.js - Promise-based FullCalendar loader (ES module)
// Fixes path for v6 (index.global.min.*) and provides CDN fallbacks.
const FC_VERSION = '6.1.11';
const CSS_CANDIDATES = [
  `https://cdn.jsdelivr.net/npm/fullcalendar@${FC_VERSION}/index.global.min.css`,
  `https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/${FC_VERSION}/index.global.min.css`,
  `https://unpkg.com/fullcalendar@${FC_VERSION}/index.global.min.css`
];
const JS_CANDIDATES = [
  `https://cdn.jsdelivr.net/npm/fullcalendar@${FC_VERSION}/index.global.min.js`,
  `https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/${FC_VERSION}/index.global.min.js`,
  `https://unpkg.com/fullcalendar@${FC_VERSION}/index.global.min.js`
];

let loadPromise = null;

function loadCssOnce(){
  // If any of the candidate links already present, assume CSS loaded or loading.
  if(CSS_CANDIDATES.some(u=> document.querySelector(`link[href='${u}']`))) return;
  const link = document.createElement('link');
  link.rel='stylesheet';
  link.href = CSS_CANDIDATES[0];
  document.head.appendChild(link);
}

function tryLoadScriptsSequential(urls, resolve, reject, idx=0){
  if(idx >= urls.length){
    reject(new Error('Failed to load FullCalendar from all CDNs'));
    return;
  }
  const url = urls[idx];
  const s = document.createElement('script');
  s.src = url;
  s.onload = ()=> resolve();
  s.onerror = ()=> {
    console.warn('[calendarLoader] Failed', url, 'trying next');
    tryLoadScriptsSequential(urls, resolve, reject, idx+1);
  };
  document.body.appendChild(s);
}

export function loadCalendar(){
  if(window.FullCalendar) return Promise.resolve();
  if(loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject)=>{
    loadCssOnce();
    tryLoadScriptsSequential(JS_CANDIDATES, ()=>{
      if(window.FullCalendar) resolve(); else reject(new Error('FullCalendar global missing after load'));
    }, reject);
  });
  return loadPromise;
}
