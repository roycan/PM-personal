// main.project.js - logic for project detail page (logs CRUD)
(function(ns){
  const KEY_PROJECTS = 'pmlog:v1:projects';
  const KEY_LOGS = 'pmlog:v1:logs';

  function read(key){
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : []; } catch(e){ console.warn('parse error', key, e); return []; }
  }
  function write(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

  function getProjectIdFromUrl(){
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }

  function loadData(){
    return { projects: read(KEY_PROJECTS), logs: read(KEY_LOGS) };
  }

  function saveLogs(logs){ write(KEY_LOGS, logs); }

  function renderProject(project){
    document.getElementById('projectTitle').textContent = project.name;
    document.getElementById('projectMeta').textContent = 'Project ID: '+project.id;
  }

  function renderLogs(projectId, logs){
    const tbody = document.getElementById('logsTbody');
    tbody.innerHTML = '';
    logs.filter(l => l.projectId === projectId)
      .sort((a,b)=> a.date.localeCompare(b.date))
      .forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${l.date}</td>
          <td>${escapeHtml(shorten(l.results, 120))}</td>
          <td>
            <button class="button is-small is-danger" data-del="${l.id}">Delete</button>
          </td>`;
        tbody.appendChild(tr);
      });
  }

  function shorten(str, max){ return str.length > max ? str.slice(0,max-3)+'...' : str; }
  function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

  function attachDeleteHandler(projectId){
    document.getElementById('logsTbody').addEventListener('click', e => {
      const btn = e.target.closest('button[data-del]');
      if(!btn) return;
      const id = btn.getAttribute('data-del');
      const { logs } = loadData();
      const filtered = logs.filter(l => l.id !== id);
      saveLogs(filtered);
      renderLogs(projectId, filtered);
    });
  }

  function setupForm(projectId){
    const form = document.getElementById('logForm');
    const errEl = document.getElementById('logFormError');
    form.date.value = ns.utils.todayISO();
    form.addEventListener('submit', e => {
      e.preventDefault();
      errEl.style.display = 'none';
      const { projects, logs } = loadData();
      const projectIds = new Set(projects.map(p=>p.id));
      const log = {
        id: ns.utils.generateId(),
        projectId,
        date: form.date.value,
        results: form.results.value.trim(),
        observations: form.observations.value.trim(),
        reflections: form.reflections.value.trim(),
        createdAt: new Date().toISOString()
      };
      const errors = ns.utils.validateLog(log, projectIds);
      if(errors.length){
        errEl.textContent = errors.join('; ');
        errEl.style.display = '';
        return;
      }
      logs.push(log);
      saveLogs(logs);
      form.reset();
      form.date.value = ns.utils.todayISO();
      renderLogs(projectId, logs);
    });
  }

  function init(){
    const projectId = getProjectIdFromUrl();
    if(!projectId){
      alert('Missing project id');
      location.href = 'index.html';
      return;
    }
    const { projects, logs } = loadData();
    const project = projects.find(p=>p.id===projectId);
    if(!project){
      alert('Project not found');
      location.href = 'index.html';
      return;
    }
    renderProject(project);
    renderLogs(projectId, logs);
    attachDeleteHandler(projectId);
    setupForm(projectId);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.App);
