# Portfolio

Static portfolio site (no build step) designed to deploy cleanly to GitHub Pages via GitHub Actions.

## Edit Content

- Home page: `public/index.html`
- Project pages:
  - `public/projects/citysort/index.html`
  - `public/projects/mobile-app/index.html`
  - `public/projects/fraud-ml/index.html`
- Styles: `public/styles.css`

Replace placeholder links (GitHub, LinkedIn, email, project repos, demos) before publishing.

## Run Locally

```bash
cd public
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy To GitHub Pages

1. Add the GitHub repo as a remote:
   ```bash
   git remote add origin https://github.com/imranow/Portfolio.git
   ```
2. Commit and push to `main`.
3. In GitHub: `Settings` -> `Pages` -> set `Build and deployment` to `GitHub Actions` (if it is not already).
4. The workflow in `.github/workflows/pages.yml` will publish the `public/` folder.

### URLs

- User site (root): create a repo named `<YOUR_USER>.github.io` and your site will be at:
  - `https://<YOUR_USER>.github.io/`
- Project site: any other repo name will publish under:
  - `https://<YOUR_USER>.github.io/<YOUR_REPO>/`

This site uses relative paths so it works in both cases.

For this repo, the deployed URL will be:
- `https://imranow.github.io/Portfolio/`
