---
title: "Transformer Explainer：在瀏覽器裡拆開一個真的 GPT-2"
date: 2026-11-26
category: ai
type: guide
tags: [transformer, attention, gpt-2, visualization]
lang: zh-TW
tldr: "Transformer Explainer 是 Georgia Tech 做的互動式教學工具：瀏覽器裡跑一個真的 GPT-2 (small)，你打一句話，就能看到它從斷詞、embedding、12 層 attention 與 MLP，一路算到下一個 token 的機率；還能拉 temperature、切 top-k/top-p，看機率分布怎麼變。適合想搞懂 LLM 怎麼「接龍」、但不想先讀論文或程式碼的人。它只示範 GPT-2 的架構，現代模型的 RoPE、GQA 等改良要另外補。"
description: "介紹 Transformer Explainer：Polo Club 開發、CHI 2026 論文發表的互動式 Transformer 視覺化工具。說明它能看到什麼、適合誰、怎麼用一句話跑完一次預測，以及只涵蓋 GPT-2 架構的限制。"
draft: false
glossary:
  - term: "Logit"
    def: "模型最後一層對詞彙表裡每個 token 給出的原始分數，經過 softmax 才變成機率"
  - term: "Temperature"
    def: "抽樣前把 logit 除以的數值；小於 1 讓分布變尖、輸出更穩定，大於 1 讓分布變平、輸出更隨機"
---

> :globe: [English version](/posts/ai/2026-11-26-transformer-explainer-en)

