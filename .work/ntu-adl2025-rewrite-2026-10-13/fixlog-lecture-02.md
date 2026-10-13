# 第 2 堂（神經網路與反向傳播）修稿紀錄

- 日期：2026-10-13
- 依據報告：`review2-lecture-02.md`（必修 1 項、建議 8 項）
- 修改檔：`src/content/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop.md`（zh）、`…-backprop-en.md`（en）
- 結果：報告 9 項全部已改，沒有不改的項目；另依任務指示改 2 處（英文「常見的誤解」說明句、中文對應句）。
- 查證方式：`transcripts/2.1.txt` 全文、`lecture-02-captions.txt` 相關時間段；nn.pdf 第 6、23、28、39、51、65、86、90、91、92 頁與 bp.pdf 第 29、31 頁轉圖讀過。

## M1（必修）2.1 的核對說明與現況不符：已改

依據：`transcripts/2.1.txt` 存在，00:00–04:35；[02:56]–[04:35] 講三個步驟（model 是 function set 的定義、什麼叫好的 function、怎麼找最好的，第三步稱 Optimization），與 nn.pdf 第 6 頁 Q1／Q2／Q3 一致。

- description
  - zh 改前：「及影片 2.2–2.5 的課堂口述」→ 改後：「及影片 2.1–2.5 的課堂口述」
  - en 改前："the spoken content of videos 2.2–2.5" → 改後："the spoken content of videos 2.1–2.5"
- 課程影片來源的內容核對句
  - zh 改前：「內容核對：已依字幕核對（2026-10-13）：2.2、2.3、2.4、2.5 四支都依字幕整理；2.1（4:41）沒有可取得的字幕，未對照。」
  - zh 改後：「內容核對（2026-10-13）：2.2、2.3、2.4、2.5 依字幕整理；2.1（4:41）沒有字幕軌，改以機器轉錄逐字稿對照，三個問題的拆法與講義第 6 頁一致。」
  - en 改前："Content check: verified against the video transcript (2026-10-13): 2.2, 2.3, 2.4, and 2.5 were all worked from their captions; 2.1 (4:41) has no obtainable transcript and was not checked."
  - en 改後："Content check (2026-10-13): 2.2, 2.3, 2.4, and 2.5 were worked from their captions; 2.1 (4:41) has no caption track and was checked against a machine transcript, whose three-question breakdown matches page 6 of the deck."
- 更新紀錄 2026-10-13 那一條（報告點名「依四支影片」連帶要改，沒有給建議文字，這句是我寫的）
  - zh 改前：「依四支影片的課堂口述重寫全文，」→ 改後：「依影片的課堂口述重寫全文（2.2–2.5 依字幕，2.1 以機器轉錄逐字稿對照），」
  - en 改前："from the spoken content of four videos, adding" → 改後："from the spoken content of the videos (2.2–2.5 from captions, 2.1 checked against a machine transcript), adding"

## S1 overfitting 圖的數字：已改

依據：nn.pdf 第 92 頁轉圖，標題「Fitting training data」，三格圖例是 Training data (MSE = 1.37)／(MSE = 0.70)／(MSE = 0.52)，第三格 Degree = 10。字幕 2.4 [51:00] 唸了 1.37、0.7（字幕把 mean square error 聽成 minus square error）與「設到 14 方」。

- zh 改前：「圖上標的誤差是 1.37；二次方能畫出接近的曲線，誤差 0.70；次方很高的模型（圖上是 10 次方，影片口述成十四次方）可以更貼近訓練資料，training 的誤差可能更低，但曲線…」
- zh 改後：「圖上標的訓練資料 MSE（mean squared error）是 1.37；二次方能畫出接近的曲線，MSE 是 0.70；次方很高的模型（圖上是 10 次方，影片口述成十四次方）在訓練資料上的 MSE 更低，圖上標 0.52，但曲線…」
- en 改前："and the error marked on the figure is 1.37. Degree 2 draws a curve close to the true one, with an error of 0.70. A model of very high degree (…) can fit the training data more closely and may get a lower training error, but the curve…"
- en 改後："and the figure marks its MSE (mean squared error) on the training data as 1.37. Degree 2 draws a curve close to the true one, with an MSE of 0.70. A model of very high degree (…) gets a lower training MSE still, 0.52 on the figure, but the curve…"
- 與報告建議文字的差別：保留原句「二次方能畫出接近的曲線」，並在 MSE 第一次出現時加上全名（老師在 [51:00] 口頭唸過全名，不是來源外的補充）。

