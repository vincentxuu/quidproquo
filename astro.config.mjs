// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';
import { remarkYoutubeEmbed } from './src/plugins/remarkYoutubeEmbed.ts';
import { remarkMathOptIn } from './src/plugins/remarkMathOptIn.ts';
import rehypeKatex from 'rehype-katex';

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

function isPublicSitemapPage(page) {
  const { pathname } = new URL(page);
  return pathname !== '/admin' && !pathname.startsWith('/admin/');
}

export default defineConfig({
  site: 'https://quidproquo.cc',
  output: 'server',
  // 已發佈文章換檔名時，舊網址一律留一條 301，外站連過來才不會 404。
  redirects: {
    // Stanford CS229 由講義逐章改為 Spring 2026 逐堂（2026-10-12）；kernel、SVM、ICA、LQR 四章無對應堂次，轉到課程總覽
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression': '/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression': '/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-03-generalized-linear-models': '/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-03-generalized-linear-models-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms': '/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods': '/posts/ai/2026-08-21-stanford-cs229-machine-learning',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods-en': '/posts/ai/2026-08-21-stanford-cs229-machine-learning-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines': '/posts/ai/2026-08-21-stanford-cs229-machine-learning',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines-en': '/posts/ai/2026-08-21-stanford-cs229-machine-learning-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning': '/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization': '/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection': '/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means': '/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-11-em-algorithms': '/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-11-em-algorithms-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-12-principal-components-analysis': '/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-12-principal-components-analysis-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-13-independent-components-analysis': '/posts/ai/2026-08-21-stanford-cs229-machine-learning',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-13-independent-components-analysis-en': '/posts/ai/2026-08-21-stanford-cs229-machine-learning-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models': '/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-15-foundation-models-overview': '/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-15-foundation-models-overview-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-16-representation-learning': '/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-16-representation-learning-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-17-large-language-models': '/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-17-large-language-models-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-18-reasoning-in-llms': '/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-18-reasoning-in-llms-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning': '/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg': '/posts/ai/2026-08-21-stanford-cs229-machine-learning',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg-en': '/posts/ai/2026-08-21-stanford-cs229-machine-learning-en',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants': '/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient',
    '/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants-en': '/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en',
    // CMU 10-423 A/B 拆篇併回一堂一篇（2026-10-12）
    '/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning': '/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf',
    '/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning-en': '/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf': '/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf',
    '/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf-en': '/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo': '/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion',
    '/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo-en': '/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion': '/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion',
    '/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en': '/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer': '/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws',
    '/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en': '/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws': '/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws',
    '/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws-en': '/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr': '/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation',
    '/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en': '/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation': '/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation',
    '/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation-en': '/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models': '/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment',
    '/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models-en': '/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment-en',
    '/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment': '/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment',
    '/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment-en': '/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment-en',
    '/posts/ai/2026-03-20-claude-certified-architect-foundations-guide':
      '/posts/ai/2026-08-18-claude-certified-architect-foundations-guide',
    '/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en':
      '/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en',
    '/posts/ai/2026-04-05-hermes-agent-intro': '/posts/ai/2026-08-18-hermes-agent-intro',
    '/posts/ai/2026-04-05-hermes-agent-intro-en': '/posts/ai/2026-08-18-hermes-agent-intro-en',
    // GLM / Kimi family deep-dives moved from ai/2026-03-26 to tech/2026-08-24-ai-model-family
    '/posts/ai/2026-03-26-glm5-model-intro': '/posts/tech/2026-08-24-ai-model-family-glm',
    '/posts/ai/2026-03-26-glm5-model-intro-en': '/posts/tech/2026-08-24-ai-model-family-glm-en',
    '/posts/ai/2026-03-26-kimi-model-intro': '/posts/tech/2026-08-24-ai-model-family-kimi',
    '/posts/ai/2026-03-26-kimi-model-intro-en': '/posts/tech/2026-08-24-ai-model-family-kimi-en',
    // 'RAG 系統實戰' 併入 'RAG 技法大全'
    '/series/rag-systems': '/series/rag-techniques',
    '/en/series/rag-systems': '/en/series/rag-techniques',
    // fallback slug 撞名修正後登錄的系列：泛用的 `ai-agent` 與中英分家的 en slug 導向登錄 slug
    '/series/ai-agent': '/series/ai-agent-memory',
    '/en/series/ai-agent': '/en/series/ai-agent-memory',
    '/en/series/ai-search-is-rewriting-the-content-business': '/en/series/ai-search-content-business',
    '/en/series/multi-agent-systems-in-practice': '/en/series/multi-agent',
    '/en/series/reading-stanford-cme295': '/en/series/stanford-cme295',
    '/en/series/reading-cmu-11-768-ai-agents': '/en/series/cmu-11-768-ai-agents',
    // 英文版文章曾寫成登錄表以外的系列名稱，各自長出一個系列頁
    '/en/series/ai-conference-guide': '/en/series/ai-top-conferences',
    '/en/series/product-builder-interview-drill': '/en/series/product-builder-interview-daily',
    // 內容販售系列群登錄前的 fallback slug
    '/series/內容販售商業模式拆解': '/series/content-selling-business-models',
    '/series/情報如何成為一門企業生意': '/series/enterprise-intelligence-business',
    '/series/誰掌握創作者與讀者的關係': '/series/creator-reader-relationship',
    '/series/免費內容如何替別的生意獲客': '/series/free-content-acquisition',
    '/en/series/how-intelligence-becomes-an-enterprise-business': '/en/series/enterprise-intelligence-business',
    '/en/series/who-controls-the-creator-reader-relationship': '/en/series/creator-reader-relationship',
    '/en/series/how-free-content-acquires-customers-for-another-business': '/en/series/free-content-acquisition',
    // Stanford CME295 入口文改名為課程總覽（2026-10-13），檔名與其他課的總覽對齊
    '/posts/ai/2026-09-29-stanford-cme295-transformers-llms': '/posts/ai/2026-09-29-cme295-course-overview',
    '/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en': '/posts/ai/2026-09-29-cme295-course-overview-en',
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
    remoteBindings: false,
    inspectorPort: false,
    prerenderEnvironment: 'node',
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@lanefoundry/gatelane-sdk'],
      // Vite's SSR dep optimizer periodically re-bundles this module (imported by
      // src/worker.ts) and races with in-flight requests, causing dev-only
      // "file does not exist ... optimize deps directory" crashes. Excluding it
      // from optimization avoids the rebuild/rehash cycle entirely.
      optimizeDeps: {
        exclude: ['@astrojs/cloudflare/handler'],
      },
    },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: isPublicSitemapPage,
    }),
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { execFileSync } = await import('node:child_process');
          execFileSync('pnpm', ['exec', 'pagefind', '--site', dir.pathname, '--glob', 'posts/**/*.html'], {
            stdio: 'inherit',
          });
        },
      },
    },
  ],
  markdown: {
    processor: unified({
      smartypants: false,
      // remarkMathOptIn 必須排第一：它替 frontmatter 有 math: true 的文章重新解析，後面的 plugin 才看得到數學節點。
      remarkPlugins: [remarkMathOptIn, remarkReadingTime, remarkYoutubeEmbed],
      rehypePlugins: [rehypeKatex, rehypeExternalLinks, rehypeLazyImages],
    }),
  },
  experimental: {
    incrementalBuild: true,
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});
