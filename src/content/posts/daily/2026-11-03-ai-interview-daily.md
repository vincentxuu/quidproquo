---
title: "AI Engineer 面試日練 — 2026-11-03：Deep Learning & NLP"
date: 2026-11-03
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二主題 Deep Learning & NLP：從 Amazon 真實面試題拆解 scaled dot-product self-attention 的數學推導，再延伸到 BERT 跟 GPT 的預訓練目標差異。"
tldr: "今天的核心是把 self-attention 從公式講到工程判斷：Q/K/V 怎麼從輸入投影出來、為什麼要除以 √d_k（避免 softmax 梯度消失）、多頭注意力怎麼讓模型同時學不同種類的關係、causal mask 跟 padding mask 各解決什麼問題。再往上走到 BERT（MLM，雙向，適合理解類下游任務）跟 GPT（next-token prediction，單向，適合生成）的預訓練目標差異如何決定各自的下游用法。練習題取自 Amazon Software Engineer（Machine Learning）技術篩選輪的真實問法——完整推導 scaled dot-product self-attention 並比較 BERT 跟 GPT——陷阱是只會背 Attention(Q,K,V) = softmax(QK^T/√d_k)V 這個公式，答不出每一步為什麼存在。"
series:
  name: "AI Engineer 面試日練"
  order: 76
---

> 🌏 [English version](/posts/daily/2026-11-03-ai-interview-daily-en)

## 今日主題

星期二固定練 Deep Learning & NLP。今天選的題目是 self-attention 跟 Transformer——幾乎所有 LLM 相關職位的必考題,但多數人準備的方式是背公式、背架構圖,一被追問「為什麼要除以 √d_k」「BERT 跟 GPT 的預訓練目標差在哪裡,這個差異怎麼影響你選哪個做下游任務」就卡住。這類題目考的不是你會不會畫 Transformer 方塊圖,是你知不知道每個設計選擇在解決什麼問題——這正是 phone screen 到 onsite 都會出現的「數學推導 + 架構理解」組合題。

## 核心概念速記

### Scaled Dot-Product Self-Attention：每一步在解決什麼問題

Self-attention 把每個輸入 token 的 embedding 投影成三個向量——Query（Q,代表「我現在要找什麼資訊」）、Key（K,代表「我這裡有什麼資訊可以被找到」)、Value（V,代表「找到後實際拿走的內容」),三者都是輸入 embedding 乘上各自學出來的權重矩陣 W_Q／W_K／W_V。算分數的方式是當前 token 的 Q 跟序列裡每個 token 的 K 做內積,內積越大代表越相關;接著除以 √d_k 做縮放——如果 Q、K 的分量是均值 0、變異數 1 的獨立隨機變數,內積的變異數會等於 d_k,d_k 一大,分數的尺度就會炸開,把 softmax 推進梯度幾乎為零的飽和區,訓練會卡住,除以 √d_k 把變異數壓回 1 讓梯度維持穩定。最後把縮放後的分數丟進 softmax 正規化成總和為 1 的權重,再對所有 token 的 V 做加權平均,這就是這個 token 更新後、融合了上下文資訊的新表示。

