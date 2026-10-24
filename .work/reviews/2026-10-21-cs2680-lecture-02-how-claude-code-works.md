審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works.md，sha256：fb5c0e6d585f402d6857c08034384dbb6efc7af34dc8d09b595763b26714f9d3

審稿者：獨立子代理（未參與撰寫），2026-10-21

依據：投影片文字檔 `.work/research/harvard-cs2680/sources/slides/2_agent_use_1.txt`（PDF 共 53 頁，p44 起為 Optional）、`.work/research/harvard-cs2680/lectures-01-04.md`、既有查證表 `.work/research/harvard-cs2680/l2-claude-code-factcheck.md`、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 2、`.agents/skills/post/references/course-guide-contract.md`。官方文件以 `curl -sL https://code.claude.com/docs/en/<page>.md` 於 2026-10-21 重抓 9 頁（permission-modes、tools-reference、memory、hooks、context-window、how-claude-code-works、costs、skills、plugins-reference），另抓 `platform.claude.com/docs/en/api/messages.md`、`agents-and-tools/tool-use/overview.md`、`about-claude/glossary.md` 與 `cs2680.com/policy`。Groundlane 未使用（依指示 401），curl 全部成功，未降級到 Exa／WebFetch。

## post-verify

### 既有查證表抽驗（自行重抓原文，10 條）

| 查證表條目 | 自行抓到的原文 | 結果 |
|---|---|---|
| #1 三階段 | how-claude-code-works L15："three phases: gather context, take action, and verify results. These phases blend together." | 一致 |
| #5 Glob/Grep | tools-reference L304："On macOS, Linux, and WSL, Claude Code leaves Glob and Grep out of the default tool set…" | 一致 |
| #7 六種模式 | permission-modes 模式表：default、acceptEdits、plan、auto、dontAsk、bypassPermissions | 一致 |
| #8 Auto 分類模型 | permission-modes L320 "A separate classifier model reviews actions before they run"；L375 "By default, classifier requests go to Claude Sonnet 5." | 一致 |
| #10 壓縮順序 | how-claude-code-works L134 "It clears older tool outputs first, then summarizes the conversation if needed." | 一致 |
| #11 壓縮後重載 | context-window 表："Project-root CLAUDE.md and unscoped rules｜Re-injected from disk"、"Auto memory｜Re-injected from disk"、"Nested CLAUDE.md in subdirectories｜reloads them on demand" | 一致（注意只限專案根目錄） |
| #15 200 行／25KB | memory L542 "The first 200 lines of MEMORY.md, or the first 25KB, whichever comes first…"；L546 CLAUDE.md 4 MiB 內整份載入 | 一致 |
| #19 串接不覆蓋 | memory L144 "All discovered files are concatenated into context rather than overriding each other." | 一致 |
| #29 五類工具 | how-claude-code-works L37–47：File operations／Search／Execution／Web／Code intelligence；"Claude also has tools for spawning subagents, asking you questions, and other orchestration tasks." | 一致 |
| #33 hook 事件 | hooks 摘要表共 33 個事件（含 PreCompact、PostCompact、SubagentStop、SessionEnd…） | 一致；33−5＝28，「約三十種其他事件」可接受 |

### 逐條宣告

