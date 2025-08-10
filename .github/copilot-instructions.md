# Global Security BootCamp Perth 2025 Website

Global Security BootCamp Perth 2025 is a static HTML/CSS/JavaScript conference website built with Bootstrap 5, custom CSS, and interactive JavaScript. The website showcases a Microsoft Security conference with speakers, agenda, registration, and venue information.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- **Bootstrap and run the website:**
  - `npm install` -- takes ~2 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
  - Start local web server: `python3 -m http.server 8080`
  - Website runs at: http://localhost:8080
  - **VALIDATION SCENARIO**: Always test navigation, session modals, and mobile responsiveness after changes.

- **Build and minify JavaScript:**
  - `npx terser js/script.js -o js/script.min.js --compress --mangle` -- takes ~1 second. NEVER CANCEL. Set timeout to 30+ seconds.
  - Always build after making JavaScript changes.

- **Test website functionality:**
  - Navigate to all sections: Home, About, Speakers, Agenda, Tickets, Venue, Contact
  - Click session cards to test modal functionality
  - Test mobile navigation on small screens (390px width)
  - Verify all links work (Meetup registration, external partners)

## Validation

- **ALWAYS run through complete end-to-end scenarios after making changes:**
  - Test navigation between all sections
  - Click on session cards to open modals and verify content displays
  - Test modal close functionality
  - Verify responsive design on mobile (390px) and desktop (1200px+) viewports
  - Check that registration links work correctly
- **External dependencies may fail in sandboxed environments** (CDN resources like Bootstrap, Google Fonts, external images) but this is expected and does not affect core functionality.
- The website loads speaker and session data dynamically from Sessionize API - API calls may fail in restricted environments but static content remains functional.

## Project Structure

### Repository Root
```
.
├── .github/
│   └── copilot-instructions.md
├── css/
│   └── style.css              # Custom CSS with CSS variables
├── img/                       # Website images and logos
├── js/
│   ├── script.js             # Main JavaScript (46KB)
│   └── script.min.js         # Minified version (21KB)
├── index.html                # Main website (53KB single-page application)
├── package.json              # NPM dependencies (only terser for minification)
└── package-lock.json
```

### Key Files and Components
- **index.html**: Complete single-page application with all sections
- **css/style.css**: Custom styling using CSS variables, Bootstrap 5 integration
- **js/script.js**: Interactive functionality including navigation, modals, API calls
- **package.json**: Minimal dependencies - only terser for JavaScript minification

## Common Tasks

### Development Workflow
- Make changes to HTML, CSS, or js/script.js
- If JavaScript was modified: `npx terser js/script.js -o js/script.min.js --compress --mangle`
- Start web server: `python3 -m http.server 8080`
- Test in browser at http://localhost:8080
- Verify all functionality works before committing

### Testing Scenarios
1. **Navigation Test**: Click all navigation links, verify smooth scrolling to sections
2. **Session Modal Test**: Click any session card in agenda, verify modal opens with correct content
3. **Mobile Test**: Resize to 390px width, test hamburger menu and responsive layout
4. **Registration Test**: Click registration buttons, verify external links open correctly

### File Sizes and Performance
- Main HTML file: 53KB (comprehensive single-page site)
- Original JavaScript: 46KB
- Minified JavaScript: 21KB (always use minified version in production)
- CSS file: Uses modern CSS variables for consistent theming

## Dependencies and External Services

### NPM Dependencies
- **terser**: JavaScript minification (only build-time dependency)
- No runtime JavaScript frameworks - vanilla JavaScript implementation

### External Services (may fail in sandboxed environments)
- Bootstrap 5 CDN: CSS framework
- Google Fonts: Typography (Inter, Playfair Display)
- Font Awesome: Icons
- Sessionize API: Speaker and session data (dynamic loading)
- Bing Maps: Venue location embedding

### Browser Compatibility
- Modern browsers supporting ES6+
- Responsive design for mobile and desktop
- Progressive enhancement - core functionality works without external CDNs

## Architecture Notes

- **Single-page application** with smooth scrolling navigation
- **Bootstrap 5** for responsive grid and components
- **Custom CSS variables** for consistent theming and easy customization
- **Vanilla JavaScript** with ES6+ features (no frameworks)
- **Progressive enhancement** - works with or without external resources
- **Mobile-first responsive design** with breakpoints for all device sizes

## Troubleshooting

### Common Issues
- **CDN resources blocked**: Expected in sandboxed environments, doesn't affect core functionality
- **Sessionize API fails**: External API calls may be blocked, static content still works
- **JavaScript errors**: Minor reference errors may occur but don't break functionality
- **Image loading**: Some external images may not load in restricted environments

### Quick Fixes
- If JavaScript breaks: Check browser console, rebuild minified version
- If styling issues: Verify CSS file is loading, check for syntax errors
- If navigation doesn't work: Ensure Bootstrap JavaScript is loading
- If modals don't open: Check JavaScript console for errors, verify event handlers

Always test your changes by running the website locally and exercising the complete user journey from homepage through navigation, session details, and registration flow.