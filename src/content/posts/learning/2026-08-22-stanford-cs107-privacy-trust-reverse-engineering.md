---
title: "Stanford CS107 Lecture 20：Reverse Engineering 之後，先問 Privacy 與 Trust，再進 Heap Allocator"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, privacy, trust, memory-management]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 21
tldr: "CS107 第 20 講把 reverse engineering 能力放回倫理脈絡：privacy 有個人與社會模型，trust 等於 reliance 加上 betrayal risk；接著複習 process memory，從 malloc client 轉成 heap allocator implementer。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 20：privacy 四種模型、trust、penetration testing、differential privacy 的威脅模型、process memory，以及 heap allocator 的第一個心智模型。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-privacy-trust-reverse-engineering-en)

前六講讓我們能追蹤 C 的 bytes 與 pointers，中段把函式翻成 x86-64，上一講則讓 buffer overflow 從抽象錯誤變成可讀的控制流程。Lecture 20 在進入 allocator 實作前刻意停一下：既然 reverse engineering 能揭露程式原本不打算公開的行為，會做與該不該做之間，必須補上一套 privacy 與 trust 的判斷語言。

本講不是把倫理當成技術之外的裝飾。安全研究者能找到漏洞，是因為被允許或自行取得了特殊能力；資料管理者能做統計，是因為手上集中著別人的資訊；allocator 能重用一段空間，是因為 client 承諾不再碰已 `free` 的 block。三個問題其實相通：**誰能做什麼、我們依賴誰、背叛之後誰承擔風險？**

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 20，2026-02-23
- 官方標題：Privacy, Trust and Heap Preview；PDF 標題另列 Reverse Engineering, Privacy and Trust / Managing Heap: Preamble
- 講者：syllabus 列 Jerry Cain；PDF metadata 的作者也是 Jerry Cain
- 已讀材料：官方 calendar、完整 32 頁投影片、Dwork 的 differential privacy 論文、Rogaway 的 cryptography ethics 論文與 NIST Privacy Framework 頁面
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；本文只重建投影片可驗證的內容，不虛構課堂討論答案

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講放在 reverse engineering 與 heap allocator 之間。完整 agenda 是：machine code 與 security 的關係、privacy 四種模型、individualist／societal 分組、privacy loss、trust、penetration testing、differential privacy 的威脅模型、process memory 與 stack 複習、heap lifetime、`malloc`／`free`／`realloc` client contract，以及 allocator 如何管理連續記憶體。最後一段只是 allocator preamble；free list、fragmentation 與 metadata 屬於後續講次，本文不提前展開。

## Reverse engineering 是能力，不是授權

回答「電腦如何解讀並執行 C」有兩個直接用途。第一，理解 compiler、register、stack 與 machine code，能寫出更可靠的程式。第二，同一份理解也能反向推回未知 binary 的結構，找出程式可以被操控的位置。前者通常被叫做 systems programming，後者可能是 debugging、相容性研究、malware analysis、penetration testing，也可能是未經授權的侵入。

技術動作本身不足以判斷正當性。讀 disassembly、製造特定 input、觀察 crash、控制 instruction pointer，在授權測試裡可以保護使用者，在不受允許的系統上則可能造成傷害。判斷至少要問：系統所有者是否同意、範圍到哪裡、測試資料是否包含真人資訊、發現漏洞後如何保存與通報、誰有權決定公開時點。

這也是 Assign5 前安排本講的理由。作業提供的 exploit 練習有課程定義的目標、範圍與教學目的。能在 sandbox 裡成功，不等於取得把相同方法套到公共服務的許可。最成熟的學習成果不是「我能打穿」，而是能同時說清楚 capability、authorization 與 impact。

