---
title: "跟成熟 coding agent 學設計（35）：Model catalog 與 per-role 多 provider 路由——五家都有、rivumi 還沒有的能力"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 35
tags: [coding-agent, model-routing, llm, rivumi, oh-my-pi, codex]
lang: zh-TW
tldr: "omp 把「用哪顆模型」拆成十種 role，每個 role 一條跨 provider 的 fallback 候選鏈；codex 的模型目錄由伺服器下發、帶著自己的 system prompt 版本；opencode 和 claude-code 至少都有 small model 的獨立解析路徑。rivumi 有靜態 provider 目錄和磁碟快取的 model listing，但整個程式只有「當前這顆模型」的概念——role 路由和 fallback 鏈是改善路線圖上成本效益最直接的下一格。"
description: "對照 pi、omp、opencode、codex、claude-code 五家的 model catalog 資料層與 per-role 路由策略，提出 rivumi 的 role 路由設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-model-catalog-routing-en)

系列第二部進行到一半，這篇講一個聽起來像配置問題、實際上是架構問題的能力：model catalog 怎麼管、「什麼任務用哪顆模型」怎麼決定。取證範圍照舊：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88）。所有 `file#symbol` 引用都是我在本地 clone 實際 grep 過的。

## 能力問題：一顆模型打天下是幻覺

寫過 agent 的人都知道，主對話模型不是唯一的 LLM 消費者。commit message 生成、對話標題、context 摘要、subagent、第二意見審查——這些任務的難度和主迴圈完全不同，卻常常共用同一顆最貴的模型。結果是要嘛浪費錢，要嘛為了省錢把重要任務也降級。

所以「多 provider 支援」只是入場券，真正的能力是兩件事：

1. **Catalog 資料層**：系統知道哪些 provider 有哪些模型、各自支援什麼（context window、reasoning、vision），而且資料會更新。
2. **Per-role 路由**：「commit 用便宜的快模型、規劃用強模型、摘要用最小的」這類策略是一等公民，而不是散落在各處的 hardcoded 字串。

rivumi 目前兩個都只有一半，後面細講。

## 五家怎麼做

### pi：catalog 是資料，provider 是介面

第 5 篇寫過 pi 的 ModelProvider 抽象，這篇只補資料層：`pi-mono/packages/ai/src/models.ts#Provider` 定義了 `getModels()` 回傳同步的完整目錄，動態 provider 另有選用的 `refreshModels()`——同步讀取永遠拿得到上次刷新的快照，網路刷新是非同步且可失敗的（某 provider 掛掉不會拖垮整體）。值得注意的一點：pi 本身**沒有** role 概念，這是 fork 出 omp 之後才長出來的。

### omp：catalog 獨立成套件，role 路由做成解析管線

omp 把 catalog 抽成獨立套件 `packages/catalog`，三層結構：

- **Discovery**：`oh-my-pi/packages/catalog/src/discovery/openai-compatible.ts#DEFAULT_OPENAI_COMPATIBLE_DISCOVERY_TIMEOUT_MS` 把 `/models` 探測死線定在 10 秒，註解明說沒有這個 bound 的話一個卡死的 endpoint 會無限期擋住啟動流程。
- **Identity 分類**：`oh-my-pi/packages/catalog/src/identity/classify.ts#ParsedModel` 把任意 model id 解析成 family/kind/version 結構（gemini/anthropic/openai/glm 四族），下游所有政策（thinking level 上限、tokenizer 選擇）都建在分類之上，而不是字串比對。
- **等價模型判定**：同一顆邏輯模型在不同 provider 常以不同 id 出現（`X` 和 `X-thinking` 成對、aggregator 的日期後綴變體）。`oh-my-pi/packages/catalog/src/variant-collapse.ts#collapseEffortVariants` 把 effort-tier 變體摺疊成單一邏輯模型——但價格不同的 twin 保持分開，註解的原話是「billing attribution never lies」。最粗的判定則在 `oh-my-pi/packages/catalog/src/models.ts#modelsAreEqual`：id 和 provider 都相同才算同一顆。

