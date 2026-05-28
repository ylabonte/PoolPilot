# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

> **Picking this up?** Read [`docs/PLAN.md`](docs/PLAN.md) for context, locked decisions,
> current status, and the remaining go-live / follow-up steps.

## What this repo is

The **public** marketing + support + legal website for **PoolPilot** — **one** native iOS & Android
app for the **ProCon.IP** and **Violet** pool controllers (it auto-detects the controller type per
connection profile, since the two expose different APIs). It is a static **Astro** site, bilingual
(German + English), served by **GitHub Pages** at `https://poolpilot.labonte.cloud`.

The repo is deliberately public for two reasons: GitHub Pages builds on free Actions minutes, and
the repo's **Issues** double as the support channel. The **app source lives in a separate private
repo** (`pool-apps`) — it is never mirrored here.

> **This repo is PUBLIC and its Issues are public.** Never commit secrets (RevenueCat keys, signing
> material, controller credentials) and never paste credentials or IP addresses into issues. Only
> the *app* source is sensitive; the website source is not.

We are **not** affiliated with Pool Digital GmbH (the controllers' vendor). Keep that disclaimer in
the footer + About page. Identifiers in the wider project live under `cloud.labonte.pool.*` — never
use `pooldigital` anywhere code-facing. "ProCon.IP" and "Violet" are the vendor's trademarks; name
them only to describe compatibility.

## Stack & commands

Astro (TypeScript) · built-in i18n · `@fontsource` self-hosted fonts · `@astrojs/rss` + `@astrojs/sitemap`.
Package manager: **pnpm** (pinned in `packageManager`; CI uses `pnpm/action-setup`).

```bash
pnpm install        # deps
pnpm dev            # dev server at localhost:4321
pnpm build          # static build → ./dist
pnpm preview        # serve the production build
```

Node ≥ 22.12. CI builds on Node 22.

`sharp` and `esbuild` postinstall scripts are allowlisted in `package.json` under
`pnpm.onlyBuiltDependencies` (pnpm 10 blocks postinstalls by default). If you add a
dependency whose install script is genuinely required, extend that list.

## Architecture you can't see from one file

- **i18n** (`src/i18n/ui.ts`) is the single source for: supported `languages`, the localized
  `routes` map (page key → per-locale URL, e.g. `privacy → /de/datenschutz` vs `/en/privacy`), and
  the UI-chrome string dictionary. Use `path(key, lang)` for links and `useTranslations(lang)` for
  chrome strings so nothing hardcodes a URL. Legal slugs are localized; footer link **text** always
  uses the native term ("Impressum", "Datenschutzerklärung").
- **Routing**: both locales are prefixed (`/de`, `/en`); `/` is a client-side language splash
  (`src/pages/index.astro`) that suggests via `navigator.language` and degrades to links +
  meta-refresh without JS. Never turn it into a forced redirect trap.
- **Shared bodies**: page content lives in `*Body.astro` / `LegalPage` components so each locale page
  is a thin wrapper passing `lang`. The home page is the whole app showcase (`LandingBody`): hero →
  supported controllers (`ControllerCard` per device) → features → screenshots → pricing → help.
  There are **no per-controller pages** — the controllers are a section, not separate apps. Add a
  page → add the route to `i18n/ui.ts`, add both `de/` and `en/` files, link it in `Footer.astro`.
- **Theme** (`src/styles/theme.css`): one set of tokens using CSS `light-dark()` drives both color
  schemes — no JS, no flash. The **brand accent is pool-blue site-wide** (`--c-primary`). The
  per-controller accents (ProCon.IP = blue, Violet = violet) survive only as **tints inside
  `ControllerCard`**, injected inline (`--accent: light-dark(blue, …)`) — not as a second brand.
- **Constants** (`src/data/site.ts`): repo slug, support email, Impressum operator, copyright — one
  place to change. **App facts** (`src/data/apps.ts`): the single `app` (one bundle ID per store,
  brand accent, tagline/summary), the supported `controllers` (per-device tint + highlights), the
  shared feature set, and the subscription model.
- **News → RSS**: drop a Markdown file in `src/content/news/` (`{title, date, lang, summary}`); it
  flows into `/de/news` or `/en/news` and the matching `/rss-{lang}.xml`. This is the only
  "notify me" mechanism — **there is intentionally no email/newsletter capture anywhere.**

## Hard guardrails (carried from the project)

- **DE/EN parity.** Every user-facing string ships in both languages. When you touch one locale,
  update the other in the same change. German is the primary/default locale.
- **Accessibility (WCAG 2.1 AA).** Text contrast ≥ 4.5:1 (≥ 3:1 large/UI) in **both** light and dark
  — check the faint tokens (`--ink-faint`/`--ink-soft`) against their real backgrounds before using
  them. Keep a visible `:focus-visible` outline on every interactive element; never suppress it, and
  watch for `overflow:hidden` ancestors clipping it (use an inset outline there). The splash
  (`pages/index.astro`) and `404.astro` don't load `theme.css`, so they need their own focus styles.
  One `<h1>` per page with ordered headings; images carry meaningful `alt` (or `alt=""` if
  decorative) and icon-only controls an `aria-label`; decorative SVG/animation stays `aria-hidden`
  and behind the `prefers-reduced-motion` guard. Never convey state by colour alone.
- **Zero tracking.** No analytics, no cookies, no third-party network requests, fonts stay
  self-hosted. This keeps the privacy story true and avoids a consent banner. Don't add a CDN font,
  pixel, or analytics snippet without an explicit decision (it would force a Datenschutz rewrite).
- **Voice: honest, not privacy-washed.** Plainspoken and direct. Do **not** market "privacy" as a
  feature — the honest framing is "no accounts, no ads, no tracking — we just don't exploit your data."
- **Don't invent legal/pricing facts.** Placeholders (`[NAME]`, `[ADDRESS]`, `[EMAIL]`,
  `PLACEHOLDER_SUPPORT_EMAIL`, `[PRICE_*]`) are filled by the owner before go-live; they render with a
  highlighted warning style so they can't ship unnoticed. Legal pages are a **draft, not legal advice.**
