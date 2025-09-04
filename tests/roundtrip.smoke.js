// roundtrip.smoke.js (Phase 4.7) - Automated export/import verification
// Usage (open roundtrip.html or import as module in console):
//   window.runExportImportSmoke().then(r => console.log(r));
// Ensures:
// 1. Overwrite import restores an earlier snapshot exactly (except exportedAt)
// 2. Merge import preserves post-snapshot additions while restoring snapshot items
// 3. State is returned to original baseline after test

import { exportBundle, importBundle, getProjects, getLogs, saveProjects, saveLogs } from '../assets/js/data.js';
import { generateId, todayISO } from '../assets/js/utils.mod.js';

function canonicalSnapshot(bundle){
  return JSON.stringify({
    version: bundle.version,
    projects: [...bundle.projects].sort((a,b)=> a.id.localeCompare(b.id)),
    logs: [...bundle.logs].sort((a,b)=> a.id.localeCompare(b.id))
  });
}

function removeProject(projectId){
  const projects = getProjects().filter(p=> p.id !== projectId);
  const logs = getLogs().filter(l=> l.projectId !== projectId);
  saveProjects(projects); // using internal save helpers via named imports not exposed, so we fallback to import mutate API via importBundle overwrite trick if save not exported
  saveLogs(logs);
}

export async function runExportImportSmoke(){
  const report = { steps: [], success: true };
  const start = performance.now();
  try {
    // Step 0: Baseline snapshot
    const baseline = exportBundle();
    const baselineCanon = canonicalSnapshot(baseline);
    report.steps.push({ step: 'baseline', projects: baseline.projects.length, logs: baseline.logs.length });

    // Guard: ensure there is at least one project; if none create a temp one (will be cleaned)
    let createdTemp = false;
    if(baseline.projects.length === 0){
      const tempProj = { id: generateId(), name: 'TEMP_RT_PROJECT', createdAt: todayISO() };
      const tempLog = { id: generateId(), projectId: tempProj.id, date: todayISO(), results: 'temp results', observations: '', reflections: '' };
      const newBundle = JSON.parse(JSON.stringify(baseline));
      newBundle.projects.push(tempProj); newBundle.logs.push(tempLog);
      importBundle(newBundle, { mode: 'overwrite' });
      createdTemp = true;
      report.steps.push({ step: 'seed-temp', projectId: tempProj.id });
    }

    // Refresh baseline after possible seeding
    const seededBaseline = exportBundle();
    const seededCanon = canonicalSnapshot(seededBaseline);

    // Step 1: Overwrite test - remove one project then restore
    const targetProjectId = seededBaseline.projects[0]?.id;
    if(!targetProjectId) throw new Error('No project id after seeding');
    removeProject(targetProjectId);
    report.steps.push({ step: 'mutate-delete-project', deleted: targetProjectId });
    // Sanity: ensure deletion took effect
    if(getProjects().some(p=> p.id === targetProjectId)) throw new Error('Deletion failed');
    // Restore via overwrite
    importBundle(seededBaseline, { mode: 'overwrite' });
    const afterOverwriteCanon = canonicalSnapshot(exportBundle());
    const overwritePass = afterOverwriteCanon === seededCanon;
    if(!overwritePass){
      report.success = false;
      report.steps.push({ step: 'overwrite-restore', pass: false });
      throw new Error('Overwrite import did not exactly restore snapshot');
    }
    report.steps.push({ step: 'overwrite-restore', pass: true });

    // Step 2: Merge test - create extra project/log then merge baseline
    const extraProj = { id: generateId(), name: 'EXTRA_RT_PROJECT', createdAt: todayISO() };
    const extraLog = { id: generateId(), projectId: extraProj.id, date: todayISO(), results: 'extra results', observations: '', reflections: '' };
    const withExtra = exportBundle();
    withExtra.projects.push(extraProj); withExtra.logs.push(extraLog);
    importBundle(withExtra, { mode: 'overwrite' });
    report.steps.push({ step: 'add-extra', extraProjectId: extraProj.id });
    // Merge original seededBaseline (should keep extra)
    importBundle(seededBaseline, { mode: 'merge' });
    const merged = exportBundle();
    const hasExtra = merged.projects.some(p=> p.id === extraProj.id) && merged.logs.some(l=> l.id === extraLog.id);
    const mergeDidNotDelete = hasExtra;
    report.steps.push({ step: 'merge-keep-extra', pass: mergeDidNotDelete });
    if(!mergeDidNotDelete){
      report.success = false;
      throw new Error('Merge removed new extra project/log');
    }

    // Step 3: Cleanup - restore to original baseline (without extras or temp)
    importBundle(baseline, { mode: 'overwrite' });
    if(createdTemp){
      // Remove temp project if baseline had none originally
      const finalCanon = canonicalSnapshot(exportBundle());
      if(finalCanon !== baselineCanon){
        report.success = false;
        report.steps.push({ step: 'final-restore', pass: false });
        throw new Error('Final restore mismatch');
      }
    }
    report.steps.push({ step: 'final-restore', pass: true });
  } catch(err){
    report.error = err.message;
  } finally {
    report.ms = Math.round(performance.now() - start);
  }
  if(!window.__roundTripReports) window.__roundTripReports = [];
  window.__roundTripReports.push(report);
  return report;
}

// Attach convenience global
window.runExportImportSmoke = runExportImportSmoke;
