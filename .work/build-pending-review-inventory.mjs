import fs from "node:fs";
import path from "node:path";

const postsRoot = "src/content/posts";
const outPath = ".work/pending-review-inventory.md";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && p.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function frontmatter(src) {
  return src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
}

function field(fm, key) {
  return fm.match(new RegExp(`^${key}:\\s*(?:\"([^\"]*)\"|([^\\n]*))`, "m"))?.[1]
    ?? fm.match(new RegExp(`^${key}:\\s*(?:\"([^\"]*)\"|([^\\n]*))`, "m"))?.[2]
    ?? "";
}

function seriesName(fm) {
  return fm.match(/^series:\n(?:\s+[^\n]*\n)*?\s+name:\s*"([^"]+)"/m)?.[1] ?? "";
}

function seriesOrder(fm) {
  const v = fm.match(/^series:\n(?:\s+[^\n]*\n)*?\s+order:\s*(\d+)/m)?.[1];
  return v ? Number(v) : 9999;
}

const posts = walk(postsRoot).map((file) => {
  const src = fs.readFileSync(file, "utf8");
  const fm = frontmatter(src);
  return {
    file,
    title: field(fm, "title"),
    lang: field(fm, "lang"),
    category: field(fm, "category"),
    draft: field(fm, "draft") || "missing",
    series: seriesName(fm),
    order: seriesOrder(fm),
  };
});

const groups = [
  {
    name: "Claude Code 深入介紹 / Deep Dives",
    status: "review then publishable",
    match: (p) => p.series === "Claude Code 深入介紹" || p.series === "Claude Code Deep Dives",
    include: (p) => p.draft === "true",
  },
  {
    name: "搜尋與爬取實戰 blocked benchmarks",
    status: "blocked, do not publish until live artifacts exist",
    match: (p) => p.series === "搜尋與爬取實戰" || p.series === "Search and Scraping in Practice",
    include: (p) => /web-(retrieval|extraction)-.*benchmark/.test(p.file),
  },
  {
    name: "AI 模型家族非文字三篇",
    status: "review then publishable",
    match: (p) => p.series === "AI 模型家族" || p.series === "AI Model Families",
    include: (p) => /2026-08-26-ai-model-family-(flux|speech-audio|video-generation)(?:-en)?\.md$/.test(p.file),
  },
  {
    name: "Agent 記憶服務",
    status: "review then publishable",
    match: (p) => /(mem0|zep|graphiti|cognee|letta|memgpt)/i.test(p.file + "\n" + p.title),
    include: () => true,
  },
  {
    name: "Agent 框架個別介紹",
    status: "review then publishable",
    match: (p) => /(ag2|langchain|mastra|pydantic-ai|dspy)/i.test(p.file + "\n" + p.title),
    include: (p) => !p.file.includes("/daily/"),
  },
  {
    name: "雲端 LLM API 與路由",
    status: "review then publishable",
    match: (p) => /(openrouter|bedrock|vertex|together|fireworks|litellm|portkey)/i.test(p.file + "\n" + p.title),
    include: (p) => !p.file.includes("/daily/"),
  },
  {
    name: "Stanford NLP / Agent / 圖分支",
    status: "progress says already draft:false online but still review-labeled",
    match: (p) => /(CS124|CS224N|CS224V|CS224W)/i.test(p.title + "\n" + p.file),
    include: () => true,
  },
  {
    name: "Stanford CS221",
    status: "review then publishable",
    match: (p) => /(cs221)/i.test(p.file + "\n" + p.title),
    include: () => true,
  },
  {
    name: "Stanford CS229",
    status: "review then publishable",
    match: (p) => /(cs229)/i.test(p.file + "\n" + p.title),
    include: () => true,
  },
  {
    name: "Stanford CS336",
    status: "review then publishable",
    match: (p) => /(cs336)/i.test(p.file + "\n" + p.title),
    include: () => true,
  },
  {
    name: "私有語料管線",
    status: "orders 1-3 publishable after review; order 4 blocked until eval artifacts exist",
    match: (p) => p.series === "私有語料管線" || p.series === "Private Corpus Pipeline",
    include: () => true,
  },
  {
    name: "非 Stanford 名校課程系列",
    status: "review then publishable",
    match: (p) => /(MIT 6\.S191|6-S191|Berkeley CS188|Berkeley CS288|Berkeley CS285|CMU 10-301|CMU 11-785|CMU 07-280|Harvard)/i.test(p.title + "\n" + p.file + "\n" + p.series),
    include: () => true,
  },
];

const claimed = new Set();
const lines = [
  "# Pending Review Inventory",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Source: progress.txt待審語句 plus frontmatter scan. This is a working manifest, not a publication decision by itself.",
  "",
];
const allRows = [];

for (const group of groups) {
  const rows = posts
    .filter((p) => group.match(p) && group.include(p))
    .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  for (const row of rows) claimed.add(row.file);
  for (const row of rows) allRows.push({ ...row, group: group.name, groupStatus: group.status });
  const counts = rows.reduce((m, p) => {
    m[p.draft] = (m[p.draft] ?? 0) + 1;
    return m;
  }, {});
  lines.push(`## ${group.name}`);
  lines.push("");
  lines.push(`Status: ${group.status}`);
  lines.push(`Count: ${rows.length} files (${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(", ") || "none"})`);
  lines.push("");
  for (const p of rows) {
    lines.push(`- [ ] ${p.draft.padEnd(7)} order ${String(p.order).padStart(3, " ")} ${p.lang.padEnd(5)} ${p.file} | ${p.title}`);
  }
  lines.push("");
}

const deduped = [...new Map(allRows.map((row) => [row.file, row])).values()];
const dedupeCounts = deduped.reduce((m, p) => {
  m[p.draft] = (m[p.draft] ?? 0) + 1;
  return m;
}, {});
lines.splice(6, 0,
  `Deduped total: ${deduped.length} files (${Object.entries(dedupeCounts).map(([k, v]) => `${k}: ${v}`).join(", ") || "none"})`,
  "",
);

const blocked = deduped.filter((p) =>
  /blocked benchmarks/.test(p.group) || /private-corpus-retrieval-eval/.test(p.file)
);
lines.push("## Deduped Blockers");
lines.push("");
lines.push(`Count: ${blocked.length}`);
lines.push("");
for (const p of blocked.sort((a, b) => a.file.localeCompare(b.file))) {
  lines.push(`- ${p.file} | ${p.title} | ${p.groupStatus}`);
}
lines.push("");

fs.writeFileSync(outPath, lines.join("\n"));
console.log(outPath);
