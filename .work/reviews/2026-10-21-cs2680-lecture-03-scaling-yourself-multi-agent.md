# 審稿紀錄：2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent

審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent.md，sha256：ab2a14e6b13ba43d7b7015052950c2b144e275b472309e7277fe479775b28374

作者自填：post-verify、post-polish（2026-10-22）。post-review 待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/3_agent_use_2.txt`／`.pdf`（72 頁，頁碼用 PDF 頁序；p62、p66、p68 圖頁已渲染讀取）、查證表 `.work/research/harvard-cs2680/l3-factcheck.md`（48 項＋反證 4 篇）、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 4。

## post-verify

查證表統計：Confirmed 31｜Outdated 5｜Contradicted 3｜Not found 3（另有反證來源 4 篇全文讀過）。正文對每一項非 Confirmed 的處理：

| 查證表 # | 主張 | Verdict | 正文處理 |
|---|---|---|---|
| 3 | Superpowers 九個 skill | Outdated | 寫「投影片列了九個；到 2026 年 10 月 repo 有 15 個」 |
| 8 | Caveman「65% fewer output tokens」 | Outdated | 寫出投影片原說法，再用 README 現行四列表格（6,983／4,334／4,119／2,693）與「中位數只比 Answer concisely 再少 3%」、1,160 input token、JetBrains 8.5%；結論是先看比較基準 |
| 11 | Caveman 兩個 hook | Outdated | 表格只寫 SessionStart 與 UserPromptSubmit 的作用（投影片範圍），未宣稱只有兩個；SubagentStart 未寫 |
| 15 | hook 不能改寫送給 LLM 的請求 | Outdated | 寫明 PostToolUse `updatedToolOutput` 能換單一工具結果，但改不到整個請求，所以壓整段請求仍要 proxy |
| 18 | 桌面版自動 worktree | Contradicted | 寫「現行桌面版文件寫預設關閉，要自己打開 Worktree 開關」 |
| 24 | 巢狀最多 5 層 | Contradicted | 寫「現行文件預設最多往下三層，可用 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 調整」 |
| 25 | `claude-sonnet-5-0` | Not found | 正文範例只用 p33 的 `model: sonnet`，不提這個 ID |
| 27 | subagent 只回報呼叫者 | Outdated | 比較表後補「具名 subagent 現在也能互傳訊息」 |
| 35 | `/goal --max-tries` | Contradicted | 寫「文件裡沒有這個旗標，把上限寫進條件」 |
| 46 | 「Almost 8x」 | Not found | 正文不引用此數字 |
| 48 | Delegation Ladder、「near the bottom」 | Not found | 當講者框架寫；「最下方是第 4、5 級」明寫是依版面判讀 |
| 16 | 三個 scaling 軸 | Not found | 標為講者分法（p27），無外部來源 |

逐段數字重算／對照：

- 教學例子：20＋35＋50＝105；最慢者 50；審查 3×10＝30。已標「本文教學例子，數字是假設的」。
- Codex 數字（p61–63）與論文原文一致：<1%、17.3%、35.4%→70.2%（≥1 小時）、2.1%→25.6%（≥8 小時）、28.6%、2.5 小時；正文已補「分母是使用者比例、耗時由模型估計」與「OpenAI 是特別有利的環境」兩個但書。
- OpenAI 研究組織：原文 3.1 agent-workdays（投影片圖寫 3.14x，正文用 3.1）、中位研究員 >$600／天（API 價）。
- p66 成功率圖：86%／16%／51%／26% 對圖讀出。
- C compiler：16 agents、將近 2,000 sessions、略低於 $20,000、約 10 萬行、Linux 6.9，與 Carlini 原文一致；「自己搭的 harness、Docker、無窮迴圈、`current_tasks/` 鎖、無指揮 agent」皆有原文句。
- METR：16 人、246 issue、+19%、事後自認變快；2026 追蹤的選擇偏誤與改設計，皆對全文。
- Cognition 2025／2026 兩篇主張對全文。

未解決：p63 的「+88% since April」與 P99 71 agent-hours 未寫進正文（不需要）；Karpathy 演講未逐字讀，正文只用投影片 p53 表格的三列定義與 Software 2.0 原文。

## post-review

審稿者：獨立審稿（未參與撰寫），2026-10-22。審稿版本 sha256 `ab2a14e6…8374`（與檔頭一致）。行號為該版本的檔案行號。

### 機械檢查

- `pnpm check:tw <檔>`：0 blocking、0 to review。
- `register-scan.sh`：長句 21 句（106 段）、但書 8／106（7%）、引述區塊 12（全是自我檢查 `>` 區塊，誤判）、單段 ≥4 數字 8 段（多為頁碼與日期）、研究者姓名當主詞 1（Carlini 段）、模板化轉折 0、一般英文術語 8。與 post-polish 一節的結果一致，無新增問題。
- `pnpm check:references`：本篇唯一 ERROR 是 L29 指向尚未產出的 `-en` 版（依指示忽略）；延伸閱讀五個站內連結都解得開。
- `check-course-titles.mjs`（整個 cs2680 系列）：0 issue。`check-course-guide-layout.mjs`：0 issue。`check-process-leak.mjs`：exit 0。

### 事實抽驗

投影片（PDF 頁序，對 txt 逐頁切開比對；p66–68 另渲染 PDF 圖讀）抽 14 條，全部相符：p16 786 行與 client.ts:88；p17「65% fewer output tokens」與 skill 增加 input；p11 matcher `startup|clear|compact`；p7 九個 skill；p30 三個 vs 二十個 session；p34 五層、2–3 層最佳；p23 五個 MCP 工具；p47 16 agents／約 2,000 sessions／略低於 $20,000／約 10 萬行／Linux 6.9；p61 <1%、17.3%；p62 35.4%→70.2%、2.1%→25.6%；p63 28.6%、2.5 小時；p66 86%／16%／51%／26%；p67 中位研究員約 $600；p68 委派梯子五級與 near the bottom。

外部來源抽 6 條，全部相符：
- Claude Code 文件（curl `.md`，皆 200）：sub-agents「up to three layers」與 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`、subagent 只收自己的 system prompt；worktrees `-w` 建在 `.claude/worktrees/<name>/`；desktop「By default, Worktree is off」；goal 評估用 small fast model、不自己跑指令、上限寫進條件；scheduled-tasks 1 分鐘到 1 小時、七天到期；hooks `updatedToolOutput`；agent-teams 具名 subagent 可互傳、teammate 載入 CLAUDE.md／MCP／skills；workflows 中間結果存 script variables。
- Caveman README（raw）：6,983／4,334／4,119／2,693、median 3%、1,160 input token、JetBrains 8.5%。
- Carlini 原文（anthropic.com，200）：2,000 sessions、$20,000、100,000 行、`current_tasks/`、Docker、`while true`。**另讀到正文漏掉的後續**（見 must-fix 3）。
- OpenAI〈Research acceleration〉（jina）：mid-August、3.1 agent-workdays、>$600／天。arXiv 2606.26959 標題相符。
- JetBrains 部落格（200）：標題段即寫「Advertised saving: 65%. Measured saving: 8.5%」，82 組配對、sign test p = 0.82。

