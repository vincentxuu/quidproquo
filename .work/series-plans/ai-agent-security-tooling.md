# 系列規劃：AI Agent 資安工具地圖（ai-agent-security-tooling）

使用者確認：2026-10-24（使用者對「待使用者決定」五題回覆「好」，視為接受草稿的全部預設：A＋B 兩部分結構、9 篇 order 0–8、母群邊界、order 5 維持「未試跑」且不安裝任何工具、同步出英文版、先做 order 0＋1 再等回覆。若使用者另有調整以後續對話為準並更新本行。）

研究筆記：`.work/research/ai-agent-security-tooling/research-note.md`（最終狀態；原始紀錄在同資料夾 `sources/`，前兩輪在 `.research/2026-10-22-agent-security-tooling/`）。

## 為什麼做這個系列

站上已有 agent 資安的「理論篇」（prompt injection 為什麼無解、信任邊界、harness 層控損、multi-agent 安全），日報也記錄了大量事件，但**沒有一篇回答「那我手上有哪些工具、各管哪一段、可不可靠」**：

1. 沙箱、行為偵測、護欄閘道、AI 紅隊、OWASP Agentic Top 10 在站上幾乎是空白。
2. 日報只零散提過 SkillSpector、Cloudflare 的 audit skill 與 ARTEX，且有幾處歸因錯誤（見研究筆記 §3.3，不在本系列範圍內修）。
3. 讀者最需要的判斷力——「這個工具的數字能不能信」——站上沒有任何一篇在教。

## 目標讀者

- 用 Claude Code、Codex 或 Cursor 寫程式，已經裝過 skill、接過 MCP server 的開發者。
- 聽過 prompt injection，不一定做過資安；不需要懂漏洞利用。
- 兩種動機：(A) 想保護自己的開發環境；(B) 自己也在做產品或 agent，想測試它安不安全。系列分兩部分，讓只想要 A 的人讀完 order 4 就可以停。

不寫給：想要攻擊教學的人；想學資安工具怎麼架設的人（本系列不教安裝，也沒有實跑任何工具）。

## 入口

order 0 是總覽，不是事件文：風險從哪幾個入口進來、各類工具管哪一段、每篇在地圖的哪個位置、為什麼是這個順序。ARTEX 與 HexStrike 等事件放在 order 7 當證據，不當入口。

## 弧線

一條時間軸當骨架，每篇開頭用同一張小地圖標出「現在在哪一段」。第一部分跟著**一個 skill 或 MCP 從進來到被使用**的時間走，第二部分換成**測試自己的東西**。

```
第一部分（保護自己）：  安裝前 → 執行中·限制範圍 → 執行中·動作前把關 → 執行後·看見
第二部分（測試自己的產品）：  審計程式碼 → 測 AI 系統 → 用 AI 打別人（含雙用途風險）
收尾：  怎麼判斷這些工具的宣稱
```

順序的邏輯：

1. **order 0**：地圖與三個貫穿全系列的事實（沒有唯一防線、預設常常放行、沒有中立評測）。
2. **order 1–4（第一部分）**：依時間排。安裝前最直觀（你有一堆 skill 目錄就在眼前），所以排最前；沙箱「假設已經被騙」，接著講把關與事後看見。
3. **order 5–7（第二部分）**：讀者目標換了，改成「測我自己的東西」。先從最熟悉的審計程式碼，再到測 AI，最後才是敏感的雙用途。
4. **order 8**：用前面每篇出現過的宣稱當案例，教讀者怎麼查——這是螺旋式加深，不是新概念堆疊。

排序原則：

- 可見先於不可見：先講你自己的 skill 目錄與設定檔，再講抽象的威脅模型。
- 動機先於抽象：每篇先用一個讀者會遇到的具體情境，再講機制。
- 一次一個跳躍：hook 的概念在 order 3 才首次定義；OWASP 的完整清單在 order 8 才給（前面的篇章只用白話，需要時折疊一個對照）。
- 數字最多：每篇有一節「這個數字能不能信」，但比例不超過全文 20%，其餘講機制與使用方式。
- 一條貫穿的問法：**每種工具都問三件事——它攔在哪裡、它掛了會怎樣、誰可以改它的規則。**

## 篇目總表

