---
title: "Stanford CS111 Lecture 23：從 fsck、Ordered Writes 到 Write-Ahead Logging"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 24
tldr: "檔案系統一次操作會改動多個 block，崩潰卻可能發生在任兩次寫入之間；本講比較 fsck、ordered writes 與 write-ahead logging 如何交換復原時間、效能、耐久性與一致性。"
description: "導讀 Stanford CS111 Spring 2026 Lecture 23：檔案系統崩潰模型、fsck 修復、ordered writes，以及 write-ahead logging 的入口。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-23-crash-recovery-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 24 篇，對應 **Stanford CS111, Spring 2026, Lecture 23**。2026-05-20 由 Mendel Rosenblum 主講，官方題目是 [File System Crash Recovery](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)。公開 PDF 有 23 頁。它與 Lecture 24 的 SHA-256 不同，內容卻近乎完全相同；文字只差 `/lost+found` 的斜線與四處句點，因此不能用 hash 不同推論為獨立素材。本文負責 crash model、`fsck`、ordered writes 與 WAL 入口；Lecture 24 接續 transaction、checkpoint 與 durability。錄影位於 Canvas／Panopto 後方，本文不把未觀看的口述內容當成來源。

這講只問一個尖銳的問題：一個檔案系統操作需要修改 free map、inode、directory entry 等多個 disk blocks，但硬碟不提供任意多 block 的 atomic write；如果機器剛好在中間斷電，重開機後該相信哪個版本？投影片依序比較三條路：事後用 `fsck` 掃描修復、事前約束寫入順序，以及先寫 log 再套用更新。三者都在處理一致性，卻對資料遺失、啟動時間與正常路徑成本做出不同選擇。

## 崩潰後，大部分 OS 狀態可以重來，檔案系統不行

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)第 3 頁先縮小問題範圍。重新開機會清掉 volatile memory，因此排程佇列、process table 等狀態可以從乾淨狀態重建；使用者卻預期 disk 上的資料跨越 crash 存活。檔案系統若只說「重開就好」，等於放棄它最核心的持久性承諾。

第 4 頁把危險拆成兩類。第一類是 **data loss**：recent changes 仍停在 block cache，尚未寫回 disk。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)以 original Unix 最多延遲約 30 秒作歷史例子；這是課堂案例，不是現代系統對每次 `write` 的固定保證。第二類是 **inconsistency**：一個邏輯操作跨越多個 metadata blocks，只有其中一部分到達 disk。buffer cache 還可能重排 writes，因此程式呼叫更新的順序，不等於裝置實際持久化的順序。

兩個例子把 partial update 具體化。配置新 block 給檔案時，free map 可能已把 block 標成占用，inode 卻還沒指向它；建立 hard link 時，directory entry 可能已出現，inode reference count 卻還沒增加。前者洩漏空間，後者讓「有幾個名字指向 inode」與計數不一致。問題不只是少一筆資料，而是 disk 上同時存在互相衝突的說法。

## 方法一：fsck 從全域 metadata 推回一致狀態

第 5–10 頁介紹 Unix `fsck`（file system check）。正常 shutdown 最後寫入 clean bit；下次啟動若看見乾淨標記就略過完整掃描，否則讀遍 inode、indirect blocks、doubly indirect blocks、free map 與 directories，找出彼此不一致的 metadata 再修復。這是一種「先讓更新發生，失敗後再從全域不變量推理」的設計。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)）

投影片先給兩個相對明確的修法。若某 block 已被 inode 引用，free map 卻仍說它可配置，`fsck` 應把它從 free set 移除，否則之後可能再次配置給另一個檔案。若 inode 的 reference count 與所有 directories 中實際 links 數量不合，就以掃描結果修正計數。兩者都能從完整 metadata 導出較合理的唯一答案。