### 教學規格對照（concept-guide 單堂導讀）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L37 | 有，與範圍卡「選對 scaling 軸＋說出不穩定在哪一層」一致 |
| 能力一：選對擴充方向 | 表 L98–102；自我檢查 L208–209；綜合題 1 L301–302 | 做得到；三題都有判準 |
| 能力二：指出不確定性在哪一層 | 表 L256–262；自我檢查 L276–277；綜合題 3 | 做得到 |
| 兩個 H2 半場＋導言交代關係 | L35 導言、L41、L226 | 導言有交代；但後半 H2 只寫「不確定性」，OpenAI 數據、委派梯子、反證三節掛不上（見 should-fix 8） |
| Caveman proxy 回扣第 2 堂 API 呼叫 | L65 | 有，明講「每一步都是一次完整的 API 請求」並連到第 2 堂；可加錨點（nit 3） |
| 完整例子（條件／推理／結果／意義） | L112–119 | 有，標明本文假設、數字重算 105／50／30 正確；但只算 agent 那段，沒算到人審完的端到端（見 should-fix 3） |
| worktree 自我檢查 | L123–124 | 答案正確（同函式三 bug 會衝突，不適合） |
| 各節自我檢查附答案 | L53、L91、L123、L194、L208、L276 | 有；L91 答案與 L67 自相矛盾（must-fix 1） |
| 廠商自家數據標明 | L281（OpenAI）、L69–78（Caveman README） | OpenAI 標得好；Carlini 是 Anthropic 自家實驗未標（nit 4） |
| 反證 | L293–297 | 有 METR 兩篇、Cognition 兩篇，對範圍卡的反證補搜 |
| 研究過程漏進正文 | L194 | 「範圍卡的檢驗題」是內部工作流用語（must-fix 2）；其餘「投影片說／現行文件寫」屬必要的產品差異標示 |
| 篇幅 | 全文約 6,600 漢字（第 2 堂約 4,200） | 偏長；選讀段建議折疊（should-fix 7） |

