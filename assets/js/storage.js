/**
 * Manages data persistence using localStorage.
 * Provides versioned, namespaced storage with import/export functionality.
 * Depends on: App.utils
 * Attaches: App.storage
 */
(function (ns) {
    'use strict';

    const DATA_VERSION = 'v1';
    const PROJECTS_KEY = `pmlog:${DATA_VERSION}:projects`;
    const LOGS_KEY = `pmlog:${DATA_VERSION}:logs`;

    function getProjects() {
        return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
    }

    function saveProjects(projects) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

    function getLogs() {
        return JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
    }

    function saveLogs(logs) {
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }

    function exportBundle() {
        const bundle = {
            version: DATA_VERSION,
            exportedAt: new Date().toISOString(),
            data: {
                projects: getProjects(),
                logs: getLogs()
            }
        };
        return JSON.stringify(bundle, null, 2);
    }

    function importBundle(json, mode = 'merge') {
        try {
            const bundle = JSON.parse(json);
            if (!bundle.version || !bundle.data || !bundle.data.projects || !bundle.data.logs) {
                throw new Error('Invalid bundle structure.');
            }

            if (mode === 'overwrite') {
                saveProjects(bundle.data.projects);
                saveLogs(bundle.data.logs);
            } else { // merge
                const existingProjects = getProjects();
                const existingLogs = getLogs();

                const projectMap = new Map(existingProjects.map(p => [p.id, p]));
                bundle.data.projects.forEach(p => projectMap.set(p.id, p));
                
                const logMap = new Map(existingLogs.map(l => [l.id, l]));
                bundle.data.logs.forEach(l => logMap.set(l.id, l));

                saveProjects(Array.from(projectMap.values()));
                saveLogs(Array.from(logMap.values()));
            }
            return { success: true };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    function resetToSample(sampleData) {
        saveProjects(sampleData.projects);
        saveLogs(sampleData.logs);
    }

    ns.storage = {
        getProjects,
        saveProjects,
        getLogs,
        saveLogs,
        exportBundle,
        importBundle,
        resetToSample
    };

})(window.App);

