---
title: "從 AI Agent 切入機器學習的學習路線｜台大李宏毅 機器學習 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, machine-learning, ai-agent]
lang: zh-TW
math: true
series:
  name: "台大李宏毅 機器學習 導讀"
  order: 0
tldr: "李宏毅 2026 春季的《機器學習》從 AI Agent 切入，主軸是怎麼影響與調整模型行為：先拆開 OpenClaw 看 agent 怎麼運作與管理 context，再看模型內部為什麼慢、為什麼有長度限制（Flash Attention、KV Cache、位置編碼），接著是不改參數也能讓模型變強的 harness 與自我修正，最後是 AI 自我成長。8 講錄影、投影片與 10 份作業的題目和 Colab 都公開；作業的評分平台校外用不了，要自己設驗收。"
description: "台大李宏毅《機器學習 2026 Spring》系列入口：三段主線各講在學什麼、一個手算 KV Cache 記憶體的例子、先備與自我檢查、十份作業怎麼對應講次與校外怎麼驗收，以及閱讀路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)

**影片狀態：已附影片。** 導言附課程簡介（27 分鐘），各講錄影在各講導讀。[影片來源與說明](#課程影片來源)

[機器學習 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) 是台大電機系李宏毅老師的課。它不從梯度下降講起，第一堂就拆一隻「小龍蝦」：開源 AI Agent [OpenClaw](/posts/ai/2026-03-28-openclaw-overview)。課程大綱的理由是：今年 AI「不只會說，也開始會做了」，所以整學期從 AI Agent 的視角切入，重點放在「如何影響與調整模型行為」。

整學期的順序本身就是一條學習路線：先看 agent 在你電腦上做了什麼（看得到），再問模型為什麼慢、輸入為什麼有長度限制（模型內部，看不到），最後回到「不改參數也能讓模型變強」的 harness，以及模型能不能自己改錯、自己成長。本系列照官方順序走，作業依公告日插在講次之間；HW9（flow matching）與 HW10（語音語言模型）沒有對應的正課，作業文會指出要補哪些舊影片。

這篇是系列入口：先講三段主線各講在學什麼，再手算一次 KV Cache 的記憶體，最後給先備檢查與讀法。下面是 27 分鐘的課程簡介，講這學期的安排、先備與作業規則；課程內容本身從第 1 篇開始，不看影片也能讀。

```youtube
url: https://www.youtube.com/watch?v=gl-BdDjNPVI
title: 機器學習 2026 課程簡介
```

## 主線：三段

### 看得見的 agent（第 1–5 篇）

[第 1 篇](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)把 OpenClaw 拆成五個問題：agent 怎麼知道自己是誰、怎麼用工具、怎麼記憶、怎麼定時工作、怎麼長時間自主運作。答案都回到同一件事：語言模型只會文字接龍，每一輪都重新開始，身分、記憶、SOP 全是塞進 prompt 的文字檔，或模型透過工具讀寫的檔案。[第 3 篇](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)處理接著出現的問題：輸入長度有限，agent 卻一直累積工具輸出。Context Engineering 分成壓縮（摘要、清掉、卸載到檔案）、過濾（只讀需要的、按需載入工具），以及讓模型自己決定下一輪的 context；subagent 也可以看成一種自主壓縮。[第 4 篇](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)看多個 agent 怎麼協作（不規則的連接方式勝過規則的）、能不能在狼人殺這類遊戲裡爾虞我詐，以及 agent 已經能從頭複製並延伸一篇論文，對學術研究的衝擊。

作業：[HW1](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense) 寫一段防禦 prompt，讓模型被攻擊時仍守住輸出格式；[HW2](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer) 不直接寫分類器，而是寫 prompt 與流程，讓 Colab 上的開源 LLM 自己規劃、寫 code、除錯，做出角色臉部辨識。

### 看不見的模型內部（第 6–10 篇）

[第 6 篇](/posts/ai/2026-09-30-ntu-ml2026-flash-attention)：GPU 的運算單元很快，但片上記憶體很小，資料在 HBM 和 SRAM 之間搬運才是瓶頸。Flash Attention 用「先假設目前看到的最大值就是最大值，之後再乘修正項」的技巧，把 softmax 的幾次掃描合成一次，結果和原本完全一樣、不用重訓。[第 7 篇](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)：KV Cache 存下算過的 key 和 value，decode 時不必重算，代價是每個 token 都要佔記憶體；瘦身法有讓 query 共用 key/value（MQA、GQA）、壓成一個向量（MLA）、只看一段範圍（sliding window），以及跨對話的 prompt caching（前綴完全相同才會命中）。[第 9 篇](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)：self-attention 本身分不出「你打我」和「我打你」，所以要加位置資訊；現在主流的 RoPE 轉到沒看過的角度就會壞，於是有一串「訓練短、測試長」的修法。

作業：[HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference) 讀 speculative decoding 與 FlashAttention 論文並跑 Colab 量測加速；[HW4](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer) 把文字接龍搬到圖片上，把 20×20 的寶可夢小圖當 400 個 token 的序列，讓模型畫完後 40%。

### 怎麼教育模型（第 11–20 篇）

[第 11 篇](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering)從一個示範開場：小模型找不到檔案就自己寫一個假的交差，加上「現在的環境、怎麼工作、怎樣算完成」三段說明後，它就乖乖跑測試。harness 分成三種手段：用人類語言控制認知框架（AGENTS.md）、用工具控制能力邊界、用工作流程控制行為。[第 13 篇](/posts/ai/2026-09-30-ntu-ml2026-self-correction)問模型能不能自己改錯：改推論方式（製造一個會答錯的版本再減掉）、改流程（外部回饋比自我反思可靠，算力有限時多抽幾個答案投票往往更划算）、改參數（用 RL）。[第 15 篇](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)與[第 18 篇](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)講 AI 自我成長：上集把原本由人負責的部分逐一交給 AI，標準答案由 AI 自我修正後產生、reward 由 LLM 寫、loss 讓模型自己訂，連題目都讓模型自己出，但實驗一再顯示，完全不靠人會卡在天花板；下集讓 harness 也自己長，用一個語言模型當改寫器，再像基因演算法一樣保留一池候選、留下表現好的。

作業：[HW5](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting) 用 LoRA 微調數學能力，同時不能把拒答危險請求的行為洗掉；[HW6](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing) 用 ROME 直接改模型記得的一條知識；[HW7](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging) 把日文模型和數學模型在參數層級合併；[HW8](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling) 比較 self-consistency 等 test-time scaling 方法；[HW9](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching) 讀 flow matching 論文並在 2D 資料上訓練；[HW10](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model) 比較語音語言模型的三種架構。

## 手算一次：KV Cache 吃掉多少記憶體

這是本文的教學例子，用來看第 7 篇為什麼要花一整講談 KV Cache 瘦身，以及第 3 篇為什麼要管 context 長度。

每個 token 要存的 KV Cache 是：

$$
2 \times \text{層數} \times \text{KV head 數} \times \text{head 維度} \times \text{每個數的 bytes}
$$

2 是因為 key 和 value 各一份。用 Llama 2 7B 的設定（32 層、32 個 head、head 維度 128、fp16 每個數 2 bytes）：

- 每個 token：$2 \times 32 \times 32 \times 128 \times 2 = 524{,}288$ bytes，剛好 0.5 MB（$2^{19}$ bytes，以 1 MB $= 2^{20}$ bytes 計）。
- 一段 4096 token 的對話：$0.5 \text{ MB} \times 4096 = 2$ GB。
- 同時服務 16 段：32 GB，比模型本身的權重（fp16 約 13 GB）還大。

假設改用 GQA（Llama 2 7B 本身沒有用），讓每 4 個 query head 共用一組 key/value（KV head 從 32 變 8）：KV Cache 直接變成四分之一，16 段只要 8 GB。

**這個例子的意思：** 生成時真正限制「能同時服務幾個人、能讀多長」的，常常不是模型權重，而是 KV Cache；它和 context 長度、同時服務的人數都成正比。第 7 篇的 MQA、GQA、MLA、sliding window 都在砍公式裡的某一項；第 3 篇管 context、第 7 篇的 prompt caching 讓相同前綴不必重算，也都是在省這筆帳。

## 先備與自我檢查

課程大綱要求修課前看完 2025 秋季《生成式人工智慧與機器學習導論》的[錄影](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT)（十講，每講約兩小時），並說過去講過的內容這學期不會再講；這是要求，不是建議。作業都用 Python，但課程不教語法；Colab 的免費資源就足以及格。

讀完這篇，試著回答：

1. OpenClaw 的「記憶」存在哪裡？
   答：存在檔案裡，每一輪由 agent 塞進 prompt 或透過工具讀寫；模型本身每一輪都重新開始，沒有記憶。
2. Flash Attention 為什麼不用重新訓練模型？
   答：它只改變計算順序，減少記憶體搬運，算出來的 attention 和原本完全一樣。
3. 假設把上面例子的 context 拉長到 32k（32768）token（Llama 2 7B 原生只到 4096），一段對話的 KV Cache 多大？
   答：$0.5 \text{ MB} \times 32768 = 16$ GB，一段就超過模型權重。
4. 為什麼 system prompt 要把穩定的內容放前面、日期這類會變的放後面？
   答：prompt caching 只有前綴完全相同才會命中；會變的內容放前面，後面全部都得重算。
5. harness engineering 和微調差在哪？
   答：harness 不改參數，靠說明、工具與工作流程控制模型的行為；微調是更新參數。

## 怎麼讀：作業與材料

照本系列順序讀，一篇講次、接一份作業。8 講都有投影片與完整錄影，10 份作業都有題目 PDF、Colab 起始碼與助教說明影片。課程頁另有三場演講只列標題，沒有材料，本系列不寫。

作業分兩種：HW3、6、8、9、10 是讀論文加跑 Colab 的選擇題，作答與解答在台大的 NTU COOL 上；多數題目印在作業 PDF 上可以照做，只有 HW6 的 PDF 沒印題目。HW1、2、4、5、7 要上傳評分，評分平台 JudgeBoi 校外已經連不上，看不到分數與排行榜。要花時間訓練模型的是 HW2、4、5、9、10，排 Colab 時間時留意。所以做作業前，先從題目 PDF 抄下 baseline 與評分規則，自己寫一個小評估腳本當回饋；各篇作業文會寫明評分方式與自己驗收的做法。課程規則裡有一句可以參考：修課和旁聽的差別只有助教不批改旁聽生的作業。

開工前的三個教學沿用往年材料：[Colab 與 Kaggle](https://www.youtube.com/watch?v=kibL4oJbzy4)、[PyTorch](https://youtu.be/6dEp6oRN2NE)、[JudgeBoi](https://www.youtube.com/watch?v=sNX3iKzxAPs)（平台已關，只剩參考價值）。另有一份 Bonus 作業：參加 [Teaching Monster](https://teaching.monster/) 競賽，做一個全自動產生教學影片的 AI 系統。競賽已在 2026-05-15 截止，但官方的 [baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released) 公開，可以當成 agent 專案練習。

## 本系列篇目

| 順序 | 篇目 | 講次／作業 |
|---|---|---|
| 1 | [解剖小龍蝦：OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy) | 3/6 AI Agent (1) |
| 2 | [HW1 惡意指令防禦](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense) | 作業 1 |
| 3 | [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering) | 3/13 AI Agent (2) |
| 4 | [Agent 之間的互動與對研究的衝擊](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work) | 3/13 AI Agent (2) |
| 5 | [HW2 AI Agent 當 AI 工程師](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer) | 作業 2 |
| 6 | [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention) | 3/20 加快生成速度 |
| 7 | [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache) | 3/20 加快生成速度 |
| 8 | [HW3 快速推論](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference) | 作業 3 |
| 9 | [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding) | 3/27 超長輸入 |
| 10 | [HW4 訓練 Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer) | 作業 4 |
| 11 | [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering) | 4/10 教育模型 (1) |
| 12 | [HW5 微調而不遺忘](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting) | 作業 5 |
| 13 | [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction) | 4/24 教育模型 (2) |
| 14 | [HW6 Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing) | 作業 6 |
| 15 | [AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1) | 5/8 自我成長 (1) |
| 16 | [HW7 Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging) | 作業 7 |
| 17 | [HW8 Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling) | 作業 8 |
| 18 | [AI 自我成長（下）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2) | 5/22 自我成長 (2) |
| 19 | [HW9 Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching) | 作業 9 |
| 20 | [HW10 語音語言模型](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model) | 作業 10 |

## 今晚可以做的事

1. 確認你看過 2025 秋季導論；沒看過，先排進進度。
2. 把「手算一次」換成你常用的模型設定算一次 KV Cache（層數、KV head 數、head 維度在模型的 config 檔裡）。
3. 讀[第 1 篇](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)。

站內相關入口：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)把這門課放在台大課程版圖裡比較；[2026 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)的「李宏毅：繁中讀者的入口」一段說明它和其他課的相對位置。

下一篇：[解剖小龍蝦：以 OpenClaw 看 AI Agent 的運作原理](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)

## 課程影片來源

本文是課程總覽，導言嵌入官方課程頁列出的課程簡介影片；其餘各講錄影附在各講導讀，也可以從官方課程頁查找。

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [機器學習 2026 課程簡介](https://www.youtube.com/watch?v=gl-BdDjNPVI)（導言嵌入，26:46）

查核日期：2026-10-14。

內容核對：已依字幕核對（2026-10-10）：影片 gl-BdDjNPVI（26:46，課程簡介）字幕全文已讀。本文引用的先備要求（上學期導論 10 講、各約兩小時）、課程不教 Python 語法、Colab 免費資源可及格、修課與旁聽的差別只在助教是否批改、Bonus 為 Teaching Monster，皆與字幕一致。

## 更新紀錄

- 2026-10-14：正文改寫成導讀：三段主線逐講講出機制，補 KV Cache 手算例子與自我檢查，課程簡介影片移到導言；存取分級、作業平台分工表、評分與旁聽規則縮成讀法裡的幾段，並標明各作業在哪裡作答、Bonus 已截止。
- 2026-10-10：依字幕核對課程簡介影片內容。
- 2026-10-10：標註影片狀態，嵌入課程簡介影片。

## 參考資料

- [Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — 內容表、作業表、平台、截止時間、學術誠信規則
- [機器學習 2026 規則說明投影片（policy.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf) — 作業時間表與平台分工、評分、修課同意事項、加簽與旁聽、學期規劃
- [機器學習 2026 課程簡介（YouTube）](https://youtu.be/gl-BdDjNPVI)
- [台大課程網：機器學習 114-2 課程大綱](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) — 課號、學分、上課時間地點、課程概述與 FAQ
- [生成式人工智慧與機器學習導論 2025 播放清單](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) — 課綱指定的先備錄影
- [ML 2026 Spring Bonus：Teaching Monster Arena（bonus.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf)
- [ML2026 Bonus HW 說明影片](https://youtu.be/Xk_utjmoK5A)
- [Teaching Monster baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released)
- [Teaching Monster 競賽網站](https://teaching.monster/)
- [Colab Tutorial 投影片（ML 2025）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf)
- [2025 Colab/Kaggle 教學影片](https://www.youtube.com/watch?v=kibL4oJbzy4)
- [PyTorch Tutorial 1 投影片（ML 2023）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf)
- [PyTorch Tutorial 影片（ML 2023）](https://youtu.be/6dEp6oRN2NE)
- [JudgeBoi Guide 投影片](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [JudgeBoi 平台](https://ml.ee.ntu.edu.tw/home)
- 站內：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
- 站內：[2026 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)
- [解剖小龍蝦：以 OpenClaw 介紹 AI Agent 的運作原理（intro.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/intro.pdf) — 第 1 篇：agent 的身分、工具、記憶
- [加快語言模型的生成速度（inference.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf) — 第 6、7 篇：Flash Attention 與 KV Cache
