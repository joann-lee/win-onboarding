/**
 * Theme Manager for Desktop
 * Listens to OOBE storage changes and manages wallpaper transitions
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'standard';
        this.themes = ['standard', 'sapphire', 'violet', 'dune'];
        this.themeOverlay = document.getElementById('theme-overlay');
        this.themeVariablesLink = document.getElementById('theme-variables');
        this.isTransitioning = false;
        
        // Bind methods
        this.handleStorageChange = this.handleStorageChange.bind(this);
        this.handleOOBEThemeChange = this.handleOOBEThemeChange.bind(this);
        
        this.init();
    }
    
    init() {
        // Initialize theme from storage or default
        this.loadInitialTheme();
        
        // Listen for storage changes (from OOBE pages)
        window.addEventListener('storage', this.handleStorageChange);
        
        // Listen for custom theme events
        window.addEventListener('oobeThemeChange', this.handleOOBEThemeChange);
        
        // Set initial wallpaper
        this.setWallpaper(this.currentTheme, false);
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        console.log('ThemeManager initialized with theme:', this.currentTheme);
    }
    
    loadInitialTheme() {
        try {
            // Read OOBE theme settings from localStorage
            const oobeThemePalette = localStorage.getItem('themePalette') || 'standard';
            const oobeThemeMode = localStorage.getItem('themeMode') || 'light';
            
            // Set theme palette
            if (this.themes.includes(oobeThemePalette)) {
                this.currentTheme = oobeThemePalette;
            }
            
            // Set dark/light mode - CSS expects .light or .dark class
            const isDark = oobeThemeMode === 'dark';
            document.documentElement.classList.toggle('dark', isDark);
            document.documentElement.classList.toggle('light', !isDark);
            
            console.log('Loaded OOBE theme:', oobeThemePalette, oobeThemeMode);
        } catch (error) {
            console.warn('Error loading initial theme:', error);
            this.currentTheme = 'standard';
        }
    }
    
    handleStorageChange(event) {
        if (event.key === 'themePalette') {
            const newTheme = event.newValue;
            
            if (newTheme && this.themes.includes(newTheme) && newTheme !== this.currentTheme) {
                console.log('Theme palette change detected from OOBE:', newTheme);
                this.switchTheme(newTheme);
            }
        }
        
        if (event.key === 'themeMode') {
            const isDark = event.newValue === 'dark';
            document.documentElement.classList.toggle('dark', isDark);
            document.documentElement.classList.toggle('light', !isDark);
            // Refresh wallpaper to update for new mode
            this.setWallpaper(this.currentTheme, false);
        }
    }
    
    handleOOBEThemeChange(event) {
        const newTheme = event.detail?.theme;
        if (newTheme && this.themes.includes(newTheme) && newTheme !== this.currentTheme) {
            console.log('Theme change detected from OOBE event:', newTheme);
            this.switchTheme(newTheme);
        }
    }
    
    async switchTheme(newTheme) {
        if (this.isTransitioning || newTheme === this.currentTheme) {
            return;
        }
        
        console.log('Switching theme from', this.currentTheme, 'to', newTheme);
        
        this.isTransitioning = true;
        
        try {
            // Show transition overlay
            if (this.themeOverlay) {
                await this.showTransitionOverlay();
            }
            
            // Switch wallpaper
            await this.setWallpaper(newTheme, true);
            
            // Apply new theme
            this.applyTheme(newTheme);
            
            // Update storage to sync with OOBE
            this.updateStorage(newTheme);
            
            // Update current theme
            const previousTheme = this.currentTheme;
            this.currentTheme = newTheme;
            
            // Hide transition overlay
            if (this.themeOverlay) {
                await this.hideTransitionOverlay();
            }
            
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('desktopThemeChanged', {
                detail: { theme: newTheme, previousTheme: previousTheme }
            }));
            
        } catch (error) {
            console.error('Error switching theme:', error);
        } finally {
            this.isTransitioning = false;
        }
    }
    
    showTransitionOverlay() {
        return new Promise(resolve => {
            if (this.themeOverlay) {
                this.themeOverlay.style.opacity = '0.3';
            }
            setTimeout(resolve, 150);
        });
    }
    
    hideTransitionOverlay() {
        return new Promise(resolve => {
            if (this.themeOverlay) {
                this.themeOverlay.style.opacity = '0';
            }
            setTimeout(resolve, 300);
        });
    }
    
    setWallpaper(theme, animate = true) {
        return new Promise(resolve => {
            const wallpaperImg = document.getElementById('wallpaper-img');
            if (!wallpaperImg) {
                console.warn('Wallpaper image element not found');
                resolve();
                return;
            }
            
            // Get current mode from localStorage
            const mode = localStorage.getItem('themeMode') || 'light';
            
            // Set background image based on theme and mode
            let backgroundImage;
            if (theme === 'standard' && mode === 'light') {
                backgroundImage = '../assets/wallpaper/background-standard-light.jpg';
            } else {
                backgroundImage = `../assets/wallpaper/background-${theme}-${mode}.png`;
            }
            
            wallpaperImg.src = backgroundImage;
            
            console.log(`Set wallpaper: ${theme}-${mode}, path: ${backgroundImage}`);
            
            // Complete after animation
            setTimeout(resolve, animate ? 600 : 0);
        });
    }
    
    applyTheme(theme) {
        // Update CSS variables link
        if (this.themeVariablesLink) {
            this.themeVariablesLink.href = `../css/variables-${theme}.css`;
        }
        
        // Update body class
        document.body.className = `theme-${theme}`;
        
        // Remove old theme classes and add new ones
        // The CSS variables use selectors like :root.light.violet or :root.dark.violet
        document.documentElement.classList.remove(...this.themes);
        document.documentElement.classList.add(theme);
        
        // Ensure light/dark mode class is set (CSS expects .light or .dark)
        const isDark = document.documentElement.classList.contains('dark');
        if (!isDark) {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
        
        // Update CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--current-theme', theme);
    }
    
    updateStorage(theme) {
        try {
            localStorage.setItem('oobeTheme', theme);
            sessionStorage.setItem('oobeTheme', theme);
            
            // Also update general theme storage for compatibility
            localStorage.setItem('desktopTheme', theme);
            
            console.log('Theme stored:', theme);
        } catch (error) {
            console.warn('Could not store theme:', error);
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getAvailableThemes() {
        return [...this.themes];
    }
    
    // Public method to manually switch theme
    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.switchTheme(theme);
        } else {
            console.warn('Invalid theme:', theme);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}