# 抽取紀錄：Pew Research Center 2024, When Online Content Disappears

read_status=full（PDF 全文 17 頁含方法說明，逐行讀完）

## 書目與實際讀的版本

- 作者：Athena Chapekis, Samuel Bestvater, Emma Remy, Gonzalo Rivero（Pew Research Center, Data Labs）
- 發布：2024-05-17（"FOR RELEASE MAY 17, 2024"）
- 標題：When Online Content Disappears — 副標 "38% of webpages that existed in 2013 are no longer accessible a decade later"
- 建議引用格式（PDF p.1 原文）：Pew Research Center, May 2024, "When Online Content Disappears"
- 網頁版：https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/ （另有 /internet/2024/05/17/... 同文路徑）
- 方法頁：https://www.pewresearch.org/data-labs/2024/05/17/methodology-link-rot/
- 實際讀的檔案：PDF https://www.pewresearch.org/wp-content/uploads/sites/20/2024/05/pl_2024.05.17_link-rot_report.pdf（curl 下載，827,823 bytes；pdftotext 報 xref 錯誤但成功重建，抽出 16 頁內文＋封面）
- 網頁版只看過 exa 搜尋摘錄，跟 PDF 文字一致；沒有逐字比對整個網頁版。

## 設計／性質

描述性的網路測量研究（不是問卷），三部分：
1. 2013–2023 一般網頁：Common Crawl 每年抽樣，2023 年 10–11 月回頭檢查還在不在。
2. 現存網頁上的連結：政府網站、新聞網站、英文 Wikipedia 的 References 連結，追到目的地看是否失效。
3. Twitter（X）：2023-03-08 到 04-27 即時抽推文，追三個月看是否還公開可見。

「失效」定義（PDF p.5 方框、p.16 方法）：只算「頁面或主機已不存在」，不算內容被改、不算無障礙問題。判定為 inaccessible 的條件：DNS 查不到網域，或回傳 204、400、404、410、500、501、502、503、523 九種狀態碼之一。原文："We counted pages as inaccessible only if they returned one of nine error codes that definitively indicate that the page and/or its host server no longer exist or have become nonfunctional"。其他情況一律算可存取，"including ambiguous situations in which we could not guarantee that the content exists, like soft 404 pages or timeouts not caused by the DNS."（p.16）→ 作者自稱是 "the most conservative estimate possible"。

## 可引用結果

### A. 一般網頁（2013–2023）（PDF p.3 圖、p.6 正文、p.14 方法）

- 樣本：圖註 n=999,989；正文 "a random sample of just under 1 million webpages"、"approximately 90,000 pages per year"；方法頁 "a full sample of 1 million pages – approximately 91,000 pages each year from 2013 to 2023"。以 year 分層抽樣，盡量用每年 March/April crawl。
- 檢查時間："These checks were performed in several stages, running Oct. 12-Nov. 6, 2023."（p.14）
- 整體：25% 已失效。原文（p.6）："We found that 25% of all the pages we collected from 2013 through 2023 were no longer accessible as of October 2023. This figure is the sum of two different types of broken pages: 16% of pages are individually inaccessible but come from an otherwise functional root-level domain; the other 9% are inaccessible because their entire root domain is no longer functional."
- 2013 年：38%。原文（p.3）："Some 38% of webpages that existed in 2013 are not available today, compared with 8% of pages that existed in 2023."
- 2021 年：約五分之一。原文（p.6）："even for pages collected in the 2021 snapshot, about one-in-five were no longer accessible just two years later."
- 逐年數字（p.3 圖 "% of links from each year that are no longer accessible as of October 2023"，用 pdftotext -bbox 依 x 座標對齊年份標籤還原）：'13 38%、'14 35、'15 31、'16 30、'17 26、'18 31、'19 32、'20 27、'21 22、'22 15、'23 8。
- 歸因（p.3）："In most cases, this is because an individual page was deleted or removed on an otherwise functional website."

### B. 政府網站連結（PDF p.6–7、p.14–15）

- 樣本：500,000 個 .gov 頁面（Common Crawl MAIN-2023-14，March/April 2023），依網域與政府層級分層；每頁抽 10% 連結（內外部都抽），共 4,179,313 條（圖註寫 "n=4,200,000 links"）。政府層級依 get.gov 資料（2023-08-22 取得）。
- 頁面上共有 4,200 萬條連結，86% 是站內連結；約四分之三頁面至少有一條連結；中位數每頁 50 條，P90 190 條，P99 740 條。
- 6% 連到靜態檔（如 PDF）；16% 現在會轉址到別的 URL。
- 結果：6% 的連結失效；21% 的頁面至少有一條壞連結。原文（p.7）："When we followed these links, we found that 6% point to pages that are no longer accessible. Similar shares of internal and external links are no longer functional." "Overall, 21% of all the government webpages we examined contained at least one broken link. Across every level of government we looked at, there were broken links on at least 14% of pages; city government pages had the highest rates of broken links."
- 依層級（p.6 圖，頁面至少一條壞連結 / 全部連結失效比；已用 `pdftotext -bbox` 依 x 座標對齊）：Total 21% / 6%；City 29 / 13；County 27 / 7；State 15 / 4；Federal 21 / 6。

### C. 新聞網站連結（PDF p.8、p.15）

