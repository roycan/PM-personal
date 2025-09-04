// project.js - Phase 2 initial (add log only) controller
import { generateId, todayISO } from './utils.mod.js';
import { getProjects, getLogsByProject, addLog, updateLog, deleteLog } from './data.js';
import { summarizeLogs, activityLastNDays } from './analytics.mod.js';
import { loadCalendar } from './calendarLoader.js';

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function getProjectId(){
  const params = new URLSearchParams(location.search);
  return params.get('id');
}

let currentProjectId = null;
const filterState = { q: '', start: '', end: '', sortDir: 'desc' }; // sortDir: 'asc' | 'desc'
let searchDebounceTimer = null;
let calendarInstance = null;

function getFilteredLogs(){
  let logs = getLogsByProject(currentProjectId).slice();
  const total = logs.length;
  // Text search
  if(filterState.q){
    const q = filterState.q.toLowerCase();
    logs = logs.filter(l => [l.results, l.observations, l.reflections].filter(Boolean).join(' ').toLowerCase().includes(q));
  }
  // Date range
  if(filterState.start){
    logs = logs.filter(l => l.date >= filterState.start);
  }
  if(filterState.end){
    logs = logs.filter(l => l.date <= filterState.end);
  }
  // Sort
  logs.sort((a,b)=> filterState.sortDir==='desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  return { logs, total };
}

function renderProjectHeader(project){
  const titleEl = qs('#projectTitle');
  const metaEl = qs('#projectMeta');
  if(titleEl) titleEl.textContent = project ? project.name : 'Unknown Project';
  if(metaEl) metaEl.textContent = project ? `Project ID: ${project.id}` : '';
}

function renderLogs(){
  const tbody = qs('#logsTbody');
  if(!tbody) return;
  const { logs, total } = getFilteredLogs();
  tbody.innerHTML='';
  logs.forEach(l => {
    const tr = document.createElement('tr');
    tr.dataset.id = l.id;
    tr.innerHTML = `<td>${l.date}</td><td>${escapeHtml(truncate(l.results, 120))}</td><td><button class="button is-small" data-expand="${l.id}">Details</button> <button class="button is-small" data-edit="${l.id}">Edit</button> <button class="button is-small is-danger" data-del="${l.id}">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  const countEl = qs('#logCount');
  if(countEl){
    const filtered = logs.length;
    if(filtered === total){
      countEl.textContent = `${filtered} log(s) found.`;
    } else {
      countEl.textContent = `${filtered} of ${total} log(s) found.`;
    }
  }
  updateSortHeader();
  refreshAnalytics();
  refreshCalendarEvents();
}

function truncate(s,max){ return s.length>max ? s.slice(0,max-3)+'…' : s; }
function escapeHtml(str){ const d=document.createElement('div'); d.textContent=str; return d.innerHTML; }

function setupForm(){
  const form = qs('#logForm');
  if(!form) return;
  form.date.value = form.date.value || todayISO();
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const editingId = form.dataset.editingId;
    const payload = {
      id: editingId || generateId(),
      projectId: currentProjectId,
      date: form.date.value,
      results: form.results.value.trim(),
      observations: form.observations.value.trim(),
      reflections: form.reflections.value.trim()
    };
    if(editingId){
      updateLog(payload);
    } else {
      addLog(payload);
    }
    form.reset();
    form.removeAttribute('data-editing-id');
    form.date.value = todayISO();
    renderLogs();
  });
}

function setupTableActions(){
  const tbody = qs('#logsTbody');
  if(!tbody) return;
  tbody.addEventListener('click', e=>{
    const expandBtn = e.target.closest('button[data-expand]');
    if(expandBtn){
      toggleExpansion(expandBtn.getAttribute('data-expand'));
      return;
    }
    const delBtn = e.target.closest('button[data-del]');
    if(delBtn){
      deleteLog(delBtn.getAttribute('data-del'));
      renderLogs();
      return;
    }
    const editBtn = e.target.closest('button[data-edit]');
    if(editBtn){
      const id = editBtn.getAttribute('data-edit');
      const log = getLogsByProject(currentProjectId).find(l=> l.id===id);
      if(log){
        const form = qs('#logForm');
        form.date.value = log.date;
        form.results.value = log.results;
        form.observations.value = log.observations || '';
        form.reflections.value = log.reflections || '';
        form.dataset.editingId = log.id;
        // Switch to add form tab if needed
        const addTab = document.querySelector('[data-tab="log-entry"]');
        if(addTab){ addTab.click(); }
      }
    }
  });
}

function setupFilters(){
  const searchInput = qs('#logSearch');
  const startInput = qs('#startDate');
  const endInput = qs('#endDate');
  const clearBtn = qs('#clearFilters');
  const sortToggle = qs('#dateSortToggle');

  if(searchInput){
    searchInput.addEventListener('input', ()=>{
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(()=>{
        filterState.q = searchInput.value.trim();
        renderLogs();
      }, 200); // debounce (Phase 3.5)
    });
  }
  if(startInput){
    startInput.addEventListener('change', ()=>{ filterState.start = startInput.value || ''; renderLogs(); });
  }
  if(endInput){
    endInput.addEventListener('change', ()=>{ filterState.end = endInput.value || ''; renderLogs(); });
  }
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{
      filterState.q=''; filterState.start=''; filterState.end='';
      if(searchInput) searchInput.value='';
      if(startInput) startInput.value='';
      if(endInput) endInput.value='';
      renderLogs();
    });
  }
  if(sortToggle){
    sortToggle.addEventListener('click', ()=>{
      filterState.sortDir = filterState.sortDir === 'desc' ? 'asc' : 'desc';
      renderLogs();
    });
  }
}

function updateSortHeader(){
  const sortToggle = qs('#dateSortToggle');
  if(!sortToggle) return;
  const arrow = filterState.sortDir === 'desc' ? '▼' : '▲';
  // Preserve base label 'Date'
  sortToggle.textContent = `Date ${arrow}`;
}

function toggleExpansion(logId){
  const existing = qs('tr.log-details');
  if(existing){ existing.remove(); }
  // If we clicked the one that was open, just close
  if(existing && existing.dataset.forId === logId) return;
  const anchor = qs(`tr[data-id='${CSS.escape(logId)}']`);
  if(!anchor) return;
  const log = getLogsByProject(currentProjectId).find(l=> l.id===logId);
  if(!log) return;
  const detailsTr = document.createElement('tr');
  detailsTr.className = 'log-details';
  detailsTr.dataset.forId = logId;
  const colSpan = anchor.children.length;
  detailsTr.innerHTML = `<td colspan="${colSpan}">
    <div class="content">
      <p><strong>Results:</strong> ${escapeHtml(log.results)}</p>
      ${log.observations ? `<p><strong>Observations:</strong> ${escapeHtml(log.observations)}</p>`:''}
      ${log.reflections ? `<p><strong>Reflections:</strong> ${escapeHtml(log.reflections)}</p>`:''}
    </div>
  </td>`;
  anchor.after(detailsTr);
}

function setupTabs(){
  const tabs = qsa('.tabs li');
  const contents = qsa('.tab-content');
  function activateTab(target){
    tabs.forEach(t=>t.classList.remove('is-active'));
    const activeTab = tabs.find(t=> t.dataset.tab === target);
    if(activeTab) activeTab.classList.add('is-active');
    contents.forEach(c=> c.classList.toggle('is-active-view', c.id===target));
    if(target === 'calendar-view') ensureCalendar();
    if(target === 'analytics-view') refreshAnalytics();
  }
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      activateTab(tab.dataset.tab);
    });
  });
  // expose for other handlers
  window._activateProjectTab = activateTab;
}

// -------- Analytics (Phase 5) --------
function refreshAnalytics(){
  const logs = getLogsByProject(currentProjectId);
  const stats = summarizeLogs(logs);
  const activity = activityLastNDays(logs, 30);
  const totalEl = qs('#total-logs');
  const firstEl = qs('#first-log-date');
  const lastEl = qs('#last-log-date');
  const bar = qs('#activity-bar');
  const text = qs('#activity-text');
  if(totalEl) totalEl.textContent = stats.total;
  if(firstEl) firstEl.textContent = stats.firstDate || 'N/A';
  if(lastEl) lastEl.textContent = stats.lastDate || 'N/A';
  if(bar){ bar.value = activity.activeDays; }
  if(text){ text.textContent = `${activity.activeDays} / 30 days with activity.`; }
}

// -------- Calendar (Phase 5) --------
function ensureCalendar(){
  if(calendarInstance) return; // already initialized
  loadCalendar().then(()=>{
    initCalendar();
  }).catch(err=>{
    console.error('[calendar] load failed', err);
  });
}

function initCalendar(){
  const el = qs('#calendar');
  if(!el) return;
  // eslint-disable-next-line no-undef
  calendarInstance = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    height: 'auto',
    events: buildCalendarEvents(),
    eventClick(info){
      const id = info.event.extendedProps.logId;
      if(id){
        // Switch to logs list tab first so the row is visible
        if(window._activateProjectTab) window._activateProjectTab('logs-list');
        // Allow layout paint
        setTimeout(()=>{
          toggleExpansion(id);
          const row = qs(`tr[data-id='${CSS.escape(id)}']`);
          if(row){
            row.scrollIntoView({ behavior:'smooth', block:'center' });
            row.classList.add('has-background-warning-light');
            setTimeout(()=> row.classList.remove('has-background-warning-light'), 1500);
          }
        }, 50);
      }
    }
  });
  calendarInstance.render();
}

function buildCalendarEvents(){
  const logs = getLogsByProject(currentProjectId);
  return logs.map(l => ({
    title: truncate((l.results||'').replace(/\s+/g,' '), 20),
    start: l.date,
    allDay: true,
    extendedProps: { logId: l.id }
  }));
}

function refreshCalendarEvents(){
  if(!calendarInstance) return; // not yet initialized
  const events = buildCalendarEvents();
  calendarInstance.removeAllEvents();
  events.forEach(ev => calendarInstance.addEvent(ev));
}

document.addEventListener('DOMContentLoaded', ()=>{
  currentProjectId = getProjectId();
  const project = getProjects().find(p=> p.id === currentProjectId);
  renderProjectHeader(project);
  renderLogs();
  setupForm();
  setupTableActions();
  setupFilters();
  setupTabs();
  // Pre-compute analytics so switching tab feels instant
  refreshAnalytics();
});
