import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { resolveOgImageCacheDir } from './og-image-cache.mjs';

function fixture(t) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'qp-og-cache-')));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
test('main checkout and actual isolated linked worktree resolve to the same cache', t => {
  const root = fixture(t), main = join(root, 'main'), linked = join(root, 'release');
  mkdirSync(main); git(main, 'init', '-q');
  writeFileSync(join(main, 'seed.txt'), 'seed'); git(main, 'add', 'seed.txt');
  git(main, '-c', 'user.name=Cache Test', '-c', 'user.email=cache@example.test', 'commit', '-qm', 'seed');
  git(main, 'worktree', 'add', '-q', '--detach', linked);
  const expected = join(main, '.cache/og-images');
  assert.equal(resolveOgImageCacheDir({ cwd: main, env: {} }), expected);
  assert.equal(resolveOgImageCacheDir({ cwd: linked, env: {} }), expected);
  mkdirSync(join(linked, 'nested'));
  assert.equal(resolveOgImageCacheDir({ cwd: join(linked, 'nested'), env: {} }), expected);
  assert.equal(readdirSync(main).includes('.cache'), false, 'resolving must not create cache directories');
});
test('explicit override wins even outside Git and relative paths use supplied cwd', t => {
  const root = fixture(t);
  assert.equal(resolveOgImageCacheDir({ cwd: root, env: { OG_IMAGE_CACHE_DIR: 'custom-cache' } }), resolve(root, 'custom-cache'));
  assert.equal(resolveOgImageCacheDir({ cwd: root, env: { OG_IMAGE_CACHE_DIR: '/tmp/explicit-og-cache' } }), '/tmp/explicit-og-cache');
  assert.deepEqual(readdirSync(root), []);
});
test('source archives outside Git use the original local path without side effects', t => {
  const root = fixture(t);
  assert.equal(resolveOgImageCacheDir({ cwd: root, env: {} }), join(root, '.cache/og-images'));
  assert.deepEqual(readdirSync(root), []);
});
test('bare repositories keep shared cache inside the common Git directory', t => {
  const root = fixture(t), bare = join(root, 'bare.git');
  git(root, 'init', '--bare', '-q', bare);
  assert.equal(resolveOgImageCacheDir({ cwd: bare, env: {} }), join(bare, 'cache/og-images'));
});
