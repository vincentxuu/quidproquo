---
title: "定價追蹤｜Google 收掉 Jules 編碼 Agent，訂閱價不跟著降"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google 已於 2026-10-29 公告 Jules 編碼 agent 停用，11/11 起唯讀、12/31 全面關閉；Google AI Pro／Ultra 訂閱價不受影響，內建的背景 coding agent 福利卻直接消失。"
tldr: "Google 的 Jules 編碼 agent 2026-11-11 起唯讀、12/31 全面停用，Google AI Pro（$19.99/mo）與 AI Ultra（$99.99/$199.99/mo）訂閱價都不變，內建的 Jules 任務額度卻直接消失。若要換 GitHub Copilot Pro（$10/mo）或 Cursor Premium（$30/mo）補上背景 coding agent 功能，訂閱總支出會上漲 50%–150%。"
series:
  name: "AI Pricing Watch"
  order: 35
---

> 🌏 [English version](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown-en)

## 變更摘要

Google 在 2026 年 10 月 29 日的 Jules 官方 changelog 貼出「Jules Turndown」公告：這個能連 GitHub repo、在雲端 VM 背景跑任務、產出 PR 的非同步編碼 agent 將於 12 月 31 日全面停用，11 月 11 日起先轉唯讀——而今天（11/14）這個唯讀窗口已經生效三天。這不是一次傳統的「舊價降新價」事件，但完全落在本欄「API sunset／deprecation 公告」的追蹤範圍內，而且牽動一筆容易被忽略的隱性成本：Jules 的付費額度是 Google AI Pro（$19.99/mo）與 AI Ultra（$99.99～$199.99/mo）訂閱內建的福利，不是獨立計價的 API，Google 停用 Jules 時完全沒有調整這兩個訂閱的月費——同一筆訂閱費，12/31 之後買到的東西變少了。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Jules 服務狀態 | 正常運作，可建立並執行新任務 | 全面停用 | 服務終止 | 2026-12-31 |
| Jules 唯讀窗口 | 無 | 僅能查看歷史 session，無法建立新任務 | 唯讀模式 | 2026-11-11（已生效） |
| Jules Free 方案（15 tasks/day） | 可用 | 停用 | 服務終止 | 2026-12-31 |
| Google AI Pro 月費（內含 Jules in Pro：100 tasks/day、15 concurrent） | $19.99/mo | $19.99/mo（Jules 福利移除） | 價格不變，福利縮水 | 2026-12-31 |
| Google AI Ultra 月費（內含 Jules in Ultra：300 tasks/day、60 concurrent） | $99.99～$199.99/mo | $99.99～$199.99/mo（Jules 福利移除） | 價格不變，福利縮水 | 2026-12-31 |

Google 在 changelog 裡把這次停用定性為「統一 agentic coding 工作」的一步，說從 Jules 學到的經驗會餵進 Antigravity（Google 的 agent-first 開發環境），但沒有給出功能對等的時間表，也沒說 Jules 的 session 歷史、記憶、排程任務能不能直接搬過去。已經推上 GitHub 的程式碼、分支、PR 不受影響，但帳號設定、環境變數、排程任務、記憶、setup script、session 的 prompt／計畫／日誌、程式碼補丁，都得在服務真正關閉前用 Jules Tools 自行匯出。

## 成本試算

**場景**：一個訂閱 Google AI Pro（$19.99/mo）、平時靠 Jules 背景跑修 bug、更新相依套件、補測試等任務的個人開發者，12/31 之後需要找一個新的背景 coding agent 接手。

| | 舊制：Google AI Pro + Jules | 新制 A：Google AI Pro + GitHub Copilot Pro | 新制 B：Google AI Pro + Cursor Premium |
|---|---|---|---|
| Google AI Pro 月費 | $19.99 | $19.99 | $19.99 |
| 背景 coding agent | $0（Jules 內建） | $10.00 | $30.00 |
| **合計/月** | **$19.99** | **$29.99（↑50%）** | **$49.99（↑150%）** |

