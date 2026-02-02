// Global scrollbar visibility control
// Shows scrollbars automatically when content overflows

(function initScrollbarVisibility() {
  function setupScrollableElements() {
    // Find all scrollable containers
    const scrollableSelectors = [
      '.eula-content',
      '.wifi-list',
      '#country-list',
      '#keyboard-list',
      '#language-list',
      '.info-cards-list',
      '.oobe-body'
    ];

    scrollableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        // Skip if already initialized
        if (el.hasAttribute('data-scrollbar-initialized')) return;
        el.setAttribute('data-scrollbar-initialized', 'true');

        // Check if element has overflow (actually needs scrolling)
        // and immediately show scrollbar if it does
        function updateScrollbarVisibility() {
          const hasOverflow = el.scrollHeight > el.clientHeight;
          if (hasOverflow) {
            el.setAttribute('data-scrollbar-visible', 'true');
          } else {
            el.setAttribute('data-scrollbar-visible', 'false');
          }
        }

        // Initial check - show scrollbar immediately if needed
        updateScrollbarVisibility();

        // Re-check on resize
        window.addEventListener('resize', updateScrollbarVisibility);
      });
    });
  }

  // Run setup when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollableElements);
  } else {
    setupScrollableElements();
  }

  // Also run after a short delay to catch dynamically populated content (like wifi list)
  // and after layout has been calculated
  window.addEventListener('load', () => {
    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupScrollableElements();
      });
    });
  });

  // Expose function globally so it can be called after dynamic content is added
  window.refreshScrollbarVisibility = setupScrollableElements;
})();
