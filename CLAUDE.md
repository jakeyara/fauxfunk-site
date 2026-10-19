# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The static website for fauxfunk.com, a band site with 4 pages (`index.html`, `gallery.html`, `media.html`, `contact.html`). It was migrated off Weebly hosting onto Cloudflare, and is deployed straight from this repo — there is no framework, no bundler, and no `package.json`. Treat every HTML file as hand-written, plain HTML/CSS/JS.

**Local location:** `~/Personal Repos/fauxfunk-site`. All of Jake's personal repos live under `~/Personal Repos/`; it moved there on 2026-10-19 from `~/fauxfunk/fauxfunk-site`, which was over-nested.

**Anything in the repo root is public by default.** `wrangler.jsonc` sets the assets directory to `./`, so every file here is served at `https://fauxfunk.com/<path>` unless `.assetsignore` excludes it — this file itself was reachable at `/CLAUDE.md` until 2026-10-19. Add any new dev-only file in the root to `.assetsignore`, which now also excludes `README.md`, `wrangler.jsonc`, `.gitignore` and `scripts/`. It filters only the upload, so the gallery-manifest build step still runs.

## Commands

- **Preview locally**: `python3 -m http.server 8934` from the repo root, then open `http://127.0.0.1:8934/`. There is no dev server or build step for the site itself.
- **Regenerate the gallery photo list**: `node scripts/generate-gallery-manifest.js` — scans `library/` for image files and rewrites `library/manifest.json`. Uses only Node's built-in `fs`/`path`, no dependencies.
- **Deploy**: push to `main` on GitHub (`jakeyara/fauxfunk-site`). Cloudflare Workers Builds is connected to the repo and runs automatically on push:
  - Build command: `node scripts/generate-gallery-manifest.js`
  - Deploy command: `npx wrangler deploy`
  These are configured in the Cloudflare dashboard (Worker → Settings → Build), not in `wrangler.jsonc`.
- There is no test suite, linter, or build to run.

## Architecture

**Three layers of CSS/JS, in order of "safe to edit":**
1. `files/main_style.css` — the site's own custom stylesheet. **This is where new styling goes.**
2. Per-page inline `<style>`/`<script>` blocks near the top/bottom of each HTML file — page-specific overrides and small features (e.g. the gallery photo rotator script in `gallery.html`, the contact form's fetch-based submit handler in `contact.html`).
3. `files/vendor/` and `files/theme/files/` — Weebly's theme framework (base CSS, jQuery, nav/lightbox JS, webfonts), vendored locally so the site has no runtime dependency on Weebly's CDN. **Avoid hand-editing these** — they're pulled-down third-party framework files, not site-specific code. `files/theme/files/plugins.js` and `custom.js` are referenced by the HTML at `files/theme/files/...` (not `files/theme/...` — that mismatch is a quirk of how the original Weebly export saved them).

**`library/` — gallery photos, auto-generated manifest:** `gallery.html` fetches `library/manifest.json` at runtime and crossfades through whatever photos it lists. The manifest is regenerated from the actual contents of `library/` by `scripts/generate-gallery-manifest.js`, which Cloudflare runs as the build step on every deploy. To add/remove/swap a gallery photo: just add or delete the image file in `library/` and push — do not hand-edit `manifest.json`, it gets overwritten on the next deploy.

**`uploads/`** contains the original Weebly-exported images (logo, hero background, etc.) still referenced by `index.html`. Not everything in this folder is used on the live pages — there's leftover unused artwork from the Weebly export.

**Contact form gotcha:** `contact.html`'s submit button is intercepted with a **`click`** listener (not a `submit` listener) that calls `e.stopPropagation()` before doing a `fetch()` POST to Formspree. This is required because the vendored `files/vendor/js/main.js` (Weebly's framework) has its own delegated click handler on `.wsite-button` elements that calls the form's native `.submit()` directly — which bypasses the `submit` event entirely. A `submit`-event-based handler will silently lose the race to that vendored handler and the form will navigate to Formspree's hosted confirmation page instead of showing the inline success message.

**Hosting:** deployed as a Cloudflare Worker using Workers Static Assets (not the classic "Pages" product — Cloudflare routes new git-connected static-site projects through Workers now). `wrangler.jsonc` configures the assets directory (repo root) and 404 handling; it deliberately does not set `html_handling`, so Cloudflare's default behavior applies — `/page.html` `307`-redirects to the extensionless `/page` URL. DNS for `fauxfunk.com` and `www.fauxfunk.com` is on Cloudflare, with both added as Custom Domains on the Worker. MX records point to Google Workspace for email — do not touch those when working with DNS.

**Contact form backend:** Formspree (`https://formspree.io/f/mbgjdlbj`), free tier.
