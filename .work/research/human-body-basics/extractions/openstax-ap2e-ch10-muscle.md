# 精讀紀錄：OpenStax《Anatomy and Physiology 2e》第 10 章 肌肉組織 §10.1–10.6

- 性質：**開放授權教科書**（CC BY-NC-SA 4.0），不是研究論文。是「已確立的基礎知識」的來源，不是「新證據」的來源。本站用的時候要標出處章節，且因為 NC 條款，不能把原文大段貼進文章，只能改寫與短句引用。
- 網址：`https://openstax.org/books/anatomy-and-physiology-2e/pages/10-1-overview-of-muscle-tissues`（§10.2 到 §10.6 同路徑，頁名依序為 `10-2-skeletal-muscle`、`10-3-muscle-fiber-contraction-and-relaxation`、`10-4-nervous-system-control-of-muscle-tension`、`10-5-types-of-muscle-fibers`、`10-6-exercise-and-muscle-performance`）。
- 讀取紀錄：六節的頁面主文各自完整抓回（Groundlane `web_fetch`，`format=text`，六次回傳皆 `truncated: false`），從各節學習目標讀到結尾。
- **沒讀到的部分：** 圖（Figure 10.2–10.20，純文字抽取沒有圖）、各節內嵌的影片連結（Interactive Link）、章末複習題、§10.7 之後（心肌與平滑肌細節不在範圍）。
- **引文核對狀態：** 引文是我直接從抓回的文字複製。**沒有做程式比對**，因為這個環境的 `curl` 連不到 `openstax.org`（需要把 `openstax.org` 加進環境的 Allowed domains 才能比對）。前一份 Lazarczuk 精讀紀錄有做程式比對，這份沒有，寫文章前要在能連線時補比對。
- 書的版本與作者：頁面主文沒顯示，前言頁（`/pages/preface`）本輪沒讀。**引用時的作者、版本、出版日期要再補。**

## 可以寫進第 2 篇的基礎知識（教科書陳述）

| # | 內容 | 位置 | 原文 |
|---|---|---|---|
| 1 | 骨骼肌完全靠神經訊號才能運作 | §10.1 | "skeletal muscle completely depends on signaling from the nervous system to work properly" |
| 2 | 肌肉由三層結締組織包住，肌肉出的力經由結締組織傳給肌腱再拉動骨頭 | §10.2 | "The tension created by contraction of the muscle fibers is then transferred through the mysia, to the tendon, and then to the periosteum to pull on the bone for movement of the skeleton." |
| 3 | 肌節是肌纖維的功能單位 | §10.2 | "The sarcomere is the functional unit of the muscle fiber." |
| 4 | 肌肉收縮的順序：運動神經元放出乙醯膽鹼 → 肌纖維膜產生動作電位 → 鈣離子從肌漿網釋出 → 鈣與肌鈣蛋白結合露出肌動蛋白的結合位 → 肌凝蛋白拉動肌動蛋白 | §10.2、§10.3 | "The muscle fiber action potential... is 'coupled' to the actual contraction through the release of calcium ions (Ca++) from the SR." |
| 5 | 沒有 ATP，肌凝蛋白頭放不開肌動蛋白 | §10.3 | "In the absence of ATP, the myosin head will not detach from actin." |
| 6 | 肌肉內儲存的 ATP 很少 | §10.3 | "The amount of ATP stored in muscle is very low, only sufficient to power a few seconds worth of contractions." |
| 7 | 三條補 ATP 的途徑：磷酸肌酸約 15 秒、糖解約 1 分鐘、有氧呼吸供應休息或中等活動時約 95% 的 ATP | §10.3 | "creatine phosphate can only provide approximately 15 seconds worth of energy"；"Glycolysis itself cannot be sustained for very long (approximately 1 minute of muscle activity)"；"Approximately 95 percent of the ATP required for resting or moderately active muscles is provided by aerobic respiration" |
| 8 | 疲勞的確切原因還不清楚 | §10.3 | "The exact causes of muscle fatigue are not fully known" |
| 9 | 肌肉變大是肌纖維變粗，不是變多（教科書陳述，見下方「待核對」） | §10.3、§10.6 | "The number of skeletal muscle fibers in a given muscle is genetically determined and does not change."；"new cells are not formed when muscles grow" |
| 10 | 運動單位：一個運動神經元與它支配的全部肌纖維。小運動單位做精細動作，大運動單位做大力量，用力越大，越多、越大的運動單位被招募 | §10.4 | "Each muscle fiber is innervated by only one motor neuron."；"This increasing activation of motor units produces an increase in muscle contraction known as recruitment." |
| 11 | 三種收縮：向心（縮短）、離心（拉長時出力）、等長（長度不變） | §10.4 | "A concentric contraction involves the muscle shortening to move a load."；"An isometric contraction occurs as the muscle produces tension without changing the angle of a skeletal joint." |
| 12 | 長度–張力關係：肌節約在靜止長度的 80% 到 120% 時出力最大 | §10.4 | "The ideal length of a sarcomere to produce maximal tension occurs at 80 percent to 120 percent of its resting length" |
| 13 | 肌肉很少完全放鬆，平時有低程度的張力（肌張力） | §10.4 | "Skeletal muscles are rarely completely relaxed, or flaccid." |
| 14 | 肌纖維分三型：慢氧化、快氧化、快糖解；快纖維水解 ATP 的速度約為慢纖維的兩倍 | §10.5 | "Fast fibers hydrolyze ATP approximately twice as quickly as slow fibers" |
| 15 | 多數肌肉含三型纖維，比例依主要功能而定 | §10.5 | "Most muscles possess a mixture of each fiber type." |
| 16 | 久不活動 → 萎縮（蛋白質流失），不是纖維數量減少 | §10.3、§10.6 | "The reverse, when structural proteins are lost and muscle mass decreases, is called atrophy." |
| 17 | 運動後痠痛與細胞損傷有關，修復時加入新的結構蛋白 | §10.6 | "This muscle damage contributes to the feeling of soreness after strenuous exercise" |

