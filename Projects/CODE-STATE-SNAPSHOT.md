# Portfolio Code State Snapshot
**Generated:** 2026-04-10

---

## 1. File Tree (2 levels deep)

```
claude portfolio march26/
├── CLAUDE.md                      ← Master project instructions
├── ClaudeChatPortfolioV2.zip      ← Original v2 archive
├── SKILL (1).md                   ← Skill reference
├── about.html                     ← About page
├── game.js                        ← Footer mountain biker game
├── index.html                     ← Homepage: intro animation + bento grid
├── main.js                        ← All interactions, cursor, page transitions
├── styles.css                     ← Single stylesheet for all pages
│
├── .claude/
│   ├── CLAUDE.md                  ← Build rules & core loop directive
│   ├── launch.json                ← VS Code launch config
│   ├── learnings.md               ← Learning log
│   └── settings.local.json        ← Local settings
│
├── work/
│   ├── ghost.html       (15K)     ← Case study: Ghost Design System Reality Scanner
│   ├── gotefigure.html  (8.9K)    ← Case study: GoteFigure Apparel Brand
│   ├── lexisnexis.html  (15K)     ← Case study: Bridging Design and Engineering
│   └── pulse.html       (14K)     ← Case study: Pulse AI UX Intelligence Dashboard
│
├── img/
│   ├── ghost/                     ← 7 images (hero + 5 process + thumbnail)
│   ├── gotefigure/                ← 1 image (thumbnail only)
│   ├── lexisnexis/                ← 10 active + 10 -old backups
│   └── pulse/                     ← 7 images (hero + 5 process + thumbnail)
│
├── images/                        ← LEGACY path — GoteFigure images (10 files)
│   └── gotefigure/                ← Referenced by index.html bento card
│
├── Projects/
│   ├── Ghost/                     ← case-study.md + 34 images + 3 webm
│   ├── GoteFigure/                ← case-study.md + 10 images
│   ├── LexisNexis/                ← case-study.md + IMAGE-AUDIT.md + 10 images
│   └── Pulse/                     ← case-study.md + 45 images + 15 webm
│
├── animations/                    ← 2 screen recordings of intro animation
├── animation-reference-frames:/   ← 16 intro animation frame screenshots
│
├── _backup-broken/                ← Broken version backup
├── _backup-current-intro/         ← Current intro backup
├── _backup-game-v1/               ← Game v1 backup
├── _backup-game-v2/               ← Game v2 backup
├── _backup-old-projects/          ← youtube-community.html, nexusstudio.html
├── _backup-v2-clean/              ← Clean v2 animation backup
├── _backup-v3-animation/          ← v3 animation backup
├── _backup-v4-animation/          ← v4 animation backup
├── _backup-v4-rigid-cursor/       ← v4 rigid cursor backup
├── _backup-v5-animation/          ← v5 animation backup
└── _v2_temp/                      ← Original unzipped v2 files (7 files)
```

---

## 2. Key File Headers (first 30 lines)

### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rotem Gotlieb — Portfolio</title>
  <style>.page-transition.active{position:fixed;inset:0;background:#FAFAF8;z-index:9998;opacity:1;}
         .name-intro{position:fixed;inset:0;background:#FAFAF8;z-index:10000;}</style>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">
  <script>(function(){if(localStorage.getItem('theme')==='dark')
    document.documentElement.setAttribute('data-theme','dark');})();</script>
  <link rel="stylesheet" href="styles.css?v=9">
</head>
<body>
  <!-- Page Transition Overlay -->
  <div class="page-transition active"></div>
  <!-- Name Intro Animation -->
  <div class="name-intro" id="nameIntro">
    <!-- 8 tool icons: Figma, pen, layers, code, droplet, grid, cursor, type -->
    <!-- Character-by-character name reveal: ROTEM / GOTLIEB -->
  </div>
  <!-- Circle wipe reveal layer -->
  <div class="intro-reveal" id="introReveal"></div>
  <!-- Nav: ROTEM | Work About Contact | dark mode toggle -->
  <!-- Hero: "I design systems that make complex workflows feel simple." -->
  <!-- Projects — 2x2 Offset Bento Grid -->
  <!--   Top: LexisNexis (bento-card-a) + Pulse (bento-card-b) -->
  <!--   Bottom: GoteFigure (bento-card-c) + Ghost (bento-card-d) -->
  <!-- Footer: game canvas + quote + social links -->
```

### styles.css
```css
/* v7: Rebuilt intro animation from scratch */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');

:root {
  --bg-primary: #FAFAF8;
  --bg-secondary: #F2F1EE;
  --text-primary: #1A1A1A;
  --text-body: #333333;
  --text-secondary: #555555;
  --text-muted: #888888;
  --text-faint: #999999;
  --nav-link: #666666;
  --border-light: #E8E8E6;
  --hover-shadow: rgba(0,0,0,0.06);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --card-radius: 12px;
}

[data-theme="dark"] {
  --bg-primary: #141413;  --bg-secondary: #1E1E1C;
  --text-primary: #F0F0EC; --text-body: #CCCCC6;
  /* ... full token swap ... */
}
```

### main.js
```js
/* v7: Rebuilt intro animation from scratch */
(function () {
  'use strict';
  var transitionOverlay = document.querySelector('.page-transition');
  var nameIntro = document.getElementById('nameIntro');
  var isHomepage = !!nameIntro;
  /* INTRO ANIMATION — v8 JS-orchestrated timeline
     T+0ms     Name reveal (CSS)
     T+600ms   Icons burst (CSS)
     T+900ms   Mouse glide starts (JS rAF)
     T+1700ms  Mouse arrives at Figma
     T+1850ms  Click + spark lines
     T+2150ms  Hide intro content
     T+2200ms  Circle wipe */
```

---

## 3. Image Inventory (img/)

### img/ghost/ (7 files)
| File | Dimensions | Size |
|------|-----------|------|
| hero.png | 1600x777 | 132K |
| process-01.png | 1600x1000 | 276K |
| process-02.png | 1600x1000 | 260K |
| process-03.png | 1600x1000 | 292K |
| process-04.png | 1600x1000 | 268K |
| process-05.png | 1600x1000 | 224K |
| thumbnail.png | 800x500 | 68K |

### img/pulse/ (7 files)
| File | Dimensions | Size |
|------|-----------|------|
| hero.png | 1600x800 | 252K |
| process-01.png | 1600x1000 | 208K |
| process-02.png | 1600x1000 | 400K |
| process-03.png | 1600x1000 | 320K |
| process-04.png | 1600x1000 | 332K |
| process-05.png | 1600x840 | 216K |
| thumbnail.png | 800x420 | 128K |

### img/lexisnexis/ (10 active + 10 old)
| File | Dimensions | Size | Source |
|------|-----------|------|--------|
| hero.png | 1600x1039 | 736K | USB: 02-dovetail/11.59.38 AM (3024x1964) |
| overview.png | 1600x1039 | 816K | USB: 02-dovetail/12.00.04 PM (3024x1964) |
| research-01.png | 1600x938 | 324K | USB: 02-dovetail/12.19.25 PM (2702x1584) |
| prototype-01.png | 1600x1039 | 224K | USB: 01-react-app/9.45.43 AM (3024x1964) |
| prototype-02.png | 1600x833 | 260K | USB: 01-react-app/12.13.42 PM (2368x1234) |
| prototype-03.png | 1600x926 | 352K | USB: 01-react-app/senario3[33] (2228x1290) |
| tokens-01.png | 1600x900 | 152K | USB: 03-design-2-code/D2C(ideation).pdf converted |
| tokens-02.png | 1600x900 | 268K | USB: 03-design-2-code/Design to Code Pipeline.pdf |
| tokens-03.png | 1600x900 | 180K | USB: 03-design-2-code/Design to Code Pipeline_2.pdf |
| thumbnail.png | 800x272 | 76K | USB: 04-color-palette/1.19.18 PM (2354x800) |
| *-old.png (x10) | — | — | Pre-upgrade backups |

### img/gotefigure/ (1 file)
| File | Dimensions | Size |
|------|-----------|------|
| thumbnail.jpg | 800x577 | 144K |

### images/gotefigure/ (LEGACY path, 10 files)
Referenced by `index.html` bento card (`images/gotefigure/model-hoodie.jpg`).
Files: collection-grid.jpg, hero.jpg, illustration-homer.jpg, lineart-colorways.jpg, model-hoodie.jpg, product-detail.jpg, product-grid.jpg, shopify-homepage.jpg, sketch-mushrooms.jpg, tees-collection.jpg

---

## 4. Projects/ Source Material

### Projects/Ghost/ — 1 markdown + 34 images + 3 webm recordings
- `case-study.md` — Full case study text
- Images: 01-34 numbered screenshots (dashboard, scan detail, components, accessibility, reports, crops)
- Recordings: 3 webm screen captures

### Projects/GoteFigure/ — 1 markdown + 10 images
- `case-study.md` — Full case study text
- Images: hero, sketches, illustrations, shopify, product shots, collections

### Projects/LexisNexis/ — 1 markdown + 1 audit + 10 images
- `case-study.md` — Full case study text
- `IMAGE-AUDIT.md` — Detailed image audit report
- Images: same 10 files as img/lexisnexis/ (pre-upgrade copies)
- **USB source:** `/Volumes/LITTOLB/Claude Code Portfolio ORG/lexisnexis/` has ~30 unique high-res images across 9 organized subfolders + Bulk + 4 pipeline PDFs

### Projects/Pulse/ — 1 markdown + 45 images + 15 webm recordings
- `case-study.md` — Full case study text
- Images: dashboard, issues, deep-dive, components, xray, brief, sidebar, journey-flow — both dark and light variants
- Recordings: 15 webm screen captures (dashboard load, scroll, xray modes, etc.)

---

## 5. .claude/learnings.md

```
## 2026-03-24
- Project initialized with learning loop. Portfolio has 4 projects: LexisNexis, Pulse, Ghost, GoteFigure.
- Major content swap: YouTube Community and Nexus Studio replaced with Pulse and Ghost.
- All images resized with `sips --resampleWidth` for web optimization.
```

---

## 6. TODO / Placeholder / Lorem Grep

**Active HTML files (work/, index.html, about.html):** NONE found.

**_v2_temp/ only (legacy, not served):**
- `_v2_temp/gotefigure.html:69` — `<!-- Image placeholder -->`
- `_v2_temp/lexisnexis.html:73` — `<!-- Image placeholder -->`
- `_v2_temp/nexusstudio.html:69` — `<!-- Image placeholder -->`
- `_v2_temp/youtube-community.html:69` — `<!-- Image placeholder -->`

These are in the old v2 temp folder only. No active pages have TODO/placeholder/Lorem.

---

## 7. Backup Directories

No git history (not a git repo). Backups are folder-based:
| Folder | Contents | Purpose |
|--------|----------|---------|
| `_backup-broken/` | index, main, styles | Broken version |
| `_backup-current-intro/` | index, main, styles | Current intro snapshot |
| `_backup-game-v1/` | game.js | Game version 1 |
| `_backup-game-v2/` | game.js | Game version 2 |
| `_backup-old-projects/` | youtube-community.html, nexusstudio.html | Replaced project pages |
| `_backup-v2-clean/` | index, main, styles | Clean v2 animation |
| `_backup-v3-animation/` | index, main, styles | v3 animation |
| `_backup-v4-animation/` | index, main, styles | v4 animation |
| `_backup-v4-rigid-cursor/` | index, styles | v4 rigid cursor variant |
| `_backup-v5-animation/` | index, main, styles | v5 animation |
| `_v2_temp/` | 7 HTML/JS/CSS files | Original unzipped v2 |

Full project backup at: `~/Desktop/claude portfolio march26-BACKUP-20260324/`

---

## 8. Work Pages Summary

| Page | Size | Status |
|------|------|--------|
| `work/lexisnexis.html` | 15K | Complete. 10 images placed (hero + overview + research-01 + 3 prototype + 3 token + thumbnail on homepage). All upgraded from USB 2026-04-10. |
| `work/pulse.html` | 14K | Complete. 7 images placed (hero + 5 process + thumbnail). |
| `work/ghost.html` | 15K | Complete. 7 images placed (hero + 5 process + thumbnail). |
| `work/gotefigure.html` | 8.9K | Complete. Uses images from `images/gotefigure/` legacy path. |

---

## Known Issues / Open Items

1. **GoteFigure has two image paths:** `img/gotefigure/` (thumbnail only) and `images/gotefigure/` (10 source images used by bento card). Should consolidate.
2. **LexisNexis prototype trio heights still vary:** 1039, 833, 926px — CSS `aspect-ratio: 16/10` + `object-fit: cover` normalizes visually but crops differ.
3. **LexisNexis -old backup images** in `img/lexisnexis/` should be cleaned up before deploy.
4. **No og:image or meta tags** on any page yet.
5. **No real photo** on about.html yet.
6. **Not a git repo** — no version control beyond folder backups.
7. **`animation-reference-frames:/`** has a colon in the folder name (macOS artifact) — may cause issues on other OSes.
