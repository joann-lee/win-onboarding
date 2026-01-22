// JS to control the page order depending on the order set on index.html (using the drag control)

(function () {
  // Global scanner timeout in milliseconds
  const SCANNER_PAGE_TIMEOUT = 5000; // 10 seconds

  // Always prepend pages/ for iframe compatibility
  const shouldPrependPages = true;

  const DEFAULT_FLOW = [
    { id: 'boot', file: 'boot.html', label: 'Boot', type: 'scanner', children: [], restartAfter: false },
    { id: 'language', file: 'language.html', label: 'Language', type: 'interactive', children: [], restartAfter: false },
    { id: 'region', file: 'region.html', label: 'Region', type: 'interactive', children: [], restartAfter: false },
    { id: 'keyboard', file: 'keyboard.html', label: 'Keyboard', type: 'interactive', children: ["keyboard_0.html", "keyboard_1.html", "keyboard_2.html"], restartAfter: false },
    { id: 'wifi', file: 'wifi.html', label: 'Wi-Fi', type: 'interactive', children: [], restartAfter: false },
    { id: 'zdp', file: 'zdp.html', label: 'ZDP', type: 'scanner', children: [], restartAfter: true },
    { id: 'eula', file: 'eula.html', label: 'End User License Agreement (EULA)', type: 'interactive', children: [], restartAfter: false },
    { id: 'device-name', file: 'device_name.html', label: 'Device Name', type: 'interactive', children: [], restartAfter: true },
    { id: 'lcu', file: 'lcu.html', label: 'LCU update', type: 'scanner', children: [], restartAfter: true },
    { id: 'ndup', file: 'ndup.html', label: 'NDUP', type: 'interactive', children: ['ndup_0.html'], restartAfter: true },
    // { id: 'disambig', file: 'disambig.html', label: 'Disambiguation', type: 'interactive', children: [], restartAfter: false },
    { id: 'msa_info', file: 'msa_info.html', label: 'MSA Info', type: 'interactive', children: [], restartAfter: false },
    { id: 'msa_sisu', file: 'msa_sisu.html', label: 'MSA Sign in / Sign Up (SISU)', type: 'interactive', children: ['msa_sisu_0.html'], restartAfter: false },
    { id: 'fingerprint', file: 'fingerprint.html', label: 'Fingerprint', type: 'interactive', children: ['fingerprint_setup.html'], restartAfter: false },
    { id: 'pin', file: 'pin.html', label: 'PIN', type: 'interactive', children: ["pin_0.html"], restartAfter: false },
    { id: 'privacy_settings', file: 'privacy_settings.html', label: 'Privacy Settings', type: 'interactive', children: [], restartAfter: false },
    { id: 'pc_restore', file: 'pc_restore.html', label: 'PC Restore', type: 'interactive', children: ["pc_restore_0.html"], restartAfter: false },
    { id: 'oem_registration', file: 'oem_registration.html', label: 'OEM Registration', type: 'interactive', children: ["oem_registration_0.html"], restartAfter: false },
    { id: 'getting_ready', file: 'getting_ready.html', label: 'Getting everything ready', type: 'scanner', children: [], restartAfter: false },

  ];

  const ORDER_KEY = 'oobeFlowOrder_v2';
  const HIDDEN_KEY = 'oobeFlowHidden';
  const RESTART_CONFIG_KEY = 'oobeRestartConfig_v1';
  const DISABLED_FIRST_PAGE_KEY = 'oobeDisabledFirstPages_v1';

  function loadOrder() {
    let order = [];
    try { const raw = localStorage.getItem(ORDER_KEY); if (raw) order = JSON.parse(raw); } catch (e) { }

    const defaultIds = DEFAULT_FLOW.map(p => p.id);
    if (!order || order.length === 0) return defaultIds;

    // Sync with defaults: remove obsolete, add new in correct position
    order = order.filter(id => defaultIds.includes(id));
    defaultIds.forEach(id => {
      if (!order.includes(id)) {
        // Insert new IDs at their position in the default flow
        const defaultIndex = defaultIds.indexOf(id);
        let insertIndex = 0;
        for (let i = 0; i < defaultIndex; i++) {
          if (order.includes(defaultIds[i])) {
            insertIndex = order.indexOf(defaultIds[i]) + 1;
          }
        }
        order.splice(insertIndex, 0, id);
      }
    });

    return order;
  }
  function saveOrder(order) { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); }
  function loadHidden() { try { const raw = localStorage.getItem(HIDDEN_KEY); if (raw) return JSON.parse(raw); } catch (e) { }; return []; }
  function saveHidden(hidden) { localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden)); }

  // Load restart config: which page IDs should NOT trigger restarts
  function loadRestartConfig() {
    try {
      const raw = localStorage.getItem(RESTART_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { }
    return { disabledRestarts: [] };
  }

  function saveRestartConfig(config) {
    localStorage.setItem(RESTART_CONFIG_KEY, JSON.stringify(config));
  }

  // Load disabled first pages: which parent pages should skip their first page
  function loadDisabledFirstPages() {
    try {
      const raw = localStorage.getItem(DISABLED_FIRST_PAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { }
    return { disabledFirstPages: [] };
  }

  function saveDisabledFirstPages(config) {
    localStorage.setItem(DISABLED_FIRST_PAGE_KEY, JSON.stringify(config));
  }

  // Check if a page's first/parent page is enabled
  function isFirstPageEnabled(pageId) {
    const config = loadDisabledFirstPages();
    return !config.disabledFirstPages.includes(pageId);
  }

  // Set whether a page's first page is enabled
  function setFirstPageEnabled(pageId, enabled) {
    const config = loadDisabledFirstPages();
    if (enabled) {
      config.disabledFirstPages = config.disabledFirstPages.filter(id => id !== pageId);
    } else {
      if (!config.disabledFirstPages.includes(pageId)) {
        config.disabledFirstPages.push(pageId);
      }
    }
    saveDisabledFirstPages(config);
  }

  // Check if a page should trigger a restart (has restartAfter: true and is not disabled)
  function shouldRestart(pageId) {
    const page = pageById(pageId);
    if (!page || !page.restartAfter) return false;

    const config = loadRestartConfig();
    return !config.disabledRestarts.includes(pageId);
  }

  // Set whether a restart is enabled for a specific page
  function setRestartEnabled(pageId, enabled) {
    const config = loadRestartConfig();
    if (enabled) {
      config.disabledRestarts = config.disabledRestarts.filter(id => id !== pageId);
    } else {
      if (!config.disabledRestarts.includes(pageId)) {
        config.disabledRestarts.push(pageId);
      }
    }
    saveRestartConfig(config);
  }

  function pageById(id) { return DEFAULT_FLOW.find(p => p.id === id); }
  function visibleOrder(order, hidden) { return order.filter(id => !hidden.includes(id)); }

  // Check if a page ID is a child page (format: "parent_0", "parent_1", etc)
  function isChildPage(pageId) {
    return pageId && /_\d+$/.test(pageId);
  }

  // Get parent ID from child page ID
  function getParentId(childPageId) {
    const match = childPageId.match(/^(.+)_(\d+)$/);
    return match ? match[1] : null;
  }

  // Get child index from child page ID
  function getChildIndex(childPageId) {
    const match = childPageId.match(/_(\d+)$/);
    return match ? parseInt(match[1]) : -1;
  }

  // Get the next page ID, handling child pages
  function nextPageId(currentId) {
    const order = loadOrder();
    const hidden = loadHidden();
    const vis = visibleOrder(order, hidden);

    // If current page is a child page
    if (isChildPage(currentId)) {
      const parentId = getParentId(currentId);
      const childIdx = getChildIndex(currentId);
      const parentPage = pageById(parentId);

      if (parentPage && parentPage.children && childIdx + 1 < parentPage.children.length) {
        // Go to next child
        return `${parentId}_${childIdx + 1}`;
      } else {
        // Finished all children, go to next main page after parent
        const parentIdx = vis.indexOf(parentId);
        if (parentIdx >= 0 && parentIdx < vis.length - 1) {
          return vis[parentIdx + 1];
        }
        return null;
      }
    }

    // Current page is a main page
    const currentPage = pageById(currentId);
    if (currentPage && currentPage.children && currentPage.children.length > 0) {
      // Has children - always go to first child
      return `${currentId}_0`;
    }

    // No children, go to next main page
    const idx = vis.indexOf(currentId);
    if (idx < 0 || idx === vis.length - 1) return null;

    const nextMainPageId = vis[idx + 1];
    // Check if the next main page has children with disabled first page
    const nextMainPage = pageById(nextMainPageId);
    console.log('nextPageId - currentId:', currentId, 'nextMainPageId:', nextMainPageId, 'nextMainPage:', nextMainPage);
    if (nextMainPage && nextMainPage.children && nextMainPage.children.length > 0) {
      const nextFirstPageEnabled = isFirstPageEnabled(nextMainPageId);
      console.log('nextMainPage has children, firstPageEnabled:', nextFirstPageEnabled);
      if (!nextFirstPageEnabled) {
        // Next page's first page is disabled, skip to first child
        console.log('Skipping to first child:', nextMainPageId + '_0');
        return `${nextMainPageId}_0`;
      }
    }
    return nextMainPageId;
  }

  // Get skip destination: skip all children and go to next main page
  function skipPageId(currentId) {
    const order = loadOrder();
    const hidden = loadHidden();
    const vis = visibleOrder(order, hidden);

    // If on a child page, go to next main page after parent
    if (isChildPage(currentId)) {
      const parentId = getParentId(currentId);
      const parentIdx = vis.indexOf(parentId);
      if (parentIdx >= 0 && parentIdx < vis.length - 1) {
        return vis[parentIdx + 1];
      }
      return null;
    }

    // If on main page with children, skip to next main page
    const currentPage = pageById(currentId);
    if (currentPage && currentPage.children && currentPage.children.length > 0) {
      const idx = vis.indexOf(currentId);
      if (idx >= 0 && idx < vis.length - 1) {
        return vis[idx + 1];
      }
      return null;
    }

    // No children, regular next
    return nextPageId(currentId);
  }

  // Get the file path for a page (main or child)
  function getPageFile(pageId) {
    if (isChildPage(pageId)) {
      const parentId = getParentId(pageId);
      const childIdx = getChildIndex(pageId);
      const parentPage = pageById(parentId);
      if (parentPage && parentPage.children && parentPage.children[childIdx]) {
        return parentPage.children[childIdx];
      }
      return null;
    }
    const page = pageById(pageId);
    return page ? page.file : null;
  }

  // Convert a child filename (from data-page-id) to internal format
  // e.g., "keyboard_child_0" → "keyboard_child_0" (already in correct format)
  function mapChildPageToInternalId(filenameId) {
    return filenameId;
  }

  function applyCtas() {
    let currentId = document.body.getAttribute('data-page-id');
    if (!currentId) {
      return;
    }

    // Map child page filename to internal format (now a no-op since filenames match format)
    currentId = mapChildPageToInternalId(currentId);

    const nextId = nextPageId(currentId);
    const skipId = skipPageId(currentId);

    const nextLink = document.querySelector('[data-cta=next]');
    const skipLink = document.querySelector('[data-cta=skip]');

    if (nextLink) {
      if (nextId) {
        // Check if current page should trigger a restart
        if (shouldRestart(currentId)) {
          const rebootHref = window.getPagePath('reboot.html');
          sessionStorage.setItem('oobeRestartDestination', nextId);
          
          // Handle both regular links and web components
          if (nextLink.tagName.toLowerCase() === 'mai-button' || nextLink.tagName.toLowerCase().includes('-')) {
            nextLink.onclick = () => window.location.href = rebootHref;
          } else {
            nextLink.setAttribute('href', rebootHref);
          }
        } else {
          const nextFile = getPageFile(nextId);
          const nextHref = window.getPagePath(nextFile);
          
          // Handle both regular links and web components
          if (nextLink.tagName.toLowerCase() === 'mai-button' || nextLink.tagName.toLowerCase().includes('-')) {
            nextLink.onclick = () => window.location.href = nextHref;
          } else {
            nextLink.setAttribute('href', nextHref);
          }
        }
        nextLink.classList.remove('disabled');
      } else {
        // End of flow - go to desktop
        if (nextLink.tagName.toLowerCase() === 'mai-button' || nextLink.tagName.toLowerCase().includes('-')) {
          nextLink.onclick = () => window.location.href = '/desktop/';
        } else {
          nextLink.setAttribute('href', '/desktop/');
        }
        nextLink.classList.remove('disabled');
      }
    }

    if (skipLink) {
      if (skipId) {
        const skipFile = getPageFile(skipId);
        const skipHref = window.getPagePath(skipFile);
        
        // Handle both regular links and web components
        if (skipLink.tagName.toLowerCase() === 'mai-button' || skipLink.tagName.toLowerCase().includes('-')) {
          skipLink.onclick = () => window.location.href = skipHref;
        } else {
          skipLink.setAttribute('href', skipHref);
        }
      } else {
        if (skipLink.tagName.toLowerCase() === 'mai-button' || skipLink.tagName.toLowerCase().includes('-')) {
          skipLink.onclick = () => window.location.href = '/desktop/';
        } else {
          skipLink.setAttribute('href', '/desktop/');
        }
      }
    }
    renderProgress(currentId, nextId);
  }

  function renderProgress(currentId, nextId) {
    const container = document.getElementById('oobe-progress');
    if (!container) return;
    const order = loadOrder(); const hidden = loadHidden();
    const visible = order.filter(id => !hidden.includes(id));
    container.innerHTML = '';
    visible.forEach((id, i) => {
      const step = document.createElement('div'); step.className = 'oobe-progress-step'; step.setAttribute('data-step-id', id);
      const dot = document.createElement('div'); dot.className = 'oobe-progress-dot';
      const label = document.createElement('div'); label.textContent = (pageById(id)?.label) || id;
      if (id === currentId) { step.classList.add('is-active'); }
      else if (visible.indexOf(currentId) > i) { step.classList.add('is-complete'); }
      step.appendChild(dot); step.appendChild(label); container.appendChild(step);
    });
    container.setAttribute('aria-valuemin', '1');
    container.setAttribute('aria-valuemax', String(visible.length));
    const currentIndex = visible.indexOf(currentId) + 1;
    container.setAttribute('aria-valuenow', String(currentIndex));
  }

  // Lightweight inline editor UI (toggle with Alt+F or small button)
  function buildEditor() {
    if (document.getElementById('flow-editor')) return;
    const order = loadOrder(); const hidden = loadHidden();
    const wrapper = document.createElement('div');
    wrapper.id = 'flow-editor';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '8px'; wrapper.style.right = '8px';
    wrapper.style.zIndex = '2000';
    wrapper.style.background = 'rgba(30,30,30,0.9)';
    wrapper.style.color = '#fff';
    wrapper.style.padding = '10px 12px';
    wrapper.style.borderRadius = '6px';
    wrapper.style.fontSize = '12px';
    wrapper.style.maxWidth = '240px';
    wrapper.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    wrapper.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><strong style="font-size:12px;">Flow Order</strong><button id="flow-close" style="background:#444;color:#fff;border:none;padding:2px 6px;cursor:pointer;font-size:11px;">×</button></div>';
    const list = document.createElement('ul'); list.style.listStyle = 'none'; list.style.margin = '0'; list.style.padding = '0';
    order.forEach(id => {
      const li = document.createElement('li'); li.style.display = 'flex'; li.style.alignItems = 'center'; li.style.marginBottom = '4px';
      const page = pageById(id);
      const upBtn = document.createElement('button'); upBtn.textContent = '↑'; styleBtn(upBtn);
      const downBtn = document.createElement('button'); downBtn.textContent = '↓'; styleBtn(downBtn);
      const hideCb = document.createElement('input'); hideCb.type = 'checkbox'; hideCb.checked = !hidden.includes(id); hideCb.style.marginRight = '4px';
      const label = document.createElement('span'); label.textContent = page.label; label.style.flex = '1'; label.style.opacity = hideCb.checked ? '1' : '0.4';
      li.classList.toggle('hidden', hidden.includes(id));
      upBtn.onclick = () => { move(id, -1); refresh(); };
      downBtn.onclick = () => { move(id, 1); refresh(); };
      hideCb.onchange = () => { toggleHidden(id); label.style.opacity = hideCb.checked ? '1' : '0.4'; li.classList.toggle('hidden', !hideCb.checked); applyCtas(); };
      li.appendChild(hideCb); li.appendChild(label); li.appendChild(upBtn); li.appendChild(downBtn);
      list.appendChild(li);
    });
    wrapper.appendChild(list);
    const saveBar = document.createElement('div'); saveBar.style.marginTop = '8px'; saveBar.style.display = 'flex'; saveBar.style.gap = '6px';
    const applyBtn = document.createElement('button'); applyBtn.textContent = 'Apply'; styleBtn(applyBtn);
    applyBtn.onclick = () => { applyCtas(); flash(wrapper); };
    const hideBtn = document.createElement('button'); hideBtn.textContent = 'Hide'; styleBtn(hideBtn); hideBtn.onclick = () => wrapper.remove();
    saveBar.appendChild(applyBtn); saveBar.appendChild(hideBtn); wrapper.appendChild(saveBar);
    document.body.appendChild(wrapper);
    document.getElementById('flow-close').onclick = () => wrapper.remove();

    function styleBtn(b) { b.style.background = '#555'; b.style.color = '#fff'; b.style.border = 'none'; b.style.cursor = 'pointer'; b.style.padding = '2px 6px'; b.style.fontSize = '11px'; b.style.marginLeft = '4px'; }
    function flash(el) { el.style.outline = '2px solid #4caf50'; setTimeout(() => el.style.outline = 'none', 500); }
    function move(id, dir) { const ord = loadOrder(); const i = ord.indexOf(id); if (i < 0) return; const t = i + dir; if (t < 0 || t >= ord.length) return;[ord[i], ord[t]] = [ord[t], ord[i]]; saveOrder(ord); }
    function toggleHidden(id) { const h = loadHidden(); if (h.includes(id)) { saveHidden(h.filter(x => x !== id)); } else { h.push(id); saveHidden(h); } }
    function refresh() { wrapper.remove(); buildEditor(); applyCtas(); }
  }

  function addToggleButton() {
    // Flow button disabled per request; editor accessible only via Alt+F on pages.
    return; // No UI button created.
  }

  // Alt+F: enable flow editor only on OOBE pages (have data-page-id), not on landing
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'o') {
      if (document.body.getAttribute('data-page-id')) buildEditor();
    }
  });
  // Alt+O: enable flow editor only on OOBE pages (have data-page-id), not on landing

  document.addEventListener('DOMContentLoaded', function () {
    applyCtas();
    addToggleButton();
  });

  // Expose for possible manual calls
  window.OOBEFlow = {
    getOrder: loadOrder,
    setOrder: saveOrder,
    getHidden: loadHidden,
    setHidden: saveHidden,
    apply: applyCtas,
    nextId: nextPageId,
    getPage: pageById,
    getPageFile: getPageFile,
    default: DEFAULT_FLOW.map(p => p.id),
    shouldRestart: shouldRestart,
    setRestartEnabled: setRestartEnabled,
    getRestartConfig: loadRestartConfig,
    setRestartConfig: saveRestartConfig,
    isFirstPageEnabled: isFirstPageEnabled,
    setFirstPageEnabled: setFirstPageEnabled,
    getDisabledFirstPages: loadDisabledFirstPages,
    setDisabledFirstPages: saveDisabledFirstPages,
    scannerTimeout: SCANNER_PAGE_TIMEOUT
  };

  // Also expose key functions directly to window for reboot page
  window.nextPageId = nextPageId;
  window.getPageFile = getPageFile;

  // Helper function to generate correct page paths based on environment
  window.getPagePath = function (filename) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    console.log(isLocalhost);
    if (isLocalhost) {
      // Live Server: use relative paths
      // If we're already in /pages/, just use filename; otherwise prepend pages/
      const pathname = window.location.pathname;
      const inPagesDir = pathname.includes('/pages/');
      return inPagesDir ? filename : `pages/${filename}`;
    } else {
      // Production: extract base path and reconstruct full URL
      // e.g., /design-drop/preview/34bf4624-5eef-4e71-926a-70a6d4349577/wifi.html
      // becomes /design-drop/preview/34bf4624-5eef-4e71-926a-70a6d4349577/filename
      const pathname = window.location.pathname;
      const lastSlash = pathname.lastIndexOf('/');
      const basePath = pathname.substring(0, lastSlash + 1);
      return basePath + filename;
    }
  };
})();
