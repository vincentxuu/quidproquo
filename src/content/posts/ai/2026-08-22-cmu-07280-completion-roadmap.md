---
title: "CMU 07-280 全課總結：學會什麼、缺什麼，以及下一門怎麼選"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, learning-path, machine-learning, self-study]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 28
type: guide
tldr: "完成 07-280 不等於看完 24 篇導讀；至少要留下搜尋器、監督式模型、CNN／GPT-2 實驗與一個 RL＋MCTS 小系統，再依缺口選 07-380、10-301 或專題課。"
description: "總結 CMU 07-280 Spring 2026 的能力邊界、校外自學驗收方式，以及銜接 07-380、10-301 與進階 AI／ML 課程的選擇。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-completion-roadmap-en)

07-280 想做一件很難的事：把原本分散在 15-281 與入門 ML 課裡的搜尋、監督式學習、深度學習、NLP 與 reinforcement learning，壓進一門可以接 07-380 的共同地基。Spring 2026 又是首次完整班次，教材同時保留探索痕跡與版本風險。

所以「讀完整套導讀」不能當作完成課程。官方正式班用 exams、written/programming homework、pre-reading、recitation 與 participation 多面評量；校外讀者沒有相同 feedback chain，必須自己留下可檢查的 artifacts。這篇給出一套不冒充 CMU 學分的結業標準。

## 07-280 真正教的是整合介面

課程表面跨度很大，底層反覆出現四個介面：

1. **Representation**：state、feature、token、embedding 或 latent activation 如何承載問題。
2. **Objective**：path cost、constraint、loss、return 或 search value 到底在偏好什麼。
3. **Update／inference**：展開節點、更新參數、backup value 或 sampling 如何產生下一個候選。
4. **Evaluation**：正確性、optimality、generalization、reward 與 failure analysis 如何被觀察。

能把新方法放進這四格，比背完 A*、CNN、attention 與 Q-learning 的定義更有延展性。遇到 diffusion、RLHF 或 vision transformer 時，你仍能先問表示、目標、更新與評估，而不是等另一門課給你一張新架構圖。

## 校外結業要留下五個 artifacts

### 1. 一個可檢查的搜尋器

實作 UCS 與 A*，輸出展開順序、path cost 與失敗案例。至少準備一個 admissible heuristic 和一個故意違反條件的 heuristic，實際看最佳性何時消失。

### 2. 一份監督式學習比較

在同一 split 上比較 linear／logistic model、tree 與小型 neural network。除了分數，留下 learning curve、regularization 設定與錯誤類型。模型比較若沒有控制資料切分，就沒有可解釋性。

### 3. 一個 AlexNet 或 CNN 實驗

重做 frozen／unfrozen transfer learning，記錄 trainable parameters、訓練時間與 validation result。你不需要複製完整 ImageNet，但要能說清楚資料規模與 domain shift 如何影響決策。

### 4. 一個小型 GPT-style language model

從 tokenization、position encoding、causal mask 到 generation 跑通一條縮小路徑。保存 tensor-shape table、loss／perplexity curve，以及跨 temperature 的多樣本比較。只展示最好的一段文字不算 evaluation。

### 5. 一個 RL＋MCTS 小系統

在小遊戲裡先驗證 value backup 與 visit counts，再接 policy/value network 和 self-play。每一層都要有獨立測試；不要用「最後能下棋」掩蓋 search 或 target generation 的錯誤。

把五個 artifacts 放進同一個 repository，每個資料夾附 README：問題定義、執行方式、預期輸出、已知限制。這比收集五張完課截圖更接近 07-280 的學習責任。

## 這門課刻意沒有教完什麼

[官方 FAQ](https://www.cs.cmu.edu/~07280/)直接比較 07-280 與 10-301：07-280 多了 heuristic／adversarial search、CSP、GPU basics 與 MCTS；10-301 則會多走 k-NN、perceptron、PAC learning、PCA、clustering、ensembles、recommenders 與 MAP。這不是誰比較高階，而是 breadth 與 ML depth 的配置不同。

07-280 也不是完整的 modern generative AI curriculum。它用 GPT-2 建立 transformer 系統觀，卻不等於深入 covering instruction tuning、preference optimization、retrieval、diffusion、multimodal systems 或 large-scale distributed training。官方把其中部分列為 07-380 的 potential topics；在 Fall 2026 課程真正完成前，只能把它們視為可能方向，不能當成已交付內容。

## 下一門課怎麼選

### 選 07-380：需要第二層廣度與研究題目

如果五個 artifacts 都能自行解釋，下一步想接 logical agents、Bayes nets、game theory、generative models 或更深 AI ethics，07-380 是制度上的延伸。要注意它的 topics 設計可隨學期調整，選課前應重新查當期 syllabus。

### 補 10-301：ML 理論與經典方法有明顯缺口

若你能組模型，卻無法說明 generalization、MAP、PCA、clustering 或 ensemble methods，補 10-301 對應章節比重做整門 07-280 更有效率。CMU 正式學位規則與校外自學路徑不是同一件事；這裡談的是知識補洞，不是重複取得 prerequisite。

### 進專題課：已有清楚問題與 baseline

想走 NLP、vision 或 RL，先挑一個 artifact 擴成 project：定義 dataset／environment、baseline、metric 與 ablation。只有「我對 LLM 有興趣」還不足以進專題；能寫出預期失敗模式，才表示問題已經具體。

## 一個可執行的結業週

不要再看新影片。用七天整理既有成果：前兩天補齊搜尋與監督式模型測試；第三、四天重跑 CNN／GPT 實驗；第五天驗證 RL／MCTS；第六天寫每個 artifact 的 limitations；最後一天用空白紙畫出整門課從 search 到 self-play 的資料與控制流。

若其中一條畫不出來，就回到對應逐講，而不是從 Lecture 1 全部重看。07-280 的價值不在於把 AI 名詞都教一次，而在於讓你知道一個 AI system 的問題表示、學習訊號、推論程序與驗證責任如何互相牽動。

## 參考資料

- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)
- [CMU 07-280 課程總覽](/posts/ai/2026-08-22-cmu-07280-course-overview)
