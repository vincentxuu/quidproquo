---
title: "CS2881R 期末專題與課程回顧：19 份學生研究、評分表與第一屆的教訓"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, research-project, retrospective]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 15
tldr: "Harvard CS 2881R Fall 2025 的期末專題分兩種：延伸既有論文，或做有 theory of change 的長期研究；交 5–10 頁 NeurIPS 風格論文加海報，評分是 writeup 65、code 15、poster 20。專題頁公開 19 份論文，約一半集中在 persona 向量與 chain of thought 監控。head TA 與 Harvard Q-report 都指向同一個問題：期末專題太晚開始、評分表太晚公布，回饋是全課評分最低的一項。"
description: "Harvard CS 2881R AI Safety（Fall 2025）系列最終篇：拆解期末專題說明與評分表、把 19 份學生論文依主題分組並對回各講、整理 75 分鐘口頭報告影片的 7 組報告，再用 head TA Roy Rinberg 的回顧、Boaz Barak 的期中心得與 Harvard Q-report 看這門第一次開的課哪裡有效、哪裡要改。"
glossary:
  - term: "Theory of change"
    aliases: ["變革理論"]
    definition: "說明一項研究如果成功，會透過什麼路徑讓 AI 更安全。"
    context: "CS 2881R 的期末專題說明與評分表都要求寫出 theory of change，評分表給它 10 分。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 Harvard CS 2881R 的 Fall 2025 學期。** 這是 [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)系列的第 15 篇，也是最後一篇。上一篇 [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035) 收掉了課程的最後一講；這一篇回答兩個問題：一學期下來，學生做出了什麼研究？這種「重現 + 延伸」的課程設計，哪裡有效、哪裡要改？

前半篇是給想自己跑一次期末專題的讀者：規格、評分表、題目清單、19 份成果怎麼分布。後半篇是給想開類似課程、或想判斷這門課值不值得跟的讀者：助教與學生事後怎麼評價它。

## 課程影片來源

官方 Fall 2025 YouTube 播放清單（AI Safety，17 支）已於 2026-10-10 即時核對，列有期末口頭報告錄影（約 75 分鐘）；本文「口頭報告影片」一節即依這支影片整理。

```youtube
url: https://www.youtube.com/watch?v=Xr9FNl0S66Q
title: AI Safety (CS 2881) Oral presentations of student projects
```

