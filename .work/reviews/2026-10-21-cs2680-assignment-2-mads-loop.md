審稿對象：src/content/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop.md，sha256：f11f559d40ddffe03edd1e5594193d4650a3034e7778bb4336d5cff935abfeef

post-verify、post-polish：作者自查（撰寫的分身），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：作業 2 頁面 https://cs2680.com/assignments/assignment2（2026-10-22 重抓，與 `sources/pages/assignments_assignment2.txt` 正文無差異）、starter 檔 `assignment2.tar.gz`（只讀檔，未執行其中腳本）、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 6、查證表 `.work/research/harvard-cs2680/a2-factcheck.md`。

## post-verify

查證表 `a2-factcheck.md` 共 29 項：Confirmed 24、Observed 4、Not found 1，沒有 Outdated 或 Contradicted。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 連線失敗 → `curl` 直接抓原頁（cs2680.com、arXiv、Hugging Face raw、GitHub raw，全部 200）；OpenAI 文件經 `r.jina.ai` 讀全文，另以 openai-python SDK 原始碼對照。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 9/21 發、10/4 截止、佔 10% | 作業頁標頭；首頁 Grading | Confirmed | |
| 2 | 導言 | 課程不錄影 | cs2680.com/policy | Confirmed | |
| 3 | 導言 | 第 4 堂 loop 錨點 `#第-2-堂的軌跡寫成-20-多行程式` | 已 build 的 dist HTML 的 heading id | Confirmed | |
| 4 | 規格 | 介面、未暫存改動、`git diff` 取 patch | 作業頁 0.1 | Confirmed | |
| 5 | 規格表 | 模型、proxy 端點、金鑰環境變數、image 1.6–1.8 GB、建議四工具、10 題 | 作業頁 The model API、環境、1.1、警語 | Confirmed | |
| 6 | 規格 | Qwen3.6-35B-A3B：MoE、35B／3B、262,144、預設 thinking | HF 模型卡 | Confirmed | |
| 7 | 規格 | proxy 上 context 上限作業頁沒寫 | 作業頁、computing/api 頁 | Not found | 寫成「要自己量」 |
| 8 | 規格 | Apple Silicon 模擬、PLATFORM_FLAG、可用 cluster | 作業頁環境段 | Confirmed | |
| 9 | 三條硬性要求 | 原文三條；「DO NOT TRUST IT」 | 作業頁 | Confirmed | |
| 10 | log | 六種事件與欄位；result 記截斷後版本；只用這些欄位、除錯印 stderr | 作業頁 0.3 | Confirmed | |
| 11 | log | developer_logs/ 交 coding agent session（jsonl） | 作業頁 0.2 | Confirmed | |
| 12 | 自我檢查 | 沒有 tool call 就結束 → reason `no_tool_calls` | 作業頁 0.3 的 reason 列舉 | Confirmed | 「不一定算成功」為本文判斷 |
| 13 | 懷疑處 | 題目三欄，starter `run_task.sh` 只傳 problem_statement | starter 檔 | Observed | 只描述事實 |
| 14 | 懷疑處 | SWE-Bench Pro 分數是三欄都給；GPT-5 25.9% → 8.4%（50 輪、\$2） | arXiv 2509.16941 §5、表 3 | Confirmed | |
| 15 | 懷疑處 | system prompt 範例提到 `repro_check`，工具表沒有、句子未完 | 作業頁 1.3 HTML | Observed | 不推測是否刻意 |
| 16 | 懷疑處 | mini-swe-agent 只用 bash | GitHub README | Confirmed | |
| 17 | 懷疑處 | proxy 回傳推理放在哪個欄位作業頁沒寫 | 作業頁 | Not found（同 #7 類） | 建議讀者第一次印出完整 response |
| 18 | 五種失敗 | SWE-Bench Pro 論文：Qwen3 32B 工具錯誤 42%，受測模型最高 | arXiv 2509.16941 §6.3 | Confirmed | 註明不同模型與 scaffold |
| 19 | 教學例子 | `function.arguments` 是字串、不保證合法 JSON、可能有多餘參數 | openai-python SDK 型別說明；OpenAI function calling 指南 | Confirmed | |
| 20 | 教學例子 | 沒配對的 call 是 API 錯誤 | 作業頁 1.3 | Confirmed | |
| 21 | 教學例子 | 片段輸出（`Expecting ',' delimiter at char 22`） | 本站實跑（Python 3.11） | Confirmed | 另測正常呼叫、參數名錯、工具不存在三種，結果符合 |
| 22 | 五種失敗表 | 各列策略 | 本文整理；第 5 列名稱對應論文 Appendix A 的 Endless File Reading；第 4 列對應作業頁 1.3「至少截斷」 | 本文推論，已在正文標示來源處 | |
| 23 | 截斷例子 | 32,936 字元 → 4,075 字元，最後一行保留 | 本站實跑 | Confirmed | |
| 24 | 容器 | Part 2 可信；docker_env.sh；容器預設無 openai；starter 另找 3.10+ 直譯器、bash 工具用 image 原環境 | 作業頁 Part 2；starter `run_task.sh` 註解 | Confirmed | |
| 25 | 官方評估 | 套 patch 到乾淨 checkout、還原測試、跑隱藏測試；改測試沒用；eval_results.json | 作業頁 2.4 | Confirmed | |
| 26 | 自建題 | 4 題、不能取自 benchmark、兩種來源、三件東西、verify.sh 規則、兩組各 2 題 | 作業頁 2.6 | Confirmed | |
| 27 | 評分 | 40／40（20／10／10）／20；可解題中解出比例；不可解拿 PASS 扣分；hidden 全可解；一頁硬上限、不可用 AI 文字；影片內容 | 作業頁 Grading、Write-up、Video | Confirmed | 「不可解拿 PASS 扣分」照原文、不解讀 |
| 28 | 評分 | run_all.sh、evaluate.sh、make_patches.py 用課程版本；run_task.sh 可改 | 作業頁 2.5 | Confirmed | |
| 29 | 延伸閱讀 | CMU 11-768 作業 1、第 6 堂 slug 與主題 | 站內檔案 frontmatter | Confirmed | |

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `f11f559d…abfeef`，與檔頭一致（審稿期間未改）。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。
- `register-scan.sh`：長句 4（L32 聚焦問題 69 字、L198 容器流程 62 字、L211 自建題第 2 項 60 字、L249 綜合題 3 判準 74 字，跟 post-polish 紀錄一樣）、但書 6/64 段（9%）、引述區塊 10（都是自我檢查）、數字 ≥4 的段落 7（日期配分、評分、來源說明，可接受）、姓名主詞 1（參考資料，誤判）、模板化轉折 0、英文術語 3（MoE、thinking mode、commit／PR，可保留）。
- `pnpm check:references`：本篇只有一個 ERROR，是 `-en` 版本還沒產出，照指示忽略。`check-course-titles.mjs`（整個 CS2680 系列一起傳）：0 issue。
- 站內連結：第 4 堂錨點 `#第-2-堂的軌跡寫成-20-多行程式` 對得上 L4 的 H3「第 2 堂的軌跡，寫成 20 多行程式」；CMU 11-768 作業 1、第 6 堂、作業 1 Mads-Lens 都存在。L93 的 `\$2` 是因為站上開了 remark-math，跳脫是對的。
- 程式碼：把 L128–148 和 L178–186 抽出來用 `python3 -I` 實跑。壞 JSON 的 call 輸出跟 L154–155 一字不差（`Expecting ',' delimiter at char 22`、`is_error: True`）。截斷片段：2,000 行、最後一行是 FAILED 的輸入，輸出 4,075 字元，最後一行還在，跟 L189 一致。另外測了幾種輸入：多一個參數、`[]`、`null`、未知工具都會回 tool message；**但 `read_file` 讀不存在的路徑時丟 `FileNotFoundError`，整個程式直接停掉**（見 must-fix 1）。

