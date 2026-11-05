# 美劇台灣合法觀看管道：第 3 批（30 部）

- 查核日期：2026-11-05
- 輸入檔：`tw-batch-3.tsv`
- 方法：JustWatch TW 的劇集頁（擷取「你可以在 X 上观看」那句和 offer 連結）→ 再開串流平台自己的台灣劇集頁。兩邊不一致時以平台頁為準。

## 證據狀態怎麼判

- **confirmed on service page**：平台的台灣頁面（`netflix.com/tw/…`、`disneyplus.com/zh-tw/…`、`tv.apple.com/tw/…`、`hbomax.com/tw/zh/…`）實際有打開，劇名正常顯示。
  - HBO Max TW 頁面會出現英文的「This title currently isn't available to watch in your country」。原因是抓取工具不在台灣，是一般的地區提示，不代表這部劇在台灣沒有。這類頁面能存在，靠的是台灣站的目錄；而 Westworld 在 HBO Max TW 找不到頁面。
  - Disney+ 和 Apple TV 的 zh-tw 頁面也是台灣站目錄頁。但抓取時的 IP 地區沒辦法另外驗證。
- **JustWatch only**：JustWatch TW 有列出台灣的上架資訊。平台頁也打開了，但是從非台灣地區顯示的（Netflix 轉到 `/title/…` 或出現 USD/EUR 價格；Prime Video 是 primevideo.com 的全球頁）。所以頁面本身不能證明台灣有上架。
- **search snippet only**：只有台灣媒體或論壇的搜尋摘要能佐證。
- **not found**：JustWatch TW 明確寫「台灣 无法在线观看」，平台頁也沒查到台灣的版本。

JustWatch TW 上的中文片名常是簡體或港譯（例如 Andor 顯示「野林」、The Boys 顯示「英雄克星」），所以下表的「台灣官方譯名」優先用平台台灣頁的劇名。

## 總表

