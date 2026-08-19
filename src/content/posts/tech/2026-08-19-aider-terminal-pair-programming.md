---
title: "Aider：最老牌的終端 AI Pair Programmer，以及它現在的維護狀況"
date: 2026-08-19
type: project
category: tech
tags: [aider, coding-agent, ai-tools, cli, open-source, git]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 13
tldr: "Aider 是 2023 年就存在的終端 AI pair programmer（Python、Apache-2.0、約 48.3k stars），設計上跟現在的自主 agent 走反方向：手動 /add 檔案控制 context、每次修改自動產生一個 atomic git commit、architect/editor 雙模型分工。但要注意維護節奏：最後一版 PyPI 發布是 2026-02 的 0.86.2，最後一筆 commit 在 2026-05，官網仍推薦 Claude 3.7 Sonnet 與 o1。"
description: "Aider 的設計哲學、repo map、architect/editor 模式、watch mode 與 atomic commit 機制，以及 2026 年 8 月實測的維護活躍度與選型建議。"
draft: false
---

在這個系列裡，Aider 是唯一一個「不想當 agent」的工具。

其他工具比的是誰能自主跑更久、誰的 subagent 分工更聰明、誰能在你關掉筆電之後繼續工作。Aider 走的是另一條路：**你決定哪些檔案進 context，它負責改，然後每一次改動都變成一個獨立的 git commit。** 它是 pair programmer，不是代理人。

這篇講它的設計取捨，也講一件選型時必須知道的事：它的維護節奏在 2026 年明顯放緩了。

## 設計哲學：明確的 context 控制

大多數 agent CLI 的賣點是「它會自己找檔案」。Aider 的預設剛好相反——你用 `/add` 明確把檔案加進聊天，用 `/drop` 移出去，用 `/read-only` 加入唯讀的參考檔。

這個設計在 2023 年是因為模型 context 小、agentic search 還不可靠；到了 2026 年它反而變成一種**取捨主張**：你確切知道模型看到了什麼，也確切知道你在為多少 token 付錢。相對地，遇到不熟的 codebase 時，你得先自己知道要加哪些檔案——這正是自主 agent 想幫你省掉的工。

為了讓模型在「只看到幾個檔案」的情況下仍理解全域，Aider 會建一份 **repo map**：用 tree-sitter 抽出整個 repo 的檔案結構與符號定義，壓縮成一份地圖塞進 context。你不用把整個專案加進聊天，模型也知道 `UserService` 定義在哪。

## Git 是一等公民

這是 Aider 最有辨識度的功能：**每一次 AI 修改都自動產生一個 commit**，訊息由模型寫。

```bash
/undo          # 直接 git revert 上一次 AI 的修改
/diff          # 看工作目錄的 diff
```

它的價值不在「省下打 git commit 的力氣」，而在**復原的粒度**。當 agent 連續改了七個檔案而其中第三步走偏時，一個 `git log` 就能看出它做了什麼、`/undo` 就能退回去。相較之下，讓 agent 自由改動半小時再一次性 review 整包 diff，是完全不同的風險模型。

代價也很直接：你的 git history 會變得很碎。習慣把一個功能整理成一個乾淨 commit 的人，會需要在推上去之前做一輪 squash。

## Architect / Editor 雙模型

Aider 的 `architect` 模式把一次修改拆成兩個請求：

1. **architect 模型**（主模型）負責想——提出要怎麼改
2. **editor 模型**負責做——把那個提案翻譯成具體的檔案編輯指令

```bash
aider --architect --model <推理強的模型> --editor-model <便宜快的模型>
aider --architect --auto-accept-architect   # 跳過逐步確認
```

會有這個設計，是因為官方文件講得很直白：某些 LLM「沒辦法在一次回應裡同時提出解法並產生詳細的檔案編輯」。推理強的模型常常把結構化 diff 格式弄壞，而便宜的模型產 diff 很精準但規劃能力弱。拆成兩個請求，各用各的長處。

這個觀察在 2026 年仍然成立，而且比 Aider 本身更耐用——本系列其他工具的 Auto 模式、Power 設定、模式分檔，本質上都在解同一個問題。差別只在 Aider 讓你手動指定兩個模型，其他工具替你決定。

代價是**兩次 LLM 請求**：更慢，而且在某些組合下更貴。

## Watch mode：用註解驅動

