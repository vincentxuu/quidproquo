---
title: "AI Agent Arxiv Digest — 2026-11-18"
date: 2026-11-18
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇分別戳破三個預設：經驗與記憶在工具介面悄悄變動後反而成為負債、自我改進不需要靠大量下游評測就能做到、而主流 agent 編排框架的授權邊界其實還沒做好"
tldr: "Experience Rot 顯示工具介面被悄悄改動時，帶著舊經驗的 agent 全面輸給新手，還會誤判自己已完成任務；ELITE 用免評測的確定性 gate 讓 coding agent 在 SWE-bench Pro 從 60.0% 衝到 85.6%，比對手快 8.8 倍；LangChain、LangGraph、AutoGen、OpenClaw 四個框架在 12 個 OWASP 對應實驗裡全部出現提示注入或未授權工具執行"
series:
  name: "AI Agent Arxiv Digest"
  order: 178
---

## 今日總覽

今天三篇從不同角落戳破 Agent 系統裡被當成常識的三個預設。第一篇用六個模型做預註冊實驗證明：當工具介面被悄悄改動，帶著舊經驗的 agent 反而比什麼都不懂的新手更容易失敗，還會誤判自己任務成功。第二篇示範一套完全不靠下游評測的自我改進迴圈，讓 coding agent 在 SWE-bench Pro 上從 60.0% 衝到 85.6%，而且比需要大量評測的對手快了 3 到 9 倍。第三篇在 LangChain、LangGraph、AutoGen、OpenClaw 四個正式上線的編排框架裡，逐一驗證 OWASP 列出的十大 Agent 風險，四個框架全部中獎。三篇合起來說的是同一件事：Agent 系統現在卡關的地方，已經從「模型夠不夠聰明」轉移到「怎麼記住、怎麼進化、怎麼授權」這些系統工程細節，而這些細節目前都還沒做對。

```diagram
title: 今天戳破的三個 Agent 系統層級
desc: 由下往上依序是單一 agent 的記憶與經驗、單一 agent 的自我進化迴圈，以及多 agent 協作時才會出現的授權與信任邊界；今天三篇論文各自在其中一層給出可量化的落差。
caption: 由下往上的排序是編輯分類（個體 → 多 agent 協作），不代表三篇論文之間有因果或依賴關係。
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M36 232V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="16" y="12" dominant-baseline="central">多 agent 協作</text>
  <text class="dg-tag" x="16" y="248" dominant-baseline="central">單一 agent</text>

  <rect class="dg-box" x="72" y="24" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="40" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="40" dominant-baseline="central">授權與信任邊界</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">四個編排框架都測出提示注入、未授權工具執行</text>

  <rect class="dg-box" x="72" y="88" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="104" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="104" dominant-baseline="central">自我進化迴圈</text>
  <text class="dg-sub" x="124" y="128" dominant-baseline="central">免評測確定性 gate，效率提升 8.8 倍</text>

  <rect class="dg-box" x="72" y="152" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="168" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="168" dominant-baseline="central">記憶與經驗</text>
  <text class="dg-sub" x="124" y="192" dominant-baseline="central">工具介面悄悄變動，老手輸給新手</text>
</svg>
```

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| MCP（Model Context Protocol） | 讓 Agent 呼叫外部工具／服務的標準介面協定；工具的參數或行為可能隨時更新 |
| 工具介面靜默變更 | 服務端更新了工具的參數或行為，但沒有版本警示，呼叫方只能自己發現 |
| 遞迴自我改進（Recursive Self-Improvement, RSI） | 讓 Agent 自己修改、進化自己的程式碼或策略，一輪一輪疊代變強 |
| OWASP Top 10 for Agentic Applications | 資安社群為 agent 應用整理的十大風險分類，涵蓋提示注入、未授權工具執行等 |
| Agent 編排框架（Orchestration Framework） | 像 LangChain、LangGraph、AutoGen 這類幫你串接多個 Agent、工具、記憶的開發框架 |
| 信任邊界（Trust Boundary） | 系統裡「誰可以要求誰做什麼」的界線；邊界沒守住，一個 agent 的錯誤或惡意指令就能擴散到別的 agent |

