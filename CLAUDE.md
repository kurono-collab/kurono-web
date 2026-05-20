# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KURONO is a single-file static website (`kweb.html`) for what appears to be a design studio. There is no build system, package manager, or framework — everything lives in one HTML file with inline CSS and JS.

To preview: open `kweb.html` directly in a browser.

## Architecture

The file is structured in three sections:

1. **`<style>` block** — all CSS, using custom properties defined on `:root` for the warm dark palette (`--bg`, `--clay`, `--clay-l`, `--clay-ll`, `--dust`, `--dust-m`, `--dust-d`, `--rule`, `--rule2`).
2. **`<body>` HTML** — three sections: `#hero` (full-viewport canvas + text), `.about` (reveal-on-scroll), and footer.
3. **`<script>` block** — all JavaScript, split into four named regions (CURSOR, NAV, REVEAL, SWARM).

## Key JS Systems

**Cursor** (`#cur`): A 7px dot that lags behind the real cursor using lerp (`cx += (mx-cx) * 0.13`). Grows to 44px on `<a>` hover via the `.big` class.

**Nav**: Adds `.solid` class (frosted glass background) when `scrollY > 60`.

**Reveal**: `IntersectionObserver` adds `.show` to `.about` elements at 7% visibility threshold.

**Swarm** (the main visual): 210 particles running a boids flocking algorithm on a `<canvas>` that forms the letter "K". The animation cycles through 4 phases on a frame counter:
- Phase 0 `flock` (580 frames): free boids movement, `gatherW = 0`
- Phase 1 `converge` (300 frames): ease-in-out gather toward K targets
- Phase 2 `hold` (260 frames): clamped slow speed, fully gathered
- Phase 3 `release` (180 frames): ease-in-out scatter back to flock

Each particle has a jittered target point sampled from the K letterform geometry (`buildLetterK()`). Mouse proximity repels particles within radius ~85px. The canvas pauses when the hero section leaves the viewport (`IntersectionObserver` sets `heroActive`).

## Design Tokens

All colors are CSS custom properties:
```
--bg: #0A0704        (near-black background)
--clay: #8B6840      (warm amber, primary accent)
--dust: #D8CDB8      (off-white text)
--dust-m: #7A6A58    (muted text)
```

Typography: Josefin Sans (Google Fonts), weights 100/300, heavy letter-spacing throughout.

## Navigation Links

- `/fields` — internal page not in this file
- `#about` — in-page anchor
- `mailto:hello@kurono.studio` — contact
