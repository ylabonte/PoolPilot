# PoolPilot website — plan & status

Handoff doc for a future session picking up this repo. Architecture lives in
[`CLAUDE.md`](../CLAUDE.md); the go-live placeholder checklist lives in
[`README.md`](../README.md). This file captures *why*, *what's decided*, and
*what's left*.

## Context

The PoolPilot app — **one** app for both ProCon.IP and Violet controllers (it
auto-detects the device type per connection profile), on iOS + Android — is about
to be submitted to the App Store and Play Store. Both stores require a reachable **Privacy Policy**
and **Support** URL; as a solo German publisher the owner also needs a legally
mandated **Impressum** and a DSGVO **Datenschutzerklärung**. This repo is that
public home — a small, fast, bilingual (DE + EN) static site. The **app source
stays in a separate private repo** (`pool-apps`); this repo is public so Pages
builds on free Actions minutes and its **Issues** double as the support channel.

## Decisions (locked with the owner)

| Topic | Decision |
|---|---|
| Repo | Public `ylabonte/PoolPilot`; app source stays private elsewhere. |
| Hosting | GitHub Pages from this repo via Actions (`.github/workflows/deploy.yml`). |
| Domain | `poolpilot.eu` (apex → A/AAAA to GitHub Pages; `public/CNAME` pins it). |
| Tooling | Astro + TypeScript, built-in i18n (`/de`, `/en`, `/` splash). |
| Scope (v1) | Landing (one app + both controllers in a section) · Support/FAQ · Privacy · Terms · Imprint · About · News+RSS · 404. |
| Analytics | **Zero tracking** — no cookies/analytics, self-hosted fonts, no consent banner. |
| Voice | Plainspoken, honest. **Never market "privacy" as a feature** ("no accounts, no ads, no tracking — we just don't exploit your data"). |
| App status | Not yet submitted → "Coming soon" store badges; RSS for news; **no email capture**. |
| App model | **One** app, `app` + `controllers` in `src/data/apps.ts`; device type auto-detected per connection profile. No separate per-controller pages. |
| Pricing | Full subscription disclosure block (trial → monthly+yearly, auto-renew, manage path); prices are placeholders. |
| Disclaimer | Pool Digital non-affiliation in the footer (every page) + fuller text on About. |
| Legal data | `[NAME]/[ADDRESS]/[EMAIL]` placeholders, owner fills before go-live. |

## Status — 2026-05-29

**Single-app refactor (2026-05-29):** the site originally marketed two separate
apps (one per controller). Collapsed into **one** PoolPilot app that supports both
controllers per connection profile:

- Removed the `/proconip` + `/violet` pages (both locales) and the `AppCard` /
  `AppPageBody` components; controllers now render as a section on the home page via
  the new `ControllerCard`. Data model is `app` + `controllers` in `src/data/apps.ts`.
- Real store identity wired: iOS `cloud.labonte.PoolPilot`, Android `cloud.labonte.poolpilot`.
- New app icon composed from owner-provided layers (`public/icons/poolpilot-fg.png`
  + `poolpilot-bg.png` → `poolpilot.png`, `favicon.png`, `apple-touch-icon.png`);
  favicon repointed off `favicon.svg`.
- Copy swept to single-app framing across landing, FAQ, About, Terms, news (DE+EN).

**Prior baseline (earlier session):** built, verified, committed locally on `main`
(not yet pushed) — per-locale RSS + sitemap, Lighthouse 100 a11y/SEO/best-practices,
zero third-party requests, bilingual issue templates, deploy workflow, `CNAME`, robots
all in place. (Re-verify `npm run build` + a Lighthouse pass after this refactor.)

## To launch (owner action)

1. Repo `ylabonte/PoolPilot` exists (public). Push `main`.
2. Pages source → **GitHub Actions** (`gh api -X POST repos/ylabonte/PoolPilot/pages -f build_type=workflow`, or Settings → Pages).
3. DNS (apex `poolpilot.eu`): A → `185.199.108–111.153`, AAAA → `2606:50c0:8000–8003::153`;
   set custom domain `poolpilot.eu` + Enforce HTTPS. *(optional `www` → CNAME `ylabonte.github.io`.)*
4. Remaining placeholders (see README "Before going live"): operator identity +
   support email are **filled** (Yannic Labonte, Meerbusch). Still open: **USt-IdNr.**
   (Kleinunternehmer, ID requested, not yet issued → add a § 27a UStG line when it
   arrives) and **pricing** (deferred while in Beta).

## Remaining / future (out of v1 scope)

- Real **screenshots** (wire via `ScreenshotFrame` `src=`) + an OG image at `public/og/default.png`.
- **Pro tier + prices**: deferred while in Beta. The site now says "free during the beta,
  Pro later"; re-wire `PricingBlock` + `pricing` once tiering and prices are decided.
- **USt-IdNr.** added to the Impressum once issued.
- **Legal review** of Impressum / Datenschutz / Terms (draft, not legal advice).
- "Full" scope extras if wanted later: setup/troubleshooting guide, press kit, changelog blog.
- In **pool-apps** (separate repo): wire Fastlane store privacy/support URLs to
  `poolpilot.eu` once the apps are submitted (deferred to avoid stepping
  on concurrent work on that repo's `main`).
