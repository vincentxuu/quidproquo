# 審稿紀錄：2026-10-18-climbing-holds-grips（中英共用）

日期：2026-10-18。工具：Groundlane MCP 與 firecrawl MCP 皆回 "not connected"；改用 Jina reader、curl＋去標籤（climbing.com）、PubMed E-utilities（摘要）。原始擷取存於 scratchpad `b45src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- 握法定義：Vagy（Climbing.com）open hand／half crimp（不反折 DIP）／full crimp（DIP 反折、拇指壓食指，亦稱 closed crimp）；Lattice MXEdge PDF：half crimp「first finger joint」≤90°、無拇指，full crimp「PIP」90°+、拇指壓食指，Open 4／Drag 3，測試「Do not use full crimp」；Lattice 2026 文：half crimp 不對 DIP 施加過大壓力。
- Hooper's Beta 三種 crimp（open／closed／full 的關節角度與手的角度改變）、「把 closed 當 full 練而受傷」的警告、轉引 Quaine 的 17%、轉引 King & Lien（400 N、450 N）。
- Schweizer 2001（A2 約指尖力 3 倍、116 N、熱身 0.6 mm／30%）；Vigouroux 2006（A2 36 倍、A4 4 倍）；Vigouroux 2008（中指、無名指出力大、接近斷裂門檻）；Schweizer & Hudek 2011（兩腱皆出力時 crimp 彎曲力恆大於 slope）；Quaine 2011（拇指提高總出力、其他三指風險未改變）；Miro 2021（最常見過度使用傷害、crimp 為機制、A2–A4、離心、熱身）；Bärtschi 2023（0.57 vs 0.13 mm → 約 4 倍；建議成長板閉合前避免 crimp）。
- 手點：REI（undercling 往上拉、高腳點、腰部高度；sidepull 用體重或反向力；gaston 往外推、力量來自肩膀；一排 jug 很直覺）；Gresham UKC（sloper 要點、back 3；pinch 半封閉／chisel／開掌、側身減拇指力；pocket 兩種組合、四條規則、mono 原句；guppying）；Climbing.com sloper（身體位置、髖到腳的線、籃球、垂直到微前傾手直髖低）；易思婷節錄（好點原意、指洞從最強手指、圓點在上方手直最好、胸前幾乎抓不住、反側拉點）；方格子（edge 定義、垂直平面施力；術語表「大家都是講原文」）；iclimb（口袋點、摳點、摩擦、側拉、倒抓、扳點＝開電梯門）；ninjette（張手／半封閉／全封閉、大把、指力點、圓點、捏點、洞點）；pixnet（反撐）。

🔴／🟠 修正（已改）
- 「點越小，差距越明顯」（Schweizer & Hudek）→ 摘要沒有這句，刪。
- glossary「A2 在指根那一節、A4 在中間那一節」「A1 到 A5」→ 本 session 沒有來源打開，刪。
- 「離心負荷，例如腳突然滑掉」→ 改成離心的定義（出力時被扯開），腳滑掉留在練習題當情境。
- Hooper full crimp「手腕角度」→ 原文是 angle of your hand，改「手的角度」。
- gaston 的「開口朝向身體外側」→ 與易思婷描述不符，改成「在身體前方、手肘外張往外推」。
- 「中文部落格有的從指尖數、有的從指根數」→ 只能確定數法不一致，改寫。
- Vagy「卡住感」→ 原文 mechanical comfort，改「穩固感」。

🟡 Unverifiable（未寫入）
- Lattice 2017 open vs half crimp 文（只載入前言）；Hooper 17% 只在 Hooper 頁、不在 Quaine 摘要 → 正文標「轉引」。
- ninjette「A2 拉傷恢復 3–6 個月」「動態抓洞點是最常見受傷情境」無出處 → 未用。
- nobodyclimb 錯誤（crimp 定義、open hand「手指伸直」、undercling「下拉握」、gaston 方向）→ 未引用；正文定義採 Vagy、Lattice、REI 原文。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 通過；writing-phrase-ledger 無命中；`check-post-quality`／`check:references` 只剩系列兄弟篇尚未建立的站內連結錯誤（footwork-en、balance-en、turning-twisting(-en)、dynamic-moves），兄弟篇由其他寫手同批產出後應消失。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交由 commit gate）。
- 範圍卡逐項：jug、edge、crimp（張手／半封閉／全封閉）、sloper、pinch、pocket、sidepull、undercling、gaston ✓；滑車與全封閉風險（數字一主張一個，其餘收 `<details>`）✓；同義詞群（扳點／反側拉點／反撐、摩擦／圓點、倒抓／倒拉）✓；不講訓練，明寫留給訓練模組 ✓。「用圖統一名稱」以關節角度表＋名稱對照表呈現（手部姿勢無法用 mermaid 畫），🟡 可選：之後補手部照片或插圖。
- 使用者指定：一套名稱＋Lattice、Hooper 對應 ✓（對照表＋Hooper 三分法逐條說明＋「open ≠ 張手」陷阱，練習題第 1 題回扣）。
- frontmatter：series「攀岩動作技術」order 4／EN「Climbing Movement」✓；tags 與同系列其他篇一致 ✓；glossary 4 條，terms.ts 無重複 ✓；tldr 有具體判準與一個數字 ✓。
- 結構：每個 `##` 節都有「今晚就能做的動作」✓；練習題 4 題 `<details>` ✓；下一步連 order 5 ✓。
- inline link：每個來源第一次出現都有連結；中文來源在英文版標 (in Chinese) ✓。

## post-polish

- register-scan：初版長句 2 句（Gresham guppying 段、練習題 2 答案）→ 斷句，現 0；數字密度：Bärtschi 段 4 個 → 刪樣本數與年齡，剩 `<details>` 內兩條（附錄允許）；但書 1%；引述區塊 0；模板化轉折 0。
- 人讀：研究者當主詞的段落集中在滑車一節，保留（引用研究結果本身就是內容），每段一個主張。
- 中英同步：修正後的句子兩版一致；英文版 Taiwan 術語表保留中文詞給在台灣爬的讀者。