| # | 行 | 宣告 | 來源＋頁 | Verdict | 備註 |
|---|---|---|---|---|---|
| 1 | 28 | 第 2 堂 2026-09-09，題目 How Claude Code works | lectures-01-04.md L86；投影片 p1 | Confirmed | |
| 2 | 26、253 | 課程不錄影 | cs2680.com/policy："No, the lectures will not be recorded." | Confirmed | |
| 3 | 32 | 三段 p5–13／p14–26／p27–42；p44 之後 MCP 選讀 | 投影片 p4、p13、p27、p44「Optional slides」、p45–52 | Confirmed | |
| 4 | 36 | LLM 基礎課延後、先當黑盒 | p2 "LLM background moves later… Treat the LLM as a magic reasoning box" | Confirmed | 「原本在這堂之前」由 L1 p46 支持 |
| 5 | 38–52 | Messages API 請求：model、max_tokens、system 字串、tools（name／description／input_schema）、messages | messages.md：`max_tokens: number`、`system: optional string…`、tool 定義 "name / description / input_schema" | Confirmed | |
| 6 | 56–64 | 回覆 stop_reason "tool_use"、content 含 text 與 tool_use（id／name／input） | messages.md L4110 `"tool_use": the model invoked one or more tools`；tool-use overview 範例 `{"type":"tool_use","id":"toolu_01A09…","name":…,"input":…}` | Confirmed | 範例省略 id／type／role／model／usage，屬節錄，建議標「節錄」（見 post-review） |
| 7 | 54 | 「模型回來的不是一段話，而是一個請求」 | 同上；正文自己的範例就有 text block | Misframed | 回覆是「一段話＋工具請求」；改成「除了一句話，還附了一個請求」 |
| 8 | 68 | 模型不記得上一次呼叫，要整段重送 | messages.md L14 "stateless multi-turn conversations" | Confirmed | |
| 9 | 70 | 一個英文單字大約一到兩個 token | glossary："a token represents approximately 3.5 English characters"；4.7 之後 tokenizer 多約 30% | Confirmed（粗略） | 量級正確；可加「依模型而異」 |
| 10 | 74–75 | 下一次 messages 至少三則，含對應 toolu_01 的 tool_result | tool-use overview：`{"type":"tool_result","tool_use_id": tool_use.id,…}` 放在 user 訊息 | Confirmed | 答案可補「tool_result 放在 role 為 user 的訊息裡」 |
| 11 | 72 | Claude Code 是 harness | how-claude-code-works："This surrounding layer is what the term agentic harness refers to."（查證表 #6） | Confirmed | |
| 12 | 81 | 投影片三步循環（p6）；官方三階段交織 | p6；doc L15 | Confirmed | |
| 13 | 83 | U M₁ T₁ … Mₙ A（p10），「每一次 M 都看得到前面所有的 M 和 T」 | p10 "conditioned on the previous inference and the previous tool result" | Confirmed（加註） | 壓縮後就不是「所有」；可加「壓縮之前」 |
| 14 | 105–110 | 開場 context：系統、專案環境、記憶、工具、skill/MCP（p7） | p7；context-window | Confirmed | 「git 狀態」由 context-window 的 Git status snapshot 支持 |
| 15 | 111 | skill 與 MCP 開場「只放名稱與簡短描述」 | p7 寫 names and descriptions；doc L140 "MCP tool definitions are deferred… only tool names and server instructions consume context" | Outdated（MCP 部分） | skill 放 description ✓；MCP 現在只放工具名稱與 server instructions，不含每個工具的描述 |
| 16 | 113 | 開場一萬多 token；官方沒給數字；`/context` 可看 | p7 "10+k tokens"；查證表 #4 Not found；memory／how-claude-code-works 均有 `/context` | Confirmed | 文中已正確標為投影片說法 |
| 17 | 117 | macOS/Linux/WSL 預設不再提供 Glob/Grep | tools-reference L304 | Confirmed | |
| 18 | 121 | 模型提出 Bash("pytest")，harness 檢查權限、執行、包 tool_result（p9） | p9 | Confirmed | |
| 19 | 123 | 權限三結果（p11） | p11；permissions allow/ask/deny（查證表 #9） | Confirmed | |
| 20 | 123 | 投影片四模式；官方六種，多 plan、dontAsk | p11；permission-modes 表 | Confirmed | |
| 21 | 123 | Auto 由另一分類模型審，「預設用的模型並不小」 | permission-modes L320、L375（Sonnet 5） | Confirmed（措辭） | 「並不小」是評語；直接寫「預設是 Claude Sonnet 5」更可查 |
| 22 | 127 | 「投影片提醒…每一步都要把整段重送一次，雖然重複的開頭能用快取價計費，帳單還是跟著長度走」 | p12 原文只有 "Context is not free: prefix-cache reads account for most of the cost"；costs L388 "re-reads that history at the cached token rate" | Misframed（歸屬） | 「重送」「快取價」是本文對文件的轉述，句首卻掛「投影片提醒」；投影片真正的主張「cache 讀取佔成本大宗」反而被淡化掉了（查證表 #14：文件沒明說佔大宗） |
| 23 | 129 | 先清舊工具輸出、需要時摘要 | doc L134 | Confirmed | |
| 24 | 129 | 壓縮後專案 CLAUDE.md 與 auto memory 從磁碟重載 | context-window 表 | Confirmed | 只限專案根目錄 CLAUDE.md 與無 `paths:` 的 rules；子目錄 CLAUDE.md 與 `paths:` rules 是用到才重載 |
| 25 | 137–144 | test_login 表：10,400／12,900／14,100／14,400／15,000；合計 76,800 | 自算：10,000+400=10,400；+2,500=12,900；+1,200=14,100；+300=14,400；+600=15,000；10,000+10,400+12,900+14,100+14,400+15,000=76,800 | Confirmed（算術） | 假設未寫出：忽略使用者那句話與模型每次輸出的 token（見 post-review） |
| 26 | 146–147 | 20,000 token 大檔：每次多 17,500，M₃–M₆ 四次，共 70,000 | 自算：20,000−2,500=17,500；17,500×4=70,000；M₂ 本身讀 10,400 不受影響 | Confirmed | |
| 27 | 147 | 第 4 堂談「工具輸出要省 token」 | lectures-01-04.md L323：L4 p25 "token-cheap output (tool design is context design)"；L4 p46–48 | Confirmed | |
| 28 | 153–155 | 記憶兩種（p16）、四個問題（p17）、「記憶讓指示變成慣例」 | p16、p17 "Memory is how instruction becomes convention." | Confirmed | |
| 29 | 161–167 | CLAUDE.md vs auto memory 表（p18） | p18；memory L31 "Every session (first 200 lines or 25KB)" | Confirmed | 「每個 session 整份載入」對子目錄 CLAUDE.md 不成立（用到才載入）；投影片原文只寫 Every session |
| 30 | 169 | 四個位置、由大到小、managed 不能排除、串接不覆蓋 | p20；memory L55、L144 | Confirmed | |
| 31 | 171 | 該放／不該放（p21）；200 行內官方也建議 | p21；memory L88 | Confirmed | |
| 32 | 173 | `.claude/rules/` 與 `paths:`（p22） | p22；memory（查證表 #22） | Confirmed | |
| 33 | 175 | auto memory 路徑、四種 type、MEMORY.md 索引、主題檔按需讀（p23–24） | p23、p24；memory | Confirmed | |
| 34 | 177 | 四個指令（p25） | p25；查證表 #25–28 | Confirmed | `/doctor` 的 CLAUDE.md 審查現在走 `/doctor prompt-audit`（查證表 #28），可選擇補一句 |
| 35 | 181 | 租金、過期記憶更糟、當程式碼管（p26）；「context 是租來的，記憶是買下來的」（p21） | p26；p21 "Context is rented, memory is owned" | Confirmed | |
| 36 | 190 | 投影片六類工具（p28） | p28 | Confirmed | |
| 37 | 190 | 官方五類、subagent 歸協調工具，「分法不同，涵蓋的範圍一致」 | doc L37–47 | Contradicted（後半句） | 官方的 Code intelligence（型別錯誤、跳定義、找參照，需外掛）在投影片六類裡沒有對應；範圍並不一致 |
| 38 | 192 | 模型決定用哪個工具；作業 2 自己做工具 | p28 | Confirmed | |
| 39 | 196–203 | 四機制表（p30），「掛在 loop 的哪裡」欄 | p30（解決什麼）、p31（掛點：Model reasoning／Tool selection／any stage） | Confirmed（頁碼不全） | 掛點欄出自 p31，表前只標 p30；plugin「安裝時」是本文推論，p31 只寫 "one installable unit" |
| 40 | 205 | skill 決定怎麼做…plugin 負責發佈（p30–31） | p30 | Confirmed | |
| 41 | 207 | skill 結構、description 先載、`/<skill>`、`disable-model-invocation: true` | p34、p35；skills L74、L322；how-claude-code-works L146 | Confirmed | |
| 42 | 209 | MCP 例子（p36）、與本地工具幾乎一樣（p37）、協定傳遞、agent 決定 | p36、p37 | Confirmed | |
| 43 | 211 | hook 五事件、推理不是事件、五種 handler（p38）；約三十種其他事件 | p38；hooks L13、摘要表 33 事件 | Confirmed | |
| 44 | 213 | plugin 目錄結構與好處（p39） | p39；plugins-reference L34 | Confirmed | |
| 45 | 215 | 發佈流程四分（p32） | p32 | Confirmed | |
| 46 | 217 | `.claude/` 結構、專案設定優先（p41） | p41；settings（查證表 #36） | Confirmed | |
| 47 | 221 | 「下一堂才用案例講清楚」skill 可用 vs hook 保證 | lectures-01-04.md L182、L218（L3 p11–12 Superpowers） | Confirmed | |
| 48 | 223–232 | p42 練習與答案 | p42 | Confirmed | 第 5 題括號解釋是本文補充，卻放在「答（投影片的答案）」底下 |
| 49 | 237 | CLAUDE.md 是 context 不是強制設定 | memory L24、L80 "Claude treats CLAUDE.md files as context, not enforced configuration" | Confirmed | 可把這句文件原文掛成 inline 連結 |
| 50 | 239 | 寫進 CLAUDE.md（或沒有 paths: 的 rules）會在壓縮後重載 | context-window 表 | Confirmed（需收窄） | 應寫「專案根目錄的 CLAUDE.md」；子目錄 CLAUDE.md 不會立即重載 |
| 51 | 245–249 | 5 條站內連結 | 檔案皆存在於 src/content/posts（assignment-1-mads-lens、tech/deep-dive 三篇、cmu-11768 lecture-04） | Confirmed | 第 24 行 `-en` 連結指向尚不存在的英文版，依指示忽略 |

