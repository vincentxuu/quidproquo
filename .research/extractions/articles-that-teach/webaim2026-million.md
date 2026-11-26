# 抽取紀錄：WebAIM，The WebAIM Million: The 2026 report on the accessibility of the top 1,000,000 home pages（網頁報告，最後更新 2026-03-30）

- 書目：WebAIM（Utah State University，頁尾 L674–680）。〈The WebAIM Million – The 2026 report on the accessibility of the top 1,000,000 home pages〉。沒有個人作者署名、沒有 DOI。資料收集於 2026 年 2 月（L92）；頁面「Last updated: Mar 30, 2026」（L666）。
- 取得網址：https://webaim.org/projects/million/。原文檔本身沒有記錄網址；2026-10-14 我用 curl 重抓這個網址，頁面 `<time datetime="2026-03-30">`、「95.9% of home pages had detected …」與本檔一致，確認本檔就是此頁的文字版。出版者 WebAIM 自己公開的頁面，合法公開版本。
- 原文檔：`.research/raw/learning-content/q5-social/webaim-million2026.txt`，718 行、22,080 字元（`wc -lc` 實查）。
- 讀取日期：2026-10-14
- 版本：網頁現行版（2026 年度報告）
- 供：order 23

## 研究設計

- **類型**：自動化工具普查，描述性統計。第八年連續做（L88）。
- **樣本**：Tranco 排名的前 100 萬個網站首頁（L104）。排除沒有首頁、回傳錯誤（404 等）、HTML 元素少於 10 個、同網域連結超過 5,000 個（SEO 用）的頁面（L106）。**只量首頁**，不是整站，也不是教學內容頁。
- **工具**：WAVE stand-alone API，分析套用腳本與樣式後的渲染 DOM；另用其他工具收集網站技術與分類（L88、L110）。網站分類用 AWS Bedrock AI 判定（L305）。
- **量了什麼**：WAVE 偵測到的「錯誤」＝對使用者影響顯著、極可能是 WCAG 2.2 A/AA 不符合的障礙（L114）；另有頁面元素數、圖片、標題、ARIA 等計數。
- **時間**：2026 年 2 月；與 2019–2025 歷年比較（L92）。
- **作者明講的工具限制**：自動工具偵測不到所有不符合；沒偵測到錯誤不代表頁面無障礙或符合標準（L110）。

## 結果（逐項）

