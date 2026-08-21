---
title: "Stanford CS111 導讀：九份作業拼成一部作業系統，但考試不考作業"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs111, ai-course, stanford, operating-systems, self-study, c-language]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 5
tldr: "CS111 的九份作業從 lambda 一路做到日誌式檔案系統的崩潰復原，但把官網逐頁讀完會看到三件課綱不寫的事：第三份作業是分水嶺，因為第四份會直接編譯你第三份的程式碼；期末考有一整塊在考倫理學名詞，公開的練習卷連解答都在；還有，把自己的程式碼貼給 AI 問問題，這門課白紙黑字寫成違反榮譽準則。"
description: "讀完 Stanford CS111 Spring 2026 官網的九份作業說明、28 份講義、公開考古題與榮譽準則頁，整理這門課真正的難度曲線、CS110 改名背後的內容落差，以及沒有 SUNet ID 的人逐項拿得到什麼。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs111-operating-systems-en)

[CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) 是 Stanford 大學部核心五門課裡的系統那一格，接在 CS107 後面。它教的東西可以用一句話講完：你寫的程式從來沒有真的獨佔過這台機器，這門課告訴你中間那層是怎麼騙你的。

本站的 [Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)已經說過「CS111 的作業表就是一部作業系統」。那是階梯層級的判斷。這篇要回答的是進去之後的事：九份作業各自在做什麼、哪一份跨過去之後回不了頭、為什麼一門作業系統課會花兩堂課講信任，以及那句廣為流傳的「CS111 就是以前的 CS110」到底對到什麼程度。

**範圍先講清楚**：這篇讀的是公開網頁。包括 Spring 2026 的課程官網、九份作業說明、全部講義 PDF、公開的考古題與解答、榮譽準則頁、ExploreCourses 條目，以及 2021 年由 David Mazières 維護、至今還活著的另一個 CS111 網站。**沒有讀到的是講堂錄影**（在 Canvas 後面）、**每週的 section 講義**（在 Stanford 登入後面），以及**起始碼**（在校內的 myth 主機上）。所以下面談的難度是從作業規格、依賴關係與計分規則推出來的，不是修課心得。

## 這門課的硬事實

