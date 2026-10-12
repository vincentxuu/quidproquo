---
title: "生成式 AI 學習路線：40 篇核心怎麼讀｜CMU 10-423 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 0
tldr: "這個系列依 CMU 10-423/623/723 Generative AI 的 Spring 2026 公開材料整理。"
description: "Spring 2026 公開課程材料教學：生成式 AI 學習路線：40 篇核心怎麼讀｜CMU 10-423 課程總覽"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

這個系列依 CMU 10-423/623/723 Generative AI 的 Spring 2026 公開材料整理。你要學的不是記住一串模型名字，而是能追蹤：資料如何進入模型、訓練訊號如何更新參數、生成時如何產生下一步，以及如何判斷輸出與實驗可信。原課的 26 堂與本站的文章數是不同計數；同堂含不同教學任務時，這裡會拆篇，作業與評量也各有位置。

重建後是 **40 篇核心教學，加上 12 篇保留導覽**，不是 52 堂課。核心依學習先備排序；保留導覽承接既有網址、比較相關機制並指向完整單元，不拿導覽代替逐項教學。部分原堂分成 A/B，表示本站依內容拆分，不是官方新增了講次。

## 先判斷自己缺哪一段

讀者需要 Python、線性代數的向量/矩陣、條件機率、微分與基本機器學習。你不需要先訓練過大型模型，但需要能區分 shape、參數與資料。若矩陣相乘或 loss 梯度還不熟，先做下面的短診斷，再決定是否回補。

自擬診斷 A：三個 token 的條件機率為 0.5、0.4、0.25，字首機率多少？答案 0.05。若把它們相加，先從 RNN 篇的鏈式法則開始。診斷 B：ŷ=wx，x=2、w=1、y=5，L=(ŷ−y)²/2，∂L/∂w 多少？答案 −6。若只知道 loss 變大卻無法追導數，先做作業 0 的 scalar 例子。

診斷 C：4×4 灰階圖切成 2×2 不重疊 patches，共多少 tokens、每個原始 patch 幾維？答案 4 個、4 維。若答 16 個，先讀 CNN/ViT，釐清畫素與 patch 的關係。這些題目是本站的定位工具，不是 CMU 入學或考試要求。

## 三條路線，各有明確起點

**語言模型路線**：從 RNN 的序列機率、作業 0 的梯度走到 causal attention、訓練/解碼、RoPE/GQA，再做作業 1。然後讀 PEFT、ICL、SFT/RLHF 與 DPO。每一步分清「更新參數」「改上下文」「從分佈抽輸出」，避免把不同適應方法混用。

**影像與多模態路線**：先確認 CNN/ViT 的表示，再讀 GAN、擴散 I/II、VAE 與作業 2。之後接 latent diffusion、VLM、cross-attention/DiT 與 Q-Former。音訊先拆表示/辨識與生成，影片另談時間關聯，世界模型再加入動作介入；一張漂亮圖或一段順暢影片不能替所有能力驗收。

**系統與研究路線**：已有模型基礎的人可從 scaling laws、MoE、分散式訓練與推論效能切入，再接長上下文、推理模型、SSM、風險、程式 agent 與對齊。最後用練習考卷找觀念缺口，用論文報告與專案把問題、baseline、消融與結果連成證據。效能路線仍需 attention 的 shape 與 autograd 先備，不是跳過基礎公式。

## 核心閱讀地圖

下表使用本站閱讀 order，**不是原課堂次**。原課範圍寫在第二欄；相同堂次有多篇時，各自負責獨立學習目標。文章中的自擬例子附計算與答案，不假裝是講者口述或官方解答。

