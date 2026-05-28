# PoolPilot — website

Public marketing, support and legal website for **PoolPilot** — one native iOS &
Android app for the **ProCon.IP** and **Violet** pool controllers (the app
auto-detects the controller type per connection profile).

🌐 Live at **https://poolpilot.eu**

This repo is intentionally **public** so that it can:

- be served by **GitHub Pages** on free Actions minutes, and
- double as the **support channel** via GitHub **Issues**.

> The app itself lives in a separate **private** repository. Nothing in this
> repo is sensitive — but because Issues here are public, never paste controller
> credentials, IP addresses or secrets into an issue.

> Independent project. Not affiliated with, sponsored by, or endorsed by Pool
> Digital GmbH. "ProCon.IP" and "Violet" are trademarks of their respective owners.

## Stack

Static site built with **Astro** (TypeScript). Bilingual **German + English** via
Astro's built-in i18n (`/de/…`, `/en/…`, with a `/` language splash). Self-hosted
fonts (Bricolage Grotesque + Hanken Grotesk via `@fontsource`), **zero tracking**,
no cookies, no third-party requests. Dark mode via CSS `light-dark()`.

## Commands

Package manager: **pnpm** (pinned via the `packageManager` field; Corepack picks it up).

| Command          | Action                                       |
| :--------------- | :------------------------------------------- |
| `pnpm install`   | Install dependencies                         |
| `pnpm dev`       | Dev server at `localhost:4321`               |
| `pnpm build`     | Build static site to `./dist/`               |
| `pnpm preview`   | Preview the production build locally         |

## Structure

```
src/
  data/         site.ts (constants) · apps.ts (app + supported controllers + pricing model)
  i18n/         ui.ts (languages, localized routes, string dictionary)
  layouts/      BaseLayout.astro (head/SEO/hreflang + header/footer)
  components/   Header, Footer, LangToggle, Logo, ControllerCard, FeatureStrip,
                StoreBadge, ScreenshotFrame, PricingBlock, Disclaimer,
                LandingBody, SupportBody, NewsBody, LegalPage
  content/news/ Markdown posts (one per language) → RSS
  pages/        / (splash) · de/* · en/* · 404 · rss-de.xml · rss-en.xml
public/         CNAME, favicon.png + apple-touch-icon.png, robots.txt, icons/
.github/        ISSUE_TEMPLATE/* (bilingual) · workflows/deploy.yml
```

Add a news post by dropping a Markdown file in `src/content/news/` with
frontmatter `{ title, date, lang: de|en, summary }`.

## Deployment

`/.github/workflows/deploy.yml` builds the site and deploys to GitHub Pages on
every push to `main`. In **Settings → Pages**, set the source to **GitHub Actions**.

## DNS (domain `poolpilot.eu`)

`poolpilot.eu` is an **apex** domain, so it uses **A/AAAA** records (apex can't be a CNAME). The
`public/CNAME` file pins `poolpilot.eu`; at the registrar add GitHub Pages' IPs:

1. **A records** (`poolpilot.eu`) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`.
2. **AAAA records** (`poolpilot.eu`) → `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`.
3. *(optional)* **`www.poolpilot.eu`** → `CNAME` to `ylabonte.github.io`.

Then **Settings → Pages**: set the custom domain to `poolpilot.eu`, wait for the DNS check, and
enable **Enforce HTTPS**.

## ✅ Before going live

Operator identity (Impressum/Datenschutz name, address, contact email) and the
support email are **filled** — Yannic Labonte, Webergasse 3, 40668 Meerbusch.
Still open:

- **USt-IdNr. (VAT ID)** — Kleinunternehmer, ID requested but not yet issued. When
  it arrives, add a "USt-IdNr. nach § 27a UStG" line to the Impressum
  (`src/pages/{de,en}/{impressum,imprint}.astro`).
- **Pricing / Pro** — deferred while in Beta. `pricing` in `src/data/apps.ts` still
  holds `[PRICE_MONTHLY]` / `[PRICE_YEARLY]` placeholders (currently unused — the
  `PricingBlock` shows a "free during the beta, Pro later" message instead). Re-wire
  once the Pro tier + prices are decided in App Store Connect / Play Console.
- **`repoSlug`** in `src/data/site.ts` — if you rename this repo.
- Drop real **screenshots** into `public/` and wire them via `ScreenshotFrame`'s
  `src` prop; add an Open Graph image at `public/og/default.png`.

Any remaining `[...]` placeholders render with a **highlighted warning style** on the
page so they can't ship unnoticed.

> ⚠️ The legal pages (Impressum, Datenschutz/Privacy, Nutzungsbedingungen/Terms)
> are a careful **draft, not legal advice**. Have them reviewed (a lawyer or an
> e-recht24-style generator) before publishing.
