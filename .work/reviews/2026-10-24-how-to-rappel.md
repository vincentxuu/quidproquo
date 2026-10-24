# Review: 2026-10-24-how-to-rappel（中英共用）

日期：2026-10-24。文章：`src/content/posts/climbing/2026-10-24-how-to-rappel.md`、`-en.md`。系列〈運動攀登與傳統攀登〉order 8（使用者 2026-10-24 選定插入，原 8–15 順移為 9–16）。研究筆記：`.work/rappel-how-to/`（sources-professional.md 37 個專業來源、sources-accidents.md、video-centa.md）。

## post-verify

獨立查核 agent 逐條重開一手來源，約 70 條宣告，完整報告 `.work/rappel-how-to/post-verify.md`。Centa 時間點對照逐字稿、HowNOT2 三支影片起點對照章節與字幕皆符；16 條站內連結都指向已發佈文章；中英一致。

- 🟢 已確認（節錄）：Rock and Ice 251／76 件；全部事故致死約兩成（作者 GitHub 資料重算，正文寫「按作者公開的同一份資料計算」）；Stanley Headwall 原因是垂降器只扣一股、對接結非原因；Tahquitz 2022 兩死；SAC 一律要有自己的備份；YOSAR 5–10 ft；HowNOT2 flat figure-8 不到 1 kN、褪色扁帶約 3 kN；AAC 2025 止滑結 6 kN 拉過 ATC；AAC 與 DAV 對 Dyneema 的不同理由；Petzl 單繩加拉繩；bergundsteigen 2025 反對意見；Centa 自述 AEGM 攀岩嚮導。
- 🔴→已修 1：Edelrid「急停是平順下降的近三倍」→ 原文比較對象是體重：急停峰值約 2.6 kN、約體重三倍。
- 🔴→已修 2：「HowNOT2 賣片中測試的繩材」放錯影片 → 扁帶片改成「也經營器材商店，片尾有導購」；賣繩的說明移到對接結影片。
- 🔴→已修 3：「四家來源三個共同要求」→ 共同的只有四股拉緊、尾巴 30 cm；結型整理改標為 Edelrid 的提醒。
- 🔴→已修 4：BRAKES 的 K 是系統裡所有的結（含繩尾結）；Godino 版本補上 B 是垂降器。
- 🔴→已修 5：The Mountaineers 列的好處沒有「頭髮」「互相檢查」→ 刪去。
- 🔴→已修 6：練習題 2「看一眼沒發現」不是 DAV 原意 → 改成「兩起都是解開自我確保後系統才第一次受力」。
- 🔴→已修 7：bergundsteigen 約 20 m 訓練事故與 ÖAV 做法出自 2008 年〈Kurzprusik a.D.〉→ 正文標年份並列入參考資料。
- 🔴→已修 8：「DAV 也把自我確保扣在要拉的那股」出自 DAV Panorama 5/2020 第二篇 → 改連該篇並列入參考資料。
- 🔴→已修 9：「固定點失效最容易一次帶走好幾個人」無來源做此比較 → 改成兩個案例：Tahquitz 2022 兩死、North Early Winter Spire 2025 單根岩釘拔出三死（我自己打開 AAC 13201217683 確認：四人共用單根岩釘，三人死亡）。
- 🔴→已修 10：Petzl 解鎖警告只針對 GRIGRI 與 NEOX → 改寫，並補 Petzl 允許下方用手拉繩、不可吊在繩上。
- 🔵→已修：catastrophe knot 一詞在 13:27 才出現 → 改成「12:30 起示範，後面稱它為 catastrophe knot」。

## post-review

- 機械檢查：`pnpm lint` 0／0；`check:references` 本篇無警告；`check:tw` 0 blocking 0 review；`check-process-leak` 通過；`check:links` 43 條外部連結 0 壞，1 條 403 需人工（mountaineers.org，擋機器人，研究時已用 jina 讀過全文）；`pnpm verify` 只剩 check:series-plan 缺本審稿紀錄（本檔補上後重跑）。
- 圖解：泳道圖中英兩版 `diagram-preview` 全 ✓，淺色、深色、手機截圖已看過；手機在圖框內水平捲動，整頁不橫向捲動。
- frontmatter：tags 5 個皆既有高頻 tag；type guide；tldr 有具體失誤類型與對策順序，與 description 不重複；glossary 4 條為本篇特有詞（延伸垂降、負重測試、疊式垂降、消防員確保），terms.ts 無重複。
- 範圍卡（order 8）逐項對照：到站扣自我確保、固定點檢查含 TOCC ✅；穿繩與對接、分歧表 ✅；繩尾結與背繩 ✅；先摩擦套結再延伸、位置分歧表 ✅；負重測試＋BRAKES＋疊式垂降 ✅；到下一站與消防員確保 SAC vs AAC ✅；拉繩與卡繩 ✅；Centa 時間點與 HowNOT2 2024+ 影片 ✅；不講要不要垂降（連 order 7）、救援只轉手連 order 13 ✅。
- 已修：數據與歸因句缺 inline 連結（Edelrid 急停受力、AAC 2025 止滑結 6 kN、DAV 兩起事故、bergundsteigen Kurzprusik 訓練事故、DAV 硬輔助繩、BMC 摩擦套結非萬無一失、AAC 2012 出繩尾、Margeson、BMC 試拉、Godino 解止滑結、ÖAV 轉述）→ 全部補上；bergundsteigen 2/08〈Kurzprusik a.D.〉原本沒列，補進正文與參考資料。
- 已修：台灣讀者位置——開頭補「台灣的多繩距課程都包含多段垂降」並連〈多繩距入門〉的課程列表；固定點一節已有 TOCC 龍洞材質提醒。
- 主題歸屬：自我救援只寫「不要 prusik 單股」與轉手連結，沒有展開操作；確保器選擇轉手連〈確保器〉。
- 練習題 4 題、`<details>`、nobodyclimb sport-rappel 連結 ✅；每節有「今晚就能做的動作」✅。
- 系列回填：overview 中英（mermaid、篇目表、等級問答、第 N 篇編號）、〈下放還是垂降〉「下一步」、〈多繩距入門〉多段垂降一節、〈學習路徑〉表內第 12→13 篇，皆加更新紀錄；8 篇 order +1；規劃表加 order 8 列與範圍卡。