```flow-diagram
{
  "title": "Scaled Dot-Product Self-Attention 的五個步驟",
  "lang": "zh-TW",
  "width": 520,
  "height": 650,
  "nodes": [
    {"id": "input", "label": "輸入 embedding", "x": 260, "y": 40, "w": 220},
    {"id": "qkv", "label": "投影出 Q／K／V", "x": 260, "y": 150, "w": 220},
    {"id": "score", "label": "Q·K 內積算分數", "x": 260, "y": 260, "w": 220},
    {"id": "scale", "label": "除以 √d_k 縮放", "x": 260, "y": 370, "w": 220, "tone": "accent"},
    {"id": "softmax", "label": "Softmax 正規化", "x": 260, "y": 480, "w": 220},
    {"id": "output", "label": "加權求和 V\n→ 輸出表示", "x": 260, "y": 600, "w": 220}
  ],
  "edges": [
    {"from": "input", "to": "qkv", "step": 1, "label": "W_Q／W_K／W_V 投影"},
    {"from": "qkv", "to": "score", "step": 2, "label": "逐 token 內積"},
    {"from": "score", "to": "scale", "step": 3, "label": "穩定梯度"},
    {"from": "scale", "to": "softmax", "step": 4, "label": "正規化成權重"},
    {"from": "softmax", "to": "output", "step": 5, "label": "加權平均 V"}
  ],
  "steps": [
    "輸入 token 的 embedding 分別乘上學出來的權重矩陣 W_Q、W_K、W_V，投影成 Query、Key、Value 三個向量。",
    "當前 token 的 Query 向量跟序列裡每個 token 的 Key 向量做內積，內積越大代表兩個 token 越相關。",
    "把內積分數除以 √d_k：d_k 越大，內積的變異數也越大，不縮放會把 softmax 推進梯度幾乎消失的飽和區，除以 √d_k 把變異數壓回 1 讓訓練穩定。",
    "縮放後的分數丟進 softmax，正規化成總和為 1、代表「該花多少注意力在每個 token 上」的權重。",
    "用這組權重對所有 token 的 Value 向量做加權平均，得到這個 token 融合上下文資訊後的新表示。"
  ],
  "caption": "簡化示意：單一注意力頭的計算流程，省略 multi-head 的平行拆分與 concat。"
}
```

### Multi-Head Attention：為什麼要拆成多個頭,不是算一次就好

單一個 attention function 只能在一個高維空間裡學一種關係模式,Multi-Head Attention 把 embedding 維度拆成幾個較小的子空間,每個子空間獨立跑一次 scaled dot-product attention、各自學出不同的 Q/K/V 投影矩陣,讓模型能同時捕捉不同種類的依賴關係——例如一個頭專注語法結構(主詞動詞配對),另一個頭專注語意相關性(同指涉詞)。所有頭的輸出最後 concat 起來再乘上一個輸出投影矩陣,合併回原本的維度。面試時常被追問:頭數變多,每個頭的維度會變小,是不是頭越多越好?答案是沒有,頭數跟每頭維度之間本身就是一個要調的超參數,頭太多、每頭維度太小反而學不到足夠細緻的模式。

### Causal Mask 跟 Padding Mask:兩種 mask 解決完全不同的問題

Padding mask 處理的是 batch 裡句子長度不一、補零（padding token）造成的問題——把 padding 位置對應的 attention 分數設成負無窮,softmax 後這些位置的權重會變成 0,避免模型把注意力浪費在沒有意義的填充 token 上,這個 mask 不管 encoder 還是 decoder 都需要。Causal mask（也叫 future mask）只用在 decoder 的自回歸生成場景——訓練跟推論時都要強制第 t 個位置只能看到第 1 到 t 個位置,看不到未來的 token,做法是把注意力矩陣裡代表「看向未來」的那些位置也設成負無窮。這兩種 mask 可以同時套用,混在一起不會互相干擾,因為都是在 softmax 之前把不該被看到的分數變成負無窮。

### BERT vs GPT:預訓練目標的差異決定了下游怎麼用

BERT 用 Masked Language Modeling（MLM）——隨機蓋掉輸入裡 15% 左右的 token,讓模型用雙向上下文（這個 token 前面跟後面的詞都看得到）去預測被蓋住的詞,這個雙向特性讓 BERT 特別適合需要「完整理解一段文字」的下游任務,像分類、NER、QA 的 span 抽取;但雙向這個特性也意味著 BERT 原生不適合直接拿來生成文字——它在訓練時從來沒有「只看過去、生成未來」的經驗。GPT 用純粹的 next-token prediction——每個位置只能看到它之前的 token（靠 causal mask 強制),去預測下一個 token,這個單向、自回歸的目標天生就是為生成任務設計的,代價是理解任務上少了雙向上下文的資訊。面試官常會追問:如果要做情感分類,你會選哪個?正確的思考路徑是 BERT 原生架構更貼近分類這種「看完整句話判斷一個標籤」的任務,但現代大型 GPT 系列模型靠規模跟 instruction tuning 已經能用 few-shot prompting 做到接近甚至超越微調 BERT 的效果——這反映的是「架構匹配度」跟「規模+訓練方式」兩種路線互相競爭,不是 GPT 架構本身不能做理解任務。

