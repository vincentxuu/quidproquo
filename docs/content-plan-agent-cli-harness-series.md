# Content Plan：Agent CLI、Harness 與 Meta-harness 系列分工

狀態：規劃草案  
建立日期：2026-09-10  
研究底稿：[ZeroStack 同類與相鄰 coding-agent 專案地圖](../.research/2026-09-09-zerostack-similar-projects.md)

## 目的

本站已經有大量 Agent CLI、harness 與 Looplane 文章，缺口不是文章數量，而是讀者不容易判斷每個系列分別回答什麼問題。這份規劃把相關內容分成四層，避免把產品選型、通用 harness 原理、跨 CLI runtime 管控與 Looplane 實作混在同一系列。

核心閱讀路徑：

```text
Agent CLI 選型指南
「我要用哪一個產品？」
        ↓
AI Agent 實戰
「為什麼需要 context、harness、memory 與 workflow？」
        ↓
跟成熟 coding agent 學設計
「agent loop、runtime adapter、meta-harness 要怎麼設計？」
        ↓
Looplane 架構拆解
「這些邊界在一個真實專案裡如何落地？」
```

## 收錄邊界

直接母群：能讀寫 repository、執行工具並持續多輪工作的 coding-agent CLI／native harness，以及將這些 CLI 當成可替換 runtime 的 meta-harness／control plane。

相鄰母群：IDE Agent、遠端 Agent 平台、sandbox、session manager、通用 workflow orchestrator。這些項目可以作比較案例或延伸閱讀，但不與原生 coding-agent CLI 排在同一張產品榜。

選案不以 stars 單獨決定。專案升級成專文前至少檢查：原生 loop、授權、可安裝性、release／commit 活性、contributor 結構、真實 issue／PR、權限模型，以及 README 宣稱能否由原始碼或實測支持。

## 系列一：Agent CLI 選型指南

- 公開頁面：<https://quidproquo.cc/series/agent-cli/>
- 目標讀者：想挑選日常 coding agent 的開發者
- 聚焦問題：我該用哪個產品？
- 邊界：談安裝、價格、模型、UX、開源程度與適用情境；深入的 loop、adapter、control plane 留給「跟成熟 coding agent 學設計」。
- 現況：30 篇。

### 現有內容清單

| order | 主題 | 規劃判定 |
| --- | --- | --- |
| 1 | Agent CLI 完整指南 | 保留為入口；更新為分層選型地圖 |
| 2–3 | Claude Code 介紹／方案分析 | 保留；日後處理內容重疊 |
| 4–5 | Codex CLI 介紹／方案分析 | 保留；日後處理內容重疊 |
| 6–8 | Gemini CLI、Antigravity CLI、Google 方案分析 | 保留為產品轉型案例；整合重複敘事 |
| 9–10 | OpenCode 介紹／方案分析 | 保留；日後整合 |
| 11 | Pi Coding Agent | 保留；連往 harness 設計系列 |
| 12–15 | Cursor、Kiro、Aider、GitHub Copilot CLI | 保留 |
| 16–20 | OMP、Amp、Claw Code、Goose、Warp | 保留；Claw Code 加強來源風險標註 |
| 21 | 訂閱方案比較 | 保留；屬產品選型核心 |
| 22 | Multi-model Routing 開源工具 | 建議改掛「AI Agent 實戰」，此處只保留站內連結 |
| 23–30 | OMP 2、Pi v2、OpenCode 2、DeepSeek Harness、Antigravity 重寫、Muse Code、Grok Build、Harness 大戰 | 產品新聞可留；深層 harness 架構文章改掛或交叉連結至「跟成熟 coding agent 學設計」 |

### 可新增的產品專文

| 優先度 | 專文 | 聚焦問題 | 前置證據 |
| --- | --- | --- | --- |
| P1 | VT Code：Rust 多 Provider Coding Agent | 它是否是功能形狀最接近 ZeroStack、但更完整的選擇？ | README、架構、permission、MCP／ACP、實際安裝 |
| P1 | Octomind：同一 Agent Engine 的 CLI、Pipe、Daemon 與 ACP | 多入口是否真的共用一套可靠 runtime？ | 原始碼 trace、daemon／WebSocket／ACP 實測 |
| P1 | Microsoft Amplifier：模組化 Agent CLI 的 Early Preview | bundle、module、agent、behavior 如何組合？ | 官方 README、core／foundation／CLI 關係、安全警告 |
| P1 | Omnigent：把 Codex、Claude 等 Harness 放在同一控制層 | 它是產品、meta-harness 還是 agent 平台？ | 官方 harness 文件、支援矩陣、session／permission 實測 |
| P2 | ZeroStack：最小 Rust Coding Agent 的原始碼拆解 | 小核心實際省掉什麼，又犧牲什麼？ | 原始碼、同機 benchmark；未驗證前不寫成推薦文 |
| P2 | Crush：Terminal-native 多模型 Coding Agent | 它在成熟 CLI 與新興 harness 之間的位置？ | 活性、授權、安裝與任務實測 |
| P3 | 新興 Rust Harness 雷達：tau、Aether、Forge | 哪些只是漂亮 README，哪些值得持續追蹤？ | 每季更新 metadata 與最小 smoke test |

