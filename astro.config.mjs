// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';

// Rehype plugin: external links open in new tab
function rehypeExternalLinks() {
  return function(tree) {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && /^https?:\/\//.test(href)) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

// Rehype plugin: add loading="lazy" to all img elements
function rehypeLazyImages() {
  return function(tree) {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties ??= {};
        if (!node.properties.loading) {
          node.properties.loading = 'lazy';
        }
        if (!node.properties.decoding) {
          node.properties.decoding = 'async';
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
  // 已發佈文章換檔名時，舊網址一律留一條 301，外站連過來才不會 404。
  redirects: {
    '/posts/ai/2026-03-20-claude-certified-architect-foundations-guide':
      '/posts/ai/2026-08-18-claude-certified-architect-foundations-guide',
    '/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en':
      '/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en',
    '/posts/ai/2026-04-05-hermes-agent-intro': '/posts/ai/2026-08-18-hermes-agent-intro',
    '/posts/ai/2026-04-05-hermes-agent-intro-en': '/posts/ai/2026-08-18-hermes-agent-intro-en',
    // 'RAG 系統實戰' 併入 'RAG 技法大全'
    '/series/rag-systems': '/series/rag-techniques',
    '/en/series/rag-systems': '/en/series/rag-techniques',
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
    remoteBindings: false,
    inspectorPort: false,
    prerenderEnvironment: 'node',
  }),
  integrations: [
    react(),
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
    smartypants: false,
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [rehypeExternalLinks, rehypeLazyImages],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});
