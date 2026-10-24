# 抽取紀錄：Buchgeher, Schöberl, Geist, Dorninger, Haindl & Weinreich 2023, Using Architecture Decision Records in Open Source Projects — An MSR Study on GitHub

read_status=full（IEEE Access 開放取用 CC BY 版全文 HTML，經 Tavily extract 取得；圖表只有圖說，圖內數字讀不到）

角色：order 8 的反證／限制——ADR 多數「試了沒繼續」、寫完多半不再改。也是 ICSA 2026（Santana）、Miccio 2026、Su 2026 共用的 921 repo 資料集出處。

## 書目

- 作者：Georg Buchgeher、Stefan Schöberl、Verena Geist、Bernhard Dorninger（Software Competence Center Hagenberg）、Philipp Haindl、Rainer Weinreich（JKU Linz）
- 刊物：IEEE Access 11 (2023), pp. 63725–63740；出版日 2023-06-19；DOI 10.1109/ACCESS.2023.3287654；Open Access（CC BY）
- 資料集：https://github.com/software-competence-center-hagenberg/ADR-Study-Dataset（未開）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o8-buchgeher-2023.txt（380 行，71,393 bytes；本文在行 109–316；行 317–380 是 IEEE 網站外框，檔內沒有參考文獻清單（行 334 "References is not available for this document."））

## 設計、樣本、量了什麼

- Mining software repositories（MSR），依 Vidoni 的流程（行 150–156）。
- 搜尋（行 191–195）：26,372,973 個有公開 repo 的使用者 → 282,789 個有含 "decision" 的 Markdown 檔 → 路徑含 arch/adr/design/decision 的 7,331 人 → 人工篩到 1,058 人 → 依納入／排除條件（排除只解釋 ADR 概念、空模板、只有一份「我們要寫 ADR」的 ADR、課堂作業、非英文、單檔 decision log、複製來的 repo）得 921 個 repo。
- 資料截至 2020 年底（行 311 "all public repositories that were available at the end of 2020"）；2021 年資料不完整，未進圖（行 204）。
- 量了：每 repo ADR 數、作者數、每個 ADR 檔 commit 數、編輯時間跨度、所用模板（以標題比對，對不上則人工分類，行 199）。沒有量 ADR 內容品質、是否被讀、對專案的影響。

## 可引用結果（行號指 o8-buchgeher-2023.txt）

1. 採用很少、但逐年成長（行 204、210、256–260）
   - 2013 年第一批 2 個 repo；到 2015 年底只有 8 個；新開始用的 repo：2016 年 22、2017 年 88、2018 年 165、2019 年 211、2020 年 >350（行 204、258）。
   - 新增 ADR：2017 年 535、2018 年 995、2019 年 1,345、2020 年 2,248（行 210）。
   - 「Given the number of public GitHub repositories (i.e., over 100 million public repositories), the number of repositories using ADRs is actually very small」（行 256）
2. 多數「試了沒繼續」（行 216、264–265、284）
   - 554 個 repo（>50%）只有 1–5 份 ADR；6–10 份 198；11–20 份 122；21–30 份 27；>30 份 20；最多 73 份（行 216）。
   - 「It is likely that in these repositories capturing ADD using ADRs has been tried out, but has not been adopted systematically over time.」（行 264）
   - 只有 47 個 repo（5%）超過 20 份（行 265）。
   - 同時滿足「≥20 份、≥2 位作者、跨 ≥6 個月」的只有 42 個 repo（行 286）。
3. 寫完多半不再改（行 233、270）
   - 「Most ADR files (3255) are created and only committed initially. After that they are never modified again.」（行 233）；2 次 commit 的 1,497、3 次的 688；最多 58 次。
   - 「Of the 6362 ADR files, about 50% of these ADRs have only been committed once and never modified again.」（行 270）作者解讀為符合 append-only 設計："obsolete decisions are marked with a superseeded status but kept"（行 269，原文拼字如此）。
4. 時間跨度（行 240、272）
   - 278 個 repo 的所有 ADR 都在同一天建立／修改後不再碰；100 個 2–14 天；38 個 15 天到一個月；505 個一個月以上（行 240）。328 個 repo 跨超過六個月（行 272）。
   - 作者另一解釋：可能是在別處寫好後一次 commit 進 GitHub（行 273）。
5. 多人寫（行 222、267）
   - 453 個 repo（約一半）只有一位 ADR 作者；但 ≥10 份 ADR 的 198 個 repo 中只有 33 個（16%）是單人，165 個（84%）多人（行 267）。
6. 模板（行 247、276–279）
   - Nygard 723 個 repo、MADR 129、自訂 61、其他已發表模板合計 8（行 247）；「used in about 75% of all repositories」（行 276）。
   - 可能原因：「this template is used as default template by the ADR Tools」（行 277）。
   - 有 repo 因 MADR 太冗長而自訂模板（行 278）；「complex ADR templates with many sections (e.g., ... Tyree and Akerman) play no role」（行 279）。
7. 相關工作裡的實務報告（行 140–144，二手轉述，引用時要標）
   - Keeling & Runde（IBM Watson Discovery）：兩年 80 多份 ADR、二十幾個 repo；"it took them a few months of training until everybody could write good ADRs"；初期不少 ADR 不是決策而是指引；用 PR 審 ADR；跨服務 ADR 放專門 repo（行 140）。
   - Osl（willhaben）：刻意不放程式碼旁、放企業 wiki 讓非技術人員能讀；模板自訂；ADR 適合結構化討論但 "not a good discussion format"，討論改在 Slack（行 142）。

## 作者限制（行 302–311）

- 只看公開 GitHub；不能推到閉源專案（行 302、311）。
- 放在 GitHub 以外（如 wiki）的 ADR 抓不到（行 308）。
- 已刪除的 ADR 檔搜不到（行 309）。
- 單檔 decision log 被排除（行 195）。

## 與摘要或常見轉述不一致處

- 數字前後不一：結論寫 "over 5000 ADRs"（行 315），結果節寫 6,362 個 ADR 檔（行 270）；結論說 "921 repositories out of 1267 repositories in total"（行 315），但 1,267 在方法節沒出現（方法節是 1,058 位使用者）。引用時用 921 與 6,362，並註明出處節。
- 成長率前後不一：RQ1.2 寫 "yearly growth rates between 28% and 88%"（行 258），RQ1.3 寫 ADR 數 "between 35% and 86%"（行 260）——兩個不同指標，別混用。
- 「一半 ADR 只 commit 一次」作者解讀成「符合 append-only」，不是「沒人維護」。用作反證時要說清楚：資料只顯示「很少改」，無法區分「不需改」與「該改沒改」；作者自己說要看修改內容才能判斷（行 270）。
- 「ADR 採用失敗」：作者沒有調查放棄原因，只說 "It would be a future research challenge to investigate the actual reasons"（行 264），也承認一個專案可能分散在多個 repo、每個只有幾份（行 264）。
- 「75% 用 Nygard」不等於 Nygard 比較好；作者給的替代解釋是工具預設。

## 讀取紀錄

- 試過：OpenAlex 給 OA PDF 網址 ieeexplore.ieee.org/ielx7/.../10155430.pdf → curl 回 HTTP 418（IEEE 擋非瀏覽器）；Tavily extract（advanced）https://ieeexplore.ieee.org/document/10155430 → 成功取得全文 HTML 文字（含 Section I–VII；參考文獻清單沒有抓到）。
- 依序讀行 109–333（Introduction 到 Conclusion）。Table 1、Table 2 與 Figure 3–11 是圖片，只讀到圖說；文中數字都取自正文。
