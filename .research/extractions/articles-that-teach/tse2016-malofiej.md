# 抽取紀錄：Tse 2016，Why We Are Doing Fewer Interactives（Malofiej 2016 簡報投影片）

- **書目**：Archie Tse（投影片自署 Deputy Graphics Director, The New York Times）(2016). *Why We Are Doing Fewer Interactives／Por qué estamos haciendo menos gráficos interactivos*. Malofiej 2016 研討會簡報投影片（研討會名稱依作者 GitHub 倉庫名 `malofiej-2016` 與 PDF 標題「malofiej title slides copy」；投影片本身沒有印研討會名稱與日期）。作者自己放在 GitHub：https://github.com/archietse/malofiej-2016 （檔名 `tse-malofiej-2016-slides.pdf`）。沒有 DOI。PDF 中繼資料的建立日期是 2016-03-09。
- **版本**：作者公開的投影片 PDF，24 頁。只有投影片上的字，**沒有講稿、沒有錄音逐字稿**。
- **原文檔**：`.research/raw/learning-content/q2-interactive/tse2016-malofiej.txt`（103 行、2,307 字元／2,320 位元組）。這次另外從作者的 GitHub 抓了原始 PDF 存成同目錄的 `tse2016-malofiej-slides.pdf`（2,199,883 位元組，24 頁），用 `pdftotext` 轉出後與原文檔 `diff`，完全相同。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）#9（與 Aisch 2017 合用，見 `aisch2017-defense.md`）

## 研究設計

不是研究。是紐約時報圖表部門副主管在業界研討會上的簡報，內容是部門做法的轉變與三條經驗法則。**投影片上沒有任何數字、沒有資料來源、沒有說依據是什麼量測。**

## 內容（逐項，全部照投影片文字）

| # | 投影片說了什麼 | 行號 | 原文 |
|---|---|---|---|
| 1 | 以前比較常做的三種互動 | L6–9 | 「Some things we used to do more frequently > Steppers > Tabs and fixies > Sliders」 |
| 2 | 這些互動的作用 | L16–18 | 「Often just a way for the reader to see more stuff.」 |
| 3 | 問題 | L27–29 | 「But readers weren't getting to all of the content.」 |
| 4 | 原因 | L31–33 | 「Why? Readers just want to scroll.」 |
| 5 | 法則一 | L38–40 | 「If you make the reader click or do anything other than scroll, something spectacular has to happen.」 |
| 6 | 法則二 | L46–48 | 「If you make a tooltip or rollover, assume no one will ever see it. If content is important for readers to see, don't hide it.」 |
| 7 | 法則三 | L57–58 | 「When deciding whether to make something interactive, remember that getting it to work on all platforms is expensive.」 |
| 8 | 另一個轉變 | L60–70 | 「Fewer small graphics embedded in articles. More stand-alone visual stories.」 |
| 9 | 部門因此怎麼變 | L72–93 | 「Most visuals are static.」「We are writing and editing a lot more text.」「If animation or motion is needed, try to trigger it when user scrolls.」「We still do interactives, but the bar is now VERY high.」 |
| 10 | 結尾介紹的工具 | L95–102 | 「A tool for making responsive graphics with Adobe Illustrator」（ai2html.org） |

標題是「3 rules for visual storytelling (2016 edition)」（L35），帶了年份。

## 作者自己列的限制

沒有。投影片沒有任何保留或適用範圍的說明。能從文字上看到的界線只有兩個：標題註明是「2016 edition」；最後一條寫「We still do interactives」。

## 與摘要說法不一致的地方

沒有摘要。逐頁對過，投影片前後沒有互相矛盾的地方。

## 與清單「要撐的結論」不合的地方

清單寫：「紐約時報的 10–15% 與它被誤讀的地方」。

1. **這份投影片裡沒有「10–15%」，也沒有任何百分比。** 它只說「readers weren't getting to all of the content」與「assume no one will ever see it」，沒有說是多少人、怎麼量的、哪幾件作品。要引數字不能掛在 Tse 名下。
2. 數字的來源是 Gregor Aisch（見 `aisch2017-defense.md`）：他說是他量的、是某幾件 2015 年的作品上一個顯眼按鈕的點擊比例，並在一場研討會上講出來。那場演講本身不在手上的檔案裡。
3. 投影片能撐的說法是：紐約時報圖表部門在 2016 年公開表示「多數圖表改成靜態、要讀者點擊的門檻變得很高、重要內容不要藏在互動後面、跨平台做互動很貴」。這是部門主管的經驗陳述，沒有附證據。
4. 「讀者只想捲動」是投影片的原話（「Readers just want to scroll.」），是斷言，不是量測結果。
5. 成本那一條（法則三）講的是「在所有平台上都能動」的成本，沒有給工時或金額。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–103（一次讀完） | 全部 24 頁投影片的文字 |
| 對原檔 | `tse2016-malofiej-slides.pdf` | 重抓作者 GitHub 上的 PDF，`pdftotext` 輸出與原文檔逐行相同。投影片上的圖（範例截圖）沒有看影像 |
