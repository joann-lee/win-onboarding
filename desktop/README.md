# Desktop

A curated collection of design tools and resources integrated with the OOBE theme system.

## Features

- **Theme Integration**: Automatically syncs with OOBE theme changes via localStorage
- **Dynamic Wallpapers**: Theme-specific wallpapers that transition smoothly
- **Storage Listener**: Responds to theme changes from other OOBE pages in real-time
- **Interactive Tools**: Collection of design and development tools
- **Responsive Design**: Works across all device sizes
- **Accessibility**: Full keyboard navigation and focus management

## Theme System Integration

The Desktop page integrates with the OOBE theme system through:

1. **Storage Monitoring**: Listens for `oobeTheme` changes in localStorage
2. **CSS Variables**: Uses the same design tokens as OOBE pages
3. **Wallpaper Switching**: Automatically updates wallpapers based on selected theme
4. **Event System**: Dispatches and listens for theme change events

### Supported Themes
- **Standard**: Blue gradient with clean aesthetics
- **Sapphire**: Cyan/teal professional theme  
- **Violet**: Purple creative theme
- **Dune**: Orange/amber warm theme

## File Structure

```
desktop/
├── index.html              # Main page
├── css/
│   └── desktop.css         # Main styles with theme integration
├── js/
│   ├── theme-manager.js    # Theme storage listener and wallpaper manager
│   └── design-labs.js      # Main application and tool interactions
└── assets/
    └── visuals/            # Wallpaper assets (placeholder)
```

## Usage

### Accessing the Page
Open `desktop/index.html` in a browser or integrate into your application.

### Theme Control
- **Storage**: Set `localStorage.setItem('oobeTheme', 'sapphire')` from any page
- **UI Controls**: Use the theme toggle button or theme cards
- **Keyboard**: Press 'T' to cycle through themes
- **Events**: Dispatch `oobeThemeChange` events

### Integration Example

```javascript
// Change theme from another OOBE page
localStorage.setItem('oobeTheme', 'violet');

// Or dispatch an event
window.dispatchEvent(new CustomEvent('oobeThemeChange', {
  detail: { theme: 'violet' }
}));
```

## Development

### Adding New Themes
1. Add theme name to `ThemeManager.themes` array
2. Create CSS variables file: `../css/variables-{theme}.css`
3. Add wallpaper assets for light/dark modes
4. Update wallpaper styling in `desktop.css`

### Adding New Tools
1. Add tool card HTML in the tools grid section
2. Implement tool functionality in `desktop.js`
3. Add tool-specific styling as needed

## Browser Support

- Modern browsers with CSS Custom Properties support
- ES6+ JavaScript features
- localStorage/sessionStorage APIs
- Intersection Observer API for animations

## Performance

- Optimized CSS transitions and animations
- Efficient storage listeners
- Preloaded wallpaper assets
- Minimal DOM manipulation

## Accessibility

- Full keyboard navigation
- Focus management
- Screen reader support
- High contrast mode support
- Reduced motion respect