這張試算故意不把「等 Antigravity 免費接手」算進去——Google 至今沒給出功能對等的時間表，不是一個可以現在拿來規劃預算的選項。就算最後 Antigravity 真的原班接手，現在到 12/31 之間的空窗期，仍然得先自己找替代方案。

## 對開發者/企業的影響

### 誰最受衝擊

靠 Jules Free 方案（15 tasks/day）跑業餘專案或側邊專案的人衝擊最直接——這個方案 12/31 直接消失，沒有付費就沒有替代品。付費訂閱者的處境比較隱蔽：Google AI Pro／Ultra 的月費單據上看不出任何變化，但實際可用的功能集縮水了，等於一次不會出現在任何官方「pricing change」公告裡的隱性漲價。

### 競爭格局影響

主要非同步／背景 coding agent 的入門付費門檻對照（USD/月）：

| 工具 | 入門付費方案 | 備註 |
|---|---|---|
| GitHub Copilot Pro | $10.00 | 以同步輔助為主，agent 模式仍在擴充 |
| Google AI Pro（曾含 Jules Pro） | $19.99 | Jules 2026-12-31 停用，Gemini 聊天與其他功能不受影響 |
| OpenAI ChatGPT Plus（含 Codex） | $20.00 | — |
| Cursor Premium | $30.00 | 背景 agent + 第三方模型（API 原價另計） |
| Google AI Ultra（曾含 Jules Ultra） | $99.99～$199.99 | Jules 福利同步消失 |
| Devin | $500.00 | 定位「全自動軟體工程師」 |

Jules 消失後，$10～$20 這個價位帶（Copilot Pro、ChatGPT Plus/Codex）成了最直接的替代選項；但這兩家工具目前都不是純粹的「指派任務、背景跑完、產出 PR」模式，實際替代體驗需要重新適應。

### 行動建議

- 若訂 Google AI Pro／Ultra 主要是為了 Jules：11/11 已經進入唯讀，現在就用 Jules Tools 把要保留的 session、記憶、排程任務、setup script 匯出，不要等到 12/31 前一刻。
- 若需要持續的背景 PR workflow：先去試用 GitHub Copilot coding agent 或 Cursor 的 background agent，不要賭 Antigravity 會在期限前原班接手——Google 沒有給出任何功能對等的承諾日期。
- 若訂閱 Google AI Pro／Ultra 主要是為了 Gemini 聊天、Flow、儲存空間等其他功能：這次停用對你沒有實質影響，不用急著重新評估訂閱。

## 時效提醒

⚠️ **唯讀生效**：2026-11-11（已生效）。無法建立或執行新任務，僅能查看既有 session。
⚠️ **停用日期**：2026-12-31。Jules 服務全面關閉，GitHub 上已存在的程式碼／分支／PR 不受影響，但帳號設定、環境變數、排程任務、記憶與 session 歷史需在此之前用 [Jules Tools](https://jules.google/docs/usage-limits/) 自行匯出。

## 今日收穫

多數「API／服務停用」報導只盯著「什麼時候關」，但這次更值得記一筆的是：Google 完全沒有把 Jules 消失反映到 Google AI Pro／Ultra 的訂閱定價上——同一筆月費，12/31 之後買到的東西變少了。追蹤「免費內建在訂閱裡」的功能時，功能縮水本身就是一種隱性漲價，它不會出現在任何官方的 pricing change 公告裡，只會出現在你重新盤點訂閱內容的那一刻。

## 參考資料

- [Jules Turndown（官方 changelog，2026-10-29）](https://jules.google/docs/changelog/2026-10-29/)
- [Limits and Plans | Jules（官方方案與額度頁）](https://jules.google/docs/usage-limits/)
- [Google AI Pro & Ultra 訂閱頁（官方定價）](https://gemini.google/subscriptions/)
- [Google to Shut Down Jules AI Coding Agent in December 2026 — TimesOfAI](https://www.timesofai.com/news/google-jules-antigravity/)
- [Google's Jules shuts down December 31: 7 days left to export — dev.to](https://dev.to/piekwerk/googles-jules-shuts-down-december-31-7-days-left-to-export-your-coding-agents-memories-and-setup-5oi)
