# 抽取紀錄：Cleverley & Burnett (2019) Enterprise search and discovery capability: The factors and generative mechanisms for user satisfaction

read_status=read（作者接受稿全文；正文 L1–L708 讀完，L710 起為參考文獻，掃過並查了 [93][101][107]）

## 書目

- Paul H. Cleverley、Simon Burnett（Robert Gordon University）。*Journal of Information Science* 45(1): 29–52，2019（online 2018-05-11）。DOI: https://doi.org/10.1177/0165551518770969
- 讀取方式：RGU OpenAIR 接受稿 https://rgu-repository.worktribe.com/preview/297535/CLEVERLEY%202018%20Enterprise%20search%20and%20discovery%20capability.pdf 。curl 被 Cloudflare 擋（回 "Just a moment..." 挑戰頁 HTML）；改用 Exa web_fetch 取得全文。檔頭頁碼、版權欄是 SAGE 範本殘留（"© 2014"、DOI 10.1177/0165551510000000），不是真實出版資訊。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-cleverley-burnett-2019-es-satisfaction.txt（1,018 行，109,821 bytes）。表格經 Exa 轉換，Table 2 欄位擠在一格，數字以 Table 3（L408–424）為準。

## 性質

- 單一公司（大型油氣跨國企業）縱貫個案研究，混合方法：兩年（2013–2015）企業搜尋介面上的使用者主動回饋 1,183 則（1,076 人）＋搜尋服務團隊 5 人訪談（L327、L337–345、L370）。
- 作者自承回饋者自我選擇、無法統計推論（L364–366）。研究者與團隊對新一個月 138 則分類的一致率 72%（L426）。

## 可引用結果（附行號）

1. 規模（L327、L370）：約 70,000 人／月使用、每月 45 萬次查詢；兩年 450 萬次查詢；語料庫翻倍到 1.5 億筆；平均查詢 1.89 個字；前 30 名查詢占比從 14% 降到 8%；零結果比例約 0.4% → 0.3%。回饋鈕從頁底移到搜尋框旁，每月回饋增加 456%。
2. 不滿原因三分（L406；Table 3 L410–424）：技術 38%、資訊 36%、素養 26%。
   - 技術：搜尋工具可靠度 56%、排序 32%、語法處理 7%、非搜尋 IT 5%。
   - 資訊：內容準確與完整（缺、沒寫、不足）35%、不在索引 28%、找公司工具入口 14%、語意（縮寫／同義／上位詞）13%、置頂推薦（best bets）10%。
   - 素養：查詢詞選擇 65%、找錯管道 17%、沒看到正確結果 11%、不會用工具 7%。
3. 同義詞問題比想像小（L654–659）："synonym/acronym/hypernym factors only accounted for 5% of all dissatisfaction events. This conflicts with assertions that the vocabulary problem is the dominant reason for search task dissatisfaction in the enterprise"；作者給兩種解釋：樣本大、或回饋樣本自我選擇。
4. 詞彙落差例子（L479–484）："I can't find information on flu shots"，團隊改搜正式用語 "influenza vaccination" 就找到；被歸為資訊因素："the organization needs to embed its domain information into the tool."
5. 改內容比換技術划算（L625–627）："With over a third (36%) of dissatisfaction events related to information factors, the findings support the assertion that in many cases, improving the organization of information is more advantageous than modifying search technology to improve the search experience"。
6. 標題（L558，訪談 ESM_1）："If you want search to work properly you need to author content with search in mind. The Title text has the highest weight (in the ranking score model), some web pages don't have title filled in ... Make site templates require titles."
7. 置頂推薦被忽略（L510–512；L663–670）：團隊發現正確答案就在 promoted result，但使用者 "had not noticed (or had subconsciously ignored) the promoted results because it looked different to the 'organic' search results"。
8. 零結果不是不滿來源（L644–647）："paradoxically, the issue of 'no results' for a search query was not found to be a factor for dissatisfaction"；大語料庫下只有 0.3% 零結果。
9. 55% 的抱怨發生在只查一次、沒改寫查詢之後（L648）。
10. 「換 Google 就好」的循環（L289–292、L588）：組織反覆 "fixes that fail" 換搜尋技術；訪談畫出的因果圖第一個迴圈就是「用不滿理由合理化換新引擎」。回饋原句 "Employ Google"（L439）。
11. 需要持續調校（L679–682）："it is unlikely that many information needs will be met without constant configuration, promotion of authoritative (trusted) corporate information and monitoring of performance".
12. 工具入口（L659–662）：約 5% 抱怨是找軟體、入口、系統；建議做 A–Z 服務頁並妥善索引。

## 沒寫的事

- 不是搜尋紀錄分析，是「回饋紀錄」分析；零結果與前 30 名占比是附帶統計。
- 沒有量化「改標題、加同義詞」之後的改善幅度；「改內容比換技術好」是支持既有主張，不是實驗結果。
- 沒有中文或多語詞彙問題。

## 與摘要或常見轉述不一致處

1. 摘要說 "62% of dissatisfaction events were due to human (information & search literacy) rather than technology factors"。62% = 資訊 36% + 素養 26%（L406）。「資訊因素」包含內容缺漏、沒進索引、標題標籤差——這是組織的內容管理問題，不是使用者個人的問題。轉述成「六成是使用者不會搜」會錯；應寫「六成不是搜尋引擎的問題：36% 是內容本身（缺、沒索引、標題差），26% 是查詢技巧」。
2. 文獻回顧引用「兩個人為同一概念取同一名字的機率 80% 不會一樣」（L224–225，引 Furnas et al. 1987）與「有內網 16% 查詢零結果」（L247，引一篇 2010 年碩士論文 [107]）。兩者都是二手轉引，本紀錄沒讀原文，不能直接列為參考資料。
3. 對 order 10 自我檢查「請假找不到〈休假政策〉」：本篇支持「先改內容與標題、不要先換引擎」（L558、L625、L588），但也提醒同義詞問題在這家公司只占不滿事件 5%；修標題與同義詞是對的第一步，不是萬靈丹。

## 限制

- 單一產業單一公司；回饋自我選擇（79% 為負評，L370）；技術問題會在故障月份暴增（L620–623），可能高估技術比例。
- 資料 2013–2015，搜尋技術是當時的關鍵字引擎。
