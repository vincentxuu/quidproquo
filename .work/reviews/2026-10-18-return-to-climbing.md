# 審稿紀錄：2026-10-18-return-to-climbing（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 `not connected`（toolDegradation）；Jina reader（Hooper's Beta、The Climbing Doctor、PMC、全國法規資料庫）、curl（PEACE & LOVE PDF 副本、PubMed E-utilities）。Jina 對 climbing.com 與 blogs.bmj.com 回 403（AbuseAlleviationError），PEACE & LOVE 改讀 PDF 全文副本並以 PubMed 31377722 為引用連結；climbing.com 回攀文（作者有商業利益）未使用。原始擷取存於 scratchpad `src1011/`。

## post-verify

逐條對照本 session 打開的原文：e-Delphi 計畫書與範圍回顧計畫書（PMC 全文）、PEACE & LOVE（PDF 全文）、Silbernagel 2007／Lum 2019／Simon 2023（PubMed 摘要）、Hooper's Beta 三篇（10 分鐘到 10 週、十個錯誤、肩夾擠）、The Climbing Doctor 兩篇（滑車復健、回到指力板）、UKC Lattice Part 6、UIAA 運動攀登說明 PDF、物理治療師法第 12 條。

🟢 Confirmed
- 回攀參數「poorly documented」、範圍回顧「sparse」，兩篇都只是計畫書；PubMed 搜尋未見 e-Delphi 結果發表。作者 Ehiogu U 等（esummary）。
- PEACE：保護 1–3 天、休息最少、疼痛決定何時停止保護；Load 早期加負荷、不讓疼痛惡化；幾天後無痛有氧；社論、多由踝扭傷推來。
- Silbernagel：38 人、前 6 週停跑跳 vs 疼痛監測繼續，進步無差異、無負面影響。
- Hooper：三步測試、急性期不痛、>3 週後 0→1–2 馬上消失可、4/10 持續 >30 秒太多、不回到最難 crimp 專案、不痛≠組織已強；十個錯誤中的診斷錯誤（正中神經 vs 攀岩肘）、社群專家第一名、V7 爬 V4、3–4 週後別爬 4 小時、4x/day vs 4x/week、八週計畫第四週放棄；肩夾擠「see a professional」；肩功能測試用配重或單槓下椅子。
- The Climbing Doctor：容易／中等／困難定義、時程表（只取四列）、低痛 3/10 ≤3 分鐘、無研究支持特定組數；指力板進程（減重→體重→加重→輔助單手）、加重比換小點好控制、和自己與另一手比、參考值只當背景、split/shift。
- Lattice：輕微手指傷約 6 週回去爬。UIAA：過度使用疼痛四階段、「不要等到一直痛」。Lum：保守 3.9 個月。Simon：27 人、53±29 月、93% 回攀。物理治療師法第 12 條第 2 項原文。

🔴／🟠 修正（已改）
- 「UIAA：前一兩個階段就是該減量的訊號」→ 原文只說不要等到一直痛，改成原意（正文與練習題 4）。
- Silbernagel 族群「跑跳運動員」→ 改「阿基里斯腱病變的病人」。
- mermaid「停下，下次退一級」無來源 → 改「停下，記錄，告訴治療師」。
- The Climbing Doctor 滑車復健文的作者未在擷取中確認 → 不再掛 Jared Vagy（指力板那篇有作者欄，保留）。
- 練習題 2 原本對 The Climbing Doctor 的描述不精確 → 改成「也算可以接受」。

🟡 Unverifiable（未寫入）
- Silbernagel 常被引用的「≤5/10」閾值（摘要沒有）；climbing.com 的回攀分級與休息天數（403 打不開）；肩傷攀岩專屬回攀流程（沒找到）；Hooper A2 指南的「24 小時」疼痛規則（本 session 未開）。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 中英皆通過；mermaid 語法以 Mermaid Chart 驗證 valid（中文版；英文版同結構）。`check-post-quality`／`check:references`：英文版連到 `/posts/climbing/2026-10-18-climbing-shoulder-en`，寫作當下該檔尚未建立（中文版已存在，由兄弟 agent 撰寫中）；其餘無錯。
- frontmatter：series 名稱中英一致、order 11；tags climbing、climbing-injury、indoor-climbing、climbing-training；glossary 兩條（PEACE & LOVE、疼痛監測），terms.ts 無重複。
- 範圍卡對照：分階段原則 ✓、疼痛監測 ✓、手指與肩的回歸進程（依來源，肩標明證據少）✓、國際回歸共識尚未發表 ✓；「讀完能排出前兩週」→ 獨立一節，七列表格皆附依據，具體劑量交給醫師／物理治療師 ✓。
- 醫療界線：不給個人治療計畫；時程表放 `<details>` 標出處與適用範圍；台灣「先醫師後物理治療」附法條。今晚動作皆為記錄、自我測試或預防規劃，無治療處方。
- 內部連結：E 系列 0、2、3、4、5、10、12 皆以 slug 連結。

## post-polish

- register-scan：長句初版 7 句 → 斷句後剩 1 句（含兩個問號的過門句，保留）；數字密度僅練習題 2 一段（疼痛分數本身是重點，保留）；但書 2%、模板化轉折 0、研究者主詞 0。
- 「很多人以為……這兩半都有問題」作為迷思拆解的開場，後面分別用 PEACE & LOVE／Silbernagel 和 Hooper 回應，結構清楚。
- 中英同步：EN 版同結構、同 mermaid 結構、同表格與練習題。