更難的案例是同一 block 同時屬於兩個 inodes。這可能由「刪除 A、建立 B、延遲寫回又重排」的序列形成。修復程式沒有原始操作意圖，只看到事故現場；它可以任選一方保留、複製 block 給兩方，或從兩方移除，但沒有證據知道哪個答案符合使用者本意。另一個案例是 reference count 大於零，卻沒有任何 directory 指到該 inode：內容還在，名字已遺失。傳統修法是在特殊的 `lost+found` directory 建立新 link，保存可救回的內容，但原始路徑與語意已無法自動復原。

因此 `fsck` 的能力邊界很清楚：它能把 metadata 拉回某個一致狀態，不能保證資訊與原意都保留。高層 directory 若受損，修完的系統仍可能難以使用；block 內容若從敏感檔案錯接到別處，還會形成 security 問題。完整掃描時間也隨容量增加。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)用 5 TB disk 示範：順序讀完整顆約需 8 小時，若隨機讀 10% 則可能拖到數週。這些是 deck 的硬體模型，不是所有 5 TB 裝置的通用 benchmark；重點是 recovery work 跟檔案系統規模綁在一起。

## 方法二：Ordered Writes 先選擇比較不壞的中間狀態

第 11–14 頁把策略從事後修復改成事前限制。配置新 block 時，先把 free map 寫成已占用，再寫 inode pointer。任一時點 crash，都不會留下「同一 block 同時可配置又被 inode 使用」的危險狀態；若第一步完成而第二步未完成，頂多洩漏一個 block。ordered writes 沒有讓多 block update 變成 atomic，而是刻意讓所有可能的中間狀態偏向較容易承受的一側。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)）

投影片把規則一般化成兩句：儲存 pointer 前，先初始化它指向的資訊；要重用 resource 前，先清除所有舊 pointers。前者避免 inode 指到尚未準備好的 indirect block，後者避免同一 data block 同時掛在兩個 files 下。只要每個依賴都遵守，重開機不必先等完整 `fsck` 才能提供服務；遺漏資源仍可稍後在背景掃描取回。

最直覺的實作是 synchronous write-through：每一步真的落盤後才進下一步。它容易說明，卻把 disk latency 放進每次檔案操作。改良版把 dependency 記在 buffer cache；例如 inode block 依賴 free-map block，cache 要寫回 inode 前會先推送 free map。如此可保留 delayed writes，但 dependency graph 可能形成 cycle，系統必須強制寫出部分 blocks 打破循環。排序規則本身也會成為需要證明正確的複雜狀態。

## 方法三的入口：先留下可復原的承諾

第 15 頁提出 write-ahead logging（WAL）：真正修改 home blocks 前，先把操作資訊追加到特殊 log；若中途 crash，recovery 可依 log 完成更新。相較 `fsck` 從全域 metadata 猜測意圖，WAL 先留下意圖；相較 ordered writes 管理大量相依關係，WAL 允許 home updates 之後以不同順序落盤。

但「先寫 log」只是一句設計原則，還不是完整協定。多筆 entry 如何成為 all-or-none？replay 自己又 crash 怎麼辦？log 如何回收？結構一致是否等於近期資料已 durable？這四題由 [Lecture 24](/posts/learning/2026-08-22-stanford-cs111-lecture-24-journaling-file-systems)接續。

## 投影片逐頁索引

- 第 1–4 頁：課題、選讀範圍、為何 file system crash recovery 特別，以及 data loss／inconsistency／write reordering。
- 第 5–10 頁：clean bit、`fsck` 全域掃描、free map／reference count 修復、雙重擁有、`lost+found` 與規模限制。
- 第 11–14 頁：ordered writes、pointer rules、resource leak、synchronous writes、buffer-cache dependencies 與 cycles。
- 第 15 頁：以 WAL／journaling 作為第三種復原策略的入口。
- 第 16–23 頁：由 Lecture 24 接續 entry、transaction、checkpoint、`fsync` 與最終取捨。

## 更新紀錄

- 2026-08-22：修正 duplicate artifact 推論，並將本講收斂到 crash model、`fsck`、ordered writes 與 WAL 入口。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 23 slides: File System Crash Recovery](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)
