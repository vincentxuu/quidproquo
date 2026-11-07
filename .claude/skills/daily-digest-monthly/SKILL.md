---
name: daily-digest-monthly
description: "Monthly AI Agent report for quidproquo.cc/daily. Run after a calendar month ends: synthesizes the month's signals, daily posts and weekly reviews into a verdict-first report with month-over-month metrics, a review of last month's claims, corrections, and verifiable conditions for next month. Use when user says 月報 / monthly report / 產出 X 月月報."
---

# daily-digest-monthly

每月 1 日之後產出上一個自然月的月報。月報要回答：這個月什麼判斷改變了、哪些說法要打折、下個月看什麼。不是把日報重新排序。

格式依據見 `.work/research/ai-agent-monthly-report/research-note.md`。

## 1. 準備

```bash
git checkout main && git pull origin main
MONTH=YYYY-MM   # 上一個自然月
PREV=YYYY-MM    # 再上一個月
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)
ls src/content/posts/daily/ | grep -- "-ai-agent-monthly-${MONTH}\.md$" && echo 已產出 && exit 0
```

**月底前不准出刊。** 窗口寫死整個自然月；當月資料沒齊就不出，不要用部分窗口冠上月報標題。

## 2. 讀輸入

```bash
node .agents/skills/daily-digest-monthly/scripts/month-stats.mjs "$MONTH" "$PREV"
```

- 當月全部 `src/data/daily-signals/` 的 `relevance >= 0.9` 訊號（標題、日期、來源）
- 當月週回顧的 `tldr` 與「本週最重要的 5 件事」標題
- 上一期月報的「下月驗證」

列出缺 signals 的日期，寫進「方法與限制」。

## 3. 查證（寫之前）

- 主線用到的每個數字都打開原始來源。日報和 signals 只當線索，不當來源。
- **報導日不等於事件日。** signals 的 `_day` 是收錄日；Dots 收錄於 10/02，實際發表在 9/29 DevDay。寫日期前看來源。
- 分清「宣布」「報導」「洽談」「成交」。收購類訊號混著洽談和統計報導，算數前要清。
- 同一事件的數字前後不一時，寫最新版並說明變過。
- 查到本站已發佈內容有錯，記進更正節。
- 付費牆來源（FT、The Information）透過公開轉述取得時，寫明是轉述。
- 標題和結論不能比內文強。「上線」多半是預覽，要看開放範圍；外部攻擊、員工違規和 agent 越界是三件事，不要併成一句。
- 監管進度美歐分開查。寫「只到某階段」或「沒有裁罰」之前先搜反證，並寫明查到哪一天。

## 4. 結構（固定）

```markdown
## 一句話結論
## 月度指標
## 主線一到三：{變化本身，用一句完整判斷當標題}
## 判斷回顧
## 我們寫錯的
## {下月}要驗證的 N 件事
## 方法與限制
## 參考資料
```

- **一句話結論**：挑一個讀者這個月該做的動作，並說明為什麼是它。不要和 tldr 重複，頁首已經顯示 tldr。
- **月度指標**：去重後收錄量、日均、與上月比。表下要寫明這是本站收錄量，不是實際發生量。腳本去重併不起跨語言同事件，不准寫成「事件數」。若能引用外部資料佐證（附分子分母），列在主線裡。
- **主線**：固定三條，不湊數。每條含發生了什麼（附日期）、反證或打折處、一個具體動作。至少一條落回台灣讀者。
- **判斷回顧**：上期「要驗證的事」逐條回填 成立／部分成立／不成立／未定，附依據。第一期回顧當月週回顧的判斷。不准跳過沒中的。
- **我們寫錯的**：原文、更正、來源，第一欄連回原文。沒抓到就寫「本期未發現」並說明查了什麼範圍，不要宣稱全對。
- **下月驗證**：3–5 件，每件要能在下月底判定真假，附判定條件。不寫趨勢預言。
- **方法與限制**：窗口、母數、缺資料日期、去重限制、讀不到的來源、語言與地區偏誤、AI 參與方式。

術語第一次出現要有半句說明。主線標題只寫變化，但書留給「要打折的地方」，全文用同一個詞稱呼同一件事。長度 1,500–2,500 字。三條主線以外的事不放；要看全部的人去讀日報。

## 5. Frontmatter

```yaml
---
title: "AI Agent 月報 YYYY 年 M 月：{一句判斷}"
date: YYYY-MM-DD   # 實際出刊日
category: daily
type: digest
tags: [ai-agent, monthly, daily]
lang: zh-TW
description: "..."
tldr: "純文字，1–2 句"
series:
  name: "AI Agent 月報"
  order: N   # 2026-10 期 = 1，之後每月 +1
---
```

檔名：`src/content/posts/daily/${TODAY}-ai-agent-monthly-${MONTH}.md`，英文版加 `-en`，series name 為 `AI Agent Monthly Report`。

## 6. 審稿與提交

這個系列受 `check:series-plan` 管：commit 前必須有 `.work/reviews/<文章 slug>.md`，含 `## post-verify`、`## post-review`、`## post-polish` 三節，並連同文章一起 commit，否則 CI 擋部署。

1. 用獨立 agent 跑 `post-verify` 與 `post-review`，只給文章路徑，不給結論。
2. 修完跑 `post-polish`。
3. 依 `daily-digest-common` 的 Commit Epilogue 收尾（圖解、英文版、references、progress、verify、commit）。

## 品質檢查

- [ ] 窗口是完整自然月，出刊日在月底之後
- [ ] 指標表寫明是收錄量，並有比較期
- [ ] 每條主線有反證和動作
- [ ] 主線的每個數字都打開過原始來源
- [ ] 上期驗證條件逐條回填，沒中的也寫
- [ ] 更正節有內容，或寫明查了什麼範圍
- [ ] 下月驗證每件都能判定真假
- [ ] 揭露 AI 參與方式
