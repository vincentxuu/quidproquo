---
title: "OpenClaw 模型進階：容錯的兩階段、冷卻的真實數字，與 Prompt Caching"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, model-failover, prompt-caching, token-usage, cooldown]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 8
tldr: "OpenClaw 的容錯是兩階段：先在同一供應商內輪替 auth profile，再換模型。但真正決定行為的是「這個模型是誰選的」——你手動用 /model 選的模型是嚴格的，失敗就報錯，不會偷偷用別的模型回答你。"
description: "OpenClaw 的模型容錯機制：兩階段 failover、選擇來源決定的嚴格度、冷卻與帳務停用的實際規則、哪些錯誤會推進 fallback，以及 Prompt Caching 的設定與各供應商差異。"
draft: false
---

上一篇講怎麼選模型與供應商，這篇講**它壞掉的時候會發生什麼**，以及怎麼讓它便宜一點。

## 兩階段容錯

失敗處理分兩層，順序固定：

1. **Auth profile 輪替** — 在當前供應商內換一組憑證
2. **Model fallback** — 換到 `agents.defaults.model.fallbacks` 的下一個模型

關鍵是第二層有一個很多人沒注意到的性質：**fallback 是 turn-local 的**。這一輪用 fallback 回答，下一輪會重新從你選定的 primary 開始，不會把 fallback 記成新的選擇。系統只保存「通知狀態」，好讓 `/status` 和轉換提示能區分「你選的模型」與「實際回答的模型」。

## 誰選的模型，決定它嚴不嚴格

這是整篇最值得記住的一段。同一個 `provider/model`，來源不同、行為就不同：

| 來源 | 行為 |
|---|---|
| 設定檔的預設 primary | 正常起點，會走 `fallbacks` 鏈 |
| Agent 的 primary（`agents.entries.*.model`）| **嚴格**，除非那個 agent 自己也寫了 `fallbacks` |
| 自動 fallback | 暫時的恢復狀態，每 5 分鐘回頭探測原本的 primary，恢復就清掉 |
| **使用者的 session 選擇** | **精確且嚴格**。`/model`、模型選擇器、`sessions.patch` 都算。選定的模型若在產出回覆前失敗，OpenClaw 會**回報失敗，而不是用另一個模型回答你** |
| Cron 的 `--model` | 是那個工作的 primary，仍走設定的 fallbacks，除非工作自帶 `fallbacks`（`[]` 就是強制嚴格）|

這個設計是對的：你手動指定了模型，通常是為了得到那個模型的行為；靜默換成別的模型會讓結果不可信。舊 session 裡沒有 `modelOverrideSource` 的紀錄也一律當成使用者覆寫，就是為了不把明確的舊選擇偷偷轉成 fallback 行為。

## 冷卻的實際數字

一般失敗（非帳務、非永久認證失敗）的冷卻按該 profile 近期錯誤次數遞增：

| 第幾次失敗 | 冷卻 |
|---|---|
| 第 1 次 | 30 秒 |
| 第 2 次 | 1 分鐘 |
| 第 3 次以後 | 5 分鐘（上限）|

計數器會在該 profile 的失敗視窗過去後重置。狀態存在每個 agent 的 SQLite `usageStats` 裡（`lastUsed`、`cooldownUntil`、`errorCount`）。

**帳務失敗走的是另一條路。** 「餘額不足」「credit 太低」這類通常不是暫時性的，所以 OpenClaw 不給短冷卻，而是把整個 profile 標成 **disabled**（較長的退避），直接輪到下一個 profile 或供應商。

這裡有個分類細節值得知道：**不是每個帳務錯誤都是 402，也不是每個 402 都算帳務**。明確的帳務文字即使供應商回 401／403 也留在帳務車道；反過來，暫時性的用量視窗與組織支出上限錯誤（「本週用量已用盡」「日限額已達，明天重置」）會被歸類成 `rate_limit`，走短冷卻而不是長停用。

速率限制的冷卻還可以是**模型層級**的：失敗模型 id 已知時會記 `cooldownModel`，同供應商的其他模型仍可嘗試；但帳務／停用視窗會擋住整個 profile 的所有模型。

## 哪些錯誤會推進 fallback

會推進的：認證失敗、速率限制與冷卻耗盡、overloaded／供應商忙碌、逾時形狀的失敗、帳務停用，以及還有候選時的其他未辨識錯誤。

**不會推進的**才是重點：

