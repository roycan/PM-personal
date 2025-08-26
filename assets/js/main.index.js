// main.index.js — initial wiring extracted from original index.html script
// This file preserves behavior but uses App.storage and App.utils where helpful.
(function(ns){
  // ...existing code...
  // For now, keep main logic in place but reference App.utils helpers.

  document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const addProjectForm = document.getElementById('add-project-form');
    const newProjectNameInput = document.getElementById('new-project-name');

    // Load data from localStorage (simple inline until storage module is introduced)
    let projects = [];
    const loadData = () => {
      const stored = localStorage.getItem('projectLog_projects');
      projects = stored ? JSON.parse(stored) : [];
    };
    const saveData = () => {
      localStorage.setItem('projectLog_projects', JSON.stringify(projects));
    };

    const renderProjects = () => {
      projectList.innerHTML = '';
      if (projects.length === 0) {
        projectList.innerHTML = '<p class="has-text-grey">No projects yet. Add one to get started!</p>';
      } else {
        projects.forEach(project => {
          const projectDiv = document.createElement('div');
          projectDiv.className = `panel-block project-item`;
          projectDiv.dataset.id = project.id;
          projectDiv.innerHTML = `\n            <span class="panel-icon"><i class="fas fa-folder"></i></span>\n            ${project.name}\n          `;
          projectList.appendChild(projectDiv);
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
