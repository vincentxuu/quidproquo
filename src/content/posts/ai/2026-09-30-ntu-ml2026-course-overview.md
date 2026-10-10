---
title: "台大李宏毅 機器學習 2026 Spring 導讀：從 AI Agent 切入，評分平台之外幾乎全開"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, machine-learning, ai-agent]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 0
tldr: "李宏毅 2026 春季的《機器學習》從 OpenClaw 講起，前半學期拆 AI Agent、Context Engineering、推論加速與位置編碼，後半學期講 Harness Engineering、Self-Correction 與 AI 自我成長。8 講投影片、錄影、10 份作業 PDF 與 Colab 全部公開，存取分級是 A3；缺的是評分鏈：JudgeBoi 在 2026-09-30 回傳 502，NTU COOL 限校內，三場演講沒有任何材料。"
description: "台大李宏毅《機器學習 2026 Spring》系列入口：課程結構與弧線、A0–A3 存取分級與缺口、policy.pdf 的十份作業時間表與 NTU COOL／JudgeBoi／訓練模型分工、評分與旁聽規則、Colab／Kaggle／PyTorch／JudgeBoi 教學，以及 Bonus 作業 Teaching Monster Arena。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[機器學習 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) 是台大電機系李宏毅老師這學期的課。它不再從梯度下降講起，第一堂就拆一隻「小龍蝦」：開源 AI Agent [OpenClaw](/posts/ai/2026-03-28-openclaw-overview)。課程大綱寫得很直接：今年 AI「不只會說，也開始會做了」，所以整學期從 AI Agent 的視角切入，重點放在「如何影響與調整模型行為」。

這篇是系列入口，只講課程結構、校外讀者拿得到什麼、作業怎麼評分、該從哪裡開始。每一講的內容留給後面各篇。

