## post-verify

post-verify report: learning/2026-10-24-how-muscles-contract (zh-TW) + -en
查證日期：2026-10-24。未修改任何文章檔。

## 0. 實際讀了什麼（誠實揭露）

工具：Groundlane `web_fetch`（format=text）、`web_search`。Groundlane 全程可用；沒有退到其他 MCP。

### OpenStax 四頁：全部自己重抓、完整讀完

| 頁面 | 結果 |
|---|---|
| 10.1 Overview of Muscle Tissues | HTTP 200，truncated=false，讀完。頁面短，抽取器警告「removed most of the page」，但學習目標到最後一段（平滑肌）都在，未見缺段。 |
| 10.2 Skeletal Muscle | 200，truncated=false，讀完（到「Ca++ 抵達肌漿使肌節收縮」）。 |
| 10.3 Muscle Fiber Contraction and Relaxation | 200，truncated=false，讀完（含 Sources of ATP、疲勞、Relaxation、Muscle Strength、DMD 框）。 |
| 10.4 Nervous System Control of Muscle Tension | 200，truncated=false，讀完（含 motor units、length-tension、twitch、summation、treppe、muscle tone）。 |

四頁都沒出現 `Loading` 或空欄位，通過抽取驗收。

OpenStax 授權頁（章節頁的 Citation/Attribution 區）也讀了，見 §5。

### 獨立來源：只有部分讀到

| 來源 | 狀態 |
|---|---|
| Wikipedia "Muscle fatigue" | 全文讀完（200）。只是三級來源，不是 PMC。 |
| Wikipedia "Motor unit recruitment" | 全文讀完（200）。同上。 |
| PMC / NCBI Bookshelf（StatPearls NBK537140、PMC5645737） | 沒讀到。reCAPTCHA / 403。 |
| journals.physiology.org（Physiol Rev 2008 疲勞回顧、AJP-Cell 2024、Mendell 2005 size principle） | 沒讀到。403 Cloudflare。 |
| Europe PMC（REST 與 books） | 沒讀到。503 / 500。 |
| PubMed 摘要頁 | 沒讀到。js_empty_document。 |

後面三列只拿到搜尋摘要片段。依 skill 規則，**搜尋片段不能當 Confirmed 依據**。這些片段只當線索，報告裡一律標明。

另外，Lumen Learning 頁面其實是 OpenStax 同一份內文，不算獨立來源，沒有採用。

### 樂詞網（terms.naer.edu.tw）

- 詞條 detail 頁抓下來會被導回首頁，直接 fetch 讀不到詞條內容。
- 搜尋索引能回傳「英文 - 中文」格式的標題，也有幾筆「相關詞彙」片段。本報告的術語判定只憑這些標題與片段，證據強度低於 fetch 全文。
- 沒有取得台灣教科書或衛教頁面的 fetch 全文，只有搜尋摘要：運動視界 Sports Vision 的「肌節」、zh.wikipedia 的「肌小節（即肌節、肌原纖維節）」。這些也不算 Confirmed。

## 1. 摘要

- 🔴 Contradicted：**0**。沒有任何陳述被 OpenStax 或獨立來源直接打臉。
- 🟠 Outdated：0。
- 🔵 Misframed：**3**（M1、M2、M3），另有 2 項輕度（M4、M5）。
- 🟡 Unverifiable：**4 項內容宣告** + 術語查核中 3 個詞在樂詞網找不到對應（見 §4）。
- 🟢 數字：95%、50 倍、「約每六條纖維」、「幾秒」、「上千／thousands」全部和 OpenStax 原文一致。這四頁只有 OpenStax 一個來源，獨立第二來源沒取得，見 §3。
- 引用連結有 1 處錯位（C1）。中英文有數處不一致（見 §2）。

最重要的三個問題：

1. tldr 寫「整串過程都要 ATP」（中）／「every step of the cycle needs ATP」（英）：比來源與本文自己的正文都寬，而且中英範圍不同。（M1）
2. 小標「ATP 是這串事件的瓶頸」：OpenStax 沒有這樣說，來源反而說疲勞確切原因不明、ATP 不足主要出現在短時間高強度。（M2）
3. 「三條路在實際運動時不是輪流上場」：OpenStax 的敘述是依序接手，這句不是來源主張。（U1）

