---
title: "AI Agent Arxiv Digest — 2026-08-16"
date: 2026-08-16
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, prompt-injection, agent-skills]
lang: zh-TW
description: "今天三篇圍繞同一個問題——Agent 的技能與擴充模組正在變成新的攻擊面：紅隊系統能用極低成本高效攻破，看似無害的技能本身就會讓任務失敗，理論分析則說明分散的無害機制疊加後可能構成系統性風險"
tldr: "PIMiner 用可跨模型轉移的策略庫，以約 20 美元查詢成本讓提示注入攻擊成功率衝上 76-87%；Agent Skills Can Be Harmful 從 307 個技能誘發失敗中發現看似相關的技能比明顯無關的技能更容易搞砸任務，過度流程占效率退化六成以上；Order 66 情境分析用組合式威脅模型證明休眠植入、事後記憶投毒與對等擴散單獨看都不致命，疊加後可能自我維持傳播"
series:
  name: "AI Agent Arxiv Digest"
  order: 84
---

> 🌏 [English version](/en/posts/daily/2026-08-16-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文從三個不同角度指向同一件事：Agent 的「技能」與「擴充模組」正在變成新的攻擊面。PIMiner 證明攻擊方不需要昂貴的強化學習訓練，一套可跨模型轉移的策略庫加上約 20 美元的查詢成本，就能在多個主流模型上打出六到八成的提示注入成功率；Agent Skills Can Be Harmful 從防守方視角補了一刀——就算沒有惡意攻擊者，一個「看起來很相關」的技能本身就可能讓任務失敗或讓成本暴增，而且原因通常不是它無關，而是它「用錯方式相關」；Order 66 情境分析則把鏡頭拉遠，用組合式威脅模型說明，即使每個機制（休眠指令、事後記憶植入、對等擴散）單獨看都不致命，疊加 agent harness 給的執行與復原權限，理論上就能構成系統性風險。三篇合起來的訊息很清楚：Skill／擴充系統的信任邊界，現在比模型本身的對齊更急迫。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent Skill（代理技能） | 像 SKILL.md 這類可重複使用的指令包，讓 agent 在不改模型參數的情況下取得特定領域的工作方法 |
| 提示注入（Prompt Injection） | 攻擊者把惡意指令藏在 agent 會讀到的外部內容（網頁、工具回傳結果）裡，誘騙 agent 執行非預期動作 |
| 攻擊成功率（ASR） | 對抗攻擊讓 agent 做出有害或非預期行為的比例；ASR 76% 代表每四次測試有三次被攻破 |
| 紅隊測試（Red-teaming） | 主動模擬攻擊者尋找系統弱點的測試方法，用於評估安全風險並收集防禦訓練資料 |
| 記憶投毒（Memory Poisoning） | 攻擊者把惡意內容寫入 agent 的持久性記憶或工作區，使其在未來被重新讀取並觸發有害行為 |
| 防禦切點（Cut Set） | 把攻擊鏈拆成幾條必要路徑，只要切斷其中一整組就能讓整條攻擊鏈失效的防禦設計方法 |

---

## 論文一｜Agent Against Agent：用 Agent 對打 Agent，紅隊測試成本砍到 20 美元

### Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming
Yanting Wang, Chenlong Yin, Runpeng Geng, Jinyuan Jia（Pennsylvania State University）　·　arxiv: 2608.05108

連結: [arxiv](https://arxiv.org/abs/2608.05108) · [alphaxiv](https://www.alphaxiv.org/abs/2608.05108)

### TL;DR

PIMiner 把過去的攻擊經驗蒸餾成一份可讀、可跨模型轉移的策略庫，每筆測試樣本只需約 10 次查詢，就在 IPIArena 對 Gemini-2.5-Pro 打出 76.2% 攻擊成功率，對 GPT-5.1 為 61.9%，對 Claude-Sonnet-4.5 為 42.9%（AgentDojo 上分別為 86.7%／53.3%／40.0%）。

### Read Priority

必讀 — 對做 agent 安全評測或紅隊測試的團隊直接可用，也揭露了目前主流模型在提示注入下的真實防線水位。

### 領域背景

現有紅隊方法大致分兩類：以強化學習訓練攻擊者模型（如 RL-Hammer、PISmith），效果好但需要對目標模型下上萬次查詢，且遷移到新模型時表現常大幅下滑；另一類是逐樣本搜尋（如 TAP、PAIR），不需訓練但攻擊力明顯較弱。中間缺一個「訓練成本低、又能跨模型遷移」的方案。

### 中階導讀

- **問題**：想像每次要測試一個新上線的 agent 模型，都得重新花上萬次查詢、上百美元去訓練專屬的攻擊模型——這對想在部署前快速掃一輪安全性的團隊來說太貴也太慢。
- **方法**：PIMiner 用一個分層記憶系統取代重訓練：長期策略庫記錄「什麼樣的注入手法對什麼情境有效」，中層記憶追蹤同一資料集內的經驗，短期記憶處理單一樣本；另有一個 router 負責把攻擊者的上下文壓縮到可控大小。訓練階段依序餵入 (資料集, 目標模型) 配對，從零建立策略庫；測試階段面對從未見過的目標模型，直接把學到的策略庫拿來用，不必重新訓練。
- **為什麼重要**：這代表提示注入的「攻擊知識」是可以被萃取、記錄、重複利用的，就像前面提過的記憶管理研究一樣——安全測試的瓶頸從「算力」轉移成「知識管理」。

### 深入要點

- IPIArena：Gemini-2.5-Pro 76.2%、GPT-5.1 61.9%、Claude-Sonnet-4.5 42.9%
- AgentDojo：Gemini-2.5-Pro 86.7%、GPT-5.1 53.3%、Claude-Sonnet-4.5 40.0%
- 訓練階段用自己的 Claude Code 訂閱驅動攻擊者／路由／摘要三個 agent，額外查詢目標模型的成本約 20 美元；對比 RL 方法動輒上萬次查詢、成本破百美元
- 測試時只需黑箱存取（僅看最終輸出與是否成功），訓練時假設灰箱可觀測到中間工具呼叫
- 消融實驗顯示：拿掉策略庫，攻擊成功率從跨資料集遷移的高點大幅下滑，證明效果來自可複用的攻擊知識而非特定模型的過擬合
- Limitation：主要以 Claude Code 系列模型驅動攻擊者，其他 backbone 上的表現與遷移性尚待更廣泛驗證

### Reviewer 一句話評

方法紮實且成本效益驚人，但作者自陳主要用 Claude Code 系列模型做攻擊者 backbone，換成其他家模型是否維持同等效果仍待更廣泛驗證。

### 給你的 take-away

- 如果你在做 agent 安全評測：PIMiner 的分層記憶設計（長期策略庫＋router 壓縮上下文）值得直接參考，能把紅隊測試成本壓到原本的一到兩成
- 如果你在部署會讀取非受信任內容的 agent（網頁、工具回傳結果）：論文數據顯示主流模型在僅 10 次查詢內就有四到九成機率被攻破，這個風險應該被當成現實情境去設計防禦，而不是理論上的邊角案例

---

## 論文二｜Agent Skills Can Be Harmful：一個「看起來很相關」的技能，比明顯無關的技能更危險

### Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents
Gen Dong, Yanjie Gao, Liqun Li et al.（Microsoft Research；Gen Dong 為實習期間完成本研究）　·　arxiv: 2608.11888

連結: [arxiv](https://arxiv.org/abs/2608.11888) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11888)

### TL;DR

用差異化測試框架（比對「有技能」與「無技能／語意相近技能」的對照組執行）在 SkillsBench 與 SWE-Skills-Bench 上抓出 307 個技能誘發的失敗，其中「過度流程」（Excessive Procedure）占效率退化的 62.6%（114/182），主要來自過度驗證（67 例）與過重的實作流程（30 例）。

### Read Priority

必讀 — 幾乎所有正在用 Claude Code Skills、Custom Instructions 之類機制擴充 agent 的團隊都該看，因為結論直接挑戰「技能越相關越好」的直覺。

### 領域背景

Agent skill（如 SKILL.md）已成為擴充 agent 能力的標準做法，但先前研究對 skill 的效果報告不一：有的提升成功率，有的沒差，有的甚至拖慢執行、降低成功率。問題是現有的 skill benchmark 大多只衡量「有沒有幫助」，沒有工具能把一次失敗歸因到具體是哪個 skill、又是哪個環節出的錯。

### 中階導讀

- **問題**：想像一個 coding agent 載入了一個「測試框架」skill，這個 skill 主題上完全相關，但它要求的驗證流程遠超這個任務實際需要——agent 因此花掉大量 token 和時間在不必要的驗證上，甚至因為誤解了 skill 的指示而做錯任務。事後只看「失敗了」，你分不出這是 base agent 能力不足、還是這個 skill 把它帶偏了。
- **方法**：受差異測試（differential testing）啟發，研究者對每個任務建構「目標執行（載入待測 skill）」對「參照執行（不載入 skill，或載入語意相近的替代 skill）」的配對比較，只有當參照組能解決同樣任務、或用更低成本解決時，才把失敗歸咎於這個 skill。他們據此打造 SkillTriage，一套能自動產生歸因報告的分類工具。
- **為什麼重要**：這說明 skill 生態系需要的不是更多 skill，而是能持續篩查「哪些 skill 正在悄悄拖累任務」的機制——尤其當 skill marketplace 越做越大，人工逐一檢查已經不可行。

### 深入要點

- 307 個技能誘發失敗：125 個功能性失敗 + 182 個效率退化
- 功能性失敗中，Task-Implementation Fault（技能誤導任務實作方式）占 86/125（68.8%），遠高於路徑錯置（24 例）與環境不匹配（13 例）——換句話說，多數失敗不是 skill 牛頭不對馬嘴，而是它「相關但用錯方式」
- 效率退化中 Excessive Procedure 占 114/182（62.6%），細分為過度驗證 67 例、重型實作管線 30 例
- 若退化來自 context overhead，43/46 案例的主因是「強制性技能本文文字」，而非單純的 prompt 變長
- 落地工具：SkillTriage 自動化歸因＋分類報告，可用於持續篩查 skill 品質
- Limitation：兩個 benchmark（SkillsBench、SWE-Skills-Bench）都偏 coding 任務，結論能否推廣到寫作、資料分析等非 coding 類型的 skill 仍待驗證

### Reviewer 一句話評

差異化測試框架設計嚴謹，307 個案例的規模也足以支撐分類結論，但兩個 benchmark 都偏 coding 任務，結論在其他領域的 skill 上是否成立仍是未知數。

### 給你的 take-away

- 如果你在維護 skill／擴充模組庫：用「不載入 skill」或「語意相近的替代 skill」當對照組去驗證每個 skill 是否真的帶來淨效益，而不是只看它主題上「相關」
- 如果你在寫 SKILL.md：避免把「驗證清單」和「重型實作管線」寫成強制流程，這是本篇發現效率退化占比最高的兩個來源

---

## 論文三｜Order 66 情境分析：沒有一個機制致命，疊加起來呢？

### Compositional Threat Analysis of Latent Compromise in LLM Agent Systems: The Order 66 Scenario
Satoshi Matsuoka（單一作者，論文未標註機構）　·　arxiv: 2608.08131

連結: [arxiv](https://arxiv.org/abs/2608.08131) · [alphaxiv](https://www.alphaxiv.org/abs/2608.08131)

### TL;DR

論文用組合式威脅模型分析「休眠植入＋事後啟動＋harness 授權」的複合攻擊鏈：兩類別傳播範例中，各自的類內複製率都低於 1（不會自行擴散），但跨類別回饋能把有效傳播係數推到 ρ=1.092（可自我維持擴散），加上隔離與持久性控制後可壓回 0.381。

### Read Priority

略讀 — 純理論建模，沒有實測系統或滲透測試佐證，但提供了一個少見的、把分散風險綜合起來看的威脅框架，適合做架構設計時的參考清單。

### 領域背景

過去研究多半分開處理 agent 安全的各個機制：權重層的後門（Sleeper Agents、BadAgent）、事後的記憶投毒（AgentPoison、MINJA）、文字驅動的蠕蟲式傳播（Morris-II、AgentWorm）。這篇論文的定位是把這些各自獨立的研究拼成一張圖，問一個沒人系統性回答過的問題：如果把它們串在一起會發生什麼。

### 中階導讀

- **問題**：假設一個被廣泛部署的 agent 擴充套件或共享記憶裡，藏著一條平時不會被觸發的規則；某天一封郵件、一份文件或一則對等訊息裡的短短一句話把它喚醒；而這個 agent 的 harness 又正好握有檔案系統、雲端、程式庫或復原流程的操作權限。三個環節單獨看都不算嚴重，但湊在一起呢？
- **方法**：論文把「致命的共同核心」拆成休眠（dormancy）、啟動（activation）、權限（authority）、可觸及目標（reachable targets）、復原失敗（failed recovery）五個必要條件，再區分三條「觸及群體」的路線——發布時預先埋入、發布後持久植入、對等節點間複製。從這個必要條件圖推導出「防禦切點」：只堵住其中一條路線（例如只做 prompt filtering）留不住其他兩條，必須同時涵蓋一整組切點才夠。
- **為什麼重要**：這給了「威脅組合會不會比單一威脅更嚴重」一個可計算的答案，而不是靠直覺猜測——文中的傳播係數計算顯示，看似都在安全範圍內的個別環節，疊加後可能跨過自我維持擴散的門檻。

### 深入要點

- 兩類別傳播矩陣：基準情境下有效傳播係數 ρ(B)=1.092（>1，代表早期擴散在期望值上會自我維持）；加上訊息隔離、匯入檢疫、不可變狀態與更快移除等控制後降到 ρ(B)=0.381（<1，會自然消退）
- 三條群體觸及路線：發布時預埋、發布後持久植入、對等複製——各自需要不同的防禦切點組合，單一控制無法涵蓋全部
- 截至 2026 年 8 月 5 日的公開紀錄中，未觀察到完整走完 Order 66 全鏈路的真實事件，但各個組成機制都已有實際案例（官方擴充套件曾散布過會失敗的破壞性指令、套件蠕蟲曾攜帶條件式家目錄清除邏輯、另一起套件蠕蟲曾在 coding agent 設定中植入持久性 hook）
- 最關鍵的共同防線：獨立於系統之外的能力仲裁、受保護的復原機制、持久狀態的來源追溯、傳播隔離
- Limitation：全文為文獻整合與數學建模，沒有針對真實 agent 系統做端到端的攻擊複現，論文自陳結論是「組件層級可信」而非「已發生」或「必然發生」

### Reviewer 一句話評

論述框架完整、防禦切點的推導有說服力，但完全基於文獻整合與理論建模，沒有實際系統的複現實驗佐證，「componentwise credible」的定性判斷不代表對應的真實風險等級已經確定。

### 給你的 take-away

- 如果你在設計 agent 的權限模型：不要只防一條路徑（例如只做 prompt filtering 或只做 checkpoint 掃描），論文的切點分析顯示必須同時涵蓋發布時、發布後、對等複製三條路線才算完整
- 如果你在做 agent fleet 的資安規劃：把「獨立於主系統之外的復原機制」列為優先投資項目，這是論文認為最關鍵、也最常被忽略的一道防線

---

## 今日收穫

之前以為 agent 的攻擊面主要在「外部輸入」——網頁、工具回傳結果這類一望即知的不受信任來源。今天發現真正該盯的是 agent 自己會主動載入、甚至自己生成的東西：skill、記憶、擴充模組。這些被 agent 當成「已經可信任」的上下文，反而是最難防的一層，因為現有的防護大多預設威脅來自外部，卻很少檢查 agent 自己「請進門」的內容。

## 參考資料

- [Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming](https://arxiv.org/abs/2608.05108)
- [PIMiner code repository](https://github.com/wang-yanting/PIMiner)
- [Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents](https://arxiv.org/abs/2608.11888)
- [Compositional Threat Analysis of Latent Compromise in LLM Agent Systems: The Order 66 Scenario](https://arxiv.org/abs/2608.08131)
