# KURONO

Website for KURONO studio — things made slowly, across disciplines.

## Structure

```
index.html       — entry point
css/main.css     — all styles (design tokens, layout, animations)
js/cursor.js     — custom cursor with smooth lag and hover states
js/swarm.js      — canvas boids particle system forming the letter K
js/main.js       — entry point: nav scroll, reveal observer, imports
```

## Running locally

Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

ES module imports require a server (not `file://`) when testing locally.
