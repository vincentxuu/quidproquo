---
title: "Stanford CS111 Lecture 22：Directory Lookup、Hard Link 與 Symbolic Link"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 23
tldr: "Directory 把文字名稱映射到 file-system-local i-number；hard link 共享 inode 與 reference count，symbolic link 則保存 pathname，換得跨檔案系統能力但可能形成 loop 或 dangling link。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 22：inode array、hierarchical directories、pathname traversal、working directory、hard links 與 symbolic links。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-22-directories-links-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 23 篇，對應 **Stanford CS111, Spring 2026, Lecture 22**。2026-05-18 由 Mendel Rosenblum 主講，官方題目是 [Directories and Links](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)。本文逐頁依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不公開，未把口述內容當成來源。SHA-256 稽核顯示 Lecture 22 與相鄰 Lectures 21、23 都不同，沒有 duplicate artifact。

## 從 inode blocks 到持久的 i-number

前一講回答 inode 如何找到 file blocks，這講反過來問：給定名字，OS 如何找到 inode？inode 本身也要跨 reboot 保存，因此 file system 把 inode array 切成 blocks，放在 disk 的已知位置。i-number 是 array index，在同一 file system 內唯一識別 inode，也是 kernel 辨認 file 的底層名稱。

Original Unix 把固定大小 inode array 放在 disk 開頭；later Unix 移到中間以縮短平均 seek；BSD 再把多組 inode blocks 分散於 disk，使 inode 靠近其 data blocks。這是 locality 的演進，不是 i-number 語意改變。位置策略可換，給定 i-number 能定位持久 inode 的承諾仍須成立。

file open 時，inode 留在 main memory，讓 read/write 找到 disk blocks；close 時寫回 disk。即使只有 read，也可能修改 access-time fields，因此「沒改 file bytes」不等於 inode 完全沒變。這個 deck 的說法是概念模型，不宣稱所有現代 mount option 都必然逐次更新 atime。

## Directory 是 name 到 i-number 的檔案

使用者想用 text names，file system 以 directory 映射 name 到 i-number。早期 personal computer 可能全 disk 只有一個 directory；TOPS-10 類設計讓每個 user 有一個，減少使用者間命名衝突；hierarchy 則允許 directory entry 指向另一個 directory，形成可組織的 tree。

Linux 與 macOS 以 slash 分隔 path levels，例如 `/usr/class/cs111`；Windows 的[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)例子使用 backslash。UNIX/Linux directory 像普通 file 一樣有 inode，但 type 是 directory，內容是 `<name, i-number>` pairs，entries 沒有特定排序。投影片的 historical struct 使用 14-byte name 加 number，這不是現代所有 file system 的固定格式。

只有 OS 能寫 directory，因為任意 user write 若能製造不存在的 i-number、重複或循環結構，就會破壞 namespace invariants。投影片補充現代甚至限制直接 read；應用程式使用 directory system interfaces，而非把它當一般 byte file 修改。

## open("/a/b/c") 是逐層 traversal

kernel 一開始並不知道完整 pathname 對應的 i-number，必須拆成 `/`、`a`、`b`、`c`。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)模型指定 root directory i-number 為 1：先讀 inode 1 與 root directory blocks，搜尋 name `a` 得到其 i-number；再讀 a 的 inode 與 directory blocks 找 b；最後由 b 找 c，讀 c inode，才完成 open。

配圖的具體鏈是 root 中 `a → 17`、a directory 中 `b → 23`、b directory 中 `c → 42`。接著 `read(fd, buf, 32)` 透過已開啟檔案的 inode 42 找 data block。名稱只參與 open-time lookup；file descriptor 讓後續 I/O 不必每次重走完整 path。

每一層都可能需要 inode 與 directory-block I/O，cache 因而同樣重要。更關鍵的是每個中間 component 必須是可 traversal 的 directory；只在最後一刻檢查 c 不足以保證 path 合法。這講沒有展開 permission algorithm，但逐層解析已顯示權限與 mount boundary 不能只在終點處理。

## Absolute path 與 working directory

