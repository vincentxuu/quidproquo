# 抽取紀錄：WebAIM，Screen Reader User Survey #10 Results（網頁，最後更新 2024-02-22）

- 書目：WebAIM（Utah State University，頁尾 L706–712）。〈Screen Reader User Survey #10 Results〉。沒有個人作者署名、沒有 DOI。調查期間 2023 年 12 月至 2024 年 1 月（L103）；頁面「Last updated: Feb 22, 2024」（L680）。BrowserStack 部分贊助（L115–117）。清單寫 2026 年檔案、未標年份；**引用年份應寫 2024**。
- 取得網址：https://webaim.org/projects/screenreadersurvey10/。原文檔沒有記錄網址；2026-10-14 我用 curl 重抓此網址，頁面 `<time datetime="2024-02-22">` 與本檔相同、71.6% 兩處都在，確認是同一頁。出版者 WebAIM 自己公開的頁面，合法公開版本。
- 原文檔：`.research/raw/learning-content/q5-social/webaim-sr-survey10.txt`，750 行、19,716 字元（`wc -lc` 實查）。
- 讀取日期：2026-10-14
- 版本：網頁現行版
- 供：order 23

## 研究設計

- **類型**：線上自填問卷，描述性統計，非控制樣本。第 10 次（前 9 次在 2009 年 1 月至 2021 年 6 月間，L103）。
- **受訪者**：有效回應 1,539 份（L103）。各題 n 不一定等於 1,539（有人沒答，L109）。地區：北美 47.2%、歐洲 30.7%、亞洲 6.4%、南美 6.3%、非洲／中東 4.8%、澳洲大洋洲 3.3%、中美加勒比 1.3%（L126–138）。年齡：20 以下 6.1%、21–40 37.9%、41–60 35.9%、60+ 20.0%（L147–153）。因障礙而使用螢幕閱讀器 89.9%（1,372），否 10.1%（154）（L160–162）。障礙類型：全盲 76.6%、低視能 19.9%、認知或學習 5.2%、聽障 6.8%、肢體 2.2%、其他 4.9%（L171–181）。自評螢幕閱讀器熟練度：進階 58.3%、中等 36.0%、初學 5.7%（L190–194）。
- **作者聲明**：「The sample was not controlled and may not represent all screen reader users.」（L111）
- **量了什麼**：自陳的使用工具、平台、習慣、偏好、對網路無障礙的看法、最困擾的項目。沒有行為觀察。

## 結果（逐項）