Aider 可以在背景跑，監看檔案變化。你在自己的編輯器裡寫註解，存檔，它就動工：

```python
# 把這個函式改成非同步 AI!
def fetch_user(uid):
    ...
```

`AI!` 是「做這件事」，`AI?` 是「回答這個問題」。存檔後 Aider 偵測到標記、讀周邊 context、改完、commit、清掉標記。

這解決的是一個很實際的問題：**你不必離開編輯器**。它不要求你搬進某個 TUI 或某個 IDE，它只是在旁邊看著檔案系統。這也是 Aider 至今仍有人用的主因之一——它對你的工作環境幾乎零侵入，VS Code、JetBrains、SSH 上的 Vim、tmux 分割窗都一樣。

## 模型自由度

Aider 接 100+ 種 LLM，雲端和本地都行，`/model` 可以在 session 中途換。它同時維護一份 **polyglot leaderboard**：用 225 題涵蓋 C++、Go、Java、JavaScript、Python、Rust 的 Exercism 練習題，測模型「能不能照指示正確編輯程式碼而不需要人介入」。

這份榜單的價值其實超出 Aider 本身——它量的是**編輯格式的正確率**（模型有沒有產出格式正確的 diff），這跟一般 coding benchmark 量的「解題能力」是兩件事，而前者才是決定 agent 好不好用的關鍵之一。

## 維護狀況：必須誠實講的部分

選型指南不能只講設計哲學。以下是 2026-08-19 從官方來源抓到的數字：

| 項目 | 狀態 |
|---|---|
| GitHub stars | ~48.3k |
| 授權 | Apache-2.0 |
| 最新 PyPI 版本 | **0.86.2，發布於 2026-02-12** |
| 前一版 | 0.86.1，發布於 2025-08-13 |
| 最後一筆 commit | **2026-05-22** |
| 未關閉 issue | ~1,817 |

對照一下節奏的變化：2025 年 8 月那週，0.85.3、0.85.4、0.85.5 在三天內連發；接下來的十二個月，只有一次 0.86.2。官網首頁到現在仍寫著「Aider works best with Claude 3.7 Sonnet、DeepSeek R1、OpenAI o1、o3-mini & GPT-4o」——這串模型清單本身就標示了那個頁面停在什麼時候。

**這不代表它壞了。** repo 沒有 archive，2026 年上半年仍有 commit 進來（包括擴充 Anthropic 模型名單、補 bash 的 tree-sitter 支援），核心功能是穩的，裝了就能用。但如果你的選型條件包含「跟得上新模型」「有人回應 issue」，這個數字要納入考量。

## 適合與不適合

**適合**：

- 想要**明確控制 context** 的人——你知道要改哪些檔案，不想讓 agent 自己亂翻
- 重視 **git history 粒度**、想要細顆粒 undo 的人
- 不想搬離現有編輯器的人——watch mode 讓它在旁邊待命就好
- 想跑**本地模型**、或想自己配 architect/editor 組合來壓成本的人

**不適合**：

- 想要「丟一句話就自己跑完」的自主 agent——那不是 Aider 的設計目標
- 需要 MCP、sub-agent 生態、雲端接力這類新型能力的人
- 需要工具跟緊模型世代的人——見上一節

## 整體來說

Aider 的核心價值是一套**仍然正確的設計主張**：明確的 context 控制、git 作為 undo 機制、規劃與編輯用不同模型。這三件事在今天的工具裡都還看得到影子，只是換了名字。

但「設計主張正確」跟「現在該用它」是兩個問題。如果你要的是那套哲學，本系列的 [Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness) 用更新的實作提供了類似的克制感；如果你要的是自主性與生態，看 [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent) 或 [OpenCode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)。Aider 現在最適合的位置，是**你已經習慣它、而它已經夠用**的情況。

## 參考資料

- [Aider 官方網站](https://aider.chat/)
- [Aider GitHub：Aider-AI/aider](https://github.com/Aider-AI/aider)
- [Aider 文件：Chat modes（code / ask / architect / help）](https://aider.chat/docs/usage/modes.html)
- [Aider 文件：LLM Leaderboards 與 polyglot benchmark 說明](https://aider.chat/docs/leaderboards/)
- [Aider 文件總覽](https://aider.chat/docs/)
- [PyPI：aider-chat 版本發布紀錄](https://pypi.org/project/aider-chat/)