### 🔴 must-fix

1. **L91–92 自我檢查答案和 L67 互相矛盾。** L67 才說現行 PostToolUse hook 能用 `updatedToolOutput` 在 Claude 讀到之前換掉單一工具結果，L92 卻答「要在模型讀到之前就壓掉，得攔在請求送出去的路上，也就是 proxy」。讀者照 L67 會想到 hook 也行。改成：「MCP 工具要模型主動呼叫才執行，786 行 log 在它決定呼叫之前就已經進了 context。要在模型讀到之前壓掉，得攔在工具輸出進 context 的路上：現行 Claude Code 的 PostToolUse hook 能換掉這一筆新結果；要連已經在對話裡的舊輸出一起壓、或用在不支援這個欄位的 agent，就要 proxy。」
   修正：答案改成「得攔在工具輸出進 context 的路上：現行 PostToolUse hook 能換掉這一筆新結果；要連對話裡的舊輸出一起壓、或用在不支援這個欄位的 agent，就要 proxy」，與 Caveman 段的現況說明一致。
2. **L194「（範圍卡的檢驗題）」是內部工作流用語漏進正文。** 讀者不知道範圍卡是什麼。刪掉括號，只留「> **自我檢查**：」。
   修正：刪掉「（範圍卡的檢驗題）」，只留「> **自我檢查**：」。
3. **L220、L224 的結論和 Carlini 原文不一致。** 原文在「16 個 agent 撞同一個 kernel bug」之後接著寫解法：「The fix was to use GCC as an online known-good compiler oracle… randomly compiled most of the kernel using GCC, and only the remaining files with Claude's C Compiler… This let each agent work in parallel, fixing different bugs in different files」。正文停在「平行完全沒有幫助」「多開 agent 只會多付錢」，把可以修的狀況寫成平行的終點，也錯過本堂最好的教學點。L220 後補一句：「作者後來改了測試方式：大部分檔案先用 GCC 編，只把一部分交給新 compiler，壞了再縮小範圍；一個大任務被拆成很多個互不相依的小任務，16 個 agent 才又能各修各的。」L224 改成：「互不相依的任務才能平行；大家卡在同一處時，先想辦法把它拆開，拆不開就別多開 agent。」（L224 呼應 worktree 例子的那句保留。）
   修正：回 Carlini 原文（scratchpad `cc.txt`，「The fix was to use GCC as an online known-good compiler oracle… randomly compiled most of the kernel using GCC, and only the remaining files with Claude's C Compiler… This let each agent work in parallel, fixing different bugs in different files」）確認後，在限制清單後補一段：用 GCC 當對照組、每次隨機挑大部分檔案用 GCC 編、壞了再換回縮小範圍，一個大任務拆成多個小任務後 16 個 agent 才能各修各的。結論改成「互不相依的任務才能平行；卡在同一處時，先想辦法拆開，拆不開就別多開 agent」。另把「同一任務被兩人認領」改寫成原文的「git 的同步會讓第二個改做別的」。

### 🟡 should-fix

