---
title: "（最終回）：從等指令到先出手——proactive agent 與 Demo Day｜Stanford CS329Z 第 11 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 11
tldr: "最終回讀 Week 11：週一用 GUM 論文把等指令的 reactive 助理升級成會觀察、推測、先出手的 proactive agent，週三把 multimodal、long-running 與 production observability 收成三個 open problems；文末附 Demo Day 前檢查清單與全系列 11 篇地圖。"
description: "帶讀 Stanford CS329Z Week 11 主讀物 Shaikh 等人的 General User Models：命題架構、Gumbo 助理、隱私信任兩難，以及 12 月 2 日 open problems 框架與 Demo Day 行前準備。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week11-proactive-demos-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

想像兩種助理。第一種永遠等你開口，你沒說，它就不動。第二種會看：你收到朋友的婚禮邀請，它先查好租西裝的地點與預算，把結果放在你面前。第一種叫 reactive，第二種叫 [proactive agent](https://arxiv.org/abs/2505.10831)，Week 11 的週一談的正是第二種。

差別不在模型大小，在誰先出手。reactive agent 的迴圈起點是你的指令，proactive agent 的迴圈起點是它對你的觀察。觀察需要一雙眼睛，推測需要一個使用者模型，出手需要一套何時該打斷的規矩。這三件東西，剛好就是本週主讀物的三個主角。

| 比較 | Reactive | Proactive |
|---|---|---|
| 起點 | 使用者指令 | 對使用者的觀察 |
| 需要的脈絡 | 當下請求，也可使用使用者模型 | 使用者模型用來產生候選建議 |
| 何時出現 | 回應請求 | 評估有用程度與打擾成本 |
| 本文追問 | 任務能否完成 | 觀察、記憶與打斷是否合宜 |

Week 11 的安排很像收官。週一（Proactive Agents）的主讀物是 Shaikh 等人的 [General User Models](https://arxiv.org/abs/2505.10831)，另有 Next Action Prediction 延伸論文與隱私信任的討論。週三（Open Problems & Final Demos）沒有單一讀物。課程把 multimodal、web 與 computer-use、science agent、long-running 架構、production observability 攤開，收斂成三個開放方向。以下對週三的整理標示為課程視角，而非某篇論文的主張。paper video 的 peer review 也在週一截止，Demo Day 排在 finals week；專案題目依現行官方要求自選，連到課程核心主題。

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

例子很有說服力。第一作者的 GUM 替他找到婚禮租西裝的地點，還自動受限於他的預算。GUM 也能幫 prompt 補上脈絡：你正在寫哪一段、讀過哪篇論文，於是 help me with this section 這種沒頭沒尾的請求也能直接可用。這正是 [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) RAG 想補的 grounding，只是來源從檢索庫換成你的電腦使用痕跡。

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

Audit 模組用[脈絡完整性](https://arxiv.org/abs/2505.10831)原則過濾觀察。白話問一句：這份資訊被記下來，符合它原本出現的場合嗎。評估結論很誠實：大致守規矩，但破例的時候都很嚴重。這正是 Week 11 把隱私與信任和 proactive 放在同一週的原因。reactive agent 犯錯，你至少在場；proactive agent 犯錯，經常是你不在場的時候。

論文另闢一節談 privacy paradox。同一批參與者既想要記得夠多的助理，又對白紙黑字的命題感到不自在。看到自己的習慣被寫成命題，有人直說感覺怪怪的。這題沒有技術解，只有取捨：記得多，幫得多，也錯得多。

這裡也回扣 [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems) 的系統觀。GUM 的四個模組沒有一個是模型本身，全是模型之外的工程：觀察、稽核、檢索、修正。好成績依然是系統堆出來的，只是這次堆的是關於你的系統。

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

## 讀物 4｜OSWorld

原文：[OSWorld](https://arxiv.org/abs/2404.07972)

### TL;DR

OSWorld 提供可重播的電腦任務與執行式驗收，以環境成果而非單純文字答案計分。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | Computer-use agent如何在真實作業系統裡驗收？ |
| 證據與邊界 | 12.24%是原論文受測最佳模型結果，不能當作今日computer-use上限。 |

### 領域背景

電腦操作包含跨應用狀態，只有最後文字無法證明檔案、設定與工作流程真的完成。

### 中階導讀

**方法。** 在可重設的作業系統環境交付自然語言任務，讓模型操作，再用執行式檢查確認成果。

**證據與結果。** 原始研究顯示GUI定位與操作知識是瓶頸；12.24%的歷史結果應保留受測模型與環境條件。

### 深入要點

- 跨應用任務的中間畫面不一定證明終態正確，最後仍須讀實際成果。
- 環境初始化要可重播，否則前一次操作留下的視窗或檔案會改變難度。

### Reviewer 一句話評

操作驗收要回到環境。

### 給你的 take-away

讓GUI任務的驗收讀實際檔案或應用狀態，並記錄初始環境。

## 讀物 5｜WebShop

原文：[WebShop](https://arxiv.org/abs/2207.01206)

### TL;DR

WebShop 在模擬電商環境用自然語言購物指令測搜尋與選擇，連結語言理解與網頁動作。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 購物指令中的條件能否落到正確商品選擇？ |
| 證據與邊界 | 29%是原研究最佳模型的任務成功率；模擬商店不等於真實交易或今日能力。 |

### 領域背景

商品搜尋要求把自然語言限制映射到網頁選擇，找到相似商品與滿足全部條件並不相同。

### 中階導讀

**方法。** 模型根據購物指令搜尋、瀏覽屬性並選商品，再由環境對照商品與使用者限制給回饋。

**證據與結果。** 原始最佳模型29%成功率低於人類專家59%，顯示理解購物條件與連續操作仍有差距。

### 深入要點

- 搜尋與選擇可以分開學，但最後必須由整體商品條件驗收，不能只看搜尋關鍵字。
- 模擬環境固定部分真實網頁變動，因此不能把成功直接轉成真實交易可靠性。

### Reviewer 一句話評

選對商品需要逐項條件驗收。

### 給你的 take-away

把商品屬性與使用者限制寫進驗收，不用點擊完成或流暢回覆代替買對商品。


## 怎麼做：Demo Day 前檢查清單

**怎麼做**：先把 tracing 全開，每次彩排都留一條可重播的 trace。monitoring 盯三件事：錯誤率、延遲、token 花費。cost 設硬上限，超標自動停。高風險工具預設關閉，現場 demo 才手動放行。最後準備一個失敗案例，midway report 寫過的 failure mode 拿出來講，比只秀成功更有說服力。

## 全系列回顧：11 篇文章與一個停課週

1. [總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)：先手刻再用框架，兩份作業與 GitHub 課綱變動全覽。
2. [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)：別只調模型，好成績是複合系統堆出來的。
3. [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)：先分清 workflow 和 agent，再手刻第一個 RAG。
4. [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy)：MCP 統一工具插頭，DSPy 把 prompt 變成可編譯程式。
5. [Week 4](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory)：ReAct 把迴圈定型為想—做—看，[MemGPT](https://arxiv.org/abs/2310.08560) 把記憶做成作業系統式的分層結構。
6. [Week 5](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization)：多智慧體協作與優化三軸，決定改 prompt、改權重還是加推理算力。
7. [Week 6](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel)：資料飛輪轉起來，HW2 發布、HW1 截止。
8. [Week 7](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks)：資料選擇與基準設計，評估收斂成四元組。
9. [Week 8](/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety)：LLM-as-judge 與安全護欄，評分者本身也要被評。
10. [Week 9](/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents)：ACI 介面即效能，SWE-agent 證明編輯器設計決定分數，OpenHands 把沙箱與評測做成通用底座。
11. Week 10：Thanksgiving Recess，兩堂都停課，沒有指定或延伸閱讀，因此系列沒有另寫一篇空白導讀。
12. Week 11（本篇）：從等指令到先出手，proactive agent 與 open problems 收官。

## 本週 Course Material 對照

- 週一 11/30 Proactive Agents：主讀物 GUM（本文已導讀）；延伸閱讀 [Shaikh 等人 Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)。它把「從多模態電腦使用痕跡預測下一步行動」形式化成任務，並提出結合參數與上下文學習的 LongNAP 模型。資料來自 20 位使用者的連續手機使用紀錄。團隊用 vision-language 模型標出超過 36 萬個行動。評估以 LLM-as-judge 對預測與真實下一步的相似度打分，LongNAP 明顯優於監督微調與提示基線。
- 週三 12/2 Open Problems & Final Demos：無單一主讀物。延伸閱讀 [OSWorld](https://arxiv.org/abs/2404.07972)（真實作業系統中的開放式電腦任務基準）與 [WebShop](https://arxiv.org/abs/2207.01206)（模擬電商站上的語言 grounding 基準）。兩者的具體數字見上文週三一節。
- Week 10（11/23、11/25）：官方課表兩堂均標為 `No Class — Thanksgiving Recess`，指定與延伸閱讀皆為空。
- 課表原文：[CS329Z 官網 Week 11](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。

- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-12：在系列回顧與課表對照中明示 Week 10 為感恩節停課週，避免 Week 9 直接跳到 Week 11 造成漏文疑慮。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)、[Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[Week 3：工具接進來，框架換上去](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shaikh et al., Creating General User Models from Computer Use, UIST 2025](https://arxiv.org/abs/2505.10831)、[Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)、[GUM 專案頁與開源套件](https://generalusermodels.github.io/)、[Horvitz, Principles of Mixed-Initiative User Interfaces, CHI 1999](https://dl.acm.org/doi/10.1145/302979.303030)
- 場合：[UIST 2025](https://uist.acm.org/2025/)
