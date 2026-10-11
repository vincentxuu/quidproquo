import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import ts from 'typescript';

const baselinePath = '.agents/skills/post/references/course-title-legacy.json';
// Initial migration debt only; modifying this allowance is a governance decision.
const baselineHash = '60a0a18f53fc03e810913ace1c1a69440a25f8faad74c6fb837366f183afe964';

export function readBaseline(text) {
  if (createHash('sha256').update(text).digest('hex') !== baselineHash) throw new Error('Legacy title baseline changed; do not add exceptions to make the gate green');
  return JSON.parse(text);
}

// Parse the registry AST, not article/video title regexes or a second course list.
export function courseNames(source) {
  const names = new Map();
  const ast = ts.createSourceFile('series.ts', source, ts.ScriptTarget.Latest, true);
  const value = (node, key) => node.properties.find(p =>
    ts.isPropertyAssignment(p) && p.name.getText(ast).replace(/^['"]|['"]$/g, '') === key)?.initializer;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'SERIES_DEFINITIONS') {
      if (!node.initializer || !ts.isArrayLiteralExpression(node.initializer)) throw new Error('Series registry must be an array');
      for (const item of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(item)) throw new Error('Unsupported series registry entry');
        const category = value(item, 'category');
        if (!category || !ts.isStringLiteral(category) || category.text !== 'courses') continue;
        const slug = value(item, 'slug');
        const locales = value(item, 'names');
        if (!slug || !ts.isStringLiteral(slug) || !locales || !ts.isObjectLiteralExpression(locales)) throw new Error('Invalid course registry');
        for (const p of locales.properties) {
          if (!ts.isPropertyAssignment(p) || !ts.isStringLiteral(p.initializer)) throw new Error('Unsupported course name');
          names.set(p.initializer.text, slug.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (!names.size) throw new Error('No registered course names found');
  return names;
}

export function membershipKey(data) {
  return JSON.stringify([data.lang, [data.series, ...(data.additionalSeries ?? [])]
    .filter(Boolean).map(s => [s.name, s.order])]);
}

export function parseTitle(title, lang) {
  if (typeof title !== 'string') return { error: 'title missing' };
  const delimiter = lang === 'en' ? /\s+[|｜]\s+/ : /｜/;
  const parts = title.split(delimiter);
  if (parts.length !== 2 || !parts[0].trim()) return { error: 'Use 主題｜課程 第 N 堂 (English: Topic | Course Lecture N)' };
  const suffix = parts[1].trim();
  // A scope can combine real course activities; never invent a lecture number.
  const atomPatterns = lang === 'en' ? [
    ['lecture', /^Lectures? (\d+(?:\.\d+)?)(?:[–-](\d+(?:\.\d+)?))?$/],
    ['programming-assignment', /^Programming Assignments? (\d+)(?:[–-](\d+))?$/],
    ['written-assignment', /^Written Assignments? (\d+)(?:[–-](\d+))?$/],
    ['assignment', /^Assignments? (\d+)(?:[–-](\d+))?$/],
    ['week', /^Weeks? (\d+)(?:[–-](\d+))?$/],
    ['module', /^Modules? (\d+)(?:[–-](\d+))?$/],
    ['lab', /^Labs? (\d+)(?:[–-](\d+))?$/],
    ['tutorial', /^Tutorial(?: (\d+)(?:[–-](\d+))?)?$/],
    ['chapter', /^Chapters? (\d+)(?:[–-](\d+))?$/],
    ['part', /^Parts? (\d+)(?:[–-](\d+))?$/],
    ['overview', /^Course Overview$/], ['map', /^Course Map$/], ['topic', /^Topic Guide$/],
  ] : [
    ['lecture', /^第 (\d+(?:\.\d+)?)(?:[–-](\d+(?:\.\d+)?))? 堂$/],
    ['programming-assignment', /^程式作業 (\d+)(?:[–-](\d+))?$/],
    ['written-assignment', /^書面作業 (\d+)(?:[–-](\d+))?$/],
    ['assignment', /^作業 (\d+)(?:[–-](\d+))?$/],
    ['week', /^第 (\d+)(?:[–-](\d+))? 週$/],
    ['module', /^單元 (\d+)(?:[–-](\d+))?$/],
    ['lab', /^實驗 (\d+)(?:[–-](\d+))?$/],
    ['tutorial', /^助教課(?: (\d+)(?:[–-](\d+))?)?$/],
    ['chapter', /^第 (\d+)(?:[–-](\d+))? 章$/],
    ['part', /^第 (\d+)(?:[–-](\d+))? 部分$/],
    ['overview', /^課程總覽$/], ['map', /^課程地圖$/], ['topic', /^主題單元$/],
  ];
  if (lang !== 'en' && /第\s*\d+(?:[–-]\d+)?\s*講|\bL\s*\d+\s*[:：]/.test(title)) return { error: 'Remove legacy 第 N 講 / L N lecture label' };
  // Try each space as the course/scope boundary; scopes are closed grammar.
  for (let boundary = suffix.indexOf(' '); boundary !== -1; boundary = suffix.indexOf(' ', boundary + 1)) {
    const course = suffix.slice(0, boundary).trim();
    const atoms = suffix.slice(boundary + 1).split(lang === 'en' ? / \/ / : /／/);
    const scopes = atoms.map(atom => {
      for (const [role, pattern] of atomPatterns) {
        const m = atom.match(pattern);
        if (!m) continue;
        const numbers = m.slice(1).filter(x => x !== undefined).map(Number);
        const minimum = ['module', 'part', 'chapter'].includes(role) ? 1 : 0;
        if (numbers.some(n => n < minimum) || (numbers.length === 2 && numbers[1] < numbers[0])) return null;
        return { role, numbers };
      }
      return null;
    });
    if (course && scopes.every(Boolean)) return { course, role: scopes.map(s => s.role).join('+'), numbers: scopes.flatMap(s => s.numbers), scopes };
  }
  return { error: 'Course suffix must preserve lecture/assignment/week/module/lab/tutorial/part/overview/map/topic scope; Chinese uses 堂' };
}

export function legacyAllowed(record, baseline) {
  const original = baseline?.[record.file];
  return !!original && original.title === record.data.title && original.membership === membershipKey(record.data);
}

function identityCodes(name) {
  return [...name.matchAll(/\b(?:CS|EE|ECE|CME|MATH|STAT)\s*\d+[A-Z]*|\b\d{1,2}[.-]\d{2,}[A-Z]*/gi)]
    .map(m => m[0].replace(/[\s.-]/g, '').toLowerCase());
}

export function titleIssue(data, names) {
  const memberships = [data.series, ...(data.additionalSeries ?? [])].filter(s => s && names.has(s.name));
  if (!memberships.length) return null;
  const parsed = parseTitle(data.title, data.lang);
  if (parsed.error) return parsed.error;
  const actualCodes = identityCodes(parsed.course);
  const institution = text => text.match(/\b(?:CMU|Stanford|Harvard|MIT|Berkeley|NTU|NTHU|NCCU)\b/i)?.[0].toLowerCase();
  const matchingCourse = memberships.some(s => {
    const codes = identityCodes(s.name);
    const school = institution(s.name);
    return (!codes.length || actualCodes.some(c => codes.includes(c)))
      && (!school || institution(parsed.course) === school);
  });
  if (!matchingCourse) return 'Course suffix school/code does not match registered course membership';
  return null;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

export function checkRecords(records, names, baseline = {}, strict = false) {
  const issues = [];
  const parsedByFile = new Map();
  for (const record of records) {
    const issue = titleIssue(record.data, names);
    if (issue && (strict || !legacyAllowed(record, baseline))) issues.push({ file: record.file, title: record.data.title, issue });
    if (!issue && [record.data.series, ...(record.data.additionalSeries ?? [])].some(s => s && names.has(s.name))) {
      parsedByFile.set(record.file, parseTitle(record.data.title, record.data.lang));
    }
  }
  // Check real zh/en file pairs only. Never infer official lesson from series.order.
  for (const [file, parsed] of parsedByFile) {
    if (file.endsWith('-en.md')) continue;
    const pairFile = file.replace(/\.md$/, '-en.md');
    const other = parsedByFile.get(pairFile);
    if (other && (parsed.role !== other.role || JSON.stringify(parsed.numbers) !== JSON.stringify(other.numbers)
      || JSON.stringify(identityCodes(parsed.course)) !== JSON.stringify(identityCodes(other.course)))) {
      issues.push({ file, issue: `Bilingual course/scope mismatch: ${pairFile}` });
    }
  }
  return issues;
}

export function main(args = process.argv.slice(2)) {
  const audit = args.includes('--audit');
  const json = args.includes('--json');
  const files = args.filter(a => !a.startsWith('--'));
  if (args.some(a => a.startsWith('--') && !['--audit', '--json'].includes(a))) throw new Error('Unknown argument');
  const names = courseNames(fs.readFileSync('src/utils/series.ts', 'utf8'));
  const all = walk('src/content/posts').map(file => ({ file: file.split(path.sep).join('/'), data: matter(fs.readFileSync(file, 'utf8')).data }));
  const selected = files.length ? new Set(files.map(f => path.relative(process.cwd(), path.resolve(f)).split(path.sep).join('/'))) : null;
  if (selected && [...selected].some(file => !all.some(r => r.file === file))) throw new Error('Requested post not found');
  // Migration completed: historical snapshot is immutable evidence, never an active exemption.
  readBaseline(fs.readFileSync(baselinePath, 'utf8'));
  const baseline = {};
  const issues = checkRecords(all, names, baseline, audit || files.length).filter(r => !selected || selected.has(r.file)
    || selected.has(r.file.replace(/\.md$/, '-en.md')));
  if (json) console.log(JSON.stringify({ mode: audit ? 'audit' : 'gate', issues }, null, 2));
  else {
    for (const issue of issues) console.log(`${issue.file}: ${issue.issue}`);
    console.log(`${audit ? 'AUDIT (legacy included)' : 'Course title gate'}: ${issues.length} issue(s)`);
  }
  // Audit reports all titles; the strict default gate blocks all invalid titles.
  return audit ? 0 : issues.length ? 1 : 0;
}

export async function selfTest() {
  const { default: test } = await import('node:test');
  const { default: assert } = await import('node:assert/strict');
const names = new Map([['CMU 11-768 AI Agents 導讀', 'cmu-11-768'], ['Reading CMU 11-768 AI Agents', 'cmu-11-768']]);
const record = (file, title, lang = 'zh-TW', order = 13) => ({ file, data: {
  title, lang, series: { name: lang === 'en' ? 'Reading CMU 11-768 AI Agents' : 'CMU 11-768 AI Agents 導讀', order },
} });

test('uses actual registered courses, ignoring descriptions and other categories', () => {
  const source = `const SERIES_DEFINITIONS: SeriesDefinition[] = [
    {slug:'cmu',category:'courses',names:{'zh-TW':'課程',en:'Course'},descriptions:{en:'category: courses names: Bad'}},
    {slug:'other',category:'updates',names:{'zh-TW':'不套用',en:'Skip'}}];`;
  assert.deepEqual([...courseNames(source)], [['課程', 'cmu'], ['Course', 'cmu']]);
  assert.throws(() => courseNames('const x = [];'), /No registered/);
});

test('accepts topic-first Chinese/English lesson titles without deriving lesson from order', () => {
  assert.equal(titleIssue(record('x.md', '強化學習系統｜CMU 11-768 第 12 堂').data, names), null);
  assert.equal(titleIssue(record('x-en.md', 'RL Systems | CMU 11-768 Lecture 12', 'en', 15).data, names), null);
});

test('rejects course-first, 第N講, L12, missing topic, wrong course and inverted ranges', () => {
  for (const title of ['CMU 11-768 第 12 堂：強化學習系統', '系統｜CMU 11-768 第 12 講',
    '系統｜CMU 11-768 L12', '｜CMU 11-768 第 12 堂', '系統｜Stanford CS224N 第 12 堂', '系統｜Stanford 11-768 第 12 堂',
    '系統｜CMU 11-768 第 13–12 堂', '系統｜CMU 11-768 作業 -1']) {
    assert.ok(titleIssue(record('x.md', title).data, names), title);
  }
});

test('keeps ranges, homework, weeks, modules and overviews separate', () => {
  for (const scope of ['第 12–13 堂', '作業 2', '第 4 週', '單元 3', '課程總覽', '課程地圖']) {
    assert.ok(!parseTitle(`主題｜CMU 11-768 ${scope}`, 'zh-TW').error, scope);
  }
  for (const scope of ['Lectures 12–13', 'Assignment 2', 'Week 4', 'Module 3', 'Course Overview', 'Course Map']) {
    assert.ok(!parseTitle(`Topic | CMU 11-768 ${scope}`, 'en').error, scope);
  }
});

test('preserves official zero lectures, labs, tutorials, parts and compound scopes', () => {
  for (const [zh, en] of [
    ['第 0 堂', 'Lecture 0'], ['第 7.5 堂', 'Lecture 7.5'], ['作業 0', 'Assignment 0'], ['第 0 週', 'Week 0'], ['實驗 0', 'Lab 0'], ['助教課', 'Tutorial'],
    ['主題單元', 'Topic Guide'], ['第 3 部分', 'Part 3'],
    ['第 1–2 堂／實驗 0', 'Lectures 1–2 / Lab 0'],
    ['作業 4／第 2 部分', 'Assignment 4 / Part 2'],
    ['程式作業 1／書面作業 1', 'Programming Assignment 1 / Written Assignment 1'],
  ]) {
    const a = parseTitle(`主題｜CMU 11-768 ${zh}`, 'zh-TW');
    const b = parseTitle(`Topic | CMU 11-768 ${en}`, 'en');
    assert.ok(!a.error, zh); assert.ok(!b.error, en);
    assert.deepEqual(a.scopes, b.scopes);
  }
  assert.ok(parseTitle('Topic | CMU 11-768 Assignment -1', 'en').error);
  assert.ok(parseTitle('Topic | CMU 11-768 Lab 3–1', 'en').error);
});

test('legacy allowance requires exact original title, language, memberships and order', () => {
  const old = record('x.md', 'CMU 11-768 L12：舊標題');
  const baseline = { 'x.md': { title: old.data.title, membership: membershipKey(old.data) } };
  assert.equal(legacyAllowed(old, baseline), true);
  assert.equal(checkRecords([old], names, baseline).length, 0);
  assert.equal(checkRecords([old], names, baseline, true).length, 1);
  for (const changed of [record('new.md', old.data.title), record('x.md', `${old.data.title}修改`),
    record('x.md', old.data.title, 'en'), record('x.md', old.data.title, 'zh-TW', 14)]) {
    assert.equal(legacyAllowed(changed, baseline), false);
    assert.ok(checkRecords([changed], names, baseline).length);
  }
});

test('normalizes hyphen/dot course codes and supports additional series membership', () => {
  const data = record('x.md', '系統｜CMU 11.768 第 12 堂').data;
  data.additionalSeries = [data.series]; data.series = { name: 'Unrelated', order: 1 };
  assert.equal(titleIssue(data, names), null);
});

test('ignores ordinary non-course articles', () => {
  assert.equal(titleIssue({ title: '咖啡心得', series: { name: '咖啡', order: 1 } }, names), null);
});

test('rejects bilingual lesson/role mismatch with individually valid titles', () => {
  const zh = record('x.md', '系統｜CMU 11-768 第 12 堂');
  assert.equal(checkRecords([zh, record('x-en.md', 'Systems | CMU 11-768 Lecture 12', 'en')], names).length, 0);
  for (const suffix of ['Lecture 13', 'Assignment 12', 'Lectures 12–13']) {
    assert.equal(checkRecords([zh, record('x-en.md', `Systems | CMU 11-768 ${suffix}`, 'en')], names).length, 1);
  }
});

test('rejects editing the migration baseline to add new exceptions', () => {
  assert.throws(() => readBaseline('{}'), /baseline changed/);
});

}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.includes('--self-test')) await selfTest();
    else process.exitCode = main();
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
