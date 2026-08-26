---
title: "PR 審查怎麼交給 Claude Code：multi-agent 分析、REVIEW.md 與 ultrareview"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, code-review, github, ci]
lang: zh-TW
tldr: "GitHub PR 推上去後由一隊 agent 自動審查，平均 20 分鐘、每則約 15–25 美元，findings 以 inline comments 貼在問題行上；改動夠大時用 /code-review ultra 開雲端深審，5–10 分鐘回報每條都經獨立驗證的 bug，單次約 5–25 美元、Pro/Max 有 3 次免費。"
description: "拆解 Claude Code 的 GitHub PR 審查機制：multi-agent 平行分析與驗證流程、severity 分級、@claude review 觸發方式、REVIEW.md 客製化，以及 /code-review ultra 雲端深審的成本與適用規模。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 20
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-code-review-en)

[Claude Code](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) 能做的自動化裡，code review 是投資報酬率最穩的一種：輸入固定（一個 diff）、輸出可驗證（findings 對照程式碼）、而且每個 PR 都需要。這篇講它的兩條審查路線——掛在 GitHub PR 上自動跑的 Code Review managed service，以及在你自己 session 裡跑的 `/code-review` 指令和它的雲端加深版 `/code-review ultra`（ultrareview）。兩個功能目前都是 research preview，以下全依官方文件。

## 為什麼 code review 適合交給 agent

三個結構性理由。第一，agent 讀得完整：人類 reviewer 通常只看 diff 就下判斷，而 agent 能把改動放回整個 codebase 的脈絡——這個函式被誰呼叫、這個欄位在哪裡也有假設——所以抓得住跨檔案的迴歸。第二，它不受情緒和時間影響：下午五點推的 PR 和早上十點推的，得到同樣仔細的待遇，也不會因為「你上次也這樣寫」就放水。第三，它每個 PR 都跑：人的注意力是稀缺資源，reviewer 漏看一次是常態；agent 的價值正是把「每次都有人看」從期望變成預設。

代價是誤報和成本，這兩件事後面各有一節處理。

## 從 GitHub App 開始：設定與觸發

Code Review 是 Anthropic 端的 managed service，research preview 階段限 Team／Enterprise 方案，開啟 Zero Data Retention 的組織不提供。設定由 Owner 做：到 claude.ai/admin-settings/claude-code 安裝 Claude GitHub App、勾選要審的 repository，再為每個 repo 選觸發行為：

| 行為 | 何時跑 |
|------|--------|
| Once after PR creation | PR 開啟或 mark ready 時跑一次 |
| After every push | 每次 push 都重新審，修好 flagged 問題後自動 resolve thread |
| Manual | 只有留言 `@claude review` 才跑 |

任何模式下都能用留言手動觸發：`@claude review` 跑單次審查；`@claude review always` 會把 PR 訂閱到後續每次 push。注意 2026 年 7 月更新前，裸的 `@claude review` 也會訂閱，現在要明確寫 `always`。指令必須是 top-level comment、放在留言開頭，且 PR 得是 open 狀態——draft PR 也能用手動觸發，因為你明確要求了。

費用按 token 計，每則審查平均 15–25 美元，走 usage credits 另計、不吃 plan 內含額度，可在 admin settings 設每月上限。After every push 最燒錢，高流量 repo 建議先 Manual，挑重要的 PR 再 `@claude review always`。

## Multi-agent 審查怎麼運作

審查啟動時，多個 agent 在 Anthropic 基礎設施上平行分析 diff 與周邊程式碼，各自負責一類問題；接著一道驗證步驟把候選發現拿去對照實際程式行為，濾掉誤報；去重、按嚴重度排序後，以 inline comments 貼在出問題的那幾行，review body 放摘要。完全沒找到問題也會更新 check run 說明。整體平均 20 分鐘完成。

Findings 分三級：

| 標記 | 級別 | 意義 |
|------|------|------|
| 🔴 | Important | merge 前該修的 bug |
| 🟡 | Nit | 小問題，值得修但不擋路 |
| 🟣 | Pre-existing | 本來就在 codebase 裡，不是這個 PR 引入 |

