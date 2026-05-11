# quidproquo — CLAUDE.md

## Tech Stack

- **Astro 6** (SSR, output: server) + TypeScript
- **Cloudflare Workers** adapter with D1 (SQLite), Vectorize (embeddings), KV (sessions), AI binding
- **Pagefind** for static full-text search (runs post-build)
- **pnpm** as package manager
- **oxlint** for linting; no Prettier (no formatter configured)
- **i18n**: zh-TW (default, no prefix) and en (`/en/...`)

## Key Directories

```
src/
  content/posts/     # Markdown posts (glob-loaded)
  content.config.ts  # Content collection schema
  pages/             # Astro routes (index, posts, search, rss, api/, en/, categories/, tags/)
  components/        # Astro/UI components
  layouts/           # Page layouts
  lib/               # Server-side logic (DB, Vectorize, etc.)
  utils/             # Shared helpers
  plugins/           # Remark plugins (e.g. readingTime)
  i18n/              # Translation strings
scripts/             # Build-time Node scripts (OG images, D1 sync, cron stubs, reference checks)
```

## Dev Commands

```bash
pnpm dev              # Start dev server (with Cloudflare platform proxy)
pnpm build            # Full production build (cron stubs + astro build + OG images)
pnpm deploy           # Build then wrangler deploy
pnpm lint             # oxlint src/ (excludes *.astro)
pnpm session:start    # Print pwd, latest commit, progress.txt, then run lint
pnpm check:references # Verify internal post cross-references
pnpm sync             # Sync posts to D1 (local)
pnpm sync:prod        # Sync posts to D1 (production)
```

## Content Schema (frontmatter)

| Field         | Type                                        | Required |
|---------------|---------------------------------------------|----------|
| `title`       | string                                      | yes      |
| `date`        | date (coerced)                              | yes      |
| `category`    | string                                      | yes      |
| `tags`        | string[]                                    | yes      |
| `lang`        | `'zh-TW'` \| `'en'`                        | no (default: `zh-TW`) |
| `description` | string                                      | no       |
| `tldr`        | string                                      | no       |
| `draft`       | boolean                                     | no (default: `false`) |
| `pinned`      | boolean                                     | no (default: `false`) |
| `type`        | `'debug'` \| `'deep-dive'` \| `'guide'` \| `'project'` | no |
| `series`      | `{ name: string, order: number }`           | no       |

## Naming Conventions

- **Post filenames**: `YYYY-MM-DD-slug.md` under `src/content/posts/`
- **lang values**: `zh-TW` (Traditional Chinese, default) or `en`
- **type values**: `debug`, `deep-dive`, `guide`, `project`
- **category**: free-form string; keep consistent with existing categories

## Important Decisions

- **Feature flags are mandatory** for all advanced/experimental techniques (RAG, embeddings, AI features). Every such feature must be individually toggleable. Do not add unless an observed failure justifies it.
- `progress.txt` at the repo root is the lightweight session memory. Update it when task status materially changes.
- Never revert file changes without explicit user confirmation.
- Use `stealth_fetch` MCP tool for all web scraping — never built-in WebFetch or playwright directly.

## Commit Convention

Always use the `format-commit` skill (`~/.claude/skills/format-commit.md`) to generate commit messages before every `git commit`.