| # | 結果 | 數字與對照 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 偵測到的錯誤總數與平均 | 56,114,377 個，平均每頁 56.1 個；比 2025 的 51 個增加 10.1% | Detected Errors | L114 | 「Across the one million home pages, 56,114,377 distinct accessibility errors were detected—an average of 56.1 errors per page . The number of detected errors increased 10.1% since the 2025 analysis which found 51 errors/page.」 |
| 2 | 首頁複雜度 | 平均每頁 1,437 個元素，一年增 14.3%；7 年近乎倍增 | Home Page Complexity | L120、L124 | 「The average number of page elements increased to 1437 per home page in February 2026—a 14.3% increase in only one year!」 |
| 3 | 元素層級錯誤率 | 3.9% 的元素有錯誤，約每 26 個元素 1 個 | 同上 | L124 | 「3.9% of all home page elements had a detected accessibility error. Users with disabilities would expect to encounter errors on 1 in every 26 home page elements.」 |
| 4 | 錯誤密度不可靠（作者提醒） | — | 同上 Note | L128 | 「Error density ... is alone an unreliable metric of site accessibility.」 |
| 5 | 熱門度與複雜度 | 最熱門 10 萬頁平均 1,584 元素，比最不熱門 10 萬頁（1,318）多 20% | 同上 | L130 | 「The most popular 100,000 pages averaged 1,584 elements—20% more page elements than the least popular 100,000 sites」 |
| 6 | **有可偵測 WCAG 2 失敗的首頁比例** | 95.9%（2025 為 94.8%），逆轉前 6 年的小幅改善；完整 A/AA 符合率「肯定低於 4.1%」 | WCAG Conformance | L134 | 「95.9% of home pages had detected WCAG 2 failures. This number increased from 94.8% in 2025—reversing a trend of small improvements each of the previous 6 years. Because only automatically detectable WCAG failures were considered, this suggests that the rate of full WCAG 2 A/AA conformance was certainly lower than 4.1%.」 |
| 7 | 錯誤少的頁面 | 20.5% 的頁面 ≤5 個錯誤；30.4% ≤10 個 | 同上 | L138 | 「20.5% of pages had 5 or fewer detected errors and 30.4% had 10 or fewer.」 |
| 8 | 最常見六類失敗（佔首頁比例） | 低對比文字 83.9%；圖片缺替代文字 53.1%；表單欄位缺標籤 51%；空連結 46.3%；空按鈕 30.6%；缺文件語言 13.5% | 同上（表） | L140–153 | 表列 |
| 9 | **六類佔全部錯誤的比例** | 96%；這六類過去 7 年都一樣 | 同上 | L155 | 「96% of all errors detected fall into these six categories. These most common errors have been the same for the last 7 years.」 |
| 10 | 六類歷年（2019→2026） | 低對比 85.3%→83.9%（2025 為 79.1%）；缺 alt 68%→53.1%；缺標籤 52.8%→51%；空連結 58.1%→46.3%；空按鈕 25%→30.6%；缺語言 33.1%→13.5% | 歷年表 | L157–227 | 表列；L229「The number of pages with missing alternative text and missing document language decreased since 2025, whereas pages with low contrast text, missing labels, empty links, and empty buttons increased.」 |
| 11 | 低對比文字 | 83.9% 首頁（2025 為 79.1%）；平均每頁 34 處，比 2025 多 15% | Low Contrast Text | L233 | 「Low contrast text , below the WCAG 2 AA thresholds, was found on 83.9% of home pages, an increase from 79.1% in 2025.」 |
| 12 | 圖片與替代文字 | 平均每頁 66.6 張圖（一年增 13.6%）；16.2% 的圖缺 alt（每頁平均 10.8 張；不算 alt=""），2025 為 18.5%；缺 alt 的圖 45% 是連結圖；每 4 張連結圖有 1 張缺 alt | Images and Alternative Text | L237 | 「16.2% of all home page images (10.8 per page on average) had missing alternative text (not counting alt="" ).」 |
| 13 | 可疑或重複的替代文字 | 有 alt 的圖中 10.8% 是 "image"、"graphic"、檔名、或與鄰近文字相同之類 | 同上 | L239 | 「10.8% of images with alternative text had questionable or repetitive alternative text」 |
| 14 | 合計 | 超過四分之一的圖 alt 缺失、可疑或重複；問題圖比例逐年下降 | 同上 | L241 | 「more than one in four images on popular home pages have missing, questionable, or repetitive alternative text. The proportion of problematic images, however, is steadily decreasing over time.」 |
| 15 | 表單 | 平均每頁 6.9 個欄位，33.1% 沒有正確標籤 | Form Labeling | L245 | 「One third (33.1%) of those form inputs were not properly labeled」 |
| 16 | 標題數量與層級分布 | 約 3,000 萬個標題，平均每頁 29.9；一年增 20.4%；h1 5.1%、h2 29%、h3 37.5%、h4 14.7%、h5 6.8%、h6 6.9% | Headings | L249–261 | 表列 |
| 17 | h6 與跳級 | 至少有一個 h6 的首頁中 94.9% 也有跳級，作者推論多數 h6 不反映文件結構 | 同上 | L265 | 「94.9% of home pages that have at least one <h6> also have skipped heading levels. This suggests that most of these headings probably do not reflect the actual document structure.」 |
| 18 | **標題是螢幕閱讀器使用者主要的導覽方式**（本報告的主張，未附資料；連到 WebAIM 自己的使用者調查） | 多於一個 h1：18.1%（2025 為 16.3%）；跳級 1,206,444 處，每 25 個標題 1 個；41.8% 頁面有跳級（2025 為 39%）；7.5% 沒有標題（2025 為 9.8%） | 同上 | L267 | 「Because headings are the primary mechanism used by screen reader users to navigate content , their proper implementation is important.」 |
| 19 | 區域／地標 | 84.3% 至少一個（2025 為 80.5%）；main 46.1%；search 18.8% | Regions | L271 | 表列 |
| 20 | ARIA 與錯誤 | 平均每頁 133 個 ARIA 屬性，一年增 27%，是 2019 的 6 倍以上；82.7% 首頁用 ARIA；有 ARIA 的頁面平均 59.1 個錯誤 vs 沒有的 42 個。作者說不一定是 ARIA 造成（這些頁也較複雜） | ARIA | L275–283 | 「Home pages with ARIA present had significantly more errors (59.1 on average) than pages without ARIA (42 on average) .」「This does not necessarily mean that ARIA introduced these errors (these pages were also more complex)」 |
| 21 | ARIA 選單 | 5.7% 有 role="menu"，其中 22% 造成障礙 | ARIA | L285 | 表列 |
| 22 | 模糊連結文字 | 15.2% 頁面有 "click here"、"more" 之類（2025 為 13.7%，2020 為 23.2%） | Links | L291 | 「15.2% of pages had ambiguous link text」 |
| 23 | 跳至主內容連結 | 17.1% 有，其中每 10 個有 1 個壞掉 | Skip Links | L295 | 表列 |
| 24 | 網站分類 | Education 類 41,711 頁，平均 48.9 個錯誤，比整體平均少 12.8%；最少是 Government（42.4，−24.4%），最多 Sports（71.4，+27.3%） | Site Categories | L309–367 | 「Education 41,711 48.9 −12.8%」 |
| 25 | 頂級網域 | .edu 3,174 頁，平均 23.0 個錯誤（−59.0%）；.gov 18.5（−67.1%） | TLDs | L380–382 | 「edu 3,174 23.0 −59.0%」 |
| 26 | 頁面語言 | 87.3% 有宣告語言；中文頁 17,909 頁，平均 136.2 個錯誤（+142.8%），是表上最高；英文 46.0（−18.0%）；未宣告語言 60.3（+7.5%） | Languages | L438–477 | 「Chinese 17,909 136.2 +142.8%」 |
| 27 | 技術關聯（作者明說不能都歸因於技術本身） | Astro 5,472 頁，平均 9.0（−84.0%）；jQuery 64.9（+15.7%）；WordPress 52.8（−5.8%）；Shopify 75.1（+33.9%）等 | Technologies | L483–605 | 「Note that correspondence of additional errors with a technology cannot always be attributed to that technology.」 |
| 28 | YouTube 影片 | 6.2% 頁面有 YouTube 影片，這些頁比平均多 9.4 個錯誤 | Other technologies | L654 | 「6.2% of pages were detected as having YouTube videos and these pages had 9.4 more errors than average.」 |
| 29 | 資料表格 | 143,575 頁上 948,225 個表格，19% 有有效資料表標記 | 同上 | L658 | 「181,188 (19%) of the tables had valid data table markup.」 |
| 30 | 結論與作者推測的原因 | 錯誤數與失敗頁比例都上升，逆轉近年改善；主要擔憂是複雜度與 ARIA 增加；推測反映依賴第三方框架與 AI 輔助寫程式（"vibe coding"），屬推測 | Conclusion | L662–664 | 「These trends likely reflect broader shifts in web development including increased reliance on 3rd party frameworks and libraries and automated or AI-assisted coding practices ("vibe coding").」 |