1. **L78「光是一句請簡潔回答就省下大半」容易讀成少了一半以上。** 實際 6,983→4,334 是少約 38%；它的意思是 `/caveman` 的節省（約 41%）幾乎都來自這一句。改成：「光是一句『請簡潔回答』就少了約 38%，`/caveman` 的節省幾乎都來自這一句。」另外表中是十題合計，算出來 `/caveman` 比這句少約 5%，README 的 3% 是逐題中位數，句中「以中位數計」後補「（表中是合計，算出來約 5%）」，免得讀者對不上。
   修正：回 raw README 確認 6,983／4,334／4,119／2,693 與 "cuts 3% more at the median"、1,160 input token 後改寫：「光是一句請簡潔回答就少了約 38%，`/caveman` 的節省幾乎都來自這一句」，並補「表中是十題合計，算出來約 5%」與「逐題中位數」。
2. **L78 JetBrains 數字沒有 inline link，描述也可更準。** 補 [JetBrains](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)；它用的是 SkillsBench 的 86 個任務（82 組配對），不是「真實 coding 任務」。這篇開頭就寫「Advertised saving: 65%. Measured saving: 8.5%」，正好直接對上投影片 p17 的 65%，可寫成「JetBrains 專門測了這個 65%：在 SkillsBench 的 86 個任務上配對比較，output 只少 8.5%，分數沒有可量測的差別」。同步改參考資料。
   修正：讀 JetBrains 原文（jina，"Advertised saving: 65%. Measured saving: 8.5%."、SkillsBench 86 of 87 tasks、82 paired、p = 0.82）後改寫成「JetBrains 專門測了這個 65%：在 SkillsBench 的 86 個任務上配對比較，output 只少 8.5%，分數沒有可量測的差別」，補 inline 連結與原文的原因（agent 輸出多是程式碼與工具呼叫）；參考資料新增此文。
3. **L112–119 例子只算到 agent 跑完，沒算到你審完。** 加一欄「到三份都審完」：依序做且邊跑邊審是 115 分鐘（最後一份 105 分鐘跑完再審 10 分鐘），平行做而且每份一完成就審是 60 分鐘；若三個 bug 剛好同時完成，三份審查會排隊，變成 50＋30＝80 分鐘。再接一句「agent 越多，越容易同時完成，你的審查就成了排隊的地方」，把綜合題 2 的「審查落在人身上」落到數字上。
   修正：例子表加「到三份都審完」欄與第三列：依序 105＋10＝115、平行每份完成即審 50＋10＝60、剛好同時完成 50＋30＝80；正文補「依序做時審前一份的同時 agent 在做下一份」「agent 越多越容易撞在一起，審查成了排隊的地方」。
4. **L248「不同的 kernel」會和 L213–220 的 Linux kernel 混淆。** 這裡是 GPU 運算核心。改成「模型本身、不同的 GPU kernel 實作、取樣」。
   修正：改「模型本身、不同的 GPU kernel 實作、取樣」。
5. **幾處官方文件或本文的補充掛在投影片頁碼底下。** L168 任務三種狀態與依賴（p39 沒寫，出自 agent-teams 文件）、L180 環境變數名（p38 只寫 off by default）、L199「中間結果存在腳本的變數裡」（workflows 文件）：各補「（官方文件）」或改用「官方文件補了…」句式，與 L150、L171 的寫法一致。L49「skill 開場只放描述，要不要載入是模型自己判斷（p11）」：p11 只說 available 不等於會去查，「只放描述」是第 2 堂內容，頁碼改指第 2 堂或刪。L274「這三組正好對應前半的工具」是本文的對照，開頭改「對照前半的工具：」並與後面 p59 的結論分段，避免讀者以為是投影片的話。
   修正：任務三狀態與依賴改「官方文件補充：…」；環境變數改「預設關閉（p38）；依官方文件，要設…」；workflow 中間結果改「官方文件補充：…」；p11 那句改「投影片的說法是：裝好只代表可用，不保證 agent 會去查（p11）」，原因改掛第 2 堂連結；「這三組正好對應」改「對照前半的工具：」並與 p59 結論分段。
6. **L204 `/loop` 預設提示不完整。** 文件寫的是：不給提示時跑內建的維護提示，有 `loop.md` 才改跑它（專案層 `.claude/loop.md` 優先於 `~/.claude/loop.md`）。改成「不給提示時跑內建的維護提示；你可以在 `.claude/loop.md` 換成自己的預設提示」。
   修正：改「不給提示時跑內建的維護提示；你可以在 `.claude/loop.md` 換成自己的預設提示」。