Role 路由的核心在 coding-agent 套件。`oh-my-pi/packages/coding-agent/src/config/model-roles.ts#MODEL_ROLES` 定義了十個內建 role：default、smol（快）、slow（深思）、vision、plan、designer、commit、tiny、task、advisor。每個 role 可以被設定覆蓋，沒覆蓋就走 `oh-my-pi/packages/coding-agent/src/priority.json` 裡的候選鏈——例如 `smol` 鏈從 cerebras 的 GLM 一路排到各家 flash/haiku/mini，`slow` 鏈全是 gpt-5.x 和 opus 系列。

解析入口 `oh-my-pi/packages/coding-agent/src/config/model-resolver.ts#resolveModelRoleValue` 把 role 展開成有序 pattern 清單逐一嘗試，第一個匹配到的可用模型勝出。三個工程細節特別值得抄：

- **防呆鎖**：`model-resolver.ts#isProviderLockedCrossMatch` 處理一個陰險案例——你寫 `anthropic/claude-opus-5` 但 anthropic provider 沒憑證，raw-id fallback 會默默把你轉嫁到 OpenRouter 上的同名模型，按 OpenRouter 的牌價計費。omp 的解法：named provider 在 bundled catalog 裡確實有這個 id 時，直接失敗而不是 shadow。
- **聚合器上游路由**：`model-resolver.ts#splitUpstreamRouting` 支援 `openrouter/z-ai/glm-4.7@cerebras` 語法，把請求釘在特定上游。
- **Fallback 鏈跟著 role 走**：`oh-my-pi/packages/coding-agent/src/task/executor.ts#installSubagentRetryFallbackChain` 顯示 subagent spawn 時會把自己的 role 對應的 `retry.fallbackChains` 鏈一起帶下去，註解警告「分開推導兩半就是 drift 的開始」——路由身份和重試鏈必須同源。

### opencode：small model 的三段式解析

`opencode/packages/opencode/src/provider/provider.ts#getSmallModel` 是一個乾淨的最小範例：先看使用者設定的 `small_model`，再給 plugin 一個 `experimental.provider.small_model` 攔截機會，最後按 `smallModelFamilyPriority` 家族優序在該 provider 的模型清單裡挑。三段式的順序就是擴展性的順序：使用者 > 外掛 > 啟發法。

### codex：catalog 由伺服器下發，連 prompt 一起版控

codex 走的是完全不同的路：`codex-rs/models-manager/models.json` 描述每顆模型的 slug、context window、truncation policy、tool mode，而 `codex-rs/models-manager/src/manager.rs#ModelsEndpointClient` 定義遠端刷新介面——目錄可以從後端 API 更新，本地 `models.json` 只是快取種子。`manager.rs#RefreshStrategy` 區分 Online/Offline/OnlineIfUncached 三種策略，磁碟快取 TTL 是 300 秒。

最有意思的是 prompt 也綁在 catalog 上：`codex-rs/models-manager/src/model_info.rs#BASE_INSTRUCTIONS` 用 `include_str!` 把 `prompt.md` 編進二進位，而 `codex-rs/models-manager/src/config.rs#base_instructions` 允許 per-model 覆蓋。背後的認知是：system prompt 是模型能力的一部分，新模型上線時可能需要配一份新的基礎指令，這個耦合不該藏在部署腳本裡。

### claude-code：env var 就是逃生門

反編譯碼裡最簡單也最務實的一份：`claude-code/src/utils/model/model.ts#getSmallFastModel` 就一行——環境變數 `ANTHROPIC_SMALL_FAST_MODEL` 有設就用，否則回傳預設 Haiku。主模型解析（同檔案的 `getUserSpecifiedModelSetting`）有完整的優先序：session 內覆蓋 > CLI flag > 環境變數 > settings。claude-code 沒有 omp 那種十角色系統，但「小任務走小模型」的邊界一樣存在，只是用 env var 而不是設定檔表達。

## 為什麼這樣設計：工程依據

