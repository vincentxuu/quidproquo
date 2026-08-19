---
title: "GitHub Copilot CLI：把 agent 開在 GitHub 這個平台上"
date: 2026-08-19
type: project
category: tech
tags: [github-copilot, coding-agent, ai-tools, cli, mcp, pricing]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 14
tldr: "Copilot CLI 於 2026-02-25 正式 GA，所有 Copilot 方案（含 Free）都包含。差異化不在 agent 本身，而在 GitHub 平台整合：內建 GitHub MCP server 直接操作 issue 與 PR、組織政策自動繼承、`&` 前綴把工作丟給雲端 coding agent。計費走 GitHub AI Credits（1 credit = $0.01），Pro $10/mo 含 $15、Pro+ $39 含 $70、Max $100 含 $200。"
description: "GitHub Copilot CLI 的安裝、plan/autopilot 模式、/fleet 平行 subagent、內建 custom agents、AI Credits 計費方式，以及它跟其他終端 agent 的定位差異。"
draft: false
---

如果你的團隊已經在付 GitHub Copilot，那你已經有一個終端 agent 了，只是可能沒開來用。

Copilot CLI 在 2025 年 9 月進 public preview，**2026 年 2 月 25 日正式 GA**，所有 Copilot 方案都包含——包括免費方案。這篇講它值不值得從你現在的工具換過來，以及它真正的差異化在哪。

## 差異化不是 agent，是平台

先說結論：Copilot CLI 的 plan 模式、autopilot、subagent、hooks、skills、MCP——這些能力其他工具都有，功能表上看不出勝負。**它的差異在於它長在 GitHub 上。**

具體是這三件事：

**內建 GitHub MCP server。** 不是「支援 MCP 所以你可以自己接」，而是開箱就配好了。你可以直接說「找出跟這次改動相關的 open issue」，它去搜 issue、看標籤與活動、summarize 範圍，不用你切到瀏覽器。工作對象是 issue、branch、PR，不只是本機檔案。

**組織政策自動繼承。** CLI 自動套用你所在組織的 Copilot 治理設定——branch protection、required checks、模型可用性白名單都照舊生效。對已經有 Copilot Business/Enterprise 的公司，這代表導入一個終端 agent 不需要重新走一次資安審查。（代價是：Business/Enterprise 的管理員必須先在 Policies 頁把 Copilot CLI 打開，個人開不了。）

**本機與雲端可以互轉。** 任何 prompt 前面加 `&`，這件事就丟給雲端的 Copilot coding agent 在背景做，你的終端機空出來做別的；`/resume` 可以在本機 session 與遠端 session 之間切換。你也可以在 github.com 上開一個 cloud agent session，再把它拉回本機繼續。

## 安裝與基本操作

```bash
npm install -g @github/copilot
copilot
```

也有 Homebrew、WinGet、shell script 與獨立執行檔；用 Homebrew、WinGet 或 install script 裝的會自動更新。支援 macOS、Linux、Windows（PowerShell 6+），Codespaces 預設映像檔內建。

進去之後先跑 `/init` 產生專案的 Copilot 指示檔。認證直接用既有 GitHub 帳號，也支援 OAuth device flow、重用 GitHub CLI 的 token，以及 CI/CD 友善的 `GITHUB_ASKPASS`。

## 三種自主程度

`Shift+Tab` 在模式之間循環：

| 模式 | 行為 |
|---|---|
| 預設 | 每個會修改或執行檔案的工具呼叫都要你確認，可選「這個 session 內都允許此工具」 |
| **Plan** | 先分析需求、問澄清問題、產出結構化實作計畫，你核准後才寫程式 |
| **Autopilot** | 不逐步確認，一路做到任務完成 |

要完全放手有 `--allow-all` / `--yolo`，但更值得注意的是 **`/sandbox enable`**：它不是把 CLI 本身關進沙箱，而是限制 **Copilot 代你執行的指令與工具**能碰到的檔案系統、網路與系統能力。這個區分很重要——沙箱管的是被派出去的手，不是下令的腦。

## 內建的 custom agents

Copilot CLI 出廠就帶一組專職 subagent，模型判斷划算時會自己派工：

| Agent | 職責 |
|---|---|
| Explore | 快速掃 codebase 回答問題，不佔用主 context |
| Task | 跑測試與 build，成功給摘要、失敗給完整輸出 |
| General purpose | 複雜多步驟任務，在獨立 context 跑 |
| Code review | 只挑真正的問題，壓低雜訊 |
| Research | 跨 codebase、相關 repo 與網路的深度研究，產出帶引用的報告 |
| Rubber duck | 建設性的反對者，由 CLI 自動諮詢 |

