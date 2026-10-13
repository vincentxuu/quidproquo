---
title: "預訓練三大類與 Prompt Learning：從 BERT、GPT、T5 到 soft prompt｜台大陳縕儂 深度學習之應用 第 6 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pretraining, prompt-engineering, scaling-laws, nlp]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 7
tldr: "預訓練是在知道任務之前，先讓模型從大量無標註資料學通用能力。架構分三類：encoder 看兩邊、適合理解；decoder 只看左邊、能生成，是目前勝出的一類；encoder-decoder 用去噪預訓練。預訓練加微調有兩個難關：標註資料少、模型太大。GPT-3 的 in-context learning 不更新參數就能做任務，接著出現 hard prompt（template 加 verbalizer、LM-BFF）與直接訓練向量的 soft prompt（P-Tuning、Prefix-Tuning）。當時 soft prompt 效果較好，但最後留下來的是完全不訓練的 prompting。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 6 堂導讀，依 Pretraining 講義與影片 6.1–6.6 的課堂口述：預訓練的三個要點與資料著作權爭議、encoder／decoder／encoder-decoder、BERT 的 15% 遮罩、GPT 三代、BART 與 T5、in-context learning、scaling laws 與 Chinchilla、prompt template 與 verbalizer、LM-BFF、P-Tuning 與 Prefix-Tuning、prompting 的五種訓練策略，以及最後留下來的做法。附 verbalizer 與儲存量的例子和自我檢查。"
draft: false
glossary:
  - term: "Verbalizer"
    aliases: ["標籤詞映射"]
    definition: "prompt-based 微調裡，把語言模型在 [MASK] 位置預測的詞對應回任務標籤的映射，例如 yes → entailment、maybe → neutral、no → contradiction。"
    context: "ADL 講義把 prompt-tuning 拆成 prompt template、PLM、verbalizer 三個元件。"
  - term: "Soft Prompt"
    aliases: ["continuous prompt", "連續提示"]
    definition: "不是人看得懂的文字，而是一組直接用 back-propagation 訓練出來的 embedding 向量，接在輸入前面引導凍結的預訓練模型。"
    context: "影片 6.5 的副標「人不懂沒關係機器懂就好」說的就是它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)9/15 那一週的教材。** 這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列的第 6 堂。[第 5 堂](/posts/ai/2026-09-30-ntu-adl2025-bert-family)講了 BERT 與它的家族，[作業 1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 把 BERT 用在中文抽取式問答。這一篇把視角拉高：**encoder-only、decoder-only、encoder-decoder 差在哪？模型變大之後，為什麼可以只給 prompt 就做任務？**

用到的官方材料：

