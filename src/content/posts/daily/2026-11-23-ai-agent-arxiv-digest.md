---
title: "AI Agent Arxiv Digest — 2026-11-23"
date: 2026-11-23
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從不同角度檢查 Agent 記憶這件事：通用 LLM 摘要式壓縮會系統性漏掉關鍵狀態，用結構訊號設計的折疊方法卻能砍半記憶幾乎不掉分，而不管怎麼管理記憶，都還需要一套方法去抓出哪一條記憶正在把 Agent 帶偏"
tldr: "CompAct-Bench 測 12 個前沿模型用摘要壓縮長任務上下文，最強的 Claude Opus 5 也只有 68.5% 續跑成功率，且壓縮常把未定案的猜測寫成既定結論；MemFolder 改用實體與時間鏈等結構訊號做記憶折疊，砍半記憶筆數仍保留 99.0% 效能，程式碼已開源；DriftGuard 用配對反事實重播找出哪一條記憶正在造成偏移，比最強的 LLM 評審基線 AUPRC 高出 86.2%"
series:
  name: "AI Agent Arxiv Digest"
  order: 183
---

## 今日總覽

今天三篇論文合起來回答同一件事:Agent 的記憶該怎麼管才不會出問題?第一篇 CompAct-Bench 先把問題攤開:現有 agent harness 常用的「用 LLM 寫摘要」來壓縮累積的上下文,在 12 個前沿模型測下來平均只保住 56.7% 的下游任務完成度,就連最強的 Claude Opus 5 也只有 68.5%,而且壓縮常常不是漏資訊,是把還沒確定的猜測寫成已經確定的結論,讓後面的執行走錯方向。第二篇 MemFolder 換一個做法:不靠 LLM 自由摘要,而是用實體關聯與時間順序等結構訊號決定哪些記錄可以合併、怎麼合併,結果砍半記錄數量還能保留 99.0% 的原始效能,程式碼也公開在 GitHub 上。第三篇 DriftGuard 處理一個不同但相關的問題:不管記憶管理得多好,你怎麼知道「現在這一條記憶」正在把 Agent 帶往錯誤的方向?答案是用配對反事實重播建立訓練訊號,再訓練一個線上風險模型即時抓出可疑記憶,效果大幅超過直接問 LLM「這條記憶可疑嗎」。三篇證據成熟度都算扎實——都有多基準、多基線與消融實驗——但也都誠實標出了自己的邊界。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 工作上下文壓縮(Working-context compaction) | Agent 執行長任務時,把累積的互動紀錄、工具輸出用摘要方式縮短,好讓對話還能繼續下去 |
| 記憶折疊(Memory folding) | 把多筆語意相近的記憶記錄合併成較少、較精簡的單位,同時盡量保留原本的關鍵事實 |
| 因果歸因(Causal attribution) | 不只看一條記憶「看起來可疑」,而是實際測試拿掉它之後 Agent 的行為會不會改變,藉此確認它是不是真正的原因 |
| AUPRC | 一種評估「抓壞東西」能力的指標,在壞東西佔比很低時比準確率更能反映實際偵測能力,數字越高越好 |
| 消融實驗(Ablation study) | 把方法裡的某個設計拿掉,看效果掉多少,用來確認那個設計是不是真的有貢獻,不是湊巧 |
| 反事實重播(Counterfactual replay) | 把某一條記憶拿掉或換掉之後重新執行同一段任務,比較結果有沒有不同,藉此判斷那條記憶的實際影響 |

---

## 論文一｜CompAct-Bench:現有的上下文壓縮,連最強模型都會漏掉關鍵狀態

**CompAct-Bench: A Benchmark for Working-Context Compaction in Long-Horizon Agent Tasks**
Jiayi Chen, Lizhe Chen, Yujia Chen et al.（Fudan University NLP 團隊）　·　arxiv: 2611.25673

