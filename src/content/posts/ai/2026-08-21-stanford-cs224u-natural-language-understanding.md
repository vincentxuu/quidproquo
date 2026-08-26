---
title: "Stanford CS224U 導讀：課程網站停在 2023 年春季，但整套教材可以 clone 下來跑"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224u, ai-course, stanford, nlp, evaluation, dspy]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 13
tldr: "CS224U 的教材不是投影片，是一個 Apache-2.0 的 GitHub repo，講義、作業、評分文件全在裡面。但校內班從 2023 年春季之後連停三個學年，ExploreCourses 把它排回 2026-27 春季；官方課程描述至今仍列著 relation extraction 與 semantic parsing，2023 年的講次表一堂都沒有。第一份作業的資料載入 cell 在今天的新環境會卡在 Hugging Face 的相容性改動上。"
description: "Stanford CS224U: Natural Language Understanding 完整導讀，從課程官網、GitHub repo、投影片 PDF 與 ExploreCourses 原始資料查起：它跟 CS224N 的分工、三份作業的實際內容與門檻、期末專案評分文件要求什麼，以及自學者今天實際拿得到、跑得動哪些東西。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)

[CS224U: Natural Language Understanding](https://web.stanford.edu/class/cs224u/) 是 Stanford 的專案導向 NLP 課程，跨掛在語言學系與 Symbolic Systems 學程底下，授課者是語言學教授 [Christopher Potts](https://web.stanford.edu/~cgpotts/)。官方先修只有一條：CS224N 或 CS224S 擇一。

這門課在自學圈的名氣，多半不是來自錄影，是來自它的 [GitHub repo](https://github.com/cgpotts/cs224u/)。整學期的講義 notebook、三份作業、模型程式碼、甚至那份講「期末專案怎麼做」的長文件，全部在 repo 裡，Apache 2.0 授權，`git clone` 就有。這在 Stanford 的 AI 課裡是少數——大部分課的作業起始碼鎖在 Canvas 或 Gradescope 後面。

這篇要回答的是「進去之後會發生什麼事」。它跟 CS224N 到底怎麼分工、三份作業各要你做什麼、期末專案那份評分文件寫死了哪些要求，以及**今天** clone 下來還跑不跑得動。

**不包含**逐篇論文精讀，也不包含 XCS224U 這個付費線上版的課內材料——那些在登入牆後面，我沒有存取權。（2026-08-26 更新：Stanford Online 頁面已標明此課程自 2025 年 5 月 19 日起停止提供，YouTube 上的 Spring 2023 免費錄影成為唯一公開的授課紀錄。）

## 這門課的硬事實

先講最容易誤判的一件事：**課程網站現在停在 2023 年春季。** 打開來，標題就是「Spring 2023」，教學團隊、講次表、繳交期限全是那學期的。`cs224u.stanford.edu` 也只是轉到同一頁。

Stanford 的封存區裡，這門課只有[一份存檔](https://web.stanford.edu/class/archive/cs/cs224u/cs224u.1236/)，對應的正是那個學期；其後每一年的封存網址都是 404。

ExploreCourses 的公開資料指向同一件事。用它的 XML 介面逐學年查 CS 224U，會看到課程條目一直都在，但**連續三個學年的 `sections` 是空的**——掛在目錄上，沒有開班。要到 2026-27 學年才又排出一節春季課，講師欄位目前空白。

Potts 自己的[授課紀錄頁](https://web.stanford.edu/~cgpotts/teaching.html)給出同一個答案。他最後一次列出校內版的 CS 224u，是在 2022-23 學年。之後每一年，這門課在他的清單上都只剩線上的 XCS 224u——Stanford Center for Professional Development 開的那個版本。

其餘硬事實：3 到 4 學分，Letter 或 Credit/No Credit 皆可。課程頁開宗明義寫著這門課可以全線上、非同步修完，[第一堂投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf)也寫每一堂都會錄影、不強制出席。但那是給選課學生的，錄影在 Canvas 與 Panopto 後面。

官方頁面完全沒有提校外旁聽。唯一的付費入口是 [XCS224U](https://online.stanford.edu/courses/xcs224u-natural-language-understanding)，最近一梯在 2025 年春天——而 Stanford Online 已於 2025 年 5 月 19 日將這門課整個下架（2026-08-26 重查確認），付費入口也消失了。

## 官方課程描述講的是另一門課

ExploreCourses 上 CS 224U 的[課程描述](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog)（2026-27 學年版本，一字不差）列出的主題是：

> Topics include lexical semantics, distributed representations of meaning, relation extraction, semantic parsing, sentiment analysis, and dialogue agents

拿這串去對 2023 年的講次表，會發現對不上。那學期的單元標題只有五個：Domain adaptation for supervised sentiment、Retrieval augmented in-context learning、Advanced behavioral evaluation、Analysis methods、NLP methods，最後接一段做專案的時間。relation extraction 沒有，semantic parsing 沒有，dialogue agents 沒有。

那串主題不是憑空來的。翻到[同一個網域下的 2019 年課程網站](https://web.stanford.edu/class/cs224u/2019/)，講次表上白紙黑字寫著這些：distributed word representations、supervised sentiment analysis、relation extraction with distant supervision、NLI models、grounded language understanding、semantic parsing、contextual word representations。

**課程描述描述的是四年前的那門課**，而它現在還掛在 2026-27 學年的目錄上。

這件事對照著課表排計畫的人特別要注意：**課程描述欄位不會隨講次表更新**。要知道一門 Stanford 課實際教什麼，去看它的課程網站講次表，不要看目錄。

## 它接在 CS224N 後面補了什麼

課程描述沒說的，Potts 自己在第一堂的投影片裡說了：

> CS224n is a prerequisite for this course, so we are going to skip a lot of the fundamentals we have covered in past years.

這句話在 repo 裡留下了實體痕跡。[README](https://github.com/cgpotts/cs224u/) 逐個目錄標註用途，其中一整批被標成 `This is now considered background material for the course`：`vsm_*`（向量空間模型、PMI、LSA、GloVe）、`sst_*`（Stanford Sentiment Treebank 上的監督式學習）、`finetuning.ipynb`、以及純 NumPy 實作的 `np_*.py`。

這些東西**曾經是這門課的核心**。2019 年的講次表第二講就是 distributed word representations，現在它被降級成「你如果需要複習再看」。

被砍掉的空間換來的是 2023 年的五個單元。用課程自己的[背景材料頁](https://web.stanford.edu/class/cs224u/background.html)當分界線最清楚：那一頁上全部是 CS224N 已經教過、CS224U 不再花時間的東西。

有意思的是反方向也在動。[CS224N 現在的課程網站](https://web.stanford.edu/class/cs224n/)由 Diyi Yang 與 Yejin Choi 授課，講次表上有一堂叫「Agents, Tool Use, and RAG」，還有一堂叫「Benchmarking and Evaluation」。正好是 CS224U 那五個單元裡的兩個方向。

**這兩件事只是同時成立。** 官方頁面沒有把它們連起來，也沒有任何一頁解釋 CS224U 為什麼停開三年。我查到的只有現象：一門課的網站停在 2023 年，同一時期它的先修課擴充了主題範圍。成因是什麼，頁面上沒寫。

## 這門課最反直覺的一堂：0 分藏在 83% 底下

如果只挑一堂公開材料來讀，我會選 [advanced behavioral evaluation](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) 那份投影片。它做的事是把「這個模型在 benchmark 上拿幾分」這個問題整個拆掉。

課堂上放了一張 COGS 的成績表。COGS 是給模型看英文句子、要它輸出邏輯形式的組合性泛化測試，泛化題分成 lexical（換詞）與 structural（換結構）兩類。表上一排模型的 overall 分數看起來就是個一般的排行榜，有高有低。

但把 structural 那幾欄拆開來看，`Obj PP → Subj PP` 和 `CP Recursion` 兩欄，**幾乎每個模型都是 0**，包括 overall 分數排在前段的 T5。lexical 那欄則多數在九成以上。一個平均分數，把「完全做得到」和「完全做不到」平均成了「大致做得到」。

課程接著講 Potts 自己實驗室的後續研究 [ReCOGS](https://arxiv.org/abs/2303.13716)（arXiv:2303.13716）。這篇的立場更反直覺：那些 0 分，有相當一部分不是模型不懂語意，是被邏輯形式的**書寫慣例**卡住的。COGS 的變數編號按詞在句子裡的線性位置決定，另外還有一批可以直接刪掉的冗餘 token。

投影片把它明確標成一個假設（Hypothesis）加一個結果（Result）。假設是：訓練資料教會了模型「介系詞片語只會出現在特定的變數與位置上」。結果是：把那些慣例改掉之後，LSTM 與 Transformer 的分數都大幅上升。改完之後這個任務仍然不簡單——課程用的措辭是 ReCOGS remains challenging。

**這一堂給的尺是可以直接拿去用的**：下次看到一個 benchmark 的總分，先問它底下有沒有一整欄是 0，以及有多少分數其實是在量測輸出格式而不是能力。這門課用一份自家論文示範了怎麼把後者拆出來。

## 作業長什麼樣

三份，每份都是「作業 + bake-off」的組合：作業本身占大部分分數，把你的原創系統丟進全班競賽再拿一分。**每份作業裡權重最高的一題都是「Your original system」**，而評分規則寫得很硬。

[政策頁](https://web.stanford.edu/class/cs224u/requirements.html)寫著，很有創意、動機清楚的系統就算在 bake-off 資料上表現不好，一樣給滿分（原文用的字是 given full credit even if they do not perform well）。反過來也寫死了：下載別人的程式碼、重訓、送出，就算 bake-off 分數很漂亮也不給分。這條在政策頁和第一堂投影片上各出現一次，是這門課少數重複強調的規則。

逐份看（notebook 都在 repo 根目錄）：

**[hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb)：多領域情感分析。** 資料是 DynaSent 兩輪加 SST。Question 1 是 scikit-learn 的特徵函式與線性分類器，Question 2 才進 Transformer 微調（tokenize、取上下文表徵、寫 fine-tuning module）。純 CPU 可以做完 Question 1。

**[hw_openqa.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb)：用 [DSPy](https://dspy.ai) 做少樣本 OpenQA。這份是分水嶺。** 它同時要你準備三樣東西：OpenAI API key、ColBERTv2 的預訓練權重、以及一份預先建好的 ColBERT 索引（課程網站上那份索引是 600 MB 的壓縮檔）。notebook 自己把話講白了——這種規模的模型，你要嘛付 API 的錢，要嘛付叢集的錢，要嘛用比較小的機器付時間。另外兩份作業沒有一項要你掏錢，這一份有。

**[hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb)：組合性泛化。** 對應上一節那堂課。開頭只是寫一個比對函式，找出模型難處理的專有名詞；中段切回 DSPy 做 in-context learning。

原創系統那題在這份裡給了四條路：寫一支 DSPy 程式、繼續訓練課程提供的模型、拿一個預訓練模型來改、或是從頭訓一個 seq2seq。

## 期末專案：那份評分文件到底要什麼

專案占成績的一半，拆成文獻回顧、實驗計畫、期末論文三段交件。要求寫在 repo 裡的 [projects.md](https://github.com/cgpotts/cs224u/blob/main/projects.md)——這份文件將近四萬字元，本身就是一篇「怎麼在 NLP 領域做一個研究專案」的教學。

裡面最該被引用的是這句：

> We will never evaluate a project based on how "good" the results are.

文件接著給了實際的三條軸：指標選得恰不恰當、方法夠不夠紮實、以及**論文對自身發現的極限講得夠不夠清楚**。它給的理由是，發表管道因為版面有限才偏好正面結果，課程沒有這個限制，所以正面結果、負面結果、以及中間的一切都同等看待。

其他寫死的硬規定：

- **文獻回顧的篇數依組員人數遞增**，一人 5 篇、兩人 7 篇、三人 9 篇。回顧的對象不限 NLP 論文，書、夠好的部落格文章、政府報告都可以。
- 三份交件全部用 ACL 格式，期末論文**強制**使用指定模板。
- 期末論文有兩節是這門課特有的：`Known project limitations`（設想一個善意的實務工作者要拿你的資料或模型去用，他該知道什麼）與 `Authorship statement`（就算只有一位作者也要寫，因為課程要知道這個專案有沒有校外合作者）。
- 實驗計畫**不是預先註冊**，文件明講計畫改變很正常，但改了要跟指導的助教談。
- 跟別堂課的期末專案太像會被當掉，而且是「兩邊都交上來給我們判斷」的處理方式。

文件末尾列了一批從 CS224u 專案長成正式發表的論文，但 Potts 在那份清單下面自己補了一段但書：這些論文在被接受之前都經過大幅修改，而且它們在當初交出來的時候就已經超出課程的期待，所以**不是課程期末的標準**。這段但書在二手介紹裡幾乎沒人提，但它才是那份清單的正確讀法。

## 自學者實際拿得到什麼

逐項講，拿得到與拿不到分開：

**拿得到：整個 [repo](https://github.com/cgpotts/cs224u/)。** Apache 2.0 加 CC BY-SA 4.0，兩千多顆星。三份作業 notebook、全部講義 notebook、模型程式碼、`test/` 目錄下的 pytest、以及 projects.md。

**拿得到：投影片 PDF。** 課程網站 `slides/` 目錄下的 handout 全部公開直連，包括上面引用的那兩份。

**拿得到：全套錄影，但不是校內班的。** Stanford Online 在 YouTube 上放了 [XCS224U Spring 2023 的完整播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)，五十支，是切成小段的螢幕錄影（Contextual Word Representations 就拆成十段）。這是線上版的教材，不是教室錄影，所以沒有現場問答。

**拿得到：[podcast](https://web.stanford.edu/class/cs224u/podcast/index.html)。** Potts 訪談的十幾集，Douwe Kiela、Omar Khattab、Percy Liang、Sam Bowman 都在裡面。最後一集是 2023 年 2 月。

**拿不到：教室錄影、Canvas 上的 quiz、往年的優秀期末論文範例。** 課程頁面明講範例論文「link restricted to enrolled students」。

**拿不到：XCS224U 的課內材料與助教。** 那是付費的，而且 2026-08-26 重查時 Stanford Online 頁面已明寫「as of May 19, 2025, this course is no longer available」——連付費這條路也關了。

**要注意：repo 現在是別人在維護，而且第一份作業照原樣跑不起來。** 最近一批 commit 集中在 2025 年初，作者是 XCS224U 線上梯次的助教，訊息寫著更新 torch 版本、更新 openai 套件。三份作業 notebook 內嵌的版本字串也對不上課程網站，最新的一份標的是 Fall 2024（逐份對照見附錄）。

真正會擋住你的是 `hw_sentiment.ipynb` 的資料載入。它呼叫 `load_dataset("dynabench/dynasent", ..., trust_remote_code=True)`，但 [Hugging Face `datasets` 4.0.0 的 release note](https://github.com/huggingface/datasets/releases/tag/4.0.0) 寫著 `trust_remote_code` is no longer supported；而 `dynabench/dynasent` 在 Hub 上只有一支 2021 年的 Python 載入腳本，沒有 parquet 版本——[HF 的 API](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) 直接回「the dataset viewer doesn't support this dataset because it runs arbitrary Python code」。repo 的 `requirements.txt` 沒有把 `datasets` 釘住版本，所以新裝的環境會拿到最新版。我沒有實際跑過，但這三個公開事實指向同一個結論：**要動這份作業，你得自己把 datasets 降版，或自己去把 DynaSent 轉成 parquet。**

`requirements.txt` 裡另一個值得知道的是 `dspy-ai==2.4.13`，旁邊的註解寫著 pin down dspy-ai during the cohort。它釘死了，所以裝得起來——但 DSPy 現在的主版本已經走到 3.x，notebook 裡 `dspy.OpenAI(...)` 這種寫法在新版已經不是那樣用了。**你學得到 DSPy 的思路，但學不到 DSPy 現在的 API。**

## 怎麼開始

今晚可以做完的一件事：

```bash
git clone https://github.com/cgpotts/cs224u.git
cd cs224u
```

不要先碰 `hw_sentiment.ipynb`（上一節那個坑）。打開 `projects.md`，直接跳到 `Experiment protocol` 那一節，把底下六個小標抄下來——Hypotheses、Datasets、Metrics、Models、General reasoning、Summary of progress so far——然後拿你手上正在做的任何一件事（工作上的模型、side project、想寫的部落格文章）逐項填一遍。

`Hypotheses` 那一節專門處理一種情況：你其實沒有假設，你只是想看看某個新模型在某個任務上表現如何。文件的回應是要你把它逼成一個精確的假設，例如指認新模型裡的某個元件、主張那個元件是關鍵——因為這樣才決定得了要拿什麼去對照（有那個元件的、跟只差那個元件的）。

填不出 `Models` 那一格的基準線是什麼，就是你今晚真正的收穫。

## 附錄：數字與查證方式

- **停開的三個學年**：用 ExploreCourses 的公開 XML 介面（`https://explorecourses.stanford.edu/search?view=xml-20200810&academicYear=<學年>&q=Natural+Language+Understanding&filter-departmentcode-CS=on`）逐年查，CS 224U 在 20232024、20242025、20252026 三個學年的條目都存在但 `<sections>` 為空；20222023 有一節 2022-2023 Spring，20262027 有 2026-2027 Spring 的講座與討論各一節，classId 25499 與 25500，講師欄位空白。**ExploreCourses 的 HTML 版本我沒能取得**——用 curl 或 scraping 工具打它的 `view=catalog` 頁面只會拿到「Please login to view this page」，所以「Last offered」那一行我沒有讀到原文，上述判斷是根據同一套資料的 XML 輸出加上 Potts 授課頁的交叉比對。
- **作業 notebook 的版本字串**：`hw_sentiment.ipynb` 標 `CS224u, Stanford, Spring 2023`、`hw_recogs.ipynb` 標 Spring 2024、`hw_openqa.ipynb` 標 Fall 2024。課程網站則停在 Spring 2023。
- **COGS 那張表**：九列模型，overall 落在 48 到 88 之間，本文提到的 T5 是 83。structural 三欄裡 `Obj PP → Subj PP` 九列全部為 0，`CP Recursion` 只有兩列非 0，`PP Recursion` 有四列非 0；lexical 欄有六列在 90 以上。
- **repo 狀態**（GitHub API，2026-08-21 查）：2,192 star、911 fork、3 個開啟中的 issue，最後一次 push 是 2025-02-28，`archived` 為 false。最舊的開啟中 issue 是 2023 年 8 月的 #127，回報 `hw_sentiment.ipynb` 第一個 cell 失敗（`charset_normalizer` 相關），Potts 當天回覆過，至今未關。repo 內沒有 `.github/workflows` 目錄，README 上的 CI badge 在 2025-02-27 一個標題為 remove failed badge 的 commit 中被移除。
- **成績配比**：quiz 15%、作業與 bake-off 35%、文獻回顧 10%、實驗計畫 10%、期末論文 30%。政策頁另有一張不做常態分配的分數對照表（≥94 為 A，≥90 為 A−，<60 不通過），以及每人 4 天免費遲交額度——但期末論文任何情況都不接受遲交。
- **COGS 那張表的對照條件**：投影片標註該表轉引自 ReCOGS（Wu, Manning & Potts 2023）。表上三列另標了「結果引自 Yao and Koller (2022)」，最高分那一列標了「該模型使用預訓練權重，並以泛化集抽樣做過超參數調整」。
- **作業配分**：三份作業都是 9 + 1（bake-off 參賽 1 分），原創系統那題在三份裡都是 3 分。bake-off 榜首另有 0.5 分加分，遲交的參賽項目可以收但拿不到加分。
- **檔案大小**：ColBERTv2 checkpoint 約 406 MB、課程的預建索引約 600 MB，兩個連結在 2026-08-21 都還可下載（HTTP 200）。
- **未能確認的項目**：(1) 2026-27 春季由誰授課——ExploreCourses 講師欄位是空的（2026-08-26 重查仍空白；對照同季的 CS224N 與 CS336 講師都已填上，確認是未指派而非資料缺欄），Potts 的授課頁最新只寫到 2024-25，GitHub repo 也沒有任何新學期準備的跡象。間接線索偏向 Potts 回鍋：他的 Linguistics 系主任任期到 2025 年 8 月屆滿，Amazon Scholar 的兼任也在 2024 年 12 月結束——卸任後隔一個學年，課就排回來了。但不能寫死。(2) 停開三年的原因——沒有任何官方頁面說明，但背景拼圖在 2026-08-26 補齊了大半：個人層面，系主任任期（2020-09 至 2025-08）與 Amazon Scholar 兼任（2022-10 至 2024-12）正好覆蓋停開的兩年，且他 2025 年 1 月起共同創辦 AI agent 監控新創 [Bigspin AI](https://bigspin.ai) 任 Chief Scientist，2025–26 年的公開活動全是外部演講與 webinar、零教學紀錄——「重心移轉」證據很強，「不回鍋」則只是推測。校級層面，XCS224U 的下架也不是孤立事件：Stanford 因預算砍 $140M 並裁員，[2026 年 1 月直接裁撤了數位教育副教務長辦公室](https://stanforddaily.com/2026/01/18/stanford-digital-education-shuts-doors/)（Stanford Daily 報導），付費自學課程線批量 sunset——收的是低量產品線，同期 XCS224N 等熱門課仍在招生。他停開期間仍有教其他課，「太忙所以不教書」不成立；最後一堂校內課（2023 春）經 ExploreCourses XML 反查確認是他本人 PI。(3) 校外人士能否旁聽校內班——Stanford Bulletin 的 [auditing 政策](https://bulletin.stanford.edu/academic-polices/enrollment/auditing)明文只開放已註冊學生、postdoc、訪問學者與教職員；校外一般人要走付費的 Permit to Attend 且需講師、系所、註冊組三層核准，實務上等於不能免費坐進去。付費遠端的部分見下一節：XCS224U 已於 2025 年 5 月正式停開（同一波 Stanford Online 還收了 XCS330，但 XCS224N 仍在招生），官方只有一句通用的「periodically sunset」說法，沒有逐門理由。(4) 上述那個資料載入問題我沒有實際建環境執行，結論是由三份公開文件推得的。

## 參考資料

- [CS224U: Natural Language Understanding 課程官網](https://web.stanford.edu/class/cs224u/) — 證明課程網站現況停在 Spring 2023，並提供講次表、教學團隊與往年網站入口
- [CS224U Policies and requirements](https://web.stanford.edu/class/cs224u/requirements.html) — 成績配比、原創系統評分規則、遲交政策、AI 寫作工具的引用規定
- [CS224U Projects 頁](https://web.stanford.edu/class/cs224u/projects.html) — 三段交件的格式要求，以及期末論文兩節特有段落的原文
- [CS224U Background materials](https://web.stanford.edu/class/cs224u/background.html) — 課程明言由 CS224N 涵蓋、自己不再教的部分
- [CS224U Podcast](https://web.stanford.edu/class/cs224u/podcast/index.html) — 公開的訪談集數與日期，最後一集 2023 年 2 月
- [CS224U 2019 年課程網站](https://web.stanford.edu/class/cs224u/2019/) — relation extraction、semantic parsing、grounded language understanding 曾是講次表主題的證據
- [CS224U 封存版 cs224u.1236](https://web.stanford.edu/class/archive/cs/cs224u/cs224u.1236/) — 唯一一份封存，對應 2022-23 學年春季
- [cgpotts/cs224u GitHub repo](https://github.com/cgpotts/cs224u/) — README 標註哪些單元已降級為背景材料、授權條款、目錄結構
- [projects.md（期末專案完整指引）](https://github.com/cgpotts/cs224u/blob/main/projects.md) — 「never evaluate a project based on how good the results are」原文、三條評分軸、文獻回顧篇數、發表清單的但書
- [hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) — 第一份作業的題目結構與 DynaSent／SST 載入方式
- [hw_openqa.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb) — DSPy + ColBERT 的設定步驟與「你總得付出代價」那段原文
- [hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb) — 組合性泛化作業的四題結構與原創系統的四條路
- [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) — `dspy-ai==2.4.13` 的釘版與註解、`datasets` 未釘版
- [GitHub issue #127](https://github.com/cgpotts/cs224u/issues/127) — 2023 年回報、至今未關的第一個 cell 失敗問題
- [課程介紹投影片（Spring 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf) — 「CS224n is a prerequisite」原文、課程七大主題、原創系統評分原則
- [進階行為評估投影片（Spring 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) — COGS 成績表、ReCOGS 的假設與結果、行為測試的五個開放問題
- [ReCOGS: How Incidental Details of a Logical Form Overshadow an Evaluation of Semantic Interpretation](https://arxiv.org/abs/2303.13716) — 上述投影片引用的論文本體
- [ExploreCourses：CS 224U 條目](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — 官方課程描述與先修條件原文（HTML 版需登入，本文使用其公開 XML 介面）
- [Stanford CS224N 課程官網（Winter 2026）](https://web.stanford.edu/class/cs224n/) — 現行講次表，含 Agents/Tool Use/RAG 與 Benchmarking and Evaluation 兩堂
- [Christopher Potts 授課紀錄](https://web.stanford.edu/~cgpotts/teaching.html) — 校內 CS224u 最後開課年度與其後只教 XCS224u 的紀錄
- [XCS224U（Stanford Online 付費線上版）](https://online.stanford.edu/courses/xcs224u-natural-language-understanding) — 學費、時數、最近一梯日期與目前不開放報名的狀態
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — 五十支公開錄影
- [Hugging Face datasets 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) — `trust_remote_code` 不再支援的原文
- [Hugging Face API：dynabench/dynasent parquet 端點](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) — 該資料集沒有 parquet 版本的證據
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
