import { cp, mkdir, readFile } from 'node:fs/promises';
const pkg = JSON.parse(await readFile(new URL('../node_modules/pdfjs-dist/package.json', import.meta.url)));
if (pkg.version !== '6.4.299') throw new Error('Update the vendored PDF.js Viewer together with pdfjs-dist.');
const output = new URL('../public/pdfjs/', import.meta.url);
await mkdir(output, { recursive: true });
await cp(new URL('../vendor/pdfjs/', import.meta.url), output, { recursive: true });
for (const name of ['build', 'cmaps', 'iccs', 'standard_fonts', 'wasm', 'web/images']) {
  const target = name === 'build' ? 'build' : name.startsWith('web/') ? name : `web/${name}`;
  await cp(new URL(`../node_modules/pdfjs-dist/${name}`, import.meta.url), new URL(target, output), {
    recursive: true, filter: path => !path.endsWith('.map'),
  });
}