| order | 主題 | 聚焦問題 | 狀態 | 對應研究 |
|---|---|---|---|---|
| 0 | 總覽：風險從哪裡進來、各類工具管哪一段 | 我讓 agent 裝 skill、接 MCP、跑指令，風險走哪幾個入口？有哪幾類工具？ | 待寫 | 研究筆記 §2、§1 |
| 1 | 安裝前：skill 與 MCP 掃描器能擋什麼 | 裝之前掃描器能告訴我什麼、不能告訴我什麼？ | 待寫 | B 層（sources/ 與 gapB） |
| 2 | 執行中（一）：沙箱——假設 agent 已經被騙 | 沙箱到底限制了什麼？Claude Code 與 Codex 預設差在哪？ | 待寫 | D 層（deepD） |
| 3 | 執行中（二）：護欄與閘道——動作前把關 | 在動作發生前攔截的工具，可靠度由誰決定？ | 待寫 | C 層（deepC、layer3） |
| 4 | 執行後：看見 agent 做了什麼 | 事後怎麼知道 agent 做過什麼？日誌可信嗎？ | 待寫 | E 層（deepE） |
| 5 | 審計你自己的程式碼：Cloudflare 與 Trail of Bits 的 skill | 用 AI 審計自己的專案，兩種做法各適合什麼？ | 待寫 | A 層（layer1、gapD） |
| 6 | 測試 AI 系統本身：garak、promptfoo、PyRIT、HackAgent | 想知道我的 LLM 應用抗不抗得住攻擊，工具測的是什麼？ | 待寫 | F 層（deepF、layer4、gapC） |
| 7 | 用 AI 打別人：滲透測試 agent 與雙用途風險 | AI 滲透工具能做什麼？為什麼它自己也成為攻擊面？開源後管得住嗎？ | 待寫 | F 層（layer4、deepARTEX、gapA） |
| 8 | 怎麼判斷這些工具的宣稱：標準、benchmark 與廠商說法 | 看到「涵蓋 OWASP 10/10」「87% precision」時怎麼查？ | 待寫 | G／H／I 層（deepGHI、deepBench、deepV） |

站內不重寫的既有文章（當前置連結，不併入本系列）：
- `ai/2026-06-04-agent-security-prompt-injection-trust-boundaries`（為什麼 prompt injection 無法在模型層根治）
- `ai/2026-08-10-agent-security-harness-layer`（harness 層控損，系列「Agent 生產線」第 5 篇）
- `ai/2026-09-18-multi-agent-safety`
- `ai/2026-08-22-promptfoo-llm-evaluation`（order 6 連回）
- `tech/2026-10-13-bug-bounty-zero-04-what-is-rce`（order 7 連回，RCE 概念）

## 斷崖報告

| 位置 | 問題 | 處理 |
|---|---|---|
| 0→1 | 從地圖跳到單一工具類別的細節 | order 1 開頭用 order 0 的地圖標位置；先講讀者自己的 skill 目錄，再講掃描方式 |
| 1 內部 | 要同時理解「規則／LLM judge／召回與誤報」三個概念 | 召回與誤報用白話內嵌一小節（「一百個壞 skill 抓到幾個、一百個好 skill 錯殺幾個」），不另開文；LLM judge 在此一句帶過，細節留到數字節 |
| 1→2 | 從「安裝前」跳到「執行中」，讀者容易以為掃描過就安全 | order 2 開頭明講：掃描器管不到執行時才出現的指令（例如網頁裡的惡意內容），所以才需要邊界 |
| 2→3 | 從 OS 層（沙箱）換到應用層（hook、閘道）；hook 是新概念 | hook 在 order 3 才首次定義；order 2 提到 Claude Code 設定時不用 hook 這個詞 |
| 3→4 | 護欄（事前）與偵測（事後）容易混 | order 4 第一節比較兩者；很多工具是混合體，不強分 |
| 4→5 | **讀者目標換了**：從「保護我的 agent」換成「測試我的產品」 | order 4 結尾與 order 5 開頭各一段明講換軌；只用 agent 的讀者可以在 order 4 停 |
| 5→6 | 從審計「程式碼」換到測試「AI 系統」 | order 6 開頭用一張兩欄表區分：審計看原始碼，紅隊對運行中的系統發請求 |
| 6→7 | 從「測 AI」換到「用 AI 測別人」，且題材敏感 | order 7 開頭用同一張兩欄表的延伸，並先講寫作範圍（不給可複製步驟、不做個人歸因） |
| 7→8 | 從具體事件跳到方法（怎麼查宣稱） | order 8 全部用前七篇出現過的案例當練習，不引入新工具 |

