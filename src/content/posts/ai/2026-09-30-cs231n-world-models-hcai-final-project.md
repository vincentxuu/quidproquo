---
title: "CS231N 收尾：World Modeling／Robot Learning、Human-Centered AI 與期末專題"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, world-model, embodied-ai, human-centered-ai, research-project]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 20
tldr: "CS231N Spring 2026 的最後兩講沒有公開投影片：L17 在課表上只寫「World Modeling」與客座講者 Gordon Wetzstein，L18 只寫「Human-Centered AI」。校外讀者能看的是 2025 年的替代品：L17 當年是另一個主題 Robot Learning（Yunzhu Li，有投影片與錄影），L18 是李飛飛的錄影，沒有投影片。本文把三者分開標示年份，不把 2025 的內容寫成 2026。後半講期末專題：占 35%，分 Applications 與 Models 兩條 track，專案必須處理像素，交付物是一段提案、三次 milestone check-in、6–8 頁報告與海報。"
description: "Stanford CS231N 導讀收尾篇：2026 L17 World Modeling 與 L18 Human-Centered AI 只剩課表條目；2025 L17 Robot Learning 投影片與錄影（RL、model-based planning、imitation learning、robotic foundation models、world models）；2025 L18 李飛飛錄影的三段結構；以及 Spring 2026 期末專題的兩條 track、配分、三次 milestone、報告 rubric、生成式 AI 政策與 section 3 投影片整理的三種成功專案模式。"
draft: false
glossary:
  - term: "world model"
    aliases: ["世界模型"]
    definition: "能預測環境在某個動作之後會變成什麼樣子的模型。2025 年 L17 投影片給的定義是 action-conditioned future prediction。"
    context: "2025 L17 的結尾從 foundation policy 談到 foundation world model；2026 L17 的講題就是 World Modeling，但沒有公開投影片。"
  - term: "Vision-Language-Action model"
    aliases: ["VLA"]
    definition: "輸入影像與語言指令、直接輸出機器人動作的大型模型，2025 L17 投影片也稱之為 robotic foundation model 或 large behavior model。"
    context: "投影片列出 RT-1、RT-2、OpenVLA、Pi-Zero 等例子。"
  - term: "milestone check-in"
    definition: "CS231N Spring 2026 新增的專題檢查點：每次在助教 office hours 做 10 分鐘討論，事先把 2–5 頁投影片交到 Gradescope。"
    context: "三次各占 3%，分別看問題與相關研究、技術方法、初步結果。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project-en)