### 不單獨寫專文的候選

- `microsoft/amplifier-agent`：作為 Amplifier 的可嵌入 engine 子題，不獨立進榜。
- Claw Code 的其他同名 repo：先釐清專案身分與數據，未完成前只保留風險註記。
- OpenHarness、OpenAgere、OpenDev、Agent Code、CodingBuddy、RA.Aid：先進季度雷達，達到證據門檻再升專文。

## 系列二：AI Agent 實戰

- 公開頁面：<https://quidproquo.cc/series/ai-agent-systems/>
- 目標讀者：要理解通用 Agent 系統工程、但不一定正在實作 coding agent runtime 的讀者
- 聚焦問題：模型外面的 context、harness、memory、workflow 與組織協作為何重要？
- 邊界：保留通用原理與業界模式；具體 CLI adapter、event protocol、capability handshake 放到下一系列。
- 現況：8 篇。

### 現有內容清單

| order | 文章 |
| --- | --- |
| 1 | Context Engineering：為什麼問題出在資訊，不在模型 |
| 2 | Anthropic 的 Harness Design |
| 3 | 從 Prompt 到 Harness：AI 工程的三次演化 |
| 4 | Harness Engineering 進階模式：Tool Registry、Guard、Checkpoint-Resume |
| 5 | 從 Stripe 到 Meta：企業內部 Coding Agent |
| 6 | Agentic Engineering：讓 Agent 像工程團隊協作 |
| 7 | Agentic Engineering 的記憶問題 |
| 8 | OpenAI Codex 的 Harness Engineering 實戰 |

### 可新增清單

| 建議 order | 專文 | 聚焦問題 |
| --- | --- | --- |
| 9 | 模型只是元件：Harness 為什麼成為 Agent 產品的護城河 | 同模型換 harness 為何產生巨大差異？ |
| 10 | Native Harness、Meta-harness、Agent Framework 到底差在哪 | 解決 harness 一詞同時指產品、runtime、評測架構的混亂 |
| 11 | Control Plane 與 Execution Plane：Agent 系統的責任怎麼拆 | 誰擁有政策、session、credentials、audit 與執行環境？ |

這三篇只建立通用心智模型。Omnigent、DeepSeek Harness 與 Looplane 的程式級比較放進下一系列。

## 系列三：跟成熟 coding agent 學設計

- 公開頁面：<https://quidproquo.cc/series/coding-agent/>
- 目標讀者：正在打造 coding agent、runtime adapter 或 control plane 的工程師
- 聚焦問題：成熟 coding agent 如何實作 loop、workspace、權限、session、擴充、外部 runtime 與服務化？
- 現況：中文 39 篇，已有英文對應版。
- 判定：這才是 meta-harness 新文章的主要歸屬；先前把它放到「AI Agent 實戰」只是次佳選擇。

### 現有內容分組

| orders | 模組 | 已涵蓋主題 |
| --- | --- | --- |
| 1–5 | 最小安全閉環 | 系列總覽、agent loop、workspace、approval、verification |
| 6–9 | Provider 與外部 runtime | ModelProvider、retry、subscription boundary、外部 CLI backend |
| 10–15 | 工具與使用介面 | edit tool、sandbox、small-model eval、CLI UX、onboarding、TUI |
| 16–22 | Runtime 與執行契約 | capability handshake、startup、tool surface、session、artifacts、headless、gateway |
| 23–25 | 工程紀律 | Python 取捨、fake-CLI／recorded stream 測試、prompt versioning |
| 26–31 | Context、安全與擴充 | compaction、memory、dangerous command、OS sandbox、MCP、hooks／skills／plugins |
| 32–38 | 分工與產品化 | subagent、replay、telemetry、model routing、LSP、code mode、Agent as a Service |
| 39 | TUI 細節 | 工具結果無閃爍顯示 |

### 最直接的既有前置文章

