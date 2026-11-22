# 抽取紀錄：Kim & Ko 2017，A Pedagogical Analysis of Online Coding Tutorials（SIGCSE '17）

- **書目**：Ada S. Kim、Amy J. Ko（兩人皆 The Information School, University of Washington；姓名與單位對過 PDF 首頁）。2017。A Pedagogical Analysis of Online Coding Tutorials. *SIGCSE '17: Proceedings of the 2017 ACM SIGCSE Technical Symposium on Computer Science Education*，March 8–11, 2017, Seattle, WA，頁 321–326。DOI 10.1145/3017680.3017728（首頁版權欄印的就是這個 DOI，清單填的正確）。
- **原文檔**：`.research/raw/learning-content/q1-learner/kimko2017.pdf`（6 頁）。原有的 `kimko2017.txt`（387 行、46,051 位元組）是 `pdftotext -layout` 的雙欄版，左右欄交錯，沒有拿來讀。我另用不帶 `-layout` 的 `pdftotext` 重轉，存成同目錄 `kimko2017_nolayout.txt`（742 行、36,063 位元組），下面的行號（L）都是這個檔的行號；同時用 Read 把 PDF 六頁逐頁讀過一次，頁碼（p.）是論文印的頁碼。
- **讀取日期**：2026-10-14
- **版本**：作者個人頁上的作者稿，版面是 ACM 刊出版格式，頁尾印「Most up-to-date version: 06/25/2021」。也就是說這份 PDF 在 2021 年被作者更新過，與 ACM DL 上 2017 年的刊出版是否逐字相同，**沒有核對**。
- **供哪篇使用**：order 12（先備知識）

## 研究設計

- **類型**：對現成線上程式教學做的內容分析（作者自稱 analytical approach）。沒有學習者、沒有學習成果測量、沒有對照組。L89–100、p.321。
- **樣本怎麼選**（2.1 節，L106–195、p.321–322）：
  1. 用 Google 搜「online coding tutorial」「coding tutorial」兩個詞，看前 10 頁結果裡還在運作的教學網站；關掉個人化搜尋；排除只是彙整別站內容的網站（L108–114）。
  2. 2016 年 7 月 29 日查 Alexa 全球排名，收排名在 100,000 以內的（原文「ranked below 100,000」，L128–143）。
  3. 另外補進「教育現場常用」但 Alexa 排名很後面的：Scratch（4,397,390）、Alice（212,300）、Lightbot（214,897），理由是要跨類型比較（L156–162）。
  4. 一個網站教多種語言時，只看六種熱門語言（Java、Python、PHP、JavaScript、C#、C）的課；熱門與否是對 GitHub、Stack Overflow 標籤排名、TIOBE、PYPL 四個來源取交集（L177–186）。
  - 原文沒有寫：搜尋結果一共看了幾個網站、每一步篩掉幾個。
- **樣本**：30 個教學，分五類（L195–247；各類個數原文沒寫，是我照 Table 1 的分隔線數的）：互動式教學 7、網頁參考資料 10、MOOC 4、教育遊戲 7、創作平台 2。
- **評什麼**（2.2 節，L269–216）：四條教學原則（連結先備知識、組織陳述性知識、練習與回饋、鼓勵後設認知學習），原則取自 *How People Learn*〔文獻 3〕；作者自己再展開成 9 組共 24 個面向。協作學習相關的原則刻意排除。除了一個面向（4.a 由下而上／由上而下）以外，全部壓成是／否二元判斷，依一句書面判準。原文只舉了「utilization」那一條判準的文字當例子（L171–175），**其餘 23 條判準的文字論文裡沒有**。
- **怎麼評**（L208–216）：「We analyzed at least one module of each tutorial and in some cases analyzed an entire tutorial. It took approximately 2 hours per tutorial to check all criteria for dimensions and 60 hours overall.」每個教學至少看一個模組，不是全部看完。
- **誰評**：只有第一作者一個人評全部 30 個，沒有第二位編碼者、沒有信度數字（見限制）。
- **何時**：Alexa 排名查於 2016-07-29；實際逐一評分的日期原文沒寫。

## 結果（逐項）

所有數字都是「30 個教學裡有幾個符合某個二元判準」，沒有推論統計。「我數的」表示數字是我對著 PDF p.323 的 Table 1（300–400 dpi 轉圖後逐列看）數出來的，原文正文沒有寫這個數。

### 3.1 連結先備知識（L256–309、L329–339、L288–293；p.322–323）

