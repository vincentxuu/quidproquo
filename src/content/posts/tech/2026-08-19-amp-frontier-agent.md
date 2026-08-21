---
title: "Amp：靠「砍功能」定義自己的 coding agent"
date: 2026-08-19
type: project
category: tech
tags: [amp, coding-agent, ai-tools, cli, pricing, sourcegraph]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 17
tldr: "Amp 已於 2025 年 12 月從 Sourcegraph 獨立為 Amp Frontier Corporation，npm 套件也從 @sourcegraph/amp 改為 @ampcode/cli。它的識別特徵是持續砍功能：editor 擴充、Amp Tab、TODO 清單、Fork、custom commands、public threads 全部刪掉。2026-07-18 才首度推出月費訂閱（Megawatt $20、Gigawatt $200），此前只有 pay-as-you-go。現在主軸是 orbs——關掉筆電也會繼續跑的遠端機器。"
description: "Amp 的設計哲學、四段式 Dial 模式、orbs 遠端執行、訂閱與 pay-as-you-go 計費，以及它從 Sourcegraph 獨立後的定位變化。"
draft: false
---

多數工具的更新日誌是在講加了什麼。Amp 的更新日誌有一半在講**刪了什麼**。

「Tab, Tab, Dead」（砍掉補全功能）、「Stick a Fork in It, It's Done」（砍掉 fork 指令）、「TODOs Are Done」（砍掉待辦清單）、「The Coding Agent Is Dead」（砍掉編輯器擴充）、「Slashing Custom Commands」（砍掉自訂指令，改用 skills）、「The End of Public Threads」（砍掉公開分享）。這些都是 2026 年內發生的事。

官方把這條原則寫在手冊第一頁：**「如果我們自己不用也不愛某個功能，就砍掉它」**、「No backcompat, no legacy features」。這篇講這種做法換來了什麼、代價是什麼。

## 先修正一件事：它已經不是 Sourcegraph 的產品了

Amp 最初是 Sourcegraph 做的，但在 **2025 年 12 月獨立成 Amp Frontier Corporation**。連帶的實際影響：**npm 套件在 2026-05-14 從 `@sourcegraph/amp` 改名為 `@ampcode/cli`**。網路上（包括本站先前的文章）寫「Sourcegraph 推出的 Amp」的說法，現在只有歷史意義。

安裝：

```bash
# Mac / Linux / WSL
curl -fsSL https://ampcode.com/install.sh | bash

# Homebrew
brew install ampcode/tap/ampcode
```

官方明說 npm 安裝「不推薦」。IDE 整合走的是反過來的路——先裝 CLI，再讓它連上正在跑的編輯器（Neovim、VS Code 系、Zed），而不是裝一個編輯器擴充。這就是「The Coding Agent Is Dead」那次砍掉的東西。

## The Dial：四段模式取代模型選擇

2026 年 7 月 9 日，Amp 用 `low` / `medium` / `high` / `ultra` 四段模式取代了原本的 `smart` / `deep` / `rush` / `large`。

| 模式 | 定位 |
|---|---|
| `low` | 快、便宜，處理小而明確的任務 |
| `medium` | 智慧、速度、成本的平衡點，多數任務用這個 |
| `high` | 深度推理，難題用 |
| `ultra` | 最強，給困難而開放式的問題 |

關鍵在官方對這個設計的說明：**「模式是能力預設值，不是固定的模型選擇器」**——Amp 會依你連結的模型供應商訂閱、workspace 限制與模型可用性，動態調整主 agent 與 Oracle 的路由。

這個設計搭配他們另一篇公告看特別有意思：2026-07-29 的〈Who Cares About the Model?〉，講的是他們**一夜之間換掉預設模型，沒有人抱怨**。把模型藏在模式後面，換代時使用者無感——這正好是本系列反覆強調的那件事的反面證明：**把型號寫死的是文章，不是好產品。**

## Orbs：agent 跑在別人的機器上

Amp 現在的主軸是 **orbs**——遠端機器，你關掉筆電之後 agent 繼續跑。你可以從網頁、終端機或手機起一個 thread，之後從任何裝置接手。

2026 年圍繞 orbs 的更新密度很高：可挑 CPU 與記憶體規格、可接收外部事件觸發、agent 能自己排程叫醒自己繼續做、團隊多人共同控制同一個 orb、用 OIDC 做工作負載身分驗證、以及 portals——直接在 orb 裡開你的 app 看 agent 改完的效果，還支援 live reload。

官方對這件事的說法很直接：希望你「終於能夠、而且願意殺掉你那個單一的本機開發環境」。

