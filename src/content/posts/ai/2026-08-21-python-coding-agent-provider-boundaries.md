---
title: "用 Python 寫私人 coding agent：M4 分清 ModelProvider、外部 agent 與訂閱邊界"
date: 2026-08-21
category: ai
tags: [coding-agent, python, model-provider, claude-code, codex, oauth, agent-harness]
lang: zh-TW
type: project
tldr: "M4 證明 PCA 自己的 AgentRunner 能透過 Groq 遠端 API、互動 TTY 與 current-schema resume 完成 coding run；同時把 Claude Code 留在 local-only ExternalAgentBackend，並誠實保留仍待使用者瀏覽器授權的 Codex OAuth 缺口。"
description: "Python coding agent M4 實戰：如何區分模型 transport、完整外部 agent 與消費者訂閱，並用 Groq、TTY、resume、Claude Code sentinel 和 Codex OAuth 缺口建立可審查證據。"
draft: true
glossary:
  - term: ModelProvider
    definition: "把特定模型 API 的訊息、工具呼叫、用量與錯誤轉成 agent core 共用契約的 transport adapter；它不擁有 agent loop。"
  - term: ExternalAgentBackend
    definition: "把整個任務委派給另一套已包含模型、工具、權限與 session 的 agent runtime；它不是可替換的單次模型呼叫。"
---

## TL;DR

M4 最重要的成果不是「又多接兩個 provider」，而是把三件長得很像的事拆開：PCA 的 `AgentRunner` 擁有 loop、工具、approval、checkpoint 與 verification；`ModelProvider` 只負責模型協定；Claude Code 這種完整 agent 只能放進另一條 `ExternalAgentBackend`。目前 Groq 的 `openai/gpt-oss-120b` 遠端 API URL 已在 tiny Python bug 跑到 5/5，bare TTY 與 current-schema resume 也各自完成 verified run；但 Claude 只有受限 sentinel，Codex 仍等使用者完成 browser grant，所以 M4 還不能宣告完成。

## 情境

前幾階段已經有自己的 Python loop、精確文字編輯、disposable Git workspace 與 artifact。接下來真正想要的是：同一個 CLI 可以接本機 Ollama、遠端 API，也能善用既有 Codex 或 Claude 訂閱。

這裡很容易犯一個架構錯誤：只要都能輸入 prompt、輸出文字，就把官方 coding CLI 假裝成 `ModelProvider`。問題是 Claude Code 與 Codex CLI 本身已經有 loop、工具、approval 和 session。再包一層會變成兩套 agent 互相呼叫，PCA 也失去「自己擁有 harness」這個前提。

## 問題

M4 必須同時回答三題：遠端 API URL 是否真的跑過完整 coding loop？互動 CLI 與 resume 是否只有單元測試？訂閱整合是合法且受支持的 transport，還是只是技術上能偷接 token？

這三題需要不同證據。HTTP mock 只能說序列化正確；sentinel 只能說某個 transport 可達；tool call 成功還不代表改檔與檢查成功；單次 verified run 也不能直接推論成日常可靠。這次因此保留 result、events、session、patch 與 verification，並讓重複測試先宣告通過門檻。若 artifact 不能回答「哪個 loop 做了什麼」，漂亮的終端輸出也不能算完成。

尤其 Anthropic 官方 Agent SDK 文件已明示：未經事先批准，第三方產品不能提供 `claude.ai` 登入或沿用訂閱 rate limits。Pi、OMP 原始碼能證明 OAuth 技術可做，不能替產品取得授權。`claude setup-token` 也不是繞過邊界的捷徑。

## 嘗試過程

先把最乾淨的路徑跑到底：PCA 仍使用自己的 `AgentRunner`，只把 `ModelProvider` 指向 Groq 的 OpenAI-compatible HTTPS endpoint。`openai/gpt-oss-120b` 在預先宣告 4/5 門檻的測試中拿到 5/5；每次都經過 list/read、`replace_text`、`run_check`、最終 verification，來源 worktree 的 HEAD、status 與 bytes 不變。這證明的是遠端 model transport 加上 PCA harness，不是 Groq 自己的 agent。

