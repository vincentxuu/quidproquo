# 台灣中文語氣參考來源盤點

Date: 2026-08-29
Scope: 優化 quidproquo 文章與 daily digest 的中文語氣。
Method: Groundlane `web_search` + `web_fetch`。重點看官方首頁、電子報頁、代表文章與來源自述；這是語氣參考盤點，不是媒體公信力評鑑。

## 結論

最值得優先參考的來源：

1. 報導者：長文開頭、議題句、公共性語氣的主參考。強項是把抽象議題落到具體人、制度或現場。
2. BIOS monthly：人物、文化、生活類長文的主參考。強項是場景感、人味、訪談節奏。
3. 故事 StoryStudio：知識轉譯的主參考。強項是把艱澀材料翻成「寫給所有人」的敘事脈絡。
4. iThome 電子報：日報結構與掃描效率的現役參考。強項是低廢話、明確頻率、明確讀者。

歷史參考：

- 科技島讀：目前不是現役經營中的媒體；首頁文章日期為 2021-06-07，正文也標示為「最後一篇」。仍可學它把科技/商業事件放進模型與台灣脈絡的寫法，但不可列為當前日報來源或現役 benchmark。

輔助參考：

- TechOrange：可參考「台灣在國際趨勢中的定位」這種站位，但標題與語氣容易偏行銷/熱點。
- Shopping Design / 500輯：可參考生活風格、設計語彙和選題包裝，但不宜直接套到 AI/tech 日報，容易變成質感形容詞堆疊。
- 端傳媒 newsletter：可參考電子報欄目命名與編輯室口吻，但它是大中華/國際政治語境，不應直接變成 quidproquo 的主腔調。

## 可借的語氣規則

## 2026-08-29 本站抽樣診斷

抽樣檔案：

- `src/content/posts/learning/2026-08-22-stanford-cs103-lecture-23-turing-machines-3.md`
- `src/content/posts/tech/2026-08-23-stock-agent-1-why-taiwan.md`
- `src/content/posts/ai/2026-08-22-serper-search-api-guide.md`
- `src/content/posts/daily/2026-08-28-ai-agent-daily.md`
- `src/content/posts/daily/2026-08-28-weekly-review.md`

診斷：

- `pnpm check:tw` 會過，不代表文章夠台灣。CS103 抽樣文章 0 blocking、0 review，但開頭仍是 provenance-first：「第幾篇、Lecture、講次頁面、投影片、Canvas/Panopto」。這保真，但讀者先接收到的是查核報告，不是導讀。
- 最台灣的是台股研究系列，因為它有台股制度、台灣開發者、GitHub 台股空位、自己的專案脈絡。這種「台灣」不是詞彙，而是問題設定。
- Serper / Stanford 類文章多數是 English-source-to-zh-TW：語言是繁中，骨架仍是英文文件的欄位與順序。這會讓文章看起來像翻譯後的技術文件。
- daily 文章有明顯英文 newsletter 痕跡：半形逗號、`證據 A:`、公司名冒號條列、M×N 後直接括號補充、長 tldr 堆多事件。這些不是中國詞，但會削弱台灣讀者的自然感。

新增判準：

- 台灣感第一層是「讀者位置」：這件事跟台灣讀者、繁中 builder、台灣市場、台灣教育/工作現場有什麼關係。
- 第二層才是詞彙：使用者、專案、品質、介面、訊號、影片等。
- 第三層是中文氣口：全形標點、短句、少括號、少英文欄位式標題。
- 第四層是問題設定：不要先交代來源權限，先交代讀者為什麼現在該讀這篇。

### quidproquo 長文

- 開頭不要先介紹世界趨勢，先說「這篇要解決哪個閱讀困難」。
- 每段只推進一個判斷；少用「此外、值得注意的是、不可忽視的是」這類空轉連接詞。
- 專有名詞第一次出現時，用一句人話解釋它在工作流裡扮演什麼角色。
- 保留作者判斷，但把判斷綁在材料上，不寫成純感想。
- 遇到技術比較，用「適合/不適合」取代「好/不好」。

### daily digest