## 範圍卡

### Order 0：總覽
- 聚焦問題：我讓 agent 裝 skill、接 MCP、跑指令，風險走哪幾個入口？有哪幾類工具各管哪一段？
- 邊界：
  - 講：四個入口（你安裝的東西、工具與網頁的輸出、agent 執行的指令、你自己的產品）；一條時間軸上的四類工具＋兩類「測試」工具；三個貫穿的事實；怎麼讀這個系列（只想保護自己讀到 order 4）；本系列做了什麼和沒做什麼（只讀文件與原始碼，沒有安裝或實測）。
  - 不講：任何工具的細節；OWASP 完整清單；攻擊手法。
- 讀完後讀者能：拿到一個具體風險（例如「裝了一個惡意 skill」），說出該看哪一類工具、這類工具管不到什麼。
- 例子／推導：以讀者自己的 `~/.claude/skills/` 目錄與一個 MCP 設定為例，標出四個入口。
- 自我檢查與答案：問題：agent 讀到網頁裡的惡意指令並執行 `curl | sh`，哪一類工具最先該擋、哪一類只能限制損害？答案：動作前的護欄最先該擋；沙箱只限制損害；安裝前掃描管不到（因為這不是安裝進來的東西）。
- 前置：站內 `ai/2026-08-10-agent-security-harness-layer`（建議先讀，非必須）。
- 連結：碰到 prompt injection → 連回 `ai/2026-06-04-…`。

### Order 1：安裝前掃描
- 聚焦問題：裝之前，掃描器能告訴我什麼、不能告訴我什麼？
- 邊界：
  - 講：三種做法（規則／AST／YARA、LLM judge、連線讀 MCP server）；SkillSpector、Cisco skill-scanner、Snyk agent-scan、AgentSeal 的差異（含 AgentSeal 的 `scan-mcp` 會啟動目標 server，與「安裝前不執行」的原則衝突；agent-scan 會把設定送到 Snyk）；Trail of Bits 與 Adversa 的繞過；獨立評測顯示數字換資料集會翻轉；合理的使用方式（當輔助篩選，要求覆蓋不完整就失敗）。
  - 不講：執行期、紅隊、各工具安裝教學。
- 讀完後讀者能：看懂一份掃描報告——「No findings」代表什麼、一個高風險分數該怎麼複核——並決定何時信、何時不信。
- 例子／推導：Cisco 自述規則單獨只抓到約 8%，加 LLM judge 後約 67%、誤報約 15%；MalSkillBench 的野外子集讓排名翻轉（VirusTotal recall 21.6%→87.9%）。
- 自我檢查與答案：問題：掃描器回「No findings」，能裝了嗎？答案：不能直接下結論；Cisco 的 README 自己寫那只代表沒偵測到已知模式。
- 前置：order 0。
- 連結：26.1%／5.2% 的數字出處是 arXiv:2601.10338，不是 SkillSpector 的掃描結果；引用時照原論文寫。
- 動筆前要補：2608.19901 附錄、`post-verify` 對所有數字、`source-eval`（Cisco 的對比數據由 Cisco 作者發布；Adversa 賣同類產品）。

### Order 2：沙箱
- 聚焦問題：沙箱到底限制了什麼？Claude Code 與 Codex 的預設差在哪？
- 邊界：
  - 講：四種隔離（同核 OS 原語、容器編排、本機 microVM、遠端 microVM）；Claude Code 沙箱預設關閉且只包 shell 指令（不含 Read／Edit／WebFetch、MCP、hooks），Codex 本機預設有沙箱；逃逸研究多是繞過邊界旁邊的東西；Strix 的 RCE 發生在沙箱內，說明沙箱只限制波及；Daytona 轉閉源與封存的案例（工具會消失）。給 Claude Code 使用者的設定清單（動筆前逐項對官方文件核對設定名稱）。
  - 不講：hook 與護欄（order 3）；沙箱廠商排名；不下「X 比 Y 安全」的結論。
