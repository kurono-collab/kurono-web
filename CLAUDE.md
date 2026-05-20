# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo Structure

Monorepo containing multiple KURONO web projects. Each site is fully self-contained in its subdirectory — plain static HTML/CSS/JS, no build tool, no npm.

```
kurono-org/    ← kurono.org main studio site
cruzar-ia/     ← cruzar.ia project (in development)
```

To preview any site: `cd <dir> && python3 -m http.server` (ES modules require a server, not `file://`).

---

## kurono-org

Full studio site for kurono.org. Architecture:

```
kurono-org/
├── index.html          ← entry point, links external CSS/JS
├── css/main.css        ← all styles (design tokens, layout, animations)
├── js/cursor.js        ← custom cursor with smooth lag and hover states
├── js/swarm.js         ← canvas boids particle system forming letter K
├── js/main.js          ← entry: imports cursor + swarm, nav scroll, reveal
├── assets/             ← icon.png (favicon), logo_no_bg.png (hero + about)
├── STYLE_REFERENCE.md  ← full visual style guide (palette, type, animations)
└── CNAME               ← kurono.org (GitHub Pages custom domain)
```

### Key JS Systems

**Cursor** (`#cur`): 7px dot trailing the real cursor via lerp (`cx += (mx-cx) * 0.13`). Grows to 44px ring on `<a>` hover (`.big` class).

**Nav**: `.solid` class (frosted glass `backdrop-filter: blur(14px)`) added when `scrollY > 60`.

**Reveal**: `IntersectionObserver` adds `.show` to `.about` at 7% visibility.

**Swarm** (main visual): 210 particles, boids flocking algorithm on `<canvas>`, forms letter "K". 4-phase cycle:
- Phase 0 `flock` (580f): free movement, `gatherW = 0`
- Phase 1 `converge` (300f): ease-in-out gather toward K targets
- Phase 2 `hold` (260f): clamped slow speed, fully formed K
- Phase 3 `release` (180f): ease-in-out scatter

Canvas pauses when hero section leaves viewport (`IntersectionObserver` → `heroActive`).

### Design Tokens

CSS custom properties on `:root`:
```
--bg: #0A0704        near-black background
--clay: #8B6840      warm amber, primary accent
--dust: #D8CDB8      off-white text
--dust-m: #7A6A58    muted text
```

Full palette + type scale + interaction specs in `kurono-org/STYLE_REFERENCE.md`.

---

## cruzar-ia

Placeholder — content TBD.