| # | 結果 | 數字 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 依年齡建議教材 | 3／30：Code.org、Lightbot、Scratch | 3.1／Table 1.1.a | L302–304，p.323 | 「Only Code.org, Lightbot, and Scratch explicitly indicated appropriate learners' age range for tutorial selection.」Table 1 的 a 欄也正好是這三個。 |
| 2 | 考慮學習者教育程度 | 14／30，而且作者說很表面 | 3.1／Table 1.1.b | L304–307 | 「Fourteen out of 30 tutorials considered learners' education status, but it was rather superficial such as vaguely separating beginner, intermediate, and advanced levels to indicate difficulty.」Table 1 的 b 欄我數到 14 個，與正文相符。 |
| 3 | 依先前程式經驗建議特定階段或模組 | 正文：0／30 | 3.1 | L307–309 | 「None of the tutorials recommended specific stages or modules, based on learners' prior coding experience.」 |
| 3′ | **同一面向在 Table 1 的 1.c 欄（Coding experiences）卻有勾** | 我數到 14／30 有勾：Codecademy Python、Khan Academy、Funprogramming、TutorialsPoint Python、Codingunit C tutorial、Wired.com Javascript、Lynda.com、Code.org、LightBot、CodeHunt、Code Avengers、Grok Learning、Scratch、Alice | Table 1.1.c | p.323 | 表頭說明是「Each check mark represents satisfaction of a pedagogical principle.」正文沒有解釋 1.c 欄的勾代表什麼，也沒有給這一欄的判準文字。**正文的「None」與表的 1.c 欄對不起來**，見下面「不一致」一節。 |
| 4 | 後面的階段要用到前面教的東西（utilization） | 全部 7 個教育遊戲都符合；互動式教學「a few」（舉 Code School、Codingbat Python）；MOOC 舉 Coursera、edX；網頁參考資料只有 FunProgramming.org 一個 | 3.1／Table 1.2 | L334–339、L288–291 | 「All educational games required learners to apply knowledge from stage to subsequent stages」「Only one web reference tutorial, FunProgramming.org, had the similar form of structure.」Table 1 的第 2 欄我數到 15／30（互動式 4、網頁參考 1、MOOC 3、遊戲 7、創作平台 0）。 |
| 5 | 模組結尾的總覽關卡要用到前面階段的知識 | 3 個：Codecademy、Khan Academy、Code Avengers | 3.1 | L291–293 | 「Only Codecademy, Khan Academy, and Code Avengers (codeavengers.com) required knowledge from previous stages to pass the overview stage at the end of the module.」（這一項不是 Table 1 的欄位） |

### 3.2 組織陳述性知識（L311–327、L344–353、L381–396、L413–440、L465–467；p.323–324）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 6 | 教的內容幾乎一樣 | 以 FCS1 評量的八個學習目標對照；五類都教全八項，例外是專教特定抽象的 Regex 101、Regex Golf；多數教育遊戲不教（或不明講）物件 | L319–327 | 「All five genres of tutorials taught all eight learning objectives except a few tutorials that focused on specific abstractions (namely Regex 101 and Regex Golf). Most of the educational games did not teach, or at least not explicitly, the concept of objects or object-orientation.」**這句說得比表寬**：Table 1 第 3 組裡 CodeSchool、Codingbat、Online Python Tutor、Funprogramming、Cprogramming、Codingunit、Wired、Pythonprogramming 等也都缺項，Stack Overflow 整列是 N/A。 |
| 7 | 由下而上還是由上而下 | 網頁參考資料與互動式教學多由下而上；教育遊戲、MOOC、創作平台兩者混用或偏由上而下 | L381–396 | 「web references and interactive tutorials organized content bottom-up, starting with the most elementary concepts」「educational games, MOOCs, and creative platforms combined both bottom-up and top-down approach or mainly used top-down approach」Table 1.4.a 我數到：由下而上 17、both 6、top-down 7。 |
| 8 | 階層式結構 | 全部遊戲都有；高流量的 MOOC 與互動式教學（Codecademy、Khan Academy）也有 | L413–420 | 「All games structured information hierarchically」Table 1.4.b 我數到 16／30。 |
| 9 | 以專案／目標為脈絡 | 「只有少數」，主要是教育遊戲與創作平台 | L431–433 | 「Only a few tutorials, primarily educational games and creative platforms, offered project-based contexts that provided an explicit goal of a stage or a module.」 |
| 10 | 網頁參考資料沒有學習脈絡 | 多數網頁參考資料三種脈絡（講授、目標、故事）都沒有 | L465–467 | 「Most of the web references did not establish a specific learning context for what they taught」Table 1.5 三欄裡 10 個網頁參考資料全部空白。 |

