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
