//All the JS needed across the pages to use the different controls.

// Debug Configuration - Set to true to enable debugging features
const OOBE_DEBUG_ENABLED = false;

    // Trigger lottie refresh if available
    const lottieContainers = document.querySelectorAll('.lottie-container');
    lottieContainers.forEach(container => {
      if (container._lottieInstance) {
        container._lottieInstance.resize();
      }
      // Force SVG to repaint
      const svg = container.querySelector('svg');
      if (svg) {
        svg.style.visibility = 'hidden';
        void svg.offsetHeight;
        svg.style.visibility = 'visible';
      }
    });
  }
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to let initial render complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceRepaint();
        });
      });
    });
  }
  
  // Also run on window load for slower devices
  window.addEventListener('load', () => {
    // Multiple attempts with increasing delays for problematic devices
    setTimeout(forceRepaint, 50);
    setTimeout(forceRepaint, 200);
    setTimeout(forceRepaint, 500);
    setTimeout(forceRepaint, 1000);
  });
  
  // Expose for manual triggering if needed
  window.forceRepaint = forceRepaint;
  
  // ===== ARM64 Dynamic Content Fix =====
  // MutationObserver to detect when content is dynamically added
  // and force a repaint - critical for ARM devices where dynamic content doesn't render
  const observer = new MutationObserver((mutations) => {
    let needsRepaint = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if we added nodes to wifi-list, lottie-container, or other dynamic areas
        const target = mutation.target;
        if (target.classList && (
          target.classList.contains('wifi-list') ||
          target.classList.contains('lottie-container') ||
          target.id === 'wifi-list' ||
          target.id === 'lottie'
        )) {
          needsRepaint = true;
          
          // Force immediate repaint of added nodes
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Force the node to repaint
              node.style.transform = 'translateZ(0)';
              void node.offsetHeight;
              node.style.visibility = 'hidden';
              void node.offsetHeight;
              node.style.visibility = 'visible';
            }
          });
        }
        
        // Also check if SVG was added (lottie generates SVGs)
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'svg' || (node.querySelector && node.querySelector('svg'))) {
            needsRepaint = true;
            const svg = node.nodeName === 'svg' ? node : node.querySelector('svg');
            if (svg) {
              svg.style.transform = 'translateZ(0)';
              void svg.offsetHeight;
            }
          }
        });
      }
    }
    
    if (needsRepaint) {
      // Debounce repaints
      requestAnimationFrame(() => {
        forceRepaint();
        // Additional delayed repaint for ARM
        setTimeout(forceRepaint, 50);
        setTimeout(forceRepaint, 200);
      });
    }
  });
  
  // Start observing when DOM is ready
  const startObserver = () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();

// Handle back button navigation (data-cta="back")
(function initBackButton() {
  window.addEventListener('load', () => {
    const backButton = document.querySelector('[data-cta="back"]');
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
      });
    }
  });
})();

// Electron IPC: Handle system resume events (e.g., wake from sleep)
(function initElectronResumeHandler() {
  // Check if running in Electron environment
  if (typeof require !== 'undefined') {
    try {
      const { ipcRenderer } = require('electron');
      
      ipcRenderer.on('system-resumed', () => {
        console.log('Received system-resumed event in renderer');
        
        // Lightweight refresh actions:
        // - Reset any animations that may have stalled
        const animations = document.querySelectorAll('.lottie-container');
        animations.forEach(anim => {
          if (anim._lottieInstance) {
            anim._lottieInstance.goToAndPlay(0);
          }
        });
        
        // - Re-apply theme to ensure visual consistency
        const currentMode = localStorage.getItem('themeMode') || 'light';
        const currentPalette = localStorage.getItem('themePalette') || 'standard';
        if (window.applyThemeMode) {
          window.applyThemeMode(currentMode, currentPalette);
        }
        
        // - Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('oobe-system-resumed'));
        
        // Uncomment below for a full page refresh if needed:
        // location.reload();
      });
      
      console.log('Electron system-resume handler initialized');
    } catch (e) {
      // Not running in Electron or ipcRenderer not available
      console.log('Not running in Electron environment, skipping resume handler');
    }
  }
})();

// Fullscreen toggle helper function (works in browsers, limited in Electron)
function toggleFullscreenFallback() {
  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.log('Fullscreen API not supported:', err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
  } else {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log('Fullscreen API not supported:', err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    }
  }
}