### 3.3 練習與回饋（L342–379、L398–411、L442–448；p.324）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 11 | 要求學習者實際寫程式 | 各類都有互動編輯器，例外是少數只給唯讀資訊的網頁參考資料 | L368–371 | 「all genres of tutorials offered some kind of interactive editor requiring learners to provide input, with the exception of a few web references that provided read-only information.」Table 1.6 我數到 22／30（網頁參考 10 個裡 4 個有、MOOC 4 個裡 2 個有）。「少數例外」這個說法比表寬。 |
| 12 | 即時回饋 | 有程式編輯器的互動式教學與教育遊戲全都有某種即時回饋，但多半很淺 | L402–404 | 「All interactive tutorials and educational games with a code editor provided some form of immediate feedback, but much of these was shallow.」 |
| 13 | 出錯時不給回饋 | 「almost half」的教學在學習者出錯時不給回饋；分兩種情況（開放式練習不判對錯，如 Scratch；編輯器不解釋錯誤訊息，多為網頁參考資料） | L404–411 | 「almost half of the tutorials did not provide feedback when learners made errors.」**沒有給確切個數**，Table 1 也沒有這一欄。 |
| 14 | 講師／同儕回饋 | 有，但都不是即時的，也不保證有人回 | L442–448 | 「While this feedback was available, none of it was immediate and learners had no guarantee of receiving answers to their questions.」 |

### 3.4 鼓勵後設認知學習（L450–463、L476–496；p.324–325）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 15 | 講「什麼時候用、為什麼用」 | 5／30，分布在網頁參考資料、教育遊戲、MOOC 三類 | L463、L476–478 | 「Only five tutorials across three genres, web references, educational games, and MOOCs attempted to explain when and why learners should use a particular command or a function.」Table 1.8 我數到：b「When to use」5 個（Funprogramming、Codingunit、Stack Overflow、Lynda、CodeCombat），c「Why to use」3 個（Stack Overflow、Lynda、Grok Learning）；兩欄至少一個有勾的是 6 個，兩欄都有的只有 2 個。正文的「five」對得上 b 欄，對不上「when and why」。 |
| 16 | 課外補充資源 | 幾乎各類都有 | L483–485 | 「Almost all genres of tutorials provided some form of additional support」Table 1.9 我數到 23／30。 |
| 17 | 顯示學習者表現排名 | 4 個 | L485–487 | 「Four tutorials attempted to indicate where a learner's performance was ranked and how high it was」（不是 Table 1 的欄位，沒列是哪四個） |
| 18 | 主動幫學習者認出錯誤 | 5 個（例 Gidget） | L491–492 | 「Five tutorials proactively helped learners recognize errors in their actions.」（不是 Table 1 的欄位） |

### 3.5 推薦與 4 討論（L519–533、L553–573、L596–606、L471–474、L498–517；p.325）

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 19 | 作者推薦教育遊戲與互動式教學，點名 Gidget、Lightbot、Code Hunt、Code.org | L530–533 | 「we recommend games such as Gidget, Lightbot, Code Hunt, and tutorials provided by Code.org as the tutorials most likely to be effective at producing learning.」注意：Gidget 是第二作者 Ko 實驗室的作品（文獻 19、20 皆 Lee & Ko），原文沒有揭露這層關係是利益衝突；「most likely to be effective」是從原則推出來的，沒有量學習成果。 |
| 20 | 七條趨勢的最後一條 | L572–573 | 「None provide personalization based on prior coding experience or learner goals, other than rudimentary age-based differentiation.」這裡多了「learner goals」，但 24 個面向裡沒有任何一欄評「學習者目標」。 |
| 21 | 沒有系統化的解題教學 | L501–504 | 「none of the tutorials provided a detailed and systemized problem solving instruction other than one- or two-sentence hints when learners made errors in each stage.」 |
| 22 | 回饋沒有依先備知識調整 | L513–517 | 「while tutorial feedback was immediate, it was rarely precise enough to improve learners' conceptions of the material, and it was not customized at all to learners' prior knowledge.」 |
| 23 | 多數教學沒有人或代理人給個人化回饋 | L511–513 | 「most of the tutorials did not provide access to any sort of agent or instructor to give personalized feedback to guide deliberate practice.」 |