## 教科書自己的不一致或過時

1. **糖解的 ATP 產量前後不同：** §10.3 一處寫"a net gain of two ATPs per molecule of glucose"，另一處比較有氧與糖解時寫"approximately 36 ATPs per molecule of glucose versus four from glycolysis"。同一節內「2」與「4」並存。引用時只能用「有氧呼吸比糖解有效率得多」，不寫任何 ATP 個數。
2. **"oxygen debt"（氧債）** 是教科書沿用的舊術語。我的印象是近年文獻多改稱運動後過量耗氧（EPOC），但這是我的記憶，**本輪沒查證**；用到時要用一手來源核對。
3. **磷酸肌酸供應時間：** §10.3 正文一處寫"powers the first few seconds"，另一處寫"approximately 15 seconds"。兩處並存，不要精確到秒。
4. **疲勞原因：** §10.3 同時說乳酸"may contribute to muscle fatigue"並說"exact causes... not fully known"。不能把「乳酸造成痠痛或疲勞」寫成定論。
5. 文字小誤：§10.5 "all three types"句中"contain(s)"。

## 與本系列其他來源的對照（待核對，不能直接沿用教科書的說法）

這部分是我把教科書的說法對照已讀過的資料，**多數對照對象本輪尚未精讀**，所以這裡只標出需要核對的點。

| 教科書說法 | 對照 | 處理 |
|---|---|---|
| §10.6 "continued weight lifting without increasing the weight of the load does not increase muscle size... the weights lifted must become increasingly heavier" | order 6 的候選（Refalo 2023、Lopez 2021、ACSM 2026）談的是負荷高低與是否接近力竭，我還沒精讀；ACSM 新聞稿（二手）說低到高負荷在努力足夠時肌肥大沒有顯著差異 | **不可複述教科書這句為事實。** 寫第 2 篇時只講機制，劑量留給 order 6 |
| §10.6 阻力訓練"Tendons also become stronger" | Lazarczuk 2022（已精讀）量的是**硬度、模數、截面積**，不是斷裂強度 | 寫成「肌腱會變硬」，不寫「變強」 |
| §10.6 阻力訓練"There is usually no significant increase in mitochondria or capillary density" | 未精讀任何對照來源 | 不引用 |
| §10.3、§10.6 肌纖維數量固定、肌肉增大只靠變粗 | 未用一手文獻核對；這是教科書常見簡化，我印象中人體肌纖維增生是否發生仍有討論，**但這是我的記憶，未查證** | 寫成「教科書的說法是…」並標待核對，或乾脆不寫 |
| §10.6 年齡造成的肌萎縮（肌少症）"is irreversible"，但運動可"delayed to some extent" | order 16 的候選（Yan 2025、Ran 2025 肌少症阻力訓練回顧）的摘要顯示阻力訓練對肌少症老人有改善；**我只讀過摘要** | **與教科書衝突，不可沿用「不可逆」**，留到 order 16 用一手來源處理 |
| §10.5 SO／FO／FG 命名 | 運動科學文獻常用 Type I／IIa／IIx。我的印象是兩套對應，但教科書這一節沒有對照，**未查證** | 寫文章時只選一套命名並說明；對照要有來源 |
| §10.4 "treppe"（樓梯效應）：久不活動後最初幾次收縮的力約為後面的一半，"It is believed"是鈣濃度造成 | 這可連到 order 9 暖身。教科書說法是推測（"It is believed"），未見其他來源 | 引用時保留「教科書認為」的語氣，不寫成暖身有效的證據 |

## 這份來源不能做的事

- 不能證明任何訓練方法有效，它講的是機制與基礎生理，不是介入研究。
- 不能引用補充劑、類固醇、生長激素的段落（超出母群邊界）。
- 英文教科書，繁體中文術語要另查（例：sarcomere 肌節、motor unit 運動單位、recruitment 招募、treppe 階梯現象）。台灣慣用譯名**本輪沒查**。

## 對第 2 篇的用途（草稿，非定稿）

- 可寫成一句：「骨骼肌的收縮從神經訊號開始，經過鈣離子和 ATP，讓肌肉裡面的蛋白質一格一格滑動；所以肌肉要靠神經才會出力，也要不斷補充能量。」
- 篇內要放的限制：本篇只講機制，不講訓練劑量；教科書的幾個說法（肌纖維數量、肌肉成長一定要加重、肌少症不可逆）不沿用。
- 與站內連結：order 3（肌腱）、order 4（能量系統）、order 6（肌力）、order 7（神經適應，§10.4 運動單位為主要依據）。

## 待補（讓第 2 篇可以動筆）

1. 在可以連到 `openstax.org` 的環境補做引文程式比對，或請你把 `openstax.org` 加進環境的 Allowed domains。
2. 讀前言頁取得作者、版本、出版日期。
3. 查台灣慣用的中文術語（肌節、運動單位、招募、離心收縮等）。
4. 把「肌纖維數量固定」這一點用一手文獻核對，或決定不寫。
