import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('news'))
    .filter((p) => p.data.lang === 'de' && !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'PoolPilot · News',
    description: 'Neuigkeiten und Release-Updates rund um PoolPilot für ProCon.IP und Violet.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/de/news#${p.id}`,
    })),
    customData: '<language>de-DE</language>',
  });
}
