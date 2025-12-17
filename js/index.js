//JS needed to control the draggable reordering on the index.html page

function mapIdToFile(id) {
  if (window.OOBEFlow && window.OOBEFlow.getPageFile) {
    const file = window.OOBEFlow.getPageFile(id);
    if (file) return 'pages/' + file;
  }
  return '#';
}
function computeFirst() {
  const order = (window.OOBEFlow && window.OOBEFlow.getOrder()) || [];
  const hidden = (window.OOBEFlow && window.OOBEFlow.getHidden()) || [];
  for (const id of order) { 
    if (!hidden.includes(id)) {
      // Found first non-hidden page, check if it has disabled first page
      const page = window.OOBEFlow && window.OOBEFlow.getPage ? window.OOBEFlow.getPage(id) : null;
      if (page && page.children && page.children.length > 0) {
        const firstPageEnabled = window.OOBEFlow && window.OOBEFlow.isFirstPageEnabled ? window.OOBEFlow.isFirstPageEnabled(id) : true;
        if (!firstPageEnabled) {
          // First page is disabled, return first child instead
          return id + '_0';
        }
      }
      return id;
    }
  }
  return null;
}
function renderFlow() {
  const list = document.getElementById('flow-list');
  if (!list) return;
  list.innerHTML = '';
  const order = OOBEFlow.getOrder();
  const hidden = OOBEFlow.getHidden();
  order.forEach(id => {
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    li.setAttribute('draggable', 'true');

    let pageLabel = id;
    let pageData = null;
    if (window.OOBEFlow && window.OOBEFlow.getPage) {
      const page = window.OOBEFlow.getPage(id);
      if (page) {
        pageLabel = page.label;
        pageData = page;
      }
    }

    const show = !hidden.includes(id);
    li.classList.toggle('flow-item-disabled', !show);
    li.setAttribute('aria-disabled', show ? 'false' : 'true');
    const handle = document.createElement('span'); handle.className = 'drag-handle'; handle.textContent = '⋮⋮'; handle.setAttribute('aria-label', 'Drag to reorder ' + pageLabel);
    
    // Create a flex container for label + badge
    const labelContainer = document.createElement('div');
    labelContainer.className = 'label-container';
    labelContainer.style.display = 'flex';
    labelContainer.style.alignItems = 'center';
    labelContainer.style.gap = '8px';
    labelContainer.style.flex = '1';
    
    const label = document.createElement('span'); label.className = 'label'; label.textContent = pageLabel; label.style.opacity = show ? '1' : '.45';
    labelContainer.appendChild(label);
    
    // Add scanner badge if applicable
    if (pageData && pageData.type === 'scanner') {
      const badge = document.createElement('span');
      badge.className = 'scanner-badge';
      badge.textContent = 'Scanner';
      labelContainer.appendChild(badge);
    }
    
    li.appendChild(handle);
    li.appendChild(labelContainer);
    
    // Add "1" icon if page has children (to disable/enable first page)
    if (pageData && pageData.children && pageData.children.length > 0) {
      const firstPageEnabled = OOBEFlow.isFirstPageEnabled ? OOBEFlow.isFirstPageEnabled(id) : true;
      const firstPageIcon = document.createElement('span');
      firstPageIcon.className = 'first-page-toggle' + (firstPageEnabled ? '' : ' is-disabled');
      firstPageIcon.setAttribute('role', 'button');
      firstPageIcon.setAttribute('aria-pressed', firstPageEnabled ? 'true' : 'false');
      firstPageIcon.setAttribute('title', firstPageEnabled ? 'Disable first page.' : 'Enable first page.');
      firstPageIcon.setAttribute('aria-label', (firstPageEnabled ? 'Disable first page.' : 'Enable first page.'));
      firstPageIcon.innerHTML = firstPageEnabled ? firstPageSvgShown() : firstPageSvgDisabled();
      firstPageIcon.onclick = (e) => {
        e.stopPropagation();
        if (OOBEFlow.setFirstPageEnabled) {
          OOBEFlow.setFirstPageEnabled(id, !firstPageEnabled);
          renderFlow();
        }
      };
      li.appendChild(firstPageIcon);
    }
    
    // Add Windows icon if page has restart (BEFORE eye icon)
    if (pageData && pageData.restartAfter) {
      const config = OOBEFlow.getRestartConfig ? OOBEFlow.getRestartConfig() : { disabledRestarts: [] };
      const restartEnabled = !config.disabledRestarts.includes(id);
      const restartIcon = document.createElement('span');
      restartIcon.className = 'restart-toggle' + (restartEnabled ? '' : ' is-disabled');
      restartIcon.setAttribute('role', 'button');
      restartIcon.setAttribute('aria-pressed', restartEnabled ? 'true' : 'false');
      restartIcon.setAttribute('title', restartEnabled ? 'Hide restart from flow.' : 'Show restart in flow.');
      restartIcon.setAttribute('aria-label', (restartEnabled ? 'Hide restart from flow.' : 'Show restart in flow.'));
      restartIcon.innerHTML = restartEnabled ? windowsSvgShown() : windowsSvgDisabled();
      restartIcon.onclick = (e) => {
        e.stopPropagation();
        if (OOBEFlow.setRestartEnabled) {
          OOBEFlow.setRestartEnabled(id, !restartEnabled);
          renderFlow();
        }
      };
      li.appendChild(restartIcon);
    }
    
    const eye = document.createElement('span'); eye.className = 'eye-toggle' + (show ? '' : ' is-disabled'); eye.setAttribute('role', 'button'); eye.setAttribute('aria-pressed', show ? 'true' : 'false'); eye.setAttribute('title', show ? 'Hide page from flow.' : 'Show page in flow.'); eye.setAttribute('aria-label', show ? 'Hide page from flow.' : 'Show page in flow.');
    eye.innerHTML = show ? eyeSvgShown() : eyeSvgDisabled();
    eye.onclick = () => {
      const h = OOBEFlow.getHidden();
      if (show) { if (!h.includes(id)) { h.push(id); OOBEFlow.setHidden(h); } }
      else { OOBEFlow.setHidden(h.filter(x => x !== id)); }
      renderFlow(); wireStart();
    };
    li.appendChild(eye); list.appendChild(li);
  });
  enableDnD(list);
}
function eyeSvgShown() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function eyeSvgDisabled() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2l20 20"/><path d="M10.73 5.08A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.86 21.86 0 0 1-3.17 3.88M6.12 6.11A21.86 21.86 0 0 0 1 12s4 8 11 8a10.66 10.66 0 0 0 4.4-.9"/><path d="M15 12a3 3 0 0 1-3 3"/><path d="M9 9a3 3 0 0 1 3-3"/></svg>';
}
function windowsSvgShown() {
  return '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" fill="#000"/><rect x="13" y="3" width="8" height="8" fill="#000"/><rect x="3" y="13" width="8" height="8" fill="#000"/><rect x="13" y="13" width="8" height="8" fill="#000"/></svg>';
}
function windowsSvgDisabled() {
  return '<svg viewBox="0 0 24 24" fill="currentColor"><defs><mask id="mask"><rect width="24" height="24" fill="white"/><line x1="2" y1="2" x2="22" y2="22" stroke="black" stroke-width="2.5" stroke-linecap="round"/></mask></defs><rect x="3" y="3" width="8" height="8" fill="#000" mask="url(#mask)"/><rect x="13" y="3" width="8" height="8" fill="#000" mask="url(#mask)"/><rect x="3" y="13" width="8" height="8" fill="#000" mask="url(#mask)"/><rect x="13" y="13" width="8" height="8" fill="#000" mask="url(#mask)"/><line x1="2" y1="2" x2="22" y2="22" stroke="#000" stroke-width="2.5" stroke-linecap="round"/></svg>';
}
function firstPageSvgShown() {
  return '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">1</text></svg>';
}
function firstPageSvgDisabled() {
  return '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">1</text><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}
function enableDnD(container) {
  let dragId = null;
  container.querySelectorAll('li').forEach(li => {
    li.addEventListener('dragstart', e => { dragId = li.getAttribute('data-id'); e.dataTransfer.effectAllowed = 'move'; });
    li.addEventListener('dragover', e => { e.preventDefault(); li.classList.add('drag-over'); });
    li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
    li.addEventListener('drop', e => {
      e.preventDefault(); li.classList.remove('drag-over');
      const targetId = li.getAttribute('data-id');
      if (!dragId || dragId === targetId) return;
      const ord = OOBEFlow.getOrder();
      const from = ord.indexOf(dragId); const to = ord.indexOf(targetId);
      if (from < 0 || to < 0) return;
      ord.splice(to, 0, ord.splice(from, 1)[0]);
      OOBEFlow.setOrder(ord);
      renderFlow(); wireStart();
    });
  });
  container.addEventListener('dragend', () => { dragId = null; container.querySelectorAll('li').forEach(li => li.classList.remove('drag-over')); });
}
function wireStart() {
  const firstId = computeFirst();
  const startHref = firstId ? mapIdToFile(firstId) : '#';
  const startBtn = document.getElementById('start-btn');
  const firstLink = document.getElementById('first-link');
  if (firstId) {
    startBtn.href = startHref;
    if (firstLink) firstLink.href = startHref;
    startBtn.classList.remove('disabled');
    if (firstLink) firstLink.classList.remove('disabled');
  } else {
    startBtn.href = 'assets/desktop.html';
    if (firstLink) firstLink.href = 'assets/desktop.html';
    startBtn.classList.remove('disabled');
    if (firstLink) firstLink.classList.remove('disabled');
  }
}
function flashStart() { const btn = document.getElementById('start-btn'); btn.style.outline = '2px solid #4caf50'; setTimeout(() => btn.style.outline = 'none', 600); }

// Theme management - light/dark toggle + color palette
function initThemeControls() {
  const modeToggle = document.getElementById('mode-toggle');
  const colorPalette = document.getElementById('color-palette');
  
  const savedMode = localStorage.getItem('themeMode') || 'light';
  const savedPalette = localStorage.getItem('themePalette') || 'standard';
  
  // Set initial state
  if (modeToggle) {
    modeToggle.checked = (savedMode === 'dark');
  }
  if (colorPalette) {
    colorPalette.value = savedPalette;
  }
  
  // Apply saved theme
  applyTheme(savedMode, savedPalette);
  
  // Handle mode toggle (light/dark)
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      const mode = e.target.checked ? 'dark' : 'light';
      const palette = colorPalette ? colorPalette.value : 'standard';
      localStorage.setItem('themeMode', mode);
      applyTheme(mode, palette);
    });
  }
  
  // Handle color palette dropdown
  if (colorPalette) {
    colorPalette.addEventListener('change', (e) => {
      const mode = modeToggle && modeToggle.checked ? 'dark' : 'light';
      const palette = e.target.value;
      localStorage.setItem('themePalette', palette);
      applyTheme(mode, palette);
    });
  }
}

function applyTheme(mode, palette) {
  const root = document.documentElement;
  
  // Remove all palette classes
  root.classList.remove('rose-gold', 'forest-green');
  root.classList.remove('dark');
  
  // Apply mode
  if (mode === 'dark') {
    root.classList.add('dark');
  }
  
  // Apply palette (standard has no class, others need the class)
  if (palette === 'rose-gold') {
    root.classList.add('rose-gold');
  } else if (palette === 'forest-green') {
    root.classList.add('forest-green');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeControls();
  renderFlow(); wireStart();
  const reset = document.getElementById('reset-flow');
  if (reset) { reset.onclick = () => { OOBEFlow.setOrder(OOBEFlow.default); OOBEFlow.setHidden([]); OOBEFlow.setRestartConfig({ disabledRestarts: [] }); OOBEFlow.setDisabledFirstPages({ disabledFirstPages: [] }); renderFlow(); wireStart(); }; }
  const startBtn = document.getElementById('start-btn');
  if (startBtn) { startBtn.addEventListener('click', () => { wireStart(); flashStart(); }); }
});
