# 寫稿 agent 共用規格（認識 benchmark 系列）

你負責寫系列中的一篇，中英兩版，並完成三份審稿紀錄。不 commit、不 push、不改別篇文章、不改 `src/utils/series.ts`（已登錄）。

## 必讀（動筆前全部讀完）

1. 專案 post skill：`/Users/vincent/Work/study/quidproquo/.agents/skills/post/SKILL.md`，以及它指到的 `references/writing-guide.md`、`references/frontmatter-schema.md`、`references/anti-shortcuts.md`、模板 `templates/tech-deep-dive.md`
2. 系列規劃表：`/Users/vincent/Work/study/quidproquo/.work/series-plans/understanding-benchmarks.md`（讀你那篇的範圍卡、斷崖處理、站內前置知識連結、讀不到的 ✉️ 表）
3. 研究筆記：`/Users/vincent/Work/study/quidproquo/.work/research/understanding-benchmarks/research-note.md`（尤其「跨批共通的引用規則」）
4. 你那篇範圍卡列的來源批次抽取紀錄：`/Users/vincent/Work/study/quidproquo/.work/research/understanding-benchmarks/extracts/<批次>.md`
5. 要畫圖時先讀 diagram skill：`/Users/vincent/Work/study/quidproquo/.agents/skills/diagram/SKILL.md`

## 寫作規則（重點，細節以上面檔案為準）

- 數字只能用抽取紀錄裡標 ✅ 且附原文句的；附對照條件。抽取紀錄標了但書的（「不能寫成…」「要附版本」）照做。不從記憶補數字。
- 查證過程不寫進正文（日期核對、404、沒查到、「經查證」）；正文只寫結果與讀者用得到的限制。
- 但書不堆疊；不寫「這是我的判斷」這類歸因句。
- 每個第一次出現的專名（論文、benchmark、工具、站上文章）都要 inline 超連結。站上既有文章用 `/posts/<category>/<檔名去 .md>` 連結。
- zh-TW 寫完照 writing-guide 的硬性替換表掃中國用語。
- 不用 emoji；需要勾叉用站上 shortcode 或 ✓。
- 中文版開頭放 `> :globe: [English version](/posts/ai/<檔名>-en)`，英文版放 `> :globe: [中文版](/posts/ai/<檔名>)`。
- frontmatter：`date: 2026-11-24`、`category: ai`、`lang`、`type: deep-dive`、`tldr`（純文字）、`description`、`tags`（先 `ls src/content/posts/ai/` 與 grep 既有 tag，沿用 `benchmark`、`llm-evaluation` 這類已有的，不要造同義詞）、`series: { name: "認識 benchmark", order: N }`（英文版 name 用 `Understanding AI Benchmarks`）。
- 文末 `## 參考資料`／`## References`，列實際用到的一手來源。

## 驗證（兩個檔案都要跑，全綠）

```bash
cd /Users/vincent/Work/study/quidproquo
pnpm check:references
pnpm lint
pnpm check:tw src/content/posts/ai/<中文檔>.md
node scripts/check-process-leak.mjs src/content/posts/ai/<中文檔>.md src/content/posts/ai/<英文檔>.md
bash .agents/skills/post-polish/scripts/register-scan.sh src/content/posts/ai/<中文檔>.md
```

有 diagram 區塊時，中英兩版各跑 `pnpm exec tsx scripts/diagram-preview.ts <檔案> --out /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/diagram-<slug>`，全部 ✓，並用 Read 打開淺色、深色、手機三張截圖看過。

不要跑 `pnpm astro check`、`pnpm test`、`pnpm build` 或任何測試（使用者規定本機測試要先取得同意）。

## 審稿（三份，依序）

寫完後依序用 Skill 工具呼叫 `post-verify`、`post-review`、`post-polish`，參數給中英兩個檔案路徑；照各自結論修稿。把三份結論與修了什麼寫進 `/Users/vincent/Work/study/quidproquo/.work/reviews/<中文檔名去 .md>.md`，三節標題固定為 `## post-verify`、`## post-review`、`## post-polish`。post-verify 要回到抽取紀錄或原文核對每個數字。

## 回報

最後回覆只要：兩個檔案路徑、審稿紀錄路徑、各驗證指令結果一行、你沒能處理或需要主對話決定的事。不要貼文章內容。
