---
title: "定價追蹤｜Claude Sonnet 4 今天在 Bedrock 正式下架，region-lock 團隊遷移要多付 10%"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Claude Sonnet 4 在 Claude API 上已於 6/15 退役，今天（10/14）才輪到 Amazon Bedrock 進入 End-of-Life；官方建議替代的 Sonnet 4.6 base 價不變，但只要你用 region-locked endpoint 就會多付 10% premium。"
tldr: "Claude Sonnet 4（`anthropic.claude-sonnet-4-20250514-v1:0`）今天在 Amazon Bedrock 正式 EOL，比它在 Claude API 退役（2026-06-15）晚了整整 4 個月，之後任何呼叫都會直接失敗。官方建議替代 Claude Sonnet 4.6 在 global endpoint 上 token 價完全不變（input $3、output $15／MTok），但 Sonnet 4.6 屬於「4.5 之後」世代，region-locked／multi-region endpoint 要多收 10% premium——Sonnet 4 當年沒有這個規則，等於遷移本身不用錢，但你如果因合規需要鎖 region，帳單會悄悄漲一成。"
series:
  name: "AI Pricing Watch"
  order: 22
---

> 🌏 [English version](/posts/daily/2026-10-14-pricing-anthropic-claude-sonnet-4-bedrock-eol-en)

## 變更摘要

Claude Sonnet 4（`claude-sonnet-4-20250514`）這個模型代號其實已經死了兩次。第一次是 2026-06-15，在 Anthropic 自家 Claude API 上退役；第二次就是今天——Amazon Bedrock 的 lifecycle 政策讓它又多活了 4 個月，但 End-of-Life 日期正好落在 2026-10-14。AWS 官方的 Legacy 政策寫得很清楚：合作平台（Bedrock、Google Cloud）自己訂退役時程，不跟 Anthropic 的 API 時程走。這次真正值得記一筆的不是「模型關了」，而是官方建議的替代模型 Claude Sonnet 4.6 在 Bedrock 上 token 價完全沒變——除非你的團隊因為資料落地合規需要用 region-locked endpoint，那就會從「沒有這個收費項目」變成「多付 10%」。

## 前後對照

| 項目 | 舊（Claude Sonnet 4，Bedrock） | 新（Claude Sonnet 4.6，Bedrock，官方建議替代） | 變化 | 生效日 |
|---|---|---|---|---|
| Bedrock 狀態 | Legacy（2026-04-14 起）→ EOL | Active | 下架 | 2026-10-14 |
| Context window | 200K tokens | 1M tokens | 擴大 5 倍 | — |
| Global endpoint｜Input | $3.00/1M tokens | $3.00/1M tokens | 不變 | — |
| Global endpoint｜Output | $15.00/1M tokens | $15.00/1M tokens | 不變 | — |
| Region-locked／multi-region endpoint 加價 | 不適用（Sonnet 4 不分 global／regional，無此收費項目） | +10% premium | 新增收費項目 | 2026-10-14 起生效（隨遷移） |
| Region-locked endpoint｜Input（換算後） | $3.00/1M tokens | $3.30/1M tokens | ↑10% | 同上 |
| Region-locked endpoint｜Output（換算後） | $15.00/1M tokens | $16.50/1M tokens | ↑10% | 同上 |

Region 加價不是 Sonnet 4.6 單獨的規則——Anthropic 官方定價文件寫明這個 10% premium 適用於「Claude Sonnet 4.5（含）之後的所有模型」，Claude Opus 4.1 及更早的模型維持原本的計價結構。Sonnet 4 剛好卡在規則生效之前，所以它從沒有 region 加價這個選項；只要往後遷移到任何一個現行模型，用 region-locked endpoint 就一定會碰到這 10%。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），原本跑在 Claude Sonnet 4 上。

| | 舊（Sonnet 4，Bedrock） | 新（Sonnet 4.6，global endpoint） | 新（Sonnet 4.6，region-locked endpoint） |
|---|---|---|---|
| Input 成本/月（450M tokens） | $1,350 | $1,350 | $1,485 |
| Output 成本/月（150M tokens） | $2,250 | $2,250 | $2,475 |
| **合計** | **$3,600/月** | **$3,600/月（0%）** | **$3,960/月（↑10%，+$360）** |

