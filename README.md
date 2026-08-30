# Faux Funk

Website for Faux Funk — https://fauxfunk.com

A plain static site (HTML/CSS/JS, no framework or build tooling), deployed to Cloudflare and served from this repo. Migrated off Weebly hosting in 2026.

## Pages

- `index.html` — Home
- `gallery.html` — Photo gallery (rotating slideshow, see below)
- `media.html` — Music links
- `contact.html` — Contact form (via Formspree)

## Local preview

No build step — just serve the folder:

```
python3 -m http.server 8934
```

Then open `http://127.0.0.1:8934/`.

## Deployment

Hosted on Cloudflare as a Worker (Workers Static Assets). Pushing to `main` on GitHub triggers an automatic build and deploy — there's no manual deploy step. Live at [fauxfunk.com](https://fauxfunk.com) and [www.fauxfunk.com](https://www.fauxfunk.com).

## Updating the photo gallery

Gallery photos live in `library/`. To add, remove, or swap a photo:

1. Add or delete the image file in `library/`.
2. Commit and push.

That's it — `library/manifest.json` (the list the gallery page reads) is regenerated automatically from whatever's in the folder as part of the deploy. You don't need to edit it by hand.

## Project structure

- `files/main_style.css` — the site's own stylesheet
- `files/vendor/`, `files/theme/` — vendored CSS/JS/fonts from the original Weebly theme, kept locally so the site doesn't depend on Weebly's infrastructure
- `uploads/` — images carried over from the Weebly export
- `library/` — gallery photos + auto-generated manifest
- `scripts/` — build-time script that generates the gallery manifest
- `wrangler.jsonc` — Cloudflare Worker configuration

## Contact form

Submissions go through [Formspree](https://formspree.io). To change where they're delivered, update the form action in `contact.html` with a new Formspree form ID.
