---
title: "模型只是元件，harness 才是系統：讀完 60 篇企業 agent 案例後留下的東西"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, context-engineering, multi-agent, llm, security]
lang: zh-TW
tldr: "Salesforce、Microsoft、Stripe、OpenAI、Anthropic 七個獨立案例講出同一句話：可靠性來自模型周圍的工程，不是模型本身。而「把確定性的部分還給程式碼」已經被四家公司各自產品化。附查證後不建議引用的五個數字。"
description: "從 60 篇 ByteByteGo agent 文章與 19 份一手來源整理出的 harness engineering 觀點：七家公司的收斂結論、四個產品化的確定性節點設計、Salesforce 的三大反模式、為什麼 prompt injection 只能在 harness 層做損害控制，以及查證後發現有問題的數字。"
draft: false
glossary:
  - term: "unattended agent"
    aliases: ["無人看管 agent"]
    definition: "收到任務後沒有人在旁邊隨時導正、自己跑到交件為止的 agent。"
    advanced: "與 attended agent（Cursor、Claude Code 這類有人盯著的）相對。沒有人在迴圈裡意味著環境隔離、權限邊界、回饋迴圈與停止條件全部要事先設計好。"
    context: "本文用 Stripe Minions 當例子——跑在已與生產隔離的 QA 環境，因此可以全權限執行、不需確認提示。"
  - term: "containment rate"
    aliases: ["收容率"]
    definition: "客服 agent 完全解決、不需要人工跟進的對話比例。"
    advanced: "Salesforce 用它當唯一 KPI。Intercom 則主張這類指標不夠——快速 FAQ 與付款爭議都算「已解決」但工作量差很多，應改看自動化率（端到端處理掉的整體工作量比例）。"
    context: "本文用它說明「上線前只綁一個 KPI」這條做法。"
---

> 🌏 [English version](/posts/ai/2026-08-10-agent-harness-over-model-en)

