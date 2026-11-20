---
title: "AI Agent Arxiv Digest — 2026-11-21"
date: 2026-11-21
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇論文從三個角度回答同一個問題：Agent 自己維護技能文件或記憶時,不靠回饋會變差,靠對的回饋才會真的變好,而且要多少、怎麼用,要看模型本身的能力"
tldr: "一篇證明 Agent 沒有回饋地反覆重寫技能文件只會讓技能變差,30 輪後每個模型表現都掉;另一篇用細粒度的指令覆蓋率當回饋,讓自我演化反而贏過現有方法;第三篇是 IBM 在正式產品上的部署紀錄,發現記憶該留多少是模型能力決定的,不是記憶系統決定的"
series:
  name: "AI Agent Arxiv Digest"
  order: 181
---

## 今日總覽

今天三篇論文合起來講一件事:Agent 自己維護自己積累的知識——技能文件也好,長期記憶也好——這件事本身沒有想像中安全。第一篇用系統性實驗證明,沒有任何回饋的反覆重寫,會讓技能文件一輪一輪變差,30 輪後每個受測模型表現都掉到比原始技能還差;第二篇换一個條件做同一件事——給自我演化加上細粒度的指令層級回饋——結果自我演化不但沒有變差,反而贏過兩個已發表的強基準方法;第三篇是 IBM 在真實產品(CUGA agent、watsonx Orchestrate)上部署記憶系統的紀錄,誠實列出七件「做下去才發現」的事,其中最關鍵的一條是:記憶該留多少,取決於模型本身的能力,不是記憶系統設計得好不好。三篇證據成熟度都算扎實——有因果驗證、有跨基準比較、有真實部署,但也都各自清楚標出自己的邊界,沒有誰說「這樣做就萬無一失」。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 技能文件(Agent Skill) | 專家寫給 Agent 載入的程序知識文件,告訴它遇到特定任務該怎麼做、呼叫哪些工具 |
| 自我演化(Self-evolution) | Agent 自己修改自己要用的技能文件或記憶內容,不需要重新訓練模型 |
| 回饋(Feedback) | 這裡指執行完之後,有沒有一個客觀訊號(驗證器通過與否、人工標註)告訴 Agent 這次修改是好是壞 |
| 指令層級覆蓋率(Instruction-level coverage) | 把一次執行拆到技能文件裡的每一條指令,分別標記「有遵守」「沒遵守」「沒用到」,比只看任務整體成功失敗更細 |
| 支持度(Support) | 同一個結論被幾次獨立的執行軌跡重複推導出來,次數越多不代表越正確,只代表越常見 |
| 劑量反應(Dose-response) | 這裡指記憶量(guideline 數量)增加時任務表現怎麼變化;本文裡發現這條曲線的形狀因模型能力而不同 |

---

## 論文一｜沒有回饋的自我演化,是怎麼把技能文件改壞的

**How Feedback-Free Self-Evolution Reshapes Agent Skills: A Systematic Study**
Litao Guo, Man Chen, Xinli Xu et al.(香港科技大學(廣州) + 香港科技大學 + Knowin)　·　arxiv: 2611.25534

