// main.index.js — initial wiring extracted from original index.html script
// This file preserves behavior but uses App.storage and App.utils where helpful.
(function(ns){
  document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const addProjectForm = document.getElementById('add-project-form');
    const newProjectNameInput = document.getElementById('new-project-name');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');
    const importModal = document.getElementById('import-modal');
    const backupBtn = document.getElementById('backup-before-import-btn');
    const confirmImportBtn = document.getElementById('confirm-import-btn');
    const modalCloseBtns = document.querySelectorAll('.modal-background, .delete, .modal-close-btn');

    let projects = [];
    const loadData = () => {
      projects = ns.storage.getProjects();
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
      const currentProjects = ns.storage.getProjects();
      currentProjects.push(p);
      ns.storage.saveProjects(currentProjects);
      loadData();
      newProjectNameInput.value = '';
      renderProjects();
      ns.events.emit('projects:changed', { projects });
    });

    projectList.addEventListener('click', (e) => {
      const item = e.target.closest('.project-item');
      if (item) ns.events.emit('project:selected', { id: item.dataset.id });
    });

    exportBtn.addEventListener('click', () => {
        const data = ns.storage.exportBundle();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pmlog-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', () => {
        importModal.classList.add('is-active');
    });

    backupBtn.addEventListener('click', () => {
        exportBtn.click();
    });

    confirmImportBtn.addEventListener('click', () => {
        importFile.click();
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target.result;
            const mode = document.querySelector('input[name="import-mode"]:checked').value;
            const result = ns.storage.importBundle(json, mode);
            if (result.success) {
                loadData();
                renderProjects();
                alert('Import successful!');
            } else {
                alert(`Import failed: ${result.error}`);
            }
            closeModal();
        };
        reader.readAsText(file);
    });

    function closeModal() {
        importModal.classList.remove('is-active');
    }

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // initial load
    loadData();
    renderProjects();
  });

})(window.App);
