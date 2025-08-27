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
    const logCount = document.getElementById('logCount');
    tbody.innerHTML = '';

    const searchTerm = document.getElementById('logSearch').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filteredLogs = logs.filter(l => {
      if (l.projectId !== projectId) return false;
      
      if (startDate && l.date < startDate) return false;
      if (endDate && l.date > endDate) return false;

      const searchMatch = !searchTerm || 
        l.results.toLowerCase().includes(searchTerm) ||
        (l.observations && l.observations.toLowerCase().includes(searchTerm)) ||
        (l.reflections && l.reflections.toLowerCase().includes(searchTerm));
      
      return searchMatch;
    });

    filteredLogs.sort((a,b)=> b.date.localeCompare(a.date)) // Sort descending
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
    
    logCount.textContent = `${filteredLogs.length} log(s) found.`;
    updateAnalytics(filteredLogs);
  }

  function shorten(str, max){ return str.length > max ? str.slice(0,max-3)+'...' : str; }
  function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

  function attachDeleteHandler(projectId){
    document.getElementById('logsTbody').addEventListener('click', e => {
      const btn = e.target.closest('button[data-del]');
      if (!btn) return;

      const id = btn.getAttribute('data-del');
      const { logs } = loadData();
      const filtered = logs.filter(l => l.id !== id);
      saveLogs(filtered);
      renderLogs(projectId, filtered);
    });
  }

  function setupForm(projectId){
    const form = document.getElementById('logForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const newLog = {
        id: Date.now().toString(),
        projectId,
        date: form.date.value,
        results: form.results.value,
        observations: form.observations.value,
        reflections: form.reflections.value
      };
      const { logs } = loadData();
      logs.push(newLog);
      saveLogs(logs);
      form.reset();
      renderLogs(projectId, logs);
    });
  }

  function setupFilters(projectId){
    const logSearch = document.getElementById('logSearch');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const clearFilters = document.getElementById('clearFilters');

    function applyFilters() {
        const { logs } = loadData();
        renderLogs(projectId, logs);
    }

    logSearch.addEventListener('input', applyFilters);
    startDate.addEventListener('input', applyFilters);
    endDate.addEventListener('input', applyFilters);

    clearFilters.addEventListener('click', () => {
        logSearch.value = '';
        startDate.value = '';
        endDate.value = '';
        applyFilters();
    });
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('.tabs li');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');

            const target = tab.dataset.tab;
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.add('is-active-view');
                } else {
                    content.classList.remove('is-active-view');
                }
            });

            if (target === 'calendar-view') {
                const projectId = getProjectIdFromUrl();
                const { logs } = loadData();
                const projectLogs = logs.filter(l => l.projectId === projectId);
                App.vendor.fullcalendarLoader.load(() => {
                    renderCalendar(projectLogs);
                });
            }
        });
    });
  }

  function renderCalendar(logs) {
    const calendarEl = document.getElementById('calendar');
    const events = logs.map(log => ({
        title: log.results,
        start: log.date,
        allDay: true
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        }
    });
    calendar.render();
  }

  function updateAnalytics(logs) {
    const totalLogs = document.getElementById('total-logs');
    const firstLogDate = document.getElementById('first-log-date');
    const lastLogDate = document.getElementById('last-log-date');
    const activityBar = document.getElementById('activity-bar');
    const activityText = document.getElementById('activity-text');

    totalLogs.textContent = logs.length;

    if (logs.length > 0) {
        const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
        firstLogDate.textContent = sortedLogs[0].date;
        lastLogDate.textContent = sortedLogs[logs.length - 1].date;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentLogs = logs.filter(log => new Date(log.date) > thirtyDaysAgo);
        const activeDays = new Set(recentLogs.map(log => log.date)).size;
        
        activityBar.value = activeDays;
        activityText.textContent = `${activeDays} / 30 days with activity.`;

    } else {
        firstLogDate.textContent = 'N/A';
        lastLogDate.textContent = 'N/A';
        activityBar.value = 0;
        activityText.textContent = '0 / 30 days with activity.';
    }
  }

  function init(){
    const projectId = getProjectIdFromUrl();
    const { projects, logs } = loadData();
    const project = projects.find(p => p.id === projectId) || { id: projectId, name: 'Unknown Project' };

    renderProject(project);
    renderLogs(projectId, logs);
    attachDeleteHandler(projectId);
    setupForm(projectId);
    setupFilters(projectId);
    setupTabs();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.App);