- Order 9〈外部 CLI 當 backend——包別人的 loop，安全邊界畫在哪〉：已建立 external runtime 的安全問題。
- Order 16〈Runtime 抽象與 capability handshake〉：已建立不同 runtime 能力不可假設一致。
- Order 20〈Run artifacts 契約〉：已建立跨 runtime 仍需統一的審計輸出。
- Order 21〈Headless 模式與 CI 使用〉：已建立無人值守時的 approval 問題。
- Order 24〈測試一個會動的 agent〉：已有 fake CLI 與 recorded stream 測試方法。
- Order 33〈Session 錄製與 replay〉：已有事件與恢復語意。
- Order 38〈Agent as a Service〉：已有把 loop 包成外部可呼叫服務的另一條路。

### 可新增清單：Meta-harness 弧線

| 建議 order | 專文 | 聚焦問題 | 對應專案專文 |
| --- | --- | --- | --- |
| 40 | Agent CLI 正在變成 Runtime：從 Native Harness 到 Meta-harness | 為什麼上層系統開始把 coding CLI 當可替換引擎？ | 先讀 DeepSeek Harness、Omnigent、Looplane ExternalCodingRunner |
| 41 | Omnigent、DeepSeek Harness 與 Looplane：三種控制層路線 | 原生 loop、plugin kernel、外部 harness 管控如何取捨？ | Omnigent 新專文；DeepSeek Harness既有專文；Looplane既有專文 |
| 42 | 統一 Run Contract：RunSpec、Events、Artifacts 與 Result | 不同 CLI 的輸入輸出如何正規化而不丟失語意？ | Omnigent、`twaldin/harness`、oneharness 作案例 |
| 43 | Session Ownership：跨 CLI 的 Resume、Cancel、Fork 為何最難 | control plane 能否真正接管下層 CLI 的生命週期？ | Looplane orders 7、12；coding-agent orders 19、33 |
| 44 | Permission Ownership：雙重 Approval 與 Confused Deputy | 上層和下層都有權限系統時，最後誰說了算？ | Codex、Claude Code、Looplane、DeepSeek Harness |
| 45 | Capability Handshake 實作：不要把所有 Agent CLI 當成一樣 | 如何宣告 edit、stream、resume、MCP、sandbox、usage 等能力？ | 延伸既有 order 16 |
| 46 | 多 Runtime Conformance Test | 如何用 fake CLI、recorded stream 與真實 smoke test 防止 adapter 漂移？ | 延伸既有 order 24 |

### 每篇範圍卡

#### Order 40：Agent CLI 正在變成 Runtime

- 講：native harness、external runtime、meta-harness、control plane 四個詞；產業為何往上疊一層。
- 不講：各家 adapter 細節與完整產品評比。
- 讀完後能：判斷一個專案是在擁有 agent loop，還是在管控別人的 loop。
- 前置：orders 1、9、16。

#### Order 41：Omnigent、DeepSeek Harness 與 Looplane

- 講：三者對 agent loop、plugin、external CLI、workspace、verification 的 ownership。
- 不講：泛泛的功能 checklist；每個產品的安裝教學留在專文。
- 讀完後能：依控制深度與維護成本選擇 native、external 或 hybrid。
- 前置：order 40，以及三篇專案介紹。

#### Order 42–46：控制層契約

- 講：run、event、session、permission、capability、conformance 六個跨 runtime 契約。
- 不講：模型好壞或供應商價格比較。
- 讀完後能：設計一個不假設所有 CLI 能力相同的 adapter system。
- 前置：orders 9、16、19、20、21、24、33。

## 系列四：Looplane 架構拆解

- 公開頁面：<https://quidproquo.cc/series/looplane/>
- 目標讀者：希望看見上述抽象如何落到真實 code path、failure boundary 與測試的人
- 聚焦問題：Looplane 的 native lane、external lane、安全邊界與遠端執行如何實作？
- 現況：20 篇（order 0–19）。

### 現有內容清單

| orders | 模組 | 文章 |
| --- | --- | --- |
| 0–3 | 入口與輸入 | 架構地圖、TUI／CLI、disposable workspace、prompt／instructions／memory |
| 4–7 | 兩條 runtime lane | native loop、ModelProvider、多閘道路由、ExternalCodingRunner |
| 8–11 | 工具權限 | tool isolation、permission layering、OS sandbox、tool transactions |
| 12–16 | 狀態與擴充 | event journal、compaction、MCP、skills／hooks／plugins、subagent |
| 17–19 | 嵌入與部署 | SDK／WebSocket、IDE／LSP、Cloudflare remote execution |

### 可新增清單

