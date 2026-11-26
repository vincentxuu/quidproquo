# Bergman, Beyth-Marom, Nachmias, Gradovitch & Whittaker 2008 — Improved search engines and navigation preference in PIM

## 書目

- Bergman, O., Beyth-Marom, R., Nachmias, R., Gradovitch, N., & Whittaker, S. (2008). Improved search engines and navigation preference in personal information management. *ACM Transactions on Information Systems*, 26(4), Article 20, 24 pages. DOI 10.1145/1402256.1402259
- 實際讀的版本：ACM DL 出版社 PDF（ACM 頁面標 "Free access"），24 頁全文。Received June 2007; revised Feb/June 2008; accepted June 2008。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/bergman-2008-tois.txt`（1,245 行，84,588 bytes）

## 研究設計

- 三個研究共用同一份問卷（自評各取回方式佔比，總和須 100%：navigation / desktop shortcut / search / recent documents / others；Mac 版多一項 Smart Folders）。
  - Preliminary study：78 位以色列 Windows XP 使用者，舊搜尋 WSC（Windows Search Companion），單次問卷。年齡 21–57（M = 30.44）。
  - Windows Study：47 位以色列 Windows XP 使用者，受試者內縱貫設計。先填 WSC 版問卷 → 安裝 Google Desktop（GD）用 3 週 → 再填 → 7 個月後追蹤（N = 43，題目縮短）。
  - Mac Study：589 位美英澳 Mac 使用者團體成員，網路問卷，受試者間設計：Spotlight（OS X 10.4）519 人 vs. Sherlock（OS 10.0–10.3）70 人。Spotlight 組平均 58.39 歲。
- 量了什麼：自評搜尋％、導覽％；「不知道檔案確切位置」的取回事件％；搜尋事件中知道／不知道位置的比例；改用新搜尋後是否改變整理習慣（開放題）；背景變項（年齡、使用年資、自評經驗、每日時數）。
- 估計效度（§4.4）：16 位 GD 使用者印 Recent Documents（每人 15 檔，共 240 檔，排除後）逐檔回想怎麼取回：實際搜尋％ 11%（SD 26%）vs 自評 15.5%（SD 25%），r = 0.94；另以 11 位 Linux 使用者的指令列紀錄（190 次檔案取回）驗證：實際 15% vs 自評 20%。

## 可引用結果

1. 導覽偏好（§5.1、Table III、Table IV）
   - 數字：六個研究條件，自評導覽 56–68%，搜尋 4–15%（WSC 4–7%；GD、Sherlock、Spotlight 11–15%）。六組 paired t 全部 p < 0.01。
   - Table III 各組（搜尋／導覽／捷徑／最近文件）：Prel. WSC 4/64/19/12；Windows WSC 7/68/19/6；Windows GD 15/63/17/5；GD 追蹤 10/63.5/20/5.5；Sherlock 15/58/18/6；Spotlight 13/56/16/11（Smart Folders 各 1%）。
   - 原句（§5.1）："Most retrieval is done using navigation (ranging from 56 to 68% of the retrieval events). Mean estimated search percentages were much lower: 4–7% for WSC users and 11–15% for GD, Sherlock and Spotlight users."
2. 更好的搜尋引擎效果有限且不一致（§5.2）
   - Windows：裝 GD 3 週後搜尋 7% → 15.5%（t(46) = 2.76, p < 0.01）；7 個月後回落到 10%，與基線無顯著差異（t(42) = 0.81）。43 人中 16 人（37%）已移除 GD；留下的 27 人為 14.5%，仍顯著高於基線（t(26) = 2.13, p < 0.05）。移除原因：7 人「用不到」、4 人「拖慢電腦」、3 人「不小心」移除、1 技術問題、1 換別的搜尋。
   - Mac：Spotlight 13% 反而低於 Sherlock 15%，不顯著（t(587) = 0.95）。
   - 原句："Contrary to expectations, the results show that the average search percentage of the improved search engine (13%) was lower than that of the old search engine users (15%), although this difference was not statistically significant"
   - 作者自己的另一種解讀（§6.1）：差異可能來自搜尋入口的可見度與可及性，而非搜尋品質——WSC 藏在開始選單、至少 5 步才能下查詢，其他引擎入口可見，約 13–15%。
3. 搜尋是「最後手段」（§5.3、Table V、§6.1）
   - 不記得確切位置的取回事件：10–26%（WSC 10%、GD 15%、Sherlock 24%、Spotlight 26%），新舊引擎無差。
   - 開放題自發回答「不記得位置才搜尋」：73–82% 的受試者。
   - 搜尋事件中「位置未知」佔 83–98%；換算成全部取回中「明知位置還搜尋」只有 0–4%。
   - 原句（§6.1）："the percentage of files for which the users don't remember the exact location can be regarded as an approximate upper limit to search percentage growth. This estimate, of about 25%, was not affected by the use of improved search engines"
   - 註 7：Mac 組在位置未知時，也只有 35%（Spotlight）與 42%（Sherlock）用搜尋——不記得位置時多數仍不搜尋。
4. 更好的搜尋沒讓人少整理（§5.4、§6.1）
   - Windows 追蹤 43 人：無人因 GD 改變整理方式。
   - Mac 481 位 Spotlight 回答者：80%（386）沒改；改了的 95 人中只有 12 人（佔全部 2.5%）變得較不整理或用更少更籠統的資料夾，另有 12 人反而更整理、更深層。
   - 原句（§6.1）："Only 12 of 481 Spotlight users reported that an improved search engine resulted in their being less organized or using fewer, more general, folders. Indeed, another 12 participants reported they became more organized or used deeper hierarchies with more subfolders"
5. 背景變項幾乎無關（§5.1、§5.3）：24 個相關只有 1 個顯著（Spotlight 組年齡與搜尋％ r = −0.12）；不記得位置％與 20 個背景相關全不顯著。
6. 理論解釋（§6.2，作者推論、非本研究檢驗）：一致性（"The hierarchical method is boringly consistent"）、再認優於回憶、程序性 vs 陳述性記憶、認知自動化（導覽時可以繼續想手上的工作）、位置隱喻。PIM 與網路搜尋的根本差別："In PIM, the same user both organizes and retrieves the information."
7. 結論比喻（§7）："If search engines are the PIM 'fire escapes,' then, in case of emergency, you want to have the best one available."

## 作者列的限制

- 全文以自評估計為主（作者用兩個小樣本驗證效度，§4.4）；作者承認「未來更進步的搜尋可能改變結果」，但主張舉證責任在提出者（§6.2）。
- 「可見度而非品質」是事後解釋，作者標明是 "A possible interpretation"。
- Smart Folders（混合法）使用率低，作者說 "further tests should be conducted before any conclusions can be drawn"。

## 與摘要或常見轉述不一致處

- 摘要寫「searched for only 4–15%」；內文 Windows GD 組平均寫 M = 15.5%（§5.2），Table III 印 15%。若照內文應是 4–15.5%。
- Bergman et al. 2010（JASIST）轉述本文時寫「they used a search engine for 4-13% of the retrievals」，與本文的 4–15% 不同。
- 「導覽 56–68%」不是「導覽以外都是搜尋」：桌面捷徑 16–20%、最近文件 5–12% 另計。常見轉述「九成以上靠導覽」會把捷徑與最近文件誤算進導覽；照本文定義，導覽只有五到七成。
- 「更好的搜尋沒用」要分開講：Windows 組 3 週內搜尋確實翻倍（7%→15.5%，顯著），是 7 個月後才回落；持續使用 GD 的 27 人仍顯著較高。說「完全沒影響」過度簡化。
- Table V 最後一欄 Spotlight 列 N 印為 70，與同列其他欄 N = 519 不一致，疑為排版錯誤。
- 證據全部來自 2005–2007 年桌面搜尋（WSC/GD/Sherlock/Spotlight），樣本無雲端硬碟、手機與 LLM 搜尋。

## 讀取紀錄

- curl ACM PDF → 403（Cloudflare 挑戰頁）；Unpaywall／OpenAlex／Semantic Scholar：closed、無 OA 副本；Exa fetch epdf 只回第一頁；firecrawl：點數用完；Tavily extract：空結果；Groundlane web_fetch：browser-challenge 失敗；jina：402 餘額不足；linkup：連線失敗；Cloudflare get_url_markdown：只拿到 "Just a moment..."；ResearchGate、UCSC 猜測網址 403。
- 成功管道：Playwright 開 ACM 文章頁通過挑戰後，在頁內 fetch `/doi/pdf/...` 取得 PDF（200, application/pdf, 151,461 bytes, 24 頁），pdftotext -layout 轉檔。
- 依序讀完：1–650（摘要至 Table IV）、650–1246（§5.2 至參考文獻末）。
