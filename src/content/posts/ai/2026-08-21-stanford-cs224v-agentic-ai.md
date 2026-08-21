---
title: "Stanford CS224V 導讀：2026 年才改名叫 Agentic AI，教的卻是拿形式方法治幻覺"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224v, ai-course, stanford, agentic-ai, rag, llm]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 13
tldr: "CS224V 的課名在 2026-2027 學年才從 Conversational Virtual Assistants 換成 Agentic AI，但底下的東西沒換：把自然語言翻成形式語意、用 SMT 與知識圖譜約束 agent，而不是拼框架。閱讀清單十一篇 Mandatory 裡，七篇出自授課者自己的實驗室。投影片全公開，課程網站卻明講它們是刻意殘缺的。"
description: "Stanford CS224V: Agentic AI 完整導讀，讀完課程官網、四個學年的 ExploreCourses 條目、公開的講義與兩份作業 PDF：改名前後的官方描述對照、先修為什麼收語言學課、計算思維這條軸心、作業真正的門檻，以及自學者拿得到與拿不到的東西。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs224v-agentic-ai-en)

[CS 224V](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) 是 Stanford 電腦科學系秋季開的三到四學分課，2026-2027 學年的課名是 **Agentic AI**。往前翻一個學年，同一個課號叫 *Conversational Virtual Assistants with Deep Learning*。[2025-2026 的 ExploreCourses 條目](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20252026)還掛著舊名，而那份描述已經一字沒改地用了三年。

改名容易被讀成「趕上 agent 熱潮」。但把兩份官方描述並排看，換掉的是題目，不是路線。這門課從頭到尾在處理同一個問題：**next-word prediction 的模型答對七成很容易，要接近全對做不到**。它給的處方是把自然語言翻譯成形式語意，用資料庫查詢、知識圖譜、SMT 定理證明器去約束模型，而不是換一套 orchestration 框架。

這篇讀完了課程官網、四個學年的 ExploreCourses 條目、公開的十四份講義與兩份作業 PDF。涵蓋改名前後的差異、課程主張什麼、作業真正的門檻在哪、自學者實際拿得到多少。**不包含**逐篇論文精讀，也不包含新學年的課綱——那份還沒上線。想先看這門課在整條 Stanford CS 階梯的哪一格，可以回[課程地圖那篇](/posts/learning/2026-08-20-stanford-cs-course-map)。

## 這門課的硬事實