7. **篇幅偏長（約 6,600 漢字，第 2 堂約 4,200）。** L211–224「選讀：16 個 agent 寫一個 C compiler」本身標了選讀，建議整段收進 `<details>`（摘要寫「選讀：16 個 agent 寫 C compiler，平行在哪裡失靈、怎麼救回來」），正文只留 must-fix 3 修好後的那句結論。L69–78 Caveman 數字表也可一併折疊，正文只留「先看比較基準」的結論。
   修正：C compiler 整段收進 `<details>`（摘要用審稿建議文字），正文只留一段兩句的結論；Caveman README 數字表也收進 `<details>`，正文留 JetBrains 量測與「先看比較基準」。
8. **後半 H2 標題蓋不住後三節。** L226「後半：Programming 3.0 與不確定性」底下有 OpenAI 數據、委派梯子、反證三節，與「不確定性」無直接關係；範圍卡寫的是「Programming 3.0：不確定性與委派」。H2 改「後半：Programming 3.0、不確定性與委派」，L281 開頭補一句把兩者接起來，例如：「p66 的圖把前面那句『自主程度要和風險相稱』（p59）落到數字上：任務越大，越需要人介入。」
   修正：H2 改「後半：Programming 3.0、不確定性與委派」；p66 那句改成「把前面那句『自主程度要和風險相稱』（p59）落到數字上」接起兩段。
9. **幾個沒解釋就用的詞。** L100「牆鐘時間」第一次出現補「（從開始到結束實際經過的時間）」；L63「hunk 標頭」補「（diff 裡標出改動位置的 `@@` 行）」；L247「記憶體一致性模型」補半句「（規定多執行緒看到寫入的先後）」；L272「合成工作負載」補「（自己造、結果可預期的測試輸入）」。
   修正：四個詞依建議補上半句解釋（牆鐘時間在表格內；hunk 標頭、記憶體一致性模型、合成工作負載在原句）。

### 🟢 nit

1. L287「在觀察期間曾同時管五個以上」：投影片 p63 寫 in a week，論文是 nearly 28.6%。改「約 28.6% 的 OpenAI 使用者在某一週內同時管過五個以上」。
   修正：改「約 28.6% 的 OpenAI 使用者在某一週內同時管過五個以上的 agent」。
2. L289 標 p64，但投影片圖上是 3.14x，正文的 3.1 出自 OpenAI 原文；頁碼後補「（投影片圖上寫 3.14 倍）」或把頁碼移到原文連結後。
   修正：改「（p64；投影片圖上寫 3.14 倍）」。
3. L65「補的那一塊」連到第 2 堂頁首；加錨點直接跳到「先補一塊：一次模型呼叫長什麼樣」那一節。
   修正：連結加錨點 `#先補一塊一次模型呼叫長什麼樣`（已對 dist 的第 2 堂 HTML 確認 id）。
4. L213 Carlini 的實驗是 Anthropic 自家工程部落格，和 OpenAI 一樣是廠商自己的資料，可補「（Anthropic 自家的實驗）」。
   修正：C compiler 段開頭補「出自 Anthropic 自家的實驗」。
5. L250「中間有 PM 和工程師反覆確認」：p56 只畫了 human (PM) → programmer 這條路，「反覆確認」是本文詮釋，改「中間隔著 PM 和工程師」即可。
   修正：改「中間隔著 PM 和工程師」。
6. tldr（L11）276 字，比第 2 堂（261）略長；資訊都正確、與正文一致，不必改。tags 8 個，`multi-agent`、`subagent` 都是站上既有 tag。
   修正：不改（審稿者亦建議不必改）。
7. 台灣讀者位置：全球產品題材，不必硬塞。
   修正：不改。

### 修正後狀態

修正後 sha256：`10821d5f06f0806f9ae086929cc9b5a68b857fd9578cef3c63b014ee65e4b032`（2026-10-22）。**尚未複審。** 修正後重跑：`pnpm check:tw` 0 blocking；`register-scan.sh` 長句 22 句、但書 7／115（6%）、模板化轉折 0；`check-course-titles.mjs`、`check-course-guide-layout.mjs`（整系列 10 檔）0 issue；`check-process-leak.mjs` exit 0；`check:references` 本篇只剩指向未產出 `-en` 版的錯誤。

