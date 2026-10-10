---
title: "CS149 L6 Locality、通訊與 arithmetic intensity：為什麼少搬資料比多開核更重要"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 7
tldr: "CS149 L6 要你把「通訊」看得很廣：處理器和 cache、和記憶體、和另一台機器之間的資料搬移都算。現代平行處理器的算力遠高於頻寬，所以 arithmetic intensity（每搬一單位資料做多少計算）決定了你能不能把硬體餵飽。提高它的手段有三類：改分配方式減少必要通訊、用 blocking 與 loop fusion 減少 cache 造成的額外通訊、用分散與錯開存取降低 contention。"
description: "Stanford CS149（Fall 2025）Lecture 6 導讀：shared address space 與 NUMA、message passing 的 grid solver、同步與非同步 send/recv 與死鎖、把平行系統看成延伸的記憶體階層、arithmetic intensity、inherent 與 artifactual communication、blocking 與 loop fusion、contention，以及 roofline 與 high watermark 的效能分析方法。"
draft: false
glossary:
  - term: "arithmetic intensity"
    aliases: ["算術強度"]
    definition: "計算量與通訊量的比值，例如每搬一個 byte 執行幾條指令。倒數就是 communication-to-computation ratio。"
    context: "CS149 L6 的核心量：現代平行處理器算力與頻寬的比值很高，低 arithmetic intensity 的程式會被頻寬卡住。"
  - term: "artifactual communication"
    definition: "演算法本身不需要、但因系統實作細節（cache line 最小傳輸單位、cache 容量有限等）而多出來的通訊。"
    context: "L6 把通訊分成演算法必要的 inherent communication 與這一類。"
  - term: "contention"
    aliases: ["資源爭用"]
    definition: "許多請求在很短的時間窗內湧向同一個資源，使該資源成為熱點、所有請求都變慢的現象。"
    context: "L6 用教授 office hours 排隊的例子說明，解法是複製資源或錯開存取。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-locality-communication-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 7 篇，接續 [L5 工作分配與排程](/posts/ai/2026-09-30-cs149-work-distribution-scheduling)，範圍是 Lecture 6「Program Optimization 2: Locality and Communication」（2025-10-09）。PDF 內的標題多了一個詞：「Locality, Communication, and Contention」。