Rubber duck 這個設計值得單獨講：它不會出現在 `/agent` 清單裡讓你選，是 Copilot 自己在需要時去諮詢的。**內建一個專門唱反調的角色**，是這份清單裡最不尋常的一項。

`/fleet` 則是另一個方向：把同一個任務丟給多個 subagent 平行跑，甚至同時跑不同模型，最後收斂成一個可決策的結果，你再決定採用哪個。

自訂 agent 用 Markdown 檔（`.agent.md`）定義，可放在使用者層（`~/.copilot/agents`）、repo 層（`.github/agents`），或組織／企業層（`.github-private` repo 的 `/agents` 目錄）。

## 計費：AI Credits

這是最容易搞混的部分。Copilot 的計費單位是 **GitHub AI Credits，1 credit = $0.01 USD**：

| 方案 | 月費 | 內含 credits |
|---|---|---|
| Free | $0 | 有限，含 Copilot CLI 與 agent 模式 |
| Pro | $10/user | $15 |
| Pro+ | $39/user | $70 |
| Max | $100/user | $200 |
| Business / Enterprise | 另計 | 管理員設上限並決定是否允許超額 |

幾個要點：

- **程式碼補全與 next edit suggestion 不吃 credits**，付費方案無限用。吃 credits 的是 chat、agent 模式、code review、cloud agent、Copilot CLI 這些。
- 消耗速率**依模型而異**，`/usage` 可以看本次 session 用掉多少 credits、跑多久、改了幾行、各模型的 token 分佈。
- Business/Enterprise 由管理員決定超額後是暫停還是繼續計費。

模型方面跨 Anthropic、OpenAI、Google 三家，`/model` 中途可換，可調 reasoning effort，`Ctrl+T` 切換要不要顯示推理過程。

## Context 管理

`/context` 看目前 token 用量的視覺化總覽，`/compact` 手動壓縮對話。**接近 token 上限的 95% 時會自動在背景壓縮**，不打斷你。

另外有兩層記憶：repository memory 記住這個 codebase 的慣例與模式，cross-session memory 讓你可以問「上次那個檔案／PR 我們怎麼處理的」。

## 適合與不適合

**適合**：

- **組織已經買了 Copilot** 的開發者——邊際成本是零，而且不用重跑資安審查
- 工作重心在 **issue 與 PR** 而不只是本機檔案的人
- 需要**本機與雲端接力**的人——`&` 丟出去、`/resume` 收回來
- 用的編輯器沒有官方 Copilot 擴充的人：CLI 獨立於編輯器運作

**不適合**：

- 不在 GitHub 生態的團隊——平台整合正是它唯一的護城河，拿掉之後它只是一個普通的終端 agent
- 想要完全掌控模型與供應商的人——模型清單由 GitHub 決定，組織管理員還可以再限縮
- 個人使用者在 Business/Enterprise 組織下想自己啟用——要等管理員開

## 整體來說

Copilot CLI 的價值判斷很單純：**你在 GitHub 上花了多少時間？** 如果你的工作流是 issue → 分支 → PR → review，它把這條線接進了終端機，而且用的是你已經付過的錢。如果你的工作流跟 GitHub 關係不大，那它相對於 [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent) 或 [OpenCode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent) 沒有明顯優勢。

值得注意的是它跟 [Codex](/posts/tech/2026-03-31-codex-cli-openai-coding-agent) 形成有趣的對照：兩者都是「綁在既有訂閱上的終端 agent」，但 Codex 綁的是 ChatGPT 這個消費訂閱，Copilot CLI 綁的是**企業已經買單的開發者平台**。後者在公司裡通常更容易通過。

## 參考資料

- [GitHub Copilot CLI 產品頁](https://github.com/features/copilot/cli)
- [GitHub Changelog：Copilot CLI is now generally available（2026-02-25）](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
- [GitHub Docs：Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)
- [GitHub Copilot CLI repo：github/copilot-cli](https://github.com/github/copilot-cli)
- [GitHub Copilot 方案與定價](https://github.com/features/copilot/plans)
- [GitHub Blog：Power agentic workflows in your terminal with GitHub Copilot CLI](https://github.blog/ai-and-ml/github-copilot/power-agentic-workflows-in-your-terminal-with-github-copilot-cli/)
