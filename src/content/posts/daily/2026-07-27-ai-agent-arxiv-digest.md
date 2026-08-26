---
title: "AI Agent Arxiv Digest — 2026-07-27"
date: 2026-07-27
category: daily
tags: [ai-agent, arxiv, daily, agent-security, agent-rag, agent-evaluation]
lang: zh-TW
description: ""
tldr: ""
series:
  name: "AI Agent Arxiv Digest"
  order: 64
---
> 🌏 [English version](/en/posts/daily/2026-07-27-ai-agent-arxiv-digest-en)

[!info] 📌 **今日總覽**
今天三篇的核心主軸是「Agent 的可靠性危機」——從記憶架構、安全攻擊到技能生命週期，分別揭露了目前 Agent 系統在長期記憶設計、資料注入漏洞和可重用技能管控上的根本性痛點。NapMem（Alibaba/Qwen）把記憶從「被動查詢」升級為「主動導航行動空間」，為個人化 Agent 提供新設計範式；ADI 攻擊論文現場示範如何繞過 Claude Code、Codex 的既有防禦，直接 RCE；SkillSec-Eval 則系統化地點名 MCP-like 技能生態的全鏈路安全漏洞，327 個真實技能中多個階段都有弱點。三篇合看，Agent 平台在往下挖功能的同時，安全與記憶基礎設施已到不得不認真對待的時間點。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Indirect Prompt Injection (IPI) | 攻擊者在 Agent 處理的外部資料（網頁、文件）中藏指令，讓 Agent 在不知情下執行惡意動作 |
| Agent Data Injection (ADI) | 本文新提的 IPI 子類型：把惡意內容偽裝成「可信資料」（如資源 ID、tool call 格式），不是偽裝成指令 |
| Memory Pyramid（記憶金字塔） | NapMem 的分層記憶結構：原始對話 → 結構化記憶條目 → 主題軌跡 → 使用者檔案，由粗到細 |
| Skill Lifecycle（技能生命週期） | 一個可重用 Agent 技能從「發布到 repository」→「被搜尋到」→「被 planner 選用」→「執行」→「版本更新」的完整週期 |
| RL for Tool Use | 用強化學習讓 Agent 學會「什麼時候呼叫哪個記憶工具」，而不是寫死規則 |


---


## 論文一｜From Passive Retrieval to Active Memory Navigation: Learning to Use Memory as a Structured Action Space