用到的官方材料是 [L6 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf)（68 頁，另有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)）。Fall 2025 錄影不公開，官方首頁指向 2023 年版，對應的是 [2023 Lecture 6 錄影](https://www.youtube.com/watch?v=Mhdny2JNhmc)。本文以 2025 投影片為準，影片只是補充。存取等級 **A3**。

上一篇列的三個目標，這篇處理第二個：**減少通訊**。

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=Mhdny2JNhmc
title: CS149 2023 Lecture 6 錄影（補充材料）
```

原始影片：[CS149 2023 Lecture 6 錄影（補充材料）](https://www.youtube.com/watch?v=Mhdny2JNhmc)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)

## 共享位址空間只是抽象

到目前為止，課程都假設所有處理器接到同一個記憶體系統，看到單一的共享位址空間。L6 第一件事是提醒你：這個抽象的實作很複雜。一條「把位址 X 的值載入 R0」的指令，背後可能要經過好幾層 cache 才碰到 DRAM。

投影片舉的互連例子：

- Intel 的 **ring interconnect**（Sandy Bridge 起）：四條 ring 分別傳 request、snoop、ack 和 data，L3 分成多個 slice 掛在 ring 上。每個核存取自己的 local slice 時，核到 L3 的理論峰值頻寬在 3.4 GHz 約 435 GB/s。
- SUN Niagara 2 的 **crossbar**：所有核直接連到所有 L2 bank。crossbar 的面積大約等於一顆核。
- **NUMA**：多 socket 系統裡，不同核存取同一位址的延遲不同，頻寬也可能不同。投影片註明，單 socket 系統其實也有 NUMA 行為，因為不同 cache slice 和各核的距離不一樣。

共享位址空間的通訊方式是讀寫共享變數加上 lock、atomic 等同步原語。它是單處理器寫法的自然延伸，但需要硬體支援任何核讀寫任何位址，擴展到大量處理器的成本很高。投影片說，這是高核數處理器昂貴的原因之一。

## Message passing：把通訊寫明

另一種抽象是 **message passing**。每個 thread 有自己的私有位址空間，交換資料的唯一方式是送收訊息：`send` 指定收件者、要傳的 buffer 和可選的 tag，`recv` 指定寄件者、存放的 buffer 和 tag。投影片用的比喻是寄信。

硬體不必實作全體共享的位址空間，只要能在節點間傳訊息就好，所以可以把一般的機器接成大型平行機器。投影片說 message passing 是叢集與超級電腦的程式模型。

### 用訊息改寫 grid solver

L4 的 grid solver（紅黑格交替更新直到收斂）改寫成 message passing 後，grid 分成四塊，分別存在四個 thread 的位址空間。每個 thread 需要鄰居的邊界列才能更新，所以要多存兩列 **ghost cells**：從遠端位址空間複製過來、由別的 thread「擁有」的格子。

每一輪迭代：

1. 把自己的頂列送給上面的 thread，底列送給下面的 thread
2. 收鄰居送來的 ghost rows
3. 跟共享記憶體版一樣算更新
4. 各 thread 把自己的 `my_diff` 送給 thread 0，thread 0 判斷是否收斂，再把 `done` 送回去

投影片的觀察：計算用本地索引，通訊一次傳整列（bulk transfer），**同步也靠送收訊息完成**。

### 同步 send/recv 會死鎖

同步（blocking）版本的語意是：`send()` 要等到收到回條、確認資料已在接收者的位址空間才返回；`recv()` 把資料複製進來並送出回條才返回。

投影片問：上面那份程式如果用同步 send/recv，會出什麼大問題？下一頁的修正版標題寫著「fixed to avoid deadlock」，答案就是死鎖：每個 thread 都先 `send`，而同步的 `send` 要等對方收下才返回，大家都卡在 `send`。修正版在保留同步 send/recv 的前提下，讓偶數編號的 thread 先送後收、奇數編號的先收後送。

非同步（non-blocking）版本則是：

- `send()` 立刻返回，但傳給它的 buffer 在訊息送出前不能改，因為傳送和 thread 同時進行
- `recv()` 只登記「未來要收」，立刻返回
- 用 `checksend()`、`checkrecv()` 查詢實際狀態
- 等待期間，呼叫端可以去做別的事

## 通訊不只發生在機器之間

投影片在這裡把「通訊」的定義放大：核和核之間、核和它的 cache 之間、核和記憶體之間，都是通訊。

它要你把平行系統想成一個**延伸的記憶體階層**。從一個處理器往外看，依序是暫存器、L1、L2、別的核的 L2、L3、本地記憶體、隔一跳網路的遠端記憶體、隔 N 跳的遠端記憶體。越往外，延遲越高、頻寬越低、容量越大。本層滿足不了的存取就會變成對下一層的通訊，所以**每一層都要管理 locality**。

接著回顧 L3 的頻寬受限例子：處理器每載入一條 cache line 只執行 2 條指令，記憶體匯流排 100% 時間都在傳資料，處理器卻大部分時間在等。投影片要你說服自己：在穩態下，核的使用率只取決於指令吞吐量和記憶體吞吐量，和記憶體延遲或同時在途的請求數無關。

## Arithmetic intensity

$$
\text{arithmetic intensity} = \frac{\text{計算量（例如指令數）}}{\text{通訊量（例如 bytes）}}
$$

倒數就是 communication-to-computation ratio。講者偏好 arithmetic intensity，理由是「越高越好」比較直覺，而且聽起來比較酷。

重點在這句：現代平行處理器的算力對可用頻寬的比值很高，所以**要高 arithmetic intensity 才能有效利用它們**。多開核只是提高分子那一側的能力。如果每做一次計算就要搬一堆資料，核再多也只是一起等記憶體。

### 兩種通訊：inherent 與 artifactual

**Inherent communication** 是演算法在給定分配下本來就必須搬的資料。message passing solver 裡送 ghost rows 就是這一種。

好的分配可以減少它。投影片比較三種 N×N grid 的切法：

| 分配方式 | 每個處理器計算 | 每個處理器通訊 | 計算／通訊 |
|---|---|---|---|
| 1D blocked（每人一段連續列） | ≈ N²/P | ≈ 2N | ∝ N/P |
| 1D interleaved（列輪流分） | | | = 1/2 |
| 2D blocked（切成方塊） | N²/P | ∝ N/√P | ∝ N/√P |

2D blocked 的通訊成本隨 P **次線性**成長，漸進上比 1D blocked 好，因為分配方式抓住了演算法的 2D locality。

**Artifactual communication** 是其他所有通訊，來自系統實作的細節。投影片的例子：

- **最小傳輸單位**：程式只要一個 4-byte float，但整條 64-byte cache line 都得搬，多了 16 倍
- **不必要的操作**：程式連續寫 16 個 float，整條 cache line 先被從記憶體載入、完全覆寫、再寫回。那次載入是多餘的，通訊量變 2 倍
- **容量有限**：cache 太小留不住資料，同一份資料被搬好幾次（capacity miss）

投影片用 grid solver 演示最後一種。假設 row-major 排列、cache line 放 4 個元素、cache 容量 24 個元素（6 條 line）。逐列走訪時，處理第二列的第一個輸出時，前面用過的鄰居已經被擠出 cache，結果每產生 4 個輸出元素要載入 3 條 cache line。

## 減少通訊的技巧

### Blocking：改走訪順序

同一個 grid 改成分塊走訪（blocked iteration order），資料還在 cache 裡時就被重複使用。投影片的數字從每 4 個輸出載入 3 條 line，變成每 6 個輸出載入 2 條 line。

### Loop fusion：少寫中間結果

計算 `E = D + ((A + B) * C)`。如果寫成三個模組化的函式 `add`、`mul`、`add`，每個迴圈都是兩次載入、一次寫入配一次運算，arithmetic intensity 是 1/3，整體也是 1/3。

```cpp
void fused(int n, float* A, float* B, float* C, float* D, float* E) {
  for (int i=0; i<n; i++)
    E[i] = D[i] + (A[i] + B[i]) * C[i];
}
```

融合成一個迴圈後，四次載入、一次寫入配三次運算，arithmetic intensity 變成 3/5。投影片說上面那種寫法比較模組化，像 NumPy 這類陣列數學庫；下面那種效能好得多。

**怎麼做**：下次在 PyTorch 或 NumPy 看到一連串 element-wise 運算，數一下它會產生幾個中間陣列。每個中間陣列都是一次完整的寫出與讀回。這也是 [L9 在 GPU 上跑 DNN](/posts/ai/2026-09-30-cs149-dnn-on-gpus) 會講的 layer fusion 的出發點。

### 共享資料：把用同一份資料的任務放一起

把操作同一資料結構的 thread，同時排到同一個處理器上。這減少的是 inherent communication。

## Contention

投影片用 office hours 舉例。3:00 到 3:20 開放、不預約，學生走過來要 5 分鐘，問問題要 5 分鐘。五個學生同時出發，第一個只花 10 分鐘，排到後面的要花 23 分鐘。如果改成預約（一個 3 點、一個 4 點半），每人都只花 10 分鐘。

定義：一個資源每單位時間能處理的交易數有上限。記憶體、通訊連線、伺服器、助教都算。當很多請求在短時間窗內湧向它，它就成為**熱點**。

兩個例子：

- **更新共享變數**：所有處理器直接更新一個變數（flat）時，沒有爭用的話延遲低，但爭用可能很嚴重。改成樹狀結構逐層彙整可以降低爭用，代價是沒爭用時延遲較高。
- **分散式工作佇列**：就是 [L5](/posts/ai/2026-09-30-cs149-work-distribution-scheduling) 的每個 worker 一條佇列。大家都有事做時完全不爭用；只有自己的空了才去隨機偷。投影片註明，這時候同步沒關係，因為那個 thread 本來就會閒著。

## 降低通訊成本：一張總表

投影片的摘要頁把手段分成四類：

| 目標 | 做法 |
|---|---|
| 降低收發兩端的 overhead | 送更少、更大的訊息，把小訊息合併 |
| 降低延遲 | 程式端：重構程式利用 locality。硬體端：改善通訊架構 |
| 降低 contention | 複製被爭用的資源（本地副本、細粒度鎖）；錯開存取時間 |
| 讓通訊與計算重疊 | 程式端：非同步通訊。硬體端：pipelining、multithreading、prefetching、亂序執行。前提是應用程式的並行度要多於執行單元數 |

## 怎麼找出瓶頸

投影片再次重複：**永遠先試最簡單的平行解法，量過再說。**

接著是分析策略。先判斷效能卡在計算、記憶體頻寬（或延遲），還是同步。再建立「high watermark」：實務上最好能做到多好，你離它多遠。

**Roofline model** 的 X 軸是不同 arithmetic intensity 的程式，Y 軸是該 intensity 下能達到的最大指令吞吐量。斜線區是頻寬受限，水平區是計算受限。

投影片列了四個手動實驗，用來估計主要成本在哪：

| 修改 | 觀察 | 代表什麼 |
|---|---|---|
| 多加一些數學指令 | 執行時間是否隨運算量線性增加 | 若是，程式受指令速率限制 |
| 拿掉幾乎所有數學，只保留相同的載入 | 時間減少多少 | 減得不多，懷疑記憶體瓶頸 |
| 把所有陣列存取改成 `A[0]` | 快了多少 | 改善 locality 的上限 |
| 拿掉所有 atomic 或 lock | 快了多少（工作量大致不變時） | 減少同步成本的上限 |

投影片的註腳提醒：計算、記憶體存取和同步幾乎不會完美重疊，所以整體效能很少完全由其中一項決定。這些實驗看的是**敏感度**。

此外可以用硬體的 performance counter（完成的指令數、時脈、L2/L3 命中與失誤、從記憶體控制器讀了多少 bytes 等）。投影片的例子是 Intel Performance Counter Monitor 的 C++ API，也提到 Intel VTune、PAPI、oprofile。作業系統的「CPU 使用率」圖只顯示 thread 被排到核上的時間比例，對調效能沒什麼幫助。

## Bonus：問題大小會騙人

投影片最後的 bonus 部分談 scaling 的陷阱：

- **拿誰當基準**：平行演算法可能收斂得比較慢。拿平行版在單核上的時間當分母，會讓 speedup 看起來比較好看，這是常見陷阱。要和最好的循序程式比。
- **問題太小**：258×258 的 grid 在 32 處理器的 SGI Origin 2000 上，每個處理器只分到約 310 格，通訊對計算比太高，幾乎沒有加速，甚至略慢。套回 2D blocked 的公式，N 小或 P 大，arithmetic intensity 就低。
- **超線性加速**：1K×1K 的 grid 每個處理器約 32K 格。處理器夠多時，每塊的 working set 塞得進各自的 cache，於是出現超過線性的 speedup。反過來，問題大到單機記憶體放不下而 thrash 到磁碟時，換到大機器的 speedup 會好看得很誇張。

結論是：用固定的問題大小評估機器可能有問題，隨著機器變大一起放大問題規模往往更合理。

## 這一篇可以確認與不能確認的

可以確認：L6 投影片 PDF 的內容與講次日期。本文的數字（435 GB/s、1/3 與 3/5、310 與 32K 格）都來自投影片。不能確認：Fall 2025 課堂上的口頭補充；2023 錄影與 2025 投影片的逐頁差異。本文沒有依影片內容寫作。

延伸閱讀：cache 與記憶體階層的基礎可以先讀 [CS107 的 caching 與 memory hierarchy](/posts/learning/2026-08-22-stanford-cs107-caching-memory-hierarchy)。GPU 上的同一套頻寬與 fusion 思維，可以對照 [CS336 的 GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)。

系列導覽：上一篇 [L5 工作分配與排程](/posts/ai/2026-09-30-cs149-work-distribution-scheduling)｜下一篇 [PA2：從零打造 task execution library](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 6: Program Optimization 2: Locality and Communication（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf)
- [Lecture 6 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)
- [CS149 2023 Lecture 6 錄影（補充材料）](https://www.youtube.com/watch?v=Mhdny2JNhmc)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