- 每則以「發生什麼」開頭，第二句才說「為什麼重要」。
- 標題應該讓讀者知道變化，不只知道主詞。例如「OpenAI 調價」不夠，要寫清楚是漲、降、 sunset、還是方案拆分。
- 每則維持三層：事件、判讀、對 AI agent builder 的影響。
- 不追求新聞腔即時感；追求「少時間看懂重要變化」。
- 同一天材料很多時，按讀者決策排序，不按聲量排序。

## 來源觀察

### 科技島讀（歷史參考）

讀取程度: 一手，讀 `daodu.tech` 首頁文章與 INSIDE 專訪。狀態修正：`daodu.tech` 首頁抓到作者日期為 2021-06-07，正文說明這是「島讀的最後一篇」，因此它只能作為歷史語氣案例。

可學：

- 用故事或模型承載複雜概念，例如把科技趨勢整理成「個人價值、領域、價值鏈、護城河」。
- 科技事件一定拉回台灣脈絡，而不是只做代理資訊轉述。
- 訂閱制/日報的核心不是文章數量，而是穩定的讀者體驗與觀點一致性。

套用到 quidproquo：

- daily 的每則不要只摘要外電，要加「這對台灣/繁中 AI builder 代表什麼」。
- 系列導讀可以先給一個可重用的分析框架，再進入細節。
- 不要把科技島讀列入「目前仍可追蹤」的日報來源清單；它是寫法參考，不是 ongoing source。

### 報導者

讀取程度: 一手，讀首頁與官方 description。

可學：

- 議題句乾淨，常把制度問題落到「真正需要討論的是什麼」。
- 長文摘要不急著炫技，先建立公共問題、人物處境或事件後果。
- 題目與摘要能同時保留情緒和精確度。

套用到 quidproquo：

- AI 政策、教育、工具治理類文章可以用報導者式開頭：先指出讀者容易搞錯的問題設定。
- 不要把每篇都寫成技術產品文；有些主題應該寫成「制度/工作流如何被改變」。

### BIOS monthly

讀取程度: 一手，讀代表專訪。

可學：

- 人物文用細節開場，不用履歷開場。
- 長句可以存在，但每段有明確節奏，常用引言或具體場景換氣。
- 作者判斷常藏在段落轉折裡，不硬下 slogan。

套用到 quidproquo：

- 寫工具作者、研究者、產品團隊時，可以用「一個選擇/一個場景」開頭，而不是列公司背景。
- 非 tech 類文章可放更多身體感、地點、現場對話。

### 故事 StoryStudio

讀取程度: 一手，讀公司/平台自述頁。

可學：

- 明確把「艱澀資料轉化為日常語言」作為內容任務。
- 不把白話等同於變淺，而是保留脈絡、深度與可靠性。

套用到 quidproquo：

- 課程導讀、論文導讀、框架導讀都應該用「材料轉譯」而不是「摘要」自我定位。
- 可以建立固定段落：這份材料原本難在哪、我怎麼替讀者重排、讀完能做什麼判斷。

### iThome 電子報

讀取程度: 一手，讀 newsletter page。

可學：

- 日報定位清楚：用最少時間看懂重要話題。
- 題材分區明確：資安、AI、雲、軟體開發、CIO/CISO、數位政府、FinTech、ESG。
- 週報和日報的任務不同：日報抓即時，週報建立觀點。

套用到 quidproquo：

- daily 可以拆成「今日變化」與「本週脈絡」兩種文體，不要混在同一篇裡。
- 日報每則控制資訊密度，週報再做框架化整理。

## 來源

- 報導者: https://www.twreporter.org/
- BIOS monthly 代表專訪: https://www.biosmonthly.com/article/10514
- INSIDE 科技島讀專訪: https://www.inside.com.tw/article/9485-daodu-tech-yowurepor
- 科技島讀: https://daodu.tech/
- iThome 電子報: https://newsletter.ithome.com.tw/
- TechOrange: https://techorange.com/
- 端傳媒電子報: https://theinitium.com/newsletter/
- 500輯: https://500times.udn.com/
- Shopping Design 媒體介紹: https://www.bnextmedia.com.tw/sd/index.html
- 故事 StoryStudio: https://www.cake.me/companies/story-studio?locale=zh-TW
