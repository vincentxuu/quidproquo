---
title: "台大李宏毅 ML 2026 導讀：HW10 Spoken Language Model——三種架構、Mimi 的 32 層 token，以及為什麼 Moshi 能邊聽邊說"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, speech-processing, tokenization, multimodal, voice-ai]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 20
tldr: "HW10 是 12 題選擇題，只在 NTU COOL 作答。Section 1 比較語音語言模型的三種架構：Cascade（ASR → LLM → TTS，中間是文字）、End-to-End（直接在離散語音 token 上做 LM）、Thinker-Talker（LLM 負責想，另一個 decoder 負責說），Colab 讓兩個模型聽三段錄音判斷說話者性別，要你看出哪個是 cascade。Section 2 拆 Mimi：把情緒語料切成 32 層 RVQ token，取第 0、6、16、31 層畫 UMAP；再把語音、笑聲、音樂 encode 再 decode 聽看看壞在哪。剩下的題目讀 TWIST、AudioLM、LLaMA-Omni 2、Moshi、GLM-4-Voice，考 initialization、pretrain、interleaving 與 realtime／full-duplex。Colab 要先申請 Llama-3.2-3B-Instruct 授權並填 HF token。題目與 Colab 全公開，校外拿不到的是 COOL 評分與解答。"
description: "台大李宏毅《機器學習 2026 Spring》HW10「Spoken Language Model」導讀，依 hw10.pdf、作業 Colab 與助教說明影片：Cascade／End-to-End／Thinker-Talker 三型、Model A 與 Model B 的性別辨識實驗、Mimi tokenizer 的 semantic 與 acoustic RVQ 層、EmoV-DB 情緒語料的 UMAP 分析、detokenizer 重建與 PESQ、TWIST 的文字模型初始化、AudioLM 的兩種 token、Moshi 與 GLM-4-Voice 的 interleaving、realtime 與 full-duplex，以及 PDF 與 Colab 題號對不上的地方。"
draft: false
glossary:
  - term: "Thinker-Talker"
    aliases: ["Thinker–Talker 架構"]
    definition: "把語音對話模型拆成兩塊：Thinker 是 LLM，負責理解與推理；Talker 是 decoder，根據 Thinker 的輸出或 hidden states 產生語音 token。"
    context: "HW10 以 LLaMA-Omni 2 為 Thinker-Talker 的代表，拿來和 Moshi 這類 end-to-end 模型比較。"
  - term: "Mimi"
    aliases: ["kyutai/mimi", "Mimi codec"]
    definition: "Kyutai 的神經音訊 codec，把波形編成多層 RVQ（residual vector quantization）離散 token，也能 decode 回波形。Moshi 用它當語音 tokenizer。"
    context: "HW10 Colab 用 Hugging Face transformers 的 MimiModel 載入，第 0 層來自 semantic quantizer，其餘層來自 acoustic quantizer。"
  - term: "Full-duplex"
    aliases: ["全雙工"]
    definition: "模型可以在聽使用者說話的同時說話，不必等明確的輪流切換。"
    context: "HW10 PDF 第 22 頁把 realtime 定義為輸出延遲短，full-duplex 定義為同時聽與說。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW10。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 20 篇，也是最後一篇。上一篇是 [HW9：Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching)。

