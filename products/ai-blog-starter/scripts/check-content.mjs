#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  發布前的護欄。
//  目的是「壞掉的時候講人話」，不是印一堆技術錯誤。
//  每次 build 之前會自動跑，有問題就擋下來。
// ─────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = 'src/content/posts'
const problems = []

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (extname(full) === '.md') out.push(full)
  }
  return out
}

function problem(file, what, howToFix) {
  problems.push({ file: relative('.', file), what, howToFix })
}

if (!existsSync(POSTS_DIR)) {
  console.error(`\n找不到文章資料夾 ${POSTS_DIR}，請確認檔案沒有被移動過。\n`)
  process.exit(1)
}

const files = walk(POSTS_DIR)

if (files.length === 0) {
  console.log('\n目前一篇文章都沒有。這樣也能建置，網站會是空的。\n')
}

const slugs = new Map()

for (const file of files) {
  const raw = readFileSync(file, 'utf8')

  if (!raw.startsWith('---')) {
    problem(
      file,
      '檔案最上面沒有設定區塊',
      '文章開頭要有一段用 --- 包起來的設定，至少要有 title 和 date。可以打開範例文章對照。',
    )
    continue
  }

  let data
  try {
    ;({ data } = matter(raw))
  } catch {
    problem(
      file,
      '最上面的設定區塊格式壞掉了',
      '常見原因是標題裡有冒號。把標題用雙引號包起來，例如 title: "咖啡：入門筆記"',
    )
    continue
  }

  if (!data.title || String(data.title).trim() === '') {
    problem(file, '沒有填標題', '在設定區塊加一行 title: 你的標題')
  }

  if (!data.date) {
    problem(file, '沒有填日期', '在設定區塊加一行 date: 2026-01-31（格式是 年-月-日）')
  } else if (Number.isNaN(new Date(data.date).getTime())) {
    problem(file, `日期看不懂：${data.date}`, '日期請寫成 2026-01-31 這種格式')
  }

  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    problem(
      file,
      '標籤的格式不對',
      '標籤要寫成 tags: [咖啡, 旅行] 這樣，用中括號包起來、逗號隔開',
    )
  }

  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    problem(file, '草稿設定的值不對', 'draft 只能填 true 或 false')
  }

  // 檔名重複會導致其中一篇被蓋掉
  const slug = file.replace(/^.*\//, '').replace(/\.md$/, '')
  if (slugs.has(slug)) {
    problem(
      file,
      `檔名跟另一篇文章重複了（${slugs.get(slug)}）`,
      '把其中一個檔案改成不同的名字，不然只有一篇會出現在網站上',
    )
  } else {
    slugs.set(slug, relative('.', file))
  }
}

if (problems.length === 0) {
  const published = files.length
  console.log(`\n檢查通過，${published} 篇文章沒有問題。\n`)
  process.exit(0)
}

console.error(`\n發現 ${problems.length} 個問題，網站先不會更新。修好之後再存一次就會自動重試。\n`)
for (const p of problems) {
  console.error(`  檔案：${p.file}`)
  console.error(`  問題：${p.what}`)
  console.error(`  怎麼修：${p.howToFix}\n`)
}
console.error('看不懂的話，把上面整段複製給 Claude，說「幫我修這個」。\n')
process.exit(1)
