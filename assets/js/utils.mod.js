// utils.mod.js - ES module version of selected utilities (Phase 1)
// Temporary parallel to legacy global utils.js. Will replace it in a later phase.

export function generateId(){
  return `id_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
}

export function formatDateISO(input){
  if(!input) return null;
  const d = new Date(input);
  if(isNaN(d)) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

export function todayISO(){
  return formatDateISO(new Date());
}

// Validation helpers (subset for Phase 1; logs validation extended in later phases)
export function validateProject(p){
  const errors = [];
  if(!p || typeof p !== 'object') errors.push('Not an object');
  else {
    if(!p.id) errors.push('Missing id');
    if(!p.name) errors.push('Missing name');
  }
  return errors;
}

export function validateBundle(b){
  const errors = [];
  if(!b || typeof b !== 'object') return { ok:false, errors:['Bundle not object'] };
  if(b.version !== 1) errors.push('Unsupported version');
  if(!Array.isArray(b.projects)) errors.push('projects not array');
  if(!Array.isArray(b.logs)) errors.push('logs not array');
  if(errors.length) return { ok:false, errors };
  // Deep validation (non-fatal: collect all errors)
  b.projects.forEach((p,i)=>{
    const pe = validateProject(p);
    if(pe.length) errors.push(`project[${i}]: ${pe.join(', ')}`);
  });
  b.logs.forEach((l,i)=>{
    const le = validateLog(l);
    if(le.length) errors.push(`log[${i}]: ${le.join(', ')}`);
  });
  return errors.length ? { ok:false, errors } : { ok:true, errors:[] };
}

export function validateLog(l){
  const errors = [];
  if(!l || typeof l !== 'object') return ['Not an object'];
  if(!l.id) errors.push('Missing id');
  if(!l.projectId) errors.push('Missing projectId');
  if(!l.date || !/^\d{4}-\d{2}-\d{2}$/.test(l.date)) errors.push('Invalid date');
  if(!l.results) errors.push('Missing results');
  return errors;
}
