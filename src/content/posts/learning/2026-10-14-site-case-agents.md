---
title: "從零開始的資安獵人系列：寫作與審查管線個案研究"
date: 2026-10-14
category: learning
type: guide
tags: [series, writing-process, review, pi, governance]
lang: zh-TW
series:
  name: "教學文章怎麼寫"
  order: 29
draft: false
---
## 背景

本系列「教學文章怎麼寫」於 2026-10-14 完成第 28 篇，共 30 篇（含 order 0 總覽）。本個案研究說明本站如何利用 `pi` 代理完成寫作、審查與翻譯工作流，以及為什麼在 Claude 和 Codex 使用量週限達到上限後改用 `pi -ne -p --no-session`。

## 寫作流程

1. **先行規劃**：系列規劀定於 2026-10-15 前完成登錄，避免 `check:series-plan` 閘門擋送。每批最多 2 篇，寫出後停下等回覆，不接著寫下一批。

2. **寫作**：每篇中英兩版，使用 `pi` 翻譯與改寫，確保詞彙與句型一致。

3. **獨立審查**：使用 `pi` 進行 `post-verify`（句子對錯檢查）、 `post-review`（結構與內容檢視）與 `post-polish`（語氣與術語潤飾），三個節點均在 `.work/reviews/` 下完成，未合併成單一檔。

4. **歸因但書上限**：新增「但書與歸因不堆疊」規則（`.agents/skills/post/references/writing-guide.md#但書與歸因不堆疊`），每篇正文歸因標籤上限 3 處，超過檢查器 `check-process-leak.mjs` 會擋。本次提交前已對 5 篇學習文章進行修正，將每篇歸因標籤從 5–17 處減少至 1–3 處。

5. **published-post 修正**：已發佈篇的「Ask AI」行為描述與 Cloudflare「造訪」定義經查證後改為官方詞彙，並於 4 篇已發佈文章（中英雙版）套用。

## 關鍵決定

- **使用 pi 獨立review**：Claude (`claude-opus-5-5`) 與 Codex 週限/次數上限於 2026-10-16 19:00 與 2026-10-20 13:00 重置，所有審查/翻譯任務改用 `pi -ne -p --no-session` 避免衝突。
- **Cloudflare visit 定義糾正**：從非官方描述改為「Visits = A page view that originated from a different website or direct link; checks whether HTTP referer does not match hostname.」
- **Ask AI 說明修正**：不再描述為「fallback to backup answer」，改為「搜索站點文章 → 從檢索到的段落回答；若無可靠來源則說知識庫缺乏證據（不是一般知識）；草稿經 format/quality check 兩次失敗顯示『⚠️ 此答案可能不完整』」。
- **保持 o25 chat-log 說明準確**：保留「前 240 字保留在 step 記錄（rag_trace_steps、input_summary），可在 admin traces 頁面閱讀；若設定則完整問題/答案送 Langfuse」。

## 提交與繼續

- 本次 commit 加入 16 檔：5 篇新學習文章（中英）+ 4 篇已發佈文章修正（中英）。
- 送出後接續 order 29（個案研究）與 order 0（系列總覽），依 `check-process-leak` 規則保持每篇歸因標籤 ≤ 3 處。
---
