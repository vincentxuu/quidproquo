import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const postsRoot = join(root, "src/content/posts");
const tracked = new Set(
  execFileSync("git", ["ls-files", "src/content/posts"], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter((path) => path.endsWith(".md")),
);

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (name.endsWith(".md")) files.push(path);
  }
  return files;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const raw = match[1];
  const scalar = {};
  for (const line of raw.split("\n")) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) scalar[field[1]] = field[2].trim().replace(/^["']|["']$/g, "");
  }
  const seriesName = raw.match(/^series:\n(?:  .*\n)*?  name:\s*["']?([^"'\n]+)["']?/m)?.[1];
  const seriesOrder = raw.match(/^series:\n(?:  .*\n)*?  order:\s*([0-9.]+)/m)?.[1];
  return { ...scalar, seriesName, seriesOrder };
}

const posts = walk(postsRoot).map((abs) => {
  const rel = relative(root, abs);
  const text = readFileSync(abs, "utf8");
  const fm = parseFrontmatter(text);
  return {
    rel,
    tracked: tracked.has(rel),
    title: fm.title || "",
    lang: fm.lang || "unknown",
    category: fm.category || rel.split("/")[3],
    draft: fm.draft === "true",
    seriesName: fm.seriesName || "",
    seriesOrder: fm.seriesOrder ? Number(fm.seriesOrder) : null,
  };
});

const trackedPosts = posts.filter((post) => post.tracked);
const drafts = trackedPosts.filter((post) => post.draft);
const draftGroups = Map.groupBy(drafts, (post) => post.seriesName || "(no series)");
const publishedGroups = Map.groupBy(
  trackedPosts.filter((post) => !post.draft),
  (post) => post.seriesName || "(no series)",
);

const interestingSeries = [
  "Claude Code 深入介紹",
  "Claude Code Deep Dives",
  "跟成熟 coding agent 學設計",
  "Learning from Mature Coding Agents",
  "Stanford CS109 導讀",
  "Reading Stanford CS109",
  "搜尋與爬取實戰",
  "Search and Web Retrieval in Practice",
  "MIT 6.7960 導讀 (Fall 2024 OCW)",
  "Reading MIT 6.7960 (Fall 2024 OCW)",
];

function countBySeries(name) {
  const all = trackedPosts.filter((post) => post.seriesName === name);
  return {
    total: all.length,
    published: all.filter((post) => !post.draft).length,
    draft: all.filter((post) => post.draft).length,
  };
}

console.log(JSON.stringify({
  tracked: trackedPosts.length,
  published: trackedPosts.filter((post) => !post.draft).length,
  drafts: drafts.length,
  untrackedMarkdown: posts.filter((post) => !post.tracked).map((post) => post.rel).sort(),
  interestingSeries: Object.fromEntries(interestingSeries.map((name) => [name, countBySeries(name)])),
  draftGroups: Object.fromEntries(
    [...draftGroups.entries()]
      .map(([name, rows]) => [name, rows.length])
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  ),
  draftFiles: drafts
    .map((post) => ({
      rel: post.rel,
      title: post.title,
      lang: post.lang,
      seriesName: post.seriesName || null,
      seriesOrder: post.seriesOrder,
    }))
    .sort((a, b) => a.rel.localeCompare(b.rel)),
  claudeCodeDraftOrder: drafts
    .filter((post) => post.seriesName === "Claude Code 深入介紹" || post.seriesName === "Claude Code Deep Dives")
    .map((post) => ({
      order: post.seriesOrder,
      lang: post.lang,
      rel: post.rel,
      title: post.title,
    }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.lang.localeCompare(b.lang)),
  publishedInteresting: Object.fromEntries(
    interestingSeries.map((name) => [
      name,
      (publishedGroups.get(name) || [])
        .map((post) => post.rel)
        .sort()
        .slice(0, 8),
    ]),
  ),
}, null, 2));