- 讀完後讀者能：指出自己的 agent 設定的邊界在哪、有哪些東西在邊界之外。
- 例子／推導：Claude Code 沙箱開啟後，預設仍讀得到 `~/.ssh`、`~/.aws`，要自己設 deny。
- 自我檢查與答案：問題：Claude Code 沙箱開了之後，MCP server 在沙箱內嗎？答案：不在（官方文件明說），要另外處理。
- 前置：order 0；不需要 order 1。
- 動筆前要補：沒有任何獨立量測，文章必須明講；E2B、smolvm 等的負面證據搜尋補一輪；Claude Code 設定名稱逐項對現行文件。

### Order 3：護欄與閘道
- 聚焦問題：在動作發生前攔截的工具，可靠度由誰決定？
- 邊界：
  - 講：hook 是什麼（本系列首次定義）；Claude Code 的 hook 失敗或逾時預設照常執行動作，要擋需 `onFailure: "block"`（v2.1.295 以上）；護欄的三種位置（SDK、proxy／閘道、hook）；微軟 Agent Governance Toolkit 當案例（MCP 閘道是啟發式、自評 7 Full 3 Partial 而非 10/10、未載入政策時預設 allow）；NeMo Guardrails 偵測器掛掉時 fail-open；llm-guard 與 rebuff 封存（生命週期：沒有官方原因與遷移指引）。
  - 不講：行為偵測與稽核（order 4）；其餘幾十個護欄專案的逐一介紹。
- 讀完後讀者能：檢查任何一個護欄工具的三件事——攔在哪、掛了怎麼辦、誰能改規則。
- 例子／推導：一個 PreToolUse hook 腳本路徑寫錯時，預設不會擋任何指令。
- 自我檢查與答案：問題：hook 腳本路徑寫錯，Bash 指令會被擋嗎？答案：預設不會；除非設 `onFailure: "block"` 或腳本以 exit 2 結束。
- 前置：order 0、2（邊界概念）。
- 動筆前要補：ProtectAI v2 的 30.1% 誤報要讀論文全文（目前只有搜尋摘要，不引用）；Microsoft MCP gateway 未查；`source-eval`（PolicyLayer 是競品；AGT 是微軟自己的自評）。

### Order 4：偵測與稽核
- 聚焦問題：事後怎麼知道 agent 做過什麼？日誌可信嗎？
- 邊界：
  - 講：一條光譜（純事後：Uber ADR；預設只監控：numbat；多數是「偵測＋事前閘門」混合）；Uber 的觀察（prompt injection 在其環境罕見，secret exfiltration 是大宗；皆為 Uber 自述）；ADR 的開源版與 Uber 實際部署的不是同一份；tamper-evident 與 tamper-proof 的差別；Claude Code 原生提供的 hook 與 OpenTelemetry 資料。
  - 不講：SIEM 架構；實作教學。
- 讀完後讀者能：判斷一份稽核紀錄能不能當證據——誰能改、簽章金鑰放哪。
- 例子／推導：agent 與簽章金鑰同機同使用者時，日誌只有 tamper-evident。
- 自我檢查與答案：問題：簽章金鑰和被稽核的 agent 在同一台機器同一個使用者下，日誌可以當證據嗎？答案：不行，只能發現竄改的痕跡（tamper-evident），不能防止竄改。
- 前置：order 3（hook）。
- 動筆前要補：本層沒讀任何原始碼，文章措辭用「作者文件揭露的邊界」；issue 層級的反證搜尋沒做完；「prompt injection 罕見」只有 Uber 簡報一個來源，要標明。

### Order 5：審計你自己的程式碼
- 聚焦問題：用 AI 審計自己的專案，兩種做法各適合什麼？
- 邊界：
  - 講：Cloudflare 的純 LLM 多代理（Validator 不能自己提 finding、PoC 對原始碼驗證、沒有 OS 沙箱就降為 needs_validation）與官方自述「Semgrep 一個月呼叫 0 次」；Trail of Bits 的工具加 LLM 混合；兩者都沒有 Workers／D1／KV／Astro 的專屬檢查；ToB 的 supply-chain 審計器優先讀 `package-lock.json`、不讀 `pnpm-lock.yaml`；成本；兩者都沒有公開準確率。
  - 不講：試跑結果（目前沒跑，文章必須明講；若使用者之後同意試跑，改寫成有實測的版本）。
