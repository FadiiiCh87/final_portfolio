# Muhammad Fahad — interactive 3D portfolio

A responsive, buildless website preserving the recognizable content and original images from https://fadiiich87.github.io/Portfolio/.

## Features

- Local Three.js WebGL scene with real meshes, lighting, drag and keyboard rotation, clickable nodes, and section-specific insights.
- Project category filters and accessible project overview dialogs.
- Keyboard-accessible skill tabs; responsive menu and section navigation.
- Original resume download, portrait, project screenshots, professional history, skill ratings, certifications, email addresses, phone number, and social profiles.
- Contact form prepares an email draft for the visitor to review and send in their email application. No submission is falsely reported as delivered.
- Reduced-motion support, explicit animation pause, flat-view fallback, visibility-aware rendering, and bounded pixel ratio.
- Private owner-only Sites hosting. `noindex` and `robots.txt` reinforce privacy but hosting access controls provide the actual protection.

## Source

The root folder contains all website assets. The site has no build step, third-party network dependencies, tracking, or external form endpoint. Three.js r170 is included locally under its MIT license.

Original project screenshots are preserved, including the original Event Management image named `powerbi.png`. No missing project demo URL is invented.

## Validation

Run `node --check app.js` and the source checks in `checks/`. The managed environment did not expose the required control-browser capability, so visual browser QA at desktop/mobile widths could not be performed. Responsive CSS, all assets, links, HTML structure, and DOM interactions are checked without a browser; this does not substitute for a visual device test.
