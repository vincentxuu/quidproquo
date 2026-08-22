---
title: "Stanford CS111 Lecture 27：Trap-and-Emulate、Virtual I/O 與 Nested Page Tables"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, virtualization]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 28
tldr: "VM 把 process interface 擴成完整硬體介面；hypervisor 讓普通指令直接執行、攔截 privileged operations，並虛擬化 interrupts、I/O 與兩層位址轉譯。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 27：VM abstraction、simulation、direct execution、trap-and-emulate、virtual I/O、shadow/nested page tables 與 VM usage。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-27-virtual-machines-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 28 篇，對應 **Stanford CS111, Spring 2026, Lecture 27**。2026-06-01 由 Mendel Rosenblum 主講，官方題目是 [Virtual Machines](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)。本文逐頁依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不公開。SHA-256 稽核顯示 Lecture 27 與相鄰 Lectures 26、28 均不同，沒有 duplicate artifact。

## 從 process abstraction 到 machine abstraction

一般 OS process 看到 linear virtual-memory pages、non-privileged instructions/registers，以及 open/read/write、fork、thread create、wait、exit 等 system calls。這只是 underlying machine facilities 的 subset：CPU interface 相似，memory 與 files 卻已被 OS 大幅改造。

若把 process 做得像 hardware，它要看到所有 privileged 與 non-privileged instructions/registers、physical-memory pages、MMU/page maps、timer、disk、network、display，以及 traps/interrupts。system call 在這層只是 guest machine 裡的一種 trap。

這種私人機器般的 process 稱 virtual machine，可在內部跑完整 guest OS 與 applications。多個 VMs 分享一台 real machine，而管理它們的 OS layer 稱 hypervisor。每台 VM 可跑不同 guest OS；隔離邊界從 process 擴大成完整 software stack。

## Hosted 與直接控制硬體的 VMM

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)引用 Rosenblum 研究團隊 1999 年的圖，把 guest 的 x86、motherboard、disks、display 與 network 放在 Virtual Machine Monitor layer 上，再落到 real machine。這是講者研究脈絡的歷史 slide，不是所有現代 VMM architecture 的規格。

Hosted VMM 可作為既有 Linux 上的程式，Linux 控制 hardware；另一種結構由 VMM 直接控制 hardware，guest Linux/NT 4.0 都在其上。兩者差別是最低層資源 owner 與 trusted computing base，而不是 guest 應用程式是否看見 virtual PC。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)）

VM abstraction 的價值是 guest 不必改寫成 host system-call client。代價是 hypervisor 必須忠實重現 CPU、MMU、devices、interrupt timing 與 privilege semantics；介面比一般 process 大很多，實作與攻擊面也隨之增加。

## 全模擬太慢，direct execution 抓住 common case

最直觀做法是寫 simulator：逐條模擬 CPU instruction，以 large array 模擬 physical memory/MMU，以 disk-image file 模擬 disk，也模擬 kernel/user bit 與 interrupt vectors。它能執行不同 ISA 或精確控制狀態，但[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)估 CPU/memory slowdown 約 100×、I/O 約 2×。

較快方法讓 CPU simulate itself：guest OS 在 host user mode 執行，大多數普通 instructions 直接跑到真 CPU；CLI、STI、POPF、HALT 等 privileged instructions 觸發 trap，由 hypervisor simulator 處理。kernel code 中 privileged instructions 相對少，simulation overhead 因而只落在少數路徑。

這就是 trap-and-emulate 的效能論證：常見操作 native execution，敏感操作受控轉移。前提是會影響 isolation 的 instruction 必須可靠 trap；若敏感行為能在低 privilege 靜默改變狀態，hypervisor 便無法攔截並維持 illusion。

## CLI 範例：虛擬狀態不等於實體狀態

guest OS 在 CPU user mode 遇到 CLI，硬體產生 illegal-instruction trap。real machine IDT 指向 hypervisor handler；handler 檢查 faulting instruction，辨認 CLI，再把該 VM 的 virtual interrupt-masked state 設定起來。

hypervisor return 時，real CPU 回 user mode、從 CLI 下一個 address 繼續，guest OS 觀察到 interrupts 已 masked。它沒有真的關掉 host interrupts，否則一台 VM 可阻斷所有 guests 與 hypervisor；被改變的是 virtual CPU control block。

