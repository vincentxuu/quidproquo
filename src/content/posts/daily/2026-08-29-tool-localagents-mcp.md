---
title: "工具推薦｜localagents — 把 Claude Code 的苦力活丟給你自己的 GPU 做"
date: 2026-08-29
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Claude Code 把重複性的程式碼工作委派給本地跑的 llama.cpp / vLLM 模型執行，Claude 只負責設計和審查，省下 Anthropic token 額度"
tldr: "localagents 是一個 MCP server，讓 Claude Code 能把子任務委派給本地跑的 llama.cpp / vLLM 模型執行。安裝：git clone + uv tool install -e . + claude mcp add。解決了本地模型難以直接接上 Claude Code 對話協定（KV-cache、context window）的相容性問題。"
series:
  name: "AI Tool of the Day"
  order: 14
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | localagents |
| 類型 | MCP server（把子任務委派給本地模型的橋接層） |
| GitHub | [ccebelenski/localagents](https://github.com/ccebelenski/localagents) |
| Stars | 5 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/ccebelenski/localagents.git && cd localagents && uv tool install -e .` |

## 解決什麼問題

你是否算過一件事：Claude Code 幫你「幫這個 module 加個 CLI，順便補測試」的時候，花的 token 跟「設計這個系統的介面該怎麼切」其實是同一個等級的預算？前者是照著既有介面把程式碼寫出來、跑測試、改到綠燈,是體力活；後者才是真正需要模型判斷力的地方。但 Claude Code 沒有分別對待這兩種任務,兩邊都用同一個模型跑,你的 token 額度就這樣被體力活吃掉一大塊。

localagents 是一個 MCP server，給 Claude Code 一個新工具 `run_agent`：每次呼叫都會啟動一個完整的、headless 的 Claude Code session——同一套工具、同一份 `CLAUDE.md`、同一個工作目錄——只差在它的 API 流量打去你自己跑的 llama.cpp 或 vLLM server，而不是 Anthropic。Claude 負責寫工作簡報、本地模型負責把活幹完、Claude 再審查結果。真正麻煩的不是「換一個 base_url」這麼簡單：Claude Code 送出的訊息格式本地聊天模板會拒收（把 `system` role 塞在對話中間,Qwen 的模板直接報錯 "System message must be at the beginning"）,而且 Claude Code 預設假設任何陌生模型都有 200k context window,一撞上 llama.cpp 較小的視窗就直接讓整個 job 死掉。localagents 中間那層 shim 把這兩件事都處理掉：訊息原地折疊而不是搬到最前面（後者會讓 KV-cache 的 prompt 前綴失效,27B 模型每輪重算要 21–47 秒）,並且即時探測每個 endpoint 真正的 context window,回填給 Claude Code 讓它的 auto-compact 在正確時機觸發。

適合場景：本地已經有一張夠力的 GPU 在跑 llama.cpp 或 vLLM(作者用 27B 的 Qwen 當範例),想把「照介面寫程式碼、補測試、跑到綠燈」這類體力活分流出去,把 Anthropic 的 token 額度留給真正需要判斷力的設計對話。專案還處於早期階段,作者自己每天在用,但介面仍會變動。

## 快速上手

### 安裝

```bash
git clone https://github.com/ccebelenski/localagents.git && cd localagents
uv tool install -e .                  # `localagents` 進 PATH，editable 安裝
cp models.example.yaml models.yaml    # 編輯成自己的 server 位址（已加進 .gitignore）
claude mcp add --scope user local -- localagents --config "$PWD/models.yaml"
```

依賴：Python 3.12+、[uv](https://docs.astral.sh/uv/)、Claude Code（Agent SDK 自帶 `claude` binary,不用額外裝）,以及一個講 Anthropic `/v1/messages` 協定的本地 server：llama.cpp 要加 `--jinja` 啟動,vLLM 要加 `--enable-auto-tool-choice --tool-call-parser <parser>`。裝完後重啟 Claude Code 或在 `/mcp` 選單重新連線,MCP server 只在啟動時載入。

### 基本用法

`models.yaml` 定義本地 server 的位置和模型別名：

```yaml
endpoints:
  llamacpp:
    base_url: http://127.0.0.1:8080
    backend: llama.cpp

models:
  qwen3.8-27b:
    notes: default mid-size coder on llama.cpp; run with --reasoning on
```

裝好之後直接跟 Claude 說要用本地模型做事,它會自己呼叫 `list_models` 確認有哪些模型在跑,再呼叫 `run_agent` 起工作、用 `wait_job` / `job_status` 追蹤進度:

```
用本地模型幫這個 CLI 加一個 --json 參數，並且補上對應的測試。
```

如果沒有對應模型在跑,Claude 會直接告訴你該起哪一個(例如「`qwen3.8-27b` 沒有在跑,請開起來」),你手動啟動 llama-server 後回一句「好了」,Claude 就會重試。工作超過 Claude Code 內建的 2 分鐘工具逾時會自動轉背景執行,不用自己顧著。

### 進階用法

`isolation: worktree` 讓每個委派出去的任務在獨立的 git worktree(`local-agent/*` 分支)裡跑,只有真的改了東西才保留,job 紀錄裡會附一份 diffstat,方便 Claude 用 diff 的方式審查本地模型交回來的結果,不會弄髒你目前工作中的分支：

```
run_agent(task="重構 parser 模組加型別註解", model="qwen3.8-27b", isolation="worktree")
```

## 與現有工具的比較

「把 Claude Code 導向別的 model」這個需求,市面上更常見的做法是外部 proxy(例如 [claude-code-router](https://github.com/musistudio/claude-code-router)),整段換掉 `ANTHROPIC_BASE_URL` 讓所有流量都改道。localagents 走的是完全不同的路線：主 session 仍然是 Claude,只把子任務「委派」出去。

| | localagents | 外部 proxy（如 claude-code-router） | 手動改 `ANTHROPIC_BASE_URL` |
|---|---|---|---|
| 主 session 留在 Claude，只委派子任務 | ✅ | ❌（整個 session 換掉來源） | ❌ |
| KV-cache 友善的系統訊息折疊 | ✅ | ❌ | ❌ |
| Context window 自動偵測並回填給 Claude Code | ✅ | 依各 proxy 實作而定 | ❌ |
| Git worktree 隔離本地模型的改動 | ✅ | ❌ | ❌ |
| 任務背景執行與 job 追蹤 | ✅（`wait_job` / `job_log` / `list_jobs`） | ❌ | ❌ |
| 鎖定後端 | llama.cpp / vLLM | 通常支援多家雲端/本地供應商 | 你自己接的任何 endpoint |

## 注意事項

- **狀態是「早期」**：README 明確寫「Status: early. It works, I use it daily, and the interface will move.」,工具名稱與參數之後可能會改。
- **只鎖定 llama.cpp 和 vLLM**：作者明講「Ollama isn't a goal」,如果你的本地模型 server 是 Ollama,這個工具目前不支援。
- **Context window 太小會卡住**：README 實測 64k 視窗會「thrash」——Claude Code 固定的 prompt 加上壓縮摘要沒幾輪就把視窗填滿,觸發防呆機制直接中止工作,建議每個 slot 至少留 128k。

## 今日收穫

原本以為「把 agent 導向本地模型」只是換一個 API endpoint 的事,但 localagents 的 shim 說明真正的瓶頸在協定相容性的細節裡：Claude Code 內嵌的多輪 system 訊息、它對 context window 大小的假設,都是本地模型伺服器不見得撐得住的地方。換 endpoint 只是第一步,讓本地模型撐得住 Claude Code 這套對話協定,才是這類工具真正在解決的問題。

## 參考資料

- [ccebelenski/localagents GitHub repo](https://github.com/ccebelenski/localagents)：README、架構圖、安裝指令、`models.yaml` 設定範例、shim 運作細節、context window 處理方式均出自官方 repo。
- [ccebelenski/localagents LICENSE](https://raw.githubusercontent.com/ccebelenski/localagents/main/LICENSE)：MIT 授權條款。
- [musistudio/claude-code-router GitHub repo](https://github.com/musistudio/claude-code-router)：作為外部 proxy 類做法的參照對象。
