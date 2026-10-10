---
title: "CS2881R L1：為什麼 AI 安全值得一門研究所課"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, emergent-misalignment]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 1
tldr: "CS 2881R 第一講（2025-09-04）用三篇 pre-reading 把問題攤開：AI 2027 描繪五年內靠遞迴自我改進走到超人 AI，AI as Normal Technology 主張 AI 會像電力一樣慢慢擴散，METR 則用「人類要花多久的任務，AI 能有五成機率完成」量到這個長度約每 7 個月翻倍。Boaz 的講課把 AGI 的定義拆成能力與衝擊兩種，把對齊方法分成原則、品格訓練、model spec 三類。課堂實驗把 HW0 反過來做：在生物倫理題上微調對齊答案，環境政策題的對齊分數也跟著上升。"
description: "Harvard CS 2881R AI Safety（Fall 2025）第一講導讀：三篇 pre-reading（AI 2027、AI as Normal Technology、METR 長任務量測）、Boaz Barak 講課中的 AGI 定義、對齊方法三分法與失效模式清單，以及 Valerio Pepe 的 emergent alignment 與 on-policy 微調實驗。依據錄影、LessWrong 週摘要與課站閱讀清單。"
draft: false
glossary:
  - term: "time horizon（METR）"
    aliases: ["50% time horizon", "任務時間長度"]
    definition: "METR 衡量 AI 能力的方式：找出一個任務長度，使得模型對「人類專家需要這麼久才能完成」的任務有 50% 成功率。"
    context: "METR 量到這個長度過去六年約每 7 個月翻倍，是 L1 的 pre-reading。"
    links:
      - label: "METR: Measuring AI Ability to Complete Long Tasks"
        url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/"
  - term: "capability-adoption gap"
    definition: "技術已經有能力做某件事，到經濟體真的普遍用它做這件事之間的時間差。"
    context: "Boaz 用它區分以能力定義與以衝擊定義的 AGI。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction-en)

> **版本說明**：依據 [CS 2881R Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-sep-4)第一講條目，2026-09-30 核對。講課內容的轉述以學生寫的 [LessWrong Week 1 摘要](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction)為主要依據；投影片放在 Harvard SharePoint，本文未能以程式讀取其內容，因此不直接引用投影片。

**系列位置**：上一篇 [系列總覽](/posts/ai/2026-09-30-cs2881r-course-overview)｜下一篇 [HW0：用 1B 模型親手重現 emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment)

一門 AI 安全課的第一堂，最難的不是講風險，是先說清楚「我們在擔心什麼東西」。有人覺得五年內會出現超人 AI，有人覺得 AI 只是下一個電力，兩邊對「安全」的定義差很遠。

[CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) 第一講（2025-09-04）的處理方式，是讓學生課前先讀立場相反的兩篇文章，再讀一篇量測方法，然後在課堂上把定義一個個拆開。這篇依序整理這三塊：課前讀什麼、Boaz 講了什麼、學生實驗做了什麼。

## 課程影片來源

官方 Fall 2025 課表提供部分講次錄影；本篇的直接影片連結尚未由這次取得的官方頁面核實，請由課表查看可用錄影。

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## 這一講的材料

