// DEPRECATED storage.js
// This file previously held a full LocalStorage abstraction. We decided
// for teaching clarity to remove that layer and interact with
// localStorage directly inside page scripts (e.g. main.index.js,
// upcoming main.project.js) while keeping validation as pure helpers in
// App.utils.*. Keeping this stub for one commit so students can view git
// history diff. Scheduled for deletion next step.
window.App.storage = { DEPRECATED: true, note: 'Use localStorage directly + App.utils.validate* helpers' };
