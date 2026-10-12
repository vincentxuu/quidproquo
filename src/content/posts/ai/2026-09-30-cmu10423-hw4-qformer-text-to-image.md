---
title: "Q-Former 文生圖驗收：凍結底座仍要傳梯度｜CMU 10-423 作業 4"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, multimodal, text-to-image, diffusion-transformer, vision-language-model]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 20
tldr: "以自擬數值例子驗收梯度、資料與評估，並保留原作業規格。"
description: "CMU 10-423 作業教學重寫：先追完整例子，再以變式與答案檢查實作；不提供官方題目解答。"
draft: false
glossary:
  - term: "Q-Former"
    aliases: ["Querying Transformer", "Query Former"]
    definition: "用一組固定數量、可學習的 query 向量，透過 cross-attention 從另一個模型的任意長度輸出中抽取資訊，再投影成下游模型需要的格式。BLIP-2 用它把凍結的影像編碼器接到凍結的 LLM。"
    context: "HW4 反過來用：query 從 GPT-2 的文字隱藏狀態抽資訊，輸出給 DiT 當條件向量。"
    links:
      - label: "BLIP-2 (Li et al., 2023)"
        url: "https://arxiv.org/abs/2301.12597"
  - term: "adaLN"
    aliases: ["Adaptive LayerNorm", "AdaLN"]
    definition: "DiT 注入條件的方式：把條件向量（例如類別 embedding）送進一個小網路，輸出每一層 LayerNorm 的 scale 與 shift，而不是把條件當成 token 放進序列。"
    context: "HW4 的預訓練 DiT 原本用 10 個類別 embedding 驅動 adaLN，作業把它換成 Q-Former 輸出的逐層向量。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開作業handout、starter code與相關投影片整理；數值例子為本站教學補充。

## 橋接器要同時通過三種檢查

官方 HW4 讓學生在凍結 GPT-2 與 DiT 的設定中實作文字條件橋接。本篇使用自擬 toy 流程教驗收，原作業規格與引用保留在下方，沒有提供官方題目解答。先讀[Q-Former](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws)與[latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion)：文字表示、query 條件與 noisy image latent 是不同張量。

三個檢查是維度接通、梯度接通、文字控制生效。Shape 正確只代表運算能跑；loss 下降只代表某條可訓練路徑有用；生成看起來漂亮也可能忽略文字。要把三者獨立列成驗收表。

## 自擬的一次條件去噪

批次有兩筆 caption，每筆四個有效文字 token，GPT-2 假定輸出寬度 6，文字 tensor 為 2×4×6。三個 learned query 的寬度為 4，經 cross-attention 得到 2×3×4，再經橋接映到指定條件接口。影像 latent 假定為 2×4×8×8；它的 batch 必須與 caption 對齊，不能為了 shape 能 broadcast 就把同一句話套給兩張圖。

下面用一維代替整個 DiT 來手算梯度，純為接線示範。令凍結文字表示 h=2，可訓練橋接參數 a=0.5，所以 c=ah=1。凍結去噪器輸出 ε̂=z_t+c，取 z_t=0.2、目標噪聲 ε=0.8，loss=0.5(ε̂−ε)²=0.08。導數 dL/da=(1.2−0.8)·2=0.8。learning rate 0.1 後 a=0.42，ε̂=1.04，loss=0.0288。底座公式沒變，橋接參數卻透過它收到訊號。

## no_grad 要放在正確邊界

若 GPT-2 輸入不含可訓練前綴，且它之前沒有可訓練模組，取得固定文字特徵時可以不建圖。但 DiT 接收可訓練的條件 c，如果整個 DiT forward 包 no_grad，上例的 dL/da 就斷了。正確區分是凍結 DiT 權重，仍保留 loss 對 c 的微分。這個規則與是否叫作 foundation model 無關，只與 trainable module 的位置有關。

每步後比較底座參數的 hash 或值，確認沒有更新；列橋接器每個模組的 grad 是否存在、是否有限。零梯度有時來自初始化或目前輸入，不能只看一個數就判定壞了；先用能預期非零梯度的 toy case，才能排除接線問題。

## 條件 mask 與 batch 對應

Padding token 不應被 query 當成真實文字讀入。自擬變式把一句 caption 後面加上八個 padding token；在正確 mask 下，eval mode 的條件表示應接近未加 padding 的結果，容許浮點與實作誤差。若改 padding 長度就大幅改圖，先查 mask、position 與是否使用固定長度池化。

