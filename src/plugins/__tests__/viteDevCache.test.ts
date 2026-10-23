import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { resolveConfig } = await import(require.resolve('vite', { paths: [require.resolve('astro/package.json')] }));
import { devCacheIsolation } from '../viteDevCache';

async function cache(command: 'serve' | 'build', middlewareMode = false) {
  const config = await resolveConfig({ configFile: false, plugins: [devCacheIsolation()], server: { middlewareMode }, cacheDir: 'node_modules/.vite' }, command);
  return config.cacheDir;
}
describe('Vite dev cache isolation', () => {
  it('keeps the running dev server separate from Astro sync/check temporary servers', async () => {
    const dev = await cache('serve');
    expect(dev).not.toBe(await cache('serve', true));
    expect(dev).not.toBe(await cache('build'));
    expect(dev).toBe(await cache('serve'));
  });
  it('leaves sync and build using the configured default cache', async () => {
    expect(await cache('serve', true)).toMatch(/node_modules\/\.vite$/);
    expect(await cache('build')).toMatch(/node_modules\/\.vite$/);
  });
});
