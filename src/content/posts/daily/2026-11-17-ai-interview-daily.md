---
title: "AI Engineer 面試日練 — 2026-11-17：Deep Learning & NLP"
date: 2026-11-17
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二主題 Deep Learning & NLP：從真實面試題拆解 RoPE（旋轉位置編碼）怎麼用旋轉角度把絕對位置變成相對距離，以及它為什麼取代了 sinusoidal／learned 絕對位置編碼。"
tldr: "今天的核心是 RoPE 怎麼解決絕對位置編碼的兩個老問題：self-attention 本身對順序不敏感，而加在輸入上的絕對位置向量又在訓練長度之外表現很差。RoPE 不加向量，是把 Q、K 的每一對維度依位置旋轉一個角度，兩個旋轉後向量的內積只跟兩個位置的差距有關，跟絕對位置無關；它只作用在 Q／K、不碰 V 或輸入 embedding，也不需要額外學習參數。練習題問的是「RoPE 怎麼運作、為什麼比 learned positional embedding 更好」，陷阱是只會背「用旋轉矩陣」卻講不出為什麼旋轉之後的內積會變成相對距離的函數。"
series:
  name: "AI Engineer 面試日練"
  order: 90
---

> 🌏 [English version](/posts/daily/2026-11-17-ai-interview-daily-en)

## 今日主題

星期二固定練 Deep Learning & NLP。這幾週已經練過 self-attention 的推導、BERT 跟 GPT 的預訓練目標差異、長文件造成的 quadratic attention OOM,今天把範圍收到一個常被輕描淡寫的環節——位置編碼。幾乎每個 LLM 相關職位都會在某個時間點問到「Transformer 怎麼知道 token 的順序」,而現代大模型(LLaMA、GPT-NeoX 系列)幾乎都選了同一個答案:RoPE(Rotary Position Embedding,旋轉位置編碼)。這題考的不是背出「RoPE 用旋轉矩陣」這句話,是你知不知道旋轉之後為什麼內積會剛好變成兩個 token 距離的函數——這正是它取代 sinusoidal 跟 learned 絕對位置編碼的根本原因。

## 核心概念速記

### Self-attention 本身對順序「無感」,所以才需要額外注入位置資訊

Self-attention 用同一組權重去比較序列裡任意兩個 token,不管它們在序列的哪個位置,算出來的 attention 分數都只跟兩個 token 的內容有關。這代表如果把輸入打亂重排,輸出也只是跟著重排,模型本身分不出「這是第一個字」跟「這是最後一個字」的差別。要讓模型知道順序,就必須額外注入位置訊息——早期的做法是在輸入 embedding 上加一個絕對位置向量(固定的 sinusoidal 或可學習的 learned embedding),這類方法的問題是,一旦推論時的序列長度超過訓練時見過的長度,這些絕對位置向量就落在模型沒學過的區域,效果會明顯掉下去。

### RoPE 的做法:不是加向量,是把 Q、K 旋轉一個跟位置成比例的角度

RoPE 换了一個完全不同的切入點:它不在輸入上加任何東西,而是在每一層 attention 計算 Q、K 的時候,把 Q、K 向量的每一對維度(2 維一組,一個高維向量會被拆成 d/2 組)旋轉一個角度,角度大小等於「位置 × 這一組維度的固定頻率」。位置 m 的 token 旋轉 m×θ,位置 n 的 token 旋轉 n×θ。因為兩個 2 維旋轉矩陣的內積,恰好等於用「兩個旋轉角度的差」重新做一次旋轉,所以位置 m 的 Q 跟位置 n 的 K 做內積之後,算出來的分數只跟 (m − n) 這個相對距離有關,跟 m、n 各自的絕對值完全無關。這就是為什麼 RoPE 被歸類為「相對位置編碼」,即使它的實作方式(逐層旋轉 Q/K)看起來很像絕對位置編碼。

