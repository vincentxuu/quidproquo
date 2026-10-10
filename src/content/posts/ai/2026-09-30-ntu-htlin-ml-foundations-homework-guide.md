---
title: "林軒田機器學習基石作業導讀：Fall 2024 HW0–HW5 練什麼、要什麼資料，附 Fall 2026 hw0／hw1"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide, homework]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 17
tldr: "Fall 2024 的基石作業共六份：HW0 是 20 題數學先修選擇題；HW1–HW5 每份 12 題加 1 題 bonus，Q1–4 自動批改、Q5–12 助教批改，程式題用 LIBSVM 網站上的 rcv1、cpusmall、mnist 資料，HW5 要用 LIBLINEAR。HW1、HW2 各有一題要你拿 ChatGPT 類工具的回答來反駁。Fall 2026 已公開 hw0 與 hw1：hw1 改成 16 題全選擇題、抽 4 題由助教細改，資料換成課程自己給的 hw1_train.dat；新 policy 允許用 AI 與 vibe coding，但 AI 產生的程式要逐段用自己的話寫註解。兩個學期都沒有公開官方解答。"
description: "台大林軒田《機器學習基石》Fall 2024 HW0–HW5 逐份導讀：每份作業的發布與截止日、對應講次、每題練的概念、程式題的資料集與工具（LIBSVM datasets、LIBLINEAR）、評分格式；Fall 2026 hw0／hw1 與 Fall 2024 的差異，以及兩個學期的 AI 使用政策。不給解答，只給可自我驗證的方法。"
draft: false
glossary:
  - term: "LIBSVM datasets"
    aliases: ["LIBSVM data sets", "libsvmtools datasets"]
    definition: "台大林智仁實驗室整理的公開資料集網頁，檔案採 LIBSVM 的稀疏格式：每行第一個數字是標籤，其餘是「索引:值」。"
    context: "林軒田 Fall 2024 基石作業的 rcv1、cpusmall、mnist 都從這裡下載。"
    links:
      - label: "LIBSVM Data"
        url: "https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/"
  - term: "gold medal"
    aliases: ["金牌", "late half-day"]
    definition: "林軒田課程給每位學生的四個免罰遲交額度，每個是半天（12 小時），可以集中用在一份作業或分散使用。沒有額度時，遲交每 12 小時扣 10%。"
    context: "寫在 Fall 2024 與 Fall 2026 的 policy.pdf。"
    links:
      - label: "Fall 2026 policy"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 17 篇。前 16 篇依講次走完 MOOC，這一篇回頭整理[《機器學習基石》](https://www.csie.ntu.edu.tw/~htlin/mooc/)部分的作業。

**作業基準用 Fall 2024。** 理由很簡單：[Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)已結課，HW0–HW7 的題目 PDF 全部公開；[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 還在第 4 週，只公開了 hw0 和 hw1。本篇最後一節會對照這兩份。

**存取等級：A3，但評分鏈除外。** 題目與資料都能自己拿到，缺的是：

1. **沒有官方解答。** 兩個學期的課程頁與作業子頁都沒有解答檔。
2. **評分只限修課生。** 作業交到 Gradescope，討論在 Discord 與 NTU COOL（Fall 2024 是 40495，Fall 2026 是 63348），都需要修課身分或台大帳號。

所以本篇**不給答案**，只說每題在練什麼、需要什麼資料，以及怎麼自己驗證結果。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 課程影片來源

未核對到本文專屬的公開講次影片；請從官方課程入口查找錄影與教材。

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 作業長什麼樣

### Fall 2024 的格式

每份作業 PDF 開頭都寫了規則。HW1–HW5 共通的格式：

- **200 分加 20 分 bonus**，12 題加 1 題 bonus。
- **Q1–Q4 自動批改**，每題 10 分，在 Gradescope 上選答案。
- **Q5–Q12 助教批改**，每題 20 分，要上傳掃描或列印的解答。程式題另外要附程式碼第一頁的截圖，證明是自己寫的。
- **Q13 是 bonus**，同樣由助教批改。
- 解答用英文或中文寫，任何程式語言都可以。
- HW5 起試行「clarity bonus」：助教認為答案正確又特別清楚時，每題可以多給最多 2 分。

HW0 不一樣：20 題選擇題，每題 2 分共 40 分，只要在 Gradescope 上選答案，不用上傳解答。

作業發布後常有「red correction」，也就是用紅字修正題目的版本，檔名會帶 `_red`。HW1–HW4 都有，HW5 沒有。

### 兩個學期的 policy

遲交規則兩學期相同：每遲 12 小時（不足 12 小時也算）扣 10%；每人有四個 **gold medal**，每個抵半天遲交。

真正不同的是 AI 與套件的規定：

| | [Fall 2024 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/policy.pdf) | [Fall 2026 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf) |
|---|---|---|
| AI 工具 | 書、筆記與網路資源（包括但不限於 chatGPT）可以參考，不能照抄 | 可以用 AI 工具協助，但不能直接把 AI 輸出當成自己的交出去；強烈建議保存 prompt 與對話紀錄，出現原創性疑慮時可以拿出來證明 |
| 分享 | 借出或借入解答、程式碼都算不誠實 | 同左，而且明確把 **AI 對話紀錄**也列進去 |
| 程式套件 | 不能用「sophisticated packages」，能用什麼要先問助教 | 任何平台、語言、套件都可以，包括（vibe）coding 工具；但程式若由生成式 AI 產生，**要逐段用自己的話寫註解**，說明程式邏輯 |
| 繳交 | 自動批改＋助教批改 | 選擇題自動批改，另外要上傳推導過程與程式碼；沒有推導的答案、沒有原始碼的程式題一律零分 |

Fall 2026 policy 的第 4 節標題就叫「Collaboration, Open-Book, and Open-AI」，註腳補了一句「not the company」。

**怎麼做**：自學時照 Fall 2026 的規則做最有用。可以讓 AI 幫你寫程式，但每一段都用自己的話寫註解；寫不出註解的段落，就是你還沒懂的地方。

## 總表

| 作業 | 發布 → 截止（2024） | 對應講次 | 程式題資料 |
|---|---|---|---|
| [HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf) | 09/02 → 10/07 | 數學先修 | 無 |
| [HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf) | 09/09 → 10/07 | L1–L3 | LIBSVM `rcv1_train.binary` |
| [HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) | 09/23 → 10/07 | L4–L7 | 程式自己產生 |
| [HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) | 10/07 → 10/21 | L6–L10 | LIBSVM `cpusmall_scale` |
| [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) | 10/21 → 11/04 | L10–L14 | `cpusmall_scale` |
| [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) | 11/04 → 11/18 | L13–L16，外加技法 T1 一題 | LIBSVM `mnist.scale`，工具 LIBLINEAR |

HW0、HW1、HW2 三份都在 10/07 截止，所以前五週其實是一口氣寫三份。資料集都在 [LIBSVM Data](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) 網頁上，截至 2026-09-30 仍可下載。

## HW0：先修自我檢測

20 題分三塊：組合與機率（Q1–6）、線性代數（Q7–13）、微積分與最佳化（Q14–20）。內容包括二項式係數的遞迴、條件機率、樣本變異數、反矩陣與特徵值、SVD 與虛擬反矩陣、半正定矩陣、超平面之間的距離、連鎖律、梯度、二次式的最小值，以及用 Lagrange 乘數解有等式和不等式限制的問題（Q19–20）。

這些不是隨便挑的。虛擬反矩陣會在 L9 線性迴歸出現，超平面距離是技法 T1 的 margin，Lagrange 乘數是 T2 對偶 SVM 的起點。

**怎麼做**：限時一小時寫完。每題都能用 numpy 或 sympy 驗算，例如 `np.linalg.inv`、`np.linalg.eigvals`、`sympy.diff`。錯超過五題，先補線代與微積分再開始 L1。

## HW1：PLA 與學習的種類（L1–L3）

- **Q1**：哪個任務最適合用機器學習（L1 的判斷條件）。
- **Q2–4**：PLA 的性質。Q2 是每筆資料剛好更新一次後的 w<sub>0</sub>；Q3、Q4 問把輸入縮小一半或正規化之後，L2 第 19 頁的更新次數上界怎麼變。
- **Q5–6**：拿兩個問題去問任一個 ChatGPT 類的 agent（「active learning 可能的應用是什麼」「機器學習能不能預測地震」），列出回答，再用 10–20 句英文「以老闆的身分」論證你同不同意。題目特別註明：助教比較習慣被人說服，寫得不像人寫的就可能說服不了。
- **Q7–8**：把 x<sub>0</sub> 從 1 改成 2，或整筆資料乘 3，PLA 的結果是否等價，要證明或舉反例。
- **Q9**：用 online PLA 偵測仇恨文章，推導最多犯錯次數的上界（L3 的 online learning）。
- **Q10–12（程式）**：下載 `rcv1_train.binary`，取前 200 行，x ∈ ℝ<sup>47205</sup>。實作隨機挑樣本的 PLA，連續 5N 次檢查都正確就停。重複 1000 次畫更新次數的直方圖（Q10）；疊畫 1000 條 ‖w<sub>t</sub>‖ 曲線（Q11）；改成「同一筆一直修到對為止」再比一次（Q12）。
- **Q13（bonus）**：一個保證更新後就分對的 PLA 變形，證明它在線性可分時會停。

**怎麼驗證**：Q10–12 最後的 w<sub>PLA</sub> 在 200 筆資料上應該 E<sub>in</sub> = 0，自己算一次就能確認程式沒寫錯。Q3、Q4 的上界可以直接在資料上算出 R 與 ρ，再跟實際更新次數比。

## HW2：可行性、成長函數與 decision stump（L4–L7）

- **Q1、Q3**：兩種受限感知器的成長函數（只能斜率 ±1、一定要通過某個點）。
- **Q2、Q6、Q7**：多 bin 抽樣。16 袋卡片各抽 5 張（獨立），和一袋四種彩券抽 5 張（互相牽連），比較「某個數字全是綠色」的機率。題目的提示直接點破：每個數字就是一個假說。
- **Q4**：6211 個固定感知器組成的集合，VC 維度最緊的上界（L7）。
- **Q5**：題目附了一段 ChatGPT 的分享連結，是它回答「已知整數數列前 N − 1 項來自 N 次多項式，能不能預測下一項」的內容，要你以老闆的身分反駁或同意。這題接的是 L4 的「learning is impossible?」。
- **Q8**：M 台吃角子老虎機，用單邊 Hoeffding 加上 union bound，證明所有機台、所有時間點同時成立的信賴上界。題目提示這就是 multi-armed bandit 的 upper-confidence bound 演算法的核心。
- **Q9**：所有 symmetric boolean function 的 VC 維度。
- **Q10–12（程式）**：decision stump。Q10 先證明在指定雜訊下 E<sub>out</sub> 的公式；Q11 在 N = 12、雜訊 15% 下跑 2000 次，畫 (E<sub>in</sub>, E<sub>out</sub>) 散佈圖；Q12 改成隨機挑假說再比。
- **Q13（bonus）**：多維 decision stump 的 VC 維度上界。

**怎麼驗證**：Q2、Q6、Q7 的機率都能用 Monte Carlo 模擬核對，抽十萬次就夠。Q11 的 E<sub>out</sub> 用 Q10 推出的公式算，可以反過來用大量測試點估計 E<sub>out</sub>，確認公式沒推錯。

## HW3：VC 維度、雜訊與線性迴歸（L6–L10）

- **Q1、Q5**：d<sub>VC</sub> 的比較，以及 d<sub>VC</sub>(H<sub>1</sub> ∪ H<sub>2</sub>) ≤ d<sub>VC</sub>(H<sub>1</sub>) + d<sub>VC</sub>(H<sub>2</sub>) 是否成立。
- **Q2–3、Q8**：線性迴歸。一維無截距的解、哪些對 X 的操作會改變 hat matrix、把 x<sub>0</sub> 從 1 改成 1126 之後兩個解的關係。
- **Q4、Q9**：最大概似。均勻分布 [θ, 1] 的概似函數；換一種 sigmoid 之後重推 logistic regression 的梯度。
- **Q6–7**：L8 的雜訊與誤差。超市型的不對稱誤差（false negative 比 false positive 重 10 倍）下目標函數的門檻；E<sub>out</sub> 兩種定義之間的不等式。
- **Q10–12（程式）**：`cpusmall_scale` 共 8192 筆。N = 32 隨機抽樣做線性迴歸 1126 次，畫 (E<sub>in</sub>, E<sub>out</sub>)；N 從 25 到 2000 畫學習曲線；只用前 2 個特徵再畫一次。
- **Q13（bonus）**：證明 B(N, k) 的下界，湊成 L6 的等式。題目自己也說，這題和「選修」的 L6 有關。

**怎麼驗證**：用 `np.linalg.pinv` 算的 w<sub>lin</sub> 應該和 sklearn 的 `LinearRegression().fit(X, y)` 一致（注意截距的處理）。學習曲線的形狀可以和 L9 投影片上的圖對照。

## HW4：logistic regression、多類別與非線性轉換（L10–L14）

- **Q1**：標籤換成 {0, 1} 之後，cross-entropy error 的等價寫法。
- **Q2–3**：誤差函數與 SGD。一次用所有錯誤樣本更新的 PLA 變形，是在對哪個誤差做梯度下降；高估比低估糟時的不對稱平方誤差，SGD 的更新方向。
- **Q4**：一個「每筆資料一個指示函數」的轉換，做線性迴歸會得到什麼（題目提醒順便想 E<sub>in</sub> 和 E<sub>out</sub>）。
- **Q5**：logistic regression 的 Newton 法，把 Hessian 寫成 XᵀDX。
- **Q6–7**：multinomial logistic regression 的 SGD 更新，以及 K = 2 時和一般 logistic regression 的關係（L11 的多類別）。
- **Q8**：用兩個點對 f(x) = 1 − 2x² 做線性迴歸，E<sub>D</sub>(|E<sub>in</sub>(g) − E<sub>out</sub>(g)|) 是多少。
- **Q9**：L13 的 virtual examples。對輸入加高斯雜訊產生虛擬樣本，E(X<sub>h</sub>ᵀX<sub>h</sub>) 的形式直接指向 L14 的正則化。
- **Q10–12（程式）**：沿用 `cpusmall_scale`，N = 64。Q10 用 SGD（η = 0.01、100000 次迭代）對照閉式解；Q11–12 做三次齊次多項式轉換，看 E<sub>in</sub> 變好多少、E<sub>out</sub> 變多少，各重複 1126 次。
- **Q13（bonus）**：一種「乘法型」假說的 VC 維度是否大於線性假說。

**怎麼驗證**：Q10 的 SGD 曲線應該慢慢逼近閉式解那兩條水平線，逼不近就是步長或梯度寫錯。Q5 的 Hessian 可以用有限差分數值驗算。

## HW5：正則化、驗證與三個原則（L13–L16）

- **Q1**：additive smoothing 等價於哪一種正則化項。
- **Q2、Q7–8**：驗證。decision stump 的 leave-one-out 誤差上界；用前 N − K 筆的平均估計均值時的期望驗證誤差；證明「取平均」演算法的 E<sub>loocv</sub> 和 E<sub>in</sub> 的比例關係。
- **Q3**：L16 第 6 頁的延伸。隨機標籤下 decision stump 能把 E<sub>in</sub> 壓到多低，題目註明這和 Rademacher complexity 有關。
- **Q4**：三個一維點經過多項式轉換後做 hard-margin SVM，求 margin。這題已經進到技法 T1（Fall 2024 的 W9 講完 201u、202u）。
- **Q5–6**：正則化。特定的虛擬樣本等價於加權 L2 正則化；用二階 Taylor 展開寫出 L2 正則化解。
- **Q9**：測試分布的類別比例改變時，分類器什麼時候和「永遠猜 +1」一樣好。
- **Q10–12（程式）**：`mnist.scale` 取出 2 和 6 當二元分類，用 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 的 `-s 6`（L1 正則化 logistic regression）。λ 在 10<sup>−2</sup> 到 10<sup>3</sup> 之間挑：Q10 依 E<sub>in</sub> 挑，Q11 切 8000 筆 sub-training 用 validation 挑，Q12 用 3-fold CV 挑，各重複 1126 次比較 E<sub>out</sub> 的分布。題目要你自己讀 README，找出 LIBLINEAR 的 C 和課堂上的 λ 怎麼換算。
- **Q13（bonus）**：elastic net 的 coordinate descent 更新式。

**怎麼驗證**：Q10–12 可以用 sklearn 的 `LogisticRegression(penalty="l1", solver="liblinear")` 對照，它底層就是 LIBLINEAR。三種挑 λ 的方法，E<sub>out</sub> 的分布應該一個比一個集中，這正是 L15 想讓你看到的現象。

## Fall 2026：hw0 與 hw1 改了什麼

[hw0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf) 在 2026-09-10 發布，課程頁 09/22 公告延長截止，現在是 10/21。題型和 Fall 2024 一樣是 20 題 40 分，三塊的切法是組合與機率（Q1–6）、線性代數（Q7–14）、微積分與最佳化（Q15–20），至少第 1 題已經換成新題目。

[hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) 在 09/23 發布，同樣 10/21 截止，[作業子頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/)另附資料檔 `hw1_train.dat`。依課程計畫，hw0、hw1、hw2 會在同一天（10/21）截止。

和 Fall 2024 HW1 的差異：

| | Fall 2024 HW1 | Fall 2026 hw1 |
|---|---|---|
| 題數與配分 | 12 題＋bonus，200＋20 分 | 16 題，240 分 |
| 批改 | Q1–4 自動批改，Q5–12 全部助教批改 | 每題都是選擇題（10 分），另外秘密抽 4 題由助教依解釋的邏輯與清楚程度加改（各 20 分） |
| 範圍 | L1–L3 | L1–L4：ML 基本判斷、PLA（含多類別 PLA）、學習問題分類（台灣降雨圖預測）、可行性（off-training-set error、蒙地卡羅估 π 的 Hoeffding 樣本數、BAD data、骰子版的多 bin 抽樣） |
| 程式資料 | `rcv1_train.binary` 前 200 行 | 課程自備的 `hw1_train.dat`，N = 256，x ∈ ℝ<sup>12</sup> |
| PLA 實驗 | 停止條件 5N，sign(0) 取 −1 | 停止條件 2N，sign(0) 取 +1；問 E<sub>in</sub> = 0 的比例、更新次數中位數、‖w<sub>PLA</sub>‖ 中位數，以及把輸入縮小一半、x<sub>0</sub> 改成 0.5 或 0 後的更新次數 |
| ChatGPT 題 | 有（Q5–6） | 沒有 |
| 程式繳交 | 附程式碼第一頁截圖 | 標 (*) 的題目上傳原始碼或 zip（不含資料），目的寫明是抄襲偵測與爭議處理 |

hw2 以後依課程計畫在 10/07 起陸續公布，截至 2026-09-30 都還沒公開。

**怎麼做**：想跟 Fall 2026 同步的讀者，可以先寫 hw1 的 Q11–16。資料只有 256 筆，一個晚上就能跑完 1000 次實驗；把「縮小一半」「x<sub>0</sub> = 0.5」「x<sub>0</sub> = 0」三組的更新次數中位數放一起，對照 Fall 2024 HW1 Q7–8 的證明題，就知道那些證明在說什麼。

## 沒有解答時的自我檢查清單

1. **數值題先模擬**：機率題用 Monte Carlo，期望值題用大量重複實驗，推導出的公式跟模擬值差太多就是推錯。
2. **程式題找第二個實作**：numpy 的閉式解對 sklearn，自己的 SGD 對閉式解，自己的 L1 logistic regression 對 LIBLINEAR。
3. **梯度題用有限差分**：(E(w + εe<sub>i</sub>) − E(w − εe<sub>i</sub>)) / 2ε 和你推的梯度逐分量比較。
4. **證明題換小例子**：先在 N = 2、d = 1 的例子上手算，確認命題成立，再寫一般化證明。

## 下一步

技法部分的 HW6、HW7 與期末專題（虛構的 HTMLB 棒球勝負預測）在下一篇[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。上一篇是[T16 Finale 與現代深度學習補充](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)。

各份作業對應的講次導讀：[L1–L3](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)、[L4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)、[L5–L6](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)、[L7–L8](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)、[L9–L10](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)、[L11–L12](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)、[L13–L14](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)、[L15–L16](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/policy.pdf)
- [Fall 2024 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf)
- [Fall 2024 Homework 1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)
- [Fall 2024 Homework 2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2026 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf)
- [Fall 2026 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf)
- [Fall 2026 Homework 1 子頁（hw1.pdf、hw1_train.dat）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/)
- [LIBSVM Data: Classification, Regression, and Multi-label](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/)
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)
- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