## 2. 逐條查證

行號為中文版檔案行號。「來源」欄指 OpenStax 章節；10.x 表示我實際讀過該頁全文。

### 2.1 神經依賴與運動神經元位置

| # | 行 | 宣告 | 判定 | 說明 |
|---|---|---|---|---|
| 1 | 37 | 骨骼肌完全依賴神經系統訊號 | 🟢 Confirmed | 10.1：skeletal muscle "completely depends on signaling from the nervous system"。 |
| 2 | 37 | 運動神經元大多從脊髓出發，少數在腦幹，負責臉、頭、頸 | 🟢 Confirmed（10.2），但見 C1 | 10.2 "originate in the spinal cord, with a smaller number located in the brainstem ... face, head, and neck"。 |
| 3 | 37 | 心肌、平滑肌還能對荷爾蒙和局部刺激起反應，骨骼肌沒有這個備案 | 🟢 Confirmed | 10.1。 |
| 4 | 37 | 「沒有神經訊號就不會收縮」 | 🟢 Confirmed，但語氣比來源絕對 | 10.2 的原句是 "the only way to **functionally** contract a skeletal muscle is through signaling from the nervous system"，英文版同樣丟掉 functionally。屬輕度，沒有改錯意思，要不要補由作者決定。 |

C1（引用錯位）：第 37 行的連結指向 10.1，但「脊髓／腦幹」那句只在 10.2，10.1 完全沒有。讀者點進 10.1 看不到這句話。英文版同樣。

### 2.2 六個步驟

「六個步驟」是作者自己的拆法，OpenStax 沒有編號步驟，這點本身不是錯。

| # | 行 | 宣告 | 判定 | 說明 |
|---|---|---|---|---|
| 5 | 41 | 肌纖維內有成千上萬個肌節排成一串；肌節縮短，整條纖維縮短 | 🟢 Confirmed | 10.2：每條肌纖維含數百到數千條肌原纖維，每條肌原纖維含數千個肌節。「成千上萬」其實低估，但不算錯。英文 "thousands of sarcomeres lined up end to end" 對單條肌原纖維成立。 |
| 6 | 43 | 末端在神經肌肉接合處放出乙醯膽鹼 | 🟢 Confirmed | 10.2。 |
| 7 | 44 | ACh 結合受體 → 動作電位沿整條纖維傳開，經橫小管深入內部 | 🟢 Confirmed | 10.2、10.3。 |
| 8 | 45 | 電訊號讓肌漿網放鈣；肌漿網是儲鈣構造 | 🟢 Confirmed | 10.2：specialized smooth ER that stores, releases, retrieves Ca++。 |
| 9 | 46 | 鈣與肌鈣蛋白結合，蓋住結合位的蛋白質移開 | 🟢 Confirmed | 10.3：Ca++ 結合 troponin，tropomyosin 滑開。文章沒點名 tropomyosin，簡化但不錯。 |
| 10 | 47 | 肌凝蛋白頭抓肌動蛋白、往肌節中央拉；「抓住、拉、放開」循環 | 🟢 Confirmed | 10.3。 |
| 11 | 47 | 教科書用划槳比喻：入水、拉、出水、回位 | 🟢 Confirmed | 10.3 的比喻是 pull → lifted → repositioned → immersed。文章把循環從「入水」寫起，順序不同但同一個循環，不影響意思。 |
| 12 | 48 | 要接上新的 ATP 才能放開並回到預備位置；有鈣、有 ATP 就持續縮短 | 🟢 Confirmed | 10.3 圖 10.11(d)(e) 與正文。細節上「回到預備位置」靠的是 ATP 水解而非結合本身，文章壓縮成一句，可接受。 |
| 13 | 50 | 放鬆：神經停止、鈣泵回肌漿網、結合位再被蓋住 | 🟢 Confirmed | 10.3 Relaxation。來源另提 AChE 分解 ACh 與再極化，文章略過。 |
| 14 | 50 | 人死後不再製造 ATP，肌凝蛋白放不開，肌肉僵在原位＝死後僵直 | 🟢 Confirmed | 10.3 rigor mortis 段。 |

### 2.3 ATP 與能量

