# 審稿紀錄：2026-10-18-climbing-nutrition-recovery（中英共用）

日期：2026-10-18。工具：Groundlane MCP 已用 ToolSearch 載入，呼叫回「MCP server not connected」；改用 PubMed E-utilities（efetch 15 篇摘要）、Jina reader（第 4 次後 429）、curl＋本機去標籤。原始擷取存於 scratchpad `d8src/`。

## post-verify

逐條對照本 session 打開的原文：PubMed 摘要 14 篇（37752011、40875976、35836334、39275289、32850940、33345077、36032265、39414282、37398555、42676485、28387575、42602506、8497013、36930882）；Lattice RED-S 文、Lattice deload 文、UKC × Lattice Part 5、Eva López Guide III、Hooper's Beta Ep.114、World Climbing 2024 REDs 政策、Rodden（Outside）、UKC En:Spire、Dr. M RED-S 文。

🟢 Confirmed
- Monedero 2023：n=25、88% 次佳、28% LEA、男女碳水平均低於建議、鈣鎂維生素 D 不足、只有女性攝取顯著低於需求、女性蛋白質與鐵低。
- Gibson-Smith 2020：n=40、77.5% 未達中等訓練需求、男 30%／女 5% 未達 RMR、女性 30% 缺鐵、素食女性鐵蛋白較低、等級組間身體組成無差異。
- Mora-Fernandez 2024：46 名西班牙選手、EA 平均 33、35.6% LEA、碳水 57.8%／蛋白質 31.1% 不足。
- Tan & Schöffl 2025、Joubert 2026（16 篇觀察研究、無飲食操作臨床試驗）、Smith 2017（碳水、0.25–0.3 g/kg 每 3–4 小時、減重找專業、各面向需研究）。
- Joubert 2020（498 人、女性 16.5% vs 男性 6.3%、女性與等級相關、無對照組）；Nigicser 2024（183 vs 180 對照、無差異、女性症狀較多）；Joubert 2022（世界盃女性、BMI 相對正常仍有月經異常）；Grønhaug 2023（BMI 不預測受傷、ED 的 OR 約 2 但 p=0.08）；Grønhaug 2026（n=417、橫斷、LEA 症狀與目前受傷相關、腸胃症狀最一致）。
- Watts 1993（低 R²）、Ginszt 2023（菁英體重體脂較低、half crimp MVC 較高）。
- Lattice：警訊清單、避孕藥掩蓋、跑者先骨折後月經改變、看醫師排除疾病、減訓練／多休息週／多吃；Part 5：長期熱量赤字不助肌力、BMI 與表現無顯著相關（含 8a.nu）；deload：3–4 週、40–60%、整週休息是誤解、別熬夜。
- López：每週 2 次、48–72 h「compulsory」、72 h 的情境（壓力、體力工作、負荷拉不到）、檢查飲食睡眠。Hooper：負荷超過恢復→慢性疲勞→組織失效（手指、肩）、成人需要更多恢復。
- World Climbing：第一個國際總會、四項措施、BMI 單獨不準且法律上站不住。Rodden：19 歲初經、短期有效長期有害、Meltdown 當時女性最難傳統攀登。

🔴／🟠 修正（已改）
- 研究檔把 Nigicser 2024 寫成「瑞典一般攀岩人口」→ 原文是 IRCRA 進階與菁英等級；正文改成兩研究差在「有無對照組」，不是族群。
- 初稿「Rodden 是 2000 年代最強的女性攀岩者之一」→ 原文無此句，改成原文的 Meltdown 敘述。
- 初稿「Smith 2017 是從其他運動推過來的建議」→ 摘要沒說，改成原文「各面向需更多研究」。
- 初稿「En:Spire 計畫」→ 原文是一場 BMC 支持的講座活動，改稱活動。
- 初稿第三個練過頭訊號「說不出來的痠、休息一天沒退」→ 無來源，改為 Lattice 的反覆受傷／生病／情緒動機。
- 「所有人碳水低於建議」→ 改成男女兩組平均。「Grønhaug 2023 追蹤」→ 改「分析」（橫斷調查）。
- 刪除 Lattice 段的「引述國際奧會機制」標註（Lattice 未引用 IOC）。

🟡 Unverifiable（未寫入）
- Hörst 2005 建議過重者減重、Laffaye「體脂不到 4%」、MacLeod podcast #159（只有標題）：本 session 未打開，不寫。
- 一般性的過度訓練診斷指標：沒找到攀岩專屬研究，只寫教練建議並標明不是診斷標準。
- 具體每日碳水／蛋白質總量建議值：未開運動營養指南原文，不寫數字，改導向營養師。

本次只檢查文中已提出的約 50 條宣告，未評估覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking、0 to review；`check:process-leak` 通過；`check:post-quality` 除站內連結外無其他問題；`check:references` 的錯誤全部是同系列尚未寫完的兄弟篇（periodization、antagonist-core 中英、hangboard／diagnosis／endurance 的 -en），兄弟篇建立後應消失。完整 `pnpm verify`／`astro check` 未跑（多 agent 平行寫作，交由 commit gate）。
- 範圍卡逐項：能量需求 ✓、RED-S 與 LEA ✓、BMI 正常也可能有 ✓、體重與表現爭議並列（表格）✓、飲食失調盛行率差異 ✓、IFSC 政策 ✓、恢復 48–72 h ✓、過度訓練徵兆 ✓、導向醫師／營養師 ✓（開頭、警訊段、飲食段、飲食失調段、恢復段、練習題都有）。「讀者能說出 RED-S 三個警訊」→ 三組警訊獨立一節 ✓。
- 證據等級：每個建議標研究／教練共識／個人經驗 ✓；體重議題並列不選邊 ✓；未給單一年齡或年資門檻 ✓。
- 結構：每節（除飲食失調段，改為就醫指引）有「今晚就能做的動作」；練習題 4 題、答案 <details> ✓；下一步、參考資料 ✓；🌏 連結 ✓。E 系列只寫「傷害預防系列（撰寫中）」無連結 ✓。
- frontmatter：series 攀岩訓練／Climbing Training order 8 ✓；tags climbing／training／health 皆為既有 tag ✓；glossary 3 條（RED-S、低能量可用性、減量週），terms.ts 無重複 ✓。
- inline link：每個來源第一次出現都有連結 ✓；英文版中文來源標 (in Chinese) ✓。

## post-polish

- register-scan 初版：長句 6 句、模板化轉折 1 處（「不是…而是」）→ 斷句、Smith 段改成清單、減量段改寫；現在長句 1 句（在 <details> 數字收合區內，保留）、模板化 0。
- 數字密度：4 段 ≥4 個數字，其中兩段在 <details>（依規則收合）；López 與 deload 段的數字分屬不同主張（次數、時數、週數、百分比），保留。
- 但書密度 5%；研究者姓名當段落主詞 0；一般英文術語 0。
- 中文字數約 3,750 字，落在 3,000–4,500 範圍。