### 事實抽驗

作業頁抽 14 條，對 `sources/pages/assignments_assignment2.txt` 和現行頁面（2026-10-22 curl，關鍵句都還在）：9/21 發、10/4 截止、10%（存檔 L5–6）；「DO NOT TRUST IT」與三條硬性要求（L9–12）；10 題、有些不可解、改 Part 0/1 就能解的算可解（L14）；`api.cs2680.com/v1`、`CS2680_API_KEY`、不准 hardcode（L16–29）；image 約 1.6–1.8 GB、Apple Silicon 設 `PLATFORM_FLAG`（L40–43）；介面與未暫存改動、`git diff`（L53–62）；log 六種事件與欄位、result 記截斷後的版本、「stick to exactly these fields」（L82–102）；四個工具（L108–117）；call 與 result 配對，不配對就是 API error（L133–135）；`repro_check` 句子沒寫完（L138–139）；至少要截斷大輸出（L140）；官方評估套 patch、還原測試檔、改測試沒用、`eval_results.json`（L181–200）；mytest 兩種來源、三件東西、`verify.sh` 判定規則、兩組各兩題（L228–281）；評分 40／40（20／10／10）／20、可解題中解出的比例、不可解拿 PASS 扣分、hidden 全可解、一頁硬上限、不准用 AI 寫的文字、3 分鐘影片（L344–372）。全部 Confirmed。

