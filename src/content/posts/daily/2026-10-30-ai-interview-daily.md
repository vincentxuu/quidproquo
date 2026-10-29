---
title: "AI Engineer 面試日練 — 2026-10-30：Coding"
date: 2026-10-30
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五回到 ML-flavored coding：Mistral AI 面試官給一組 logits，要你當場用 NumPy 寫出 greedy、top-k、top-p 三種 decoding，練的是機率分布怎麼篩、怎麼重新正規化。"
tldr: "今天的練習題取自 270 篇真實面試回報整理出的 Mistral AI 面試題：『給一個 toy language model 的 logits，用 NumPy 實作 greedy、top-k、top-p 三種 decoding』。核心不是背 softmax 公式，是講得出三個關鍵決定——exp 前要先減最大值避免 overflow、top-k 跟 top-p 篩選後都要重新正規化機率，以及 top-p 的候選集合大小是隨分布動態變的，不是固定數字。"
series:
  name: "AI Engineer 面試日練"
  order: 72
---

> 🌏 [English version](/posts/daily/2026-10-30-ai-interview-daily-en)

## 今日主題

星期五繼續練 Coding，今天的子類型是「decoding 策略的手刻實作」——面試官給你一組未經處理的 logits，要你當場用 NumPy（不能叫 `torch.topk` 或 `scipy.special.softmax` 打發)把 greedy、top-k、top-p 三種取樣方式寫出來。這類題目在 Mistral AI 的面試裡出現頻率最高,因為它們想看的是「你是不是真的懂模型內部在做什麼」,而不是只會呼叫 `model.generate()`。

這題同時考兩種能力：數值穩定性（softmax 的 overflow 問題）跟機率分布操作（篩選後要不要重新正規化、用什麼資料結構找門檻）。對 AI Engineer 來說,這是最容易被問到、也最容易因為漏掉一個細節就被打回票的題型,因為表面上看起來只是「寫幾行 NumPy」,但魔鬼都在算法邊界上。

## 核心概念速記

```diagram
title: 從 logits 到下一個 token 的三種取樣路徑
desc: logits 先做數值穩定的 softmax，再依 greedy、top-k 或 top-p 三種策略篩選候選分布，篩選後都要重新正規化才能抽樣，最後統一寫回序列。
caption: 簡化示意：實際實作還要處理 batch 維度與 temperature。
---
<svg viewBox="0 0 720 480">
  <path class="dg-line" d="M360 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 108V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 268V300" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456 224H520" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M264 224H200" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 348V392" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 256V392Q612 400 604 400H364" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M108 256V392Q108 400 116 400H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 400V420" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="360" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="264" y="60" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="84" text-anchor="middle" dominant-baseline="central">softmax（先減最大值）</text>
  </g>

  <g>
    <path class="dg-box" d="M360 180L456 224L360 268L264 224Z"/>
    <text class="dg-label" x="360" y="214" text-anchor="middle" dominant-baseline="central">怎麼選下一個 token？</text>
    <text class="dg-sub" x="360" y="236" text-anchor="middle" dominant-baseline="central">greedy／top-k／top-p</text>
  </g>

  <g>
    <rect class="dg-box" x="264" y="300" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="324" text-anchor="middle" dominant-baseline="central">greedy：argmax</text>
  </g>

  <g>
    <rect class="dg-box" x="520" y="192" width="200" height="64" rx="6"/>
    <text class="dg-label" x="620" y="214" text-anchor="middle" dominant-baseline="central">top-k 篩選</text>
    <text class="dg-sub" x="620" y="236" text-anchor="middle" dominant-baseline="central">重新正規化後抽樣</text>
  </g>

  <g>
    <rect class="dg-box" x="0" y="192" width="200" height="64" rx="6"/>
    <text class="dg-label" x="100" y="214" text-anchor="middle" dominant-baseline="central">top-p 篩選</text>
    <text class="dg-sub" x="100" y="236" text-anchor="middle" dominant-baseline="central">重新正規化後抽樣</text>
  </g>

  <circle class="dg-dot" cx="360" cy="400" r="4"/>

  <g>
    <rect class="dg-box dg-box--accent" x="264" y="420" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="444" text-anchor="middle" dominant-baseline="central">輸出 token，寫回序列</text>
  </g>

  <text class="dg-edge" x="414" y="200" text-anchor="middle" dominant-baseline="central">greedy</text>
  <text class="dg-edge" x="488" y="212" text-anchor="middle" dominant-baseline="central">top-k</text>
  <text class="dg-edge" x="232" y="212" text-anchor="middle" dominant-baseline="central">top-p</text>
</svg>
```