| 閱讀順序 | 原課範圍 | 核心教學 |
|---|---|---|
| 0 | 總覽 | [生成式 AI 學習路線：40 篇核心怎麼讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview) |
| 1 | L1 | [RNN 語言模型：序列機率與梯度怎麼接起來](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff) |
| 2 | HW0／助教課 | [自動微分實作：把手算梯度接上訓練迴圈](/posts/ai/2026-10-11-cmu10423-hw0-autodiff) |
| 3 | L2 | [因果注意力：從 Q、K、V 算到下一個 token](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention) |
| 4 | L3 | [訓練與解碼：同一組 logits 為何生成不同句子](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding) |
| 5 | L4 | [現代 Transformer：位置旋轉與 KV 共享改了甚麼](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa) |
| 6 | HW1 | [minGPT 實作驗收：用形狀、遮罩與位置找錯](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa) |
| 7 | L5 | [CNN 與 ViT：一張圖怎麼變成模型的輸入](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit) |
| 8 | L6 | [GAN：生成器與判別器各自在學甚麼](/posts/ai/2026-09-30-cmu10423-gans) |
| 9 | L7 | [擴散模型入門：加噪為何能成為生成的訓練題](/posts/ai/2026-09-30-cmu10423-diffusion-models) |
| 10 | L8 | [擴散模型進階：訓練抽時間，生成走逆向鏈](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling) |
| 11 | L9 | [VAE：重建誤差、KL 與重參數化如何合作](/posts/ai/2026-10-11-cmu10423-lecture-09-vae) |
| 12 | HW2 | [DDPM 實作驗收：時間係數怎麼對上 batch](/posts/ai/2026-09-30-cmu10423-hw2-ddpm) |
| 13 | L10 | [LoRA 如何少改參數而改模型行為](/posts/ai/2026-10-11-cmu10423-peft) |
| 14 | L11A／L9 ICL部分 | [ICL 的示例如何改變預測而不更新參數](/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning) |
| 15 | L11B | [SFT與RLHF如何把偏好轉成訓練訊號](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf) |
| 16 | L12A | [DPO 為什麼能由偏好對直接更新模型](/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo) |
| 17 | HW3 | [LoRA 微調的資料、參數與評估如何驗收](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2) |
| 18 | L12B | [latent diffusion怎麼用文字控制去噪](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion) |
| 19 | L13 | [VLM怎麼讓LLM讀到影像資訊](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language) |
| 20 | L14 | [cross-attention與DiT如何注入條件](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit) |
| 21 | L15A | [Q-Former 如何橋接凍結的兩個模型](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer) |
| 22 | HW4 | [凍結GPT-2／DiT後，橋接模組怎麼驗收](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image) |
| 23 | L15B | [固定算力如何分配模型與資料](/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws) |
| 24 | L16 | [MoE怎麼增加容量而限制單token運算](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts) |
| 25 | L17 | [多GPU如何分割資料、模型與狀態](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training) |
| 26 | L18 | [FlashAttention與KV cache省的是什麼](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference) |
| 27 | L19 | [長上下文為什麼不只增加位置上限](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context) |
| 28 | L20 | [推理時多花算力何時可能改善答案](/posts/ai/2026-09-30-cmu10423-reasoning-models) |
| 29 | L21 | [SSM怎麼用狀態更新處理序列](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models) |
| 30 | L22 | [風險如何從抽象名詞變成可測試失敗](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks) |
| 31 | L23 | [程式生成評估如何延伸到agent迴圈](/posts/ai/2026-09-30-cmu10423-code-generation-agents) |
| 32 | L24A | [聲音如何表示並被模型轉錄](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr) |
| 33 | L24B | [codec token生成與音訊擴散差在哪](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation) |
| 34 | L25 | [影片生成如何維持時間上的關聯](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation) |
| 35 | L26A | [世界模型怎麼對動作預測下一狀態](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models) |
| 36 | L26B | [對齊為什麼有不能靠調參抹掉的限制](/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment) |
| 37 | 官方練習考卷 | [怎麼用公開練習題診斷觀念缺口](/posts/ai/2026-10-11-cmu10423-practice-exam) |
| 38 | HW623 | [論文報告怎麼建立可核對的論證](/posts/ai/2026-10-11-cmu10423-hw623-paper-report) |
| 39 | 期末專案 | [研究問題怎麼變成可重現的實驗](/posts/ai/2026-10-11-cmu10423-final-project) |


## 作業如何用來學，而不是隻用來打勾

作業 0 用手算對 autograd；作業 1 驗證 shape、mask、位置與 GQA；作業 2 把 diffusion 的時間係數與 batch 對上；作業 3 確認 adapter 參數與資料切分；作業 4 追凍結底座與可訓練橋接的梯度。下載 starter、建立未修改基準、跑指定測試、做自擬變式、再訓練，是有順序的流程。

官方 Spring 2026 的作業有 Slot A/B 政策，早期 human-only 提交與之後允許 AI 協助的修訂具有不同規範。若你是修課學生，依當學期 handout 與課綱執行；本站自學例子不取代官方規範或提交答案。公開材料存在也不代表評分系統、人工標準與所有助教補充都可取得。

自學可以先用 CPU 跑小數例與單元測試，不代表完整作業訓練成本也相同。GPU 是否需要、環境與資料大小，要按各 handout 與你的實驗規模確認。記錄實際完成的步驟，不把 test green、生成一個樣本與品質評估合成一句「模型完成」。

## 保留導覽的用途

下面 12 篇維持原網址，提供主題關係、比較與完整核心入口。讀核心遇到需要比較時再回來看；它們不排成第 40 堂以後的課程。

- [音訊、影片與世界模型](/posts/ai/2026-09-30-cmu10423-audio-video-world-models)
- [Cross-attention、DiT 與 Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)
- [分散式訓練與推論效能](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)
- [考試、論文報告與專案](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)
- [SFT、RLHF 與 DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)
- [長上下文與 SSM](/posts/ai/2026-09-30-cmu10423-long-context-ssm)
- [PEFT 與 ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning)
- [風險與對齊](/posts/ai/2026-09-30-cmu10423-risks-alignment)
- [Scaling laws 與 MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)
- [文生圖與 VLM](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)
- [Transformer 與解碼](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)
- [變分推論與 VAE](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)

## 來源能支援甚麼

主要底本是官方課表、公開投影片、公開作業與評量材料。課表是索引，投影片實際範圍可能更廣：例如第 8 堂含 VAE 引介，第 9 堂末段含 zero/few-shot，第 26 堂有世界模型與對齊兩份 deck。因此分篇不是隻按檔名猜題目。

本系列提供本站的教學解說與雙語文章，不是課堂逐字稿。錄影入口位於 SCS Panopto；匿名資料夾無法載入並提示登入，這只能說明尚未取得公開播放內容，不能推論課程沒有錄影。各篇保留官方入口；未取得原音、字幕或白板口述的部分，不補成講者說過的話。

現在可以選一條路線，先完成它的第一個數值驗收，再往後走。若只能重述模型名、不能解釋例子的輸入與結果，停在那一篇補問題，不需要急著把整張課表讀完。

[下一篇](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Official course homepage and syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Previous](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html)
- [Aran Nayebi](https://anayebi.github.io/)
- [Matt Gormley](http://www.cs.cmu.edu/~mgormley/)
- [附解答的練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [專案說明](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [Lecture 1 投影片：Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Lecture 2 投影片：Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [HW1 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW3 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip)
- [HW4 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
