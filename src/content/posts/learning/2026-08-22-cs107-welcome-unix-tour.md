---
title: "Stanford CS107 Lecture 1：從課程地圖走進 Unix 命令列"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, unix, self-study]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS107 導讀"
  order: 2
tldr: "Winter 2026 第一講先回答 CS107 為何要往抽象層底下挖：從位元組、記憶體、組合語言到 heap allocator，再交代作業 40%、lab 10%、期中 20%、期末 30% 的課程制度，最後用 Unix 命令列替後續 C 開發暖身。"
description: "逐頁導讀 Stanford CS107 Winter 2026 Lecture 1：課程目標、六大主題、評分與重交政策、求助與榮譽準則，以及 Unix 命令列的第一輪操作。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-cs107-welcome-unix-tour-en)

Stanford CS107 的第一講不是急著教 C 語法，而是先把問題改寫。CS106B 問「怎麼用高階語言解題」，CS107 問「程式為什麼真的能這樣跑」。`int`、字串與結構在硬體上長什麼樣子？執行檔如何進入記憶體？`malloc` 背後又是誰管理那塊 heap？這些問題共同指向一件事：把看似理所當然的程式抽象拆開來看。

這篇對應 [Stanford CS107 Winter 2026 官方 Lecture 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf)，不是整門課的總覽。主脊依照投影片順序走：先定義課程視角，再讀課程主題與學習目標，接著整理作業、lab、考試與求助規則，最後進入 Unix 命令列。即使不在 Stanford 修課，這一講仍有用，因為它替後面二十五講畫出了一張「抽象層往下走」的地圖。

## 講次資料與材料邊界

- 課程：Stanford CS107: Computer Organization and Systems
- 學期：Winter 2026
- 官方講次：Lecture 1, *Welcome to CS107!*
- 上課日期：2026-01-05
- 講者：Jerry Cain
- 官方材料：[課程 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)、[Lecture 1 slides（33 頁）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf)、[Winter 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus)、[Assignment 0](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/)
- 指定閱讀：course syllabus、Honor Code and Collaboration Page、Bryant 與 O’Hallaron 第 1 章略讀

材料缺口也要先講清楚。錄影在 Canvas／Panopto 後方，投影片裡的現場終端操作沒有逐字 transcript；課程使用的 AFS lecture code 與作業 starter project 也不是公開材料。因此下面能忠實還原的是投影片列出的概念、政策與指令，不會假裝知道 Cain 當天額外說了什麼，也不會替 demo 補一套虛構輸出。

## 本講完整 agenda

1. CS107 的 how／why 視角，以及它如何接續 CS106B。
2. 課程希望學生在程式設計、除錯與系統理解上得到什麼。
3. 位元與位元組、C 字串、指標與記憶體、泛型、組合語言、heap allocator 六大主題。
4. 教學團隊、CS107ACE、教材、lecture／lab／assignment 的節奏。
5. 評分、style bucket、遲交與重交政策。
6. 考試、求助管道、Honor Code 與作業合作邊界。
7. Unix、CLI 與 GUI 的對照，以及第一批命令列指令。
8. `assign0` 的目的與本講回顧。

## CS107 把「怎麼寫」往下追成「為什麼能跑」

投影片用 CS106B 當對照：前一門課讓學生使用高階語言解題，這一門課則往下挖程式真正的運作方式。這不是把同一份程式換成較難的語法，而是更換觀察單位。高階語言裡的變數看起來像有型別的盒子；到了 CS107，它是某個位址開始的一串位元組，型別則告訴編譯器該怎麼解讀它。

第一講列了五個問題。資料如何表示在硬體上？電腦如何執行程式碼？執行檔如何對應到記憶體與硬體？heap 如何運作又如何實作？為什麼程式做的事情和預期不同？最後一題尤其重要。CS107 並不只想讓學生記住機器模型，而是想用那個模型改善除錯：不是在錯誤輸出附近亂改，而是追到資料表示、位址、生命週期或控制流究竟哪裡違反假設。