// Custom Right-Click Context Menu
(function initContextMenu() {
  // Create context menu HTML
  const menuHTML = `
    <div id="oobe-context-menu" class="oobe-context-menu">
      <div class="context-menu-item" data-action="flow-editor">
        <span class="context-menu-icon">⚙</span>
        <span class="context-menu-label">Flow Editor</span>
        <span class="context-menu-shortcut">F2</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="back">
        <span class="context-menu-icon">←</span>
        <span class="context-menu-label">Go Back</span>
      </div>
      <div class="context-menu-item" data-action="home">
        <span class="context-menu-icon">⌂</span>
        <span class="context-menu-label">Go to Config</span>
      </div>
      <div class="context-menu-item" data-action="restart-oobe">
        <span class="context-menu-icon">↺</span>
        <span class="context-menu-label">Restart OOBE</span>
        <span class="context-menu-shortcut"></span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item has-submenu" data-action="mode">
        <span class="context-menu-icon">◐</span>
        <span class="context-menu-label">Light/Dark Mode</span>
        <span class="context-menu-arrow">›</span>
        <div class="context-submenu">
          <div class="context-menu-item" data-mode="light">
            <span class="context-menu-icon">☀</span>
            <span class="context-menu-label">Light</span>
          </div>
          <div class="context-menu-item" data-mode="dark">
            <span class="context-menu-icon">☾</span>
            <span class="context-menu-label">Dark</span>
          </div>
        </div>
      </div>
      <div class="context-menu-item has-submenu" data-action="theme">
        <span class="context-menu-icon">🎨</span>
        <span class="context-menu-label">Theme Color</span>
        <span class="context-menu-arrow">›</span>
        <div class="context-submenu">
          <div class="context-menu-item" data-theme="standard">
            <span class="context-menu-color" style="background: #0078d4;"></span>
            <span class="context-menu-label">Standard</span>
          </div>
          <div class="context-menu-item" data-theme="dune">
            <span class="context-menu-color" style="background: #d4a574;"></span>
            <span class="context-menu-label">Dune</span>
          </div>
          <div class="context-menu-item" data-theme="sapphire">
            <span class="context-menu-color" style="background: #0066cc;"></span>
            <span class="context-menu-label">Sapphire</span>
          </div>
          <div class="context-menu-item" data-theme="violet">
            <span class="context-menu-color" style="background: #8b5cf6;"></span>
            <span class="context-menu-label">Violet</span>
          </div>
          <div class="context-menu-item" data-theme="slate">
            <span class="context-menu-color" style="background: #64748b;"></span>
            <span class="context-menu-label">Slate</span>
          </div>
          <div class="context-menu-item" data-theme="emerald">
            <span class="context-menu-color" style="background: #10b981;"></span>
            <span class="context-menu-label">Emerald</span>
          </div>
        </div>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="reload">
        <span class="context-menu-icon">↻</span>
        <span class="context-menu-label">Reload Page</span>
        <span class="context-menu-shortcut">F5</span>
      </div>
      <div class="context-menu-item" data-action="toggle-fullscreen">
        <span class="context-menu-icon">⛶</span>
        <span class="context-menu-label">Exit Fullscreen</span>
        <span class="context-menu-shortcut">F11</span>
      </div>
    </div>
  `;

  // Create context menu styles
  const menuStyles = `
    <style id="oobe-context-menu-styles">
      .oobe-context-menu {
        position: fixed;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        padding: 4px;
        min-width: 200px;
        z-index: 999999;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.95);
        transform-origin: top left;
        transition: opacity 100ms ease, transform 100ms ease, visibility 100ms;
        font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
        font-size: 14px;
      }

      .oobe-context-menu.active {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .context-menu-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        color: #1a1a1a;
        gap: 12px;
      }

      .context-menu-item:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .context-menu-icon {
        width: 16px;
        text-align: center;
        opacity: 0.8;
      }

      .context-menu-label {
        flex: 1;
      }

      .context-menu-shortcut {
        opacity: 0.5;
        font-size: 12px;
      }

      .context-menu-divider {
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
        margin: 4px 8px;
      }

      .context-menu-arrow {
        opacity: 0.5;
        font-size: 14px;
      }

      .context-menu-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .context-menu-item.has-submenu {
        position: relative;
      }

      .context-submenu {
        position: absolute;
        left: 100%;
        top: -4px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        padding: 4px;
        min-width: 150px;
        opacity: 0;
        visibility: hidden;
        transform: translateX(-10px);
        transition: opacity 100ms ease, transform 100ms ease, visibility 100ms;
      }

      .context-menu-item.has-submenu:hover > .context-submenu {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }

      .context-submenu .context-menu-item[data-theme].active {
        background: rgba(0, 120, 212, 0.1);
      }

      .context-submenu .context-menu-item[data-mode].active {
        background: rgba(0, 120, 212, 0.1);
      }

      /* Dark mode styles */
      html.dark .oobe-context-menu {
        background: rgba(40, 40, 40, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
      }

      html.dark .context-menu-item {
        color: #ffffff;
      }

      html.dark .context-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      html.dark .context-menu-divider {
        background: rgba(255, 255, 255, 0.1);
      }

      html.dark .context-submenu {
        background: rgba(40, 40, 40, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
      }

      html.dark .context-submenu .context-menu-item[data-theme].active {
        background: rgba(255, 255, 255, 0.15);
      }

      html.dark .context-submenu .context-menu-item[data-mode].active {
        background: rgba(255, 255, 255, 0.15);
      }
    </style>
  `;

  // Inject styles and menu into DOM
  document.head.insertAdjacentHTML('beforeend', menuStyles);
  document.body.insertAdjacentHTML('beforeend', menuHTML);

  const contextMenu = document.getElementById('oobe-context-menu');

  // Show context menu on right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    // Position menu at cursor
    let x = e.clientX;
    let y = e.clientY;

    // Ensure menu stays within viewport
    const menuRect = contextMenu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Show menu first to get dimensions
    contextMenu.classList.add('active');
    
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;

    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
  });

  // Hide context menu on click outside or escape
  document.addEventListener('click', () => {
    contextMenu.classList.remove('active');
  });

  // Mark current theme as active
  function updateActiveTheme() {
    const currentPalette = localStorage.getItem('themePalette') || 'standard';
    contextMenu.querySelectorAll('[data-theme]').forEach(item => {
      item.classList.toggle('active', item.dataset.theme === currentPalette);
    });
  }

  // Mark current mode as active
  function updateActiveMode() {
    const currentMode = localStorage.getItem('themeMode') || 'light';
    contextMenu.querySelectorAll('[data-mode]').forEach(item => {
      item.classList.toggle('active', item.dataset.mode === currentMode);
    });
  }

  // Handle menu item clicks
  contextMenu.addEventListener('click', (e) => {
    const item = e.target.closest('.context-menu-item');
    if (!item) return;

    const action = item.dataset.action;
    const theme = item.dataset.theme;
    const mode = item.dataset.mode;

    // Handle mode selection (light/dark)
    if (mode) {
      e.stopPropagation();
      const root = document.documentElement;
      
      // Remove existing mode classes
      root.classList.remove('light', 'dark');
      
      // Apply selected mode
      root.classList.add(mode);
      
      // Save to localStorage
      localStorage.setItem('themeMode', mode);
      
      // Update active state
      updateActiveMode();
      
      contextMenu.classList.remove('active');
      return;
    }

    // Handle theme selection
    if (theme) {
      e.stopPropagation();
      const root = document.documentElement;
      
      // Remove all palette classes
      root.classList.remove('dune', 'sapphire', 'violet', 'slate', 'emerald');
      
      // Apply selected palette
      if (theme !== 'standard') {
        root.classList.add(theme);
      }
      
      // Save to localStorage
      localStorage.setItem('themePalette', theme);
      
      // Update active state
      updateActiveTheme();
      
      contextMenu.classList.remove('active');
      return;
    }

    // Skip if clicking on theme submenu parent
    if (action === 'theme') return;

    // Skip if clicking on mode submenu parent
    if (action === 'mode') return;

    e.stopPropagation(); // Prevent document click from interfering
    contextMenu.classList.remove('active');

    switch (action) {
      case 'back':
        window.history.back();
        break;
      case 'home':
        window.location.href = '/';
        break;
      case 'restart-oobe':
        window.location.href = '/pages/boot.html';
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'toggle-fullscreen':
        // Try Electron IPC first (if available)
        if (window.electronAPI && window.electronAPI.toggleFullscreen) {
          window.electronAPI.toggleFullscreen();
        } else if (window.require) {
          // Try Electron's remote module
          try {
            const { remote } = window.require('electron');
            const win = remote.getCurrentWindow();
            win.setFullScreen(!win.isFullScreen());
          } catch (e) {
            // Fall back to standard Fullscreen API
            toggleFullscreenFallback();
          }
        } else {
          // Standard browser Fullscreen API
          toggleFullscreenFallback();
        }
        break;
      case 'flow-editor':
        if (window.openFlowEditorPanel) {
          window.openFlowEditorPanel();
        }
        break;
    }
  });

  // Update active theme on menu open
  document.addEventListener('contextmenu', () => {
    updateActiveTheme();
    updateActiveMode();
  });
})();

// Hotkey: F2 for flow editor
(function initFlowEditorHotkey() {
  document.addEventListener('keydown', (e) => {
    // F2 opens flow editor panel
    if (e.key === 'F2' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (window.openFlowEditorPanel) {
        window.openFlowEditorPanel();
      }
    }
  });
})();

// Theme initialization - apply saved preferences from index.html
(function initTheme() {
  const savedMode = localStorage.getItem('themeMode') || 'light';
  const savedPalette = localStorage.getItem('themePalette') || 'standard';
  const savedCssStyle = localStorage.getItem('cssStyle') || 'win11';
  const root = document.documentElement;
  
  // Remove all theme classes from html element
  root.classList.remove('dark', 'light', 'dune', 'sapphire', 'violet', 'slate', 'emerald', 'win11', 'evolved');
  
  // Apply saved CSS style to html element
  root.classList.add(savedCssStyle);
  
  // Apply saved mode to html element
  root.classList.add(savedMode);
  
  // Apply saved palette to html element
  if (savedPalette === 'dune') {
    root.classList.add('dune');
  } else if (savedPalette === 'sapphire') {
    root.classList.add('sapphire');
  } else if (savedPalette === 'violet') {
    root.classList.add('violet');
  } else if (savedPalette === 'slate') {
    root.classList.add('slate');
  } else if (savedPalette === 'emerald') {
    root.classList.add('emerald');
  }
})();

// Debug controls for NDUP progression
(function initDebugControls() {
  // Only initialize debug controls if debugging is enabled
  if (!OOBE_DEBUG_ENABLED) return;
  
  // Add global debug object
  window.oobeDebug = {
    // Check if NDUP auto-progression is paused
    isNdupPaused: function() {
      return localStorage.getItem('oobeDebug-pauseNdup') === 'true';
    },
    
    // Pause NDUP auto-progression
    pauseNdup: function() {
      localStorage.setItem('oobeDebug-pauseNdup', 'true');
      console.log('🔧 NDUP auto-progression PAUSED. Use oobeDebug.resumeNdup() to continue.');
      return 'NDUP progression paused';
    },
    
    // Resume NDUP auto-progression
    resumeNdup: function() {
      localStorage.setItem('oobeDebug-pauseNdup', 'false');
      console.log('▶️ NDUP auto-progression RESUMED.');
      return 'NDUP progression resumed';
    },
    
    // Toggle NDUP auto-progression
    toggleNdup: function() {
      return this.isNdupPaused() ? this.resumeNdup() : this.pauseNdup();
    }
  };
  
  // Log debug availability
  console.log('🔧 OOBE Debug controls loaded. Use oobeDebug.pauseNdup() / oobeDebug.resumeNdup() / oobeDebug.toggleNdup()');
})();

