# 審稿紀錄：2026-10-18-climbing-home-training（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回「not connected」；改用 Jina reader（後段 429，改 curl 去 HTML 標籤）、Keenable keyless 搜尋、curl。原始擷取存於 scratchpad `agent-d67/src/`。

## post-verify

逐條對照本 session 打開的原文：UKC × Lattice Home Training 第 1、2 篇（Jina 全文）、Lattice 器材文與初學者指南、Power Company Covid 居家文、BMC How to fingerboard（含 MacLeod Q&A）、Hooper's Beta 每週課表、JOVA 方格子、kateberry 2026。

🟢 Confirmed
- Lattice（UKC pt1）：兩小時抱石不能換兩小時指力板；熟練前一次 <20 分鐘；腳踩椅子／箱子／墊子、距離一公尺內、腳越靠正下方越輕；彈力帶減重照手感；新握法第一個月一週不超過一次；指力板排在最前、不在疲勞時練；兩次力量課不連續兩天、新課 2–3 天恢復；兩種課拆早晚；每第 4 週量降到 50% 以下、年長者每第 3 週。
- Lattice（UKC pt2）：只做一個動作就是引體向上；正手／寬握加重背闊肌；lock-off 90° 與 125°、避開完全拉到頂；chin-up 二頭、前傾牆；伏地挺身練胸肌與三頭、三頭是二頭的拮抗肌；姿勢四點與「手放椅子勝過跪膝」；核心要多樣。
- Lattice 器材文：居家預設單槓＋指力板；「寧可稍微不理想但做得完」。Lattice 初學者指南：腳留地上吊 20 秒。
- Power Company：橡木條、門框上方、磨圓；木條深度表；腳踩地逐步加體重熱身；不要全換成懸吊、可少於一半；10–12 下有挑戰性反覆；在最難處停住加呼吸；拆兩次短課；留意手指手肘肩膀。
- BMC：四指張手 7 秒吊 3 秒休 × 6、手臂微彎、純掛關節易受傷、腳踩椅子；MacLeod「等級無關，情境才重要」、忙碌者相對新手也可、是否多抱石更好。
- JOVA：腳踝韌帶傷、門框單槓＋指力塊、總價不到 2 千、回館大多數 V3 一兩把、V4 未完成、結論「維持可以，進步不夠」。kateberry：槓片掛指力塊、腳尖點地。
- Hooper's Beta：plank 拍肩、側棒式、hollow rock。

🔴／🟠 修正（已改）
- 30 分鐘範例的熱身列原寫「繞肩、手腕」並標 Power Company，原文沒有 → 改成 Power Company 實際寫的「腳踩地逐步加體重」。
- glossary lock-off 原附中文別名「鎖定」，沒有台灣用例來源 → 刪除別名，維持英文。
- UKC 第 2 篇原用搜尋結果的另一個 URL（未直接打開）→ 改成本 session 實際讀到的 URL。
- 英文版連到系列第 0 篇時用了自擬英文標題 → 改成描述性連結文字，避免和實際標題不一致。

🟡 Unverifiable（未寫入）
- 門框單槓的安裝安全、承重：沒有找到可引用的來源，不寫。
- López MaxHangs 組間休息時間：本 session 未打開 López 原文，範例表只寫「組間休到手指恢復」，協定細節交給指力板篇。

本次只檢查了文中已提出的約 40 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 通過；`check:references` 中文版 0 error（1 個關鍵詞重疊 WARN，屬啟發式）；英文版 2 個 error 是兄弟篇 `hangboard-training-en`、`climbing-periodization-en` 尚未建立（平行撰寫中，建立後消失）。外部連結 14 條：UKC 兩條 403 為擋機器人（本 session 用 Jina 讀過全文），其餘 200／203。
- frontmatter：series「攀岩訓練／Climbing Training」order 6 ✓；type guide ✓；tldr 有具體數字（20 分鐘）且與 description 不重複 ✓；tags 用 climbing、climbing-training、indoor-climbing（站內 `training` tag 屬 ML 語境，不混用）。
- 範圍卡對照：單槓、指力板、彈力帶、無器材動作 ✓；「居家訓練沒有研究，以教練建議為主」在開頭明講 ✓；讀完能完成一次 30 分鐘課（範例表）✓。
- 證據等級：開頭整體標「教練共識」，指力板研究轉給指力板篇；JOVA 標明是個人紀錄、不是研究 ✓。學派矛盾（何時上指力板）並列交給指力板篇，本篇只引 MacLeod 一句並連過去 ✓。
- 結構：每個 H2 都有「今晚就能做的動作」✓；練習題 4 題、答案 `<details>` ✓；下一步連 order 7 ✓。
- 用語：指力板（不用懸吊板）、指力塊、campus 未出現；擰身未使用 ✓。
- E 系列只寫「傷害預防系列（撰寫中）」不連結 ✓；疼痛轉介醫師／物理治療師 ✓。

## post-polish

- register-scan：長句 0、數字密度 0 段、引述區塊 0、模板化轉折 0、研究者姓名當主詞 0、但書 10%。
- 可執行動作：七個 H2 都有今晚動作，且都是具體可做的（圈行事曆、找門框、7/3×6、lock-off 5 秒、拍伏地挺身影片、照表做一次並記錄、0–10 分自評）。
- 中英同步：表格、今晚動作、練習題逐段對齊；英文版中文來源都標 (in Chinese)。
