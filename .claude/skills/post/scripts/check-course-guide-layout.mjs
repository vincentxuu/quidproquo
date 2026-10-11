import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import matter from 'gray-matter';
import {courseNames} from './check-course-titles.mjs';

export const sourceHeadings = new Set(['課程影片來源', 'Course video sources', '官方材料與讀取範圍', 'Official materials and reading scope', '用到的官方材料與存取狀態', 'Official materials and access status', '讀取範圍與限制', 'Reading scope and limitations', 'Official materials and what I read', 'Official materials and scope', 'Official materials and access', 'Official materials and what I could read']);
const terminal = new Set(['更新紀錄', 'Update Log', 'Update log', 'Update history', 'Changelog', '參考資料', 'References']);
export function headings(content) {
  let fence = null;
  return content.split('\n').flatMap((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})/);
    if (m) { if (fence === m[1][0]) fence = null; else if (!fence) fence = m[1][0]; return []; }
    return !fence && line.startsWith('## ') ? [{line: i + 1, text: line.slice(3).trim()}] : [];
  });
}
export function layoutIssue(content) {
  const h = headings(content);
  const updates = h.filter(x => ['更新紀錄', 'Update Log', 'Update log', 'Update history', 'Changelog'].includes(x.text));
  if (updates.length > 1) return 'Merge duplicate update history sections; preserve their entries';
  const firstLearning = h.find(x => !sourceHeadings.has(x.text) && !terminal.has(x.text));
  const leading = h.find(x => sourceHeadings.has(x.text) && (!firstLearning || h.some(y => y.line > x.line && !sourceHeadings.has(y.text) && !terminal.has(y.text))));
  return leading ? `Line ${leading.line}: put standalone provenance section "${leading.text}" after learning content; preserve early video status and necessary source caveats` : null;
}
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {const p = path.join(dir,e.name); return e.isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];});
}
async function selfTest() {
  const {default:test}=await import('node:test'); const {default:assert}=await import('node:assert/strict');
  test('rejects source-first lessons',()=>assert.ok(layoutIssue('## 課程影片來源\n來源\n## 概念\n解說')));
  test('allows sources after teaching and early source caveats',()=>assert.equal(layoutIssue('**影片狀態：僅附官方入口。**\n版本限制。\n## 概念\n例子\n## 課程影片來源\n来源\n## 參考資料'),null));
  test('does not mistake code headings for learning sections',()=>assert.ok(layoutIssue('```md\n## 概念\n```\n## Course video sources\nlink\n## Mechanism')));
  test('rejects learning examples after provenance',()=>assert.ok(layoutIssue('## Concept\nexplanation\n## Course video sources\nlink\n## Worked example\nreasoning')));
  test('rejects duplicate update history variants',()=>assert.ok(layoutIssue('## Concept\nexplanation\n## Update history\nold\n## Update Log\nnew')));
  test('allows overview headings without requiring a lesson template',()=>assert.equal(layoutIssue('## Learning paths\nroute\n## Course video sources\nlink'),null));
  test('source-only course article requires learning content',()=>assert.ok(layoutIssue('## 課程影片來源\nlink\n## 參考資料')));
}
if(process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
if(process.argv.includes('--self-test')) await selfTest();
else {
  const names=courseNames(fs.readFileSync('src/utils/series.ts','utf8'));
  let checked=0,issues=0;
  for(const file of walk('src/content/posts')) {
    const {data,content}=matter(fs.readFileSync(file,'utf8'));
    if(![data.series,...(data.additionalSeries??[])].some(s=>s&&names.has(s.name)))continue;
    checked++;const issue=layoutIssue(content); if(issue){console.error(`${file}: ${issue}`);issues++;}
  }
  console.log(`Course source layout: ${checked} posts, ${issues} issue(s). This checks section order, not teaching quality.`);
  if(issues)process.exitCode=1;
}

}
