// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';

export default defineConfig({
  site: 'https://quidproquo.cc',
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [
    mdx(),
    sitemap(),
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { execSync } = await import('child_process');
          execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
        },
      },
    },
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});