### 結論

事實層：抽驗 20 條無錯，產品差異都有標；唯一的事實缺口是 C compiler 漏掉原文的解法（must-fix 3）。教學層：兩個學習目標都有正文、例子與判準支撐；要修的是一題自相矛盾的答案、一處內部用語，以及把例子算到人審完。must-fix 3 項修完、should-fix 1–6 修完後可進英文翻譯；7–9 建議一併處理。

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 23 句（約 300 句中 8%）；但書段落 8／101（8%，綠）；引述區塊 12（誤判：全是自我檢查 `>` 區塊）；單段 ≥4 數字 8 段（其中 6 段的數字主要是頁碼 pXX 與日期，屬誤判；「光是一句請簡潔回答」段與教學例子段是例子本體，保留）；研究者姓名當主詞 1（Carlini 段，案例本身就是他的實驗，保留）；模板化轉折 0；一般英文術語 8 次（skill、hook、proxy、input／output 為本系列沿用的產品術語）。`pnpm check:tw` 修掉 4 處「用戶」→「使用者」，現為 0 blocking。

已修：

| # | 位置 | 指標 | 處理 |
|---|---|---|---|
| 1 | Caveman「省多少」段 | 長句 90 字＋單段 10 個數字 | 四種指示的數字改成表格，段落拆成三句 |
| 2 | 手動平行首段 | 長句 78 字 | worktree 定義拆成第二句 |
| 3 | subagent 好處 | 長句 104 字 | 改成五點清單 |
| 4 | 內建 subagent | 長句 70 字 | 拆成三句 |
| 5 | 三種呼叫方式 | 長句 81 字 | 改成編號清單 |
| 6 | 留在主對話 vs 派出去 | 長句 85 字 | 改成「留在主對話的：…。派出去的：…。」兩句 |
| 7 | agent teams 適用工作 | 長句 80 字 | 改成四點清單 |
| 8 | 多層 subagent 分法 | 長句 73 字 | 拆成三句 |
| 9 | `/goal` 現行文件補充 | 長句 100 字 | 拆成「第一、第二」兩句 |
| 10 | C compiler 限制 | 長句 84 字 | 改成四點清單；「放大了一千倍」無來源，改成「換成了真實的規模」 |

保留未改：導言「前半講怎麼放大產出」60 字、流程 skill 定義 72 字、雙向壓縮清單項 72 字、proxy 段 62 字、workflow 段 69 字、Carlini 段 79 字，都在可讀範圍且拆開會斷掉列舉。

## 機械檢查（作者跑過）

- `pnpm check:tw`：0 blocking
- `check-course-titles.mjs`（整系列 10 檔）：0 issue
- `check-course-guide-layout.mjs`（整系列 10 檔）：0 issue
- `scripts/check-process-leak.mjs`：exit 0
- `pnpm check:references`：本篇唯一錯誤是指向尚未產出的 `-en` 版（預期，英文版之後產出）

## 複審

複審對象 sha256：`10821d5f06f0806f9ae086929cc9b5a68b857fd9578cef3c63b014ee65e4b032`，複審者：post-review 同一位獨立審稿者（未參與撰寫），2026-10-22。行號為修正後版本。

依據：重抓 Carlini 原文（anthropic.com，200）、Caveman raw README、JetBrains 原文（jina）；投影片 p38、p39、p43、p47–50、p56、p59、p63、p64、p66 沿用初審逐頁比對；第 2 堂 dist HTML 確認錨點 id。重跑：`pnpm check:tw` 0 blocking；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0；`check:references` 本篇只剩 `-en` 連結；全文已無「範圍卡」字樣。

