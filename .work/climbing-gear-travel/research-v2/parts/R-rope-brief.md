# 研究規格：旅行用繩怎麼挑（出國攀岩裝備系列新篇）

日期：2026-10-23。讀者：要帶一條單繩出國運攀（泰國、陽朔、日韓、卡林諾斯、西班牙）的台灣攀岩者。

## 這篇的判準（研究要能支撐這些）

1. 每公尺重量（g/m）：廉航登機 7 kg、托運 23 kg；70 m／80 m 換算總重。
2. 有沒有 80 m（以及 70 m）版本。
3. 耐磨：外皮比例（sheath proportion %）、外皮處理；石灰岩被磨光又局部銳利，兩週每天上下放。
4. 中點標記（middle mark）、雙色（bicolor／pattern change）。
5. 認證：單繩／半繩／雙子繩（雙重或三重認證細繩可解決多繩距雙股垂降需要第二條）。
6. 防水處理：只記原廠寫法（例如 UIAA Water Repellent、外皮＋繩芯處理、只有外皮），不推論。

## 每個型號要記的欄位（只收 2025–2026 原廠官網仍在賣的現行款）

- 型號全名、原廠產品頁 URL
- 繩徑 mm、g/m（原廠數字）
- 認證類型（single / half / twin）
- UIAA 衝擊墜落次數、衝擊力（單繩）——只記，正文可能不用
- 外皮比例 %（原廠有寫才記，沒寫就寫「原廠未標」）
- 防水處理名稱與範圍（外皮／繩芯／UIAA WR）
- 原廠列出的長度（特別標 70 m、80 m 有沒有）
- 中點標記：有／無／原廠未標；雙色：有／無
- 官方價格：幣別、對應長度、處理版本、查價日期、庫存；原廠沒標價就列一家零售店並註明店名
- 2020 年以後的第三方評測：媒體、日期、URL、一句結論（不要轉述成來源沒有的主張）
- 你自己的一句「適合誰／缺點」，必須從上面的規格推得出來

## 來源規則

- 規格以原廠頁為準；零售頁只當價格來源。
- 打不開的頁要寫「打不開＋用過哪些工具＋失敗原因」，不要猜。
- 不要寫台灣售價或台幣換算。
- 不能宣稱實測、銷量、最便宜。

## Web 抓取優先順序（照這個順序試，降級要記錄）

1. Groundlane MCP：工具是 deferred，先用 ToolSearch 載入 `select:mcp__claude_ai_groundlane__web_search,mcp__claude_ai_groundlane__web_fetch,mcp__claude_ai_groundlane__web_extract`（大小寫兩組 `claude_ai_groundlane` / `claude_ai_Groundlane` 都有，任一可用即可）。
2. Groundlane 直接 HTTP：`WebFetch` POST `https://groundlane.vincent-xu-work.workers.dev/mcp`。
3. Keenable keyless：`GET https://api.keenable.ai/v1/search/public?q=...`，Header `X-Keenable-Title: quidproquo`。
4. You.com keyless：`GET https://api.you.com/mcp?profile=free`。
5. 雲端 MCP：Exa、Tavily、linkup、jina、firecrawl（ToolSearch 載入）。
6. 內建 WebFetch。
Shopify 品牌站可試 `<product-url>.json` 拿價格。

## 輸出

寫到指派給你的檔案（Markdown）。開頭寫 toolDegradation（實際用了哪些工具、哪些失敗）。每個型號一個小節＋最後一張彙整表。最後回報給主 session 只要：檔案路徑、收錄型號數、讀不到的型號清單，不要貼整份內容。