| # | 結果 | 數字與對照 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | **在長網頁找資訊時最先做什麼** | 瀏覽頁面標題 71.6%（1,082）；用「尋找」功能 13.6%（205）；從頭讀 6.4%（96）；瀏覽連結 4.8%（72）；瀏覽地標 3.7%（56）。這題回答合計 1,511 人（我自己加總，1,082/1,511 = 71.6%） | Finding Information | L614–625 | 「When trying to find information on a lengthy web page, which of the following are you most likely to do first?」「Navigate through the headings on the page 1082 71.6%」 |
| 2 | 標題用法隨時間增加，仍是主要方法；依熟練度差很多 | 進階者 78% 用標題 vs 初學者 47%；初學者用「尋找」的機率是進階者的 2.5 倍 | 同上 | L627 | 「Those with advanced screen reader proficiency are much more likely to use headings (78%) than those with beginner proficiency (47%). Beginners are 2.5 times more likely to use the "Find" feature than those with advanced proficiency.」 |
| 3 | 地標常用但很少當首選 | 31.7% 說有地標時總是或常用；只有 3.7% 當長頁面的首選方法 | 同上 | L629 | 「While 31.7% of respondents indicate that they always or often use landmarks when they are present, only 3.7% use this as a primary method」 |
| 4 | 標題層級有沒有用 | 非常有用 57.0%、有點有用 31.8%（合計 88.8%）、不太有用 7.5%、完全沒用 1.8%、不知道 1.9% | Heading Levels | L633–646 | 「88.8% of respondents find them very or somewhat useful.」 |
| 5 | 地標使用頻率 | 有就用 17.9%、常用 13.9%、有時 31.5%、很少 20.6%、從不 16.1%；常用比例 2014 為 43.8%、2021 為 25.6%、2024 為 31.8% | Landmarks/Regions | L597–610 | 表列 |
| 6 | **最困擾的項目**（加權排序，非百分比） | 依序：CAPTCHA；互動元件（選單、分頁、對話框）行為不如預期；看不懂的連結或按鈕；畫面意外變動；缺鍵盤可及性；**圖片缺或錯的替代文字**（第 6）；複雜表單；**缺或錯的標題**（第 8）；連結或導覽項目太多；**複雜資料表**（第 10）；搜尋不可及；缺跳過導覽連結。過去 14 年順序大致不變 | Problematic Items | L650–678 | 「The order and indicated difficulty for the items in this list are largely unchanged over the last 14 years. CAPTCHA remains the most (by a notable margin) problematic item」 |
| 7 | 改善網路無障礙靠什麼 | 更好的網站 85.9% vs 更好的輔助科技 14.1%；2009 年 10 月為 68.6% | Impacts on Accessibility | L543–550 | 「It certainly indicates that users expect more accessible web sites.」 |
| 8 | 對過去一年的感受 | 變得更無障礙 34.6%、沒變 46.8%、變差 18.6%；無障礙者較樂觀（45.9% vs 33.4%） | Web Accessibility Progress | L530–539 | 表列 |
| 9 | 聯絡網站擁有者 | 從不或很少 67%（不太常 44.3%＋從不 21.7%） | Contacting Website Owners | L554–565 | 「The majority (67%) of respondents never or rarely contact web site owners about barriers.」 |
| 10 | 行動裝置 | 91.3% 在行動裝置上用螢幕閱讀器（有障礙者 93.6% vs 無障礙者 70.4%）；主要平台 iOS 70.6%、Android 27.6% | Mobile | L432–454 | 「91.3% of respondents report using a screen reader on a mobile device.」 |
| 11 | 桌機或行動哪個用得多 | 桌機 40.2%、差不多 49.5%、行動 10.2% | Mobile vs. Desktop | L506–513 | 表列 |
| 12 | 一般任務用 App 或網站 | App 58%、網站 42%（2021 為 51.8%、2017 為 46%） | Mobile App vs Web | L519–526 | 表列 |
| 13 | 主要桌機螢幕閱讀器 | JAWS 40.5%、NVDA 37.7%、VoiceOver 9.7%；地區差異大（北美 JAWS 55.5% vs NVDA 24.0%；亞洲 JAWS 22.9% vs NVDA 70.8%） | Primary Screen Reader | L213–238 | 表列 |
| 14 | **另一個 71.6%** | 71.6% 的受訪者用一種以上的桌機螢幕閱讀器；43% 用三種以上；17.4% 用四種以上 | Screen Readers Commonly Used | L271 | 「71.6% of respondents use more than one desktop/laptop screen reader.」 |
| 15 | 點字輸出 | 38%（只算有障礙者，2017 為 33.3%、2012 為 27.7%） | Braille Output | L404–411 | 表列 |
| 16 | 虛擬會議要不要描述外表 | 否 68.2% | Descriptions in Virtual Meetings | L586–593 | 表列 |
| 17 | 其他描述性數字 | 瀏覽器 Chrome 52.3%；作業系統 Windows 86.1%；JavaScript 開啟 99.8%；滿意度非常滿意 63.8%；社群媒體「有點可及」56.3% | 各節 | L275–582 | 表列 |

## 作者自己列的限制

- 百分比因四捨五入可能不等於 100%（L107）。
- 各題 n 不一定是 1,539（L109）。
- 樣本未控制，不一定代表所有螢幕閱讀器使用者（L111）。

## 與摘要說法不一致的地方

網頁沒有摘要。逐項對過正文敘述與表格，沒有。

## 與清單「要撐的結論」不合的地方

清單：「71.6% 先用標題導覽；n = 1,539」。數字對，但要改兩處：
1. **n 不是 1,539**：1,539 是全份問卷的有效回應數；這一題回答的人合計 1,511（我自己把五個選項相加），71.6% 是 1,082/1,511。寫成「1,539 位受訪者中 71.6%」會錯。
2. 題目是「在**長網頁**找資訊時，最可能**先**做什麼」，是自陳偏好，不是觀察到的行為；樣本自願參與、未控制（L111），進階使用者佔 58.3%，而進階者用標題的比例（78%）遠高於初學者（47%），所以 71.6% 偏向熟練使用者。
3. 頁面上還有另一個 71.6%（用一種以上螢幕閱讀器，L271），引用時要指明是哪一題。
4. 調查年份是 2023-12 至 2024-01、頁面 2024-02-22 更新，引用寫 2024，不是 2026。

## 讀取紀錄

- 依序讀 L1–100（頁首、目錄）、L101–118（Introduction、聲明）、L119–209（人口學）、L211–426（桌機螢幕閱讀器、瀏覽器、作業系統、滿意度、點字、免費 vs 商用）、L428–526（行動裝置）、L528–629（看法、聯絡、社群、會議、地標、找資訊）、L631–680（標題層級、困擾項目、更新日期）、L682–750（相關資源、頁尾）。涵蓋 L1–750 全文。
- 表格：文字檔每列一行，欄位（# of respondents、% of respondents）逐列對過沒有錯位。Problematic Items 的加權分數只在圖上，文字檔與重抓的 HTML 都沒有數字（圖的 alt 我查過，HTML 裡沒有這張圖的 alt），所以只能引排序，不能引分數。
