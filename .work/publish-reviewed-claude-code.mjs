import fs from "node:fs";
import path from "node:path";

const roots = ["src/content/posts/tech/deep-dive", "src/content/posts/tech"];
const seriesNames = new Set(["Claude Code 深入介紹", "Claude Code Deep Dives"]);
const changed = [];

function frontmatter(source) {
  return source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
}

function seriesName(fm) {
  return fm.match(/^series:\n(?:\s+[^\n]*\n)*?\s+name:\s*"([^"]+)"/m)?.[1] ?? "";
}

for (const root of roots) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const file = path.join(root, entry.name);
    const source = fs.readFileSync(file, "utf8");
    const fm = frontmatter(source);
    if (!seriesNames.has(seriesName(fm))) continue;
    if (!/^draft:\s*true$/m.test(fm)) continue;

    const updated = source.replace(/^draft:\s*true$/m, "draft: false");
    if (updated === source) continue;
    fs.writeFileSync(file, updated);
    changed.push(file);
  }
}

changed.sort();
console.log(`Changed ${changed.length} file(s):`);
for (const file of changed) console.log(file);
