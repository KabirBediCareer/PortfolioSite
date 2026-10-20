# Kaci Bedi — portfolio

Personal site at [kacibedi.com](https://kacibedi.com). React + TypeScript + Tailwind, with an ASCII fluid simulation drawn on a canvas.

## Edit the content

All copy lives in one file: `client/src/data/content.ts`. Change text there; nothing else needs touching for a wording update.

- `identity` — name, headline, summary, quote, contact details
- `experience`, `projects`, `creative` — the cards in each section, newest first
- `capabilities` — the "What I can do for you" panel

## Run locally

```bash
npm install
npx vite --config vite.config.github.ts
```

## Build and deploy

```bash
npm run build:pages
```

That writes the static site to `docs/` (including `CNAME` and `.nojekyll`). Commit `docs/` and push to `main`.

Two ways to serve it, pick one in GitHub → Settings → Pages:

1. **Deploy from a branch**: branch `main`, folder `/docs`. No Actions needed. This is the simplest.
2. **GitHub Actions**: the workflow in `.github/workflows/deploy.yml` builds `docs/` on every push and deploys it. Pushing changes to the workflow file needs a token with the `workflow` scope; if a push is rejected for that reason, delete the `.github` folder and use option 1.

## Structure

- `client/src/pages/home.tsx` — landing page and routing between sections (sections live in the URL hash, so `#experience` links and the browser back button work)
- `client/src/components/SectionView.tsx` — the horizontal timeline viewer (vertical list on phones), keyboard arrows and Escape
- `client/src/components/FluidCanvas.tsx` — the water
- `client/src/data/content.ts` — all text