- 讀完後讀者能：決定要不要用、用哪一種，以及用之前要先準備哪些事（沙箱、預算、鎖檔一致）。
- 例子／推導：一個專案同時有過期的 `package-lock.json` 與現行的 `pnpm-lock.yaml` 時，審計器會拿過期版本比對公告。
- 自我檢查與答案：問題：專案用 pnpm，ToB 的 supply-chain 審計器會審什麼？答案：它優先讀 `package-lock.json`；`pnpm-lock.yaml` 不讀；若兩者並存，就是拿可能過期的那份。
- 前置：order 0；order 2（沙箱需求）建議先讀。
- 動筆前要補：作者隸屬（Cloudflare skill 與官方 harness 的差別）；「未試跑」要貫穿全文；`source-eval`。

### Order 6：測試 AI 系統本身
- 聚焦問題：想知道我的 LLM 應用抗不抗得住攻擊，工具測的是什麼？
- 邊界：
  - 講：「測 AI」類工具的共同結構（攻擊者模型＋轉換器＋judge）；garak、promptfoo、PyRIT、HackAgent 各自的定位；PyRIT 測的是模型的文字回應，不是 agent 實際行為；judge 會誤判（garak 官方 FAQ 自稱「no scientific validity」）；promptfoo 被 OpenAI 收購的實際狀態（待成交條件）；成功率背後的變數（攻擊者模型、judge、分母）。
  - 不講：如何寫攻擊提示；越獄資料集。
- 讀完後讀者能：讀一份紅隊報告時，問出「攻擊者模型是誰、judge 是誰、分母是什麼」三個問題。
- 例子／推導：HackAgent 白皮書的排名在不同面板門檻下會反轉（作者自述只有「方向」可信）。
- 自我檢查與答案：問題：兩份報告都寫「攻擊成功率 5%」，可以直接比較嗎？答案：不行，要先確認攻擊者模型、judge 與分母。
- 前置：order 0；站內 `ai/2026-08-22-promptfoo-llm-evaluation`。
- 動筆前要補：沒有任何獨立的量化評測；PyRIT 論文只讀摘要要補；`source-eval`。

### Order 7：用 AI 打別人與雙用途風險
- 聚焦問題：AI 滲透工具能做什麼？為什麼它自己也成為攻擊面？開源之後管得住嗎？
- 邊界：
  - 講：Strix、Shannon、AI-Infra-Guard、HexStrike 的定位；工具被注入反控（Strix 沙箱內 RCE，摘要層級）；HexStrike 的 API 無驗證；ARTEX 的證據分級（多家廠商分析但共用同一批外流工件；微軟報告的是另一個行為者；防濫用設計都是操作者可改的預設值；閉源後濫用沒有被量到下降）；與 HexStrike 單一來源「聲稱」的對比。
  - 不講：可複製的攻擊步驟；個人歸因；哪家銀行被入侵的細節。
- 讀完後讀者能：判斷「某工具被濫用」這種新聞的證據有多強（誰說的、是不是獨立的、有沒有量化）。
- 例子／推導：五家廠商分析 ≠ 五個獨立證據，因為其中幾家的證據來源是基礎設施重疊或互相引用（Recorded Future 與 CrowdStrike 基礎設施重疊，Zscaler 第二篇引用 Recorded Future）。
- 自我檢查與答案：問題：五家廠商都說攻擊者用了同一個工具，這是五個獨立證據嗎？答案：不是，要看它們是否共用同一批資料來源。
- 前置：order 0、2（沙箱）；站內 `tech/2026-10-13-bug-bounty-zero-04-what-is-rce`（RCE 概念）。
- 動筆前要補：CVE 編號回官方公告核對；`source-eval`；寫作紀律檢查（不得出現個人帳號與屬性）；`post-verify` 逐句核對。
- 站內注意：日報對 ARTEX 的幾處說法與一手來源不一致（研究筆記 §3.3），本篇以一手來源為準，不沿用。

### Order 8：怎麼判斷這些工具的宣稱
- 聚焦問題：看到「涵蓋 OWASP 10/10」「87% precision」「已併入 Microsoft」時，怎麼查？
- 邊界：
  - 講：標準、工具、benchmark 的差別；OWASP Agentic Top 10（ASI01–ASI10）與 LLM Top 10 2026 當詞彙，完整清單在這篇首次出現；現有 benchmark（AgentDojo 等）評的是模型或 agent 的抗注入力，不是工具；評工具偵測力的獨立研究只有兩個不同源的資料集；前七篇的案例當練習——「10/10」vs 7 Full、ATR 的「merged」、87% 找不到出處、星數與導流來源；一份五題的檢查表。
  - 不講：新工具介紹。
