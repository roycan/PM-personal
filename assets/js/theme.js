// theme.js - ES module for light/dark toggle (replaces legacy app.boot.js theme part)
const THEME_KEY = 'pmlog:theme';
let currentTheme = localStorage.getItem(THEME_KEY) || 'light';

function applyTheme(){
  document.documentElement.classList.toggle('dark-mode', currentTheme === 'dark');
  const icon = document.querySelector('#theme-toggle .fas');
  if(icon){ icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; }
}

function toggleTheme(){
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme();
}

export function initTheme(){
  applyTheme();
  const btn = document.getElementById('theme-toggle');
  if(btn){ btn.addEventListener('click', toggleTheme); }
}

document.addEventListener('DOMContentLoaded', initTheme);