每條 finding 都有可折疊的延伸推理區段，說明為什麼被標記、以及 Claude 怎麼驗證這個問題真的存在。每則留言預先掛好 👍👎，Anthropic 在 PR merge 後收回反應統計來調校 reviewer。

一個容易誤會的點：它**不擋 merge**。check run 一律以中性結論收場，branch protection rule 不會被它卡住；想在自家 CI 拿 severity 數字把關，官方文件提供了用 `gh` 加 jq 解析 check run output 的做法。

## ultrareview：把深審丟上雲端

`/code-review` 本身就能在本機審 diff：以背景 subagent 跑、不佔你的對話 context，effort level 從 `low` 到 `max` 換覆蓋率或信心度，`--fix` 直接把修法套進 working tree。改動夠大、想要更深一層時，加 `ultra`：

```text
/code-review ultra
```

Ultrareview 在 Claude Code on the web 的遠端沙盒裡開出一整隊 reviewer agents 平行找 bug，關鍵差異是**每一條回報都經過獨立重現與驗證**——所以結果集中在真 bug，不是風格建議。啟動前有確認對話框，列出審查範圍、剩餘免費額度和預估費用；典型的執行時間是 5 到 10 分鐘，期間可以繼續用 session 甚至關掉終端機，之後用 `/tasks` 追蹤。

幾個實務邊界：

- 需要 claude.ai 帳號登入；Amazon Bedrock、Google Cloud's Agent Platform、Microsoft Foundry 及開 ZDR 的組織不能用，此時 `/code-review ultra` 會退回本機審查。
- Diff 有大小上限：預設 500 個變更檔案、8,000 行變更。repo 大到打包不了時，改推 branch 開 draft PR、用 PR mode——遠端沙盒直接從 GitHub clone，不上傳你的本地 working tree。
- 計費走 usage credits：Pro／Max 各有一次性的 3 次免費，之後單次約 5–25 美元；Team／Enterprise 沒有免費額度。CI 或腳本裡用 `claude ultrareview` 子命令跑，它會等到結果出來再印到 stdout。

什麼規模值得開？官方文件的比較表給了分界：`/code-review` 用於迭代中的快速回饋，秒級到幾分鐘；ultra 用於「merge 前對大幅改動求安心」。一行修正開 ultra 是浪費；跨多檔的重構、認證邏輯改動、migration 這類壞了很難收拾的變更，才值得花那 5–25 美元和十分鐘。也可以拿 ultra 審隊友的 PR，approve 之前先過一遍。

## 解讀 findings：調校你的 reviewer

拿到 findings 之後，回覆 inline comment 不會讓 Claude 有所動作——要處理就直接改 code push；如果 PR 訂閱了 push-triggered 審查，下一輪會自動 resolve 已修好的 thread。

長期更重要的是讓它少報噪音。Code Review 會讀 repo 裡的兩個檔案：`CLAUDE.md` 的違規會被記成 nit 層級（而且是雙向的——如果你的改動讓某段 CLAUDE.md 過時了，它也會叫你更新文件）；`REVIEW.md` 則是只給審查用的指示，影響力更強。實際有用的調校包括：重新定義 Important 在這個 repo 的標準、給 nit 設數量上限（例如最多五條，其餘併入摘要）、跳過 generated code 和 lockfile、要求行為類主張附 `file:line` 引證才能發布。`REVIEW.md` 要保持短——太長會稀釋真正重要的規則。

## 跟 GitHub Actions 自動化的分工

Managed Code Review 管的是「每個 PR 都有人看」這一層；想把 Claude 塞進自己的 workflow——自訂觸發條件、審查之外順便做別的事——那是 [GitHub Actions 篇](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions)的主題，兩者不互斥。

## 參考資料

- [Code Review — Claude Code Docs](https://code.claude.com/docs/en/code-review) — managed PR 審查的設定、觸發方式、multi-agent 流程、severity 定義、計費與 `/code-review` 本機指令
- [Find bugs with ultrareview — Claude Code Docs](https://code.claude.com/docs/en/ultrareview) — `/code-review ultra` 雲端深審的運作方式、diff 上限、免費額度與計費、與本機版的比較表

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（Code Review 與 ultrareview 均為 research preview）。