> **來源年份**：這一篇要處理的年份最亂，先講清楚。
>
> - **2026 L17「World Modeling」與 L18「Human-Centered AI」**：只有 [Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)上的條目，沒有投影片連結；2026-09-30 試過 `slides/2026/lecture_17.pdf` 與 `lecture_18.pdf` 都回 404。2026 錄影只在 Canvas。
> - **2025 L17「Robot Learning」**：有 [投影片](https://cs231n.stanford.edu/slides/2025/lecture_17.pdf)（103 頁）與 [錄影](https://www.youtube.com/watch?v=XSfmOH_xVSU)（約 1 小時 18 分），講者 Yunzhu Li。**主題跟 2026 不同。**
> - **2025 L18「Human-Centered AI」**：只有 [錄影](https://www.youtube.com/watch?v=g8UaBfj6Sh8)（約 1 小時 5 分），講者李飛飛；投影片網址同樣 404。以下 L18 的內容來自這支錄影的英文字幕。
> - **期末專題**：依據 Spring 2026 的 [Project 頁](https://cs231n.stanford.edu/project.html)與 [section 3 投影片](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf)。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 20 篇，也是最後一篇。

**系列位置**：上一篇 [L15：3D 視覺](/posts/ai/2026-09-30-cs231n-3d-vision)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

課程最後兩講不再教新演算法，而是把前面的東西往外推：視覺模型要怎麼跟行動接起來，又要為誰服務。同一段時間，修課生手上最重的是期末專題，占總成績 35%。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=XSfmOH_xVSU
title: CS231N Spring 2025 Lecture 17 錄影
```

```youtube
url: https://www.youtube.com/watch?v=g8UaBfj6Sh8
title: CS231N Spring 2025 Lecture 18 錄影：Human-Centered AI（Fei-Fei Li）
```

原始影片：[CS231N Spring 2025 Lecture 17 錄影](https://www.youtube.com/watch?v=XSfmOH_xVSU)、[CS231N Spring 2025 Lecture 18 錄影：Human-Centered AI（Fei-Fei Li）](https://www.youtube.com/watch?v=g8UaBfj6Sh8)

課程與錄影入口：

- [CS231N Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 2026 L17：World Modeling，只有一行課表

2026 年 5 月 28 日這堂，課表只寫兩行：「Lecture 17: World Modeling」、「Guest Lecturer: Prof. Gordon Wetzstein」。沒有子題、沒有投影片、沒有建議閱讀。同一天 A3 截止。

校外讀者能確定的就這麼多。**本文不猜這堂講了什麼。** 下面介紹的 2025 年 Robot Learning 是另一個主題、另一位講者，只能當作「課程在這個位置曾經怎麼收」的參考。

## 2025 L17：Robot Learning（Yunzhu Li）

2025 年這一講由 Columbia 的 Yunzhu Li 客座，課表列的子題是 Deep Reinforcement Learning、Model Learning、Robotic Manipulation。投影片的大綱是七段：問題定義、機器人感知、強化學習、model learning 與 model-based planning、imitation learning、robotic foundation models、仍待解決的挑戰。

### 從監督學習到「會行動的 agent」

開頭把整門課放進一個框架：前面學的是監督學習（有 x 有 y）與自監督學習（只有 x），這一講換成 agent 在環境裡採取動作、拿到 reward，目標是學會讓 reward 最大的動作。範例從 cart-pole、機器人行走、Atari、圍棋，一路排到文字生成、聊天機器人與摺衣服的機器人。

投影片接著解釋 robot vision 跟前面的 computer vision 差在哪：機器人的視覺是**具身的、主動的、處於環境之中的**。它有身體，行動會立刻回饋到自己的感知；它知道自己為什麼要看、選擇看什麼。整講的關鍵挑戰寫成一句：閉合 perception–action loop。

### 強化學習為什麼跟監督學習不一樣

投影片列了四個理由：reward 和狀態轉移可能是隨機的；reward 不一定直接取決於當下的動作（credit assignment）；世界不可微，沒辦法對環境做反向傳播；agent 看到的資料取決於它怎麼行動（nonstationary）。案例從 DQN 玩 Atari、AlphaGo 系列，到四足機器人行走與機械手解魔術方塊。

model-free RL 的問題也列得清楚：靠試錯、需要大量互動、有安全疑慮、難以解釋。對策是 **model learning 與 model-based planning**：學一個世界的動態模型，在模型裡規劃，執行第一個動作、觀察新狀態、再重新最佳化。這裡的核心問題是狀態該用什麼形式表示，投影片比較了像素、keypoint、粒子三種動態模型，例子包括用粒子動態、搭配多種工具操作彈塑性物體的 RoboCook。

### Imitation learning 與 robotic foundation models

imitation learning 就是從示範資料做監督學習，投影片列出 behavior cloning、迭代收集專家示範、inverse RL、implicit behavior cloning 與 diffusion policy。

接著是 robotic foundation model：一個把（觀測、目標）直接映射到動作的 policy，不顯式表示狀態或轉移函數，也叫 VLA 或 large behavior model。投影片列了一串時間線，從 RT-1（2022 年 12 月）到 Pi-Zero、OpenVLA、Gemini Robotics、GR00T 等，並以 Physical Intelligence 的 Pi-Zero 為例說明跨機體資料的預訓練與後訓練。

### 最後指向 world model

挑戰那一段有兩個重點值得記。第一是評估：主要靠真實世界測試，成本高、雜訊大，訓練 loss 跟真實成功率只有弱相關；模擬又有 sim-to-real 落差。第二是投影片的一頁標題「Foundation Policy → Foundation World Models」，講者給 world model 的定義是 **action-conditioned future prediction**，並舉了 1X World Models、DayDreamer、NVIDIA Cosmos。

2026 年的 L17 講題正好是 World Modeling。這是我從兩年課表與 2025 投影片看到的銜接，**不代表 2026 那堂講了 2025 這些內容**。

## L18：Human-Centered AI（只有 2025 錄影）

2026 年 6 月 2 日的 L18 在課表上只有標題。2025 年同一講由李飛飛主講，沒有公開投影片，但錄影完整。以下依錄影字幕整理。

她一開場就說，這堂不教新演算法，而是一場談長期研究演進與「人的視角」的演講，講題是「What we see and what we value: AI with the human perspective」。內容分三段：

1. **打造看見人類所見的 AI**。從五億四千萬年前視覺的起源、1960 年代的 summer vision project，講到物件辨識的三波嘗試：先是心理學啟發的部件組合，再是統計機器學習，最後是 ImageNet 加 CNN 加 GPU 在 2012 年匯流。之後是關係理解（scene graph、Visual Genome）、影像描述與 dense captioning，以及仍未解決的多人多動作影片理解。她的結論是：這條路一直受認知科學與神經科學啟發，未來也會如此。
2. **打造看見人類看不見之處的 AI**。一面是超越人類的能力，例如細粒度的鳥類與車款辨識，用街景車款推估社會模式；一面是人類的限制，例如注意力有限導致醫療疏失，用 AI 在手術中清點紗布（她強調那是 demo，不是已部署系統）。接著談偏見：人類視覺有偏見，資料也有，AI 會把它放大；以及隱私：有些東西就是不該被看見，她舉了一個軟硬體結合、保護隱私又能辨識動作的研究。
3. **打造看見人類想看見之物的 AI**。從勞動焦慮談起，她主張用「增強」取代「取代」，例子是醫療的 ambient intelligence：用只取深度資訊的感測器偵測手部衛生、監測 ICU 病人活動、協助長者在家安老。最後走到機器人：用 LLM 與 VLM 產生開放指令的動作規劃，以及 BEHAVIOR benchmark：先問約 1,400 人希望機器人幫忙做哪些家務，再依此建模擬環境。她說他們用當時的機器人演算法測了三個 BEHAVIOR 任務，在不給任何特權資訊時，表現是零。

整堂的收尾一句是：AI 應該是增強人類的工具，而不是取代人類的工具。

## 期末專題：35% 的重頭戲

[Project 頁](https://cs231n.stanford.edu/project.html)開宗明義：專題是把課堂所學用在你感興趣的問題上。**唯一的硬限制是一定要處理某種形式的像素資料**，純 NLP 專案就算用了卷積網路也不行；shape analysis 這類視覺會議會收的相關領域可以。

### 兩條 track

| Track | 官方描述 |
|---|---|
| Applications | 帶著生物、工程、物理等背景來的人，把課堂的視覺模型用在自己領域的真實問題上 |
| Models | 提出新模型或既有模型的變體來處理視覺任務；比較難，有時能做成可發表的研究 |

團隊最多 3 人，也可以單人。頁面提醒：3 人團隊要有更亮眼的報告與結果；另一方面，完整論文的基本要求歷來對沒經驗的單人不容易達成。

### 交付物與配分

| 交付物 | 配分 | 截止（2026） | 可用 late day |
|---|---|---|---|
| Project Proposal | 1% | 4/23 | 可 |
| Milestone 1：問題與相關研究 | 3% | 5/15 | 可 |
| Milestone 2：技術方法 | 3% | 5/22 | 可 |
| Milestone 3：初步結果 | 3% | 5/29 | 可 |
| Final Report | 20% | 6/5 | 不可 |
| 海報發表（現場）＋海報 PDF 與程式碼 | 5% | 海報 6/10；PDF 與程式碼 6/9 | 不可 |

幾個細節：

- **提案**是一段 200–400 字，要回答問題是什麼、讀哪些文獻、用什麼資料、打算用什麼方法、怎麼評估。
- **三次 milestone check-in 是 2026 年新制**：每次在助教 office hours 做 10 分鐘討論，先交 2–5 頁投影片，約 5 分鐘報告、其餘問答，全員出席。每次的 3% 拆成 Progress、Clarity、Robustness 各 1%。Milestone 1 要求至少討論 3 篇相關論文。
- **期末報告** 6–8 頁，用 CVPR 格式模板。rubric 的權重是 Introduction 10%、Related Work 10%、Data 10%、Methods 30%、Experiments 30%、Conclusion 5%、Writing／Formatting 5%。
- **報告要引用你用過的所有基底程式碼**，包括 CS231N 作業的程式碼。與其他課合併的專題要說明哪一部分算 CS231N，不能交同一份 PDF。

### 生成式 AI 政策

用生成式 AI 產生專題程式碼，比照使用公開資源的規定，而且所有使用都要明確記錄，包括計畫、prompt、對話紀錄，並標出每一個 AI 產生的產物。**用生成式 AI 撰寫期末報告內容違反 Honor Code**，只能拿來編修與排版。

### Section 3 投影片：什麼樣的專題算好

[Section 3 投影片](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf)（13 頁）補了官方頁面沒寫的判準。它說不需要嚴格的新穎性、也不需要打敗 state of the art，但要投入真正的努力，並從多個角度解讀結果，不能只畫一條 loss 曲線。

它把較弱的專案描述成兩種：花好幾週只在蒐集與清理資料、沒有真正測試假設；或是複製現成 repo 草草拼起來，沒有實質貢獻。

它整理了近年成功專案的三種模式：

1. **Domain adaptation**：把強的視覺或 VLM 模型用在有意義的新問題上，配上真實的任務資料與評估。例子有醫學影像、遙測、科學影像、手語。
2. **Method improvement**：從公認的 baseline 出發，做技術上有意義的修改，例如新的 loss、模組、訓練方法。
3. **Reproduction**：重建一個專有或難以重現的能力，貢獻就是實作本身。

投影片還附了讀論文的建議：第一遍不要線性讀，先逐字讀摘要，再掃圖與圖說；還相關再讀方法與結果；只有細節真的有用才整篇讀。

### 校外自學者怎麼借用

專題的評分、助教 check-in 與海報發表都只屬於修課生。但這套結構本身就可以自學：[歷年報告](https://cs231n.stanford.edu/2025/reports.html)公開，提案模板與報告 rubric 也都寫在頁面上。

1. 用 section 3 的三種模式挑一個方向，寫一段 200–400 字的提案，逐項回答官方列的五個問題。
2. 給自己排三個檢查點，各做 2–5 頁投影片，內容照 milestone 1–3 的要求。
3. 最後照 rubric 的七個欄位寫報告，Methods 與 Experiments 占 60%，時間也照這個比例分。

今晚可以做的一件事：打開 [Spring 2025 報告列表](https://cs231n.stanford.edu/2025/reports.html)，挑三篇，判斷它們各屬於 section 3 的哪一種模式。

## 系列結尾

這個系列到這裡，走完了 CS231N Spring 2026 公開投影片的 L1–L16、三份作業，以及只剩課表與 2025 錄影的 L17、L18。回到 [系列總覽](/posts/ai/2026-09-30-cs231n-course-overview) 可以看整體的自學排法與每篇的位置。

## 延伸閱讀

- 強化學習與機器人學習的完整課程：[Berkeley CS285 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)
- 一般深度學習與研究專案的另一種寫法：[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [CS231N Spring 2025 Lecture 17 投影片：Robot Learning（Yunzhu Li）](https://cs231n.stanford.edu/slides/2025/lecture_17.pdf)
- [CS231N Spring 2025 Lecture 17 錄影](https://www.youtube.com/watch?v=XSfmOH_xVSU)
- [CS231N Spring 2025 Lecture 18 錄影：Human-Centered AI（Fei-Fei Li）](https://www.youtube.com/watch?v=g8UaBfj6Sh8)
- [CS231N Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231N Spring 2026 Final Project 頁](https://cs231n.stanford.edu/project.html)
- [CS231N Spring 2026 Section 3：Final Project Overview 投影片](https://cs231n.stanford.edu/slides/2026/section_3_project.pdf)
- [CS231N Spring 2025 期末專題報告列表](https://cs231n.stanford.edu/2025/reports.html)
- [CS231N 課程首頁（評分、late policy、錄影政策）](https://cs231n.stanford.edu/)