| # | 行 | 宣告 | 判定 | 說明 |
|---|---|---|---|---|
| 15 | 54 | 肌肉儲存的 ATP 很少，只夠撐幾秒 | 🟢 Confirmed | 10.3 "only sufficient to power a few seconds worth of contractions"。 |
| 16 | 54 | 第 5、6 步與鈣泵回去都耗 ATP | 🟢 Confirmed | 10.3："In addition to its direct role in the cross-bridge cycle, ATP also provides the energy for the active-transport Ca++ pumps"。 |
| 17 | 54、58–60 | 三條補給路：磷酸肌酸／糖解／有氧 | 🟢 Confirmed | 10.3 三種機制。 |
| 18 | 58 | 磷酸肌酸最快、只撐很短 | 🟢 Confirmed | 10.3：約 15 秒。文章未寫數字，沒有數字風險。 |
| 19 | 59 | 糖解比磷酸肌酸慢、不能撐久、適合短暫高強度 | 🟢 Confirmed | 10.3：約 1 分鐘、"short bursts of high-intensity output"。 |
| 20 | 60 | 有氧最慢但能長時間供應 | 🟢 Confirmed（含輕度推論） | 10.3 說 aerobic "much slower"、需要穩定 O2 供應。「能長時間供應」是由 "sustained" 語境推出，來源沒有這句。主流生理學也如此理解，風險低。 |
| 21 | 60 | 休息或中等活動時，約 95% 的 ATP 來自有氧 | 🟢 Confirmed（見 §3） | 10.3 "Approximately 95 percent of the ATP required for resting or moderately active muscles is provided by aerobic respiration"。 |
| 22 | 64 | 疲勞確切原因不完全清楚；因素有 ATP 存量下降、乳酸讓 pH 改變、鈉鉀失衡干擾鈣釋放、長時運動可能損傷肌漿網與肌纖維膜 | 🟢 Confirmed | 10.3 疲勞段四項對得上。 |
| 23 | 64 | 「別把『累』全推給乳酸」 | 🟢 Confirmed（作者結論） | 與來源（"may contribute"）及 Wikipedia "Muscle fatigue"（乳酸影響「現在不確定」、可能助長也可能減輕疲勞）一致。 |

### 2.4 運動單位與徵召

| # | 行 | 宣告 | 判定 | 說明 |
|---|---|---|---|---|
| 24 | 68 | 運動神經元分支，每支接一條肌纖維；一個神經元加所有支配纖維＝運動單位；一條纖維只被一個神經元管 | 🟢 Confirmed | 10.4。與 Wikipedia "Motor unit recruitment" 的定義一致。 |
| 25 | 70 | 眼外肌是小運動單位，約每六條纖維一個神經元，精細控制 | 🟢 Confirmed（數字一致） | 10.4 "every six or so fibers"。文章有「約」。 |
| 26 | 70 | 大腿、背部是大運動單位，一個神經元可管上千條纖維 | 🟢 Confirmed | 10.4 "thousands of muscle fibers"。中文「上千」與英文 thousands 略有差距，見 §2.7。 |
| 27 | 74 | 小的、易興奮的先出動；需要更大力時依序叫來更大的 | 🟢 Confirmed | 10.4 recruitment。Wikipedia 同（Henneman size principle），並註明某些情況下順序可被改變；文章沒講例外，來源也沒講。 |
| 28 | 74 | 在某些肌肉，最大運動單位的力是最小的 50 倍 | 🟢 Confirmed（數字一致，hedge 保留） | 10.4 "In some muscles, the largest motor units may generate a contractile force of 50 times more than the smallest"。 |
| 29 | 74 | 因此同一條肱二頭肌能拿羽毛也能舉重物 | 🟢 Confirmed | 10.4 的例子。 |
| 30 | 75 | 發送更快：前一次收縮未結束，下一訊號到，疊加，出力更大；頻率高到來不及放鬆＝強直收縮 | 🟢 Confirmed | 10.4 wave summation、complete tetanus。中文「強直收縮」沒說「完全」，英文 "sustained contraction (tetanus)"；兩邊都略過 incomplete tetanus，不算錯。 |
| 31 | 77 | 不讓所有運動單位同時出力，輪流休息才撐得久 | 🟢 Confirmed | 10.4 "generally not all simultaneously active"。 |
| 32 | 79–83 | 依長度變化分向心／離心／等長三種及例子 | 🟢 Confirmed 概念；結構見 M4 | 概念與例子（舉起、放下、拿不動／維持姿勢）都在 10.4。 |
| 33 | 85 | 肌節靜止長度附近出力最大，太長太短都變小 | 🟢 Confirmed | 10.4 length-tension（80%–120%）。 |

