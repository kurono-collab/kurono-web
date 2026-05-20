# kurono-web

Monorepo for KURONO web projects.

## Sites

| Directory     | Domain         | Description                              |
|---------------|----------------|------------------------------------------|
| `kurono-org/` | kurono.org     | Main studio site — warm-dark, particle K |
| `cruzar-ia/`  | cruzar.ia      | (in development)                         |

## Running locally

Each site is plain static — no build step required.

```bash
cd kurono-org
python3 -m http.server
# open http://localhost:8000
```

ES module imports require a server (not `file://`).

## Deployment

Each site deploys independently. A GitHub Actions workflow per site is needed to deploy from its subdirectory to GitHub Pages (or any static host).
