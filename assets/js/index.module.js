// index.module.js - Phase 1 ES module controller (non-destructive introduction)
// Reads projects via legacy storage for now; will switch to data.js in later step.
import { generateId, todayISO } from './utils.mod.js';

function q(sel){ return document.querySelector(sel); }

function loadProjects(){
  try { return JSON.parse(localStorage.getItem('pmlog:v1:projects')) || []; } catch(e){ return []; }
}
function saveProjects(arr){ localStorage.setItem('pmlog:v1:projects', JSON.stringify(arr)); }

function render(){
  const listEl = q('#project-list');
  if(!listEl) return;
  const projects = loadProjects();
  listEl.innerHTML = '';
  if(projects.length === 0){
    listEl.innerHTML = '<p class="has-text-grey is-size-7">No projects yet.</p>';
    return;
  }
  projects.forEach(p=>{
    const a = document.createElement('a');
    a.className = 'panel-block project-item';
    a.href = `project.html?id=${encodeURIComponent(p.id)}`;
    a.textContent = p.name;
    listEl.appendChild(a);
  });
}

function attachForm(){
  const form = q('#add-project-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const input = form.querySelector('#new-project-name');
    const name = (input?.value || '').trim();
    if(!name) return;
    const projects = loadProjects();
    projects.push({ id: generateId(), name, createdAt: todayISO()});
    saveProjects(projects);
    input.value='';
    render();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Safe side-by-side: legacy main.index.js still runs; this is for migration demo.
  render();
  attachForm();
});