如果你的部署沒有資料落地或合規要求、用的是預設的 global endpoint，這次遷移等於零成本——只是把模型換掉就拿到 5 倍的 context window。但如果你是金融、醫療這類被要求把推論流量鎖在特定地理 region 的團隊，遷移當下帳單就會從原本「沒得選」的單一價，變成每月多付 $360（以上述用量計）。

## 對開發者/企業的影響

### 誰最受益、誰受衝擊最大

用預設 global endpoint 的團隊幾乎零成本遷移，還白拿 200K → 1M 的 context window 升級，是這次變動最大的受益者。受衝擊的是過去因為合規而被迫用 region-locked endpoint、又剛好還沒把流量搬離 Sonnet 4 的團隊——他們不是被模型降效能逼著遷移,而是被「today 開始呼叫就失敗」的 EOL 大限逼著遷移，沒有緩衝期可以等到更便宜的定價窗口。

### 競爭格局影響

這次事件本身不改變跨廠商的價格排名,但凸顯一個容易被忽略的隱藏成本：

| 項目 | 說明 |
|---|---|
| Claude API（Anthropic 直營） | 無 region 加價，data residency 走獨立的 Data residency pricing |
| Bedrock／Vertex，Sonnet 4.5 之前 | 無 region／global 區分，單一價 |
| Bedrock／Vertex，Sonnet 4.5 及之後 | global 預設價，region-locked／multi-region +10% |

對正在比較「直接用 Claude API」還是「透過 Bedrock／Vertex 用 Claude」的團隊來說，這張表是個加分項——如果你本來就需要 region 鎖定但走的是 Claude API 的 data residency 選項，反而可能比 Bedrock 的 10% regional premium 更划算，值得重新拉一次報價比較。

### 行動建議

- 如果你還在呼叫 `anthropic.claude-sonnet-4-20250514-v1:0`：今天起請求會直接失敗，沒有寬限期，先確認 production 流量已經全部切到替代模型。
- 如果你用的是 global endpoint 且沒有合規限制：直接換成 Claude Sonnet 4.6，token 價不變、context window 變大，沒有理由不升級。
- 如果你因合規需要 region-locked endpoint：先算一次這 10% 的實際金額（用上面的公式），再決定要吃下這筆加價、還是改走 Claude API 的 data residency 定價評估是否更便宜。
- 如果你在用第三方閘道（LiteLLM、OpenRouter 之類）路由到 Bedrock：確認閘道設定裡還有沒有殘留指向 Sonnet 4 的 fallback 規則，EOL 之後這類 fallback 會直接拋錯而不是降級。

## 時效提醒

⚠️ **停用日期**：2026-10-14（今天）。Claude Sonnet 4（`anthropic.claude-sonnet-4-20250514-v1:0`）在所有 AWS region 下架，請求全面失敗。遷移指南：[Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)。

## 今日收穫

過去記錄的模型退役多半是「一個時間表、一個截止日」,但 Claude Sonnet 4 這次示範了同一個模型代號在不同平台有各自獨立的生命週期——Claude API 六月就關了,Bedrock 拖到十月,Google Cloud 可能又是另一個日期。更值得記住的是「價格不變」不代表「成本不變」：這次 token 單價完全沒動,但 endpoint 類型（global vs. regional）本身就是一個獨立的計價維度,舊模型不一定吃得到新規則,遷移時光比對 token 價格表不夠,還得確認你用的 endpoint 類型有沒有被悄悄納入新的計價政策。

## 參考資料

- [Model lifecycle (Legacy) | Amazon Bedrock 官方文件（EOL 日期原始資料）](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html)
- [Model deprecations | Claude Platform Docs（Claude API 退役時程）](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Pricing | Claude Platform Docs（Model pricing 與 Cloud platform pricing／region premium 規則）](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude on Amazon Bedrock (Legacy) | Claude Platform Docs（global vs. regional endpoint 說明）](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy)
- [Your AI Stack Has an Expiration Date: Model Sunsets Are the New Patch Tuesday | Security Boulevard](https://securityboulevard.com/2026/10/your-ai-stack-has-an-expiration-date-model-sunsets-are-the-new-patch-tuesday/)
