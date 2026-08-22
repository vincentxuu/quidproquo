---
title: "Composio：agent 接一百個 SaaS 時，誰替你保管每個使用者的 token"
date: 2026-08-21
category: ai
type: deep-dive
tags: [composio, ai-agent, oauth, mcp, tool-use, multi-tenant]
lang: zh-TW
tldr: "站上把 MCP 寫得很齊，卻從沒寫過它下面那一層：agent 要代表一萬個終端使用者去讀他們各自的 Gmail 時，refresh token 存在誰家、怎麼更新、怎麼撤銷。Composio 是這層目前最完整的一家——SDK 是 MIT，執行與託管 OAuth 是雲端服務；官方自稱 1,000+ toolkit，但託管 OAuth 清單實際列出 121 個，另外 96 個要你自備憑證。2026-08-15 起的新價目：免費 10 萬次 tool call、Pro $29/月。這篇拆它的授權模型到可操作的深度，並劃出「自己接 MCP server」與「用整合平台」的分界。"
description: "Composio 深入介紹：user ID / auth config / connected account 三層授權模型、託管 OAuth 與自備 OAuth app 的分野、撤銷與退場路徑、Connect Link 的 OAuth session fixation 防護，以及 2026-08 實查的定價與選型判準。"
series:
  name: "AI 時代的技術選擇"
  order: 14
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-composio-agent-tool-integration-en)

這個站把 MCP 這條線寫得算齊。[協定本身](/posts/ai/2026-03-22-mcp-model-context-protocol)、[Playwright](/posts/tech/2026-06-20-playwright-mcp) 與 [Chrome DevTools](/posts/tech/2026-06-20-chrome-devtools-mcp) 兩支瀏覽器 server、[把自己的爬蟲包成 MCP server](/posts/tech/2026-03-20-mcp-server-job-scraper)、[Claude Code 怎麼掛](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration)、[協定層之間怎麼分工](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)，都有專文。

但那些文章講的全是**你自己的 agent 連你自己的工具**。有一層完全沒寫過。

假設你的產品有一萬個終端使用者，agent 要代表其中每一個人去讀「他的」Gmail、寫「他的」Notion、發「他的」Slack 訊息。那一萬份 OAuth refresh token 存在誰家的資料庫？過期了誰去換？使用者要撤銷時按哪個按鈕？

這一層不是「呼叫 API」的問題。呼叫 API 是最簡單的部分。

## Composio 是什麼