### 2.5 作者自己的陳述（不是來源陳述）

| # | 行 | 宣告 | 判定 | 說明 |
|---|---|---|---|---|
| 34 | 31 | 握拳不到一秒，前臂每一條出力的肌纖維都走過同一串事件 | 🟡 Unverifiable（作者情境描寫） | 來源沒有握拳或「不到一秒」。「同一串事件」對任何被徵召的纖維成立（10.2/10.3）。低風險，建議保留為情境，不要當量化主張。 |
| 35 | 33 | 讀完能說出「一次收縮需要哪三樣東西」 | 🟢 Confirmed（與正文自洽） | 三樣＝神經、鈣離子、ATP，與 96 行一致。 |
| 36 | 96 | 「神經、鈣離子、ATP，每一個環節都可能是疲勞、受傷或進步的來源」 | 🟡 Unverifiable（「受傷」「進步」） | 疲勞與 ATP、鈣離子的關聯在 10.3 有。「受傷」「進步」兩項不在這四頁（10.3 另有肥大／萎縮段，但沒有把三環節對應到受傷或進步）。縮回「疲勞」，或刪掉。 |

### 2.6 Misframed 與越界

M1 🔵 tldr「整串過程都要 ATP」（zh 第 9 行）／"every step of the cycle needs ATP"（en 第 9 行）
- 來源：ATP 負責橫橋循環的放開／重新上膛，以及肌漿網的鈣泵（10.3）。步驟 1 到 4（ACh 釋放、動作電位、釋放鈣、鈣結合肌鈣蛋白）來源都沒說用 ATP。
- 正文第 54 行自己寫「第 5、6 步，以及把鈣離子泵回去」，所以 tldr 比正文寬。
- 中英範圍不同：中文「整串過程」＝整個六步；英文 "every step of the cycle" 較接近橫橋循環。
- 建議修法：縮回原意，例如「收縮的拉動與放開、以及把鈣離子泵回去，都要 ATP」。中英要對齊。

M2 🔵 小標「ATP 是這串事件的瓶頸」（zh 第 52 行／en "ATP is the bottleneck"）
- 來源沒有用 bottleneck 這個說法。來源給的是：儲存量很少，要快速再生（10.3）。
- 來源同段還說：疲勞確切原因不完全清楚；ATP 存量下降「可能更常見於短時間、高強度的輸出，而不是持續的低強度活動」。文章略過這句限定。
- 獨立線索（僅搜尋摘要，未讀全文，不作 Confirmed）：Physiol Rev 2008 疲勞回顧的片段寫「高能量需求時，ATP 濃度起初幾乎維持不變，磷酸肌酸先下降」；AJP-Cell 2024 的片段寫肌纖維有機制避免 ATP 過低。Wikipedia 另寫疲勞有神經性與代謝性兩大類。這些都指向「整體 ATP 被保護、不等於疲勞的瓶頸」。
- 結論：小標把一個框架寫成事實，同一節後面又說原因不明，自相緊張。
- 建議修法：縮回原意。標題改成中性描述（例如「ATP 存量很少，所以要一直補」），不要用「瓶頸」。

M3 🔵 「這三條路在實際運動時不是輪流上場」（zh 第 62 行／en 第 62 行）
- OpenStax 10.3 的敘述是依序：「磷酸肌酸耗盡後，肌肉轉向糖解」（"muscles turn to glycolysis"），圖 10.12 也是時間軸。這句是反對來源的措辭，並且把證據轉給另一篇自家文章。
- 不是必然錯：主流看法是三套系統同時貢獻、只是比重隨時間移動。但我沒有取得可 fetch 的獨立來源，所以這句**我無法在本次查證中確認**。
- 同時它放在表格下面，讀者會以為是本篇依據 OpenStax 在說。
- 建議修法：二選一。(a) 刪掉；(b) 改成連結句，不下判斷，例如「實際運動時三者如何搭配，見〈…〉」，把主張留給那篇去負責，並確認那篇有查證。