這也解釋了課程為何一直強調「coding mileage」。懂一張記憶體配置圖，不等於能在真實 C 程式裡找出越界寫入。投影片把能力目標寫成三層：流利運用、具備能力、接觸概念。學生要能流利處理 pointer、memory、執行檔的 address space 與 runtime behavior；要能在 C 與 assembly 間翻譯、尊重電腦算術限制、找效能瓶頸、操作 Unix 環境，也要能用倫理架構思考軟體；至於電腦架構、compiler 與 assembler 的基本原理，則屬於建立視野。

讀這份分層時不要把「接觸」誤讀成不重要。它只是說 CS107 不要求你在一季內成為編譯器作者。課程真正要你帶走的是一個可操作的心智模型：看到 C 原始碼時，能推理它在記憶體與機器指令層可能發生什麼。

## 六個主題其實是一條連續的下降路線

第一講把課程拆成六塊，但它們不是互不相干的單元。

第一塊是 bits and bytes。整數與浮點數不是以「數學上的數」住在電腦裡，而是有限長度的 bit pattern。只要表示長度有限，溢位與精度就不是偶發 bug，而是模型的一部分。

第二塊是 characters and C strings。文字比單一整數複雜，但底層仍是位元組。C 字串沒有高階語言替你看守的邊界，這會直接帶到 buffer overflow 與安全性。

第三塊是 pointers、stack 與 heap memory。指標讓程式直接保存與操作位址；stack 和 heap 則對應不同的配置與生命週期。很多 C 錯誤表面上長得不同，根部其實都是「誰擁有哪段記憶體、它何時仍有效」。

第四塊是 generics。C 沒有 Java 或 C++ 那套完整泛型系統，但只要理解資料表示與位址，就能用 `void *` 和函式指標寫出處理任意資料型別的工具。抽象不是消失，而是由程式設計者自己搭起來。

第五塊是 assembly。課程會把 C 程式對照到 x86-64，讓函式呼叫、條件判斷與迴圈不再是語法關鍵字，而是暫存器、指令與跳躍。

最後是 heap allocators。走到這裡，`malloc` 與 `free` 不再是黑盒 API。學生要問：配置器如何追蹤可用區塊？如何在速度、空間利用率與碎裂之間取捨？內建版本是否適合所有工作負載？這一塊把前面的位元組、指標、資料結構與效能觀念收在同一個實作裡。

所以自學時不要把課表看成「學完 C 再學 assembly」。比較準確的路線是：每往下一層，都重新解釋上一層為何成立。字串用位元組解釋，泛型用指標解釋，C 的控制流用 assembly 解釋，`malloc` 再用前面所有東西解釋。

## 課程節奏：lecture 給模型，lab 讓手跟上，assignment 逼你整合

投影片把三種活動的功能分得很清楚。Lecture 用來理解概念並看示範；lab 用來學工具、讀程式碼、和同儕討論；assignment 則把 lecture 與 lab 的內容合成一個必須自己完成的程式。這個安排透露一個自學陷阱：只看投影片最多完成第一層，還沒有完成 CS107 所說的程式能力。

一般節奏是某週三、週五與隔週一完成一個主題的三段 lecture，lab 在週四消化前一週材料。第一份 `assign0` 於第一週三公布，隔週三截止，因此它會同時用到週一、週三與部分週五內容。換句話說，課程不是等一個單元全講完才讓你開始做；作業本身就是把零散理解拉成技能的過程。

指定教材是 Bryant 與 O’Hallaron 的 *Computer Systems: A Programmer’s Perspective* 第三版。投影片特別說明版本重要，課程也在 Canvas 提供符合 fair use 的指定章節掃描；但那份掃描不是公開資源。C 語言參考可選 Kernighan 與 Ritchie 的 *The C Programming Language*，或其他你習慣查閱的手冊。重點不是選定一本從頭背完，而是能在寫 C 時快速確認函式契約與語言行為。

此外還有一學分的 CS107ACE，提供額外討論、練習與教學支援，需要申請。它提醒自學者一件現實：正式課程並不假設每個人看一次 lecture 就懂，額外練習與當面釐清本來就是設計的一部分。

## 評分制度把「能跑」與「能維護」拆開看

Winter 2026 的成績由 assignments 40%、lab participation 10%、midterm 20%、final 30% 組成。七份程式作業都要個別完成，使用 Unix 命令列工具；課程提供 starter projects。功能由自動化工具評成分數，少量部分由 CA 檢視；style 則透過 code review 加上偶爾的自動測試，給一個 bucket。