統計：Confirmed 45（含加註）｜Outdated 1（#15）｜Misframed 2（#7、#22）｜Contradicted 1（#37）｜Unverifiable 0。

本次只檢查了文中已提出的 51 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

修正：MCP 開場內容改為現行文件說法（只放工具名稱與 server 說明）並標出與投影片差異；工具分類補 code intelligence 差異與連結；p12 成本句拆成投影片原話與文件說法；Auto 模式改寫成可查事實（預設 Sonnet 5）。

## post-review

### 機械檢查

- `pnpm verify`：5 項紅，全部與本篇相關的只有兩種原因：(1) 英文版 `-en.md` 尚未存在（check:references、check:post-quality 的 `-en` 連結 ERROR、check:lang-parity、check:course-videos），依指示忽略；(2) check:series-plan 缺本審稿紀錄，寫入本檔後應轉綠。astro check、lint 綠。
- `check-course-titles.mjs`（整個 cs2680 系列）：0 issue。`check-course-guide-layout.mjs`：0 issue。`pnpm check:tw`：0 blocking、0 to review。
- `pnpm check:links` 未跑（外部連結以 curl 抓過的 12 個官方頁皆 200）。

### 教學規格對照（concept-guide 單堂導讀）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L30 | 有，且對齊範圍卡 |
| 問題 → 直覺 → 機制 | L34–72 補 API；L77–129 loop 機制 | 有 |
| 橋接未教先備 | L34–72（token、context、tool_use） | 有；範圍卡要求的 CS146S agent internals 橋接連結缺（`src/content/posts/ai/2026-08-16-cs146s-agent-internals.md` 存在） |
| 完整例子（條件／推理／結果／意義） | L131–147 | 有，標明自擬；但假設條件不全（見 should-fix 2） |
| 常見誤解 | 分散在 L69、L115–117、L123、L237 | 有內容，未集中；可接受 |
| 各節自我檢查附答案 | L74、L146、L183、L223、L236 | 有；p42 練習缺「為什麼」（見 should-fix 4） |
| 不把非投影片內容歸給講者 | L127、L232 | 兩處歸屬混淆（見 must-fix 2、should-fix 4） |
| 影片狀態行、來源區在後 | L26、L251 | 符合 |

