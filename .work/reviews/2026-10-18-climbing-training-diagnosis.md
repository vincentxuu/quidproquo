# 審稿紀錄：2026-10-18-climbing-training-diagnosis（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回「not connected」；Jina reader 前段可用、後段 429，mountainzone.com 403；改用 curl＋本機去 HTML 標籤；PubMed E-utilities 讀摘要；臺大碩論 PDF 用 pdftotext 讀摘要。原始擷取存於 scratchpad `dsrc01/`。

## post-verify

逐條對照本 session 打開的原文（Gresham／Climbing、MacLeod 作者頁、López 指力板指南 I、Hörst 免費課表頁、Lattice 指力資料文、Hooper's Beta 指力板六問、PubMed 摘要 36636194／38976692／26453999／39754511／31094249／33652414／21491325、臺大 2025 碩論摘要）。

🟢 Confirmed
- Gresham：Fawcett 名言、訓練有得有失、技術或心態卡關就多花時間在那兩塊、做墜落練習、指力板數字在岩場常意義不大、每年安排不照課表的時段。
- MacLeod：動機、時間管理、看不出自己技術與戰術錯誤。
- López：系統化 2 年以上（引用經驗與文獻，肌腱韌帶適應較慢）、技術戰術能力的前提、25 mm（一個半指節）吊 15 秒、吊不到就用攀爬練手指：偶爾爬更陡的牆、路線裡放 10–20% 小點。
- Hörst：初學者 <1 年、<5.11 TR、<V4；內容含技巧、恐懼、專項肌力與拮抗肌。
- Lattice：6,000 多人；指力是最能預測等級的單一指標；基準應分性別；「手指要強，技術也要好」。
- Hooper's Beta：PT 經驗；第一問「手指是不是主要限制」；技術不錯＋停滯＋手指是限制才值得練；一週 3 次高強度降到 2 次的例子。
- Stien 2023 統合分析（阻力訓練＋攀爬優於只攀爬、研究少）；Langer 2024（牆下偏肌力、牆上偏技術，均為趨勢；依個人偏好）。
- Laffaye 46%／不到 4%；Berta n=307 指力最強預測；MacKenzie 肩膀爆發力與耐力為主、指力次要、測法含最多引體向上與彎臂懸吊；臺大碩論 25 名進階男性、僅負重引體向上比值顯著、結論要求介入研究釐清因果；IRCRA 柔軟度與肌力為門檻型；Draper 2011 自評與實測無顯著差異。

🔴／🟠 修正（已改）
- 初稿寫 Hooper's Beta「四個問題」（研究筆記的說法）→ 原文是六個問題；正文只引用第一問，未寫題數。
- Laffaye「身材特徵不到 4%」→ 原文是身材加肌肉特性，改成「身材特徵和肌肉組成加起來」。
- Langer 2024「偏向提升」→ 原文是 trends，改成「有提升…的趨勢」。
- López 測驗初稿寫「雙手吊」→ 原文未指定，刪除（今晚動作的雙手是本文建議）。

🟡 Unverifiable（未寫入）
- Hörst 2005〈best training for climbing is…〉（mountainzone 403）、PCC「攀爬還在讓手變強就繼續爬」（未打開）→ 未引用，改用 Gresham 與 López。
- Baláš 2012（年資經由力量影響等級）→ 本 session 未打開，未寫入。

本次只檢查文中已提出的約 35 條宣告，未評估覆蓋是否完整（覆蓋見 post-review）。

## post-review

- 範圍卡對照：技術／心態／體能分辨 ✓；常用測驗（López 25 mm、Lattice 數據、引體向上）並標限制（分性別、橫斷研究、測到不適就停）✓；各家「先練技術」共識與例外（Hörst、Lattice）並列 ✓；系列地圖 order 0–8 依 slug 連結 ✓；不講課表 ✓；讀完能判斷先補哪塊、下一篇讀哪篇（mermaid＋今晚動作）✓。
- 證據等級：各家表格逐列標「教練共識／資料／臨床經驗」，研究段標明橫斷研究 ✓。未給單一年資門檻，López 的 2 年與 Hörst、Lattice 並列 ✓。
- 與〈動作技術總覽〉不重複：安靜腳測試只摘要並連結 ✓。E 系列只寫「傷害預防系列（撰寫中）」不連結 ✓。
- 機械檢查：`check:tw` 0 blocking；`check:process-leak` 通過；`check:references` 中文版無錯，英文版唯一 ERROR 是 sibling `2026-10-18-climbing-strength-power-en` 尚未寫出（平行撰寫中，寫完即消失）；`check-post-quality` 對 `bouldering` tag 有警告（中文寫「抱石」，同系列 B 篇同樣警告），保留。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改）。
- mermaid：節點文字短、TB 方向；未用 mmdc 實際渲染。

## post-polish

- register-scan：長句初版 12 句，把 65 字以上的 4 句（MacKenzie、López 測驗、今晚吊點、心態症狀）斷句；其餘 60–64 字保留。數字密度只在練習題情境（題目本身需要數字）。但書 7%、模板化轉折 0、引述區塊 0、研究者主詞 1。
- 可執行動作：每個 H2（各家說法、研究、三步各一、保守起點、系列地圖）都有今晚動作 ✓。
- 中英同步：修改同步套用到英文版。
