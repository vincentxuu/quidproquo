---
title: "CS149 L13：讓效能最佳化不再只靠專家——Halide 的演算法／排程分離、自動排程器與 LLM agent"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, compiler, coding-agent, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 17
tldr: "L13 問的是：寫快程式的專家太少，怎麼辦？投影片給三個答案。一是提高抽象層級：Halide 把「算什麼」（演算法）和「怎麼算」（排程）拆成兩種語言，同一段模糊濾波可以只改一行排程就換成分塊、向量化、多核版本。二是智慧搜尋：因為排程空間定義清楚，可以用搜尋加學出來的成本模型自動產生排程。三是新興的 LLM agent：讓模型寫 CUDA、執行、看 profiler、反思、再改，並用範例資料庫或 prompt 最佳化讓它自我改進。投影片最後把問題留給你：真正的價值在 DSL 設計，還是 LLM agent？"
description: "Stanford CS149（Fall 2025）第 13 講 Domain-Specific Programming Systems and AI-Driven Performance Optimization 導讀：DSL 的效能／生產力／通用性取捨、兩段式模糊濾波的 locality 分析、Halide 的演算法與排程分離、Halide 自動排程器的搜尋與學習成本模型，以及用 LLM agent 自動產生高效能 kernel 的反思迴圈、KernelBench 與自我改進方法。"
draft: false
glossary:
  - term: "Halide"
    aliases: ["Halide DSL"]
    definition: "嵌入在 C++ 的影像處理領域專用語言，把演算法（每個像素怎麼算）與排程（迴圈順序、分塊、向量化、平行化、何時計算中間結果）分成兩種描述。"
    context: "CS149 L13 用 Halide 說明 DSL 如何兼顧生產力與效能。"
  - term: "schedule"
    aliases: ["排程", "Halide schedule"]
    definition: "在 Halide 中描述「怎麼算」的第二種語言，例如 tile、vectorize、parallel、compute_at；只影響效能，不改變計算結果。"
    context: "CS149 L13：同一段 Halide 演算法，換一行排程就產生不同的迴圈巢狀。"
  - term: "producer-consumer locality"
    aliases: ["生產者—消費者 locality"]
    definition: "一個階段產生的中間結果馬上被下一個階段使用；如果能在它還在 cache 或晶片內時就用掉，就省下寫回再讀出的記憶體流量。"
    context: "CS149 L13 的兩段式模糊濾波與 Written 3 都在練這件事。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 17 篇，對應 11 月 6 日的第 13 講 [Domain-Specific Programming Systems and AI-Driven Performance Optimization](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf) 共 55 頁（PDF 封面標題寫的是「Automatic Performance Optimization」）。