### 🔴 must-fix

1. L190「分法不同，涵蓋的範圍一致」與官方文件不符：官方五類有 Code intelligence（型別錯誤、跳到定義、找參照），投影片六類沒有對應。改成「分法不同；官方多一類 code intelligence，投影片沒列」，並在句末掛 [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) inline 連結（該句目前沒有官方連結）。
2. L127 歸屬錯：句首「投影片提醒」，後面「每一步都要整段重送」「快取價」是本文轉述官方文件；投影片 p12 的原句是「prefix-cache reads account for most of the cost」。改成兩句：「投影片的說法是：context 不是免費的，前綴快取讀取佔了大部分成本（p12）。官方文件沒有說佔多少，只說每次請求都重送整段歷史，以快取價計（costs）。」這也補上範圍卡 order 2 斷崖處理要求的一段白話（同樣開頭不用重算但仍計費）。
3. L111 MCP 開場內容過時：寫成「名稱與簡短描述」，官方現在 MCP 預設 deferred，開場只放工具名稱與 server instructions，描述等用到才載。改成「skill 放名稱與 description；MCP 現在只放工具名稱（投影片寫名稱與描述）」並掛 how-claude-code-works 連結。全文其他產品差異都有標，這處沒標，與 L32 的承諾不一致。

### 🟡 should-fix