連結: [arxiv](https://arxiv.org/abs/2611.25534) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25534)

### TL;DR

讓六個模型對技能文件反覆重寫 30 輪,完全沒有任何任務、執行或評判回饋,結果每個模型在 SkillsBench 上的表現都比用原始技能差,平均掉 15 分;追查原因發現,重寫會優先丟掉「模型自己想不到、只有專家原本寫的」內容,補回這部分內容就能救回大部分損失。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 2 天,Semantic Scholar 回 404(尚未索引,同日 preprint 常見),引用數幾乎必為 0 |
| 機構 | 香港科技大學(廣州) + 香港科技大學 + Knowin |
| 社群反應 | 未見於 HF Daily Papers / Papers with Code(本輪 HF 完整排名因輸出截斷無法核對) |
| 可信度 | 通過 — 6 模型 × 3 基準 × 30 輪重寫,附因果式的「補回內容」實驗與跨模型交換測試 |
| 證據成熟度 | 較完整 — 首次系統研究這個失效模式,有因果驗證而非只有相關性,但仍是單篇研究,未經外部複現 |
| 可復現性 | 完整產物 — 公開 GitHub repo(含重寫流程與 SkillDiff 實作),三個基準皆為第三方公開基準 |
| 為什麼選這篇 | 直接 — Agent 自己改自己的技能文件已經是現行做法,這篇第一次系統驗證這麼做會不會出事 |
| 方向新意 | 實質增量 — 不只診斷問題,還找出因果機制並提出零成本的修法(SkillDiff) |
| 今日重要性 | 高 — 今天另外兩篇論文剛好從「加回饋」和「真實部署」兩個角度補完這個發現 |
| 實務連結 | 明確 — 任何讓 Agent 自動維護 SKILL.md 或 prompt 庫的團隊都該先看這篇 |
| 編輯信心 | 高 — 主張範圍限定在「沒有回饋的重寫」,每個數字都對應到明確的實驗設定 |
| 閱讀建議 | 必讀 — 正在用或打算用自我演化維護技能/prompt 庫的團隊 |
| 主要限制 | 三個基準(SkillsBench、LogicBench、MedCalc-Bench)都是研究用基準,配的是已存在的專家技能,真實世界裡更雜亂的技能庫是否一樣劣化尚未驗證 |

### 領域背景

技能文件(Agent Skill)讓 Agent 遇到特定任務時載入專家寫好的步驟與工具說明,SkillsBench 的數據顯示用對的技能能讓 18 種 Agent 配置平均提升 16.6 分。但技能會過期、會水土不服、會不適合新模型,維護它的方法越來越多是「讓模型自己改」。問題是:當沒有任務結果、沒有驗證器、沒有人評判的時候——也就是大量實務場景的現實——重寫到底是在修好技能,還是在悄悄毀掉它?這個問題過去沒有人系統測過。

### 中階導讀

- **問題**:想像你請一位新主廚接手一份傳承三代的食譜,但完全不讓他試做、不讓任何人嚐味道,只讓他「憑經驗」把食譜改寫得更順。三十次之後,這份食譜可能已經面目全非——他不是故意改壞,只是不斷把食譜往自己熟悉的方向拉,而食譜裡原本最珍貴、最反直覺的那些細節,恰好是他自己想不出來的,所以最先被改掉。
- **方法**:研究團隊讓六個模型在完全沒有任務、沒有執行、沒有評判的情況下,對同一份技能文件連續重寫 30 輪,再用重寫後的技能跑真正的 Agent 任務。同時,他們讓每個模型「憑一句話主題」自己寫十份技能(不給專家原文),當作這個模型的「先備知識基準」。比對發現:重寫會把技能文字拉向模型自己能寫出來的樣子,而專家原文裡「十份自寫技能都沒提到」的內容,在 30 輪後存活率只剩 23.1%,相對地「十份都提到」的內容存活率有 84.2%。
- **為什麼重要**:這代表一份專家技能的真正價值,很大一部分恰好是「模型自己想不到的那部分」——而這部分正是沒有回饋的自我演化第一個丟掉的東西。團隊提出的 SkillDiff 不需要任何回饋、不改技能文字,只是把這些模型想不到的內容標記起來提醒 Agent 照做,就能讓 SkillsBench 表現提升 4.8 分。

### 深入要點

- SkillsBench 上,30 輪重寫後每個 Agent 的表現都低於原始技能,差距在 10.3 到 23.0 分之間(六個模型平均)
- 第一輪重寫就已經讓平均表現掉 7.1 分,五輪後掉 10.9 分,30 輪後掉 14.6 分——劣化在前期最快
- LogicBench 準確率從原始技能的 86.2% 掉到 71.4%,等於跟沒有技能一樣;MedCalc-Bench 從 89.7% 掉到 78.7%,甚至低於沒有技能的 81.1%
- 因果驗證:把 30 輪後丟失的「模型想不到的內容」補回去,回復的表現幅度大約是補回「其他丟失內容」的兩倍
- SkillDiff 不需要重寫技能、不需要任何回饋訊號,只是標記+提醒,就讓 SkillsBench 表現提升 4.8 分
- 落地門檻:要先建立「模型的先備知識基準」(讓模型憑主題自寫技能),這一步需要額外的模型呼叫,但遠比持續監督重寫結果便宜
- Limitation:三個基準都配的是研究場景下已經存在的專家技能,真實世界裡沒那麼乾淨的技能庫是否呈現同樣的劣化模式,論文沒有測試

### Reviewer 一句話評

因果鏈條(重寫拉向先備知識 → 先丟失先備知識外的內容 → 補回能救回表現)證明得很扎實,且 SkillDiff 作為免費的修法很有說服力;但下一步該問的是,這個「模型先備知識」的量測方式(TF-IDF 字面距離)在技能內容更口語、更少固定術語時是否一樣可靠。

### 給你的 take-away

- 如果你在做讓 Agent 自動維護 SKILL.md 或 prompt 庫的系統:先檢查你的重寫迴圈有沒有任何回饋訊號——如果完全沒有,这篇的結果值得當成警訊,優先考慮加入哪怕是最小限度的驗證,或直接套用 SkillDiff 式的「標記先備知識外內容」做法,而不是讓模型自由重寫
- 如果你在評估要不要导入自我演化技能系统:把「模型先備知識基準」(讓模型憑主題自寫一版)當成上線前的健檢工具,比對正式技能和自寫版本的差距,差距大的段落就是風險最高的地方

---

## 論文二｜給自我演化加上對的回饋,它反而贏過現有方法

**Evolve Where It Matters: Coverage-Guided Self-Evolution of Agent Skills**
Boyin Tan, Jiadong Zhang, Xiaosong Ma et al.(穆罕默德·本·扎耶德人工智慧大學 MBZUAI + 利物浦大學)　·　arxiv: 2611.25429

連結: [arxiv](https://arxiv.org/abs/2611.25429) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25429)

### TL;DR

把一次執行拆到技能文件裡的每一條指令,標記「有遵守／沒遵守／沒用到」,用這個細粒度訊號驅動自我演化,SkillPlumber 在三個基準、三種執行框架上都解出最多任務(64.7% 到 70.5%),比最強的已發表基準方法高 8.7 到 14.0 分;拿掉這個覆蓋率訊號,SkillsBench 上救回的失敗任務數直接少 20.8%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(cs.CL/cs.AI 交叉列表,未經同行審查) |
| 引用速度 | 發布 2 天,Semantic Scholar 429 rate limit 無法查得;preprint 剛發布,引用數幾乎必為 0 |
| 機構 | 穆罕默德·本·扎耶德人工智慧大學(MBZUAI) + 利物浦大學 |
| 社群反應 | 未見於 HF Daily Papers / Papers with Code(web_search 確認,僅見 arXiv 清單頁與自動摘要站轉載) |
| 可信度 | 通過 — 3 基準 × 3 執行框架,兩個已發表基準方法在同一協議下重跑比較,並有消融實驗拆解機制貢獻 |
| 證據成熟度 | 較完整 — 消融實驗把覆蓋率訊號的貢獻和一般軌跡分析的貢獻分開驗證,token 成本也誠實揭露 |
| 可復現性 | 部分產物 — 三個基準皆為第三方公開基準、附完整協議,但本輪搜尋未找到 SkillPlumber 本身的公開程式碼 |
| 為什麼選這篇 | 直接 — 正好回答論文一留下的問題:加上對的回饋,自我演化會不會真的變好 |
| 方向新意 | 實質增量 — 把「覆蓋率」這個程式除錯概念搬進技能自我演化,並拆出根因分析與跨任務策略庫兩層機制 |
| 今日重要性 | 高 — 和論文一、論文三一起構成「自我維護知識何時有效、何時失效」的完整圖像 |
| 實務連結 | 明確 — 三種主流執行框架(Codex、Claude Code、OpenHands)都測過,遷移門檻低 |
| 編輯信心 | 高 — 每個數字對應明確的基準/執行器/基準方法組合,論文自己也坦承在某些場景不領先 |
| 閱讀建議 | 必讀 — 想讓自我演化技能系統真正可靠的團隊 |
| 主要限制 | 根因分析與覆蓋率標記都依賴 LLM 判官,論文在 Limitations 段自己點出這點,並引用另一篇論文驗證過標記任務的人機一致性,但本篇沒有重新驗證 |

### 領域背景

技能自我演化的既有做法大多只看「這次任務整體成功還是失敗」,沒辦法分辨一次失敗是因為技能裡某條指令寫錯,還是指令寫對了但 Agent 沒遵守——這兩種情況需要完全不同的修法。這篇借用程式除錯裡「程式碼覆蓋率」的概念:知道一次失敗的執行走過哪些程式碼,才能縮小找 bug 的範圍。

### 中階導讀

- **問題**:想像一份退款流程的技能文件寫著「用美金計價」,但 Agent 因為另一個原因卡住,根本沒走到那一步。如果只看「這次任務失敗了」,你可能會錯怪那條美金指令、把它改掉,但真正的問題在別處。
- **方法**:SkillPlumber 先把每次執行拆成逐條指令的「遵守／沒遵守／沒用到」三態標記,再用一個持續運作的根因分析 agent,把每個標籤轉成一個具體的修訂問題,並在下一輪執行後檢查這次修訂有沒有真的解決問題;同時有一個「維護者」角色,把不同任務裡找到的教訓,蒸餾進一個跨任務共用的策略庫。
- **為什麼重要**:這證明了論文一的發現不是「自我演化註定失敗」,而是「沒有回饋的自我演化才會失敗」——只要回饋訊號夠細(到指令層級),自我演化不只不會變差,反而能超過人類精心設計的既有方法。

```diagram
title: SkillPlumber 的覆蓋率導向自我演化迴圈
desc: 每一輪執行任務後,先用三態標記找出哪條指令出問題,再把修訂寫回技能文件並跨任務累積進共用策略庫。
caption: 簡化示意:依 arXiv:2611.25429 Sec 3-4 描述的流程改繪。
step: 用目前技能執行任務,驗證器判定過或不過
step: 把每條指令標成 follow／not-follow／not-covered,定位問題所在
step: 根因分析把標籤轉成修訂問題,寫回技能文件
step: 新技能下一輪重新執行,同時把發現寫入共用策略庫
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">執行任務</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">驗證器判定</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">覆蓋率標記</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">分三態找根因</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">技能修訂</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">改寫技能文件</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">下一輪驗證</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">新技能重跑</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">策略庫</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">跨任務彙整</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">讀取</text>
</svg>
```

### 深入要點

- 三個基準(SkillsBench 87 題、SkillLearnBench 50 任務家族、SWE-Skills-Bench-Hard 70 題)× 三種執行框架(GPT-5.5/Codex、Opus 4.8/Claude Code、DeepSeek-V4-Pro/OpenHands)全部領先
- 以 GPT-5.5 為例,SkillPlumber 救回 SkillRevise 自己能救回的 34 個失敗裡的 30 個,救回 CoEvoSkills 的 33 個裡的 25 個——不是用別的方式換到同一批任務,而是真的覆蓋更廣
- 去掉覆蓋率訊號(但保留一樣的根因分析 agent、一樣的軌跡、一樣的輪數預算),SkillsBench 上救回的失敗任務從 24 個掉到 19 個
- 每次失敗平均只需要 3.4 次修訂就能解決,比 SkillRevise 的 4.1 次和 CoEvoSkills 的 11.6 次都少——因為它的根因分析 agent 會在判斷沒有值得修的地方時自己停下來
- Token 成本:用了基準方法大約兩倍的 token,但多花的部分主要用在產生覆蓋率記錄本身,不是用在更長的分析
- 落地門檻:三種主流執行框架都驗證過,遷移到 LangGraph、CrewAI 等其他框架的主要工作是把「指令層級覆蓋率」這個標記步驟接上既有的執行軌跡
- Limitation:根因分析與覆蓋率標記都靠 LLM 判官,論文自己在 Limitations 段落承認這一點,並說明若判官更強,訊號會更準但框架本身不用改

### Reviewer 一句話評

三基準三框架的消融設計做得很扎實,救回任務數量的重疊分析也排除了「只是換一批任務解決」的疑慮;但整套方法對 LLM 判官的依賴程度不低,下一個該驗證的問題是判官系統性誤判某一類指令時,根因分析的歸因會不會跟著系統性偏掉。

### 給你的 take-away

- 如果你在設計技能/prompt 自我修訂系統:把「只看任務整體成功失敗」換成「逐條指令標記遵守狀態」,這篇的消融實驗已經證明這個細粒度訊號本身就是效能的主要來源,不是錦上添花
- 如果你已經有一套根因分析式的修訂 agent:評估要不要加一個跨任務的「策略庫」角色,把不同任務學到的教訓蒸餾成共用知識,而不是每個任務各自重新發現同一個問題

---

## 論文三｜IBM 在真實產品上部署記憶系統,學到的最貴一課

**How Much Should an Agent Remember? Deployment Lessons from Self-Distilled Memory for LLM Agents**
K. R. Jayaram, Vatche Isahagian, Aswath Vaithinathan Aravindan et al.(IBM Research)　·　arxiv: 2611.26361

連結: [arxiv](https://arxiv.org/abs/2611.26361) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26361)

### TL;DR

IBM 把一套從 Agent 自己執行紀錄中提煉記憶的系統(altk-evolve)部署進 CUGA agent 和 watsonx Orchestrate 正式產品,測了 8 個模型後發現:記憶該留多少是模型能力決定的——強模型(DeepSeek-V3.2)拿到全部 191 條記憶最多提升 9.5 分,但弱模型(gpt-oss-120b)拿全部 199 條反而不如只拿精選 29 條(55.4% vs 51.2%)。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | Accepted to IAAI 2027(Oral)— 同行審查、應用track 接受並口頭報告 |
| 引用速度 | 發布 2 天,Semantic Scholar 429 rate limit 無法查得;已接受但剛掛上 arXiv,引用數幾乎必為 0 |
| 機構 | IBM Research |
| 社群反應 | 本輪未見於 HF Daily Papers / Papers with Code 清單,但同一個 altk-evolve 專案在 2026 年 4 月已有 IBM Research 官方 HuggingFace 部落格介紹,確認是既有、非臨時掛名的正式系統 |
| 可信度 | 通過 — 8 模型基準測試附噪音基準線量化、自抓並修正過一次會造成誤導結論的基準混淆、兩個正式產品的真實部署數據 |
| 證據成熟度 | 較完整 — 同時有控制變因的基準測試與生產環境證據,論文自己清楚標明哪些是「描述性」而非「受控估計」 |
| 可復現性 | 完整產物 — altk-evolve 是公開開源函式庫,AppWorld、tau-bench 皆為公開基準附確定性驗證器 |
| 為什麼選這篇 | 直接 — 把論文一、二在實驗室裡發現的「回饋與劑量很重要」這個道理,搬到真實生產部署裡驗證一次 |
| 方向新意 | 實質增量 — 方法本身承接既有記憶蒸餾文獻,但「部署後才發現的七個教訓」是罕見的誠實揭露 |
| 今日重要性 | 高 — 三篇中唯一有真實正式產品部署證據,也是唯一有同行審查 venue 的 |
| 實務連結 | 明確 — 七條建議(劑量要當第一類參數、不要壓縮、每個欄位都要保留血緣等)可直接套進任何記憶系統的工程清單 |
| 編輯信心 | 高 — 論文反覆把自己原本以為的「勝利」降級成更保守的結論(例如把一次贏過基準的結果重新定性為「打平但省七倍 token」) |
| 閱讀建議 | 必讀 — 任何打算把 agent 記憶系統推上生產環境的團隊 |
| 主要限制 | 記憶是否被保留,靠的是「有幾條獨立軌跡推導出同一個結論」(支持度),不是靠「這個結論對不對」;論文自己抓到一條高支持度卻錨錯 API 分頁邏輯的記憶造成真實任務退步,並坦言目前沒有正確性或時效性訊號 |

### 領域背景

讓 Agent 從自己的執行歷史裡學習教訓(ExpeL、Agentic Context Engineering、Reflexion 等)已經是研究裡常見的做法,但這些方法大多只在研究基準上驗證過。這篇要回答的是一個更樸素但更少人認真回答的問題:當這套系統真正上線,每天被不同模型、不同任務使用的時候,會出什麼問題?

### 中階導讀

- **問題**:想像你請一位新人記住公司規定,他讀了一百份舊案例後,自己整理出一條「永遠先問客戶要發票」的規則——這條規則被十個不同案例獨立驗證過,聽起來很可靠。但如果這十個案例剛好都是同一類客戶,這條規則換了情境可能整個是錯的,而且沒有人會發現,因為它看起來「被驗證過很多次」。
- **方法**:altk-evolve 的流程是三段式:先從每次執行軌跡裡提煉出一到三條簡短教訓,再把相近的教訓合併成「準則」(每條準則記錄自己合併了幾條教訓),最後在推論時決定給 Agent 全部準則還是篩選過的子集。團隊在 AppWorld 基準上測了 8 個模型,發現一個分界清楚的模式:能力強的模型(DeepSeek-V3.2)準則越給越多,表現持續上升;能力弱的模型(gpt-oss-120b)在某個數量之後反而被過多準則拖累,精選的小子集表現更好。
- **為什麼重要**:這代表「記憶系統設計得好」和「這套記憶系統對你的模型管用」是兩件不同的事,而後者取決於你用的是哪個模型,不是哪套記憶框架。團隊也誠實列出部署中踩到的七個坑,其中最嚴重的一個是三項操作性失誤(一個被吞掉沒報錯的 API 400、一個被截斷的 JSON、一條從未被呼叫到的寫入路徑)花掉的時間比所有研究問題加起來還多。

### 深入要點

- DeepSeek-V3.2 從 0 條準則到全部 191 條,任務完成率從 79.8% 一路爬到 89.3%(+9.5 分),場景完成率從 64.3% 到 80.4%
- gpt-oss-120b 全部 199 條準則只拿到 51.2%,反而比精選 24 條核心準則的 53.6% 還低;最好的結果來自精選約 29 條,拿到 55.4%(兩次跑的平均),token 成本幾乎跟不給記憶一樣
- 第一版把教訓壓縮成精簡清單(只留 12 條),DeepSeek 只提升 2.9 分;改成不壓縮、留住全部 144 條只出現過一次的「個案教訓」,提升幅度直接變成 9.5 分——價值大半藏在這些看起來不重要的個案裡
- 噪音基準線:同一套設定跑兩次,gpt-oss-120b 拿到 56.0% 和 54.8%,DeepSeek 跑兩次有約 32/168 個任務结果會翻轉,團隊因此把低於 5 個任務的差距一律當成噪音,而不是拿來宣稱勝利
- 跟既有方法(ACE)比較時,一開始的「大勝」有一部分來自兩邊的執行框架本身基準不同(prompt 模板不同),修正後兩邊記憶貢獻其實相當,但 altk-evolve 只用了 ACE 四到七分之一的 token
- Limitation:支持度(多少條軌跡獨立推導出同一條準則)衡量的是「這條規則多常見」,不是「這條規則對不對」——論文自己抓到一條因此造成真實任務退步的錯誤準則,並坦言這是目前系統最大的缺口

### Reviewer 一句話評

噪音基準線量化、基準混淆的自我糾正、生產環境的真實佈署數據,三件事加起來讓這篇的可信度遠高於一般記憶系統論文;但系統本身完全沒有正確性或時效性校驗這一點,意味着在無人值守的狀態下長期運行仍有風險,這也是論文自己認定的下一步重點。

### 給你的 take-away

- 如果你在設計 Agent 記憶/經驗蒸餾系統:不要預設「壓縮成精簡清單」比較好,先驗證完整保留低支持度教訓和壓縮版本的實際任務表現差距,這篇的對照實驗顯示差距可能是質的不同,不是量的優化
- 如果你準備把記憶系統推上生產環境:在正式上線前先建立噪音基準線(同設定跑至少兩次),把小於噪音範圍的「進步」排除在決策依據之外,並盡早加一條支持度以外的正確性或時效性校驗訊號

---

## 今日收穫

之前以為「讓 Agent 自己維護知識」這件事,成敗取決於演化演算法設計得好不好;今天才發現,真正的分水嶺是有沒有回饋——沒有回饋,再聰明的演化機制也只是在把知識拉向模型自己的慣性;有了細粒度回饋,自我演化才真正开始累積價值。而 IBM 那篇再補上一刀:就算回饋和劑量都對了,「這條知識多常被推導出來」依然不等於「這條知識是對的」,這可能是下一輪該追的問題。

## 參考資料

- [How Feedback-Free Self-Evolution Reshapes Agent Skills: A Systematic Study](https://arxiv.org/abs/2611.25534)
- [SkillDiff 專案程式碼](https://github.com/LitaoGuo/How-Self-Evolution-Reshapes-Skills)
- [Evolve Where It Matters: Coverage-Guided Self-Evolution of Agent Skills](https://arxiv.org/abs/2611.25429)
- [How Much Should an Agent Remember? Deployment Lessons from Self-Distilled Memory for LLM Agents](https://arxiv.org/abs/2611.26361)
- [altk-evolve 開源函式庫](https://github.com/AgentToolkit/altk-evolve)
- [IBM Research:ALTK-Evolve 介紹(Hugging Face Blog)](https://huggingface.co/blog/ibm-research/altk-evolve)
- [arXiv cs.AI 當日公告清單](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL 當日公告清單](https://arxiv.org/list/cs.CL/new)