**本文依據**：[課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)、[規則說明投影片 policy.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf)（22 頁）、[台大課程網 114-2 課程大綱](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696)、[Bonus 作業投影片 bonus.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf)，全部在 2026-09-30 打開核對。對應的影片是[機器學習 2026 課程簡介](https://youtu.be/gl-BdDjNPVI)。

## 課程影片來源

本文是課程總覽，沒有單一對應講次；官方課程頁公開列出課程簡介影片（2026-10-10 即時查核），其餘講次影片請從官方入口查找。

```youtube
url: https://www.youtube.com/watch?v=gl-BdDjNPVI
title: 機器學習 2026 課程簡介
```

原始影片：[機器學習 2026 課程簡介](https://www.youtube.com/watch?v=gl-BdDjNPVI)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：影片 gl-BdDjNPVI（26:46，課程簡介）字幕全文已讀。核對上課時間與形式（週五 14:20、約一小時講課加助教講作業、下課時間浮動、錄影週一上線）、先備為上學期導論（10 講、各約兩小時）、10 份作業各 10 分、Colab 免費額度可及格（C-、60 分）、加簽名額約 700 人與優先順序、旁聽與修課差別、不教 Python 語法、Bonus 為 Teaching Monster，皆與字幕一致；字幕未涵蓋 policy.pdf 頁碼、作業日期表、JudgeBoi／NTU COOL 分工細節與學術誠信規則，這些屬講義與課程頁內容，無法由影片驗證。影片是學期初錄製，當時預告兩場演講（Appier、陳暐），與本文依課程頁寫的三場不同，本文已以課程頁為準。

## 這門課的硬事實

- **課號與學分**：EE5184，4 學分，選修，週五 14:20–18:20，博理 112。課程網備註「與吳沛遠合授」。
- **上課方式**：policy.pdf 第 9 頁寫「老師上課約 1hr + 助教講解作業」，內容都會錄影，預計下一個週一上線，下課時間不固定。
- **先備**：課程大綱要求修課前看完 2025 秋季《生成式人工智慧與機器學習導論》的[錄影](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT)（十講，每講約兩小時），並說過去 YouTube 講過的內容本學期不會再講。policy.pdf 第 8 頁把兩門課畫成階梯：2025 秋季是導論，2026 春季講前沿技術、過去沒講過的內容。
- **程式**：作業都用 Python，但本課程不教語法；可以用 Colab 完成，不需自備硬體。
- **學期狀態**：課程頁 News 最後一則是「6/1 作業十公布」，最後一份作業截止在 06/18/2026。這學期已經結束。

## 課程弧線：看得見的 agent → 看不見的模型內部 → 怎麼教育模型

課程頁的內容表共 11 列，其中 8 列有投影片與錄影：

| 日期 | 單元 | 本系列對應篇 |
|---|---|---|
| 3/6 | AI Agent (1)：解剖小龍蝦 | [第 1 篇](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy) |
| 3/13 | AI Agent (2)：Context Engineering、agent 之間的互動、對學術研究的衝擊 | [第 3 篇](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)、[第 4 篇](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work) |
| 3/20 | 加快語言模型生成速度：Flash Attention、KV Cache | [第 6 篇](/posts/ai/2026-09-30-ntu-ml2026-flash-attention)、[第 7 篇](/posts/ai/2026-09-30-ntu-ml2026-kv-cache) |
| 3/27 | 模型如何處理超長輸入：Positional Embedding | [第 9 篇](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding) |
| 4/10 | 如何教育模型 (1)：Harness Engineering | [第 11 篇](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering) |
| 4/24 | 如何教育模型 (2)：Self-Correction | [第 13 篇](/posts/ai/2026-09-30-ntu-ml2026-self-correction) |
| 5/8 | 模型的自我成長 (1)：Self-Improving | [第 15 篇](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1) |
| 5/22 | 模型的自我成長 (2)：Self-Improving -2 | [第 18 篇](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2) |

另外三列是演講，後面「缺口」一節會說明。

這個順序本身就是一條好的學習路線：先看 agent 在你電腦上做了什麼（看得到），再問它的輸入為什麼有限、生成為什麼慢（模型內部，看不到），最後回到「不改參數也能讓模型變強」的 harness，以及模型能不能自己改錯、自己成長。所以本系列**照官方順序走**，作業依公告日插在對應講次之後。

學期初的規劃和實際課表不完全一樣。policy.pdf 第 7 頁的下半場規劃把 5/29 排為「台大農經系陳暐老師演講」、6/05 排為「單元五：生成策略（詳解 Flow Matching 技術）」；實際課程頁上 5/29 是 Spoken LM TALK，6/05 是陳暐教授演講，Flow Matching 沒有正課，只剩 HW9。讀舊筆記時以課程頁為準。

## 存取分級：A3，評分鏈除外

分級沿用[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的定義（A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學）。這門課是 **A3**：8 講都有 pdf 與 pptx 投影片和完整錄影，10 份作業都有題目 PDF、可公開存取的 Colab 起始碼與助教說明影片。

校外讀者拿不到的部分，每篇作業文都會再寫一次：

1. **JudgeBoi 評分平台**：`ml.ee.ntu.edu.tw` 在 2026-09-30 回傳 502。需要上傳到 JudgeBoi 的作業（依 policy.pdf 是 HW1、2、4、5、7、10）拿不到分數，也看不到排行榜與 private baseline。
2. **NTU COOL**：需要台大帳號。HW3、6、8、9 的測驗在 COOL 上作答，HW10 的作業 PDF 也寫繳交到 NTU COOL，校外讀者看得到題目 PDF，看不到解答。
3. **三場演講沒有材料**：5/15 Appier Research 團隊演講、5/29 Spoken LM TALK（楊書文、楊智凱同學演講）、6/05 陳暐教授演講。課程頁只有標題，沒有投影片也沒有錄影，本系列不寫單篇。
4. **HTML 註解不算教材**：課程頁原始碼裡還藏著「教育部 AI cup 說明會」「如何在多張 GPU 上訓練大型模型」「Reasoning」等列，頁面上不顯示，本系列不把它們當成這學期的公開教材。

policy.pdf 第 20 頁有一句話很關鍵：「實際修課和旁聽的差別只有助教不批改旁聽生作業而已」。校外自學者的處境跟旁聽生差不多，只是現在連自己上傳看分數的管道都關了。

## 十份作業：時間表與平台分工

policy.pdf 第 11 頁的表把每份作業標成三種性質：在 NTU COOL 上作答、在 JudgeBoi「由 AI 助教批改」、需要花時間訓練模型。下表日期與課程頁、各份作業 PDF 一致：

| 作業 | 主題 | 公告 | 截止 | NTU COOL | JudgeBoi | 訓練模型 | 本系列 |
|---|---|---|---|---|---|---|---|
| HW1 | LLM Malicious Instruction Defense | 03/06 | 03/26 | | O | | [第 2 篇](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense) |
| HW2 | AI Agent as an AI Engineer | 03/13 | 04/02 | O | O | O | [第 5 篇](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer) |
| HW3 | LLM Fast Inference | 03/20 | 04/09 | O | | | [第 8 篇](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference) |
| HW4 | Training Transformer | 03/27 | 04/16 | O | O | O | [第 10 篇](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer) |
| HW5 | Finetuning without Forgetting | 04/10 | 04/30 | | O | O | [第 12 篇](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting) |
| HW6 | Model Editing | 04/24 | 05/14 | O | | | [第 14 篇](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing) |
| HW7 | Model Merging | 05/08 | 05/28 | O | O | | [第 16 篇](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging) |
| HW8 | Test-Time Scaling | 05/15 | 06/04 | O | | | [第 17 篇](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling) |
| HW9 | Flow Matching | 05/22 | 06/11 | O | | O | [第 19 篇](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching) |
| HW10 | Spoken Language Model | 05/29 | 06/18 | | O | O | [第 20 篇](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model) |

所有截止時間都是 23:59（UTC+8）。HW10 是唯一對不上的一列：policy.pdf 標 JudgeBoi，課程頁平台欄與 hw10.pdf 都寫繳交到 NTU COOL，以作業 PDF 為準。policy.pdf 第 12–13 頁也先打了預防針：有些作業訓練時間可能長達數小時，而「焦躁地等待訓練結果、迷茫地調參數，是訓練人工智慧的醍醐味」。

一個小坑：policy.pdf 第 10–11 頁的**文字層**把 HW4、HW5 的日期寫反了（作業四 04/16–04/30、作業五 03/27–04/10），但投影片**畫面上**的表是對的。用 `pdftotext` 抓資料的人會踩到，請以畫面與課程頁為準。

## 評分、旁聽與求助規則

- **評分**：policy.pdf 第 14 頁寫「10 個作業 x 10 分 = 100 分」，不得在學期末向教師提出成績調整請求。
- **修課同意事項**（第 17–18 頁）：接受 AI 助教批改作業，有誤可申訴；接受隨機性，即使遵循指示，訓練結果也可能與助教不完全相同；Colab 有使用限制，但保證免費資源可達及格（C-，60 分）；額外運算資源較易拿高分，但本課程不提供。
- **加簽與旁聽**（第 15–16 頁）：總人數（含已選上）設在 700 人左右，電資學院與相關學程學生優先，其次是修過或申請過 2025《生成式人工智慧與機器學習導論》的同學。歡迎旁聽，旁聽也要填表。
- **求助**（第 19 頁）：用 NTU COOL 討論區、助教 Office Hours（一週兩次）或 email，不要私訊老師或助教。
- **學術誠信**（課程頁作業區）：不得抄襲、不得手改預測檔、不得分享程式碼或預測檔；第一次違規總成績乘 0.9 且該作業 0 分，多次違規期末 F。

## 開工前的三個教學與 Bonus

課程頁作業表最上面有三個 3/6 公告的教學，全部沿用往年材料：

- **Colab 與 Kaggle**：[2025 年的 Colab/Kaggle 教學影片](https://www.youtube.com/watch?v=kibL4oJbzy4)、[Colab Tutorial 投影片](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf)、[範例 Colab](https://colab.research.google.com/drive/14CEwML9XSpxSvZoHfvZTB1h8ZWC8CYyT?usp=sharing) 與 [Kaggle 教學 notebook](https://www.kaggle.com/code/walkerhsu/kaggle-tutorial)。
- **PyTorch**：[2023 年的 PyTorch Tutorial 影片](https://youtu.be/6dEp6oRN2NE)與兩份投影片（[Part 1](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf)、[Part 2](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_2.pdf)）。
- **JudgeBoi**：[113-2 學期的 JudgeBoi Guide 影片](https://www.youtube.com/watch?v=sNX3iKzxAPs)與[投影片](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)。平台本身現在打不開，這份教學只剩參考價值。

**Bonus：Teaching Monster Arena**（助教許筠曼，[說明影片](https://youtu.be/Xk_utjmoK5A)）。任務是參加台大 AI 卓越研究中心（NTU AI-CoRE）主辦的 [Teaching Monster](https://teaching.monster/) 競賽：做一個全自動的 AI 教學系統，透過 API 接收 `course_requirement` 與 `student_persona`，30 分鐘內回傳教學影片的下載連結。題材是 12–18 歲的物理、生物、資訊與數學，以 IB 與 AP 課綱為基準，影片以英文為主、最長 30 分鐘，禁止任何人工撰稿、剪輯或配音。

bonus.pdf 的計分是每隊：參加 +2 分、前 30% +10 分、前三名 +20 分、冠軍 +30 分，分數由隊員均分，直接加在學期總成績上。截止時間有兩個版本：課程頁寫 05/15/2026 19:59，bonus.pdf 寫 2026/5/15 23:59:59。官方另外釋出了 [baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released)。`teaching.monster` 在 2026-09-30 回傳 521，競賽頁面目前連不上。

## 怎麼開始

1. **先補先備**：沒看過 2025 秋季導論的話，先看它的錄影。這是課綱的要求，不是建議。
2. **照本系列順序讀**：一篇講次、接一份作業。作業文會寫明題目、起始碼結構，以及校外拿不到的評分部分。
3. **自己設驗收標準**：JudgeBoi 關了，做作業前先從題目 PDF 抄下 baseline 與評分規則，自己寫一個小評估腳本，當作回饋來源。

站內相關入口：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)把這門課放在台大課程版圖裡比較；[2026 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)的「李宏毅：繁中讀者的入口」一段說明它和其他課的相對位置。

下一篇：[解剖小龍蝦：以 OpenClaw 看 AI Agent 的運作原理](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方課程頁公開列出「機器學習 2026 課程簡介」影片，已嵌入並改為已附影片。
- 2026-10-10：依字幕核對影片內容。課程簡介影片的規則說明與文中一致，無需修改內文。

## 參考資料

- [Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — 內容表、作業表、平台、截止時間、學術誠信規則
- [機器學習 2026 規則說明投影片（policy.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf) — 作業時間表與平台分工、評分、修課同意事項、加簽與旁聽、學期規劃
- [機器學習 2026 課程簡介（YouTube）](https://youtu.be/gl-BdDjNPVI)
- [台大課程網：機器學習 114-2 課程大綱](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) — 課號、學分、上課時間地點、課程概述與 FAQ
- [生成式人工智慧與機器學習導論 2025 播放清單](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) — 課綱指定的先備錄影
- [ML 2026 Spring Bonus：Teaching Monster Arena（bonus.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf)
- [ML2026 Bonus HW 說明影片](https://youtu.be/Xk_utjmoK5A)
- [Teaching Monster baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released)
- [Teaching Monster 競賽網站](https://teaching.monster/)（2026-09-30 回傳 521）
- [Colab Tutorial 投影片（ML 2025）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf)
- [2025 Colab/Kaggle 教學影片](https://www.youtube.com/watch?v=kibL4oJbzy4)
- [PyTorch Tutorial 1 投影片（ML 2023）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf)
- [PyTorch Tutorial 影片（ML 2023）](https://youtu.be/6dEp6oRN2NE)
- [JudgeBoi Guide 投影片](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [JudgeBoi 平台](https://ml.ee.ntu.edu.tw/home)（2026-09-30 回傳 502）
- 站內：[全球 AI／CS 課程地圖（A0–A3 分級定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
- 站內：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
- 站內：[2026 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)