| English title | 台灣官方譯名 | services (offer type) | title-page URL(s) | evidence status | notes |
|---|---|---|---|---|---|
| Game of Thrones | 權力遊戲 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/4f6b4985-2dc9-4ab6-ac79-d60f0860b0ac ；JW: https://www.justwatch.com/tw/節目/bing-yu-huo-zhi-ge-quan-li-you-xi | confirmed on service page | 頁面標題「觀看 權力遊戲｜HBO Max」。JW TW：HBO Max，沒有免費管道。`/tw/節目/game-of-thrones` 這個 slug 會導到別的節目，不要用。 |
| Andor | 安道爾 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-faba988a-a9f5-45f2-a074-0775a7d6f67a ；JW: https://www.justwatch.com/tw/節目/andor | confirmed on service page | 頁面標題「觀看安道爾｜Disney+」。zh_hint「安道」少一個字，JW 顯示的「野林」不是台灣官方譯名。 |
| Severance | 人生切割術 | Apple TV（訂閱，原 Apple TV+） | https://tv.apple.com/tw/show/人生切割術/umc.cmc.1srk2goyh2q2zdxcx605w8vtx ；JW: https://www.justwatch.com/tw/節目/severance | confirmed on service page | 台灣頁標題「觀看《人生切割術》- Apple TV」。JW 顯示的「生活割離術」不是官方譯名。 |
| The Studio | 片廠風雲 | Apple TV（訂閱） | https://tv.apple.com/tw/show/片廠風雲/umc.cmc.7518algxc4lsoobtsx30dqb52 ；JW: https://www.justwatch.com/tw/節目/the-studio | confirmed on service page | 台灣頁標題「觀看《片廠風雲》- Apple TV」。 |
| Common Side Effects | 常見副作用 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/eaa21376-a54d-4245-95d6-a86dce6313c8 ；JW: https://www.justwatch.com/tw/節目/chang-jian-fu-zuo-yong | confirmed on service page | zh_hint 寫「無台譯」，但 HBO Max TW 有正式譯名「常見副作用」。 |
| The Boys | 黑袍糾察隊 | Prime Video（訂閱，含在 Prime） | https://www.primevideo.com/detail/0S1FYJ3LY9KTL9C7WFFAGA9F6F?language=zh_TW ；JW: https://www.justwatch.com/tw/節目/the-boys | JustWatch only | Prime Video 頁加 zh_TW 參數後顯示「黑袍糾察隊」，但 primevideo.com 是全球頁，不能證明地區。JW TW 列 Amazon Prime Video。這是 Prime Original，全球都上架。JW 顯示的「英雄克星」不是台灣譯名。 |
| Only Murders in the Building | 破案三人行 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-ef31c7e1-cd0f-4e07-848d-1cbfedb50ddf ；JW: https://www.justwatch.com/tw/節目/only-murders-in-the-building | confirmed on service page | 美國是 Hulu 播出，台灣在 Disney+。 |
| The White Lotus | 白蓮花大飯店 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/14f9834d-bc23-41a8-ab61-5c8abdbea505 ；JW: https://www.justwatch.com/tw/節目/the-white-lotus | confirmed on service page | 頁面標題「觀看 白蓮花大飯店｜HBO Max」。 |
| Nobody Wants This | 天作不合的我們 | Netflix（訂閱） | https://www.netflix.com/tw/title/81591296 ；JW: https://www.justwatch.com/tw/節目/nobody-wants-this | JustWatch only | Netflix 頁有顯示「天作不合的我們」、3 季，但抓取時被轉到 en-US 的 `/title/81591296`。這是 Netflix Original，全球都上架。 |
| Peacemaker | 和平使者 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/a939d96b-7ffb-4481-96f6-472838d104ca ；JW: https://www.justwatch.com/tw/節目/peacemaker | confirmed on service page | JW TW 另外列了 LINE TV，連結是 https://www.linetv.tw/drama/17644 。打開後是《戀上換裝娃娃 Season 2》，JW 資料錯誤，**LINE TV 不列為管道**。JW 那句「HBO Max 免费带广告观看」也很可疑，判斷是 LINE TV 的免費資訊錯接到 HBO Max，HBO Max 一律當訂閱制。 |
| Breaking Bad | 絕命毒師 | Netflix（訂閱） | https://www.netflix.com/tw/title/70143836 ；JW: https://www.justwatch.com/tw/節目/jue-ming-du-shi | confirmed on service page | 用台灣地區代理（Asia/Taipei）打開，頁面是「觀賞《絕命毒師》｜Netflix」，og:url 保留 `/tw/`，共 5 季。 |
| The Night Agent | 暗夜情報員 | Netflix（訂閱） | https://www.netflix.com/tw/title/81450827 ；JW: https://www.justwatch.com/tw/節目/the-night-agent | JustWatch only | Netflix 頁有顯示「暗夜情報員」、3 季，但是是非台灣地區的轉址。這是 Netflix Original。 |
| All Her Fault | 都是她的錯 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/00f592d4-b8fc-41db-9ac2-6c55fda37cc6 | confirmed on service page | 美國是 Peacock 原創，台灣在 HBO Max。JW TW 頁的 slug 沒找到（試過 all-her-fault、dou-shi-ta-de-cuo）。 |
| The Simpsons | 辛普森家庭 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-cac75c8f-a9e2-4d95-ac73-1cf1cc7b9568 | confirmed on service page | 頁面標題「觀看辛普森家庭｜Disney+」。JW TW 頁的 slug 沒找到。 |
| Ripley | 雷普利 | Netflix（訂閱） | https://www.netflix.com/tw/title/81678765 ；JW: https://www.justwatch.com/tw/節目/lei-pu-li | JustWatch only | Netflix 頁打開時是美國版（RIPLEY）。譯名「雷普利」來自 JW TW，台灣影評粉專也這樣寫，但沒在 Netflix 台灣頁核對過。 |
| The Diplomat | 頭號外交官 | Netflix（訂閱） | https://www.netflix.com/tw/title/81288983 ；JW: https://www.justwatch.com/tw/節目/the-diplomat-0 | JustWatch only | 要用 `the-diplomat-0` 這個 slug，不加 -0 的是另一部劇。Netflix 頁打開時是土耳其或義大利版，非台灣。譯名來自 JW TW，沒在 Netflix 台灣頁核對過。 |
| Ozark | 黑錢勝地 | Netflix（訂閱） | https://www.netflix.com/tw/title/80117552 ；JW: https://www.justwatch.com/tw/節目/ozark | confirmed on service page | 用台灣地區代理打開，頁面是「觀賞《黑錢勝地》｜Netflix 正式網頁」，共 4 季。 |
| Atlanta | 亞特蘭大 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-3529d0f1-acaf-476d-8be3-66cd6bf12530 ；JW: https://www.justwatch.com/tw/節目/atlanta | confirmed on service page | FX 的劇，台灣在 Disney+。 |
| Evil | （沒有台灣官方譯名；JW 顯示「邪恶」） | — | JW: https://www.justwatch.com/tw/節目/evil | not found | JW TW 沒有台灣的上架資訊，只列出 Paramount+ Amazon Channel / Apple TV channel 的「美國」價格（US$8.99/月），還附 ExpressVPN 廣告。這些不是台灣管道。搜尋 friDay、Hami、myVideo、CATCHPLAY 也都沒結果。 |
| Westworld | 西方極樂園（JW TW） | — | JW: https://www.justwatch.com/tw/節目/westworld | not found | JW TW 明寫「台灣 无法在线观看」「台灣找不到任何流媒体选项」。列出的 Amazon Video / Apple TV Store 是美國價（US$95.96）。tv.apple.com/tw 的頁面只回空殼。HBO Max TW 搜不到這部劇的頁面。另外有一個 CATCHPLAY+「HBO GO 正版」的舊短網址，HBO GO 已經改成 HBO Max，判斷是過時連結，沒打開驗證。 |
| Band of Brothers | 諾曼第大空降 | HBO Max（訂閱）；Prime Video（訂閱） | https://www.hbomax.com/tw/zh/show/6a0a0227-f567-46ba-9a2d-04374c5f6193 ；https://www.primevideo.com/detail/0GEOKFLADKSMOB54NHYN67CD5A?language=zh_TW ；JW: https://www.justwatch.com/tw/節目/nuo-man-di-da-kong-jiang | confirmed on service page | HBO Max TW 頁有確認。Prime Video 頁顯示「諾曼第大空降」，但是全球頁，地區沒辦法驗證，這一家算 JustWatch only。JW TW 寫「Amazon Prime Video, HBO Max」。 |
| Emily in Paris | 艾蜜莉在巴黎 | Netflix（訂閱） | https://www.netflix.com/tw/title/81037371 ；JW: https://www.justwatch.com/tw/節目/emily-in-paris | JustWatch only | 用台灣地區代理抓的時候失敗（ERR_TUNNEL），改用其他工具打開是美國版。這是 Netflix Original。 |
| Mr. & Mrs. Smith | 史密斯任務 | Prime Video（訂閱，含在 Prime） | https://www.primevideo.com/detail/0PIZV55NTVMF63RT9SF6CE1TN3?language=zh_TW ；JW: https://www.justwatch.com/tw/節目/mr-and-mrs-smith | JustWatch only | Prime Video 頁顯示「史密斯任務」，但是全球頁。JW 顯示的「史密斯夫妇」不是台灣譯名。這是 Prime Original。 |
| The Chair Company | 椅子公司 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/eada90f0-b5b6-4fc4-aeeb-a350a9ceb46c ；JW: https://www.justwatch.com/tw/節目/the-chair-company | confirmed on service page | zh_hint 寫「無台譯」，但 HBO Max TW 頁的劇名是「椅子公司」。 |
| X-Men '97 | X 戰警 '97 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-8dc91ed4-cdca-4fab-9723-d3d42f382d34 ；JW: https://www.justwatch.com/tw/節目/x-men-97 | confirmed on service page | 頁面標題「觀看X 戰警 ‘97｜Disney+」。 |
| Mr. Robot | 駭客軍團（CATCHPLAY+ 搜尋摘要；JW 顯示「黑客军团」） | — | JW: https://www.justwatch.com/tw/節目/mr-robot ；試過 https://www.catchplay.com/tw/video/398b98fc-87a6-49c0-8c69-29e5553b035c 、https://www.primevideo.com/-/zh_TW/detail/0PKE9PTAHK0GP4ZAL1B810FYZL?tr=tw | not found | JW TW 明寫「台灣 无法在线观看」。CATCHPLAY+ 頁在搜尋摘要裡有「《駭客軍團》線上看｜共4季」，但實際打開兩次都轉到 catchplay.com 首頁，沒辦法確認。Prime Video zh_TW 頁顯示的是 US$ 單集購買價，地區是美國。**建議人工在台灣網路下開 CATCHPLAY+ 確認。** |
| The Hunting Wives | 獵豔嬌妻 | Netflix（訂閱） | https://www.netflix.com/tw/title/82013700 | search snippet only | Netflix 頁打開時是義大利版（EUR）。台灣的佐證是 Yahoo 奇摩新聞的 11 月 Netflix 片單（「11月26日《獵豔嬌妻》第二季」）、ELLE TW，還有 PTT EAseries 的心得文，寫「Netflix 將中譯名最終定為獵豔嬌妻」。JW TW 頁的 slug 沒找到。注意英國是在 ITVX 播，不是所有地區都在 Netflix。 |
| Cobra Kai | 眼鏡蛇道館 | Netflix（訂閱） | https://www.netflix.com/tw/title/81002370 ；JW: https://www.justwatch.com/tw/節目/cobra-kai | JustWatch only | Netflix 頁有顯示「眼鏡蛇道館」、共 6 季，但是非台灣地區的轉址。 |
| Orange Is the New Black | 勁爆女子監獄 | Netflix（訂閱） | https://www.netflix.com/tw/title/70242311 | JustWatch only | Netflix 頁有顯示「勁爆女子監獄」、共 7 季，但是非台灣地區的轉址。這是 Netflix Original，全球都上架。JW TW 頁的 slug 沒找到，嚴格來說這部只有 Netflix 頁加上 Original 這個推論。 |
| Untamed | 荒境狂途 | Netflix（訂閱） | https://www.netflix.com/tw/title/81575641 ；JW: https://www.justwatch.com/tw/節目/huang-jing-kuang-tu | JustWatch only | 譯名有 Netflix Taiwan 官方 YouTube 預告《荒境狂途》佐證。Netflix 頁打開時是美國版。 |