這個區分是 virtualization 核心：guest privileged state 必須存在於可攔截的 virtual representation，real privileged state仍由 hypervisor掌握。emulation 不只算出 instruction 結果，也要安排正確 next PC、exception visibility 與 pending virtual events。

## Guest system call 的雙層 privilege

application 在 guest user mode 執行 syscall 時，real CPU 先 trap 到 hypervisor，因 real IDT 屬於 VMM。hypervisor 查 virtual IDT 與 virtual register control block，模擬 syscall entry：把 vCPU 標成 guest kernel mode，卻讓 real CPU 回 user mode執行 guest kernel。

guest OS 處理自己的 process control block 與 system call，最後執行 sysret。這又 trap 到 hypervisor；VMM 模擬 return，把 vCPU 改回 guest user mode，再讓 real CPU user mode 執行 application。圖中的 real kernel mode 只在 hypervisor traps 期間出現。

因此有兩套狀態：guest 認為的 user/kernel bit，和 hardware 真實 privilege。guest kernel 不能取得 real kernel authority，卻必須相信自己有 privileged machine。逐格 syscall/sysret slides 正是在展示兩者如何交錯而不混淆。

## Virtual I/O 與 paravirtualization

一般 OS 透過 memory-mapped registers、DMA、interrupts 操作 device。guest 寫 virtual device register 時，hypervisor 安排 access trap，handler 模擬 device；操作完成後，再向 virtual CPU 注入 virtual interrupt。真實 I/O 可由 host device、file 或 software backend 完成。

每個 register access 都 trap 會昂貴。若願意修改 guest OS，可裝新的 virtual device driver，改用 hypervisor 提供的高階 calls 批次溝通，減少 traps；投影片稱為 paravirtualization。它用 guest portability／透明度換較小 emulation overhead。

paravirtualization 不是「沒有 virtualization」，而是 guest 知道自己在 virtual environment，選擇更有效率的介面。完全模擬保留 unmodified guest compatibility；兩者可並存，例如 CPU 直接執行而 I/O 採 paravirtual driver。

## Shadow page maps 與硬體第二層轉譯

guest application 產生 guest virtual address，guest OS page table 將它映射到 guest “physical” page；hypervisor 還要把 guest physical 映射到 host machine page。真實 MMU 最終需要能執行兩階段組合後的 translation。

早期做法由 hypervisor 維護 shadow page maps，直接裝進 actual MMU。guest 修改 page table 時，VMM 必須攔截並同步 shadow；某些 workload page-table updates 很多，維護成本很高。shadow 的 correctness 也要求任何 guest mapping change 都不能繞過監控。

Intel 與 AMD 後來加入另一層硬體 page tables：VM 內 virtual→physical，hypervisor physical→machine。硬體 walk 組合兩層，降低 shadow synchronization traps。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)只說 x86-64 extensions，沒有指定 EPT/NPT 版本或 benchmark，因此本文不補未提供的產品細節。

## Encapsulation、歷史與 cloud consolidation

VM encapsulates all execution state，因此可 duplicate、save、move。這把「一台執行中的機器」變成可管理 resource。software development 可為不同 OS versions 保存 VMs，在單一 machine 測試，並用 snapshot-like encapsulation 重複環境。

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)把 VM 起源放在 IBM late 1960s：電腦稀少昂貴，一個 user 一台 VM、各跑 single-user guest OS。1980s–1990s 個人擁有 private machine、time-sharing OS 更實用，VM 興趣下降；mid-1990s 因 Windows dominant position 等需求再度受重視。這是 deck 的簡化產業史，不是完整發明權年表。

data center 原本常為 isolation 讓每台 machine 跑一個 application，但單一 app 只用部分資源。consolidation 改成一 app 一 VM、多 VMs 共用 host，減少 machines，並讓 hardware provisioning 與 software 分離，進一步促成 cloud computing。隔離提升 utilization，卻把 hypervisor 變成共享故障與信任邊界。

## 更新紀錄

- 2026-08-22：依 Lecture 27 官方 PDF 重寫 VM abstraction、trap-and-emulate、virtual I/O、memory virtualization 與 usage，並完成相鄰 artifact SHA 稽核。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 27 slides: Virtual Machines](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [AMD64 Architecture Programmer’s Manual, Volume 2](https://docs.amd.com/v/u/en-US/24593_3.41)
