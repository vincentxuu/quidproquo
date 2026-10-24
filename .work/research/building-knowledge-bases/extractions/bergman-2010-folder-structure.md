# Bergman, Whittaker, Sanderson, Nachmias & Ramamoorthy 2010 — The effect of folder structure on personal file navigation

## 書目

- Bergman, O., Whittaker, S., Sanderson, M., Nachmias, R., & Ramamoorthy, A. (2010). The effect of folder structure on personal file navigation. *Journal of the American Society for Information Science and Technology*, 61(12), 2426–2441. DOI 10.1002/asi.21415（卷期頁碼由 Crossref 確認）
- 實際讀的版本：作者 preprint（"This is a preprint of an article accepted for publication in JASIST copyright © 2010"），來源 https://www.tau.ac.il/education/muse/publications/101.pdf ，41 頁。頁碼為 preprint 頁碼，非期刊頁碼；未比對正式版是否有修訂。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/bergman2010-folder.txt`（2,054 行，82,713 bytes）

## 研究設計

- 自然情境觀察：研究者到受試者（多為 Sheffield 大學學生與職員，晚上敲宿舍門招募，非隨機）面前，印出其 Windows／Mac 的 Recent Documents 清單，請受試者依序從桌面開始導覽到每個檔案（點一下不開啟），高畫質攝影機錄螢幕、逐格（25 fps，每格 0.04 秒）計時。
- 受試者 296 人（163 男 133 女，16–64 歲，M = 26.44）；246 Windows、43 Mac、7 Linux。
- 有效取回 1,131 次（原 1,158 次排除 2%），導覽步驟 5,035 步。
- 只研究導覽，不比較搜尋；只看「最近用過的活躍檔案」，不看整個檔案庫。
- 量了什麼：目標檔深度、每步資料夾大小（檔案＋子資料夾）、子資料夾比例、取回時間、步數、每步時長、成功／失敗；最後做回歸預測取回時間。

## 可引用結果

1. 結構淺、資料夾小（摘要；Results 1.1–1.3）
   - 目標檔平均深度 2.86（SD 1.85），中位數 3；82% 在深度 4 以內（p.12）。11% 透過桌面資料夾捷徑、7% 直接放桌面。
   - 只有 12%（136 次）取自系統預設位置（如 My Documents 本層）；這些預設資料夾平均僅 19.42 個檔案 → 88% 取自使用者自建資料夾（p.13、p.25）。
   - 每個資料夾平均 22.46 項（SD 32.30），中位數 15；子資料夾 10.64、檔案 11.82；子資料夾約佔 54%（p.14）。
   - 原句（摘要）："Folder structures were found to be shallow (files were retrieved from mean depth of 2.86 folders), with small folders (a mean of 11.82 files per folder) containing many subfolders (M = 10.64)."
2. 「目標資料夾」與「走廊資料夾」（Results 1.5、Figure 4；Discussion p.26–27）
   - 目標資料夾子資料夾僅 13%（87% 是檔案）；途經的導覽資料夾子資料夾 65%（t(2,641) = 37.52）。上層與下層的檔案／子資料夾比例其實都約一半一半，推翻「上層只放資料夾、下層只放檔案」的直覺。
   - 原句："some are used mostly as file repositories, while others are 'corridors' to navigate to these repositories."
3. 導覽成功率高、快（Results 2.1–2.2、Table 1）
   - 94% 找到（1,062/1,131），平均 14.76 秒（SD 12.16）；平均 4.44 步、每步 3.27 秒。
   - 直接成功 79%（893 次，12.29 秒）、繞路後成功 15%（169 次，27.82 秒）、失敗 6%（69 次，45.05 秒）。失敗中 24 次是受試者事先就說不記得、沒嘗試。
   - 原句（摘要）："Navigation was largely successful and efficient with participants successfully accessing 94% of their files and taking 14.76 seconds to do this on average."
