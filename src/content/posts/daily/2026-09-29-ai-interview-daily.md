---
title: "AI Engineer 面試日練 — 2026-09-29：Deep Learning & NLP"
date: 2026-09-29
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二輪到 Deep Learning & NLP——為什麼 Transformer 選 scaled dot-product 而不是 additive attention、scale 用 1/√dk 到底在防什麼、multi-head 為什麼要切子空間、CNN/RNN/Transformer 三種 inductive bias 的取捨，加一題 dsprep.com 收錄、Anthropic/DeepMind 等研究實驗室常考的 attention 效率題。"
tldr: "今天的 Deep Learning & NLP 輪練涵蓋五個核心概念：scaled dot-product attention 為什麼靠一次 batched matmul 就能在 GPU 上平行化、多頭注意力把同一個嵌入維度切成多個子空間各自學不同關係、positional encoding 為什麼是 Transformer 沒有遞迴之後必須額外補回去的資訊、CNN 的局部性假設跟 RNN 的遞迴假設跟 Transformer 全域互動的取捨，以及 BPE/WordPiece/SentencePiece 三種 subword tokenization 的差異跟為什麼 byte-level BPE 能徹底消除未知詞問題。練習題來自 dsprep.com 收錄、Anthropic、DeepMind 等研究實驗室常考的一題：為什麼 Transformer 選擇 scaled dot-product attention 而不是 additive attention，拆解思路把效率、scale factor、multi-head 動機串成一套完整的設計哲學論述。"
series:
  name: "AI Engineer 面試日練"
  order: 41
---

> 🌏 [English version](/en/posts/daily/2026-09-29-ai-interview-daily-en)

## 今日主題

星期二輪到 Deep Learning & NLP，這是 AI Engineer 面試裡最容易被要求「從頭推導」的一塊——面試官不太滿足於背出 Transformer 的架構圖,他們想看你能不能講出每個設計選擇背後在解決什麼具體問題。今天選的練習題圍繞 attention 機制的效率考量,因為「為什麼是 scaled dot-product 而不是 additive attention」是少數能同時測出你懂不懂線性代數、懂不懂 GPU 平行化、又懂不懂梯度訓練動態的問題,從 phone screen 到 onsite 的 ML system 深挖環節都會被問到。

## 核心概念速記

### Scaled dot-product attention：效率贏在能整批做成一次矩陣乘法

自注意力讓序列裡的每個 token 直接跟其他所有 token 互動：先用三組線性投影把輸入變成 query、key、value,再用 query 跟每個 key 算相似度、softmax 正規化成權重,最後對 value 做加權平均。Transformer 論文選擇用內積(dot-product)算相似度,而不是早期 seq2seq 常見的 additive attention(用一層小型前饋網路算 score),核心理由是效率：$QK^T$ 可以整個序列一次算完,變成一次高度優化的 batched matrix multiplication,在 GPU 上直接吃滿張量核心;additive attention 因為中間有一層非線性運算,沒辦法這樣攤平成單一矩陣乘法,必須逐 pair 算,平行化程度差一截。面試官常追問「兩者理論表達力誰比較強」,答案是 additive attention 理論上表達力略高,但實務上這個差距在夠大的維度下可以忽略,換來的平行化效率才是 Transformer 能訓練到現在規模的關鍵。

### Scale factor 1/√dk：防止內積把 softmax 推進飽和區

Attention score 算完 $QK^T$ 之後要除以 $\sqrt{d_k}$($d_k$ 是 key 的維度)才丟進 softmax。原因是當 $d_k$ 變大時,兩個隨機向量內積的變異數會隨維度線性成長,score 的絕對值會變得很大;softmax 對輸入的絕對值很敏感,score 差距一拉大,softmax 輸出就會趨近 one-hot,把幾乎所有機率質量集中在一個位置上,對應的梯度也會趨近於零,訓練會卡住。除以 $\sqrt{d_k}$ 把 score 的變異數重新拉回常數量級,讓 softmax 維持在梯度還有效的區間。這題常被拿來考「你懂不懂為什麼要 scale,而不是只會背公式」,能講出「變異數隨維度成長」跟「softmax 飽和導致梯度消失」這兩層,才算真的講到重點。

### Multi-head attention：把同一個嵌入空間切成多個子空間各自學不同關係

單一個 attention head 的問題是,它只能學到一種相似度計算模式,但語言裡同時存在句法依存、指涉關係、語意相近等多種不同性質的關係。Multi-head attention 把 query/key/value 的嵌入維度切成幾個較小的子空間(例如 512 維切成 8 個 64 維的 head),每個 head 獨立算一次 scaled dot-product attention,讓不同 head 能收斂到專注不同類型的關係,最後把所有 head 的輸出串接、再做一次線性投影融合回原本的維度。面試時常被追問「為什麼不乾脆用一個更大維度的單一 head」,答案是實驗上多個小 head 比一個大 head 更容易學出多樣化的關係模式,單一 head 的 attention 分布容易被少數強訊號主導,失去捕捉多種關係的彈性。