- 樣本：comScore 分類為 "News/Information" 的 2,063 個網域，依 2022 Q4 流量分五等分，各抽 100,000 頁，共 500,000 頁（Common Crawl March/April 2023）。只看外部連結；7,089,514 條外部連結中抽 50% 檢查。
- 94% 頁面至少一條外部連結；中位數 20 條，前 10% 頁面 56 條；約 12% 連到靜態檔；32% 會轉址。
- 結果（p.8）："we found that 5% of all links on news site pages are no longer accessible. And 23% of all the pages we sampled contained at least one broken link."
- 流量高低差不多（p.8）："Some 25% of pages on news websites in the top 20% by site traffic have at least one broken link. That is nearly identical to the 26% of sites in the bottom 20% by site traffic."
- 依流量五等分（p.8 圖，頁面至少一條壞連結 / 連結失效比；bbox 對齊）：Total 23% / 5%；1st（最低）26 / 3；2nd 22 / 4；3rd 21 / 4；4th 22 / 3；5th（最高）25 / 6。
- 腳註 1：新聞網站分析沒有檢查站內連結。

### D. Wikipedia References 連結（PDF p.4、p.9、p.15–16）

- 樣本：從 2023-05-20 英文 Wikipedia 標題清單中抽 50,000 頁（2023-09-20 抽樣），去重轉址後，有 50 頁在期間被刪，實際分析 49,950 頁；References 外部連結在 2023-10-10～11 檢查。
- 82% 頁面至少有一條 reference 連結；共約 100 萬條以上；中位數每頁 4 條。
- 結果（p.9）："The analysis indicates that 11% of all references linked on Wikipedia are no longer accessible. On about 2% of source pages containing reference links, every link on the page was broken or otherwise inaccessible, while another 53% of pages contained at least one broken link."
- 摘要句（p.4）："54% of Wikipedia pages contain at least one link in their "References" section that points to a page that no longer exists."

### E. Twitter（PDF p.4、p.9–11、p.13）

- 4.8 百萬則推文（2023-03-08～04-27，Streaming API 每 30 分鐘抽 3,000 則），每日檢查到 2023-06-15；特徵分析子樣本 148,494 則（來自 10 萬名隨機使用者）。
- 18% 不再公開可見；其中 60% 是帳號被設私人、停權或刪除，40% 是帳號還在但推文被刪（p.4）。
- 存活分析（p.11）：1 小時內 1%、1 天內 3%、1 週內 10%、1 個月內 15%；最終被移除的推文有一半在 6 天內消失，90% 在 46 天內消失；6% 消失後又重新出現。
- 語言：土耳其文 49%、阿拉伯文 42%（p.10 圖）；預設大頭照帳號 58%、預設 bio 36%；未驗證 21% vs 已驗證 9%；replies 只有 12% 消失。

## 限制（作者自述與我的判讀）

- 只量「完全不存在」，不量內容被改寫（p.5 明說 "beyond the scope"）；soft 404、非 DNS 造成的逾時都算「可存取」→ 數字是下限。
- 檢查用 Python requests、1 秒逾時，加上隨機瀏覽器標頭、429 重試、DNS 查詢四輪（p.16）。網站擋爬蟲可能讓部分頁面被誤判（作者在 p.5 提到 "many sites actively try to prevent the sort of automated data collection"，所以只計那九種狀態碼）。
- 母體是 Common Crawl 收錄過的頁面，不是「整個網路」；Common Crawl 的收錄本身有偏（作者沒討論這點）。
- 逐年失效率不是單調遞減（2017 年 26% 低於 2018、2019 年），報告沒有解釋；用「越舊越多」敘述時要說是大致趨勢。
- 沒有測個人收藏（書籤、稍後讀）的失效率；套用到個人知識庫是外推。

## 與摘要或常見轉述不一致處

1. 「38% 的網頁在十年內消失」常被轉述成「網路上 38% 的內容都消失了」。實際是「2013 年那批抽樣頁面到 2023 年有 38% 打不開」；2013–2023 全部合計是 25%。
2. 樣本數三種寫法：圖註 n=999,989、正文「just under 1 million」「approximately 90,000 pages per year」、方法頁「1 million pages – approximately 91,000 pages each year」。引用寫「近 100 萬頁、每年約 9 萬頁」最安全。
3. 政府連結數：圖註 "n=4,200,000"，方法頁 4,179,313；兩者是四捨五入關係。
4. Wikipedia：摘要寫 54% 頁面至少一條壞連結；正文寫「約 2% 全壞＋另外 53% 至少一條」，加起來約 55%。兩個數字都出自同一份報告，差異應是四捨五入；引用時用摘要的 54%，或明寫「2%＋53%」。
5. 新聞轉址比例：正文說新聞站 32% 連結轉址，"slightly less than the 39% of external links on government sites that redirect"；但政府段落寫的是全部連結 16% 轉址。39% 是政府外部連結，16% 是政府全部連結，兩個分母不同，不要混用。
6. Twitter 收集期：正文與方法寫 March 8–April 27, 2023；圖註寫 "4.8 million tweets posted March 8-April 23, 2023"。報告內部不一致。
7. 新聞網站「高流量與低流量差不多」那句寫 "26% of sites in the bottom 20%"，但分析單位是頁面不是網站（前句說 "pages on news websites"），原文用詞混用。
8. 政府分層：正文說 "there were broken links on at least 14% of pages" across every level，但圖上最低的是 State 15%；「至少 14%」可能指圖上沒畫出的其他層級（樣本有 9 種層級，圖只畫 4 種）。引用分層時用圖上數字並註明只畫 4 層。
9. 新聞「流量最高 25% vs 最低 26%」與圖一致，但連結失效比是最高流量組 6%、最低流量組 3%，也就是「頁面有壞連結的比例差不多，但高流量站的連結失效比反而較高」，報告正文沒提這點。

## 讀取紀錄

- 全文：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/pew-2024-link-rot.txt（717 行，37,994 bytes）
- 原始 PDF：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/dl/pew/pew.pdf
- 依序讀過：1–717（一次讀完）；另對 PDF 第 3、6、8 頁跑 `pdftotext -bbox` 取圖表標籤座標。
- 讀取日期：2026-10-22
