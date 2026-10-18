# 審稿紀錄：2026-10-18-hangboard-training（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回「not connected」；改用 curl＋本機去 HTML 標籤（en-eva-lopez、Lattice、BMC、Hooper's Beta、PCC、kateberry、trainingforclimbing、Frontiers 全文）、PubMed E-utilities efetch 讀摘要。原始擷取存於 scratchpad `d23src/`。

## post-verify

逐條對照本 session 打開的原文（López 指南 I／II／III 與 8 週研究部落格、Lattice 初學者指南與 6,000 人數據文、Hörst 免費課表頁、BMC How to fingerboard（含 MacLeod Q&A）、Hooper's Beta 兩篇、kateberry 2020、PubMed 摘要 9 篇、Stien 2024 Frontiers 全文）。

🟢 Confirmed
- López I：系統化攀爬 >2 年、25 mm 吊 15 秒、16 歲以上／過生長高峰、無傷；做不到改用攀爬練手指（前傾牆、10–20% 小點）；生長高峰女孩 11–12、男孩 13–14。
- López II：MED 吊 15 秒的最小點只吊 12 秒（3 秒餘裕）、3–5 組、組間 3–5 分；MAW 例 18 mm；留餘裕的理由（效果相近、受傷與恢復較少）；IntHangs 例 10 秒吊 20 秒休 ×4；open hand 要圓邊、利邊給 half crimp；熱身 3–4 次逐漸加難。
- López III：每週 2 次、48–72 h（compulsory）；2-3-4-4、第 5 週不吊；新方法從 2 組開始；3 秒餘裕算中級；負荷過重訊號；>2 mm／>25% 中止並延 1–2 天；連續 >2 次退步或疼痛要調整；記錄。
- López-Rivera 2019（摘要）：7c+/8a、IntHangs 第 4 週耐力顯著、MaxHangs 第 8 週、34%／45%／7%、建議交替。López 部落格：最大指力只有 MaxHangs_MaxHangs 顯著，+28%／13.9%／13.4%。
- Devise 2022、Mundry 2021、Medernach 2015、Hermans 2022、Levernier 2019、Stien 2023、Schöffl 2024 摘要內容與正文一致。
- Lattice：新手先靠攀爬、太早上板增加量並降低恢復、肌腱韌帶可能慢 5 倍、新手 20 秒留一腳在地；6,000 多人、指力為單一最佳預測指標、相關。
- BMC：7 秒吊 3 秒休、手臂微彎、腳踩椅子減重；MacLeod「Grade is irrelevant; it's the circumstances that count」、忙碌者半小時、相對新手、「是不是多抱石比較好」。
- Hooper：三個問題、通常用 half crimp、肩與手指位置不穩就減重或縮時、3 次高強度降 2 次；repeaters 7–10 秒吊、3–5 秒休。
- Hörst：<1 年／<5.11／<V4 課表目標含 climbing-specific strength & endurance。
- kateberry 2020：2015 紅石講座、active deadhang、7 秒吊 3 秒休 ×7、48–72 h。

🔴／🟠 修正（已改）
- 研究檔把 Stien 2024 寫成「指力上升、抱石不變」，沒說介入方式。全文是 5 週**動態**屈指訓練（器材拉重量），不是吊指力板 → 正文寫明「用器材做屈指，不是吊指力板」。
- 研究檔「MaxHangs 8 週指力 +28%」出自部落格，不是 2019 論文摘要（摘要只報握力耐力）→ 分開歸屬。
- 「López 建議加負重留給經驗多的人」：原文只對 IntHangs／SubHangs 的 MAW 這樣講 → 刪。
- 「紅石講座是台灣最早的指力板教學紀錄」無法查證 → 改成「早期講座」。
- 「不要用 full crimp 吊指力板」沒有本篇來源支持 → 刪。
- 「MaxHangs 15 秒留 5 秒是給剛開始的人的寫法」→ 改成原文的依據（3 秒餘裕算中級）。
- MacLeod 例外原寫成「攀爬刺激不夠」→ 改成原文情境（無法一週去好幾次岩館）。
- 「五週、八週的介入可能太短」屬作者推測 → 刪。

🟡 Unverifiable／未寫入
- Lattice 在指導下讓青少年吊指力板（UKC × Lattice Part 5，Cloudflare 擋下未能打開）→ 青少年段不寫 Lattice 立場。
- nobodyclimb「6 個月」：未發佈的大綱稿、沒有來源，不列入並列表（Lattice 的「超過 6 個月可考慮做指力測驗」是測驗而非開始門檻，也未寫入以免混淆）。
- López-Rivera 2012（只有 TLDR）、Climbing Bible 試閱 p.109、Power Company 流程圖：未使用。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 全站 0 error（四篇 sibling 已存在）；`check:process-leak` 通過；`check-post-quality.mjs` 無問題。`pnpm verify`／`astro check` 未跑（多 agent 同時改，交由 commit gate）。
- 範圍卡（order 2）：何時開始並列（López、Lattice、Hörst、MacLeod、Hooper；nobodyclimb 因無來源略去）✓；MaxHangs／repeaters／最小邊緣 ✓；握法 open／half crimp ✓；轉移證據不一致（Stien）✓；青少年 ✓；第一個 4 週保守計畫 ✓。
- 每個建議標證據等級 ✓；學派並列不選單一門檻 ✓；指力板用語 ✓；crimp 類以英文為主、括號附 B 系列中文名 ✓。
- 每節結尾都有「今晚就能做的動作」：初稿青少年段缺 → 補上。
- frontmatter：series 攀岩訓練 order 2 ✓；tldr 與 description 不重複 ✓；glossary 3 條（terms.ts 無重複）✓。
- 🟡 tags：本篇用 `climbing-training`（與 order 4–7 一致），order 0、1 用 `training` → 交主線程統一。
- 長度：中文字約 3,000（不含英文字），在下限附近。

## post-polish

- register-scan：長句 0；但書 6%；引述 0；模板化轉折 0。數字密度初版 8 段 ≥4 → repeaters、紅石、López-Rivera、Devise 段改寫並把數字移進 `<details>`；剩下的是協定處方與 `<details>` 內數字（處方本身需要數字，保留）。
- 可執行動作：每節都有。
- 英文版同步補上青少年段的今晚動作。