- 讀完後讀者能：用檢查表拆解任何一則工具宣稱，並說出該去查哪個一手來源。
- 例子／推導：微軟 toolkit 的「Covers 10/10」對照它自己文件的「7 Full、3 Partial、internal self-assessment」。
- 自我檢查與答案：問題：「已併入 Microsoft 與 Cisco 的專案」，怎麼確認？答案：看是誰提的 PR、誰合併、宿主專案的 README 怎麼寫；ATR 的案例是作者自己提 PR，Microsoft 的 README 寫不依賴它。
- 前置：order 1、3、7 的案例（建議全部讀完）。
- 動筆前要補：OWASP LLM 2026 PDF 目前只讀約 14%，只引已讀部分；MAESTRO、ASB 部分讀；「87%」要去問或標未解。

## 站內前置知識連結

- prompt injection 為什麼無法在模型層根治 → `ai/2026-06-04-agent-security-prompt-injection-trust-boundaries`
- harness 層控損、lethal trifecta → `ai/2026-08-10-agent-security-harness-layer`
- multi-agent 之間的注入 → `ai/2026-09-18-multi-agent-safety`
- RCE 是什麼 → `tech/2026-10-13-bug-bounty-zero-04-what-is-rce`
- LLM 評測 → `ai/2026-08-22-promptfoo-llm-evaluation`

## 研究足夠的判準

五關的逐層檢查結果在 `research-note.md` §5。摘要：

| 關 | 結果 |
|---|---|
| ①一手來源 | 通過：各層都讀到官方文件、README、原始碼或論文全文；HexStrike 與 Claude Code hook 預設由我自行核對 |
| ②證據類型 | 部分：全系列沒有任何獨立的工具準確率評測，沒有實測；文章必須如實寫「作者自述」「獨立研究」「我沒有試跑」 |
| ③2024 年後 | 通過：核心來源幾乎都是 2025–2026 |
| ④反證 | 部分：D、E、C 層的負面證據搜尋仍不如 A、B、F 層充分 |
| ⑤飽和 | 部分：C 層備援鏈沒走完；多個論文附錄與圖內數字讀不到 |

**整體判定**：足以排弧線與定範圍；**不足以直接動筆**。每篇動筆前要先關閉該篇範圍卡「動筆前要補」所列的缺口，再跑 `post-verify`。

## 做與不做

- 做：每篇都標明哪些是作者自述、哪些是獨立研究、哪些是我的判斷（判斷放在獨立一節，不散在正文的但書裡——避免重蹈「資安獵人」系列但書堆疊的問題）。
- 不做：不實跑任何被研究的工具；不教安裝；不放攻擊步驟；不寫個人歸因；不修改站上既有文章（待修項另列於研究筆記 §3.3，走 `post-update` 由使用者決定）。

## 進度與批次（草案）

- 依規則：總覽加第 1 篇先給使用者看，之後每批最多 2 篇，交出後等回覆。
- 建議批次：①order 0＋1；②order 2＋3；③order 4；④order 5＋6；⑤order 7；⑥order 8。
- 每篇的審稿紀錄 `.work/reviews/<文章 slug>.md` 要有 post-verify、post-review、post-polish 三節。
- 中文篇完成後再用 `post-translate` 出英文版；9 篇中文＋9 篇英文，不一次提交，每批在 20 檔以內。
- 系列登錄（`src/utils/series.ts`）在第一篇寫好時才做，不提前登錄。

## 待使用者決定（2026-10-24 已回覆「好」，採用草稿預設；保留原題供日後調整參考）

1. 讀者範圍是否為 A（保護自己）＋B（測試自己的產品），分兩部分？
2. 規模：9 篇（order 0–8）可不可以？要不要先只做第一部分（order 0–4）？
3. 母群邊界（研究筆記 §1 的一句話）是否接受？
4. order 5 是否維持「未試跑」？若要有實測，需要你同意安裝工具（屬 Tier 2）。
5. 是否同步出英文版？
