---
title: "AI 安全：從風險辨識到實驗與研究的學習路線｜Harvard CS2881R 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, course-guide]
lang: zh-TW
math: true
series:
  name: "Harvard CS2881R 導讀"
  order: 0
tldr: "Harvard CS 2881R 是 Boaz Barak 的研究所 AI 安全研討課，12 講圍繞四個問題：訓練好的模型怎麼會失準（emergent misalignment、安全訓練疊在哪一段）、它怎麼被攻破又該怎麼規範（jailbreak、model spec、內容政策）、最難察覺的風險怎麼偵測（scheming、chain of thought 與 activation 監控）、AI 進展多快衝擊多大（遞迴自我改進、METR 任務長度、就業與心理健康）。沒有習題，學法是讀論文、重現主圖、再往前推一步；HW0 讓你用 1B 模型親手重現失準。"
description: "Harvard CS 2881R AI Safety（Fall 2025）系列入口：四個問題串起的 12 講與每講在講什麼、一個用 METR 翻倍時間外推任務長度的手算例子、先修與自我檢查、閱讀順序與校外拿得到的材料。"
draft: false
glossary:
  - term: "emergent misalignment"
    aliases: ["EM", "突現失準"]
    definition: "只在一個狹窄領域（例如給壞的醫療建議）微調語言模型，模型卻在無關的問題上也表現出廣泛失準的現象。"
    context: "CS 2881R 的 HW0 就是用 1B 模型重現這個現象。"
    links:
      - label: "Model Organisms for Emergent Misalignment (arXiv 2506.11613)"
        url: "https://arxiv.org/abs/2506.11613"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-course-overview-en)

