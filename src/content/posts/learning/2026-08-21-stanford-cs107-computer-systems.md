---
title: "Stanford CS107 導讀：同一門課的作業占比，在不同學期是 40% 對 20%"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs107, ai-course, stanford, c-language, systems-programming, self-study]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 3
tldr: "CS107 從 Unix 與 C 一路做到 x86-64 與自己寫 malloc，七份作業。但翻四個學期的封存 syllabus 會發現同一門課差很多：作業在三個學期占 40%，在 Summer 2026 只占 20%（多了 40% 的隨堂小考）；重交政策只出現在 Cain 開的學期，Troccoli 那學期完全沒有。唯一不收遲交的是最後那份 heap allocator。而擋住自學者的不是評分器，是起始碼全在 AFS 上。"
description: "讀完 Stanford CS107 官網七份作業說明、七份 lab 講義與解答，以及四個學期的封存 syllabus 與公告頁，整理計分方式與作業政策在學期之間的落差、七份作業的內容與規則斷點，以及自學者逐項拿得到與拿不到什麼。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs107-computer-systems-en)

[CS107: Computer Organization and Systems](https://web.stanford.edu/class/cs107/) 是 Stanford 程式入門三部曲的最後一門，接在 CS106A 與 CS106B 後面。

它的工作是拆掉一個心智模型。高階語言讓你相信變數是個盒子，這門課要把它換成：變數是一段有位址的位元組。途中你會用 C 重寫一批 Unix 指令、讀 x86-64 組合語言，最後自己實作一個 `malloc`。

本站的 [Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)把它列在大學部核心五門裡，並且說它「最痛也最值得」。那句話是階梯層級的判斷。這篇要回答的是進去之後的事：七份作業各自在做什麼、哪一份才是真正的斷點。還有一個更實際的問題——一個沒有 SUNet ID 的人照著這份公開網站走，會在第幾步撞牆。

**範圍先講清楚**：這篇讀的是公開網頁：現行學期的課程官網、七份作業說明、七份 lab 講義與解答，加上三個舊學期的封存版（學期代碼與對應學期列在附錄），以及 ExploreCourses 條目與 Stanford Online 的遠距學分頁。**沒有讀到的是講堂錄影**（在 Canvas 後面）、**考題**（同上）、以及自動評分器的測試集（課程明說不外流）。所以下面寫的是這些頁面上有的東西，不是修課心得。

## 這門課的硬事實

授課者輪替。[ExploreCourses 的 CS107 條目](https://explorecourses.stanford.edu/search?q=CS+107&view=catalog)顯示下一學年的秋、冬兩季由 Jerry Cain 開，春季由 Nick Troccoli 開。Summer 2026 那一梯則掛 Adam Keppler 與 Yasmine Alonso。

一年開四次，這在 Stanford CS 是少見的高頻率。

先修只寫一門：CS106B 或同等程度。但 syllabus 把「同等程度」展開得很具體——遞迴、指標、鏈結串列、樹、圖、堆疊、佇列、集合、映射、搜尋、排序、雜湊。它還多要求一件事：你已經在意程式好不好讀。

學分是這門課最容易被誤讀的欄位。ExploreCourses 寫「3-5 units」，[Stanford CS 系的學位要求頁](https://www.cs.stanford.edu/bs-degree-requirements)卻規定核心那幾門必須以五學分修習，而且範圍寫得比一般以為的寬——原文是「任何大學部學生，不分主修」（課號清單見附錄）。

兩邊沒有打架，只是 ExploreCourses 沒把條件寫進主欄位。syllabus 講明了條件：可以選低學分的只有在籍研究生，大學部一律五學分。而且少修不會少做，只是拿不到成績。

還有兩件小事只寫在官方欄位裡：CS107 同時滿足 WAY-FR 與 GER:DB-EngrAppSci 兩項通識要求；以及「CS 107 與 CS 107E 不能重複計學分」。後者對照著網路清單排計畫的人特別容易踩到。

指定教科書是 Bryant 與 O'Hallaron 的 *Computer Systems: A Programmer's Perspective*。syllabus 特別強調要第三版，因為前一版還在講 IA32 而不是 x86-64。

## 它拆的是「程式跑在一台抽象機器上」這個假設

CS106B 教你把資料結構當成概念操作。CS107 的整個課程目標欄位都在收回這件事。syllabus 把要求分成三級，最高一級「mastery（精熟）」只有三條，而且全部指向同一件事。原文列的是：寫出對記憶體與指標有複雜操作的 C 程式、對 C 程式的位址空間有精確模型、理解 C 程式的編譯期與執行期行為。

講次表就是這條線的實作。開頭從整數、位元、位元組進 C 字串與指標，接著是堆積、函式指標，然後轉進組合語言。中段整整六講都在 x86-64：算術與邏輯、條件碼與控制流、執行期堆疊、對齊與最佳化。這一段的最後一講叫「Managing the Heap」，正好是最後一份作業的前置。

有一講值得單獨提：Summer 2026 的講次表在期末複習前排了一堂 **Sockets**。ExploreCourses 的官方課程描述裡沒有列出網路相關主題。這兩件事我都能指到頁面，但兩者的關係頁面沒有講——它是不是該學期獨有，我沒有查證到（見附錄）。想靠課綱推斷「CS107 會不會教網路」的人，至少要先確認自己看的是哪一屆的講次表。

## 七份作業，逐份看

作業從 `assign0` 編到 `assign6`，共七份，每份都是獨立完成，不分組。

| 作業 | 你要做出什麼 |
|---|---|
| [Assign0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign0/) | 用 Unix 指令查一起模擬的入侵事件，再把一個畫 Sierpinski 三角形的 C 程式改成吃命令列參數 |
| [Assign1: A Bit of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign1/) | 用位元向量模擬細胞自動機、手工組出 UTF-8 位元樣式、偵測加法溢位，外加一份 Ariane-5 溢位事故的個案研究 |
| [Assign2: C Strings](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign2/) | 重寫 `printenv` 與 `which`，並實作一個比 `strtok` 好的分詞函式（禁止用 `getenv` 與 `strtok`） |
| [Assign3: A Heap of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign3/) | 重寫 `uniq` 與 `tail`，底層是自己寫的、會自動擴張的 `read_line` |
| [Assign4: Into the void*](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign4/) | 重寫 `ls` 與 `sort`，中間夾一個對任何型別都能用的泛型二分插入函式，禁用 `versionsort` 與 `alphasort` |
| [Assign5: Banking on Security](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign5/) | 找出一台虛構 ATM 程式的三個漏洞、用公開打卡資料把銀行使用者去匿名化、再逆向一個只給執行檔的保險庫程式 |
| [Assign6: Heap Allocator](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/) | 實作兩個配置器：隱式空閒串列與顯式空閒串列，也就是你自己的 `malloc`、`realloc`、`free` |

看得出來一條清楚的節奏：前五份都是「拿一個你天天在用的 Unix 指令，從實作者的角度重寫一次」。Assign2 的說明把這件事講成課程立場——C 語言本來就是為了寫 Unix 和它的命令列工具而發明的，所以用 C 重寫它們是最自然的練習。

Assign5 換了體裁。它不是重寫某個工具，是給你一個沒有原始碼的執行檔要你逆向；而且那個 `vault` 執行檔是**逐個學生生成的**，你同學的密碼不是你的密碼。作業說明同時把「使用 AI 工具替你做逆向工作」列進榮譽準則的禁止項目。

Assign6 又換了一次。前六份都有標準答案的執行檔可以對照行為，第七份沒有。配置器不是可執行程式，是一組被別的程式呼叫的函式。課程改為給你一個測試框架加一批腳本檔，腳本裡只有三種請求：`a`（配置）、`r`（重新配置）、`f`（釋放）。你要同時追三個互相衝突的目標：正確、記憶體用得省、跑得快。作業說明把取捨攤開講：

> 「bump 配置器可以快得離譜，但它毫無悔意地吃光記憶體。反過來，一個配置器也可以積極回收與壓緊來擠進很小的記憶體足跡，但為此要執行大量指令。」

## 同一門課，四個學期的計分方式不一樣

把四個封存學期的 syllabus 擺在一起，這門課最穩的一個發現不是難度，是**它的計分方式會隨學期換人而變**。

| 成績項目 | [Spring 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/syllabus.html)（Troccoli） | [Autumn 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/syllabus.html)（Cain） | [Winter 2026](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus.html)（Cain） | [Summer 2026](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/syllabus.html)（Keppler 與 Alonso） |
|---|---|---|---|---|
| 作業 | 40% | 40% | 40% | 20% |
| lab 參與 | 5% | 10% | 10% | 5% |
| 課堂點數／小考 | 5%（lecture points） | 無此項 | 無此項 | 40%（隨堂小考） |
| 期中考 | 20% | 20% | 20% | 15% |
| 期末考 | 30% | 30% | 30% | 20% |

夏季那一梯把每堂課開頭的小考變成單一最大權重，並且明講小考同時充當點名機制。三個常規學期則沒有小考這一項。

這對自學者不影響分數——你本來就不會被計分。但它影響你怎麼讀別人的心得：**「CS107 是一門作業課」這句話，在三個學期是對的，在第四個學期只對五分之一。** 看到任何關於這門課的經驗談，先確認對方修的是哪一梯。

## 作業政策也換人就換，包括一條重交規則

同一組頁面還藏著第二層差異，而且這一層更容易讓人排錯計畫。

**Cain 開的兩個學期有重交政策。** Winter 2026 的 syllabus 有一節叫 Assignment Resubmission Policy，原文是：

> 「除了 `assign6` 以外的所有作業，只要功能分低於 85%，我都允許重交，把分數補到 85% 那條線。」

同一節接著寫，原始分數至少要有 25%，否則上限是原分數的三倍；而且重交只重跑自動測試，不重做程式碼審查。Autumn 2025 的 syllabus 有同一節、同樣的文字。

**Troccoli 開的 Spring 2025 沒有這一節。** 那份 syllabus 完全沒有處理「拿到成績之後能不能再交」這件事。

它的遲交級距也跟 Cain 的版本不同，而且只開放兩天而不是三天（兩套級距見附錄）。

所以「CS107 可以重交」這句話沒有普遍答案，它取決於那學期是誰開的。**要查的話，直接開該學期封存版的 `syllabus.html`，搜尋 `Resubmission`。** 有就有，沒有就沒有，不必推測。

## 各學期公告頁上的中位數，都貼在天花板

Stanford 的封存頁保留了整個學期的公告，而 CS107 的成績釋出公告會寫功能分中位數。這是少見的公開資料，值得照抄。

[Autumn 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/) 有中位數的五份作業裡，三份是滿分，另外兩份各差一分與三分。

[Spring 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/) 七份全部公布，其中 assign4 是滿分，其餘六份也都貼在上緣，包括最後那份 heap allocator（原始數字全部收在附錄）。

值得強調的是這兩個學期**不同授課者、不同作業政策**——一個有重交、一個沒有——中位數卻同樣貼著上緣。

**這些頁面沒有說明為什麼。** 公告只報數字，syllabus 只寫規則，兩邊都沒有把兩者連起來。所以這裡只能停在觀察：在自動評分器這個維度上，CS107 的分數分布是平的、而且高。它跟「地基五門裡最痛的一門」的印象對不上，但對不上的原因，公開材料沒有給。

真正能確定的是，功能分不是這門課唯一的區分軸。程式碼審查用 `+` / `ok` / `–` / `––` / `0` 五個桶子評、不給數字，另外還有兩場閉書紙筆考試。

## assign6 是規則上唯一沒有安全網的一份

這一條不是從分數推的，是三份頁面上各自寫死的規定。

重交政策的原文寫「除了 `assign6` 以外的所有作業」。[assign6 的作業頁](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/)自己寫「不接受遲交，期限沒有例外」（OAE 與 Head TA 核准的延期除外）。Spring 2025 那份沒有重交政策的 syllabus，也單獨為 assign6 標了同一條例外。

它還被切成兩個都不能遲的期限，中間夾一條規則。檢查點交完隱式配置器之後你還可以改，但改動要通過一道折扣測試才會被採用：新分數打折之後，仍不低於原本的檢查點分數（折扣數見附錄）。

要講清楚的是，**這是規則的斷點，不是分數的斷點**：Spring 2025 的 assign6 中位數同樣很高。所以下面這句是我的建議，不是課程的說法——**如果你要挑一份作業來評估自己撐不撐得住 CS107，挑第七份**，理由不是它分數最低，是它是唯一一份交出去就定案的。

## 自學者實際拿得到什麼

逐項講。

**拿得到，而且是完整的：** 十八份講義投影片 PDF、七份作業的完整說明、七份 lab 講義。這幾樣全部掛在公開網址上，不用登入。

**拿得到，而且這是這門課對自學者最特別的地方：** 七份 lab 的**解答頁也是公開的**。而且不是答案卡，是逐題的推理過程。[Lab 1 的解答](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/solutions.html)為了解釋一個無限迴圈的成因，把「有號數右移會補符號位」這件事寫出來，還附上怎麼用 GDB 的 `Ctl-c` 中斷後檢查變數來定位它。連課堂檢核用的問答都給了參考答案。Lab 主題依序是位元與整數、C 字串、指標與堆積、`void *` 與函式指標、組合語言、執行期堆疊、以及最後一份的效能剖析與倫理討論。**這七份講義加解答，是整個 CS107 公開材料裡唯一一組「題目與詳解都齊」的東西。**

**拿不到，而且這才是真正的牆：** 起始碼。每一份作業與每一份 lab 的第一步都是同一條指令——從 `/afs/ir/class/cs107/repos/...` 底下 `git clone`。那是 Stanford 的 AFS 檔案系統，要 SUNet ID，並且要從 `myth` 這組機器上操作。換句話說，作業頁自己寫明的第一步就需要 Stanford 帳號：擋在前面的不是評分器，是**連題目的骨架檔案都拿不到**。作業說明裡那些「不要修改 `util.c`」「參考 `samples/mysort_soln` 的行為」的指示，指向的檔案你手上一個都沒有。

**拿不到，而且課程講了為什麼：** 自動評分器的測試集。[評分說明頁](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assignment-grading.html)寫得毫不含糊——

> 「我們不會發放測試案例，這是為了對未來的學生維持公平的競爭環境。」

同一頁也把測試集分成四層，並說明 `sanitycheck` 公開給學生的只是最基本的 sanity 那一層，另外三層（comprehensive、robustness、stress）不在發放範圍內。所以**就算你拿得到 sanitycheck，它也只驗最淺的那一格**。這一項上修課學生比自學者多拿到的東西，比想像中少——這句是我的判斷，頁面只列了分層，沒有做這個比較。

**拿不到：** 講堂錄影與考題，兩者都在 Canvas 裡。指定教科書 CSAPP 的免費電子檔也在 Canvas。但這一項有公開替代品：Chris Gregg 的 [CS107 reader](https://web.stanford.edu/~cgregg/cgi-bin/107-reader/) 掛在公開網址上，涵蓋整門課的主題。

**有一項要更正 syllabus：** 它同時推薦了 Nick Parlante 的 Essential C，連結指向 Stanford CS Library（`cslibrary.stanford.edu/101`）。那個網址現在回 404，整個 cslibrary 網站只剩一頁空殼，作者個人頁上的連結也一起失效。想找這份讀本的人不必在官方站繞——它在 Stanford 這邊已經沒有活著的位置了。

**還有一條要注意：** 課程首頁底部有一段版權宣告，明文禁止以任何形式重新散布、複製、傳輸或儲存頁面內容。自己讀沒問題，把講義整包鏡像到自己的 repo 就不是了。

## 怎麼開始

今晚就能做、而且不需要 SUNet ID 的一件事：打開 [Lab 5: Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab5/) 的講義，只讀「新的 GDB 指令」那一段和 x86-64 參考表。然後在自己的機器上寫一個十行的 C 函式，用 `objdump -d` 把它反組譯出來，逐行對照你寫的 C。做完再打開同一份 lab 的解答頁對答案。

選 Lab 5 不是隨機的：它是題目、詳解、和所需工具（`objdump` 與 `gdb`）三者都不依賴 Stanford 起始碼的一份。如果這件事做起來讓你覺得有趣而不是痛苦，你大概撐得住這門課。如果你發現自己完全讀不懂反組譯出來的東西——那正好就是 CS107 存在的理由。

想走完整條線的話，順序是把七份 lab 當骨幹（題目與詳解都在），講義投影片當補充，作業說明當閱讀材料——**把作業當規格書讀，自己從零建專案，而不是等著填空。** 這比修課的人辛苦，但 `mywhich`、`myuniq`、`mysort`、以及那個 heap allocator，規格本身寫得夠完整，足以在沒有起始碼的情況下重建。

## 附錄：數字與查證方式

本文資訊來自 2026-08-21 當天抓取的官方頁面，封存版網址格式為 `web.stanford.edu/class/archive/cs/cs107/cs107.<學期代碼>/`，其中 1256 為 Spring 2025、1262 為 Autumn 2025、1264 為 Winter 2026、1268 為 Summer 2026。每一個學期代碼對應的學期名稱，都以該封存頁自己標示的標題為準，不是從代碼推的。

- **Autumn 2025 作業功能分中位數**（出自該學期封存首頁的成績釋出公告）：assign0 為 26/26、assign1 為 90/90、assign3 為 95（公告寫「a perfect 95」）、assign4 為 106/107、assign5 為 116/119。assign2 的公告沒有給中位數，改為提醒功能分低於 85% 者適用重交政策，並點名很多人重新造輪子、自己實作了 `strspn`、`strcspn`、甚至 `strncmp`。assign6 的中位數在該學期公告中沒有出現。
- **Spring 2025 作業功能分中位數**（出自該學期封存首頁的成績釋出公告，七份齊全）：assign0 為 26/26、assign1 為 98/100、assign2 為 95/96、assign3 為 96/97（公告註明不計加分）、assign4 為 107/107、assign5 為 115/119、assign6 為 113/119。這是四個學期裡唯一連 assign6 都公布中位數的一梯。
- **Autumn 2025 與 Winter 2026 成績組成**（兩學期相同）：作業 40%、lab 參與 10%、期中 20%、期末 30%；Winter 2026 另寫明考試中位數低於 80 時整條分布往上調。
- **Spring 2025 成績組成**：作業 40%、lab 參與 5%、lecture points 5%、期中 20%、期末 30%。
- **Summer 2026 成績組成**：作業 20%、lab 參與 5%、期中 15%、期末 20%、小考 40%。C- 的門檻保證不高於 70%。
- **遲交上限（Cain 的兩個學期）**：24 小時內 95%、24–48 小時 90%、48–72 小時 85%、超過三天不收。
- **遲交上限（Spring 2025）**：24 小時內 95%、24–48 小時 87.5%，只開放兩天。
- **重交政策**：只出現在 Autumn 2025 與 Winter 2026 兩份 syllabus 的 Assignment Resubmission Policy 一節。內容為功能分低於 85% 者可重交補到 85%，但原始分數需至少 25%，否則上限為原分數的三倍；不重做程式碼審查；適用於 assign6 以外的所有作業。Spring 2025 的 syllabus 沒有這一節。
- **assign6 不收遲交**：四個學期一致，Head TA 核准的延期與 OAE 調整除外。
- **assign6 的檢查點規則**：期末提交的隱式配置器若與檢查點版本不同，功能分乘以 0.85 後若不低於檢查點分數才採用新版，否則以檢查點版本計分。
- **程式碼審查等第**：`+` / `ok` / `–` / `––` / `0` 五級，課程說明多數落在 `ok`。
- **講次與作業數**：Summer 2026 共 18 講（含期末複習）、7 份作業、7 份 lab。
- **課程結構**：每週一三五上課，另有每週一次的 lab。Summer 2026 的期末考長三小時。
- **五學分規定的適用範圍**：學位要求頁原文為「In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units.」——是「不分主修的所有大學部學生」，不限 CS 主修。
- **CS107ACE**：另一門一學分的加強輔導課（又稱 CS107A 或 Pathfinders），需申請、與 CS107 同時修，成績為滿意／不予學分。
- **遠距學分版學費**：[Stanford Online 的 CS107 頁](https://online.stanford.edu/courses/cs107-computer-organization-and-systems)在 2026-08-21 顯示為 7,875 美元、五學分，課程期間 2026-06-22 至 08-15，建議每週投入 15–25 小時。非學位生必須以最高學分數修習、必須拿字母成績、且每門課須維持 B 以上才能繼續選課。

有三項未能確認。**其一**，本站的 Stanford CS 課程地圖在 2026-08-20 記錄的 CS107 遠距學費是 8,110 美元，與本文 8 月 21 日讀到的 7,875 美元不同；該頁面只顯示當前開放梯次的數字，我無法回頭確認 8,110 對應哪一梯，兩個讀數都照實列出。**其二**，Summer 2026 講次表裡的 Sockets 那一講是否為該學期獨有，我只能確認 ExploreCourses 的官方課程描述沒有列入網路相關主題，無法確認其他學期的講次表是否也有這一講——封存區沒有公開索引頁，只能逐個學期代碼試。**其三**，Summer 2026 的 syllabus 我沒有找到重交政策的段落，但那不等於該學期沒有；我只能說我沒讀到，無法斷定不存在。

還有一項是刻意不下結論的：各學期的中位數為什麼都貼在上緣，公告頁與 syllabus 都沒有說明，本文不提供推測的機制。有重交政策的學期與沒有重交政策的學期，中位數同樣高，所以任何把兩者連起來的解釋都需要這些頁面之外的證據。

另外一項不是查不到、是刻意不查：作業與 lab 的起始碼在 AFS 上，需要 SUNet ID，本文沒有嘗試取得，所有關於作業內容的描述都來自公開的作業說明頁本身。

## 參考資料

- [CS107: Computer Organization & Systems 課程官網（Summer 2026）](https://web.stanford.edu/class/cs107/) — 講次表、七份作業、七份 lab 與解答的入口，以及頁面底部禁止重新散布的版權宣告
- [CS107 General Information and Syllabus（Summer 2026）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/syllabus.html) — 小考占 40% 的成績組成、先修展開、五學分規定
- [CS107 General Information and Syllabus（Winter 2026）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus.html) — 作業占 40% 的成績組成、Assignment Resubmission Policy 一節的原文、遲交級距、程式碼審查五等第、指定教科書與 AI 工具規定
- [CS107 General Information and Syllabus（Autumn 2025）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/syllabus.html) — 與 Winter 2026 相同的成績組成與重交政策，證明這不是單一學期的個案
- [CS107 General Information and Syllabus（Spring 2025）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/syllabus.html) — 沒有重交政策、遲交只到 87.5% 與兩天、成績組成多一項 lecture points，是本文「政策隨授課者而變」的對照組
- [CS107 Spring 2025 封存首頁](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/) — assign4、assign5、assign6 的功能分中位數公告，以及 assign6 不收遲交的宣告
- [CS107 Autumn 2025 封存首頁](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/) — 每份作業的功能分中位數公告，以及 assign2 公告裡指向重交政策的那句提醒
- [CS107 Assignment Grading](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assignment-grading.html) — 四層測試集的分類，以及不發放測試案例的原文說明
- [Assign0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign0/) — 入侵調查與 Sierpinski 三角形
- [Assign1: A Bit of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign1/) — 位元向量、UTF-8、飽和運算與 Ariane-5 個案
- [Assign2: C Strings](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign2/) — 重寫 `printenv` 與 `which`，禁用 `getenv` 與 `strtok`
- [Assign3: A Heap of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign3/) — 自動擴張的 `read_line` 與兩支 Unix 過濾器
- [Assign4: Into the void*](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign4/) — 泛型二分插入與 `myls` / `mysort`
- [Assign5: Banking on Security](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign5/) — 逐個學生生成的 `vault` 執行檔與逆向工程的 AI 使用禁令
- [Assign6: Heap Allocator](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/) — 兩個配置器、雙期限、不收遲交，以及取捨的原文段落
- [CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/) 與 [Lab 1 解答](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/solutions.html) — 公開解答的實際樣貌
- [CS107 Lab 5: Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab5/) — 本文建議的入門動作，`objdump` 與 GDB 反組譯
- [CS107 Lab 7: Optimizing, Profiling, and Ethics](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab7/) — Callgrind 剖析，也是 assign6 的前置
- [CS107 Getting Started on Myth](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/getting-started.html) — myth 叢集與 SUNet ID 的存取條件
- [Stanford ExploreCourses: CS 107](https://explorecourses.stanford.edu/search?q=CS+107&view=catalog) — 3–5 學分、通識標記、2026-2027 三個學期的開課與授課者、與 CS 107E 不可重複計學分
- [Stanford Online: CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems) — 遠距學分版的學費、時數與非學位生規定
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — 五學分規定的原文：「In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units.」（舊網址 `www-cs.stanford.edu/bs-core-requirements` 已失效）
- [Stanford Bulletin: CS-BS](https://bulletin.stanford.edu/programs/CS-BS) — 五學分規定的備援出處
- [CS107 Reader（Chris Gregg）](https://web.stanford.edu/~cgregg/cgi-bin/107-reader/) — syllabus 推薦、且目前仍公開可取得的教科書替代品（同樣被推薦的 Essential C，其 `cslibrary.stanford.edu/101` 連結已 404，故不列連結）
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
