// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';

// Rehype plugin: add loading="lazy" to all img elements
function rehypeLazyImages() {
  return function(tree) {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties ??= {};
        if (!node.properties.loading) {
          node.properties.loading = 'lazy';
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://quidproquo.cc',
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true }, remoteBindings: false }),
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
    rehypePlugins: [rehypeLazyImages],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});