starter `run_task.sh`（scratchpad 的解壓副本，只讀）：只把 `problem_statement` 寫進 `.problem_$IDX.txt`；另外找一個 Python 3.10 以上的直譯器跑 harness，註解寫明「the agent`s bash tool still uses the image`s default python」。L93、L198 Confirmed。

外部來源抽 4 條，都用 curl 抓原頁：
- SWE-Bench Pro arXiv HTML 表 3：GPT-5 (high) 25.9% → 8.40%，條件「max turn limit of 50 and max cost of $2」。L93 Confirmed，三分之一左右也算得對（0.32）。
- 同篇 §6.3：「Qwen3 32B, as an open-source model, exhibits the highest tool error rate (42.0%)」；Endless File Reading 的定義最後是「eventually timing out or failing due to inaction」。L106、L172 Confirmed（L106 的寫法有問題，見 must-fix 2）。
- Qwen3.6-35B-A3B 模型卡 raw README：「35B in total and 3B activated」「262,144 natively」「operate in thinking mode by default」。L55 Confirmed。模型卡另外寫了 `enable_thinking` 開關（README L827）和「Thinking Preservation」的 `preserve_thinking` 選項（README L26、L839–857），文章沒提（見 should-fix 2）。
- openai-python `chat_completion_message_function_tool_call.py`：「the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code」。L110 Confirmed。另外對了 mini-swe-agent README「Does not have any tools other than bash」，L97 Confirmed。

### 教學規格對照（作業導讀）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 聚焦問題與讀完能力 | L32 | 有，照範圍卡原文 |
| 讀完能力：列出五種失敗、各一條策略 | L164–170 表格 | 做得到。五列都有「長什麼樣／策略／在 log 看哪裡」，策略都具體到能動手（timeout、指數退避加上限、頭尾截斷、步數上限加重複偵測）。第 2 列「等互動輸入」只靠 timeout 處理，見 nit 2 |
| 範圍卡例子：壞 JSON 的 tool call，對照直接 raise | L112–160 | 例子本身做到了：條件（少一個 `}`）、直接 `json.loads` 的三個後果、改寫後的輸出、配對沒斷的理由都有。但片段宣稱的保證不成立，見 must-fix 1 |
| 範圍卡自我檢查：怎麼知道 harness 夠不夠好 | L239–240 | 有，判準要求逐題分成 harness／模型／題目三類，跟範圍卡一致 |
| 各節自我檢查附答案或判準 | L86、L101、L193、L218、L239、L244–249 | 全部有答案或判準，核對正確（`no_tool_calls`、context 膨脹、`gold.diff` 套不過） |
| 邊界：不放官方解答、不放完整程式碼 | 全文 | 守住了。只有兩段片段（tool call 包裝、截斷），沒有 loop 主體、system prompt、工具實作、`verify.sh`；沒有點名哪幾題不可解 |
| 課程誠信 | L91–99、L234 | 沒有變成代寫。L91 寫「怎麼處理是你的設計決定」，L234 交代 writeup 不准用 AI 寫的文字。漏了「agent 不准讀 `task_test.json`」這條規則，見 should-fix 1 |
| 沒解釋就用的術語 | L106「scaffold」、L50／L211「base commit」 | 見 should-fix 4 |
| 研究過程漏進正文 | 全文 | 正文沒有；L260 的「2026-10-22 重抓比對無差異」放在來源說明，可接受（nit 4） |
| 影片狀態行、來源區放在後面 | L26、L257 | 符合 |
| inline 來源 | L55、L93、L110 有；L106 沒有 | 見 must-fix 2 |

### 🔴 must-fix

