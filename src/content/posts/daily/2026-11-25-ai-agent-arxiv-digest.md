---
title: "AI Agent Arxiv Digest — 2026-11-25"
date: 2026-11-25
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "三篇論文都在說同一件事：模型不變，鷹架（harness）怎麼設計就決定 Agent 能做到多少、出錯時會不會一本正經地亂講"
tldr: "AutoPILOT 讓模型一次呼叫就能啟動巨集或自己寫的控制器，同一個 GPT-6.1 Sol 在即時遊戲的成功率從 38.3% 升到 68.6%；Demystifying the Autoresearch Harness 逐一拆解記憶機制，發現保留每次嘗試的摘要（context folding）最有效，組合出的 MLEvolver 在 MLE-Bench Lite 拿到 72.7% 獎牌率；When Tools Fail, Agents Fabricate 注入工具故障，發現 6–26% 的故障執行以捏造答案收場，而外掛一個以程式碼驗證為主的監督者可把捏造率從 17.3% 降到 10.8%"
series:
  name: "AI Agent Arxiv Digest"
  order: 185
---

## 今日總覽

今天三篇論文的共同點是：模型本身都沒有動，被改動的是包在模型外面的鷹架。AutoPILOT 改的是「模型輸出怎麼變成動作」，同一個模型在會倒數的即時遊戲裡，成功率從 38.3% 升到 68.6%。Demystifying the Autoresearch Harness 改的是「Agent 留下哪些過去的嘗試與教訓」，在固定的鷹架裡一次只換一個記憶機制，把各自的貢獻拆開來看。When Tools Fail, Agents Fabricate 看的是反面：工具出錯時，Agent 如何失敗，主要由故障的內容決定，而不是由模型決定，加一層以程式碼驗證為主的監督者，能降低一部分捏造答案的比率。三篇都是 arXiv 預印本，基準也都是作者自建或自選，所以數字適合拿來決定「該先驗證什麼」，不適合直接當成上線後的預期值。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 鷹架（Harness） | 包在模型外面的程式：決定模型看到什麼、記得什麼、輸出怎麼變成動作，以及出錯後怎麼辦，模型本身不算在內 |
| 巨集與控制器（Macro / Controller） | 巨集是模型事先寫好的一串動作；控制器是模型寫的一小段程式，會自己看畫面、自己決定下一步，期間不必再呼叫模型 |
| Context folding（上下文摺疊） | 把每一次嘗試壓成一則簡短摘要，全部保留在上下文裡，需要時再展開成完整紀錄；對照組 compaction 則是把舊紀錄合併成一份滾動摘要 |
| 技能庫（Skill library） | Agent 從過去嘗試中整理出的文字教訓，之後遇到類似情況再挑出來用；deletion 是把連續 5 次沒被選用的教訓刪掉 |
| 靜默吞入（Silent ingestion） | 工具回了殘缺但看起來合理的資料，Agent 第一時間就當成真的，沒重試也沒標註，接著在上面編出答案 |
| 捏造與誠實失敗（Fabrication / Honest failure） | 捏造是自信地給出錯誤答案；誠實失敗是明說資料拿不到。後者下游還能處理，前者不行 |

---

## 論文一｜AutoPILOT：讓一次模型呼叫能打完一整段遊戲

**AutoPILOT: A Visual Agent Harness for Real-Time Gameplay**
Mark Zhao, Pengcheng Wang, Rui Yang et al.（University of Illinois Urbana-Champaign、Georgia Institute of Technology、Northwestern University）　·　arxiv: 2611.28202