```flow-diagram
{
  "title": "RoPE 怎麼把絕對位置變成相對距離",
  "lang": "zh-TW",
  "width": 520,
  "height": 650,
  "nodes": [
    {"id": "input", "label": "Q、K 向量\n(每一層都重算)", "x": 260, "y": 40, "w": 240},
    {"id": "pair", "label": "拆成 d/2 組\n每組 2 維", "x": 260, "y": 150, "w": 240},
    {"id": "rotate", "label": "依位置旋轉\nQ 轉 m×θ，K 轉 n×θ", "x": 260, "y": 260, "w": 240, "tone": "accent"},
    {"id": "dot", "label": "旋轉後的 Q·K 內積", "x": 260, "y": 370, "w": 240},
    {"id": "relative", "label": "分數只跟 (m－n) 有關\n跟絕對位置無關", "x": 260, "y": 480, "w": 240},
    {"id": "score", "label": "進 softmax\n→ attention 權重", "x": 260, "y": 600, "w": 240}
  ],
  "edges": [
    {"from": "input", "to": "pair", "step": 1, "label": "每對維度各自旋轉"},
    {"from": "pair", "to": "rotate", "step": 2, "label": "角度 = 位置 × 該組頻率"},
    {"from": "rotate", "to": "dot", "step": 3, "label": "兩個旋轉矩陣的內積"},
    {"from": "dot", "to": "relative", "step": 4, "label": "旋轉角度相減"},
    {"from": "relative", "to": "score", "step": 5, "label": "正規化成權重"}
  ],
  "steps": [
    "每一層的 Q、K 向量先被拆成 d/2 組，每組 2 個維度，當成平面上的一個箭頭。",
    "位置 m 的 token，它的每一組維度旋轉 m×θ（θ 依該組決定一個固定頻率）；位置 n 的 token旋轉 n×θ。",
    "拿旋轉後的 Q 跟旋轉後的 K 做內積：兩個 2 維旋轉矩陣的內積，數學上等於用角度差 (m-n)×θ 重新旋轉一次。",
    "所以算出來的內積分數只跟 (m－n) 這個相對距離有關，跟 m、n 各自的絕對位置無關。",
    "這組分數照常丟進 softmax 正規化成 attention 權重，後續流程跟標準 self-attention完全一樣。"
  ],
  "caption": "簡化示意：單一一組 2 維旋轉的計算邏輯，真實向量會有 d/2 組，各組用不同旋轉頻率。"
}
```

### 每一對維度的旋轉頻率不同,才有「長期衰減」的效果

真實的 Q、K 向量有幾十到幾百維,RoPE 把它拆成 d/2 組 2 維配對,每一組用不同的旋轉頻率(高頻的那幾組轉得快,低頻的那幾組轉得慢,跟 sinusoidal encoding 用不同波長堆疊的精神類似)。這個設計帶來一個面試官很愛追問的性質:距離越遠的兩個 token,它們內積的上界會傾向變小——也就是說,RoPE 本身帶有一種「讓模型天然偏好關注比較近的 token」的歸納偏置(inductive bias),雖然遠距離的注意力仍然可以被學出來,但這個長期衰減(long-term decay)特性讓模型在訓練初期更容易學到局部結構。另一個常被考的細節是:RoPE 只套用在 Q 跟 K 上,從來不套用在 V 或者最原始的輸入 embedding 上——因為位置資訊只需要影響「誰跟誰該有多少關聯」這個分數計算,不該污染「實際要被加權平均的內容」。

### RoPE 不是唯一解,但是目前開源大模型的預設選擇

跟 RoPE 同時期出現、解決同一個問題的還有 ALiBi——它不旋轉向量,而是直接在 softmax 之前,對 attention 分數減去一個跟距離成比例的固定懲罰值,一樣不需要學習參數,實作更簡單。兩者的共同點是都讓分數只跟相對距離有關,都不像 sinusoidal／learned 絕對編碼那樣在訓練長度之外明顯失準。但實務上 RoPE 在近幾年的開源模型(GPT-J、GPT-NeoX、LLaMA 系列)採用率更高,也延伸出更多處理長 context 的技巧——例如 LLaMA 3 把 RoPE 的基礎頻率從 10000 調高到 500000,讓旋轉的「時鐘」轉得更慢,藉此支援更長的 context window。面試官如果追問「RoPE 跟 ALiBi怎麼選」,正確的框架是:兩個都是相對位置編碼,RoPE 目前生態系支援更完整、延伸方法更多,ALiBi 勝在實作最簡單、論文裡的外推實驗做得最扎實,選哪個很大程度取決於要接哪個既有的開源權重跟訓練棧。

## 今日練習題

### 題目

How does Rotary Position Embedding (RoPE) work, and why is it preferred over learned positional embeddings?

**來源**：amitshekhariitbhu/ai-engineering-interview-questions（GitHub AI Engineering 面試題庫）　**難度**：中等　**環節**：technical screen / onsite architecture deep-dive

### 拆解思路

1. **先釐清問題**：面試官問的範圍可能只要「講出 RoPE 怎麼運作」,也可能想聽「跟其他位置編碼方法的比較」,開頭可以主動確認——「我先講 RoPE 本身的旋轉機制跟為什麼能編碼相對位置,再補為什麼它比 learned 絕對編碼好,這樣可以嗎」,一方面定範圍,一方面留空間讓面試官往他想深挖的方向問。
2. **建立框架**：先回到 self-attention 本身沒有順序概念這個起點,再把位置編碼分成「絕對」(sinusoidal、learned)跟「相對」(RoPE、ALiBi)兩條路線,講清楚 RoPE 落在哪一條路線、為什麼。
3. **深入核心**：技術上最關鍵的一步是旋轉矩陣的內積性質——兩個旋轉過的向量做內積,結果只跟旋轉角度差有關,這一步沒講清楚,「RoPE 編碼相對位置」這句話就只是背答案。接著補 d/2 組不同頻率帶來的長期衰減,跟「只套在 Q/K、不碰 V」這個常被忽略的細節。
4. **收尾**：把「為什麼比 learned embedding 好」收斂成一句判斷準則——「learned 跟 sinusoidal 絕對編碼在訓練長度之外會明顯失準,因為模型沒見過那些位置向量;RoPE 把位置訊息做成跟距離相關、可以外推的形式,所以在長 context 場景下更穩」,再補一句延伸:「這也是為什麼近幾年開源大模型幾乎都收斂到 RoPE 或 ALiBi 這兩種相對編碼,而不是回頭用絕對編碼」。

