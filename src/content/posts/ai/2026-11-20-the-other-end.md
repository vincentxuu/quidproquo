---
title: "另一端：常駐 agent 為什麼常做到最後一步就卡住，網站和商家怎麼接它"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, agentic-commerce, payments]
lang: zh-TW
tldr: "agent 卡在最後一步，原因常常不在 agent，而在另一端。卡住的地方有三層：網站認不認得它（幾十年來網站預設擋 bot，Amazon 以 agent 沒表明身分為由封鎖 Muse）、結帳流程支不支援（付款系統假設是人在按「購買」）、商家願不願意讓它進來（廣告收入、客戶關係）。正在建的解法也分三層：讓 agent 用加密簽章表明身分（Web Bot Auth、Visa Trusted Agent Protocol），用簽好的授權證明你同意了什麼（Google AP2、Mastercard Agent Pay），讓商家直接開放結帳介面（UCP）。台灣在 2026 年 3 月完成第一筆經身分驗證的代理式交易。"
description: "常駐 agent 在另一端卡住的三層原因：網站的 bot 偵測與 Amazon 封鎖 Muse、結帳與付款流程、商家的商業考量；Gemini 打電話先表明是 AI 的做法；Web Bot Auth、Cloudflare 的 agent 分類、Visa Trusted Agent Protocol、Google AP2 與 UCP、Mastercard Agent Pay 各解決哪一層；台灣第一筆代理式交易；以及 agent 卡住時判斷是網站擋、付款不支援還是 agent 本身問題的方法。"
series:
  name: "常駐型 AI agent"
  order: 22
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-the-other-end-en)

| 卡在哪一層 | 常見症狀 | 正在建的解法 |
|---|---|---|
| 網站認不認得它 | 驗證碼、存取被拒、頁面載不出來 | Web Bot Auth、Cloudflare 的 agent 分類 |
| 結帳與付款 | 做到付款頁就把畫面交回給你 | AP2、Mastercard Agent Pay、單次卡 |
| 商家願不願意 | 明確告知「未經授權的 AI agent」 | 談合作、商家開放結帳介面（UCP） |

2026 年 9 月 20 日晚上，用 Meta Muse 在 Amazon 買東西的人，開始看到一個跳出視窗：

> Continued access by an unauthorized AI agent violates Amazon's Conditions of Use, to which our customers have agreed.

