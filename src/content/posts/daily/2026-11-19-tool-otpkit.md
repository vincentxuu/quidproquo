---
title: "工具推薦｜otpkit — 免 API key 的臨時信箱／簡訊 MCP server，自動擷取 OTP"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "otpkit 是一個 MCP server，讓 agent 建立免費的臨時信箱與電話號碼，自動從新信件和簡訊裡擷取 OTP 驗證碼與驗證連結，不需要任何 API key"
tldr: "otpkit 是一個 MCP server，讓 agent 自己建立臨時信箱／電話號碼、等信、擷取 OTP。安裝：uvx otpkit。解決了測試註冊流程時要自己開信箱複製驗證碼的麻煩。"
series:
  name: "AI Tool of the Day"
  order: 83
---

> :globe: [English version](/posts/daily/2026-11-19-tool-otpkit-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | otpkit |
| 類型 | MCP server |
| GitHub | [SecFathy/otpkit](https://github.com/SecFathy/otpkit) |
| Stars | 60（查核時；repo 建立於 2026-11-17） |
| 語言 | Python 3.10+（只依賴 `mcp`、`httpx`） |
| 授權 | MIT |
| 安裝 | `uvx otpkit` |

## 解決什麼問題

你請 agent 幫你測試一個註冊流程、或是幫你完成某個網站的帳號申請，走到「輸入驗證碼」那一步時，agent 通常只能停下來——它沒有信箱，也沒有手機，收不到驗證信或簡訊。於是你得自己開一個臨時信箱網站、複製產生的地址貼回表單、等信、再回去信箱複製那串數字、貼回網站。每一步都把原本該由 agent 自己跑完的流程，硬生生交回人工。

otpkit 把這整段動作包成一個 MCP server。它串接 4 個免費信箱服務（grabmail、catchmail、guerrillamail、maildrop）和 3 個簡訊來源（1 個免費公開門號、2 個付費私人門號），讓 agent 用 `create_temp_email` 拿到一個可用地址，用 `wait_for_email` 真正「等」一封新信進來——不是檢查一次就放棄，而是內建輪詢直到收到或逾時。每封信或簡訊進來，otpkit 都會自動用正規表達式掃過內容，把 4–8 位數的 OTP 碼和含 `verify`／`confirm`／`token` 等關鍵字的驗證連結抽出來，直接回傳結構化的 JSON，agent 不用自己解析信件原始內容。

```diagram
title: otpkit 處理一次網站註冊驗證碼的流程
desc: Agent 建立臨時信箱後請 otpkit 等待新信件，otpkit 輪詢信箱收到驗證信，自動擷取 OTP 回傳給 Agent。
step: Agent 建立一個臨時信箱
step: otpkit 回傳信箱位址
step: Agent 請 otpkit 等待新信件
step: otpkit 每 5 秒輪詢信箱
step: 驗證信抵達信箱
step: otpkit 擷取 OTP 回傳給 Agent
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="376"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="376"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="376"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="108" text-anchor="middle" dominant-baseline="central">建立臨時信箱</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">回傳信箱位址</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 208H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="196" text-anchor="middle" dominant-baseline="central">等待新信件抵達</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 252H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="430" y="240" text-anchor="middle" dominant-baseline="central">每5秒輪詢收件匣</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--dashed" d="M540 296H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="284" text-anchor="middle" dominant-baseline="central">新訊息抵達</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 340H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="328" text-anchor="middle" dominant-baseline="central">回傳驗證碼</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="156" rx="2" data-step="3 4 5 6"/>
  <rect class="dg-box" x="540" y="240" width="8" height="68" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">otpkit</text>
  <rect class="dg-box dg-box--link" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Email 服務</text>
</svg>
```

適合場景：QA／測試自動化 agent 需要申請一次性測試帳號、示範一個產品的完整註冊流程時不想要人工介入複製驗證碼、或是用 browser-use 之類工具做端到端的註冊 agent，中間卡在「收驗證碼」這一步。

## 快速上手

### 安裝

```bash
# 不想另外裝進系統環境，直接用 uvx 執行（推薦，官方 README 的首選做法）
uvx otpkit

# 或用 pip 從 GitHub 裝
pip install git+https://github.com/secfathy/otpkit.git
```

Claude Code 一行加入：

```bash
claude mcp add otpkit -- uvx otpkit
```

Claude Desktop（或其他吃 JSON 設定的 client）在 `claude_desktop_config.json` 加：

```json
{
  "mcpServers": {
    "otpkit": { "command": "uvx", "args": ["otpkit"] }
  }
}
```

### 基本用法

```
你：幫我在 example.com 註冊一個帳號，收到驗證碼後直接幫我輸入

Agent 依序呼叫：
1. create_temp_email(provider="grabmail")
   → {"address": "tmp1794926042@grabmail.io"}

2. [用這個地址填完 example.com 的註冊表單]

3. wait_for_email(address="tmp1794926042@grabmail.io", timeout=60)
   → {
       "status": "received",
       "otps": ["847291"],
       "links": ["https://example.com/verify?token=abc123def"]
     }

4. [把 847291 填回網站的驗證欄位]
```

### 進階用法

免費簡訊門號是公開共享的，真的要申請需要簡訊驗證、且不想被別人看到內容的服務（例如 WhatsApp），就要換成付費的私人門號：

```
你：幫我買一個美國門號，收 WhatsApp 的驗證碼

Agent 依序呼叫：
1. get_sms_providers()
   → [..., {"name": "5sim", "ready": true}]

2. buy_temp_number(country="usa", service="whatsapp", provider="5sim")
   → {"order_id": "12345", "phone": "+12025551234"}

3. [用這個號碼在 WhatsApp 完成驗證]

4. check_paid_sms(order_id="12345")
   → {"status": "RECEIVED", "otps": ["583921"]}
```

付費門號只是把 `provider` 參數從預設的免費來源換掉，API 用法完全一樣，差別只在 `5sim`／`smspool` 要先設定對應的環境變數（`FIVESIM_API_KEY`／`SMSPOOL_API_KEY`）。

## 與現有工具的比較

| | otpkit | 手動開臨時信箱網站 | 自建 IMAP 測試信箱 | 單獨接簡訊驗證 API |
|---|---|---|---|---|
| 免 API key 可用 | ✓ | ✓ | 視 mail server 設定 | ✗ |
| agent 直接呼叫，不用開瀏覽器 | ✓ | ✗ | 部分（需自寫 polling） | 部分（需自寫 client） |
| 自動擷取 OTP／驗證連結 | ✓（regex） | ✗ 要自己找 | ✗ 要自己寫 | 視供應商格式 |
| 多信箱／多簡訊來源可切換 | ✓ 4 信箱 + 3 簡訊來源 | 單一網站 | 單一信箱 | 單一供應商 |
| 需要付費才有私人門號 | 選用（5sim／smspool） | — | — | 必須 |

## 注意事項

- **maildrop 是公開信箱**：任何人都能讀到同一個 username 的信件，只能用在非敏感測試，不要拿來收真實帳號的驗證信。
- **guerrillamail 地址約 1 小時過期**：長時間跑的測試流程要記得換新地址。
- **免費簡訊門號是公開共享的**：README 自己也明講，內容任何人都看得到，絕對不要用在真實帳號。
- **沒有資料庫**：session 狀態只存在記憶體，MCP server 重啟後，之前建立的臨時信箱／門號全部要重新申請。
- **還很新**：60 顆星、建立於 2026-11-17，正式排進 CI 或自動化測試流程之前，先自己手動跑過一輪完整流程。

## 今日收穫

以前覺得「agent 完成一個註冊流程」卡在 OTP 這步，是因為信箱、簡訊本質上是外部、非同步、需要等待的東西，沒辦法像一般 API 呼叫一樣同步拿到結果，所以這段一定要交回人工。otpkit 的做法是把「等待」這個動作本身做成一支會 block 的 MCP 工具（`wait_for_email`／`wait_for_sms`），而不是只給一支一次性的 check 工具——agent 不用自己寫 polling loop、也不用猜要等多久，原本「只有真人能做」的那一步，就被收進一次工具呼叫裡解決掉了。

## 參考資料

- [SecFathy/otpkit — GitHub](https://github.com/SecFathy/otpkit)
- [otpkit README（原始檔）](https://raw.githubusercontent.com/SecFathy/otpkit/main/README.md)
- [otpkit — pyproject.toml](https://raw.githubusercontent.com/SecFathy/otpkit/main/pyproject.toml)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
