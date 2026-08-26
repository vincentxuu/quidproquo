---
title: "AI Agent GitHub Digest — 2026-08-19"
date: 2026-08-19
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, coding-agent]
lang: zh-TW
description: "DeepSeek Harness 一小時衝破兩萬星、寫下 GitHub 史上最快星數紀錄，模型公司正集體往「harness 層」卡位"
tldr: "DeepSeek 開源的 agent harness「dsh」8/13 發布一小時內破 2 萬星，目前累積約 15.8 萬星，社群兩天湧入 2000+ 外掛提案；核心是 Cordis 驅動的「一切皆插件」架構，甚至能把 Claude Code、Codex 當子 agent 呼叫。RightNow-AI 用 Rust 從 OS 層級重新定義 agent（openfang），網易有道推出建立在 OpenClaw 之上的桌面 Agent LobsterAI，PrimeIntellect 的 prime-agent 主打自我改進推理迴路。CrewAI 1.15.16 補強 execution context 追蹤與 flow 錯誤記錄。"
series:
  name: "AI Agent GitHub Digest"
  order: 4
---

> [English version](/en/posts/daily/2026-08-19-ai-agent-github-digest-en)

## 今日亮點

今天的絕對主角是 DeepSeek 開源的 agent harness「dsh」——一小時衝破兩萬星，寫下 GitHub 史上最快星數紀錄，這件事本身比任何單一功能都更值得注意：它證明模型公司正集體把差異化戰場從「模型本身」移到「harness 層」，openfang 選擇用 Rust 從 OS 層級重新定義 agent，其實是在跟 DeepSeek 搶同一塊地。

## Trending Repos

### deepseek-harness (deepseek-ai) ⭐ 158,000+

[GitHub](https://github.com/deepseek-ai/deepseek-harness)　·　TypeScript　·　MIT

- **是什麼**：DeepSeek 官方開源的 agent harness（`dsh`），隨 V4 Pro 模型同步推出，核心理念是「一切皆外掛」——model、tool、session、sandbox、loop、UI 全部是可替換外掛。
- **為什麼值得看**：8 月 13 日發布，一小時內破 2 萬星，寫下 GitHub 史上最快星數紀錄（打破 xAI Grok-1 的 1.2 天紀錄）；短短幾天累積到約 15.8 萬星，社群兩天內湧入超過 2000 個外掛提案。它由自研的 Cordis 外掛核心驅動，甚至能把 Claude Code、Codex 當成子 agent 呼叫進 DeepSeek 自己的工作流裡，代表 DeepSeek 從純模型供應商轉向「harness 產品公司」，走的是 Anthropic 做 Claude Code、OpenAI 做 Codex 的同一條路。
- **技術棧**：TypeScript + Cordis 外掛框架（自研，論文描述為「時空可組合性的程式設計典範」），MIT License。
- **上手難度**：低——`npx @deepseek-ai/dsh web` 一行指令即可啟動 Web UI；但目前是 developer preview 階段，外掛 API 仍會有 breaking changes。

---

### openfang (RightNow-AI) ⭐ 18,113

[GitHub](https://github.com/rightnow-ai/openfang)　·　Rust　·　Apache-2.0

- **是什麼**：用 Rust 從零打造的「Agent 作業系統」，作者刻意強調它不是 orchestration 框架，也不是 Python wrapper，而是完整的 OS 概念。
- **為什麼值得看**：全 Rust 寫成（137K 行、14 個 crate、1767+ 測試、零 clippy 警告），走「單一 binary 搞定」路線，跟多數 Python/TypeScript agent 框架動輒要裝一堆依賴的部署複雜度形成明顯對比，對效能敏感、想要單一二進位部署的團隊是另一種選擇。
- **技術棧**：純 Rust，單一 binary 部署，Apache-2.0。
- **上手難度**：中——「Agent OS」是新心智模型，不像熟悉的 orchestration 框架能直接套現成範例。

---

### LobsterAI (netease-youdao) ⭐ 5,906

[GitHub](https://github.com/netease-youdao/LobsterAI)　·　—　·　MIT

- **是什麼**：網易有道推出的桌面級 AI Agent，能直接操作真實電腦環境——本機檔案、終端機、瀏覽器、文件、試算表、簡報，並可透過微信、飛書、釘釘、Telegram 下指令遙控。
- **為什麼值得看**：建立在 OpenClaw 之上，是中國主要科技公司中第一個開源的桌面級 Agent，補上「手機下指令、電腦真的動手做」這個中文使用者場景，跟多數聊天視窗型 agent 的定位不同。
- **技術棧**：基於 OpenClaw 架構，MIT License，提供 macOS/Windows 安裝檔。
- **上手難度**：低——官網或 GitHub Releases 下載安裝檔即可，不用自己編譯。

---

### prime-agent (PrimeIntellect-ai) ⭐ 17,097

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　—　·　MIT

- **是什麼**：PrimeIntellect 團隊做的「自我改進」RLM（Reasoning Language Model）agent，主打 coding 與長時間自主任務。
- **為什麼值得看**：核心賣點是 agent 在執行任務過程中會持續調整自己的推理策略，而非套用固定 pipeline，對需要長 horizon、多輪迭代的研究型任務是跟一般 coding agent 不同的取徑。
- **技術棧**：MIT License，圍繞 verifiers 生態建構（細節見官方 repo）。
- **上手難度**：中——文件仍在快速迭代中，需要參考 repo 內範例逐步摸索。

## Notable Releases

### CrewAI 1.15.16

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.16)

- **重要變更**：新增 execution context management（帶 UUID 追蹤）；記錄是哪種 exception 導致 flow 結束；記錄 trace batch 分享到 AMP 的時間點；統計不同來源啟動的 deployment 數量。
- **Breaking Changes**：無。
- **對你的影響**：這次沒有 breaking changes，主要是可觀測性與除錯資訊增強，用 CrewAI Flow 的人可以直接升級,不用改動既有程式碼。

## 今日收穫

以前以為模型公司做 agent 工具只是順便做個 demo 撐場面，但 DeepSeek 這次直接開源一整套 Cordis 外掛架構、投入到「基礎設施等級」的程度,加上 openfang 選擇從 Rust OS 層重新定義 agent,說明真正的戰場已經不在模型好壞,而在「誰的 harness 更可組合、更能被其他 agent 呼叫」——這一層一旦收斂,可能比模型排行榜更決定生態走向。

## 參考資料

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- [DeepSeek Harness 官方介紹](https://deepseek.com/harness/en/)
- [DeepSeek Harness Breaks GitHub's Fastest Star Record](https://pasqualepillitteri.it/en/news/11573/deepseek-harness-fastest-github-stars-record)
- [RightNow-AI/openfang](https://github.com/rightnow-ai/openfang)
- [netease-youdao/LobsterAI](https://github.com/netease-youdao/LobsterAI)
- [PrimeIntellect-ai/prime-agent](https://github.com/PrimeIntellect-ai/prime-agent)
- [CrewAI 1.15.16 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.16)