[GeekWire 報導](https://www.geekwire.com/2026/Amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/)，Amazon 說它先試過請 Meta 自己把 Amazon 排除，沒有成功，才直接封鎖。Amazon 的理由有三個：Meta 沒告訴它 Muse 會進來，Muse 瀏覽時不表明自己是 agent，而且看起來會擷取並儲存客戶的帳密。

這兩家其實是合作夥伴：Facebook 和 Instagram 上從 2023 年就能買 Amazon 的商品，Meta 4 月也簽了在 Amazon 晶片上跑 AI 工作的數十億美元合約。

這篇講另一端：為什麼常駐 agent 常做到最後一步就卡住，網站和商家怎麼接它。

## 第一層：網站認不認得它

Google 在 [Tasks in Gemini 的發表文](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)裡自己承認了這件事：

> On some sites, Gemini can make it most of the way through and then hand the screen back to you to click the final button.

原因寫在下一句：幾十年來，網站預設擋 bot，因為大多數 bot 是惡意的。個人 agent 跟爬蟲、攻擊程式在網站眼中長得很像：都是自動化的程式在點網頁。

Cloudflare 是全球最大的網站防護服務之一，它的設定反映了網站的立場正在怎麼變。[2026 年 7 月的公告](https://blog.cloudflare.com/content-independence-day-ai-options)把 AI 流量分成三類：搜尋、agent、訓練。從 9 月 15 日起，新加入的網站在有廣告的頁面上，預設擋掉 agent 和訓練類的流量，搜尋類照樣放行。Cloudflare 的理由是：廣告代表網站主想讓人來看，所以在這些頁面上把人的注意力當成目標，擋掉可能取代這份注意力的 bot。

另一方面，Cloudflare 也在讓 agent 有辦法表明身分。[它的文件](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)定義「驗證過的 bot」要做到兩件事：用加密簽章等方式誠實表明自己是誰，而且不濫用這份信任，例如遵守網站的爬取規則。它還把 agent 分成兩種：

- **Direct**：一個營運者自己跑的 bot，例如搜尋引擎的爬蟲。
- **Intermediary**：很多使用者都能操作的 agent 服務。營運者跑程式，但每個動作是不同的使用者發起的。

常駐 agent 屬於第二種。Cloudflare 指出這帶來「信任的傳遞」問題：網站可能信任 OpenAI 或 Google 這個營運者，但不一定信任每一個在背後下指令的人。

這一層卡住時，症狀通常是驗證碼、存取被拒、頁面載不出來。[AIMultiple 的九天實測](https://aimultiple.com/always-on-agents)裡，跑在他們自己伺服器上的 OpenClaw 被好幾個網站擋掉，最後只能從結果裡拿掉。

## 第二層：結帳與付款

就算網站讓它進來，到了付款那一步，又是另一道關卡。

Google 在 2025 年發表 [Agent Payments Protocol（AP2）](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)時，把問題講得很清楚：現在的付款系統假設是人直接在可信的畫面上按「購買」。agent 能自己發起付款，打破了這個假設，帶出三個問題：

- **授權**：怎麼證明使用者真的授權 agent 買這樣東西？
- **真實性**：商家怎麼確定 agent 的請求反映的是使用者的真實意圖？
- **責任**：交易出錯或被詐騙時，誰負責？

AP2 的答案是用加密簽章的「授權書」（mandate）留下證據：

- **你在場時**：你說「幫我找白色跑鞋」，這句話記成一份意圖授權。agent 列出購物車，你按同意，就簽下一份購物車授權，品項和價格鎖定，不能改。
- **你不在時**：你事先簽一份詳細的意圖授權，寫明價格上限、時間和條件，例如「門票開賣就買」。條件成立時，agent 才能依此產生購物車授權。

信用卡組織也各自在做。Mastercard 的 [Agent Pay](https://www.mastercard.com/news/ap/zh-tw/%E6%96%B0%E8%81%9E%E4%B8%AD%E5%BF%83/%E6%96%B0%E8%81%9E%E7%A8%BF/zh-tw/2026/mar/%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1%E6%94%9C%E6%89%8B%E6%98%9F%E5%B1%95%E9%8A%80%E8%A1%8C-%E5%8F%B0%E7%81%A3-%E5%AE%8C%E6%88%90%E7%AC%AC%E4%B8%80%E7%AD%86%E4%BB%A3%E7%90%86%E5%BC%8Fai%E6%94%AF%E4%BB%98%E4%BA%A4%E6%98%93/) 替每個 agent 發一個獨立的代碼，讓 agent 的身分可以被識別和驗證。[萬事達卡台灣區董事總經理陳懿文受訪時說明](https://www.cio.com.tw/118271/)，交易過程中商家、收單機構和 agent 都碰不到真實卡號，只用一次性或特定用途的代碼。如果 agent 執行的內容偏離你原本授權的意圖，系統可以即時攔截。

前面幾篇的產品用的是比較簡單的做法：Muse 和 Instinct 用 Stripe Link 的單次卡，每筆金額要你核准。

這一層卡住時，症狀通常是 agent 一路做到付款頁，然後把畫面交回給你，或停下來等你自己輸入。這不一定是故障，很多時候是產品刻意設計的：Gemini 的發表文寫明，按「購買」之前它會先問你。

**台灣的進度**：[2026 年 3 月 26 日](https://www.cna.com.tw/news/afe/202603260084.aspx)，Mastercard 和星展銀行（台灣）在 Agent Pay 框架下，完成台灣第一筆經身分驗證的代理式 AI 交易。消費者透過對話請 AI 預訂機場接送，選好方案後，AI 用綁定的卡完成付款。這是一筆示範交易，不代表台灣的商家已經普遍支援。

## 第三層：商家願不願意

技術上認得出來、付款也能處理，最後還有一層：商家想不想讓 agent 進來。

Amazon 的例子最清楚。[GeekWire 的後續分析](https://www.geekwire.com/2026/amazons-fight-with-meta-who-owns-the-customer-relationship-when-an-agent-does-the-buying/)指出幾個商業考量：

- **廣告**：Amazon 去年廣告收入超過 680 億美元，靠的是人瀏覽頁面、看到贊助商品。agent 直接跳到結帳，這些頁面就沒人看了。
- **客戶關係**：agent 替人買東西時，客戶關係歸誰？Zuckerberg 說 Muse 會從交易裡抽一小部分，可能由賣家付。
- **自己也有 agent**：Amazon 自己的 Buy for Me 會到外部品牌的網站替人買東西。Amazon 說差別在於 Buy for Me 會表明身分，也讓品牌選擇退出。

法律上也還沒定案。Amazon 告 Perplexity 的 Comet 瀏覽器，先拿到初步禁制令。但美國第九巡迴上訴法院 8 月認為，依聯邦反駭客法，存取 Amazon 電腦的是使用者，不是 AI 公司，所以撤銷了禁制令。法院留了一條路：依合約和使用條款提告。Amazon 封鎖 Muse 時引用的，正是使用條款。

這一層卡住時，症狀通常最明確：網站直接告訴你，未經授權的 AI agent 不能用。

## 打電話：先表明自己是 AI

不只網站，agent 打電話給商家也會碰到同樣的問題：對方有沒有被告知、能不能拒絕。

Google 的做法寫在 [Gemini 的說明頁](https://support.google.com/gemini/answer/18961634?hl=en)：

- 每通電話一開始就表明是 Google 的 AI 助理、代你打、通話有錄音。
- 只打給經過 Google 驗證的美國商家，商家可以隨時選擇退出。
- 電話裡不會給付款資料或敏感的帳號資訊。
- 美國有幾個州因為法規限制，Gemini 不能自動打電話過去。
- 對方問到你計畫裡沒寫的事，它會掛斷，回來告訴你發生什麼事。

這套做法跟 Amazon 要求的方向一致：表明身分、讓對方能選擇。

## 讓 agent 有身分

上面幾層解法有一個共通點：讓另一端知道「這是誰的 agent、代表誰、被授權做什麼」。目前正在發展的做法有幾種：

- **網站層**：Web Bot Auth 讓 agent 在每個請求附上加密簽章。[Visa 的 Trusted Agent Protocol](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html) 跟 Cloudflare 合作，建立在這個基礎上。agent 能藉此告訴商家：我是有購買意圖的可信 agent、這位客人在你這裡有沒有帳號、要用什麼付款。[Cloudflare 的公告](https://www.cloudflare.net/news/news-details/2025/Cloudflare-Collaborates-with-Leading-Payments-Companies-to-Secure-and-Enable-Agentic-Commerce/default.aspx)也說 Mastercard 和 American Express 會採用同一套簽章。
- **帳號層**：[order 13](/posts/ai/2026-11-20-openclaw-enterprise) 講過，OpenAI 讓每個內部 agent 有自己的身分，跟使用者的身分分開。OpenAI 的文章也提到 WAG、XAA 這類正在發展的規格，前者讓 agent 有自己的存取權，後者讓 agent 透過 OAuth 代使用者行事。
- **商家層**：Google 在 2026 年 1 月推出 [Universal Commerce Protocol（UCP）](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/)，跟 Shopify、Etsy、Wayfair、Target、Walmart 一起開發。商家把商品查詢、結帳這些能力直接開放給 agent，不用讓 agent 去點網頁，商家仍是交易的賣方。[order 16](/posts/ai/2026-11-20-super-app-agents) 講過，LINE 購物也在透過 UCP 做跨平台串接。

超級 app 走的是另一條路：[order 16](/posts/ai/2026-11-20-super-app-agents) 講過，Naver 的 agent 自家服務走內部 API，外部網站才用隔離的瀏覽器。服務是自己的，就沒有「認不認得它」的問題。

## agent 卡住時，怎麼判斷是哪一端的問題

下次你的 agent 做到一半停下來，依序看這幾個症狀：

| 症狀 | 最可能的原因 | 你可以怎麼做 |
|---|---|---|
| 驗證碼、「存取被拒」、頁面一直載不出來 | 網站擋 bot | 換一個有官方串接的網站，或自己完成這一步 |
| 網站明確寫「未經授權的 AI agent」 | 商家不讓 agent 進來 | 這家不能用 agent，自己去買 |
| 做到付款頁，畫面交回給你 | 產品設計要你確認，或付款流程不支援 | 檢查明細再自己按；不是故障 |
| 付款失敗、卡被拒 | 發卡行的風控，或單次卡額度不足 | 確認授權金額、聯絡發卡行 |
| 選錯商品、填錯資料、跑到錯的網站 | agent 本身的問題 | 這是 agent 的錯，回報給廠商 |
| 一直重試同一步、沒有回報 | agent 卡在迴圈 | 停掉任務，看它的紀錄 |

前三種是另一端的問題，換一個 agent 多半也一樣；後兩種才是 agent 本身的問題，值得回報。

## 適合誰、不適合誰

**現在比較容易順利的情況：**
- 在有官方串接的地方買東西：Google 的 AI 模式透過 UCP 結帳、超級 app 的自家服務。
- 只需要查資料、比價，最後一步自己來。
- 打電話給有接受 AI 來電的美國商家。

**現在比較容易卡住的情況：**
- 在大型電商網站讓 agent 自己點網頁結帳，尤其是明確拒絕外部 agent 的網站。
- 需要登入、有驗證碼的網站。
- 台灣的商家：代理式付款還在示範階段。

在台灣，Mastercard Agent Pay 完成了第一筆示範交易；LINE 購物在透過 UCP 串接，但它的購物助手規劃 2027 年才推出。

商家是交易的賣方、付款協定留下了誰授權什麼的紀錄。這些另一端的規則，直接決定了出事時誰負責。[下一篇](/posts/ai/2026-11-20-who-is-liable)講責任。

## 參考資料

- [Amazon blocks Meta's Muse AI assistant in new standoff over agentic shopping](https://www.geekwire.com/2026/Amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/)（GeekWire，2026-09-20）
- [Amazon's fight with Meta: Who owns the customer relationship when an agent does the buying?](https://www.geekwire.com/2026/amazons-fight-with-meta-who-owns-the-customer-relationship-when-an-agent-does-the-buying/)（GeekWire，2026-09-22）
- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)（Google，2026-11-17）
- [Ask Gemini to make phone calls to businesses](https://support.google.com/gemini/answer/18961634?hl=en)（Gemini Apps Help）
- [Your site, your rules: new AI traffic options for all customers](https://blog.cloudflare.com/content-independence-day-ai-options)（Cloudflare，2026-07-01）
- [Verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)（Cloudflare 文件）
- [Announcing Agent Payments Protocol (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)（Google Cloud，2025-09-16）
- [Under the Hood: Universal Commerce Protocol (UCP)](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/)（Google Developers，2026-01-11）
- [Visa Unveils Trusted Agent Protocol for AI Commerce](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html)（Visa，2025-10-14）
- [Cloudflare Collaborates with Leading Payments Companies to Secure and Enable Agentic Commerce](https://www.cloudflare.net/news/news-details/2025/Cloudflare-Collaborates-with-Leading-Payments-Companies-to-Secure-and-Enable-Agentic-Commerce/default.aspx)（Cloudflare，2025-10-14）
- [萬事達卡攜手星展銀行（台灣）完成第一筆代理式AI支付交易](https://www.mastercard.com/news/ap/zh-tw/%E6%96%B0%E8%81%9E%E4%B8%AD%E5%BF%83/%E6%96%B0%E8%81%9E%E7%A8%BF/zh-tw/2026/mar/%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1%E6%94%9C%E6%89%8B%E6%98%9F%E5%B1%95%E9%8A%80%E8%A1%8C-%E5%8F%B0%E7%81%A3-%E5%AE%8C%E6%88%90%E7%AC%AC%E4%B8%80%E7%AD%86%E4%BB%A3%E7%90%86%E5%BC%8Fai%E6%94%AF%E4%BB%98%E4%BA%A4%E6%98%93/)（Mastercard，2026-03-26）
- [萬事達卡：台灣首筆AI代理交易完成](https://www.cna.com.tw/news/afe/202603260084.aspx)（中央社，2026-03-26）
- [萬事達卡台灣區董事總經理陳懿文：Agentic Commerce 時代 重塑金融信任架構](https://www.cio.com.tw/118271/)（CIO Taiwan，2026-08-07）
- [Always-On Agents: Claude Duet vs Dots vs Grok Bot](https://aimultiple.com/always-on-agents)（AIMultiple，2026-11-16）