M4 🔵（輕度）三種收縮的分類（zh 第 79 行、en 第 79 行）
- 來源的層級是：兩大類 isotonic（等張）與 isometric（等長）；isotonic 再分 concentric 與 eccentric。文章直接排成並列三種，並說「依肌肉長度的變化分三種」。
- 來源在 eccentric 的措辭是 "muscle tension diminishes and the muscle lengthens"。文章寫「肌肉在出力的同時被拉長」。這與主流定義（主動出力下被拉長）一致，只是比 OpenStax 措辭強。
- 沒有造成事實錯誤，但文章沒有提到「等張收縮」，而樂詞網有此詞（見 §4）。這是簡化，不是錯。

M5 🔵（輕度）「捏紙…這對應到徵召更多運動單位和提高發送頻率」（zh 第 91 行／en 第 91 行）
- 文章前面已聲明「這是觀察，不是實驗」，但最後一句仍把主觀手感直接對應到兩個神經機制。來源只說這兩個機制調節力量（10.4），沒有說人能從手感分辨。
- 建議修法：縮回，例如「力量是一階一階加上去的，這就是徵召與發送頻率在做的事」，不要寫成「手感對應到機制」。

### 2.7 中英文版對照

| 項目 | zh | en | 判定 |
|---|---|---|---|
| tldr 的 ATP 範圍 | 「整串過程都要 ATP」 | "every step of the cycle needs ATP" | 範圍不一致，同為 M1 |
| 乳酸（第 64 行） | 乳酸累積讓細胞內酸鹼值「改變」 | lactic acid "lowering" the pH | 來源是 lower。中文較不具體，英文更貼原文。 |
| 大運動單位（第 70 行） | 「上千條」 | "thousands" | 「上千」≈ 至少一千，thousands ＝ 多個千。來源是 thousands，中文略保守。建議改「數千條」。 |
| 等長收縮的例子（第 83 行） | 拿不動的東西，或維持姿勢 | pushing on something that will not move, or holding a posture | 兩者都是等長。中文的「拿不動」對應來源的 "attempts to lift a hand weight that is too heavy"；英文的 "pushing on something that will not move" 不在來源。不算錯。 |
| 強直收縮 | 持續的強直收縮 | sustained contraction (tetanus) | 一致。 |
| 50 倍／六條／95%／幾秒 | 皆有 | 皆有 | 一致，且 zh 與 en 都保留「某些肌肉」「約」「roughly」等 hedge。 |
| 其餘六步驟、ATP 表格、運動單位、三種收縮、長度張力、練習、不涵蓋的範圍 | — | — | 逐段比對，沒有多出或少掉主張。 |
| 連結 | /posts/climbing/2026-10-18-climbing-energy-systems | …-en | 兩個目標檔案都存在（已確認檔案存在，未讀其內容或查證其內容）。 |

另外，英文版 frontmatter 的 `difficulty: 入門` 仍是中文，但 schema（`content.config.ts` 第 26 行 `z.enum(['入門','進階','深度'])`）要求就是中文列舉值，所以不是錯。

## 3. 數字專項

| 數字 | 文章位置 | OpenStax 原文 | 一致？ |
|---|---|---|---|
| 95% | 行 60 | 10.3：approximately 95 percent …「resting or moderately active muscles」 | 一致，限定條件（休息或中等活動）也保留 |
| 50 倍 | 行 74 | 10.4：In some muscles … 50 times more | 一致，hedge「某些肌肉」保留 |
| 六條纖維 | 行 70 | 10.4：every six or so fibers | 一致，「約」保留 |
| 幾秒 | 行 54 | 10.3：a few seconds | 一致 |
| 上千／thousands | 行 70 | 10.4：thousands of muscle fibers | 英文一致；中文略保守 |

**風險等級說明**：依 skill，統計數字屬高風險，要兩個獨立來源。這四頁以外，我只讀了兩篇 Wikipedia，它們沒有涵蓋 95%、六條纖維、50 倍；PMC、期刊頁都沒讀到。所以以上五個數字的 Confirmed 都是**對「唯一宣稱的來源 OpenStax」一致**，不是雙來源確認。作者在此文中本來就只依 OpenStax 單一來源，這點要在報告上明講。

