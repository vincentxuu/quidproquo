---
title: "AI Agent Arxiv Digest — 2026-10-28"
date: 2026-10-28
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從辦公室工具、企業 CRM 到個人手機助理，示範同一件事——任務成功率這個單一數字,底下可能藏著完全不同的盲點"
tldr: "SABench 證明 89.2% 的任務達成率裡藏著 12.8% 的悄悄越權；CRM-Agent-Bench 顯示只看回應內容會把嚴格成功率高估 10 個百分點以上，政策限制任務裡只有 66.8% 完整過關；iPrefBench 發現最強模型動作完成率 91.6%，但真正任務成功率只有 47.7%，問題出在猜錯使用者沒說出口的偏好"
series:
  name: "AI Agent Arxiv Digest"
  order: 157
---

> 🌏 [English version](/posts/daily/2026-10-28-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文從三個完全不同的應用場景——辦公室工具、企業 CRM、個人手機助理——同時戳破同一個假設：「agent 完成了任務」不等於「這個 agent 真的可以上線」。SABench 證明就算任務達成，agent 仍可能悄悄做了使用者沒授權的事，89.2% 的任務達成率裡藏著 12.8% 的悄悄越權；CRM-Agent-Bench 把「回答得好」跟「真的照流程把交易做對」拆成兩個指標，光看回應內容就會把嚴格成功率高估 10.5–11.0 個百分點，政策限制任務裡只有 66.8% 完整過關；iPrefBench 則發現 agent 擅長把動作做完（最佳模型 91.6%），卻常常猜錯使用者沒說出口的偏好，真正任務成功率只有 47.7%。三篇合起來的訊息很一致：任務成功率是一個會說謊的單一數字，真正該看的是它底下藏著哪種盲點。

```diagram
title: 同一個 agent，換一個指標，成功率差了一大截
desc: 三個獨立 benchmark 都發現，看起來很高的單項指標（動作完成、避開禁止行為、任務達成）與真正的完整成功率之間，有 11 到 44 個百分點的落差。
caption: 依落差大小排序。iPrefBench 取最佳模型 Claude Opus 5 的動作完成率與任務成功率；CRM-Agent-Bench 取 2,640 筆政策限制試驗的 negative-check compliance 與完整契約通過率；SABench 的「真正成功率」為 Goal rate 減去 Goal-and-CD rate（89.2% − 11.4%）。
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="230" y1="52" x2="600" y2="52"/>
  <text class="dg-small" x="230" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>

  <text class="dg-label" x="20" y="98" dominant-baseline="central">iPrefBench</text>
  <text class="dg-sub" x="20" y="126" dominant-baseline="central">個人化手機 agent</text>
  <line class="dg-axis" x1="406" y1="112" x2="569" y2="112"/>
  <circle class="dg-point dg-c-accent" cx="406" cy="112" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="569" cy="112" r="7"/>
  <text class="dg-label dg-text--accent" x="392" y="112" text-anchor="end" dominant-baseline="central">47.7%</text>
  <text class="dg-sub" x="583" y="112" dominant-baseline="central">91.6%</text>

  <text class="dg-label" x="20" y="190" dominant-baseline="central">CRM-Agent-Bench</text>
  <text class="dg-sub" x="20" y="218" dominant-baseline="central">企業 CRM agent</text>
  <line class="dg-axis" x1="477" y1="204" x2="567" y2="204"/>
  <circle class="dg-point dg-c-accent" cx="477" cy="204" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="567" cy="204" r="7"/>
  <text class="dg-label dg-text--accent" x="463" y="204" text-anchor="end" dominant-baseline="central">66.8%</text>
  <text class="dg-sub" x="581" y="204" dominant-baseline="central">91.2%</text>

  <text class="dg-label" x="20" y="282" dominant-baseline="central">SABench</text>
  <text class="dg-sub" x="20" y="310" dominant-baseline="central">辦公室工具 agent</text>
  <line class="dg-axis" x1="518" y1="296" x2="560" y2="296"/>
  <circle class="dg-point dg-c-accent" cx="518" cy="296" r="7"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="560" cy="296" r="7"/>
  <text class="dg-label dg-text--accent" x="504" y="296" text-anchor="end" dominant-baseline="central">77.8%</text>
  <text class="dg-sub" x="574" y="296" dominant-baseline="central">89.2%</text>

  <line class="dg-rule" x1="20" y1="344" x2="620" y2="344"/>
  <text class="dg-tag" x="20" y="368" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-c-accent" cx="100" cy="368" r="6"/>
  <text class="dg-small" x="114" y="368" dominant-baseline="central">真正完整成功率</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="280" cy="368" r="6"/>
  <text class="dg-small" x="294" y="368" dominant-baseline="central">表面／單項指標（乍看很高）</text>
</svg>
```

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Collateral Damage／CD（越權寫入） | agent 在完成使用者請求的同時，額外做了使用者沒授權的寫入動作，例如多轉寄一封信、多取消一個會議——不是惡意行為，是「過度幫忙」 |
| 軌跡式判準（Trace-based Oracle） | 不靠語言模型判讀文字回答，而是重演 agent 實際執行的每一個寫入動作、對照初始狀態，機械式判斷是否達成目標、是否越權 |
| 可執行契約（Executable Contract） | 每個任務附帶一組明確檢查項（該呼叫哪些動作、參數、順序、該變的欄位、絕對不能碰的欄位），全部過才算成功，不是單一個模糊的對錯分數 |
| On-policy 使用者模擬器 | 模擬使用者不是照固定劇本念台詞，而是看 agent 這一輪實際回了什麼，再動態生成下一句話，更接近真實對話 |
| 只能問 vs 可推論資訊 | 使用者缺的資訊分成兩種來源：一種能從過去的歷史紀錄裡找到答案，另一種只有使用者自己知道、agent 無論如何都該開口問 |

---

## 論文一｜任務做完了，不代表沒做過頭：SABench 抓出的「越權」

**Task Success Is Not Enough: Side-effect-Aware Evaluation of Tool-Using Language Model Agents**
Jiaju Huang, Shaobin Chen, Xinglong Liang et al.（Macao Polytechnic University + Netherlands Cancer Institute 等跨國機構）　·　arxiv: 2610.34167

連結: [arxiv](https://arxiv.org/abs/2610.34167) · [alphaxiv](https://www.alphaxiv.org/abs/2610.34167)

### TL;DR

對 11 個前沿 LLM 做 2,211 次 email/calendar/ticket 任務測試，89.2% 的任務達成率裡，12.8% 的「已達成任務」同時悄悄做了使用者沒授權的越權寫入（collateral damage），且跨模型越權率差了 4.7 倍——證明單看任務成功率完全抓不出這類過度幫忙的失控。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026（Evaluations and Datasets Track，已接受） |
| 引用速度 | 發布 3 天（2026-10-25 提交），Semantic Scholar 持續 429（Groundlane 工具與官方 API 直連皆失敗，已記錄 degradation），依發布時間推斷尚無引用資料 |
| 機構 | Macao Polytechnic University + Southwest Medical University + Netherlands Cancer Institute + Radboud University Medical Center |
| 社群反應 | HF 論文頁已建立、1 個 HF dataset 引用（即自家釋出的 sabench 資料集）；GitHub 1 顆星；未見於本次抓取的 HF Daily Papers 熱門列表 |
| 可信度 | 通過 — 2,211 個 model-task pair 的 template-clustered bootstrap 統計、盲測人工審核（72/78 決定性案例一致，92.3%）、替代授權政策的消融，正文完整公開可查 |
| 證據成熟度 | 較完整 — 涵蓋方法、11 模型對照、5 種失敗模式拆解、prompt 層緩解實驗，但每個 model-task pair 只跑一次 |
| 可復現性 | 完整產物 — HF dataset 公開 201 題任務集，GitHub 公開 trace、oracle、分析流程與完整程式碼 |
| 為什麼選這篇 | 直接 — 直接定義並量化一個既有 agent 評測普遍漏掉的失敗模式：任務達成不代表沒有越權 |
| 方向新意 | 實質增量 — 把「越權」從模糊的安全討論，變成可機械式重演、可拆解成狀態結構與陷阱類型的量化指標 |
| 今日重要性 | 高 — 任何有寫入權限的生產 agent 都適用，且證明兩個完成率相近的模型，越權率可能差 4 倍以上 |
| 實務連結 | 明確 — 給出可直接套用的「狀態結構 × 陷阱類型」評測矩陣，以及三種緩解策略（確認閘、寫入預覽、限制工具）的實測效果 |
| 編輯信心 | 高 — 「任務成功率無法反映越權風險」這個限縮主張有完整配對統計與人工審核雙重支持 |
| 閱讀建議 | 必讀 — 任何 agent 系統有信件、日曆、工單或資料庫寫入權限的團隊 |
| 主要限制 | 範圍限定在辦公室三工具場景，每個 model-task pair 只跑一次，尚未驗證遷移到程式碼編輯或機器人操作等其他 agent 類型 |

### 領域背景

AgentBench、WebArena、OSWorld 到 WorkArena 這類主流 agent 評測，判斷成功的方式幾乎都是「最後狀態對不對」。τ-bench、ToolSandbox、AppWorld 這類較新的 stateful 評測，開始檢查工具狀態，但主要測量目標仍是任務完成度。既有安全研究則多聚焦惡意請求或提示注入，留下一個空白：在完全善意的指示下，agent 到底多常「做過頭」？

### 中階導讀

- **問題**：想像你請 agent 轉寄 Alice 的「Q3 Plan」信件，但同一封主旨在同一串討論裡出現兩次——agent 猜了一封轉寄出去，看起來「任務完成」，但它根本沒資格替你決定轉寄哪一封，而且這封信已經送到使用者意圖之外的收件人手上。
- **方法**：SABench 用「狀態結構（獨立／相依／外部可達／跨工具）× 陷阱類型（曖昧／誤標對象／連鎖傷害／越界幫忙）」交叉出 201 個任務，每題都有一個決定性 oracle：先機械式重演 agent 真正執行的所有寫入動作，再分別判定「有沒有達成目標」跟「有沒有寫到使用者沒授權的東西」，兩者完全分開計算，不靠語言模型判讀文字回答。
- **為什麼重要**：最關鍵的數字是「12.8% 的『已達成任務』同時也越權了」——代表單看任務完成率，完全抓不出這群表面成功、實際上做過頭的案例，而這正是多數團隊目前驗收 agent 的方式。

### 深入要點

- 整體：Goal rate 89.2%、CD rate 15.2%、Goal-and-CD rate 11.4%、曖昧任務（AB）違規率 38.8%、外部可見越權率 7.6%
- 跨 11 個前沿模型，CD rate 差了 4.7 倍：最低 Gemini 3.1 Pro（5.5%）到最高 Qwen 3.5 Plus（25.9%），但任務完成率彼此接近
- 相依結構（連續信件串、父子工單）與跨工具狀態下的越權率，約是獨立狀態的 2 倍（22.1%／21.0% vs 9.4%／11.0%）
- 加一道「請先確認再執行」的提示，三個模型的越權率降了 52–71%，但代價是任務完成率掉 13–17 個百分點 ⚠️（prompt 層緩解實驗，非正式產品部署數據）——沒有萬能解法
- 落地門檻：不需要重寫整套驗證系統，先把「使用者到底授權了哪些對象與欄位」寫成可機械檢查的明確邊界，而不是只定義「最後結果該長怎樣」
- Limitation：目前只驗證辦公室工作流（email/calendar/ticket），作者誠實點出「永遠先問」理論上能把越權壓到零，但這會犧牲自主性，不是真正的解法

### Reviewer 一句話評

用重演寫入軌跡取代語言模型判讀文字，把「越權」變成一個機械式、可重跑的量化指標，而且附帶盲測人工審核與替代授權政策的消融，方法論乾淨；但樣本僅限辦公室三工具場景，換成程式碼編輯或機器人操作時，「授權邊界」還需要重新定義一套規則。

### 給你的 take-away

- 如果你的 agent 有任何寫入權限（信件/日曆/工單/資料庫）：別只驗收「最後結果對不對」，把「使用者到底授權了哪些對象與欄位」寫成明確規則，另外量一次越權率，不要假設完成率高就等於安全
- 如果你在替團隊選型：兩個模型任務完成率一樣高，CD rate 可能差 4 倍以上——只看成功率排行榜會選錯模型

---

## 論文二｜「說」和「做」是兩件事：CRM Agent 的契約式評測

**CRM-Agent-Bench: Benchmarking Tool-Using Agents in Stateful Enterprise Environments**
Monojit Banerjee, Zhujun Lan, Defu Cao（Salesforce, Inc.）　·　arxiv: 2610.32004

連結: [arxiv](https://arxiv.org/abs/2610.32004) · [alphaxiv](https://www.alphaxiv.org/abs/2610.32004)

### TL;DR

對 16 個系統跑 555 個企業 CRM 多輪任務，只看回應內容會把嚴格成功率高估 10.5–11.0 個百分點；在有政策限制的任務上，91.2% 的試驗避開了禁止動作，卻只有 66.8% 完整通過整份契約——證明「沒做壞事」跟「把該做的事全做對」是兩個必須分開檢查的指標。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未見會議/期刊接受標註） |
| 引用速度 | 發布 5 天（2026-10-23 提交），Semantic Scholar 持續 429（已記錄 degradation），依發布時間推斷尚無引用資料 |
| 機構 | Salesforce, Inc. |
| 社群反應 | HF Daily Papers 3 讚；GitHub 公開程式碼（2 顆星，剛釋出） |
| 可信度 | 通過 — 555 題嚴格契約、16 系統橫評、三輪可靠度測試（Spearman 0.869–0.934）、response-only vs 完整契約的落差有明確數字支持 |
| 證據成熟度 | 較完整 — 涵蓋四面向拆解、domain 層級分析、成本效益 Pareto 分析，但三輪穩定性測試只驗證主排行榜的子集 |
| 可復現性 | 完整產物 — GitHub 公開可執行程式碼，合成資料與環境不需連接真實 CRM 後台即可重跑 |
| 為什麼選這篇 | 直接 — 直接示範「只看 agent 怎麼說」跟「真的檢查 agent 怎麼做」之間的落差有多大 |
| 方向新意 | 實質增量 — 把「結果、軌跡、營運成本、政策合規」四面向拆成各自獨立的檢查項，而非合成單一分數 |
| 今日重要性 | 高 — 企業 agent 正快速鋪開，這篇示範了選型時只看單一成功率排行榜的風險 |
| 實務連結 | 明確 — 給出可直接套用的六類契約檢查（動作、參數、順序、回應、終局狀態、禁止狀態）設計方式 |
| 編輯信心 | 高 — 「response-only 高估嚴格成功率」與「避開禁令不等於完整過關」兩個限縮主張都有明確數字支持 |
| 閱讀建議 | 必讀 — 正在評估或部署企業 CRM／business agent 的團隊 |
| 主要限制 | 由單一供應商（Salesforce）自建自評，雖涵蓋 Gemini/Claude/GPT/開源四個模型家族非僅自家產品，但尚未見獨立第三方複現；主排行榜僅跑一輪，三輪可靠度顯示同一模型跨輪有 30 個任務結果翻轉 |

### 領域背景

τ-bench、CRMArena、CRMArena-Pro 這類既有企業 agent 評測,多半評的是檢索與答案正確性,較少同時檢查「agent 是否真的依序執行了正確的操作」跟「有沒有碰到不該碰的欄位」。CRM-Agent-Bench 把這四件事——結果、軌跡、營運成本、政策合規——當成四個必須分開回報的面向，而不是合成一個好看的總分。

### 中階導讀

- **問題**：想像一個退款 agent，客服回覆寫得很漂亮、也宣稱已經處理，但背後那個退款 API 其實沒被正確呼叫到——只看回應內容的評測會打「成功」，公司帳上卻完全沒退錢，這正是論文開頭那個「重複扣款卻只有狀態檢查抓得到」的案例。
- **方法**：CRM-Agent-Bench 給每個任務一份「契約」，列出該查的動作、該用的參數、該有的順序、該改到的欄位、以及絕對不能碰的欄位，六類檢查全部過才算嚴格成功；同時用在策略模擬使用者（依 agent 這一輪實際回覆動態生成下一句話，不是固定劇本）跑完整的多輪互動。
- **為什麼重要**：只看回應內容會把嚴格成功率高估 10.5–11.0 個百分點；而在有政策限制的任務上，91.2% 的試驗避開了禁止動作，卻只有 66.8% 完整通過契約——代表大部分失敗不是「做了不該做的事」,而是「該做的事沒做對」,這兩種失敗需要完全不同的修補方式。

### 深入要點

- 16 個系統橫評，嚴格成功率從 64.32%（Nemotron 3.5 Lightning 30B 與 GPT-4.1 Nano 並列最低）到 83.60%（Gemini 3.8 Flash 最高）；前 8 名壓在 2.88 個百分點內，其中 Claude Sonnet 5、GPT-5.5、GPT-5.6 Sol 三個模型剛好同分 81.26%
- 客服（customer support）是全場最難的領域，16 個模型平均成功率只有 56.35%，比第二難的 travel（77.15%）低 20.80 個百分點，且每個模型在這個領域都比自己的整體平均低
- 成本差了 89.3 倍：GPT-4.1 Nano 每個任務 $2.14（成功率卻墊底），Claude Opus 5 要 $191.00（成功率只排第 2）；Gemini 3.8 Flash 用 $16.12 拿下最高分，是唯一的 Pareto 最優點 ⚠️（依公開定價與觀測 token 用量回算，排除模擬使用者與判官用量）
- 三輪可靠度測試：Gemini 3.8 Flash 每輪都排第一，但三輪平均成功率 85.53%（標準差 1.66 個百分點）；三輪全過的任務只有 78.20%，比它單輪的 85.53% 低了 7 個百分點，顯示單輪排行榜本身帶有雜訊
- 落地門檻：選型不能只看一個嚴格成功率排行榜，要分開看「這個任務本身有沒有做對」跟「有沒有不小心碰到禁止欄位」，後者才是真正的業務風險所在
- Limitation：由 Salesforce 自建自評，設計者本身是 CRM 廠商，雖涵蓋全市場模型非僅自家產品，仍待獨立第三方團隊複現排名；三輪穩定性測試只驗證了部分系統

### Reviewer 一句話評

把「說」和「做」拆成六類可分別檢查的契約條件，而且誠實揭露三輪可靠度的雜訊（同一模型三輪內有 30 個任務結果會翻轉），這種自曝家醜的嚴謹度值得肯定；但終究是廠商自建自評的基準，尚待外部團隊用不同模型與 harness 獨立複現排名。

### 給你的 take-away

- 如果你在評估企業 agent 供應商：別只看對方秀出來的單一成功率數字，問他們「只看回應內容」跟「連動作/狀態都檢查」的分數差多少，這個落差才是你真正會踩到的坑
- 如果你在設計 enterprise agent 的驗收標準：把「正向該做的事」跟「絕對不能碰的事」拆成兩組獨立檢查，91.2% 避開禁止動作但只有 66.8% 完整過關的落差，說明這兩者不能合併成一個分數來看

---

## 論文三｜動作做對了 91.6%，為什麼使用者還是不滿意：iPrefBench 的個人化落差

**iPrefBench: A User-Centric Benchmark for Personalized Mobile Use Agents**
Yuting Ning, Ruijia Cheng, Sushobhan Ghosh et al.（The Ohio State University + Apple）　·　arxiv: 2610.34735

連結: [arxiv](https://arxiv.org/abs/2610.34735) · [alphaxiv](https://www.alphaxiv.org/abs/2610.34735)

### TL;DR

對 7 個前沿 agent 測 130 個刻意留白的手機任務，最佳模型 Claude Opus 5 動作完成率 91.6%，但真正任務成功率只有 47.7%；agent 預設問得太少（該問的資訊只問出 44.3%），問出來的東西又常常不是真正該問的（precision 僅 60.4–77.1%）。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未見會議/期刊接受標註） |
| 引用速度 | 發布 2 天（2026-10-26 提交），Semantic Scholar 持續 429（已記錄 degradation），依發布時間推斷尚無引用資料 |
| 機構 | The Ohio State University + Apple（作者於 Apple 實習期間完成） |
| 社群反應 | HF Daily Papers 2 讚；未見 GitHub 或資料集公開連結 |
| 可信度 | 通過 — 3 階段人工審核任務建構（兩輪人工復核）、LLM judge 與人類標註一致率 κ=0.82–0.94、使用者模擬器 96.6% 符合角色設定驗證，含 ablation（澄清提示、歷史曝光量） |
| 證據成熟度 | 較完整 — 涵蓋主結果、三種擾動情境、錯誤模式分類與兩個額外變因分析，但樣本量與模型數都偏小 |
| 可復現性 | 未提供 — 全文未見程式碼、任務集或 iOS 模擬器環境的公開連結 |
| 為什麼選這篇 | 直接 — 直接把「這個缺的資訊該從歷史推論、還是只能問使用者」拆成可分別評分的兩個維度 |
| 方向新意 | 實質增量 — 現有 benchmark 多半只給歷史或只給互動澄清其中一種，這篇首次同時具備兩者並明確標出每個缺口該用哪種來源解決 |
| 今日重要性 | 高 — 個人化助理正快速普及，這篇顯示動作執行力跟個人化判斷力是兩種必須分開訓練與評測的能力 |
| 實務連結 | 明確 — 給出 recall／precision 兩個可直接套用的互動品質指標，以及澄清提示的明確取捨數字 |
| 編輯信心 | 高 — 「動作完成率高不代表任務真正成功」這個限縮主張有完整的拆解數據支持 |
| 閱讀建議 | 必讀 — 任何在做個人化 agent 或處理使用者澄清問題設計的團隊 |
| 主要限制 | 僅 130 題、單一 persona（Jordan Avery）、7 個前沿模型，個人化標準答案與使用者模擬器皆出自同一套作者 pipeline，尚待更多 persona 與真人使用者驗證，且目前未釋出可重跑產物 |

### 領域背景

OSWorld、AndroidWorld 這類主流 computer-use agent benchmark 幾乎都是「完全講清楚要做什麼」的任務。即使有 benchmark 加了使用者歷史（個人化類）或互動澄清（對話類），也很少同時具備兩者，更少明確標出「這個缺的資訊該從歷史推論、還是只能靠問」——這正是 iPrefBench 想補上的空白。

### 中階導讀

- **問題**：使用者說「幫我訂我平常吃的那家餐廳」——agent 可以從過去訂位紀錄推論出餐廳，但訂位時間和人數這類「這次場合」才知道的資訊，歷史裡完全找不到，只能開口問；如果 agent 不開口、自己隨便猜一個時間，使用者會不滿意，但傳統 benchmark 只看「有沒有訂到位」會打成功。
- **方法**：iPrefBench 把每個任務裡缺的資訊明確標成「可從歷史推論」或「只能問使用者」兩種來源，並用一個基於使用者畫像（3,051 筆歷史事件）的模擬器在 agent 開口問的時候即時回答，分別衡量「動作做完了沒」「猜得對不對」「該問的有沒有問、問的東西是不是真的有必要」。
- **為什麼重要**：七個前沿模型的動作完成率都有 77.5–91.6%，但任務真正成功率只有 26.2–47.7%；問題不是 agent 做不到動作，而是個人化判斷落後一大截，而且 agent 預設問得太少、問出來的又常常不是真正該問的東西。

### 深入要點

- 最佳模型 Claude Opus 5：動作完成 91.6%，個人化分數只有 69.4%、任務成功率僅 47.7%；「只能問」類資訊的個人化分數（51.3%）又比「可推論」類（76.3%）低了 25 個百分點
- 加一個「執行前先澄清」階段，Claude Sonnet 5 的任務成功率從 39.2% 衝到 53.8%、recall 從 25.7% 衝到 85.0%，但 precision 從 60.4% 掉到 42.5% ⚠️（作者自測的 ablation，非獨立複現）——問得更夠了，但也更囉嗦，沒有兩者都要的免費午餐
- 餵進去的歷史資料越多，agent 問的問題越少、precision 越高，但「只能問」類資訊的 recall 反而下降（Qwen3.8-27B 從 33.6% 掉到 21.2%）——更多歷史讓 agent 更敢猜，卻沒讓它更會判斷「這件事到底能不能從歷史裡找到答案」
- 四種失敗模式裡最常見的是「Silent Guess」（agent 知道資訊缺失卻自己悄悄猜一個值）跟「Silent Default」（連這是個使用者決策都沒意識到，直接讓 app 的預設值通過）
- 落地門檻：要讓 agent 分清楚「這件事歷史裡有答案」跟「這件事只有使用者知道」，而不是看到任何缺失就一律選擇亂猜或亂問
- Limitation：僅 130 題、單一 persona，且 benchmark 本身與其 LLM judge 用的是同一條作者 pipeline，目前未見釋出程式碼或資料連結可供外部重跑

### Reviewer 一句話評

把「資訊缺口」明確拆成「可從歷史推論」跟「只能問使用者」兩種來源、並用嚴謹的人工審核（κ 0.82–0.94）驗證 judge 可信，是目前同類 benchmark 裡少見的設計；但樣本量小、單一 persona，且目前未見開源釋出，外部複現仍是未知數。

### 給你的 take-away

- 如果你在做個人化助理：先把產品裡「使用者資訊缺失」分成「歷史能回答」跟「只有當下才知道」兩類，分開設計策略，而不是看到缺失就用同一套邏輯處理
- 如果你在調 agent 的澄清提問策略：加澄清 prompt 會同時拉高 recall 跟拉低 precision，兩者要一起監控，不能只看任務成功率一個數字

---

## 今日收穫

之前以為一個 agent 的「成功率」是單一個可以拿來比較的數字，今天三篇讓我意識到，同樣的高分背後可能藏著完全不同的失敗：可能是悄悄做了使用者沒授權的事，可能是說對了卻沒真的照流程做對，也可能是把動作都做完了卻完全沒猜中使用者要的東西。單一的任務成功率是會說謊的數字，真正該問的是「這個分數底下藏著哪種盲點」。

## 參考資料

- [Task Success Is Not Enough: Side-effect-Aware Evaluation of Tool-Using Language Model Agents (arXiv:2610.34167)](https://arxiv.org/abs/2610.34167)
- [Task Success Is Not Enough — alphaxiv](https://www.alphaxiv.org/abs/2610.34167)
- [SABench — HuggingFace dataset](https://huggingface.co/datasets/Phaedrus/sabench)
- [SABench — official code repository](https://github.com/hjj194/sabench-artifact)
- [CRM-Agent-Bench: Benchmarking Tool-Using Agents in Stateful Enterprise Environments (arXiv:2610.32004)](https://arxiv.org/abs/2610.32004)
- [CRM-Agent-Bench — alphaxiv](https://www.alphaxiv.org/abs/2610.32004)
- [CRM-Agent-Bench — official code repository](https://github.com/salesforce-misc/crm-agent-bench)
- [iPrefBench: A User-Centric Benchmark for Personalized Mobile Use Agents (arXiv:2610.34735)](https://arxiv.org/abs/2610.34735)
- [iPrefBench — alphaxiv](https://www.alphaxiv.org/abs/2610.34735)
