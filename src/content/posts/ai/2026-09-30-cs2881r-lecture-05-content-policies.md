---
title: "CS2881R L5：內容審核的老教訓如何搬到生成式 AI"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, governance]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 6
tldr: "CS2881R 第 5 講請 OpenAI Product Policy 的 Ziad Reslan 談內容政策。課站沒有列出講課錄影與投影片，校外讀者能拿到的是三篇 pre-reading、學生寫的 LessWrong 週摘要，以及一支 17 分鐘的學生實驗影片。這些材料串起來的主線是：社群平台花了二十多年才學會「線畫在哪裡都會有邊界案例，但總得畫」，生成式 AI 又多了一層難題——聊天介面介於私人文件與公開貼文之間，圖片比文字更容易被讀成立場。"
description: "Harvard CS 2881R AI Safety（Fall 2025）第 5 講 Content Policies 導讀：課站列出的三個主題、Techdirt／The Verge／Wired 三篇 pre-reading、依 LessWrong 週摘要整理的 Ziad Reslan 客座三段內容（審核的起源與取捨、GenAI 的審核、起草圖片政策），課堂實驗「system prompt 能不能取代安全訓練」，以及本講的存取限制。"
draft: false
glossary:
  - term: "Section 230"
    definition: "美國 1996 年《Communications Decency Act》第 230 條，讓網路平台原則上不必為使用者張貼的內容負法律責任。"
    context: "CS2881R 第 5 講的學生摘要把它當成內容審核成為一個專業領域的起點。"
  - term: "over-refusal"
    aliases: ["過度拒答"]
    definition: "模型把其實應該回答的請求當成有害請求而拒絕。OR-Bench 是專門量這件事的 benchmark。"
    context: "第 5 講課堂實驗用 OR-Bench 比較不同 system prompt 與安全訓練對拒答率的影響。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 課站的 10 月 2 日講次。**課站沒有列出這一講的講課錄影或投影片**，只列了一支[學生實驗影片](https://youtu.be/HMcA4Gi6HFE)、一篇 [LessWrong 學生週摘要](https://www.lesswrong.com/posts/uahJ7CrB8oWyRyyvL/cs-2881r-ai-safety-week-5-content-policies)（Audrey Yang、MB Samuel）與閱讀清單。所以本文關於客座演講的內容全部是二手轉述，出處是那篇學生摘要。事實皆於 2026-09-30 打開上述材料核對。整門課的存取分級見系列總覽；單看這一講，只到 **A1**（課綱與閱讀清單可見，講課本身拿不到）。

**系列位置**：上一篇 [L4：Model Spec 該寫原則還是細則](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs)｜下一篇 [期中：挑一張 headline figure 重現並延伸](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project)｜[系列總覽](/posts/ai/2026-09-30-cs2881r-course-overview)

