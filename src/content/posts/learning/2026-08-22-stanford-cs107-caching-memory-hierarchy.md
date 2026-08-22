---
title: "Stanford CS107 Lecture 25：Caching、Memory Hierarchy 與 Locality"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, cache, memory-hierarchy, performance]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 26
tldr: "CS107 第 25 講用精簡投影片建立 cache 的核心模型：記憶體存取成本不均，較小且較快的層級保存可能再次使用的資料，而 temporal 與 spatial locality 決定程式能否受益。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 25：caching、memory hierarchy、temporal locality、spatial locality，以及 traversal 與 data layout 的效能含義。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-caching-memory-hierarchy-en)

前一講從 profiler 與 compiler transformation 問「少做哪些工作」；Lecture 25 換一個方向：即使執行相同 instructions，資料位於不同 memory layer，等待時間也可能不同。Cache 的作用，是在較小、較快、靠近處理器的層級保留近期可能再用的資料，讓多數存取不必每次走到較慢的層級。

這是 Winter 2026 一份只有 55 行抽取文字的短 deck，不是一堂公開材料完整的 cache architecture 課。本文忠實說清投影片提出的 memory hierarchy、temporal locality 與 spatial locality，再把它們轉成可驗證的程式設計問題；不自行補入 cache line 大小、associativity、replacement policy、寫入策略或特定處理器 latency。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 25，2026-03-06
- 官方標題：Caching and Memory Hierarchies
- 講者：Jerry Cain
- 已讀材料：官方 calendar、完整公開投影片，以及 Intel 官方架構與最佳化文件
- 材料缺口：公開 deck 非常短；Canvas 錄影與 AFS 範例未公開，本文不能重建 Q&A、課堂示範或未刊出的硬體細節

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講安排在 Optimizations 之後、Wrap-up 之前。[五頁完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf)涵蓋 caching 的基本想法、memory hierarchy 的非均勻成本、temporal locality 與 spatial locality；第 3 頁另有一題量化思考題，第 5 頁標示 `Demo: cache.c`。

## Cache 是複本策略，不是另一個神奇容器

假設較慢層級保存完整資料，較快層級只能放其中一部分。每次存取若都去較慢層級，快速處理器會等待；若把可能再次使用的資料複製到較快層級，後續命中就能縮短等待。這個設計交換的是容量與速度：快速層通常較小，無法永久容納所有資料，因此必須選擇保留哪些內容。

「Cache 比 memory 快」只是起點。真正的問題是 cache 裡是否剛好有程式下一刻需要的 bytes。若存取模式沒有重複，也沒有鄰近性，再快的 cache 也難以產生多次命中；若工作集能在小層級中反覆使用，昂貴的下層存取就可被攤薄。

[Intel 的架構手冊入口](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)明確區分基本 architecture、system programming 與 optimization reference。它提醒我們：CS107 此處教的是可跨機器使用的 locality 心智模型，不是對某一顆 CPU 組態的保證。實際層級、容量與行為要回到目標處理器文件與量測。

## Memory hierarchy 讓位址相同、成本不同

程式在 C 層看到的是可定址 objects；硬體與系統在下方用多個層級供應資料。越靠近運算核心的儲存通常越快但越小，越遠的層級通常容量越大但存取成本更高。Hierarchy 的價值，在於讓常用的一小部分資料待在快速層，同時保有較大整體容量。

這不表示 source code 能替某個 variable 指定「永遠放在 cache」。程式能控制的是存取順序、資料排列與工作集規模；硬體再依實作政策搬移資料。優化時應提出可測假說，例如「內層迴圈連續走訪一列，比跨距很大的走訪更有 locality」，再用代表性輸入比較，而不是把 memory hierarchy 當成固定速度表。