每次寫 full pathname 很累，所以 OS 為每個 process 保存 working directory 的 name/i-number。Linux/macOS 的 `pwd` 印出其名稱表示。pathname 若以 slash 開頭，lookup 從 root 開始；沒有 slash 開頭，則從 process working directory 開始。

working directory 是解析起點的 process state，不是把相對 path 永久改成某個字串。process 改變 cwd 後，相同 `a/b` 會指向不同 lookup；已取得的 file descriptor 則仍指向先前 open 的 file object。投影片聚焦 lookup 起點，後一句是由其模型直接推出的介面區分。

## Hard link：多個名字，共用一個 inode

directory entry 本身就是一個 link。多個 entries 可以保存同一 i-number，因此兩個以上 names 指向同一 file，現在稱 hard links。inode 的 reference count 記錄有多少 directory links；移除一個名字只減少 count，最後一個 link 消失時 file 才能刪除。

例子從 `/a/b/c` 的 inode 42 出發，working directory 是 `/g`。執行 `ln /a/b/c c` 與 `ln /a/b/c t` 後，g directory 的 c 與 t 都指到 42，原本 b directory 的 c 也指到 42，reference count 從 1 變 3。這三個名稱沒有「原件／捷徑」之分，都是同等的 inode references。

`rm` 因而是移除 hard link，不保證立刻抹除資料。每個 directory 又有 `.` 指自己、`..` 指 parent，讓 `./movietest` 或 `cd ../..` 能按同一 lookup 規則處理。reference count 必須連同這些結構 links 維護。

## Hard link 為何有兩個限制

一般使用者不能替 directory 建 hard link，因為任意 directory-to-directory links 會形成 cycles，使原本 tree traversal、parent relation 與回收變得困難。`.` 和 `..` 是 file system 受控建立的特殊結構，不表示使用者可隨意造環。

hard link 也不能跨 file systems/disks，因為 i-number 只在一個 file system 內有意義。另一個 file system 的 inode 42 可能是完全不同 object，directory entry 只有 i-number，沒有足夠資訊指定外部 namespace。BSD Unix 因此加入 symbolic links，改存 pathname 而不是共享 inode number。

## Symbolic link 保存的是 pathname

symbolic link 是內容為另一個 pathname 的特殊 file，inode type 標示 symbolic link。lookup 遇到它時，把 symlink contents prepend 到 remaining path，再繼續解析。若內容以 `/` 開頭，重新從 root lookup；若是 relative path，就從包含該 symlink 的 directory 繼續。

投影片例子在 `/a` 執行 `ln -s e/f b`。之後 `cat /a/b/c` 先在 a 找到 b，讀出 `e/f`，再解析 `e/f/c`，效果等同 `cat /a/e/f/c`。relative target 的基準不是呼叫者目前 cwd，而是 symlink 所在 directory；這是最常誤判的語意。

pathname 不受本地 i-number 限制，所以 symlink 可跨 file systems，也能指向 directory。代價是可能形成 lookup loops，或 target 不存在而成為 dangling link。有時 dangling 是刻意的，例如先建立名稱、稍後才掛載或產生 target；kernel 仍需為循環解析設定終止邊界。

## 用 identity 與 indirection 分辨兩種 link

hard link 增加同一 inode 的 namespace references：改其中一名看到的 bytes，其他名字立即看到同一內容；移除一名只改 count。symlink 自己有 inode 與 bytes，內容恰好是一段待重新解析的 pathname；target 被 rename 或移除時，它不會自動跟著 identity 移動。

可以用三題檢查：rename target 後哪種 link 仍指同 inode？跨 file system 時哪種能工作？relative symlink 從哪個 directory 展開？答案分別是 hard link、symbolic link、symlink 所在 directory。這三題把 reference identity 和 pathname indirection 清楚分開。

## 更新紀錄

- 2026-08-22：依 Lecture 22 官方 PDF 重寫 inode placement、pathname traversal、working directory、hard links 與 symbolic links，並完成相鄰 artifact SHA 稽核。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 22 slides: Directories and Links](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)
- [POSIX link()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/link.html)
- [POSIX symlink()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/symlink.html)