4. 深度與大小的時間成本（Results 3.1–3.4、Table 2、Table 3；Discussion p.30）
   - 深度與取回時間 r(1,054) = 0.29；桌面檔平均 5.6 秒 → 8–11 層 25.22 秒（Table 3：深度 0 為 5.6、1 為 11.65、2 為 15.78、3 為 16.87、4 為 16.2、5 為 16.78、6 為 18.92、7 為 24.76、8–11 為 25.22 秒）。
   - 資料夾大小與每步時長 r(3,971) = 0.24（直接成功者 r = 0.31）。
   - 失敗與繞路取回的資料夾較大（直接成功 22.72 項 vs 繞路 28.38、失敗 27.45）；深度對成功率的影響只是接近顯著（2.81 vs 3.10, p = 0.07）。
   - 回歸（R² = 0.22）：取回時間 = 4.956 + 2.236 × 深度 + 0.106 × 資料夾大小。
   - 原句（p.30）："each additional folder step increases retrieval time by 2.236 seconds and each new information item in a folder increases retrieval time by 0.106 seconds. Therefore, the trade-off between depth and size is 2.236 / 0.106 = 21.09. Each step down the hierarchy equals about 21 information items in terms of its effect on retrieval time."
   - 作者據此提出「up to 21」經驗法則：一個資料夾超過約 21 項就再開一層子資料夾。
5. 對「搜尋會取代資料夾」的立場（Discussion p.28）
   - 原句："to date, there is no evidence that any of them is better than the existing hierarchical method. Our current results suggest that navigation is effective for active documents, providing an explanation for why users have not embraced search." 以及 "Stating that the hierarchical method is passé is simply not enough."
6. 設計建議（Conclusions p.33）：資料夾變大的主因之一是留著不重要的檔；建議「降級」（demotion，GrayArea：把低重要性的檔拖到資料夾底部灰區）而非刪除或封存。

## 作者列的限制

- Research Limitations（p.11）：只研究結構、不研究語意；每人語意組織高度個人化，難以跨人比較。
- 只看 Recent Documents 中的活躍檔案，受試者可能本來就熟悉其位置（p.27）；舊檔、非活躍檔的記憶衰退未研究（p.34）。
- 未驗證是否適用 email、書籤（p.34）；集合大小對組織的影響未研究。
- 與 2008 的比較是自評 vs 觀察，作者提醒自評受記憶偏誤影響（p.28）。

## 與摘要或常見轉述不一致處

- 平均取回時間：摘要與 2.1 節寫 14.76 秒（僅成功者），Table 1 的 Total 列為 16.61 秒（含失敗）。引用時要說明是「成功取回平均 14.76 秒」。
- 「up to 21」是作者從回歸係數比值推出的「建議值」（heuristic），不是實驗操弄出的最佳點；回歸 R² 只有 0.22。轉述成「研究證明每個資料夾最多放 21 個檔案」是過度推論。另外 21 指「資訊項目」（檔案＋子資料夾），不是只算檔案。
- p.30 寫「67.3% of the files contained up to 21 items」，依上下文應是 folders，原文用字有誤。
- p.30 說回歸模型在「question 3.5」，但研究問題只到 3.4，為原文筆誤。
- 常見轉述「深度越深越慢」：Table 3 顯示深度 2–6 的時間幾乎持平（15.78–18.92 秒），作者說 4、5 層的平坦是觀察誤差，主要差距在桌面（5.6 秒）與 1 層，以及 7 層以上。
- 本文說「much smaller than previous studies' 8.45 depth」是拿活躍檔對比整個檔案庫（Gonçalves & Jorge 2003 為 11 位電腦科學家），兩者量的對象不同，作者自己也指出。
- 本文轉述 2008 研究為「search engine for 4-13% of the retrievals」，與 2008 原文 4–15% 不一致。
- 樣本以英國大學生為主（平均 26 歲），Windows XP/Vista 時代；無雲端、無手機。

## 讀取紀錄

- curl -L 下載 tau.ac.il/education/muse/publications/101.pdf 成功（PDF 1.5，346,237 bytes），pdftotext -layout。
- 依序讀完：40–739（作者至 Results 1.4）、739–1438（Figure 2 至 Discussion 3）、1438–2054（Discussion 結構效應至附錄 Table 4 末）。第 1–40 行為標題與作者資訊（head 已讀）。