[Intel Optimization Reference Manual 的官方入口](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html#inpage-nav-8)把 code optimization 放在特定 microarchitecture 脈絡下。這補上投影片的邊界：locality 是方向，實際效益受機器、資料集、編譯器與同時執行的工作影響，不能由 source shape 單獨保證。

## Temporal locality：最近用過，可能很快再用

Temporal locality 指近期存取過的資料，近期再次被存取的機率較高。典型例子是迴圈中的 accumulator、反覆查詢的小表格，或在一段計算中多次使用同一個 object。第一次可能需要從較慢層取得，後續若資料仍留在快速層，就能利用先前付過的搬移成本。

但「重複」要落在可保留的時間與容量內。兩次存取之間若穿過過大的工作集，原資料可能已被其他內容取代。把一次會重用的值先載入 local variable，或把計算分塊讓小區域完成多輪工作，都是利用 temporal locality 的可能方式；是否有效仍需 profiler 與 benchmark 驗證。

[投影片第 3 頁](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf#page=3)給了一個具體 thought question：若 97% 的存取命中且每次花 1 cycle，剩下 3% 未命中且每次花 100 cycles，miss 所花時間占比是多少？每 100 次存取中，hit 花 97 cycles，miss 花 300 cycles，所以 miss 占總存取時間 `300 / (97 + 300) ≈ 75.6%`。少數昂貴事件足以主宰時間，正是不能只看 hit rate 的理由。

今晚可做的實驗是固定演算法與輸入，只改 traversal 的工作集：一次處理整個大型區域，再回頭重用；或切成較小 tiles，在每個 tile 內完成多次計算。記錄 wall time 與輸出正確性，但不要僅憑一次結果宣稱原因已證明。

## Spatial locality：用了這裡，附近可能接著用

Spatial locality 指存取某地址後，鄰近地址很快也可能被存取。硬體搬運資料常以一段連續範圍為單位，因此讀一個元素可能把旁邊元素一併帶進較快層。連續走訪 array 通常能消費這份已搬入的鄰近資料；大 stride 或追逐分散 pointers 則較難利用。

這也是 data layout 會影響效能的理由。若一次 operation 需要的 fields 在 memory 中相近，載入的範圍較可能被充分使用；若每個需要的值都散在不同 allocation，程式可能搬進大量沒有立即使用的 bytes。不過「array 一定比 linked structure 快」仍太粗糙：資料規模、操作需求、mutation cost 與 target machine 都會改變結論。

可以用兩個邏輯相同的 loops 做檢查：一個依連續 index 讀陣列，另一個用較大 stride。先確認兩者計算相同結果，再重複量測。觀察到差異後，最多能說結果與 locality 模型一致；要歸因到特定 cache event，還需要對應硬體 counter 或更細的 profiler。

## Locality 與 Lecture 24 的量測形成閉環

Lecture 24 已說明 optimization 從 measurement 開始。Lecture 25 並沒有取消這條規則，而是提供新的候選解釋：hot function 可能不是 instructions 太多，而是資料供應跟不上。Call count 與 instruction count 能定位工作集中在哪裡；memory hierarchy 的模型再幫助設計 traversal 或 layout 實驗。

正確流程是先建立 baseline，再只改一項資料存取策略，最後用相同 workload 比較。若效能沒有改善，可能是資料原本就放得下、compiler 已經改寫、瓶頸在其他地方，或測試輸入不具代表性。Locality 是提出假說的工具，不是跳過量測的理由。

[Valgrind 的 Cachegrind manual](https://valgrind.org/docs/manual/cg-manual.html)說明它能模擬 cache 與 branch prediction 並提供 event counts；這類工具可補足只看 elapsed time 的模糊性。不過模擬器模型不等於實際處理器，結果仍應和目標環境的 measurement 一起判讀。

## 本講沒有教的 cache 細節

公開投影片除了第 3 頁 thought question 使用的假設成本外，沒有把 1-cycle hit 或 100-cycle miss 宣稱為硬體通則，也沒有介紹 direct-mapped／set-associative 結構、tag/index/offset、replacement、write-through／write-back、prefetcher 或 coherence。這些都是後續 systems 與 architecture 課會遇到的重要內容，但放進本篇會把別的材料冒充成 Lecture 25 agenda。

第 5 頁只寫著 `Demo: cache.c`。公開 archive 沒有附上該份程式碼、逐字稿或 demo 結果，因此本文能確認 demo 的存在，不能重建它操作的資料、輸出或效能差距；上面的 traversal 實驗是依 locality 模型設計的練習，不冒充課堂 demo。

同樣地，本文沒有聲稱 stack data 天然比 heap data 更能命中 cache。兩者是 lifetime／allocation mechanism 的分類；locality 取決於實際 addresses、layout 與 traversal。也不能把「較少 cache misses」直接等同於「程式一定更快」，因為總 instructions、branch、I/O 與同步都可能主導時間。

## 可帶走的檢查方法

面對一段慢程式，先問三件事：同一小批資料是否很快被重用？接下來的存取是否接近目前地址？活躍工作集是否可能大到擠出先前資料？接著選一個最小修改，例如交換 nested-loop order、分塊或調整 hot fields 的排列，保持輸入與正確性檢查不變，再比較 measurement。

Lecture 25 的價值正是克制。它沒有要求背一張硬體參數表，而是把效能推理從「每個 operation 都同價」改成「資料在哪裡、最近與附近會用什麼」。掌握 temporal 與 spatial locality 後，source-level traversal 才能和底層 memory hierarchy 接上；保留材料邊界，則避免把合理直覺誤寫成機器保證。

## 更新紀錄

- 2026-08-22：補回第 3 頁 cache 成本思考題及計算，並記錄第 5 頁 `cache.c` demo 的公開材料缺口。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 25 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [Valgrind Cachegrind manual](https://valgrind.org/docs/manual/cg-manual.html)
