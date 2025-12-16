// Global scrollbar visibility control
// Shows scrollbars on hover and keeps them permanently visible on that page

(function initScrollbarVisibility() {
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
      let scrollbarVisibleOnPage = false;

      // Check if element has overflow (actually needs scrolling)
      function updateScrollbarVisibility() {
        const hasOverflow = el.scrollHeight > el.clientHeight;
        if (hasOverflow) {
          el.setAttribute('data-scrollbar-visible', 'false');
        }
      }

      // Initial check
      updateScrollbarVisibility();

      // Re-check on resize
      window.addEventListener('resize', updateScrollbarVisibility);

      // Show scrollbar on hover - make it permanently visible on this page
      el.addEventListener('mouseenter', () => {
        const hasOverflow = el.scrollHeight > el.clientHeight;
        if (hasOverflow && !scrollbarVisibleOnPage) {
          el.setAttribute('data-scrollbar-visible', 'true');
          scrollbarVisibleOnPage = true;
        }
      });

      // Keep scrollbar visible - don't hide it once shown
      el.addEventListener('mousemove', (e) => {
        const hasOverflow = el.scrollHeight > el.clientHeight;
        if (!hasOverflow) return;

        // Check if mouse is over the scrollbar area
        const rect = el.getBoundingClientRect();
        const isNearRightEdge = e.clientX > rect.right - 15;

        if (isNearRightEdge) {
          el.setAttribute('data-scrollbar-visible', 'true');
          scrollbarVisibleOnPage = true;
        }
      });

      // Don't hide on mouseleave - scrollbar stays visible once shown on this page
    });
  });
})();
