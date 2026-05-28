/**
 * Site-wide constants. Change the repo name / contact here in ONE place.
 *
 * Placeholders marked `[...]` or `PLACEHOLDER_*` MUST be filled before go-live
 * (see README "Before going live"). Never invent a real address/email/price.
 */

export const site = {
  name: 'PoolPilot',
  domain: 'poolpilot.eu',
  url: 'https://poolpilot.eu',

  githubUser: 'ylabonte',
  repoSlug: 'ylabonte/PoolPilot',

  get repoUrl() {
    return `https://github.com/${this.repoSlug}`;
  },
  get issuesUrl() {
    return `https://github.com/${this.repoSlug}/issues`;
  },
  get newIssueUrl() {
    return `https://github.com/${this.repoSlug}/issues/new/choose`;
  },

  // Support contact — fill before go-live. Used in mailto links + Impressum.
  supportEmail: 'yannic.labonte@gmail.com',

  // §5 DDG Impressum operator — fill before go-live.
  operator: {
    name: 'Yannic Labonte',
    address: 'Webergasse 3, 40668 Meerbusch, Deutschland',
    email: 'yannic.labonte@gmail.com',
  },

  copyrightYear: 2026,
  copyrightHolder: 'Yannic Labonte',
} as const;
