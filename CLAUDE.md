# CLAUDE.md

Cristian Valencia's personal site, published with GitHub Pages at https://cristianvalencia.github.io.

## Read first

- `BRIEF.md` — audience, positioning, sitemap, and page copy. Content decisions live there; update it when they change.
- `IDEAS.md` and `inspiration/` — Cristian's raw ideas and reference images. Fold settled ones into BRIEF.md.
- Claude Design canvas (homepage + foundations): https://claude.ai/artifact/5kQ4AgtqML7NPQsWAt1JKh

## Stack

- Jekyll via the `github-pages` gem (Jekyll 3.x, GitHub's plugin allowlist only). Ruby 3.2.2.
- No theme. Layouts: `_layouts/default.html` (frame), `page.html`, `post.html`; header and footer in `_includes/`.
- Styles: one file, `assets/css/main.css`; design tokens are the custom properties at its top. Footer tap-to-cycle: `assets/js/footer.js`.
- Homepage: `index.html` (bento grid). Nav items and Instagram handles live in `_config.yml` (`nav`, `instagram_accounts`).
- Photos go through `exiftool -all= --icc_profile:all` (strip GPS/camera data) and get resized before they're added.
- Run locally: `bundle exec jekyll serve` → http://localhost:4000. Restart after editing `_config.yml`.
- Deploys automatically from `main`. Do feature work on a branch.

## Design and code rules

- The design comes from Claude Design. Match its tokens; don't invent new colors, sizes, or spacing.
- Design tokens are CSS custom properties on `:root`, with dark mode under `prefers-color-scheme`.
- Plain CSS (custom properties, `clamp()`, grid, container queries). No CSS framework, and JavaScript only where it's needed.
- Mobile first. Check every page at 375px and at desktop width in the browser pane before calling it done.
- Semantic HTML and WCAG 2.1 AA: contrast, visible focus states, alt text, one `h1` per page.
- Images: AVIF/WebP, explicit `width`/`height`, `loading="lazy"` below the fold.
- Copy is short, concrete, and outcome-focused (see BRIEF.md §3, tone of voice).
- Don't use gendered pronouns for Cristian in site copy; write in first person ("I") or use the name.