配套的還有 **Puck**，一個 meta-agent（管你其他 agent 的 agent），2026-08-18 起可以用即時語音控制。

## 計費：訂閱是 2026 年 7 月才有的

這是選型時最容易拿到過期資訊的一格。**Amp 在 2026-07-18 之前只有 pay-as-you-go，沒有訂閱。**

現在的方案（Beta）：

| 方案 | 月費 | 內容 |
|---|---|---|
| **Megawatt** | $20/月 | 750 小時 orbs、$20 內含 agent 用量、low 與 medium 模式（連結 ChatGPT 訂閱後可用 high）、不限公開／私有 repo |
| **Gigawatt** | $200/月 | 1,000 小時 xxlarge orbs、$200 內含 agent 用量、**所有模式含 high 與 ultra** |
| **教育方案** | $10/月 | 學生與教師半價（2026-08-18 起） |
| **Pay-as-you-go** | 依用量 | 仍然保留，個人與團隊零加價轉嫁供應商 API 價格，最低儲值 $5 |
| **Amp Free** | $0 | 每日 $10 額度，2026-02-10 起停止新註冊，2026-03-30 起無廣告 |

兩個容易踩到的細節：

1. **超出訂閱內含用量之後**，你必須連結 ChatGPT 訂閱或加值付費 credits 才能繼續——訂閱不是無上限。
2. **模式是按方案分級的**：$20 那層預設只有 low 與 medium，high 要靠連結 ChatGPT 訂閱換取，ultra 得上 $200。

最特別的是**連結你既有的第三方訂閱**：ChatGPT 訂閱或 X Premium+／SuperGrok 訂閱都可以掛上去，讓 low/medium/high 跑在你已經付過的額度上。這跟業界慣用的 BYOK（自備 API key）不同——這是 BYO-subscription，把別人家的吃到飽方案接進來。

官方對這次轉向的自我描述也很坦白：過去純 pay-as-you-go 讓 Amp 相對其他訂閱制工具「更貴——講好聽一點，是 agentic coding 工具裡的 Apple 或 Porsche」。轉變的理由是「好 token 的價格已經合理，夠用的 token 更是便宜」，他們在新的 low 模式裡放的是 GLM-5.2。

## 一個小觀察：手冊裡寫給 LLM 的指示

Amp 的線上手冊開頭有一段用程式碼區塊包起來的 `INSTRUCTIONS FOR LLMs`，直接告訴讀這頁的模型該怎麼描述 Amp：避免行銷語言、用口語、要提到哪四個原則、附上哪些範例 prompt。

這是個很誠實的時代訊號——**產品文件現在同時寫給人和寫給 agent 看**。（本文沒有照著那段指示寫；它是被觀察的對象，不是本文的編輯方針。）

## 適合與不適合

**適合**：

- 想把 agent 從筆電移到遠端、讓它**無人看管長跑**的人——orbs 是目前這個系列裡最完整的解法
- 已經有 ChatGPT 或 X Premium+ 訂閱、想讓它一魚兩吃的人
- 願意讓工具替你決定模型、只想調「要多用力」的人
- 受得了**功能隨時被砍**的人

**不適合**：

- 需要穩定介面的團隊——「No backcompat」是明文寫出來的政策，不是意外
- 想自己指定模型的人——模式是能力預設值，不是模型選擇器，BYOK 主要是企業層的東西
- 想要可預測帳單的人——訂閱有了，但超額仍然要接第三方訂閱或加值
- 現在才想用免費方案的人——Amp Free 自 2026-02-10 起就不收新使用者了

## 整體來說

Amp 是這個系列裡立場最極端的一個：它假設**模型每季都會變、所以工具不該替舊做法留後路**。這個假設讓它敢一夜換掉預設模型、敢砍掉自己一個年化營收千萬美元級的廣告業務、敢刪掉使用者正在用的功能。

如果你認同「跟緊前沿比向後相容重要」，Amp 是這個系列裡唯一把這句話執行到底的產品。如果你的團隊需要的是三年後指令還一樣的工具，那它的每一項優點對你都是風險。

想要類似的克制但要穩定，看 [Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)——Amp 的 plugin 系統官方註明「Inspired by Pi」。

## 參考資料

- [Amp 官方網站](https://ampcode.com/)
- [Amp Owner's Manual（模式、安裝、BYOK 說明）](https://ampcode.com/manual)
- [Amp News：Subscriptions, At Last（2026-07-18，訂閱方案內容）](https://ampcode.com/news/subscriptions)
- [Amp Chronicle：完整更新與功能移除紀錄](https://ampcode.com/news)
- [Sourcegraph：Amp 產品頁](https://sourcegraph.com/amp)