- **Subscription disclosure** in the home pricing block (`PricingBlock`) must stay
  App-Review-compliant (trial length, price, auto-renewal, manage/cancel path) — keep it in sync with
  what the app actually offers.

## GitHub Actions workflow files — `Bash` heredoc, not Write

A global `PreToolUse` hook may block the `Write`/`Edit` tools on `.github/workflows/*.yml`
(workflow-injection policy). Create or edit workflow files with `Bash` + a heredoc
(`cat > .github/workflows/x.yml <<'EOF' … EOF`). Issue-template YAML (`.github/ISSUE_TEMPLATE/*`)
is not a workflow and is unaffected.

## Working preferences

- **Tone:** friendly and explanatory, "smart colleague at a whiteboard" — enough words to understand,
  no walls of text. Use text emoticons (not emoji) to express tone, and *vary them* / be creative —
  e.g. `^^`, `(◕‿◕)`, `¯\_(ツ)_/¯`, `ʕ•ᴥ•ʔ`, `\(^o^)/`, `(☞ﾟヮﾟ)☞`, `ಠ_ಠ`. Not a corporate-doc tone.
- **Maintain a visible task list** (`TaskCreate`/`TaskUpdate`) for multi-step work; mark items
  `in_progress`/`completed` as you go, don't batch updates.
- **Conventional Commits**: `<type>(<scope>): <subject>`, type ∈
  `feat|fix|chore|docs|refactor|test|build|ci|perf|style|revert`. Imperative mood; body explains *why*.
  One logical concern per commit — never lump unrelated changes together.
- **Ask before shared-state actions.** Confirm (with explicit options) before creating a commit
  (show the message + file list), pushing (show remote/branch), or creating/merging a PR. One extra
  confirmation is cheaper than an unwanted push.
- **Batch pushes.** Land related commits locally, push the whole reviewable unit once. Standalone
  fixes can push immediately.
- **Tend to this file.** When you learn a non-obvious gotcha or pattern future-you would want, propose
  adding it here — ask first with the exact wording; keep edits surgical and on-tone.
- **Verify before claiming done.** `npm run build` must pass; spot-check both locales and the language
  toggle before saying it works.
