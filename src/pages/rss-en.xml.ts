import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('news'))
    .filter((p) => p.data.lang === 'en' && !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'PoolPilot · News',
    description: 'News and release updates about PoolPilot for ProCon.IP and Violet.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/en/news#${p.id}`,
    })),
    customData: '<language>en-US</language>',
  });
}
