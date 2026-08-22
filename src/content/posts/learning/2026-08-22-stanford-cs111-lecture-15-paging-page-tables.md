---
title: "Stanford CS111 Lecture 15：page、frame、page table、TLB 與多層頁表"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 16
tldr: "第 15 講以固定大小 pages 消除跨 process external fragmentation，再拆解 x86-64 四層 page-table walk、sharing/aliasing 與 TLB，說明 translation speed、table sparsity、context switch 和 page size 的連動取捨。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 15：pages/frames、PTE protection、四層 page tables、sparse address spaces、TLB、OS user-memory access、aliasing 與 fragmentation。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-15-paging-page-tables-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 16 篇，對應 **Stanford CS111, Spring 2026, Lecture 15**。2026-05-01 由 Mendel Rosenblum 主講，官方題目是 [Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Segmentation 仍以 variable-size regions 配置 physical memory，留下 external fragmentation。Paging 的 key idea 是 virtual 與 physical address spaces 都切成 fixed-size chunks：virtual **pages** 對應 physical **page frames**。[官方 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf) 舉 4 KB（並戲稱 x86 myth）與 MacBook 16 KB 為常見例子；這是課堂快照，不是所有機器規格。

## 1. VPN、offset 與 PTE

Virtual address 拆成 virtual page number（VPN）與 page offset。MMU 用 page map/page table 把 VPN 映到 physical page number（PPN），offset 原樣保留，所以 `physical = PPN | offset`。Page size 是 4 KB 時，offset 正好 12 bits。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

Page-table entry（PTE）不只放 PPN，還有 present 與 protection，例如 writeable。Present=0 代表這個 virtual page 現在沒有有效 mapping；writeable=0 可讓 code page read/execute 而不能寫。每個 process/address space 有自己的 map，同一 VPN 可映到不同 PPN。

固定大小讓 physical allocator 只維護 free-page list：allocate 移出一 frame，free 放回，不必找 variable-size hole。Program-visible segment 則可由所需數量 pages 組成，從任何 page boundary 開始；physical frames 不必 contiguous。

## 2. 單層 page table 為何太大

PDF 的 x86-64 myth machine 使用 64-bit virtual address、4 KB page；上方 16 bits 不使用，所以有效 virtual address 48 bits。扣掉 12-bit offset，VPN 有 36 bits，也就是 `2^36` 個可能 pages。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

若每個 PTE 8 bytes，flat map 大小是 `8 × 2^36 = 2^39 bytes = 512 GB`，而且是 **每個 process**。實際 address space 常很 sparse：code/data 在低位址，stack 在最高端，中間幾乎全空。為不存在 mappings 配 512 GB table 完全不可行。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

解法不是縮短 virtual address，而是把 map 自身也分頁，只為使用到的 branches 配置 lower-level tables。這把 memory overhead 從「整個可能空間」改成「實際 mapping 附近的 tree nodes」。

## 3. 四層 x86-64 page map

一張 4 KB map page 可容納 `4096/8 = 512 = 2^9` 個 entries，因此每層 index 用 9 bits。先加入 PML1，36-bit VPN 尚有 27 bits 無法索引；持續加層，得到 virtual-address fields：（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

```text
unused 16 | PML4 9 | PML3 9 | PML2 9 | PML1 9 | offset 12
```

PML4 base register 指向 top-level table。PML4 entry 指向 PML3 page，PML3 指 PML2，PML2 指 PML1，PML1 PTE 才給 page frame/protection。Intermediate present bits 允許整個未使用 subtree 不存在，正好壓縮 sparse address space。

最終 physical address 在投影片例子是 52 bits：PPN/page-frame 部分 40 bits，加 12-bit offset。Virtual 的 unused upper bits、physical width 與 PTE encoding 都是該 myth model 的假設，不能直接當所有 x86-64 implementations 的唯一規格。

## 4. Code、data、stack 的 page walk

範例 address space 只有三頁：code 在 `0x0000`、data 在 `0x1000`、stack 在頂端 `0xFFFFFFFFF000`。Access code `0x0–0xFFF` 時，PML4/PML3/PML2/PML1 indices 都是 `0x0`；walker 從 PML4 base 連走四張 table，最後取得 code PTE。

Data address `0x1008` 的 indices 是 `0,0,0,1`，offset `0x8`；它與 code 共用前三層，僅 PML1 entry 不同。這展示相鄰 virtual pages 如何共享上層 metadata。

Stack top page 的 indices 全是 `0x1FF`（每層最後一個 512-entry slot）。它走完全不同的 high-address branch。雖然 code 與 stack virtual 距離極遠，只有各自 paths 需要 table pages；中間 huge gap 不占 flat entries。

