import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Conservative ownership boundary: browser-side progress helpers live under lib.
// Content-only changes stay on the existing content gates.
export function affectsUi(path) {
  return /^(src\/(components|layouts|styles|hooks|i18n|plugins)\/|src\/pages\/(?!api\/)|public\/|tests\/visual\/)/.test(path)
    || /^src\/lib\/(personalProgress|vocabulary|personalChat|english-speaking)/.test(path)
    || /^(astro\.config\.mjs|playwright(?:\.personal)?\.config\.ts|package\.json|pnpm-lock\.yaml|scripts\/ui-change-scope\.mjs|\.github\/workflows\/quality\.yml)$/.test(path);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = process.env.UI_BASE_SHA;
  const head = process.env.UI_HEAD_SHA;
  // Unknown comparison must never silently skip validation.
  if (!base || !head || /^0+$/.test(base)) {
    console.log('required=true');
  } else {
    const files = execFileSync('git', ['diff', '--name-only', '--no-renames', '-z', base, head], { encoding: 'utf8' }).split('\0').filter(Boolean);
    console.log(`required=${files.some(affectsUi)}`);
  }
}