讀 Transformer 的教材，最常卡在一件事：圖上畫著 Q、K、V、softmax、12 層 block，但你不知道「我打的這句話」在裡面到底變成了什麼。[Transformer Explainer](https://poloclub.github.io/transformer-explainer/) 把這段補起來：它在瀏覽器裡跑一個真的 GPT-2，你換一個字，畫面上每一層的數字就跟著重算。

這篇說明它能讓你看到什麼、適合誰、怎麼用一句話走完一次預測，以及看完之後還缺哪一塊。

## 它是什麼

Transformer Explainer 是 Georgia Tech [Polo Club](https://poloclub.github.io/) 做的開源教學工具（MIT 授權，[GitHub](https://github.com/poloclub/transformer-explainer)）。同一個實驗室之前做過 [CNN Explainer](https://poloclub.github.io/cnn-explainer/) 和 [GAN Lab](https://poloclub.github.io/ganlab/)，做法一樣：拿真的模型、真的資料，讓你在網頁上動手改。

它和一般圖解文章差在三件事：

- **模型是活的。** 頁面載入的是 GPT-2 (small)，1.24 億參數，改寫自 Karpathy 的 [nanoGPT](https://github.com/karpathy/nanoGPT)，轉成 [ONNX Runtime](https://onnxruntime.ai/) 格式在瀏覽器裡推論。第一次開會下載模型，之後存在瀏覽器的 IndexedDB，不用再抓。不用裝任何東西，也不用 GPU。
- **可以在不同深度之間切換。** 首頁是一張資料流總覽：輸入從左邊流進來，經過 embedding、重複的 Transformer block，到右邊變成機率。點開任一個元件，才展開矩陣運算與公式。
- **輸出是真的抽樣。** 按 Generate，模型預測的 token 會接到句尾，可以一直按下去，看早期的抽樣怎麼影響後面的預測。

```youtube
url: https://www.youtube.com/watch?v=TFUc41G2ikY
title: Transformer Explainer 官方示範影片
```

研究團隊把它寫成論文，[發表在 CHI 2026](https://dl.acm.org/doi/10.1145/3772318.3791725)（[arXiv 版](https://arxiv.org/abs/2408.04619)）。前一個兩頁版本在 IEEE VIS 2024 拿到最佳海報獎；論文寫到這時，工具已有超過 49 萬名使用者。

## 給誰用、要先會什麼

最適合三種人：

- **知道 ChatGPT 在「接龍」，但說不出接龍怎麼算的人。** 不用先懂線性代數，總覽頁就能看出大概。
- **天天在調 temperature、top-p，卻沒看過它們改變了什麼的工程師。** 拉滑桿、看分布變形，比讀 API 文件快。
- **要教別人的人。** 上課直接開網頁示範，學生不用架環境。

先備知識：知道「向量」和「矩陣相乘」是什麼，會比較好懂展開後的細節；不知道也能看懂總覽。想先補 attention 的直覺，可以讀本站的 [Transformer 與 Attention：模型怎麼決定該看哪些字](/posts/ai/2026-08-26-understanding-ai-models-transformer)。

## 打開之後會看到什麼

畫面從左到右，就是一個 token 被預測出來的完整路徑。捲到下面的圖會自動逐步播放，也可以用按鈕停在任一步。

```flow-diagram
{
  "title": "Transformer Explainer 畫面上的一次預測",
  "lang": "zh-TW",
  "width": 440,
  "height": 680,
  "nodes": [
    {"id": "input", "label": "你輸入的句子", "x": 150, "y": 50, "shape": "actor"},
    {"id": "embed", "label": "斷詞 + Embedding\n每個 token 768 維", "x": 150, "y": 170, "w": 220, "h": 60},
    {"id": "block", "label": "Transformer Block × 12\nattention → MLP", "x": 150, "y": 290, "w": 220, "h": 60, "tone": "accent"},
    {"id": "logit", "label": "線性層 + softmax\n50,257 個機率", "x": 150, "y": 410, "w": 220, "h": 60},
    {"id": "sample", "label": "temperature\ntop-k / top-p 抽樣", "x": 150, "y": 530, "w": 220, "h": 60},
    {"id": "next", "label": "下一個 token", "x": 150, "y": 635, "w": 160}
  ],
  "edges": [
    {"from": "input", "to": "embed", "step": 1, "label": "切成 token", "labelAt": [162, 112]},
    {"from": "embed", "to": "block", "step": 2, "label": "加上位置", "labelAt": [162, 232]},
    {"from": "block", "to": "logit", "step": 3, "label": "逐層更新", "labelAt": [162, 352]},
    {"from": "logit", "to": "sample", "step": 4, "label": "調整分布", "labelAt": [162, 472]},
    {"from": "sample", "to": "next", "step": 5, "label": "抽一個", "labelAt": [162, 584]},
    {"from": "next", "to": "input", "step": 6, "label": "接回句尾", "via": [[400, 635], [400, 50]], "labelAt": [388, 340], "labelSide": "left"}
  ],
  "steps": [
    "輸入的句子被切成 token，GPT-2 的詞彙表有 50,257 個 token",
    "每個 token 查表得到 768 維向量，再加上位置向量",
    "向量依序經過 12 個 Transformer block，每個 block 先做多頭 attention、再做 MLP",
    "最後的線性層給每個 token 一個 logit，softmax 轉成機率",
    "依 temperature、top-k、top-p 調整分布後抽出一個 token",
    "按 Generate，抽到的 token 接到句尾，再跑下一輪"
  ]
}
```

三個區塊，各自能點開：

| 區塊 | 點開後看到的 | 值得注意的數字 |
|---|---|---|
| **Embedding** | 斷詞結果、每個 token 的向量、位置向量怎麼加上去 | 詞彙表 50,257 × 768 維，光這張表就約 3,900 萬參數 |
| **Transformer Block** | Q／K／V 怎麼算、切成 12 個 head、遮住未來 token 的 attention 矩陣、MLP 先放大再縮回 | MLP 從 768 放大到 3,072 再縮回 768 |
| **Output Probabilities** | 每個候選 token 的 logit 與機率、temperature 與 top-k／top-p 怎麼改寫分布 | 機率加總為 1，抽樣只在留下來的候選裡發生 |

最值得花時間的是 attention。工具把 masked self-attention 拆成四步：點積算分數、縮放並遮掉右上三角、softmax、乘上 V。滑鼠移到某個 token 上，會標出它在注意前面哪些 token。遮罩那一步看一次就懂：模型預測下一個字時，只能看左邊。

官網對 Q／K／V 的比喻也很好記：**Query 是你打進搜尋框的字，Key 是每個搜尋結果的標題，Value 是點進去之後的內容。**

## 實際跑一次：用 temperature 看「創意」是什麼

官網預設的例句是 `Data visualization empowers users to`。論文的介面截圖裡，GPT-2 給 `create` 的機率是 20.87%，排在最前面。

預設設定是 temperature 0.8、top-k = 5，也就是只從前五名裡抽。接著做三件事，每件不到一分鐘：

1. **把 temperature 拉到 0.2。** 第一名幾乎吃掉全部機率，連按幾次 Generate，接出來的句子幾乎不會變。
2. **拉到 2.0。** 前五名的長條變得差不多高，每次按 Generate 接出來的字開始不一樣。
3. **把 k 拉到 50，或改用 top-p。** 候選變多，排很後面的 token 也有機會被抽到，句子越接越歪。

做完你會知道，temperature 不是什麼「創意開關」，它只做一件事：抽樣前把 logit 除以一個數字。值小於 1 讓高分的更高，大於 1 把差距壓平。API 裡的 `temperature`、`top_p` 就是在調這張分布圖。

## 這個做法有沒有用

論文做了一個 90 人的對照實驗：參與者隨機分成三組，分別用 Transformer Explainer、Jay Alammar 的 [The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/) 部落格文章，以及一支教學影片學同樣的內容，限時 45 分鐘，最後做同一份測驗。

| 組別 | 測驗平均正確率 |
|---|---|
| Transformer Explainer | 73.3% |
| 部落格文章 | 59.5% |
| 教學影片 | 61.9% |

互動組的測驗分數與使用體驗評分都明顯高於另外兩組；自評學習成果則只明顯高於部落格組，和影片組差不多。但論文自己也寫了三個限制：測驗是學完立刻考，沒有追蹤幾週後還記得多少；考的是概念，沒考數學細節；參與者大多是新手，老師和工程師可能會用不一樣的方式用它。所以結論只到「新手入門時，互動比讀文章、看影片更容易懂」，不能推到「用它就能學會 Transformer」。

## 限制：它教的是 GPT-2 時代的架構

GPT-2 是 2019 年的模型。它的骨架和現在的 LLM 相同，所以拿來入門很合適；但有幾個地方，現在的主流模型已經換掉了：

- **位置編碼**：GPT-2 用訓練出來的位置向量，現在多數模型改用 RoPE。
- **注意力**：GPT-2 每個 head 都有自己的 K、V；現在常見 GQA，讓多個 head 共用 K、V 來省記憶體。
- **正規化與 MLP**：GPT-2 用 LayerNorm 和 GELU；很多新模型改用 RMSNorm、SwiGLU，部分模型還把 MLP 換成 MoE。
- **規模**：輸入太長時畫面會很擠，論文也提到要在瀏覽器跑更大的模型，技術上還很難。

看完 Transformer Explainer，建議接著讀 [現代 Transformer：位置旋轉與 KV 共享改了甚麼](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)，補上這幾項改動。另一個缺口是它只示範文字模型，論文把 ViT、Whisper 這類其他模態列為之後的方向。

## 怎麼開始

- **直接用**：打開 [poloclub.github.io/transformer-explainer](https://poloclub.github.io/transformer-explainer/)。第一次會下載模型，網路慢時多等一下。
- **建議順序**：先看總覽和 Generate 幾次，再拉 temperature，最後才點開 attention。一開始就點開每一個元件，很容易迷路。
- **在自己電腦跑**：需要 Node.js 20 以上。

```bash
git clone https://github.com/poloclub/transformer-explainer.git
cd transformer-explainer
npm install
npm run dev
# 瀏覽器開 http://localhost:5173
```

- **想從程式碼的角度再看一次**：工具裡的模型來自 nanoGPT，可以接著讀 [Karpathy 的 nanochat、nanoGPT 與 llm.c](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c)，把畫面上的每個方塊對回幾十行 PyTorch。

## 參考資料

- [Transformer Explainer 官網](https://poloclub.github.io/transformer-explainer/)：互動工具與完整的架構說明文
- [poloclub/transformer-explainer](https://github.com/poloclub/transformer-explainer)：原始碼、本機執行方式、MIT 授權
- [Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation](https://arxiv.org/abs/2408.04619)：CHI 2026 論文，含設計目標、實作與 90 人使用者研究（[ACM 版](https://dl.acm.org/doi/10.1145/3772318.3791725)）
- [官方示範影片](https://www.youtube.com/watch?v=TFUc41G2ikY)
- [The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/)：使用者研究中當作對照組的部落格文章
- [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)：工具所用 GPT-2 模型的來源
- [Transformer 與 Attention：模型怎麼決定該看哪些字](/posts/ai/2026-08-26-understanding-ai-models-transformer)：本站的 attention 入門
- [現代 Transformer：位置旋轉與 KV 共享改了甚麼｜CMU 10-423 第 4 堂](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)：GPT-2 之後的架構改良