- **格式／無效請求錯誤**通常是終端錯誤——同樣的 payload 重送只會再失敗一次，所以直接顯示給你看，不輪替 auth profile
- **context 溢出錯誤**（`request_too_large`、輸入超過最大 token 數）留在 compaction／retry 邏輯裡處理，不當成供應商故障
- 不是逾時／failover 形狀的明確中止

速率限制那個桶子比單純的 `429` 寬得多，還包含 `Too many concurrent requests`、`ThrottlingException`、`concurrency limit reached`、`resource exhausted`，以及「本週限額已達」這類週期性用量訊息。

## Overload 的特別待遇

供應商過載和速率限制比帳務冷卻處理得更積極：預設只允許**一次**同供應商的 auth profile 重試，然後就直接換下一個 fallback 模型，不等。

如果整條候選鏈**只因為過載**而全部耗盡，回覆執行器會在同一輪重試整條鏈，最多 10 次。退避從 2.5 秒開始、倍增到 30 秒上限。而且有個保護：**整輪重試只在工具執行或助理輸出開始之前允許**，避免過載發生在可觀察的動作之後、重試造成重複的變更或重複訊息。

等待滿 30 秒之後會發一次暫時性狀態通知，讓你不會對著空白畫面乾等：

```text
The AI service is temporarily overloaded. I'm still retrying; this may take a few minutes.
```

還有一個容易踩到的坑：某些供應商 SDK 會照著 `Retry-After` 睡很久才把控制權還給 OpenClaw。對 Stainless 系的 SDK（Anthropic、OpenAI），OpenClaw 預設把 SDK 內部的等待**壓在 60 秒**，超過就立刻把可重試的回應交出來，讓上面這套 failover 有機會跑。要調整用 `OPENCLAW_SDK_RETRY_MAX_WAIT_SECONDS`。

## 憑證存在哪裡

這點在 3 月之後改了，而且改得很重要：

- 機密與執行期的 auth 路由狀態存在 **`~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`**
- 設定檔裡的 `auth.profiles` / `auth.order` **只有中繼資料與路由，不含機密**
- 舊的 `credentials/oauth.json`、`auth-profiles.json`、`auth-state.json`、每個 agent 的 `auth.json` **只由 `openclaw doctor --fix` 匯入**

最後一條的行為值得強調：**執行期對受影響的 agent 是 fail closed 的**——在帶憑證的舊檔案被遷移之前，它會直接失敗，絕不靜默匯入或回退。所以升級後如果某個 agent 突然不能用，先跑 `doctor --fix`。

憑證有三種型別：`api_key`、`oauth`（含 access／refresh／expires，部分供應商還有 projectId 或 enterpriseUrl），以及 `token`——靜態的 bearer 型 token，**OpenClaw 不會幫它更新**，用在 `aws-sdk` 這類憑證鏈模式。

## 輪替順序與 session 黏著

同一個供應商有多組 profile 時，沒設 `auth.order` 就用這個輪替順序：

1. **profile 型別**：OAuth → 靜態 token → API key
2. **OAuth 內部**：access token 目前可用的排在過期的前面（過期的仍保留資格，好讓 runtime 在沒有可用同儕時去更新它）
3. **`usageStats.lastUsed`**：同一層內最舊的優先
4. 冷卻／停用的移到最後，依最快到期排序

**Session 黏著**是為了 cache 效率：自動選定的 auth profile 會被釘在該 session 上，不是每次請求都輪替。只有 session reset（`/new`、`/reset`）、compaction 完成、或該 profile 進入冷卻／停用時才可能換。

手動用 `/model …@<profile> -s` 選的是**使用者釘選**，它能活過 `/new`、`/reset`、session 輪替、compaction 和冷卻視窗。那個 profile 在冷卻時，OpenClaw 會暫時用同供應商的下一個，但**不會取代你釘的那個**，冷卻過去就回來。

要注意的分界：auth 輪替不會放寬模型選擇。明確的使用者 provider／model 選擇在同供應商的 auth profile 全部耗盡之後，仍然是回報失敗。

### Codex 訂閱 + API key 備援

OpenAI 的 auth 和 runtime 是分開的，所以可以做這件事：`openai/gpt-*` 一直留在 Codex harness 上，但憑證在訂閱 profile 和 API key 備援之間輪替。

```json5
{
  auth: {
    order: {
      openai: ["openai:user@example.com", "openai:api-key-backup"],
    },
  },
}
```

