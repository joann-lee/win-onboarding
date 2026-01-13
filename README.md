# Vision for OOBE, SCOOBE, Nth LOGON PROTOTYPE
by Jason Geiger
based largely on nina navazio's proto

Theming and components based on MAI components and tokens
- Win11 theme - aligns with what's in production
- Evolved theme - streamlined UI and aligned with early phases of Windows Design System refresh
- Supports light and dark mode
- Colors for alignement with Surface devices

This is not production code! this is HTML, CSS, and JS. But when you full-screen the browser page, it does look like production code :) 
 

## KNOWN BUGS
- NDUP breaks the flow, you can't get past it right now. It does a fake reboot but then just goes back to the NDUP page. Sorry! 
- Windows Hello face and fingerprint don't have the set up flows fully implemented.
- Service pages and partner pages aren't implemented, like OneDrive Camera Roll Backup, Phone Link setup, M365 family / basic / free informational, and Gamepass.
- Accessibility flyouts, virtual keyboard, and volume control aren't implemented yet. 
- The design is not accurately dynamic to portrait mode as OOBE is today. 
- Back buttons aren't implemented on the pages that have back buttons.
- Secondary pages, like "learn more" pages aren't implemented.

## HOW TO ADD YOUR OWN PAGE
Duplicaete "0 template.html", rename it to a helpful semantic name for your page, then follow the "TODO" comments. This will include adding it to the JSON array in flow.js and updating the lottie animation.

To add a new lottie animation, find the actual lottie code either in prod or exported from AfterEffects. Then, create a new javascript file with a helpful semantic name in assets/animations. Then, in the JS file write "window.lottieAnimationData = " and then paste the copied lottie code. It should look similar to the other JS files, with {}s. Then use that file on your page and you're good to go! 