# 審稿紀錄：2026-10-17-gym-lead-climbing（中英共用）

日期：2026-10-17。工具：Groundlane MCP 未連線；Keenable keyless 搜尋、Jina reader（後段被 429 限流）、curl、Playwright headless（Petzl JS 頁面）。原始擷取存於 scratchpad `agent-lead/`。

## post-verify

逐條對照本 session 打開的原文（DAV PDF 全文 pdftotext、REI 四篇、BMC、Petzl 四篇、原岩 360／232、艾格 lead-climbing）。

🟢 Confirmed
- REI：3 呎上方→至少 6 呎＋延展（lead-climbing-basics）；掛快扣時機頭到腰、直門／彎門、開口背對前進方向、反掛、Z 字掛、捏掛／扣掛（clip-quickdraws）；四條通用確保原則、給繩四步、繩太直／太垂、Clipping 時往前一步、hard／soft catch 表、地面固定點（belay-lead-climber）；30 呎、不要推牆、吐氣、繩在腿後跨回（climbing-how-to-fall）。
- DAV：穩定姿勢、窗口髖到額頭、避免伸直掛、前五支掉了可能撞地、每支都掛、in line/untwisted、繩在腿後翻轉撞頭與燙傷、喊 Rope、直接綁繩（Safelock 上攀有條件可、先鋒禁止）、第一支後站位靠牆偏側、至少到第五支不留繩、20–50 cm、體重差 >10 kg 要採措施、墜落姿勢、考試表項目。
- BMC：兩倍距離、練習順序（快扣下坐繩→正上方→一公尺以上）、不要抓快扣、「you'll always fall further than you think」、岩館可練但先問工作人員。
- Petzl：spot 不是接住、手瞄準骨盆與上背；接墜握制動端、不抓攀爬端；小跳或往前一步的動態確保、確保者空間（不赤腳、繩上無結）；掛繩時靠牆再回位、很少超過 2 m；開口方向與繩路徑。
- 原岩進階確保課：18 歲以上、7,500／6 堂、先考 TR、結訓先鋒確保測驗發卡、跨館由各館決定。艾格：NT$4,500、兩次 3 小時、Camp 4 北投、先修頂繩課、5.8 為佳、內容含抱石確保與動態確保、一週後考先鋒攀登安檢卡。CBT 2023：TR 確保、先鋒確保、先鋒 8 m 5.7–5.8。

🔴／🟠 修正（已改）
- 「REI：Z 字掛發現了就解開重掛」→ REI 沒寫修法，改成 REI 原意（繩阻會讓你發現；沒發現時接住你的是下一支）。
- 「有些岩館的上攀路線允許用自鎖鉤環」→ 原文是 DAV 說上攀在某些條件下接受，改成歸給 DAV。
- 「Petzl：先鋒墜落練習最好有專業指導」→ 改成原文「在不同情境練習接墜，或接受專業訓練」。
- 「第七、八支快扣附近」練墜落→ DAV 的 6–7 支是上攀證的練習，不能搬到先鋒；改成「爬到夠高的位置」。
- 體重差「常見的選項之一」→ REI 只說是一種做法，刪「常見」。

🟡 Unverifiable（未寫入）
- DAV 體重差頁 alpenverein.de/sichernmitgewichtsunterschied 的具體措施（Jina 429、未能打開）→ 正文只寫「要採取措施、問教練」。

本次只檢查了文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 本篇無錯（初版英文版連到尚未存在的 sport-vs-trad-overview-en，sibling 建立後消失）；`check:process-leak` 通過；`check:links` 23 條外部連結無壞鏈，REI 4 條 403 為擋機器人（本 session 用 Jina 讀過全文）。完整 `pnpm verify`／`astro check` 未跑（全站多 agent 同時改，交由 commit 時的 gate）。
- 🟡 tags：`check:post-quality` 警告 `beginner` 不貼切（讀者已會上攀確保）→ 已移除，改為 4 個 tag。
- frontmatter：無 `series`（依規劃為系列外前置篇）✓；tldr 有具體數字（第五支快扣、20–50 cm、兩倍、6 堂 NT$7,500）且與 description 不重複 ✓。
- 結構對照 guide 型：前置（上攀確保連結）→ 攀爬者步驟 → 確保者步驟 → 墜落原理 → 練習 → 台灣考法 → 練習題 → 下一步 ✓。
- 範圍：掛快扣三錯、穩定姿勢掛、快速給繩、20–50 cm、第一支後站位、軟確保、墜落練習、體重差、墜落較長、原岩／艾格／CBT 全部有覆蓋 ✓。
- inline link：每個來源第一次出現都有連結 ✓；CBT 的「中華民國山岳協會」未另附連結（本 session 未打開 World Climbing 頁），🟢 可選。
- 主題歸屬：戶外內容只留一句並轉手到 first-outdoor-sport-lead ✓。

## post-polish

- register-scan：長句初版 3 句（BMC 引述段、練墜落的今晚動作、DAV 考試表段）→ 斷句、DAV 考試表改成清單，現為 0。數字密度：CBT 段 4 個 → 刪「8 公尺」改成兩句；艾格段剩 4 個（其中 Camp 4 是館名，屬誤判，保留）。但書 2%、模板化轉折 0、引述區塊 0。
- 可執行動作：人讀補上「在台灣怎麼學」一節的今晚動作（問岩館兩件事）；其餘有建議的節（掛快扣、給繩、練墜落）都已有。
- writing-phrase-ledger：無命中。中英同步補上同一句今晚動作。