1. **L125、L131、L160：片段宣稱「不管哪裡出錯都回 tool message」「不讓例外中斷 loop」，實跑不成立。** `tools[name](**args)` 外面只接了 `TypeError`。讀者照 L145 的寫法，`read_file` 碰到不存在的路徑會丟 `FileNotFoundError`，`edit_file` 找不到 `old_string` 時多半也是自訂例外，程式照樣停掉，正好是這節在警告的情況。L160 只講到「`TypeError` 會被誤報」，沒講到其他例外會直接讓程式停掉。建議改法：在 `except TypeError` 後面加一層 `except Exception as e: content, is_error = f"Error: {name} failed: {type(e).__name__}: {e}", True`，再把 L160 改成「這只是片段：`TypeError` 同時代表參數不對和工具內部出錯，你的版本要先用 schema 或 `inspect.signature` 驗參數，再執行工具」。改完重跑 L154 的輸出（不會變），另外補測一次讀不存在檔案的情況。
   修正：片段在 `except TypeError` 後加 `except Exception`，回 `Error: {name} failed: {type}: {msg}`；docstring 改「一定回一則」；導入句補「也接住工具本身丟出的例外」；片段後補 FileNotFoundError 的實際輸出一句，L160 改成「`TypeError` 同時代表參數不對和工具內部出錯……先用 schema 或 `inspect.signature` 驗參數」。從文中抽出程式實跑：壞 JSON 輸出不變；另測讀不存在檔案（FileNotFoundError）、edit_file 丟 ValueError、參數名錯、未知工具、`[]`、`null`，全部回 tool message、loop 不中斷。
