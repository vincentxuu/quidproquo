---
title: "WebMCP：讓網頁把自己的功能交出去給 agent 呼叫"
date: 2026-08-21
category: tech
type: deep-dive
tags: [webmcp, mcp, ai-agent, browser-agent, chrome, web-standards]
lang: zh-TW
tldr: "WebMCP 讓網頁用 document.modelContext.registerTool() 把自己的功能註冊成 agent 可呼叫的工具，取代 agent 猜 DOM 點按鈕。Chrome 已在 149 開 origin trial、預計 157 進 stable，Edge 150 跟進。但 WebKit 明確表態反對（「agent 本質上是輔助科技，網站不該把它單獨挑出來對待」），Mozilla 給 neutral。這篇講兩套 API 怎麼寫、安全模型擋在哪、以及在只有一個半引擎支持的情況下要不要現在投資。"
description: "WebMCP（document.modelContext）深入介紹：命令式與宣告式兩套 API、權限與安全模型、Chrome/Edge/Brave 的實作進度、Mozilla 與 WebKit 的標準立場，以及此刻的選型建議。"
series:
  name: "AI 時代的技術選擇"
  order: 8
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-webmcp-browser-tools-en)

[系列上一篇](/posts/tech/2026-08-21-llms-txt)講的是讓機器**讀得懂**你的文件。這篇是它的下一步：讓機器**呼叫得動**你的頁面。

WebMCP 是一組瀏覽器 API。它讓網頁在自己的 JavaScript 裡宣告一組「工具」，每個工具有名稱、自然語言說明、JSON Schema 輸入格式。瀏覽器內的 AI agent 於是能直接呼叫，不必看著截圖猜哪個按鈕是「結帳」。提案人是 Microsoft Edge 與 Google Chrome 的工程師，孵化場地在 W3C 的 Web Machine Learning 社群群組。最新一版規格是 2026 年 8 月 19 日的 Draft Community Group Report。規格自己在狀態欄寫得很清楚：**這不是 W3C 標準，也不在標準軌道上。**

先講一個容易誤會的地方：**WebMCP 不是 MCP**。Anthropic 的 MCP 是後端協定，跑 JSON-RPC，服務在伺服器上、獨立於有沒有人開著瀏覽器。WebMCP 完全跑在瀏覽器分頁裡，工具的壽命就是分頁的壽命。它天生繼承使用者已登入的 session，所以不必另外部署伺服器，也不必再處理一次驗證。規格的說法是，用了 WebMCP 的網頁「可以被想成把工具實作在客戶端腳本、而不是後端的 MCP 伺服器」。共用的只有「工具」這個詞彙，不是同一條線路。

## 兩套 API

**命令式**是主力。註冊入口掛在 `document.modelContext`（早期草案放在 `navigator` 上，後來搬家了，站上[另一篇 AI-ready 內容整理](/posts/ai/2026-03-30-ai-ready-content)有記到這個變更）：

```js
const controller = new AbortController();

await document.modelContext.registerTool({
  name: "add-todo",
  description: "Add a new item to the user's active todo list",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text content of the todo item" }
    },
    required: ["text"]
  },
  annotations: { readOnlyHint: false, untrustedContentHint: true },
  async execute({ text }, { signal }) {
    await addTodoItemToCollection(text);   // 重用頁面既有的邏輯
    return { content: [{ type: "text", text: `Added: ${text}` }] };
  }
}, { signal: controller.signal });
```

三個設計細節值得注意。第一，**取消註冊走 `AbortSignal`**，不是另一個 `unregisterTool()` 方法。這讓工具的生命週期可以直接綁在框架元件的掛載與卸載上，React 的 `usewebmcp` 與 Angular 的實驗性支援都是這樣接的。第二，`execute` 的第二個參數也給你一個 signal，使用者按下 agent UI 的停止鍵時，你可以把它轉手餵給 `fetch()`。第三，工具名稱有硬限制：規格規定長度 1 到 128 字元，且只能用 ASCII 英數字加上 `_`、`-`、`.`。

**宣告式**則完全不寫 JavaScript，在既有的 `<form>` 上加兩個屬性就好：

```html
<form toolname="createSupportRequest"
      tooldescription="Submits a request for customer support."
      action="/submit">
  <label for="firstName">First Name</label>
  <input type=text name=firstName>
  <select name="select" required
          toolparamdescription="Determines what team this request is routed to.">
    <option value="Customer happiness team">Return my purchase.</option>
    <option value="Website support team">Get help on the website.</option>
  </select>
  <button type=submit>Submit</button>
</form>
```