## 統計

- confirmed on service page：16 部（GoT、Andor、Severance、The Studio、Common Side Effects、OMITB、White Lotus、Peacemaker、Breaking Bad、All Her Fault、Simpsons、Ozark、Atlanta、Band of Brothers、Chair Company、X-Men '97）
- JustWatch only：10 部（The Boys、Nobody Wants This、Night Agent、Ripley、Diplomat、Emily in Paris、Mr. & Mrs. Smith、Cobra Kai、OITNB、Untamed）。這 10 部平台頁都有打開，只是不是台灣地區顯示的。
- search snippet only：1 部（The Hunting Wives）
- not found：3 部（Evil、Westworld、Mr. Robot）

## 找不到合法管道的劇

- **Westworld**：JW TW 明寫台灣無法線上觀看。HBO Max TW 沒有這部劇的頁面，tv.apple.com/tw 只回空殼。HBO 在 2022 年已經把這部劇下架。
- **Mr. Robot**：JW TW 明寫台灣無法線上觀看。CATCHPLAY+ 的搜尋摘要寫「共4季」，但頁面打不開，會轉到首頁。這部最值得人工複查。
- **Evil**：JW TW 只有美國的 Paramount+ channel 價格。台灣在地平台都搜不到。

## 工具紀錄（toolDegradation）

- Groundlane：`web_extract` 可以讀 JW、Disney+、Apple、HBO Max、Prime、LINE TV。Netflix 頁太大會 OUTPUT_LIMIT 失敗，web_fetch 也一樣。JW 的站內搜尋是前端渲染，抓不到結果，所以 JW slug 都是用猜的（英文 slug 或簡中拼音），猜到就驗證原版片名。
- Firecrawl：用台灣地區代理成功打開 Breaking Bad 和 Ozark 的台灣頁。其他頁被降級到 US stealth 代理。之後額度用完：「Your Firecrawl credits ran out. Daily MCP credits refresh in 3h 32m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs」。
- Jina：沒設定 API key，不能用。
- Tavily：搜尋和 extract 可以用，期間一度回 429。extract 不能指定地區。
- Cloudflare browser：打開 Netflix 是美國版。