連結: [arxiv](https://arxiv.org/abs/2611.25673) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25673)

### TL;DR

把 200 個長任務在不同階段插入壓縮點,讓 12 個前沿模型壓縮前面的互動紀錄後接著跑完任務,結果最強的 Claude Opus 5 也只有 68.5% 續跑成功率,12 個模型平均 56.7%,且失敗常常是把未解決的疑點寫成已確定的結論,而不是單純漏字。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布約 4 天，preprint 尚無引用資料 |
| 機構 | Fudan University NLP 團隊（作者含 Tao Gui、Qi Zhang、Xuanjing Huang、Shihan Dou，論文摘要頁未列出機構，依作者慣常掛名推斷） |
| 社群反應 | 同時出現在 cs.AI 與 cs.CL 雙重分類提交 / 未見於 HF Daily Papers、Papers with Code |
| 可信度 | 通過 — 200 任務跨 3 領域、12 模型評測、人工標註錯誤型態並連到續跑結果，另有統計檢定支持關鍵發現 |
| 證據成熟度 | 較完整 — 三領域、12 模型、人工錯誤標註與統計檢定都有覆蓋，是今天唯一有正式統計顯著性檢定（Mann–Whitney p=3×10⁻⁸）的 |
| 可復現性 | 部分產物 — BrowseComp、SWE-bench 為公開基準，CompanyBench 為內部資料集未公開 |
| 為什麼選這篇 | 直接 — 直接測量現有 agent harness（如 Claude Code）普遍採用的壓縮機制到底漏了什麼 |
| 方向新意 | 實質增量 — 把「壓縮品質」從傳統摘要評測改成「能不能支撐下游任務繼續完成」,並做出失真/遺漏/過早定論等六種錯誤分類 |
| 今日重要性 | 高 — 幾乎所有長任務 agent harness 都依賴上下文壓縮,這篇直接指出它的真實失敗率 |
| 實務連結 | 明確 — 錯誤分類（過早定論、遺失已解決的疑點等）可直接對照自己 harness 的壓縮 prompt 設計 |
| 編輯信心 | 高 — 結論只主張「壓縮仍然 lossy」與「失真比遺漏更危險」,數字與人工標註比例直接對應,沒有外推到壓縮方法的通用排名 |
| 閱讀建議 | 必讀 — 對設計或選用 agent harness 壓縮機制的人直接相關 |
| 主要限制 | CompanyBench 是內部評測集無法由外部核對；續跑結果同時混入了 executor 本身對模糊上下文的容錯能力,論文用環境狀態 ablation 部分拆解但沒有完全排除 |

### 領域背景

Claude Code、DeepSeek Harness 等現代 agent harness 在上下文逼近上限時,普遍採用「讓 LLM 自己寫摘要」來壓縮歷史,讓執行可以從摘要繼續。但這個機制有沒有真的保留住任務需要的關鍵資訊,一直沒有系統性驗證——既有的摘要評測看的是「像不像原文」,不是「還能不能完成任務」。

### 中階導讀

- **問題**:想像一個研究員查案查到一半,筆記本寫滿了,需要先把前面的線索濃縮成一頁摘要才能繼續往下查。如果摘要把「這條線索還沒確認」寫成「已經確認是這個人」,後面的調查就會一路往錯的方向走下去——問題不是摘要太短漏了字,是摘要把不確定的東西講得太篤定。
- **方法**:CompAct-Bench 從 BrowseComp(搜尋)、SWE-bench(寫程式)、CompanyBench(工作區)三種任務裡挑出成功完成的軌跡,在執行到 25%/50%/75% 的位置切一刀,讓 12 個模型壓縮切點前的所有紀錄,再讓原本的 executor 接著做完任務。另外找人工標註員,把壓縮後的內容逐項比對一份凍結的事實清單,標成保留、遺漏、扭曲、不確定四種狀態。
- **為什麼重要**:這篇把「摘要壓縮合不合格」從主觀判斷變成可以量化的任務完成率,而且找出扭曲比遺漏更危險的具體證據——這代表檢查壓縮品質不能只看「有沒有漏資訊」,更要看「有沒有把不確定的東西講成確定的」。

```diagram
title: 壓縮階段不同,失敗型態也不同
desc: 同樣是壓縮，搜尋任務壓越晚越差，寫程式任務壓越晚反而越好，原因是狀態存放的位置不同
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 70 V110" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 70 V110" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M160 166 V200" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M520 166 V200" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="40" y="20" width="600" height="46" rx="6"/>
  <text class="dg-label" x="340" y="43" text-anchor="middle" dominant-baseline="central">同一套壓縮,在 25% / 50% / 75% 執行進度分別插入壓縮點</text>

  <rect class="dg-box" x="30" y="110" width="260" height="56" rx="6"/>
  <text class="dg-label" x="160" y="129" text-anchor="middle" dominant-baseline="central">搜尋任務（BrowseComp）</text>
  <text class="dg-sub" x="160" y="149" text-anchor="middle" dominant-baseline="central">線索只存在對話歷史裡</text>

  <rect class="dg-box" x="390" y="110" width="260" height="56" rx="6"/>
  <text class="dg-label" x="520" y="129" text-anchor="middle" dominant-baseline="central">寫程式任務（SWE-bench）</text>
  <text class="dg-sub" x="520" y="149" text-anchor="middle" dominant-baseline="central">進度已寫進程式碼倉庫</text>

  <rect class="dg-box dg-box--warn" x="30" y="200" width="260" height="60" rx="6"/>
  <text class="dg-label" x="160" y="222" text-anchor="middle" dominant-baseline="central">壓越晚越差</text>
  <text class="dg-sub" x="160" y="244" text-anchor="middle" dominant-baseline="central">52.9% → 42.6% → 34.6%</text>

  <rect class="dg-box" x="390" y="200" width="260" height="60" rx="6"/>
  <text class="dg-label" x="520" y="222" text-anchor="middle" dominant-baseline="central">壓越晚反而越好</text>
  <text class="dg-sub" x="520" y="244" text-anchor="middle" dominant-baseline="central">64.0% → 72.7% → 86.1%</text>
</svg>
```

### 深入要點

- 12 個模型在 200 個壓縮任務上的整體平均 56.7%,範圍 46.0%–68.5%;Claude Opus 5 最高(68.5%),其次 Gemini 3.8 Flash(65.5%)、Kimi K3(62.0%)
- 搜尋任務的後期壓縮平均表現從 52.9% 掉到 34.6%,因為線索只存在對話歷史裡,壓縮是唯一的進度載體;寫程式任務反而從 64.0% 升到 86.1%,因為程式碼倉庫本身就保留了已完成的修改,壓縮漏了也能從環境補回來
- 人工標註顯示:69.1% 的資訊單元被正確保留,25.3% 遺漏,5.6% 扭曲——扭曲案例裡「把未解決的疑點寫成已解決」(premature commitment)是常見錯誤型態
- 有編輯動作的程式碼任務,續跑成功率平均 86.9%,沒有編輯動作的只有 53.0%(Mann–Whitney p=3×10⁻⁸),說明狀態是否已經「外部化」到環境裡,是壓縮能不能補救的關鍵
- Limitation:CompanyBench 是作者自建的內部工作區評測集,沒有公開給外部核對;續跑結果同時反映了 executor 對模糊上下文的容錯力,不是純粹的壓縮品質

### Reviewer 一句話評

用「下游任務能不能繼續完成」取代傳統摘要評測,是對 agent 上下文壓縮一個遲來但紮實的量化方法,人工錯誤分類也找出了比遺漏更隱蔽的扭曲問題;但三個任務領域裡只有兩個是公開基準,CompanyBench 的結果外部還無法覆核。

### 給你的 take-away

- 如果你在設計 agent harness 的壓縮 prompt:不要只檢查「有沒有漏掉重要資訊」,額外檢查壓縮後有沒有把仍在驗證中的假設寫成確定結論,這篇顯示這種扭曲比單純遺漏更容易把後續執行帶偏
- 如果你的任務狀態有辦法外部化(像程式碼倉庫、工單系統):優先把進度寫進環境而不是只留在對話歷史裡,這篇的資料顯示這樣能大幅降低壓縮造成的傷害

---

## 論文二｜MemFolder:用結構訊號做記憶折疊,砍半記憶還留住 99% 效能

**MemFolder: Structure-Guided Memory Folding for Efficient Agent Memory Management**
Xuyang Liu, Chenwen Lu, Junxi Wang et al.（Sichuan University + Fudan University + Zhejiang University + Shanghai Jiao Tong University 等多校合作）　·　arxiv: 2611.26427

連結: [arxiv](https://arxiv.org/abs/2611.26427) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26427)

### TL;DR

不靠 LLM 自由摘要,改用實體關聯與時間鏈等結構訊號決定哪些記憶記錄可以合併,在 Mem0 上砍半記錄數量仍保留 99.0% 的平均效能,比最強基線高 1.9 個百分點,檢索延遲最多降低 5.34 倍,程式碼已開源。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布約 4 天，preprint 尚無引用資料 |
| 機構 | Sichuan University + Fudan University + Sun Yat-sen University + Zhejiang University + Shanghai Jiao Tong University（多校合作） |
| 社群反應 | 程式碼公開於 GitHub（xuyang-liu16/MemFolder） / 同時提交於 cs.CL 與 cs.CV 雙重分類 / 未見於 HF Daily Papers |
| 可信度 | 通過 — 5 個基準、6 個既有壓縮基線的完整對照表,外加 anchor 選擇、affinity 訊號、planner/verifier 三組獨立消融 |
| 證據成熟度 | 較完整 — 多基準多基線三次重跑取平均,並額外量測檢索延遲而非只看準確率,但答案正確性由 LLM 當裁判,沒有報告與人工判斷的一致性 |
| 可復現性 | 完整產物 — 程式碼公開於 GitHub,使用的 5 個基準均為公開資料集,附錄列出完整超參數 |
| 為什麼選這篇 | 直接 — 直接回應「記憶壓縮能不能兩者兼顧」這個今天 CompAct-Bench 提出的問題 |
| 方向新意 | 實質增量 — 把記憶壓縮從「單靠語意相似度合併」改成「結合實體關聯與時間鏈的結構導向折疊」,同時處理記錄數與內容長度兩個軸 |
| 今日重要性 | 高 — 直接回應 CompAct-Bench 揭露的問題:證明用對的訊號設計,壓縮可以不用那麼 lossy |
| 實務連結 | 明確 — RecordFolder 與 ContextFolder 都是可以外接進現有 Mem0、MemOS 等記憶框架的外掛元件 |
| 編輯信心 | 中 — 效能數字具體且有消融支持,但裁判一致性未經報告,『幾乎不掉分』的敘述需要保留這個限制 |
| 閱讀建議 | 必讀 — 對正在選型或優化長期記憶框架的團隊直接相關 |
| 主要限制 | 答案正確性由 gpt-4o-mini/gpt-4o 當裁判判定,論文沒有報告這個裁判與人工標註的一致性,也沒有在真實生產 agent 上部署驗證 |

### 領域背景

長期 agent 的外部記憶庫會隨互動不斷累積,帶來兩個耦合的成本:記錄數變多讓檢索變慢,合併後的內容變長又讓模型要處理更多 token。既有做法大多只顧一個軸——剪枝會丟掉有用的證據,合併又容易把精簡的記錄變成更長的單位,MemFolder 想同時處理這兩個軸。

### 中階導讀

- **問題**:想像你的筆記軟體裡同一件事被記了六次,每次用詞都有點不一樣。如果直接刪掉五條只留一條,可能剛好刪掉的是帶著關鍵細節的那一條;如果把六條全部串在一起,筆記反而變得更長更難讀。MemFolder 要解決的就是:怎麼合併才能又少又精簡,還不丟掉重要的細節。
- **方法**:RecordFolder 先辨識記錄裡提到的實體(人名、地點等),用語意相似度加實體關聯加時間先後順序,挑出能代表一群記錄又彼此互補的「錨點」,再把相容的記錄併進同一組。ContextFolder 接著把每一組的原始記錄編碼成精簡文字,並用一個獨立的驗證迴圈檢查關鍵事實是否還能從編碼裡還原,還原不出來就要求重寫。
- **為什麼重要**:這篇證明「記憶壓縮必然漏資訊」不是物理定律,只是摘要方式選得不好——用對的結構訊號設計壓縮演算法,可以在砍半記錄數的情況下幾乎不掉分,同時大幅降低檢索延遲。

### 深入要點

- 在 Mem0 上砍半記錄數(50% reduction),RecordFolder 保留三個文字基準平均 99.0% 的效能,比最強基線 MemForest(97.1%)高 1.9 個百分點
- 結合 ContextFolder 後,在 LoCoMo、LongMemEval、M3-Bench-robot 上每筆記錄再省下 40%、38%、31% 的 token,準確率損失有限
- 檢索延遲:保留 30% 記錄時平均加速 1.88–5.34 倍,LongMemEval 的尾端延遲(95th percentile)從 97.5ms 降到 15.5ms
- 消融實驗顯示:拿掉語意相似度訊號影響最大(掉 3.4 分),其次是增益門檑(1.9 分)、實體關聯(1.1 分)、時間鏈(0.6 分)——語意相似度是主訊號,其他訊號負責微調
- Limitation:論文自承答案正確性由 LLM 當裁判,沒有報告裁判與人工標註的一致性;也沒有在真實生產環境的 agent 上做過部署驗證

### Reviewer 一句話評

兩個元件(RecordFolder/ContextFolder)的設計動機清楚、消融實驗紮實,延遲量測也不只停留在準確率這個單一指標,是今天記憶集群裡證據密度最高的一篇;但 LLM 當裁判的一致性沒有報告,『幾乎不掉分』的說法要留一個保留空間。

### 給你的 take-away

- 如果你在用 Mem0、MemOS 這類記憶框架且記憶庫越長越慢:RecordFolder 的錨點選擇加結構訊號設計可以直接參考,這篇顯示光靠語意相似度合併還不夠,加入實體與時間訊號能明顯提升保留效能
- 如果你在評估記憶壓縮方法:不要只看準確率保留了多少,也量一下檢索延遲——這篇顯示延遲的改善幅度(最多 5.34 倍)比準確率數字更直接影響使用體驗

---

## 論文三｜DriftGuard:記憶管得再好,也要有辦法抓出哪一條正在帶偏 Agent

**DriftGuard: Online Memory-Drift Detection via Causal Attribution for LLM Agents**
Licheng Pan, Yuzhou Chen, Zhixuan Chu et al.（Zhejiang University + Peking University + Alibaba Group）　·　arxiv: 2611.25583

連結: [arxiv](https://arxiv.org/abs/2611.25583) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25583)

### TL;DR

用配對反事實重播建立「拿掉這條記憶會不會改變行為」的因果標籤,再訓練一個線上風險模型即時估計每條記憶的風險,在最難的 MPBench 基準上 AUPRC 比最強的 LLM 評審基線(少樣本 Claude Opus 5)高出 86.2%,線上防禦也讓三種攻擊的成功率平均下降 80% 以上。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布約 4 天，preprint 尚無引用資料 |
| 機構 | Zhejiang University + Peking University + Alibaba Group |
| 社群反應 | 程式碼公開於匿名連結（投稿匿名版）/ 未見於 HF Daily Papers |
| 可信度 | 通過 — 三個記憶中毒基準上對比零樣本/少樣本 LLM 評審與三種現有防禦方法,外加執行情境與四個監督訊號的獨立消融、跨 3 模型家族的泛化實驗 |
| 證據成熟度 | 較完整 — 三基準、多組消融、跨模型泛化都有覆蓋,但訓練用的因果監督資料來自作者自建的配對重播,不是真實生產事件 |
| 可復現性 | 部分產物 — 程式碼公開於匿名連結,使用的三個基準為既有公開資料集 |
| 為什麼選這篇 | 直接 — 直接處理記憶管理裡「怎麼知道哪條記憶可疑」這個與今天另外兩篇不同但互補的問題 |
| 方向新意 | 實質增量 — 用配對反事實重播取代線上即時重播,把因果歸因的高成本移到離線,是這個問題上少見的系統設計思路 |
| 今日重要性 | 高 — 記憶集群裡唯一處理「信任」而非「容量/效率」的論文,補上一個今天另外兩篇都沒碰到的角度 |
| 實務連結 | 明確 — 線上風險模型可以直接接在現有記憶檢索流程後面,當一層額外的防護 |
| 編輯信心 | 高 — 作者自己列出兩項明確限制(不處理多記憶交互、未測未見攻擊類型),文章語氣據此收斂在『對已知攻擊類型有效』 |
| 閱讀建議 | 必讀 — 對部署有外部記憶的生產 agent 的團隊直接相關 |
| 主要限制 | 作者自承只處理單一記憶介入,不含多筆記憶交互作用,且防禦面不保證在分布遷移或未見過的攻擊類型下仍然安全 |

### 領域背景

Agent 的外部記憶一旦被植入誤導性內容(無論是攻擊者刻意為之,還是記憶自然累積產生的錯誤),可能讓整個執行路徑跑偏。既有防禦大多靠內容層級的特徵(困惑度、檢索相關性)或直接問 LLM「這條記憶可疑嗎」,但這兩種做法都沒辦法確認「拿掉這條記憶,行為真的會不會改變」這個因果問題,而要直接線上測試又太貴——每多檢查一條候選記憶就要多跑一次完整重播。

### 中階導讀

- **問題**:想像一個訂機票的 agent,一次檢索到五條記憶,其中一條看起來再正常不過,卻悄悄把付款網址換成了攻擊者控制的頁面。只看內容本身(像是這條記憶讀起來順不順、跟任務相不相關)分不出它比其他四條更危險,但如果直接把它拿掉重新跑一次,結果立刻不一樣——這就是因果訊號,而不是內容訊號。
- **方法**:DriftGuard 分兩階段。離線階段先對每個決策點,把其中一條記憶拿掉,用原始版本與拿掉後的版本各繼續跑一段,比較兩邊的行為差異,彙整成一個記憶飄移分數(涵蓋行為是否改變、攻擊是否被移除、違規是否消除、任務是否恢復正常四個面向)。這個分數接著用來訓練一個線上風險模型,上線後只要看一次目前的執行狀態就能估出每條記憶的風險,不需要再做任何即時重播。
- **為什麼重要**:這篇把「因果歸因」和「即時上線」這兩個互相衝突的需求用離線/上線分工解開——離線時可以慢慢做昂貴的配對重播,上線時只要一次前向傳遞就能抓出可疑記憶,讓因果層級的記憶防護變得可以實際部署。

### 深入要點

- 在最難的 MPBench 基準上,DriftGuard 的 AUPRC 達 0.2415,比最強零樣本/少樣本 LLM 評審基線(少樣本 Claude Opus 5 的 0.1297)高出 86.2%
- 線上防禦實驗中,對 Direct Override、MemoryGraft、Sleeper Memory 三種攻擊,DriftGuard 讓攻擊成功率(ASR)平均下降 80% 以上,同時任務成功率(TSR)同步提升
- 泛化實驗顯示:把線上風險模型換成 Qwen2.5、Llama3、Falcon3 三個模型家族、1B 到 8B 規模都有效,其中 Qwen2.5-1.5B 就已經超過 Claude Opus 5(少樣本)基線 12.2%
- Ablation 顯示:移除執行情境(execution context)讓 AgentPoison 上的 AUPRC 從 0.6139 掉到 0.4746;打亂執行情境順序掉到更低的 0.3851,代表模型用到的是情境的結構順序,不只是多出來的 token
- Limitation:作者自承兩個限制——只處理單一記憶介入,沒有涵蓋多筆記憶交互作用;且防禦面不保證在分布遷移或未見過的攻擊類型下仍然有效

### Reviewer 一句話評

用配對反事實重播把因果歸因的成本移到離線、再訓練輕量線上模型的設計思路紮實,三個基準加多組消融的驗證也完整;但作者自己也點出下一個要驗證的問題——這套方法在訓練時沒見過的攻擊手法上是否還站得住,目前還沒有答案。

### 給你的 take-away

- 如果你的 agent 有外部記憶且會被多個來源寫入:不要只用困惑度或檢索相關性當可疑記憶的判斷依據,這篇顯示因果層級的訊號(拿掉之後行為會不會變)比內容層級的特徵更能抓到真正的問題記憶
- 如果你在設計記憶防護的評測:優先驗證方法在訓練時沒見過的攻擊類型上還有沒有效,這篇作者自己點名這是目前最大的未知數

---

## 今日收穫

之前以為記憶壓縮必然要在「省空間」和「保留資訊」之間二選一;今天的對照讓我重新理解:問題不在要不要壓縮,而在用什麼訊號壓縮——同樣是把記憶變少變短,靠 LLM 自由摘要會系統性漏掉或扭曲關鍵狀態(CompAct-Bench),靠實體與時間結構訊號設計的折疊卻能幾乎不掉分(MemFolder)。而且就算記憶管理做得再好,還是需要一套獨立的機制去抓出哪一條記憶正在把 Agent 帶偏(DriftGuard)——管理記憶和信任記憶,是兩個要分開解決的問題。

## 參考資料

- [CompAct-Bench: A Benchmark for Working-Context Compaction in Long-Horizon Agent Tasks](https://arxiv.org/abs/2611.25673)
- [MemFolder: Structure-Guided Memory Folding for Efficient Agent Memory Management](https://arxiv.org/abs/2611.26427)
- [MemFolder 程式碼（GitHub）](https://github.com/xuyang-liu16/MemFolder)
- [DriftGuard: Online Memory-Drift Detection via Causal Attribution for LLM Agents](https://arxiv.org/abs/2611.25583)
- [arXiv cs.AI 當日公告清單](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL 當日公告清單](https://arxiv.org/list/cs.CL/new)
