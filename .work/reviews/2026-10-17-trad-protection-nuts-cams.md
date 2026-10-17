# 審稿紀錄：2026-10-17-trad-protection-nuts-cams（zh + en）

日期：2026-10-17。來源原文快照：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/eefceeef-ad9b-4e77-b0f9-6d606c5f451b/scratchpad/agent-trad/`（Groundlane 未掛載 → curl＋本地 h2t、Jina reader、Playwright 被 Cloudflare 擋；UKC 由 Jina 取得）。

## post-verify

用腳本把正文每條數字／引述的關鍵字串對原文全文比對（14 份來源全部命中），UIAA 124／125 圖解以 PNG 目視確認。
- 🟢 EN 12276 cam ≥5 kN、大小兩位置、<5 mm 測中間、只測強度不測摩擦；EN 12270 nut ≥2 kN、多方向都測；兩者需標示 kN（UIAA Pictorial 124／125）。
- 🟢 BD：CE cam 5 kN、多數 >10 kN（sling QC）；3-sigma／99.7%、25%/75% 收縮、#0 50% 測、#0 5 kN／#1 14 kN、#0 翻轉、大號彎折、100% 收縮最強、大號 30° 偏軸較敏感（big cams QC）；標準一套 .2–#3、建議加一組 Stopper、6–8 條 60 cm alpine draw（first trad rack）。
- 🟢 camming angle：Friends 13.75°（Wikipedia）、C4 14.5° 與「業界標準 13.75°」（UKC 2019）→ 兩源。對數螺線、兩到四片 cam 片、只能放堅固岩石（Wikipedia）。Jardine 1978 為 single-source（Wikipedia），低風險歷史事實。
- 🟢 Arenz（Climbing 2019）：50–90%、stem 朝受力、平行裂隙放 cam／內縮放岩楔、走位與延伸、第一顆放 cam 防 zipper、一個身長、拆岩楔先往上扯再用 nut tool、mock lead 流程。
- 🟢 Petzl real fall：FF1 轉向點 ≈6 kN、small wire critical。
- 🟢 德芙蘭路線保護欄（線上路線頁 HTML 逐條確認）、岩場落石提醒、南天門「請別爬，落石多」。艾格器材清單、S.T.A.R.S.；百合搖滾課程內容。
- 修正（已改）：原稿「大號 cam 偏 30° 強度下降最明顯」→ 改為 BD 原意「大號比小號更易掉強度」；刪除無來源的「岩楔接觸面越大越好」「敲一敲岩石」「從簡單路線開始先鋒」；「single rack」改為依 BD 標準一套推讀並提示各地寫法不一；「台灣傳攀課都在龍洞」收斂為艾格與百合搖滾。
- 未寫入（查不到可靠來源）：hex 的偏心 camming 原理、各品牌其他 camming angle（只有論壇）、nobodyclimb 題庫的數字。
- 本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0；`check:references` 只剩 en 版連到尚未存在的 sibling（grades-and-protection-ratings-en）；`check:links` 25 條外部連結無壞；`check-process-leak` 通過。`pnpm verify` 其餘紅燈來自其他 sibling／審稿紀錄（本檔補上後解除）。
- frontmatter：必填齊、tags 4 個（既有 tag）、series order 7、type guide；tldr 有具體名詞與數字，與 description 不重複。glossary 4 詞與正文一致（收縮比例 50–90%／25% 對應 Arenz／BD）。
- 結構：情境（德芙蘭〈咪嚕咕〉）→ 原理 → 標準 → 三條件 → 走位延伸 → 讀路線資訊 → 練習路徑 → 練習題 4 題（details）＋nobodyclimb trad-protection → 下一步 → 參考資料。範圍卡要求（凸輪角 13–15°、EN 數字、放置原則、走位延伸、德芙蘭示例、讀者能說出好放置三條件）全數覆蓋。
- inline link：每個外部數字在句內或同段有連結。
- 已修：en 版中文資源標 (in Mandarin)。

## post-polish

- register-scan：長句 0（原 2 句已斷）；但書 5%；模板化轉折 0；phrase ledger 0 命中。
- 數字密度 4–5 的段落多為器材尺寸號碼（#.4、#3、#5、#11）與兩個 kN 對照，屬讀者做決定要用的數字，保留；原「#0 只能在 50% 測」一句移除以降密度。
- 每個主要小節都有「今晚就能做的動作」。