// Mode toggle button functionality
(function initModeToggle() {
  // Palette colors for updating critical CSS (must match theme-init.js)
  const paletteColors = {
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

  // Background images for each palette
  const backgroundImages = {
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

  // Update critical CSS variables for the current theme
  function updateCriticalCSS(palette, mode) {
    const colors = paletteColors[palette] || paletteColors['standard'];
    const modeColors = colors[mode] || colors['light'];
    
    let criticalStyle = document.getElementById('theme-critical-css');
    if (!criticalStyle) {
      criticalStyle = document.createElement('style');
      criticalStyle.id = 'theme-critical-css';
      document.head.appendChild(criticalStyle);
    }
    
    criticalStyle.textContent = ':root{' +
      '--smtc-background-ctrl-brand-rest:' + modeColors.brand + ';' +
      '--smtc-background-ctrl-brand-hover:' + modeColors.brandHover + ';' +
      '--smtc-background-ctrl-brand-pressed:' + modeColors.brandPressed + ';' +
      '--smtc-stroke-ctrl-brand-rest:' + modeColors.brand + ';' +
      '--smtc-stroke-ctrl-brand-hover:' + modeColors.brandHover + ';' +
      '--smtc-foreground-ctrl-brand-rest:' + modeColors.brand + ';' +
      '--smtc-foreground-ctrl-hint-default:' + modeColors.brand + ';' +
    '}';
  }

  // Update background image CSS variable
  function updateBackgroundImage(palette, mode) {
    const images = backgroundImages[palette] || backgroundImages['standard'];
    const bgUrl = images[mode] || images['light'];
    document.documentElement.style.setProperty('--background-image', `url('${bgUrl}')`);
  }

  // Apply theme with smooth transition
  function applyTheme(newMode) {
    const root = document.documentElement;
    const body = document.body;
    const palette = localStorage.getItem('themePalette') || 'standard';
    
    // Enable transitions
    root.classList.add('theme-transitioning');
    
    // Update classes
    root.classList.remove('light', 'dark');
    root.classList.add(newMode);
    body.classList.remove('light', 'dark');
    body.classList.add(newMode);
    
    // Update critical CSS variables
    updateCriticalCSS(palette, newMode);
    
    // Update background image
    updateBackgroundImage(palette, newMode);
    
    // Save preference
    localStorage.setItem('themeMode', newMode);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Find the mode button by its aria-label or icon
    const modeButton = document.querySelector('[aria-label="Mode settings"]');
    
    if (modeButton) {
      modeButton.addEventListener('click', () => {
        const currentMode = localStorage.getItem('themeMode') || 'light';
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        
        applyTheme(newMode);
        modeButton.setAttribute('aria-pressed', newMode === 'dark' ? 'true' : 'false');
      });
      
      // Set initial aria-pressed state
      const currentMode = localStorage.getItem('themeMode') || 'light';
      modeButton.setAttribute('aria-pressed', currentMode === 'dark' ? 'true' : 'false');

      // Right-click context menu for color palette switching
      initColorPaletteMenu(modeButton);
    }
  });

  // Expose applyTheme globally for palette menu to use
  window.applyThemeMode = applyTheme;
})();

// Color palette menu for right-click on mode button
function initColorPaletteMenu(modeButton) {
  console.log('🎨 initColorPaletteMenu called, modeButton:', modeButton);
  
  const palettes = [
    { id: 'standard', label: 'Standard' },
    { id: 'dune', label: 'Dune' },
    { id: 'sapphire', label: 'Sapphire' },
    { id: 'violet', label: 'Violet' },
    { id: 'slate', label: 'Slate' },
    { id: 'emerald', label: 'Emerald' }
  ];

  // Add tooltip to the mode button - try multiple approaches for web components
  modeButton.setAttribute('title', 'Right click to change theme');
  modeButton.title = 'Right click to change theme';
  // Also try setting on inner elements
  const innerImg = modeButton.querySelector('img');
  if (innerImg) {
    innerImg.setAttribute('title', 'Right click to change theme');
  }
  console.log('🎨 Tooltip set on modeButton');

  // Create the menu container using innerHTML for proper slot handling
  const menuWrapper = document.createElement('div');
  menuWrapper.id = 'color-palette-menu-wrapper';
  menuWrapper.style.position = 'fixed';
  menuWrapper.style.zIndex = '9999';
  menuWrapper.style.display = 'none';
  
  // Build menu items HTML
  const menuItemsHtml = palettes.map(p => 
    `<mai-menu-item data-palette="${p.id}">${p.label}</mai-menu-item>`
  ).join('');
  
  menuWrapper.innerHTML = `
    <mai-menu open>
      <mai-menu-list>
        ${menuItemsHtml}
      </mai-menu-list>
    </mai-menu>
  `;
  
  document.body.appendChild(menuWrapper);
  console.log('🎨 Menu wrapper added to body');
  console.log('🎨 Menu wrapper innerHTML:', menuWrapper.innerHTML);

  // Add click handlers to menu items
  const menuItems = menuWrapper.querySelectorAll('mai-menu-item');
  console.log('🎨 Found menu items:', menuItems.length);
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      console.log('🎨 Menu item clicked:', item.dataset.palette);
      applyColorPalette(item.dataset.palette);
      menuWrapper.style.display = 'none';
    });
  });

  // Right-click handler at document level to capture events from shadow DOM
  document.addEventListener('contextmenu', (e) => {
    console.log('🎨 contextmenu event fired, target:', e.target);
    console.log('🎨 composedPath:', e.composedPath());
    
    // Check if the click is on the mode button or its children
    const target = e.target;
    const containsTarget = modeButton.contains(target);
    const isTarget = target === modeButton;
    const inComposedPath = e.composedPath().includes(modeButton);
    
    console.log('🎨 containsTarget:', containsTarget, 'isTarget:', isTarget, 'inComposedPath:', inComposedPath);
    
    const isOnModeButton = containsTarget || isTarget || inComposedPath;
    
    console.log('🎨 isOnModeButton:', isOnModeButton);
    
    if (isOnModeButton) {
      console.log('🎨 Opening palette menu!');
      e.preventDefault();
      e.stopPropagation();
      
      // Position the menu near the button
      const rect = modeButton.getBoundingClientRect();
      menuWrapper.style.left = `${rect.left}px`;
      menuWrapper.style.bottom = `${window.innerHeight - rect.top + 8}px`;
      menuWrapper.style.top = 'auto';
      
      // Toggle the menu visibility
      if (menuWrapper.style.display === 'none') {
        menuWrapper.style.display = 'block';
        console.log('🎨 Menu now visible');
      } else {
        menuWrapper.style.display = 'none';
        console.log('🎨 Menu now hidden');
      }
      
      return false;
    }
  }, true);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuWrapper.contains(e.target) && !modeButton.contains(e.target)) {
      menuWrapper.style.display = 'none';
    }
  });

  // Mark current palette in menu
  updatePaletteMenuSelection();
  console.log('🎨 initColorPaletteMenu complete');
}

function applyColorPalette(paletteId) {
  const root = document.documentElement;
  const body = document.body;
  const currentMode = localStorage.getItem('themeMode') || 'light';
  
  // Enable transitions
  root.classList.add('theme-transitioning');
  
  // Remove all palette classes
  root.classList.remove('dune', 'sapphire', 'violet', 'slate', 'emerald');
  body.classList.remove('dune', 'sapphire', 'violet', 'slate', 'emerald');
  
  // Apply the selected palette (standard has no class)
  if (paletteId !== 'standard') {
    root.classList.add(paletteId);
    body.classList.add(paletteId);
  }
  
  // Save preference
  localStorage.setItem('themePalette', paletteId);
  
  // Update critical CSS variables using the global function
  if (window.applyThemeMode) {
    // Re-apply current mode to update colors for new palette
    window.applyThemeMode(currentMode);
  }
  
  // Update menu selection indicator
  updatePaletteMenuSelection();
  
  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 350);
}

function updatePaletteMenuSelection() {
  const currentPalette = localStorage.getItem('themePalette') || 'standard';
  const menuItems = document.querySelectorAll('#color-palette-menu-wrapper mai-menu-item');
  
  menuItems.forEach(item => {
    if (item.dataset.palette === currentPalette) {
      item.setAttribute('aria-current', 'true');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

// Shared per-page initialization: lottie animation & accessibility
(function initLottie() {
  function loadLottieAnimation() {
    const lottieContainer = document.getElementById('lottie');
    if (!lottieContainer) return false;
    
    // Check if already initialized
    if (lottieContainer.hasAttribute('data-lottie-initialized')) return true;
    
    // Check for lottie library - it can be window.lottie or window.bodymovin
    const lottieLib = window.lottie || window.bodymovin;
    
    // Ensure the library is loaded and has the loadAnimation method
    if (lottieLib && typeof lottieLib.loadAnimation === 'function' && window.lottieAnimationData) {
      lottieContainer.setAttribute('data-lottie-initialized', 'true');
      
      const anim = lottieLib.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: window.lottieAnimationData
      });

      // Play from start to middle (frame 120) where illustration is visible
      // The full animation fades out at the end, so we stop early to keep the illustration on screen
      anim.playSegments([0, 120], true);

      lottieContainer.addEventListener('mouseenter', () => {
        anim.playSegments([0, 120], true);
      });
      
      // Store reference for potential cleanup
      lottieContainer._lottieInstance = anim;
      
      // Force repaint after lottie loads to ensure it's visible
      // This is critical for Electron on ARM devices (Surface Pro 11, etc.)
      requestAnimationFrame(() => {
        // Force layout recalculation
        lottieContainer.style.display = 'none';
        void lottieContainer.offsetHeight;
        lottieContainer.style.display = '';
        
        // Force GPU layer recreation
        lottieContainer.style.transform = 'translateZ(1px)';
        void lottieContainer.offsetHeight;
        lottieContainer.style.transform = 'translateZ(0)';
        
        anim.resize();
        
        // Also trigger global forceRepaint if available
        if (typeof window.forceRepaint === 'function') {
          setTimeout(window.forceRepaint, 50);
        }
        
        // Additional repaint for Electron on ARM devices
        setTimeout(() => {
          anim.resize();
          // Force SVG visibility
          const svg = lottieContainer.querySelector('svg');
          if (svg) {
            svg.style.visibility = 'hidden';
            void svg.offsetHeight;
            svg.style.visibility = 'visible';
          }
        }, 100);
      });
      
      return true;
    }
    return false;
  }
  
  // Try immediately
  if (loadLottieAnimation()) return;
  
  // If DOM not ready, wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (loadLottieAnimation()) return;
      // Retry after a short delay for slower devices
      setTimeout(loadLottieAnimation, 100);
    });
  } else {
    // DOM ready but lottie may not be loaded yet, retry after short delay
    setTimeout(() => {
      if (loadLottieAnimation()) return;
      // One more retry for very slow devices
      setTimeout(loadLottieAnimation, 200);
    }, 50);
  }
  
  // Also try on window load as a final fallback
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      loadLottieAnimation();
    });
  });
})();