| 材料 | 狀態 |
|---|---|
| 講課錄影 | [YouTube](https://youtu.be/-NCiWaRS6So)（標題「AI Safety (CS 2881) Lecture 1」，約 2 小時 26 分）；課站另附 [Panopto 版](https://harvard.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=8973f8d6-35e1-45c1-8b5f-b33d0142ac53) |
| 講課投影片 | [Harvard SharePoint](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EZ22E4Kq3JlJs-qzDdw6BwwBfcL53FYUoy9mDIWMlg-gQA?e=xfXjdM)（PowerPoint Online） |
| 學生實驗投影片 | [Valerio Pepe 的投影片](https://docs.google.com/presentation/d/10XdI3_j_ulp38MJmmXvLE1wYdbAlCFk0jOt1cvc7C1Y/edit?usp=sharing) |
| 週摘要 | [LessWrong Week 1](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction)（Jay Chooi、Natalia Siwek、Atticus Wang） |
| 實驗文 | [Some Generalizations of Emergent Misalignment](https://www.lesswrong.com/posts/jzRGMFxx4dFyDHHcL/some-generalizations-of-emergent-misalignment)（週摘要所附連結） |

週摘要寫到，每週課程固定是「課前閱讀 → Boaz 講課 → 一組學生的實驗報告」，一次上 2 小時 45 分。這個節奏整學期不變。

## 課前三篇：兩種世界觀和一把尺

課站把三篇標為 pre-reading，另外列了十一篇延伸閱讀（Bostrom 的 Vulnerable World Hypothesis、Carlsmith 的 power-seeking 論文、Epoch 的算力趨勢等）。

### AI as Normal Technology：擴散本來就慢

[Narayanan 與 Kapoor 的這篇文章](https://knightcolumbia.org/content/ai-as-normal-technology)主張把 AI 當成電力、網際網路那樣的「一般技術」來理解。週摘要整理出幾個重點：

- 不管 AI 本身進步多快，進入社會的速度，尤其是在安全攸關的領域，天生就慢
- 在 benchmark 上考得好，例如律師考試排前 10%，不等於能當 AI 律師
- 風險（意外、軍備競賽、濫用）可以像其他技術風險一樣，用規範、市場誘因處理
- 政策上主張韌性，也就是承受衝擊並調適的能力，反對不擴散這類推測性措施

課堂上由此引發一段討論：讓使用者看到模型的 chain of thought，算不算一種可解釋性？週摘要記錄兩面的看法。它能讓人檢查推理，但看起來合邏輯的步驟也可能讓人更容易過度信任。

### AI 2027：一條具體的軌跡

[AI 2027](https://ai-2027.com/) 描繪一個情境：遞迴自我改進在五年內帶出超人 AI 系統，並聚焦美中之間的軍備競賽。週摘要沒有逐段總結，而是整理了課堂上的質疑與回應。例如有人問它為什麼細節這麼多、這麼主觀，回應是它不該被當成傳統預測，而是在接受某些趨勢外推（例如 METR 的趨勢）之後，一步步抽樣出的「一條可能的軌跡」。

週摘要還收了 AI 2027 作者之一 Daniel Kokotajlo 對出口管制問題的回覆。他認為就算美國領先中國兩年，也可能因為權重被偷、或選擇加速而不是暫停，把領先浪費掉。

### METR：把能力換算成「人類要花多久」

[METR 的長任務量測](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)不直接比 benchmark 分數。它找出一個任務長度，使模型對「人類要花這麼久完成」的任務有 50% 成功率。METR 報告這個長度過去六年呈指數成長，翻倍時間約 7 個月；它的例子是 Claude 3.7 Sonnet 的 time horizon 約一小時。

課堂上對這把尺也有保留。週摘要記錄兩點：這些任務能不能反映真實軟體工程的「混亂」，以及「完成時間等於難度」這個假設會低估那些不需要專業、只是耗時的任務。

## Boaz 的講課：先把定義拆開

講課開頭接著 METR 的圖：如果這個趨勢再延續四年，就會有能穩定完成人類要做幾個月的軟體任務的系統。然後 Boaz 列出這門課要談的四塊：AI 的衝擊與風險、能力與安全評測、對齊與安全的目標、在模型、系統、社會三個層次上的緩解措施。週摘要記錄他說課程會盡量不對「哪個風險最重要」下定論。

### 什麼叫 AGI：能力定義與衝擊定義

週摘要整理的講課內容把 AGI 定義分成兩類：

- **以能力定義**：例如「AI 能做第 90 百分位工作者要花一週完成的遠端工作中的 90%」
- **以衝擊定義**：例如「AI 取代現有經濟中至少 50% 的遠端工作」

兩者之間有一段 capability-adoption gap。講課舉的例子是量產電動車 1996 年就出現，但要再過約 20 年才有相當數量的消費者真的開電動車。

同一段還談了三件事。Boaz 對「AI 是新物種」或「AI 是電力」這類類比都保持警覺，並連到他寫的 [Metaphors for AI, and why I don't like them](https://www.lesswrong.com/posts/pBHga8mFq88dK7548/metaphors-for-ai-and-why-i-don-t-like-them)。智慧不見得是一維的，職場要的是實際能力，而實際能力的維度很高。推論成本下降得很快，所以 AI 和人類在同一任務上成本相當的均衡不太可能出現。

### 對齊的三種寫法

講課把過去定義對齊的嘗試分成三類：

1. **抽象原則或公理**：像 Asimov 的機器人三定律
2. **品格訓練**：週摘要以 Claude 的 character training 為例，目標是讓模型表現得像一個典型、有道德、思慮周到的人
3. **Model spec**：寫一份很長的文件，規定模型在各種情境下怎麼做，像法律或規章

週摘要附了一個整理方式：1 和 2 都是一般行為準則，1 和 3 都依賴明確推理，2 和 3 都是資料驅動。這個三分法會在 [L4 Model Specifications](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs) 再展開。

### 對齊和能力是互斥還是互補

講課列出兩種看法。一種認為兩者互相取捨，AI control 研究常見的假設就是：強模型可能在耍心機而不可信，弱模型則笨到無法耍心機。另一種認為能力越強越好對齊，因為它更會遵循指令、更懂人類細微的意圖。週摘要記錄，目前實務上第二種看起來比較接近事實，但更強的模型也可能有更嚴重的失效模式。

### 失效模式清單

週摘要記下講課列的失效模式，大致從「經典」排到「科幻」：

- 經典資安失效：AI 被駭或被 jailbreak，agent 在網路上讀到對抗性內容
- 濫用：deepfake、生物武器、宣傳
- 分布外的泛化失敗，例如自駕車的邊緣情況
- Reward hacking 與目標設定錯誤，例如 Claude Code 把你說預期的結果寫死
- Superalignment：怎麼對齊那些任務複雜到人類無法驗證的 AI
- 廣泛使用造成的社會問題：工作流失、情感依附、漸進式失能
- 國家與國際緊張：監控、權力與財富集中、軍備競賽
- 模型權重外洩
- Scheming：模型在潛在空間推理，或 chain of thought 不忠實，讓人無法知道它真正在想什麼

這份清單幾乎就是整學期的目錄：jailbreak 在 [L3](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness)，scheming 和 reward hacking 在 [L8](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)，情感依附在 [L11](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance)。

## 課堂實驗：把 HW0 反過來做

課站對這一講的實驗構想寫的是「Emerging alignment」：用一個有「好人格」的模型的輸出去微調，再看在其他資料集上的表現。Valerio Pepe 報告的實驗，就是 [HW0](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment) 的反向版本。

背景是 emergent misalignment：[Betley et al.](https://arxiv.org/abs/2502.17424) 發現在不安全的程式碼上微調，模型會在其他領域也變得失準；[Turner et al.](https://arxiv.org/abs/2506.11613) 則做出更小、更乾淨的「model organisms」，HW0 就是重現這篇。Valerio 問的是：反過來可不可以？

### 實驗一：emergent alignment

依週摘要的描述：

- **訓練資料**：50 題生物倫理種子題，每題做 12 種變化得到 600 題，再各做 10 種變化，共 6,000 題
- **對齊答案怎麼來**：用一個提示模板要求依「生物倫理四原則」作答，讓 Llama 3.2 1B Instruct 自己產生答案，微調時拿掉模板
- **測試**：換到環境政策題，用另一個 Llama 3.2 1B Instruct 當裁判，打對齊與連貫度分數

結果：微調後的模型在環境政策題的對齊分數是 82.4，基礎模型是 77.6；連貫度 84.9 對 81.8。兩組的 95% 信賴區間都沒有重疊。

### 實驗二：拿自己的正常輸出微調

第二個問題更奇怪：不用「好」或「壞」的資料，只用正常資料呢？Valerio 從 [Tülu 3](https://arxiv.org/abs/2411.15124) 抽 6,000 個提示，收集 Llama 3.2 1B 自己的回答（on-policy），再拿這些回答微調它自己，最後用 Betley 等人的問題和 GPT-4o 裁判評分。

對齊分數從 76.6 升到 87.85，連貫度從 86.7 升到 92.33，信賴區間同樣不重疊。週摘要作者 Jay 說這個結果讓他意外，並提出一個他自己也稱為 hand-wavy 的解釋：1B 模型可能訓練不足，多看 6,000 個例子讓概念表徵更穩。Valerio 的說法是它「強化了（本來就不錯的）token 分布」。

對照組是 off-policy：改用 Tülu 3 裡 GPT-4o、Claude 3.5 Sonnet 和人類寫的回答。對齊只略升且信賴區間大幅重疊，連貫度則明顯下降（75.42 對 86.7）。Valerio 的假說是任何 off-policy 訓練都是令人困惑的分布偏移。

這三組結果都來自單一 1B 模型、單一課堂實驗，週摘要也寫明機制還需要更多研究。它的價值在於示範這門課的節奏：先重現一個結果，再問一個反過來的問題。

## 自學怎麼做

1. 先讀 METR 那篇，再讀 AI as Normal Technology 和 AI 2027。讀的時候記下每篇對「AI 多快會進入安全攸關領域」的假設。
2. 看[錄影](https://youtu.be/-NCiWaRS6So)時對照週摘要的段落；週摘要沒有逐字稿，細節以錄影為準。
3. 讀 [Turner et al.](https://arxiv.org/abs/2506.11613)，接著做 [HW0](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment)。

今晚可以做的一件事：用一句話分別寫下「以能力定義」和「以衝擊定義」的 AGI，再寫你覺得兩者之間的 gap 大概幾年，以及理由。

## 延伸閱讀

- 系列入口與材料缺口：[Harvard CS2881R 導讀（系列總覽）](/posts/ai/2026-09-30-cs2881r-course-overview)
- 本站的課程公開程度分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS 2881R Fall 2025 課站：Introduction（9/4）](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-sep-4) — 錄影、投影片、實驗構想、pre-reading 與延伸閱讀清單
- [AI Safety (CS 2881) Lecture 1（YouTube）](https://youtu.be/-NCiWaRS6So)
- [Lecture 1 投影片（Harvard SharePoint）](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EZ22E4Kq3JlJs-qzDdw6BwwBfcL53FYUoy9mDIWMlg-gQA?e=xfXjdM)
- [Jay Chooi, Natalia Siwek, Atticus Wang, [CS 2881r AI Safety] [Week 1] Introduction（LessWrong）](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction) — 講課與實驗內容、實驗數據
- [Valerio Pepe 實驗投影片](https://docs.google.com/presentation/d/10XdI3_j_ulp38MJmmXvLE1wYdbAlCFk0jOt1cvc7C1Y/edit?usp=sharing)
- [Some Generalizations of Emergent Misalignment（LessWrong）](https://www.lesswrong.com/posts/jzRGMFxx4dFyDHHcL/some-generalizations-of-emergent-misalignment)
- [Narayanan & Kapoor, AI as Normal Technology](https://knightcolumbia.org/content/ai-as-normal-technology)
- [AI 2027](https://ai-2027.com/)
- [METR, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) — 7 個月翻倍、Claude 3.7 Sonnet 約一小時
- [Boaz Barak, Metaphors for AI, and why I don't like them（LessWrong）](https://www.lesswrong.com/posts/pBHga8mFq88dK7548/metaphors-for-ai-and-why-i-don-t-like-them)
- [Betley et al., Emergent Misalignment (arXiv 2502.17424)](https://arxiv.org/abs/2502.17424)
- [Turner et al., Model Organisms for Emergent Misalignment (arXiv 2506.11613)](https://arxiv.org/abs/2506.11613)
- [Tülu 3 (arXiv 2411.15124)](https://arxiv.org/abs/2411.15124)
