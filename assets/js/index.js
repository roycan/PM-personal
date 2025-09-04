// index.js - ES module controller (Phase 1 final) replacing legacy main.index.js
// Responsibilities: list projects, add project, basic empty state.
import { generateId, todayISO, validateBundle } from './utils.mod.js';
import { addProject, getProjects, exportBundle, importBundle } from './data.js';

function el(sel){ return document.querySelector(sel); }

function renderProjects(){
  const list = el('#project-list');
  if(!list) return;
  const projects = getProjects();
  list.innerHTML='';
  if(projects.length === 0){
    list.innerHTML = '<p class="has-text-grey is-size-7">No projects yet. Use the form above to add your first project.</p>';
    return;
  }
  projects.forEach(p=>{
    const a = document.createElement('a');
    a.className='panel-block project-item';
    a.href = `project.html?id=${encodeURIComponent(p.id)}`;
    a.textContent = p.name;
    list.appendChild(a);
  });
}

function setupAddProject(){
  const form = el('#add-project-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const input = form.querySelector('#new-project-name');
    const name = (input?.value||'').trim();
    if(!name) return;
    addProject({ id: generateId(), name, createdAt: todayISO() });
    input.value='';
    renderProjects();
  });
}

// Phase 4: Export / Import UI
let pendingImport = null; // holds parsed bundle awaiting confirmation

function setupExportImport(){
  const exportBtn = el('#export-btn');
  const importBtn = el('#import-btn');
  const importFile = el('#import-file');
  const backupBtn = el('#backup-before-import-btn');
  const confirmBtn = el('#confirm-import-btn');
  const importModal = el('#import-modal');
  const importStatus = el('#import-status');
  const importSummary = el('#import-summary');

  function openModal(){ if(importModal) importModal.classList.add('is-active'); }
  function closeModal(){ if(importModal){ importModal.classList.remove('is-active'); importStatus.textContent=''; importStatus.className='mt-2 is-size-7'; importSummary.textContent=''; pendingImport=null; } }
  // Close handlers (buttons/background)
  document.addEventListener('click', e=>{
    if(e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-background') || e.target.classList.contains('delete')){
      if(e.target.closest('#import-modal')) closeModal();
    }
  });

  if(exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const bundle = exportBundle();
      const blob = new Blob([JSON.stringify(bundle,null,2)], { type:'application/json' });
      const ts = bundle.exportedAt.replace(/[:T]/g,'-').slice(0,19);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `project-log-export-${ts}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
    });
  }
  if(importBtn && importFile){
    importBtn.addEventListener('click', ()=> importFile.click());
    importFile.addEventListener('change', ()=>{
      if(!importFile.files || !importFile.files[0]) return;
      const file = importFile.files[0];
      if(file.size > 2 * 1024 * 1024){
        alert('File too large (>2MB).');
        importFile.value='';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          const v = validateBundle(json);
            if(!v.ok){
              pendingImport = null;
              openModal();
              importSummary.textContent = '';
              importStatus.textContent = 'Invalid bundle: '+ v.errors.slice(0,5).join('; ')+(v.errors.length>5?' …':'');
              importStatus.className = 'mt-2 is-size-7 has-text-danger';
            } else {
              pendingImport = json;
              openModal();
              importSummary.textContent = `Bundle OK: ${json.projects.length} project(s), ${json.logs.length} log(s). Choose a mode.`;
              importStatus.textContent='Ready to import';
              importStatus.className='mt-2 is-size-7 has-text-success';
            }
        } catch(err){
          pendingImport = null;
          openModal();
          importSummary.textContent = '';
          importStatus.textContent = 'Parse error: '+ err.message;
          importStatus.className = 'mt-2 is-size-7 has-text-danger';
        } finally {
          importFile.value=''; // reset so same file can re-trigger
        }
      };
      reader.readAsText(file);
    });
  }
  if(backupBtn){
    backupBtn.addEventListener('click', e=>{
      e.preventDefault();
      const bundle = exportBundle();
      const blob = new Blob([JSON.stringify(bundle,null,2)], { type:'application/json' });
      const ts = bundle.exportedAt.replace(/[:T]/g,'-').slice(0,19);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `project-log-backup-${ts}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
    });
  }
  if(confirmBtn){
    confirmBtn.addEventListener('click', ()=>{
      if(!pendingImport){
        importStatus.textContent='No valid bundle loaded.';
        importStatus.className='mt-2 is-size-7 has-text-danger';
        return;
      }
      const mode = (document.querySelector('input[name="import-mode"]:checked')||{}).value || 'merge';
      try {
        const result = importBundle(pendingImport,{ mode });
        importStatus.textContent = `Import success (${mode}).`;
        importStatus.className='mt-2 is-size-7 has-text-success';
        renderProjects();
        // slight delay then close
        setTimeout(()=> closeModal(), 700);
      } catch(err){
        importStatus.textContent = 'Import failed: '+ err.message;
        importStatus.className='mt-2 is-size-7 has-text-danger';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProjects();
  setupAddProject();
  setupExportImport();
});