文章沒有引入 OpenStax 以外的數字：沒有加上 15 秒、1 分鐘、80%–120%、3–4 倍等。沒有數字被放大或換單位。

## 4. 中文術語（台灣慣用）

證據層級：樂詞網只拿到搜尋索引的標題或相關詞片段，沒有 fetch 全文；這一欄的「確認」比上面內容宣告弱。

| 文章用語 | 樂詞網索引所見 | 判定與說明 |
|---|---|---|
| 肌節（sarcomere） | 標題為 **肌小節**（detail/975819）。 | 文章用「肌節」，樂詞網正名是「肌小節」。zh.wikipedia 寫「肌小節（即肌節、肌原纖維節）」，運動視界、部落格等也有人用「肌節」，所以「肌節」是台灣實際在用的說法，但不是樂詞網正名。建議在 glossary aliases 補上「肌小節」，才能讓搜尋到正名的讀者找得到。 |
| 肌動蛋白（actin） | actin - 肌動蛋白（detail/720569） | 一致。 |
| 肌凝蛋白（myosin） | myosin - 肌凝蛋白（detail/346702）；另一筆為「肌凝蛋白；肌球蛋白」 | 一致。 |
| 運動單位（motor unit） | motor unit - 運動單位（detail/134372、222094） | 一致。 |
| 橫小管（transverse tubule） | transverse tubule {= T tubule} - 橫小管（detail/5461314） | 一致。 |
| 肌漿網（sarcoplasmic reticulum） | sarcoplasmic reticulum - 肌漿網（detail/35650）；另有「肌漿網狀體」 | 一致。 |
| 乙醯膽鹼（acetylcholine） | acetylcholine - 乙醯膽鹼（detail/1211220） | 一致。 |
| 神經肌肉接合處（NMJ） | neuromuscular junction - **神經肌肉接合點**（detail/72246） | 樂詞網是「接合點」，文章用「接合處」。兩者語意相同，「接合處」在教科書也常見，但不是正名。 |
| 向心收縮 | Concentric Contraction - 向心收縮（detail/1294782） | 一致。 |
| 離心收縮 | 「eccentric」詞條的相關詞列出「離心收縮 eccentric contraction」（detail/2768078 片段） | 一致，證據來自相關詞片段。 |
| 等長收縮 | 「Isometric Contraction - 等長性收縮」，相關詞含「等長收縮 isometric contraction」（detail/3681340 片段） | 一致，正名偏「等長性收縮」，「等長收縮」也在相關詞內。 |
| （文章未用）等張收縮 | Isotonic Contraction - 等張收縮（detail/1295175） | 文章沒用這個詞，見 M4。 |
| 肌鈣蛋白（troponin） | **沒找到**。檢索只回傳「tropomyosin - 原肌凝蛋白」，且其相關詞出現怪異的「旋光素-旋光肌蛋白複體 troponin-tropomyosin complex」。 | 🟡 Unverifiable。樂詞網索引沒給出 troponin 的正名。其他台灣網頁（Medium 筆記、運動視界）用「肌鈣蛋白」，zh.wikipedia 簡體頁用「肌钙蛋白」，所以此詞常見，但本次沒有取得樂詞網確認。 |
| 徵召（recruitment） | 通用詞「Recruitment - 招募」（detail/957092）；沒有找到肌肉脈絡的條目。 | 🟡 Unverifiable。glossary 已列「募集」為別名。台灣肌肉生理脈絡常見「徵召」或「募集」，但本次沒找到權威確認。 |
| 強直收縮（tetanus） | 「tetanus - 強直性痙攣」（detail/3280696） | 🟡 Unverifiable。樂詞網索引的 tetanus 條目是「強直性痙攣」，沒有看到肌肉生理的「強直收縮」。注意 tetanus 在中文同時是破傷風與肌肉強直，文章在肌肉脈絡下用「強直收縮」且附 tetanus，風險低，但沒拿到樂詞網確認。 |

## 5. 授權宣告與合規