1. L54「模型回來的不是一段話，而是一個請求」與下方範例（含 text block）矛盾，也是模板化轉折。改成「模型回來的除了一句話，還附了一個『我想跑這個工具』的請求」。L56 範例前加「（節錄，省略 id、usage 等欄位）」。
2. L133–144 例子的假設不完整：沒說忽略使用者輸入與模型每次輸出的 token；「context 大小」欄是「這一步做完後」的大小，而合計用的是「每次呼叫讀入」，M₁ 那列寫 10,400、合計卻用 10,000，讀者會對不上。建議加一欄「這次呼叫讀入」（10,000／10,400／12,900／14,100／14,400／15,000），並在表前寫一句「為了好算，忽略你那句話和模型自己輸出的 token」。可選：接一句「這 76,800 裡大部分是重複的開頭，可以用快取價」，把 p12 的成本論點落到數字上。
3. L129、L239（綜合題 2 判準）、L18（glossary context）：壓縮後重新載入的是「專案根目錄的 CLAUDE.md」與沒有 `paths:` 的 rules；子目錄的 CLAUDE.md 和 `paths:` rules 要再碰到對應檔案才載。判準請收窄，否則讀者會以為所有 CLAUDE.md 都撐得過壓縮。L18「從磁碟」是文件用語，不是投影片原話，可改成「第 2 堂說壓縮後會重新注入 CLAUDE.md 與記憶」。
4. L232：p42 原題要求「say why the others do not fit」，答案只給標籤。每題補一句理由（例：2 是外部系統資料，所以是 MCP；6 要每次都擋，靠模型自律的 skill 不夠，所以 hook 或權限規則）。第 5 題括號解釋是本文補充，請標「本文補充」或移出「投影片的答案」。
5. L196–203 表的「掛在 loop 的哪裡」欄出自 p31，表前只標 p30；plugin「安裝時」是本文推論（p31 只說 one installable unit）。表前改標 p30–31，plugin 列寫「不掛在 loop 上，是安裝單位」。
6. L123 Auto 模式：「預設用的模型並不小」是評語，改寫成可查的事實「預設由 Claude Sonnet 5 審查」，句末掛 permission-modes 連結（已有）。
7. 範圍卡要求的 CS146S agent internals 橋接（`/posts/ai/2026-08-16-cs146s-agent-internals`）沒有出現在延伸閱讀；建議加在 L72 或延伸閱讀，給想深入 harness 的讀者。
8. L166「每個 session 整份載入」：子目錄 CLAUDE.md 是用到才載，投影片原文只寫 Every session。改成「每個 session 載入（4 MiB 內整份）」或直接照投影片寫「每個 session」。

### 🟢 nit

1. L83「每一次 M 都看得到前面所有的 M 和 T」加「（壓縮之前）」，與 L125 起的壓縮段呼應。
2. L75 答案可補「tool_result 放在 role 為 user 的訊息裡」，這是第一次寫 harness 的人最常犯錯的地方。
3. L70 token 換算加「依模型與語言而異」（官方 glossary 說 4.7 之後同一段文字多約 30% token）。
4. L177 `/doctor` 現在的 CLAUDE.md 審查走 `/doctor prompt-audit`（v2.1.283+），可補括號。
5. tldr（L11）約 170 字，資訊足；可刪「本文先補一次 API 呼叫長什麼樣，」前半以縮短，非必要。
6. tags 7 個，與系列一致；`ai-course` 的 post-quality WARN 是全系列共同現象，不在本篇處理。
7. 台灣讀者位置：全球產品題材，不必硬塞；可選在 L30 加一句「你在用 Claude Code 或其他 coding agent 時，這張軌跡圖就是你帳單的來源」。

