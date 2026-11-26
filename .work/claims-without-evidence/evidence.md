# 查證與取得紀錄：2026-10-25-claims-without-evidence（認識人體 order 21）

## 來源與讀取程度

見 `.work/research/human-body-basics/extractions/claims-without-evidence.md`。摘要：
- 全文讀過：Nuuttila 2026（PMC12810095）、Hogan 2026（PMC13446920）、Ovali & Us 2023（PMC10727524）、Everyday Health 文章。
- 部分：Meixner 2025（摘要、引言、方法開頭）。
- 只讀摘要／簡介：Sitko 2025、Storoschuk 2025、Wegner 2013 Cochrane、HSS 頁（本身極短）。

## 試過的管道與結果（「找不到」只限於這些）

zone 2：
1. Europe PMC REST 搜尋 `"zone 2" AND (training OR exercise)`：hitCount 3,469；看前 25 筆標題。命中 Storoschuk 2025（無免費全文）、Sun 2025（理論回顧）等；多數與主題無直接關係。
2. 先前掃描（2026-10-22，B-cardio.md）記錄 PubMed "zone 2" free full text 0 筆；本次未重跑。
3. 從 Nuuttila 2026 的參考文獻找到 Sitko 2025、Meixner 2025（同篇引言引用）。
4. Springer 頁（Storoschuk）：只回參考文獻（付費牆）；Europe PMC 標 inEPMC=N。
5. Sitko PDF（fisiologiadelejercicio.com）：web_fetch 回傳未解碼 PDF 二進位，未能讀；改用機構典藏頁與搜尋摘要。
6. PubMed 頁面：回「HHS Vulnerability Disclosure」，無內容。
7. Semantic Scholar `paper_search`：RATE_LIMITED（兩次）。
8. Groundlane `web_search`（Sitko 標題）：只取得摘要片段。
9. 未試：Exa／Tavily／linkup／jina／firecrawl（已有 Europe PMC 全文與摘要可用，且該站 Groundlane 搜尋可用）。降級紀錄：paper_search 失敗。

單槓懸吊：
1. Europe PMC：`("dead hang" OR "passive hang" OR "bar hanging" OR "hanging from a bar") AND (spine OR spinal OR lumbar OR "back pain" OR disc)`：hitCount 52，看前 25 筆標題；一筆是 dead-hang 側彎 X 光（Ovali），一筆是攀岩傷害 editorial（非懸吊研究），其餘無關。
2. Europe PMC：`("dead hang" OR "passive hang" OR "hanging exercise") AND ("low back pain" OR ... OR "disc height" OR "spinal length")`：3 筆（無切題研究）。
3. Europe PMC：標題含 hanging／suspension／traction 且含 lumbar／intervertebral disc 且含 bar／gravity／self：14 筆，看前 10：多為專利與一篇 self-gravitation traction 試驗**計畫書**（PMC9704885，未讀，僅見標題）、Janke 1997 重力牽引生物力學（標題）。
4. 先前掃描（C-posture-pain.md §6）用 hanging、dead hang、inversion、pull-up bar、passive hanging、gravity-assisted、axial decompression、suspension 搭配 back pain／lumbar／spinal：未找到；Tekeoglu 1998、Gianakopoulos 1985（裝置）只確認存在。
5. Groundlane `web_search`：8 筆結果多為健身／衛教網站；實際讀了 HSS（極短、轉述外部報導）、Everyday Health（全文）。兩頁都沒有附研究出處。其餘 6 筆只看標題與片段，沒讀。
6. Cochrane 牽引回顧：Europe PMC core 摘要（fullTextXML 先前 500，未重試）。
7. Semantic Scholar：RATE_LIMITED。

