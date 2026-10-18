# 審稿紀錄：2026-10-18-climbing-elbow-wrist（中英共用）

日期：2026-10-18。工具：Groundlane MCP 用 ToolSearch 載入後回 `not connected`；改用 PubMed E-utilities（curl efetch 摘要）、Jina reader（一次 429，依序重試成功）、Keenable（台灣用語）、curl＋pdftotext（UIAA、DAV PDF）、Europe PMC（Quarmby 全文）。原始擷取存於 scratchpad `e45src/`。

## post-verify

逐條對照本 session 打開的原文（PubMed 摘要 13 篇、Hooper's Beta 3 頁、The Climbing Doctor TFCC、Black Diamond Esther Smith、UIAA factsheet PDF、DAV Boulderschein PDF、NHS sprains、安健維康、handsurgerytaiwan 肘隧道、台灣手外科醫學會）。

🟢 Confirmed
- Grønhaug 2018：667 人、肘第三（17.7%）、女性手腕 12.5% 排第三在肘前（摘要）。Holtzhausen 1996：62%、主要資料 Bollen（摘要）。
- Hooper Ep.162（2025-12-08）：兩種原因、神經常被漏掉、麻＝神經、手肘彎久（手機）、胸肩伸展後改變；神經幾天到幾週、肌腱 2–4 個月；≤2/10 當下與 24 小時；「complete absence of stimulus is not a faster recovery」；對減量、肌力、神經運動無反應要尋求專業。
- Meller 2024：3 例被誤診為肌腱病變的尺神經壓迫，神經滑動運動後回到受傷前表現；Hooper 為共同作者。
- 肘隧道症候群用語與症狀（handsurgerytaiwan）；內上髁炎＝高爾夫球肘、外上髁炎＝網球肘與成因（安健維康李鑌）。
- González-Iglesias 2011：9 位攀岩者、無對照病例系列。UIAA：肌肉失衡、忽略旋轉肌與前臂伸肌。Esther Smith：伸肌連到三頭肌、斜方肌、後側旋轉肌，「weakest」；處理含肩與核心。
- Müller 2024：30 位、低高度往後摔到墊子、每兩人一位手術、90% 回抱石、三分之二回原程度、「false sense of security」。
- NHS：斷裂聲、變形、麻刺、發青冰冷 → A&E；不要自己開車。DAV：爬下來比跳安全；手臂彎曲貼身、握拳（Babyboxer）。
- Schöffl 2023 AJSM：69 人 78 處、尺側最常見、>1 診斷、五種常見診斷、約三分之一仍不適、強調準確診斷與專業照護。
- TFCC 機轉／症狀／喀啦聲提醒／2–4 個月、中央盤約 6 個月（Hooper Ep.157、2020 舊頁）；4 週未改善看專科（Hooper 2020、Climbing Doctor 2022）；中立腕位、mantle 慢慢加重（Climbing Doctor）。
- Lutter 2016：12 位、瀰漫性腕痛、屈肌腱傳力到鉤、X 光→CT／MRI。Lutter 2018：28/31 骨髓水腫、橈尺遠端與腕骨、3–4 個月。
- Rooks 1995：39 人中 4 人；Peters 2001：83 人約四分之一神經壓迫、多數保守有效。Zbeda 2021：岩館 4 天後、麻、壓痛、被動活動痛、深部感染、緊急手術、作者推測擦傷進入。Kwon 2018：11 歲女孩橈骨生長板壓力傷害。
- Quarmby 2023：肌力訓練介入預防肩肘；強度、抱石、crimp、受過傷為風險因子（摘要＋全文表格）。
- 台灣手外科醫學會：「上肢（肩部至手指尖端）」、骨科與整形外科、多數不需手術。

