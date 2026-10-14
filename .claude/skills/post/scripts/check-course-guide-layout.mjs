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
// The lecture's own recording belongs in the intro or under its section, not inside the provenance block at the end.
export function playerIssue(content) {
  const status = content.match(/^\*\*(?:影片狀態|Video status)[：:].*$/m)?.[0] ?? '';
  if (!/已附影片|Videos included/.test(status)) return null;
  const players = content.split('\n').flatMap((line, i) => /^```youtube\s*$/.test(line) ? [i + 1] : []);
  const h = headings(content);
  const inSource = n => sourceHeadings.has(h.filter(x => x.line < n).at(-1)?.text);
  return players.length && players.every(inSource) ? `Line ${players[0]}: every player sits inside the provenance section; move the lecture recording to the intro or under its section (course-guide-contract.md「影片與正文的搭配」)` : null;
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
  const yt='```youtube\nurl: https://www.youtube.com/watch?v=cmNIMjPYdgM\ntitle: t\n```';
  test('rejects a lecture player buried in the provenance section',()=>assert.ok(playerIssue(`**影片狀態：已附影片。**\n## 概念\n解說\n## 課程影片來源\n${yt}\n## 參考資料`)));
  test('allows the player in the intro',()=>assert.equal(playerIssue(`**影片狀態：已附影片。**\n${yt}\n## 概念\n解說\n## 課程影片來源\nlink`),null));
  test('allows one player per section',()=>assert.equal(playerIssue(`**Video status: Videos included.**\n## Concept\n${yt}\ntext\n## Course video sources\nlink`),null));
  test('allows supplementary videos in the provenance section',()=>assert.equal(playerIssue(`**影片狀態：官方未列錄影，文末附補充影片。**\n## 概念\n解說\n## 課程影片來源\n${yt}`),null));
  test('ignores posts without players',()=>assert.equal(playerIssue('**影片狀態：僅附官方入口。**\n## 概念\n解說\n## 課程影片來源\nlink'),null));
}
if(process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
if(process.argv.includes('--self-test')) await selfTest();
else {
  const names=courseNames(fs.readFileSync('src/utils/series.ts','utf8'));
  // Player placement blocks only for files passed explicitly; site-wide it is counted until existing posts are migrated (Q-035).
  const files=process.argv.slice(2).filter(a=>!a.startsWith('--'));
  const audit=process.argv.includes('--audit');
  let checked=0,issues=0,pending=0;
  for(const file of files.length?files:walk('src/content/posts')) {
    const {data,content}=matter(fs.readFileSync(file,'utf8'));
    if(![data.series,...(data.additionalSeries??[])].some(s=>s&&names.has(s.name)))continue;
    checked++;const issue=layoutIssue(content); if(issue){console.error(`${file}: ${issue}`);issues++;}
    const player=playerIssue(content);
    if(player){if(files.length||audit)console.error(`${file}: ${player}`);if(files.length)issues++;else pending++;}
  }
  console.log(`Course source layout: ${checked} posts, ${issues} issue(s). This checks section order, not teaching quality.`);
  if(pending)console.log(`Pending migration (not blocking site-wide; blocking when a file is passed): ${pending} post(s) keep the lecture player inside the provenance section. Run --audit to list.`);
  if(issues)process.exitCode=1;
}

}
