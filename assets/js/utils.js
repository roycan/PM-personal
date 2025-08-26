// utils.js — attach utilities under App.utils
(function(ns){
  ns.utils = ns.utils || {};

  function generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
  }

  function formatDateISO(input) {
    if (!input) return null;
    // Accept YYYY-MM-DD or ISO; return YYYY-MM-DD
    const d = new Date(input);
    if (isNaN(d)) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function todayISO() {
    return formatDateISO(new Date());
  }

  ns.utils.generateId = generateId;
  ns.utils.formatDateISO = formatDateISO;
  ns.utils.todayISO = todayISO;

})(window.App);
