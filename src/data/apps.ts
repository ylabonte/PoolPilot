/**
 * The single PoolPilot app: its metadata + localized marketing copy, the
 * supported controllers, and the shared subscription model. Facts here are
 * sourced from the (private) pool-apps README — keep them truthful; do NOT
 * leak app internals or invent features.
 *
 * One app speaks to both controllers: you add a connection profile and the app
 * auto-detects whether it's a ProCon.IP or a Violet (the two expose different
 * APIs). Per-controller copy lives in `controllers`; app-wide copy in `app`.
 *
 * Parity rule: every localized field carries both `de` and `en`.
 */
import type { Lang } from '../i18n/ui';

export interface Feature {
  /** Inline SVG path data (24×24 viewBox) for the feature icon. */
  icon: string;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  /** When true, the card shows a "coming soon" pill (committed, not-yet-built). */
  comingSoon?: boolean;
  /** When true, the card shows a softer, lower-commitment "planned" pill. */
  planned?: boolean;
}

/** The one PoolPilot app. Brand accent is pool-blue (matches `--c-primary`). */
export const app = {
  name: 'PoolPilot',
  icon: '/icons/poolpilot.png',
  iosBundleId: 'cloud.labonte.PoolPilot',
  androidAppId: 'cloud.labonte.poolpilot',
  /** Brand accent pair, fed to CSS via light-dark(). */
  accent: { light: '#0277BD', dark: '#4FC3F7' },
  tagline: {
    de: 'Eine native App für deine Poolsteuerung — auf iPhone, iPad, Apple Watch und Android.',
    en: 'One native app for your pool controller — on iPhone, iPad, Apple Watch and Android.',
  } as Record<Lang, string>,
  summary: {
    de: 'PoolPilot zeigt pH, Redox und Temperatur auf einen Blick, schaltet Relais, Dosierung, Pumpe, Heizung und Licht und steuert die Poolabdeckung — direkt über dein lokales Netzwerk, ohne Cloud-Konto. Du legst ein Verbindungsprofil an, und PoolPilot erkennt automatisch, ob eine ProCon.IP oder eine Violet dahintersteckt.',
    en: 'PoolPilot shows pH, ORP and temperature at a glance, switches relays, dosing, pump, heater and light, and controls the pool cover — straight over your local network, no cloud account. You add a connection profile and PoolPilot automatically detects whether it’s a ProCon.IP or a Violet behind it.',
  } as Record<Lang, string>,
};

/**
 * Beta distribution links. iOS is live via TestFlight; Android via Google
 * Play closed testing (testers join the Google Group, opt in on the web, then
 * install). Emptying `iosTestflight` flips the iOS card back to "coming soon".
 */
export const beta = {
  googleGroup: 'https://groups.google.com/g/poolpilot-beta',
  androidOptIn: 'https://play.google.com/apps/testing/cloud.labonte.poolpilot',
  androidPlay: 'https://play.google.com/store/apps/details?id=cloud.labonte.poolpilot',
  iosTestflight: 'https://testflight.apple.com/join/JdZ4TvgS',
} as const;

export type ControllerId = 'proconip' | 'violet';

export interface Controller {
  id: ControllerId;
  /** Display name of the controller (the vendor's trademark). */
  name: string;
  /** light/dark accent pair — a per-controller tint, fed to CSS via light-dark(). */
  accent: { light: string; dark: string };
  /** One line on what PoolPilot does with this controller. */
  blurb: Record<Lang, string>;
  /** Controller-specific highlights, in addition to the shared feature set. */
  highlights: Record<Lang, string[]>;
}