Style bucket 從 `+`、`ok`、`-`、`--` 到 `0`。`+` 代表非常出色，而且早期作業很少給；`ok` 是整體扎實、仍有改善空間；`-` 表示看得出努力與理解，但距離可進 professional repository 還有明顯問題；`--` 是問題很多、勉強及格；`0` 則是沒交或幾乎沒改 starter code。

這套拆分值得留意。功能測試通過，只能說程式對測試案例產生預期結果；它沒有自動保證命名、分解、註解與控制流程足以讓別人維護。反過來，風格漂亮也不能抵銷程式算錯。CS107 把兩者分開評，就是把「專業等級程式」定義成同時正確且可讀。

如果拿這套思路自學，可以替自己做兩輪檢查。第一輪只問行為：用不同輸入、邊界值與錯誤情況測試。第二輪先把程式放一天，再回頭只看結構：函式是否各做一件事、名稱能否取代解釋性註解、重複邏輯能否收斂。不要在同一輪裡一邊追 crash、一邊重命名所有變數。

## 遲交與重交：是恢復機制，不是免除第一次作答

作業在截止日 Stanford 時間午夜前一分鐘到期。按投影片列出的政策，逾期未滿 24 小時，功能分數最高 95%；24 至 48 小時最高 90%；48 至 72 小時最高 85%；超過 72 小時原則上不收，除非事先另有安排。所謂 cap 是把高於上限的分數壓到上限，不是所有人一律扣固定點數。

重交政策則適用於 `assign6` 以外的作業。第一次功能分數低於 85% 且至少 25% 時，可以在全班收到成績報告後七個日曆日內重跑自動測試，把功能分數補到最高 85%。第一次低於 25% 也不是完全沒有機會，但上限是原分數三倍。重交不會重新 review style，也不會重讀簡答。

這個設計的訊號很清楚：課程允許你從測試結果修正理解，但第一次必須提出有實質內容的解答，而且重交只修復可由自動測試驗證的功能面。若把它移植到自學，不妨保存第一次測試報告與修改紀錄。修完後寫一句「我原本錯把什麼當成什麼」，否則分數回升了，錯誤模型可能仍留著。

## 考試、求助與合作邊界

期中與期末都是紙筆、closed book、closed notes、closed electronic device，現場提供常用函式 prototype 與不值得死背的參考資訊。這說明考試要測的不是 API 記憶量，而是在沒有編譯器即時回饋時，能否推理程式與記憶體。

求助管道依問題性質分流。Ed Discussion 適合課程內容、政策、除錯與一般作業問題，但不能貼作業程式碼；office hours 適合較長的討論與在 CA 陪同下除錯；私人評分或 accommodation 問題則寄給 teaching staff。好的提問不是把整份程式丟出去，而是帶著可重現情況、觀察到的行為、預期行為與已驗證的假設。

Honor Code 的核心是不得給予或接受未經允許的學術協助。CS107 進一步要求揭露完成作業時收到的協助，不看別人的解答、不分享或上傳解答。這一季的投影片也明列：不得用 LLM 生成作業程式碼，因為那會取代作業要評量的智力工作。若發現自己做錯選擇，可以在期末考前寄信撤回作業提交。

對公開逐講文章而言，最重要的不是替在校生解題，而是維持材料邊界。下面會解釋公開投影片中的概念與練習方式，但不重建作業答案，也不假裝有權限存取的 starter code 是公開教材。

## Unix 命令列：第一個要練的是位置感

Unix 提供一組作業系統標準與軟體開發工具。macOS 與 Linux 都承接 Unix 傳統；CS107 則在 Stanford 的 Myth 機器上使用這套環境。命令列介面（CLI）是文字式的檔案系統導航與程式啟動方式，圖形介面（GUI）則用視窗與圖示完成類似工作。

兩者的共同問題都是「我現在在哪裡、這裡有什麼、要去哪裡、要對哪個檔案做什麼」。CLI 沒有把這些狀態畫成視窗，所以新手會覺得它沒有提示；但它的文字命令可重複、可組合，也能原封不動用在遠端主機。這正是系統課與伺服器工作偏好命令列的原因。