## post-polish

- register-scan 第一輪：長句 8 句 → 斷句後剩 2 句（皆因句中含長 URL 被算進字數，讀起來不長，保留）；但書 4%；引述 0；模板化轉折 0；姓名當主詞 1 段（Centa 在各步驟是示範者，屬合理）；數字密度 6 段，多為影片時間點與器材規格，每個主張仍只帶一個數字。
- phrase ledger：模板化轉折 0、台灣高風險用詞 0。
- 用語：「這十年變最多」無來源 → 改「各家做法差最多」；台灣口令句原寫「我們沒找到 TOCC 或協會的正式版本」屬查證過程 → 改成「口令各家不同，開爬前跟夥伴講好」；「研究近年 AAC 事故報告時也沒找到…」屬查證過程且是反面宣稱 → 刪除，只留 AAC 對 Stanley Headwall 的結論。
- 器材用語照台灣岩友口語：autoblock、prusik、GRIGRI、ATC 保留英文；flat overhand 首次出現附中文說明。

---

# 2026-10-24 更新：七種垂降方式（post-update）

使用者要求：三種垂降方式「都要附影片分開好好說明清楚」，再追加「其他常見垂降方式都要加、都要附影片跟相關資料」。研究筆記：`.work/rappel-how-to/videos-{single,double,grigri}.md`、`method-{tagline,munter,fixed,rescue}.md`。

## post-verify（更新段落）

獨立查核 agent 重開一手來源與字幕，完整報告 `.work/rappel-how-to/post-verify-methods.md`。68 條新外部連結 66 條 200、1 條 403（mountaineers.org 擋機器人，可讀）、1 條死鏈已換。中英數字、時間點、年份一致。

- 🔴→已修：方式一「先解開要拉那一端的止滑結」邏輯相反 → 改為解開**不拉**的那端（會往上穿過鍊環的那端）；Mike Vert 19:46 改為第二人離繩之後才開始。
- 🔴→已修：Beal Back Up Line 是 5.5 mm、器材是 AIRFORCE 3、5 mm 是 Machard。
- 🔴→已修：Smile Mountain Guides 不在 AMGA 認證公司名單 → 改「開設 AMGA SPI 課程、嚮導持 AMGA 認證」。
- 🔴→已修：Dale Remsberg 現非 AMGA 技術總監 → 改「AMGA 講師團」；AAI 片中「不要做」是講者本人意見，改寫歸屬。
- 🔴→已修：Red River Gorge autoblock 有作用但部分鬆脫。
- 🔴→已修：Petzl 短片嵌在單繩多繩距技術頁，不是 GRIGRI 頁；解開自我確保約 1:02、1:08 出發。
- 🟡→已修：Palisades 不是裝錯股 → 標題改「裝錯股，或那一股根本沒擋住」，並標明只有 Red Rock 致死；Auburn 改為目擊者推測；REVERSO 現行說明書只寫備份裝置或摩擦套結（不再點名 SHUNT）；BD 換 rev D、改「建議」；Edelrid 換官方連結並寫明沒特別講單股；GRIGRI 第 2 步鉤環是「萬一穿過時擋住」；「不能兩股」歸屬到單繩頁；Munter 制動手改「往上摩擦最大」並補 Alpine Savvy 約少 25%；SAC 1994 只引它有寫的部分；同時垂降「多數專業來源建議」；bergundsteigen「建議」非「要求」；glossary 繩結移位補「結在粗繩側」條件；Ascentionism 等救援在 6:11；Haley 兩股進器材出自說明欄；JB 的 Outside 支持寫在網站；Mike Vert「沒有提到嚮導認證」、刪「只有這支」、補完整標題；Ladiges 理由改照影片 0:37 並加連結；Petzl 鎖環摩擦、DMM Belay Master、Pit Schubert 補連結。
- 範圍外但順手修：Stanley Headwall 原因改「看起來是」；「AAC 確認對接結不是原因」改為 AAC 引述夥伴說法；Devils Tower 中點標記改為 Mountain Project 留言的說法；Climbing 挪威報導標題改用現行標題。

## post-review（更新段落）

- 結構：總覽表（7 種方式＋救援類）放在八步之前，表內錨點連到各節；八步標明以雙股垂降為準；每種方式一節：什麼時候用、跟八步差在哪、最常見致命錯誤、影片（時間點＋講者資格＋商業關係）、今晚就能做的動作。救援類只寫定義、分界與轉手〈自我救援基礎〉。
- 影片：每種方式至少一支嵌入，中英各 21 支；本機 dev server 實測兩頁 200、21 支嵌入、41／33 個頁內錨點全部對得到。
- 練習題增為六題（GRIGRI 裝哪股、細拉繩結放哪側）；glossary 增擋繩垂降、繩結移位、同時垂降。
- 機械檢查：check:tw 0／0、process-leak 通過、lint 0、diagram-preview 中英全 ✓、phrase ledger 0。

## post-polish（更新段落）

- register-scan：長句 23 → 6（剩下多為含長 URL 的句子）；模板化轉折 0；但書 5%。
- 新段落拆長句、把影片段落改成「誰、哪一年、幾分幾秒起看什麼、商業關係」的固定寫法。
