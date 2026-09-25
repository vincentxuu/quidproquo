---
title: "AI Agent GitHub Digest — 2026-09-26"
date: 2026-09-26
category: daily
tags: [ai-agent, github, open-source, daily, decision-model, agent-orchestration, agent-tools]
lang: zh-TW
description: "TypeSafe 上週推出的『不說話』決策模型 Jev 一週內滲透進 Pydantic AI 與 DSPy 的原生整合，Nokia 應用研究團隊也開源了訓練免費的相容層 AnyJev"
tldr: "Nokia 應用研究團隊開源 AnyJev，用 cyclic shift＋批次先驗校正讓任何開源 LLM 免訓練吐出校準過的決策機率，官方測試把可自動判定流量從 7.7% 拉到 52.0%；DSPy 3.4.0 接上 TypeSafe client 並帶兩項 breaking changes；Pydantic AI v2.50.0 把上週的 `TypeSafeModel` 升級成正式的 `DecisionModel` 基底類別；另外還有幫 agent 產出接手上線部署的 golive-skill、讓 coding agent 換底層模型像點選單一樣簡單的 magpie、讓 Claude Code 和 Codex 組隊且會自我改寫 skill 的 sno-station。"
series:
  name: "AI Agent GitHub Digest"
  order: 42
---

> 🌏 [English version](/en/posts/daily/2026-09-26-ai-agent-github-digest-en)

## 今日亮點

這幾天冒出來的新詞是 Jev——TypeSafe 上週推出的「不說話」決策模型：輸出不是文字，是 Choice／Score／Noul（真假機率）這幾種結構化決策。今天可以直接看到它的擴散速度：Pydantic AI v2.50.0 把上週才加的 `TypeSafeModel` 升級成正式的 `DecisionModel` 基底類別，DSPy 3.4.0 同一天接上 TypeSafe client，Nokia 應用研究團隊則開源了 AnyJev，讓還在排 waitlist 的團隊不用訓練就能把任何開源 LLM 包成同一套校準決策層。一個上週才公開的新原語，一週內變成三個獨立陣營的基礎設施。

## Trending Repos

### nokia-applied-research/AnyJev ⭐ 662（09-21 建立，5 天內，均日約 +132）