修正：must-fix 1–3 全修。should-fix 1 改「除了一句話，還附了一個請求」並標節錄；2 例子表加「這次呼叫讀入」欄、註明忽略使用者輸入與模型輸出、補快取一句；3 壓縮後重載範圍收窄（根目錄 CLAUDE.md、無 paths 規則、auto memory）並同步 glossary 與綜合題 2；4 p42 練習每題補理由並標「理由為本文補充」；5 表標 p30–31、plugin 改「不掛在 loop 上」；6 Auto 改事實句；7 補 CS146S 連結（正文＋延伸）；8 載入欄改「每個 session」。nit 1–4、7 修；5、6 不改。

## post-polish

掃描結果（`register-scan.sh`）：長句 14 句（約 122 句中 11%，介於綠與該處理之間）、但書段落 8%（綠）、引述區塊 15（誤判：全是自我檢查的 `>` 區塊，不是引述，不處理）、單段數字 ≥4 有 4 段（其中兩段是頁碼與來源區，屬誤判；L144 是例子本體，保留）、姓名主詞 1、模板化轉折 1 處（L54）。`scan-ledger.sh` 另抓到 L209「本地工具」。

| # | 行 | 指標 | 問題 | 建議改寫 |
|---|---|---|---|---|
| 1 | 30 | 長句（88 字） | 問題與讀完能力擠在一句 | 「這堂要回答的問題是：你在 Claude Code 送出一句話之後，它呼叫了幾次模型、讀了什麼、記住了什麼？讀完之後，你應該能畫出一次『修好這個測試』的完整軌跡。你也能判斷一條規則該寫進 CLAUDE.md、skill 還是 hook。」 |
| 2 | 54 | 模板化轉折 | 「不是一段話，而是…」且與範例矛盾 | 見 post-review should-fix 1 |
| 3 | 123 | 長句（87 字）＋評語 | Auto 模式整句繞 | 「投影片說 Auto 模式由『一個小模型』審查。官方文件的說法是另一個分類模型在執行前審查，預設是 Claude Sonnet 5。所以把它想成『另一個模型替你看一眼』比較準，它不是便宜的小過濾器。」 |
| 4 | 117 | 長句（66 字） | 版本差異插在道理中間 | 「投影片的例子是 `Grep("authentication")`。現在在 macOS、Linux、WSL 上，Claude Code 預設不提供獨立的 Glob、Grep 工具，改用 Bash 跑 `find`、`grep`。工具換了，按需拉切片的道理沒變。」 |
| 5 | 155 | 長句（70 字） | 四個問題一口氣列 | 改成引導句＋四點清單：「沒有持久記憶，會出現四個問題（p17）：」後接四個條列 |
| 6 | 171 | 長句（80 字） | 「該放」「不該放」兩串混在一段 | 拆成兩個短清單，各三項；200 行建議獨立成一句 |
| 7 | 175 | 長句（90 字） | 路徑、type、四種分類全塞一句 | 「auto memory 是 Claude 自己的筆記，存在 `~/.claude/projects/<project>/memory/`（p23）。每個檔案用 `type` 標成四種之一：」後接四點清單 |
| 8 | 190 | 長句 | 六類工具一句列完，再接官方五類 | 六類改成表格（類別／做什麼／投影片的提醒），官方分法另起一段一句話，並修正「範圍一致」（post-review must-fix 1） |
| 9 | 209 | 台灣用詞 | 「本地工具」 | 改「本機工具」 |
| 10 | 32 | 語感 | 「投影片有不少產品行為」少了受詞 | 「投影片裡有不少 Claude Code 的產品細節，本文以 2026 年 10 月的官方文件為準，不同處直接標出。」 |
| 11 | 81 | 語感 | 「重點是：」之後的句子與 L83 重複說一次「很多次模型呼叫」 | 刪「重點是」那句，或與 L83 合併成一段 |
| 12 | 181 | 可執行動作 | 「把記憶當程式碼管：審查、修剪、放進版控」是建議照做，但沒有動作 | 補一句動作：「每次開新 session 前，花一分鐘用 `/memory` 掃一遍，刪掉已經不成立的筆記。」 |

建議刪除（待確認）：無。改寫只涉及斷句與搬位置，總字數不會掉超過 10%。

修正：1、3、4、5、6、7、8、9、10、11、12 依建議改寫（四問題、該放／不該放、auto memory 類型、核心工具改清單或表；本地→本機；補 /memory 動作）。2 併入 should-fix 1。

## 複審

複審對象 sha256：bef1496a407a8f5e02dd2e00dc34dc81408125b3a103fc9b68178f1758cd4266，複審者：獨立子代理（未參與撰寫），2026-10-21