關於錄影：Fall 2025 錄影只在 Canvas。這講前半的 DSL 內容，在課程首頁指向的 2023 公開錄影裡有對應的 [2023 Lecture 15 - Domain Specific Programming Languages](https://www.youtube.com/watch?v=sRuyBNxCkGQ)；**後半的 LLM agent 部分沒有任何公開錄影，只能依投影片**。本文全部以 2025 投影片為準，2023 影片只當前半的聽講補充，兩者內容是否一致本文沒有逐段比對。

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=sRuyBNxCkGQ
title: 2023 Lecture 15 錄影：Domain Specific Programming Languages（僅對應前半 DSL 部分）
```

原始影片：[2023 Lecture 15 錄影：Domain Specific Programming Languages（僅對應前半 DSL 部分）](https://www.youtube.com/watch?v=sRuyBNxCkGQ)

課程與錄影入口：

- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/)

## 起點：寫快程式的人太少

第 2 頁列出這講的目標：用各種機制和技術提高效能最佳化的生產力，一方面讓專家更有效率，一方面靠自動化。三個關鍵想法：

1. 提高抽象層級
2. 智慧搜尋
3. （新興）利用現代 LLM 的解題與程式生成能力

第 3 頁的標題很直接：「受過 CS149 訓練的程式設計師很難找」。用 C++、ISPC、CUDA 做效能最佳化生產力很低——投影片說證明就是作業 1、2、3、4。

## 第一個想法：領域專用語言

### 三角取捨

第 4–6 頁用一張三角圖（投影片註明設計來自 Pat Hanrahan）：理想的平行程式語言要同時有**效能、生產力、通用性**。主流語言各佔一兩個角，投影片提出的出路是**領域專用語言（DSL）**：犧牲通用性，換取效能與生產力。

第 7–8 頁定義 DSL：表達能力受限、針對特定領域、通常是高階的、宣告式的、確定性的。它的目標是：

- 很快寫出針對目標機器的高效能程式
- 寫一次程式，在不同機器上都跑得有效率

DSL 提供的原語對應到該領域常用的行為，所以直覺好用、可攜；系統知道這個領域該用什麼演算法、什麼平行化策略，所以有效率。投影片還補了一句：**最佳化不只是把軟體好好映射到硬體，硬體本身也可以為這些抽象做最佳化。** 代價是失去通用性。

### 用一段模糊濾波看「手寫最佳化」有多難

第 9–10 頁介紹 [Halide](https://halide-lang.org/)（Ragan-Kelley、Adams 等人，SIGGRAPH 2012、PLDI 2013），投影片說它被用在 Google 手機的相機處理管線（HDR+、人像模式的部分功能），Instagram、Adobe 等業界也在用。

第 12 頁先秀出一段看不懂的 SSE intrinsics 程式，評語是：好處是在四核 CPU 上比原本的兩段式程式快約 10 倍；壞處是只能跑 SSE（不是 AVX2）、只能跑 CPU、完全看不出它在做什麼。答案揭曉在第 13–14 頁：它只是一個 3×3 box blur。

接下來第 15–20 頁一步步重建最佳化的思路：

- **一次做 2D 模糊**：每張圖 9 × WIDTH × HEIGHT 的工作量，N×N 濾波器是 N² 倍。
- **兩段式**（先水平、再垂直）：可分離濾波器能拆成兩次 1D 濾波，工作量降到 6 × WIDTH × HEIGHT（N×N 時是 2N 倍），但多了一整張 `tmp_buf`，投影片說 arithmetic intensity 反而比 2D 版本低一半，要你想為什麼。
- **locality 分析**（第 18 頁）：演算法本質上必須讀每個輸入、寫每個輸出；對 `tmp_buf` 的讀寫是**兩段式實作造成的額外流量**，不是計算本身需要的。如果 cache 裝得下三列影像，`tmp_buf` 的資料不會重複載入。
- **分塊版本 1**（第 19 頁）：每產生一列輸出，只算需要的三列 `tmp_buf`，暫存只要 3 列。但每張圖的工作量變成 12 × WIDTH × HEIGHT——重算太多。
- **分塊版本 2**（第 20 頁）：每次產生 `CHUNK_SIZE` 列輸出，`tmp_buf` 是 `CHUNK_SIZE + 2` 列，大小選到整塊放得進 cache。`CHUNK_SIZE = 16` 時工作量是 (34/16) × 3 ≈ 6.4 × WIDTH × HEIGHT，隨 chunk 變大趨近理想的 6。

這就是 [L6](/posts/ai/2026-09-30-cs149-locality-communication) 的 locality 與重算取捨，也是 [Written 3](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki) Problem 1、2 用的同一段程式。

第 21–22 頁說這還沒完：還沒多核平行、還沒用 SIMD、還沒做 loop unrolling。第 22 頁回頭解剖那段 SSE 程式，原來它做了四件事：把影像垂直切給多核、用 256×32 的分塊走訪順序提高 cache 命中率、用 SIMD intrinsics、把兩段融合成一段讓 tmp 資料從 cache 讀。**四個正確的決定，全部糾纏在一段不可讀、不可攜的程式裡。**

### Halide：演算法一種語言，排程另一種

第 23–25 頁是 Halide 的演算法語言。`Func` 把整數座標對應到值，程式用「逐點」的方式描述：

```cpp
blurx(x,y) = 1/3.f * (in(x-1,y) + in(x,y) + in(x+1,y));
blury(x,y) = 1/3.f * (blurx(x,y-1) + blurx(x,y) + blurx(x,y+1));
```

投影片強調：Halide 是宣告式的，**不定義迭代順序、也不定義哪些值要存起來**，只定義算出這些值需要什麼。沒有顯式迴圈。第 26 頁列出真實管線的規模：兩段式模糊只有 2 個函式，local laplacian filter 有 103 個，Google HDR+ 管線超過 2000 個 Halide 函式。

第 28 頁的一句話是整講的關鍵：**設計任何系統，關鍵都是為工作選對表示法。** 好的表示法讓人用起來有生產力，也讓系統能提供服務——驗證正確性、平行化、向量化、使用專用硬體。

第 29 頁引入第二種表示法，**排程**：

```cpp
out.tile(x, y, xi, yi, 256, 32).vectorize(xi,8).parallel(y);
blurx.compute_at(x).vectorize(x, 8);
```

意思是：計算 `out` 時用 256×32 的 2D 分塊順序，最內層 8 寬向量化，用執行緒平行化 y 迴圈；`blurx` 在每個輸出 tile 需要時才算。投影片的說法是，排程原語讓程式設計師畫出「怎麼排程到平行機器上」的高階草圖，把產生平台相關低階程式碼的細節留給 Halide 編譯器。

第 31–34 頁示範換一行 `compute_at` 會得到什麼迴圈巢狀：

| 排程 | 產生的實作 |
|---|---|
| `blurx.compute_root()` | 先把整張 `blurx` 算完，再算 `out`（就是原本的兩段式） |
| `blurx.compute_at(out, xi)` | 每個輸出像素只配 3 個元素的 `blurx`，當場算（最大 locality，最多重算） |
| `blurx.compute_at(out, x)` | 每個 256×32 輸出 tile 配一塊 256×34 的 `blurx` |

第 34 頁把完整排程展開成等價的平行迴圈巢狀：外層 tile 迴圈用執行緒平行、每個 tile 配一塊 `blur_x` 緩衝、內層用 8 寬 SIMD，邊界條件由編譯器產生。**這正是第 22 頁那段 SSE 程式做的四件事，但演算法那兩行完全沒動。**

### Halide 的哲學與限制

第 35 頁講 Halide 的分工：

- 程式設計師負責描述影像處理演算法
- 程式設計師知道怎麼排程最有效率（但又慢又煩），所以 Halide 給第二種語言來表達高階排程決策：迴圈結構、展開、向量化、多核平行
- **Halide 編譯器並不聰明**，它提供的服務是機械式地把排程細節落實到目標機器的機制上（pthreads、AVX intrinsics 等）

第 36 頁列出語言的限制，這些限制正是編譯器能提供服務的前提：只處理規則的 N 維定義域、只有前饋管線（外加 reduction 與固定深度遞迴的特別支援）、所有相依關係都能由編譯器推得。

第 37 頁是早期學術成果（Ragan-Kelley 2012）：相機 RAW 處理管線原本是 463 行手調 ARM NEON 組合語言，Halide 程式碼少 2.75 倍、快 5%；bilateral filter 原本 122 行 C++，Halide 是 34 行演算法加 6 行排程，CPU 版快 5.9 倍，GPU 版比手寫 CUDA 快 2 倍。

## 第二個想法：用搜尋自動產生排程

第 38 頁講一個意外：**很少程式設計師寫得出好的 Halide 排程。** Google 有 80 多人寫 Halide，只有很少數人被信任寫排程。解法是讓編譯器分析程式、自動產生排程（Adams 2019，SIGGRAPH 論文「Learning to Optimize Halide with Tree Search and Random Programs」）。

第 39–41 頁說明做法：

1. **把排程建模成一串選擇**：從 DAG 末端開始，對每個節點決定它要放在現有迴圈巢狀的哪一層（`compute_at`），再選 tile 大小（外層平行、內層向量化），直到整個 DAG 排完。
2. **在大空間裡搜尋**：貪婪搜尋、beam search。挑戰是可能要搜尋幾十萬種排程，每一種的成本怎麼估？
3. **用 AI 估成本**：一個簡單的 MLP，每個排程只要幾十微秒（例如 166 秒測了 140 萬個排程），用大量隨機產生的 Halide 程式訓練，這些程式實際編譯執行取得真實成本。投影片的註腳說，實際上它不是直接輸出成本，而是輸出 27 個係數，代入人工設計的成本模型。

第 42 頁的結論：用 Adams 2019 的自動排程器，在 CPU 上的影像處理應用，你得很努力才寫得出比它更好的排程。第 43 頁引用更早的 Mullapudi 2016 結果，比較自動排程器與兩位專家隨時間的進度。

第 44 頁的收尾：Halide 排程原語本來是為了提高專家的生產力設計的，但**高層次的排程抽象同時提供了一種清楚列舉所有可能排程的方式**，才讓自動搜尋成為可能。投影片反問：試想要搜尋一段 C++ 程式的所有排列組合。

## 第三個想法：LLM 寫 kernel

### 反思迴圈

第 46 頁畫出一個反覆試錯的迴圈：

1. 給 LLM 起始程式（例如 PyTorch）和 prompt：「你是 CS149 的效能最佳化工程師，請把以下 PyTorch 程式改寫成高效能 CUDA」，並附上課堂講過的最佳化原則。
2. 執行並 profile，得到是否正確、耗時，以及 SM 利用率、DRAM 利用率、L2 cache 命中率等統計。
3. 再給 LLM 一個 prompt：根據程式碼與在 H100 上跑出的 profiling 數據，反思什麼讓程式變慢，然後改一處來解決。

第 47 頁介紹 [KernelBench](https://github.com/ScalingIntelligence/KernelBench)：一個包含數百個 PyTorch kernel 的 benchmark，LLM agent 的目標是自動產生又快又正確的 CUDA kernel。

### DSL 也幫了 LLM

第 48 頁把前後兩半接起來：寫 DNN 程式的 DSL 也有助於自動化。好處是 LLM 現在組裝的是高效能原語，不是寫低階 CUDA，比較不容易出正確性錯誤或幻覺。挑戰是 LLM 對使用較少的語言寫不太好（訓練資料少，投影片說會隨時間改善）。投影片列的例子是 Triton、CUTLASS/CuTe、TileLang——其中 Triton 與 TileLang 也是 [PA5](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels) 允許使用的語言。

第 49 頁丟出開放問題：**LLM agent 能不能當一個優秀的 CS149 學生？要花多少 token？**

### 四個讓 agent 變強的想法

第 50–54 頁列出四個方向：

1. **用經驗微調 LLM**：針對某類程式任務微調專用模型；需要大量任務，也需要能微調大模型。
2. **agent 建立「範例解答」資料庫來自我改進**：遇到新問題時檢索最相關的練習題解答。資料庫存的不只是解答，還有**一連串的最佳化決策**（投影片舉的資料庫內容是 ThunderKittens 或 CuTe 寫的 kernel）。
3. **從經驗最佳化 prompt**：檢視過去的最佳化軌跡，歸納成重要的事實與原則，更新給 LLM 的 prompt，而不只是提供相關範例。
4. **把窮舉式搜尋（像 Halide 的 autotune）和上述 agent 想法結合**：最佳化成本極高，但能得到一些最好的結果。

第 52 頁有一張圖顯示想法 2 的效果。左圖是「為一個領域專用加速器寫 ML 函式庫函式」，比較 Claude 3.5 Sonnet、GPT-4o、Llama 3.1-405B、DeepSeek-V3 三種用法（single、agent、self-improved）的 pass@n，self-improved 相對 single 的提升標為 1.3 倍到 3.9 倍；右圖是資料庫程式設計任務，成功率隨訓練任務數增加而上升。投影片沒有在這頁註明出處論文。

## 總結：真正的價值在哪

第 55 頁的總結：

- 效能最佳化需要很高的專業
- 對專家來說也很煩、很難
- 換一台新機器、換一個稍微不同的問題，就要重來一次
- 公司每年在 AI 計算上花費數千萬到數億美元以上
- 看起來非常適合自動化

投影片預測：未來最好的 CS149 學生，很可能是能和自動化 agent 協作、加速自己思考與工作的人。最後一行把爭論留給你：**成功的真正價值，是在 DSL 的設計，還是在 LLM agent？**

## 這一講留給你的一個習慣

**先分開「算什麼」和「怎麼算」，再談最佳化。** Halide 把這條線畫成兩種語言；[L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc) 的「抽象 vs 實作」是同一條線；LLM agent 之所以在 DSL 上比較不會出錯，也是因為這條線讓它只需要改「怎麼算」。

**今晚可以做的事**：找一段你自己寫過、先後處理兩次的迴圈（例如先正規化再過濾），寫下它的「演算法」（每個輸出元素怎麼算）和「排程」（迴圈順序、有沒有中間陣列、能不能分塊融合），再試著照第 19–20 頁的方法算出分塊後的重算成本。

## 延伸閱讀

- 在 GPU 上寫高效能 kernel 的另一條路（Triton）：[CS336 Kernels 與 Triton 導讀](/posts/ai/2026-08-22-cs336-kernels-triton)
- 自我改進 agent 的一般方法：[Stanford CS329A 自我改進 agent 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)

系列導覽：上一篇 [L12 把 AI 應用映射到資料中心](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping)｜下一篇 [PA5 寫最快的 kernel](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 13 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/)
- [Lecture 13 投影片 PDF：Domain-Specific Programming Systems and Automatic Performance Optimization](https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf)
- [2023 Lecture 15 錄影：Domain Specific Programming Languages（僅對應前半 DSL 部分）](https://www.youtube.com/watch?v=sRuyBNxCkGQ)
- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Halide 官方網站](https://halide-lang.org/)
- [KernelBench GitHub repo](https://github.com/ScalingIntelligence/KernelBench)
- [Written Assignment 3 PDF（Problem 1、2 使用同一段兩段式模糊程式）](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)