2. **L106：有數字（42%）和論文結論，卻沒有 inline link，還多寫了「所有受測模型」。** 依 post-review 8.5，有數字的段落沒有連結就是必修。原文是 Qwen3 32B「exhibits the highest tool error rate (42.0%)」，比較對象是 §6.3 做失敗分析的那幾個模型，不是論文所有受測模型。建議改成：「SWE-Bench Pro [論文](https://arxiv.org/html/2509.16941)分析失敗軌跡時，開放權重的 Qwen3 32B 有 42% 的失敗歸在工具使用錯誤，是分析的幾個模型裡最高的。」L172 的 endless file reading 也順手補同一個連結。
   修正：照建議改寫，加 inline 連結，改成「分析的幾個模型裡最高的」；L172 endless file reading 補同一連結。

### 🟡 should-fix

1. **L44–53 規格表漏了一條會讓人犯規的規定。** 作業頁 2.5 寫 `task_test.json`「your agent must never read it」，`agent_task_input.json` 是「the only task data your agent may use」；mytest 的 `gold.diff` 也是「never shown to your agent」。讀者自己寫 harness，很容易讓 agent 用 bash `grep` 整個 `assignment2/`，或把測試清單塞進 prompt。建議在規格表加一列「agent 能用的資料：只有 `agent_task_input.json`；`task_test.json` 和 `gold.diff` 不能讓 agent 看到」。
   修正：規格表加一列「agent 能用的資料」：只有 `agent_task_input.json` 的題目內容；`task_test.json`、`gold.diff` 不能讓 agent 看到。
2. **L99 thinking mode 一段：一句不準，也漏了可以直接用的開關。** 「也會跟著回覆一起留在歷史裡」不一定成立：要看 harness 有沒有把它放回 messages，模型卡也把保留歷史推理寫成要另外打開的選項（`preserve_thinking`，README L839–857）。模型卡同時寫了關掉 thinking 的 `enable_thinking: false`（README L827）。建議改成：「模型卡提供兩個開關：`enable_thinking` 關掉推理、`preserve_thinking` 把歷史推理送回模型；課程 proxy 接不接受這兩個參數，作業頁沒寫，要自己試」，並附模型卡連結。
   修正：刪掉「也會跟著回覆一起留在歷史裡」；改寫成模型卡的兩個開關 `enable_thinking`、`preserve_thinking`（已回 raw README 確認），proxy 是否接受與推理欄位作業頁都沒寫；加模型卡 inline 連結。
3. **L44／L198：沒提 starter 會把 agent 新增的檔案也算進 patch。** starter `run_task.sh` 在取 diff 前跑 `git add -N .`，workdir 裡任何新檔案（重現腳本、暫存輸出）都會進 `model_patch`。這會直接影響讀者的設計（作業頁要重現檢查寫在 `/tmp`，就是這個原因）。建議在 L198 補一句：「它取 diff 前會把新檔案也加進去，所以 agent 寫的重現腳本要放 `/tmp`，不要留在 repo 裡。」
   修正：容器段補「取 diff 前會把 agent 新增的檔案也加進去，重現腳本要放 `/tmp`」（starter `run_task.sh` 的 `git add -N .` 已確認）。
4. **術語：L106「scaffold」沒解釋；L50、L211「base commit」第一次出現沒有白話。** 讀者是會 Python 的工程師，但不一定熟 SWE-bench 的用語。建議 L106 寫成「不同的模型和外層框架（scaffold，也就是包住模型的 harness）」，L50 寫成「repo 已經停在題目出題時的那個 commit（base commit）」。
   修正：L106 改「外層框架（scaffold，也就是包住模型的 harness）」；規格表改「repo 停在出題時的那個 commit（base commit）」。
5. **圖表（9.3）：L198 的容器流程適合畫成流程圖。** 這段是固定順序的六步（拉 image → 起容器 → 掛目錄 → `docker_env.sh` → `madsLoop.py` → 取 log 與 `git diff` → 官方評估），現在擠在一個 62 字的長句裡。建議用 `diagram` skill 畫一張橫向流程圖，順便把 L198 的長句拆短。
   修正：用 `flow-diagram`（diagram skill 列的「逐步請求流程、只有方框和箭頭」選項）畫六步流程：run_task.sh → 任務容器內 madsLoop.py ⇄ 課程 proxy → repo → git diff → 官方評估 → eval_results.json；原長句拆成圖＋兩段短文。`scripts/diagram-preview.ts` 三輪修到全 ✓（標籤壓框、字太小已修），淺色桌面與 375px 截圖目視確認；手機版是元件設計的內部橫向捲動（min-width 500px），無整頁橫捲。

### 🟢 nit

1. L210：自建題的描述還有兩個格式要求沒寫：「一段話、放在 `problem_statement` 欄」「`requirements`、`interface` 兩個 key 保留、值給空字串」。照作業頁補半句就好。
   修正：補「只寫一段，放在 `problem_statement` 欄；`requirements`、`interface` 保留、值給空字串」。
2. L167 第 2 列：「指令在等互動輸入」除了 timeout，更直接的做法是把 stdin 接到 `/dev/null`。另外 `subprocess.run(..., shell=True, timeout=…)` 逾時只會殺 shell，殺不到它開的子行程（測試常會開子行程），可以提醒一句要殺整個 process group。
   修正：第 2 列策略補 stdin 接 `/dev/null`、逾時殺整個 process group。
3. L227：交件表的 `mytest/` 一列可以點名 `solved_after_change.json`、`unsolved.json`、`task_test.json`，跟 L216 對得起來。
   修正：交件表 `mytest/` 列點名三個 json、Dockerfile、gold.diff、verify.sh、8 份 log。
4. L260：「2026-10-22 重抓比對無差異」偏審稿紀錄，留著不算錯，也可以只寫讀取日期。


   修正：改成只寫「2026-10-22 讀取」。

修正後 sha256：14625ec24f75194d3d701336f1e6806c7c0e3cb9003fcee909509a7dfb9d45d5（2026-10-22，作者）。尚未複審。重跑：check:tw 0 blocking；register-scan 長句 3（聚焦問題、自建題第 2 項、綜合題 3 判準，照 post-polish 理由保留）；課程標題逐篇 0 issue；版面（zh 8 篇）0 issue；process-leak exit 0；diagram-preview 全 ✓；check:references 只剩 -en 未產出。

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 4 句（導言聚焦問題 69 字、容器流程 62 字、自建題第 2 項 60 字、綜合自我檢查 3 判準 74 字）、但書段落 9%（綠）、引述區塊 10（誤判：全是自我檢查的 `>` 區塊）、單段數字 ≥4 有 7 段（導言日期與配分、評分項、來源說明屬誤判；SWE-Bench Pro 段已改寫成一組前後對照）、姓名主詞 1（參考資料的論文作者，誤判）、模板化轉折 0、一般英文術語 3（MoE、thinking mode、commit／PR，屬產品與工具用語，保留）。

| # | 位置 | 指標 | 問題 | 處理 |
|---|---|---|---|---|
| 1 | 懷疑處：三欄 | 長句（72 字）、數字 9 個 | 兩個模型的四個百分比加條件擠一句 | 改成兩句，只留 GPT-5 一組，條件移進括號 |
| 2 | 教學例子：後果 | 長句（89 字） | 三個後果用分號串 | 改清單 |
| 3 | 容器段 | 長句（88 字） | starter 處理的怪問題與 bash 環境擠一句 | 拆三句 |
| 4 | 自建題 | 長句（77 字） | 限制與來源擠一句 | 拆兩句 |
| 5 | 導言聚焦問題、綜合自我檢查 3 判準 | 長句（69、74 字） | 問題句與判準列舉 | 保留：問題句照範圍卡原文；判準拆開會失去對應 |

`pnpm check:tw`：0 blocking、0 to review。

其他檢查：`check-course-titles.mjs` 逐篇 0 issue；`check-course-guide-layout.mjs`（整系列 zh 8 篇）0 issue；`check-process-leak.mjs` exit 0；`check:references` 只報英文版尚未產出的 `-en` 連結。

修正：1–4 已改；5 保留。

## 複審

審稿者：同一位獨立審稿子代理，2026-10-22。審的檔案 sha256 `14625ec2…9d45d5`。

### 逐項核對

| 項目 | 新位置 | 判定 |
|---|---|---|
| 🔴1 例外會讓程式停掉 | L126、L131–151、L163、L165 | 到位。重新抽出 L129–151 用 `python3 -I` 實跑：壞 JSON 的輸出跟 L157–158 一字不差；讀不存在的檔案回 `Error: read_file failed: FileNotFoundError: …`（跟 L163 一致）；`edit_file` 丟 `ValueError`、參數名錯、`[]`、`null`、未知工具，全部回 tool message，loop 沒有停。工具內部的 `TypeError` 會被報成「bad arguments」，L147 的註解和 L165 都已經寫明。 |
| 🔴2 L106 沒附連結、「所有受測模型」寫過頭 | L107、L177 | 到位。補了 inline 連結，改成「分析的幾個模型裡最高的」，跟論文 §6.3 一致。 |
| 🟡1 agent 不准讀 `task_test.json` | L53 | 到位。跟作業頁 2.5、2.6 一致。 |
| 🟡2 thinking 的兩個開關 | L100 | 到位。`enable_thinking`、`preserve_thinking` 跟模型卡 README L827、L839–857 一致；錯的那句已經刪掉，也加了連結。 |
| 🟡3 新增的檔案會進 patch | 圖下第一段（原 L198） | 到位。跟 starter `run_task.sh` 的 `git add -N .` 一致。 |
| 🟡4 術語 | L50、L107 | 到位。 |
| 🟡5 流程圖 | L203–342 | 到位，內容跟作業頁一致：主機上的 `run_task.sh` 啟動任務容器（2.3）；`madsLoop.py` 送整段 messages 給 proxy 上的 qwen3.6、拿回 tool calls（1.2、1.3）；在 `/app` 的 repo 執行工具（2 開頭）；`git diff` 交給官方評估，套到乾淨的 checkout、還原測試、跑隱藏測試（2.4），評估畫在任務容器外面，對應作業頁「evaluation runs in another one」；`eval_results.json` 每題 true／false（2.4）。重跑 `diagram-preview.ts`：✓ no overlapping, clipped or tiny text；淺色、深色桌面截圖目視正常。原本 62 字的長句也拆掉了。 |
| 🟢1–4 | L151 列表第 1 項、L172、L168、L201 | 都已修改，內容正確。 |

### 有沒有引入新錯

- 機械檢查：`check:tw` 0 blocking、0 to review；`check:references` 只剩 `-en` 未產出那一條；長句從 4 句降到 3 句（都是先前已接受的）。
- 截斷片段重跑：輸出 4,075 字元，最後一行還是 FAILED，跟 L194 一致。
- 沒有找到新的事實錯誤或研究過程外漏。

### 🟢 nit（不擋發布）

1. 圖上第 5 步把 `git diff` 直接畫成從 repo 指向官方評估，中間省略了 `model_patch_*.diff` → `make_patches.py` → `patches.json` → `evaluate.sh` 這幾步。當成示意可以接受；想更精確的話，可以在第 5 步的文字補「經 `make_patches.py` 打包」。
2. 片段如果拿到缺 `function.name` 的 call，`call["function"]["name"]` 會在 try 外面丟 `KeyError`。OpenAI 相容 API 實際上很少這樣回，可以不處理。

結論：通過

修正（作者，2026-10-22）：複審 nit 兩條已修。片段改在 try 內取 `function.name`／`arguments`，缺欄位回「malformed tool call」的 tool message；從文中抽出程式重跑，原有 8 種輸入輸出不變，另測缺 name、function 為 null 兩種，都回 tool message。圖下補一句：第 5 步省略了 `run_task.sh` 存 patch 檔、`make_patches.py` 打包成 `patches.json`、交給 `evaluate.sh` 這段（對 starter `run_all.sh` 確認順序）。check:tw 0 blocking。sha256：1fa3535636eff59fe1c22a4c46381ec0989750347cb1f411d139ee970f09b9d6。