### 範例回答（面試時可以這樣講）

> **先講為什麼需要位置編碼**：Self-attention 本身對 token 的順序不敏感——同一組權重算任意兩個 token 的關聯度,跟它們在序列裡的位置無關,打亂輸入只會打亂輸出,模型分不出「第一個字」跟「最後一個字」。原始 Transformer 跟後來的 learned embedding 都是在輸入上額外加一個絕對位置向量,但這類方法有個共同弱點:一旦推論時的序列長度超過訓練時見過的範圍,這些位置向量就落在模型沒學過的區域,效果掉得很明顯。
>
> **RoPE 換了做法,把位置編碼搬進 attention 內部**：它不加向量,而是在每一層計算 Q、K 的時候,把向量拆成 d/2 組 2 維配對,每組依照 token 的位置旋轉一個角度——位置 m 轉 m×θ,位置 n 轉 n×θ,每組用不同的旋轉頻率。關鍵性質是,兩個旋轉矩陣的內積等於用角度差重新旋轉一次,所以位置 m 的 Q 跟位置 n 的 K 做內積,算出來的分數只跟 (m－n) 這個相對距離有關,跟兩者的絕對位置無關——這就是為什麼它被歸類為相對位置編碼。不同組的旋轉頻率不同,還帶來一個長期衰減的特性,讓模型天然對近距離的 token 有比較強的 inductive bias。
>
> **這就是它比 learned embedding 好的原因**:learned 絕對編碼的每個位置都是獨立學出來的向量,訓練長度之外完全沒見過;RoPE 的位置訊息是用旋轉角度這種可以無限外推的連續函數表示,天生就比較適合長 context 場景,這也是為什麼 LLaMA 系列會透過調高旋轉基礎頻率來支援更長的 context window,而不是重新設計一套位置編碼。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚 self-attention 本身對順序不敏感,所以才需要額外的位置編碼 | |
| 有正確描述 RoPE 的機制:拆成 d/2 組 2 維配對,依位置旋轉一個角度 | |
| 有解釋為什麼旋轉後的內積只跟相對距離 (m－n) 有關,而不是只背「RoPE 用旋轉」 | |
| 有提到 RoPE 只套用在 Q、K,不套用在 V 或輸入 embedding | |
| 有講出跟 learned／sinusoidal 絕對編碼的差異:外推能力跟訓練長度之外的表現 | |
| 加分：有提到 ALiBi 作為另一種相對位置編碼,或 LLaMA 調高旋轉基礎頻率支援長 context 的實務延伸 | |

## 延伸閱讀

- [Why do transformers need positional information, and how does RoPE encode it? — TensorTonic](https://www.tensortonic.com/llm-internals/rope) — 用一句話總結 RoPE 的核心機制,並連到可以實作驗證的練習題,適合確認自己講出口的版本有沒有漏掉關鍵字。
- [How LLMs Read Text: Tokenization, Embeddings and Positional Encoding — safeguard.sh](https://safeguard.sh/resources/blog/llm-tokenization-embeddings-positional-encoding-explained) — 從 sinusoidal、learned 一路講到 RoPE、ALiBi 的完整數學推導,附帶 2 維旋轉的手算範例,適合想徹底搞懂內積性質的人。

## 參考資料

- [How does Rotary Position Embedding (RoPE) work, and why is it preferred over learned positional embeddings? — amitshekhariitbhu/ai-engineering-interview-questions (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 本篇練習題的原始問法來源，收錄於這個 GitHub AI Engineer 面試題庫。
- [Why do transformers need positional information, and how does RoPE encode it? — TensorTonic](https://www.tensortonic.com/llm-internals/rope) — 對應「核心概念速記」第一、二節關於絕對編碼的外推限制與 RoPE 基本機制的說明來源。
- [How LLMs Read Text: Tokenization, Embeddings and Positional Encoding — safeguard.sh](https://safeguard.sh/resources/blog/llm-tokenization-embeddings-positional-encoding-explained) — 對應「核心概念速記」第二、三、四節關於旋轉矩陣內積性質、長期衰減、ALiBi 比較與 LLaMA 3 旋轉基礎頻率調整的數學與實證依據。
- [RoFormer: Enhanced Transformer with Rotary Position Embedding — Su et al., 2021 (arXiv 2104.09864)](https://arxiv.org/abs/2104.09864) — RoPE 的原始論文,本篇旋轉矩陣推導與長期衰減性質均依據此文獻。