(function initNavigation() {
  // Add the navigation helper function to global scope for use by other navigation code
  window.navigateWithTransition = function(url) {
    // Check if view transitions are supported and enabled
    if (!document.startViewTransition || !CSS.supports('view-transition-name', 'none')) {
      window.location.href = url;
      return;
    }
    
    try {
      const transition = document.startViewTransition(() => {
        window.location.href = url;
      });
      
      // Handle transition failures gracefully
      if (transition && transition.ready) {
        transition.ready.catch(() => {
          // If transition fails, navigate normally
          window.location.href = url;
        });
      }
      
      return transition;
    } catch (error) {
      // Fallback to normal navigation if anything goes wrong
      console.warn('View transition failed, falling back to normal navigation:', error);
      window.location.href = url;
    }
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cta]');
    const link = e.target.closest('a[href]');
    
    if (btn) {
      // If it's a button (not an anchor), we need to handle navigation manually
      if (btn.tagName === 'BUTTON') {
        const href = btn.getAttribute('href');
        if (href && href !== '#' && !btn.disabled) {
          e.preventDefault();
          window.navigateWithTransition(href);
        }
      }
    } else if (link && !link.hasAttribute('target')) {
      // Handle anchor tag navigation with view transitions
      const href = link.getAttribute('href');
      if (href && href !== '#' && href.includes('.html')) {
        e.preventDefault();
        // Convert relative paths to absolute paths if needed
        const fullUrl = href.startsWith('/') ? href : '/pages/' + href;
        window.navigateWithTransition(fullUrl);
      }
    }
  });
})();

(function initAccessibilityButtons() {
  document.querySelectorAll('.accessibility-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const feature = btn.getAttribute('data-feature');
      alert('Accessibility feature placeholder: ' + feature);
    });
  });
})();

(function initGlobalShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      window.navigateWithTransition('/index.html');
    }
  });
})();

// ===== KEYBOARD/REGION/LANGUAGE LIST CONTROLS =====
(function initListSelection() {
  // Handles #keyboard-list, #country-list, #language-list using ID-based targeting
  // Targets specific list IDs so there's no overlap with other controls
  const lists = document.querySelectorAll('#keyboard-list, #country-list, #language-list');

  lists.forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;

      // Deselect all siblings
      list.querySelectorAll('li').forEach(x => {
        x.classList.remove('is-active');
        x.setAttribute('aria-selected', 'false');
      });

      // Select clicked
      li.classList.add('is-active');
      li.setAttribute('aria-selected', 'true');

      // Update pill if it exists
      const pill = document.getElementById('selected-pill');
      if (pill) pill.textContent = li.getAttribute('data-value');
    });
  });
})();

