/**
 * Theme Initialization Script
 * Runs synchronously before page render to prevent theme flash.
 * Must be loaded in <head> before CSS files.
 */
(function() {
  'use strict';

  function getAssetBasePath() {
    if (window.__OOBE_ASSET_BASE_PATH__) {
      return window.__OOBE_ASSET_BASE_PATH__;
    }

    // On localhost/127.0.0.1 the dev server serves files relative to the repo root,
    // so pages in /pages/ would incorrectly resolve assets under /pages/css/.
    // Use root-relative paths so everything resolves from the server root.
    var hostname = window.location.hostname;
    if (hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1') {
      window.__OOBE_ASSET_BASE_PATH__ = '/';
      return '/';
    }

    var pathname = window.location.pathname || '/';
    var hasFileExtension = /\/[^\/]+\.[^\/]+$/.test(pathname);
    var basePath;

    if (pathname.endsWith('/')) {
      basePath = pathname;
    } else if (hasFileExtension) {
      var lastSlash = pathname.lastIndexOf('/');
      basePath = lastSlash >= 0 ? pathname.substring(0, lastSlash + 1) : '/';
    } else {
      basePath = pathname + '/';
    }

    window.__OOBE_ASSET_BASE_PATH__ = basePath;
    return basePath;
  }

  function toAssetUrl(relativePath) {
    var cleanPath = (relativePath || '').replace(/^\/+/, '');
    return getAssetBasePath() + cleanPath;
  }
  
  // Get saved preferences with defaults
  var savedMode = localStorage.getItem('themeMode') || 'light';
  var savedPalette = localStorage.getItem('themePalette') || 'standard';
  var savedCssStyle = localStorage.getItem('cssStyle') || 'win11';
  var root = document.documentElement;
  
  // IMMEDIATELY set background color on html to prevent white flash
  // This must happen before any CSS loads
  var bgColors = {
    'light': '#f0f5fa',
    'dark': '#0a0a0a'
  };
  root.style.backgroundColor = bgColors[savedMode] || bgColors['light'];
  
  // Dynamically write the correct CSS files based on preference
  // This runs synchronously before any other CSS loads
  var cssBase, cssLight, cssDark;
  if (savedCssStyle === 'evolved') {
    cssBase = toAssetUrl('css/evolved.css');
    cssLight = toAssetUrl('css/evolved.light.css');
    cssDark = toAssetUrl('css/evolved.dark.css');
  } else {
    cssBase = toAssetUrl('css/win11.css');
    cssLight = toAssetUrl('css/win11.light.css');
    cssDark = toAssetUrl('css/win11.dark.css');
  }
  
  // Write CSS links directly - this happens synchronously during parse
  document.write('<link rel="stylesheet" href="' + cssBase + '" type="text/css" id="style-base" />');
  document.write('<link rel="stylesheet" href="' + cssLight + '" type="text/css" id="style-light" />');
  document.write('<link rel="stylesheet" href="' + cssDark + '" type="text/css" id="style-dark" />');
  
  // Apply all theme classes immediately to prevent flash
  root.classList.remove('dark', 'light', 'standard', 'dune', 'sapphire', 'violet', 'slate', 'emerald', 'win11', 'evolved');
  root.classList.add(savedCssStyle, savedMode, savedPalette);
  
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
  
  // Background images for each palette/mode combination
  var backgroundImages = {
    'violet': {
      'light': toAssetUrl('assets/wallpaper/background-violet-light.png'),
      'dark': toAssetUrl('assets/wallpaper/background-violet-dark.png')
    },
    'dune': {
      'light': toAssetUrl('assets/wallpaper/background-dune-light.png'),
      'dark': toAssetUrl('assets/wallpaper/background-dune-dark.png')
    },
    'sapphire': {
      'light': toAssetUrl('assets/wallpaper/background-sapphire-light.png'),
      'dark': toAssetUrl('assets/wallpaper/background-sapphire-dark.png')
    },
    'slate': {
      'light': toAssetUrl('assets/wallpaper/background-black-light.png'),
      'dark': toAssetUrl('assets/wallpaper/background-black-dark.png')
    },
    'emerald': {
      'light': toAssetUrl('assets/wallpaper/background-emerald-light.png'),
      'dark': toAssetUrl('assets/wallpaper/background-emerald-dark.png')
    },
    'standard': {
      'light': toAssetUrl('assets/wallpaper/background-standard-light.jpg'),
      'dark': toAssetUrl('assets/wallpaper/background-standard-dark.png')
    }
  };
  
  var paletteImages = backgroundImages[savedPalette] || backgroundImages['standard'];
  var bgUrl = paletteImages ? paletteImages[savedMode] : null;
  
  // Inject critical CSS variables immediately, including background image
  var criticalStyle = document.createElement('style');
  criticalStyle.id = 'theme-critical-css';
  var bgColor = savedMode === 'dark' ? '#0a0a0a' : '#f0f5fa';
  criticalStyle.textContent = 
    // Set html background immediately to prevent white flash
    'html{background-color:' + bgColor + ';' +
    (bgUrl ? 'background-image:url(\'' + bgUrl + '\');background-size:cover;background-position:center;background-attachment:fixed;background-repeat:no-repeat;' : '') +
    '}' +
    // Body should be transparent
    'body{background:transparent !important;}' +
    // Root variables
    ':root{' +
    '--smtc-background-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-background-ctrl-brand-hover:' + modeColors.brandHover + ';' +
    '--smtc-background-ctrl-brand-pressed:' + modeColors.brandPressed + ';' +
    '--smtc-stroke-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-stroke-ctrl-brand-hover:' + modeColors.brandHover + ';' +
    '--smtc-foreground-ctrl-brand-rest:' + modeColors.brand + ';' +
    '--smtc-foreground-ctrl-hint-default:' + modeColors.brand + ';' +
    (bgUrl ? '--background-image:url(\'' + bgUrl + '\');' : '') +
  '}';
  document.head.appendChild(criticalStyle);
  
  if (bgUrl) {
    // Create a preload link for the background image for faster loading
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = bgUrl;
    document.head.appendChild(preloadLink);
  }
})();
