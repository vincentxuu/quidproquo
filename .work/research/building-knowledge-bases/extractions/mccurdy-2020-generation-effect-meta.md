# McCurdy, Viechtbauer, Sklenar, Frankenstein & Leshikar 2020 — Theories of the generation effect and the impact of generation constraint: A meta-analytic review

read_status=read（全文，出版社版本 Version of record，含 Table 1–3、附錄、參考文獻）

## 書目

- McCurdy, M. P., Viechtbauer, W., Sklenar, A. M., Frankenstein, A. N., & Leshikar, E. D. (2020). Theories of the generation effect and the impact of generation constraint: A meta-analytic review. *Psychonomic Bulletin & Review*, 27(6), 1139–1165. DOI 10.3758/s13423-020-01762-3。線上發表 2020-07-15。
- 類型：THEORETICAL REVIEW（統合分析＋理論檢驗）。資料與程式碼 https://osf.io/9pv7a/；「This article was not preregistered.」
- 讀的檔案：Maastricht University 典藏庫的出版社 PDF（Taverne 授權）`https://cris.maastrichtuniversity.nl/ws/portalfiles/portal/280959138/2020-McCurdy-theries_of_the_generation_effect.pdf`。
  - `curl -L -A "Mozilla/5.0"`（兩種 UA）→ HTTP 500，6,344 bytes HTML 錯誤頁。
  - Springer `link.springer.com/content/pdf/10.3758/s13423-020-01762-3.pdf` → HTTP 200 但只有 3,038 bytes HTML（付費牆／cookie 頁）。
  - OSF 預印本 `osf.io/h5vw4/download` → 200，280,139 bytes，是 .docx 預印本（未使用，因為有出版版本）。
  - Exa `web_fetch_exa`（maxCharacters 300000）抓同一個 Maastricht PDF → 成功，141,178 字元、575 行。存為 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/mccurdy.txt`（574 行，141,982 bytes）。PDF 抽字，雙欄順序在 3a/3b 段落有錯置、表格有部分合併成單行，已依語意還原；沒有頁碼，以下用小節名定位。

## 設計

- 檢索：PsycINFO、PsycArticles，2017-02-19；加上 Bertsch 2007 的前後引用（+35 篇）與 Google Scholar 作者搜尋（+6 篇），共 1,484 篇 → 標題摘要篩 262 篇 → 全文篩後 126 篇（1978–2019）。篩選者間 κ = .67。
- 納入：至少一個生成條件與一個閱讀對照；recognition／cued recall／free recall 的 item 或 context 記憶；非臨床成人樣本。
- 排除中值得注意的一條：「(e) atypical methodology or stimuli (e.g., physically generating actions, drawing images; k = 22 articles excluded)」，全文階段又以同理由排除 80 篇。也就是動手畫、做動作類的生成被排除。
- 規模：126 articles、310 experiments、579 samples、1,653 個平均比例（804 讀、849 生成），item 記憶 1,284 列、context 記憶 349 列。
- 模型：arm-based 多層混合效應模型（article／experiment／sample／observation 隨機效應＋pairing 交叉隨機效應），文章層級 cluster-robust 推論；R metafor。效應量是**生成減讀的正確比例差（Mdiff）**，不是標準化 d。
- 74% 的條件沒報告變異，用 meta-regression 依平均比例插補（R² = .61）；12.3% 的平均值是從圖用 WebPlotDigitizer 讀出。
- 出版偏誤：Peters' test（以 1/n 為精確度），並外推到無限樣本。
- 編碼了 18 個調節變項。生成約束（generation constraint）三級：low＝只給線索字、無規則（open–____）；medium＝規則＋線索字（「生成反義詞」open–____）；high＝規則＋線索字＋部分字母（open–cl___）。此變項兩位編碼者 κ = .59、加權 κ = .51（moderate）。

## 可引用結果

1. **整體生成效應**：Mdiff = .102（95% CI [.087, .117]），t(124) = 13.85, p < .001；讀 .478 vs 生成 .581（Table 1 Model 1）。Discussion：「Across all studies, including both item and context memory measures, we found that self-generation provided roughly a 10 percentage point increase in memory performance relative to reading.」
2. **出版偏誤校正後仍在**：樣本越大效應越小（n=8：.142；n=24：.101；n=120：.084），外推到無限樣本 .080（[.048, .111]），t(122) = 5.00, p < .001；交互作用 p = .07。「we would cautiously suggest that its possible presence is unlikely to be a major factor in the present data.」
3. **努力（難度）不是原因**：只納入有操弄難度的研究（k = 27），低難度 Mdiff = .177、高難度 .171，交互 F(1, 23) = 0.04, p = .839。「These findings do not support the predictions of the mental effort theory.」
4. **受試者間設計效應減半但仍顯著**：within .144 vs between .073，交互 F(1, 119) = 34.27, p < .001。mixed list .144 vs pure list .103。→ 不支持 selective displaced rehearsal（該理論預測 between／pure 無效應）。
5. **無意義材料無效應**：words .133、numbers .208、**nonwords .004（[−.045, .053]，p = .770）**。「meaningful information (words and numbers) may be a necessary condition to obtain a generation effect.」
6. **測驗類型**：recognition .144、cued recall .132、free recall .095（交互 F(2, 116) = 5.34, p = .006）；三種都顯著 → 支持 multifactor theory（item-specific＋relational processing）。作者推論：「it may be that intertarget relational processing experiences a smaller boost from generation compared with item-specific and cue–target relational processing.」
7. **情境記憶效應很小**：context memory Mdiff = .032（[.001, .063]），item .123。**概念性情境**（來源、位置）.080，**知覺性情境**（字色、字型）−.053（讀較好），交互 F(1, 34) = 49.71 → 支持 processing account。
8. **生成約束越少，效應越大**：生成條件的估計正確率 low .642、medium .586、high .528（F(2, 121) = 4.89, p = .009）。分測驗：recognition 不受約束影響（F = 0.42, p = .659）；cued recall（low .717 vs medium .642 vs high .567）與 free recall（low .484 vs medium .354 vs high .295, F = 9.40, p < .001）受影響。作者推論機制是 relational processing：「fewer generation constraints increase the magnitude of the generation effect through enhanced relational processing」。
9. **延遲**：>1 day 的效應比 immediate 與 5 min–1 day 大（約多 7 個百分點，ts > 2.35, ps < .020）。Table 2：immediate 讀 .479／生成 .579；short 讀 .487／生成 .580；long 讀 .444／生成 .608。作者解讀：「generation may act to slow the decay of memory relative to reading」——生成組隨時間穩定，讀組下降。
10. **incidental > intentional**：主因是讀組在有意學習時表現較好（.489 vs .458），生成組兩者幾乎相同（.583 vs .582）。「some of the strongest benefits of self-generation may arise when generation occurs naturally (or without intent to remember)」。
11. **生成方式**：以口說為基準，**寫／打字的生成效應顯著較小**（t(120) = −2.06, p = .041），默想略小（p = .085）。Table 2：口說 .463→.586、默想 .517→.589、寫/打字 .481→.572。
12. **刺激數量**：≤25 項效應大於 26–50 與 >50；26–50 大於 >50（t(120) = 2.15, p = .03）。>50 項：讀 .523／生成 .579。
13. **自訂步調 > 計時呈現**（t(121) = 3.30, p = .001）。年齡、分心、填充作業不顯著。
14. **字謎在此為正效應**：anagram 讀 .471／生成 .584，t(109) = 8.83，與 word stem 相當；letter transposition 較小（.507→.540, p = .072）。
15. 教育應用（Discussion）：作者引 Metcalfe & Kornell 2007、Potts & Shanks 2014，說生成在學新資訊時有益，「particularly when feedback is given to correct errors」。這是作者引其他研究，不是本統合分析的資料。

## 作者列的限制

- 統合分析的宏觀檢驗可能漏掉細節，例如 associative strengthening 整體受支持，但細分後只有概念性情境受益（Limitations）。
- 各理論模型沒有同時控制其他調節變項（「our model does not account for the simultaneous influence of other moderators」）。
- 缺乏與記憶測驗獨立的編碼歷程測量（item-specific／relational 是從測驗類型反推）。
- 努力只能用作者自訂的難度操弄代理，沒有獨立的努力測量；不宜完全排除 mental effort。
- context memory 研究比 item memory 少。
- 未預註冊；74% 變異為插補。
- 生成約束編碼一致性只有 moderate（κ = .59）。

## 與 Bertsch 2007 比對（Bertsch 結論是否仍成立）

- **整體效應仍成立**：Bertsch d = .40（約 9 個百分點，讀 .471 → 生成 .559）；McCurdy 約 10 個百分點，出版偏誤校正後 8 個百分點仍顯著。兩者單位不同（d vs 比例差），但方向與量級一致。
- **仍成立的調節**：受試者間設計較小、無意義刺激（非詞）≈ 0、numbers 最大、incidental > intentional、刺激越多越小、延遲 >1 天較大、努力/難度不解釋效應。
- **不一致**：
  - 字謎：Bertsch d = −.05（負效應）；McCurdy 為顯著正效應（約 11 個百分點），與 word stem 相當。
  - 測驗類型排序：Bertsch（分組算法）cued .55 > recognition .46 > free .32；McCurdy recognition .144 ≥ cued .132 > free .095。兩者都是 free recall 最小。
  - 列表呈現：Bertsch random .55 > blocked .32；McCurdy mixed .144 > pure .103，方向一致。
- **新增的條件**（Bertsch 沒有）：情境記憶效應小（.032），知覺細節反而讀較好；生成約束少效應大（只在回憶測驗）；寫/打字生成比口說小。

## 與摘要或常見轉述不一致處

- 摘要只說「generation constraint significantly moderates」，沒說**只在回憶測驗上**有差，recognition 完全不受影響（p = .659）。
- 常被轉述為「自己寫下來記得更牢」：本研究中**寫/打字的生成效應比口說小**，且被排除的「atypical」研究包括畫圖與動作生成；材料仍以詞對為主。不能直接推到寫筆記、改寫段落或建立筆記間連結。
- 「延遲越長效果越大」：作者的解釋是讀組遺忘較多、生成組相對穩定，不是生成組變得更好（long 生成 .608 vs immediate .579 只是略高）。long 組只有 40–43 個比較。
- 「lower constraint」看似支持「自由發揮式的筆記」，但這裡的 low constraint 仍是「給線索字、不給規則，請受試者寫一個字」，不是開放式寫作。
- 摘要說「support some theoretical accounts, but not others」，沒說明支持的是 multifactor、semantic activation、associative strengthening、processing account 四個；不支持 mental effort、selective displaced rehearsal、item–context trade-off（強版本）。

## 對 order 3 的意義

- 「自己產生比讀現成的記得好」在 2020 年最大統合分析中仍成立，量級約 10 個百分點，校正出版偏誤後仍在。
- 與「連結」直接相關的一點：作者推論低約束生成透過**關聯處理（relational processing）**提升回憶，而 free recall（仰賴項目間關聯）的生成效應最小——「一般生成任務不太促進跨項目的關係處理」（Discussion 引 deWinstanley & Bjork 1997 等）。這暗示：單純「自己寫一則筆記」不自動產生跨筆記的關聯；要有關聯效果，任務本身得要求處理項目間關係。這是作者推論，不是直接實驗。
- 邊界：材料無意義時無效應；長清單時效應縮小；這些是詞表實驗，外推到筆記系統要標明。

## 讀取紀錄

- 1–63 行：典藏頁資訊、標題、作者、摘要。
- 65–83 行：引言、三個目標、生成約束定義。
- 85–110 行：七個理論（mental effort、selective displaced rehearsal、semantic activation、multifactor；associative strengthening、item–context trade-off、processing account）及各自的檢驗預測。
- 111–163 行：Present study、Method（檢索、PRISMA、排除數字、18 個調節變項、編碼一致性、統計模型、變異插補、出版偏誤方法）。
- 165–191 行：Results 開頭、publication bias、Model 1、Model 2、Model 3a。
- 193–299 行：Table 1（Models 1–9b）。
- 301–435 行：Table 2（10 個實驗設計調節變項）。
- 437–467 行：Model 3b–9b 正文、實驗設計調節變項正文。
- 469–499 行：Discussion（item 理論、context 理論、生成約束、實驗調節變項、限制與未來方向）。
- 501–511 行：Beyond the generation effect、Conclusion、Open practices。
- 513–543 行：Appendix 與 Table 3（資料結構範例）。
- 545–575 行：參考文獻（逐段掃過）。