### Softmax 的數值穩定性

面試第一步幾乎都會被盯：直接對 logits 取 `exp` 再正規化，數值一大就會 overflow 成 `inf`。標準寫法是先減掉這一行（或這個 batch）的最大值再取 `exp`，數學上結果不變，因為分子分母同時乘上 `exp(-max)` 會互相抵消，但浮點數的表示範圍就安全多了。

### Greedy decoding

每一步都直接選機率最高的 token（`argmax`），實作最簡單，但生成結果是確定性的，重複的開頭會一路放大成重複的句子（degenerate repetition），所以生產環境很少單獨用它，通常只用在需要可重現結果的除錯或評測場景。

### Top-k 取樣

把機率排序後只留前 k 大，其餘位置的機率設為 0，再對留下來的機率重新正規化（讓它們加總等於 1）才能抽樣，不然抽到的機率分布是錯的。k 是固定值,對分布很尖（模型很確定)跟很平(模型很不確定)的位置給一樣大小的候選集合,這是它最大的弱點。

### Top-p（nucleus）取樣

把機率從大到小排序後累加,累加到剛好超過門檻 p 的那個位置為止,把這個「核心」以外的機率歸零後重新正規化再抽樣。候選集合大小會隨分布形狀自動變化：模型很確定時核心可能只有 1-2 個 token,模型猶豫時核心會自動放大,這正是它比 top-k 更常被現代推理服務預設採用的原因。

### 排序成本與實作取捨

top-k 可以用 `np.argpartition`（平均 O(n)）取前 k 大再在小範圍內排序,不必對整個字典排序;top-p 理論上需要先排序才能累加（O(n log n))，字典大小動輒數萬到十幾萬，排序成本在高吞吐推理服務裡並不是免費的，實務上常見的優化是先用近似門檻或預先截斷到較小的候選集合，再做精確的 top-p。

## 今日練習題

### 題目

給你一個 toy language model 輸出的一維 logits 陣列（下一個 token 在整個字典上的未正規化分數），用 NumPy 實作三個函式：`greedy_decode(logits)`、`top_k_decode(logits, k, rng)`、`top_p_decode(logits, p, rng)`，各自回傳抽樣到的 token index。禁止呼叫 PyTorch／TensorFlow 或任何現成的 sampling API。

**來源**：Mistral AI onsite（經 270 篇公開面試回報整理後收錄，mid-level 最常見）　**難度**：中等　**環節**：onsite coding

### 拆解思路

1. **先釐清問題**：logits 是 1D 還是要處理 batch？要不要先套用 temperature？`k`、`p` 的邊界值（`k` 大於字典大小、`p` 接近 0 或 1）要怎麼處理？面試官通常會說「先寫單一序列版本，batch 當加分題」。
2. **建立框架**：所有三種策略都共用同一個 `softmax(logits)` 前處理（先減最大值），差異只在抽樣前要不要篩選候選集合，以及篩選後要不要重新正規化。把這個共用步驟抽出來寫成一個函式，三個 decode 函式都呼叫它。
3. **深入核心**：top-k 用 `np.argpartition` 找前 k 大的 index（不用對全陣列排序），把其餘位置的機率設 0 後重新正規化；top-p 要先排序、取累積和 `np.cumsum`，用 `np.searchsorted` 或布林遮罩找到剛好超過 p 的截點，同樣歸零＋重新正規化。最大的陷阱是忘記重新正規化就直接拿篩選後的機率去 `np.random.choice`，這樣抽樣機率是錯的。
4. **收尾**：主動提一個邊界case（例如 `p` 設得太小導致候選集合只剩 1 個、`k` 大於字典大小時該退化成對全分布抽樣）並說明怎麼測試正確性——例如用已知分布跑大量次數看抽樣頻率是否收斂到理論機率。