### CNN、RNN、Transformer：三種 inductive bias 的取捨

CNN 假設局部性(local receptive field),靠卷積核只看鄰近像素、再堆疊層數逐步擴大感受野,這個假設跟影像的空間局部相關性高度吻合。RNN 靠隱藏狀態逐步遞迴傳遞順序資訊,理論上能記住任意長的歷史,但反向傳播要穿過整條時間序列,長序列容易梯度消失,長距離依賴實務上很難學好。Transformer 完全放棄局部性跟遞迴假設,用 attention 讓任兩個位置直接互動,代價是計算量隨序列長度平方成長($O(n^2)$),換來的是能直接建模長距離依賴、又能整個序列平行訓練(不像 RNN 要逐步遞迴,沒辦法平行)。面試官常問「為什麼 NLP 從 RNN 轉向 Transformer」,核心答案就是這組 inductive bias 的取捨——犧牲一點對序列局部結構的歸納偏誤,換來可平行化訓練跟更好的長距離建模能力。

### Tokenization：BPE、WordPiece、SentencePiece 為什麼都是子詞切分

語言模型沒辦法直接吃原始文字,必須先切成固定詞彙表裡的 token id。三種主流子詞切分演算法各自解決不同問題：BPE(Byte-Pair Encoding)從單一 byte 或字元出發,反覆合併語料裡最常見的相鄰配對,直到詞彙量達到目標大小,GPT 系列跟 Claude 家族用的都是這條路線的變體;WordPiece 是 BERT 使用的版本,合併準則改成最大化語料似然,子詞片段前面加 `##` 標記是詞的延續部分;SentencePiece 則直接在原始文字上訓練、把空白當成一個普通符號處理(印出來是 `▁`),因此對中文、日文、泰文這類沒有空白分詞的語言特別友善,同時支援 BPE 或 unigram 機率模型兩種訓練方式。為什麼都要走子詞路線而不是整詞:整詞詞彙表遇到沒看過的詞會直接變成未知詞(OOV),子詞切分能把任何字串拆成已知片段的組合;GPT-2 之後的 byte-level BPE 更進一步,把 256 個 byte 當成字母表,理論上能表示任何位元組序列,徹底消除 OOV 問題。

## 今日練習題

### 題目

為什麼 Transformer 選擇 scaled dot-product attention,而不是早期 seq2seq 常用的 additive attention?請說明背後的效率考量,解釋 scale factor $1/\sqrt{d_k}$ 在防止什麼問題,並進一步說明 multi-head attention 為什麼要把嵌入維度切成多個子空間、而不是用一個更大維度的單一 head。

**來源**：dsprep.com Data Science Interview Preparation 題庫收錄,標註為 Anthropic、DeepMind 等研究實驗室常考題　**難度**：進階　**環節**：technical screen / ML fundamentals 深挖

### 拆解思路

1. **先釐清問題**：先確認面試官要聽的重點是效率面的比較,還是也要包含 additive attention 的計算方式本身;順帶確認是否需要一併討論 multi-head 的動機,還是先把單一 head 的效率論證講完整再往下延伸。
2. **建立框架**：從 attention 的通用定義出發——一個 compatibility function 算 query 跟每個 key 的相似度,再用 softmax 正規化成權重,對 value 做加權平均。在這個框架下比較兩種 compatibility function:dot-product(直接內積)跟 additive(用一層前饋網路算 score),核心差異在於能不能攤平成矩陣乘法。
3. **深入核心**：講清楚 dot-product 為什麼能整個序列一次算成 $QK^T$ 的 batched matmul,直接吃 GPU 的張量核心;additive attention 因為中間有非線性層,沒辦法這樣批次化,必須逐 pair 運算,平行化程度差一截。接著解釋 scale factor:維度變大時內積的變異數會線性成長,score 差距拉大會讓 softmax 趨近 one-hot、梯度趨近於零,除以 $\sqrt{d_k}$ 是為了把變異數拉回常數量級,維持梯度有效。最後講 multi-head 的動機:單一 head 只能收斂到一種相似度模式,切成多個較小子空間讓不同 head 能各自專注句法、指涉、語意等不同類型的關係,而不是被單一強訊號主導。
4. **收尾**：把這三個設計選擇串成一個更大的主題——Transformer 整體的設計哲學,就是用「更適合硬體平行化的簡單運算」系統性地換掉 RNN 或 additive attention 這類「表達力可能略強、但難以平行化」的設計,這正是 Transformer 能被擴展到現在規模的根本原因,也是回答這類題目時最容易讓面試官留下印象的收尾角度。

