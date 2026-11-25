---
title: "工具推薦｜Bernstein — 用不吃 LLM token 的決定性排程器管控多個 coding agent 平行跑"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 Apache-2.0 CLI，用決定性 Python 排程器（不是 LLM）把目標拆成任務，讓 Claude Code、Codex 等多個 coding agent 在各自的 git worktree 平行跑，過 quality gate 才合併，每一步都留可離線驗證的紀錄"
tldr: "Bernstein 是一個開源 CLI，用決定性排程器（不是 LLM）管控多個 coding agent 平行工作。安裝：pipx install bernstein。解決了平行跑多個 agent 時誰在做什麼、有沒有過測試、能不能事後稽核這幾件事沒人管的問題。"
series:
  name: "AI Tool of the Day"
  order: 89
---

> :globe: [English version](/posts/daily/2026-11-26-tool-bernstein-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Bernstein |
| 類型 | CLI / Python 函式庫 / MCP server |
| GitHub | [sipyourdrink-ltd/bernstein](https://github.com/sipyourdrink-ltd/bernstein) |
| Stars | 1,220（2026-11-25 查核時數字） |
| 語言 | Python 3.12+ |
| 授權 | Apache-2.0 |
| 安裝 | `pipx install bernstein` |

## 解決什麼問題

你想同時開好幾個 Claude Code 或 Codex session 平行處理一批待辦，但很快會卡在三個問題：誰負責哪一塊、彼此會不會改到同一個檔案、改完到底有沒有過 lint／型別檢查／測試。自己寫腳本管理的話，worktree 要手動建、失敗要手動重試、花了多少 token 和 API 費用也沒人記——出問題時更沒有東西可以回頭查「agent 當時到底做了什麼決定」。

Bernstein 把這整套管理邏輯包成一個命令列工具，而且刻意把排程器本身寫成不呼叫 LLM 的純 Python：它把一個目標（或一份有階段相依性的 YAML 計畫）拆成多個任務，每個任務各自在獨立的 git worktree 裡跑一個用完就丟的 CLI agent，跑完先過 lint／型別檢查／測試（可選加安全掃描），通過才合併進主線，沒通過就升級到更強的模型重試，重試用盡就丟進 dead-letter queue 保留原狀供人檢查。因為排程、分配、合併這幾步都是決定性程式碼，同一份計畫重播兩次會得到同一個任務圖，而且預設就有 lineage spine 可以逐步回放；選擇性開啟的 HMAC 稽核鏈,則讓每一步都變成沒執行過這次 run 的人也能離線驗證的簽章紀錄。

適合場景：想在睡前丟一批待辦讓幾個 agent 平行跑、早上起來看哪些 PR 是綠的；需要留下「agent 做了什麼、為什麼這樣做」的紀錄給人事後稽核的團隊；或者單純想在既有的 Claude Code／Codex／Aider 之上，加一層「fan out 到 N 個任務、只合併過關的」的 CI 式管控（官方列出 55 個可選的 CLI agent 轉接器名稱）。

```diagram
title: Bernstein 的 tick loop：目標如何變成合併的程式碼
desc: Bernstein 把目標拆成任務，每個任務在獨立 git worktree 跑一個短命 agent，過 quality gate 才合併，沒過就升級模型重試，重試用盡才進 dead-letter queue。
caption: 依官方文件描述簡化；實際還有 heartbeat 監控、warm pool、bulletin board 等機制未畫出。
---
<svg viewBox="0 0 640 584">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 108V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 204V244" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 292H432" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 340V368" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M184 416H108Q100 416 100 408V180Q100 172 108 172H180" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M280 464V500" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <rect class="dg-box" x="212" y="60" width="136" height="48" rx="6"/>
  <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">目標拆解成任務</text>

  <rect class="dg-box" x="184" y="140" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="163" text-anchor="middle" dominant-baseline="central">啟動 agent 執行任務</text>
  <text class="dg-sub" x="280" y="183" text-anchor="middle" dominant-baseline="central">獨立 git worktree</text>

  <path class="dg-box" d="M280 244L376 292L280 340L184 292Z"/>
  <text class="dg-label" x="280" y="282" text-anchor="middle" dominant-baseline="central">品質閘門通過？</text>
  <text class="dg-sub" x="280" y="304" text-anchor="middle" dominant-baseline="central">lint・type・test</text>

  <rect class="dg-box dg-box--accent" x="432" y="268" width="144" height="48" rx="6"/>
  <text class="dg-label" x="504" y="292" text-anchor="middle" dominant-baseline="central">合併進 main</text>

  <path class="dg-box" d="M280 368L376 416L280 464L184 416Z"/>
  <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">還有重試次數？</text>
  <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">次數 &lt; 上限</text>

  <rect class="dg-box dg-box--warn" x="176" y="500" width="208" height="64" rx="6"/>
  <text class="dg-label" x="280" y="523" text-anchor="middle" dominant-baseline="central">進 dead-letter queue</text>
  <text class="dg-sub" x="280" y="543" text-anchor="middle" dominant-baseline="central">worktree 保留供檢視</text>

  <text class="dg-edge" x="404" y="280" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="290" y="354" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="146" y="404" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-small" x="144" y="160" text-anchor="middle" dominant-baseline="central">升級模型重試</text>
  <text class="dg-edge dg-text--warn" x="290" y="482" text-anchor="start" dominant-baseline="central">否</text>
</svg>
```

## 快速上手

### 安裝

```bash
pipx install bernstein   # 建議；pip install bernstein／uv tool install bernstein 也可以
# 需求：Python 3.12+、至少一個已安裝的 CLI coding agent（Claude Code／Codex／Gemini CLI…）、git
```

### 基本用法

```bash
cd your-project
bernstein -g "add JWT-based user authentication"
# Bernstein 把目標拆成任務、在各自的 worktree 跑 agent，過 quality gate 才合併，
# 結果直接出現在 git history 裡
```

### 進階用法（選填）

```yaml
# plan.yaml：多階段任務，階段之間可宣告相依
name: "Add authentication"
stages:
  - name: database
    steps:
      - goal: "Create user table migration"
        role: backend
        complexity: low
  - name: api
    depends_on: [database]
    steps:
      - goal: "Implement /login endpoint"
        role: backend
        complexity: medium
        priority: high
```

```bash
bernstein run plan.yaml --routing bandit --audit   # 用 contextual-bandit 選模型，並開 HMAC 稽核鏈
bernstein audit verify                             # 事後離線驗證稽核鏈完整性
```

## 與現有工具的比較

| | Bernstein | 手動寫腳本管多個 agent | 多數 LLM 驅動的 agent orchestrator |
|---|---|---|---|
| 排程器本身會呼叫 LLM | ✗（純 Python，排程零 token） | — | ✓ |
| 每個任務獨立 git worktree | ✓ | 需自己實作 | 部分支援 |
| HMAC 簽章稽核鏈、可離線驗證 | ✓ | ✗ | 大多沒有 |
| 支援的 CLI agent 數 | 55 個可選轉接器（Claude Code／Codex／Gemini CLI／Aider…） | 自己接 | 通常僅 1–3 個 |
| 失敗自動升級模型重試、進 dead-letter queue | ✓ | 需自己實作 | 部分支援 |

## 注意事項

- **狀態是 beta、單人維護**：README 自己寫明「status: beta，solo-maintained」，版本號只代表發行次數不代表成熟度，小版號之間介面可能改變，要釘版本使用。
- **HTTP task server 預設綁 127.0.0.1:8052**：只在本機監聽沒問題，但別把它開到外網；各 agent 呼叫自家模型 API 用的是你自己配置的金鑰，Bernstein 不會代理或存這些金鑰。
- **不等於合規認證**：官方文件明講它不宣稱 SOC2、HIPAA、FedRAMP 之類的認證，HMAC 稽核鏈只是給你拿去做自己合規主張的技術基礎，不是認證本身。
- Cloudflare 雲端執行目前是實驗性功能，要部署到自己的 Cloudflare 帳號，官方沒有提供代管服務。

## 今日收穫

「排程器要不要吃 LLM token」這個選擇，直接決定了你能不能重播出同一次執行結果。Bernstein 刻意把分解任務、分配 agent、決定合併這幾步寫成不碰模型的純 Python，換來的是同一份計畫重跑兩次會得到同一個任務圖、出錯時可以用 replay journal 一步步倒回去看是哪一步岔開的——這跟「讓一個更聰明的 agent 去協調其他 agent」是完全不同的設計賭注：後者的協調能力更有彈性，但沒人能保證兩次協調出來的任務分配會一樣。

## 參考資料

- [sipyourdrink-ltd/bernstein — GitHub](https://github.com/sipyourdrink-ltd/bernstein)
- [sipyourdrink-ltd/bernstein — README](https://github.com/sipyourdrink-ltd/bernstein/blob/main/README.md)
- [Bernstein 官方文件 — Getting Started / Install](https://docs.bernstein.run/en/latest/getting-started/install)
- [Bernstein 完整技術參考（llms-full.txt）](https://bernstein.run/llms-full.txt)
- [Bernstein — PyPI](https://pypi.org/project/bernstein/)