[ByteByteGo](https://blog.bytebytego.com/) 從 2025 到 2026 年累積了六十篇左右跟 AI agent 直接相關的文章，其中最有價值的一條線不是概念圖解，而是**訪談各家工程主管的第一手內容**——Salesforce 的 Agentforce CPO、Microsoft Core AI 的產品 VP、LinkedIn 的 Distinguished Engineer、OpenAI 的工程師群。把這條線橫著讀，七個彼此獨立的案例收斂到同一句話。

這篇整理那句話是什麼、它在架構上具體長什麼樣子，以及——因為我順著它的引用鏈回查了十九份一手來源——**哪些數字不要跟著引用**。

## 七家公司說了同一句話

| 來源 | 原話 |
|---|---|
| [Microsoft](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at) | 「harness matters as much as the model」 |
| [OpenAI Codex](https://blog.bytebytego.com/p/how-openai-codex-works) | 「the model is a component and the agent is the system」 |
| [Salesforce](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000) | 「能畫成流程圖的，就該是程式碼，不是 prompt」 |
| [Stripe](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs) | 「別從選模型開始。從你的開發環境、測試基礎設施、回饋迴圈開始」 |
| [OpenAI 資料平台](https://blog.bytebytego.com/p/how-openai-built-its-data-agent) | 「我們的 agent 是 pretty vanilla，可靠性來自它周圍的工程」 |
| [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | prompt 設計是整套系統裡最重要的槓桿 |
| [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | 「大多數自稱 AI Agent 的產品其實沒那麼 agentic，它們多半是確定性程式碼，在剛好的位置點綴幾個 LLM 步驟」 |

七篇共用同一個編輯，所以「這是編輯強加的敘事框架嗎」是個合理的懷疑。我回查了 Dex Horthy 的 [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) 原文，確認那套框架確實來自作者本人而非編輯改寫。更關鍵的是 OpenAI 資料平台那篇——**它是唯一一篇「自己勸自己不要做複雜架構」的**。他們的 agent 是單一模型加上 context assembly、精選工具與 runtime，**刻意不做** router、不混多模型、不做 fine-tune、不建複雜檢索管線，理由是每個這類選擇「都會增加成本、延遲，和更多失敗的方式」。這種自我設限很難用「編輯想講一個好故事」解釋掉。

## 「把確定性的部分還給程式碼」已經被產品化四次

收斂如果只停在口號就沒什麼用。真正有份量的是：四家公司各自把同一個想法做成了產品。

- **Salesforce 的 Agent Script**——用 TypeScript 寫「意圖符合 X 就跳過推理迴圈，直接跑這串工具」
- **Intercom 的 Procedures**——自然語言推理外加確定性控制：決策點的 conditional steps、保證同輸入同輸出的小段程式碼、敏感動作前暫停等人工核可的 checkpoint
- **Microsoft 的 runtime**——只把真正需要推理的部分送給 LLM
- **Stripe 的 blueprints**——一串節點，「實作功能」「修 CI 失敗」給完整的 agentic loop，**「跑 linter」「推分支」寫死**

Stripe 給的理由最直接：有些事永遠不該交給 agent 判斷，而且每個確定性節點就是**少一個會出錯的地方**，在每天數百次執行下會複利。

反過來看，Salesforce 從兩萬個企業部署歸納出的三大反模式，第一條正好是這件事的反面：

1. **該用程式碼的地方用 LLM 推理**
2. **不斷加強語氣的 prompt，而不是把規則寫成 policy**——「NEVER」「ALWAYS」加粗加驚嘆號沒有用
3. **爛的 context engineering**——他們舉的例子是把 `get_orders` 的回傳從 100K tokens 壓到 2K

同一條原則在迴圈層也成立。[LinkedIn 的 Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered) **明確拒絕了 ReAct**，改用 plan-and-execute：Planner 先把請求拆成結構化計畫，Executor 再逐步執行、每一步跑自己的推理迴圈。理由是「**LLM 被要求同時處理太多事情時會變得不可靠**」。附帶好處是成本可控——規劃用貴模型，簡單步驟用便宜模型。ReAct 常被當成 agent 迴圈的預設答案，這是我在整批材料裡看到唯一一個生產系統對它的實質反對。

## 為什麼 harness 比模型重要：三個機制

這不是「工程比較重要」這種空話，底下有三個可以驗算的機制。

**第一，複合錯誤。** 每步 95% 正確率，跑十步剩約 60%，二十步剩約 36%。這也解釋了一件常被誤讀的事：**編碼 agent 之所以比開放任務 agent 好用，不是因為程式碼比較簡單，而是因為測試回饋提高了每一步的可靠度，等於縮短了「必須全對」的鏈長。**

**第二，失敗多半發生在 context 層而不是智力層。** [Chroma 的 context rot 研究](https://research.trychroma.com/context-rot)測了 18 個前沿模型，全部隨輸入變長而退化，而且是跳崖式而非漸進式的。加上注意力集中在頭尾的 lost-in-the-middle，以及模型呼叫之間完全 stateless 這兩件事，[ByteByteGo 那篇 context engineering 導讀](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)的收束值得抄下來：

> 當模型夠強之後，多數失敗就不再是智力失敗，而是 context 失敗——模型本來做得對，但沒拿到需要的東西，或拿到太多不需要的東西。

**第三，記憶失效多半是檢索失效偽裝的。** [記憶那篇](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)提了一個很好的思想實驗：完美資料庫加上爛檢索的 agent，往往輸給空記憶但誠實面對自己能力邊界的 agent——因為前者會自信地把過時資訊當成 ground truth 往上疊。它同時給出站內最完整的記憶拆法，兩個正交的軸：**層級**（context window → session → 長期儲存 → 冷歸檔）× **型別**（working / episodic / semantic / procedural）。

順帶一提，長 context 的成本結構也常被誤解。[KV cache 那篇](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive)指出 decoding 階段每產生一個 token 都要把**整個 cache** 從記憶體讀進計算單元——**所以那是頻寬成本，不只是儲存成本**。這解釋了為什麼一個請求「明明放得下」卻還是很慢。

## 上線才是工作的開始

Salesforce 那篇最反直覺的一個數字：**agent 有 90% 的工作發生在上線之後**，跟傳統軟體剛好相反。他們認為這是多數企業 agent 失敗的根因——團隊沿用傳統軟體的節奏，以為上線就結束了。

上線前只要做三件事：範圍收小（"Don't boil the ocean"）、綁一個 KPI（他們用 containment rate，即不需人工跟進就完全解決的比例）、架好信任層。上線後靠一個四類分診的回饋迴圈：

| 症狀 | 往哪修 |
|---|---|
| 語氣不對 | 改 system prompt |
| 邏輯錯誤 | 查工具設定；反覆出現就改成確定性腳本 |
| 資料品質 | 問題不在 agent，回頭找文件擁有者 |
| 覆蓋缺口 | 擴範圍，或做一條乾淨的人工升級路徑 |

**迴圈的速度就是能不能擴大規模的閘門。** 另外一個很少看到有人講的細節：他們的**資料遮罩預設關閉**，因為遮罩會把 agent 推理需要的 context 一起遮掉。

Intercom 補上了同一件事的另一半——**別用「解決率」當 KPI**。他們自陳 Fin 2 的平均解決率已達 66%，但這個指標不夠：「回答一個聊天室裡的快速 FAQ，跟調查一筆付款爭議或用電話驗證退款，不是同一回事。兩者都算『已解決』，但工作量差很多。」他們改看**自動化率**：agent 端到端處理掉你整體工作量的多少。這跟 Salesforce 的 Agentic Work Units 是同一個洞察的兩種說法。

## 沒人盯著的 agent：Stripe 的做法

Stripe 每週合併超過 1,300 個「零人類手寫程式碼」的 PR。這篇最有價值的是它提出的一組區分：**attended 對 unattended**。Cursor、Claude Code 是有人盯著、隨時導正的；Minions 沒人看，收到任務自己做完交件。這個差別改變下游所有的設計要求。

- **環境先於模型**：devbox 十秒開機（靠預先暖機的機器池），跑在已與生產隔離的 QA 環境，**所以 agent 可以全權限執行、完全不需要確認提示**——出錯的爆炸半徑就是一台可丟棄的機器。原文那句話值得記：「Stripe 不是為 agent 建的這些，是為人建的。對人好的東西對 agent 也好。」
- **規則要 scoped，不要 global**：他們「非常謹慎地」使用全域規則，因為全域規則會在 agent 還沒開始工作前就把 context 填滿。改成綁定到特定子目錄與檔案模式，agent 走到哪就撿起哪裡的規則
- **工具預設給少**：用 MCP host 了將近 500 個工具，但 Minions 預設只拿一小組，工程師需要時再加
- **硬上限**：最多兩輪 CI，之後退回給人。理由是 LLM 重試同一個問題有遞減報酬。「知道什麼時候該停，跟知道怎麼開始一樣重要」

另外兩個站內他處沒有的架構模式也值得一提。[Grab](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost) 依風險剖面把系統切成兩條路徑：唯讀的調查路徑放四個 agent 自由跑，寫入路徑只放一個 agent 且**每一階段都要人工核可**。他們的設計哲學叫 "decoupling the brain from the hands"，好處是出問題時能立刻分辨是推理錯還是某個工具互動錯。而且他們誠實寫下：系統在 demo 很好，**上生產後六件事壞掉**。

[Meta](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data) 則讓 data-user agent 與 data-owner agent 互相協商資料存取核可。最有意思的是其中一個子 agent：你要一張敏感表時，它會建議一張含有類似但非敏感資料的替代表，甚至幫你改寫 query 只用非受限欄位——**這種過去只存在於少數資深工程師腦中的知識，被 agent 綜合出來了**。

## 安全這條線只能在 harness 上解

如果前面幾節還讓人覺得「模型再強一點就好了」，安全這條線可以徹底斷了這個念頭。

根因只有一句：**LLM 把指令與資料當成同一串 token 接收，序列裡沒有任何標記把兩者分開。** 參數化查詢在資料庫邊界解決了這件事；自然語言沒有等價物，因為指令和資訊都是用文字表達的。

這不是「還沒解決」，是**已經有人認真試過並失敗**。2025 年 11 月 OpenAI、Anthropic、Google DeepMind 聯合發表的研究，**把先前提出的 12 種 prompt injection 與 jailbreak 防禦全部攻破**（允許攻擊自適應迭代）。更早的 EchoLeak（[CVE-2025-32711](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)）則是一封信就讓 M365 Copilot 把公司內部檔案送到外部伺服器、使用者完全沒有互動——**而那個 payload 通過了微軟自己專門的 cross-prompt-injection 分類器**。

所以現實目標不是擋住每次攻擊，而是**攻擊成功時活下來**。這只能靠 harness：

- **lethal trifecta**——真正造成損害需要三件事同時成立：存取私有資料、接觸不可信內容、有對外送出的通道。拿掉任何一個都能降低曝險，而**切掉對外通道或收窄存取範圍，通常比加強過濾器便宜**
- **Meta 的 Agents Rule of Two**——沒有 human-in-the-loop 時，一個 agent 最多只能同時滿足三個危險屬性中的兩個。Meta 自陳這是最小權限原則的補充，不是完整解法
- **guardrail 要移到 tool boundary**（Microsoft）——chatbot 只需篩使用者輸入與模型輸出；agent 還會讀工具輸出與檢索到的文件，間接注入就藏在那裡
- **GitHub 的 agentic workflow 整套架構是「假設這個 agent 已經被入侵」設計的**：三層互相獨立的防線、零秘密架構（agent 對外走防火牆容器、MCP 工具走獨佔持有 PAT 的 gateway、LLM 呼叫走 proxy，整條鏈上 agent 從不碰到秘密），以及最有特色的 **safe outputs**——MCP server 對 agent 只給唯讀，所有寫入交給另一個**只緩衝不執行**的 server，agent 結束後緩衝的變更才走確定性管線（型別白名單 → 數量上限 → 內容清洗）

GitHub 那篇還留了一句適用範圍遠超安全的話：「**每一個你能觀察通訊的點，也都是你未來能介入管制的點。今天的可觀測性就是明天的控制平面。**」他們也誠實承認這是損害控制策略而非預防策略，而確定性的輸出審查只抓得到事先想到的模式。

## 引用之前：這幾個數字不要用

這批材料的價值在於幫你找到該讀哪篇一手材料，以及提供一個能掛東西的心智架構。但**它不適合當引用來源**。我回查了十九份一手來源、約四十項可查證的宣稱，命中率約七成明確正確，但失誤的形狀非常一致。

| 宣稱 | 查證結果 |
|---|---|
| 多 agent 用掉「單 agent 的 15 倍 token」 | ❌ [Anthropic 原文](https://www.anthropic.com/engineering/multi-agent-research-system)是「多 agent ≈ 15× **一般聊天**，單 agent ≈ 4× 一般聊天」。相對單 agent 約 **3.75 倍**，被誇大了約四倍 |
| Klarna 的 AI 客服首月處理 230 萬次對話 | ⚠️ 數字正確（2024-02 新聞稿），但 **2025-05 Klarna CEO 已公開反轉**，開始重新招聘人類客服：「成本似乎在規劃時被當成過於主導的評估因素，結果你得到的就是比較低的品質」。2026 年的文章仍把它當成功案例 |
| 「AI 產生 Google 超過 75% 的新程式碼」 | 🔴 查不到出處。公開的官方數字是 2024-10 的「超過 25%」與 2025-04 的「超過 30%」 |
| Chroma：「有些模型維持 95% 準確率，越過某個長度後直墜 60%」 | 🔴 原文六萬多字元裡「95%」與「60%」都不存在，看起來是從圖上目測寫成文字 |
| 「METR/Anthropic 的 RCT 顯示資深開發者慢 19%」 | ⚠️ 19% 正確，但 [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study) 是獨立非營利機構、不是與 Anthropic 合著；而且原文明說不確定原因，「元凶是缺乏驗證的過度依賴」是轉述者自己加的 |

四種失效的形狀值得單獨記下來，因為它們不只出現在這一個來源：

1. **但書會掉**——「內部評測」「95% CI 是 [-40%, -2%]」「single agent ≈ 4× chats」全部消失。少了對照錨點的數字最容易被誤讀
2. **機制被壓成結論**——Anthropic 原文說「三個因素解釋了 BrowseComp 上 95% 的表現變異，光是 token 用量就解釋 80%」，被壓成「改善與 token 用量高度相關」。讀者拿到結論，卻拿不到判斷它適不適用於自己情境的依據
3. **會自行補上因果**——研究說不知道原因，轉述變成「元凶是 X」
4. **故事停在對論點有利的地方**——Klarna 是最清楚的例子

順著引用鏈往上游走通常更值錢。三次這樣做，都找到比轉述本身更好的東西：Anthropic 的「token 單獨解釋 80% 變異」、Cognition 在 2026-04 對自己 2025-06 立場的修正（「寫入保持單線程，額外的 agent 貢獻的是智能而不是動作」），以及 UC Berkeley 的 [MAST 論文](https://arxiv.org/abs/2503.13657)——橫跨七個開源多 agent 框架、1,642 份標註過的執行軌跡，回報失敗率介於 **41% 到 86.7%**。那是我在這批材料裡撞到最紮實的一份多 agent 數據，而它從未被引用過。

## 整體來說

如果只留一句：**agent 的可靠性幾乎全部來自模型以外的地方**——環境、確定性節點、context 的裁剪與作用域、回饋迴圈的速度，以及知道什麼時候該停下來交還給人。

這個結論有個很實際的推論：想改善一套 agent 系統時，**換模型通常是最沒有槓桿的那個動作**。Microsoft 甚至提醒模型不是資料庫版本——換 Postgres 版本可以期待照常運作，換模型不行，每次都要重調重測。

至於這批材料本身，正確的用法是拿它當索引：讓它告訴你該去讀哪篇一手材料，然後自己走上去。一旦要引用具體數字，回原文的成本遠低於引用錯誤的代價。

## 參考資料

- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [ByteByteGo — The Agent Loop: How AI Goes From Answering Questions to Doing Things](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering)
- [ByteByteGo — A Guide to Context Engineering for LLMs](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)
- [ByteByteGo — How AI Agents Manage Memory and Avoid Forgetfulness](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)
- [ByteByteGo — Why An LLM's Memory Gets Expensive and How to Fix It](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive)
- [ByteByteGo — How Grab is Using AI Agents to Boost Team Productivity](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)
- [ByteByteGo — How Meta Uses AI Agents for Data Warehouse Access and Security](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data)
- [ByteByteGo — How LinkedIn Built an AI-Powered Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered)
- [ByteByteGo — LLM Security Basics: The Full Threat Model](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat)
- [ByteByteGo — The Security Architecture of GitHub Agentic Workflow](https://blog.bytebytego.com/p/the-security-architecture-of-github)
- [NVD — CVE-2025-32711 (EchoLeak)](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Dex Horthy — 12-Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study)
- [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)（arXiv:2503.13657，UC Berkeley，NeurIPS 2025）
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
