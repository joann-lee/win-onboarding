//All the JS needed across the pages to use the different controls.

// Theme initialization - apply saved preferences from index.html
(function initTheme() {
  const savedMode = localStorage.getItem('themeMode') || 'light';
  const savedPalette = localStorage.getItem('themePalette') || 'standard';
  const savedCssStyle = localStorage.getItem('cssStyle') || 'win11';
  const root = document.documentElement;
  
  // Remove all theme classes from html element
  root.classList.remove('dark', 'light', 'dune', 'sapphire', 'violet', 'win11', 'evolved');
  
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
  }
})();

// Mode toggle button functionality
(function initModeToggle() {
  document.addEventListener('DOMContentLoaded', () => {
    // Find the mode button by its aria-label or icon
    const modeButton = document.querySelector('[aria-label="Mode settings"]');
    
    if (modeButton) {
      modeButton.addEventListener('click', () => {
        const body = document.body;
        const root = document.documentElement;
        const isLight = body.classList.contains('light');
        
        // Toggle between light and dark
        if (isLight) {
          body.classList.remove('light');
          body.classList.add('dark');
          root.classList.add('dark');
          localStorage.setItem('themeMode', 'dark');
          modeButton.setAttribute('aria-pressed', 'true');
        } else {
          body.classList.remove('dark');
          body.classList.add('light');
          root.classList.remove('dark');
          localStorage.setItem('themeMode', 'light');
          modeButton.setAttribute('aria-pressed', 'false');
        }
      });
      
      // Set initial aria-pressed state
      const currentMode = localStorage.getItem('themeMode') || 'light';
      modeButton.setAttribute('aria-pressed', currentMode === 'dark' ? 'true' : 'false');
    }
  });
})();

// Shared per-page initialization: lottie animation & accessibility
(function initLottie() {
  // Load Lottie animation if container exists and animation data is available
  const lottieContainer = document.getElementById('lottie');
  if (lottieContainer && window.lottie && window.lottieAnimationData) {
    const anim = window.lottie.loadAnimation({
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
  }
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
    { name: 'ENet-5G', secured: true, signal: 4 },
    { name: 'TP-LINK_5514A_EXT', secured: true, signal: 3 },
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
            <button class="button-primary wifi-connect-btn">Connect</button>
          </div>
          <div class="wifi-password-entry">
            <div class="wifi-password-label">Enter the password</div>
            <div class="fluent-input-wrapper">
              <input type="password" class="wifi-password-input fluent-input" placeholder="Password">
            </div>
            <div class="wifi-password-actions">
              <button class="button-primary wifi-verify-btn">Next</button>
              <button class="button-secondary wifi-cancel-btn">Cancel</button>
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
          <button class="wifi-disconnect-btn" style="align-self: flex-end;">Disconnect</button>
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
            <button class="button-primary wifi-connect-btn">Connect</button>
          </div>
          <div class="wifi-password-entry">
            <div class="wifi-password-label">Enter the password</div>
            <div class="fluent-input-wrapper">
              <input type="password" class="wifi-password-input fluent-input" placeholder="Password">
            </div>
            <div class="wifi-password-actions">
              <button class="button-primary wifi-verify-btn">Next</button>
              <button class="button-secondary wifi-cancel-btn">Cancel</button>
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
        window.navigateWithTransition('/assets/desktop.html');
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