## S2 learning rate「兩側跳來跳去」：已改

依據：字幕 2.4 [39:03]「反而到達了一個 cost 更高的地方」、[42:00]「略過了這個實際上是 minimal 的點，所以我就會卡在這邊，loss 也下不去」；nn.pdf 第 86 頁轉圖，Very Large 曲線上升，Large 曲線很快停住，右圖綠色箭頭跨過深谷停在另一側平台，沒有來回跳。

- zh 改前：「太大，一步跨過最低點，loss 反而變高，或在最低點兩側跳來跳去下不去；太小，下得去但非常慢。」
- zh 改後：「太大，一步跨到 cost 更高的地方；稍微小一點但還是太大，會略過最低點、卡在別處，loss 降不下去；太小，下得去但非常慢。」
- en 改前："Too large, and one step jumps past the minimum so the loss goes up, or bounces between the two sides without descending. Too small, and it descends very slowly."
- en 改後："Too large, and one step lands somewhere with a higher cost. Somewhat smaller but still too large, and it skips past the minimum and gets stuck elsewhere, so the loss stops falling. Too small, and it descends very slowly."

## S3 「講義這幾頁沒有寫 bias」：已改

依據：bp.pdf 第 29 頁 Forward Pass 寫了 `z^l = W^l a^(l-1) + b^l`；第 31 頁 ∇C(θ) 向量列了 `∂C(θ)/∂b_i^l`，沒有它的算式。

- zh 改前：「講義這幾頁沒有寫 bias。照同樣的拆法可以補上（本文補充）：」
- zh 改後：「講義只推導了權重的梯度；第 31 頁的梯度向量裡列了 ∂C/∂b，但沒有寫它怎麼算。照同樣的拆法可以補上（本文補充）：」
- en 改前："These pages of the deck do not cover the bias. The same split gives it (my own addition):"
- en 改後："The deck derives only the weight gradients. Page 31 lists ∂C/∂b in the gradient vector but does not say how to compute it. The same split gives it (my own addition):"

## S4 符號對照的 `x = a^0`：已改

依據：nn.pdf 第 39 頁轉圖寫 `a^1 = σ(W^1 x + b^1)`、`a^L = σ(W^L a^(L-1) + b^L) = y`，沒有 a^0；bp.pdf 第 29 頁把 l = 1 另列成 x_j。

- zh 改前：「整個網路就是把 `x = a^0` 一層層套這兩條式子，直到輸出層 `y = a^L`。」
- zh 改後：「整個網路就是從輸入 x 開始一層層套這兩條式子（第一層用 x 取代 a^(l−1)），直到輸出層 `y = a^L`（第 39 頁）。」
- en 改前："The whole network applies these two lines layer by layer from `x = a^0` up to the output layer `y = a^L`."
- en 改後："The whole network applies these two lines layer by layer starting from the input x (the first layer uses x in place of a^(l−1)) up to the output layer `y = a^L` (page 39)."

## S5 第一次提到講者要點名：已改

- en 改前："which the instructor says is the usual case in practice."
- en 改後："which Yun-Nung Chen, the instructor, says is the usual case in practice."
- zh 改前：「老師說實際應用多半是後者。」→ 改後：「陳縕儂老師說實際應用多半是後者。」（報告標「可不改」，照任務指示一併改）
- 依據：這是正文第一次指稱講者；字幕 2.2 [03:06] 前後講 binary 與 multi-class。

## S6 兩處頁碼標得太寬：已改

依據：nn.pdf 第 23 頁轉圖是單一斜坡（"location, orientation, and steepness of cliff"），第 28 頁只有 ridge 與 bump；第 90、91 頁是流程圖，第 92 頁是 overfitting 圖。