用到的官方材料：作業說明 [hw10.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw10.pdf)（42 頁，第 31 頁起是 12 題的完整選項）、[作業 Colab](https://colab.research.google.com/drive/1QBtp0lQrjQbTKB1sLIxoavqhSU7EhG_g?usp=sharing)（32 個 cell），以及課程頁列出的助教說明影片 [ML 2026 Spring HW10 Spoken Language Model](https://youtu.be/Gx96VH6ePC4)。課程頁寫 5/29 公告，截止時間 2026/06/18 23:59:59（UTC+8），不收遲交。成績在 2026/06/19 前公布，成績複查到 06/21，學期總成績在 06/22 前公布。助教是陳竣瑋、陳思齊、鄭安妤、尹廷安。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=Gx96VH6ePC4
title: 助教影片：ML 2026 Spring HW10 Spoken Language Model
```

原始影片：[助教影片：ML 2026 Spring HW10 Spoken Language Model](https://www.youtube.com/watch?v=Gx96VH6ePC4)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 存取等級：A3，但沒有官方解答

- **拿得到**：作業 PDF（12 題題目與全部選項都在附錄）、Colab 起始碼，以及 Colab 裡 clone 的 [作業程式 repo](https://github.com/Tincan0325/26spring_ml_hw10_speech_model)。
- **拿不到**：作答在 NTU COOL，需要台大帳號，校外看不到評分，也拿不到解答。本文不提供任何題目的答案。
- **帳號與硬體**：Section 1 要用 [meta-llama/Llama-3.2-3B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)，得先在 Hugging Face 申請授權，再把 HF token 貼進 Colab。Colab 要求開 GPU（T4 即可），預估 1–2 小時做完，並提醒免費帳號不保證拿得到 GPU。

## 先備與延伸教材

這份作業沒有本學期的對應講次。PDF 第 3 頁列的延伸教材是兩支 2025 年的影片：[【生成式人工智慧與機器學習導論2025】第 10 講：語音語言模型發展史](https://youtu.be/CbIPjrOj2Tc)（標題註明 2025 年的技術從 1:42:00 開始）和 [【生成式AI時代下的機器學習(2025)】第十二講：語言模型如何學會說話](https://youtu.be/gkAyqoQkOSk)。第 13 頁的 tokenizer 圖則註明取自 [2025 年的作業十](https://youtu.be/FDxg0mtFKZo)。

指定論文有六份：[TWIST](https://arxiv.org/abs/2305.13009)、[AudioLM](https://arxiv.org/abs/2209.03143)、[LLaMA-Omni 2](https://arxiv.org/abs/2505.02625)、[Mimi 模型](https://huggingface.co/kyutai/mimi)與 [Mimi codec 論文](https://kyutai.org/Moshi.pdf)、[Moshi](https://arxiv.org/abs/2410.00037)、[GLM-4-Voice](https://arxiv.org/abs/2412.02612)。

## 目標與格式

PDF 第 4 頁把作業分成兩段：

- **Section 1**：認識不同類型的 Spoken Language Model。
- **Section 2**：透過 Mimi 了解語音怎麼變成 token，以及 Spoken LM 的 initialization、pretrain、interleaving。

只要在 NTU COOL 回答 **12 題選擇題**。PDF 標的配分是 Q1–Q5、Q10–Q12 各 1%，Q6–Q8 各 0.5%，Q9 沒有標。

第 5 頁先定義任務：輸入一段語音，輸出一段語音。最直覺的做法是 ASR 轉成文字、交給 LLM（例如 ChatGPT）、再用 TTS 念出來。整份作業就是在問：這條路之外還有什麼路，各自丟掉了什麼、換到了什麼。

## Section 1：三種架構

PDF 第 7–9 頁用三張圖畫出三種架構：

| 類型 | 流程 | 中間表示 |
|---|---|---|
| Type 1 Cascade | ASR → LLM → TTS | 文字 |
| Type 2 End-to-End | tokenizer → Speech LLM／Transformer → detokenizer | 離散語音 token |
| Type 3 Thinker-Talker | tokenizer → Thinker（LLM）→ hidden states → Talker（decoder）→ detokenizer | 離散語音 token，Thinker 與 Talker 之間傳 hidden states |

四題分別考：

- **Q1** cascade 與非 cascade 的比較，出處是 Moshi 論文。Moshi 摘要裡點名了傳統管線的三個問題：多個元件疊起來造成好幾秒的延遲；以文字當中間表示，情緒、非語音聲音這類改變意義的資訊會流失；依賴明確的說話者輪流切換，處理不了重疊、插話。
- **Q2** 是 Colab 實驗（見下一節）。
- **Q3** LLaMA-Omni 2 的 Thinker-Talker 架構。它的摘要寫：以 Qwen2.5 系列為基礎，接上 speech encoder 與自回歸的串流語音 decoder，規模從 0.5B 到 14B，只用 20 萬筆多輪語音對話訓練。
- **Q4** 把 LLaMA-Omni 2（Thinker-Talker）和 Moshi（end-to-end）放在一起比。

### Colab：Model A 與 Model B 誰是 cascade

Section 1 的任務是用語音問模型「說話者是男是女」。Colab 會 clone 作業 repo，依序架起 Model A 和 Model B，讓它們各聽 `sample_audio_prompted/` 裡的 F_1、F_2、M_1 三段錄音，印出文字回應。你要從兩者的回答判斷哪一個是 cascade，理由也在選項裡。

實務上要注意三件事：

- Model A 第一次跑會下載約 15 GB 權重，Colab 註明要 5–7 分鐘。
- Model B 的 setup 會裝 `transformers==4.49.0`，裝完會重啟 runtime；Colab 在兩者之間有一格專門釋放 GPU 記憶體、清掉快取的模組。
- 題目文字有一處不一致：PDF 第 10 頁寫「ten sample audio files」，第 32 頁的附錄與 Colab 程式都是三段（2 女 1 男）。以 Colab 實際跑的為準。

## Section 2：Mimi tokenizer 把聲音切成 32 層

第 13 頁的圖把 tokenizer 的輸出畫成一張表：橫軸是 frame（時間），縱軸是 layer，每一格是一個整數 token；detokenizer 再把這張表變回聲音。

Colab 用 Hugging Face transformers 的 `MimiModel.from_pretrained("kyutai/mimi")` 載入模型。核心函式 `get_mimi_token` 讀入音檔、轉單聲道、重新取樣到 Mimi 的取樣率，呼叫 `mimi_model.encode`，回傳形狀為 (1, RVQ 層數, frames) 的 token，預設取 32 層。

Colab 的程式碼也寫清楚了層的來源：**第 0 層來自 semantic residual vector quantizer，第 1–31 層來自 acoustic residual vector quantizer**。這和 AudioLM 的想法對得上：AudioLM 摘要說，它用預訓練 masked LM 的離散化 activation 捕捉長期結構，用神經音訊 codec 的離散碼達成高品質合成，兩種 token 各有取捨。

### Q5：情緒語料的 UMAP

資料是 [EmoV-DB](https://www.openslr.org/115/)，取 Amused、Angry、Disgusted、Sleepy、Neutral 五種情緒。PDF 第 15 頁畫出每段音檔怎麼變成一個點：

1. 用 Mimi 取出 token，只看某一層。
2. 查那一層的 codebook，把每個 token 換成 256 維向量（token-to-embedding retrieval）。
3. 對所有 frame 取平均，一段音檔得到一個 256 維向量。
4. 用 [UMAP](https://pair-code.github.io/understanding-umap/) 降到 2 維，同色代表同一種情緒。

Colab 對第 0、6、16、31 層各畫一張，並排比較，處理全部語料約 2–5 分鐘。題目要你看不同層的情緒分群程度。先想一下：第 0 層是 semantic，後面是一層層補細節的 acoustic 殘差，你預期情緒資訊會落在哪裡？再去看圖。

### Q6–Q7：decode 回來，壞在哪

Detokenizer 這一段把音檔 encode 後再 decode，並用 PESQ 衡量重建品質。注意 Colab 在這裡 encode 時只取 **8 層**（`num_quantizers=8`），不是前面的 32 層。

四個音檔是英文語音、中文語音、笑聲、音樂。Q6 比較中英文的重建結果，Q7 比較笑聲和音樂哪個重建最差、代表什麼。兩題都要用耳朵聽，而不只看 PESQ。

**題號對不上**：PDF 把 UMAP 標為 Q5、detokenizer 標為 Q6–Q7；Colab 的註解則把 UMAP 標成 Q6、detokenizer 標成 Q7–Q8。PDF 裡檔名寫 `TTS_English_speech.wav`，Colab 裡是 `English_speech.wav`。作答時以 PDF（也就是 COOL 上的題目）為準。

## Section 2：Initialization、Pretrain、Interleaving

後面三題是讀論文：

- **Q8 TWIST**（[Textually Pretrained Speech Language Models](https://arxiv.org/abs/2305.13009)）：用預訓練的文字 LM 當語音 LM 的起點（warm-start），和從頭訓練的 cold-start 比。選項考的是具體做法（哪些權重保留、embedding 怎麼處理）與實驗結果（資料量、收斂速度、tokenizer 取樣頻率），要回論文的實驗章節對數字。
- **Q9 AudioLM**：現代 Spoken LM 常見的兩類離散語音 token，各自抓什麼資訊、怎麼分階段生成。
- **Q10 Moshi 與 GLM-4-Voice 的 interleaving**：兩者都把文字 token 和語音 token 交錯排列，但目的和做法不同。GLM-4-Voice 的摘要寫它用 12.5Hz、單一 codebook 的語音 tokenizer，並用 text-to-token 模型從既有文字語料合成語音與文字交錯的資料，從 GLM-4-9B 接著預訓練。Moshi 的摘要則說它先預測時間對齊的文字 token，當作語音 token 的前綴，稱為「Inner Monologue」。PDF 第 21 頁引用的綜述是 [On The Landscape of Spoken Language Models](https://arxiv.org/abs/2504.08528)。

## Realtime 與 Full-Duplex

PDF 第 22 頁給了兩個定義：**Realtime** 是輸出延遲短；**Full-Duplex** 是聽使用者說話的同時也能回話。引用的評測是 [Full-Duplex-Bench](https://arxiv.org/abs/2503.04721)。

- **Q11** 問 Moshi 的低延遲靠哪些技術實作。Moshi 摘要寫它的理論延遲是 160ms、實際 200ms。
- **Q12** 問 Moshi 的哪些設計讓它能 full-duplex。摘要說它把自己的語音和使用者的語音分成平行的串流分別建模，因此不需要明確的輪流切換。

選項裡混了幾個聽起來合理但論文沒寫的機制，這兩題一定要回原文的架構章節核對，不要只憑摘要作答。

## 規定與資源

- 不准抄襲，引用資源要註明；不准分享程式或預測檔；不准用 GPT-4、Gemini 等閉源 LLM API；不准找額外資料或測試答案。第一次違規該次作業 0 分、學期成績乘 0.9；超過一次學期成績 F。（這些是 PDF 第 29 頁的通用規定，有幾條明顯是從需要上傳預測檔的作業沿用過來的。）
- 問題優先發在 NTU COOL 的 HW10 討論區。PDF 寫寄信標題要以 `[GenAI-ML 2026 Fall HW10]` 開頭，和課名、學期都對不上，寄之前最好先在討論區確認。
- 助教時間：5/29、6/5 兩個週五上課前後在博理 112，6/12 改成 Google Meet。

## 想深入

- **先讀哪一篇**：[Moshi](https://arxiv.org/abs/2410.00037) 一篇就涵蓋了 Q1、Q4、Q10、Q11、Q12，而且 Mimi 也是它提出的。先讀它的架構章節，再回頭看其他論文會快很多。
- **今晚就能做**：跑完 Detokenizer 那一格後，把 `num_quantizers` 從 8 改成 2、4、16、32，各聽一次英文語音和音樂，記下 PESQ。你會親耳聽到 RVQ 的「一層層補殘差」是什麼意思。
- **延伸閱讀**：想看 cascade 架構在產品上怎麼做，站上的 [LiveKit Voice Agents](/posts/ai/2026-08-22-livekit-voice-agents)拆解了 STT → LLM → TTS 的串流管線與插話處理，剛好可以和 Moshi 的 full-duplex 對照。

## 這一篇可以確認與不能確認的

可以確認：hw10.pdf 全文與內嵌連結、Colab 的 markdown 與程式（模型 ID、層的來源、UMAP 流程、decode 用的層數、音檔清單）、課程頁的公告日與助教名單、助教影片與延伸影片的標題與上傳者（YouTube oEmbed）、六篇論文的標題與摘要（arXiv API 核對）。

不能確認：助教影片沒有字幕可抓，本文沒有逐字聽寫，影片中額外的提示沒有寫進來。作業 repo 的 Model A、Model B 各是什麼模型，本文刻意不寫，因為那就是 Q2 的答案。Q9 的配分 PDF 沒有標。官方解答沒有公開。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW9：Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching)｜這是系列最後一篇

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [hw10.pdf（ML 2026 Spring HW10：Spoken Language Model）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw10.pdf)
- [HW10 Colab 起始碼](https://colab.research.google.com/drive/1QBtp0lQrjQbTKB1sLIxoavqhSU7EhG_g?usp=sharing)
- [作業程式 repo：Tincan0325/26spring_ml_hw10_speech_model（GitHub）](https://github.com/Tincan0325/26spring_ml_hw10_speech_model)
- [助教影片：ML 2026 Spring HW10 Spoken Language Model](https://youtu.be/Gx96VH6ePC4)
- [延伸影片：【生成式人工智慧與機器學習導論2025】第 10 講：語音語言模型發展史](https://youtu.be/CbIPjrOj2Tc)
- [延伸影片：【生成式AI時代下的機器學習(2025)】第十二講：語言模型如何學會說話](https://youtu.be/gkAyqoQkOSk)
- [【生成式人工智慧與機器學習導論2025】作業十](https://youtu.be/FDxg0mtFKZo)
- [Textually Pretrained Speech Language Models（arXiv 2305.13009）](https://arxiv.org/abs/2305.13009)
- [AudioLM: a Language Modeling Approach to Audio Generation（arXiv 2209.03143）](https://arxiv.org/abs/2209.03143)
- [LLaMA-Omni2: LLM-based Real-time Spoken Chatbot with Autoregressive Streaming Speech Synthesis（arXiv 2505.02625）](https://arxiv.org/abs/2505.02625)
- [Moshi: a speech-text foundation model for real-time dialogue（arXiv 2410.00037）](https://arxiv.org/abs/2410.00037)
- [Moshi 技術報告 PDF（Kyutai）](https://kyutai.org/Moshi.pdf)
- [kyutai/mimi（Hugging Face）](https://huggingface.co/kyutai/mimi)
- [GLM-4-Voice: Towards Intelligent and Human-Like End-to-End Spoken Chatbot（arXiv 2412.02612）](https://arxiv.org/abs/2412.02612)
- [On The Landscape of Spoken Language Models: A Comprehensive Survey（arXiv 2504.08528）](https://arxiv.org/abs/2504.08528)
- [Full-Duplex-Bench（arXiv 2503.04721）](https://arxiv.org/abs/2503.04721)
- [EmoV-DB（OpenSLR 115）](https://www.openslr.org/115/)
- [Understanding UMAP（PAIR）](https://pair-code.github.io/understanding-umap/)
- [meta-llama/Llama-3.2-3B-Instruct（Hugging Face）](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