[Rogaway 的〈The Moral Character of Cryptographic Work?〉](https://web.cs.ucdavis.edu/~rogaway/papers/moral-fn.pdf)主張 cryptography 會重新安排 power，因此技術工作不是天然中立。把這個觀點放回 CS107：assembly 技巧不自帶善惡，但我們選擇測試誰的系統、替誰增加能力、把風險留給誰，都是工程決策的一部分。

## Privacy 不是只有「資料有沒有被看見」

投影片提供四種 framing，並分成 individualist 與 societal 兩組。這四種說法不是互斥定義，而是四個檢查角度。

### Privacy as control of information

第一種把 privacy 看成對資訊流動的控制：哪些資料被收集、交給誰、用在哪裡、能否匯出、修改或刪除。Consent 只有在有自由選擇、有實際替代方案，而且當事人理解條件時才有意義。按下 terms of service 的同意鈕是操作事件，不足以自動證成所有後續用途。

今晚就能做的檢查很具體：打開一個常用服務的 privacy dashboard，列出它保存的資料類別、下載一份 export，再找刪除或限制分享的入口。若只能同意，不能看見、帶走或修正，使用者擁有的 control 很弱。

### Privacy as autonomy

第二種把 privacy 視為自主生活的條件。一個人需要不被持續觀察與預判的空間，才能選擇關係、興趣、閱讀與行動。傷害不一定等到秘密公開才發生；當平台的 profile 讓價格、內容或機會在本人不知情時改變，autonomy 已受影響。

這個模型會逼產品團隊問得更深：介面是否讓人真正拒絕？拒絕追蹤後，核心服務還能不能用？推薦系統是在幫使用者完成自己選的目標，還是在替系統設定使用者接下來會看見的世界？

### Privacy as social good

第三種把 privacy 看成社會基礎設施。如果每次求助、閱讀敏感主題或加入團體都會留下可被追索的完整紀錄，人可能在傷害真正發生前就自我審查。Privacy 因而不只是「我沒什麼好藏」的個人偏好；它影響新聞來源、醫療諮詢、政治參與與弱勢群體能否安全組織。

[NIST Privacy Framework](https://www.nist.gov/privacy-framework)也把 privacy risk 放在組織風險管理裡，而不是只當成一次合規勾選。對工程團隊來說，可執行的動作是把資料流畫出來：collection、processing、sharing、retention 每一站由誰負責，哪一站能縮減資料，而不是等 breach 後才問哪個 checkbox 沒勾。

### Privacy as a display of trust

第四種強調關係。把銀行資料交給報稅者，不表示資訊失去隱私；相反地，正因為接收者承擔只為委託人利益行動的責任，這段受信任關係才能成立。Access 不是 ownership，能讀取也不等於能任意再利用。

這個模型對軟體權限設計很有用。資料庫管理者、客服、分析師與第三方 processor 即使都有合法帳號，也不該共享同一種權限。把用途、角色、audit trail 與撤銷機制寫進系統，是把「請相信我們」轉成可檢查的責任配置。

## Privacy loss 有三種常見路徑

投影片列出 aggregation、exclusion 與 secondary use。三者可以在沒有單一駭客「偷走整份資料庫」時發生。

Aggregation 是把分散、單看無害的記錄合併成 profile。生日年份、郵遞區號、搜尋紀錄與購買時間各自可能不敏感，組合後卻能縮小到少數人，或推論健康與生活狀態。工程對策不能只刪姓名；還要檢查 join keys、稀有組合、查詢輸出與外部 auxiliary information。

Exclusion 是當事人不知道資料如何被用，或沒有管道存取與修正。這種傷害的核心是不對稱：系統用 profile 對人做決定，人卻看不到 profile、決策規則或申訴入口。可執行的最低線是提供資料存取、錯誤更正與決策說明流程，而且讓真人知道去哪裡使用。

Secondary use 是把為 A 目的取得的資料挪去 B 目的，沒有重新取得符合情境的允許。例如用安全紀錄除錯，不代表可以直接拿去做人員績效排名。最有效的檢查不是一張永遠有效的 consent，而是每次新增用途時重做 purpose review：原始承諾涵蓋嗎？使用者能合理預期嗎？可以用更少資料完成嗎？

## Trust 等於 reliance 加上 betrayal risk

投影片把 trust 寫成簡潔的式子：

```text
Trust = Reliance + Risk of Betrayal
```

Reliance 本身不是 trust。你可能依賴牆壁承重，卻不會說牆壁背叛你。人際或組織關係裡，受託者本來有機會選擇不同做法；委託人暴露在被辜負的風險中，trust 才成立。因此「我們使用某家服務」與「我們信任它」不同：後者還包含它有能力傷害我們、卻承諾不那麼做。

這個公式不要求盲信。好的系統會降低一次背叛的 blast radius：least privilege、two-person approval、logging、key rotation、data minimization 與 independent review，都讓信任不必集中在某個完美的人。制度不是取消 trust，而是承認人會犯錯、利益會改變，提前限制後果。

評估一項資料功能時，可以寫一張 trust map：誰持有 raw data、誰能改 policy、誰讀得到 logs、誰能關掉監控、使用者能向誰申訴。若所有箭頭都集中到同一角色，而且沒有外部檢查，系統就是把 power 與 betrayal risk 集中在一起。

## Penetration testing 是一份雙向信任契約

Penetration testing 讓研究者主動尋找容易與不容易利用的漏洞。系統所有者依賴 tester 的技術能力，也承擔 tester 可能越界、保存資料或隱瞞發現的風險；tester 則依賴所有者尊重授權、safe harbor 與通報承諾。只寫一句「請測試安全性」遠遠不夠。

一份可操作的 rules of engagement 至少要寫明：允許測試的 hosts 與 accounts、禁止碰觸的資料、時間窗口、停止條件、事故聯絡人、證據保存方式、漏洞回報與公開流程。測試遇到真實個資時，預設動作應是停止、最小化複製、保留必要證據並通報，而不是為了證明影響再多抓一批資料。

這也修正「好人可以擁有無限權限」的直覺。Ethical compass 很重要，但工程不能只靠人格保證。授權範圍、隔離環境與可稽核紀錄同時保護系統所有者、使用者與 tester。

## Differential privacy 保護什麼，也沒承諾什麼

投影片用 medical database 建立問題：研究者想分析群體趨勢，又不希望個人的加入顯著增加其隱私風險。[Dwork 的〈Differential Privacy〉](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/dwork.pdf)先指出「從資料庫什麼都學不到」與有用統計之間存在根本衝突，再把目標改成：資料集中有沒有某一人的紀錄，機制輸出的分布都應保持接近。

這比「把生日改一年」更精確。Differential privacy 通常透過隨機化 query result、限制查詢 sensitivity 與管理 privacy budget 達成保證；它保護的是觀察輸出者難以判定單一人的參與與內容。投影片用 noise 或移除紀錄做直覺示意，不能把那個例子誤讀成「任意改幾欄就取得 differential privacy」。形式保證需要明確機制、參數與 composition 分析。

本講最重要的提醒是 threat model。這套模型通常信任收集與維護原始資料的一方，防的是從發布結果推回個人的外部觀察者。它不會自動阻止內部管理者濫用 raw records，也不會保護整個 database 因設定錯誤而外洩，更不回答「一開始是否值得集中保存這些資料」。

因此評估時不能只問「有沒有 differential privacy」。要問 trusted curator 是誰、raw data 存多久、哪些人能繞過機制、輸出經過哪些 query、budget 如何累積、incident 發生時能否撤銷 access。形式化工具很有價值，但它只對自己明列的 adversary 與 interface 提供保證。

Rogaway 的批評在這裡形成第二層問題：即使機制數學上正確，工程師仍要判斷集中資料與配置權力的社會後果。技術保證回答「在這個模型裡會不會洩漏」；倫理與治理還得回答「為什麼要建這個資料庫、誰從中受益、剩餘風險由誰承擔」。

## 從 process memory 回到 stack 與 heap

倫理段落之後，投影片重新畫出 process address space。程式啟動時，作業系統建立 process 與 address space，從 executable 載入 machine code 與 global data，需要時映射 shared libraries，建立 stack 並設定 `%rsp`，然後進入 `main`。圖上的地址與上下方向是教學模型，不是 C 標準保證。

Stack memory 的 lifetime 跟 function call 綁定。編譯器安排 frame，machine code 透過調整 `%rsp` 配置與回收空間；函式返回後，舊 local object 的 lifetime 結束。Bytes 未必立刻清零，但舊 pointer 已不能合法使用。

Heap memory 則持續到 client 表示不再需要。`malloc`、`realloc` 與 `free` 是 C library 提供的管理介面。這裡的「heap」不是 priority queue data structure，而是 allocator 管理的動態記憶體區域。

```c
void *malloc(size_t size);
void free(void *ptr);
void *realloc(void *ptr, size_t size);
```

到目前為止，我們站在 client 端：向 `malloc` 要至少 `size` bytes，失敗取得 `NULL`；把配置起點交給 `free` 表示不再使用；用 `realloc` 改變既有 block 大小，並處理回傳地址可能改變。`realloc(NULL, size)` 可當成 `malloc(size)`，但真正程式仍必須遵守標準的 edge cases，而不是只靠這張預告投影片完成實作。

## Heap allocator 是一組合作維持 invariant 的函式

Allocator 初始化時取得一大片連續區域，追蹤 base address 與 size，再把它分給 clients。投影片用十個 bytes 的模型展示生命週期：先把 `0x10` 起的兩 bytes 給 request 1，再把 `0x12` 起的三 bytes 給 request 2；request 1 歸還後，`0x10` 又能服務 request 3。

這個圖已經透露 allocator 的三項責任。第一，要知道哪些 bytes available、哪些屬於 live request。第二，配置出的 blocks 不能重疊。第三，釋放後的空間可重用，但舊 client 必須停止存取。`free` 沒有把 pointer 自動改成 `NULL`；它改變的是 allocator 對那段空間的 ownership 記錄。

最後，request 3 從兩 bytes 擴到四 bytes，但右邊緊接著 request 2，無法原地長大。投影片讓 allocator 把它搬到 `0x15` 起的新區域，舊的 `0x10` 重新可用。這就是 `realloc` 為何可能回傳不同地址：連續空間限制比「多給兩 bytes」更強。

```text
before realloc:
[ R3 ][   R2   ][ available ]

after realloc:
[available][ R2 ][    R3    ][available]
```

從 implementer 角度看，這次搬移還意味著必須保留舊內容、正確更新 bookkeeping，成功前不能讓 client 同時失去舊 block 與新 block。至於 allocator 如何記錄 block 大小、如何找空位、如何合併相鄰 free regions，是下一講的主題；本講只建立問題邊界。

## 把兩半放在一起：明確寫出 trust boundary

Privacy 與 allocator 看似是兩堂課，實際上共享同一個 systems 習慣：不要把隱含信任當成自然事實。

資料系統裡，trust boundary 決定誰看得到 raw records、誰只看得到受控輸出。Allocator 裡，API boundary 決定 client 何時擁有 block、何時把控制權交回 library。前者違約可能造成 surveillance 或 secondary use；後者違約可能造成 use-after-free、double free 或資料毀損。兩者都要求把 actor、capability、lifetime 與 failure mode 寫清楚。

讀完本講可以做一份兩欄檢查。對 security exercise：列出授權範圍、受保護資料、停止條件與 disclosure path。對 heap code：列出每個 allocation 的 owner、容量、最後使用點、`free` 位置與所有 aliases。能畫出這兩張圖，才算把「我相信它會正常」變成可驗證的 contract。

## 整體來說

Lecture 20 的核心不是背四種 privacy 定義，也不是搶先學 allocator 演算法。它要求在能力增長時同步擴大責任感：reverse engineering 讓你能穿過抽象層，就更需要區分能力與授權；differential privacy 給出精確保證，就更需要辨認它沒有涵蓋的威脅；heap API 看似簡單，就更需要看見 library 與 client 共同維持的 ownership contract。

下一步進 allocator 實作時，最值得保留的問題仍是同一組：誰擁有這段資源、誰被信任、信任持續多久、違反契約時誰會受傷。Systems programming 的成熟，不只是看得懂 bytes，也包括看得懂 bytes 背後的權力與責任。

## 參考資料

- [Stanford CS107 Winter 2026 Lecture 20 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/20/Lecture20.pdf)
- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [Cynthia Dwork — Differential Privacy](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/dwork.pdf)
- [Phillip Rogaway — The Moral Character of Cryptographic Work?](https://web.cs.ucdavis.edu/~rogaway/papers/moral-fn.pdf)
