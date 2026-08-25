---
title: "CS221 Lecture 19：AI Supply Chains：模型背後的資源、勞動與市場"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 20
tldr: "Lecture 19 用 Economics of AI deck 把 AI 的 compute、data、distribution 與組織互補品接到 GDP、勞動與 ideas 的成長路徑。"
description: "Stanford CS221 Lecture 19 的 AI Supply Chains 閱讀：從官方 Economics of AI deck 的供應鏈、資料交易與 GDP-B 數字，拆開模型能力與經濟結果之間的中間層。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-19-ai-supply-chains-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 19**，日期是 2025-12-01。官方課表將這堂課列為 **AI Supply Chains**；可執行講義 repository 則把連結標成 **Economics of AI**。我下載並逐頁讀過完整的 70 頁 Google Slides PDF；封面將 **Rishi Bommasani** 列為 deck author / credited presenter。這個 deck credit 不足以證明誰在課堂現場演講，因此本文不把他寫成現場講者，也不把 Percy Liang 的課程講師身分延伸成 L19 講者。主要書面材料是 [Economics of AI Google Slides（deck snapshot；核對日 2026-08-22，投影片未明示每個估值的市場日期）](https://docs.google.com/presentation/d/1jCn1OV4H1HKzQ0PWzRn2_bfOWKw43eS33wyramBt2z8/edit)，課程版本與課表以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準。

> 材料邊界：課表與 repo 標題不同。本文區分「投影片事實」「投影片引用」「我的解讀」，不用錄影補洞；數字均為 deck 快照，不是 2026 即時統計。

## 這一講的問題

這 70 頁 deck 問：AI 如何改變經濟？模型需要哪些資源與組織選擇？能力如何變成成長？這是兩個官方標題的交集。

投影片的 agenda 很清楚：第一段是 **technology and organizations**，第二段是 **current supply chains**，第三段是 **growth economics**。順序很重要。若一開始就把「更強的模型」直接等同於「更高的 GDP」，就會跳過組織如何採用、供應鏈誰能取得資源，以及免費服務如何進入國民所得統計等中間層。

**[投影片事實]** 開場先放上世界經濟健康、future of work 與 inequality，接著提醒「整體經濟影響高度取決於非 AI 組織」。技術本身不能告訴我們誰贏、誰輸；即使是模型開發商，也還要決定何時發布、怎麼定價、做哪些產品，以及與誰合作。投影片用「Google = Anthropic = OpenAI」作為過度簡化的結論，再立刻用「reality」頁面否定它：三家公司面對的選擇與脈絡不同，不能只用模型能力排列。

## 方法如何展開

**先把技術放回組織。**

**[投影片事實]** 第一段把 technology 和 organizations 放在同一個 lens。單有技術不會自動產生經濟影響；組織必須重新安排決策、流程、責任與投資。投影片列出的選擇很具體：何時 release model、如何 price、哪些 products 要 build、要 partner with 誰。這些不是模型訓練完成後才補上的 marketing 細節，而是決定技術價值如何分配的選擇。

**[我的解讀]** 模型與 serving stack 是下層；人員、流程、權限、評估是上層。下層升級若沒有 workflow 和 accountability 改變，未必產生生產力。

**Current supply chains：compute。**

第二段先從 **compute** 開始，但投影片刻意提醒 compute 不只是 chips。它包含晶片設計與製造、極紫外光刻等設備、封裝、資料中心、電力、網路、散熱，以及由 major clouds 提供的計算服務。投影片沒有把這些項目拆成完整的成本模型，而是用它們說明：模型供應鏈是一串互相依賴的 bottleneck。