🔴／🟠 修正（已改）
- 「腕隧道：正中神經和屈指肌腱從這裡通過」→ 解剖描述沒有本 session 打開的來源，刪除。
- 「手肘變形、手指麻或冰冷直接去急診」原無來源 → 改為引 NHS。
- 練習題「變形手指麻是神經血管受壓訊號」「不要自己開車」→ 改成 NHS 清單原意。
- Zbeda 紅旗句原寫「發燒」「手掌嚴重壓痛」→ 摘要沒有發燒、寫的是 significant tenderness，改為「手部明顯壓痛」並刪發燒。
- Lutter 2016「作者推測」→ 摘要是直接陳述機轉，改「作者說明」。
- 「抱石失手時手臂收在胸前」原無本 session 來源 → 改用 DAV 手冊原文。
- 「目前沒有攀岩者 TFCC 世代研究」→ 改成「說法主要來自物理治療師經驗」，不寫查證過程。

🟡 Unverifiable（未寫入）
- den Hengst 2026 自評 TFCC 8.8%：本 session 只讀到摘要，摘要沒有 TFCC 數字，不寫。
- 鉤狀骨占腕骨骨折 2–4%（摘要有）→ 讀者用不到，未寫。
- Esther Smith「前 6 週冰敷消炎」→ 與 PEACE & LOVE 等來源衝突、且屬治療，不寫。
- 台灣「運動醫學科多屬骨科」等科別細節 → 本 session 未開，交給總覽篇。

本次只檢查了文中已提出的約 50 條宣告，未評估覆蓋是否完整（覆蓋見 post-review）。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；`check:references` 0 error（全站）；`check:process-leak` 中英皆通過；`check:post-quality` 1 個警告：`health` tag 在正文沒有明顯對應詞，與同系列總覽、柔軟度篇一致，保留；`check:links` 本篇與肩篇 36 條外部連結無壞鏈；內部連結 8 個目標全部存在。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交給 commit gate）。`check:series-plan` 在本紀錄寫入前報缺紀錄，寫入後應消失。
- frontmatter：series「攀岩傷害預防與急救」order 4／EN「Climbing Injuries and First Aid」✓；type guide ✓；tags climbing、climbing-injury、bouldering、health ✓；glossary 4 條（terms.ts 無重複）✓；tldr 有具體數字且與 description 不重複 ✓。
- 範圍卡對照：內上髁炎 ✓、外上髁炎（標明證據多來自一般族群）✓、TFCC ✓、腕隧道 ✓；另補肘脫臼、鉤狀骨、骨髓水腫（研究建議的瀰漫腕痛影像）。「讀完後能說出肘痛時該調整的訓練與就醫時機」→「痛的時候訓練怎麼調」節與就醫清單 ✓。
- 醫療規則：每項標證據等級（研究／病例系列／一般族群／物理治療師經驗）✓；時程都標出處與「臨床經驗」✓；沒有個人診斷或治療計畫，Hooper／Climbing Doctor 的復健課表只取就醫線與減量原則 ✓；每節「今晚就能做的動作」都是自我檢查或預防（痛點圖、記錄時機、伸肌比較、爬下來、腕位、檢查破皮、痛分數）✓；練習題 4 題皆含就醫判斷 ✓。
- 結構：開場情境 → 證據分量說明 → 部位地圖 → 肘內 → 肘外 → 肘脫臼 → 腕尺側 → 瀰漫腕痛／腕隧道 → 就醫與科別 → 訓練調整 → 練習題 → 下一步（接肩篇，對應規劃弧線）✓。
- inline link：每個來源首次出現都有連結；系列、D 系列（拮抗肌與核心）、B 系列未用到 ✓。

## post-polish

- register-scan（中文）：初版長句 7 句 → 斷句，現剩 1 句 63 字（含連結標記，保留）；但書段落 8%；引述區塊 1 個（Hooper 的 2/10 原則，屬「讀者要照做的原話」，保留）；數字密度超標的段落只剩 `<details>` 內與 Meller／Lutter 2018／腕隧道段（各 4–5 個，含年份與樣本數，已盡量拆句）；研究者姓名當主詞 0；模板化轉折 0。
- writing-phrase-ledger：無命中。
- 人讀：「我們找到的攀岩研究」屬過程句 → 改成「例如……只有 9 位」；中英同步修正。
