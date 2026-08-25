---
title: "用 Python 寫私人 coding agent：訂閱、模型與 runtime 不該混在一起"
date: 2026-08-22
category: ai
tags: [coding-agent, python, tui, claude-code, codex, harness-engineering]
lang: zh-TW
tldr: "Claude/Codex 訂閱不是另一個 API provider；先選 runtime，再明確區分只讀 Ask 與改碼 Agent，模型沿用官方 Automatic。"
description: "PCA M10 實作 runtime-first TUI：使用本機 Claude Code、Codex 登入，以 Ask/Agent 雙模式分開對話與安全改碼。"
draft: false
glossary:
  - term: "agent runtime"
    definition: "真正持有模型迴圈、工具執行與 session 行為的程式；它不等於模型 API provider。"
  - term: "disposable clone"
    definition: "從固定 Git commit 建立、任務結束後只交付 patch 的一次性工作副本。"
---

## TL;DR

Claude Pro／Max 與 ChatGPT 訂閱不能被畫成一般 API provider。PCA 的解法是先選
**agent runtime**：PCA Agent、官方 Claude Code 或官方 Codex CLI。後兩者沿用自己持有的
本機登入與 agent loop，模型預設為官方 `Automatic`；不喜歡再按 `Ctrl+L` 切換。
輸入框也不能把每句話都當 coding task：`Ask` 用來對話，`Agent` 才進隔離 clone 改碼。

## 情境

最初的 onboarding 只有 Provider 與空白 Model。選到 `Anthropic API` 時，很容易以為它會
使用 Claude 訂閱，實際上那條路需要 `ANTHROPIC_API_KEY` 並按 API 用量計費。另一方面，
電腦裡已登入的 Claude Code 與 Codex 都是完整 agent，不是一個 completion endpoint。

Claude Code、Codex、Pi 與 OpenCode 的共同點，是把登入與模型選擇拆開。首次啟動不要求
背 model ID；session 先使用 default／recommended，之後才從 `/model` 或 picker 調整。

## 問題

如果只把選單文字改成「Claude subscription」，卻仍呼叫 PCA 的 `ModelProvider`，就會開始
碰觸不屬於 PCA 的 token，還會同時存在兩套 tool loop 與 approval。反過來，直接執行官方
CLI 又不能讓它接觸原始 repository：模型生成的程式碼仍是不受信任輸入。

另一個 UX bug 出現在授權。TUI 會問是否允許 Codex 修改 disposable clone，但原本
`Allow for session` 只記成 `MODIFY`。這會讓同一個 grant 意外放行 PCA 自己的
`replace_text`，甚至另一個 backend，範圍比畫面承諾的更大。

真正讓問題浮上檯面的輸入只有 `hi`。當時 TUI 把它包成 `TaskContract`，準備 isolated
clone，再因開發中的 repository 不乾淨而拒絕。模型根本還沒收到訊息；畫面卻像「對話沒
反應」。這不是要放寬 Git 檢查，而是對話與改碼本來就不該共用同一條 runner。

## 解法

設定拆成三層：

```text
Runtime     Claude Code | Codex CLI | PCA Agent
Connection  官方 CLI 自有登入 | API key | local/custom endpoint
Model       Automatic | session override | PCA provider model
```

執行再拆成兩種明確模式，不做意圖猜測：

```text
Ask    read-only question | no repo clone | no modify approval
Agent  coding task        | clean source  | clone + audit + verification
```

Claude Code 的 Automatic 不傳 `--model`，可改用 `sonnet`、`opus`、`haiku` 或 `best`；
Codex 同樣不傳 override，由官方 CLI 選 default，也可挑目前推薦的 Sol、Terra、Luna。
Ollama 則從固定 loopback、大小與數量受限的 `/api/tags` 結果挑第一個本機模型。未知的
OpenAI-compatible endpoint 不能猜，真正執行前仍需 model ID。

訂閱 runtime 永遠走 `ExternalCodingRunner`：先從固定 SHA 建 disposable clone，再交給官方
CLI 編輯；回來後由 PCA 拒絕 untracked、binary、symlink、rename 與越界路徑，重跑 exact
verification，最後再確認原始 repository 的 tracked 與 ignored 檔案都沒有變。

授權 key 也縮成 `(effect, external_agent:<backend>)`。允許 Codex 只代表本次 PCA process
裡後續 Codex task 不再問；關閉 TUI 就清掉，不寫設定，也不放行 Claude 或 PCA tool。
核准後先送出 activity、讓 UI render，再檢查 Stop，確保大型 repo 尚未 snapshot 前也能取消。

外部 runtime 預設進 Ask。每一輪仍用 ephemeral child，但 PCA 會重播長度受限、只存在記憶體
的 transcript，runtime、model 或 mode 改變就清掉。Claude Ask 關閉 tools；Codex Ask 使用
空的 temporary cwd 與 read-only sandbox。這代表 PCA 不把 repository 當 context、也不讓它
被寫入；Codex CLI 並非完整 OS filesystem sandbox，因此不能誇大成「絕對看不到 host」。

## 為什麼會這樣

畫面上的「Provider」看起來只是分類問題，實際上背後是 ownership。API adapter 只負責一次
model turn；external runtime 則持有完整 loop、登入、工具與預設模型。先分清楚誰擁有 loop，
model default、credential boundary 與 approval scope 才能各自落在正確的層；這正是
harness engineering 比單純包一層模型 SDK 更重要的地方。

Ask 的連續性只是 process-local bounded replay，不是 vendor session persistence，也不能跨
程序 resume；Agent 仍是一個 task 對應一個 isolated run。external JSONL 也尚未 token
streaming。這些邊界直接寫在產品裡，比畫一個看似萬能的聊天框更誠實。

## 學到的事

好用的預設不是硬編一個永遠會過期的 model ID，而是把選擇權交給真正擁有 runtime 的服務；
安全的「Session」也不是一個布林值，而是必須精確說出授權了誰、做什麼、活多久。
同樣地，安全檢查不該為了聊天而取消：應該把 `hi` 路由到不需要修改權限的 Ask，而不是讓
Agent 在 dirty repo 上偷偷繼續。

---

## 參考資料

- [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
- [OpenAI Codex models](https://developers.openai.com/codex/models/)
- [OpenCode providers](https://opencode.ai/docs/providers/)
- [OpenCode models](https://opencode.ai/docs/models/)
- [Python coding agent：把訂閱 CLI 放進隔離 clone](https://quidproquo.cc/posts/ai/2026-08-21-python-coding-agent-subscription-cli-isolated-clone)
