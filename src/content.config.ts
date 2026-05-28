import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * News / release announcements. One file per language; the `lang` field routes
 * each post to the right locale page + RSS feed. This is the "notify me"
 * mechanism (RSS) — there is intentionally no email capture anywhere.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['de', 'en']),
    summary: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { news };