原始影片：[AI Safety (CS 2881) Oral presentations of student projects](https://www.youtube.com/watch?v=Xr9FNl0S66Q)

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了《Oral presentations of student projects》（1:15:40）的完整自動字幕：確認 7 組報告的出場順序（AI-induced Psychosis、Who Said That?、Improving GCG、法律幻覺、Phase Transitions in Backdoor Learning、Subliminal Learning、Evolutionary Alignment）、開場說明每組 10 分鐘（含提問），以及後門組被問 QLoRA 4-bit 量化、Evolutionary Alignment 組被問 ES 是否只是 GRPO 的正則化這兩個問答。字幕沒有時間碼，原表的精確起始時間與 `?t=` 深連結無法驗證，已改為只標出場順序。

## 用到的官方材料與存取狀態

| 材料 | 內容 | 狀態 |
|---|---|---|
| [Student Projects 頁](https://boazbk.github.io/mltheoryseminar/student_projects) | 19 份期末論文 PDF、17 份海報 PDF、摘要 | 公開 |
| [口頭報告影片](https://youtu.be/Xr9FNl0S66Q) | 「AI Safety (CS 2881) Oral presentations of student projects」，1:15:40，2026-01-07 上傳 | 公開 |
| [Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I) | 分組、兩種專題、交件要求、時程、附 mentor 的題目清單 | 公開（Google Docs） |
| [Final Project Grading Rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM) | 100 分評分表 | 公開（Google Docs） |
| [Reflections on TA-ing Harvard's first AI safety course](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) | head TA Roy Rinberg 的回顧，2026-01-15 | 公開 |
| [Learnings from AI safety course so far](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv) | Boaz Barak 的期中心得，2025-09-27 | 公開 |
| [Harvard Q-report](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) | 官方匿名課程評鑑，8 頁 | 公開 |

本篇用到的材料全部公開，拿不到的只有兩樣：每組的成績與助教回饋，以及沒放上專題頁的組別。head TA 回顧寫「約 23 組期末專題」，專題頁實際列 19 份論文，差額沒有說明。

系列整體的存取分級（A3，附缺口清單）見[系列入口](/posts/ai/2026-09-30-cs2881r-course-overview)。

## 期末專題的規格

### 兩種專題

[Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I) 規定 2–4 人一組（1 人或 5 人要事先核准），並給兩種選擇：

- **延伸既有論文（Extension-of-existing-work）**：跟[期中 mini-project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project) 同一個模式，重現並延伸一篇論文的結果，但重心要放在延伸。可以接著期中做，重現只應占期末專題的一小部分。
- **長期研究（Longer-term research）**：要有像樣的文獻回顧、未來工作的提案、初步實驗，以及一段 theory of change，說明這個專案怎麼讓 AI 更安全。

說明文件也寫明，政策題目可以做，但授課團隊偏技術，要逐案核准，而且每個專案都必須有技術成分。

head TA 回顧各舉了例子：延伸型的代表是一份 [CoT faithfulness 研究](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/Report_-_Nicolas_Weninger.pdf)；長期研究型的代表是兩組做模型指紋（[1](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/CS2881_Final_Project_-_Annesya_Banerjee.pdf)、[2](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/Dynamic_Model_Fingerprinting_-_Valerio_Pepe.pdf)），以及一組開放式地調查 [AI 誘發的精神病（AI psychosis）](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/final_project_cs2881r_-_Bright_Liu.pdf)。

### 交什麼、什麼時候交

- 5–10 頁論文，附錄最多 10 頁。說明文件不規定內容，但期待有實驗結果，整體以 NeurIPS 風格的 ML 論文為準。
- 一張海報，在期末報告場次展示。
- 時程：11 月 13 日前報名；11 月 19 日前跟一位 TF 見面，會前準備 2–4 段的專案摘要，會後貼到報名表與 Slack；12 月 3 日交論文；12 月 11 日 3:45–6:30 PM 期末報告。

head TA 回顧寫的是「12 月 10 日帶著印好的海報來上課」，跟說明文件差一天；說明文件的 12 月 11 日是週四，與課站列的上課時段（週四 3:45–6:30）一致。回顧也記下實際節奏：期末專題 11 月初才開始，12 月初就截止。

經費上，回顧提到 Boaz 為每組期中補助約 50 美元、每個期末專題約 500 美元的費用，多數組用不到這麼多。（期中規格投影片寫的是每個專案 200 美元 compute，兩份文件數字不同。）

### 題目清單

說明文件後半是 head TA 向各方徵集的題目，多數附 mentor 與可投入的時間。第一個註腳寫明「我們有明確的偏好，非常鼓勵你挑清單以外的題目」。

| 題目 | mentor（文件所列） |
|---|---|
| 驗證 ML 計算圖是否來自同一模型（例如比對原模型與 speculative decoding 模型） | Roy Rinberg |
| 黑箱模型指紋與鑑識 | Roy Rinberg |
| 雜項對齊題（訓練模型輸出自身機制、微調蛋白質語言模型的濫用風險、prompt 最佳化的新興風險） | Core Park |
| AI 詐騙：改進 [ScamBench](https://scambench.com/)、做背景偵測原型、紅藍隊實驗 | Fred Heiding |
| 遺忘（unlearning）評測基準 | Roy Rinberg |
| 用 LLM 與預測市場數學對抗網路假訊息 | Jonathan Schaffer |
| 延伸 Tim Hua 的 AI psychosis 調查 | Tim Hua |
| GPU 位置驗證（與 Lucid Computing 合作） | Lucid Computing |
| 價值體系評估、reward model 過度最佳化 | Hanlin Zhang |
| 判斷 jailbreak 微調是否「故意」移除安全防護 | Roy Rinberg |

清單之後還附了 prompt injection／jailbreak、浮水印／後門的參考文獻。head TA 事後估計約 5 組的題目來自這份清單。

## 評分表：寫作占三分之二

[評分表](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)滿分 100：

| 大項 | 子項 | 配分 |
|---|---|---|
| Writeup（65） | 文獻回顧 | 10 |
| | Theory of change 與動機 | 10 |
| | 方法與貢獻 | 15 |
| | 評估實驗 | 15 |
| | 寫作與清晰度 | 10 |
| | 穩健性與限制的反思 | 5 |
| Code & Reproducibility（15） | README 與文件 | 5 |
| | 程式品質與組織 | 5 |
| | 結果可重現性 | 5 |
| Poster（20） | 大局是否一眼看懂 | 5 |
| | 版面與可讀性 | 5 |
| | 關鍵結果的傳達 | 5 |
| | 現場講解與問答 | 5 |

幾個讀評分表時值得注意的地方：

- **「方法與貢獻」的滿分描述接受「一個深入、執行良好的貢獻」**，不要求做很多件事。
- **「評估實驗」的滿分描述要求「意識到陷阱」**，跟最後一項「穩健性與限制」呼應。
- **海報的「關鍵結果」一項明寫看的是傳達清不清楚，不是結果好不好。**
- 「程式品質」一項的三個錨點寫成 3／7／5，7 超過該項上限 5，看起來是文件筆誤，本文照原文轉述、不推測原意。

文獻回顧與 theory of change 兩項合計 20 分，正好對應「長期研究型」專題在說明文件裡的要求。

## 學生做出了什麼：19 份論文分組

[專題頁](https://boazbk.github.io/mltheoryseminar/student_projects)依原順序列出 19 份論文，19 份都附論文 PDF，其中 17 份附海報。下表是依摘要做的主題分組（分組是本文的整理，不是課程官方分類），並標出它接回系列的哪一篇。

| 主題 | 論文 | 接回本系列 |
|---|---|---|
| 微調改變模型人格：persona 與內部表徵（5 份） | Mechanisms of Subliminal Learning；Predicting Finetuning Personality Shifts with Linear Directions；Are Personas All You Need?；Cross-Format Elicitation of Underlying Emotions；Feeling the Strength but Not the Source（partial introspection） | [HW0 emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment)、[L10 interpretability](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability) |
| Chain of thought 與推理監控（4 份） | Obfuscation in LLMs；House, G.P.T.（CoT 病理診斷）；Compute as a Safety Control；Evaluating CoT Faithfulness | [L8 scheming](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)、[L10](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability) |
| 攻擊與資料投毒（2 份） | Improving GCG（Soft-GCG 與 activation 目標）；Phase Transitions in Backdoor Learning | [L3 對抗穩健性](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness) |
| 模型溯源與指紋（2 份） | LLM Fingerprints From Normal Interaction；Who Said That?（GEPA 與 LLM-as-judge） | head TA 的題目清單 |
| 真實使用情境的風險（3 份） | Sure, I Can Draft a Complaint!（自訴當事人的法律幻覺）；AI-induced Psychosis；Moral Choice and Collective Reasoning | [L11 情感依賴](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance) |
| 偵測方法與替代訓練法（3 份） | When the Manifold Bends（幻覺的幾何預測因子）；Evaluating Orthogonal Projections（假訊息偵測）；Evolutionary Alignment（用 Evolution Strategies 取代 RL） | [L2 LLM 訓練](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training) |

前兩組加起來 9 份，將近一半。head TA 回顧也觀察到這個傾向：學生偏好課堂上講過的「亮眼」主題，特別點名 [persona vectors](https://www.anthropic.com/research/persona-vectors)。

挑幾份看得出「重現 + 延伸」這個骨架的：

- **Feeling the Strength but Not the Source**：在 Llama-3.1-8B-Instruct 上重現 Anthropic 的 emergent introspection 結果（摘要寫 20% 準確率），發現它對 prompt 很脆弱；延伸出的發現是模型能分辨注入概念向量的強度。
- **Improving GCG**：GCG 是期中 mini-project 的四篇候選論文之一。這組提出 Soft-GCG，摘要寫比原方法快 43 倍、攻擊成功率持平，並在 Gemma 3 家族上看到小模型（1B–4B）仍然脆弱、12B 以上抵抗得住。
- **AI-induced Psychosis**：出自題目清單的 Tim Hua 題。先在四個前沿模型上重現 Hua 的評估，再量化長對話中的語意漂移，測三種介入策略。
- **Evaluating CoT Faithfulness**：head TA 指定的延伸型範例，研究嵌入提示時 CoT 還能不能當可靠訊號。

每份的方法、數據與限制，請直接讀 PDF；本文只轉述專題頁摘要，不替它們背書。

## 口頭報告影片：7 組、每組約 10 分鐘

[口頭報告影片](https://youtu.be/Xr9FNl0S66Q)開場時，主持人說明每組 10 分鐘（含提問與換場）。依影片字幕，75 分鐘裡依序報告了 7 組：

| 順序 | 專題 |
|---|---|
| 1 | AI-induced Psychosis |
| 2 | Who Said That?（動態模型指紋） |
| 3 | Improving GCG |
| 4 | Sure, I Can Draft a Complaint!（法律幻覺） |
| 5 | Phase Transitions in Backdoor Learning |
| 6 | Mechanisms of Subliminal Learning |
| 7 | Evolutionary Alignment |

影片沒有章節，說明欄也沒有時間戳，自動字幕也不帶時間碼，所以上表只保證出場順序（依字幕文字順序核對）；全片平均約每 10 分鐘換一組。影片值得看的不只是報告本身，還有問答：例如後門組被問到相變現象會不會是 QLoRA 4-bit 量化造成的假象，Evolutionary Alignment 組被問到 ES 會不會只是 GRPO 的一種正則化。這些問題正是評分表「穩健性與限制」一項要學生自己先想到的。

其餘 12 組只有論文與海報，影片裡沒有。

## 課程回顧：助教怎麼看

[head TA 回顧](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)是這門課最完整的幕後紀錄。它先交代規模：274 人填興趣表單，約 70 名學生，約一半是資深大學部，其餘是研究生（其中約兩成是博士生）；1 位教授、4 位 TA；每週上課一次、3 小時，多數講次靠客座講者。

### 作者認為有效的

- **「重現 headline figure」好批改。**回顧的原話是評分要找「難做、好驗證」的東西；重現一張論文主圖容易驗證，又逼學生真正碰到材料。要求「有意義的延伸」則逼學生不只是在既有程式碼上跑 Claude Code。
- **強制跟 TA 見面。**學生得有備而來、自己先想很多；對熟悉問題領域的 TA 來說，很快就能掌握每組進度。代價是 head TA 得把每組會議壓在 30 分鐘。
- **期中當分組試水溫。**mini-project 讓學生找到想合作的人，又不會綁死。
- **讓學生成果對外可見。**論文與海報上網、鼓勵學生把週實驗寫成 LessWrong 文章（回顧說共 11 篇），幫學生累積進入 AI safety 領域的履歷。
- **學術界的角色。**回顧認為 AI safety 論文很多是「試了一個東西，有效」，學術界可以接手檢查這些結果多穩健、何時會壞、論文沒寫出來的限制是什麼。

### 作者認為要改的

1. 期末專題要更早開始。
2. 評分表要更早公布。第一屆常常作業發下去時評分表還沒準備好。
3. 閱讀材料的要求可以稍微（不要太多）加強。
4. 每週的學生實驗報告要給更多結構，並給學分；目前它很花力氣、不計分，也不能抵其他作業。
5. 題目清單值得保留。雖然只有約 5 組直接採用，作者認為下一屆會投入同樣的力氣重做。

回顧也坦白兩個前提：這套偏鬆的結構靠的是學生主動想學、不太在意成績，作者認為如果是大學部課程不會這麼順；而課程能運作，很大程度靠助教團隊投入大量時間。

## 課程回顧：學生怎麼看

### Boaz 的期中心得

[Boaz 在 9 月底的心得](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv)把每週學生實驗列為最意外的成功：他原本擔心時間太短做不出東西，結果連失敗的嘗試都值得報告。他也列了三個不確定：技術與哲學的比重、廣度課（他自稱「tasting menu」）沒辦法在任何主題上深入，以及他同時在 OpenAI 對齊團隊任職的利益衝突。他寫道，因為課程難以出每週作業，所以只安排 mini-project 與期末專題。

### Harvard Q-report 的數字

[Q-report](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) 是 Harvard 官方評鑑，課程名冊 65 人。幾個關鍵數字（5 分制）：

| 題目 | 本課平均 | 系平均 |
|---|---|---|
| 課程整體（35 人作答） | 4.43 | 3.99 |
| 課程材料 | 4.41 | 4.13 |
| 作業 | 4.19 | 3.79 |
| 作業回饋 | 3.59 | 3.68 |

回饋是唯一低於系平均的一項，也是全課評分最低的一項；給「Fair」以下的有 9 人。其他數字：課外每週平均約 5.5 小時（報告排除填 31 小時以上的回答），53% 覺得難度「中等」，63% 表示會熱烈推薦給同學。

### 學生的批評集中在哪

Q-report 的文字意見與 head TA 回顧附的 Google 表單摘要（21 份）指向同幾件事：

- **組織與時程**：學期開始時課綱沒寫專題，專題說明與評分標準都太晚出來；溝通散在 Slack、Perusall、Google 表單與個人網站，Canvas 上什麼都沒有。
- **技術深度**：希望有更技術的講課、更多 interpretability、可選的 problem set。
- **批判性討論**：有學生認為課程把業界的 AI safety 研究當成定論，希望有更多全班辯論、更多時間質疑客座講者；也有人認為幾乎每堂都錄影上傳，會讓討論不敢太有爭議。
- **閱讀量**：有人建議節錄論文，因為 150 頁以上的閱讀會讓人很早就開始跳讀。

正面意見則集中在客座講者、閱讀清單的挑選，以及用小實驗取代傳統作業。

## 校外讀者怎麼用這一篇

如果你跟著這個系列走到這裡，下一步是自己跑一次期末專題：

1. **先選型。**手上已有期中重現的程式碼，就選延伸型，把重現壓到一小部分；想做長期題目，先寫出一段 theory of change。
2. **從題目清單或 19 份論文挑起點。**讀一份同主題學生論文的「限制」段落，它通常就是下一個延伸方向。
3. **用評分表倒推。**寫作占 65 分：先把文獻回顧、評估設計與限制反思寫進大綱，再開始跑實驗。
4. **找一個「TA 會議」的替代品。**11 月 19 日前那次強制見面，本質是逼你寫出 2–4 段摘要給別人看；找一位同儕或 mentor 做同一件事。
5. **看口頭報告影片的問答。**把每一個被問倒的問題當成你自己論文限制段落的檢查清單。

## 延伸閱讀

- 研究專題的流程方法論 → [CS224U 期末專案流程：文獻回顧與實驗計畫](/posts/ai/2026-09-29-cs224u-lit-review-experiment-protocol)
- 可解釋性工具（probing、attribution）→ [CS224U 分析方法](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)
- LLM-as-judge 的評測風險 → [CS329Z 第 8 週：judge 與安全](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)
- 各校課程公開程度 → [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 系列導航

- 上一篇：[L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035)
- 系列入口：[Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)
- 本篇是系列最後一篇。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方播放清單列有期末口頭報告錄影，已嵌入並改為已附影片。
- 2026-10-10：依字幕核對影片內容。出場順序與兩個問答屬實；字幕無時間碼，已移除無法驗證的精確起始時間與 `?t=` 連結，並把「9 分鐘報告加 1 分鐘換場」改為字幕實際說的「每組 10 分鐘（含提問）」。

## 參考資料

- [CS 2881R 期末專題頁：Student Final Projects – Fall 2025](https://boazbk.github.io/mltheoryseminar/student_projects)
- [CS 2881 期末專題口頭報告影片（YouTube）](https://youtu.be/Xr9FNl0S66Q)
- [CS2881R 期末專題說明 Final Project Outline（Google Docs）](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I)
- [CS2881R 期末專題評分表 Final Project Grading Rubric（Google Docs）](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)
- [Roy Rinberg 課程回顧：Reflections on TA-ing Harvard's first AI safety course（LessWrong）](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)
- [Boaz Barak 期中回顧：Learnings from AI safety course so far（LessWrong）](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv)
- [Harvard CS 2881R 課程評鑑 Q-report（2025 Fall，PDF）](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf)
- [CS 2881R Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS 2881R YouTube 播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)
- [LessWrong wikitag: CS 2881r](https://www.lesswrong.com/w/cs-2881r)