- 講義 [250915_Pretraining.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)（67 頁，標題 Pretraining & Prompt Learning）。封面註明部分投影片取材自 Mohit Iyyer（UMass）與李宏毅。
- 影片：[6.1 Pretraining 預訓練](https://youtu.be/suX2F2TqKuE)（9:23）、[6.2 Encoder-Only, Decoder-Only, Encoder-Decoder Pretraining 常見三大類預訓練模型](https://youtu.be/cnd91AbBQ74)（33:38）、[6.3 Issues of PLMs 預訓練模型世代的難關](https://youtu.be/tdMuyQO6kLs)（21:39）、[6.4 (Hard) Prompt-Tuning, LM-BFF 用自然語言提示模型](https://youtu.be/fpNxjqJjtT4)（15:55）、[6.5 (Soft) Prompt-Tuning (P-Tuning, Prefix Tuning) 人不懂沒關係機器懂就好](https://youtu.be/Wrzz7mG1ZDU)（7:13）、[6.6 Prompting Paradigm 基於提示的研究大補帖](https://youtu.be/CCZfyLCNrQk)（15:43）
- 補充：播放清單上的 [6.0 QA](https://youtu.be/-3mUrFm8lIo)（26:15）是課堂問答，沒有講義。

存取等級沿用系列的 **A2**：本堂的講義與影片都公開，本週沒有新作業（HW2 在[第 7 堂](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)那一週公布，只有說明影片）。

讀完這一堂要能做四件事：看到一個模型，說出它是 encoder、decoder 還是 encoder-decoder，以及它預訓練時在做什麼；分清楚 fine-tuning 和 in-context learning 各自動了什麼；用 template 和 verbalizer 把一個分類任務改寫成 prompt；說出 hard prompt 和 soft prompt 的差別，以及最後留下來的是哪一種做法。標成「本文自編」的例子與標成「補充」的引用框都不是課堂內容。

## 預訓練是什麼

Pre-training 的字面意思是「在訓練之前」。在知道模型最後要做哪個任務之前，先讓它在大量、多元的資料上學一些基本能力。陳縕儂老師的比喻是把模型送去學校：還不知道以後考哪一科，先讓它什麼都學一點，期待這些知識之後派得上用場。

講義第 2 頁列了三個要點，老師逐一解釋了原因：

- **資料要大、要多元。** 因為不知道最後的任務是什麼，學得越廣越保險。
- **要能從沒有標記的資料學。** 這麼大量的資料不會有人逐筆標註。一本教科書就是一篇篇文章，沒有問題與答案的配對。
- **學到的要通用，而且能轉移。** 如果預訓練學的東西和之後的任務完全無關，就不用期待它有幫助。

### 資料可以這樣用嗎

最有名的預訓練資料集是 BookCorpus（第 3 頁），來自 2015 年的一篇論文，作者寫爬蟲把一個網站上的免費書抓下來。老師指出這裡的問題：書免費給你看，不代表著作權也給了你。

爭議分成兩邊（第 4 頁）。開發模型的公司主張這是合理使用：只是讓模型讀，就像人下載一本書來讀也是在訓練自己的腦，而且模型沒有照抄輸出。另一邊認為，買了書不等於買了著作權。

老師舉了 Anthropic 的案子：

- 它買了大量實體書，掃描、轉成文字後拿去訓練（老師說這是很費工的事）。這一部分法院認定是合理使用。
- 它也用了從盜版網站下載的書。這一部分沒有過關，老師說總共賠了 15 億美元。

> 補充（非課堂口述，本文另查）：講義第 4 頁貼的新聞標題寫的是「agrees to pay authors $1.5bn to settle piracy lawsuit」，也就是和解，不是判賠。這個案子是 Bartz v. Anthropic。法院的裁定是：用書訓練模型屬於合理使用，把買來的紙本書數位化也是；但下載盜版書建立資料庫不是。15 億美元是之後雙方和解的金額，不是判決金額；依 Reuters 2025-09-05 的報導，大約是 50 萬本書、每本 3,000 美元。

她的結論是各國還沒有共識：美國相對開放，歐盟的監管比較嚴，台灣多半先觀望。這仍是一個沒有定論的問題。

## 三種預訓練架構

三種架構的差別在 attention 能看哪裡（第 5 頁）：

| 類型 | Attention | 代表模型 |
|---|---|---|
| Encoder-only | 每個 token 可以看前後所有 token | BERT 與它的變體 |
| Decoder-only | 只能看左邊已經出現的 token | GPT 系列 |
| Encoder-decoder | 編碼端看兩邊，解碼端只看左邊 | 原始的 Transformer、BART、T5 |

老師形容那幾年是戰國時代，三派各說各的好。截至目前，勝出的是 decoder-only：OpenAI 從一開始就只做這一種，現在大部分模型的架構都接近它。

### Encoder：BERT 與它的家族

BERT 的預訓練是 masked language model：把句子裡一部分 token 遮掉，要模型用左右兩邊的上下文填回來。在被遮的位置，模型對整個詞彙表輸出一個機率分布；假設詞彙表有六萬個 token，輸出就是六萬維，訓練目標是把正確那一維的機率拉高。

為什麼遮 15%（第 7 頁）：

- 遮太少，例如 5%，整個模型跑完一句只學到 5% 的位置，沒有效率。
- 遮太多，剩下的上下文不夠，空格填不出來。

**算一下（本文自編）。** 一個 512 個 token 的序列，遮 15% 大約是 77 個位置，剩下 435 個當上下文。只遮 5% 是 26 個位置，同樣跑一次，得到的訓練訊號只有三分之一。

預訓練完成後，把這組參數當成起點，再針對目標任務微調。老師提醒用法沒有唯一正解：做分類時最常見的是取開頭 `[CLS]` 那個位置的向量接一層 linear，但也可以取最後一個 token，或把所有位置平均。她鼓勵大家自己試。

BERT 之後的兩個變體（第 8 頁）：

- **RoBERTa**：模型本身的新意不多，改的是資料更多、訓練設定更細。效果很好，老師說用 BERT 系列時應該考慮它。
- **SpanBERT**：一個詞可能被切成好幾個 subword，只遮其中一個很奇怪。它改成一次遮連續幾個 token。

### Decoder：GPT 系列

那幾年在理解類的任務上，encoder 完勝 decoder。decoder 的研究沒有斷，是因為 encoder 做不了生成（第 9 頁）：它要整句都在才能判斷，沒辦法一個 token 一個 token 往下寫。decoder 的訓練就是一般的語言模型：吃前文，預測下一個 token。以翻譯為例：encoder 沒辦法一個 token 一個 token 生出譯文；decoder 把原文當成輸入，接著往下生成譯文就可以了。

- **GPT（2018）**：12 層的 Transformer decoder，在 BookCorpus 約 7000 本書上預訓練，輸入用 BPE 切成 token。它生成完整句子的能力還很差，所以用法和 BERT 幾乎一樣：預訓練當起點，再對每個任務微調。
- **GPT-2（2019）**：團隊的想法是「是不是書讀得不夠多」，於是加進網路論壇的資料。生成能力確實跟著提升，能寫出通順、合文法的句子，但還遠不如人寫的。
- **GPT-3（2020）**：把抓得到的資料盡量都放進去，包括書、論壇與 Common Crawl。模型也跟著變大，而且一次做了好幾種尺寸來比較，最大的是 175B。當時的結論是模型越大越好；後面的 Chinchilla 會替這句話加上條件。

第 15 頁把三代的參數量並列：117M、1.5B、175B。

為什麼第一代會接下一個字，卻寫不出句子？老師用手機輸入法解釋：鍵盤上建議的下一個字通常合理，但一直按建議字，很難按出一個完整的句子。造句需要的資訊比接詞多得多。

### Encoder-decoder：BART 與 T5

既想看兩邊，又想能生成，就把兩種機制放在一起。這類模型的預訓練不那麼直覺，做法是去噪（第 17–18 頁）：把輸入弄壞一部分，要模型還原。

講義用同一句話示範兩個模型的差別（Thank you for inviting me to your party last week）：

- **[BART](https://arxiv.org/abs/1910.13461)**（Meta）：輸入被挖空的句子，**輸出完整的原句**。
- **[T5](https://arxiv.org/abs/1910.10683)**（Google）：輸入把空格標成 `<X>`、`<Y>`，**只輸出缺掉的部分**：`<X> for inviting <Y> last <Z>`。

做分類時也不同（第 19 頁）：BART 會把輸入重複一遍再預測標籤；T5 直接把標籤當成輸出的文字。

BART 的論文試了好幾種弄壞輸入的方式，包括遮住、刪掉、把句子順序打亂，結論是挖掉一段再填回來（text infilling）最好。

T5 還比較了一種 prefix language model：左半段雙向、右半段單向。它的效果不如 encoder-decoder，所以老師沒有把它列進三大類。

T5 的另一個做法是多任務預訓練（第 22 頁）：把有標註的資料也放進來，並把任務名稱直接寫在輸入前面，例如 `translate English to German: …`。老師說這個想法就是現在的 post-training，[下一堂](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)會講。

兩個模型哪個好？講義第 23 頁的表格裡，BART 在多數欄位分數較高。老師口頭的說法是兩者不相上下，而且兩邊的資料、尺寸與設計都不同，沒辦法公平地一對一比較。兩種說法本文都照錄。

## 預訓練加微調遇到的兩個難關

### 難關一：標註資料少

講義第 25 頁列的 benchmark（從任務清單看是 GLUE）裡，資料最少的任務也有 2500 筆。老師說業界的情況常常更糟：對方希望你先做出系統，而手上根本沒有標註資料。真實的情境多半是 few-shot，甚至沒有例子。

這時有另一種做法，**in-context learning**（第 26–28 頁）：

| | 模型參數 | 任務怎麼告訴模型 | 要存什麼 |
|---|---|---|---|
| Fine-tuning | 用任務的標註資料更新 | 透過訓練 | 每個任務一份模型 |
| In-context learning | 完全不動 | 寫在輸入的 context 裡 | 只有一份模型 |

老師的比喻是一個讀了很多書、但從沒考過試的學生。第一次考試要先看題型說明，例如「從 ABCD 選出最適合的」，最好再看一題例題和它的答案，然後才作答。題型說明和例題就是 context。不給例子是 zero-shot，給一個是 one-shot，給幾個是 few-shot。

她也點出這件事奇怪的地方：GPT-3 預訓練時只學接下一個字，沒有學過怎麼處理特定任務，使用時也沒有再訓練，卻能光靠描述理解任務。這也是 prompt engineering 興起的原因：同一個任務，講法不同，模型理解的程度就不同。

GPT-3 論文的幾個結果（第 29–32 頁，數字是老師口述）：

- 模型越大，光靠任務描述的理解就越好。
- 和微調過的 BERT-Large 比（大約 70 分）：GPT-3 zero-shot 將近 60%；few-shot 只給 32 個例子，就超過微調過的 BERT。但仍低於專門為該任務設計的模型。
- 例子不用多。從 0 個到 1 個進步最大，1 個到 2 個不一定有差。老師的建議是至少給一個例子。
- 讓人分辨一篇文章是 GPT-3 寫的還是人寫的：模型小的時候，人猜對的比例有七成多；模型越大，越接近五成的亂猜。
- 教它一個捏造的新詞和意思，請它造句，它能造出通順合理的句子。新東西可以在 context 裡現學現用。

### 難關二：模型太大

模型尺寸呈指數成長（第 33–38 頁），最直接的問題是成本。要投入這麼多資源，事前最好能估計會換到多少表現。

- **Scaling laws**（第 39 頁，[Kaplan 等人 2020](https://arxiv.org/abs/2001.08361)）：OpenAI 提出，模型的品質可以由三個因素預測，模型大小 N、資料量 D、運算量 C。有了這個關係，就能決定資源該放在哪裡。
- **Chinchilla**（第 40 頁，[Hoffmann 等人 2022](https://arxiv.org/abs/2203.15556)）：DeepMind 發現模型大小和訓練的 token 數應該等比例增加。之前的模型多半訓練不足：模型很大，餵的 token 卻不夠，容量浪費掉了。他們訓練了一個 70B 的模型，比對照的模型小四倍、資料比較多，表現反而更好。模型小，之後微調與推論的成本都低。
- **儲存空間**（第 41 頁）：每個任務微調一次，就要存一份完整的模型。

第 42 頁把兩個難關接到解法：能不能用比較少的成本、不存那麼多東西，也讓模型符合目標任務？這就是 prompt learning。

## Hard prompt：template 加 verbalizer

老師先交代定位：GPT-3 之後這一類方法非常多，這一堂會走過大家試過的路，最後再說哪一條留了下來。

任務是 entailment（第 45–46 頁）：給兩個句子，判斷是 entailment、contradiction 還是 neutral。

最直接的 prompt 是把幾組標註好的例子貼給模型，再接上要判斷的句子。改寫一下 prompt，表現就可能變好：與其只把兩句並排，不如問「Is it true that 後面這句？」，讓模型回答 yes、no 或 maybe。

Prompt-tuning 把這件事拆成三個元件（第 47–50 頁）：

1. **Prompt template**：把輸入包成什麼樣的句子。這是可以調的。
2. **預訓練模型**：template 要配合它。masked LM 要留一個 `[MASK]` 讓它填，不能期待它往下接。
3. **Verbalizer**：把模型輸出的詞對回標籤，例如 yes → entailment、no → contradiction、maybe → neutral。

**走一遍（本文自編）。** 輸入是「I like strawberries.」與「I hate strawberries.」，template 是「I like strawberries. Is it true that I hate strawberries? ＿」。假設模型在空格的位置給出這些機率：

| 詞 | 機率 |
|---|---|
| the | 0.30 |
| no | 0.20 |
| maybe | 0.10 |
| yes | 0.05 |
| 其他所有詞 | 0.35 |

機率最高的是 the，但 verbalizer 只看 yes、no、maybe 三個詞。三者之中 no 最高，對回標籤是 contradiction。老師的說法是：別的詞就算是整個分布裡最高的，我們也不管。

有標註資料時，prompt-tuning 就是用這些資料找出哪一種包法最容易讓模型答對。老師的說明是：以前我們有輸入和輸出，訓練的是中間的模型；現在模型太大動不了，能動的只剩包住輸入的那段 prompt。沒有標註資料（zero-shot）就沒有東西可調，只能自己想一個 template 直接用。

資料很少時這個做法也有效（第 52 頁，[講義標 Le and Rush 2021](https://arxiv.org/abs/2103.08493)）。老師的解釋是它建立在預訓練模型上，預訓練學到的知識還留著。

這裡講義和口述的說法不完全一樣，會影響你怎麼理解 prompt-tuning，所以並列出來。影片裡老師強調模型不動、調的是 prompt。講義第 51 頁寫的是：few-shot 時仍然用少量標註資料微調預訓練模型，zero-shot 才完全不調參數；下面的 LM-BFF，全名也是 Better Few-shot Fine-tuning of Language Models。比較穩妥的理解是：這一類方法的共同點是把任務包成 prompt 的形式，至於模型參數動不動，要看是哪一篇。

### LM-BFF

[LM-BFF](https://arxiv.org/abs/2012.15723)（第 53–54 頁）處理兩個問題，例子是電影評論的情緒分類，template 是「It was ＿」，verbalizer 是 great → 正面、terrible → 負面。

- **模型為什麼要剛好說 great 或 terrible？** 它也可以說 good 或 awesome。解法是在 prompt 裡放示範例子：好的時候寫 It was great，爛的時候寫 It was terrible。模型看過示範，輸出就會集中在這兩個詞上。
- **「It was ＿」是最好的 template 嗎？** 不一定。這篇論文的主要新意是讓模型自己產生一批候選 template，逐一在有標註的資料上評估，留下最好的那個。實驗結果是自動產生的 template 和人寫的差不多，各任務互有高低（第 54 頁）。

## Soft prompt：不必是人看得懂的句子

Hard prompt 很不穩定。老師舉了一個判斷「某城市位於哪個國家」的例子（第 55 頁）：

| Template 的寫法 | P@1（precision） |
|---|---|
| [X] is located in [Y] | 31.29 |
| [X] is located in which country or state? [Y] | 19.78 |
| [X] is located in which country? [Y] | 31.40 |
| [X] is located in which country? In [Y] | 51.08 |

第二列只比第三列多了「or state」，掉了十幾個百分點；第四列只在答案前多一個 In，高了將近二十個百分點。這些問法對人來說幾乎沒差。很難知道哪一種寫法才是最好的。

於是有人問：prompt 為什麼一定要是自然語言？文字進了模型也是變成一串向量。那就跳過文字，直接訓練那串向量，梯度可以一路傳回來。

- **[P-Tuning](https://arxiv.org/abs/2103.10385)**（第 56 頁）：直接學 prompt 的 embedding。這些向量對應什麼文字不重要，只要模型讀了知道該做哪個任務。
- **[Prefix-Tuning](https://arxiv.org/abs/2101.00190)**（第 57 頁）：只在最前面放一小段可訓練的 prefix（講義註明每一層都有）。每個任務只要存自己的 prefix。
- **[Prompt Tuning](https://arxiv.org/abs/2104.08691)**（第 58 頁）：每個任務只存一小段 prompt，而且只加在輸入那一層，所以同一個原始模型可以在同一批資料裡處理不同任務。老師說細節不重要，有興趣再看論文。

當時的結論是 soft prompt 的表現比 hard prompt 好（第 59 頁）。老師認為很合理：它不必符合自然語言，可以探索的空間更大。第 59 頁的圖也顯示它仍不高於完整微調，那一頁的標題強調的是表現有競爭力、空間效率更好。

**存多少東西（本文自編，模型大小沿用講義第 41 頁的 11B）。** 假設一個 11B 參數的模型要做三個任務。每個任務各微調一份，要存 33B 個參數。改用 soft prompt，假設每個任務學 100 個 prompt 向量、每個 4096 維，一個任務是 409,600 個參數，三個任務約 123 萬個，再加上一份共用的 11B 模型。三個任務多存的 123 萬個參數，只有一份模型的萬分之一左右，所以幾乎等於只存一份模型。講義第 58 頁的圖用的數字更小：每個任務約 20K 個參數。

## Prompting 的全景：什麼東西可以動

影片 6.6 依 [Liu 等人 2021 的 survey](https://arxiv.org/abs/2107.13586)，先講研究重心的四個階段（第 60 頁）：

| 階段 | 研究者花力氣的地方 | 任務之間的關係 |
|---|---|---|
| 非神經網路的監督式學習 | 設計特徵 | 各自獨立 |
| 神經網路的監督式學習 | 設計架構 | 各自獨立 |
| Pre-train、fine-tune | 設計預訓練目標 | 語言模型被微調到各個任務 |
| Pre-train、prompt、predict | 設計 prompt | 各個任務直接來用同一個語言模型 |

接著是分類的幾個維度（第 61–66 頁）：預訓練模型的類型、prompt 的形狀（中間挖空或給前綴讓它接）與產生方式（人寫或自動、離散或連續）、答案的形狀、多個 prompt 的組合，以及訓練策略。

老師說最後一個維度最重要，問的是模型參數和 prompt 參數各動不動：

| 策略 | 語言模型 | Prompt | 例子 |
|---|---|---|---|
| Promptless fine-tuning | 調 | 沒有 prompt | BERT：輸入就是題目本身，沒有告訴它任務是什麼 |
| Tuning-free prompting | 不動 | 不訓練 | 現在使用 LLM 的方式 |
| Fixed-LM prompt tuning | 不動 | 調 | Prefix-Tuning |
| Fixed-prompt LM tuning | 調 | 固定 | T5：任務名稱寫在輸入前面 |
| Prompt＋LM tuning | 調 | 調 | P-Tuning |

這張表依講義第 65 頁。影片裡老師先把 P-Tuning 和 Prefix-Tuning 一起放在 fixed-LM 那一列，後面又說 P-Tuning 兩者都調，以講義的歸類為準。

## 最後留下來的是哪一條路

老師在結尾回答了開頭的問題。當時的實驗顯示 soft prompt 比 hard prompt 好，但到現在還在用的，是 **tuning-free prompting**：什麼都不訓練，直接問。

原因有兩個：預訓練的資料已經夠多元，後來又有 post-training，讓模型在上線前先學會做各式各樣的任務。使用者自己改寫 prompt、試哪一種比較好，其實就是手動版的 prompt tuning：模型固定，調的是 prompt。要進到模型裡動參數的做法比較麻煩，也不太可行，現在比較少人做。

她說這一堂講這麼多已經少用的方法，是要讓大家看到一個趨勢：模型還小的時候，能動的地方很多；模型越來越大，裡面動不到了，大家才轉去想怎麼從外面改變它的行為。之後的 chain-of-thought 也是同一個方向。

## 常見的誤解

這幾條是我依課堂內容整理的。

- **「In-context learning 也是一種訓練。」** 模型的參數完全沒有更新。例子只是輸入的一部分。
- **「Encoder 的理解能力比較強，所以 encoder 模型勝出。」** 那幾年在理解任務上確實如此，但 encoder 不能生成。最後勝出的是 decoder-only。
- **「Verbalizer 取機率最高的詞。」** 它只在指定的幾個詞之間比較。
- **「Soft prompt 效果比較好，所以現在都用它。」** 當時的實驗結果是這樣，但留下來的是不訓練的 prompting。
- **「模型越大就一定越好。」** Chinchilla 的結果是：資料沒有跟上的話，大模型的容量是浪費的。

## 自我檢查

題目是本文自擬的。

**1. 一個模型預訓練時只能看到左邊的 token，預測下一個 token。它是哪一類？適合直接拿來做翻譯嗎？**

Decoder-only。可以：把原文當成輸入，讓它接著生成譯文。

**2. 同一句「Thank you for inviting me to your party last week」，挖掉 for inviting 和 last 之後，BART 和 T5 預訓練時各要輸出什麼？**

BART 要輸出完整的原句。T5 只輸出缺掉的部分，並用標記對應位置，例如 `<X> for inviting <Y> last <Z>`。

**3. 用 fine-tuning 做三個任務，和用 in-context learning 做三個任務，各要存幾份模型？**

Fine-tuning 是三份，每個任務一份。In-context learning 只要一份，三個任務只差在輸入的 context。

**4. Template 是「這則評論：＿＿。整體來說它很 [MASK]。」，verbalizer 是 好 → 正面、差 → 負面。模型在 [MASK] 的機率是：普通 0.4、差 0.25、好 0.15。預測的標籤是什麼？**

負面。Verbalizer 只比較「好」和「差」，差的 0.25 高於好的 0.15。「普通」不在 verbalizer 裡，不列入比較。

**5. Prefix-Tuning 屬於上面訓練策略表的哪一列？語言模型和 prompt 各動不動？**

Fixed-LM prompt tuning。語言模型不動，只訓練 prefix 的向量。

**6. 你手上沒有任何標註資料，想用語言模型做情緒分類。這一堂的方法裡哪些還能用？**

只能用 zero-shot 的 prompting：自己寫一個 template 直接問。Prompt-tuning、LM-BFF 的 template 篩選與 soft prompt 都需要標註資料。老師的建議是至少想辦法給模型一個例子。

**7. 替「判斷一封信是不是垃圾信」設計一組 template 與 verbalizer，模型是 masked LM。**

答案不只一種。例如 template 是「信件內容：＿＿。這封信是 [MASK] 信。」，verbalizer 是 垃圾 → 垃圾信、正常 → 非垃圾信。檢查兩件事：template 裡有一個 [MASK] 讓模型填；verbalizer 的每個詞都能對回一個標籤。（本文補充，課堂沒有談：一個 [MASK] 只填一個 token，所以 verbalizer 的詞最好是模型詞彙表裡的單一 token。）

**8. Hard prompt 和 soft prompt 差在哪裡？當時哪一個效果好，現在留下來的是什麼？**

Hard prompt 是人看得懂的文字，soft prompt 是直接訓練出來的向量，不對應任何文字。當時的實驗是 soft prompt 效果比較好。現在留下來的是不做任何訓練的 prompting，加上使用者自己手動改寫 prompt。

## 延伸閱讀

- [CS224N 第 7 堂：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)講同樣的三種架構與 in-context learning。
- [CS336 的 scaling laws 基礎](/posts/ai/2026-08-22-cs336-scaling-laws-foundations)把 Kaplan 與 Chinchilla 講得更深。
- [CS224U 的 in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning)從 prompt 設計與 DSPy 的角度延伸。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [作業 1：中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)｜下一堂 [第 7 堂：後訓練與高效調整](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=suX2F2TqKuE
title: 6.1
```

```youtube
url: https://www.youtube.com/watch?v=cnd91AbBQ74
title: 6.2
```

原始影片：[6.1](https://www.youtube.com/watch?v=suX2F2TqKuE)、[6.2](https://www.youtube.com/watch?v=cnd91AbBQ74)、[6.3](https://www.youtube.com/watch?v=tdMuyQO6kLs)、[6.4](https://www.youtube.com/watch?v=fpNxjqJjtT4)、[6.5](https://www.youtube.com/watch?v=Wrzz7mG1ZDU)、[6.6](https://www.youtube.com/watch?v=CCZfyLCNrQk)、[6.0 QA](https://www.youtube.com/watch?v=-3mUrFm8lIo)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：6.1–6.6 六支都依字幕整理；課堂問答 6.0 未對照。講義第 23 頁的表格寫 BART 在多數欄位分數較高，影片口述說兩者不相上下，文中並列。Anthropic 一案老師口頭說是判賠，講義第 4 頁貼的新聞標題寫的是 settle，另查後確認是和解，已在文中註明。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。確認 6.1、6.2 與文章相符；補註 BART 對 T5 表現一項講義與口述略有差異，文章已標講義出處。
- 2026-10-13：查證歷程移出正文；系列內互相引用由篇序改為堂次。
- 2026-10-13：依六支影片的課堂口述重寫全文，補上 verbalizer 與儲存量的例子、常見誤解與附答案的自我檢查。

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250915_Pretraining.pdf（Pretraining & Prompt Learning）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[6.1](https://youtu.be/suX2F2TqKuE)、[6.2](https://youtu.be/cnd91AbBQ74)、[6.3](https://youtu.be/tdMuyQO6kLs)、[6.4](https://youtu.be/fpNxjqJjtT4)、[6.5](https://youtu.be/Wrzz7mG1ZDU)、[6.6](https://youtu.be/CCZfyLCNrQk)、[6.0 QA](https://youtu.be/-3mUrFm8lIo)
- [Improving Language Understanding by Generative Pre-Training（GPT，OpenAI 2018）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Language Models are Unsupervised Multitask Learners（GPT-2，OpenAI 2019）](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners（GPT-3，arXiv 2005.14165）](https://arxiv.org/abs/2005.14165)
- [BART（arXiv 1910.13461）](https://arxiv.org/abs/1910.13461)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer（T5，arXiv 1910.10683）](https://arxiv.org/abs/1910.10683)
- [Scaling Laws for Neural Language Models（arXiv 2001.08361）](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models（Chinchilla，arXiv 2203.15556）](https://arxiv.org/abs/2203.15556)
- [Compute Trends Across Three Eras of Machine Learning（arXiv 2202.05924）](https://arxiv.org/abs/2202.05924)
- [How Many Data Points is a Prompt Worth?（arXiv 2103.08493）](https://arxiv.org/abs/2103.08493)
- [Making Pre-trained Language Models Better Few-shot Learners（LM-BFF，arXiv 2012.15723）](https://arxiv.org/abs/2012.15723)
- [Calibrate Before Use（arXiv 2102.09690）](https://arxiv.org/abs/2102.09690)
- [GPT Understands, Too（P-Tuning，arXiv 2103.10385）](https://arxiv.org/abs/2103.10385)
- [Prefix-Tuning（arXiv 2101.00190）](https://arxiv.org/abs/2101.00190)
- [The Power of Scale for Parameter-Efficient Prompt Tuning（arXiv 2104.08691）](https://arxiv.org/abs/2104.08691)
- [Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP（arXiv 2107.13586）](https://arxiv.org/abs/2107.13586)
- [Bartz v. Anthropic PBC（美國著作權局合理使用判決摘要）](https://www.copyright.gov/fair-use/summaries/Bartz-v-Anthropic-PBC-787-F-Supp-3d-1007-ND-Cal-2025.pdf)
- [Anthropic agrees to pay $1.5 billion to settle author class action（Reuters，2025-09-05）](https://www.reuters.com/sustainability/boards-policy-regulation/anthropic-agrees-pay-15-billion-settle-author-class-action-2025-09-05/)