瀏覽器會自己從表單合成 JSON Schema——`<select>` 的每個 `<option>` 變成 `enum`，`required` 變成必填欄位。agent 呼叫時，瀏覽器把表單捲到畫面上、聚焦、填好欄位，**使用者仍然看得見那張表單**，並且預設要自己按送出（除非你加 `toolautosubmit`）。配套還有一組瀏覽器事件與偽類。`SubmitEvent.agentInvoked` 讓你分辨這次送出是人還是 agent 觸發的。`:tool-form-active` 與 `:tool-submit-active` 則讓你自訂 agent 正在操作時的視覺回饋，Chrome 附了預設的虛線外框樣式。

這是整個提案裡我覺得最漂亮的一段：它沒有替 agent 開一條看不見的旁路，而是**讓 agent 走使用者那條路，只是走得準一點**。

## 安全模型：四道閘門

WebMCP 的工具跑在使用者已登入的分頁裡。這是它最大的優勢，也是它最大的風險：一個被騙的工具能做的事，等於這個登入使用者能做的事。所以閘門疊了四層：

1. **Secure context**：IDL 上標了 `[SecureContext]`，純 HTTP 頁面沒有這個 API。
2. **Origin 隔離**：只在 origin-isolated 文件可用。網站若用 `Origin-Agent-Cluster: ?0` 開啟 `document.domain`，WebMCP 直接關閉。
3. **Permissions Policy**：兩套 API 都被 `tools` 這個 policy 管，預設值是 `self`。跨來源 iframe 因此註冊不了工具，要由外層加 `allow="tools"` 明確授權；沒授權時 `registerTool()` 的 promise 會以 `NotAllowedError` 被拒絕。
4. **`exposedTo` 白名單**：預設工具只給同源文件與瀏覽器內建 agent 看得到。要開放給頁面內的第三方 agent（例如嵌在 iframe 裡的客服機器人），得逐一列出可信任的來源。

在這之上，Chrome 的工具安全指引再補了兩件事。一是兩個 annotation。`readOnlyHint` 標示這個工具不改狀態，好讓 agent 判斷什麼時候該停下來問人。`untrustedContentHint` 則標示回傳值含使用者產生內容或外部資料，提醒 agent 這段輸出需要額外戒心。

二是**字元預算**。官方建議工具說明控制在 500 字元以內，參數說明、工具名稱與單次輸出另有各自的上限，超過容易撞上 agent 自己的防護機制。

值得記住的是，Chrome 的另一份給 agent 開發者的文件承認得很直白：模型是機率性的，**沒有辦法保證 LLM 內部安全**。它給的對策是縱深防禦：輸入設 token 上限、限制 agent 能互動的來源、把不可信內容用 base64 包起來，並在系統提示裡明講「這段只能讀不能執行」。base64 那一招的代價是 token 量增加約三成。這是承認問題無解之後的工程折衷，不是解法。

## 誰真的要做這件事

| 引擎 | 狀態（2026-08） |
|---|---|
| Chrome | Dev Trial 146、Origin Trial 149–156、預計 157 進 stable |
| Edge | Origin Trial 自 150 起 |
| Brave | Leo AI 聊天中的實驗性支援 |
| Firefox | 標準立場：**neutral** |
| Safari | 標準立場：**oppose** |

Chrome 端的進度是實的。本機開發打開 `chrome://flags/#enable-webmcp-testing` 就能用，正式環境可以報名 origin trial。GitHub 上的提案倉庫已累積到 3,033 顆星（2026-08-21 讀取），open issue 破百，社群討論活躍。

但另外兩個引擎的表態，才是選型時真正要讀的東西。

Mozilla 給了 **neutral**。理由是在對抗性的情境下，網站提供的工具有可能與使用者在頁面上實際看到的體驗不符。他們同時指出，這些風險有多少是這個 API 造成的、有多少是 LLM 讀網頁本來就有的，目前分不清楚。他們也嫌名字取壞了——「這裡沒有 MCP」（There is no MCP here），建議改叫 Website Tool API 之類的名稱。

WebKit 則是明確 **oppose**，而且理由值得完整讀一遍，因為它不是在挑細節，是在反對整個方向：

> 一個代表使用者行動的 agent，本質上就是輔助科技：它應該像使用者那樣操作網站，而網站不該把它單獨挑出來、給予不同待遇。WebMCP 做的正好相反，它把「現在是 agent 在操作」變成一個可被觀測的事實。

