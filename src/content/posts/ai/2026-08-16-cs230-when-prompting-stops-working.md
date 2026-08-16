---
title: "光靠 prompt 走不遠的那兩個時刻"
date: 2026-08-16
category: ai
type: guide
tags: [deep-learning, llm, prompt-engineering, fine-tuning, stanford-cs230]
lang: zh-TW
series:
  name: "Stanford CS230 導讀"
  order: 1
tldr: "Andrew Ng 在 CS230 開場說『光靠 prompt 是不夠的』。會把人逼下抽象層的只有兩件事：調了一個月效能就是上不去，以及有了 product-market fit 之後爆炸的帳單。"
description: "Stanford CS230（2025 秋季）系列開篇。Ng 的抽象層地圖、什麼資料型態能靠 prompt 走完、以及這門課的大綱在兩年之間漂移成了什麼樣子。"
draft: false
---

這是 [Stanford CS230 導讀](/series/cs230)系列的第一篇。

先說清楚讀的是哪一輪：**Stanford CS230 Deep Learning，2025 秋季**，九支影片約 13 小時，[playlist 在這裡](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X)。這一輪已經結束了——最後一講 2025/12/02，期末海報展 12/10，影片在 12/16 全部放完。Autumn 2026 那一輪已排定 2026/09/22 開課，會是另一個 playlist。**這系列講的是 2025 秋季那一輪，每篇都會標上課日期。**

還有一件事要先講：**沒有 Lecture 7。** 11/4 是 Democracy Day 停課，所以講次跳號，這個系列的編號也跟著跳。

本篇對應 [Lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg)（2025/09/23，Andrew Ng 主講，1 小時）。

## 為什麼 2026 年還要看一門教 CNN 的課

Ng 在開場十五分鐘畫了一張圖，那張圖是整門課的地基：

```
CS 基礎 → 機器學習 → 深度學習 → 生成式 AI（transformer）
```

然後他講了一句這門課的定位：

> 「我天天用 LLM，但**光靠 prompt 是不夠的**——很多東西我沒辦法只靠 prompt 做出來，所以常常得往下鑽一層，去動 deep learning 的東西。」

這句話值得停一下。說這句話的人是 DeepLearning.AI 的創辦人，不是一個對 LLM 有意見的懷疑論者。他的意思不是 prompt 沒用，而是**存在一條線，過了那條線 prompt 就不管用了**。

課堂上他沒有把那條線畫成一句抽象的原則，而是拆成很具體的兩個東西。

## 觸發條件一：你調了一個月，效能就是上不去

這一條大家都體驗過，不需要多解釋。值得記的是 Ng 給的**資料型態判斷表**——他把「什麼時候 prompt 能走很遠」講得比一般的討論精確：

| 資料型態 | 實務上會怎麼做 |
|---|---|
| 文字 | prompt 就能走很遠，大量應用是純 prompt 建的 |
| 音訊 | 常常直接動 deep learning |
| 影像 / 影片 | 常常直接動 deep learning |
| 結構化資料（大表格） | 常常直接動 deep learning |

理由不神秘：生成式 AI 是從「文字進、文字出」長出來的，所以它對文字處理特別強。其他模態雖然一直在補，但**你越往非文字的方向走，越早撞到那條線**。

## 觸發條件二：帳單

這一條比較少被談，但 Ng 講得最有畫面：

> 「原型期用 GenAI 工具**相對便宜**，每百萬 token 幾塊美金，你可以做很多事。但有時候你夠幸運，做的產品找到了 product-market fit，一堆使用者開始用——然後你團隊會『驚喜地』發現，**你的 AI 帳單開始暴漲**。」

他自己的說法是：「我們付給那些 LLM 公司的錢，遠超過我想付的數字。我們很愛那些公司，但那個數字實在太大了。」

然後是重點：

> 「知道怎麼用 deep learning 去 **fine-tune 比較小的模型**——那才是真正把成本曲線壓回去的關鍵技能，是它讓整件事重新變得付得起、讓我們能繼續提供這個服務。」

