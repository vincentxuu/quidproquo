import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

/** Share content-addressed OG images across linked worktrees of the same repo. */
export function resolveOgImageCacheDir({ cwd = process.cwd(), env = process.env } = {}) {
  const override = env.OG_IMAGE_CACHE_DIR?.trim();
  if (override) return resolve(cwd, override);
  try {
    const options = { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };
    const commonDir = resolve(cwd, execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], options).trim());
    const bare = execFileSync('git', ['rev-parse', '--is-bare-repository'], options).trim() === 'true';
    return bare ? resolve(commonDir, 'cache/og-images') : resolve(dirname(commonDir), '.cache/og-images');
  } catch {
    // Source archives and environments without Git keep the existing local cache.
    return resolve(cwd, '.cache/og-images');
  }
}