依據：投影片文字檔 `2_agent_use_1.txt`（第 N 個 form-feed 區塊＝PDF 第 N 頁）p2、6、7、10、11、12、18、20–26、28、30、31、35、38、42 重讀；官方文件 2026-10-21 以 curl 重抓 memory、how-claude-code-works、permission-modes、costs、context-window、skills 的 `.md`；`l2-claude-code-factcheck.md`。站內連結以檔案存在檢查（`-en` 英文版不在範圍）。

| 原審項目 | 已解決？ | 證據（現行行號） |
|---|---|---|
| must-fix 1 工具分類「範圍一致」 | ✅ | L226 改為官方五類＋「官方多了程式碼智慧…投影片沒有列」，掛 how-claude-code-works 連結；文件 L45 有 Code intelligence |
| must-fix 2 p12 成本句歸屬 | ✅ | L127 拆成「投影片的說法」（p12 原句：prefix-cache reads account for most of the cost）、「白話講」（本文轉述）、「官方文件…以快取價重讀」（costs L388） |
| must-fix 3 MCP 開場內容過時 | ✅ | L111 投影片說法與現行文件分開寫；how-claude-code-works L140「only tool names and server instructions」 |
| should-fix 1 「不是一段話而是請求」＋標節錄 | ✅ | L54 |
| should-fix 2 例子假設與讀入欄 | ✅ | L133 寫明忽略輸入與輸出；L135–142 加「這次呼叫讀入」；L144 補快取一句 |
| should-fix 3 壓縮後重載範圍收窄 | ✅ | L18 glossary、L129、L282 綜合題 2 均已收窄到根目錄 CLAUDE.md／無 `paths:` 規則／auto memory |
| should-fix 4 p42 練習補理由、標本文補充 | ✅ | L268「理由為本文補充」，L269–275 每題一句理由；答案標籤與 p42 逐項一致 |
| should-fix 5 表標 p30–31、plugin 不掛 loop | ✅ | L232、L239；p31「one installable unit」 |
| should-fix 6 Auto 改可查事實 | ✅ | L123「預設是 Claude Sonnet 5」（permission-modes L375） |
| should-fix 7 CS146S 橋接 | ✅ | L72、L293；檔案存在 |
| should-fix 8 載入欄改「每個 session」 | ✅ | L173 |
| nit 1–4、7 | ✅ | L83「（壓縮之前）」、L75 role user、L70「依模型與語言而異」、L202 `/doctor prompt-audit`（memory L94）、L30 帳單一句 |
| polish 1、3–12 | ✅ | L30、L32、L81（刪「重點是」）、L117、L155–160、L178–190、L194–200、L215–226 表、L245「本機」、L206 `/memory` 動作 |

數字重算：10,000＋10,400＋12,900＋14,100＋14,400＋15,000＝76,800 ✅；(20,000−2,500)×4（M₃–M₆）＝70,000 ✅；表內各列累加（+400、+2,500、+1,200、+300、+600）與下一列讀入一致 ✅。

新／改寫段落查證：L111、L123、L127、L129、L173、L202、L226、L243（p35「Side-effecting workflows should usually require explicit invocation」；skills L548）皆與來源相符。未發現把本文新解讀掛在投影片名下的情形：L127「白話講」、L206「實際的做法可以很簡單」、L268「理由為本文補充」都有區隔。

新問題：

- 🟡 L199–200：「- 參考：…」下一行直接接「MEMORY.md 是索引…」，中間沒有空行。CommonMark 會把這句當成最後一個條列的延續段落，渲染後變成「參考」那一點的一部分。建議在 L199 後加一個空行。
- 🟢 L129：「沒有 `paths:` 的規則與 auto memory 會從磁碟重新載入」掛的是 memory 連結，但 memory 頁（L622）只講根目錄 CLAUDE.md 與子目錄／`paths:` 規則；auto memory 與無 `paths:` 規則的重載寫在 context-window 頁的「What survives compaction」表（L27–28）。可補掛 context-window 連結。
- 🟢 L144「這就是投影片說快取讀取佔大部分成本的來源」是本文把例子接回 p12 的推論，語氣接近替投影片解釋；可改「這正好對應投影片的說法」。不影響事實。
- 🟢 L123「它不是便宜的小過濾器」仍帶評語色彩，但前一句已給出可查事實，可留。

結論：通過