授課者是 [Monica Lam](https://suif.stanford.edu/~lam/)，Stanford CS 系教授、美國國家工程院院士、ACM Fellow，也是編譯器「龍書」的共同作者。她主持 [Open Virtual Assistant Lab（OVAL）](https://oval.cs.stanford.edu/)，這門課的教材幾乎就是這個實驗室的成果目錄。自 2022 年起每年秋季開，PI 一直是她。

先修寫得很寬：LINGUIST 180/280、CS 124、CS 224N、CS 224S、CS 224U，**五門擇一即可**。學分三到四，成績可選字母或通過/不通過。下一次開課排在 2026 年秋季，每週一三下午上課，起訖日期收在附錄。

有兩件事跟同系的 agent 課不一樣。第一，**這門課收旁聽**——[課程網站](https://web.stanford.edu/class/cs224v/)寫明寫信給助教信箱、主旨打 `audit cs224v request` 即可，相較之下 [CS329A 明講不接受旁聽](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)。第二，它限額而且長期額滿；2025 年秋季的公告頁直接寫著：

> We apologize that we cannot accommodate all the students wishing to take the course this year.

選課人數的軌跡在 ExploreCourses 上是公開的。第一年 29 人，之後三年每年都超收，最近一次是 138 人。逐年數字收在文末附錄。

## 三份官方描述，兩次換血

同一個課號，ExploreCourses 上實際存在過三份不同的課程描述。

**第一版**用在 2022-2023 學年，談的是虛擬助理架構。把對話語意剖析成 ThingTalk 這個「虛擬助理程式語言」、從資料庫 schema 與 API 簽章生成語意剖析器、聯邦式的隱私保護助理。那是 LLM 之前的世界。

**第二版**在 2023-2024 學年上線，接著一字未改地用了三年。它換成 LLM：讓模型自我學習長知識、用外部語料防幻覺、處理結構化與非結構化資料、評估對話助理。清單末尾還掛著三個現在讀起來很有時代感的題目——**persuasive LLMs、多語助理、語音與圖形介面的結合**。

**第三版**在 2026-2027 學年上線，把上面那三個題目全數拿掉，換成：

> (3) AI-driven knowledge curation and discovery for scientific research; (4) improving the accuracy and interpretability of decision-making agents through formal methods; and (5) automated techniques for improving the accuracy and efficiency of long-horizon agents.

方向很清楚：從「做一個不會唬爛的助理」移到「做一個能做科學研究的 agent」，而且明文把**形式方法**寫進課程描述。

這條線在課程自己的教材裡也看得到。第一堂的[講義](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)把課程材料切成兩個階段：Stage 1 是「計算思維 → 通用研究助理」，Stage 2 是「計算思維 → 科學研究助理」。**課程自己把分界畫在 2025 年，課名則要等到下一個學年才改。** 官方頁面沒有說明這兩件事的關係，也沒有解釋為什麼改名。

## 課程主張：70% 很容易，接近 100% 做不到

第一堂的講義用一整頁立起這門課的問題意識。標題是「**THE 70% ACCURACY PROBLEM**」，底下三行：騙人地容易；用 next-word prediction 的 LLM 不可能接近全對；需要人來過濾，因此不可規模化。

課程給的解法叫**計算思維（computational thinking）**：把人的認知過程形式化成一步一步的指令。LLM 只負責做簡單的子功能，由一個演算法引擎去組合它們。講義用一個組合式問題示範模型為什麼不能直接被信任。分別問「Benjamin Harrison 的妻子是誰」和「Caroline Harrison 的祖父是誰」，模型各給一個答案。把兩題合成一句「Benjamin Harrison 的妻子的祖父是誰」，模型給出的卻是第三個名字。同一份講義的結論很直接：不要用 LLM 回答複雜問題。

這跟業界那套「用框架拼 agent」的差別，在閱讀清單上量得出來。[官方閱讀清單](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)分十一節，名為 **Tools** 的那一節只有兩條（一個工具使用 benchmark、一個商用 coding agent）。相對地，形式表徵與形式推理各自獨立成節，收的是 SMT、知識圖譜、SATLM、Logic-LM 這類東西。整份清單裡沒有任何一篇在教怎麼串 orchestration 框架——LangChain 這個名字只在第二份作業的「延伸閱讀」欄位出現一次，作為 Genie Worksheets 的對照組。

## 先修收語言學課，是在講它預設誰進來

先修五選一裡有 LINGUIST 180/280，跟 CS 224N、CS 224S、CS 224U 並列。這不是掛著好看。CS 224S 是語音、CS 224U 是自然語言理解、LINGUIST 180 是 Stanford 的對話與語言技術課。五個入口全部落在**語言**這一側，沒有任何一個是機器學習系統課或最佳化課。

換句話說，這門課預設你帶進來的是「處理語言的經驗」，不是「訓練模型的經驗」。這跟課程結構一致。十四堂公開講義裡，唯一一堂講模型怎麼訓練的排在整學期倒數第二週，跟多模態應用一起被歸在「Misc」。這門課不打算教你訓練模型，它假設模型是給定的，然後問你要怎麼把它接上真實的知識來源。

## 十一篇必讀，七篇出自這個實驗室

閱讀清單裡標了 `[Mandatory]` 的共十一篇。逐篇對照 OVAL 的成果，Monica Lam 掛名的有七篇：[STORM](https://github.com/stanford-oval/storm)、Co-STORM、[WikiChat](https://github.com/stanford-oval/WikiChat)、[SUQL](https://github.com/stanford-oval/suql)、SPINACH、[Genie Worksheets](https://github.com/stanford-oval/genie-worksheets)、ReactGenie。剩下四篇是 Attention、Chain-of-Thought、ColBERT、Mind2Web。

這件事怎麼看，取決於你要什麼。這些系統都有公開的程式碼與線上 demo，而且不是紙上談兵。STORM 的 repo 有三萬顆星，WikiChat 拿過 Wikimedia Foundation 的年度研究獎，SUQL 與 SPINACH 分別被 NAACL 與 EMNLP 收錄。你可以在 [wwknowledge.org](https://wwknowledge.org/) 上一次試完 STORM、WikiChat、SPINACH 與 FEC 政治獻金資料的對話介面，不用註冊。

但你拿到的是一條特定研究路線的最佳版本，不是領域全景。清單裡沒有 RLHF 之後的 agent 訓練、沒有 multi-agent 通訊協定、沒有生產環境的可觀測性。想補上「模型上線之後怎麼繼續變強」那一側，同系的 [CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)是另一條路數。

## 作業長什麼樣

只有兩份，都排在學期前四週，占分不到三成，兩人一組。[課程網站](https://web.stanford.edu/class/cs224v/)寫明它們的功能是「把所有人拉到同一條起跑線」，真正的重頭戲是專案。

**[作業一](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf)：把 deep research 做成調查報導。** 題目是俄烏戰爭的軍事戰略演變，要你在給定的骨架上補完兩個元件：一個生成調查主軸的 DSPy signature，和一份把證據合成報告的流程。RAG 檢索、網頁爬取、切塊、重排序、ACLED 衝突資料庫的查詢結果全部是給好的。它的難度不在寫程式。七個 Action Item 裡有一半要你回答「這個系統漏掉了什麼」——覆蓋缺口、來源多樣性、研究深度，然後提出三個具體改法。

**[作業二](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)：這份才是分水嶺。** 前半是跟一個投資顧問 agent 對話至少八輪，然後回答它有沒有忘記你講過的事、多常編造資訊。後半要你用 Genie Worksheets 自己寫一個叫車 agent，實作一段有分支與回圈的對話邏輯——先查可用車輛、報價、問要不要訂，不要就收集偏好再查一次。

Genie Worksheets 是這門課的核心工具，也是課程立場的體現：你不寫對話樹（那是命令式的），你宣告這個任務需要哪些欄位、什麼條件下該啟動、填滿之後執行什麼動作，剩下的 prompt 與狀態追蹤交給框架。作業講義自己把兩種寫法並排示範，並附了設計守則——欄位名稱要有語意，因為 LLM 直接讀它們。

專案占六成以上，兩人一組，第四週交提案、第五到第十週每週一交書面進度並跟 mentor 開會、第十一週海報展、最後交一份至少六頁的 ACL 格式論文加完整可執行的程式碼。講義上寫著課程專案已經產出的論文數：2023 年兩篇、2024 年五篇、2025 年六篇。

## 自學者實際拿得到什麼

**拿得到，而且比多數 Stanford 課大方：**

- **十四堂講義 PDF**，2023、2024、2025 三個年份各一套，全部在 `web.stanford.edu/class/cs224v/lectures*/` 底下，不用登入。
- **完整閱讀清單 PDF**，五十餘篇，標好哪十一篇必讀。
- **兩份作業的完整講義 PDF**，包含每個 Action Item 的規格。
- **課程用到的系統本身**：STORM、WikiChat、SUQL、Genie Worksheets 全部開源，線上 demo 也都開著。
- **專案評分規格**：報告要幾頁、要哪些章節、程式碼跑不起來會扣分，全寫在 [projects 頁](https://web.stanford.edu/class/cs224v/projects.html)。

**拿不到：**

- **上課錄影**。課程網站一句話帶過：影片在 Canvas。整門課沒有公開錄影。
- **投影片的完整版**。這是最該注意的一條，因為官網自己講了：「Posted lecture slides are missing important details to facilitate student participation. Please make sure you watch the lectures.」公開的投影片是**刻意留白**的版本，而補洞的錄影不對外。這解釋了為什麼直接讀 PDF 常常會看到只有標題、沒有內容的頁面。
- **兩份作業真的跑起來所需的憑證**。作業一的模型額度發在課程自架的 LiteLLM portal 上，講義原文是「We provide each enrolled student with free credits」；作業二要連 OVAL 的機器並用課程配發的 Azure OpenAI 金鑰。起始碼與 notebook 的下載連結也都在講義內指向課程內部路徑。
- **學生專案成果**。2025 年的 Project Gallery 掛在 `cs224v-2025-projects.genie.stanford.edu`，只認 `@stanford.edu` 的 Google 帳號登入。
- **2026 年秋季的新課綱**。截至本文寫作日，課程網站首頁仍停在 Fall 2025，schedule 與 readings 都是舊版。

## 怎麼開始

今晚就能做的一件事：打開 [11 月 10 日那堂的講義](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf)，它講的是用 SMT 滿足自然語言約束，案例是臨床試驗配對。然後挑三個你手上 RAG 系統答錯過的問題，逐一問自己：這一題錯在檢索沒撈到，還是撈到了但模型推理錯了？如果是後者，講義裡那套「把文件與條件都翻成形式述詞，交給定理證明器判定」的做法，就是這門課給的替代方案。如果三題全錯在檢索端，這門課的後半段對你幫助有限。

想先建立整條軸線的直覺，就照時間順序讀四份講義：Introduction（計算思維）→ Grounding on Free Text（WikiChat）→ SUQL（結構化加非結構化）→ Satisfying NL Constraints with SMT。這四份走完，這門課的骨架就完整了。

## 附錄：數字與查證方式

- **下次開課**：2026-2027 秋季，2026 年 9 月 22 日至 12 月 4 日，週一、週三下午 3:00–4:20，教室 CODAB80，期末考時段 2026 年 12 月 8 日上午。
- **選課人數**：2022-2023 秋季 29 人（Turing Auditorium，未標上限）；2023-2024 秋季 94 人／上限 75；2024-2025 秋季 139 人／上限 120；2025-2026 秋季 138 人／上限 120。四筆都取自 ExploreCourses 對應學年分頁的 Schedule 區塊。2026-2027 的條目目前只列出開課時段與教室（CODAB80），未顯示選課人數。
- **成績比重，官方兩份文件不一致**：課程網站首頁寫 Participation 15%、Homeworks 20%、Final Project 65%；第一堂投影片的表格寫 Participation 15%、Assignment 25%、Final Project 60%。兩份都是 Fall 2025 的官方材料，本文正文採用網站數字（Homework 占分不到三成，兩份說法都成立）。課程沒有說明哪一份為準。
- **參與分的拆法**：本地學生 5% 給到課與課堂參與，另外 10%（本地）／15%（遠距 SCPD）給每週的書面進度與 mentor 會議。
- **閱讀清單規模**：分十一個主題節，逐條計數為 54 條，其中 11 條標 `[Mandatory]`。PDF 內的編號在第四、第五節有錯亂（出現 8、7 接在 1、3、2 之後），故以條目數而非編號計。
- **Mandatory 的歸屬**：11 篇中 Monica Lam 掛名 7 篇（STORM、Co-STORM、WikiChat、SUQL、SPINACH、Genie Worksheets、ReactGenie），對照方式是逐篇比對閱讀清單的參考文獻作者欄。
- **講義引用的系統數字**（皆出自第一堂投影片，非本文獨立查證）：WikiChat 英文事實正確率 97%、支援 25 種語言；SPINACH 部署在 Wikidata 查詢論壇，1700 次對話、198 個抽樣的成功率 78%；Genie Worksheets 準確率 80%，對照組 GPT-4 function calling 為 0–10%；STORM 有 80 萬名自然使用者、寫出 140 萬篇文章。
- **11 月 12 日那堂的 NLP building blocks**：講的是 CHURRO，一個 3B 參數的歷史文獻辨識視覺語言模型，論文收錄於 [EMNLP 2025](https://aclanthology.org/2025.emnlp-main.1763/)。
- **未能確認的項目**：（1）改名的官方理由——ExploreCourses、課程網站、OVAL 網站三處都沒有任何說明；（2）2026 年秋季是否沿用 2025 年的作業與閱讀清單，新課綱尚未上線；（3）2026-2027 條目目前只列 Monica Lam 一人，助教名單尚未公布，無法判斷是否有異動。

## 參考資料

- [ExploreCourses：CS 224V（2026-2027，課名 Agentic AI）](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — 新課名、新課程描述、下次開課時段與教室的一手來源
- [ExploreCourses：CS 224V（2025-2026）](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20252026) — 舊課名與舊描述，以及 138/120 的選課人數
- [ExploreCourses：CS 224V（2024-2025）](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20242025) — 139/120 的選課人數與當年助教名單
- [ExploreCourses：CS 224V（2023-2024）](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20232024) — 第二版描述首次出現的學年，94/75
- [ExploreCourses：CS 224V（2022-2023）](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20222023) — ThingTalk 時代的第一版描述，29 人
- [CS224V 課程官網（Fall 2025）](https://web.stanford.edu/class/cs224v/) — 成績比重、旁聽規則、限額公告、「投影片刻意缺內容」那句原文
- [CS224V 課程排程與講義索引](https://web.stanford.edu/class/cs224v/schedule.html) — 十四堂講義 PDF 的公開連結與每堂主題
- [CS224V 專案規格頁](https://web.stanford.edu/class/cs224v/projects.html) — 兩人一組、海報、六頁 ACL 格式報告、程式碼提交要求
- [CS224V 閱讀清單 PDF](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf) — 十一節分區與 Mandatory 標記的來源
- [CS224V 第一堂講義：Introduction](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf) — 70% 準確率問題、計算思維、Stage 1／Stage 2 分界、課程論文產出數
- [CS224V 作業一 PDF](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf) — DRLite 留給學生自己實作的兩個元件、課程配發 API 金鑰的說明
- [CS224V 作業二 PDF](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf) — Genie Worksheets 的宣告式規格、叫車 agent 的對話流程、LangChain 的對照段落
- [CS224V 第十一堂講義：Satisfying NL Constraints Using SMT](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf) — 臨床試驗配對的形式方法案例
- [Monica Lam 個人頁](https://suif.stanford.edu/~lam/) — 授課者的身分、研究方向與 OVAL 的定位
- [Stanford OVAL 實驗室](https://oval.cs.stanford.edu/) — 課程教材對應的實驗室成果與論文時間軸
- [WWKnowledge](https://wwknowledge.org/) — STORM、WikiChat、SPINACH、FEC 資料等課程系統的公開入口
- [STORM（GitHub）](https://github.com/stanford-oval/storm) — 課程必讀論文對應的開源實作與星數
- [WikiChat（GitHub）](https://github.com/stanford-oval/WikiChat) — 七階段防幻覺流程的實作
- [SUQL（GitHub）](https://github.com/stanford-oval/suql) — 結構化加非結構化查詢語言的實作
- [Genie Worksheets（GitHub）](https://github.com/stanford-oval/genie-worksheets) — 作業二用的框架本體
- [Genie Worksheets 專案頁](https://ws.genie.stanford.edu/) — 與純 LLM、對話樹的能力對照表
- [CHURRO（EMNLP 2025）](https://aclanthology.org/2025.emnlp-main.1763/) — 11 月 12 日那堂的論文
- [STORM 線上 demo](https://storm.genie.stanford.edu/) — 不用註冊即可試用的課程系統
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