// ===== WIFI LIST CONTROLS =====
(function initWifiList() {
  const wifiList = document.getElementById('wifi-list');
  if (!wifiList) return;

  const nextBtn = document.querySelector('[data-cta="next"]');

  // Network Data
  const networks = [
    { name: 'Netgear_24', secured: true, signal: 4 },
    { name: 'Definitely not wifi', secured: false, signal: 4 },
    { name: 'Home wifi', secured: false, signal: 3 },
    { name: 'CenturyLink_5515', secured: true, signal: 3 },
    { name: 'DirectAccess_555', secured: true, signal: 2 },
    { name: 'JohnLane_net', secured: true, signal: 1 },
    { name: 'Drop_It_Like_Its_Hotspot', secured: false, signal: 2 },
    { name: 'Silence_of_the_LANs', secured: true, signal: 4 },
    { name: 'The_Promised_LAN', secured: true, signal: 2 },
    { name: 'No_More_Mr_WiFi', secured: false, signal: 1 },
    { name: 'Bill_Wi_the_Science_Fi', secured: true, signal: 3 },
    { name: 'My_House_My_Rules_My_Wifi', secured: true, signal: 3 },
    { name: 'PleaseDoNotConnect', secured: true, signal: 1 },
    { name: 'Samsung TV', secured: true, signal: 3 }
  ];

  function getWifiIcon(signal) {
    const iconFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1024 384q-108 0-213 21t-205 63-189 102-166 137q-38 38-68 79t-64 82q-12 14-23 21t-30 7q-27 0-45-18T2 832q0-19 11-36 79-126 191-226t246-170 279-107 295-37q147 0 294 37t279 107 245 170 193 226q11 17 11 36 0 27-18 45t-46 19q-17 0-29-7t-24-21q-8-11-16-21l-9-15q-8-11-16-21-21-28-44-53t-47-51q-77-77-166-137t-188-101-205-63-214-22zm0 384q-74 0-147 16t-140 46-128 75-110 99q-24 27-43 57t-42 59q-12 15-23 23t-32 9q-26 0-45-19t-19-45q0-16 8-32 51-95 130-172t175-131 202-83 214-30q106 0 213 29t203 84 175 131 130 172q8 16 8 32 0 26-19 45t-45 19q-20 0-31-8t-24-24q-22-29-41-59t-44-57q-49-55-109-99t-128-74-141-47-147-16zm0 384q-56 0-107 15t-99 45q-27 17-46 34t-35 36-30 40-30 49q-10 17-24 27t-34 10q-27 0-45-19t-19-46q0-13 6-27 29-64 79-118t112-92 132-60 140-22q72 0 142 21t131 59 111 92 79 120q6 14 6 27 0 26-19 45t-45 20q-20 0-34-10t-24-27q-16-27-30-48t-30-41-35-36-47-34q-47-29-98-44t-107-16zm-160 384q0-33 13-62t34-50 51-35 62-13q33 0 62 13t50 34 35 51 13 62q0 33-13 62t-34 50-51 35-62 13q-33 0-62-13t-50-34-35-51-13-62z" /></svg>`;
    const icon3Bars = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1024 768q-74 0-147 16t-140 46-128 75-110 99q-24 27-43 57t-42 59q-12 15-23 23t-32 9q-26 0-45-19t-19-45q0-16 8-32 51-95 130-172t175-131 202-83 214-30q106 0 213 29t203 84 175 131 130 172q8 16 8 32 0 26-19 45t-45 19q-20 0-31-8t-24-24q-22-29-41-59t-44-57q-49-55-109-99t-128-74-141-47-147-16zm0 384q-56 0-107 15t-99 45q-27 17-46 34t-35 36-30 40-30 49q-10 17-24 27t-34 10q-27 0-45-19t-19-46q0-13 6-27 29-64 79-118t112-92 132-60 140-22q72 0 142 21t131 59 111 92 79 120q6 14 6 27 0 26-19 45t-45 20q-20 0-34-10t-24-27q-16-27-30-48t-30-41-35-36-47-34q-47-29-98-44t-107-16zm-160 384q0-33 13-62t34-50 51-35 62-13q33 0 62 13t50 34 35 51 13 62q0 33-13 62t-34 50-51 35-62 13q-33 0-62-13t-50-34-35-51-13-62z" /></svg>`;
    const icon2Bars = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1024 1152q-56 0-107 15t-99 45q-27 17-46 34t-35 36-30 40-30 49q-10 17-24 27t-34 10q-27 0-45-19t-19-46q0-13 6-27 30-66 79-120t110-92 132-59 142-21q72 0 142 21t131 59 111 92 79 120q6 14 6 27 0 26-19 45t-45 20q-20 0-34-10t-24-27q-16-27-30-48t-30-41-35-36-47-34q-47-29-98-44t-107-16zm-160 384q0-33 13-62t34-50 51-35 62-13q33 0 62 13t50 34 35 51 13 62q0 33-13 62t-34 50-51 35-62 13q-33 0-62-13t-50-34-35-51-13-62z" /></svg>`;
    const icon1Bar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M864 1536q0-33 13-62t34-50 51-35 62-13q33 0 62 13t50 34 35 51 13 62q0 33-13 62t-34 50-51 35-62 13q-33 0-62-13t-50-34-35-51-13-62z" /></svg>`;
    
    if (signal >= 4) return iconFull;
    if (signal === 3) return icon3Bars;
    if (signal === 2) return icon2Bars;
    return icon1Bar;
  }

  function renderNetworks() {
    wifiList.innerHTML = '';
    networks.sort((a, b) => b.signal - a.signal);
    networks.forEach((net, index) => {
      const li = document.createElement('li');
      li.className = 'wifi-item';
      li.innerHTML = `
        <div class="wifi-header">
          <div class="wifi-icon">${getWifiIcon(net.signal)}</div>
          <div class="wifi-text-col" style="flex:1">
            <div class="wifi-name">${net.name}</div>
            <div class="wifi-status">${net.secured ? 'Secured' : 'Open'}</div>
          </div>
        </div>
        <div class="wifi-dynamic-container">
          <div class="wifi-body">
            <div class="wifi-checkbox-container">
              <mai-field label-position="after">
                <label slot="label">Connect automatically</label>
                <mai-checkbox slot="input" id="auto-connect-${index}" checked></mai-checkbox>
              </mai-field>
            </div>
            <mai-button appearance="primary" size="medium" class="wifi-connect-btn">Connect</mai-button>
          </div>
          <div class="wifi-password-entry">
            <mai-text-input type="password" class="wifi-password-input" placeholder="Password">
              Enter the password
            </mai-text-input>
            <div class="wifi-password-actions">
              <mai-button appearance="primary" size="medium" class="wifi-verify-btn">Next</mai-button>
              <mai-button appearance="secondary" size="medium" class="wifi-cancel-btn">Cancel</mai-button>
            </div>
          </div>
          <div class="wifi-connecting" style="display:none; padding: 0 12px 12px 40px;">
            <div style="margin-bottom: 12px; font-size: 14px;">Connecting...</div>
            <div class="progress-bar-track">
              <div class="progress-bar-indicator"></div>
            </div>
          </div>
        </div>
      `;
      wifiList.appendChild(li);
    });
    
    // Force repaint and refresh scrollbar visibility after populating the list
    // Critical for Electron on ARM devices (Surface Pro 11, etc.)
    requestAnimationFrame(() => {
      // Force the wifi list to repaint using multiple techniques
      wifiList.style.display = 'none';
      void wifiList.offsetHeight;
      wifiList.style.display = '';
      
      // Force GPU layer recreation (helps with backdrop-filter issues)
      wifiList.style.transform = 'translateZ(1px)';
      void wifiList.offsetHeight;
      wifiList.style.transform = 'translateZ(0)';
      
      // Force each wifi item to repaint
      const items = wifiList.querySelectorAll('.wifi-item');
      items.forEach(item => {
        item.style.visibility = 'hidden';
        void item.offsetHeight;
        item.style.visibility = 'visible';
      });
      
      if (typeof window.refreshScrollbarVisibility === 'function') {
        window.refreshScrollbarVisibility();
      }
      
      // Also call global forceRepaint if available
      if (typeof window.forceRepaint === 'function') {
        setTimeout(window.forceRepaint, 50);
      }
      
      // Additional delayed repaint for slow Electron rendering
      setTimeout(() => {
        wifiList.style.opacity = '0.99';
        void wifiList.offsetHeight;
        wifiList.style.opacity = '1';
      }, 100);
    });
  }

  function resetItems() {
    const items = wifiList.querySelectorAll('.wifi-item');
    items.forEach(item => {
      item.classList.remove('selected');
      item.classList.remove('entering-password');
      const container = item.querySelector('.wifi-dynamic-container');
      if (container) container.classList.remove('open');
      const input = item.querySelector('.wifi-password-input');
      if (input) input.value = '';
    });
  }

  renderNetworks();

  wifiList.addEventListener('click', (e) => {
    const item = e.target.closest('.wifi-item');
    if (!item) return;
    if (e.target.closest('.wifi-body') || e.target.closest('.wifi-password-entry')) return;
    if (item.classList.contains('selected') && !item.classList.contains('entering-password')) {
      resetItems();
      return;
    }
    resetItems();
    item.classList.add('selected');
    const container = item.querySelector('.wifi-dynamic-container');
    if (container) container.classList.add('open');
  });

  wifiList.addEventListener('click', (e) => {
    if (e.target.classList.contains('wifi-connect-btn')) {
      const item = e.target.closest('.wifi-item');
      const name = item.querySelector('.wifi-name').textContent;
      const net = networks.find(n => n.name === name);
      if (net && net.secured) {
        item.classList.add('entering-password');
        const input = item.querySelector('.wifi-password-input');
        if (input) input.focus();
      } else {
        const body = item.querySelector('.wifi-body');
        const connecting = item.querySelector('.wifi-connecting');
        if (body) body.style.display = 'none';
        if (connecting) connecting.style.display = 'block';
        setTimeout(() => { handleConnectionSuccess(item, false); }, 2000);
      }
    }
  });

  wifiList.addEventListener('click', (e) => {
    if (e.target.classList.contains('wifi-cancel-btn')) {
      const item = e.target.closest('.wifi-item');
      item.classList.remove('entering-password');
    }
  });





  wifiList.addEventListener('click', (e) => {
    if (e.target.classList.contains('wifi-verify-btn')) {
      const item = e.target.closest('.wifi-item');
      const input = item.querySelector('.wifi-password-input');
      if (input.value.length > 0) {
        const passwordEntry = item.querySelector('.wifi-password-entry');
        const connecting = item.querySelector('.wifi-connecting');
        if (passwordEntry) passwordEntry.style.display = 'none';
        if (connecting) connecting.style.display = 'block';
        setTimeout(() => { handleConnectionSuccess(item, true); }, 2000);
      }
    }
  });

  function handleConnectionSuccess(item, secured) {
    item.classList.remove('entering-password');
    item.classList.add('connected');
    const status = item.querySelector('.wifi-status');
    if (status) status.textContent = secured ? 'Connected, secured' : 'Connected';
    const propsIcon = item.querySelector('.wifi-properties-icon');
    if (propsIcon) propsIcon.style.display = 'block';
    const connecting = item.querySelector('.wifi-connecting');
    if (connecting) connecting.style.display = 'none';
    const container = item.querySelector('.wifi-dynamic-container');
    if (container) {
      container.innerHTML = `
        <div class="wifi-body">
          <div style="margin-bottom: 16px; font-size: 12px; color: var(--oobe-text-secondary);">
            If you have a limited data plan, you can make this network a metered connection or change other properties.
          </div>
          <mai-button appearance="secondary" size="medium" class="wifi-disconnect-btn" style="align-self: flex-end;">Disconnect</mai-button>
        </div>
      `;
      container.classList.add('open');
    }
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.classList.remove('button-secondary');
    }
  }

  wifiList.addEventListener('click', (e) => {
    if (e.target.classList.contains('wifi-disconnect-btn')) {
      const item = e.target.closest('.wifi-item');
      const name = item.querySelector('.wifi-name').textContent;
      const net = networks.find(n => n.name === name);
      item.classList.remove('connected');
      const status = item.querySelector('.wifi-status');
      if (status) status.textContent = net.secured ? 'Secured' : 'Open';
      const propsIcon = item.querySelector('.wifi-properties-icon');
      if (propsIcon) propsIcon.style.display = 'none';
      const container = item.querySelector('.wifi-dynamic-container');
      if (container) {
        container.innerHTML = `
          <div class="wifi-body">
            <div class="wifi-checkbox-container">
              <mai-field label-position="after">
                <label slot="label">Connect automatically</label>
                <mai-checkbox slot="input" id="auto-connect-retry-${name}" checked></mai-checkbox>
              </mai-field>
            </div>
            <mai-button appearance="primary" size="medium" class="wifi-connect-btn">Connect</mai-button>
          </div>
          <div class="wifi-password-entry">
            <mai-text-input type="password" class="wifi-password-input" placeholder="Password">
              Enter the password
            </mai-text-input>
            <div class="wifi-password-actions">
              <mai-button appearance="primary" size="medium" class="wifi-verify-btn">Next</mai-button>
              <mai-button appearance="secondary" size="medium" class="wifi-cancel-btn">Cancel</mai-button>
            </div>
          </div>
          <div class="wifi-connecting" style="display:none; padding: 0 12px 12px 40px;">
            <div style="margin-bottom: 12px; font-size: 14px;">Connecting...</div>
            <div class="progress-bar-track">
              <div class="progress-bar-indicator"></div>
            </div>
          </div>
        `;
      }
      if (nextBtn) {
        nextBtn.setAttribute('disabled', 'true');
        nextBtn.classList.add('button-secondary');
      }
    }
  });
})();