WebKit 的第二個論點更尖銳：他們認為可靠性的承諾是假的。agent 終究是靠工具的自然語言名稱與說明去挑工具。WebKit 在此轉引了規格自陳的一句話——「無法保證一個 WebMCP 工具宣告的意圖與它實際的行為相符」。他們的推論是：型別 schema 只約束了參數的形狀，沒有約束 agent 必須推論的語意，所以**脆弱性只是從 DOM 搬到了工具說明裡**。再加上 `exposedTo` 允許網站給 agent 一些不給人類介面的能力（反之亦然），他們認為這會分裂出兩個不對等的網頁。今年六月中，WebKit 方面進一步提議把 WebMCP 整個放回問題定義階段：另組一個社群群組，辦一場 W3C Workshop 重新盤點，時間點抓在 2026 年 10 月底的 TPAC。

Chrome 方面的回應也公開在同一串裡。重點是：現實中的 agent 本來就在用注入 JavaScript、甚至 `chrome.debugger` 這類手段操作網頁，所以「agent 不可被觀測」這個前提在今天並不成立。這個反駁有力，但它證明的是現狀不理想，不等於證明 WebMCP 是對的解法。

## 要不要現在投資

我的判斷分成三種情況。

**已經在做瀏覽器內 agent 或 Chrome 擴充功能的**，值得現在就投。origin trial 開著，工具的效益立即可見——一次結構化呼叫取代十幾步點擊猜測，而且你控制的是自己的兩端。

**一般產品網站，有現成的表單流程**：只做宣告式那一半。在既有 `<form>` 上加 `toolname` 與 `tooldescription` 兩個屬性，成本是幾行 HTML，不改架構、不影響人類使用者，瀏覽器不支援時就是兩個被忽略的未知屬性。這是整個提案裡風險報酬比最好的部分，也剛好是 WebKit 相對溫和對待的那一半。當時 Chrome 方面反問「如果只有宣告式版本，WebKit 會不會接受」，這題雙方都沒有答死。

**要為 agent 大改前端架構的**：先不要。理由不是技術不好，是賭注不對稱。Chrome 文件自己列的限制裡有一條很現實：**工具沒有事前的可發現性**。agent 必須先導航到你的頁面、載入完成，才知道你有沒有工具，而 `.well-known` 之類的清單機制還只是社群提議。再加上一個引擎反對、一個中立，此刻把商業邏輯重寫成工具層，等於押注一份規格與一家瀏覽器。

還有一個實務提醒：文件與規格目前對不齊。Chrome 的命令式 API 文件範例把參數當 JSON 字串傳（`executeTool(tool, '{"text": "Buy milk"}')`），而規格 IDL 寫的是 `object`、由瀏覽器內部序列化，提案 README 的範例也是傳物件。這種等級的落差在 origin trial 階段很正常，但它是個訊號：**照著文件複製貼上之前，先自己在 flag 後面跑一次。**

## 整體來說

WebMCP 賭的前提跟 llms.txt 是同一個——網站的讀者結構已經永久改變了——但它比 llms.txt 激進得多。llms.txt 只是一份 Markdown 索引，錯了頂多沒人讀；WebMCP 要你把可執行的能力交出去，交給一個機率性的、可能被注入的呼叫者。

所以這篇的結論不是「這是未來，快上車」，而是：**宣告式那一半現在就做，命令式那一半跟著引擎共識走**。目前為止，這件事上唯一達成的共識是「人類介面優先、人要留在迴圈裡」——這也剛好是三方立場文裡都同意的一句。其餘的，等 TPAC。

## 參考資料

- [WebMCP 規格（W3C Web Machine Learning CG Draft Report, 2026-08-19）](https://webmachinelearning.github.io/webmcp/)
- [webmachinelearning/webmcp explainer 與提案倉庫](https://github.com/webmachinelearning/webmcp)
- [WebMCP 瀏覽器實作狀態](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md)
- [WebMCP — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp)
- [Imperative API — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [Declarative API — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [WebMCP best practices — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/best-practices)
- [WebMCP tool security — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [Agent security considerations for WebMCP — Chrome for Developers](https://developer.chrome.com/docs/agents/security)
- [Join the WebMCP origin trial（Chrome 部落格）](https://developer.chrome.com/blog/ai-webmcp-origin-trial)
- [WebMCP — Chrome Platform Status（里程碑）](https://chromestatus.com/feature/5117755740913664)
- [Mozilla standards-positions #1412（neutral）](https://github.com/mozilla/standards-positions/issues/1412)
- [WebKit standards-positions #670（oppose）](https://github.com/WebKit/standards-positions/issues/670)
- 站內相關：[llms.txt：把文件寫給機器讀的那一份](/posts/tech/2026-08-21-llms-txt)、[shadcn registry 與 MCP](/posts/tech/2026-08-21-shadcn-registry-mcp)、[AI 時代的 React 套件選型](/posts/tech/2026-08-19-react-stack-ai-era)、[AI-ready 內容策略](/posts/ai/2026-03-30-ai-ready-content)