這裡有個容易誤讀的地方。**這不是在說你一開始就該 fine-tune。** 恰恰相反——這系列後面 [Lecture 8](https://www.youtube.com/watch?v=k1njvbBmfsw) 的 Kian Katanforoosh 會用整段時間論證「盡可能避開 fine-tuning」，理由是等你調完，下一代模型已經打敗你 fine-tune 過的版本了。

兩個人講的其實是同一件事的兩端：**成功之前別碰它，成功之後你逃不掉。** 而觸發它的不是技術品味，是財務。

## 一個附帶的觀察：你不控制資料

Ng 在這一講埋了一句後面會反覆出現的話：

> 「你 100% 控制你的程式碼，但你**不控制資料**。」

他做過那麼多次語音辨識，到現在還是會被資料嚇到：某種口音比預期多、有人講話特別快、車上背景噪音很大。最近一個案子讓他意外的是**背景說話的人數**——使用者對系統講話、轉頭跟旁邊的人講話、再轉回來，系統就混亂了。

他把同一套邏輯直接套到 LLM 上（這是這一講對站上讀者最有用的一句）：

> 「關於 LLM 難以控制，有很多**過度的炒作**、有點在製造恐懼。我們之所以事先不知道 LLM 會怎麼表現，是因為它訓練在**多到沒有任何人類看得完**的資料上。」

所以打造 agent 應用同樣是經驗性的：**你就是得做出來，看哪裡好、哪裡爛，再拿這個去修。** 這條線會在 [Lecture 3](https://www.youtube.com/watch?v=MGqQuQEUXhk) 變成一整堂課。

## 這門課的大綱正在漂移

規劃這個系列時我拿 Wayback 上 2024 秋季的 syllabus 對照了一輪，變化大到值得單獨講：

| 2024 秋 | 2025 秋 |
|---|---|
| L2 Full-cycle of a DL Project（無投影片） | **L2 自監督／弱監督學習**（全新投影片） |
| L4 Deep Learning Intuition | **整堂拿掉** |
| **L9 RAG and AI Agents**（一行標題，無投影片） | **L8 Beyond the model**（110 分鐘完整一講） |
| L10 結業致詞（**沿用 fall_2021 的投影片**） | **L10 可解釋性**（全新投影片） |

方向非常清楚：**LLM 與 agent 的內容從附註膨脹成主課，基礎理論被壓縮，而且新增了一整講「打開模型看裡面」。**

那個 L10 的變化特別有意思——舊版的結業致詞用的是 **2021 年的投影片**，連續沿用了三年沒動。2025 年把它換成真正的可解釋性課程，代表這件事在教學者眼中的優先序真的變了。

順帶一提，官網 syllabus 的 **Lecture 6 條目到現在還是過期的**：上面寫「職涯建議／論文閱讀／醫療 AI 客座」配 2024 年的投影片，但那天實際錄下來的整堂課是 **AI Project Strategy**。職涯是 Lecture 9。如果你照著官網找，會找錯。

## 這系列接下來會走的路

九講，1:1 對應，但**不是逐字摘要**。每篇挑一條主線，並且補上兩件課堂上沒有的：課後到現在這領域變了什麼，以及它和站上既有實戰系列的對照。

有幾講的價值明顯高於其他：

- **Lecture 2** 把 embedding 是怎麼被訓練出來的完整走了一遍。站上 [RAG 系統實戰](/series/rag-systems)六篇都在用 embedding，但沒有一篇講它怎麼來的。
- **Lecture 6** 的後半是一張 error analysis 電子表格，而 Ng 用的例子就是 deep researcher——**這是全系列最能直接落地到 LLM 應用的一段**。
- **Lecture 10** 是七種打開模型看內部的方法，然後誠實地承認這套方法在 transformer 上只做得到兩層。

也有一講會反過來寫：**Lecture 8**（agents / prompts / RAG）約有七成被站上 [Agent 生產線](/series/agent)和 [AI Agent 實戰](/series/ai-agent-systems)蓋掉，而且站上寫得更深。那一篇會寫成對照，不寫成導讀。

至於 Ng 在這一講花了不少時間講的職涯觀點——四級生產力排序、「不要學寫程式是史上最糟的建議之一」、COBOL 剛發明時也有人說「還需要程式設計師嗎」——那些留到 Lecture 9，那一講整堂都在講這件事，而且有一位客座講者帶來了完全不同的角度。

## 參考資料

- [Lecture 1: Introduction to Deep Learning](https://www.youtube.com/watch?v=_NLHFoVNlbg) — 2025/09/23，Andrew Ng。抽象層地圖、「just prompting LLMs doesn't cut it」、以及帳單與 fine-tune 小模型那段的出處
- [Stanford CS230 Autumn 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — Stanford Online，九講完整清單（無 Lecture 7）
- [CS230 syllabus](https://cs230.stanford.edu/syllabus/) — 2026 年 8 月查閱時仍是 2025 秋季版，Lecture 6 條目已過期
- [2024 年 11 月的 syllabus 存檔](http://web.archive.org/web/20241113044952/http://cs230.stanford.edu/syllabus/) — Wayback Machine，大綱漂移（含 CNN 與 RAG 講次位移）的對照來源