訂閱撞到 Codex 用量上限時，OpenClaw 會記下 Codex 給的確切重置時間、換下一個排序的 profile，**而且整個過程留在 Codex harness 裡**。重置時間過了，訂閱 profile 就重新有資格。

## Prompt Caching

設定鍵是 `cacheRetention`，值為 `none` / `short` / `long`，可以設全域預設、每個模型、每個 agent。舊的 `cacheControlTtl` 仍相容（`5m` → `short`、`1h` → `long`），新設定建議用 `cacheRetention`。注意 `"standard"` 不是別名，要用 `"short"`；無效值會被忽略並警告。

各家的實際對應：

| 供應商 | 行為 |
|---|---|
| Anthropic（直接 API / Vertex）| `short` = 預設 5 分鐘 ephemeral cache，`long` = 1 小時 TTL。未設定時，**直接 Anthropic 路由會自動種上 `short`**；其他 Anthropic 系路由要明確指定 |
| Amazon Bedrock、自訂 anthropic-messages 端點 | 支援 Claude 模型，但必須明確設定 `cacheRetention` |
| Google | 設了就自動建立、重用、更新 system prompt 的 `cachedContents`，不用自己管 handle。TTL `short` 為 300 秒、`long` 為 3600 秒 |
| OpenAI 相容端點 | 只有選 `long` 且端點同時支援 cache key 與長保留時，才加上 `prompt_cache_retention: "24h"`。Together AI 與 Cloudflare 的相容設定檔關掉了這項 |

有一個容易誤會的地方：用環境變數隱含開長保留（`OPENCLAW_CACHE_RETENTION=long` 而沒有明確的 `cacheRetention`）**只在 `api.anthropic.com` 或 Vertex AI 的主機上會升級成 1 小時**，其他主機仍是 5 分鐘。

搭配用的兩個設定：`contextPruning.mode: "cache-ttl"` 會在 cache TTL 視窗過後修剪舊的工具結果，避免閒置之後的請求把過大的歷史重新 cache 一次；`heartbeat` 可以讓長壽命 agent 的 cache 保持溫熱（例如 TTL 一小時就設 `every: "55m"`），但只對真的受益於熱 cache 的 agent 開。

## 整體來說

這三件事其實回答同一個問題——**當事情不如預期時，系統應該替你決定到什麼程度**。

OpenClaw 的答案是有分寸的：設定檔的預設可以自動退到別的模型，但**你手動選的不行**；暫時性的問題給短冷卻並自動繞過，但帳務問題直接停用那組憑證而不是每分鐘重試一次；過載會替你等，但只在還沒做出任何可觀察的動作之前等。

會腐爛的是那些秒數，不會腐爛的是這條分界線。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修掉兩處錯誤數字**：一般失敗的冷卻實際是 30 秒 → 1 分鐘 → 5 分鐘（上限），原文寫「1 分鐘 → 5 分鐘 → 25 分鐘 → 1 小時」；帳務失敗不是「5 小時 → 24 小時」的遞增冷卻，而是把 profile 標成 disabled 走較長退避。**修掉一處路徑錯誤**：auth profile 已改存於每個 agent 的 `openclaw-agent.sqlite`，原文寫的 `auth-profiles.json` 現在是 legacy，且執行期對未遷移的 agent 是 fail closed。新增：fallback 為 turn-local、選擇來源決定嚴格度（使用者手動選的模型失敗會報錯而非改用他模）、哪些錯誤不推進 fallback（格式錯誤、context 溢出）、overload 的整輪重試與 30 秒通知、SDK `Retry-After` 的 60 秒上限、輪替順序補上靜態 token 這一層、Codex 訂閱與 API key 備援的 `auth.order`。Prompt caching 的設定鍵更新為 `cacheRetention`（`cacheControlTtl` 為 legacy），並補上 Google `cachedContents` 與 OpenAI 相容端點的實際差異。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Model failover](https://docs.openclaw.ai/concepts/model-failover) — 兩階段容錯、選擇來源政策、冷卻與帳務停用、錯誤分類
- [Prompt caching](https://docs.openclaw.ai/reference/prompt-caching) — `cacheRetention` 與各供應商對應
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — API key 輪替的環境變數與供應商行為
- [Models CLI](https://docs.openclaw.ai/concepts/models) — 模型選擇順序與 session 釘選
- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — auth 與 runtime 分離（Codex 訂閱情境）
