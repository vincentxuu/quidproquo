---
title: "ICL、SFT 與 RLHF：從改輸入到改參數｜CMU 10-423 第 11 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 14
draft: false
description: "分清 ICL、SFT、reward model 與 RLHF 各自改變什麼，並用算例驗收"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

第 11 堂沿著一條線走：先不改參數，只改輸入（in-context learning）；再改參數，先用示範回答做 SFT，再用偏好訓練 reward model，最後以強化學習最佳化 policy。前半要能分辨示例效應、格式效應與洩漏；後半要能把同一任務的示範、偏好與獎勵三種資料分清楚。

## In-context learning：示例如何改變預測

### 同一個模型，為什麼換提示就換答案

In-context learning（ICL）把任務說明與示例放進推論上下文，讓模型依目前看到的內容回答。與[LoRA](/posts/ai/2026-10-11-cmu10423-peft)不同，普通 ICL 不執行 optimizer step；權重相同，條件機率 p(y|prompt) 卻因 prompt 改變而不同。這一部分接續[解碼](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)，目標是設計能分辨格式效應、示例效應與洩漏的比較，而不是背 prompt 名稱。來源包含第 9 堂末段的 zero/few-shot 與第 11 堂 ICL。

[GPT-3 論文](https://arxiv.org/abs/2005.14165)使用 zero-shot、one-shot、few-shot 的任務設定。shot 數的是提供多少個完成的任務示例，不是 prompt 有幾句話。指令很長仍可能是 zero-shot；提供一組輸入與答案才是 one-shot。Chain-of-thought 又是另一個軸：示例是否包含推理過程，而非所有 few-shot 都是 CoT。

### 一個可控制的分類例子

以下自擬任務用虛構標籤，降低「模型早已知道正負標籤」的混淆。要求把影評分類成 A（喜歡）或 B（不喜歡），測試句固定為「節奏很慢，但我喜歡人物的細節」。Zero-shot prompt 只有標籤規則與測試句。Few-shot 加入「無聊到離場→B」與「雖然慢，角色很動人→A」。第二個示例把「慢」不必然等於負評的判斷放進上下文。

我們不能不跑模型就宣稱它一定回答 A。能確定的是：few-shot prompt 增加了一個與測試句相關的判斷示例。如果輸出由 B 變 A，還要做變式，才知道是否只是追隨最近標籤。把兩個示例的順序互換，其他內容不變；再保留 A/B 數量、換成不相似的影評。記錄預測、答案格式與每個 prompt 的 token 數，才能分開順序、相關性與成本。

### 為何示例可以有用，也可能誤導

Causal attention 讓測試位置讀到前面的示例。預訓練學到的模式辨識、格式延續與任務關聯都可能參與；「像在學」不能直接證明內部正在跑某個梯度演算法。提示文字也佔上下文與 prefill 計算，每次請求仍要付這個成本，除非系統有合法且有效的快取。

若示例都用「答案：A」結尾，模型可能學到輸出 A 的偏好，而不是影評判準。若示例包含測試集的原句與答案，那是資料洩漏，不是泛化提升。若檢索出最相似的已解題目，也要說明檢索與測試資料的分界，不能把最近鄰記憶誤稱為全新推理能力。

### 推理示例不是正確性的保證

CoT 示例可展示中間步驟，例如先指出「慢」是節奏、再看整體喜好。但模型產生流暢理由仍可能先猜答案再合理化。驗收應看答案是否符合事先定義的任務判準，並用反例測試：把句子改成「人物很細膩，但我看得很痛苦」，正確分類依整體不喜歡應為 B。若它只抓「細膩」就答 A，示例沒有教會所需規則。

### 變式練習與答案

固定權重，用十組示例提示測試同一批未見影評，這是微調嗎？不是；沒有參數更新。把示例答案換成互相矛盾的標籤，應期待什麼？無法預先保證某個輸出，合理的判準是敏感度與錯誤率變化，並檢查模型是否承認歧義。若要比較 ICL 與 SFT，必須使用相同測試資料，分開計算訓練成本與每次推論成本。後半的 SFT 與 RLHF 接著說明參數真的更新時，資料形式如何改變。

## SFT 與 RLHF：示範、偏好與獎勵如何接起來

### 三種資料，三種訓練訊號

[SFT 與 RLHF](https://arxiv.org/abs/2203.02155)不是兩個任意替換的模型名稱。SFT 用「問題、理想回答」教模型模仿；reward model 用「同一問題的兩個回答、哪個較好」學排序；強化學習階段用 reward model 評分模型新產生的回答。和前半的 ICL 不同，這三個階段都會更新權重。這一部分需要[語言模型訓練](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)的條件機率觀念，讀完要能把同一任務的三種資料列分清楚。

SFT 的回答序列 y=(y₁,…,y_T)，loss 是 −Σ log π(y_t|x,y_<t)。常見指令微調只計回答 token 的 loss，prompt token 只提供上下文；這是資料與實作選擇，不是所有語言模型訓練都一律如此。padding 應排除，EOS 是否納入則要與訓練目的一致。若 shift 錯一格，模型可能直接看見要預測的答案。

### 同一個客服問題走三階段

以下是本站自擬例子。問題是「退款還沒入帳怎麼辦？」示範回答為「先核對退款日期，超過約定處理期再聯絡客服」，這可作 SFT 的目標。為方便手算，把回答壓成兩個教學 token，正確 token 的條件機率分別為 0.5 和 0.25。序列機率為 0.125，總負對數 likelihood 約為 2.079；若採每 token 平均，則是 1.040。這個差別是 reduction，不能拿兩者直接比較成品質進步。

偏好資料另有回答 A「請提供退款日期以便查詢」與 B「保證今天一定入帳」。標註者偏好 A，不代表把 A 的 reward 人工指定為 1、B 指定為 0。Reward model 輸出兩個任意實數，透過 σ(r_A−r_B) 表示 A 勝出的機率。若 r_A=2、r_B=0，機率約 0.881；loss 約 0.127。兩個分數同時加 100，差與 loss 完全不變，因此偏好對本身不識別絕對獎勵尺度的平移。

### Reference 為什麼留在流程裡

模型若只追高 reward，可能找到 reward model 沒學好的區域，例如用長篇客套掩蓋不確定，得到高分卻沒有解決退款問題。典型 RLHF 用固定 reference policy 約束偏離，目標包含 E[r]−β KL(π||π_ref)。Reference 常由 SFT 模型複製；正在訓練的 policy 與固定 reference 用途不同，不能讓它們一起更新就仍說有固定錨點。

對單次抽樣回答，可以記錄 log π(y|x)−log π_ref(y|x) 作為 KL 相關訊號；單筆值可為負，不能把它當成必定非負的完整 KL。KL 非負是對分布取期望後的性質。PPO 另用 rollout 時的 old policy 比率與 clipping 控制更新，old policy 也不能與 reference 混為一個角色。

### 能學到偏好，仍要另外驗證事實

偏好標註不等於真實性的證明。如果評審都喜歡有自信的承諾，流程也可能強化錯誤保證。資料應明定退款條件、未知資訊的處理方式與評分規則，測試則留出新情境。訓練 loss 下降只能說較符合訓練訊號；實際正確性、拒答比例與語氣仍需各自檢查。

### 變式練習與答案

把 reward 分數改成 5 與 3，偏好機率仍為 0.881，因差仍為 2。若一份資料只含單一最佳回答，能直接訓練 Bradley–Terry 的成對比較嗎？不能，還缺比較對象與偏好標籤；可先作 SFT。若 reference 與 policy 初始相同，完整 KL 起初為零，但第一步後可能改變。接著讀[DPO](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion)，看偏好對如何省去獨立 reward model 與 rollout 迴圈。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2005.14165)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Primary paper](https://arxiv.org/abs/2203.02155)