(function initRadioButtonGroups() {
  // Find all radio button groups
  const radioGroups = document.querySelectorAll('.radio-group');
  
  radioGroups.forEach(group => {
    const inputs = group.querySelectorAll('input[type="radio"]');
    const nextBtn = document.querySelector('[data-cta="next"]');
    
    // Enable next button if any radio is already selected
    if (nextBtn && Array.from(inputs).some(input => input.checked)) {
      nextBtn.disabled = false;
    }
    
    // Add change listeners to all radio inputs
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        // Enable next button when a selection is made
        if (nextBtn) {
          nextBtn.disabled = false;
        }
      });
    });
  });
})();

// Universal textbox validation system using JSON config
(function initUniversalTextboxValidation() {
  // JSON config for different input types
  const validationConfigs = {
    'device-name-input': {
      type: 'device-name',
      validator: (value) => {
        if (!value) return false;
        const rules = {
          numbers: !/^\d+$/.test(value), // NOT only numbers
          characters: /^[a-zA-Z0-9_\-–—]*$/.test(value) // only valid chars
        };
        return Object.values(rules).every(rule => rule === true);
      },
      nextBtnId: 'device-name-next',
      clearBtnId: 'device-name-clear'
    },
    'msa-email-input': {
      type: 'email',
      validator: (value) => {
        if (!value) return false;
        // Require @ symbol (email format only)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
      },
      nextBtnId: 'msa-next-btn',
      clearBtnId: 'msa-clear'
    },
    'msa-create-input': {
      type: 'email',
      validator: (value) => {
        if (!value) return false;
        // Accept email or phone number for account creation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[0-9]{10}$/;
        return emailRegex.test(value.trim());
      },
      nextBtnId: 'msa-create-next',
      clearBtnId: 'msa-create-clear'
    },
    'new-email-input': {
      type: 'email',
      validator: (value) => {
        if (!value) return false;
        // Just validate that it's a valid username (no special chars)
        return /^[a-zA-Z0-9._-]{3,}$/.test(value.trim());
      },
      nextBtnId: 'create-email-next',
      clearBtnId: null
    }
  };

  // Apply validation to all configured inputs
  Object.entries(validationConfigs).forEach(([inputId, config]) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const nextBtn = document.getElementById(config.nextBtnId);
    const clearBtn = document.getElementById(config.clearBtnId);
    
    function updateUI() {
      const isValid = config.validator(input.value);
      if (nextBtn) {
        nextBtn.disabled = !isValid;
      }
      if (clearBtn) {
        clearBtn.style.display = input.value ? 'block' : 'none';
      }
    }
    
    input.addEventListener('input', updateUI);
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        updateUI();
        input.focus();
      });
    }
    
    // Initial state
    updateUI();
  });
})();

// Verification code validation
(function initVerificationCodeValidation() {
  const codeInput = document.getElementById('verification-code-input');
  const nextBtn = document.getElementById('verify-code-next');
  
  if (!codeInput) return;
  
  function validateCode(code) {
    // Accept 6-digit or 6-character code
    return code.length === 6 && /^[a-zA-Z0-9]{6}$/.test(code);
  }
  
  function updateUI() {
    const code = codeInput.value;
    const isValid = validateCode(code);
    
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
  }
  
  // Real-time validation
  codeInput.addEventListener('input', updateUI);
  
  // Initial state
  updateUI();
})();

// Scanner page auto-advance: detects pages with class 'scanner-page' and auto-advances after timeout
(function initScannerPageAutoAdvance() {
  const scannerElement = document.querySelector('.scanner-page');
  if (!scannerElement) return;
  
  const currentId = document.body.getAttribute('data-page-id');
  
  // Get timeout from flow.js or use default
  const timeout = window.OOBEFlow && window.OOBEFlow.scannerTimeout ? window.OOBEFlow.scannerTimeout : 10000;
  
  
  setTimeout(() => {
    // Check if current page has a restart after it
    const currentPage = window.OOBEFlow && window.OOBEFlow.getPage ? window.OOBEFlow.getPage(currentId) : null;
    const shouldRestart = currentPage && currentPage.restartAfter && 
                          window.OOBEFlow && window.OOBEFlow.shouldRestart && 
                          window.OOBEFlow.shouldRestart(currentId);
    
    if (shouldRestart) {
      // Get the next page ID and store it for the reboot page
      const nextId = window.nextPageId && window.nextPageId(currentId);
      if (nextId) {
        sessionStorage.setItem('oobeRestartDestination', nextId);
      }
      // Go to reboot page
      window.navigateWithTransition(window.getPagePath('reboot.html'));
    } else {
      // Navigate directly using flow.js functions
      const nextId = window.nextPageId && window.nextPageId(currentId);
      if (nextId && window.getPageFile) {
        const nextFile = window.getPageFile(nextId);
        console.log('shouldRestart navigation:', { currentId, nextId, nextFile });
        window.navigateWithTransition(window.getPagePath(nextFile));
      } else {
        // Fallback to desktop if no next page
        window.navigateWithTransition('/desktop/');
      }
    }
  }, timeout);
})();

// PC Restore child page: auto-advance after 4 seconds
(function initPcRestoreChild() {
  const pageId = document.body.getAttribute('data-page-id');
  if (pageId !== 'pc_restore_0') return;

  const nextBtn = document.querySelector('[data-cta="next"]');

  // Get timeout value
  const timeout = 4000; // 4 seconds on the "Getting things ready" screen

  setTimeout(() => {
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    } else {
      // Fallback: navigate using flow.js functions
      const currentId = pageId;
      const nextId = window.nextPageId && window.nextPageId(currentId);
      if (nextId && window.getPageFile) {
        const nextFile = window.getPageFile(nextId);
        window.navigateWithTransition(window.getPagePath(nextFile));
      }
    }
  }, timeout);
})();

// OEM Registration form validation
(function initOEMRegistrationValidation() {
  const pageId = document.body.getAttribute('data-page-id');
  if (pageId !== 'oem_registration') return;

  const firstNameInput = document.getElementById('first-name');
  const emailInput = document.getElementById('email');
  const nextBtn = document.querySelector('[data-cta="next"]');

  if (!firstNameInput || !emailInput || !nextBtn) return;

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  function updateUI() {
    const firstNameFilled = firstNameInput.value.trim().length > 0;
    const emailValid = validateEmail(emailInput.value);
    
    if (firstNameFilled && emailValid) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  }

  firstNameInput.addEventListener('input', updateUI);
  emailInput.addEventListener('input', updateUI);

  // Initial state
  updateUI();
})();