接著實際開 TTY 跑 bare `pca`：人類對 execute、modify 做 once/session approval，結果 `completed / verified`。另一個 current-schema run 則刻意在 approval pending 時中斷，再用 `pca resume` 接回；事件中留下 `session.resumed`、`approval.abandoned`，之後重新決策、修檔、驗證成功。這兩份證據補上了「CLI 有 wiring」與「真人操作真的走通」之間的差距。

resume 的重點也不只是「程式重新啟動後還能跑」。舊格式 session 即使曾經成功，也不能替新 schema 背書；目前證據明確包含 `protocol` 與 prompt version，恢復時會校驗 repository base、writer lease 與未決 side effect。中斷在 approval pending 時，系統先把上一個決策記成 abandoned，而不是預設放行或偷偷重播，再讓人重新決定。這才是可審計的恢復，不只是重新送一次 prompt。

Claude 則刻意只做受限測試。PCA 呼叫使用者安裝的官方 `claude`，使用臨時 cwd、受控環境、stream-json、輸入輸出與 timeout 上限、process-group cleanup，並關閉 tools、slash commands 與 session persistence。它只驗證 exact sentinel 能回來；PCA 不解析或轉送 Claude token，但官方 child 仍透過保留的 `HOME` 讀取自己擁有的登入狀態。**這沒有完成 PCA coding E2E。**

Codex 的 app-owned PKCE、refresh、0600 credential store 與 Responses adapter 已有 mock/contract tests，但本機 PCA credential 仍不存在。公開 Codex client ID 只適合留在明確的 experimental opt-in；在使用者親自完成 browser grant、再跑 live tool-calling E2E 前，不能把官方 Codex CLI 已登入當成 PCA 已獲授權。

## 解法

最後固定成兩條不能混用的介面：

```python
class ModelProvider(Protocol):
    async def complete(self, messages, tools=()) -> ModelTurn: ...

class ExternalAgentBackend(Protocol):
    async def run(self, task, *, event_sink=None) -> ExternalAgentResult: ...
```

原生 Anthropic API key、Groq、Ollama、Gemini、Workers AI 都屬於第一條：PCA 擁有 loop。官方 Claude Code delegation 屬於第二條：外部程式擁有 loop，而且目前只能 local-only、experimental、無工具 sentinel。所謂 approved proxy 也只能代理合法商業 API credential，不能把 Pro/Max consumer OAuth 變成可轉售的模型 API。

這個拆法也保留未來部署空間。換成 Cloudflare 上的遠端 endpoint，只改 provider transport 與 secret composition，不必重寫 agent core；若要比較 Claude Code 的完整行為，就走另一個 CLI 命令並把事件標成 external backend。兩邊的 evaluation 必須分開統計，否則外部 agent 的能力會被誤算成 PCA harness 的能力。

## 為什麼會這樣

真正的邊界不是 Python class 名稱，而是**誰決定下一步、誰執行工具、誰保管 credential**。若 PCA 決定下一步，provider 就只能回 canonical model turn；若官方 CLI 決定下一步，它就是完整 backend。把兩者分開後，安全宣稱也會自然變精確：Groq 5/5 能證明 PCA coding loop，Claude sentinel 只能證明受限 subprocess transport，Codex mock 只能證明尚未授權前的本地契約。

## 學到的事

agent 平台最危險的不是少支援一個模型，而是把「能呼叫」寫成「已授權」，把「sentinel 成功」寫成「coding agent 完成」。M4 已經補上遠端 API、真人 TTY 與 current-schema resume 的實證，也建立 Claude 的安全隔離介面；剩下 Codex 使用者 grant、真實 Codex E2E，以及更廣的 Claude 路徑仍是明確缺口。**這是一個更可信的中間狀態，不是 goal complete。**

---

## 參考資料

- [Anthropic — Agent SDK overview](https://code.claude.com/docs/en/agent-sdk)
- [OpenAI — Codex authentication](https://developers.openai.com/codex/auth)
- [OpenAI — Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- Python agent harness 的設計基礎：[QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：prompt injection 只能在 harness 層做損害控制](https://quidproquo.cc/posts/ai/2026-08-10-agent-security-harness-layer)
