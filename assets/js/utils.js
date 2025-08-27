// utils.js — attach utilities under App.utils
(function(ns){
  ns.utils = ns.utils || {};

  const DATA_VERSION = 1; // exposed for reference (export/import bundle version)

  function generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
  }

  function formatDateISO(input) {
    if (!input) return null;
    // Accept YYYY-MM-DD or ISO; return YYYY-MM-DD
    const d = new Date(input);
    if (isNaN(d)) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function todayISO() { return formatDateISO(new Date()); }

  // --- Validation helpers (moved from deprecated storage layer) ---
  function validateProject(p){
    const errors = [];
    if(!p || typeof p !== 'object') errors.push('Project not an object');
    else {
      if(!p.id) errors.push('Project missing id');
      if(!p.name) errors.push('Project missing name');
    }
    return errors;
  }
  function dateRegex(){ return /^\d{4}-\d{2}-\d{2}$/; }
  function isRealISODate(str){
    if(!dateRegex().test(str)) return false;
    const [y,m,d] = str.split('-').map(Number);
    const dt = new Date(str + 'T00:00:00Z');
    return dt.getUTCFullYear() === y && (dt.getUTCMonth()+1) === m && dt.getUTCDate() === d;
  }
  function validateLog(l, projectIds){
    const errors = [];
    if(!l || typeof l !== 'object') errors.push('Log not an object');
    else {
      if(!l.id) errors.push('Log missing id');
      if(!l.projectId) errors.push('Log missing projectId');
      if(l.projectId && projectIds && !projectIds.has(l.projectId)) errors.push('Log projectId not found');
      if(!l.date || !isRealISODate(l.date)) errors.push('Log date invalid');
      if(!l.results) errors.push('Log missing results');
    }
    return errors;
  }
  function validateBundle(bundle){
    const errors = [];
    if(!bundle || typeof bundle !== 'object') return { ok:false, errors:['Bundle not an object'] };
    if(bundle.version !== DATA_VERSION) errors.push('Unsupported version (expected '+DATA_VERSION+')');
    if(!Array.isArray(bundle.projects)) errors.push('projects must be an array');
    if(!Array.isArray(bundle.logs)) errors.push('logs must be an array');
    if(errors.length) return { ok:false, errors };
    const projectIds = new Set();
    bundle.projects.forEach(p => {
      validateProject(p).forEach(e=>errors.push(`Project ${p.id||'?'}: ${e}`));
      if(p && p.id){ if(projectIds.has(p.id)) errors.push('Duplicate project id '+p.id); projectIds.add(p.id);}  
    });
    const logIds = new Set();
    bundle.logs.forEach(l => {
      validateLog(l, projectIds).forEach(e=>errors.push(`Log ${l.id||'?'}: ${e}`));
      if(l && l.id){ if(logIds.has(l.id)) errors.push('Duplicate log id '+l.id); logIds.add(l.id);}  
    });
    return errors.length ? { ok:false, errors } : { ok:true, errors:[] };
  }

  ns.utils.DATA_VERSION = DATA_VERSION;
  ns.utils.generateId = generateId;
  ns.utils.formatDateISO = formatDateISO;
  ns.utils.todayISO = todayISO;
  ns.utils.validateProject = validateProject;
  ns.utils.validateLog = validateLog;
  ns.utils.validateBundle = validateBundle;

  // --- Analytics (extracted from inline project page logic) ---
  // Summarize an array of logs (already filtered to one project where needed)
  function summarizeLogs(logs){
    if(!Array.isArray(logs) || logs.length===0){
      return { total:0, firstDate:null, lastDate:null };
    }
    // dates are stored as YYYY-MM-DD so lexical sort works
    let first = logs[0].date, last = logs[0].date;
    logs.forEach(l=>{
      if(l.date < first) first = l.date;
      if(l.date > last) last = l.date;
    });
    return { total: logs.length, firstDate:first, lastDate:last };
  }

  function activityLastNDays(logs, days){
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-days);
    const active = new Set();
    logs.forEach(l=>{
      const d = new Date(l.date);
      if(d>cutoff) active.add(l.date);
    });
    return { activeDays: active.size, window: days };
  }

  ns.utils.analytics = {
    summarizeLogs,
    activityLastNDays
  };

})(window.App);