// ============ FLOW EDITOR PANEL ============
// Accessible from any page via right-click menu or F2 hotkey
(function initFlowEditorPanel() {
  function setupFlowEditor() {
    // Prevent double initialization
    if (document.getElementById('flow-editor-panel')) {
      return;
    }

    // Create the panel overlay
    const panelOverlay = document.createElement('div');
    panelOverlay.id = 'flow-editor-panel';
    panelOverlay.innerHTML = `
      <div class="flow-editor-backdrop"></div>
      <div class="flow-editor-container">
        <div class="flow-editor-header">
          <span class="flow-editor-title">OOBE Sandbox</span>
          <button class="flow-editor-close" aria-label="Close panel">✕</button>
        </div>
        <div class="flow-editor-content">
          <p class="flow-editor-subtitle">Flow Editor - Drag to reorder, toggle visibility</p>
          
          <div class="flow-editor-list-container">
            <ul class="flow-editor-list" id="flow-editor-list"></ul>
          </div>
          
          <div class="flow-editor-section">
            <div class="flow-editor-label">Theme</div>
            <div class="flow-editor-theme-row">
              <button class="flow-editor-mode-btn" id="flow-editor-mode-toggle" aria-label="Toggle dark mode">
                <span class="mode-icon-light">☀</span>
                <span class="mode-icon-dark">☾</span>
              </button>
              <div class="flow-editor-palette-grid">
                <button class="palette-btn" data-palette="standard" style="--palette-color: #0078d4;" title="Standard"></button>
                <button class="palette-btn" data-palette="violet" style="--palette-color: #8b5cf6;" title="Violet"></button>
                <button class="palette-btn" data-palette="dune" style="--palette-color: #d4a574;" title="Dune"></button>
                <button class="palette-btn" data-palette="sapphire" style="--palette-color: #0066cc;" title="Sapphire"></button>
                <button class="palette-btn" data-palette="slate" style="--palette-color: #64748b;" title="Slate"></button>
                <button class="palette-btn" data-palette="emerald" style="--palette-color: #10b981;" title="Emerald"></button>
              </div>
            </div>
          </div>
          
          <div class="flow-editor-section">
            <div class="flow-editor-label">CSS Style</div>
            <div class="flow-editor-style-row">
              <button class="style-btn" data-style="win11">Win11</button>
              <button class="style-btn" data-style="evolved">Evolved</button>
            </div>
          </div>
          
          <div class="flow-editor-actions">
            <button class="flow-editor-btn secondary" id="flow-editor-reset">Reset Flow</button>
            <button class="flow-editor-btn primary" id="flow-editor-restart">Restart Flow</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panelOverlay);

    // Add styles
    const panelStyles = document.createElement('style');
    panelStyles.id = 'flow-editor-styles';
    panelStyles.textContent = `
      #flow-editor-panel {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      #flow-editor-panel.active {
        display: flex;
        justify-content: flex-end;
      }
      #flow-editor-panel.visible {
        opacity: 1;
      }
      .flow-editor-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .flow-editor-container {
        position: relative;
        width: 420px;
        max-width: 90vw;
        height: 100%;
        background: var(--color-bg-card, rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      html.dark .flow-editor-container {
        background: rgba(32, 32, 32, 0.95);
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.4);
      }
      #flow-editor-panel.visible .flow-editor-container {
        transform: translateX(0);
      }
      .flow-editor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
      }
      html.dark .flow-editor-header {
        border-color: rgba(255, 255, 255, 0.1);
      }
      .flow-editor-title {
        font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary, #1a1a1a);
      }
      html.dark .flow-editor-title {
        color: #ffffff;
      }
      .flow-editor-close {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: var(--color-text-secondary, rgba(0, 0, 0, 0.6));
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .flow-editor-close:hover {
        background: var(--color-bg-subtle, rgba(0, 0, 0, 0.05));
        color: var(--color-text-primary, #1a1a1a);
      }
      html.dark .flow-editor-close {
        color: rgba(255, 255, 255, 0.6);
      }
      html.dark .flow-editor-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
      .flow-editor-content {
        flex: 1;
        padding: 16px 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .flow-editor-subtitle {
        font-size: 13px;
        color: var(--color-text-secondary, #666);
        margin: 0 0 8px 0;
      }
      html.dark .flow-editor-subtitle {
        color: rgba(255, 255, 255, 0.6);
      }
      .flow-editor-list-container {
        flex: 1;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        background: var(--color-bg-subtle, #f5f5f5);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 12px;
        padding: 8px;
      }
      html.dark .flow-editor-list-container {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.1);
      }
      .flow-editor-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .flow-editor-list li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        transition: background 0.15s;
        cursor: grab;
        font-size: 14px;
        color: var(--color-text-primary, #1a1a1a);
      }
      html.dark .flow-editor-list li {
        color: #ffffff;
      }
      .flow-editor-list li:hover {
        background: var(--color-bg-inset, rgba(0, 0, 0, 0.05));
      }
      html.dark .flow-editor-list li:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .flow-editor-list li.drag-over {
        background: var(--smtc-background-ctrl-brand-rest, #0078d4);
        color: white;
      }
      .flow-editor-list li.flow-item-disabled .flow-item-label {
        opacity: 0.45;
      }
      .flow-editor-list .drag-handle {
        cursor: grab;
        user-select: none;
        font-weight: 600;
        padding: 2px 6px;
        background: var(--color-bg-card, #fff);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 4px;
        font-size: 10px;
        color: var(--color-text-secondary, #666);
      }
      html.dark .flow-editor-list .drag-handle {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.6);
      }
      .flow-item-label {
        flex: 1;
      }
      .flow-item-badge {
        font-size: 10px;
        padding: 2px 8px;
        background: var(--color-bg-card, #fff);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 10px;
        color: var(--color-text-secondary, #666);
      }
      html.dark .flow-item-badge {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.6);
      }
      .flow-item-toggle {
        width: 24px;
        height: 24px;
        border: 1px solid var(--color-border, #e0e0e0);
        background: var(--color-bg-card, #fff);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, border-color 0.15s;
      }
      html.dark .flow-item-toggle {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .flow-item-toggle:hover {
        background: var(--color-bg-subtle, #f0f0f0);
      }
      html.dark .flow-item-toggle:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .flow-item-toggle svg {
        width: 14px;
        height: 14px;
        stroke: var(--color-text-primary, #1a1a1a);
        color: var(--color-text-primary, #1a1a1a);
      }
      html.dark .flow-item-toggle svg {
        stroke: #ffffff;
        color: #ffffff;
      }
      .flow-item-toggle.is-disabled svg {
        opacity: 0.4;
      }
      .flow-editor-section {
        padding-top: 8px;
        border-top: 1px solid var(--color-border, #e0e0e0);
      }
      html.dark .flow-editor-section {
        border-color: rgba(255, 255, 255, 0.1);
      }
      .flow-editor-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-secondary, #666);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      html.dark .flow-editor-label {
        color: rgba(255, 255, 255, 0.5);
      }
      .flow-editor-theme-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .flow-editor-mode-btn {
        width: 40px;
        height: 40px;
        border: 1px solid var(--color-border, #e0e0e0);
        background: var(--color-bg-card, #fff);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: background 0.15s, transform 0.15s;
      }
      html.dark .flow-editor-mode-btn {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .flow-editor-mode-btn:hover {
        transform: scale(1.05);
      }
      .flow-editor-mode-btn .mode-icon-light { display: block; }
      .flow-editor-mode-btn .mode-icon-dark { display: none; }
      html.dark .flow-editor-mode-btn .mode-icon-light { display: none; }
      html.dark .flow-editor-mode-btn .mode-icon-dark { display: block; }
      .flow-editor-palette-grid {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .palette-btn {
        width: 32px;
        height: 32px;
        border: 2px solid transparent;
        background: var(--palette-color);
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;
      }
      .palette-btn:hover {
        transform: scale(1.1);
      }
      .palette-btn.active {
        box-shadow: 0 0 0 2px var(--color-bg-card, #fff), 0 0 0 4px var(--palette-color);
      }
      html.dark .palette-btn.active {
        box-shadow: 0 0 0 2px rgba(32, 32, 32, 0.95), 0 0 0 4px var(--palette-color);
      }
      .flow-editor-style-row {
        display: flex;
        gap: 8px;
      }
      .style-btn {
        flex: 1;
        padding: 10px 16px;
        border: 1px solid var(--color-border, #e0e0e0);
        background: var(--color-bg-card, #fff);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-primary, #1a1a1a);
        transition: background 0.15s, border-color 0.15s;
      }
      html.dark .style-btn {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
      .style-btn:hover {
        background: var(--color-bg-subtle, #f5f5f5);
      }
      html.dark .style-btn:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .style-btn.active {
        background: var(--smtc-background-ctrl-brand-rest, #0078d4);
        border-color: var(--smtc-background-ctrl-brand-rest, #0078d4);
        color: white;
      }
      .flow-editor-actions {
        display: flex;
        gap: 12px;
        padding-top: 8px;
      }
      .flow-editor-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: background 0.15s, transform 0.1s;
      }
      .flow-editor-btn:active {
        transform: scale(0.98);
      }
      .flow-editor-btn.secondary {
        background: var(--color-bg-subtle, #f0f0f0);
        color: var(--color-text-primary, #1a1a1a);
      }
      html.dark .flow-editor-btn.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
      .flow-editor-btn.secondary:hover {
        background: var(--color-bg-inset, #e5e5e5);
      }
      html.dark .flow-editor-btn.secondary:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .flow-editor-btn.primary {
        background: var(--smtc-background-ctrl-brand-rest, #0078d4);
        color: white;
      }
      .flow-editor-btn.primary:hover {
        background: var(--smtc-background-ctrl-brand-hover, #006cbd);
      }
    `;
    document.head.appendChild(panelStyles);

    // Get elements
    const flowList = document.getElementById('flow-editor-list');
    const modeToggle = document.getElementById('flow-editor-mode-toggle');
    const paletteBtns = panelOverlay.querySelectorAll('.palette-btn');
    const styleBtns = panelOverlay.querySelectorAll('.style-btn');
    const resetBtn = document.getElementById('flow-editor-reset');
    const restartBtn = document.getElementById('flow-editor-restart');

    // SVG icons
    const eyeSvgShown = () => '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeSvgDisabled = () => '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2l20 20"/><path d="M10.73 5.08A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.86 21.86 0 0 1-3.17 3.88M6.12 6.11A21.86 21.86 0 0 0 1 12s4 8 11 8a10.66 10.66 0 0 0 4.4-.9"/><path d="M15 12a3 3 0 0 1-3 3"/><path d="M9 9a3 3 0 0 1 3-3"/></svg>';

    // Render flow list
    function renderFlowList() {
      if (!window.OOBEFlow) return;
      
      flowList.innerHTML = '';
      const order = window.OOBEFlow.getOrder();
      const hidden = window.OOBEFlow.getHidden();
      
      order.forEach(id => {
        const li = document.createElement('li');
        li.setAttribute('data-id', id);
        li.setAttribute('draggable', 'true');

        let pageLabel = id;
        let pageData = null;
        if (window.OOBEFlow.getPage) {
          const page = window.OOBEFlow.getPage(id);
          if (page) {
            pageLabel = page.label;
            pageData = page;
          }
        }

        const show = !hidden.includes(id);
        li.classList.toggle('flow-item-disabled', !show);
        
        // Drag handle
        const handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.textContent = '⋮⋮';
        li.appendChild(handle);
        
        // Label
        const label = document.createElement('span');
        label.className = 'flow-item-label';
        label.textContent = pageLabel;
        li.appendChild(label);
        
        // Scanner badge
        if (pageData && pageData.type === 'scanner') {
          const badge = document.createElement('span');
          badge.className = 'flow-item-badge';
          badge.textContent = 'Scanner';
          li.appendChild(badge);
        }
        
        // Eye toggle
        const eye = document.createElement('span');
        eye.className = 'flow-item-toggle' + (show ? '' : ' is-disabled');
        eye.innerHTML = show ? eyeSvgShown() : eyeSvgDisabled();
        eye.onclick = (e) => {
          e.stopPropagation();
          const h = window.OOBEFlow.getHidden();
          if (show) {
            if (!h.includes(id)) { h.push(id); window.OOBEFlow.setHidden(h); }
          } else {
            window.OOBEFlow.setHidden(h.filter(x => x !== id));
          }
          renderFlowList();
        };
        li.appendChild(eye);
        
        flowList.appendChild(li);
      });
      
      // Enable drag and drop
      enableFlowDnD(flowList);
    }

    function enableFlowDnD(container) {
      let dragId = null;
      container.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', e => {
          dragId = li.getAttribute('data-id');
          e.dataTransfer.effectAllowed = 'move';
        });
        li.addEventListener('dragover', e => {
          e.preventDefault();
          li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
        li.addEventListener('drop', e => {
          e.preventDefault();
          li.classList.remove('drag-over');
          const targetId = li.getAttribute('data-id');
          if (!dragId || dragId === targetId) return;
          const ord = window.OOBEFlow.getOrder();
          const from = ord.indexOf(dragId);
          const to = ord.indexOf(targetId);
          if (from < 0 || to < 0) return;
          ord.splice(to, 0, ord.splice(from, 1)[0]);
          window.OOBEFlow.setOrder(ord);
          renderFlowList();
        });
      });
      container.addEventListener('dragend', () => {
        dragId = null;
        container.querySelectorAll('li').forEach(li => li.classList.remove('drag-over'));
      });
    }

    // Update UI state
    function updateUIState() {
      const currentPalette = localStorage.getItem('themePalette') || 'standard';
      const currentStyle = localStorage.getItem('cssStyle') || 'win11';
      
      paletteBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.palette === currentPalette);
      });
      
      styleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === currentStyle);
      });
    }

    // Event handlers
    modeToggle.addEventListener('click', () => {
      const currentMode = localStorage.getItem('themeMode') || 'light';
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      if (window.applyThemeMode) {
        window.applyThemeMode(newMode);
      }
    });

    paletteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const palette = btn.dataset.palette;
        const root = document.documentElement;
        const body = document.body;
        
        root.classList.add('theme-transitioning');
        root.classList.remove('standard', 'dune', 'sapphire', 'violet', 'slate', 'emerald');
        body.classList.remove('standard', 'dune', 'sapphire', 'violet', 'slate', 'emerald');
        
        root.classList.add(palette);
        body.classList.add(palette);
        
        localStorage.setItem('themePalette', palette);
        
        // Update critical CSS
        const currentMode = localStorage.getItem('themeMode') || 'light';
        if (window.applyThemeMode) {
          window.applyThemeMode(currentMode);
        }
        
        updateUIState();
        
        setTimeout(() => {
          root.classList.remove('theme-transitioning');
        }, 350);
      });
    });

    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.dataset.style;
        const root = document.documentElement;
        
        root.classList.remove('win11', 'evolved');
        root.classList.add(style);
        
        localStorage.setItem('cssStyle', style);
        
        // Update CSS files
        const styleBase = document.getElementById('style-base');
        const styleLight = document.getElementById('style-light');
        const styleDark = document.getElementById('style-dark');
        
        if (styleBase && styleLight && styleDark) {
          if (style === 'evolved') {
            styleBase.href = '/css/evolved.css';
            styleLight.href = '/css/evolved.light.css';
            styleDark.href = '/css/evolved.dark.css';
          } else {
            styleBase.href = '/css/win11.css';
            styleLight.href = '/css/win11.light.css';
            styleDark.href = '/css/win11.dark.css';
          }
        }
        
        updateUIState();
      });
    });

    resetBtn.addEventListener('click', () => {
      if (window.OOBEFlow) {
        window.OOBEFlow.setOrder(window.OOBEFlow.default);
        window.OOBEFlow.setHidden([]);
        if (window.OOBEFlow.setRestartConfig) {
          window.OOBEFlow.setRestartConfig({ disabledRestarts: [] });
        }
        if (window.OOBEFlow.setDisabledFirstPages) {
          window.OOBEFlow.setDisabledFirstPages({ disabledFirstPages: [] });
        }
        renderFlowList();
      }
    });

    restartBtn.addEventListener('click', () => {
      if (window.OOBEFlow) {
        const order = window.OOBEFlow.getOrder();
        const hidden = window.OOBEFlow.getHidden();
        let firstId = null;
        for (const id of order) {
          if (!hidden.includes(id)) {
            firstId = id;
            break;
          }
        }
        if (firstId) {
          const file = window.OOBEFlow.getPageFile(firstId);
          const path = window.getPagePath ? window.getPagePath(file) : '/pages/' + file;
          closePanel();
          window.location.href = path;
        }
      }
    });

    // Panel open/close functions
    function openPanel() {
      renderFlowList();
      updateUIState();
      panelOverlay.classList.add('active');
      requestAnimationFrame(() => {
        panelOverlay.classList.add('visible');
      });
    }

    function closePanel() {
      panelOverlay.classList.remove('visible');
      setTimeout(() => {
        panelOverlay.classList.remove('active');
      }, 300);
    }

    // Event listeners
    panelOverlay.querySelector('.flow-editor-close').addEventListener('click', closePanel);
    panelOverlay.querySelector('.flow-editor-backdrop').addEventListener('click', closePanel);

    // Expose globally
    window.openFlowEditorPanel = openPanel;
    window.closeFlowEditorPanel = closePanel;
    
    console.log('📋 Flow Editor panel initialized. Press F2 or right-click > Flow Editor to open.');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFlowEditor);
  } else {
    setupFlowEditor();
  }
})();

// Fingerprint setup handler
(function initFingerprintSetup() {
  function setup() {
    // Check if we're on the fingerprint setup page
    const body = document.querySelector('body[data-page-id="fingerprint_0"]');
    if (!body) return;

    let pressCount = 0;
    const maxPresses = 4;
    const fingerprintTimesEl = document.getElementById('fingerprint-times');
    const fingerprintSvg = document.getElementById('fingerprint-svg');
    const nextButton = document.querySelector('[data-cta="next"]');

    if (!nextButton || !fingerprintSvg) {
      console.warn('🔑 Fingerprint elements not found');
      return;
    }

    // Disable next button initially
    nextButton.setAttribute('disabled', 'disabled');

    // Calculate stroke lengths for each path and set CSS variables
    const fingerprints = document.querySelectorAll('.fp-line');
    fingerprints.forEach((line, index) => {
      const length = line.getTotalLength();
      line.style.setProperty('--stroke-length', length);
    });

    // Listen for F key press
    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'f') {
        pressCount++;
        
        // Update text element if it exists
        if (fingerprintTimesEl) {
          fingerprintTimesEl.textContent = pressCount;
        }
        
        // Update SVG aria-label
        fingerprintSvg.setAttribute('aria-label', `Pressed ${pressCount} of ${maxPresses} times`);

        // Calculate how many lines should be filled
        const linesPerPress = Math.ceil(fingerprints.length / maxPresses);
        const linesToFill = pressCount * linesPerPress;

        // Update fingerprint segments
        fingerprints.forEach((line, index) => {
          if (index < linesToFill) {
            line.classList.add('filled');
            line.classList.remove('unfilled');
          } else {
            line.classList.remove('filled');
            line.classList.add('unfilled');
          }
        });

        // Enable button when we reach 4 presses
        if (pressCount >= maxPresses) {
          nextButton.removeAttribute('disabled');
        }
      }
    });

    console.log('🔑 Fingerprint setup handler initialized. Press F to draw the fingerprint.');
  }

  // Wait for page load before setting up
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();