**[投影片事實；deck snapshot，核對日 2026-08-22，原始市場日期未印出]** critical companies 頁面列出三個例子與 deck 上的估值快照：ASML 被描述為極紫外光刻的全球壟斷者，標示約 4,000 億美元估值；TSMC 被描述為先進晶片的頂尖製造商，標示約 1.5 兆美元；Nvidia 被描述為晶片市場的 dominant player，標示約 4.4 兆美元。[官方 deck](https://docs.google.com/presentation/d/1jCn1OV4H1HKzQ0PWzRn2_bfOWKw43eS33wyramBt2z8/edit) 是這些估值與 dominance 描述的來源；它們不是本文重新查詢的今日市值，也不能倒推三家公司在所有 AI 收益中的比例。

**[投影片事實]** deck 接著問「why does this matter?」，給出三個方向：supply-chain resilience、AI 成長的價值由誰取得，以及 US-China geopolitics。TSMC（Taiwan）和 chip export controls 被列在 geopolitics 下面。這一頁沒有提出完整的政策結論，也沒有宣稱某一個國家必然控制整條鏈；它只把地理集中、出口限制與價值分配放進同一張風險地圖。

**[我的解讀]** 工程評估要問 cloud region、GPU、封裝或電力失效時能否替代；compute 成本也不只 per-token price，還含 capacity、utilization、location 與 latency。

**Data：取得方式決定價格與權利。**

投影片把 data acquisition methods 分成三個來源。第一是 **data within the firm**，包括 synthetic data，例如 RLAIF，以及 usage data，例如 ChatGPT interactions、Gmail。第二是 **data that is public**，包括 SQuAD、The Pile 等 public datasets 和 web crawling。第三是 **data that third parties have**，又分成 new data，例如 Scale、Mercor，和 old data，例如 New York Times、Reddit。

**[投影片事實]** deck 的重點不是把「公開」當成零成本，而是說 pricing depends on acquisition method。企業內的 synthetic data 需要支付 compute；usage data 可能透過支付服務取得；public datasets 在投影片中標成 free；web crawling 標成 currently free；第三方的新資料通常要支付 labor；第三方的舊資料則是 negotiated large-scale transaction。這裡的 free 不是永遠免費，也不是沒有合規成本，而是投影片在該分類下對直接取得價格的簡化標記。

投影片再用一個醒目的例子讓交易規模具體化：**1.5 billion dollars for 500,000 works = 3,000 dollars per work**。**[投影片事實；deck snapshot，核對日 2026-08-22]** [官方 deck](https://docs.google.com/presentation/d/1jCn1OV4H1HKzQ0PWzRn2_bfOWKw43eS33wyramBt2z8/edit) 只支持「這是投影片上的單一市場例子」；投影片未交代交易雙方、作品種類、權利範圍、期間、地域或交易日期，因此不能把它改寫成所有版權資料的行情，也不能推導每份作品的通用價格。

這樣的分類至少帶出三個問題。第一是 data exhaustion：會不會用完資料？需要同時看 current data mix、data generating rates 和 total data，不能只看網路上還有多少文字。第二是 compliance：copyright、piracy、CSAM、privacy 都是資料鏈上的約束，不是模型訓練結束後才由法務補一張 checklist。第三是 competition：某些資料若被獨家取得，資料就不只是 input，也會變成阻擋競爭者的資產。

**[我的解讀]** 資料清單應把 provenance、取得方式、允許用途、更新與撤回路徑放在一起；只比 dataset size 會漏掉 rights、freshness、exclusivity 與 cleaning cost。

**Distribution：下游也會反過來改變供應鏈。**

第三個 current supply-chain 元件是 **distribution**。投影片沒有把 distribution 限縮成 app store 或 API gateway，而是直接問它如何 shape downstream supply chains。列出的影響包括 vertical control、pricing、data flows（privacy、security），以及 adaptability（fine-tuning、distillation 等）。

**[投影片事實]** 同一個模型透過自有產品、雲端平台、合作夥伴或開放權重分發，會形成不同的下游關係。垂直控制會影響誰能決定介面與路由；pricing 會影響誰能負擔使用；data flows 會改變隱私與安全邊界；distribution 的可接近性也會影響下游能否 fine-tune 或 distill。deck 沒有宣稱其中一種渠道一定最好。

**[我的解讀]** 供應鏈也是 feedback loop：distribution 影響回饋資料，pricing 改變需求與 capacity planning，vertical integration 增加控制卻可能降低可替代性。

**Growth economics：從微觀決策到總體成長。**

第三段先劃分 micro 與 macro：micro 看個人決策，macro 看整體經濟；投影片說 computer science 通常偏 micro orientation，而本段要討論 aggregate macro outcomes。Scope 也很保守：AI 指目前所理解的 frontier AI，不納入 Waymo、industrial robots、Facebook recommendation systems；economics 聚焦 aggregate growth，不處理 distribution outcomes、economic policy、學生與休閒用途或 misuse。

接下來 deck 用 Technological Richter Scale、帶例子的 impact 圖和 LEAP、Murphy 等人的 labeled forecasts，讓讀者看到預測範圍可以從 utopia 到 doom。**[投影片引用；核對日 2026-08-22]** 這些圖是 [官方 deck](https://docs.google.com/presentation/d/1jCn1OV4H1HKzQ0PWzRn2_bfOWKw43eS33wyramBt2z8/edit) 標出的 forecast landscape，不是 Bommasani 自己保證的單一數字。**[我的解讀]** 正確讀法不是選一個最戲劇化的端點，而是問每個 forecast 假設了什麼：採用速度、資本是否跟上、任務是否可自動化、收益是否被重新投資，以及經濟制度是否容許互補創新。deck 提醒我們要辨認 magnitude，沒有提供一個可直接代入公司的預測器。

**AI 作為 general-purpose technology。**

投影片接著回到 normal technologies 和 generic normal technologies，引用 [Bresnahan and Trajtenberg 的 GPT 研究](https://doi.org/10.1086/262072)，再問 AI 是否是 **general-purpose technology（GPT）**，以及如果是，是否受 GPT principles 支配。deck 也引用 [Bommasani 等人（2021）的 foundation-model 報告](https://arxiv.org/abs/2108.07258)：**pervasiveness**、**improvements over time**、**innovation complementarities**。這些是 deck 明示的文獻脈絡，不是把經濟學家的結論改寫成 Bommasani 個人的發言。

**[投影片事實]** pervasiveness 意味著技術可以滲透許多部門；improvements over time 意味著能力會持續改進；innovation complementarities 則是下游應用和組織變更會與通用技術互相增強。投影片給的 technological 例子是 downstream applications，例如 coding tools；organizational 例子是 workflow redesign，例如建立驗證 AI outputs 的流程。它同時放上 Brynjolfsson 等人（2018）提出的 productivity J-curve：新通用技術可能先需要互補投資與組織調整，生產力統計稍後才反映出來。

**GDP、免費服務與三條成長路徑。**

GDP 是 deck 後半段的 central measure。它展示約 150 年的 GDP trends，並引用 Chad Jones（2023）；也重提 Solow 與 Brynjolfsson 的觀察：「你到處都看得到 computer age，卻在 productivity statistics 裡看不到」。接著投影片給出一個很實際的原因：網路確實改變生活，但 Google Search、Maps、Facebook 等許多 internet technologies 是 free，而 GDP 主要記錄 payments。

**[投影片事實；deck snapshot，核對日 2026-08-22]** 為了補足只看付款的缺口，deck 引用 [Brynjolfsson 等人的 GDP-B／choice-experiment 研究](https://www.nber.org/sites/default/files/2024-04/2024number1.pdf)。該頁標示一項 2025 survey 的三個數字：**40% of adults use genAI、WTP 為每月 98 美元、consumer surplus 為每年 970 億美元**。這些是 deck 呈現的 cited study/example，不是本篇重新估計；WTP、consumer surplus、營收與 GDP 增長不可互換，研究年份與 deck snapshot 年份也要分開寫。

**[材料缺口]** 這份 PDF 的圖表頁沒有完整呈現調查樣本、問卷 wording、估計區間與所有計算步驟。因此本文只把它當成「GDP 可能漏掉免費服務價值」的 cited example，不宣稱 40%、98 美元或 970 億美元可無條件推廣到所有國家、年份或人口群。

最後，投影片提出 AI 影響經濟的三條路徑：**讓一個 sector 變得極度 productive、注入 cheap labor、產生 new ideas**。

第一條路徑不是「某一產業效率變高，GDP 就等比例上升」。投影片用 illumination sector 作例子：該 sector 的價格可能下降，即使 consumption 增加，對總 GDP 的增幅仍可能很小。接著引入 Baumol's cost disease：其他部門會跟上 productive sector 的工資，而「good/cheap software, expensive healthcare」這類相對昂貴的部門，仍然占有很大的 GDP share。**[我的解讀]** 這不是否定生產力，而是提醒我們看價格、產量、部門占比與工資如何一起變動。

第二條路徑是 AI 作為 labor injection。deck 用 Cobb-Douglas production function 表示：

`Y = A · K^α · L^(1−α)`

其中 Y 是 output（GDP、production），A 是 total factor productivity，K 是 capital，L 是 labor，α 是 capital share，且 `0 < α < 1`。**[投影片事實]** 若 AI 注入勞動，GDP curve 可能一次向上移動；若是持續的勞動增長，且 capital 能跟上，exponential growth rate 也可能改變。投影片同時提醒 developed economies 的 labor 已經 plateau，原因包括 population stagnation 和 labor share stagnation。因此真正重要的不只是「增加多少勞動」，而是增加多少、以及哪些 tasks 被改變。

第三條路徑是 AI 產生 ideas。投影片引用 Romer 的成長直覺：ideas 是 growth 的核心；與傳統 goods 不同，ideas 是 nonrival、可以重複使用。linear algebra 是投影片給的例子。若 AI 改變 R&D 或 science，最可能影響的是 GDP 的 exponential growth rate；deck 指向 Ben Jones（2025）作為更具體模型的延伸。**[投影片引用]** 這裡談的是成長機制與研究方向，不是「AI 已經讓科學成長了多少」的已驗證估計。

把三條路徑放在一起，會得到一個比單一自動化比例更有用的檢查表：是某一個部門變便宜？是可用勞動的數量或任務範圍增加？還是新 ideas 的生成、驗證與擴散速度改變？每一條路徑對資本、價格、勞動、研究與互補組織的要求不同。

## 與整門課的連接

CS221 前半段讓人習慣用狀態、行動、目標函數、資料與不確定性來描述 AI 系統；Lecture 19 把同樣的嚴謹習慣搬到系統外部。模型不再只是一個可以呼叫的函式，而是嵌在 compute、data、distribution、組織流程和市場中的決策節點。這不是把前面學過的 search、learning、MDP、games、Bayesian networks 或 logic 重新教一次，而是問它們要在什麼資源與制度條件下成為可用的產品。

**[我的解讀]** 這一講最值得帶回工程實作的不是一個新的 Python API，而是一張 dependency map：做模型選型時，至少列出 compute 依賴、data provenance、distribution 位置、organization/workflow 變更，以及要觀察的 economic metric，避免把局部 benchmark 當成整個系統的成功定義。

## 延伸

可把 deck 變成四個小練習：畫出 model 與 organization 兩層；替 compute、data、distribution 每條邊標 substitutes、fixed/marginal cost 與 single point of failure；替每種 data method 記 rights、freshness、labor、compliance；最後把影響假說分類為 sector productivity、labor injection 或 ideas，並分開 GDP、consumer surplus、revenue 與 cost。

每個假說都要把「投影片說了什麼」與「我們想測什麼」分開。投影片對 ASML、TSMC、Nvidia 的描述和估值是 deck snapshot；對 data acquisition 的分類是分析框架；對 2025 genAI survey 的數字是 cited forecast／survey example；對 GPT、J-curve、Cobb-Douglas 與 ideas 的關係，則是引用研究和講者整理出的模型語言。我的延伸不能把它們混寫成目前產業的完整 census。

材料缺 compute 成本分解、15 億美元交易的 contract context、distribution 實證比較，以及可重現的 macro model。這些只能列為 follow-up，不能靠常識補成 deck 結論。工作方法是先標 deck fact、deck citation 或我的解讀，再問市場結論漏了哪個 bottleneck 與 complement。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：Economics of AI Google Slides](https://docs.google.com/presentation/d/1jCn1OV4H1HKzQ0PWzRn2_bfOWKw43eS33wyramBt2z8/edit)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
