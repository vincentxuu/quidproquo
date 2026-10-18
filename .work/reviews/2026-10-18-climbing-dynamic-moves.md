# 審稿紀錄：2026-10-18-climbing-dynamic-moves（中英共用）

日期：2026-10-18。工具：Groundlane MCP 與 firecrawl MCP 皆回 "not connected"；改用 Jina reader、curl＋去標籤（climbing.com）、PubMed E-utilities（摘要）、Jina 讀 Springer 章節頁（Fuss 摘要）。原始擷取存於 scratchpad `b45src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- Flanagan（Three Rock Books）：slap ≥2 點、jump 留一手、dyno 0 點；deadpoint＝不上不下的瞬間；三種不該動態的情況（危險墜落、小指洞／窄縫／結晶、銳利岩面）；高速抓點對手指、手臂、手肘、肩膀負荷大、落地不佳；室內大點厚墊、熱身肩與手指；spotter 可能比攀爬者危險；setup 最低腳點、只用最好的腳點、一高一低、彎腿直臂、眼睛鎖目標；上下晃沒有共識；手是支點、腿是彈簧；latch 接近伸直手臂、往下壓腳、盡快 match；擺盪：水平距離越大越盪、收膝或拱背、核心、利用擺盪回牆；騎車下坡比喻。
- Gresham（Climbing.com 2024）：靜態適用簡單地形與保護差處、鎖臂慢動作浪費力氣並增加肌腱負擔（作者意見）；deadpoint 定義與用途（太弱或太累）、通常留在起跳腳點；三分之二放手、最多晃一次；太早／太慢／太晚的後果；hinge／pendulum／rock-over；髖部停在目標點正下方；鑽腳趾、繃大腿後側與核心、手腳同時想；腳掉多半是協調問題；沒有半靜半動；一腳高一腳低、不平衡就 flag。
- Hooper's Beta myth #5：做得好不增加受傷風險且更有效率；sag／launch／float／catch；靜態全程強力收縮；先建力量與關節穩定、從小動作開始。
- Climbing.com dyno master class：Grossman（2020 全國賽冠軍）半推半就更容易受傷、看著點；Stiger（Movement 教練）Super Dynos 只碰不抓；45 度牆 V0–V1 大把切腳再回牆。
- Larson（美國國家隊總教練，Climbing.com 2021）：從膝蓋腳踝開始、先推後拉、髖部帶頭、腿完全伸直後手才動；直臂加大擺盪、鎖臂擋擺盪。
- Power Company Climbing：Rowland Chen 原句。
- Fuss & Niegl 2006 摘要：雙手 dyno 跳越高手指反作用力越低、受傷風險越低。
- Mena 2024：n=35、巴西聖保羅、動態風格與肩前側不穩感相關（p=0.028）、橫斷面、第一作者為攀岩者。
- Hanchor：英文 Dyno 標題、無速度狀態的比喻；ninjette techniques：「動態跳 Dyno」、三點是原則不是鐵律。

🔴／🟠 修正（已改）
- 「Fuss 的結果和 deadpoint 道理一樣：手不必接住下墜的身體」→ 摘要沒有機制解釋，刪。
- 「動態過程手臂有一段幾乎不用出力」→ 出自 PRG（物理說法有誤，不引用），改成 Hooper 的理由（靜態全程收縮）＋Flanagan 比喻。
- 「教練 Rowland Chen」→ 來源只說他是一起攀岩的人，改成「攀岩者」並標出轉述來源 Power Company Climbing。
- 「前美國隊總教練 Josh Larson」→ 原文寫撰文時為美國國家隊總教練，改正。
- 「雙手抓同一個點時盡快 match」→ Flanagan 原意是單手抓到後盡快 match，改寫。
- glossary deadpoint 別名「死點」→ 是中國用詞（theCrag 簡體），移除。

🟡 Unverifiable（未寫入）
- deadpoint 的台灣中文說法（研究筆記列 ninjette「靜止點」，本 session 打開的 ninjette 技巧頁沒有這個詞）→ 正文只用英文 deadpoint。
- 「飛」作為 dyno 的台灣說法：無用例，未使用。
- Phillips & Jensen 2015（dyno 位移）只有後設資料，未引用。
- 動態 vs 靜態耗能：無直接比較研究 → 正文寫成教練共識並說明限制。
- PRG deadpoint 文的物理說法（加速度為零）→ 不引用，正文改寫為「垂直速度為零」並說明誤解。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 通過；writing-phrase-ledger 無命中；`check-post-quality`／`check:references` 只剩系列兄弟篇尚未建立的站內連結錯誤（footwork-en、balance-en、holds-grips 互連已解、bouldering-problem-solving(-en)），兄弟篇由其他寫手同批產出後應消失。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交由 commit gate）。
- 範圍卡逐項：deadpoint vs dyno 定義差 ✓（mermaid 依接觸點數）；何時靜態做不到 ✓；啟動、時機、接點 ✓；腳甩出去回牆 ✓；漸進練習 ✓；「動態比較危險」原說法＋修正＋來源 ✓；耗能無直接研究、不寫成結論 ✓。讀完能做漸進 deadpoint（第一個與最後一個今晚動作）✓。
- 斷崖：開頭用「搆不到／撐不住」接續上一篇握法；指洞不用動態與上一篇規則互相呼應 ✓。
- frontmatter：series order 5／EN「Climbing Movement」✓；tags 與同系列一致 ✓；glossary 2 條，terms.ts 無重複 ✓。
- 每個 `##` 節有「今晚就能做的動作」✓；練習題 4 題 ✓；訓練（跳箱、campus）明寫留給訓練模組、不連結 ✓。
- inline link：每個來源第一次出現都有連結；中文來源在英文版標 (in Chinese) ✓。

## post-polish

- register-scan：長句初版 1 句（Stiger 練習步驟）→ 斷句，現 0；但書 9%（「動態比較危險」一節本來就在處理對立說法，集中在該節）；數字密度 0；引述區塊 0；模板化轉折 0。
- 人讀：「動態比較危險」一節四個粗體小結論各一段，最後一句收束；沒有逐句歸因標籤。
- 中英同步：修正後的句子兩版一致。