一萬步起源：嘗試 Europe PMC 搜尋 ("10,000 steps" AND origin／history／Tudor-Locke）：前 8 筆皆為無關試驗；**沒有找到起源的同儕審查來源，文章不寫**，只連 order 5。

## 文章裡不在來源逐字內的說法

- 「zone 2 一般指低強度、乳酸閾值以下」：Storoschuk 摘要的定義；Sitko 的共識為「緊貼第一乳酸／通氣閾值下方」。
- 「Nuuttila 的定義比 zone 2 寬」：我比較兩者定義後的解讀。
- 「低強度比對照組有效不能推出比中高強度好」：我的邏輯推論。
- 「懸吊的說法包三件事」：我對說法的拆解，非任何來源的分類。
- 「側彎 X 光顯示懸吊時曲線被拉開」：Ovali 結果（Cobb 角柔軟度）；說「那是側彎患者拍片時的狀態」是我加的限定。
- 「牽引不是懸吊，施力、時間、姿勢不同」：我的解讀；Ovali 作者自己也說懸吊是依體重的軸向牽引。
- 「Cochrane 是專門做系統性回顧的組織」、「回溯性研究」、「統合分析」、「變異係數」的白話：一般定義。
- 「1980 到 1990 年代的幾篇」：Gianakopoulos 1985、Janke 1997、Tekeoglu 1998，僅見標題／中繼資料。
- 兩個網頁的描述（引述專業人士、未附研究出處、很難知道多少來自脊椎、好處可能暫時）：Everyday Health 全文；HSS 頁極短，只是轉述外部報導的一句引言。文章寫「兩頁都引述專業人士」；「其中一頁還說…」指 Everyday Health。

## 刻意不寫的內容

- 任何社群貼文作者、帳號；怎麼查證貼文的方法教學。
- 具體「zone 2 心率範圍」或百分比（Meixner 引言列了典型數字，是引述別人，未採用）。
- Ovali 作者估計「懸吊牽引力約 51% 體重」：是作者引用別處的估計，且為 X 光姿勢，易被誤當處方。
- 是否安全、可不可以做懸吊、做多久（沒有證據；文章只寫請先問專業人員）。
- Nøst 2024（極化訓練，運動員）、Sun 2025、Mølmen 2025、Micheli 2025 等掃描候選：未讀。
- 一萬步與局部減脂：只連結。

## 未解決

- Sitko 2025 全文、Storoschuk 2025 全文未讀；若審稿者能取得，建議核對「共識細節」與「回顧涵蓋的研究」。
- Meixner 結果與討論只憑摘要。
- Cochrane 2013 全文未讀；是否有更新版（2019 之後）沒有查。**這點值得查**：文章寫的是 2013 版。
- 單槓懸吊在 Embase／Scopus／CINAHL／PEDro 等付費或專科資料庫沒查，中文資料庫（華藝等）沒查。
- Nuuttila 摘要「≤60% VO2max」之類條件我沒逐項核對，文章只寫「約 75% 最大心率」一項。

## 已跑的檢查

check-tw-terms（0 blocking）、check-process-leak、check-post-references、check-post-quality、check-lang-parity 全過。未跑 lint／astro check／verify。中文檔 13,841 字元（含 frontmatter 與參考資料），比樣板（約 10,000）長，因為涵蓋兩個說法。

## 審稿後更正（2026-10-25）

- 刪除「PubMed "zone 2" 免費全文 = 0 筆」：審稿者重跑 Europe PMC 得 14,130 筆（多為無關的 zone 2），無法重現，文章與本檔先前第 2 點作廢；先前掃描記錄不再引用。
- Meixner 2025：審稿者讀全文後指出摘要的 "strong alignment" 與表格矛盾（FatMax 平均約 56% VO2peak、VT1 約 69.8%；討論稱兩者為不同強度範圍）。文章改為並列摘要與表格；CV 6–29% 改寫為「以功率最大、以心率最小」。**這幾個數字取自 post-verify 的全文讀取，我沒有自行重讀 Meixner 結果段**；參考資料標記改為「全文」是依審稿者所讀。
- Sitko：句序改為「現況沒有共識 → 小組共識」，並補摘要的「預期適應不一定只在 zone 2」。
- Storoschuk：補「在訓練量較低時」並註明「不是給你的課表」。
- Ovali：加「整體來看（結構性曲線）」並寫分層結果不一（例：<50° 曲線 side-bending 較好）；「準備開刀」改「術前」；「側彎姿勢」改「側彎拍片」。
- Cochrane：補非特異性下背痛、搜尋到 2012 年 8 月、2013 後有未讀的非 Cochrane 回顧。審稿者查 Europe PMC，CD003010 沒有 2013 之後的更新版（Cochrane 網站讀不到，只能說在 Europe PMC 範圍內）。
- 「沒有資料說它有害」改為「我沒找到安全性研究；牽引試驗有回報疼痛增加」；紅旗就醫提醒（夜間痛、腿無力或麻、大小便異常、外傷後、發燒）移到說法二開頭；HSS 標題的「30 秒」註明本篇不採用。
- 刪除搜尋流水帳（筆數、專利、Semantic Scholar、先前掃描）；刪除機械牽引 1980–90 年代標題項；改述 HSS／Everyday Health 的評語，移到參考資料註記，不再點名批評。
- 新增「用總覽的四個問題回頭看」表；中文圈未查的限制提前到開頭；補一句說明為何一萬步與局部減脂放別篇。
- Nuuttila 條目補「至少 3 週」（摘要確認 ≥3 weeks）；動作 2 的預期答案與正文一致；強度界定改為「摘要列出的幾種之一」。「定義比 zone 2 寬」現有作者自己的話佐證（引言稱 zone 2 為 LIT 範圍上緣）。
- Hogan 的「健康成人」：審稿者指出參與者平均 28.1 歲、範圍 13.9–48.5，文章只寫「受試者」，未寫「成人」。
- tags 改 `dead-hang`（取代 `spinal-traction`）。
- 仍未解決：Sitko、Storoschuk、Cochrane 全文未讀；Meixner 數字依審稿者；中文文獻與付費資料庫沒查。