## 作者自己列的限制（第 5 節，L535–551、L575–580；p.325）

1. 樣本多元但不見得代表全世界在用的教學，尤其是非英語的。
2. Google 與 Alexa 只能反映每天多少人造訪，不反映學習者實際進度。
3. 線上教學一直在改版。
4. 多數判準是二元判斷，實際上細微差別多得多。
5. 「The first author was also the only one who assessed all of the tutorials, and so there may have been systematic bias in her evaluations that was not eliminated through redundant coding.」（L548–551）
6. 沒有量學習成果：「It may be possible that many of the tutorials are effective despite failing to satisfy many of the learning principles we identified in prior work」（L577–580）。

作者沒有列、但從方法看得出來的：每個教學只保證看了一個模組；搜尋詞是英文的兩個詞；判準文字除一條外未公開。

## 與摘要說法不一致的地方

1. **摘要說「few」，正文與討論說「None」**。摘要：「few were tailored to learners' prior coding knowledge」（L42–43）；3.1 節：「None of the tutorials recommended specific stages or modules, based on learners' prior coding experience」（L307–309）；討論：「None provide personalization based on prior coding experience or learner goals」（L572）。
2. **正文的「None」與 Table 1 的 1.c 欄不一致**。1.c 欄（Coding experiences）我數到 14 個教學有勾。可能的解釋（都是我的推測，原文沒說）：1.c 的二元判準比正文那句話寬（例如只要標示「需要／不需要程式經驗」就算），而正文那句講的是更嚴的「依經驗推薦特定階段或模組」；或者 2021 年更新時改了表沒改字。從這份 PDF 無法判斷哪個對。
3. 摘要說教學「provided goal-directed practices with immediate feedback」，正文同時說近半數出錯時不給回饋、回饋「shallow」（L402–405）。摘要沒帶這個但書。
4. 摘要說「only a few informed learners how to transfer and apply learned knowledge」，正文數字是 5／30（L463、L476），但這個 5 與 Table 1.8 的 b、c 兩欄怎麼對應不清楚（見結果 15）。

## 與清單「要撐的結論」不合的地方

清單寫的是：「30 個熱門線上程式教學沒有一個依程式經驗建議起點；現成教學怎麼處理（或不處理）先備差異」。

- 「沒有一個」有原文字面依據（L307–309），但**要改寫，不能照用**，理由四個：
  1. 同一篇的摘要寫的是「few」，Table 1 的對應欄有 14 個勾，三處互相對不起來。引用時最多只能說「作者在正文裡說沒有一個教學依先前程式經驗推薦特定階段或模組；同文的表在『程式經驗』一欄卻有近半數打勾，作者沒有解釋」。
  2. 原文說的是「recommended specific stages or modules」（推薦特定階段或模組），清單寫成「建議起點」是轉述，意思接近但不是原話。
  3. 這是一位評分者、每個教學至少看一個模組、2016 年 7 月的快照；30 個是英文 Google 搜尋加 Alexa 排名再加手動補進 3 個選出來的，不是隨機樣本。「熱門」成立，「代表現成教學」不成立。
  4. 14／30 的教學有分初階／中階／進階（結果 2），所以「現成教學不處理先備差異」說得太滿；原文的說法是有分級但很表面。
- 這篇沒有任何學習成果資料，不能拿來說「不依先備知識分流會學得比較差」。作者自己在限制裡講了（限制 6）。

## 讀取紀錄

- `kimko2017_nolayout.txt` L1–742 一次從頭讀到尾（L1–127 首頁與前言、L128–247 方法、L249–533 結果、L535–611 限制／討論／結論、L613–742 致謝與參考文獻；非 layout 版的段落順序在跨欄處會前後跳，例如 4 討論的條列排在 5 限制之後，已對照 PDF 頁面確認原順序）。
- PDF p.321–326 用 Read 逐頁讀過，確認正文順序與上面一致。
- **Table 1 對過 PDF 版面**：p.323 用 `pdftoppm` 轉成 300 dpi 與 400 dpi 的圖，分上半、下半、左半、右半四張看。1.a、1.b、1.c、2、4.a、4.b、6、7.a、7.b、8.b、8.c、9 各欄的勾數是我逐列數的；勾是小圖示，欄位很窄，**個別格子可能看錯一兩個**，1.c 欄「有十來個勾、絕不是零」這件事可以確定。文字版 `pdftotext` 抽不出這張表（表是圖），所以表沒有行號。
