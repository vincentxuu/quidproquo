---
title: "AI Agent Arxiv Digest — 2026-08-27"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇論文戳破 agent 工具呼叫的三層盲點——寫工具和用工具的模型互相脫節、平行呼叫工具時對資源視而不見、多輪對話裡早期資訊在生成下一步動作時被悄悄蓋掉"
tldr: "SMITH 讓同一個 4B 模型自己寫工具自己用,13 項程序推理任務拿下 79.8% 最佳成績,還能零樣本遷移到視覺問答;PeakBench 揭露邏輯規劃強的 agent 平行呼叫工具時常常對資源上限視而不見,造成可避免的過載;OODA-Tool 把「記狀態」與「做動作」拆成四階段,在 Qwen3 全系列讓任務成功率最多提升近 7 分,模型越小改善越大"
series:
  name: "AI Agent Arxiv Digest"
  order: 95
---

> 🌏 [English version](/en/posts/daily/2026-08-27-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文都聚焦在同一件事:能把任務做完,不代表「工具呼叫」這個環節真的可靠。SMITH 說問題出在訓練方式——寫工具的模型和用工具的模型長期是脫節的兩個角色,寫的人從來不用自己測試好不好用;PeakBench 說問題出在執行期——agent 就算正確判斷出哪些工具呼叫可以平行執行,實際排程時卻常常對底層資源上限視而不見;OODA-Tool 說問題出在架構本身——多輪工具呼叫時,「記住之前發生的事」和「決定下一步動作」被硬塞進同一次生成,兩者會互相搶資源。三篇合起來是一堂提醒:工具呼叫這件事,品質、安全、一致性是三個要分開檢查的問題,任何一層沒顧到,「任務完成」這個分數都可能是假象。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Schema(工具規格) | 描述一個工具的名稱、參數、型別的結構化說明,模型看了這份說明就知道怎麼呼叫這個工具 |
| GRPO / DAPO | 一種用同一批候選答案互相比較來更新模型的強化學習訓練法,DAPO 是穩定訓練用的調整變體 |
| 平行工具呼叫(Parallel Tool Invocation) | Agent 同時對外送出多個工具呼叫而不是一個一個排隊執行,能降低延遲但也可能同時搶佔資源 |
| 資源尖峰負載(Peak Load / Resource Burst) | 多個工具同時搶佔有限硬體或 API 額度,導致系統壅塞甚至服務中斷 |
| 狀態-行動競爭(State-Action Competition) | 在同一次生成裡,「記住之前累積的資訊」跟「生出下一步動作」互相干擾,導致早期資訊被覆蓋或忽略 |
| OODA 循環 | 觀察(Observe)-定向(Orient)-決策(Decide)-行動(Act),源自軍事決策理論,強調決策是不斷回饋更新的閉環而非對最新資訊的直接反應 |

---

## 論文一｜把寫工具和用工具練成同一個模型:SMITH 的雙向優化

**Joint Optimization of Tool Creation and Use for Large Language Model Agents**
Zhi Rui Tam, Chieh-Yen Lin, Yun-Nung Chen et al.（Appier AI Research / 國立台灣大學）　·　arxiv: 2608.24571

連結: [arxiv](https://arxiv.org/abs/2608.24571) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24571)

### TL;DR

用強化學習把「寫工具」和「用工具」練進同一個 policy,4B Qwen3 在 13 項程序推理任務拿下 79.8% 的整體最佳成績,超越沒訓練過的 30B 工具寫手,還能零樣本遷移到表格與視覺問答任務。

### Read Priority

必讀 — 直接點出現有 tool-creation agent 的結構性缺陷(寫工具跟用工具脫節),而且提供可訓練的解法,不是只靠 prompt 工程。

### 領域背景

過去讓 agent 自己造工具的做法(如 LATM)都是 prompt 一個凍結的 LLM 現場生成工具,沒有針對工具品質做訓練優化;更關鍵的是,寫工具的模型和用工具的模型往往是分開的兩個角色(強模型寫、弱模型用),寫工具的一方從來沒有被要求「你自己要能用這個工具」,自然沒有動力把 schema 寫清楚。

### 中階導讀

- **問題**:想像請一位很厲害的工程師寫一支 API 文件給新人用,工程師寫完就交差,從來不用自己測試這支 API 好不好用——結果新人一用就發現參數說明含糊、行為跟預期不同。
- **方法**:SMITH(Schema-grounded Multi-task Iterative Tool Honing)讓同一個模型既要做「build task」(從幾個範例寫出一個工具,含 Python 程式碼與 JSON schema)也要做「use task」(只看 schema、不看程式碼,呼叫這個工具回答問題)。三條獨立的 reward——執行是否正確、LLM 裁判品質評分、格式是否一致——分別修正 schema 錯誤和程式碼錯誤兩種不同失敗模式;裁判模型會定期從訓練中的 policy 同步權重(而非共用即時權重),避免「自己評自己」的循環評估問題。
- **為什麼重要**:因為寫工具的模型自己要用,schema 含糊就會在 use task 直接被扣分,這個回饋迴圈是純 prompt-based 方法做不到的。

### 深入要點

- 4B Qwen3 用 SMITH 訓練後,在 13 項 Reasoning-Gym 程序推理任務的 held-out 測試拿下 79.8% 巨集平均準確率,是所有評測方法中最高分,超越沒訓練過的 30B-A3B 工具寫手 ⚠️(作者自測,待外部複現)
- 零樣本遷移到 TabMWP-Hard 拿下 40.4 分、GQA 視覺問答拿下 42.6 分(比同骨幹最佳 inference-time 基準線高 +7.6 分),訓練過程完全沒看過表格或視覺資料
- 4B policy 寫出來的工具,能讓一個凍結的 350M 小模型(LFM-2.5-350M)追上 30B 工具寫手的水準
- 訓練演算法用 DAPO(GRPO 的 clip-higher 變體),用來穩定熵值、避免 reward collapse
- 落地門檻:需要能明確驗證對錯的任務(exact verifiers)才能設計三條 reward,對開放式、沒有標準答案的任務較難直接套用
- Limitation:目前只驗證在程序推理與少量遷移任務,尚未涵蓋更複雜的多步驟 agentic workflow

### Reviewer 一句話評

用「同一個模型自己寫工具自己用」這個約束逼出品質回饋,是聰明的訓練訊號設計,79.8% 的成績也很扎實;但依賴 exact verifiers 意味著目前的驗證範圍還侷限在有明確對錯的任務。

### 給你的 take-away

- 如果你在做讓 agent 自主產生工具/外掛的系統:SMITH「寫的人也要自己用」的設計,是目前最直接可行的品質回饋機制,比純 prompt 生成再靠人工篩選更省成本
- 如果你在訓練小模型做 agentic 任務:「工具由強模型生成、小模型直接套用」這條路徑值得參考,不必每個任務都硬 train 一個大模型

---

## 論文二｜會規劃不代表會執行:PeakBench 揭露 agent 平行呼叫工具的資源盲點

**PeakBench: Benchmarking Resource-Aware Tool Invocation in LLM Agents**
Zhi-Kai Chen, Xu-Xiang Zhong, Song-Yan Li et al.（南京大學 Nanjing University）　·　arxiv: 2608.24509

連結: [arxiv](https://arxiv.org/abs/2608.24509) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24509)

### TL;DR

現有 agent 評測只看任務做完沒有,PeakBench 把「邏輯規劃」和「物理排程」拆開評測,發現能正確判斷哪些工具呼叫可以平行執行的 agent,實際執行時卻常常對資源上限視而不見,造成可避免的資源過載。

### Read Priority

必讀 — 只要你的 agent 系統真的會平行呼叫多個工具(不管是 MCP 工具、內部 API 或第三方服務),這篇點出一個現有 benchmark 完全沒在測的系統性風險。

### 領域背景

現有工具呼叫 benchmark(如 ToolBench、APIBank)大多測「有沒有選對工具、參數對不對、任務完不完成」,評測環境幾乎都是序列執行。但真實部署時 agent 為了低延遲會平行發送多個工具呼叫,這些呼叫可能同時搶佔有限的硬體或 API 額度,造成資源爆量——現有評測完全沒有這個維度。

### 中階導讀

- **問題**:想像一個 agent 同時要呼叫三個很吃資源的工具(比如三個大圖片處理 API),它正確判斷出這三個呼叫彼此獨立、可以平行跑——但它不知道底層伺服器只撐得住兩個同時跑,結果全部同時發送,直接把系統打爆。
- **方法**:PeakBench 把評測拆成兩個維度:Dimension I 測邏輯規劃(agent 能不能正確判斷哪些步驟有先後依賴、哪些可以平行),Dimension II 在給定正確依賴結構的前提下,測 agent 能不能在有限資源預算下排出安全的執行時間表。這樣失敗可以被歸因:是邏輯規劃錯,還是資源排程錯,還是兩者都錯。
- **為什麼重要**:過去把「有沒有把任務做完」當成單一分數,完全看不出 agent 是不是靠犧牲系統穩定性換來的速度;PeakBench 讓這個代價變得可以被量化和歸因。

### 深入要點

- 核心發現:邏輯規劃能力強的 agent,不代表物理排程也安全或有效率——兩者是可以脫鉤的兩種能力 ⚠️(作者自測,待外部複現)
- 把資源資訊主動暴露給 agent(而不是讓它盲目平行呼叫),可以減少可避免的資源過載並提升資源使用率
- Benchmark 建構流程:用 MCP 工具生成可執行的多工具查詢 → 在 sandbox 裡實測記錄每一步的資源使用量 → 用執行順序擾動反推出真正的前置/並行結構
- 落地門檻:需要能取得工具的資源使用量(記憶體、API 額度、GPU 用量等)才能套用這套評測,對黑箱第三方 API 較難量化
- Limitation:目前評測場景基於合成的 MCP 工具查詢,真實生產環境的資源波動與異質性可能更複雜
- 程式碼開源:[github.com/Czzzk/Staggering-the-Peaks](https://github.com/Czzzk/Staggering-the-Peaks)

### Reviewer 一句話評

把「邏輯規劃」和「物理排程」拆開評測、並用實測資源 profile 讓失敗可歸因,是目前少數處理 agent 平行呼叫「安全性」而非只看「正確性」的評測設計;但基於合成工作流的評測離真實生產環境的資源異質性還有距離。

### 給你的 take-away

- 如果你的 agent 平台有平行工具呼叫:先假設你的 agent 是「邏輯規劃強、資源感知弱」,在架構上加一層資源預算檢查,而不是預設 agent 自己會避開資源衝突
- 如果你在設計 agent 評測:PeakBench「拆兩個維度做歸因」的思路值得直接搬到你自己的內部評測,把「做完了嗎」跟「做的方式安不安全」分開看

---

## 論文三｜多輪工具呼叫為什麼會忘記早期資訊?OODA-Tool 把「記狀態」和「做動作」拆開

**From State to Action: OODA-Tool for Reliable Multi-Turn Tool Use**
Rongfeng Guo, Yinxuan Huang, Yusen Wu et al.（華中科技大學 Huazhong University of Science and Technology,通訊作者 Vincent Tao Hu）　·　arxiv: 2608.24368

連結: [arxiv](https://arxiv.org/abs/2608.24368) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24368)

### TL;DR

多輪工具呼叫時,「記住之前發生的事」和「決定下一步呼叫什麼」被硬塞進同一次生成,會互相搶資源;OODA-Tool 借用軍事決策的 OODA 循環把兩者拆開,在 Qwen3 0.6B–14B 全系列都提升任務成功率,模型越小改善幅度越大。

### Read Priority

略讀 — 對做多輪、多工具、資訊需要跨輪累積的 agent 系統(如客服、訂單修改)有直接參考價值;若你的場景以單輪或簡單工具呼叫為主,可以先看結論。

### 領域背景

現有 direct function-calling 和 ReAct 這類方法,都是把「追蹤目前任務狀態」和「產生下一個動作」放在同一段自迴歸生成裡完成。論文發現這會造成「狀態-行動競爭」:急著生出下一步動作的壓力,會蓋掉或忽略前面幾輪累積下來的資訊,導致呼叫用的是過時或不完整的狀態。

### 中階導讀

- **問題**:想像一個訂票 agent,第三輪你告訴它「我不要靠窗的位置」,到了第七輪它要幫你選最終座位時,這個限制卻被忘記了——不是它「不知道」,而是在生成下一步動作的當下,這個早期資訊被生成的壓力蓋過去了。
- **方法**:OODA-Tool 把每一輪決策拆成四個有型別檢查的階段:Observe 重建目前任務狀態(目標、實體、限制條件、還沒完成的子目標);Orient 判斷現在能不能執行(五種模式:可用工具解決/需要澄清/直接回覆/從失敗中恢復/已完成);Decide 在 Orient 允許的範圍內決定動作結構(單一呼叫/依序呼叫/平行呼叫);Act 把動作真正實現成合法的工具呼叫或回覆。中央控制器會在每個階段交接時檢查,不允許 Decide 在 Orient 判定「需要澄清」時硬生出一個工具呼叫。
- **為什麼重要**:把「該不該做」和「怎麼做」分開檢查,讓早期累積的限制條件不會在生成下一步動作時被意外蓋掉,尤其在資訊需要跨多輪累積的任務上效果最明顯。

### 深入要點

- 在 Qwen3 0.6B / 1.7B / 4B / 8B / 14B 五個模型規模上,Specialized OODA 比 Direct-LoRA 基準線的任務成功率分別提升 6.86 / 6.79 / 6.99 / 5.94 / 4.48 分,模型越小改善幅度越明顯 ⚠️(作者自測,待外部複現)
- 改善幅度在困難題與分佈外(OOD)任務上更大,在簡單題或高度平行呼叫的任務上改善較小
- 測試場景:ToolDial 加上另外三個 benchmark,涵蓋多輪、多工具、資訊不完整三種情境
- 代價:四階段的分階段生成比一次到位的 Direct-LoRA 多耗推理成本,若場景重視單次呼叫的延遲,Direct-LoRA 仍是更便宜的選擇
- 落地門檻:需要重新設計 agent 的執行迴圈,把單一生成拆成四個有型別介面的階段,並加上中央控制器做交接驗證
- Limitation:論文自己點出「平行呼叫的執行」是這個架構目前的主要弱點,拆分階段反而在需要大量平行工具呼叫的任務上收益有限

### Reviewer 一句話評

把「狀態-行動競爭」明確命名並用 OODA 循環的四階段拆解來解,是少見把軍事決策理論落地成 agent 架構的嘗試,在小模型上的提升尤其實用;但四階段生成的延遲代價、以及在平行呼叫場景下收益有限,是否值得導入要看場景是否真的吃「跨輪狀態累積」這個痛點。

### 給你的 take-away

- 如果你的 agent 場景需要跨多輪記住限制條件(客服、訂單修改、多步驟表單):OODA-Tool 的四階段拆解思路值得參考,尤其如果你用的是中小型模型
- 如果你的 agent 場景以單輪、低延遲為主:先確認你真的有「狀態-行動競爭」這個問題,再決定要不要為此付出額外的推理延遲成本

---

## 今日收穫

之前以為 agent 的「工具呼叫」只要選對工具、參數填對就算完成,現在意識到工具呼叫要真正可靠,還要處理三層完全不同的問題——工具本身的品質(誰寫的、寫的人自己會不會用)、執行時的資源安全(平行呼叫會不會把系統打爆)、多輪之間的狀態一致性(早期資訊會不會在生成下一步動作時被蓋掉)。這三層任何一層沒顧到,「任務完成」這個分數都可能是假象。

## 參考資料

- SMITH 論文(Joint Optimization of Tool Creation and Use for Large Language Model Agents):[arxiv 2608.24571](https://arxiv.org/abs/2608.24571)
- PeakBench 論文(Benchmarking Resource-Aware Tool Invocation in LLM Agents):[arxiv 2608.24509](https://arxiv.org/abs/2608.24509)、程式碼 [GitHub](https://github.com/Czzzk/Staggering-the-Peaks)
- OODA-Tool 論文(From State to Action: OODA-Tool for Reliable Multi-Turn Tool Use):[arxiv 2608.24368](https://arxiv.org/abs/2608.24368)
