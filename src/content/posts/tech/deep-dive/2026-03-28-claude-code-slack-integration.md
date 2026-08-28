---
title: "從 Slack 指派 coding 任務：Claude Code in Slack 與 Claude Tag 兩條路"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, slack, team-collaboration, ai-agent]
lang: zh-TW
tldr: "在 Slack @Claude 就能把 bug report 變成雲端跑的 Claude Code session。但現在有兩條路：Pro/Max 走原 Claude Code in Slack（每個 session 掛在個人帳號），Team/Enterprise 新設定或遷移則看 Claude Tag（組織共用身分、admin 管權限與用量）。先確認方案再設定，才不會裝錯。"
description: "Claude Code 的 Slack 整合指南：原 Claude Code in Slack 的安裝、路由模式與 session 流程，以及 Team/Enterprise 方案的替代產品 Claude Tag，含兩條路的差異對照與限制。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 29
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration-en)

bug report 不是出現在終端機，是出現在 Slack 頻道——隊友貼了重現步驟、錯誤截圖、討論串裡累積了半天的 context。這時候最有價值的動作不是自己複製貼上到終端機，而是直接在對話串裡 `@Claude` 一句「幫我查然後修掉」，讓它在雲端開一個 Claude Code session 跑完回報。這是[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)講的 agentic loop 換了一個入口：loop 還是同一個 loop，只是觸發點從終端機換成了團隊對話。