[Composio](https://composio.dev/) 賣的是一組託管的工具目錄加一層授權基礎設施。你在自己的後端呼叫它的 SDK，它回給你一組已經接好認證的工具定義，餵給任何 agent 框架都能用。工具真正執行時，Composio 拿著那位使用者的憑證去打上游 API。

[SDK monorepo 在 GitHub 上是 MIT 授權](https://github.com/ComposioHQ/composio)，2026-08-21 讀取時是 29,788 顆星。開源的是 TypeScript 與 Python 兩套 SDK、CLI，以及 provider 轉接層——OpenAI Agents、Claude Agent SDK、Vercel AI SDK、LangChain、LlamaIndex、Mastra、CrewAI 都有。

**不開源的是執行面。** 託管 OAuth、憑證保管、tool 目錄、dashboard、沙箱都在 Composio 的雲上，官方文件裡我沒有查到自架路徑。

規模數字要分兩層看。「1,000+ toolkits」出現在首頁、README 與價目表，是廠商自稱。可以獨立核對的是[託管認證清單](https://docs.composio.dev/toolkits/managed-auth)這一頁。它列出 **121 個** Composio 已經替你註冊好 OAuth app 的 toolkit，Gmail、Slack、GitHub、Notion、Salesforce、HubSpot 都在裡面。另外 **96 個**必須你自備憑證，包括 Shopify、Snowflake、ServiceNow、Twitter、Xero。

這頁只涵蓋有認證概念的 toolkit，不等於全部目錄。但它是唯一一個能逐條數的數字。

三個名詞決定了整個模型，一開始搞混後面全錯：

- **user ID**：你系統裡那個人的識別碼。文件寫得很硬：用資料庫主鍵，可接受唯一 username，**避免 email**（會變）。**production 絕不要用 `default`**，官方直說那會「暴露其他使用者的資料」。
- **auth config**：一個 toolkit 怎麼認證的藍圖。四種 scheme 選一種（OAuth2 / API key / Bearer token / Basic）、要哪些 scope、用 Composio 的 OAuth app 還是你自己的。一份 auth config 給全部使用者共用。
- **connected account**：某一個使用者對某一個 toolkit 的授權實例，token 就存在這裡，綁在 user ID 上。

一句話：auth config 是模具，connected account 是每個使用者各自壓出來的那一件。

## 授權流程實際長什麼樣

每個 session 預設帶一顆 `COMPOSIO_MANAGE_CONNECTIONS` 元工具。agent 要用某個工具而該使用者還沒授權時，它讀那個 toolkit 的 auth config、建一筆連線、回傳一個 **Connect Link**——Composio 託管的登入頁。使用者在那頁上完成 OAuth，Composio 收下 token。官方對這個設計的說明是：「憑證不會經過你的應用程式，也不會經過模型，所以直接把連結貼在聊天視窗裡是安全的。」

不想等 agent 自己觸發，可以在 onboarding 或設定頁直接呼叫 `session.authorize()` 事先生成連結。

```python
from composio import Composio

composio = Composio()

# session 綁定到你系統裡的那個人，不是綁到你的 API key
session = composio.create(
    user_id="user_123",
    manage_connections={"callback_url": "https://yourapp.com/chat"},
)

tools = session.tools()   # 交給任何 agent 框架
```

session 這個概念本身也是為了 context 而生。它預設不把幾百個 tool definition 灌進 context，而是給 agent 一小組元工具，讓它在執行期用 `COMPOSIO_SEARCH_TOOLS` 搜、用 `COMPOSIO_MULTI_EXECUTE_TOOL` 執行。這正是站上[工具選擇崩塌曲線](/posts/ai/2026-06-04-tool-selection-at-scale)那篇談的問題，Composio 選的是「執行期檢索」這個答案。session 建立在伺服器端、不會過期，多輪對話要存下 session ID 用 `composio.use()` 接回去。

## token 到底在誰手上

這是選型時最該問清楚的一題，而答案取決於你用哪一種 auth config。

**用 Composio 託管的 OAuth app**（預設）：client ID 與 client secret 是 Composio 的，access token 與 refresh token 存在 Composio，換 token 也是 Composio 做的。你的後端從頭到尾沒碰過憑證。代價是四件事，官方文件自己列得很清楚：

1. 使用者在 Google、GitHub 的同意畫面上看到的是「**Composio** wants to access your account」，不是你的產品名。
2. rate limit 是全 Composio 客戶共用的配額。
3. 觸發器輪詢有 **15 分鐘**的最低間隔，自備 OAuth app 才能更快。
4. 預設 scope 是 Composio 挑的。

**自備 OAuth app**：你去 Google / GitHub 的開發者後台註冊自己的應用、把 redirect URI 指向 Composio 的 callback，然後把 client ID 與 secret 交給 Composio。同意畫面掛你的名字、配額是你自己的、scope 你自己定（`scopes` 用逗號分隔的字串傳）。token 仍然存在 Composio。

**要連 Composio 都看不到明文 token**，只有一條路：Enterprise 方案的 KMS proxy——你自己持金鑰，secret 在送達前就加密，Composio 只存密文。文件同時把界線講明白：「它涵蓋的是 secret 儲存，不是完整的資料落地。」

還有一條混合路徑值得知道：你可以把**自己已經跑完 OAuth 拿到的 access token**，以 `BEARER_TOKEN` scheme 匯入成 connected account。這條路適用於所有支援 OAuth2 的 toolkit。但代價寫在文件上：「既然 token 是你提供的，Composio 不會處理 OAuth 更新。你要自己在你那邊更新，並在每次變動時用 PATCH 推新值過來。」換句話說，**你可以只買工具目錄不買授權託管**，但那樣就等於自己扛 refresh 迴圈。

**怎麼做**：今晚就能決定的一件事——列出你要接的前五個 toolkit，逐個去[託管認證清單](https://docs.composio.dev/toolkits/managed-auth)查它在 121 那組還是 96 那組。落在 96 那組的，你本來就得註冊自己的 OAuth app，那託管認證的省事優勢對你的專案其實不存在。

## 撤銷、過期、與退場

多租戶授權真正會出事的地方在生命週期，不在第一次連線。

**過期**：Composio 會在 OAuth token 到期前自動更新；連續更新失敗之後，連線狀態才會被標成 `EXPIRED`。只有 `ACTIVE` 狀態的連線能執行工具，其餘狀態要先處理。

**撤銷**：API 把兩件事分開，這個區分很重要——

| 動作 | 端點 | 效果 |
|---|---|---|
| 撤銷 | `POST /connected_accounts/{nanoid}/revoke` | 到上游服務那邊撤掉授權 |
| 刪除 | `DELETE /connected_accounts/{nanoid}` | 把這筆連線從 Composio 移除 |
| 停用 | `PATCH /connected_accounts/{nanoid}/status` | 保留資料，暫時關掉 |

只做 `DELETE` 不做 `revoke`，那筆授權在 Google 那邊還活著。這是你的 GDPR / 個資刪除流程一定要接對的地方。

**scope 變更不會回溯**：改了 auth config 的 scope，只影響**新的**連線。已經授權的使用者維持原本的 scope，除非他重新認證。想收緊權限的人要注意這條——改設定不等於既有使用者的權限縮小了。

**退場成本**：換成自己的 OAuth app 時，既有 connected account 仍綁在原本的 auth config 上、繼續用原憑證更新。要真的遷移，官方給的路是「刪掉舊的 connected account、讓使用者重新授權」，或在支援的情況下匯入憑證。也就是說，**離開託管認證的代價是讓一批使用者重新點一次同意畫面**——這個數字在你有一萬個使用者時不是零。

## 一個真實的攻擊面：Connect Link 的身分固定

這節是我讀完整份認證文件後覺得最值得單獨拉出來講的一段，因為它承認了一個託管授權天生的漏洞，而不是把它藏起來。

Composio 的文件直述問題：

> 任何人打開 Connect Link 並同意，就會成為那條流程所綁定的帳號。這件事本身就可被利用：有人以自己的使用者身分發起連線，在同意之前把授權 URL 複製出去，再讓另一個人完成它，那個人的服務帳號就被掛在攻擊者的身分底下。這是 OAuth session fixation。

對策叫 **callback identity verification**，是專案層級的 opt-in。打開之後，每一條 OAuth 連線都會被扣住，直到你的伺服器確認回來的是誰：

1. 上游 callback 之後，Composio 把瀏覽器導到你自己架的端點，只帶一個 `session_uri` 查詢參數——**不帶連線 ID、不帶使用者 ID、不帶 toolkit 名稱**。
2. 你的伺服器用專案 API key，把 `session_uri` 和你這邊登入中的 `user_id` 一起 POST 到 complete auth 端點。
3. 對得上就啟用連線；對不上回 `400`，連線轉為 `FAILED`，`status_reason` 寫 `Callback identity verification failed`。

`session_uri` 一次性、十分鐘有效，兌換就消耗，重複呼叫回 `404`。有個實務坑要先知道：驗證器 URL 設好之後，**從 dashboard 發起的連線就完成不了**——dashboard 的連線屬於 Composio 的後台使用者，不是你 app 的使用者，你的端點報不出對得上的 `user_id`。要嘛從自己的 app 測，要嘛開發時先清掉。

**怎麼做**：如果你的 agent 是多租戶的、而且 Connect Link 會出現在聊天視窗或 email 裡（也就是連結可能被轉發），這個開關就該打開。它預設是關的。

## 它現在也是 MCP server

這是 2026 年的變化，也是它跟站上既有 MCP 文章的接點。Composio 現在有兩種進入方式，同一套授權後端：

**SDK 模式**：`composio.create(user_id)` 拿 session，用 provider 轉接層餵給你的框架。要 MCP 就在建立 session 時帶 `mcp: true`，拿 `session.mcp.url` 去接任何 MCP client。

**Composio Connect**：一個共用的遠端 MCP server，位址是 `https://connect.composio.dev/mcp`，接 Claude Code、Claude Desktop、Cursor、ChatGPT、VS Code、n8n 都有官方步驟。

```bash
claude mcp add --scope user --transport http composio \
  https://connect.composio.dev/mcp \
  --header "x-consumer-api-key: YOUR_API_KEY"
```

關鍵設計是：它**不把上千個 app 工具直接攤開**，只暴露 7 顆元工具——搜尋工具、取 schema、平行執行（單次最多 50 個）、管理連線、等待連線、遠端 workbench 的 Python 與 bash。第一次要用某個 app 時，它現場生一條 OAuth 連結給你在瀏覽器批准，之後連線會跨 session 留著。

這件事對讀者的意義是：如果你只是想讓自己的 Claude Code 能碰 Gmail 和 Linear，這條路兩分鐘就通，而且不需要寫任何後端。**但那是單人情境**——你就是那個 user ID。多租戶的複雜度在前面幾節，不在這裡。站上[「一個人接 MCP 沒問題，三百個人接就需要一座門」](/posts/ai/2026-08-16-cs146s-ai-native-team)講的是同一件事的組織面，這篇講的是它的授權面。

## 價目表（2026-08-15 起）

Composio 在 2026-08-15 換了新價目。以下是[官方價目頁](https://composio.dev/pricing)實查的內容：

| 項目 | Free | Pro（$29/月） | 超量 |
|---|---|---|---|
| Tool call（自備 app / API key / MCP） | 10 萬次/月 | Free 全含，另加 $29 用量額度 | $0.0003/次 |
| Trigger 事件 | 5 萬次/月 | 同上 | $0.003/次 |
| Connected account（自備 app） | 無限、免費 | 免費 | — |
| Sandbox 的 LLM token | 100 萬/月 | 同上 | $3.75/百萬 |
| 團隊成員 | 3 人 | 無限 | — |
| log 保留 | 7 天 | 30 天 | Enterprise 可客製 |

兩個時程要記：既有客戶留在原方案到 2026-12-31；premium tool 的計費從 2026-09-01 起對所有人生效。

用 Composio 託管的 OAuth app 另有一組**較貴、且吃同一個免費額度**的費率。十萬次免費額度裡，最多兩萬次能走託管 app，之後每次 $0.0005；連線數超過一千個之後每個 $0.10。這條設計把「省事」明碼標價了——不註冊自己的 OAuth app，你的免費額度直接砍到五分之一。

還有兩個容易被忽略的加購。零資料留存（ZDR）是 Pro 以上的加購，按 tool call 與 trigger 事件各收一筆；在 session 之外做 direct execution 也要加錢。Free 方案是硬上限，撞到就停到下個月，不會產生帳單。

premium tool 走成本轉嫁：Composio 說它「原價轉嫁再加 5% 平台費，不另外加價」。清單裡包含 Browser Use、Veo 影片生成，以及 [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents) 與 Tavily 的搜尋。Exa 那條可以對帳：Composio 開約 $0.008 一次，而系列前一篇查到 Exa 直接買是 $7/千次——轉嫁那 5% 對得上。

## 自己接 vs 用平台：分界在哪

我的判斷分三種情況。

**單人、自己用、少數幾個 app**：不要用整合平台。裝現成的 MCP server 或直接寫幾個 API 呼叫就好，你只有一份 token、放在 `.env` 或系統 keychain 裡，沒有任何生命週期問題。這時候多一層雲端服務只是多一個故障點與一份憑證託管風險。

**產品有終端使用者、要接三個以上需要 OAuth 的服務**：這是整合平台真正的射程。判準不是「你會不會寫 OAuth」——OAuth 授權碼流程本身一天就寫得完。真正吃掉時間的是**乘法**：每多一個服務就多一套 scope 語意、多一種 token 壽命、多一種撤銷行為、多一組 rate limit，再乘上「每個使用者一份」的加密儲存、更新排程與稽核。這個乘法就是這類平台在賣的東西。

**中間地帶——只接一兩個 OAuth 服務**：自己寫。一份 refresh 迴圈加一張加密的 token 表，可控、可測、沒有第三方持有你使用者的憑證。這條線我會畫在三個服務上下。

有兩種情況會直接推翻上面的結論。第一，**合規要求憑證不得由第三方保管明文**——那就只剩 Enterprise 的 KMS proxy 或自己做。第二，**你的核心競爭力就是整合本身**（例如你賣的就是一個 iPaaS），那把它外包給別人在戰略上說不通。

不管走哪條路，這篇的所有機制題都要回答一次：token 存哪、誰更新、撤銷走哪個端點、scope 改了既有使用者怎麼辦。**用平台的意義是有人替你答完這幾題，不是這幾題消失了。** 系列第 8 篇 [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools) 留下的問題——agent 繼承使用者權限之後誰負責——在這一層得到的是一個明碼標價的答案，不是一個更安全的答案。

## 這層還有誰

競品只當背景，這篇不打分。

[Arcade](https://docs.arcade.dev/en/get-started/about-arcade) 把自己定位成「企業級的 agent 動作執行 runtime」，賣點壓在每次動作的授權與集中治理，是 MCP-first 的路線。

[Pipedream](https://pipedream.com/docs) 的 Connect 產品線走的是同一層，自稱三千多個 API 的一鍵 OAuth 加託管認證。但它的歸屬變了：Workday 在 [2025-11-19 宣布簽署收購協議](https://newsroom.workday.com/2025-11-19-Workday-Signs-Definitive-Agreement-to-Acquire-Pipedream)，預計在其 2026 會計年度第四季完成。選型時把「這家公司的路線圖屬於誰」列進去是合理的。

Toolhouse 與 Zapier MCP 也在這層，本篇沒有查證它們的現況，不評論。

## 整體來說

Composio 沒有轉型也沒有被併購，它現在是這一層最完整、文件也最誠實的一家——會把 session fixation 這種攻擊面寫在自己的文件裡、會把託管認證的四項代價逐條列出來，這在這個賽道並不常見。

但它賣的東西要看清楚：**開源的是 SDK，護城河是那一億份 token 的保管與更新**。你買的不是「不用懂 OAuth」，你買的是「不用把 OAuth 的維運乘以整合數再乘以使用者數」。這兩句話的差別，會在你第一次要回答「請把某位使用者的所有授權撤乾淨」的時候顯現出來。

## 參考資料

- [Composio 官網](https://composio.dev/)
- [Composio 價目表](https://composio.dev/pricing)（2026-08-21 讀取；新價目自 2026-08-15 生效）
- [ComposioHQ/composio（GitHub，MIT）](https://github.com/ComposioHQ/composio)
- [Authentication — Composio Docs](https://docs.composio.dev/docs/authentication)
- [What is a session? — Composio Docs](https://docs.composio.dev/docs/how-composio-works)
- [Composio Managed Auth toolkit 清單](https://docs.composio.dev/toolkits/managed-auth)
- [When to use your own developer credentials — Composio Docs](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app)
- [Connected Accounts API 參考（含 callback identity verification）](https://docs.composio.dev/reference/api-reference/connected-accounts)
- [Controlling scopes — Composio Docs](https://docs.composio.dev/docs/authentication/controlling-scopes)
- [White-labeling authentication — Composio Docs](https://docs.composio.dev/docs/authentication/white-labeling-authentication)
- [Importing existing connections — Composio Docs](https://docs.composio.dev/docs/authentication/importing-existing-connections)
- [Composio Connect（MCP 端點）— Composio Docs](https://docs.composio.dev/docs/composio-connect)
- [About Arcade — Arcade Docs](https://docs.arcade.dev/en/get-started/about-arcade)
- [Introduction to Pipedream](https://pipedream.com/docs)
- [Workday Signs Definitive Agreement to Acquire Pipedream（2025-11-19）](https://newsroom.workday.com/2025-11-19-Workday-Signs-Definitive-Agreement-to-Acquire-Pipedream)
- 站內相關：[WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools)、[Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents)、[MCP 協定](/posts/ai/2026-03-22-mcp-model-context-protocol)、[協定層](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)、[工具選擇的崩塌曲線](/posts/ai/2026-06-04-tool-selection-at-scale)、[三百個人接 MCP](/posts/ai/2026-08-16-cs146s-ai-native-team)
