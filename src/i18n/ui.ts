/**
 * i18n core: supported languages, localized route map, and the UI-chrome
 * string dictionary (nav / footer / buttons / shared labels).
 *
 * Page-specific marketing copy lives next to its page or in `src/data/apps.ts`;
 * long-form legal copy lives in `src/content/`. This file holds the small,
 * cross-page strings only.
 *
 * Parity rule: every key MUST exist in both `de` and `en`. German is primary.
 */

export const languages = { de: 'Deutsch', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'de';

/** Page identity → per-locale URL. Slugs are localized where it reads natural. */
export const routes = {
  home: { de: '/de/', en: '/en/' },
  support: { de: '/de/support/', en: '/en/support/' },
  news: { de: '/de/news/', en: '/en/news/' },
  privacy: { de: '/de/datenschutz/', en: '/en/privacy/' },
  terms: { de: '/de/nutzungsbedingungen/', en: '/en/terms/' },
  imprint: { de: '/de/impressum/', en: '/en/imprint/' },
  about: { de: '/de/ueber/', en: '/en/about/' },
} as const;
export type RouteKey = keyof typeof routes;

export function path(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

/** Derive the active language from a URL path (`/de/...` → 'de'). */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  if (seg === 'de' || seg === 'en') return seg;
  return defaultLang;
}

export const ui = {
  de: {
    'nav.features': 'Funktionen',
    'nav.support': 'Hilfe',
    'nav.news': 'News',
    'nav.menu': 'Menü',
    'nav.skip': 'Zum Inhalt springen',
    'lang.switch': 'Sprache wechseln',
    'lang.toEn': 'English',
    'lang.toDe': 'Deutsch',

    'badge.appStore.soon': 'Bald im App Store',
    'badge.playStore.soon': 'Bald bei Google Play',
    'badge.comingSoon': 'Demnächst',
    'badge.planned': 'Geplant',

    'footer.tagline': 'Native App für deine Poolsteuerung.',
    'footer.product': 'Produkt',
    'footer.legal': 'Rechtliches',
    'footer.support': 'Hilfe & Kontakt',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.imprint': 'Impressum',
    'footer.about': 'Über',
    'footer.issues': 'Problem melden (GitHub)',
    'footer.rss': 'RSS-Feed',
    'footer.disclaimer':
      'Unabhängiges Projekt. Nicht mit der Pool Digital GmbH verbunden, von ihr gesponsert oder unterstützt. „ProCon.IP“ und „Violet“ sind Marken ihrer jeweiligen Inhaber.',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.madeIn': 'Entwickelt in Deutschland',

    'cta.learnMore': 'Mehr erfahren',
    'cta.getHelp': 'Hilfe bekommen',
    'cta.openIssue': 'Issue öffnen',

    'common.forController': 'für',
    'common.notAffiliatedShort': 'Nicht mit Pool Digital GmbH verbunden.',
    'common.backHome': 'Zur Startseite',
  },
  en: {
    'nav.features': 'Features',
    'nav.support': 'Help',
    'nav.news': 'News',
    'nav.menu': 'Menu',
    'nav.skip': 'Skip to content',
    'lang.switch': 'Switch language',
    'lang.toEn': 'English',
    'lang.toDe': 'Deutsch',

    'badge.appStore.soon': 'Coming soon to App Store',
    'badge.playStore.soon': 'Coming soon to Google Play',
    'badge.comingSoon': 'Coming soon',
    'badge.planned': 'Planned',

    'footer.tagline': 'Native app for your pool controller.',
    'footer.product': 'Product',
    'footer.legal': 'Legal',
    'footer.support': 'Help & contact',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.imprint': 'Imprint',
    'footer.about': 'About',
    'footer.issues': 'Report a problem (GitHub)',
    'footer.rss': 'RSS feed',
    'footer.disclaimer':
      'Independent project. Not affiliated with, sponsored by, or endorsed by Pool Digital GmbH. “ProCon.IP” and “Violet” are trademarks of their respective owners.',
    'footer.rights': 'All rights reserved.',
    'footer.madeIn': 'Built in Germany',

    'cta.learnMore': 'Learn more',
    'cta.getHelp': 'Get help',
    'cta.openIssue': 'Open an issue',

    'common.forController': 'for',
    'common.notAffiliatedShort': 'Not affiliated with Pool Digital GmbH.',
    'common.backHome': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)['de'];

/** Translator bound to a language, with a safe fallback to the key itself. */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}
