/**
 * Theme Initialization Script
 * Runs synchronously before page render to prevent theme flash.
 * Must be loaded in <head> before CSS files.
 */
(function() {
  'use strict';
  
  // Get saved preferences with defaults
  var savedMode = localStorage.getItem('themeMode') || 'light';
  var savedPalette = localStorage.getItem('themePalette') || 'standard';
  var savedCssStyle = localStorage.getItem('cssStyle') || 'win11';
  var root = document.documentElement;
  
  // Apply CSS style links based on preference
  var styleBase = document.getElementById('style-base');
  var styleLight = document.getElementById('style-light');
  var styleDark = document.getElementById('style-dark');
  
  if (styleBase && styleLight && styleDark) {
    if (savedCssStyle === 'evolved') {
      styleBase.href = '/css/evolved.css';
      styleLight.href = '/css/evolved.light.css';
      styleDark.href = '/css/evolved.dark.css';
    } else {
      styleBase.href = '/css/win11.css';
      styleLight.href = '/css/win11.light.css';
      styleDark.href = '/css/win11.dark.css';
    }
  }
  
  // Apply all theme classes immediately to prevent flash
  root.classList.remove('dark', 'light', 'dune', 'sapphire', 'violet', 'win11', 'evolved');
  root.classList.add(savedCssStyle, savedMode);
  
  if (savedPalette !== 'standard') {
    root.classList.add(savedPalette);
  }
})();