## 今日練習題

### 題目

Explain attention and Transformers：derive and explain scaled dot-product self-attention (Q/K/V, scaling factor, masking, complexity)，再解釋 Transformer 的 encoder-decoder 架構（residual connections、pre-norm vs post-norm、positional encoding），最後比較 BERT 跟 GPT 的預訓練目標、架構差異,以及這些差異如何影響 transfer learning 跟推論行為。

**來源**：Amazon Software Engineer（Machine Learning）面試技術篩選輪（整理自 PracHub 面試題庫）　**難度**：進階　**環節**：technical screen

### 拆解思路

1. **先釐清問題**：這題範圍很大,面試時值得先主動切分——「我會先推導 scaled dot-product attention 的數學,再講 encoder-decoder 怎麼疊起來,最後比較 BERT 跟 GPT,這樣可以嗎」,一方面展示你有結構化拆題的能力,另一方面給面試官機會在某一段深挖,不用整題平均用力。
2. **建立框架**：Q/K/V 從哪裡投影出來、內積代表什麼、為什麼要除以 √d_k、softmax 之後怎麼加權求和——這五步是整題的地基,地基沒講清楚,後面的 multi-head 跟 masking 都會變成空話。
3. **深入核心**：multi-head 解決「單一 attention 只能學一種關係模式」的限制;causal mask 跟 padding mask 分別解決「不能看未來」跟「不該看填充」兩個不同問題;residual connection 跟 layer norm 解決深層網路訓練時的梯度消失跟數值不穩定,pre-norm（norm 放在 sublayer 之前）在訓練深層模型時比 post-norm 更穩定,這是現代大型模型（如 GPT 系列）普遍採用 pre-norm 的原因;positional encoding 解決 self-attention 本身沒有位置概念的問題（互相對調兩個 token 的順序,attention 分數不會變,所以必須額外注入位置資訊)。
4. **收尾**：把 BERT／GPT 的比較收斂成一句判斷準則——「預訓練目標決定了模型對上下文的存取方式,雙向存取適合理解、單向自回歸適合生成,選哪個不是看哪個更先進,是看下游任務的資訊存取模式跟它匹不匹配」,再補一句延伸:「但近年規模化跟 instruction tuning 已經讓這個界線變模糊,這是面試官想聽到的、跟得上現況的觀點」。

### 範例回答（面試時可以這樣講）