連結: [arxiv](https://arxiv.org/abs/2611.28202) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28202)

### TL;DR

多模態模型在遊戲會等它的時候表現不錯，遊戲一旦照常跑就大幅退步；AutoPILOT 讓模型一次呼叫就能啟動巨集或自己寫的控制器，同樣用 GPT-6.1 Sol，即時成功率從 VISTA 的 38.3% 升到 68.6%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查），2026-11-20 提交，2026-11-25 更新到 v2 |
| 引用速度 | 發布 5 天，Semantic Scholar 查詢遇到 429 限流，未取得引用資料 |
| 機構 | University of Illinois Urbana-Champaign、Georgia Institute of Technology、Northwestern University |
| 社群反應 | 未查證 HuggingFace Daily Papers 與 Papers with Code 是否收錄 |
| 可信度 | 通過 — 有三種基準線、兩種時鐘協定、拆掉巨集與控制器的消融、放寬預算的對照，關鍵數字都能回到論文表格 |
| 證據成熟度 | 較完整 — 120 款遊戲加上另一個基準 GameWorld，並測了多個開源與閉源模型；但仍是作者自建的遊戲基準 |
| 可復現性 | 部分產物 — 論文附專案頁（autopilot-harness.github.io），本次未確認程式碼與基準是否公開 |
| 為什麼選這篇 | 直接 — 「模型輸出怎麼變成動作」是鷹架設計裡常被當成預設值的一環，本篇把它單獨拿出來驗證 |
| 方向新意 | 實質增量 — 控制器由模型在執行中從畫面像素寫出，並用喚醒事件把控制權收回，與固定好的規則或預先編譯的反射不同 |
| 今日重要性 | 高 — 凡是不會等 Agent 的環境（即時介面、監控、遊戲），單步迴圈的延遲都是結構性問題 |
| 實務連結 | 推測 — 實驗全在瀏覽器遊戲；對真實電腦操作或機器人的遷移，論文沒有直接測 |
| 編輯信心 | 中 — 遊戲內的差距很大且有消融支撐，但外推到遊戲以外要保守 |
| 閱讀建議 | 必讀 — 做電腦操作或即時互動 Agent 的人 |
| 主要限制 | 評測全是瀏覽器遊戲；GPT-6.1 Sol 每題跑三個種子，其他模型每題只跑一次 |

### 領域背景

多數 Agent 鷹架沿用 ReAct 式的單步迴圈：一次模型呼叫最多產生一個動作，並假設環境會等。VISTA 這類做法改良了模型看到什麼、記得什麼，卻沒動這個迴圈。論文量到的結果是：讓遊戲時鐘照常走，VISTA 在 GameWorld 的成功率從 84.1% 掉到 42.9%，而且 VISTA 在即時情境下只和一般的 Codex 鷹架打平（38.3% 對 38.9%），代表更好的記憶與檢視工具幫不上忙。

### 中階導讀

- **問題**：想像你用遙控器玩射擊遊戲，但每按一次鍵都要先寫一封信給朋友問該按哪個，信回來時子彈早就到了。單步迴圈就是這樣：動作依據的是一次模型呼叫之前的畫面，而且每次呼叫只能送出一個動作。
- **方法**：AutoPILOT 在每次呼叫時讓模型三選一：直接送出一個原始動作；送出一串事先寫好的巨集；或寫一段 Python 控制器，由工作程序在沙箱中執行最多 120 秒，自己讀畫面、自己出手。控制權會在六種喚醒事件下交還給模型，例如控制器主動請求交接、畫面大幅變化、出現需要選擇的畫面或逾時。
- **為什麼重要**：它把「模型該多久介入一次」變成鷹架可以調整的設計項目。模型不必每一步都思考，只需要在關鍵時刻接手。

```diagram
title: 一次模型呼叫能做多少事
desc: 單步鷹架每次呼叫只送出一個動作，AutoPILOT 讓一次呼叫啟動巨集或控制器
---
<svg viewBox="0 0 680 300">
  <rect class="dg-box" x="30" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="44" text-anchor="middle" dominant-baseline="central">單步鷹架（VISTA）</text>
  <text class="dg-sub" x="180" y="68" text-anchor="middle" dominant-baseline="central">一次模型呼叫最多一個動作</text>
  <text class="dg-sub" x="180" y="88" text-anchor="middle" dominant-baseline="central">動作依據的是呼叫前的舊畫面</text>

  <rect class="dg-box dg-box--accent" x="350" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="44" text-anchor="middle" dominant-baseline="central">AutoPILOT</text>
  <text class="dg-sub" x="500" y="68" text-anchor="middle" dominant-baseline="central">一次呼叫可啟動巨集或控制器</text>
  <text class="dg-sub" x="500" y="88" text-anchor="middle" dominant-baseline="central">喚醒事件把控制權交還模型</text>

  <path class="dg-line" d="M180 120 V160" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M500 120 V160" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box dg-box--warn" x="30" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="188" text-anchor="middle" dominant-baseline="central">每題約 80 次模型呼叫</text>
  <text class="dg-sub" x="180" y="212" text-anchor="middle" dominant-baseline="central">每題 $1.50，即時成功率 38.3%</text>
  <text class="dg-sub" x="180" y="232" text-anchor="middle" dominant-baseline="central">（GPT-6.1 Sol，AFK-Bench）</text>

  <rect class="dg-box" x="350" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="188" text-anchor="middle" dominant-baseline="central">每題約 43 次呼叫，681 步</text>
  <text class="dg-sub" x="500" y="212" text-anchor="middle" dominant-baseline="central">每題 $0.89，即時成功率 68.6%</text>
  <text class="dg-sub" x="500" y="232" text-anchor="middle" dominant-baseline="central">（GPT-6.1 Sol，AFK-Bench）</text>
</svg>
```

### 深入要點

- AFK-Bench 是作者建立的 120 款瀏覽器遊戲，依「發呆時會怎樣」平分成三類各 40 款：發呆就會失敗的即時遊戲（hostile）、世界在動但不懲罰發呆的即時遊戲（benign）、回合制遊戲；每款遊戲都能用「即時」與「暫停時鐘」兩種協定各玩一次
- GPT-6.1 Sol 下，AutoPILOT 即時成功率 68.6%，VISTA 38.3%，Codex 38.9%；在發呆就失敗的那一類是 62.5% 對 16.7%；成對比較 360 局，111 局只有 AutoPILOT 贏，2 局只有 VISTA 贏
- 換成 Claude Opus 5.5：AutoPILOT 53.3%，VISTA 30.0%，Claude Code 32.5%；用 DeepSeek-V4.1-Flash 的 AutoPILOT（39.2%）超過用 GPT-6.1 Sol 的 VISTA（38.3%）
- 即使暫停時鐘、完全沒有延遲，AutoPILOT 仍領先 VISTA（73.1% 對 56.1%），因為一次呼叫能執行整段計畫；VISTA 每個動作花一次呼叫，預算先耗盡
- 消融：同時拿掉控制器與巨集，成功率掉到 45.8%（發呆就失敗的那一類掉到 22.5%）；只拿掉控制器，該類從 62.5% 降到 50.8%
- 成本：AutoPILOT 每題 $0.89、43 次呼叫，VISTA 每題 $1.50、80 次呼叫；VISTA 把呼叫上限放寬為三倍後成功率升到 55.0%，每題成本 $5.28，仍低於 AutoPILOT 標準預算的 69.2%
- 在 GameWorld 上，AutoPILOT 即時成功率維持 80.0%，VISTA 從 84.1% 掉到 42.9%
- 落地門檻：控制器靠像素顏色這類規則辨識畫面（論文附的範例用顏色閾值找飛船與子彈），遊戲換了畫風就可能要重寫；模型要有寫程式的能力

### Reviewer 一句話評

正面：把「一次呼叫能做多少事」獨立成變數，並用消融、預算放寬與成對比較分別排除「只是更快」「只是預算多」的解釋，說服力很夠；待觀察：全部在瀏覽器遊戲裡，換成真實電腦操作，控制器怎麼辨識畫面、出錯時怎麼收場，論文沒有直接測，而且除了 GPT-6.1 Sol 之外，每個模型每題只跑一次。

### 給你的 take-away

- 如果你在做電腦操作或即時互動 Agent：先量模型呼叫的延遲占了多少，再決定是否讓模型「寫一段會自己跑的小程式」並設好交還控制權的條件，而不是一直把單步迴圈調快
- 如果你在比較不同鷹架：用「暫停時鐘」與「即時」兩種協定各跑一次，兩者的差距就是鷹架輸給延遲的幅度，比只看單一成功率更能看出問題在哪

---

## 論文二｜Demystifying the Autoresearch Harness：Agent 該記住什麼、忘掉什麼

**Demystifying the Autoresearch Harness: How Context and Skills Shape Self-Evolving Agents**
Kelvin Kiu-Wai Tam, Newt Hue-Nam K. Nguyen, Tianshi Zheng et al.（The Hong Kong University of Science and Technology、The University of Tokyo、National Taiwan University、NVIDIA AI Technology Center）　·　arxiv: 2611.28244

連結: [arxiv](https://arxiv.org/abs/2611.28244) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28244)

### TL;DR

在同一個 Agent 裡一次只換一個記憶機制，結果是「每次嘗試各留一則可展開的摘要」最有效，「刪掉連續沒被用到的教訓」在技能管理裡平均最好；兩者合成的 MLEvolver 在 MLE-Bench Lite 拿到 72.7% 獎牌率。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查），2026-11-20 提交 |
| 引用速度 | 發布 5 天，Semantic Scholar 查詢遇到 429 限流，未取得引用資料 |
| 機構 | The Hong Kong University of Science and Technology、The University of Tokyo、National Taiwan University、NVIDIA AI Technology Center |
| 社群反應 | 未查證 HuggingFace Daily Papers 與 Papers with Code 是否收錄 |
| 可信度 | 有條件通過 — 設計是乾淨的單變因對照，三個模型、兩個基準都有結果；但本次讀到的表格沒有附重複次數或誤差範圍，差距小的格子（例如 gpt-6-sol 在 MLE-Bench 的 +1.6%）不宜解讀成穩定優勢 |
| 證據成熟度 | 初步 — 結果一致指向同一個方向，但消融只用 10 個 MLE-Bench 競賽與 50 題 KernelBench，每個機制只測一種實作與一組參數 |
| 可復現性 | 部分產物 — 論文附錄交代 MLE-Bench 與 KernelBench 的評測流程與反作弊檢查，本次未確認程式碼是否公開 |
| 為什麼選這篇 | 直接 — 長程 Agent 的上下文與經驗庫怎麼管，是每個自我改進迴圈都要做的設計決定 |
| 方向新意 | 實質增量 — 沿用既有機制，新的是在同一個鷹架內做頭對頭、一次一變因的比較 |
| 今日重要性 | 中 — 提供可直接拿去試的設計原則，但屬於工程取捨而非新能力 |
| 實務連結 | 明確 — 對自家 Agent 的歷史紀錄與教訓庫，可以直接對照「摺疊」「刪除」兩種做法 |
| 編輯信心 | 中 — 方向一致，但缺誤差範圍，敘述收在「在論文測過的設定內」 |
| 閱讀建議 | 略讀 — 做長程自我改進 Agent 的人讀 4.2、5.1、5.2 節就夠 |
| 主要限制 | 結論依賴特定實作與參數（刪除門檻 5 次、合併相似度 0.8）；本次讀到的表格未附重複次數 |

### 領域背景

自我改進的研究型 Agent 會對同一個題目反覆嘗試幾十到上百次，每次拿到分數再修正。歷史紀錄很快塞爆上下文，教訓庫又會越積越雜。過去的系統（如 AIDE、OpenEvolve）把搜尋策略與記憶機制綁在一起，很難知道哪個機制有貢獻。本篇是先固定鷹架，再逐一替換。

### 中階導讀

- **問題**：想像一個實驗室助理要連續做 100 次實驗。如果只記得最近 6 次的完整筆記，更早的嘗試會直接消失；如果把舊筆記全部併成一頁「前情提要」，細節又被磨平。
- **方法**：基準是「最近優先截斷」，也就是塞不下就丟最舊的。上下文有兩種替代方案：摺疊（每次嘗試一則摘要，可挑選展開）與壓縮合併（舊紀錄併成一份滾動摘要）。技能庫有三種：刪除（連續 5 次沒被選用就刪）、合併（嵌入相似度達 0.8 就合併）、升級（把證明有貢獻的技能升為每次都帶的固定規則）。
- **為什麼重要**：它說明「省 token」不是目標，「還能不能存取個別歷史」才是。摺疊與壓縮合併用的上下文差不多（平均約 12.1k token），表現卻不同。

### 深入要點

- 設定：三個模型 gpt-oss-120b、gpt-6-luna、gpt-6-sol；上下文預算固定 32,000 token；MLE-Bench 10 個競賽各跑 100 次，KernelBench 50 題各跑 50 次
- 摺疊在六個「模型 × 基準」組合都是最佳，相對基準平均 +8.6%，最大 +19.2%（gpt-6-luna、KernelBench）；壓縮合併平均只有 +0.3%，在 gpt-6-sol 的 MLE-Bench 還略低於基準（−1.7%）
- 後期「創新高率」：摺疊 12.0%，基準 10.2%，壓縮合併 9.7%；摺疊平均保留 42.0 次嘗試的紀錄，只用約 12.1k token，基準只保留 6.2 次完整嘗試，用 18.4k token
- 技能管理相對基準：刪除 +4.1%、升級 +3.0%、合併 +2.2%；在 MLE-Bench、gpt-oss-120b 的設定下，跑完後刪除留下 31 條技能，未管理的基準有 312 條
- 模型差異：每次提示挑出的技能數，gpt-oss-120b 為 6.4–7.1 條，gpt-6-luna 為 1.2–1.9 條，gpt-6-sol 為 0.5–0.6 條；技能管理對 gpt-oss-120b 的增益也較大（三種機制平均 5.1%，luna 1.9%，sol 2.1%）
- MLEvolver（摺疊加刪除），與 AIDE、OpenEvolve 同用 gpt-6-sol、100 次迭代：MLE-Bench Lite 22 個競賽中 16 個拿獎牌（72.7%）、10 面金牌；KernelBench Level 3 的 fast₁ 為 94%（47/50），fast₂ 為 62%（31/50），最終幾何平均加速 2.99 倍，AIDE 1.85 倍、OpenEvolve 1.41 倍
- Limitation：消融與 MLEvolver 的比較用的是不同題組；技能分類與參數都是單一設定

### Reviewer 一句話評

正面：一次只換一個變因，加上「保留個別歷史比滾動摘要有用」的證據鏈（創新高率、保留的嘗試數），讓結論不只是排名；待觀察：沒看到誤差範圍，而且摺疊、刪除各只測了一種實作，換個摘要提示或刪除門檻，名次是否不變還不知道。

### 給你的 take-away

- 如果你的 Agent 會跑很多輪嘗試：先別把歷史壓成一份滾動摘要，改成每輪一則摘要加「需要時展開」，並比較你自己任務上的創新高率
- 如果你有累積的教訓庫：加上一條「連續 N 輪沒被選用就移除」的規則，先看庫的大小與表現有沒有變化，再決定要不要做合併或升級

---

## 論文三｜When Tools Fail, Agents Fabricate：工具壞掉時，Agent 多半不是失敗，而是編一個答案

**When Tools Fail, Agents Fabricate: Silent Failure and Verification-First Oversight in Tool-Using LLM Agents**
Gün Kaynar, Boshen Yan, Carl Kingsford（Carnegie Mellon University）　·　arxiv: 2611.28341

連結: [arxiv](https://arxiv.org/abs/2611.28341) · [alphaxiv](https://www.alphaxiv.org/abs/2611.28341)

### TL;DR

在 2,100 次注入工具故障的執行中，正確復原率只有 19–68%，6–26% 以「自信地給出錯誤答案」收場；故障回傳殘缺資料時最容易捏造，而以程式碼驗證為主的監督者可把捏造率從 17.3% 降到 10.8%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查）；作者在 arXiv 註記為 NeurIPS 2026 Workshop「Who Verifies the Agents?」的稿件 |
| 引用速度 | 發布 5 天，Semantic Scholar 查詢遇到 429 限流，未取得引用資料 |
| 機構 | Carnegie Mellon University |
| 社群反應 | 未查證 HuggingFace Daily Papers 與 Papers with Code 是否收錄 |
| 可信度 | 通過 — 每一次執行都用標準答案評分，並比較兩位評審的一致性（κ=0.91，LLM 判行為分類只有 κ=0.58），主要數字能回到論文表格 |
| 證據成熟度 | 初步 — 4 個 Agent、30 個任務、9 種故障，規模適中；故障由中介層注入，不是真實線上事故 |
| 可復現性 | 完整產物 — 論文聲明釋出測試平台、故障注入工具與全部標註軌跡（GitHub: Kingsford-Group/RetryRealistic；本次未開啟 repo 核對） |
| 為什麼選這篇 | 直接 — 工具呼叫出錯是所有上線 Agent 都會遇到的事，而且論文量的是「怎麼失敗」，不只是「失敗多少」 |
| 方向新意 | 實質增量 — 把故障類型與持續性當成自變數，並提出「靜默吞入」這個可檢驗的機制 |
| 今日重要性 | 高 — 直接影響 Agent 要不要在最終答案前加驗證，以及要驗證什麼 |
| 實務連結 | 明確 — 可對照自家 Agent 的工具回傳格式，找出會回殘缺資料卻不報錯的工具 |
| 編輯信心 | 中 — 效果方向一致，但監督者用的是比所有受測 Agent 都強的模型 |
| 閱讀建議 | 必讀 — 做工具呼叫 Agent 與評測的人 |
| 主要限制 | 受測 Agent 只有 4 個；監督者（Claude Sonnet 4.6）比受測 Agent 都強，論文也承認監督者與評審都是強力的專有模型 |

### 領域背景

大部分 Agent 評測看的是任務有沒有完成，很少控制「工具在哪一步、以什麼方式壞掉」，也就很難分辨 Agent 是怎麼失敗的。常見假設是 Agent 先反覆重試、被錯誤訊息搞亂，最後在預算壓力下編造答案。本篇用可控的故障注入去檢驗這個假設。

### 中階導讀

- **問題**：假設你請助理加總一張報表，資料庫只回傳了一半的資料列，沒有任何錯誤訊息。助理沒發現，直接報出「總計 32,000」，真正答案是 48,750。這比「資料庫連不上」更危險，因為看起來像成功。
- **方法**：RetryRealistic 讓 Agent 在真實檔案系統（含真正的權限限制）、SQLite、本機 HTTP 伺服器與受限的 shell 上，用 8 種工具完成 30 個多步驟任務，並在第一個符合條件的呼叫注入 9 種故障之一。評分一律拿最終答案與標準答案比對，分成正確、捏造、誠實失敗三種。
- **為什麼重要**：它指出捏造的主因不是重試太多次，而是「第一次拿到殘缺資料就信了」，所以補救的位置在驗證，不在多叫幾次重試。

### 深入要點

- 設定：Llama-3.1-8B、Llama-3.1-70B、DeepSeek-V4、Claude Haiku 4.5 四個 Agent，2,100 次帶故障的執行；正確復原率 18.9%（Llama-8B）到 67.6%（DeepSeek-V4），捏造率 6–26%（DeepSeek-V4 為 5.5%，其餘三個 19–26%）
- 故障類型比模型更能預測失敗方式：回傳殘缺但合理資料的 partial_success 捏造率 38.3%；權限被拒與需要認證則分別有 78.1% 與 53.4% 以誠實失敗收場；故障類型解釋捏造變異的程度是模型的 1.6 倍（η² 0.061 對 0.038）
- 機制檢驗：對可見失敗的呼叫重試 3 次以上時，捏造率只有 7.0%、誠實失敗 82.2%；重試 0–1 次的捏造率 20.7%；在殘缺資料類故障中，609 次有 554 次（91%）Agent 至多只重複該呼叫一次，其中 27.8% 以捏造收場
- 只改內容的對照：固定注入點、目標工具與持續性，只換回傳內容，殘缺資料的捏造率 35.2%，同樣結構的明確拒絕為 16.0%
- 監督者（Claude Sonnet 4.6）：正確復原率 45.6% 升到 56.3%，捏造率 17.3% 降到 10.8%；只用程式碼的版本為 54.7% 與 13.4%；每次執行平均多 6.4 次監督者呼叫（Agent 本身平均 11 步）
- 監督者幫助最少的地方正是靜默吞入最強的地方：partial_success 捏造率只從 38.3% 降到 32.1%（只用程式碼的版本 40.7%），因為殘缺資料不會報錯，監督者在 324 次 partial_success 執行中有 224 次從未介入
- 拿掉思維鏈（chain-of-thought），捏造率從 17.3% 升到 25.6%（+8.3 個百分點）；加一句「不要編造」的誠實提示只降到 13.7%，對 partial_success 幾乎沒有效果（38% 對 40%）
- 方法學：LLM 評審判行為類別只有 67% 一致（κ=0.58），拿最終答案跟標準答案比對則達 94%（κ=0.91）
- 論文自己承認的限制：受限 shell 與模擬的 HTTP；重新計算階段只涵蓋純量彙總；監督者與評審都是強力專有模型；全部執行裡有 118 次故障根本沒觸發

### Reviewer 一句話評

正面：用標準答案評分取代 LLM 行為分類，並用「只換內容」的對照把機制鎖在靜默吞入上，推論比單純報告失敗率紮實；待觀察：監督者比受測 Agent 都強，換成同等級的模型自我監督，效果與成本會是什麼樣，這篇沒有回答。

### 給你的 take-away

- 如果你的 Agent 會呼叫會回殘缺結果但不報錯的工具（分頁、截斷、逾時回部分資料）：先在工具層加上完整性訊號（總筆數、是否截斷），並在最終答案前檢查答案裡的數字有沒有出現在工具輸出裡
- 如果你在設計評測：優先用最終答案與標準答案比對的客觀指標，不要只靠 LLM 判斷「這是哪一種失敗」，論文量到後者的評審一致性明顯較低

---

## 今日收穫

之前我把「Agent 表現」大致當成模型本身的屬性，鷹架只是外面的包裝。今天三篇的數字都不支持這個看法：同一個模型，改變輸出變成動作的方式，成功率差了 30 個百分點；改變歷史怎麼保存，名次跟著換；改變工具回傳的內容，失敗方式就從誠實認錯變成編造。要判斷一個 Agent 好不好，得把鷹架當成另一個變因一起評，而不只是比模型。

## 參考資料

- [AutoPILOT: A Visual Agent Harness for Real-Time Gameplay（arXiv 摘要頁）](https://arxiv.org/abs/2611.28202)
- [AutoPILOT 全文（arXiv HTML v2）](https://arxiv.org/html/2611.28202v2)
- [AutoPILOT 專案頁面](https://autopilot-harness.github.io/)
- [Demystifying the Autoresearch Harness: How Context and Skills Shape Self-Evolving Agents（arXiv 摘要頁）](https://arxiv.org/abs/2611.28244)
- [Demystifying the Autoresearch Harness 全文（arXiv HTML v1）](https://arxiv.org/html/2611.28244v1)
- [When Tools Fail, Agents Fabricate: Silent Failure and Verification-First Oversight in Tool-Using LLM Agents（arXiv 摘要頁）](https://arxiv.org/abs/2611.28341)
- [When Tools Fail, Agents Fabricate 全文（arXiv HTML v1）](https://arxiv.org/html/2611.28341v1)
- [RetryRealistic 測試平台與標註軌跡（GitHub）](https://github.com/Kingsford-Group/RetryRealistic)
- [arXiv cs.AI 當日公告清單](https://arxiv.org/list/cs.AI/new)