- zh 改前：「第 28 頁用圖說明表達力怎麼長出來：」→ 改後：「第 23 與 28 頁用圖說明表達力怎麼長出來：」
- en 改前："Page 28 illustrates how expressive power grows:" → 改後："Pages 23 and 28 illustrate how expressive power grows:"
- zh 改前：「除錯的順序（第 90–92 頁）：」→ 改後：「除錯的順序（第 90–91 頁）：」
- en 改前："The debugging order (pages 90–92):" → 改後："The debugging order (pages 90–91):"

## S7 兩處簡化過的式子沒註明：已改

依據：nn.pdf 第 51 頁轉圖 `C(θ) = Σ_k ‖ŷ_k − f(x_k; θ)‖`，字幕 2.3 [06:00]「error 的絕對值加總」；第 65 頁轉圖 `C(θ) = Σ_∀x ‖ŷ − f(x; θ)‖ = (ŷ − f(x; θ))²`。

- zh 改前：「最直接的 loss 就是把每筆資料「預測值與真實值的差的絕對值」加總起來。」
- zh 改後：「最直接的 loss 是把每筆資料預測與答案的差距加總（第 51 頁寫成範數 ‖ŷ − f(x; θ)‖，老師口頭說成差的絕對值）。」
- en 改前："The most direct loss sums, over all examples, the absolute difference between the prediction and the true value."
- en 改後："The most direct loss sums, over all examples, the gap between prediction and answer (page 51 writes it as a norm ‖ŷ − f(x; θ)‖; she calls it the absolute difference)."
- zh 改前：「loss 用 square error，C = (y − ŷ)²。」
- zh 改後：「loss 用 square error；講義第 65 頁是對所有資料加總，這裡和第 68 頁的推導一樣只看一筆：C = (y − ŷ)²。」
- en 改前："…, and the loss is square error, C = (y − ŷ)²."
- en 改後："…. The loss is square error. Page 65 sums it over all examples; as in the derivation on page 68, this looks at one example: C = (y − ŷ)²."
- 註：第 68 頁這次沒有轉圖，「第 68 頁推導時省掉加總」沿用報告的查證結果。

## S8 更新紀錄的查核歷程收斂：已改

- zh 改前（三條）：「2026-10-10：標註影片狀態，核對錄影來源與取得方式。」「2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。」「2026-10-10：依字幕核對影片內容。2.2 字幕與文章 Q1 各段相符；2.1 取不到字幕，未核對內容；補註兩支都是 2023/09/14 的舊錄影。」
- zh 改後（一條）：「2026-10-10：標註影片狀態，核對錄影來源；2.1、2.2 是 2023/09/14 的舊錄影。」
- en 改前（三條）："Added explicit video status and checked recording sources and access notes." / "Rechecked video status. The embedded videos match the lectures on the official course page and playlist." / "Checked the video content against its transcript. 2.2 matches the Q1 sections; 2.1 had no transcript, so its content was not checked; both are older recordings dated 2023/09/14."
- en 改後（一條）："2026-10-10: Added video status and checked recording sources; 2.1 and 2.2 are older recordings dated 2023/09/14."
- 依據：契約規定查核歷程不放文章；「2.1 取不到字幕」與 M1 同一件事。

## 任務指示的其他項目

- 「常見的誤解」說明句（任務第 3 點）
  - en 改前："These are my own summary of the lecture." → 改後："This list is my own summary, not something the lecture enumerated point by point."
  - zh 改前：「這幾條是我依課堂內容整理的。」→ 改後：「這份清單是我依課堂內容整理的，不是老師逐條列出的。」（任務只指定英文，中文為了兩版一致同步改）
- 「優化」與其他中國用語（任務第 2 點）：掃過中文版，沒有命中，未改。
- 粗體 `**詞（說明）**` 後面直接接字（任務第 4 點）：兩檔掃過，沒有這種寫法，未改。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
- 兩檔修改後各 420 行，仍逐行對齊。
