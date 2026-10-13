---
title: "工具推薦｜mcptui — 不開瀏覽器、不燒 token，在終端機裡偵錯 MCP server"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "終端機版的 MCP Inspector：裝好 MCP server 後直接在 TUI 裡呼叫工具、看 schema、追 JSON-RPC 封包，不用改設定檔重啟 Claude Desktop，也不用燒 LLM token 測試"
tldr: "mcptui 是一個開源 Python TUI，讓你直接在終端機裡測試、檢查、偵錯 MCP server。安裝：pip install mcptui。解決了測 MCP server 要改設定檔重啟 app、或開瀏覽器跑官方 Inspector、或燒 token 讓 agent 幫你測的問題。"
series:
  name: "AI Tool of the Day"
  order: 54
---

> 🌏 [English version](/posts/daily/2026-10-14-tool-mcptui-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcptui |
| 類型 | CLI / Terminal UI（TUI） |
| GitHub | [kimarsen/mcptui](https://github.com/kimarsen/mcptui) |
| Stars | 1（2026-10-14 查，repo 於 10-13 建立，上線不到一天） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `pip install mcptui` |

## 解決什麼問題

你在寫一個 MCP server，想確認剛加的工具能不能被正常呼叫。以前的做法是把它接進 Claude Desktop 或 Cursor 的設定檔，重啟整個 app，再用自然語言請 agent 幫你呼叫一次——如果 schema 寫錯或回傳格式不對，要重新編輯設定檔、重啟、再問一次。每次只是想確認一個函式「跑不跑得動」，就要燒一輪 LLM token，還要等 app 重啟。官方的 MCP Inspector 不用改設定檔，但它是跑在瀏覽器裡的 web app，需要 Node.js，還要開一個 `localhost:5173` 的分頁，跟純終端機的開發流程接不上。

mcptui 把這個偵錯迴圈搬進終端機本身。裝好、指向你的 server 指令（例如 `mcptui run "python my_server.py"`）之後，它會列出這個 server 公開的所有工具、resource、prompt，自動依 `inputSchema` 產生參數範本，你填好 JSON 按 `Ctrl+Enter` 就直接呼叫，結果即時顯示延遲與格式化輸出——完全不經過任何 LLM，所以不燒 token。它還有一個即時的 JSON-RPC 2.0 封包檢視器，能看到 `initialize`、`tools/call` 等每一筆請求與回應的原始內容，方便抓協定層的問題。更進一步,它會自動掃描 Claude Desktop、Cursor 和專案內的 `mcp.json`,把你已經設定好的 server 都讀進來,不用重新輸入指令。

適合的場景：開發新 MCP server 時的單元測試迴圈（改一行 code 就重新呼叫一次看結果）、懷疑某個工具的 schema 或回傳格式有問題時的手動排查、在 CI 流程裡用它的 headless CLI 模式驗證工具沒有壞掉、或是單純想先看看一個陌生 MCP server 到底公開了哪些工具,再決定要不要接進自己的 agent。

## 快速上手

### 安裝

```bash
# 用 pip
pip install mcptui

# 或用 uv（不用先建虛擬環境,直接跑）
uvx mcptui demo
```

### 基本用法

先用內建的 demo server 熱身,看看介面長什麼樣子：

```bash
mcptui demo
```

接上你自己寫的 MCP server：

```bash
mcptui run "python my_server.py"
```

啟動後會看到分頁式介面（Tools / Resources / Prompts / Protocol Logs / History）,在左側選一個工具,右側會自動生出一份 JSON 參數範本,填好按 `Ctrl+Enter` 執行,幾十毫秒內就能看到回傳結果。

### 進階用法

不想開互動介面,直接在腳本或 CI 裡呼叫單一工具並取得乾淨的 JSON 輸出：

```bash
# 把 server 登記成一個常駐設定
mcptui add notes "python examples/sample_server.py"

# 列出這個 server 公開的所有工具
mcptui list notes

# headless 呼叫一個工具,拿到 JSON 結果
mcptui call convert_temperature '{"value": 100, "from_scale": "C", "to_scale": "F"}' --server notes
```

## 與現有工具的比較

| | mcptui | 官方 MCP Inspector | 直接接 Claude Desktop / Cursor 手動測 |
|---|---|---|---|
| 需要 Node.js / 瀏覽器 | ❌,純終端機 | ✅ 需要兩者 | ❌ |
| 測試會消耗 LLM token | ❌ | ❌ | ✅ 每次呼叫都要經過 agent |
| 改一個工具要重啟整個 app | ❌ | ❌ | ✅ |
| 自動讀取既有 agent 設定(Claude Desktop／Cursor／`mcp.json`) | ✅ | ❌ | — |
| 可寫進 CI 腳本的 headless 模式 | ✅（`mcptui call` / `mcptui list`） | 有 CLI 模式但主介面仍是網頁 | ❌ |
| 即時查看原始 JSON-RPC 封包 | ✅ | ✅ | ❌ |

## 注意事項

- **剛上線,生態還沒驗證**：repo 是 2026-10-13 才建立,目前只有一位作者、1 顆星,還沒有大量真實使用者回報過邊界情況,拿來測正式環境前建議先用熟悉、能接受的 server 試過一輪。
- **跟官方 MCP Inspector 是互補而非取代關係**：mcptui 強在純終端機、免 token 的快速迴圈,但官方 Inspector 本身也在持續更新（v2.7.0 已把 web/cli/tui 三種介面合進同一個 binary）,兩者解決的是同一類需求,選哪個看你的工作流更貼近終端機還是瀏覽器。
- **目前只支援 stdio／SSE 連線的本機或已知位址 server**：README 沒有提到對需要額外認證流程（如 OAuth）的遠端 MCP server 有特別處理,接這類 server 前建議先看一下原始碼或開 issue 確認。

## 今日收穫

一直以為「測 MCP server」只有兩個選項——接進真正的 agent 裡用自然語言測,或是開官方 Inspector 的網頁版——看到 mcptui 才意識到這中間還有一塊「純粹的協定層偵錯工具」的空間：不經過任何 LLM 推理,把 MCP server 當成一般的 API 服務,用類似 Postman 的方式直接打工具、看 schema、查封包。這讓「這個工具能不能跑」跟「agent 能不能正確使用這個工具」變成兩個可以分開排查的問題，而不是混在一起、出錯了也不知道是協定層還是模型理解的問題。

## 參考資料

- [kimarsen/mcptui — GitHub repo](https://github.com/kimarsen/mcptui)
- [mcptui README](https://raw.githubusercontent.com/kimarsen/mcptui/main/README.md)
- [mcptui — PyPI package](https://pypi.org/project/mcptui/)