**影片狀態：已附影片。** 導言附第 1 講錄影（2 小時 26 分），各講錄影在各講導讀。[影片來源與說明](#課程影片來源)

[CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) 是 Harvard 的研究所研討課，授課者是理論計算機科學家 [Boaz Barak](https://boazbarak.org)，2025 年秋季第一次開。課站對它的描述是：談人工智慧對齊與安全的挑戰，同時看技術面和社會影響。

這門課的核心問題可以這樣說：我們用資料和獎勵把模型訓練成想要的樣子，但訓練訊號只是我們意圖的近似。模型會在哪些地方偏離意圖、偏離時我們看不看得出來、看得出來又能怎麼辦？12 講從這個問題出發，一路從訓練細節講到經濟與社會。

這門課沒有習題。多數講次有閱讀清單、講課（多半有客座）和一組學生的實驗報告；作業是重現論文、再往前推一步。這篇是系列入口：先講四個問題各自在講什麼，再用一個手算例子示範這門課怎麼看 AI 進展的數字，最後給先修檢查與閱讀路線。下面是第 1 講錄影：Boaz 先介紹課程，接著是學生實驗報告，後半是他對 AGI 定義與對齊方法的整理；不必一次看完，讀到第 1 講導讀再回來對照。

```youtube
url: https://www.youtube.com/watch?v=-NCiWaRS6So
title: CS2881R Fall 2025 L1: Introduction
```

## 主線：四個問題

本系列沒有照官方日期排，而是依下面四個問題重排（每篇標題保留官方講次）。官方課表把技術講和社會講交錯排，重排後前一講的概念會在下一講用到。

### 訓練好的模型怎麼會失準（第 1、2 講與作業 0）

[第 1 講](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction)先擺出三種對未來的看法：AI 2027 描繪靠遞迴自我改進在五年內到超人 AI，AI as Normal Technology 主張 AI 會像電力一樣慢慢擴散，METR 量到「AI 有五成機率完成的任務長度」約每 7 個月翻倍。Boaz 把對齊方法分成三類：寫原則、訓練品格、寫 model spec。

[作業 0](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment) 讓你親眼看到失準：用 LoRA 把 Llama-3.2-1B 微調在壞的醫療建議上，模型回答無關的問題時也變得有害，這叫 emergent misalignment。只教了一個狹窄領域，壞掉的卻是整體人格。

[第 2 講](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training)把 pretraining、SFT、RL 看成同一件事：加強某些 token、壓低某些 token，差別在資料是別人寫的還是模型自己生的。安全訓練疊在後兩段，現在的做法（Deliberative Alignment）是先教模型在思考鏈裡讀 spec，再用懂 spec 的獎勵模型做 RL。一個重要警告：對思考鏈施加最佳化壓力，模型學到的不是不作弊，而是作弊時不說。

### 模型怎麼被攻破，又該怎麼規範（第 3、4、5 講）

[第 3 講](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness)說明對齊過的模型為什麼還會被 jailbreak：安全訓練修掉的是某些攻擊方式，底下的弱點還在。Nicholas Carlini 示範用梯度找出能跨模型轉移的對抗後綴，Boaz 則借用軟體安全的教訓：攻擊只會越來越強，要縱深防禦。

[第 4 講](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs)問 model spec 該寫原則還是細則。答案是原則、人格、明確政策三者混用，而關鍵在規則要能檢查：「證明定理或給反例」是壞規則，「證明、給反例或說明做不到」才是好規則，因為只有判定得了違規，才能拿來訓練和評估。

[第 5 講](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies)把社群平台二十年的內容審核經驗搬到生成式 AI：線畫在哪裡都有邊界案例，但總得畫；聊天介面又介於私人文件與公開貼文之間，比社群平台更難定位。

### 最難察覺的風險怎麼偵測（第 8、10 講）

[第 8 講](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)談 scheming：模型為了通過訓練或評測而裝乖、作弊。Boaz 把這類行為歸成「系統性失準」，是訓練訊號把模型推過去的。學生實驗把 coding agent 丟進不可能完成的任務，它們在明文禁止下仍會改測試。Redwood 的 Buck Shlegeris 主張先假設模型在密謀，用 AI control 守住部署。

[第 10 講](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability)從兩個方向偵測：讀模型寫出來的 chain of thought，或讀它的 activation。CoT 監控抓 reward hacking 有效，但把監控器放進訓練獎勵，模型就學會隱藏意圖，和第 2 講的警告是同一件事。Neel Nanda 的建議是先跟簡單的 baseline 比，steering vector 常常贏過 SAE。

### AI 進展多快，衝擊多大（第 6、7、9、11、12 講）

[第 6 講](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement)用成長理論問：AI 開始自己做 AI 研發後，能力會維持指數、加速成奇點，還是被瓶頸拖慢？答案取決於幾個量不準的指數，唯一能排除的是「AI 對研發沒什麼影響」。[第 7 講](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)處理一個謎：基準測試上任務長度每 7 個月翻倍，METR 的隨機對照試驗裡資深開發者用 AI 卻慢了 19%。原因之一是基準任務太乾淨、評分太便宜。

[第 9 講](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts)看就業：22–25 歲、在 AI 高曝險職業的年輕人就業相對下降 16%，資深員工沒有同樣趨勢，總體就業還看不出大規模替代。[第 11 講](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance)談聊天機器人與心理健康，Boaz 提出一個他自己說未經證實的解釋：對話越長、越偏離訓練分布，模型越容易退回「順著故事討好」的模式。[第 12 講](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035)看十年後：GDPval 用產業專家的真實工作成品當標準答案來量 AI；coding agent 還沒自動化 AI 研究，因為驗證太貴、回饋迴圈太長。

## 手算一次：任務長度翻倍能外推多遠

這是本文的教學例子，用來體會第 1、6、7 講為什麼一直回到「指數」。

METR 的量法是：找出一個任務長度，使模型對「人類要花這麼久」的任務有 50% 成功率。他們報告這個長度約每 7 個月翻倍，Claude 3.7 Sonnet 約一小時。假設從 1 小時出發，翻倍時間維持 7 個月：

| 經過時間 | 翻倍次數 | 任務長度 |
|---|---|---|
| 1 年 | 12/7 ≈ 1.7 | $2^{12/7} \approx 3.3$ 小時 |
| 3.5 年 | 6 | $2^6 = 64$ 小時，約 1.6 個工作週 |
| 7 年 | 12 | $2^{12} = 4096$ 小時，約 102 個工作週（每週 40 小時） |

如果 AI 開始加速 AI 研發，把翻倍時間縮成 4 個月，7 年就是 21 次翻倍，$2^{21} \approx 210$ 萬小時，差了 500 多倍。

**這個例子的意思：** 同樣七年，翻倍時間從 7 個月變 4 個月，結論就從「有五成機率做完兩年份的專案」變成「一千年份的工作」（以每年約 52 個工作週換算）。第 6 講說答案取決於幾個量不準的指數，指的就是這種敏感度。第 7 講再提醒另一件事：這條曲線量的是乾淨的基準任務，換成真實工作（隨機對照試驗裡慢了 19%）不一定照著走。所以這門課對時間軸的態度是兩邊的論證都要讀，不要只背一個數字。

## 先修與自我檢查

課站的先修是數學成熟度、會寫證明、機率與資訊理論，加上大學部 ML 的程度（舉例 Harvard CS 181 或 MIT 6.036）：熟悉 empirical 與 population loss、梯度下降、神經網路、線性迴歸、PCA，會寫 Python、能訓練基本的神經網路。站內可以先讀 [Harvard CS 181 導讀](/posts/tech/2026-08-27-harvard-cs181-overview)；作業 0 要用 LoRA 微調，沒碰過可以先看 [CMU 11-868 的 PEFT／LoRA 篇](/posts/ai/2026-09-30-cmu11868-peft-lora)。

讀完這篇，試著回答：

1. emergent misalignment 和一般的「模型學壞」差在哪？
   答：只在一個狹窄領域微調（例如壞的醫療建議），模型在無關的問題上也變得有害。失準擴散到訓練範圍以外。
2. 為什麼不該把 chain of thought 監控器放進訓練獎勵？
   答：模型會學到「作弊時不寫出來」，監控就失去作用。第 2 講與第 10 講都講到這點。
3. 「回答時要證明定理或給反例」為什麼是壞規則？
   答：遇到做不到的題目，模型只能違規或亂編；加上「或說明做不到」後，違規才判定得了，規則才能用來訓練與評估。
4. 任務長度每 7 個月翻倍，從 2 小時出發，兩年後大約多長？
   答：24/7 ≈ 3.4 次翻倍，$2 \times 2^{24/7} \approx 22$ 小時。
5. 基準測試顯示 AI 很強，隨機對照試驗卻顯示開發者變慢，兩者為什麼可能都對？
   答：基準任務比真實工作乾淨、評分便宜、不需要那麼多脈絡；兩者量的是不同的東西。

## 怎麼讀：順序與材料

本系列以已經結束的 Fall 2025 為主線。它的學法是讀論文、重現、延伸，校外拿得到的材料：

- **各講**：課站的閱讀清單（多數講次有）；[YouTube 播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)有 11 講的講課錄影（第 5 講在課站與播放清單上都只有學生實驗影片，第 8 講只有開場）；學生寫的 [LessWrong 週摘要](https://www.lesswrong.com/w/cs-2881r)涵蓋部分週次。投影片只有約一半講次公開。
- **作業 0**：[GitHub repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) 公開，評分腳本用 LLM 當裁判，校外要自備 OpenAI API 金鑰。
- **期中與期末**：期中是 2–4 人一組，從四篇論文挑一篇重做它的主圖，再做一兩個延伸，交 3–5 頁報告；期末是延伸既有論文或做長期研究，交 5–10 頁論文加海報。規格與評分表都公開，可以完整照做；但沒有習題、也沒有標準答案，目標是學會重現與延伸，不是做完一套練習。

| order | 篇目 | 官方講次 |
|---|---|---|
| 1 | [L1 Introduction](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction) | 第 1 講 |
| 2 | [HW0：重現 emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment) | 作業 0（開學前） |
| 3 | [L2 Modern LLM Training](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training) | 第 2 講 |
| 4 | [L3 Adversarial Robustness](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness) | 第 3 講 |
| 5 | [L4 Model Specifications](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs) | 第 4 講 |
| 6 | [L5 Content Policies](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies) | 第 5 講 |
| 7 | [期中 mini-project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project) | 期中 |
| 8 | [L8 Scheming & Deception](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception) | 第 8 講 |
| 9 | [L10 Interpretability](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability) | 第 10 講 |
| 10 | [L6 Recursive Self-Improvement](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement) | 第 6 講 |
| 11 | [L7 Capabilities vs. Safety](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety) | 第 7 講 |
| 12 | [L9 Economic Impacts](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts) | 第 9 講 |
| 13 | [L11 Emotional Reliance](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance) | 第 11 講 |
| 14 | [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035) | 第 12 講 |
| 15 | [期末專題與課程回顧](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective) | 期末 |

作業 0 排在第 1 講之後，因為它在官方時間線上本來就早於第一講，是選課門檻；第 1 講課堂上的學生實驗也是它的反向版本。

讀客座講次時要知道一件事：課站寫明 Boaz 同時是 OpenAI 的技術人員，第 5、9、10、12 講也都有來自 OpenAI 的客座。課程會討論多家廠商的模型，各講導讀會照實標出講者身分。

Fall 2026 正在上，課表換了一批講題（Cyber Capabilities、RL for Post-Training、AI Biosecurity 等），作業 0 也換了題；本系列不引用，學期結束後再評估要不要另寫。

## 今晚可以做的事

1. 打開[作業 0 repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) 的 README，看完 Instructions 三步，判斷你手上的 GPU 或雲端額度跑不跑得動 1B 模型的 LoRA 微調。
2. 把上面「手算一次」的表自己算一遍，再把翻倍時間換成 10 個月算一次。
3. 讀[第 1 講導讀](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction)。

## 站內延伸閱讀

- LLM 訓練與 RLHF：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)、[Stanford CME295 導讀](/posts/ai/2026-09-29-cme295-course-overview)
- 強化學習基礎：[Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)
- 可解釋性：[CS224U 分析方法：probing 與 attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)
- Prompt injection 與 agent 安全實務：[Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)
- LLM-as-judge：[Stanford CS329Z 第 14 堂：模型當裁判](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge)與[第 15 堂：護欄](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety)
- Harvard 其他課：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)

## 課程影片來源

本文是課程總覽，導言嵌入第 1 講錄影；其餘各講請由官方播放清單依講次選擇。Fall 2025 有第 1–4、6–12 講的講課錄影、第 5 與第 8 講的學生實驗影片、第 8 講的開場與期末口頭報告；同一播放清單也混有 Fall 2026 的第 1、3 講，本系列不使用。

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)
- [第 1 講錄影](https://www.youtube.com/watch?v=-NCiWaRS6So)（導言嵌入，2 小時 26 分）

查核日期：2026-10-14。

## 更新紀錄

- 2026-10-14：正文改寫成導讀：以四個問題串起 12 講並逐講講出內容，補任務長度翻倍的手算例子與自我檢查，導言嵌入第 1 講錄影；課站網址、基準學期、存取分級、利益揭露與 Fall 2026 預覽縮成閱讀路線裡的幾段。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料


- [CS 2881R AI Safety, Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/) — 課程描述、先修、Mini Syllabus、利益揭露、12 講課表與閱讀清單
- [CS 2881R Fall 2026 首頁](https://boazbk.github.io/mltheoryseminar/) — 新學期課表、作業結構、上一屆材料保留說明
- [CS 2881R Fall 2026 Homework Zero](https://boazbk.github.io/mltheoryseminar/hw0-2026/) — 新 HW0 題目、時數、繳交要求
- [CS 2881R YouTube 播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) — 講課錄影
- [LessWrong wikitag：CS 2881r](https://www.lesswrong.com/w/cs-2881r) — 學生週摘要與實驗文
- [Harvard-CS-2881/harvard-cs-2881-hw0](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) — Fall 2025 HW0 repo
- [Student Final Projects - Fall 2025](https://boazbk.github.io/mltheoryseminar/student_projects) — 19 份期末論文與海報
- [期末口頭報告錄影](https://youtu.be/Xr9FNl0S66Q)
- [Roy Rinberg, Reflections on TA-ing Harvard's first AI safety course（LessWrong, 2026-01-15）](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) — 學生人數、作業結構、期末日期、期中與期末文件連結
- [CS2881 Mini-project 說明投影片](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew)、[Mini Project Grading](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII)
- [cs2881 Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I)、[Final Project Grading Rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)
- [Harvard Q-report（課程評鑑）](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf)
- [Turner et al., Model Organisms for Emergent Misalignment (arXiv 2506.11613)](https://arxiv.org/abs/2506.11613) — HW0 依據的論文
