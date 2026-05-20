# KURONO — Visual Style Reference

> Use this document as a design system reference to build a new site in the KURONO visual language.
> It describes the aesthetic, palette, typography, layout patterns, animation behavior, and interactive details
> without prescribing any specific tech stack.

---

## Aesthetic Intent

Slow, deliberate, warm-dark studio identity. Everything should feel like it was made carefully over time:
heavy letter-spacing, minimal copy, muted amber-on-near-black, unhurried animations with smooth easing.
The overall impression is editorial restraint — not cold minimalism, but warm quietude.

---

## Color Palette

All values are CSS custom properties. Use them consistently.

| Token       | Hex / Value                  | Role                                  |
|-------------|------------------------------|---------------------------------------|
| `--bg`      | `#0A0704`                    | Page background (near-black, warm)    |
| `--bg2`     | `#100D09`                    | Slightly lifted background for sections |
| `--clay`    | `#8B6840`                    | Primary accent — amber/terracotta     |
| `--clay-l`  | `#A8845A`                    | Light amber — cursor dot, hover text  |
| `--clay-ll` | `#C4A07A`                    | Lightest amber — focus/hover states   |
| `--dust`    | `#D8CDB8`                    | Primary text — warm off-white         |
| `--dust-m`  | `#7A6A58`                    | Muted text — nav links, labels        |
| `--dust-d`  | `#3E3228`                    | Faintest text — footer, corner labels |
| `--rule`    | `rgba(139,104,64,0.16)`      | Subtle horizontal rules / borders     |
| `--rule2`   | `rgba(139,104,64,0.08)`      | Even subtler rule — nav bottom border |

**Do not use pure white or pure black anywhere.** Everything is slightly warm.

---

## Typography

**Font:** [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) — weights 100 (thin), 300 (light), 400 (regular). Load italics for weights 100 and 300.

```
font-family: 'Josefin Sans', sans-serif;
```

**Rules:**
- Letter-spacing is aggressive throughout — this defines the voice. Never let text feel tight.
- Headings and labels: uppercase with `letter-spacing: .22em–.32em`
- Body copy: `font-weight: 300`, `line-height: 2`, `letter-spacing: .02em`
- Italic is used sparingly for mood — taglines, subheadings, pull quotes
- `font-size` uses `clamp()` for fluid scaling between mobile and desktop

**Type scale examples:**

| Element           | Size                       | Weight | Tracking  | Case       |
|-------------------|----------------------------|--------|-----------|------------|
| Nav logo          | 14px                       | 300    | `.32em`   | Uppercase  |
| Nav links         | 10px                       | 400    | `.22em`   | Uppercase  |
| Section label/tag | 9px                        | 400    | `.26em`   | Uppercase  |
| Hero name         | `clamp(13px, 1.3vw, 16px)` | 100    | `.88em`   | Uppercase  |
| Body paragraph    | `clamp(14px, 1.3vw, 17px)` | 300    | `.02em`   | Normal     |
| Large heading     | `clamp(28px, 3.6vw, 46px)` | 300    | `-.01em`  | Normal     |
| Footer wordmark   | 13px                       | 300    | `.28em`   | Uppercase  |
| Footer links      | 9px                        | 400    | `.20em`   | Uppercase  |
| Footer tagline    | 12px                       | italic | —         | Normal     |

---

## Layout

- **Max content width:** 860px, centered with `margin: 0 auto`
- **Horizontal padding:** 52px desktop / 22px mobile
- **Section vertical padding:** `112px top / 120px bottom`
- **Grid in About section:** `1fr 1.8fr` two-column, `88px` gap — logo on left, text on right

The layout is sparse. Generous white (dark) space between sections is intentional.

---

## Surface Texture

A subtle SVG fractal noise overlay sits on top of the entire page at `opacity: 0.038`. This gives the background a slight film-grain quality that prevents it from feeling flat on screen.

```
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,<SVG fractalNoise filter>");
  opacity: .038;
  pointer-events: none;
  z-index: 9997;
}
```

Use a fractal noise SVG filter with `baseFrequency="0.68"` and `numOctaves="4"`.

---

## Navigation

- Fixed top bar, full-width, `height: 56px`, `padding: 0 52px`
- Initially transparent — no background
- Becomes frosted on scroll: `background: rgba(10,7,4,.92)` + `backdrop-filter: blur(14px)` + subtle bottom border (`--rule2`)
- Transition: `background 0.5s` ease
- Logo left, links right — `display: flex; justify-content: space-between`
- Logo opacity resting at `.55`, rises to `1` on hover

---

## Hero Section

Full-viewport (`100vw × 100vh`), centered content, dark background.

**Layers (back to front):**
1. **Canvas** (`z-index: 1`) — animated particle swarm (see Particle System below)
2. **Vignette** (`z-index: 2`) — radial gradient: `transparent 18%` → `rgba(10,7,4,.58) 100%`, ellipse 72%×72%
3. **Hero text group** (`z-index: 3`) — logo image + studio name, centered, pointer-events none
4. **Corner labels** (`z-index: 3`) — bottom-left "Est. 2022", bottom-right "Barcelona · 41°N"
5. **Scroll whisker** (`z-index: 3`) — centered bottom, animated vertical line

**Logo image:** `mix-blend-mode: screen` — this makes the black background of the PNG invisible, leaving only the mark floating over the canvas.

