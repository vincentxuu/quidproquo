---
title: "Stanford CS111 Lecture 16：Page Fault、Demand Fetching 與 Prefetch"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 17
tldr: "Demand paging 只在需要時載入頁面；present bit、精確例外與可重啟指令讓核心能從 executable、zero-fill 或 backing store 安全補頁。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 16：page-fault mechanism、restartable instructions、demand fetching、page sources 與 prefetch。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-16-demand-paging-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 17 篇，對應 **Stanford CS111, Spring 2026, Lecture 16**。2026-05-04 由 Mendel Rosenblum 主講，官方題目是 [Demand Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf)。官方 Lecture 16/17 PDFs 逐位元組相同；錄影又不公開，因此無法證明實際口述分界。為避免重複，本文聚焦 fault/fetching mechanism，[Lecture 17](/posts/learning/2026-08-22-stanford-cs111-lecture-17-page-replacement)承擔 replacement policy。

## 從位址空間到真正的虛擬記憶體

前幾講把每個行程看到的虛擬位址，透過頁表映射到實體頁框。若要求行程的所有頁面都常駐 DRAM，這仍主要是隔離與重新定位技術。Demand paging 再往前一步：行程可以在資訊尚未全部進入記憶體時開始執行。近期用到的頁面留在 DRAM，閒置頁面的內容則位於可執行檔或 backing store；投影片也把後者稱為 swap space。

設計依賴 locality。位址空間或許很大，但行程在一段時間內反覆觸及的通常只是其中一部分。只要活躍頁面放得下，多數存取仍可命中 DRAM，行程便像是擁有比實體記憶體更大的空間。投影片稱這種組合為「真正的 virtual memory」：轉譯現在也支撐 DRAM 與儲存裝置之間的階層。

[官方 Lecture 16 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf)用量級數字說明，DRAM 可比磁碟快約十萬倍、比 SSD 快約一千倍，而磁碟或 SSD 每位元組又可便宜約百倍。這些是建立成本直覺的近似值，不是跨世代硬體保證。結論也不是「磁碟只是慢一點的 RAM」，而是慢路徑必須罕見；一旦缺頁頻繁，平均成本會迅速崩壞。

## Page fault 如何把不存在變成存在

頁表項的 present bit 為零時，MMU 不能完成轉譯，會陷入核心形成 page fault。核心首先判斷該虛擬位址是否屬於行程的合法區域。非法存取不能因 demand paging 而被「補一頁」掩蓋；只有合法但尚未常駐的頁面，才進入載入程序。

合法 fault 的流程是：找出可用實體頁框，從頁面的來源讀入內容，更新頁表項的頁框號與 present bit，最後重啟造成 fault 的指令。若沒有空閒頁框，「找頁框」本身就需要置換政策；被選中的舊頁若已修改，還可能先寫回 backing store。機制與政策在此分界：硬體與核心提供陷入、I/O、修改頁表與恢復執行的能力，政策決定載入哪些頁、犧牲哪些頁。

頁面尚未完整讀入且 PTE 尚未更新前，使用者指令不能把它當成有效映射。核心若在 I/O 完成前就宣告 present，另一個執行緒可能讀到半完成內容。fault 看似是一次例外，實際上把儲存裝置、頁框配置與頁表狀態接成一筆受控的狀態轉移。

## Faulting address 與可重啟指令

核心要修好 fault，必須知道哪個位址出錯。投影片以 x86 為例：硬體把 faulting virtual address 鎖存在 CR2 暫存器。核心讀取該位址、定位對應區域與頁表項，才能判斷是否合法並找到內容來源。只保存程式計數器並不夠，因為一條指令可能有多個記憶體運算元。

修復後還要重新執行同一條指令，因此架構必須讓 page-faulting instruction 可重啟。投影片用 `push` 說明陷阱：指令可能先更新 stack pointer，再向新堆疊位置寫入；若寫入才 fault，而重啟時又重複遞減 stack pointer，語意便錯了。處理器必須提供精確例外，讓重啟等價於該指令尚未發生，而不是讓核心猜測它完成到哪一步。

page fault 雖由軟體政策利用，卻依賴硬體機制。MMU 要能標出不存在，CPU 要保存足夠的 fault 資訊與精確狀態，核心才能在軟體中選擇來源與 victim。少了其中一層，lazy loading 就無法對一般程式透明。

## Demand fetching：每種頁面有不同來源

最極端的 demand fetching 是讓新行程一開始沒有任何使用者頁面常駐。第一次取指載入可執行檔的程式碼頁，第一次讀取已初始化資料時再載入資料頁。核心仍知道位址空間布局、合法範圍與各頁來源，只是延後實際 I/O。

未初始化資料、擴張中的 stack，以及新取得但尚未寫入的配置空間，不需要從檔案讀取舊內容。它們可取得全零內容；投影片把這類來源稱為 zero page。真正被修改、之後又遭置換的匿名頁，才需要 backing store 保存，以便下次 fault 還原。因此 `present=0` 不是單一語意：內容可能在 executable、swap，或可由全零規則重新產生。

來源差異也改變淘汰成本。乾淨的程式碼頁可直接丟棄，日後再從 executable 讀取；dirty anonymous page 沒有等價的原始副本，必須寫回。present、referenced 與 dirty 等 bit 因此不是枝節，而是核心判斷慢路徑工作的摘要。

## Prefetch：多讀一點是否值得

純 demand fetching 只在 fault 後取回所需頁面。Prefetch 則預測接下來需要哪些頁，趁一次 I/O 一併讀入。順序執行程式碼或掃描連續陣列時，鄰近頁面很可能很快被用到；若磁碟的尋道與命令延遲已支付，多傳幾個連續頁面的額外成本可能很小。

[同一份官方投影片的 prefetch 表](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf)列出的示意時間是：磁碟一次 page fault 約五至十毫秒，快速連續預取一頁約 0.04 毫秒；SSD fault 約五十至一百微秒，額外預取約十至二十微秒；DRAM 存取約五十至一百奈秒。這些是該講的教學量級，不是所有 2026 裝置的規格。它們表達固定 I/O 成本與 DRAM 延遲相差多個數量級，所以準確預取可以攤薄 fault，錯誤預取卻會浪費頻寬與頁框。

因此 prefetch 不會無條件勝過 demand。未使用的頁可能排擠真正活躍的頁，也可能讓其他行程更早 fault。要問的是預測命中率、額外傳輸成本與當下記憶體壓力是否支持這個猜測。


## 把 fetching mechanism 串起來

Demand paging 的 fetching path 可濃縮成一條迴路：present bit 讓硬體偵測缺頁，CR2 保存位址，核心驗證 mapping 並辨認 executable、zero-fill 或 backing-store source，I/O 完成後更新 PTE，最後以精確例外重啟原指令。Prefetch 只是在這條路徑上多讀預測頁。

可以用三題驗證理解：`present=0` 為何不等於非法位址？同一個 nonresident page 可能有哪些內容來源？為何 faulting instruction 必須可重啟？victim selection 與 thrashing 則轉交 Lecture 17。

## 更新紀錄

- 2026-08-22：依 duplicate-deck review 收斂為 page-fault、fetching 與 prefetch mechanism；replacement 轉交 Lecture 17。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 16 slides: Demand Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf)
- [OSTEP: Beyond Physical Memory—Mechanisms](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf)
- [OSTEP: Beyond Physical Memory—Policies](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf)