授課者是 [Mendel Rosenblum](https://stanford.edu/~mendel)。他的自我介紹裡有一行值得先記住：VMware 共同創辦人，公司前十年的首席科學家。這件事到第二十七堂會發生作用。

[ExploreCourses 條目](https://explorecourses.stanford.edu/search?q=CS+111&view=catalog)寫的是秋冬春三學期都開，學分欄給了一個區間。那個區間有陷阱。[CS 系的大學部學位要求頁](https://www.cs.stanford.edu/bs-degree-requirements)加了一條硬規定：不分主修，修 CS103、CS107、CS109、CS111、CS161 的大學部學生都必須以五學分修習。[課程 syllabus](https://web.stanford.edu/class/cs111/syllabus) 講得更白——大學部學生沒註冊滿五學分就不會拿到成績，而且降學分不會減少任何課程要求。那個區間是給研究生的（確切數字見附錄）。

先修只有一門 CS107，但 syllabus 把「等同」拆得很具體：要能用 `malloc`／`free`／`new`／`delete` 寫出複雜的記憶體操作，要能在 Unix 環境用 `make`、`gcc`、`valgrind`、`gdb`，還要對 x86-64 有基本理解。

旁聽的答案在 [FAQ](https://web.stanford.edu/class/cs111/faq) 裡，而且比多數人以為的寬鬆——這節後面會單獨講。

## 課程的軸心：先講歷史，再逼出原理

第一堂[講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)的第二頁就把教法攤開來：「作業系統」這個詞很難定義，這門學科是從一堆實際問題裡長出來的，所以最容易的介紹方式是講它的歷史。

接下來十幾頁真的就是編年史。1940 年代一次一個人在主控台前面用。IBM 701 的作業系統是一疊共用的卡片。IBM 7094 有了記憶體重定位與保護，多工與核心才因此出現。到了 1960 年代中期系統大到失控，Multics 與 OS/360 的災難催生了軟體工程這個領域。

這條線走完之後，投影片才寫下「Then extract principles」。這是這門課跟另一種常見教法的分岔點。不是先給你一份 kernel 原始碼再逐層拆，而是先讓你看見每個機制當初是為了解決哪個具體問題才被發明出來的。

同一份講義上還有一頁叫「Why OS is Interesting」，最後一項列的是哲學問題：公平比整體幸福重要嗎？過去能不能預測未來？這兩句不是裝飾。前者是排程演算法要回答的，後者就是那份時鐘演算法作業的全部賭注。

整門課切成三塊：並行（四份程式作業）、記憶體管理（兩份）、檔案系統（兩份）。最後兩堂收在虛擬機器與總複習。第二十七堂由 Rosenblum 親自講虛擬機器，[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)給的理由是「用虛擬機器當作複習課程主題的方式」——因為要騙過一整個作業系統，你得把前面九週的每個機制再虛擬化一次。由寫過 VMware 的人來收尾這件事，安排得相當直白。

## 作業長什麼樣：九份，分水嶺在第三份

九份作業（assign0 到 assign8）的節奏是每週四交、當天出下一份。逐份列：

| 編號 | 題目 | 你實際在做的事 |
|---|---|---|
| [assign0](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/) | Welcome to CS111 | 讀碼、短答、少量寫碼，確認 C/C++ 沒有生鏽 |
| [assign1](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign1/) | Lambdas, Threads, and Processes | 用三種方式管理執行，順便玩原子操作 |
| [assign2](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign2/) | Synchronization | 用 monitor 模式解 Caltrain 乘客上車與派對分組兩題 |
| [assign3](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/) | Thread Dispatcher | **在使用者層自己實作執行緒**：各自的堆疊、時鐘中斷、輪流排程 |
| [assign4](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign4/) | Locks and Condition Variables | 在你自己的執行緒上實作 mutex 與 condition variable，外加七題倫理 |
| [assign5](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign5/) | Memory-Mapped Encrypted Files | 接住分頁錯誤、按需載入、用頁面保護權限模擬硬體的 dirty bit |
| [assign6](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign6/) | Page Replacement with the Clock Algorithm | 拿掉「實體頁夠用」的假設，寫頁面置換 |
| [assign7](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign7/) | Reading Unix V6 Filesystems | 用 C 重建 1975 年 Unix V6 檔案系統的四層，讀出檔案 |
| [assign8](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign8/) | Journaling File System | 故意讓檔案系統崩潰，再用預寫日誌把它修回來 |

其中三對是綁在一起的，後一份接著前一份的成果做。前兩對綁得特別緊：assign4 的第一件事是執行 `make copy_thread_sources`，把你 assign3 的程式碼複製過來當地基，assign5 到 assign6 也是同樣的做法。兩份講義都附了同一句話——如果前一份沒有完全做出來，你可能得先回去把它做完。

**分水嶺是 assign3。** 理由不是它最長，是它換了你的身分。assign1 和 assign2 你是執行緒與 mutex 的使用者；assign3 開始你是實作者，而且從此以後每一份作業都站在你自己那份實作上面。講義自己把這件事點名了——它說這是一個虛擬化的例子，你拿一條系統執行緒去實作出任意多條使用者層執行緒，而「你寫的這段程式碼，會非常接近單核心作業系統裡實作系統執行緒的那段」。

第二個候選是 assign8，但它難在別的地方。那份作業你只需要寫大約十到十五行——三個重播日誌條目的方法，每個只有幾行。難的是在那之前，你得看懂一個用了大量進階 C++ 的完整檔案系統，包括區塊快取、freemap 點陣圖、FUSE 掛載。它考的是在陌生的大型程式碼庫裡找到那十五行該放哪，這跟 assign3 的「從零長出一個機制」是兩種不同的痛。

順帶一提，assign8 的血統值得記一下：作業與 V6 FUSE 實作出自 [David Mazières](https://www.scs.stanford.edu/~dm/)，修改者名單裡有 John Ousterhout。日誌式檔案系統這條線最經典的那篇論文 [The Design and Implementation of a Log-Structured File System](https://web.stanford.edu/~ouster/cgi-bin/papers/lfs.pdf)，作者正是 Rosenblum 與 Ousterhout。這門課的最後一份作業，是由寫下那篇論文的兩個人之中的一位在教，另一位在改講義。

## 一門作業系統課，把兩堂課和一塊期末考給了「信任」

Stanford CS 系在很多課裡塞了短篇倫理單元，CS111 分到的題目是**信任**。這件事不是佈告欄上的一行字，它有三個可查證的落點。

第一，行事曆上有兩堂正課：第十二堂〈Trust and Operating Systems〉、第二十五堂〈Truth, Trust, and Technology〉。[第十二堂的講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)開頭引的是 Google DeepMind 那篇 [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244)（arXiv:2404.16244）對信任的定義，然後把建立信任的方式分成三類：假設、推論、替代。講到軟體那頁下了一個很硬的判斷——在軟體上「假設」這條路無效、不使用，而通往信任的路徑是透過不信任，也就是測試、驗證與儀器化。

第二，assign4 把它變成要交的東西。你在同一份作業裡實作完 mutex 與 condition variable 之後，要在 `questions.txt` 裡回答七題：怎麼讓另一個同學信任你 assign3 和 assign4 的程式碼；除了 sanitycheck 之外還能做什麼來提高你對自己程式碼的信心；然後讀一份講 2020 年 Google Duo 競態條件的文件——那個 bug 是 Google Project Zero 的 Natalie Silvanovich 發現的——用課堂上的信任框架分析開發者在哪裡過度信任、使用者會受到什麼具體傷害。

第三，它會考。exams 目錄下有一份 [Final-Exam-Ethics-Practice.pdf](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Final-Exam-Ethics-Practice.pdf) 與對應解答，公開可下載。第一題給你一個行事曆 app 的競態條件，問「什麼是 agential gullibility，這家公司在哪裡展現了它」；第二題問「什麼是 trust by substitution，為什麼檔案系統權限是它的例子」。一門教分頁與 inode 的課，期末考要你在紙上寫倫理學名詞的定義——這件事我在任何一份 CS111 的二手介紹裡都沒看過。

## CS110 改名這件事，只對了一半

「CS111 就是以前的 CS110」的出處是真的：CS 系的核心要求頁曾經在 CS111 的條目下直接標了「Note: Formerly known as CS110.」所以網路上大量的 CS110 自學指南講的是同一門課——這個推論看起來很安全，但它不成立。

先說那句話本身的處境：**它所在的頁面已經下架了。** Stanford CS 系換了新站，舊網址現在回 404；取代它的[學位要求頁](https://www.cs.stanford.edu/bs-degree-requirements)保留了五學分規定，卻沒有再提 CS110。原句現在只讀得到[封存快照](https://web.archive.org/web/20260113002433/https://www.cs.stanford.edu/bs-core-requirements)裡的版本（2026 年 1 月）。所有還活著的官方頁面，用的都不是「改名」這個說法。

除此之外還有三件事對不上。

**其一，ExploreCourses 上的說法不一樣。** CS111 條目最後一句是「可以作為 CS110 的替代課，滿足任何 CS110 能滿足的要求」——這是「替代」，不是「就是」。而且 [CS110 的條目至今還在](https://explorecourses.stanford.edu/search?q=CS+110&view=catalog)，掛著自己的課程描述，還排了一節 2026–2027 春季的課。

**其二，內容差得很遠。** [CS110 的封存版](https://web.stanford.edu/class/archive/cs/cs110/cs110.1204/)還活著（我試過，Winter 2020 那版可以直接開），它的作業表是：檔案系統、多行程、Stanford Shell、RSS 新聞聚合、ThreadPool、HTTP 網頁代理與快取、MapReduce。講次表裡有整整三堂網路、一堂 MapReduce、一堂系統設計原理。

現在的 CS111 呢？**一堂網路都沒有**，沒有 shell、沒有 HTTP、沒有 MapReduce。換上來的是虛擬記憶體、按需分頁、頁面置換、磁碟、目錄與連結、崩潰復原、快閃記憶體、虛擬機器。兩門課共有的只剩並行那一段。

**其三，殘留物還在。** CS111 的 exams 目錄裡至今躺著檔名叫 `CS110Win19Final4f.pdf` 的考古題，還有兩份標題印著「CS110 Practice Midterm」的練習卷；再往前翻，2012 年那份的抬頭寫的是 CS 140——Stanford 更早的那門作業系統課。

所以正確的說法是：**課號的繼承是官方的，內容的繼承不是。** 對自學者這件事很實際——如果你跟著一份 CS110 自學指南走，你會做到 HTTP 代理與 MapReduce，那些東西不在今天的 CS111 裡；反過來，你不會碰到分頁、置換與崩潰復原，而那是今天 CS111 的一半。兩份材料都有價值，但它們不是同一門課的兩個版本。

## 分數放在哪裡：作業占三分之一，而考試不考作業

第一堂講義裡有一頁在講 CS111 跟 CS106、CS107 的差別，只有三行，但那三行決定了自學這門課該怎麼配時間：

> 早期課程（CS106 與 CS107）的講堂圍繞著作業。CS111 的講堂講的是作業系統的原理與概念。section 負責作業，**考試考講堂內容**。

對照 syllabus 的計分表就更清楚了：作業只占三分之一略多，兩場考試合計超過一半（完整比重見附錄）。也就是說，一個只把九份作業做完的人，拿到的是這門課權重較低的那一半；而講堂那一半——那些 28 份 PDF——才是考試在考的東西。

這對自學者反而是好消息，因為講堂那一半是公開的，作業那一半才是被鎖住的。

## 自學者實際拿得到什麼

逐項講，不合併。

**28 份講義 PDF：拿得到。** 全部掛在封存目錄下，不需要登入。

**九份作業說明：拿得到。** 完整的規格、API 文件、里程碑拆解、學習目標都在網頁上。

**起始碼：拿不到（除非你能登入 myth）。** 每份作業的取得方式都是在 Stanford 的 myth 叢集上執行 `git clone /afs/ir/class/cs111/repos/assignN/$USER`，那是校內路徑。不過 FAQ 裡有一條很少被引用的規定：旁聽者歡迎使用課程網站上的材料，而且「取得作業時，把 clone 指令裡的 `$USER` 換成 `guest`」。這條路仍然需要能 SSH 進 myth，也就是仍然需要 SUNet ID——我沒有帳號，無法實測 guest 這條路徑是否還通。

**講堂錄影：原則上拿不到，但 FAQ 留了門。** 錄影放在 Canvas。同一條 FAQ 的最後一句是：想要錄影權限的旁聽者，寄信給課程工作人員申請。

**考古題與解答：拿得到，而且很多。** exams 目錄下有 2022、2023、2024 三年的期中與期末考，每一份都附解答，另外還有練習卷、複習講義、以及前面提到的倫理練習卷與解答。這是整個公開材料裡密度最高的一塊。

**section 講義：拿不到。** 八次 section 的頁面本身是公開的，但「Section Slides」那個連結指向 `restricted/labdocs/`，點下去會被轉到 Stanford 的 WebLogin。這是整個課程網站唯一真正上鎖的目錄。

**教科書：要買。** 行事曆列的是 [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)（Anderson 與 Dahlin，第二版），而且每一週的閱讀都標著 optional。這門課不預設你買書。

**還有一個大多數人不知道的公開來源。** 2021 年春季的 CS111 由 David Mazières 開，他把 section 材料放在自己的伺服器上：[scs.stanford.edu/21sp-cs111](https://www.scs.stanford.edu/21sp-cs111/)。那個站至今還活著，八份 project 說明、section 投影片、以及**可以直接下載的示範程式碼壓縮檔**都在。最有意思的是頁尾那一行授權：

> Permission hereby granted for anyone to copy, modify, and redistribute any lecture note material from this class that belongs to the instructor(s) or Stanford.

對照現在 CS111 官網每一頁底部的版權聲明——「本內容受保護，不得分享、上傳或散布」——同一所學校、同一門課的兩個網站，給出完全相反的重製條款。要引用 CS111 材料的人，用 Mazières 那個站比較安全。

（一個誠實的但書：那頁上有些 project 起始碼是用 `https://web.stanford.edu/class/cs111/starters/*.git` 這種公開 HTTPS 位址發的。我逐一試過，那些 repo 現在全部 404，所以自學指南裡引用這條路徑的都已經失效。section 的示範壓縮檔本身還在。）

## 一件關於 AI 的規定，讀完再決定要不要動手

[榮譽準則頁](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html)有一段叫「Use of Generative AI Tools」。它的第一句是常見的——不要用 AI 幫你寫作業的程式碼或答案。第二句就不常見了：

> 另一個例子是，你不應該把自己的程式碼輸入 AI 工具去問關於它的問題。這麼做違反 Stanford 榮譽準則。

多數課程的 AI 政策管的是產出，這條連「拿自己的程式碼去問」都禁掉了。放在 2026 年看有點刺眼，因為同一所學校另外開了一門 [CS146S](/posts/ai/2026-08-16-cs146s-course-map)，整學期在教怎麼指揮 coding agent 寫程式。兩門課同時存在不矛盾——CS111 明說理由是「這門課的作業，過程比產出更有價值」——但如果你是照著這份公開材料自學的人，這條規定不管你；它值得讀的原因是，它告訴你這門課認為學習發生在哪裡。

同一頁還有一條少見的制度：撤回與追溯引用表單。你可以在期限後五天內撤回已交的作業，不問理由，那份作業記零分，而課程不會再就那份作業調查你。用一個確定的零分，換掉一個不確定的榮譽準則案件。

## 怎麼開始

今晚就能做的一件事，不需要任何帳號：

```bash
curl -O https://www.scs.stanford.edu/21sp-cs111/notes/p2demo.tar.gz
tar xzf p2demo.tar.gz && cd p2demo
g++ -std=c++17 -o tvp thread-v-process.cc -lpthread
./tvp
```

（`make` 會失敗，因為 Makefile 要去 clone 那個已經 404 的 starter repo；直接編譯這一支不受影響。上面這幾行我在 macOS 上跑過。）

你會看到兩個行程各自從 0 數到 9。然後打開 `thread-v-process.cc`，把 `main` 裡那個 `#if 1` 改成 `#if 0`，重新編譯再跑一次——這次是兩條執行緒輪流把同一個計數器數到 19。

同一個 `count` 函式、同一個全域變數，一個字元的差別讓「共享位址空間」這件事變成你螢幕上的數字。這就是 assign1 的第一個練習在問的問題，也是接下來八份作業的地基。

跑完之後，下一步不是找起始碼，是去 exams 目錄抓 [Spr2024 的期中考與解答](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Spr2024Midterm.pdf)，先做一次。考試考的是講堂，而講堂全部公開——這是這門課對自學者最友善的地方，也是最容易被忽略的地方。

## 附錄：數字與查證方式

- **計分比重**（Spring 2026 syllabus）：作業 35%、section 出席 5%、講堂點名 5%、期中考 20%、期末考 35%。期中是兩小時、閉書、可帶兩張雙面 A4 筆記；期末三小時。
- **學分**：ExploreCourses 與 Stanford Bulletin 都寫 3–5 學分；CS 系學位要求頁規定 CS103／107／109／111／161 必須以五學分修習；syllabus 補充只有 Stanford 在籍研究生可以修 3–5 學分，大學部不滿五學分不予評分。三處說法一致，只是切面不同。
- **來源異動**：本文查證期間，Stanford CS 系的 `www-cs.stanford.edu/bs-core-requirements` 已下架（301 到 `www.cs.stanford.edu/bs-core-requirements` 後 404）。五學分規定改引現行的學位要求頁，「Formerly known as CS110」改引 2026 年 1 月的封存快照。引用這條的舊文章都需要換連結。
- **課程規模與時段**：Spring 2026 在 Nvidia Auditorium，一週三堂各 50 分鐘，共 28 堂（其中一堂遇假日停課）。八次 section、八份程式作業加一份暖身作業。
- **未來開課**：2026–2027 學年秋、冬、春三學期都開；秋與冬由 Nick Troccoli 授課，春由 Rosenblum 授課（依 ExploreCourses 條目，2026 年 8 月查）。
- **封存網址格式**：`web.stanford.edu/class/archive/cs/cs111/cs111.1266/`（1266 = Spring 2026）。CS110 的封存版是 `cs110.1204`（Winter 2020），本文寫作時可正常存取。
- **假日標示有誤**：Spring 2026 行事曆把 5 月 25 日標成 Presidents' Day，該日實際上是 Memorial Day（Presidents' Day 在二月）。停課本身沒錯，標籤錯了。
- **未能確認的三項**：（一）旁聽者用 `guest` 取代 `$USER` 的 clone 路徑是否仍然可用——我沒有 SUNet ID，無法實測；（二）寄信索取錄影權限的實際核准率；（三）Winter 2026 那一版（`cs111.1264`）的作業編號與 Spring 2026 不同（V6 檔案系統排在 assign1、日誌式檔案系統排在 assign2），我只讀到那兩份的封存頁，沒有完整的該學期行事曆，所以無法判斷整學期的順序是否重排過。

## 參考資料

- [CS111: Operating Systems Principles 課程官網](https://web.stanford.edu/class/cs111/) — Spring 2026 的公告、課程工作人員、考試時間與地點
- [CS111 Syllabus](https://web.stanford.edu/class/cs111/syllabus) — 計分比重、先修的具體定義、五學分規定、課程三大部分的官方描述
- [CS111 課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar) — 28 堂講次、每堂的 OSPP 選讀章節、九份作業的出題與截止日
- [CS111 FAQ](https://web.stanford.edu/class/cs111/faq) — 旁聽政策原文，包括用 `guest` 取代 `$USER` 與寄信索取錄影
- [CS111 榮譽準則與合作政策](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html) — 生成式 AI 條款原文、撤回與追溯引用制度
- [assign3: Thread Dispatcher](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/) — 分水嶺那一份的完整規格與「這是虛擬化的例子」那段框架
- [assign4: Locks, Condition Variables, and Trust](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign4/) — `make copy_thread_sources` 的依賴關係，以及七題信任問答
- [assign8: Journaling File System](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign8/) — 「總共大約十到十五行」的原文，與 Mazières／Ousterhout 的作者標示
- [第一堂講義：Introduction](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf) — 「先講歷史再萃取原理」的教法、課程三部分、以及「考試考講堂」那三行
- [第十二堂講義：Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf) — 信任的三種建立方式與「通往信任的路徑是透過不信任」
- [期末考倫理練習卷](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Final-Exam-Ethics-Practice.pdf) — 證明倫理單元真的進了期末考，且練習卷附解答
- [ExploreCourses：CS 111](https://explorecourses.stanford.edu/search?q=CS+111&view=catalog) — 學分區間、三學期開課、未來三學期的授課者
- [ExploreCourses：CS 110](https://explorecourses.stanford.edu/search?q=CS+110&view=catalog) — CS110 條目仍然存在、仍排課，且描述與 CS111 不同
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — 現行頁面，五學分規定的原文出處（「all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units」）
- [舊版 CS BS Core Requirements 封存快照（2026-01）](https://web.archive.org/web/20260113002433/https://www.cs.stanford.edu/bs-core-requirements) — 「Note: Formerly known as CS110.」唯一還讀得到的出處；原網址已下架
- [Stanford Bulletin：CS111 課程條目](https://bulletin.stanford.edu/courses/2228601) — 現行官方描述只寫「可作為 CS110 的替代課」，沒有改名字樣
- [CS110 封存版（Winter 2020）](https://web.stanford.edu/class/archive/cs/cs110/cs110.1204/) — 舊 CS110 的作業表與講次表，用來對照內容落差
- [CS111 lab page（Spring 2021，David Mazières）](https://www.scs.stanford.edu/21sp-cs111/) — 可自由重製的 section 材料與示範程式碼壓縮檔
- [Mendel Rosenblum 個人頁](https://stanford.edu/~mendel) — VMware 共同創辦人與首席科學家的自述
- [The Design and Implementation of a Log-Structured File System](https://web.stanford.edu/~ouster/cgi-bin/papers/lfs.pdf) — Rosenblum 與 Ousterhout 的 LFS 論文（ACM TOCS 1992，DOI 10.1145/146941.146943），assign8 那條線的源頭
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/) — 課程列為選讀的教科書官網
- [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244) — 第十二堂講義引用的信任定義出處
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS146S 兩版大綱對照](/posts/ai/2026-08-16-cs146s-course-map)