**作者**: Yue Xu, Yutao Sun, Yihao Liu, Mengyu Zhou 等 · Alibaba Qwen Team / ShanghaiTech / Zhejiang University / Peking University / NUS　·　**arxiv**: 2607.05794
**連結**: [arxiv](https://arxiv.org/abs/2607.05794) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05794)
[!tip] 🎯 
### TL;DR

讓 Agent 把記憶當工具「主動去找」，而不是被動接受系統塞進來的片段；Alibaba Qwen 團隊用 RL 訓練出來的 9B 模型打贏所有 memory baseline。
[!success] ⭐ 
### Read Priority

必讀
如果你的產品有長期記憶或個人化功能，這篇直接提供了可落地的架構藍圖；benchmark 結果在三個主流 memory 測試集上均最優。
[!quote] 🧭 
### 領域背景

大多數 Agent 記憶系統都用「被動檢索」（passive retrieval）：系統根據 query 選出幾段記憶塞進 context，Agent 照單全收。這個設計的問題是 Agent 沒有能力「要求看更多細節」或「跳到更高層摘要」，查到不精準的片段時只能將錯就錯。如何讓 Agent 自己決定「該查哪個粒度的記憶」一直是痛點。

### 中階導讀


#### 問題

想像你是私人助理，老闆說「幫我準備和 Alex 的會議資料」。好的助理不只查「上次跟 Alex 說了什麼」，還會先看 Alex 的公司概況（高層摘要），再鑽進最近的合約細節（低層原文）。現在的 memory 系統卻是：你問什麼，它就塞幾段最像的文字給你，Assistant 只能就此回答。

#### 方法

NapMem 把記憶組織成四層金字塔：**原始對話** → **結構化記憶條目**（typed memory records）→ **主題軌跡**（topic tracks）→ **使用者檔案**（user profile），每層之間有 provenance 關聯可以追溯。Agent 透過「記憶工具」在這個金字塔上導航（navigation）——可以選擇先看摘要，再根據中間找到的線索決定往哪個細節鑽。這個導航能力透過 RL 訓練：Agent 看到 query 後自己決定要呼叫哪個記憶工具、選哪個粒度，最終答對才有 reward。

#### 為什麼重要

個人化 Agent 的核心競爭力之一就是「記得你」。NapMem 架構讓 9B 小模型就能達到 average 62.74，比 Mem0、Zep、MemOS 等業界主流方案都高，且不需要超大模型。對 Agent 平台團隊來說，這代表記憶模組可以用較小的專屬模型（而不是把所有記憶塞進 context 讓主模型處理），在成本和效果上都更划算。

### 深入要點

- **四層金字塔**: raw conversations → typed memory records → topic tracks → user profile，每層透過 provenance link 相連，Agent 可以從任何層進入再跨層跳
- **Memory Tools 設計**: 每個粒度有對應的查詢工具，Agent 透過 tool call 決定要在哪個層搜索，類似 file system 的 `ls` / `cat` / 往上看 `README`
- **RL 訓練**: 完全用 RL 讓 Agent 學習何時呼叫哪個工具，不需要人工標注「正確的記憶路徑」，減少了 reward hacking 問題
- **Benchmark 結果**: NapMem-9B 在 PersonaMem-v2 + LongMemEval + LoCoMo 三個測試集平均 **62.74**，高於 NapMem-397B 的 59.85（⚠️ 大模型反而輸給小模型，可能說明 RL 訓練對 navigation 能力影響更大，但也需注意 benchmark 的代表性）
- **Baselines**: 對比了 Mem0、Zep、MemOS、MemoryOS、AgeMem 五個方案，全部輸給 NapMem-9B
- **不降通用能力**: 在非記憶型任務上測試，RL 訓練後的 policy 大致保留了原模型的 reasoning 和 tool use 能力
- **Limitation**: 目前只在文字對話類任務測試，對 multimodal 或 structured database 記憶的延伸未驗證；RL training data 的 coverage 可能影響 generalization
[!bug] 🧐 
### Reviewer 一句話評

方向紮實，四層金字塔的設計有說服力，RL for memory navigation 也是合理的訓練策略；但 9B 打贏 397B 的結果需要讀者自行確認 baseline 設置是否公平，且三個 benchmark 都偏向 conversational memory，對 tool-heavy 或 coding agent 場景的泛化性尚未證明。
[!warning] 🎬 
### 給你的 take-away

- 如果你正在設計 Agent 記憶模組：把記憶分層（raw / structured / topic / profile）是值得直接借用的架構，比單一向量庫更能應對「需要不同粒度」的查詢
- 如果你在評估 Mem0 / Zep 等現成方案：NapMem 的 benchmark 可以作為你自己測試的基準框架，特別是 LongMemEval 已是業界認可的評測集

---


## 論文二｜Agent Data Injection Attacks are Realistic Threats to AI Agents

**作者**: 多位研究者 · Seoul National University / University of Illinois Urbana-Champaign / Largosoft　·　**arxiv**: 2607.05120
**連結**: [arxiv](https://arxiv.org/abs/2607.05120) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05120)
[!tip] 🎯 
### TL;DR

一種新的攻擊方式：不用偽裝成「指令」，只要偽裝成「可信資料格式」就能讓 Agent 做壞事——Claude Code、Codex、Gemini CLI 和三個 web agent 全部中招，可以被遠端執行任意程式。
[!success] ⭐ 
### Read Priority

必讀
直接點名 Claude Code / Codex / Gemini CLI 有漏洞，且提出了新攻擊分類，做 Agent 安全或部署 coding agent 的工程師必看；Hacker News 等媒體已廣泛轉載，有公開披露壓力。
[!quote] 🧭 
### 領域背景

過去 Indirect Prompt Injection（IPI）研究主要聚焦在「指令注入」：把假指令藏在 Agent 讀到的文件裡，希望 Agent 誤認為是使用者的指令。現有防禦（如 input sanitization、instruction filtering）主要針對這個模式。但研究者發現：如果攻擊者不偽裝成指令，而是偽裝成 Agent 應該信任的「資料格式本身」（如 JSON key、tool response schema、resource ID），防禦幾乎無效。

### 中階導讀


#### 問題

想像一個 coding agent 在 GitHub 讀 issue comments 然後提交 fix。攻擊者如果貼一個看起來像「maintainer 指令」的 comment，agent 可能認出這是社交工程而拒絕；但如果攻擊者貼一個偽裝成合法 JSON response 格式的 payload，讓 agent 誤以為這是某個 tool call 的合法回應，agent 就會照著「回應」裡的指示執行惡意命令。

#### 方法

論文定義了 **Agent Data Injection (ADI)** 這個新類別，分兩種手法：
1. **Security-critical metadata injection**：偽造 resource identifiers、data origin 標記，讓 Agent 以為它在讀可信來源
1. **Agent context data injection**：偽裝成 tool call / response 的格式，讓 Agent 誤判自己剛收到某個工具的執行結果
論文在真實系統上做實驗，包含 web agents（Claude in Chrome、Antigravity、Nanobrowser）和 coding agents（Claude Code、Codex、Gemini CLI）。

#### 為什麼重要

這個攻擊向量在「Agent 讀外部資料」的所有場景都成立——網頁內容、GitHub issue、資料庫回傳、API response。它繞過了現有 IPI 防禦，且難以用簡單的 filter 解決，因為惡意 payload 本來就「看起來像合法資料」。對 Agent 平台而言，這意味著不能只做 prompt-level 防禦，必須在 data pipeline 層也加保護。

### 深入要點

- **ADI vs. 指令注入**: 指令注入藏「做 X」的文字；ADI 藏「看起來像系統回傳的結果，告訴 Agent X 已完成／X 是合法的」，繞過了認識到「這是外來指令」的防禦邏輯
- **Web Agent 攻擊**: 對 Claude in Chrome、Antigravity、Nanobrowser 發動 fake UI element 攻擊，讓 agent 點擊攻擊者指定的元素
- **Coding Agent 攻擊**: 攻擊者在 GitHub issue comment 中貼偽裝成 maintainer 批准的 JSON payload，觸發 Claude Code / Codex / Gemini CLI 執行惡意命令（**RCE**）
- **攻擊成功率**: JSON delimiter injection 成功率 **31.3%–43.3%**；web data 格式 **33.3%–100.0%**；⚠️ 對部分 agent 高達 100% 成功率需注意可能是 cherry-picked 場景
- **繞防禦**: 對現有 purpose-built IPI 防禦，ADI 成功率仍達 **50%**；而傳統 order-smuggling 攻擊在這些防禦下幾乎全被擋掉
- **Supply-chain 維度**: 若攻擊者能操控 npm/PyPI package 的 README 或 changelog，可以透過 coding agent 的 package 讀取行為觸發 RCE——這個 supply chain 場景尤其危險
- **Limitation**: 實驗在特定 agent 版本上進行，廠商更新後可能部分緩解；文中未討論 LangGraph / AutoGen 等 framework 層的防禦可能性
- **對應策略**: 需要在 data parsing 層對 structural format 進行 sandboxing，以及在 tool response 層做來源簽名驗證
[!bug] 🧐 
### Reviewer 一句話評

問題提得好且有實際危害，直接在主流 coding agent 上跑通 RCE 有說服力；但 33.3%–100% 的成功率範圍太寬，缺乏統一的評測協定（如 AgentDojo），讓跨論文比較困難，偏向漏洞報告而非系統性研究。
[!warning] 🎬 
### 給你的 take-away

- 如果你的 Agent 會讀外部資料（網頁、GitHub、API）：現在就審視 tool response parsing 路徑，確保 structural delimiters（JSON key、XML tag）不能被外部資料覆蓋
- 如果你在部署 coding agent：讀 issue comment / PR review 這類場景應加 context isolation——把 agent 讀到的程式碼或 comment 明確標記為「不可信資料層」而非「系統指令層」

---


## 論文三｜Agent Skill Security: Threat Models, Attacks, Defenses, and Evaluation

**作者**: Sanket Badhe, Priyanka Tiwari　·　（機構未明確披露）　·　**arxiv**: 2607.13987
**連結**: [arxiv](https://arxiv.org/abs/2607.13987) · [alphaxiv](https://www.alphaxiv.org/abs/2607.13987)
[!tip] 🎯 
### TL;DR

MCP tool / Agent Skill 從「發布到 repository」到「被執行」再到「版本更新」的每個環節都有安全漏洞；用 327 個真實技能跑測，每個生命週期階段都找到可被利用的弱點。
[!success] 📖 
### Read Priority

略讀
如果你在用或維護 MCP servers / Claude Skill 生態，這篇的威脅分類法值得收藏作為安全設計 checklist；但論文作者機構不詳，數據驗證程度有限，不宜直接引用具體數字。
[!quote] 🧭 
### 領域背景

可重用的 Agent 技能（skill / tool / MCP server）讓 Agent 能力可以像 npm 套件一樣被打包、分享、組合。這個生態正在快速成長——OpenAI Plugin、Claude Skill、LangChain Hub、MCP Registry 都在走這條路。但研究對「skill 的安全」幾乎都聚焦在執行期（runtime），忽略了 skill 在被選中之前的搜尋、審核、以及被更新後的演化階段是否可被攻擊。

### 中階導讀


#### 問題

假設你的 Agent 從公開的 skill repository（如 MCP Registry）搜尋「能寄 email 的工具」。攻擊者可以：(1) 上傳一個描述裡寫「超安全超好用」但藏有惡意邏輯的 skill；(2) 優化 skill 的 description embedding，讓它在語義搜尋時排名第一；(3) 等 skill 被廣泛使用後再推送一個「安全更新」，在更新版本中加入後門。這些攻擊發生在 runtime 之前，但現有防禦完全沒考慮到。

#### 方法

論文提出 **SkillSec-Eval**，一個生命週期視角的安全評估框架。威脅分類涵蓋五個階段：
1. **Repository admission**：惡意 skill 如何通過審核進入 repo
1. **Semantic retrieval**：操控 embedding 讓惡意 skill 被優先搜尋到
1. **Planner selection**：透過誤導性 metadata / description 騙 planner 選中
1. **Execution**：multi-step workflow 中的跨 skill 互動產生意外行為
1. **Skill evolution**：版本更新後悄悄引入惡意邏輯
在 327 個真實世界 skill 上進行實驗，驗證每個階段都確實存在漏洞。

#### 為什麼重要

隨著 MCP 生態擴大，Agent 平台對第三方 skill 的依賴越來越深。論文揭示的問題不是「執行時 prompt injection」，而是供應鏈層面的系統性風險。這跟軟體工程的 dependency confusion 和 typosquatting 攻擊非常類似，但 Agent 的「自動選 skill」行為讓這個問題更難用人工審查解決。

### 深入要點

- **五階段威脅分類**: Repository → Retrieval → Planning → Execution → Evolution，每個階段有對應的攻擊手法和防禦建議
- **327 個真實 skill**: 實驗規模算是同類研究中較大的，且用的是真實世界存在的 skill 而非合成資料
- **Embedding manipulation**: 攻擊者可以最佳化 skill description，讓它在 semantic search 中排名比合法 skill 更高——類似 SEO poisoning
- **Planner 欺騙**: 修改 skill 的 name / description / example，讓 LLM planner 在選工具時偏向選惡意 skill
- **Multi-step 組合攻擊**: 在複雜 workflow 中，惡意 skill 可能利用「前一個 skill 的輸出」觸發惡意行為，難以在單一 skill 審查時發現
- **版本更新後門**: skill 的 semantic similarity 在版本間維持穩定（讓搜尋仍命中），但執行邏輯悄悄變化
- **LangGraph / AutoGen / MCP 關聯**: 論文描述的生命週期威脅直接對應 MCP Registry 的架構，且 AutoGen 的 skill hub 也有類似曝險面
- **⚠️ 侷限**: 作者機構未披露，部分防禦建議（如「admission-time static analysis」）較籠統，缺乏具體實作；benchmark 設計由作者自建，未用第三方測試集驗證
[!bug] 🧐 
### Reviewer 一句話評

威脅分類有系統性、切中 MCP 生態的真實痛點，框架設計值得被業界採納；但作者機構不透明、防禦側偏概念層、數據缺乏 external validation，整體偏向業界白皮書而非頂會研究水準。
[!warning] 🎬 
### 給你的 take-away

- 如果你在維護 MCP server 或 Agent skill 生態：把 SkillSec-Eval 的五階段威脅清單當作安全 review checklist，在每個 skill 上架和版本更新時都過一遍
- 如果你在用第三方 skill（MCP tool）：優先選有明確 maintainer、有公開 changelog 和版本 hash 驗證的 skill；避免直接採用 semantic search 排名第一但文件薄弱的 skill


## 參考資料

- [arxiv:2607.05794](https://arxiv.org/abs/2607.05794)
- [arxiv:2607.05120](https://arxiv.org/abs/2607.05120)
- [arxiv:2607.13987](https://arxiv.org/abs/2607.13987)
