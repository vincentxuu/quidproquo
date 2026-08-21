---
title: "Stanford CS336 導讀：講義是跑得起來的 Python，作業從第二份開始要自己付 GPU 的錢"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs336, ai-course, stanford, llm, gpu, self-study]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 16
tldr: "CS336 的十七堂正課裡，只有九堂是可以執行的 Python 程式，另外八堂是 PDF 投影片——分界線剛好是兩位授課者。第一份作業的講義有八個「低資源提示」教你怎麼在筆電上做完，第二到第五份一個都沒有。課程頁自己列了 B200 的每小時單價，作業講義自己列了每題要幾個 B200 小時。"
description: "Stanford CS336: Language Modeling from Scratch 深度導讀，讀過 Spring 2026 課程官網、lecture_01.py 原始碼、五份作業的 GitHub repo 與 PDF 講義、排行榜 repo 與課程 AI 政策：可執行講義的真實形態、五份作業的分水嶺在哪、GPU 預算怎麼自己算、需申請的課自學者拿得到什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)

[CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) 是 [Tatsunori Hashimoto](https://thashim.github.io/) 與 [Percy Liang](https://cs.stanford.edu/~pliang/) 開的五學分課。你要從一堆位元組開始，自己把 tokenizer、Transformer、GPU kernel、多機平行、scaling law、資料清理、後訓練整條做出來。它的自我定位寫在課程頁上：仿照那種「整學期自己寫一個作業系統」的系統課，只是對象換成語言模型。

它在整份 [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)裡是唯一標注 **Application required** 的一門，也是唯一一門「不花錢就做不完作業」的課。地圖文已經講過它站在階梯的哪一格，這篇要回答的是進去之後會發生什麼。

這篇讀過的東西：Spring 2026 的課程官網、`lecture_01.py` 的原始碼、五份作業各自的 GitHub repo 與 PDF 講義、四個排行榜 repo、課程的 AI 政策文件，以及 ExploreCourses 與 Stanford Online 的條目。**不包含**逐堂聽完錄影——那是另一個量級的工作。這篇處理的是文字材料能證明的事。

## 這門課的硬事實

Spring 2026 是第三次開課，週一週三下午在 Skilling Auditorium 上，助教三位。ExploreCourses 的條目寫 `Terms: Spr | Units: 3-5`，下一次開課掛在 **2026–2027 春季**，而且條目裡直接寫「Application required, apply at http://cs336.stanford.edu/」。

先修條件那一段有一句被引用到爛，但它真的還在課程頁上，出現在「Proficiency in Python」底下：

> Unlike most other AI classes, students will be given minimal scaffolding. The amount of code you will write will be at least an order of magnitude greater than for other classes.

同一段還有兩句比較少被引的。一句是「A significant part of the course will involve making neural language models run quickly and efficiently on GPUs across multiple machines」——這是在說系統課的比重不是點綴。另一句是整段最後的加粗提醒：「Note that this is a 5-unit class. This is a very implementation-heavy class, so please allocate enough time for it.」

順帶一提，這裡有一個官方頁面互相對不上的地方：課程頁寫「this is a 5-unit class」，[ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+336&view=catalog) 的學分欄寫的卻是 3-5。[Stanford Online](https://online.stanford.edu/courses/cs336-language-modeling-scratch) 的遠距版又是另一組數字，收在文末附錄。

工作量到底多重，課程自己引了一句學生評鑑。這句在 `lecture_01.py` 的 `course_logistics()` 函式裡，標明出自 Spring 2024 的課程評鑑：

> The entire assignment was approximately the same amount of work as all 5 assignments from CS 224n plus the final project. And that's just the first homework assignment.

第一堂還有一節叫「Why you should not take this course」，列了三條。你這學期真的要做出研究成果——去跟指導教授談。你想學 AI 最新最紅的技術——去修研討課。你想在自己的應用領域拿到好結果——直接 prompt 或微調現成模型就好。

## 「從零開始」不是說法，是四個地方都拆掉了鷹架

大部分課的「from scratch」只作用在作業起始碼上。CS336 把同一件事推到四個地方，剛好就是這篇後面四節：**講義本身是程式**、**AI 不准替你寫程式**、**作業沒有骨架只有測試**、**算力要你自己買**。

課程頁的榮譽準則那節把最後一道門也關上了。它先說網路上到處都有現成實作，接著說課程講義是自足的（self-contained），所以你不需要去參考第三方程式碼。結論是：除非講義另有說明，你不應該去看任何既有的實作。這個推論鏈是整門課的縮影——它先承擔了把講義寫到自足的責任，才有資格立這條規則。

## 講義是一支跑得起來的程式，但只有九堂是

[講義 repo](https://github.com/stanford-cs336/lectures) 目前有 3,649 顆星，跟本站地圖文前一天記的數字幾乎沒動。fork 數、最後更新時間與讀取日期見附錄。

這個 repo 最常被提到的特色是「可執行講義」。定義是課程自己下的，寫在 `lecture_01.py` 的 `what_is_this_program()` 函式裡：

> This is an *executable lecture*, a program whose execution delivers the content of a lecture.

實際長相是這樣：整支 `lecture_01.py` 有 762 行，`main()` 依序呼叫 `welcome()`、`why_this_course_exists()`、`course_syllabus()`、`tokenization()` 這些函式，每個函式裡是一連串 `text("...")`、`image(...)`、`link(...)` 的呼叫。投影片的每一頁在這裡是一次函式呼叫，而講次的階層結構就是呼叫堆疊。

跟投影片真正的差別在講到程式碼的時候。同一支檔案裡有一個貨真價實的 `BPETokenizer` 類別、一個 `merge()` 函式、一個算壓縮率的 `get_compression_ratio()`，而關鍵是那些寫在行尾的註解：

```python
def merge(indices: list[int], pair: tuple[int, int], new_index: int) -> list[int]:
    new_indices = []  # @inspect new_indices
    i = 0  # @inspect i
    while i < len(indices):
        ...
```

`# @inspect` 是給追蹤器看的標記，被標記的變數會在網頁上逐步顯示它每一步的值；`# @stepover` 則是叫追蹤器不要跳進這個呼叫裡面。所以你在網頁上讀到 BPE 那一節時，不是看一張「合併前 / 合併後」的示意圖，是看那個 list 真的一步一步被合併掉。講義裡的 `link(Tokenizer)` 甚至是連到同一支檔案裡的那個類別。

跑法在 repo 的 README 與 [edtrace](https://github.com/percyliang/edtrace) 的文件裡：`python -m edtrace.execute -m lecture_01` 產生 `var/traces/lecture_01.json`，再用 edtrace 的前端渲染。edtrace 是 Percy Liang 自己寫的工具，README 說它「主要是為了做可執行講義而設計的」，但也可以套在任何 Python 程式上。渲染好的成品掛在課程網域下，網址是 `https://cs336.stanford.edu/lectures/?trace=lecture_01` 這種形式。

**但這裡有一件二手介紹幾乎都漏掉的事：十七堂正課裡只有九堂是可執行講義，另外八堂是 PDF 投影片。** repo 裡 `lecture_01/02/06/07/10/12/13/14/17` 是 `.py`，`lecture_03/04/05/08/09/11/15/16` 是 `.pdf`。而把這兩組對回 Spring 2026 的課表，分界線一絲不差：九支 `.py` 全部是 Percy Liang 的堂次，八份 PDF 全部是 Tatsunori Hashimoto 的堂次。

所以「CS336 的講義是可執行的 Python」這句話只對一半。架構與超參數、注意力替代方案與 MoE、GPU 與 TPU、平行化的其中一堂、兩堂 scaling law、SFT/RLHF、RLVR——這些主題你拿到的是 PDF。課程材料沒有說明為什麼是這樣分的。

## 教你造語言模型的課，禁止語言模型替你寫程式

Spring 2025 那版的榮譽準則只寫到「強烈建議你把 IDE 的 AI 自動補完關掉」。Spring 2026 這版多了一句「See the AI policy」，連到一份[獨立的政策文件](https://docs.google.com/document/d/1SZAlExB1qAc9izHt54gwunNpjKE6wXb8Y7yA_e-baK8)。它的第一段是這樣開的：

> AI is able to solve many parts of the assignments fully autonomously. This makes it harder to deeply engage with and learn from the course material. All your code should be handcrafted by you directly.

政策把界線畫在「問概念、查 API 可以，寫程式不行」。它明講這條同時涵蓋 coding agent（Cursor Agents、Codex、Claude Code）與 AI 自動補完（Cursor Tab、GitHub Copilot），而且**排行榜也適用**。

真正有意思的是執行方式。政策要求每個作業 repo 都附一份 `AGENTS.md`，裡面是一段教學導向的提示詞。coding agent 進到 repo 會自動讀到它，而且「這個檔案不得以任何方式修改」。用網頁聊天介面的話，要把整份 `AGENTS.md` 貼到每一段對話的開頭。

我把五個作業 repo 都查了一遍：`AGENTS.md` 與一份位元組相同的 `CLAUDE.md` 五個 repo 都有。內容是一份寫給 agent 的角色設定，`SHOULD NOT` 清單第一條就是「Write any python or pseudocode」，後面還有不准編輯學生 repo 的程式碼、不准跑 bash 指令、不准把學生指向第三方實作。它連對話範例都寫好了：學生說「我的 causal mask 好像有問題，直接告訴我錯在哪」，示範答案是「我的角色是引導你理解，不是直接給你答案。你到目前為止試過什麼？」

政策文件最後給了一條判準，比任何條列都好用：**問問自己，如果你在 office hour 對助教提出同樣的要求，助教會照做嗎？**不會的話，這個要求大概就不合規。

## 五份作業逐份看

課程頁對五份作業的描述很短，但每一份都有獨立的公開 repo，起始碼、單元測試與 PDF 講義都拿得到，五個 repo 裡有四個掛 MIT 授權。把講義打開看，才知道每一份實際在做什麼：

| 作業 | 你要實作什麼 | 講義列出的算力 |
|---|---|---|
| [1. Basics](https://github.com/stanford-cs336/assignment1-basics) | BPE tokenizer、Transformer、交叉熵與 AdamW、訓練迴圈；在 TinyStories 與 OpenWebText 上訓練 | 逐題加總 17 B200 小時 |
| [2. Systems](https://github.com/stanford-cs336/assignment2-systems) | 效能剖析工具鏈、activation checkpointing、FlashAttention2 的 Triton kernel、DDP、optimizer state sharding、FSDP | 最多 6 張 GPU；排行榜用 2 張 B200 |
| [3. Scaling](https://github.com/stanford-cs336/assignment3-scaling) | 對訓練 API 送實驗、擬合 IsoFLOP 曲線、外推出計算最佳的模型大小與超參數 | API 端強制 12 B200 小時 |
| [4. Data](https://github.com/stanford-cs336/assignment4-data) | Common Crawl 的 HTML 轉文字、有害內容與 PII 過濾、MinHash 去重、資料混合 | 一次訓練 8 張 B200 跑約 2 小時 |
| [5. Alignment and Reasoning RL](https://github.com/stanford-cs336/assignment5-alignment) | 各種 prompting、GRPO、policy gradient 的變異數縮減與 importance weight clipping、off-policy GRPO | 逐題加總 26 B200 小時 |

幾件從講義才看得到的事。

**第五份在 2026 年變成純 RL 了。** 它的講義標題是「Reasoning RL」，必做部分是在一個 OLMo-2 的 1B 模型上跑 GSM8K 的 prompting 與 GRPO，再比較 RFT、Dr. GRPO、MaxRL 這些變體。SFT、DPO 與安全對齊被移到一份**完全選修**的補充講義裡。所以「這門課最後做 SFT 與 RLVR」這個常見說法，在 2026 年只有後半是必做的。

**第三份的形狀跟其他四份不一樣。** 它不要你自己訓練大模型，而是對課程架的訓練 API 送實驗、拿回 validation loss，再從這些點擬合出 scaling law，外推出計算最佳的模型大小。真正的限制是額度：**你的實驗總共只有 12 B200 小時，超過之後 API 會直接拒絕請求。** 而且額度是動態結算的——預約的時間沒用完會退回餘額，逾時被砍的則按預約時間全額計費。這是整門課裡最像真實研究實驗室的一份：卡住你的不是會不會寫，是實驗排程規劃得好不好。

**第一份和第二份都有公開排行榜。** [第一份的排行榜](https://github.com/stanford-cs336/assignment1-basics-leaderboard)比的是 OpenWebText 的 validation loss，規則是單張 B200 上最多跑 45 分鐘。[第二份的排行榜](https://github.com/stanford-cs336/assignment2-systems-leaderboard)比的是一個 8B 模型完整訓練一步要多久，官方說「我們預期投稿要打敗 10 秒這條天真基準線」——目前榜首大約是它的四分之一。兩份的完整規則與現況數字都收在附錄。

## 分水嶺在第二份，而證據就寫在講義的排版裡

「哪一份是分水嶺」這個問題，第一份作業的講義自己回答了。它在開頭就放了一個藍色方塊：

> Throughout the course's assignment handouts, we will give advice for working through parts of the assignment with fewer or no GPU resources.

這種方塊叫「Low-Resource Tip」，第一份講義裡有八個。它們教你先拿 TinyStories 的驗證集當除錯資料集來訓練 tokenizer、教你在 Apple Silicon 上把 device 字串換成 `mps`、教你把處理的 token 數降下來並同時放寬目標 loss。其中一個方塊給了最有說服力的數字：用助教的解答程式碼，在一台 M4 Max 筆電上，**五分鐘之內**就能訓練出一個能寫出通順文字的語言模型。

**然後我把第二、三、四、五份講義都搜了一遍：「Low-Resource Tip」出現零次。** 那句「throughout the course's assignment handouts」的承諾，只有第一份兌現了。

改成看第二份講義要求什麼硬體，落差更清楚：光是效能剖析那一節就寫著「Resource requirements: Up to 6 GPUs」，DDP 與 optimizer state sharding 的每一題都指定「1 node, 2 GPUs」的設定。這裡沒有降級路線可走——你不可能在 CPU 上量 all-reduce 佔了多少時間。

GitHub 的 fork 數也指向同一個地方：第一份作業的 repo 有 2,686 個 fork，第二份只剩四分之一多一點。**但 fork 不等於做完**，課程也沒有公開任何完成率資料，所以這條只能當旁證，不能當結論。真正硬的證據是那些藍色方塊只出現在第一份講義裡。

結論很單純：**第一份作業是真的可以在筆電上做完的，第二份不是。** 如果你只想確認自己懂不懂 Transformer，做完第一份就已經把 tokenizer、模型、優化器、訓練迴圈全部手寫過一遍，而且花費是零。要往下走，下一節的錢就跑不掉了。

## GPU 的錢：單價在課程頁上，時數在講義裡

這門課有一節叫「GPU compute for self-study」，直接寫給沒修課的人看。它列出五家雲端供應商單張 B200 的公開報價，並標明報價的讀取日期；最低的 RunPod 是每小時 **4.99 美元**，其餘四家與那家有免費額度的贊助商都收在附錄。同一節給的建議是：先在 CPU 上除錯正確性，再開 GPU 跑訓練或做效能量測。

跟 [Spring 2025 版的同一節](https://cs336.stanford.edu/spring2025/)對照才有意思：那時候列的是 H100 80GB 的報價，最低每小時 1.99 美元。一年之間課程的基準硬體換了一個世代，單價下緣也漲了一倍以上。

時數則寫在講義裡。CS336 的作業講義有一個少見的習慣：**每一道要用 GPU 的題目，標題括號裡就寫著它的算力預算**，像是 `Problem (leaderboard): Leaderboard (10 B200 hrs)`、`Problem (layer_norm_ablation): Remove RMSNorm and train (0.5 B200 hrs)`。所以預算不需要任何人幫你估——把講義裡的數字加起來，再乘上課程頁自己列的單價就好。完整加總過程放在附錄，這裡只給結果：**四份作業講義明寫的時數合計 71 B200 小時**（第二份沒標時數，沒算進去），照課程頁列的單價區間換算，落在四百多美元上下，前提是你一次做對、不重跑。

兩個一定要知道的但書。其一，第三份那筆額度對修課學生是課程的訓練 API 出的，自學者要自己買。其二，第二份沒有時數上限，因為它比的是速度不是總量——但它要求最多六張 GPU 同時在線，那是另一種帳。

## 需要申請，可是材料全公開

Stanford Online 那頁把「為什麼要申請」寫得很直接：「Due to high compute requirements for this class and high workload, we unfortunately have to limit enrollment.」——因為算力需求高、工作量大，所以必須限制人數，而且不接受直接選課，所有申請者一律進候補名單。

也就是說，門檻不是因為內容機密，是因為算力與人力有上限。這一點跟課程對自學者的態度完全一致——第一堂的 `course_logistics()` 裡有一節就叫「How you can follow along at home」，內容是：所有講義與作業都會公開，歡迎自己跟。

所以「修不到」和「學不到」在這門課是兩件事。你拿不到的只有三樣：Gradescope 的評分、Slack 頻道與 office hour、以及課程贊助的算力。

而最出乎意料的一件事是：**排行榜對外開放。** 第一份作業排行榜 README 的第一段就是給非 Stanford 學生的說明——投到第二張表，想留在前五名要接受驗證：邀請助教 Marcel Rød 進一個只有 `pyproject.toml`、`uv.lock`、`main.py` 的最小 repo，確認能在單張 B200 上 `uv run main.py` 重現。獎品那句寫得很清楚：「the external top 3 submissions will receive a T-shirt.」

這不是說說而已。2025 那一屆的「Global leaderboard」收了一批校外投稿，名字後面掛的機構有赫爾辛基大學、華東師範大學，還有一位標成 hobbyist 的人排在該表第二。第二份作業的排行榜也有同樣一段對外邀請，驗證條件改成兩張 B200。

要誠實補一句：第一份作業排行榜的 README 目前雖然叫非 Stanford 學生投到「第二張表」，但檔案裡 2026 年只有一張班內表，另外兩張 2025 年的表是收合起來的。那張校外表現在還不存在。

還有一個小八卦能說明這條路真的走得通：2026 年這學期的助教 Herman Brunborg，正是 2025 年那屆第一份與第四份作業排行榜的榜首。

## 自學者實際拿得到什麼

| 東西 | 拿不拿得到 |
|---|---|
| 九堂可執行講義 | 拿得到，掛在課程網域下，跑一次要 uv 加 edtrace 前端 |
| 八份 PDF 投影片 | 拿得到，全在講義 repo 裡 |
| 課程錄影 | 拿得到。Spring 2026 播放清單在 Stanford Online 頻道，目前 18 支；2025 那屆有另一份獨立播放清單 |
| 五份作業起始碼與講義 PDF | 拿得到，五個 repo 全公開 |
| 單元測試與 adapter 介面 | 拿得到，`uv run pytest` 一開始會全紅在 `NotImplementedError` |
| 排行榜 | 拿得到，第一、二份都對外開放投稿並驗證 |
| 第三份的訓練 API | **拿不到**。API key 是八位數的學生證號；repo 的「For non-students」段落給了自己架 API 與 dispatcher 的路，但那等於自己出那 12 小時 |
| Gradescope 評分、Slack、office hour | 拿不到 |
| 課程贊助的算力 | 拿不到 |

幾個引用時要注意的陷阱，都是我這次核對到的：Stanford Online 那頁的「Course Website」連結指向的是 **spring2024** 的舊站；第一份作業 repo 的 README 標題還寫著「CS336 Spring 2025 Assignment 1」，但同一個資料夾裡的講義 PDF 是 Version 26.0.3、封面寫 Spring 2026。要看現行內容一律以 PDF 的版本號為準。

## 怎麼開始

不要先開雲端主機，也不要先看錄影。今晚做這件事：

`git clone https://github.com/stanford-cs336/assignment1-basics`，`uv run pytest`。你會看到整排測試因為 `NotImplementedError` 而失敗。打開 `tests/adapters.py`，挑 BPE tokenizer 的那個 adapter，照講義第二節把它做到綠燈——講義說這一步的資源需求是「不需要 GPU、30 分鐘內、30 GB 記憶體以內」，所以你的筆電就夠。

做完這一題，你對「要不要修這門課」就會有一個比任何自我評估都準的答案：如果你覺得這一題只是有點煩但完全做得動，那第一份作業的其他部分也做得動；如果你卡在「我不知道從哪裡開始寫」，那正是課程頁那句 minimal scaffolding 在講的東西，先回去把 PyTorch 練熟再來。

如果只有一個下午而且不想寫程式，就開 `lecture_01` 的追蹤頁，直接跳到 tokenization 那一段，把 `merge()` 一步一步跟完。那是這門課教法的最小樣本。

## 附錄：數字與查證方式

- **講義 repo 讀數**：3,649 stars、758 forks、最後 push 2026-05-28，取自 GitHub API 於 2026-08-21。作業 repo 的 fork 數同日：assignment1-basics 2,686、assignment2-systems 705、assignment3-scaling 262、assignment4-data 274、assignment5-alignment 460。**fork 數不是完成率**，只是「有多少人把 repo 拉到自己名下」，課程未公開任何完成率資料。
- **可執行講義 9 / PDF 8 的對照**：依 `stanford-cs336/lectures` 的檔案清單與 Spring 2026 課表的授課者標注逐堂比對。九支 `.py` 對應課表標 [Percy] 的第 1、2、6、7、10、12、13、14、17 堂；八份 `.pdf` 對應標 [Tatsu] 的第 3、4、5、8、9、11、15、16 堂。第 18、19 堂是客座（Daniel Selsam、Dan Fu），沒有掛材料。**Spring 2025 那屆不是這個對應關係**——當年課表把 `lecture_06.py` 標給 Tatsu，所以這條規律只在 2026 這屆成立。
- **B200 小時逐題加總**：第一份 = 學習率調校 2 + batch size 實驗 1 + 四項消融各 0.5 + OWT 主實驗 2 + 排行榜 10 = 17；第五份 = GSM8K prompting 2 + 學習率 4 + prompt 消融 4 + 兩題 RL 演算法各 8 = 26；第三份 = API 端強制的 12 小時 scaling law 額度（講義寫 `total_budget_seconds` 為 43,200 秒），另外那個 48 B200 小時是你要預測的目標大跑，不是你要跑的；第四份 = 講義寫的「8 張 B200、batch size 128/卡、16,384 步、約 8.6B token，我們的訓練跑約 2:00 小時」＝約 16 B200 小時。合計 71，**不含第二份**（講義只寫最多 6 張 GPU 與每次量測 5 分鐘內，沒給總時數）、不含重跑、不含 tokenizer 訓練那一段的 CPU 時間（講義寫最多 12 小時、100 GB 記憶體以內，不需要 GPU）。
- **每小時單價**：課程頁自己標注是「public pricing for a single B200 GPU on March 28, 2026」，Modal 6.25、Lambda 6.69、RunPod 4.99、Nebius 5.50（可搶占式 3.05）、Together 7.49（最少 8 張）。Spring 2025 版的同一節標注是「prices for a single H100 80GB GPU on June 6, 2025」，RunPod 1.99–2.99、Lambda 2.49–3.29、Paperspace 2.24、Together 2.85。**本文沒有自己估價，所有單價都是課程頁列的，時數都是講義列的。** 71 小時乘上 4.99 到 7.49 這個區間，得到 354 到 532 美元；這是兩組公開數字相乘的結果，不是我的估算。
- **第一份作業講義寫的低資源設定**：Low-Resource Tip 共 8 個（以 `pdftotext` 轉出的純文字逐個計數）。其中提到的機器是「36 GB RAM 的 Apple M4 Max」，助教解答在 MPS 上不到 5 分鐘、純 CPU 約 30 分鐘就能訓練出通順文字；CPU/MPS 路線建議把處理量降到 4,000 萬 token、目標 validation loss 從 1.45 放寬到 2.00。BPE tokenizer 訓練那一題標的資源需求是「≤ 30 分鐘、不需要 GPU、≤ 30 GB RAM」。第二到第五份講義搜尋「Low-Resource Tip」的命中數都是 0。
- **排行榜數字**：第一份的班內表（Spring 2026）預算標「0.75 B200 hours」、單次最多 45 分鐘，天真基準線 validation loss 5.00，目前榜首 3.03543；2025 那屆的班內表與全球表預算都是「1.5 H100 hours」。第二份（Spring 2026）在兩張 B200、batch size 2、序列長度 32768 上量完整一步的時間，天真基準線 10 秒，目前榜首 3,837 毫秒，且規定整個量測跑程從空的 PyTorch/Triton 快取起算要在 10 分鐘內完成。
- **學分與學費**：課程頁寫 5 學分，ExploreCourses 寫 3-5，Stanford Online 的遠距版寫 5 學分、7,875 美元、10 週、每週 20–25 小時、2026 年 3 月 30 日至 6 月 10 日。三者並存，本文照各自來源標注，沒有取捨。
- **未能確認的項目**：一，Spring 2026 播放清單顯示 18 支影片，而課表有 19 個講次格（17 堂正課加 2 場客座），少的是哪一堂我沒有逐支比對確認。二，第三份作業的訓練 API（`hyperturing.stanford.edu:8000`）我沒有測試連通性，只能確認 repo 說它需要八位數學生證號當 key。三，Spring 2026 各作業實際的完成率、選課人數與錄取率，公開材料裡都沒有。

## 參考資料

- [CS336 課程官網（Spring 2026）](https://cs336.stanford.edu/) — 先修條件原文、五份作業描述、GPU 單價、榮譽準則、完整課表與授課者標注
- [CS336 Spring 2025 存檔站](https://cs336.stanford.edu/spring2025/) — 兩屆對照的來源：H100 報價、Together AI 贊助、舊版 AI 條款、舊課表
- [CS336 Spring 2024 存檔站](https://cs336.stanford.edu/spring2024/) — Stanford Online 頁面目前仍指向這一版
- [ExploreCourses：CS 336](https://explorecourses.stanford.edu/search?q=CS+336&view=catalog) — 「Application required」原文、3-5 學分、2026–2027 春季開課
- [Stanford Online：CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — 限制選課的原因原文、學費、時數、候補名單流程
- [講義 repo `stanford-cs336/lectures`](https://github.com/stanford-cs336/lectures) — 九支 `.py` 與八份 `.pdf` 的檔案清單、執行與部署步驟
- [`lecture_01.py` 原始碼](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py) — 可執行講義的定義、Spring 2024 課程評鑑引言、「不該修這門課」三條、BPE 實作與 `@inspect` 標記
- [edtrace](https://github.com/percyliang/edtrace) — 追蹤器本身的用途說明與正確的執行指令
- [CS336 AI Policy Spring 2025-2026](https://docs.google.com/document/d/1SZAlExB1qAc9izHt54gwunNpjKE6wXb8Y7yA_e-baK8) — 「All your code should be handcrafted by you directly」、AGENTS.md 的要求、office hour 判準
- [Assignment 5 的 `AGENTS.md`](https://github.com/stanford-cs336/assignment5-alignment/blob/main/AGENTS.md) — 寫給 coding agent 的角色設定與 SHOULD NOT 清單
- [Assignment 1 講義 PDF](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) — 八個 Low-Resource Tip、逐題 B200 小時預算、M4 Max 五分鐘的數字
- [Assignment 2 講義 PDF](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) — 六項實作清單、「Up to 6 GPUs」、1 node 2 GPUs 的設定
- [Assignment 3 講義 PDF](https://github.com/stanford-cs336/assignment3-scaling/blob/main/cs336_assignment3_scaling.pdf) — 12 小時額度的動態結算規則、48 B200 小時的目標大跑
- [Assignment 4 講義 PDF](https://github.com/stanford-cs336/assignment4-data/blob/main/cs336_assignment4_data.pdf) — 8 張 B200 跑約 2 小時的訓練設定
- [Assignment 5 講義 PDF](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_alignment.pdf) — 2026 版必做的是 Reasoning RL，SFT 與安全對齊移到選修補充
- [Assignment 1 排行榜](https://github.com/stanford-cs336/assignment1-basics-leaderboard) — 對外投稿說明、T-shirt、45 分鐘規則、2025 全球表
- [Assignment 2 排行榜](https://github.com/stanford-cs336/assignment2-systems-leaderboard) — 兩張 B200 的驗證條件、10 秒天真基準線
- [CS336 Spring 2026 錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV) — Stanford Online 頻道，目前 18 支
- 站內：[Stanford CS 課程導讀（系列入口地圖）](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
