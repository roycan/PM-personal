// main.index.js — initial wiring extracted from original index.html script
// This file preserves behavior but uses App.storage and App.utils where helpful.
(function(ns){
  // ...existing code...
  // For now, keep main logic in place but reference App.utils helpers.

  document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const addProjectForm = document.getElementById('add-project-form');
    const newProjectNameInput = document.getElementById('new-project-name');

    // Load data from localStorage (now using unified key)
    const KEY_PROJECTS = 'pmlog:v1:projects';
    let projects = [];
    const loadData = () => {
      try { const stored = localStorage.getItem(KEY_PROJECTS); projects = stored ? JSON.parse(stored) : []; }
      catch(e){ console.warn('Projects parse error', e); projects = []; }
    };
    const saveData = () => {
      localStorage.setItem(KEY_PROJECTS, JSON.stringify(projects));
    };

    const renderProjects = () => {
      projectList.innerHTML = '';
      if (projects.length === 0) {
        projectList.innerHTML = '<p class="has-text-grey">No projects yet. Add one to get started!</p>';
      } else {
        projects.forEach(project => {
          const a = document.createElement('a');
          a.className = 'panel-block project-item';
          a.dataset.id = project.id;
          a.href = `project.html?id=${encodeURIComponent(project.id)}`;
          a.innerHTML = `\n            <span class="panel-icon"><i class="fas fa-folder"></i></span>\n            ${project.name}\n          `;
          projectList.appendChild(a);
        });
      }
    };

    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = newProjectNameInput.value.trim();
      if (!name) return;
      const p = { id: ns.utils.generateId(), name, createdAt: ns.utils.todayISO() };
      projects.push(p);
      saveData();
      newProjectNameInput.value = '';
      renderProjects();
      ns.events.emit('projects:changed', { projects });
    });

    projectList.addEventListener('click', (e) => {
      const item = e.target.closest('.project-item');
      if (item) ns.events.emit('project:selected', { id: item.dataset.id });
    });

    // initial load
    loadData();
    renderProjects();
  });

})(window.App);