（頁面另有歷年錯誤數、元素數、失敗比例、ARIA 數的折線圖，文字檔沒有圖；2026-10-14 重抓網頁讀了圖的 alt：錯誤數 2019–2020 約 60、2021–2023 約 50、2024 為 56.8、2025 為 51、2026 為 56；失敗比例 2019 為 97.8%。）

## 作者自己列的限制

- 自動工具偵測不到所有不符合；沒偵測到錯誤不代表無障礙（L110）。
- 只描述部分問題、只量 100 萬個首頁（L110）。
- 錯誤密度單獨看不可靠（L128）。
- ARIA、技術與錯誤是相關，不一定是因果（L283、L483）。

## 與摘要說法不一致的地方

網頁沒有獨立摘要；Introduction 與 Conclusion 對過正文，逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單：「95.9% 的首頁有可偵測的失敗；六類錯誤佔 96%」。兩個數字都對（#6 L134、#9 L155）。要補的限制：
1. 樣本是熱門網站**首頁**，不是教學文章或內容頁；拿來談「教學文章的讀者讀不到」只能當網路整體狀況的背景。
2. 「失敗」是 WAVE 自動偵測的 WCAG 2 A/AA 失敗；作者自己說實際符合率「肯定低於 4.1%」，也說自動偵測只抓得到一部分問題。
3. 清單說「六類錯誤佔 96%」——原文是「96% of all errors detected fall into these six categories」，是**錯誤數**的 96%，不是頁面比例，引用時不要混。
4. 和教學內容較相關但清單沒提的：圖片 alt 缺失或可疑合計超過四分之一（#12–14）、標題跳級 41.8%（#18）、資料表格只有 19% 有有效標記（#29）、中文頁面平均錯誤數最高（#26）、Education 類與 .edu 錯誤較少（#24、#25）。

## 讀取紀錄

- 依序讀 L1–85（頁首、目錄）、L86–107（Introduction、Sample）、L108–138（Methodology、Detected Errors、Complexity、Conformance）、L140–229（兩張常見錯誤表）、L231–299（Low contrast 到 Doctypes）、L301–479（Site Categories、TLDs、Languages 三張表）、L481–658（Technologies 各表與 Other）、L660–718（Conclusion、頁尾）。涵蓋 L1–718 全文。
- 表格：文字檔的表格是一列一行或一格一行，逐列對過欄位順序（# of home pages、Avg. # of errors、% difference），沒有錯位；沒有 PDF 可對，2026-10-14 對照重抓的網頁 HTML 抽查 95.9% 與圖的 alt。
