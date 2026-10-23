import { resolve } from 'node:path';

/** Astro's temporary sync server must not replace a live server's optimized deps. */
export function devCacheIsolation() {
  return {
    name: 'dev-cache-isolation',
    config(config: { root?: string; cacheDir?: string; server?: { middlewareMode?: boolean | string } }, { command }: { command: string }) {
      if (command !== 'serve' || config.server?.middlewareMode) return;
      // A separate process also needs its own cache when two previews are open.
      return { cacheDir: resolve(config.root ?? process.cwd(), config.cacheDir ?? 'node_modules/.vite', `dev-${process.pid}`) };
    },
  };
}