再固定 seed、sampler 與步數，把「紅方塊」改成「藍圓形」；另把 batch 內 captions 對調。模型應依配對而改變對應屬性，但單一例子不足以證明一般能力。使用多個未見文字與固定評分規則，記錄符合文字的比例，而不是只挑兩張漂亮圖。

## 變式練習與答案

若上例 h=0，dL/da=0，即使圖連著也無法由該筆資料學 a；換 h=2 才能檢查。若 a 在更新後變 0.42，底座卻也變了，違反凍結要求。若文字打亂仍有一樣的 loss，可能主要學了無條件去噪，需查條件效果。儲存後用新程序載入橋接器並重跑固定 seed 的小測試，核對 query、projection 與版本都有保存。自擬測試不能取代官方 starter tests。

## 把橋接驗收接回正式任務

[HW4 handout 與 starter](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip)是正式底本。Multi-Modal Foundation Models總分79，書面部分含LDM、VQ-VAE、CLIP與VLM；程式部分以凍結GPT-2與CIFAR-10 DiT訓練Q-Former，產生32×32圖片。實際接口不是把每個query直接當圖像patch：`QueryEmbedder`最後輸出(batch, DiT層數, 條件維度)，用來取代各層類別條件。

| 檔案與函式 | 責任與檢查 |
|---|---|
| `image_caption_data.py`／`prompts_to_padded_hidden_states` | 取得指定GPT-2層的hidden states、padding與有效位置mask；檢查非法層索引 |
| `train_qformer.py`／`setup_optimizer_and_scheduler` | 凍結橋接以外參數、建立AdamW與線性warmup，依指定MSE訓練 |
| `dit.py`／`QueryEmbedder.forward` | 展開learned queries，依序處理self-attention、cross-attention、FFN殘差與最後投影 |

`test_all.py`含14個測試，使用假的GPT-2與tokenizer，檢查檔案、hidden states、optimizer與Q-Former輸出。先完成TODO，確認依賴可載入，再執行原測試；不要把預期失敗的未完成starter當成學習驗收。Notebook使用GPT-2 layer index 12、四query，文字特徵可快取；正式資料是CIFAR-10配類別、同義描述與密集caption。訓練以0.1機率丟文字條件，供CFG使用。推論以`eval_qformer.py --config_yaml inference.yaml`執行；固定seed比較條件時仍需按正式配置保存結果。

Handout估計25 epochs在T4約2–3小時、A100約1小時；本次沒有重新訓練驗證。Requirements釘`transformers==4.46.3`，包含torch、torchvision、wandb與gdown；模型與caption由`download_data.sh`取得。舊稿2026-09-30的下載紀錄已存研究快照，不能當成今天資源可用的保證。原教材有需保留的衝突：6.5要求25 epochs卻列第49 epoch網格；6.3的參數量假設與前面介紹不同；VLM配分與小題加總不同。在校作答依題目指定數值並確認課程公告，自學則先明定自己的實驗設定，不假裝已消除歧義。

Slot A禁止AI，Slot B規則依課綱；本文只提供自擬教學與公開任務導讀，不是交件答案。未取得私人recitation、Gradescope評分與官方作業解答。先驗梯度和mask，再按6.1–6.8比較參數比例、凍結設定、loss與網格、CFG、類別/文字條件與attention map；注意力可視化本身不是因果證明。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開作業handout、starter code、相關投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 更新紀錄

- 2026-10-11：重寫教學主體，整合正式作業規格，加入自擬數值測試、變式與答案。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。確認登入牆屬實（匿名開啟 Panopto 資料夾無影片並提示登入），官方頁面也沒有公開 YouTube 版本，狀態維持不變。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁與課綱](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW4 handout（hw4.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — 配分表、題目、起始碼、單元測試、notebook、download_data.sh
- [HW4 Overleaf 唯讀模板](https://www.overleaf.com/read/fvnjnmymbzmt#bd53e3)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — HW4 發下、Slot A／B、recitation 與程式測驗日期
- [Lecture 15 投影片：Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 18 投影片：FlashAttention & Efficient Decoding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — HW4 Slot A 與程式測驗提醒
- [Li et al. 2023：BLIP-2](https://arxiv.org/abs/2301.12597)
- [Steiner et al. 2024：PaliGemma 2](https://arxiv.org/abs/2412.03555)
- [Peebles & Xie 2023：Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [Radford et al. 2021：Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020)
- [Ho & Salimans 2022：Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Darcet et al. 2023：Vision Transformers Need Registers](https://arxiv.org/abs/2309.16588)
- [Xiao et al. 2023：Efficient Streaming Language Models with Attention Sinks](https://arxiv.org/abs/2309.17453)