/** The pool controllers PoolPilot supports (auto-detected per connection profile). */
export const controllers: Controller[] = [
  {
    id: 'proconip',
    name: 'ProCon.IP',
    accent: { light: '#0277BD', dark: '#4FC3F7' },
    blurb: {
      de: 'pH, Redox und Temperatur ablesen, Relais und Dosierkanäle schalten.',
      en: 'Read pH, ORP and temperature, switch relays and dosing channels.',
    },
    highlights: {
      de: [
        'Relais und Dosierkanäle im Auto-/Ein-/Aus-Modus schalten',
        'Manuelle Dosier-Impulse mit Sicherheitsabfrage',
        'Farbcodierte Chemie-Anzeigen (pH, Redox)',
      ],
      en: [
        'Switch relays and dosing channels Off / Auto / On',
        'Manual dosing pulses with a safety confirmation',
        'Colour-banded chemistry gauges (pH, ORP)',
      ],
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    accent: { light: '#6A4FD8', dark: '#B39DFF' },
    blurb: {
      de: 'Messwerte, Funktionen und Sollwerte in einer App: schalten und Zielwerte direkt anpassen.',
      en: 'Readings, functions and setpoints in one app: switch and adjust target values directly.',
    },
    highlights: {
      de: [
        'Funktionen im Auto-/Ein-/Aus-Modus schalten',
        'Zielwerte bearbeiten: pH, Redox, Chlor, Heizung, Solar',
        'Poolabdeckung mit Bestätigungsschritt',
        'Farbcodierte Chemie-Anzeigen (pH, Redox)',
      ],
      en: [
        'Switch functions Off / Auto / On',
        'Edit target values: pH, ORP, chlorine, heater, solar',
        'Pool cover with a confirmation step',
        'Colour-banded chemistry gauges (pH, ORP)',
      ],
    },
  },
];

/** Subscription model. Prices are placeholders, filled before go-live. */
export const pricing = {
  trialDays: 7,
  monthlyPrice: '[PRICE_MONTHLY]',
  yearlyPrice: '[PRICE_YEARLY]',
} as const;

/**
 * Shared feature set (the four-tab shape + companions). Used on the landing
 * features strip. Icons are 24×24 stroke paths.
 */
export const sharedFeatures: Feature[] = [
  {
    icon: 'M3 13h2l2 5 4-12 3 9 2-4h5',
    title: { de: 'Dashboard', en: 'Dashboard' },
    body: {
      de: 'Die wichtigsten Werte und Schalter auf den ersten Blick — sofort beim Öffnen alle deine Favoriten im Schnellzugriff.',
      en: 'The headline values and switches at a glance — immediately access all your favorites upon opening the app.',
    },
  },
  {
    icon: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3',
    title: { de: 'Messwerte', en: 'Measurements' },
    body: {
      de: 'Alle Sensoren gruppiert, mit farbcodierten Chemie-Anzeigen und individuell konfigurierbarer Sichtbarkeit.',
      en: 'Every sensor grouped, with colour-banded chemistry gauges and individually configurable visibility.',
    },
  },
  {
    icon: 'M7 8h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Zm10 4a3 3 0 1 0 0 .01',
    title: { de: 'Schalter', en: 'Switches' },
    body: {
      de: 'Relais einfach  ein-/ausschalten oder in den Auto-Modus versetzen, Dosierung starten und Pool-Abdeckung steuern — direkt aus der App.',
      en: 'Switch relays simply On/Off or set to Auto, start dosing and control the pool cover — straight from the app.',
    },
  },
  {
    icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    title: { de: 'Einstellungen', en: 'Settings' },
    body: {
      de: 'Individuelle Anordnung der Ansichten, ein-/ausblenden von Elementen, einstellbares Abfrage-Intervall — bei Violet auch Konfiguration der Zielwerte.',
      en: 'Custom arrangement of views, show/hide elements, adjustable polling interval — with Violet also configuration of setpoints.',
    },
  },
  {
    icon: 'M4 10h10a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 14 20H4a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 4 10zM6.5 6.5h9A2.5 2.5 0 0 1 18 9v8M9 16h0',
    title: { de: 'Multi-Profil-Unterstützung', en: 'Multi profile support' },
    body: {
      de: 'Einfach mehrere Verbindungsprofile anlegen, z.B. für Whirlpool, Indoor- und Outdoor-Pool — und jederzeit dazwischen wechseln.',
      en: 'Easily create multiple connection profiles, e.g. for hot tub, indoor and outdoor pool — and switch between them at any time.',
    },
  },
  {
    icon: 'M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
    title: { de: 'Lokal & direkt', en: 'Local & direct' },
    body: {
      de: 'Die App spricht direkt mit deiner Poolsteuerung im eigenen Netz. Kein Konto, keine Cloud, kein Tracking. Volle Privatspähre, volle Kontrolle.',
      en: 'The app talks straight to your pool controller on your own network. No account, no cloud, no tracking. Full privacy, full control.',
    },
  },
  {
    icon: 'M8 5h8a3.5 3.5 0 0 1 3.5 3.5v7a3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5v-7A3.5 3.5 0 0 1 8 5zM8 5l.7-3h6.6L16 5M8 19l.7 3h6.6l-.7-3M19.5 11.5h1.6M7 12.5c1.4-2 2.8-2 4.2 0 1.4 2 2.8 2 4.2 0',
    title: { de: 'Widgets & Watch', en: 'Widgets & watch' },
    body: {
      de: 'Home-Screen-Widgets und eine Glance-Ansicht auf Apple Watch und Wear OS. Außerdem Watch Komplikationen und Wear OS Tiles.',
      en: 'Home-screen widgets and a glance view on Apple Watch and Wear OS. Also Watch complications and Wear OS tiles.',
    },
  },
  {
    icon: 'M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M6 10.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM12 14a1.5 1.5 0 0 0-.8 2.8V18h1.6v-1.2A1.5 1.5 0 0 0 12 14z',
    title: { de: 'Sichere Verbindung über Home Assistant', en: 'Secure connection via Home Assistant' },
    body: {
      de: 'Über Home Assistant eine sichere Verbindung aus dem Internet zu deiner Poolsteuerung herstellen, um auch von unterwegs alle Funktionen nutzen zu können.',
      en: 'Establish a secure connection from the internet to your pool controller via Home Assistant, to be able to use all functions even on the go.',
    },
    planned: true,
  },
];
