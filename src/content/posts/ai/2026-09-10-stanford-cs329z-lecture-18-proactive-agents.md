---
title: "從等指令到先出手：proactive agent 與 General User Models｜Stanford CS329Z 第 18 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 19
tldr: "第 18 堂依課表談 agent 從被動回應轉為主動協助：General User Models、Next Action Prediction、開源的主動式個人助理、隱私與信任，以及何時該主動、何時該等待。讀物是 GUM、Next Action Predictors 與 OpenClaw。"
description: "依課表與指定閱讀預習 Stanford CS329Z 第 18 堂 Proactive Agents：深讀 Shaikh 等人的 General User Models、Next Action Predictors 與 OpenClaw，拆解觀察、推測與介入三層。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

想像兩種助理。第一種永遠等你開口，你沒說，它就不動。第二種會看：你收到朋友的婚禮邀請，它先查好租西裝的地點與預算，把結果放在你面前。第一種叫 reactive，第二種叫 [proactive agent](https://arxiv.org/abs/2505.10831)，第 18 堂（11/30，Proactive Agents）談的正是第二種。

差別不在模型大小，在誰先出手。reactive agent 的迴圈起點是你的指令，proactive agent 的迴圈起點是它對你的觀察。觀察需要一雙眼睛，推測需要一個使用者模型，出手需要一套何時該打斷的規矩。指定讀物是 Shaikh 等人的 [General User Models](https://arxiv.org/abs/2505.10831)，延伸閱讀是 Next Action Predictors 與 OpenClaw，本文三篇都深讀。paper video 的互評也在這天截止。截至 2026-10-29，這堂還沒有公開投影片，本文是依官方課表與指定閱讀寫的預習，不代表講師在課堂上說過的內容。第 11 堂以後的堂次編號依課表順序推算，官網目前只列日期與主題。

| 比較 | Reactive | Proactive |
|---|---|---|
| 起點 | 使用者指令 | 對使用者的觀察 |
| 需要的脈絡 | 當下請求，也可使用使用者模型 | 使用者模型用來產生候選建議 |
| 何時出現 | 回應請求 | 評估有用程度與打擾成本 |
| 本文追問 | 任務能否完成 | 觀察、記憶與打斷是否合宜 |

## 主動協助之前，先回答觀察、推測與介入

[官方課表](https://cs329z.stanford.edu/)把 11/30 排為 Proactive Agents，12/2 排為 Frontiers & Open Problems；final demo 在 12/7–11 考試週，確切時間地點仍待公告。截至 2026-10-23 尚無這兩堂的公開投影片。以下分開讀 GUM、Next Action Prediction 與開放問題，避免把未來課堂或系統展示寫成已驗收產品。

### 觀察不是使用者意圖的同義詞

繁中工作者反覆打開一份英文合約，可能想翻譯、核對版本，也可能只是等同事回覆。GUM 的[論文](https://arxiv.org/html/2505.10831)將非結構化觀察整理成可更新的自然語言命題；命題是帶不確定性的使用者模型，不是使用者親口授權。保留證據與修正能力，才能避免一次錯誤推測長期影響後續協助。

### 預測下一步，也還沒決定該不該幫

[Next Action Prediction](https://arxiv.org/html/2603.05923)研究從人機互動預測後續動作。預測「使用者可能寄信」與決定「現在替他寄」是不同層。前者要測預測是否符合行為，後者還要考慮價值、打擾與授權。本文的合約例子適合先提出可關閉的摘要建議；涉及寄送、修改文件或對外承諾時，另查可執行範圍。

### 期末驗收要保留無介入的選項

做一張原創測試表：有用而適時、有用但太頻繁、推測錯誤、使用者拒絕後仍出現。分別檢查建議品質、觸發時機與停止機制。把不出手列為合理輸出，才能避免系統為了「主動」而持續打斷。Gumbo 的[研究展示](https://generalusermodels.github.io/)提供設計實例，不能把研究展示的能力直接當成所有部署都已成熟。

**理解檢查**：下一步預測很準，為什麼使用者仍可能關掉助理？**答案判準**：預測準確只處理行為估計；介入可能太頻繁、價值太低，或觀察與資料保存超出接受範圍。應分別測量與調整，而非只提高預測分數。

## 讀物 1｜General User Models

原文：[General User Models](https://arxiv.org/abs/2505.10831)

### TL;DR

GUM 以Propose、Retrieve、Revise、Audit維護自然語言命題與信心，再支援Gumbo的協助。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 長期觀察如何成為可更新、可質疑的使用者模型？ |
| 證據與邊界 | 76.15%與confidence10樣本全對是特定評估；五人五天部署仍是小樣本，computer use在評估關閉。 |

### 領域背景

個人助理需要長期脈絡，卻不能把每次觀察直接當成永久事實；命題需保留不確定性與修正。

### 中階導讀

**方法。** 從觀察提出命題，檢索相關記憶、修訂衝突並稽核寫入，再讓建議系統查詢命題。

[GUM](https://arxiv.org/abs/2505.10831) 的輸入是任何非結構化觀察，例如螢幕截圖。輸出是一組自然語言命題，每個命題帶一個信心分數。看到婚禮邀請，寫下使用者受邀參加朋友的婚禮；看到你反覆改草稿又切去讀相關文獻，寫下使用者被合作者的意見卡住了。前者信心高，後者信心低，系統都誠實標出來。

架構是四個模組。Propose 把觀察翻成命題，Retrieve 撈出相關的舊命題當脈絡，Revise 隨新證據修正，Audit 在寫入前擋掉使用者不會想被記下的東西。螢幕理解用 [Qwen 2.5 VL](https://github.com/QwenLM/Qwen2.5-VL)，命題推理用 [Llama 3.3 70B](https://www.llama.com/)，兩條都是開放路線。論文刻意選開放模型，目標是讓資料不必送往第三方平台。實作中 Llama 跑在私有伺服器上，命題的存取權只屬於使用者。

例子很有說服力。第一作者的 GUM 替他找到婚禮租西裝的地點，還自動受限於他的預算。GUM 也能幫 prompt 補上脈絡：你正在寫哪一段、讀過哪篇論文，於是 help me with this section 這種沒頭沒尾的請求也能直接可用。這正是 [第 3 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)的 RAG 想補的 grounding，只是來源從檢索庫換成你的電腦使用痕跡。

[GUM 論文](https://arxiv.org/html/2505.10831)在以電子郵件為材料的評估中，報告命題平均準確度 76.15%；信心分數為 10 的命題，在該受測樣本裡被評為全部正確。這不保證未來高信心命題都正確。另有五位參與者使用五天的螢幕部署，提供小規模的校準與使用經驗證據，不能外推為普遍效果。

[Gumbo](https://generalusermodels.github.io/) 是建在 GUM 上的示範應用。它持續看螢幕、養一份 GUM、從中挖掘建議。挖到之後不急著打斷你，先算一筆期望效用：建議有用的機率乘上好處，對上打擾錯誤的成本。這套算法來自 [Horvitz 的 mixed-initiative 框架](https://dl.acm.org/doi/10.1145/302979.303030)，GUM 剛好補上它當年最缺的現成成本效益估計。

怕建議一次湧入，另有節流機制，每分鐘最多出現一則。通過門檻的建議，能做的自己先做：查資料、跑程式、整理檔案，做到不能再做為止才呈現。做完接受按讚或倒讚，回饋直接餵回 GUM，變成新的觀察。論文也老實寫下邊界：評估時 computer use 功能保持關閉，因為太慢且多 bug。

課表上的 Next Action Prediction 有具體所指。Shaikh 等人的後續工作把「從多模態電腦使用痕跡預測下一步行動」形式化成任務，正是 Gumbo 這條 pipeline 指向的能力。完整小評見文末 Course Material 對照。

```diagram
title: Proactive 多了一道打斷判斷
desc: 從觀察與使用者模型產生建議，再以有用程度與打擾成本判斷是否呈現協助。
caption: 依上文 Gumbo 機制簡化；圖中省略 GUM 內部模組與節流機制。
---
<svg viewBox="0 0 440 544"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V232" marker-end="url(#arrow)"/><path class="dg-line" d="M220 328V372Q220 380 212 380H120Q112 380 112 388V448" marker-end="url(#arrow)"/><path class="dg-line" d="M380 280H400Q408 280 408 288V404Q408 412 400 412H340Q332 412 332 420V448" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">觀察與使用者模型</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">產生候選建議</text><path class="dg-box" d="M220 232L380 280L220 328L60 280Z"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">值得打斷？</text><rect class="dg-box dg-box--accent" x="16" y="452" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="488.0" text-anchor="middle" dominant-baseline="central">呈現已準備協助</text><rect class="dg-box" x="240" y="452" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="488.0" text-anchor="middle" dominant-baseline="central">暫不打斷</text><text class="dg-edge" x="164" y="356" text-anchor="middle" dominant-baseline="central">值得</text><text class="dg-edge" x="376" y="352" text-anchor="middle" dominant-baseline="central">否</text></svg>
```

Audit 模組用[脈絡完整性](https://arxiv.org/abs/2505.10831)原則過濾觀察。白話問一句：這份資訊被記下來，符合它原本出現的場合嗎。評估結論很誠實：大致守規矩，但破例的時候都很嚴重。這正是第 18 堂把隱私與信任和 proactive 放在同一堂的原因。reactive agent 犯錯，你至少在場；proactive agent 犯錯，經常是你不在場的時候。

論文另闢一節談 privacy paradox。同一批參與者既想要記得夠多的助理，又對白紙黑字的命題感到不自在。看到自己的習慣被寫成命題，有人直說感覺怪怪的。這題沒有技術解，只有取捨：記得多，幫得多，也錯得多。

這裡也回扣 [第 1 堂](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems) 的系統觀。GUM 的四個模組沒有一個是模型本身，全是模型之外的工程：觀察、稽核、檢索、修正。好成績依然是系統堆出來的，只是這次堆的是關於你的系統。

**證據與結果。** 研究展示可校準的命題模型與主動助理原型，同時記錄隱私不安與小樣本部署限制。

### 深入要點

- Audit決定哪些命題值得寫入，Revise處理既有命題更新；隱私與一致性是不同責任。
- Gumbo先估計建議效用再節流，預測使用者需要與決定是否打斷是兩道判斷。

### Reviewer 一句話評

記得更多與幫得更好，是兩個要分開驗證的主張。

### 給你的 take-away

讓使用者看見、修正與刪除推測，並把主動介入與資料保存分別設定。

## 讀物 2｜Learning Next Action Predictors

原文：[Learning Next Action Predictors](https://arxiv.org/abs/2603.05923)

### TL;DR

LongNAP 結合參數學習與上下文歷史，用連續手機操作紀錄預測後續行動並以語意相似度評估。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 長期人機互動紀錄能否改善下一步行動預測？ |
| 證據與邊界 | 20位使用者與逾36萬行動來自特定資料蒐集；LLM judge分數不是行動授權或介入價值。 |

### 領域背景

跨時間的操作紀錄包含習慣與當前脈絡，預測任務要區分長期偏好和眼前畫面。

### 中階導讀

**方法。** 將連續操作轉成action序列，以長期歷史和當前脈絡預測下一步，再比對真實後續動作。

**證據與結果。** LongNAP在論文的下一步語意預測比較中優於列出的微調與prompt基線；這衡量的是預測而非代理完成。

### 深入要點

- 大量action標籤由視覺語言模型整理，標註誤差會影響訓練與評估。
- 參數記憶與上下文歷史保存不同資訊，使用者切分方式會影響泛化解讀。

### Reviewer 一句話評

預測準確不會自動產生介入授權。

### 給你的 take-away

先分別測下一步預測、建議有用程度與打擾成本，不用單一相似度取代三者。

## 讀物 3｜OpenClaw

原文：[OpenClaw](https://github.com/openclaw/openclaw)

### TL;DR

專案以本機Gateway接模型與通道，提供個人助理的執行入口；本文只把它當開源實作對照。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 主動個人助理如何接到日常模型與通訊通道？ |
| 證據與邊界 | 開源專案的功能不是GUM研究結果，也不表示所有通道與權限預設安全。 |

### 領域背景

把個人助理接上通訊通道，會同時增加可用資訊與可造成外部影響的動作。

### 中階導讀

**方法。** 由Gateway管理個人助理與啟用通道，依設定連接模型，再由對應通道接收與呈現協助。

**證據與結果。** 公開程式展示個人助理可接多種通道的工程路線，本文不引用其benchmark或宣稱它通過隱私驗收。

### 深入要點

- 本機Gateway與遠端模型是不同資料邊界，本機執行不代表資料絕不離開裝置。
- 通訊通道會引入外部輸入與外送能力，需各自檢查來源信任與發送權限。

### Reviewer 一句話評

先理解通道與權限，再談主動程度。

### 給你的 take-away

先列出啟用的通道、資料與可執行動作，再逐項確認權限與停用方式。

## 它在課程裡的位置

第 18 堂把 agent 的起點從指令換成觀察，[第 19 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day)收尾：multimodal、web 與 computer-use agent 的開放問題，以及期末 Demo Day。

## 本堂 Course Material 對照

- 官方投影片：尚未公開（截至 2026-10-29）
- 指定閱讀：Shaikh 等人〈Creating General User Models from Computer Use〉（本文深讀）
- 延伸閱讀：Shaikh 等人〈Learning Next Action Predictors from Human-Computer Interaction〉、Steinberger〈OpenClaw〉（皆本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 18（11/30 週一）的內容，原屬「第 11 週：從等指令到先出手」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-12：在系列回顧與課表對照中明示 Week 10 為感恩節停課週，避免 Week 9 直接跳到 Week 11 造成漏文疑慮。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 17 堂：Coding & Software Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents)、[第 19 堂：Frontiers & Open Problems](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shaikh et al., Creating General User Models from Computer Use, UIST 2025](https://arxiv.org/abs/2505.10831)、[Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)、[GUM 專案頁與開源套件](https://generalusermodels.github.io/)、[Horvitz, Principles of Mixed-Initiative User Interfaces, CHI 1999](https://dl.acm.org/doi/10.1145/302979.303030)
