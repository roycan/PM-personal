// data.js - ES module data layer (Phase 1)
// Provides localStorage CRUD + migration from legacy keys.
// NOTE: Only project CRUD used in Phase 1; log functions stubbed for later phases.

export const DATA_VERSION = 1;
export const KEYS = { projects: 'ppl:v1:projects', logs: 'ppl:v1:logs' };
const LEGACY = { projects: 'pmlog:v1:projects', logs: 'pmlog:v1:logs' };
const MIGRATION_FLAG = 'ppl:migrated:v1';

function read(key){
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function write(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

function migrateIfNeeded(){
  if(localStorage.getItem(MIGRATION_FLAG)) return;
  const newProjects = read(KEYS.projects);
  const newLogs = read(KEYS.logs);
  if(newProjects.length === 0 && newLogs.length === 0){
    const oldProjects = read(LEGACY.projects);
    const oldLogs = read(LEGACY.logs);
    if(oldProjects.length || oldLogs.length){
      write(KEYS.projects, oldProjects);
      write(KEYS.logs, oldLogs);
      localStorage.setItem(MIGRATION_FLAG, '1');
      console.info('[data] migration performed from legacy keys');
    }
  }
}

export function migrationStatus(){
  return {
    migrated: !!localStorage.getItem(MIGRATION_FLAG),
    hasNewProjects: read(KEYS.projects).length>0,
    hasLegacyProjects: read(LEGACY.projects).length>0,
    hasNewLogs: read(KEYS.logs).length>0,
    hasLegacyLogs: read(LEGACY.logs).length>0
  };
}

// Project CRUD
export function getProjects(){ migrateIfNeeded(); return read(KEYS.projects); }
export function saveProjects(arr){ write(KEYS.projects, arr); }
export function addProject(project){ const arr = getProjects(); arr.push(project); saveProjects(arr); return project; }

// Log stubs (implemented in later phases)
export function getLogs(){ migrateIfNeeded(); return read(KEYS.logs); }
export function saveLogs(arr){ write(KEYS.logs, arr); }
export function getLogsByProject(projectId){ return getLogs().filter(l=> l.projectId === projectId); }
export function addLog(log){ const logs = getLogs(); logs.push(log); saveLogs(logs); return log; }
export function updateLog(log){ const logs = getLogs().map(l=> l.id === log.id ? log : l); saveLogs(logs); return log; }
export function deleteLog(id){ const logs = getLogs().filter(l=> l.id !== id); saveLogs(logs); }

// Export / Import (Phase 4 full; here only project portion for forward compatibility)
export function exportBundle(){
  return {
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    projects: getProjects(),
    logs: getLogs()
  };
}

export function importBundle(bundle,{ mode='merge' }={}){
  if(!bundle || typeof bundle !== 'object') throw new Error('Bundle not object');
  if(bundle.version !== DATA_VERSION) throw new Error('Version mismatch');
  if(!Array.isArray(bundle.projects) || !Array.isArray(bundle.logs)) throw new Error('Invalid bundle arrays');
  if(mode === 'overwrite'){
    saveProjects(bundle.projects);
    saveLogs(bundle.logs);
    return { mode, replaced: true };
  }
  // merge by id
  const pMap = new Map(getProjects().map(p=>[p.id,p]));
  bundle.projects.forEach(p=> p && p.id && pMap.set(p.id,p));
  saveProjects([...pMap.values()]);
  const lMap = new Map(getLogs().map(l=>[l.id,l]));
  bundle.logs.forEach(l=> l && l.id && lMap.set(l.id,l));
  saveLogs([...lMap.values()]);
  return { mode, replaced: false };
}

// Utility for manual testing in console
export function _debugForceMigration(){ localStorage.removeItem(MIGRATION_FLAG); migrateIfNeeded(); }