第一講出現的基本指令包括：

```bash
pwd                 # 顯示目前工作目錄
ls                  # 列出目錄內容
cd path/to/project  # 切換目錄
mkdir scratch       # 建立目錄
cp source.c copy.c  # 複製檔案
mv copy.c old.c     # 移動或重新命名
cat old.c           # 把文字檔內容印到終端
man printf          # 查閱手冊
rm old.c            # 刪除檔案
```

`rm` 在投影片上特別標為不可逆刪除。練習時不要拿重要目錄試；先建立一個專用 `scratch` 目錄，在裡面放可丟棄檔案，再逐一執行 `pwd`、`ls`、`mkdir`、`cp`、`mv`、`cat` 與 `rm`。每打一個命令先預測下一次 `ls` 會看到什麼，再執行確認。這比抄十次指令名稱更能建立位置感。

課程要求學生用 `ssh` 遠端登入 Myth、用 `emacs` 編輯、用 `make` 編譯、以 `./myprogram` 執行。第一講還沒展開整條工作流程，那是 Lecture 2 的主題；此處只先建立一個觀念：C 程式不是在編輯器裡「按播放」就憑空運作，它會經過檔案、編譯器、執行檔與 shell。之後的每個錯誤都可能發生在不同層。

## assign0 在測什麼

`assign0: Intro to Unix and C` 有五部分：瀏覽課程網站並學幾個 Unix 指令、clone starter project、回答 `readme.txt` 問題、編譯並修改一份 C 程式、最後提交。它不是用複雜演算法篩人，而是在正式進入指標與記憶體前，確認每個人能操作同一套開發環境。

自學者拿不到該學期完整 starter project 時，不該假造一份「等價作業」。可以保留它的能力目標，做一個較小且可驗證的替代練習：建立 `hello.c`，用純命令列完成建立目錄、編輯、編譯、執行、重新命名與刪除輸出檔。完成後，關掉終端重新登入，再不看筆記走一次。第二次還卡住的步驟，就是下一輪要刻意練的地方。

## 這一講真正要帶走的三件事

第一，CS107 不是 C 語法課。C 是用來暴露資料表示、位址、執行流程與配置器的工具。若只背語法，後面會在每個單元重新撞牆。

第二，課程把正確性、可維護性與除錯能力放在一起。自動測試、style review、lab 與考試分別照不同角度看同一份理解，沒有任何單一指標能取代其他部分。

第三，Unix 不是開場雜務。後續所有編輯、編譯、測試、除錯與效能分析都發生在這個環境。現在花半小時建立 `pwd`、`cd`、`ls` 與檔案操作的肌肉記憶，會直接減少往後判斷錯誤層級的負擔。

下一講會把這張地圖落到第一支 C 程式：header、`main`、`printf`、command-line arguments，以及從原始碼到執行檔的工作流程。後半段再從一個 bit 開始，把十進位、二進位與十六進位放進同一套位值系統。

## 延伸閱讀與練習

### 最小路線

1. 在可丟棄目錄中逐一操作本講列出的 Unix 指令。
2. 每次執行前先說出目前目錄與預期的 `ls` 結果。
3. 讀 Lecture 1 slides，自己畫出六個主題的依賴箭頭。

### 標準路線

1. 略讀 *Computer Systems: A Programmer’s Perspective* 第 1 章，特別找出 compilation system 與 hardware organization 的總覽。
2. 建立一個小型 C 專案目錄，刻意只用 shell 導航與整理檔案。
3. 寫一份自己的求助模板：環境、重現步驟、預期、實際結果、已測過的假設。

### 深入路線

1. 比較 GUI 檔案操作與 shell 命令，記錄哪些動作容易重複或組合。
2. 找一支已編譯程式，先不要拆解內容，只辨認原始碼、編譯產物與執行檔各自位於哪裡。
3. 把六大主題各寫成一個可驗證問題，往後每講回來更新答案。

## 更新紀錄

- 2026-08-22：依官方 PDF 修正 Lecture 1 投影片頁數為 33 頁。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 1 Slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf)
- [Stanford CS107 Winter 2026 General Information and Syllabus](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus)
- [Stanford CS107 Winter 2026 Assignment 0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/)
