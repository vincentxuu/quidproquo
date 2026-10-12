# system-design-interview：系統設計面試口說的來源核對

核對日期：2026-10-12。文章：`src/content/posts/learning/2026-10-12-system-design-interview-english.md`（與 `-en.md`）。

## 讀取工具

Groundlane 這個 session 沒有掛載（toolDegradation）。用 Exa `web_search_exa`／`web_fetch_exa`，以及直接請求（curl 加瀏覽器 UA）存到暫存區後在本機擷取。

## 來源與讀取範圍

| 來源 | 類別 | 地區 | 讀取方式 | 讀到多少 |
| --- | --- | --- | --- | --- |
| [Life at Google: Prepare for Your Google Interview: Systems Design](https://www.youtube.com/watch?v=Gg318hR5JY0) | 雇主的官方說明 | 美 | Exa 搜尋回傳的完整逐字稿（第三方鏡像頁），再用 Exa 抓 YouTube 字幕對照前四分之三 | 整支影片的字幕；後四分之一只有鏡像頁的版本 |
| [System Design Primer](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question) | 社群教材（GitHub） | — | curl 取 raw README | 「How to approach a system design interview question」一節整段；README 其餘沒讀 |
| [interviewing.io: System Design Interview Guide](https://interviewing.io/guides/system-design-interview) | 模擬面試平台的指南 | 美 | curl，本機擷取 | 整頁文字在本機（約 32,000 字元）；讀了搜尋回傳的段落，並擷取全文中帶引號的示範句。**沒有逐段讀完** |
| [interviewing.io 模擬面試：Photo Sharing Service](https://interviewing.io/mocks/faang-system-design-photo-sharing-service) | 模擬面試逐字稿 | 美 | curl，本機擷取 | 整頁在本機（約 52,000 字元）。讀了開場的問題、依功能搜尋到的句子與前後段落、面試官的回饋。**沒有從頭讀到尾** |
| [interviewing.io 模擬面試：Inventory and Orders](https://interviewing.io/mocks/faang-system-design-inventory-orders) | 同上 | 美 | 同上 | 約 61,000 字元，同上 |
| [interviewing.io 模擬面試：Designing WhatsApp](https://interviewing.io/mocks/faang-system-design-designing-whatsapp) | 同上 | 美 | 同上 | 約 46,000 字元，同上 |
| [Cambridge: trade-off](https://dictionary.cambridge.org/us/dictionary/english/trade-off)、[bottleneck](https://dictionary.cambridge.org/us/dictionary/english/bottleneck) | 字典 | 英 | Exa | 兩個條目的定義與例句 |

Meta Careers 的設計面試段落這次用 curl 取回時得到 HTTP 400，只有稍早 Exa 讀到的開頭，沒有用。

## 卡片對照

| 卡片 ID | 主答案 | 來源原句 | 表達 | 情境 | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| interview-design-requirements | The first thing I want to lay out is the functional requirements. | Inventory 逐字稿：*Okay, so I— the, the first thing I want to lay out is the functional requirements.* | direct | direct | 拿掉開頭的停頓 |
| interview-design-users | How many users are there? | Primer：*How many users are there?* | direct | direct | — |
| interview-design-rps | How many requests per second do we expect? | Primer 原句 | direct | direct | — |
| interview-design-read-write | What is the expected read to write ratio? | Primer 原句 | direct | direct | 只有一份來源 |
| interview-design-scope | Do you want to handle the delete case in the scope of this design? | Photo 逐字稿：*And do you want to go through the delete case in the scope of this design or should we just, do you want to just handle the creation and the visibility case?* | adapted | direct | go through 換成 handle（取自同一句後半） |
| interview-design-assumption | I'm going to make the assumption that users are already logged in. | Photo 逐字稿：*I'm going to go ahead and make the assumption that all our clients are going to come from a variety of different … types.* | adapted | direct | 假設的內容自填 |
| interview-design-pin | I'm going to put a pin in that. We will come back to that. | Photo 逐字稿：*I'm going to put a pin in that. We will come back to that if we dive into it a little bit more.* | direct | direct | 第二句截短 |
| interview-design-cost | We can add a queue, but it will come at the cost of latency. | WhatsApp 逐字稿：*we can definitely suggest, but it will come at the cost of consistency, and latency.*；Google：*at the cost of increased latency* | adapted | direct | 前半自填 |
| interview-design-decide | I'm going to go with an event queue because I'd rather the user always get the right information eventually. | Inventory 逐字稿（面試官）：*okay, so I'm going to go with an event queue because I'd rather the user get, you know, the right— always get the right information eventually.* | adapted | direct | 是面試官示範的句子，不是應徵者說的 |
| interview-design-bottleneck | I would say the synchronization service is the bottleneck. | WhatsApp 逐字稿：*I would say synchronisation service, I think is the bottleneck.* | adapted | direct | 補冠詞、拿掉 I think、拼法改美式 |
| interview-design-rethink | It may actually make more sense, now that I'm thinking about this, to use a NoSQL database. | Photo 逐字稿：*So it may actually make more sense now that I'm thinking about this, to throw a higher availability, higher write throughput database…* | adapted | direct | 後半換成 use a NoSQL database |
| interview-design-check-in | Do you think that makes sense? | Inventory 逐字稿：*Do you think that makes sense?* | direct | direct | — |

對話 `interview-design` 是自寫的練習示例。

## 仍待核對（沒有做成卡片）

- 估算容量時怎麼把數字講出口。
- put a pin in 這個說法：逐字稿有用例、面試官也稱讚，但沒有查字典條目。
- 英美差異：來源都是美國的公司與平台。