上一講問的是「我們希望模型怎麼做」，答案寫成一份 model spec。這一講往下走一步：規則寫好之後，誰來執行、怎麼執行、執行錯了怎麼辦。社群平台已經在這件事上跌跌撞撞二十多年，[CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) 請來 OpenAI Product Policy 的 [Ziad Reslan](https://jackson.yale.edu/person/ziad-reslan/)，把那段歷史接到生成式 AI 上。

## 課程影片來源

官方 Fall 2025 課表只提供本講的學生實驗影片，沒有列 Ziad Reslan 客座講課錄影。下方可觀看的是學生的 policy compliance 實驗，不能當成客座講課的錄影。

```youtube
url: https://www.youtube.com/watch?v=HMcA4Gi6HFE
title: CS2881R Fall 2025 L5: Student experiment on policy compliance
```

原始影片：[CS2881R Fall 2025 L5: Student experiment on policy compliance](https://www.youtube.com/watch?v=HMcA4Gi6HFE)

官方來源：

- [CS2881R Fall 2025 official lecture schedule](https://boazbk.github.io/mltheoryseminar/fall2025/)

查核日期：2026-10-10。

## 這一講拿得到什麼

課站在 10 月 2 日底下只寫了三個主題：

- Content policies and moderation
- Platform governance
- Policy enforcement challenges

講次的「Experiment」欄寫的是「評估開源與閉源模型，可能用 jailbreak 技巧」，這是課前的構想。實際在這一週上台的學生實驗是另一個題目，後面會講。

材料清單很短：

| 材料 | 狀態 |
|---|---|
| 講課錄影 | 課站未列；官方 2025 YouTube 播放清單（2026-10-01 核對）裡第 5 講只有學生實驗影片 |
| 講課投影片 | 課站未列 |
| 學生實驗影片 | 公開，17 分鐘，YouTube 標題「Lecture 5: Experiment on Policy compliance」 |
| 學生週摘要 | 公開，LessWrong，2025-10-16 |
| 閱讀清單 | 三篇 pre-reading、四份選讀的各家使用政策、一集 Radiolab |

課站的 Mini Syllabus 寫過錄影政策：教室攝影機自動錄影，另外「會尊重外部講者不錄影的要求」。課站沒有說這一講沒錄影的原因，本文不替它猜。

## 三篇 pre-reading：平台已經學過的事

三篇 pre-reading 都不是論文，是新聞與評論。它們各自講內容審核的一個面向。

**[Masnick〈Hey Elon: Let Me Help You Speed Run the Content Moderation Learning Curve〉](https://www.techdirt.com/2022/11/02/hey-elon-let-me-help-you-speed-run-the-content-moderation-learning-curve/)（Techdirt，2022）**。依學生摘要的整理，這篇把新平台的審核演進寫成一級一級的關卡。第 1 級是「我們擁抱言論自由」；接著 CSAM、侵權、仇恨言論一個個被禁；然後是法律問題、各國法規、外語內容；最後平台同時要伺候使用者、法律、各國政府與言論自由，變成打地鼠。課堂討論補了一個觀察：審核需要懂當地語言的人或模型，沒有這種能力時，平台常直接封鎖整個地區，小語種國家會最先被擋掉。

**[Newton〈The Trauma Floor〉](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona)（The Verge，2019）**。報導 Facebook 外包審核員的工作條件。學生摘要引了報導裡的年薪對比：外包審核員 28,800 美元，Facebook 員工平均 240,000 美元。課堂留言把它連到 AI 資料標注：兩者都是低薪、耗損心理的工作，換來其他人比較乾淨的使用體驗。

**[Gilbert〈Google's 'Woke' Image Generator Shows the Limitations of AI〉](https://www.wired.com/story/google-gemini-woke-ai-image-generation/)（Wired，2024）**。Gemini 圖片生成在歷史題材上畫出不符史實的人物。學生摘要的讀法是，這裡同時有技術問題（模型分不清歷史與當代的請求）與主觀問題（多元呈現「該有多少」沒有共識），而文章結尾說不存在「沒有偏見」的模型。

另外四份選讀是各家的使用政策：[OpenAI Usage Policies](https://openai.com/policies/usage-policies/)、[OpenAI 圖片與影片政策說明](https://openai.com/policies/creating-images-and-videos-in-line-with-our-policies/)、[Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy)、[Midjourney Community Guidelines](https://docs.midjourney.com/hc/en-us/articles/32013696484109-Community-Guidelines)。清單最後還有一集 [Radiolab〈Facebook's Supreme Court〉](https://radiolab.org/podcast/facebooks-supreme-court)，沒有標成 pre-reading。

## 客座演講：依學生摘要整理的三段

以下是 LessWrong 週摘要對 Reslan 演講的整理。摘要把演講分成三段。

### 第一段：審核從哪來、為什麼永遠在擺盪

摘要把內容審核成為一個領域的起點放在 1996 年的 [Section 230](https://www.law.cornell.edu/uscode/text/47/230)：平台不必為使用者的內容負責，新一代平台因此出現。之後每一次重大事件都會讓某個主題被放大檢視，摘要舉了 Gamergate、Unite the Right 集會與 COVID-19。

演講的主軸是一個鐘擺：審核太鬆，有害內容流竄；太緊，使用者覺得被噤聲，又開始要求言論自由。執行面則是自動系統加人工審核的混合，前者缺乏脈絡、容易誤判，後者懂文化脈絡但會有偏見，而且工作本身傷人。摘要記下的講法是，推理模型擅長一致地套用長篇規則，也特別適合篩暴力與色情這兩類最折磨人的內容，所以目前的做法是分層：人寫政策、自動系統（含 AI）篩違規、人工處理越來越細的邊界案例，然後持續迭代。

課堂做了一個真實案例：Meta Oversight Board 審過的一則貼文，一張配上納粹宣傳部長 Goebbels 引言的圖。它原本依 Meta 的 [Dangerous Organizations and Individuals 政策](https://transparency.meta.com/policies/community-standards/dangerous-individuals-organizations/)被撤下，使用者申訴說這是在批評假訊息。全班幾乎五五分，有人說格式像勵志語錄、容易被讀成背書；有人回到條文，問這到底算不算「讚揚、實質支持或代表」；也有人提出撤與不撤之外的選項，例如年齡限制、停止廣告分潤、加上社群註記。摘要記錄最後投票略偏向保留，Oversight Board 的決定也是保留。

### 第二段：生成式 AI 沒有前例

摘要記下的核心觀察是：Facebook 這種分享平台，大家預期有高度審核；Google Docs 這種私人文件，大家預期沒有審核。聊天機器人卡在中間，我們期待對話是私密的，但系統對它產出的內容負有部分責任，而使用者之後怎麼用、分享給誰，系統無從預測。

實務做法依摘要是「政策加分類器」：政策考量法律風險與立即危害的可能性；模型輸出在給使用者看之前先過安全分類器；被判為高風險的（摘要的例子是有人正在計畫暴力攻擊）交給人工審查，必要時採取進一步行動。摘要特別說明，這種升級只發生在極少數對話。

### 第三段：動手起草圖片政策

互動練習是寫圖片生成的內容政策。摘要列出 Reslan 講的三個圖片特有難題：

- 圖片很「確定」卻又表達有限。問「最好的水果是什麼」，文字回答會解釋理由、列幾個選項；一張香蕉的照片沒有這些脈絡。
- 大多數生成圖片無害，但 2023 年一張五角大廈附近「爆炸」的假圖曾讓股市下跌。
- 同一張川普站在國旗前的圖，提示詞是「川普站在美國國旗前」還是「誰是美國史上最好的總統」，讀起來就是兩回事。

全班看了一組圖（泰勒絲擁抱科米蛙、文藝復興風格的斬首畫、飛機撞艾菲爾鐵塔）投票決定哪些該允許，再各自寫出能對應自己判斷的政策。摘要的結論是每個人的政策都有很多漏洞。摘要引了 Reslan 的一句話：

> Wherever you draw the line you create edge cases. But ultimately, you do have to draw a line somewhere.

## 這一週的學生實驗：system prompt 能取代安全訓練嗎

這一週課站掛的學生實驗影片，其實是上一講的實驗。講者 Hugh Van Deventer 在影片一開頭說「this is last week's experiment」，學生摘要也寫明它是上週 Model Specs and Compliance 的延續。課站把這個實驗的投影片、GitHub 與部落格文章列在 L4 底下。它回答的問題正好接上本講：政策寫進 system prompt，模型就會照做嗎？

依影片與摘要，設計是這樣：

- **模型**：DeepSeek-R1-0528-Qwen3-8B，以及它經過額外安全訓練的版本 [RealSafe-R1-8B](https://huggingface.co/RealSafe/RealSafe-R1-8B)；另外在幾個前沿模型上重複。
- **system prompt 條件**：無 prompt、兩句話的「helpful, honest, harmless」、8 條原則、30 條規則，以及它們的組合。
- **評測**：[OR-Bench](https://arxiv.org/abs/2405.20947) 的 over-refusal、hard、toxic 三個子集，加上 MMLU-Pro 看能力有沒有掉。

結論兩份材料說法一致：模型之間的差距遠大於 prompt 之間的差距。安全訓練過的版本更會拒絕有毒請求，但也更會過度拒答；過於簡略的 prompt 傾向讓拒答率上升。講者自己在影片裡提醒，每個條件只跑 3 次、每次抽約一百題，標準差互相重疊，不能下太強的結論。Boaz 在影片裡的補充是：如果 prompt 管的是模型沒被訓練過的行為（他舉「要不要押韻」），prompt 的效果可能會大得多；安全行為已經被大量訓練過，prompt 能推動的空間就小。

這個結果把本講的主題往回拉了一步。平台的政策靠審核員與分類器執行；模型的政策如果只寫在 prompt 裡，執行力有限，真正起作用的是訓練。

## 怎麼自學這一講

1. 先讀三篇 pre-reading，再讀 LessWrong 週摘要，把 Masnick 的關卡對應到摘要裡 Reslan 的鐘擺。
2. 挑一家的使用政策（例如 OpenAI Usage Policies），找出一條你覺得邊界模糊的規定，寫三個剛好落在線上的例子。
3. 看 17 分鐘的實驗影片，對照 L4 底下的 GitHub repo，想想這個實驗怎麼延伸成期中 mini-project 的題目。

今晚可以做的一件事：照課堂練習的做法，找五張你會猶豫要不要允許生成的圖片情境，先憑直覺判斷，再寫一段政策文字，檢查它是否對五個情境都給出你原本的答案。寫不出來的那一條，就是你的第一個邊界案例。

## 延伸閱讀

- 政策寫在哪裡、怎麼解釋：[CS2881R L4：Model Spec 該寫原則還是細則](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs)
- 用模型當裁判與護欄的工程面：[Stanford CS329Z 導讀 Week 8：請模型當裁判，再幫 agent 上護欄](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)
- 同一主題在其他課程的講法：[台大 ADL 2025 第 10 講：偏見、安全、幻覺與對齊](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Harvard CS 2881R AI Safety, Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/) — 10 月 2 日講次的主題、客座、實驗欄與閱讀清單；Mini Syllabus 的錄影政策
- [學生實驗影片：Lecture 5: Experiment on Policy compliance（YouTube）](https://youtu.be/HMcA4Gi6HFE) — Hugh Van Deventer 的 system prompt 與安全訓練比較
- [Audrey Yang & MB Samuel, [CS 2881r AI Safety] [Week 5] Content Policies（LessWrong, 2025-10-16）](https://www.lesswrong.com/posts/uahJ7CrB8oWyRyyvL/cs-2881r-ai-safety-week-5-content-policies) — pre-reading 摘要、Reslan 客座三段、課堂實驗
- [Mike Masnick, Hey Elon: Let Me Help You Speed Run the Content Moderation Learning Curve（Techdirt, 2022）](https://www.techdirt.com/2022/11/02/hey-elon-let-me-help-you-speed-run-the-content-moderation-learning-curve/)
- [Casey Newton, The Trauma Floor: The Secret Lives of Facebook Moderators in America（The Verge, 2019）](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona)
- [David Gilbert, Google's 'Woke' Image Generator Shows the Limitations of AI（Wired, 2024）](https://www.wired.com/story/google-gemini-woke-ai-image-generation/)
- [OpenAI Usage Policies](https://openai.com/policies/usage-policies/)
- [OpenAI, Creating images and videos in line with our policies](https://openai.com/policies/creating-images-and-videos-in-line-with-our-policies/)
- [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy)
- [Midjourney Community Guidelines](https://docs.midjourney.com/hc/en-us/articles/32013696484109-Community-Guidelines)
- [Radiolab, Facebook's Supreme Court（WNYC Studios, 2021）](https://radiolab.org/podcast/facebooks-supreme-court)
- [OR-Bench: An Over-Refusal Benchmark for Large Language Models（arXiv 2405.20947）](https://arxiv.org/abs/2405.20947) — 課堂實驗使用的評測
- [RealSafe-R1-8B（Hugging Face）](https://huggingface.co/RealSafe/RealSafe-R1-8B) — 課堂實驗的安全訓練版模型
