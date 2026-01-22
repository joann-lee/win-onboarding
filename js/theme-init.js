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
  
  // Critical CSS variables for each palette (button backgrounds)
  var paletteColors = {
    'violet': {
      'light': { brand: '#6D45A0', brandHover: '#8B5DC0', brandPressed: '#4E2D80' },
      'dark': { brand: '#9B6FD0', brandHover: '#B08BE0', brandPressed: '#7A4FB0' }
    },
    'dune': {
      'light': { brand: '#7D554A', brandHover: '#9A6B5D', brandPressed: '#5C3A32' },
      'dark': { brand: '#A87B6F', brandHover: '#C09588', brandPressed: '#8B6156' }
    },
    'sapphire': {
      'light': { brand: '#4D5990', brandHover: '#6271AA', brandPressed: '#30396E' },
      'dark': { brand: '#7B8AC0', brandHover: '#95A3D4', brandPressed: '#5A6AA0' }
    },
    'slate': {
      'light': { brand: '#525B68', brandHover: '#6B7280', brandPressed: '#3A4150' },
      'dark': { brand: '#8A929E', brandHover: '#A3AAB4', brandPressed: '#6B7380' }
    },
    'emerald': {
      'light': { brand: '#2D8A5F', brandHover: '#3AA876', brandPressed: '#1F6647' },
      'dark': { brand: '#4DB87F', brandHover: '#65C992', brandPressed: '#3A9A68' }
    },
    'standard': {
      'light': { brand: '#005FB8', brandHover: '#006cbe', brandPressed: '#005fa8' },
      'dark': { brand: '#4090ff', brandHover: '#5ca3ff', brandPressed: '#3385ff' }
    }
  };
  
  // Inject critical CSS variables immediately
  var colors = paletteColors[savedPalette] || paletteColors['standard'];
  var modeColors = colors[savedMode] || colors['light'];
  
  var criticalStyle = document.createElement('style');
  criticalStyle.id = 'theme-critical-css';
  criticalStyle.textContent = ':root{' +
    '--smtc-background-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-background-ctrl-brand-hover:' + modeColors.brandHover + ';' +
    '--smtc-background-ctrl-brand-pressed:' + modeColors.brandPressed + ';' +
    '--smtc-stroke-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-stroke-ctrl-brand-hover:' + modeColors.brandHover + ';' +
    '--smtc-foreground-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-foreground-ctrl-hint-default:' + modeColors.brand + ';' +
  '}';
  document.head.appendChild(criticalStyle);
  
  // Preload background image to ensure it's ready when page renders
  var backgroundImages = {
    'violet': {
      'light': '/assets/wallpaper/background-violet-light.png',
      'dark': '/assets/wallpaper/background-violet-dark.png'
    },
    'dune': {
      'light': '/assets/wallpaper/background-dune-light.png',
      'dark': '/assets/wallpaper/background-dune-dark.png'
    },
    'sapphire': {
      'light': '/assets/wallpaper/electric-teal.webp',
      'dark': '/assets/wallpaper/electric-teal.webp'
    },
    'slate': {
      'light': '/assets/wallpaper/background-black-light.png',
      'dark': '/assets/wallpaper/background-black-dark.png'
    },
    'emerald': {
      'light': '/assets/wallpaper/background-emerald-light.png',
      'dark': '/assets/wallpaper/background-emerald-dark.png'
    },
    'standard': {
      'light': '/assets/wallpaper/background-standard-light.jpg',
      'dark': '/assets/wallpaper/background-standard-dark.png'
    }
  };
  
  var paletteImages = backgroundImages[savedPalette] || backgroundImages['standard'];
  var bgUrl = paletteImages ? paletteImages[savedMode] : null;
  
  if (bgUrl) {
    // Create a preload link for the background image
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = bgUrl;
    document.head.appendChild(preloadLink);
  }
})();