| 原審項目 | 已解決？ | 證據（現行行號） |
|---|---|---|
| must-fix 1 Caveman 自我檢查與 hook 現況矛盾 | ✅ | L99 答案分出「PostToolUse 換新的一筆」與「舊輸出、其他 agent 要 proxy」，與 L67 一致 |
| must-fix 2 「範圍卡的檢驗題」 | ✅ | L202 只剩「自我檢查」 |
| must-fix 3 C compiler 漏掉解法 | ✅ | L237 補 GCC 對照組、隨機挑大部分檔案用 GCC、壞了換回縮小範圍、拆成小任務後 16 個 agent 才能各修各的；對原文「The fix was to use GCC as an online known-good compiler oracle… randomly compiled most of the kernel using GCC… further refine by re-compiling some of these files with GCC. This let each agent work in parallel」逐句相符，並明講「投影片沒講這段，原文有」。L221 結論改成「先想辦法把它拆開」 |
| should-fix 1 「省下大半」 | ✅ | L83：6,983→4,334 確為約 38%；表中合計 4,334→4,119 約 5%、README「cuts 3% more at the median」相符 |
| should-fix 2 JetBrains inline link 與描述 | ✅ | L69 加連結；SkillsBench 86 個任務、8.5%、分數無可量測差別，與原文「86 of 87 tasks」「converges to -8.5%」「p = 0.82」相符；新增的原因句（輸出多是程式碼、diff、工具呼叫，只壓工具呼叫之間的說明）對原文「code, diffs, tool invocations… dominate… Only the narration between tool calls gets compressed」相符；參考資料 L345 已加 |
| should-fix 3 例子算到審完 | ✅ | L121–125：115／60／80 三列重算皆對（依序：105 跑完再審最後一份；平行：20、35、50 完成各審 10 → 60；同時完成：50＋30）；L127 解釋排隊 |
| should-fix 4 GPU kernel | ✅ | L263 |
| should-fix 5 官方補充與本文對照的歸屬 | ✅ | L176、L188、L207 標「官方文件補充／依官方文件」；L49 p11 改投影片原意、原因掛第 2 堂；L289「對照前半的工具」與 L291 p59 結論已分段 |
| should-fix 6 `/loop` 預設提示 | ✅ | L212，與 scheduled-tasks 文件（bare `/loop` 跑內建維護提示，`loop.md` 取代）一致 |
| should-fix 7 篇幅折疊 | ✅ | L71–85 README 表、L223–239 C compiler 收進 `<details>`，`<summary>` 後有空行，Markdown 會正常渲染 |
| should-fix 8 後半 H2 與轉場 | ✅ | L241 H2；L306 以 p59 接 p66 |
| should-fix 9 四個術語 | ✅ | L107、L63、L262、L287 |
| nit 1–5 | ✅ | L304「某一週內」；L306「投影片圖上寫 3.14 倍」；L65 錨點（dist 有 `id="先補一塊一次模型呼叫長什麼樣"`）；L221「Anthropic 自家的實驗」；L265「中間隔著 PM 和工程師」 |

新問題（都不擋發佈）：

- 🟢 L221 與 L237 末句幾乎重複（「卡在同一處時，先想辦法拆開，拆不開就別多開 agent」）。L221 是 details 外的結論，L237 可刪末句或改成只接回手動平行例子。
- 🟢 L125 第三列「剛好同時完成」與表上方設定的 20／35／50 分鐘不相容，可在列名補「（例如三個都要 50 分鐘）」。

register-scan 長句 22 句逐句看過：條列項、分號串起的判準、frontmatter 外的自我檢查判準（#7–9、#13–14、#20–22）屬列舉，拆開會斷掉對應，保留。值得改的兩句（🟢）：

- L306「投影片 p66 的圖，把…落到數字上：…」102 字、一句塞四個百分比。冒號後拆成兩句：「不到 15 分鐘的任務有 86% 不需要人介入就成功。64 到 128 小時的任務，不需介入就成功的只剩 16%，51% 要人介入至少一次，26% 失敗。」
- L308「委派梯子（p68）：…」100 字、五級擠在一句。改成 1–5 編號清單，順便和 p68 的版面對齊。

其餘（Carlini 81 字在 details 內、METR 80 字、Cognition 84 字）讀得下去，可留。

結論：通過

修正（作者）：複審 4 條 nit 全修：刪 details 內末句重複結論，只接回手動平行例子；表第三列補「（例如三個都要 50 分鐘）」；p66 段冒號後拆成兩句；委派梯子改 1–5 編號清單。內容未變，僅斷句與列名。修正後 sha256：`659e4296f04021891c78fc22cf6efc6799a92b4b9b4a4b0908900fa11d6797bf`。
