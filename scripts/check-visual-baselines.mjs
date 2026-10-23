#!/usr/bin/env node
// Every compareScreenshot() call site in tests/visual must have -linux baselines.
// Screenshots no longer gate deploys, but a call site with zero baselines can
// never pass and silently stops reviewing anything. -linux images only come from
// CI: run the "Update visual baselines (linux)" workflow on your branch.
//
// Static and cheap: template names like `three-col-${width}-open-${theme}.png`
// become patterns; each must match at least one committed baseline. It does not
// expand loops, so it catches a missing family, not a single missing variant.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'tests/visual';
const CALL = /compareScreenshot\(\s*page\s*,\s*(['"`])(.+?)\1\s*\)/g;

export function namePattern(name) {
  const escaped = name.split(/\$\{[^}]+\}/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${escaped.join('[^/]+')}$`);
}

export function missingBaselines(specs) {
  const problems = [];
  for (const { file, source, baselines } of specs) {
    for (const [, , name] of source.matchAll(CALL)) {
      const linux = namePattern(name.replace(/\.png$/, '-chromium-linux.png'));
      if (!baselines.some((b) => linux.test(b))) problems.push(`${file}: no -linux baseline for ${name}`);
    }
  }
  return problems;
}

if (process.argv.includes('--self-test')) {
  const spec = (baselines) => [{ file: 'x.spec.ts', source: 'await compareScreenshot(page, `col-${w}-${theme}.png`);', baselines }];
  const cases = [
    [missingBaselines(spec(['col-1140-dark-chromium-linux.png'])).length === 0, 'template matches a baseline'],
    [missingBaselines(spec(['col-1140-dark-chromium-darwin.png'])).length === 1, 'darwin-only does not count'],
    [missingBaselines(spec([])).length === 1, 'empty snapshot dir fails'],
  ];
  const failed = cases.filter(([ok]) => !ok).map(([, name]) => name);
  if (failed.length) {
    console.error(`check-visual-baselines self-test failed: ${failed.join(', ')}`);
    process.exit(1);
  }
  console.log('check-visual-baselines self-test passed');
  process.exit(0);
}

const specs = readdirSync(DIR).filter((f) => f.endsWith('.spec.ts')).map((f) => {
  const snapshots = join(DIR, `${f}-snapshots`);
  return { file: join(DIR, f), source: readFileSync(join(DIR, f), 'utf8'), baselines: existsSync(snapshots) ? readdirSync(snapshots) : [] };
});
const problems = missingBaselines(specs);
if (problems.length) {
  console.error(problems.join('\n'));
  console.error('\nRun "Update visual baselines (linux)" on your branch, review the images, then commit.');
  process.exit(1);
}
console.log('visual baselines: every screenshot call site has -linux baselines');