### 範例回答（面試時可以這樣講）

> **效率面的比較**：Additive attention 用一個小型前饋網路把 query 跟 key 串接後算出 score,這一步有非線性運算,沒辦法攤平成單一矩陣乘法,必須逐 pair 計算。Scaled dot-product attention 直接把 query 跟 key 做內積,整個序列可以一次算成 $QK^T$,變成一次 batched matrix multiplication,在 GPU 上直接吃滿張量核心的優化,這是 Transformer 選它的主要原因——理論表達力雖然可能略遜於 additive attention,但在夠大的維度下這個差距可以忽略,換來的平行化效率才是能訓練到現在規模的關鍵。
>
> **Scale factor 在防什麼**：內積的變異數會隨 key 的維度 $d_k$ 線性成長,維度一高,score 的絕對值就會變得很大。Softmax 對輸入的絕對值很敏感,score 差距一拉大,輸出就會趨近 one-hot,對應的梯度也會趨近於零,訓練會卡住。除以 $\sqrt{d_k}$ 把變異數重新拉回常數量級,讓 softmax 維持在梯度還有效的區間,這是個很直接的數值穩定性設計,不是隨便選的超參數。
>
> **Multi-head 的動機**：單一個 head 只能收斂到一種相似度計算模式,但語言裡同時存在句法依存、指涉關係、語意相近等多種不同性質的關係。把嵌入維度切成幾個較小的子空間各自算一次 attention,讓不同 head 能學到不同類型的關係,比用一個更大維度的單一 head 更能捕捉多樣化的模式——單一大 head 的 attention 分布容易被少數強訊號主導,失去彈性。這三個設計選擇合起來,其實都在講同一件事:Transformer 系統性地用「適合平行化的簡單運算」換掉「表達力可能更強但難平行化」的設計。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 講出 dot-product 能攤平成 batched matmul、additive attention 不行 | |
| 講出 scale factor $1/\sqrt{d_k}$ 是為了防止 softmax 飽和導致梯度消失 | |
| 講出 multi-head 為什麼要切子空間而不是用單一大 head | |
| 有承認 additive attention 理論表達力可能略強,但平行化效率更重要 | |
| 收尾有把三個設計選擇串成 Transformer 的整體設計哲學 | |
| 加分項:延伸提到 positional encoding 或 RoPE 補回 Transformer 缺少的順序資訊 | |

## 延伸閱讀

- [Transformer Interview Questions — dsprep.com](https://dsprep.com/Interview-Questions/Transformers/) — 今日練習題的原始出處,收錄多道標註公司來源與難度的 Transformer 面試題,適合延伸練習更多變體提問。
- [How to Answer: Explain Transformers (Technical Interview Guide) — Naveen Bansal](https://medium.com/@bansal.naveen09/how-to-answer-explain-transformers-technical-interview-guide-67eb14aab50c) — 用面試口語示範怎麼把 encoder 架構、positional encoding、multi-head attention 講成一段連貫的回答,補今天「範例回答」段落的敘事節奏參考。
- [What is Tokenization in LLMs? BPE, SentencePiece, tiktoken in 2026 — FutureAGI](https://futureagi.com/blog/what-is-tokenization-llms-2026/) — 完整整理 2026 年各家模型實際使用的 tokenizer(GPT、Claude、Llama、Gemma、Qwen 等),補今天「Tokenization」段落沒展開的模型對照表。

## 參考資料

- [Transformer Interview Questions — dsprep.com](https://dsprep.com/Interview-Questions/Transformers/) — 今日練習題原題與難度標註、Anthropic/DeepMind 等研究實驗室高頻考題來源。
- [How to Answer: Explain Transformers (Technical Interview Guide) — Naveen Bansal](https://medium.com/@bansal.naveen09/how-to-answer-explain-transformers-technical-interview-guide-67eb14aab50c) — 對應「範例回答」段落的面試敘事結構參考。
- [What is Tokenization in LLMs? BPE, SentencePiece, tiktoken in 2026 — FutureAGI](https://futureagi.com/blog/what-is-tokenization-llms-2026/) — 對應「Tokenization」段落 BPE/WordPiece/SentencePiece 差異與模型對照表的來源。
- [Transformer Attention Mechanism in NLP — GeeksforGeeks](https://www.geeksforgeeks.org/nlp/transformer-attention-mechanism-in-nlp/) — 對應「Scaled dot-product attention」與「Multi-head attention」段落的機制說明來源。