- 文章末段「以上教科書章節授權為 CC BY-NC-SA 4.0」：**Confirmed**。OpenStax 章節頁（Citation/Attribution 區）寫 "Creative Commons Attribution-NonCommercial-ShareAlike License"，頁尾寫 CC BY NC-SA 4.0。
- 同一處還寫：非商業再散佈時「必須以相同 CC BY-NC-SA 授權衍生作品，並在每個數位頁面附上 'Access for free at <原書網址>'」。這篇自稱「改寫與重新組織」，等於衍生作品。文章沒有寫衍生作品的授權、也沒有附上這行出處。**這是授權合規問題，不是事實錯誤**，且 quidproquo.cc 是否算「非商業」不是我能判斷的，建議作者決定。這不屬於 Tier 0 自動動作，我沒有改任何檔案。
- 「圖文均非原書內容」：文章沒有圖。文字是改寫，但幾個具體例子與結構非常接近原文（划槳比喻、羽毛與肱二頭肌、眼外肌約六條）。這些事實本來就取自來源，文章也有標示出處，所以不算越界。

## 6. 文章有沒有「替來源加上它沒說的主張」

有，共 4 處（M1、M2、M3 為主，另加 §2.5 的 #36）：

1. 「整串過程都要 ATP」：比來源與自己的正文寬。
2. 「ATP 是瓶頸」：來源沒說，且與來源「原因不明」的措辭緊張。
3. 「不是輪流上場」：來源是依序措辭；這是作者的、且在這篇裡沒有證據的主張。
4. 「受傷或進步的來源」：來源只對疲勞有討論。

「把推論寫成事實」：M2（框架）、M5（手感對應機制）、#20 的「能長時間供應」（推論輕、風險低）。

「歸因標籤」：全篇沒有堆疊歸因標籤（只有「教科書的說法是」「教科書拿划船的槳來比喻」兩處），沒有超過 3 處，不需合併。

## 7. 對照主流生理學

在能讀到的資料範圍內（Wikipedia 兩篇全文 + 搜尋摘要線索），沒有發現與主流衝突的陳述。需要作者知道的細緻處：

- 疲勞：Wikipedia 把疲勞分神經性（nervous）與代謝性（metabolic）兩類；本文的疲勞段只列肌肉內因素，這是因為 OpenStax 把疲勞定義為「無法再對神經訊號收縮」。文章用「教科書的說法」限定，成立；但標題「ATP 是瓶頸」會讓讀者以為全部原因就是 ATP（M2）。
- 乳酸：Wikipedia 寫乳酸的影響「現在不確定」，與文章「別全推給乳酸」同向。
- 徵召：Wikipedia 說大小原則（size principle）是一般規律，但某些情況下順序可被改變，機制仍有爭論。文章沒寫例外，來源也沒寫，屬於教科書層級的簡化。
- 磷酸肌酸時間：Wikipedia 寫約 5 到 7 秒，OpenStax 寫約 15 秒，各書不一。文章沒寫數字，避開了這個分歧。
- 頻率編碼：Wikipedia 寫頻率編碼使力量變化約 2 到 4 倍；OpenStax 寫不完全強直約為單次抽動的 3 到 4 倍。文章沒寫數字。

這些都不需要改文章，列出是讓作者知道哪裡是來源之間本來就有出入。

## 8. 範圍聲明與未驗項目

本次只檢查了文中已提出的宣告（約 36 條，加上 5 條 Misframed 檢視、中英對照與 14 個術語），**未評估文章對主題的覆蓋是否完整**。全綠不代表該寫的都寫了，覆蓋與可讀性交給 `post-review`。

未驗證或證據偏弱：
- 沒有取得任何 PMC／期刊全文；「獨立來源」實際只有 2 篇 Wikipedia。
- 樂詞網是索引標題層級的證據，沒有 fetch 到詞條全文；troponin、徵召、強直收縮三詞沒找到權威對應。
- 台灣教科書／衛教頁面沒有 fetch 全文。
- 文章中的兩個「今晚就能做的動作」是作者自製的觀察，不是來源例子，也沒有實際執行；只檢查了它們使用的術語與機制對應。
- 連到自家攀岩文章的連結只確認檔案存在，沒查證那篇內容。

下一步（未完成前不能 commit）：post-review、post-polish