| 建議 order | 專文 | 聚焦問題 |
| --- | --- | --- |
| 20 | Looplane External Runtime Adapter Matrix | OpenCode、Pi、OMP、Codex、Claude 的實際能力與缺口如何表示？ |
| 21 | Looplane 的 Cancellation 與 Process Ownership | subprocess、process group、timeout 與 crash 後清理如何一致？ |
| 22 | Looplane 的 Cross-runtime Conformance Suite | native 與 external lane 如何用同一組行為契約驗收？ |
| 23 | Looplane 的 Multi-runtime Scheduler | fallback、parallel、reviewer lane 與 workspace conflict 如何治理？ |

這四篇必須建立在實際 code 與測試已存在的前提上；若功能尚未落地，先寫規格或研究筆記，不寫成已完成的架構專文。

## 專案專文與比較文依賴

比較文不能要求讀者先接受一段壓縮過度的產品描述。重要案例先有專文，再在比較文引用。

| 專案 | 現有專文 | 是否需要新增 |
| --- | --- | --- |
| Claude Code | 有，多篇 | 否；處理重複即可 |
| Codex CLI | 有，且另有架構導讀 | 否 |
| OpenCode | 有，多篇 | 否 |
| Pi／OMP | 有，且有深入系列 | 否 |
| DeepSeek Harness | 有 plugin-kernel 專文 | 補 conductor／external CLI 生態段落或另寫續篇 |
| Looplane | 有完整架構系列 | 否 |
| Omnigent | 無 | 是，P1 |
| Microsoft Amplifier | 無完整專文 | 是，P1 |
| VT Code | 無 | 是，P1 |
| Octomind | 無 | 是，P1 |
| ZeroStack | 無 | 視原始碼與 benchmark 證據決定；可先放橫向案例 |
| tau／Aether／Forge | 無 | 先合併季度雷達，不急著各寫一篇 |

## 斷崖報告

| 位置 | 問題 | 建議處理 |
| --- | --- | --- |
| Agent CLI orders 21→22 | 從產品／訂閱突然跳到 routing infrastructure | routing 全文改掛 AI Agent 實戰；CLI 系列保留導讀連結 |
| Agent CLI orders 22→23 | 從路由工具跳回 OMP 2 重寫史 | 將 orders 23–26 的架構文章交叉掛到 coding-agent 系列，入口頁按類型分區而非單線閱讀 |
| AI Agent 實戰 order 8→meta-harness | 從企業案例直接進 CLI adapter 技術細節 | 先加「Harness 名詞與 control/execution plane」兩篇橋接文 |
| coding-agent order 39→40 | 從 TUI 細節跳到 meta-harness 產業層 | order 40 開頭回顧 orders 9、16，建立 native→external→meta 的動機 |
| 專案介紹→比較文 | Omnigent 等新案例沒有站內前置 | 先完成 P1 專文，再寫三方比較 |

## 建議執行順序

1. 更新 Agent CLI 入口篇：加入四層地圖與跨系列導航，不立即重排全部 30 篇。
2. 寫 Omnigent 專文，補齊 meta-harness 代表案例。
3. 寫 Microsoft Amplifier 專文，補齊模組化 native platform 代表案例。
4. 更新 DeepSeek Harness 或寫續篇，查清 conductor／session-import 是核心還是外掛生態。
5. 寫 coding-agent order 40：Agent CLI 正在變成 Runtime。
6. 寫 order 41：Omnigent、DeepSeek Harness、Looplane 比較。
7. 依實作進度寫 orders 42–46 的跨 runtime 契約。
8. 最後才決定是否替 ZeroStack、VT Code、Octomind各寫專文；其中 VT Code、Octomind優先於 ZeroStack。

## 實施邊界

- 本文件只規劃，不修改任何已發佈文章的 `series.order`。
- 若要重排或改掛現有文章，中文與英文版必須一起調整。
- 全面重排會超過 20 個檔案，依治理規則需先取得使用者確認。
- 新文章一律先完成官方來源查證；涉及小型專案的 benchmark、stars、效能與安全宣稱不得只引用作者 README。
- 每篇完成後用站內連結建立三層導航：產品專文 → harness 原理 → Looplane 實作。

## 偏誤與未回答問題

- 盤點偏向英文 GitHub 公開專案；中國與其他非英語社群若只在自有平台發布，可能低估。
- stars 偏好早期專案與大廠品牌，不能代表實際採用或可靠性。
- 尚未對 ZeroStack、VT Code、Octomind、tau、Aether、Forge 做同機同模型 benchmark。
- 尚未實測 Omnigent 對各 Agent CLI 的 cancel、resume、permission 與 event fidelity。
- DeepSeek Harness 的外部 CLI 管控能力需要區分核心功能、官方 bundle 與第三方 plugin，不能合併宣稱。
- Agent CLI、agent harness、evaluation harness、meta-harness 尚無所有專案共同接受的嚴格命名；文章需先聲明本文定義。