> **先把數學地基講清楚**：Self-attention 的核心是幫每個 token 算出一個新的表示,方法是用它的 Query 向量跟序列裡所有 token 的 Key 向量做內積打分,分數代表相關性,內積出來的分數會先除以 √d_k 再丟進 softmax——這個縮放是因為如果 Q、K 的分量是獨立的均值 0 變異數 1 隨機變數,內積的變異數會等於 d_k,d_k 一大分數就會炸開,把 softmax 推進梯度幾乎消失的飽和區,除以 √d_k 把變異數壓回 1,訓練才穩定。softmax 之後得到的權重拿去對 Value 向量做加權平均,就是這個 token 融合上下文後的新表示。
>
> **Multi-head 跟 masking 是在補單一 attention 的限制**：一次 attention 只能在一個子空間學一種關係,所以 Multi-Head Attention 把維度拆成幾個子空間平行跑,每個頭學不同的 Q/K/V 投影,捕捉不同種類的依賴,最後 concat 起來投影回原維度。Masking 分兩種用途不一樣——padding mask 把補零位置的分數設成負無窮,避免浪費注意力在填充 token;causal mask 只用在自回歸生成,強制每個位置只能看到自己跟之前的位置,兩者都是在 softmax 之前把不該看到的分數變負無窮,可以同時套用不互相干擾。
>
> **BERT 跟 GPT 的差異要收斂成一個判斷準則**：BERT 用雙向 Masked Language Modeling,靠前後文一起預測被蓋住的詞,這個雙向存取特性讓它天生適合分類、NER 這類「看完整句話判斷」的理解任務;GPT 用單向自回歸的 next-token prediction,靠 causal mask 強制只看過去,這個單向特性天生對應生成任務。選哪個架構不是看哪個更先進,是看下游任務的資訊存取模式跟預訓練目標匹不匹配——不過我會補一句,現在規模夠大的 GPT 系列模型靠 instruction tuning 跟 few-shot prompting,已經能用同一個模型處理分類這類理解任務,這個界線在實務上已經沒有教科書講的那麼絕對了。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有正確定義 Q/K/V 怎麼從輸入投影出來,以及內積分數代表什麼 | |
| 有解釋為什麼要除以 √d_k（變異數會隨 d_k 增大、推 softmax 進飽和區梯度消失）,不是只背「有這一步」 | |
| 有區分 padding mask 跟 causal mask 各解決什麼不同問題,而不是混為一談 | |
| 有提到 multi-head 解決「單一 attention 只能學一種關係模式」的限制 | |
| 有正確比較 BERT（雙向 MLM，適合理解任務）跟 GPT（單向 next-token，適合生成）的預訓練目標差異，並連到下游用法 | |
| 加分：有提到 instruction tuning／規模化讓 BERT vs GPT 的任務界線在實務上變模糊,展現跟得上現況的觀點 | |

## 延伸閱讀

- [Mastering Transformers: The Ultimate AI Interview Prep Guide (2026) — Sundeep Teki](https://www.sundeepteki.org/advice/the-transformer-revolution-the-ultimate-guide-for-ai-interviews) — 完整拆解 scaled dot-product attention 每一步的數學推導與縮放原因，並點出 OpenAI、Google DeepMind 的面試官會深挖 attention 細節到什麼程度。
- [Understanding and Coding the Self-Attention Mechanism of Large Language Models From Scratch — Sebastian Raschka](https://sebastianraschka.com/blog/2023/self-attention-from-scratch.html) — 從零手刻 self-attention 的程式碼實作，適合用來驗證自己對 Q/K/V 計算流程的理解是否正確。

## 參考資料

- [Explain attention and Transformers — PracHub (Amazon, Software Engineer / Machine Learning)](https://prachub.com/interview-questions/explain-attention-and-transformers) — 本篇練習題的原始問法來源，列為 Amazon 技術篩選輪的真實面試題。
- [Mastering Transformers: The Ultimate AI Interview Prep Guide (2026) — Sundeep Teki](https://www.sundeepteki.org/advice/the-transformer-revolution-the-ultimate-guide-for-ai-interviews) — 對應「Scaled Dot-Product Self-Attention」一節的縮放因子數學原理（變異數分析）來源。
- [LLM Interview Series(3): Transformers Explained — Attention Is All You Need — DEV Community](https://dev.to/jackm_345442a09fb53b/llm-interview-series3-transformers-explained-attention-is-all-you-need-523o) — 對應「Multi-Head Attention」一節的平行子空間與輸出合併說明來源。
- [Transformer-Interview-Question.md — Wenqing-Machine_Learning_Blog (GitHub)](https://github.com/purepisces/Wenqing-Machine_Learning_Blog/blob/main/Machine-Learning-Interview-Questions/Transformer-Interview-Question.md) — 對應「Multi-Head Attention」一節的多頭注意力定義與 Encoder 子層結構說明來源。
- [100 NLP Questions & Answers | Attention part — Medium](https://medium.com/@milana.shxanukova15/100-nlp-questions-answers-attention-part-bf86e07251de) — 對應「BERT vs GPT」一節的 self-attention／cross-attention masking 差異與 BERT／GPT 預訓練目標對照來源。