[GitHub](https://github.com/nokia-applied-research/AnyJev)　·　Python　·　Apache-2.0

- **是什麼**：Nokia 應用研究團隊開源的 Python 函式庫，用 cyclic shift（把選項用 K 種排列各出現一次、取幾何平均消掉位置偏誤）加批次先驗校正，讓任何開源 LLM 不需要額外訓練就能吐出校準過的決策機率。
- **為什麼值得看**：直接讀 logits 做決策有兩個已知毛病——選項順序一換答案就變、機率本身沒校準過。AnyJev 分兩層修：L0 不需要標記資料就能用，L1 用 100–500 筆標記資料做溫度校正。官方在 Qwen3-8B／BANKING77 測試集上，把「5% 誤差內可自動判定」的流量比例從 7.7% 拉到 52.0%，順序反轉造成的答案翻轉率也從 0.230 壓到 0.073——是少見「幫排不到 Jev 存取權的團隊補一條開源替代路」的嘗試。
- **tech stack**：Python + Hugging Face Transformers／vLLM 推論後端 + 共享前綴批次評分
- **上手難度**：中——`pip install anyjev[hf]` 就能跑，但要理解 L0／L1 校正機制、選對題型才會有正確的機率輸出

---

### mikehasa/golive-skill ⭐ 942（09-23 建立，3 天內，均日約 +314）

[GitHub](https://github.com/mikehasa/golive-skill)　·　TypeScript　·　MIT

- **是什麼**：一個 Claude Code／Codex 都能用的 Agent Skill，接手「agent 把 app 寫完之後」的那一步——把它實際部署上線。
- **為什麼值得看**：現在多數 coding agent 停在「程式碼寫完」，上線還是要人手動接 hosting、資料庫、網域、email、金流。golive-skill 用 detect→plan→approve→apply→verify 五步驟直接串起 Vercel／Netlify／Supabase／Neon／Cloudflare 等帳號，強調不架自己的後端、不留 telemetry——上線這一步仍然發生在使用者自己的帳號裡，不是多一層代管服務。
- **tech stack**：TypeScript + 零依賴 Node CLI + 各家 hosting／DB／DNS 供應商官方 API
- **上手難度**：低——裝進 agent 的 skill 目錄後，由 agent 自己判斷該呼叫哪個供應商

---

### yetone/magpie ⭐ 791（09-23 建立，3 天內，均日約 +264）

[GitHub](https://github.com/yetone/magpie)　·　Go　·　MIT

- **是什麼**：一個 macOS 選單列小工具，讓 Codex 接 DeepSeek、Claude Code 接 Kimi 這種「coding agent 換底層模型」變成點兩下的事。
- **為什麼值得看**：coding agent 的殼（Claude Code、Codex）跟底層模型正在快速解耦，但切換供應商目前大多要改設定檔、對 API 格式。magpie 直接做一層路由，吸收掉不同供應商之間的協定差異，解決的是「不想被殼綁死在同一家模型」這個很具體、很多開發者已經在手動土砲的痛點。
- **tech stack**：Go + 本機路由 daemon + 各家 LLM API 相容轉接層
- **上手難度**：低——選單列點選要用的模型組合即可，不用改 agent 本身設定

---

### sno-ai/sno-station ⭐ 212（09-19 建立，7 天內，均日約 +30）

[GitHub](https://github.com/sno-ai/sno-station)　·　TypeScript　·　Apache-2.0

- **是什麼**：讓 Claude Code 和 Codex 在同一台機器上組隊工作的本機多 agent 協調層，兩個 agent 有共享的加密記憶跟互相傳訊的管道。
- **為什麼值得看**：多數多 agent 框架處理的是「雲端 agent 互相呼叫」，sno-station 反過來瞄準「同一個人手上的兩支不同廠牌 coding agent 怎麼分工」，還加了一個需要人核准才會生效的夜間迴圈，讓 agent 自己改寫自己的 skill——這步「自我改寫」比常見的「自我記憶」更少人做，也更需要謹慎看待。
- **tech stack**：TypeScript + 本機加密訊息層（Reach）+ 免 daemon、免雲端架構
- **上手難度**：中——概念新穎，得先理解「squad skill」跟核准流程才敢放手讓它自動跑

---

### mitkox/esf ⭐ 148（09-19 建立，7 天內，均日約 +21）

[GitHub](https://github.com/mitkox/esf)　·　Go　·　MIT

- **是什麼**：一個自架的「工程軟體工廠」，用 Temporal 工作流包住跑在沙箱裡的 coding agent，每一步都留下可驗證的稽核紀錄。
- **為什麼值得看**：多數 coding agent 專案在意「能不能寫出程式碼」，esf 在意的是「這段程式碼是怎麼被寫出來的、能不能重放、能不能稽核」——是把 coding agent 從個人玩具往「團隊可以在生產環境信任的產線」推的方向，Temporal 保證流程失敗可重試、不會半途消失。
- **tech stack**：Go + Temporal 工作流引擎 + CubeSandbox 沙箱執行層
- **上手難度**：高——需要自架 Temporal cluster，面向想蓋內部 agent 開發產線的團隊

## Notable Releases

### DSPy 3.4.0

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0)

- **重要變更**：新增 TypeSafe client 整合，可直接呼叫 Jev 拿到 `Noul`／`Choice`／`Score` 三種型別化決策輸出；新增 `ReAnchor` 優化器，能針對自訂評分函式重新校準決策門檻；原生 LM 引擎 `dspy.lm15` 取代原本完全依賴 LiteLLM 的執行路徑，並開放註冊自訂 HTTP provider；新增持久化、非沙箱化的 `LocalInterpreter`（給 RLM／Flex 用）與 async 版 `ReActV2`。
- **Breaking Changes**：`RLM` 的 `interpreter_factory` 參數改成只能用關鍵字傳入；3.3 版的舊實驗性 LM 型別已整個移除。
- **對你的影響**：如果你的程式碼是用位置參數呼叫 `interpreter_factory`，或還在用 3.3 的舊實驗性 LM 型別，升級後會直接報錯，得先照新介面改寫。

---

### Pydantic AI v2.50.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.50.0)

- **重要變更**：新增 `DecisionModel` 基底類別，把上週 v2.49.0 才加的 `TypeSafeModel` 升級成正式的「Decisions 協定」模型家族，用具名標籤做路由；新增 `gemini-3.8-live`／`gemini-3.8-live-extended-thinking` 即時語音支援；每次 `DecisionModel` 請求都會發一個獨立的 `decide` tracing span；修掉 Anthropic 一小時快取計價、即時語音圖片計價、語音時長計費幾個算錯錢的 bug。
- **Breaking Changes**：無，這個版本以新功能和計費／串流 bug fix 為主。
- **對你的影響**：如果你在用 Anthropic 的一小時快取或 Gemini Live 語音功能，這個版本修的幾個計價 bug 會直接影響你的帳單，值得升級核對。

## 今日收穫

之前以為「模型能力」比的是誰的文字生成更準、更快，Jev 這一週給了另一個答案：把語言整個拿掉，只留下結構化的決策跟機率，讓一般程式碼直接吃。更值得注意的是擴散速度——一個上週才公開、目前還在排候補名單的新模型，一週內就讓 DSPy、Pydantic AI 兩個主流框架同時原生支援，Nokia 應用研究團隊還直接開源了免訓練的相容層。這代表框架維護者已經把「決策模型」當成跟「文字生成模型」平行的獨立類別在對待，而不是硬塞進既有的 LLM 呼叫介面裡。

## 參考資料

- [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev)
- [mikehasa/golive-skill](https://github.com/mikehasa/golive-skill)
- [yetone/magpie](https://github.com/yetone/magpie)
- [sno-ai/sno-station](https://github.com/sno-ai/sno-station)
- [mitkox/esf](https://github.com/mitkox/esf)
- [DSPy 3.4.0 — Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0)
- [Pydantic AI v2.50.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.50.0)
- [Nokia Open-Sources AnyJev — MarkTechPost](https://www.marktechpost.com/2026/09/23/nokia-open-sources-anyjev-a-training-free-layer-that-turns-any-open-llm-into-a-calibrated-decision-model/)