---

## 論文一｜經驗反而是負債：工具介面悄悄變了，老手輸給新手

**Experience Rot: Experienced Agents Fail Where Novices Succeed**
Zhen Xu, Hang Yin, Zitao Zhang et al.（University of Chicago + eBay + University of Florida）　·　arxiv: 2611.20922

連結: [arxiv](https://arxiv.org/abs/2611.20922) · [alphaxiv](https://www.alphaxiv.org/abs/2611.20922)

### TL;DR

當 MCP 工具介面被悄悄改動，帶著經驗／記憶的 agent 反而比沒有任何背景知識的新手更容易失敗，還會誤判自己已經完成任務。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 1-2 天，尚無引用資料 |
| 機構 | University of Chicago + eBay + University of Florida（跨學界／業界） |
| 社群反應 | 未見於 HF Daily Papers 社群策展；Substack 部落格當日已有外部媒體討論，屬媒體拾取非學術引用 |
| 可信度 | 通過 — 多數條件預註冊、10,000 次 cluster bootstrap；三臂對照（無經驗／有效經驗／過期經驗）；記憶形式與補救措施消融 |
| 證據成熟度 | 較完整 — 跨 6 個模型、機制層級診斷（查文件率、讀回行為） |
| 可復現性 | 部分產物 — 附錄列出 prompt／任務設定，但未見程式碼或資料集公開連結 |
| 為什麼選這篇 | 直接 — 任何用 MCP 或類似工具協定、帶記憶的 agent 都可能遇到這個失敗模式 |
| 方向新意 | 實質增量 — 首次用預註冊實驗把「經驗反而有害」拆解成查文件率／讀回行為等可測量成分 |
| 今日重要性 | 高 — 帶記憶的 agent 平台正在量產部署，這篇直接戳破「經驗一定是資產」的預設 |
| 實務連結 | 明確 — 依賴快取／記憶的工具呼叫系統，都該檢查介面版本而非照抄舊呼叫模式 |
| 編輯信心 | 高 — 預註冊設計＋統計方法＋機制診斷，足以支持文章採用的敘述強度 |
| 閱讀建議 | 必讀 — 所有在生產環境跑 agent 記憶／skill 快取的團隊 |
| 主要限制 | 三個測試服務（日曆／待辦／信箱）皆為作者自建的合成環境，非真實生產 MCP 部署 |

### 領域背景

Agent 跨多輪、多會話執行任務時，通常被鼓勵累積「經驗」——記住以前怎麼解決問題、怎麼呼叫工具。但工具／API 本身會隨時間演進，過去的研究大多假設介面穩定，很少專門測試「介面變了，經驗還有沒有用」。

### 中階導讀

- **問題**：想像你用慣了一個行事曆 App 的 API，某天開發者悄悄把「新增事件」的參數或行為改了，卻沒有任何通知。一個從沒用過這個 API 的新手會乖乖去讀最新文件；而一個用了很久、記得舊呼叫方式的老手，反而會憑印象硬套舊格式——結果失敗。
- **方法**：研究團隊設計三個合成 MCP 服務（日曆、待辦、信箱），在其中悄悄改動工具介面，比較三種 agent：完全沒經驗的新手、帶著「正確但已過期」經驗的老手、以及中間對照。同時測試四種記憶形式（對話記錄／檔案／檢索式／skill 封裝）和多種補救機制（提醒 agent 重新檢查文件、修改筆記等）。
- **為什麼重要**：結果顯示，補救機制幾乎都沒用——不是因為記得的內容不對，而是因為 agent 根本沒有「我該重新確認現狀」這個反射動作。更麻煩的是，失敗的 agent 常常還自信地回報「任務完成」。

### 深入要點

- 跨 6 個測試模型，帶過期經驗的 agent 全部表現不如新手 :warning:（作者自建合成環境，非真實生產 MCP 服務）
- 失敗機制可拆解：查文件率下降、讀回（re-check）行為減少，是「懶得確認現狀」而非「記錯內容」
- 提醒重新檢查文件、要求修改筆記等補救措施，效果有限
- 失敗的 agent 時常誤判自己已完成任務，形成雙重風險（做錯＋不自知）
- 作者引用 Todoist 真實 API 分歧案例與 SilentProbe 統計佐證「介面悄悄變動」在真實世界確實常見
- Limitation：三個測試服務皆為作者自建的合成環境，外推到真實生產環境的幅度未經驗證

### Reviewer 一句話評

實驗設計夠嚴謹（預註冊＋機制拆解），足以支持「經驗可能變成負債」這個限縮主張；但要小心別把合成環境裡的具體下降幅度，直接套用到自己的生產系統。

### 給你的 take-away

- 如果你在維護有記憶／skill 快取的 agent 系統：別只靠「agent 以前做對過」當信號，替工具介面加版本偵測或強制重新確認機制。
- 如果你在設計 agent 評測：把「任務完成」的自評和外部驗證分開記錄，這篇顯示兩者在失敗情境下會系統性地脫鉤。

---

## 論文二｜不用評測也能自我進化：ELITE 讓 Coding Agent 甩開大量評測成本

**Evaluation-Free Recursive Self-Improvement for Coding Agents (ELITE)**
Zhe Ren, Guowei Rong, Yimeng Chen et al.（Jilin University + KAUST）　·　arxiv: 2611.21056

連結: [arxiv](https://arxiv.org/abs/2611.21056) · [alphaxiv](https://www.alphaxiv.org/abs/2611.21056)

### TL;DR

一套完全不靠下游任務評測的自我改進迴圈，讓 coding agent 在 SWE-bench Pro 上從 60.0% 衝到 85.6%，而且比需要上千次候選評測的對手快了 3 到 9 倍。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 1-2 天，尚無引用資料 |
| 機構 | Jilin University (School of AI) + KAUST（含 Jürgen Schmidhuber 所在研究群） |
| 社群反應 | 未見 GitHub 程式碼公開連結；暫無社群策展訊號 |
| 可信度 | 通過 — 主結果誠實揭露 ELITE 分數略低於兩個對照基線；七種設計消融；跨 backbone 可攜性測試；Limitations 段落明確自認範圍受限 |
| 證據成熟度 | 較完整 — 多 backbone、多消融、敏感度分析，但限定單一領域（coding agent） |
| 可復現性 | 未提供 — 全文片段與摘要皆未見程式碼或資料公開連結 |
| 為什麼選這篇 | 直接 — 自我改進迴圈是目前 agent 平台最想解決、成本最高的環節之一 |
| 方向新意 | 實質增量 — 用確定性 gate 取代下游評測，是 RSI 迴圈設計上少見的結構性改動 |
| 今日重要性 | 高 — 效率提升幅度（3-9 倍）足以改變團隊是否敢把 RSI 迴圈排進生產排程 |
| 實務連結 | 明確 — 在跑 Darwin/Huxley Godel Machine 類 RSI 迴圈、苦於評測成本的團隊可以直接參考 |
| 編輯信心 | 高 — 正文誠實揭露 trade-off（效率 vs 絕對分數），敘述強度與證據相符 |
| 閱讀建議 | 必讀 — 在做 coding agent 自我改進／自動化迭代的團隊 |
| 主要限制 | 作者自承 benchmark 範圍受限於 coding agent 選定子集，部分比較僅單次執行，目前只維護單一演化血統 |

### 領域背景

讓 agent 自己修改、進化策略的「遞迴自我改進」（RSI）原本的做法是：每次迭代都要跑一輪下游任務評測，確認新版本真的變好才採用——這一步往往比訓練本身更貴。Darwin/Huxley Godel Machine 這類方法就是代表，評測成本高但被視為必要的把關。

### 中階導讀

- **問題**：想像你每次修改一個 coding agent 的策略，都要讓它跑完整個 SWE-bench 才知道改得好不好——光評測就要跑幾百次。有沒有辦法不用每次都重新考試，還能確定新版本真的進步了？
- **方法**：ELITE 用「Explore-then-Integrate」兩步迴圈：先探索多個候選改動，再用結構／操作有效性的確定性檢查（而非跑下游任務）篩選要整合的版本。關鍵是拿掉確定性 gate 後，效能直接崩潰到 52.0%，證明這個「不跑評測但有把關」的設計是核心。
- **為什麼重要**：對做 RSI 迴圈的團隊，這代表可以用遠低於現在的運算成本跑自我改進，不必犧牲把關品質。

### 深入要點

- SWE-bench Pro：ELITE 85.6%，對照基線 DGM 86.7%、HGM 88.3%——分數略低於基線 :warning:（作者自述複現的基線，非原始論文直接數字）
- 效率對比：ELITE 0 次下游候選評測 vs 基線 810／800 次，帶來 8.8x／3.2x 加速
- 移除確定性 gate 後效能崩潰至 52.0%，證明 gate 是核心機制而非裝飾
- 跨多個模型 backbone 測試可攜性
- Limitation：benchmark 範圍受限於 coding agent、部分比較僅單次執行、目前只維護單一演化血統

### Reviewer 一句話評

誠實揭露「效率優勢，非絕對分數優勢」是這篇最值得信任的地方；但 DGM/HGM 基線是作者自己複現的，不是原始論文直接搬過來的數字，比較時要記得這一層。

### 給你的 take-away

- 如果你在做 coding agent 的自動化迭代／自我進化：可以直接參考 Explore-then-Integrate 的確定性 gate 設計，把評測成本從「每輪都跑」改成「結構有效性檢查」。
- 如果你在評估要不要導入 RSI 迴圈：先問清楚效率數字的基線是不是複現的，再決定要用哪個版本的對照成本當參考。

---

## 論文三｜四個主流 Agent 編排框架，授權邊界全部中獎

**Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks**
Sahaya Jestus Lazer, Kshitiz Aryal, Maanak Gupta et al.（Tennessee Tech University + University of Nebraska Omaha + Purdue University）　·　arxiv: 2611.21259

連結: [arxiv](https://arxiv.org/abs/2611.21259) · [alphaxiv](https://www.alphaxiv.org/abs/2611.21259)

### TL;DR

針對 LangChain、LangGraph、AutoGen、OpenClaw 四個正式上線的 agent 編排框架，做了 12 個對應 OWASP Top 10 for Agentic Applications 的實驗，結果四個框架都出現提示注入、未授權工具執行、記憶污染或跨 agent 信任失效等問題。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（投稿中，尚未定稿至正式會議版） |
| 引用速度 | 發布不到 1 天，尚無引用資料 |
| 機構 | Tennessee Tech University + University of Nebraska Omaha + Purdue University（含資安領域學者 Elisa Bertino） |
| 社群反應 | GitHub 上的 Awesome multi-agent-system 追蹤清單已收錄並正確摘要本文 |
| 可信度 | 通過 — 12 個實驗對應 OWASP Top 10 for Agentic Applications，涵蓋四個真實框架；逐實驗列出 vulnerable vs protected 配置對照；Limitations 明確自認僅測單一模型 |
| 證據成熟度 | 較完整 — 12 個獨立實驗、雙配置對照、OWASP 分類明確，但受限於單一模型與四個框架 |
| 可復現性 | 部分產物 — 列出完整版本號（LangChain 1.2.17、LangGraph 1.1.10 等）與環境規格，但未見明確程式碼／資料集公開連結 |
| 為什麼選這篇 | 直接 — LangChain/LangGraph/AutoGen 是目前最多團隊實際在用的 agent 編排框架 |
| 方向新意 | 實質增量 — 首次系統性地把 OWASP Top 10 for Agentic Applications 逐條對應到四個真實框架做實測 |
| 今日重要性 | 高 — 任何已經在生產環境用這些框架的團隊，今天就該檢查自己有沒有踩到同樣的洞 |
| 實務連結 | 明確 — 直接點名哪個 OWASP 風險類別在哪個框架出現，可以對照自己的部署逐條檢查 |
| 編輯信心 | 高 — 作者自我揭露限制範圍精確，敘述強度與證據相符 |
| 閱讀建議 | 必讀 — 任何用這四個框架之一在生產環境跑多 agent 系統的團隊 |
| 主要限制 | 僅測試單一模型（gpt-4o-mini），企業級 IAM、憑證式驗證與外部政策引擎未全面評估 |

### 領域背景

LangChain、LangGraph、AutoGen 這類編排框架讓開發者快速把多個 agent、工具串接起來，但這些框架原本的設計重心是「讓功能跑起來」，對「誰可以要求誰做什麼」這種授權／信任邊界的系統性測試一直不多。OWASP 近來整理出 Agentic Applications 專屬的十大風險分類，但缺少跨框架的實測資料。

### 中階導讀

- **問題**：想像你用 LangGraph 串了三個 agent 分工合作，其中一個負責讀使用者輸入、一個負責呼叫工具、一個負責寫回資料庫。如果讀輸入的那個 agent 被注入了惡意指令，它能不能直接「借用」呼叫工具的 agent 的權限，去做它本來沒資格做的事？
- **方法**：研究團隊設計 12 個實驗，每個對應 OWASP Top 10 for Agentic Applications 裡的一類風險（提示注入、未授權工具／指令執行、記憶污染、跨 agent 信任失效等），在 LangChain、LangGraph、AutoGen、OpenClaw 四個框架上各跑一遍，每個實驗都同時測「沒防護」與「加了防護設定」兩種配置。
- **為什麼重要**：四個框架在 vulnerable 配置下全部中獎，說明這不是某一家框架沒做好，而是「多 agent 協作」這個設計模式本身，在授權邊界上普遍還沒成熟。

### 深入要點

- 12 個 OWASP 對應實驗，涵蓋 4 個真實框架（LangChain 1.2.17、LangGraph 1.1.10、AutoGen、OpenClaw）
- 四個框架在各自的 vulnerable 配置下，都出現提示注入、未授權工具／指令執行、記憶污染、跨 agent 信任失效中的至少一種
- 加了防護設定（protected 配置）後風險可被壓低，但論文未宣稱任一框架「本質上更安全」
- Limitation：全程僅用單一模型 gpt-4o-mini（作者自述是為了降低模型選擇的變異性），企業級 IAM／憑證式驗證未全面測試
- 作者主動揭露：換用更強、更安全對齊的模型，攻擊成功率可能不同，但框架層缺乏跨元件授權驗證是架構問題，換模型未必能解決

### Reviewer 一句話評

用同一套 OWASP 分類橫跨四個真實框架做對照實驗，是這篇最有價值的地方；但只測了一個相對弱的模型（gpt-4o-mini），換成更強、更安全對齊的模型結果可能不同，別把具體攻擊成功率當成放諸四海皆準的數字。

### 給你的 take-away

- 如果你在生產環境用 LangChain/LangGraph/AutoGen/OpenClaw 跑多 agent 系統：照著 OWASP Top 10 for Agentic Applications 的分類，逐條檢查自己有沒有做本文裡 protected 配置對應的防護。
- 如果你在評估要不要導入多 agent 協作：把授權／信任邊界的測試排進上線前檢查清單，不要假設框架預設設定就是安全的。

---

## 今日收穫

之前以為 agent 系統卡關主要是模型推理能力不夠強，現在發現就算模型夠聰明，系統怎麼記住（Experience Rot）、怎麼進化（ELITE）、怎麼授權（Auth Boundaries）這幾個工程環節，隨便一個沒做對就會讓整套系統失靈——而這三篇說的都是目前主流做法還沒做對的地方。

## 參考資料

- [Experience Rot: Experienced Agents Fail Where Novices Succeed (arXiv:2611.20922)](https://arxiv.org/abs/2611.20922)
- [Experience Rot — alphaxiv](https://www.alphaxiv.org/abs/2611.20922)
- [Evaluation-Free Recursive Self-Improvement for Coding Agents, ELITE (arXiv:2611.21056)](https://arxiv.org/abs/2611.21056)
- [ELITE — alphaxiv](https://www.alphaxiv.org/abs/2611.21056)
- [Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks (arXiv:2611.21259)](https://arxiv.org/abs/2611.21259)
- [Auth Boundaries — alphaxiv](https://www.alphaxiv.org/abs/2611.21259)
- [OWASP Top 10 for Agentic Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