### 範例回答（面試時可以這樣講）

> **先講共用的部分**：我會先寫一個 `_softmax(logits)`，裡面先做 `logits - logits.max()` 再取 `exp`，避免大的 logits 直接 overflow。這個函式被三個 decode 函式共用，確保數值穩定性只需要寫一次、測一次。
>
> **greedy 最簡單**：直接 `np.argmax(logits)`，甚至不需要先做 softmax，因為 argmax 在單調遞增的 softmax 轉換前後結果不變，這樣可以省掉一次沒必要的計算。
>
> **top-k 我會用 `np.argpartition(probs, -k)[-k:]` 找出前 k 大的 index，而不是對整個字典排序**——字典可能有幾萬個 token，排序是 O(n log n)，argpartition 平均只要 O(n)。拿到這 k 個 index 後，我建一個跟原陣列同形狀、初始全 0 的機率陣列，只在這 k 個位置填回原始機率，再除以這些機率的總和做重新正規化，最後用 `np.random.choice` 依這個正規化後的分布抽樣。**top-p 的邏輯類似，但篩選條件不是固定數量**：先把機率從大到小排序，用 `np.cumsum` 算累積和，找到第一個累積和超過 p 的位置當作截點，截點以外的機率歸零、重新正規化、抽樣。我會特別測試 p 設得很小（例如 0.01）時至少要保留一個 token，不然會抽到空集合出錯。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| softmax 前有先減最大值，講清楚為什麼這樣做不改變結果 | |
| top-k／top-p 篩選後都有講到「要重新正規化才能抽樣」 | |
| top-k 用 argpartition 而不是對整個字典排序，並講出複雜度差異 | |
| top-p 的候選集合大小會隨分布動態變化，不是固定數字 | |
| 至少講一個邊界 case（p 太小、k 超過字典大小）並說怎麼處理 | |
| 加分項：提到怎麼測試抽樣正確性（大量抽樣看頻率是否收斂到理論機率） | |

## 延伸閱讀

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 270 筆真實面試回報按公司整理，今天的題目跟「Mistral 面試官愛考模型內部怎麼跑」的觀察都出自這篇
- [Implement a Byte-Pair Encoding Tokenizer](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-tokenizer-threshold-training-encode-and-decode) — 另一題同屬「手刻 tokenizer／decoding」類型的真實 onsite 考題，附完整的歧義澄清問題清單，練完今天這題可以接著挑戰
- [LLM top_p and top_k sampling explained](https://www.krishnaik.in/ai-tutorials/llm-fundamentals/top-p) — top_p 跟 top_k 的機率篩選邏輯用互動範例講解，適合對照今天寫的程式碼驗證理解

## 參考資料

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 今日練習題「給 logits 用 NumPy 實作 greedy、top-k、top-p decoding」的原始來源（Mistral AI onsite）
- [Implement a Byte-Pair Encoding Tokenizer](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-tokenizer-threshold-training-encode-and-decode) — 「手刻 decoding／tokenizer 類題目常考邊界 case」判斷的佐證來源
- [GitHub: ai-engineering-interview-questions](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 「實作 top-k、top-p、temperature sampling」是公開題庫裡反覆出現的題型，佐證今天的題目不是單一面試官的偏好
