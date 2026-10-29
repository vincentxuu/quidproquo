// astro.config.mjs
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { unified } from '@astrojs/markdown-remark';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { devCacheIsolation } from './src/plugins/viteDevCache.ts';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';
import { remarkYoutubeEmbed } from './src/plugins/remarkYoutubeEmbed.ts';
import { remarkVideoPractice } from './src/plugins/remarkVideoPractice.ts';
import { remarkVideoGallery } from './src/plugins/remarkVideoGallery.ts';
import { remarkFlowDiagram } from './src/plugins/remarkFlowDiagram.ts';
import { remarkDiagram } from './src/plugins/remarkDiagram.ts';
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
    // Stanford CS329Z：一週一篇改為一堂一篇，舊週文轉到該週第一堂（2026-10-29）。
    '/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems': { destination: '/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems', status: 301 },
    '/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en': { destination: '/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents-en', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents', status: 301 },
    '/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos-en': { destination: '/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en', status: 301 },
    // Agent 隔離邊界：移除重複附錄，保留原文導讀（2026-10-26）。
    '/posts/ai/2026-10-24-agent-isolation-retelling-check': { destination: '/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading', status: 301 },
    '/posts/ai/2026-10-24-agent-isolation-retelling-check-en': { destination: '/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading-en', status: 301 },
    // 出國攀岩裝備 v2：重疊篇併入新篇或「攀岩裝備」系列（2026-10-19）。
    '/posts/climbing/2026-10-19-dynamic-rope-triple-rating': '/posts/climbing/2026-10-19-climbing-trip-gear-list-by-destination',
    '/posts/climbing/2026-10-19-dynamic-rope-triple-rating-en': '/posts/climbing/2026-10-19-climbing-trip-gear-list-by-destination-en',
    '/posts/climbing/2026-10-19-multipitch-rope-systems': '/posts/climbing/2026-10-19-climbing-trip-gear-list-by-destination',
    '/posts/climbing/2026-10-19-multipitch-rope-systems-en': '/posts/climbing/2026-10-19-climbing-trip-gear-list-by-destination-en',
    '/posts/climbing/2026-10-19-climbing-travel-packing': '/posts/climbing/2026-10-19-climbing-travel-luggage',
    '/posts/climbing/2026-10-19-climbing-travel-packing-en': '/posts/climbing/2026-10-19-climbing-travel-luggage-en',
    '/posts/climbing/2026-10-19-climbing-shoes-harness-helmet': '/posts/climbing/2026-10-24-climbing-harness',
    '/posts/climbing/2026-10-19-climbing-shoes-harness-helmet-en': '/posts/climbing/2026-10-24-climbing-harness-en',
    '/posts/climbing/2026-10-19-climbing-belay-hardware': '/posts/climbing/2026-10-24-climbing-belay-device',
    '/posts/climbing/2026-10-19-climbing-belay-hardware-en': '/posts/climbing/2026-10-24-climbing-belay-device-en',
    '/posts/climbing/2026-10-19-climbing-gear-care-retirement': '/posts/climbing/2026-10-19-climbing-gear-inspection-retirement',
    '/posts/climbing/2026-10-19-climbing-gear-care-retirement-en': '/posts/climbing/2026-10-19-climbing-gear-inspection-retirement-en',
    // 攀岩裝備：一個裝備一篇，合併篇拆開（2026-10-24）。
    '/posts/climbing/2026-10-19-climbing-harness-helmet': '/posts/climbing/2026-10-24-climbing-harness',
    '/posts/climbing/2026-10-19-climbing-harness-helmet-en': '/posts/climbing/2026-10-24-climbing-harness-en',
    '/posts/climbing/2026-10-19-climbing-rope-belay-device': '/posts/climbing/2026-10-24-climbing-rope',
    '/posts/climbing/2026-10-19-climbing-rope-belay-device-en': '/posts/climbing/2026-10-24-climbing-rope-en',
    // Bug Bounty: consolidate duplicate rewrite paths into topic-correct original URLs.
    '/posts/tech/2026-10-15-bug-bounty-zero-01-rules-and-scope': '/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope',
    '/posts/tech/2026-10-15-bug-bounty-zero-01-rules-and-scope-en': '/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-02-how-websites-work': '/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work',
    '/posts/tech/2026-10-15-bug-bounty-zero-02-how-websites-work-en': '/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-04-xss-and-idor': '/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs',
    '/posts/tech/2026-10-15-bug-bounty-zero-04-xss-and-idor-en': '/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-05-what-is-rce': '/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce',
    '/posts/tech/2026-10-15-bug-bounty-zero-05-what-is-rce-en': '/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-06-write-report-and-triage': '/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value',
    '/posts/tech/2026-10-15-bug-bounty-zero-06-write-report-and-triage-en': '/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-07-how-programs-use-memory': '/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory',
    '/posts/tech/2026-10-15-bug-bounty-zero-07-how-programs-use-memory-en': '/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-08-buffer-overflow': '/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow',
    '/posts/tech/2026-10-15-bug-bounty-zero-08-buffer-overflow-en': '/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-09-vm-and-hypervisor': '/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor',
    '/posts/tech/2026-10-15-bug-bounty-zero-09-vm-and-hypervisor-en': '/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-10-hyper-v-escape': '/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study',
    '/posts/tech/2026-10-15-bug-bounty-zero-10-hyper-v-escape-en': '/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-11-tee-confidential': '/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing',
    '/posts/tech/2026-10-15-bug-bounty-zero-11-tee-confidential-en': '/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en',
    '/posts/tech/2026-10-15-bug-bounty-zero-12-ai-era-bounty': '/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty',
    '/posts/tech/2026-10-15-bug-bounty-zero-12-ai-era-bounty-en': '/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en',
    // Stanford CS329Z：檔名日期改成與 frontmatter date 一致（2026-10-13）
    '/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en': '/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en',
    '/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy': '/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy',
    '/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en': '/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en',
    '/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory': '/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory',
    '/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization-en': '/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en',
    '/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization': '/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization',
    '/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel-en': '/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en',
    '/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel': '/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel',
    '/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en': '/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en',
    '/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks': '/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks',
    '/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en': '/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety-en',
    '/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety': '/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety',
    '/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents-en': '/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents-en',
    '/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents': '/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents',
    '/posts/ai/2026-09-18-stanford-cs329z-week11-proactive-demos-en': '/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos-en',
    '/posts/ai/2026-09-18-stanford-cs329z-week11-proactive-demos': '/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos',
    // 其餘系列：檔名日期改成與 frontmatter date 一致（2026-10-13）
    '/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai-en': '/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai-en',
    '/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai': '/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai',
    '/posts/ai/2026-04-03-chemistry-times-analysis-en': '/posts/ai/2026-04-04-chemistry-times-analysis-en',
    '/posts/ai/2026-04-03-chemistry-times-analysis': '/posts/ai/2026-04-04-chemistry-times-analysis',
    '/posts/ai/2026-08-25-coding-agent-approval-grading-en': '/posts/ai/2026-08-30-coding-agent-approval-grading-en',
    '/posts/ai/2026-08-25-coding-agent-approval-grading': '/posts/ai/2026-08-30-coding-agent-approval-grading',
    '/posts/ai/2026-08-25-coding-agent-code-mode-en': '/posts/ai/2026-08-30-coding-agent-code-mode-en',
    '/posts/ai/2026-08-25-coding-agent-code-mode': '/posts/ai/2026-08-30-coding-agent-code-mode',
    '/posts/ai/2026-08-25-coding-agent-context-compaction-en': '/posts/ai/2026-08-30-coding-agent-context-compaction-en',
    '/posts/ai/2026-08-25-coding-agent-context-compaction': '/posts/ai/2026-08-30-coding-agent-context-compaction',
    '/posts/ai/2026-08-25-coding-agent-cross-session-memory-en': '/posts/ai/2026-08-30-coding-agent-cross-session-memory-en',
    '/posts/ai/2026-08-25-coding-agent-cross-session-memory': '/posts/ai/2026-08-30-coding-agent-cross-session-memory',
    '/posts/ai/2026-08-25-coding-agent-dangerous-command-interception-en': '/posts/ai/2026-08-30-coding-agent-dangerous-command-interception-en',
    '/posts/ai/2026-08-25-coding-agent-dangerous-command-interception': '/posts/ai/2026-08-30-coding-agent-dangerous-command-interception',
    '/posts/ai/2026-08-25-coding-agent-design-series-overview-en': '/posts/ai/2026-08-30-coding-agent-design-series-overview-en',
    '/posts/ai/2026-08-25-coding-agent-design-series-overview': '/posts/ai/2026-08-30-coding-agent-design-series-overview',
    '/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins-en': '/posts/ai/2026-08-30-coding-agent-hooks-skills-plugins-en',
    '/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins': '/posts/ai/2026-08-30-coding-agent-hooks-skills-plugins',
    '/posts/ai/2026-08-25-coding-agent-lsp-integration-en': '/posts/ai/2026-08-30-coding-agent-lsp-integration-en',
    '/posts/ai/2026-08-25-coding-agent-lsp-integration': '/posts/ai/2026-08-30-coding-agent-lsp-integration',
    '/posts/ai/2026-08-25-coding-agent-mcp-integration-en': '/posts/ai/2026-08-30-coding-agent-mcp-integration-en',
    '/posts/ai/2026-08-25-coding-agent-mcp-integration': '/posts/ai/2026-08-30-coding-agent-mcp-integration',
    '/posts/ai/2026-08-25-coding-agent-model-catalog-routing-en': '/posts/ai/2026-08-30-coding-agent-model-catalog-routing-en',
    '/posts/ai/2026-08-25-coding-agent-model-catalog-routing': '/posts/ai/2026-08-30-coding-agent-model-catalog-routing',
    '/posts/ai/2026-08-25-coding-agent-model-provider-abstraction-en': '/posts/ai/2026-08-30-coding-agent-model-provider-abstraction-en',
    '/posts/ai/2026-08-25-coding-agent-model-provider-abstraction': '/posts/ai/2026-08-30-coding-agent-model-provider-abstraction',
    '/posts/ai/2026-08-25-coding-agent-os-level-sandboxing-en': '/posts/ai/2026-08-30-coding-agent-os-level-sandboxing-en',
    '/posts/ai/2026-08-25-coding-agent-os-level-sandboxing': '/posts/ai/2026-08-30-coding-agent-os-level-sandboxing',
    '/posts/ai/2026-08-25-coding-agent-prompt-versioning-en': '/posts/ai/2026-08-30-coding-agent-prompt-versioning-en',
    '/posts/ai/2026-08-25-coding-agent-prompt-versioning': '/posts/ai/2026-08-30-coding-agent-prompt-versioning',
    '/posts/ai/2026-08-25-coding-agent-provider-retry-policy-en': '/posts/ai/2026-08-30-coding-agent-provider-retry-policy-en',
    '/posts/ai/2026-08-25-coding-agent-provider-retry-policy': '/posts/ai/2026-08-30-coding-agent-provider-retry-policy',
    '/posts/ai/2026-08-25-coding-agent-session-recording-replay-en': '/posts/ai/2026-08-30-coding-agent-session-recording-replay-en',
    '/posts/ai/2026-08-25-coding-agent-session-recording-replay': '/posts/ai/2026-08-30-coding-agent-session-recording-replay',
    '/posts/ai/2026-08-25-coding-agent-subagent-worktree-isolation-en': '/posts/ai/2026-08-30-coding-agent-subagent-worktree-isolation-en',
    '/posts/ai/2026-08-25-coding-agent-subagent-worktree-isolation': '/posts/ai/2026-08-30-coding-agent-subagent-worktree-isolation',
    '/posts/ai/2026-08-25-coding-agent-telemetry-cost-tracking-en': '/posts/ai/2026-08-30-coding-agent-telemetry-cost-tracking-en',
    '/posts/ai/2026-08-25-coding-agent-telemetry-cost-tracking': '/posts/ai/2026-08-30-coding-agent-telemetry-cost-tracking',
    '/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy-en': '/posts/ai/2026-08-30-coding-agent-toolset-design-philosophy-en',
    '/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy': '/posts/ai/2026-08-30-coding-agent-toolset-design-philosophy',
    '/posts/ai/2026-08-25-coding-agent-workspace-isolation-en': '/posts/ai/2026-08-30-coding-agent-workspace-isolation-en',
    '/posts/ai/2026-08-25-coding-agent-workspace-isolation': '/posts/ai/2026-08-30-coding-agent-workspace-isolation',
    '/posts/ai/2026-08-26-coding-agent-agent-as-service-en': '/posts/ai/2026-08-30-coding-agent-agent-as-service-en',
    '/posts/ai/2026-08-26-coding-agent-agent-as-service': '/posts/ai/2026-08-30-coding-agent-agent-as-service',
    '/posts/ai/2026-08-29-gputw-ai-learning-gpu-en': '/posts/ai/2026-09-07-gputw-ai-learning-gpu-en',
    '/posts/ai/2026-08-29-gputw-ai-learning-gpu': '/posts/ai/2026-09-07-gputw-ai-learning-gpu',
    '/posts/tech/2026-08-23-looplane-cloudflare-deployment-en': '/posts/tech/2026-08-30-looplane-cloudflare-deployment-en',
    '/posts/tech/2026-08-23-looplane-cloudflare-deployment': '/posts/tech/2026-08-30-looplane-cloudflare-deployment',
    '/posts/tech/2026-08-23-looplane-disposable-clone-run-bundle-en': '/posts/tech/2026-08-30-looplane-disposable-clone-run-bundle-en',
    '/posts/tech/2026-08-23-looplane-disposable-clone-run-bundle': '/posts/tech/2026-08-30-looplane-disposable-clone-run-bundle',
    '/posts/tech/2026-08-23-looplane-external-coding-runner-en': '/posts/tech/2026-08-30-looplane-external-coding-runner-en',
    '/posts/tech/2026-08-23-looplane-external-coding-runner': '/posts/tech/2026-08-30-looplane-external-coding-runner',
    '/posts/tech/2026-08-23-looplane-model-provider-multigateway-en': '/posts/tech/2026-08-30-looplane-model-provider-multigateway-en',
    '/posts/tech/2026-08-23-looplane-model-provider-multigateway': '/posts/tech/2026-08-30-looplane-model-provider-multigateway',
    '/posts/tech/2026-08-23-looplane-provider-neutral-agent-loop-en': '/posts/tech/2026-08-30-looplane-provider-neutral-agent-loop-en',
    '/posts/tech/2026-08-23-looplane-provider-neutral-agent-loop': '/posts/tech/2026-08-30-looplane-provider-neutral-agent-loop',
    '/posts/tech/2026-08-23-looplane-state-first-event-journaling-en': '/posts/tech/2026-08-30-looplane-state-first-event-journaling-en',
    '/posts/tech/2026-08-23-looplane-state-first-event-journaling': '/posts/tech/2026-08-30-looplane-state-first-event-journaling',
    '/posts/tech/2026-08-23-looplane-tool-isolation-en': '/posts/tech/2026-08-30-looplane-tool-isolation-en',
    '/posts/tech/2026-08-23-looplane-tool-isolation': '/posts/tech/2026-08-30-looplane-tool-isolation',
    '/posts/tech/2026-08-23-looplane-tui-cli-ergonomics-en': '/posts/tech/2026-08-30-looplane-tui-cli-ergonomics-en',
    '/posts/tech/2026-08-23-looplane-tui-cli-ergonomics': '/posts/tech/2026-08-30-looplane-tui-cli-ergonomics',
    // CS50 AI 與 MIT 6.7960：檔名原本帶著排程用的未來日期，改成與 frontmatter date 一致（2026-10-13）
    '/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge-en': '/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en',
    '/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge': '/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge',
    '/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty-en': '/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en',
    '/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty': '/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty',
    '/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam-en': '/posts/tech/2026-08-30-mit-67960-optimization-sgd-adam-en',
    '/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam': '/posts/tech/2026-08-30-mit-67960-optimization-sgd-adam',
    '/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization-en': '/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en',
    '/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization': '/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization',
    '/posts/tech/2026-09-17-mit-67960-regularization-en': '/posts/tech/2026-08-30-mit-67960-regularization-en',
    '/posts/tech/2026-09-17-mit-67960-regularization': '/posts/tech/2026-08-30-mit-67960-regularization',
    '/posts/tech/2026-09-24-harvard-cs50ai-w04-learning-en': '/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en',
    '/posts/tech/2026-09-24-harvard-cs50ai-w04-learning': '/posts/tech/2026-08-30-harvard-cs50ai-w04-learning',
    '/posts/tech/2026-09-24-mit-67960-ps1-mlp-backprop-en': '/posts/tech/2026-08-30-mit-67960-ps1-mlp-backprop-en',
    '/posts/tech/2026-09-24-mit-67960-ps1-mlp-backprop': '/posts/tech/2026-08-30-mit-67960-ps1-mlp-backprop',
    '/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks-en': '/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en',
    '/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks': '/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks',
    '/posts/tech/2026-10-01-mit-67960-cnn-architectures-en': '/posts/tech/2026-08-30-mit-67960-cnn-architectures-en',
    '/posts/tech/2026-10-01-mit-67960-cnn-architectures': '/posts/tech/2026-08-30-mit-67960-cnn-architectures',
    '/posts/tech/2026-10-08-harvard-cs50ai-w06-language-en': '/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en',
    '/posts/tech/2026-10-08-harvard-cs50ai-w06-language': '/posts/tech/2026-08-30-harvard-cs50ai-w06-language',
    '/posts/tech/2026-10-08-mit-67960-l06-modern-cnn-en': '/posts/tech/2026-08-30-mit-67960-modern-cnn-en',
    '/posts/tech/2026-10-08-mit-67960-l06-modern-cnn': '/posts/tech/2026-08-30-mit-67960-modern-cnn',
    '/posts/tech/2026-10-15-harvard-cs50ai-synthesis-1-en': '/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en',
    '/posts/tech/2026-10-15-harvard-cs50ai-synthesis-1': '/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1',
    '/posts/tech/2026-10-15-mit-67960-l07-scaling-rules-optimization-en': '/posts/tech/2026-08-30-mit-67960-l07-scaling-rules-optimization-en',
    '/posts/tech/2026-10-15-mit-67960-l07-scaling-rules-optimization': '/posts/tech/2026-08-30-mit-67960-l07-scaling-rules-optimization',
    '/posts/tech/2026-10-22-harvard-cs50ai-synthesis-2-en': '/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en',
    '/posts/tech/2026-10-22-harvard-cs50ai-synthesis-2': '/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2',
    '/posts/tech/2026-10-22-mit-67960-l08-transformers-en': '/posts/tech/2026-08-30-mit-67960-l08-transformers-en',
    '/posts/tech/2026-10-22-mit-67960-l08-transformers': '/posts/tech/2026-08-30-mit-67960-l08-transformers',
    '/posts/tech/2026-10-29-harvard-cs50ai-wrapup-en': '/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en',
    '/posts/tech/2026-10-29-harvard-cs50ai-wrapup': '/posts/tech/2026-08-30-harvard-cs50ai-wrapup',
    '/posts/tech/2026-10-29-mit-67960-l09-hackers-guide-en': '/posts/tech/2026-08-30-mit-67960-l09-hackers-guide-en',
    '/posts/tech/2026-10-29-mit-67960-l09-hackers-guide': '/posts/tech/2026-08-30-mit-67960-l09-hackers-guide',
    '/posts/tech/2026-11-05-mit-67960-l10-memory-sequence-en': '/posts/tech/2026-08-30-mit-67960-l10-memory-sequence-en',
    '/posts/tech/2026-11-05-mit-67960-l10-memory-sequence': '/posts/tech/2026-08-30-mit-67960-l10-memory-sequence',
    '/posts/tech/2026-11-12-mit-67960-l11-representation-reconstruction-en': '/posts/tech/2026-08-30-mit-67960-l11-representation-reconstruction-en',
    '/posts/tech/2026-11-12-mit-67960-l11-representation-reconstruction': '/posts/tech/2026-08-30-mit-67960-l11-representation-reconstruction',
    '/posts/tech/2026-11-19-mit-67960-l12-representation-similarity-en': '/posts/tech/2026-08-30-mit-67960-l12-representation-similarity-en',
    '/posts/tech/2026-11-19-mit-67960-l12-representation-similarity': '/posts/tech/2026-08-30-mit-67960-l12-representation-similarity',
    '/posts/tech/2026-11-26-mit-67960-l13-representation-theory-en': '/posts/tech/2026-08-30-mit-67960-l13-representation-theory-en',
    '/posts/tech/2026-11-26-mit-67960-l13-representation-theory': '/posts/tech/2026-08-30-mit-67960-l13-representation-theory',
    '/posts/tech/2026-12-03-mit-67960-l14-generative-basics-en': '/posts/tech/2026-08-30-mit-67960-l14-generative-basics-en',
    '/posts/tech/2026-12-03-mit-67960-l14-generative-basics': '/posts/tech/2026-08-30-mit-67960-l14-generative-basics',
    '/posts/tech/2026-12-10-mit-67960-approximation-theory-en': '/posts/tech/2026-08-30-mit-67960-approximation-theory-en',
    '/posts/tech/2026-12-10-mit-67960-approximation-theory': '/posts/tech/2026-08-30-mit-67960-approximation-theory',
    '/posts/tech/2026-12-17-mit-67960-gnn-en': '/posts/tech/2026-08-30-mit-67960-gnn-en',
    '/posts/tech/2026-12-17-mit-67960-gnn': '/posts/tech/2026-08-30-mit-67960-gnn',
    '/posts/tech/2026-12-24-mit-67960-l15-vae-en': '/posts/tech/2026-08-30-mit-67960-l15-vae-en',
    '/posts/tech/2026-12-24-mit-67960-l15-vae': '/posts/tech/2026-08-30-mit-67960-l15-vae',
    '/posts/tech/2026-12-31-mit-67960-l16-conditional-generative-en': '/posts/tech/2026-08-30-mit-67960-l16-conditional-generative-en',
    '/posts/tech/2026-12-31-mit-67960-l16-conditional-generative': '/posts/tech/2026-08-30-mit-67960-l16-conditional-generative',
    '/posts/tech/2027-01-07-mit-67960-l01-introduction-en': '/posts/tech/2026-08-30-mit-67960-l01-introduction-en',
    '/posts/tech/2027-01-07-mit-67960-l01-introduction': '/posts/tech/2026-08-30-mit-67960-l01-introduction',
    '/posts/tech/2027-01-14-mit-67960-l17-out-of-distribution-en': '/posts/tech/2026-08-30-mit-67960-l17-out-of-distribution-en',
    '/posts/tech/2027-01-14-mit-67960-l17-out-of-distribution': '/posts/tech/2026-08-30-mit-67960-l17-out-of-distribution',
    '/posts/tech/2027-01-21-mit-67960-l18-transfer-learning-en': '/posts/tech/2026-08-30-mit-67960-l18-transfer-learning-en',
    '/posts/tech/2027-01-21-mit-67960-l18-transfer-learning': '/posts/tech/2026-08-30-mit-67960-l18-transfer-learning',
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
    '/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe': '/posts/ai/2026-09-30-ntu-adl2025-bert-family',
    '/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en': '/posts/ai/2026-09-30-ntu-adl2025-bert-family-en',
    '/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2': '/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf',
    '/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en': '/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en',
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
    // CI visual checks run without Cloudflare credentials; production bindings are unchanged.
    remoteBindings: !process.env.CI,
    inspectorPort: false,
    prerenderEnvironment: 'node',
  }),
  vite: {
    plugins: [devCacheIsolation(), tailwindcss()],
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
    {
      name: 'dev-content-store-chunks',
      hooks: {
        'astro:config:setup': ({ command, updateConfig }) => {
          // Only the dev virtual-module compiler needs the small content chunks.
          // Keep build/sync/check on Astro's default single-file storage.
          if (command === 'dev') {
            updateConfig({
              experimental: { collectionStorage: { type: 'chunked', chunkSize: 1024 * 1024 } },
            });
          }
        },
      },
    },
    react(),
    mdx(),
    sitemap({
      filter: isPublicSitemapPage,
    }),
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': async ({ dir }) => {
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
      remarkPlugins: [remarkMathOptIn, remarkReadingTime, remarkYoutubeEmbed, remarkVideoPractice, remarkVideoGallery, remarkFlowDiagram, remarkDiagram],
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