不過這件事現在變複雜了：Anthropic [正在為 Team 和 Enterprise 工作區退役原本的 Claude Code in Slack](https://code.claude.com/docs/en/slack)，改推獨立產品線 **Claude Tag**。所以動手設定之前，先分清楚你是哪種方案——兩條路的安裝方式、權限模型完全不同。

## 先分清楚：你是哪種方案

官方文件把界線畫得很明確：

- **Pro / Max**（個人方案）：[Claude Tag 不提供](https://code.claude.com/docs/en/claude-tag)，原本的 Claude Code in Slack **仍然是現行的設置路徑**。
- **Team / Enterprise**：新版 Slack 工作流程看 [Claude Tag](https://claude.com/docs/claude-tag/overview)；原本版本退役中。既有的 Slack app 和 `@Claude` handle 會保留，確切的切換日期要問你們的 Anthropic 業務窗口。

判斷方法很簡單：看你在 claude.ai 的方案頁。如果下面「設定步驟」照做卻一直失敗，先確認是不是已經被切到 Claude Tag 了。

## 路徑一：Claude Code in Slack（Pro/Max）

### 設定五步

1. **安裝 app**：由工作區管理員到 [Slack App Marketplace](https://slack.com/marketplace/A08SF47R6P4)（app ID `A08SF47R6P4`）按「Add to Slack」。
2. **連結帳號**：在 Slack 的 Apps 區打開 Claude，進 App Home 分頁按「Connect」，在瀏覽器完成驗證。
3. **設定 Claude Code on the web**：到 [claude.ai/code](https://claude.ai/code) 用同一個帳號登入，接上 GitHub 並授權至少一個 repo。跳過這步會遇到「Claude Code is not enabled for your account」——那不是權限問題，是你的帳號還沒有雲端環境，登入一次就會建立。
4. **選路由模式**：App Home 裡的 Routing Mode 有兩種——**Code only** 把所有 @mention 都導向 Claude Code；**Code + Chat** 由 Claude 判斷是 coding 任務還是一般問答，判斷錯了可以在該串按「Retry as Code」重試。
5. **邀請進頻道**：app 裝好不會自動進任何頻道，要在目標頻道輸入 `/invite @Claude`。它只在頻道作用（公開、私人都行），DM 裡叫不動。

### 實際跑起來長什麼樣

在頻道或討論串 @Claude 講 coding 任務之後：它會收集 context（討論串會讀整串、直接在頻道提及則看最近訊息）、自動選一個 repo、在 claude.ai/code 開 session，過程中把進度貼回 Slack。完成後 @你並附上摘要和按鈕：「View Session」看完整過程、「Create PR」直接開 pull request、「Change Repo」換錯選的 repo。

什麼時候該用哪個入口，官方也給了判準：context 已經在 Slack 討論串裡、想非同步丟任務、或隊友需要看到進度——用 Slack；要上傳檔案、需要開發過程中的即時互動、或任務又長又複雜——直接去網頁版。

安全模型是**使用者層級**的：每個 session 跑在自己的 Claude 帳號下，額度計入個人方案，只能碰自己連過的 repo。頻道就是存取控制的邊界——Claude 只回應有被邀請的頻道裡的 @mention，admin 靠管理它被邀進哪些頻道，就能控制誰用得到 Claude Code。

## 路徑二：Claude Tag（Team/Enterprise）

[Claude Tag](https://claude.com/product/tag) 是 Public Beta 的獨立 Slack 產品線：`@Claude` 以**組織的共用身分**在頻道裡工作，而不是任何一個人的帳號；存取權限由 admin 統一設定，頻道裡任何人都能把它 tag 進討論串指派任務。

對已經在用舊版的工作區，遷移文件在 claude.com 的〈Migrate from the earlier Claude in Slack〉。對 admin 來說最大的改變是權限從「每個人自己管」變成「組織統一管」：誰能用、能用哪些 repo、session 歸屬組織可見，都收進 admin 設定。頻道和討論串工作也不是吃個人額度，而是走組織的 usage balance 和 spend limit；DM 是例外，仍走發訊者自己的 claude.ai 帳號與額度。

有一個坑要先知道：如果你在 Claude Tag 頻道開 session 一直失敗，通常是因為頻道的雲端環境建在某人**個人帳號**下——Claude Code 會立刻拒絕執行，重試沒有用。解法是 Owner 到 admin settings 的 Cloud environments 頁重建一個**組織共用環境**，設為組織預設或指定給該頻道；不是 Owner 就把這段轉給 Owner。

## 兩條路的差異

| | Claude Code in Slack | Claude Tag |
|---|---|---|
| 方案 | Pro / Max | Team / Enterprise |
| @Claude 的身分 | 使用者個人帳號 | 組織共用身分 |
| 權限管理 | 各自連 repo、各自付額度 | Admin 統一設定，頻道工作走組織用量 |
| Session 歸屬 | 個人歷史（claude.ai/code） | 組織可見 |
| 現況 | 個人方案的現行路徑 | Team/Enterprise 的現行做法 |

一句話總結：個人用走第一條，團隊統一管理走第二條。差別不在功能多寡，在**身分和權限歸誰管**。

## 限制與注意

三個硬限制：repo 只支援 GitHub；每個 session 只能開一個 PR；使用者必須有 Claude Code on the web 存取權，否則 Claude 只會用一般聊天回應。

另外一個值得記住的警告來自官方文件本身：被 @ 的時候，Claude 會讀取對話 context 來理解任務，也可能遵循 context 裡其他訊息的指示——所以只在信任的 Slack 對話中使用它。這和所有 agent 入口相同的風險：入口越方便，prompt injection 的面積越大。

Slack 是 Claude Code 的 surface 之一，同家族還有瀏覽器端的 [Chrome 整合篇](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration)；想比較各種自動化觸發方式（GitHub Actions、排程），等系列後續的自動化叢集。

## 參考資料

- [Claude Code in Slack — Claude Code Docs](https://code.claude.com/docs/en/slack) — 安裝步驟、路由模式、session 流程、權限模型，以及 Team/Enterprise 退役公告與疑難排解
- [Claude Tag — Claude Code Docs](https://code.claude.com/docs/en/claude-tag) — Claude Tag 產品線定位、適用方案，與 claude.com 完整文檔的入口
- [Work with Claude Tag — Claude.ai Documentation](https://claude.com/docs/claude-tag/overview) — Public Beta 狀態、Team/Enterprise 適用範圍、頻道權限、usage balance 與 spend limit

## 更新紀錄

- 2026-08-29：審稿更新，校正 Team/Enterprise 過渡期措辭，補 Claude Tag beta、組織用量與 DM 邊界。
- 2026-08-26：初版，依 2026-08 官方文件撰寫（Team/Enterprise 退役舊版並導向 Claude Tag，Pro/Max 維持原路徑）。