**Hero entrance animations:**
- Logo: `fadeIn 2.2s` at `0.2s` delay
- Studio name: `fadeUp 1.8s` at `0.4s` delay (slides up 12px + fades in)
- Scroll whisker: `fadeIn 1s` at `2s` delay
- Corner labels: `fadeIn 1s` at `2.2s` delay

All use `cubic-bezier(.22, 1, .36, 1)` — a fast-out, slow-settle curve.

**Scroll whisker:**
- 1px wide, 48px tall line; `linear-gradient(to bottom, --clay, transparent)`
- Animates with `drip` keyframe: height pulses between 48px–72px, opacity between .4–.75, period 2.4s

---

## Particle System (Swarm)

The centerpiece: 210 particles running a boids flocking algorithm that forms the letter **K**.

**Behavior cycle (repeats forever):**

| Phase | Name      | Duration   | Behavior                                         |
|-------|-----------|------------|--------------------------------------------------|
| 0     | Flock     | 580 frames | Free boids movement, `gatherW = 0`               |
| 1     | Converge  | 300 frames | Ease-in-out attraction toward K targets          |
| 2     | Hold      | 260 frames | Fully formed K, particles barely move            |
| 3     | Release   | 180 frames | Ease-in-out scatter back to flocking             |

**Forces per particle (each frame):**
- **Separation**: repel from particles within 22px radius
- **Alignment**: match velocity of neighbors within 52px
- **Cohesion**: drift toward center-of-mass of neighbors
- **Target pull**: toward assigned K-letterform point (strength = `gatherW × 0.0028`)
- **Mouse repulsion**: strong repel within ~85px radius when cursor is over hero

**Rendering:**
- Background fill each frame: `rgba(10,7,4, 0.13)` — creates motion blur trail effect
- Particle: circle, radius ~1.1–2px, color `rgba(222,210,190, opacity)` — warm off-white
- Particle opacity: base `.28–.72`, brightened by `+gatherW × 0.2` during convergence
- Canvas pauses (stops animating) when hero section leaves viewport

**Letter K geometry:**
- 22 points along a vertical spine (left column of K)
- 15 points for the upper diagonal arm
- 15 points for the lower diagonal arm
- Each particle gets a jitter offset (±12px) on its assigned target

---

## Custom Cursor

The native cursor is hidden (`cursor: none` on `body`).

A custom `#cur` element (7px circle, `--clay-l` fill) follows the cursor with smooth lag:
```
cx += (mx - cx) * 0.13   // lerp at 13% per frame
cy += (my - cy) * 0.13
```

On hover over any `<a>` tag:
- Expands to 44×44px
- Background becomes transparent
- Border: `1px solid --clay`
- Opacity: 0.5
- Transition: `width/height 0.45s cubic-bezier(.34, 1.56, .64, 1)` — spring overshoot

---

## Section Transitions (Scroll Reveal)

Sections start invisible (`opacity: 0; transform: translateY(18px)`) and transition in when 7% visible:
```
transition: opacity .95s, transform .95s
```
No special easing on reveal — linear by default. Triggered by `IntersectionObserver` adding `.show` class.

For list items (fields): staggered delays `0.04s, 0.12s, 0.20s, 0.28s, 0.36s`.

---

## Hover Interactions

**Nav links:** `color: --dust-m` → `color: --dust`

**CTA link ("Make contact →"):**
- Resting: `color: --dust-m`, border bottom in `--rule`, `gap: 14px`
- Hover: `color: --clay-ll`, border in `--clay`, `gap: 22px` (arrow slides right)
- Transition: `.3s` for color/border, `.38s` for gap

**Fields list row:**
- Left accent bar (1.5px, `--clay`): `scaleY(0)` → `scaleY(1)` from bottom on hover
- Row background: subtle amber tint `rgba(139,104,64,0.04)`
- Field name: color shift to `--clay-ll`, letter-spacing opens slightly
- Hint text (right): slides in from `translateX(8px)`, fades in

---

## Footer

Three-column flex row: wordmark (left) | links (center) | tagline (right).

- `border-top: 1px solid --rule`
- `padding: 44px 52px`
- Tagline: italic, `color: --dust-d`, `opacity: .35`

On mobile: stacks vertically, centered.

---

## Responsive Breakpoint (`max-width: 720px`)

- Nav padding: `22px`
- Nav links: all hidden except last
- Corner labels and whisker label: hidden
- About section: single-column, reduced padding and gap
- Footer: stacked vertically
- Fields hint text: hidden

---

## Assets

| File                  | Usage                                                      |
|-----------------------|------------------------------------------------------------|
| `assets/icon.png`     | Favicon (2050×2048 RGB)                                    |
| `assets/logo_no_bg.png` | KURONO sigil, transparent background, used in hero + about — always with `mix-blend-mode: screen` |

The logo is a stylized circular mark. On dark backgrounds with `mix-blend-mode: screen`, only the bright parts of the mark are visible — the black areas disappear into the background.

---

## What Makes This Style Feel Right

- **Patience**: nothing happens fast. Animations are long. Delays stack.
- **Warmth through restraint**: the palette is dark but amber-tinted, never cold gray.
- **Micro letter-spacing**: almost everything is spaced wide. Tight tracking feels wrong here.
- **Thinness**: weight 100 and 300 dominate. Bold text would break the mood.
- **Noise + motion blur**: the grain texture and trailing canvas blur give the digital screen a material quality.
- **Sparse copy**: every word should feel considered. Short sentences, no padding language.
