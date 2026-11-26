審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering.md，sha256：81070da4ea58db2529b5137a53a93d26033db2c285ed6ea829ab53f6dd3cd49b

post-verify、post-polish：作者自查（撰寫的子代理），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/4_agent_design_1.pdf`（56 頁，頁碼用 PDF 頁序，已逐頁以 pdftotext 對過；p26、p43 渲染成圖讀）、`.work/research/harvard-cs2680/lectures-01-04.md` L4 段、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 5、查證表 `.work/research/harvard-cs2680/l4-factcheck.md`、作業 2 頁 `sources/pages/assignments_assignment2.txt`。

## post-verify

查證表 `l4-factcheck.md` 共 18 項：Confirmed 11、Confirmed（需加條件）3、Outdated 1、Contradicted 2、Not found 1。工具：Groundlane MCP 未掛載、Groundlane HTTP 401 → Keenable 搜尋＋`curl` 直接抓原頁（全部 200）；X 貼文經 api.fxtwitter.com 鏡像。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 第 4 堂 2026-09-16，題目 Agent Design I | lectures-01-04.md L4；投影片 p1 | Confirmed | |
| 2 | 導言 | 課程不錄影 | cs2680.com/policy | Confirmed | |
| 3 | 導言 | 三段 p4–7／p8–26／p27–53；p55 後選讀 | 投影片 p3、p55–56 | Confirmed | |
| 4 | ReAct | 只想不動累積幻覺；只動不想重複自己；ReAct 論文說查真實資料減少幻覺與錯誤擴散 | p4；arXiv 2210.03629 摘要 | Confirmed | 「重複自己」標為投影片說法 |
| 5 | loop | p5 pseudo-code；`role: tool`＋`tool_call_id` | p5 | Confirmed | 本文補成可跑版本，假模型實跑輸出 6 次呼叫、訊息數 [2,4,6,8,10,12]，與正文一致 |
| 6 | loop | 作業 2 用 OpenAI 相容端點 | A2 頁、lectures-01-04.md L4 §8 | Confirmed | |
| 7 | 四件事／三元件 | p6、p7 | 投影片 | Confirmed | |
| 8 | 找程式碼 | 四法比較表、`throttle.ts`、`cart.ts:88`、42 call sites／7 files、先用 grep | p10–14 | Confirmed | |
| 9 | 找程式碼 | Aider repo map：類別函式簽名、依賴圖排序 | aider.chat/docs/repomap.html | Confirmed | |
| 10 | 改程式碼 | 四法與取捨、18 個呼叫點 | p17–21 | Confirmed | |
| 11 | 改程式碼 | 500 行 ×10 token ≈ 5,000；搜尋取代約 30 | 本文教學例子 | 自算 | 正文標為本文例子與假設 |
| 12 | 改程式碼 | 作業 2 的 `edit_file(path, old_string, new_string)` | A2 頁 | Confirmed | |
| 13 | shell | p22 四項、p23 五項、p24 五種工具 | 投影片 | Confirmed | |
| 14 | 原則 | p25 五原則；Anthropic search_contacts、25,000 token | p25；Anthropic writing-tools | Confirmed | 「預設冪等」是投影片自己的，正文說「前四條」一致 |
| 15 | 只給 shell | SWE-agent 18.0／11.0／10.3，GPT-4 Turbo、SWE-bench Lite、2024 | 論文表 1、表 3 | Confirmed（加條件） | 條件寫進正文 |
| 16 | 只給 shell | mini-swe-agent 只用 bash，SWE-bench Verified >74% | GitHub README | Confirmed | 當成 p26 的反證／近況 |
| 17 | 用語演進 | p28 時間線與講者的保留 | p28 | Confirmed | |
| 18 | prompt 技巧 | 八技巧、p39「已過期」、p40 四建議與「換模型重調」 | p29–40 | Confirmed | 明說是詞彙與歷史 |
| 19 | context | Karpathy 定義 | X 貼文 2025-06-25 | Confirmed | |
| 20 | context | 成本／延遲／注意力；prefill／decode 一句定義 | p42 | Confirmed | 定義為本文補充，連 CMU 11-868 |
| 21 | context | Chroma 18 個模型、長度與干擾項 | Chroma 報告 2025-07-14 | Confirmed | 不引用投影片圖上的 73%／46%（Not found） |
| 22 | context | Lost in the Middle GPT-3.5-Turbo 20 文件：75.8／53.8／63.2 | 論文表 6 | Confirmed | 投影片的 76／61／55／59／71 對不上論文（Contradicted），正文已註明 |
| 23 | 四手段 | p44 示意預算；p46 48,000→900；p47 42,000→3,100；p48 96,000→24,000；p49 三提醒 | p44–49 | Confirmed | 標為投影片示意數字 |
| 24 | 四手段 | Anthropic 把清舊工具結果算 compaction、最輕最安全 | Anthropic context engineering | Confirmed | |
| 25 | 五失敗 | 五種定義；Breunig 原文只有四種 | p50；Breunig 原文 | Contradicted（投影片歸屬） | 正文寫明 Drift 是投影片加的 |
| 26 | Model × Harness | Lewis：Verified 43→72／169、Pro 31→72／316；改動兩項 | 論文摘要、表 2 | Confirmed | |
| 27 | Model × Harness | Qwen3.6-35B-A3B、20,480 token window；寬 window 時接近 | 論文摘要、§3 | Confirmed | 投影片沒寫的前提，正文補上 |
| 28 | Model × Harness | 作業 2 指定 `qwen3.6-35b-a3b` | A2 頁 | Confirmed | |

修正：#15、#22、#25、#27 已在正文標出條件或差異；#21 不引用無法核對的數字。

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 與檔頭一致（審稿期間未改）。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。
- `register-scan.sh`：長句 7（與 post-polish 紀錄相同，兩句在綜合題判準裡）、但書 6/119 段（5%）、引述區塊 10（都是自我檢查）、數字 ≥4 的段落 8（頁碼範圍與投影片示意數字，可接受）、姓名主詞 1（Lewis，可接受）、模板化轉折 0、英文術語 0。
- `pnpm check:references`：本篇只有一個 ERROR，是英文版 `-en` 還沒產出，依指示忽略。`check:post-quality`：同一個 `-en` ERROR，外加 `ai-course` tag WARN（全系列都有，不在本篇處理）。`check:process-leak`、`check:series-order`、`check:glossary`：本篇無訊息。
- `check-course-guide-layout.mjs`：0 issue。`check-course-titles.mjs`：0 issue。
- 站內連結目標（第 2 堂、CMU 11-868 KV cache、CMU 11-768 L2／L3、context-engineering-guide、CS146S agent internals）全部存在；CMU 11-868 那篇有 24 處提到 prefill，連過去讀得到定義。
- 程式碼：把 L47–67 的 loop 和 L82–108 的假模型抽出來用 `python3 -I` 實跑，輸出跟 L113–116 完全一致（`Fixed: timeout was too short.`、`[2, 4, 6, 8, 10, 12]`）。

### 事實抽驗

投影片抽 14 條（用 `pdftotext -f N -l N` 逐頁對 PDF 頁序）：p4 只想不動／只動不想、p5 loop、p6 四件事、p7 三元件、p11 `throttle.ts` 與 Aider repo map、p13 `charge()`→`capture()` 42 個呼叫點／7 個檔案、p14 先用 grep、p20 `fetchUser` 18 個呼叫點、p22 四項、p23 五項、p24 五種工具、p25 五原則、p26 18.0／11.0／10.3 與「No on GPT-4」、p28 時間線與講者的保留、p39「already expired」、p40 四建議與「re-tune」、p42 三個理由、p44 2K／6K／25K／8K／80K、p46 48,000→900、p47 42,000→3,100、p48 96,000→24,000、p49 三個 WARNING、p50 五種失敗、p51–53。頁碼和內容全部對得上；只有 p12 的例子轉述得不夠準（見 should-fix 3）。

外部來源抽 5 條，都用 curl 直接抓原頁：
- Chroma Context Rot：「18 LLMs」與「the impact of distractors and their non-uniformity amplifies as input length grows」都有原文，L291 Confirmed。
- Lewis arXiv 2608.26218 摘要：「169 tasks, a 20,480-token window … complete solutions from 43 to 72」「In the wide-window Qwen3.6 comparisons, observed arm outcomes are close on Verified and Pro」，L353–355 Confirmed。
- mini-swe-agent README：「Does not have any tools other than bash」「Scores >74% on the SWE-bench verified benchmark」，L238 Confirmed。
- Anthropic〈Writing effective tools for agents〉：「For Claude Code, we restrict tool responses to 25,000 tokens by default」，L225 Confirmed。
- Lost in the Middle HTML 表 6：GPT-3.5-Turbo 在 index 0／9／19 是 75.8%／53.8%／63.2%，L295–299 Confirmed。

### 教學規格對照（概念導讀，單堂）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L30 | 有，跟範圍卡一致 |
| 讀完能力一：替新 agent 挑工具並說理由 | L138–238、綜合題 1 | 做得到；綜合題 1 題目有歧義（見 should-fix 4） |
| 讀完能力二：把 context 問題歸到五種失敗之一、選對手段 | L323–347 | 只做到一部分：失敗對手段的對照只寫了 Poisoning、Confusion、Distraction，Clash、Drift 沒有手段可選（見 should-fix 1） |
| 斷崖：20 行 loop 對照第 2 堂 | L42–120 | 有。符號對照、訊息數遞增、跟第 2 堂 M₁–M₆ 表一致（六次呼叫、五次工具，第 2 堂 L135–143 已核對） |
| 斷崖：embedding／LSP／AST 白話 | L153、L155、L166 | 有，各一句白話加例子 |
| 斷崖：prefill／decode 定義 | L288 | 有，也有連結；decode 為什麼跟著變慢沒講清楚（見 nit 2） |
| 斷崖：prompt 段標成詞彙與歷史 | L257 | 有，理由引了 p28、p39 |
| 完整例子（條件／推理／結果／意義） | L170–185 | 有，標明是本文例子；5,000／30 重算過，「上百倍」成立（約 167 倍） |
| 常見誤解 | L238（只給 shell）、L289（放越多越好）、L341（摘要能修中毒） | 有，散在各節 |
| 各節自我檢查附答案或判準 | L133、L187、L227、L343、L359 | 都有；答案核對正確（`get_user`→Poisoning、60 個 MCP 工具→Confusion） |
| 不把非投影片內容歸給講者 | L339–341 | 失敗對手段的對照是本文自己的推論，投影片 p50 只有定義，沒有標出來（併入 should-fix 1） |
| 沒解釋就用的術語 | L232「消融」、L234–238 SWE-bench Lite／Verified／Pro、L317「handle」 | 見 should-fix 5、nit 3 |
| 研究過程漏進正文 | 全文 | 沒有。L301「對不上」是給讀者的勘誤，可以留 |
| 影片狀態行、來源區放在後面 | L26、L377 | 符合 |

### 🔴 must-fix

1. L11 tldr「同一個模型換了 harness，解題數可以差將近一倍」沒帶前提。正文 L355 已經寫明，數字只在 20,480 token 的緊 context 下成立，放寬 window 後兩組很接近；但列表、RSS、搜尋結果只會顯示 tldr，讀者看到的是一個沒條件的結論。而且 Pro 是 31→72（2.3 倍），不是「將近一倍」。建議改成：「……最後用一篇論文說明，context 很緊時，同一個模型只換 harness，解題數可以多出七成到一倍以上。」查證表 #5、#7 寫了正文要放 1.7×／2.3×，但正文沒放。可選：在 L353 句末補「（Verified 約 1.7 倍、Pro 約 2.3 倍；投影片標題寫 2×）」。
   修正：tldr 改成「context 很緊時，同一個模型只換 harness，解題數可以多出七成到一倍以上」；Lewis 段句末補「Verified 約 1.7 倍、Pro 約 2.3 倍；投影片標題寫 2×」。

### 🟡 should-fix

1. L337–341 失敗對手段的對照只寫了三種，Clash、Drift 沒有。範圍卡的讀完能力是「歸到五種失敗之一、選對管理手段」，所以這兩種要補上。投影片 p50 也沒有給對照，這整段是本文推論，要標出來。建議改法：清單前加「投影片只給定義，下面的對照是本文整理：」，再補兩條：「**Clash**：新舊資訊都留著。用 Transformation 的去重（同一個物件只留最新狀態，p48）。」「**Drift**：目標被埋掉。把計畫存在檔案裡（Offloading 的外部任務清單，p47），壓縮後把關鍵目標重新放回（p49 的提醒）。」
   修正：清單前改成「投影片只給定義，下面…是本文的整理」，補 Clash（Transformation 去重，p48）與 Drift（計畫存檔 p47、壓縮後放回關鍵目標 p49）兩條。
2. L57–59 loop 少了 p5 的 `validate(call.arguments)` 這一步，可是 L127 的第 3 件事是「驗證並執行請求」。讀者照抄的話，參數錯了會直接丟 `TypeError`，整個任務中斷，跟 L134 的答案（「回一個說明清楚的錯誤」）相反。建議把 L59 包進 `try/except Exception as e: result = f"Error: {e}"`，註解寫「# 投影片 p5 的 validate；參數錯也回給模型」。加完再跑一次假模型確認輸出不變；行數仍在 20 行上下。
   修正：loop 工具執行包進 `try/except Exception as e: result = f"Error: {e}"`，註解標「投影片 p5 的 validate；參數錯也回給模型」；小標改「20 多行程式」。重跑假模型：輸出仍是 `Fixed: timeout was too short.` 與 `[2, 4, 6, 8, 10, 12]`；另測錯誤參數回 `Error: …` 不中斷。
3. L154 轉述 p12 的例子不準。投影片是 stack trace 停在 `cart.ts:88`，點名 3 個 frame，接著打開的是 `tax.ts:20-60`（`applyTax` 的四捨五入），修完跑 `pytest tests/tax.py`，全程沒用到搜尋。「直接打開那幾行」會讓人以為問題在 `cart.ts`。改成：「checkout 當掉時，stack trace 從 `cart.ts:88` 往下列出 3 個 frame；照著打開 `tax.ts` 第 20–60 行，就找到四捨五入的錯，全程不用搜尋（p12）。」
   修正：照建議改寫：stack trace 從 `cart.ts:88` 列出 3 個 frame，打開 `tax.ts` 第 20–60 行找到四捨五入的錯。
4. L361 綜合題 1 的題目有歧義：「只給它一個 `run_sql` 工具和一個 `search_orders(customer_id)` 加 `get_order(order_id)` 兩個工具」讀起來像三個一起給。改成：「方案 A 只給 `run_sql`；方案 B 只給 `search_orders(customer_id)` 和 `get_order(order_id)`。兩個方案各有什麼風險？」
   修正：題目改成方案 A／方案 B；判準同步改用方案 A／B。
5. L232–238 用了「消融」和 SWE-bench Lite／Verified／Pro，都沒解釋。讀者是沒修過研究所課的工程師。建議 L232「消融圖」後面補「（一次拿掉一個元件，看分數掉多少）」；L234 補一句「SWE-bench 是拿真實 GitHub issue 讓 agent 修、用測試判對錯的題庫；Lite、Verified、Pro 是不同的子集，分數不能直接互比」。L238 拿 Lite 11% 對 Verified 74%，更需要這句提醒。
   修正：「消融圖」後補括號解釋；SWE-bench 條件句後補一句題庫說明與「Lite、Verified、Pro 分數不能直接互比」。

### 🟢 nit

1. L131「第 1、4 件事（工具）和第 2、4 件事（context）」：第 3 件事（驗證、權限）其實在 shell 那節講隔離和預算時講到了。可改成「第 1、3 件事（工具與防護）和第 2、4 件事（context）」。另外 p6 第 4 件寫的是「Optionally process the result」，L129 可補「（視需要）」。
   修正：改「第 1、3 件事（工具與防護）和第 2、4 件事（context）」；第 4 件補「（視需要）」。
2. L288 寫「prefill 和 decode 越久」，接著只解釋 prefill 為什麼變慢。可補半句：「decode 每生一個 token 都要回頭看整段輸入，輸入越長也越慢。」
   修正：補「decode 每生一個 token 都要回頭看整段輸入，輸入越長也越慢」。
3. L317「回一個 handle」：補「（一個代號，例如檔案路徑或 ID）」。
   修正：補「（一個代號，例如檔案路徑或 ID）」。
4. L257「接下來的十二頁（p29–40）是八種 prompt 技巧」：技巧本身在 p29–38，p39–40 是評語和建議。可改成「p29–38 是八種 prompt 技巧，p39–40 是講者的評語與建議」。
   修正：改「p29–38 是八種 prompt 技巧，p39–40 是講者的評語與建議」。
5. L170 的教學例子（`retries = 3` 改成 5）其實就是 p19 投影片的例子，token 估算才是本文自己加的。可寫「延伸 p19 的例子」，讓讀者知道課上看過同一個場景。
   修正：例子開頭改「延伸 p19 例子的教學例子，token 估算是本文加的」；來源區同步註明 `retries` 場景取自 p19。
6. L353「只改 harness 的兩件事」：p52 列了四點（壓縮舊輸出、保留近期觀察、偵測重複與停滯、卡住時介入），論文摘要收成兩件。可加「（投影片拆成四點）」。
   修正：補「（投影片拆成四點）」。
7. L59 的 loop 如果模型既沒回 `final_answer` 也沒回 `tool_calls`，會出 `KeyError`。可改用 `response.get("tool_calls", [])`，教學上不是必要。
   修正：改用 `response.get("tool_calls", [])`；實測模型不回 tool_calls 時不再 KeyError。

修正後版本 sha256：1a74912e4859dd56b0eadda1a1f076d22fd36c75fb254308548b89537b545579（尚未複審）。修正後重跑 check:tw 0 blocking、register-scan 長句 10（多為 60–71 字的列舉句與判準）、課程標題 0 issue、版面 0 issue、process-leak 0。

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 7 句（約 116 段中，多數 60–66 字；兩句 77、85 字在綜合自我檢查的判準裡）、但書段落 5%（綠）、引述區塊 10（誤判：全是自我檢查的 `>` 區塊）、單段數字 ≥4 有 8 段（多為頁碼 p4–7 這類範圍與日期，屬誤判；p44、Offloading、Lewis 三段是投影片示意數字與論文結果，各是同一個主張的前後對照，保留）、姓名主詞 1（Lewis 段落，論文作者，保留）、模板化轉折 0、英文術語 0。

| # | 位置 | 指標 | 問題 | 處理 |
|---|---|---|---|---|
| 1 | 導言第二段 | 長句（91 字） | 問題與讀完能力擠一句 | 已拆兩句 |
| 2 | 語意索引條目 | 長句（78 字） | embedding 解釋與例子同句 | 已拆 |
| 3 | shell 四件事 | 長句 | 四項用分號串 | 改清單 |
| 4 | 五種常見工具 | 長句（118 字） | 五項括號說明擠一句 | 改清單 |
| 5 | SWE-agent 段 | 數字 8 個 | 條件與結果混一段 | 拆兩段 |
| 6 | Lost in the Middle 段 | 數字 9 個 | 三個百分比一句串 | 改小表 |
| 7 | p40 四建議 | 長句（65 字） | 分號串 | 改編號清單 |
| 8 | 失敗對應手段 | 長句（94 字） | 三組對應一句 | 改清單 |
| 9 | 綜合自我檢查 2、1 判準 | 長句（77、85 字） | 判準需列多個要點 | 保留：判準句要完整，拆開反而難對照 |

`pnpm check:tw`：0 blocking、0 to review。

修正：1–8 已改；9 保留。

## 複審

複審對象 sha256：1a74912e4859dd56b0eadda1a1f076d22fd36c75fb254308548b89537b545579（與 L124 作者標的修正後版本一致）。複審者：獨立審稿子代理（未參與撰寫），2026-10-22。

依據：修正後的正文，重讀投影片 p5、p12、p19、p47–49、p52（pdftotext 依 PDF 頁序），Lewis arXiv 摘要（前次 curl 存檔），SWE-Bench Pro 摘要（arXiv 2509.16941，這次用 curl 抓）。重跑了 `check:tw`、`register-scan.sh`、`check:references`、`check-course-guide-layout.mjs`、`check:process-leak`。

| 原審項目 | 已解決？ | 證據（現行行號） |
|---|---|---|
| must-fix 1 tldr 沒帶前提 | ✅ | L11「context 很緊時……多出七成到一倍以上」，1.7×（多七成）與 2.3×（一倍以上）都涵蓋；L358 句末補了 1.7／2.3 倍與「投影片標題寫 2×」 |
| should-fix 1 Clash、Drift 的對照與歸屬 | ✅ | L340「投影片只給定義……是本文的整理」；L345 Clash→去重（p48 Deduplication 原文「Keep the newest state of each object」）；L346 Drift→外部任務清單（p47）＋壓縮後放回（p49「Re-inject critical facts after」） |
| should-fix 2 loop 少 validate | ✅ | L57–68。抽出兩個 python 區塊用 `python3 -I` 實跑，輸出仍是 `Fixed: timeout was too short.` 與 `[2, 4, 6, 8, 10, 12]`，跟 L116–117 一致。另外測了參數名寫錯（`pth`）和不存在的工具，都把錯誤回給模型，沒有中斷。小標 L42 改成「20 多行」，正文已經沒有「20 行」的說法 |
| should-fix 3 p12 例子 | ✅ | L157，跟 p12 的 `cart.ts:88`／3 frames／`tax.ts:20-60`／rounding in applyTax 一致 |
| should-fix 4 綜合題 1 歧義 | ✅ | L366–367，方案 A／B，判準同步改了 |
| should-fix 5 消融、SWE-bench 沒解釋 | ⚠️ 有新錯 | L235 消融括號 ✅；L237 寫「Lite、Verified、Pro 是不同的子集」不對，見下方「仍須修」。這句是照我前次的建議寫的，錯在我的建議 |
| nit 1 第 1、3 件事；（視需要） | ✅ | L134、L132 |
| nit 2 decode 為什麼變慢 | ✅ | L291 |
| nit 3 handle 白話 | ✅ | L320（標點見下方 nit） |
| nit 4 p29–38／p39–40 | ✅ | L260 |
| nit 5 延伸 p19 | ✅ | L173、L387；p19 原例就是「retries = 3 → 5」 |
| nit 6 投影片拆成四點 | ✅ | L358，跟 p52 四個 bullet 一致 |
| nit 7 `.get("tool_calls", [])` | ✅ | L57 |

機械檢查：`check:tw` 0 blocking、0 to review。`check:references` 只剩 `-en` 英文版的 ERROR（忽略）。版面檢查 0 issue。`process-leak` 本篇無訊息。

register-scan 剩 10 句長句，逐句看過：
- L30（64 字）、L256（61）、L260（60）、L308（65，p44 預算列舉）：跟前次一樣或只多幾個字，都是列舉或單一主張，讀得下去，不用改。
- L235（69）：多了消融的括號。可以接受；想縮短的話，把括號移成下一句「消融就是一次拿掉一個元件，看分數掉多少」。
- L320（71，Offloading）：「工具輸出回一個 handle（……），需要再讀、計畫和筆記存在檔案裡」中間的逗號把頓號列舉切斷了，讀起來像「需要再讀計畫」。見 nit 1。
- L358（63，Lewis 結果加倍數）：一個主張的前後對照，可以留。
- 綜合題 1、2 判準（77、85）與來源區 L386：判準要列齊要點，維持前次「保留」的判斷。

結論：10 句都不必為了長度硬拆；只有 L320 因為標點有歧義，要動一下。

### 仍須修

- 🟡 L237「Lite、Verified、Pro 是不同的子集」不對。Lite 和 Verified 是 SWE-bench 的子集；SWE-Bench Pro 是 Scale AI 另外做的一份題庫，比 SWE-bench 難，收了 41 個 repo 的 1,865 題（arXiv 2509.16941 摘要：「a substantially more challenging benchmark that builds upon the best practices of SWE-BENCH」「1,865 problems sourced from … 41 actively maintained repositories」）。建議改成：「Lite、Verified 是 SWE-bench 的子集，Pro 是另一份更難的同類題庫，三者的分數不能直接互比。」

### 🟢 nit

1. L320 改成：「……工具輸出只回一個 handle（一個代號，例如檔案路徑或 ID），需要時再讀；計畫和筆記存在檔案裡。」

結論：還不能通過，剩 1 項要修（L237，見「仍須修」）；其他項目都已到位，L237 改完即可通過。

修正（2026-10-22，主 session）：L237 照複審建議改為「Lite、Verified 是 SWE-bench 的子集，SWE-Bench Pro 是 Scale AI 另做的一份更難的同類題庫，三者的分數不能直接互比」，並連 arXiv 2509.16941；L320 nit 照建議改為「需要時再讀；計畫和筆記存在檔案裡」。複審結論的通過條件（L237 改完）已滿足；check:tw 0 blocking。