整體結構是 radix tree/trie：每 9-bit chunk 選一個 child，最後 leaf 保存 PTE。Page walk 不是 hash lookup，也不是把完整 36-bit VPN 一次放進 array。

## 5. Sharing 與不同 page sizes

最小 sharing 單位是一個 4 KB page：兩個 processes 的 PML1 entries 指向同一 PPN。也可以在更高層共用 subtree。PDF 算出 PML2 entry 覆蓋 `512×4 KB = 2 MB`，PML3 覆蓋 `512×512×4 KB = 1 GB`，PML4 entry 覆蓋 `512 GB`。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

同一 hierarchy 也可支援 4 KB、2 MB、1 GB pages，讓 higher-level entry 直接指 large frame 而不繼續 walk。Large pages 減少 table/TLB entries，卻提高 internal fragmentation 且配置需要較大 contiguous physical region。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

Shared mapping 不等於同一 virtual address。兩個 PTE 可從不同 VPN 指向同 PPN；protection 也可依 address space 不同，例如一方 read-only、另一方 read-write。Permission 和 synchronization 仍是不同契約。

## 6. 四次 memory references 與 TLB

Page maps 太大，不能全放 MMU fast memory，只能在 main memory；MMU 只保存 top-level base。若每個 application memory access 都先做四次 PML references，再做真正 data reference，成本不可接受。

Translation Lookaside Buffer（TLB）是 MMU 內的小型 recent-translation cache。PDF 給 typical 64–2048 entries；entry 含 VPN（myth x86-64 為 36 bits）、PPN（40 bits）與 protection。它需要極快與高 hit rate，常用 fully associative lookup；投影片列典型 hit rate 95% 以上，依賴 memory-reference locality。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)）

CPU 發出 `VPN|offset`：TLB hit 就取得 PPN、檢查 protection 並存取；miss 才 walk page map，再把 VPN/PPN/protection 填回 TLB。TLB 不改變 translation truth，它只是 cache；page table 才是 authority。

## 7. TLB 與 OS 的一致性責任

Context switch 換 page tables 時，舊 VPN→PPN cache 不能誤用到新 process。PDF 說 x86-64 assignment to PML4 base 會 flush TLB；某些 architectures 在 TLB entry 放 PID/address-space identifier，讓不同 processes translations 共存而避免全 flush。

修改 PTE 後也要 invalidate 對應 cache entry，否則 CPU 繼續用 stale PPN 或 permissions。x86-64 提供 `INVLPG`。順序很重要：先撤銷 PTE 卻不 invalidate，並不立刻撤銷已 cached access；在多核心還要讓其他 cores 同步失效，雖然 PDF 沒展開 shootdown protocol。

這延續課程的 cache invariant：authority 改變時，derived fast-path state 必須同步或作廢。TLB hit 越快，越不能省略 invalidation contract。

## 8. OS 如何存取 user memory

System call `write(fd, buffer, length)` 把 user virtual pointer 交給 kernel。若 OS 完全 unmapped、用 physical addresses，user buffer 的 virtual-contiguous pages 可能分散在 physical frames，kernel 必須 software translate 並逐頁處理。

另一方案把 OS 映到所有 processes virtual spaces：每個 address space 有 shared OS code/region 和 private user code/data/stack，trap 後 kernel 可在 mapping 下存取。這簡化 translation，但 I/O devices 使用 addresses 時仍有問題；PDF 只提出 device issue，沒有在本講展開 IOMMU。

## 9. Aliasing 與 fragmentation 結論

**Memory aliasing** 是多個 virtual addresses 指向同一 physical page，只需 duplicate PML1 PTE。User process 看到同一 variable 有兩個 virtual copies可能怪異，但 OS 常用 alias 讓 physical memory 容易存取。對一個 alias 寫入，另一個立即看到相同 bytes，因為底層只有一 frame。

Paging 消除 processes 之間的 **external fragmentation**：任何 free frame 都可服務任何 virtual page，不需要整個 segment contiguous。但 page 內最後未使用 bytes 是 **internal fragmentation**；通常每 segment 最後一頁有浪費，page 越大，最壞浪費越大。

Lecture 15 的取捨因此是一組連動：fixed pages 簡化 allocation 並支援 sparse mappings；multi-level tables 節省 table memory卻增加 walk；TLB 以 locality 隱藏 walk，卻增加 invalidation/context-switch responsibility；large pages 減少 metadata/TLB pressure，卻增加 internal waste。後續 demand paging 才會討論 present=0 時如何從 disk 補頁。


## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 15 slides: Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP：Paging Introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf)
- [OSTEP：Faster Translations with TLBs](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf)
- [Intel 64 and IA-32 Architectures manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