模型路由不是過早最佳化。[FrugalGPT](https://arxiv.org/abs/2305.05176) 早在 2023 年就示範了 cascade 式路由能在保住品質的前提下大幅壓低成本；[RouteLLM](https://arxiv.org/abs/2406.18665) 則把「哪些 query 不需要最強模型」做成可學習的問題。五家的實作都沒有做到學習式路由——它們用的是更保守的版本：**人手策劃的 role → 候選鏈，加上執行期的健康度淘汰**。這其實是合理的工程判斷：coding agent 的任務類型有限且可列舉（commit、摘要、規劃、主迴圈），靜態鏈的可預測性和 debug 性遠勝黑盒路由器，fallback 鏈已經吃掉了大部分收益。OpenRouter 自己的[模型路由文件](https://openrouter.ai/docs/features/provider-routing)也是同樣哲學：宣告偏好序，讓執行期處理故障轉移。

## rivumi 設計草案

先如實描述現狀。資料層已有兩塊：

- `src/rivumi/provider_catalog.py#OPENAI_COMPATIBLE_BASE_URLS`：九個 OpenAI 相容 provider 的固定 endpoint，外加 `RESPONSES_PROTOCOL_MODELS` 處理「這顆模型只能走 Responses API」的協定分流（`uses_responses_protocol`）。
- `src/rivumi/model_catalog.py#CatalogSnapshot`：per-provider 的 model listing 磁碟快取，TTL 一天，stale-while-revalidate，key 含 credential fingerprint。`default_model()` 用 `_PROVIDER_BRAND_PATTERNS` 的家族偏好挑預設模型。

路由層則不存在。TUI 的 Ctrl+L（`src/rivumi/tui.py` 的 `ctrl+l` binding）提供 bounded choices 切換，預設值是 runtime-first 的 Automatic——外部 CLI backend 由 runtime 自選模型。整個 native 路徑只有「當前這顆模型」，沒有 role，沒有鏈。缺的具體場景：摘要、標題這類輔助任務如果做了，會被迫用主模型跑；主模型 429 或限流時，native 路徑只有第 6 篇寫的單一 provider 重試，沒有跨 provider 的退路。

若要做，草案如下：

**第一步：role 表，不是 router。** 新增 `src/rivumi/model_roles.py`，先只定義四個 role：`main`、`aux`（摘要/標題等輔助任務）、`fast`、`fallback`。學 omp 的 priority.json 形狀：每個 role 一個有序 pattern 清單（`provider/model-id` 格式，支援裸 id），解析時依序找第一個「憑證存在且 provider 可達」的候選。不要一開始就做模糊匹配和 glob——omp 那套 `matchModel` 五階段管線是被幾百個 provider 的現實逼出來的，rivumi 九個 provider 用精確比對就夠。

**第二步：fallback 鏈掛進既有 retry policy。** 第 6 篇的 NVIDIA NIM retry 強化已經有錯誤分類，把「重試次數耗盡」這個出口接到 role 鏈的下一個候選即可，不需要新機制。關鍵紀律學 omp：鏈的身份跟著 role 走，spawn subagent 或開新 conversation 時整條鏈一起帶下去，避免「主模型換了、fallback 還指著舊的」。

**第三步：等價判定先做最粗版。** 學 `modelsAreEqual`：provider + id 全等才算同顆。`X-thinking` 成對摺疊那些留到真的遇到再說——rivumi 目前的免費模型清單裡還沒有這種痛。

**不做的事**：學習式路由、動態成本最佳化、伺服器下發 catalog（codex 那套需要後端，rivumi 沒有）。external CLI backend 照 M13 的慣例明確標記「模型選擇由 runtime 自理」，role 路由只覆蓋 native 路徑。

## 與現有架構的銜接

這一格的性價比高的原因在於：地基都已經在了。provider 抽象是第 5 篇的主題、重試與錯誤分類是第 6 篇、磁碟快取模式在 startup-performance 那篇驗證過——role 路由只是把這三塊用一張設定表縫起來。真正的新工作只有兩件：承認「不同任務該用不同模型」是一等概念，以及把「當前模型」從單值改成 role 映射而不破壞現有的 Ctrl+L UX（Ctrl+L 切的其實是 `main` role，其他 role 先藏在使用者設定檔裡）。

五家給的教訓濃縮成一句話：**路由策略的價值不在聰明，在於失敗時的行為可預測**。omp 的 provider-lock、codex 的 prompt-catalog 綁定、opencode 的三段式解析，全都是為了讓「哪顆模型接了這個請求」在任何時刻都能回答。

## 參考資料

- [FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance（Chen et al., 2023）](https://arxiv.org/abs/2305.05176)
- [RouteLLM: Learning to Route LLMs with Preference Data（Ong et al., 2024）](https://arxiv.org/abs/2406.18665)
- [OpenRouter Provider Routing 文件](https://openrouter.ai/docs/features/provider-routing)
- [LiteLLM Router：multi-provider fallback 設計參考](https://docs.litellm.ai/docs/routing)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
