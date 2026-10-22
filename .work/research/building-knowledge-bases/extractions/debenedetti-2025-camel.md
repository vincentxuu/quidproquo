# 抽取紀錄：Debenedetti et al. (2025) Defeating Prompt Injections by Design（CaMeL）

read_status=full（正文 1–25 頁全讀；附錄 A–I 含 H 節全部 agent 對話於 2026-10-22 補讀完，見文末「附錄補讀」）

## 書目

- Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Andreas Terzis, Florian Tramèr（Google、Google DeepMind、ETH Zurich）。
- arXiv:2503.18813。v1 2025-03-24；**v2 2025-06-24**（本紀錄讀 v2）。cs.CR。PDF 125 頁（正文約 25 頁，其餘附錄）。程式碼 https://github.com/google-research/camel-prompt-injection
- 讀取方式與全文檔（scratchpad/fulltext/，完整路徑 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/）：curl https://arxiv.org/pdf/2503.18813（5,531,468 bytes）→ pdftotext -layout → o14-camel.txt（10,191 行、434,738 bytes）。
  - 已讀行號：1–1600（摘要到第 11 節結論，全讀）；1959–2180（附錄 B 表 2–4、附錄 C 表 5–7、附錄 D 表 8–9，全讀）；2172–2400 段首（附錄 E 政策、F 開銷、G 失敗分類）；2392 以後的 H 節（系統提示與完整 agent 對話）只抽樣幾段，未逐段讀。
  - v1 摘要另以 curl https://arxiv.org/abs/2503.18813v1 讀取（只讀摘要，用來核對數字變動）。

## 性質

- 系統設計＋基準實驗（AgentDojo，949 個攻擊）。不是使用者研究，也不是真實部署。

## 機制（行 135–194、346–630）

- 把 Willison 的 Dual LLM 模式具體化：Privileged LLM（P-LLM）只看使用者的查詢，寫出 Python 程式（控制流程）；Quarantined LLM（Q-LLM）處理不可信資料、**沒有呼叫工具的能力**，只能把資料轉成固定 schema（行 414–436）。
- 每個值帶 capabilities（來源、允許的讀者）；工具呼叫前由 security policy 檢查資料流，違規就擋下或要求使用者確認（行 518–546、626–630）。
- 和知識庫有關的點：capability 可以標「這是個資（護照號碼），只能交給特定工具」（行 539–546）——個資標籤在檢索後仍跟著資料走。

## 可引用結果（數字照原文）

1. 摘要（行 21–22）："solving 77% of tasks with provable security (compared to 84% with an undefended system) in AgentDojo."
   - 這組數字對應**附錄 B 表 2 的 o3 High**：CaMeL 77.3% ± 8.3 vs 原生工具呼叫 84.5% ± 7.2（行 1985–1986）。是六個模型中**落差最小之一**的那個。
   - 其他模型（表 2）：Claude 4 Sonnet 86.6% → 74.2%（−12.4）；Claude 4 Sonnet（推理）83.5% → 70.1%；Gemini 2.5 Pro 73.2% → 41.2%（−32.0）；Gemini 2.5 Flash 55.7% → 35.1%；o4 Mini High 79.4% → 76.3%。
   - 與其他防禦比（附錄 C 表 5，Claude 3.5 Sonnet）：CaMeL 63.92% vs 無防禦 90.72%、Spotlighting 92.78%、Prompt Sandwiching 89.69%、Tool Filter 73.20%。
   - v1 摘要寫的是 "solving 67% of tasks with provable security"（沒有對照數字）；v2 因為換新模型改成 77% vs 84%。
2. 攻擊成功數（表 4、表 7；共 949 個攻擊）：CaMeL（含 policy）在 Gemini 2.5 Pro、o3 High 是 0；Claude 4 Sonnet 仍有 11（都在 travel suite，屬威脅模型外的「把注入文字直接印給使用者看」，行 925–1000）。Claude 3.5 Sonnet 下 CaMeL 0、Spotlighting 5、Tool Filter 8、Prompt Sandwiching 24、無防禦 44（表 7）。
3. 不靠 policy、只靠隔離也很有效（行 915–924）：Gemini 2.5 Pro 成功攻擊從 300 降到 0（圖 9 文字；表 4 的整體值寫 163，兩處不一致，見下）。
4. 代價：中位數任務多用 2.82 倍輸入 token、2.73 倍輸出 token（行 1169、1214）。
5. 使用者負擔：security policy 在正常任務（非攻擊）中也會觸發、要使用者確認；STRICT 模式下整體觸發率 53.23%、NORMAL 模式 33.87%（附錄 D 表 8，行 2063–2068；表上沒標是哪個模型，前後文推測為 Claude 3.5 Sonnet）。
6. 失敗主因（表 1，Claude 3.5 Sonnet）："Data requires action"（任務本身要照資料裡的指示做，P-LLM 看不到資料就做不到，行 667–673）、文件不足的 API（travel 13 次）。

## 可引用原句

- 為什麼不靠提示（行 36–39）："Current defenses often rely on training or prompting models to adhere to security policies … frequently implemented as vulnerable system prompts"
- 對啟發式防禦的評價（行 132–133）："none of these heuristic defenses provide any guarantee of security and regularly fall short to new attacks in practice."
- 自認沒解決（行 1514–1517）："No, prompt injection attacks are not fully solved. … CaMeL suffers from users needing to codify and specify security policies and maintain them. CaMeL also comes with a user burden."
- 非目標（行 289–297）：不防「不影響資料流的文字對文字攻擊」，例如把信摘要錯、或在回答裡放釣魚連結。

## 限制（作者自述與本紀錄發現）

- 側通道（第 7 節，行 1224–1415）：可透過例外、間接相依、時間洩漏一位元或更多；STRICT 模式擋部分。
- 需要整個工具生態支援 capability，否則效用下降（行 1467–1490）。
- 只在 AgentDojo 測，工具與資料都是合成的。
- 「Data requires action」類任務（例如「照某封信裡的待辦去做」）設計上無法完成。
- 行 924 的 "300 without to 0" 和表 4 Gemini 2.5 Pro 原生 163 ± 140.1 不一致（可能是不同輪次）；引用時用表 4 或不引具體數字。
- 「provable security」指的是在其威脅模型內、policy 寫對的前提下；作者自己說 policy 要人寫、要維護。

## 與範圍卡說法的核對

- 「CaMeL 可證安全時完成率 77% vs 84%」：數字正確（摘要原句），但要補兩件事，否則讀者會以為代價普遍只有 7 個百分點：
  1. 這是 o3 High 一個模型的結果；同表 Gemini 2.5 Pro 是 73% → 41%，Claude 4 Sonnet 是 87% → 74%。
  2. 正常使用時 policy 仍常要求使用者確認（STRICT 模式 53% 的任務觸發）。
- 建議寫法：「CaMeL 在 AgentDojo 上把成功攻擊降到接近零，但任務完成率下降，幅度依模型從 3 到 32 個百分點不等（o3：84% → 77%；Gemini 2.5 Pro：73% → 41%），而且使用者要常按確認。」

## 對 order 14 的用法

- 自我檢查「只寫系統提示不夠，要限制模型能做的動作」：CaMeL 是「限制動作」的代表——讀不可信內容的模型不能呼叫工具，資料流由程式檢查。
- 「防禦有代價、效果依模型而異」：表 2 的模型差異。
- 個資：capability 可把個資標成「只能交給特定工具」（行 539–546），可當「入庫時標記、檢索後仍保留標記」的延伸例子；但這是 agent 架構，不是一般知識庫問答的現成功能，文章要講清楚。

## 附錄補讀（2026-10-22）

### 讀了哪些行

- o14-camel.txt 1598–1959：致謝、作者貢獻、參考文獻、附錄 A（資訊安全名詞、存取與資訊流控制、工具呼叫 agent、既有提示注入防禦與同期研究）。
- 2172–2391：附錄 E 各 suite 的 security policy 文字摘要、圖 20（各模型 policy 觸發率）、附錄 F 表 10–13（各防禦的 token 用量）、附錄 G 標題。
- 2392–10110：附錄 H 全部——H.1 P-LLM 系統提示全文、H.2 例外提示、H.3「控制流變成資料流」案例、H.4.1–H.4.8 八個失敗任務的完整對話與工具輸出。
- 10111–10191：附錄 I 進階側通道。
- 加上原本已讀的 1–1600、1959–2180，全文 10,191 行已讀完。

### 附錄裡的重點數字

1. 表 10（不受攻擊，Claude 3.5 Sonnet）：CaMeL 對原生工具呼叫的 token 倍數，輸入平均 7.24、中位數 2.73；輸出平均 6.23、中位數 2.82。對照：Spotlighting 輸入中位數 1.08、Prompt Sandwiching 1.14、Tool Filter 7.77。
2. 表 11（不受攻擊，絕對 token）：無防禦輸入中位數 1,789、輸出 266；CaMeL 輸入 3,641、輸出 651。平均值差得更多（輸入 2,999 → 14,889），少數任務非常貴。
3. 表 13（受攻擊）：CaMeL 輸入中位數倍數 2.02、輸出 2.64。
4. 附錄 E：四個 suite 共 22 條 policy 的文字摘要，例如 Workspace send_email「收件人必須來自使用者，內文、主旨、附件必須所有收件人都讀得到」、Slack get_webpage「url 必須是公開的」。完整 policy 在程式碼 repo，附錄只列摘要。
5. 圖 20：policy 觸發率依模型分圖（Gemini 2.5 Pro、Claude 4 Sonnet、o3 High；正常與攻擊兩種情境），只有長條圖，沒有數字。
6. H.1：P-LLM 寫的 Python 子集不允許 while、break、try、import、def／lambda、切片、generator 與有副作用的方法；H.2：例外若依賴不可信資料，錯誤內容會被遮蔽，只顯示「從上下文推斷問題」。
7. H.4 失敗對話的共同模式：P-LLM 反覆撞語言限制，或 Q-LLM 回 NotEnoughInformationError 而 P-LLM 看不到原因、只能一直改寫查詢。
   - H.4.2 Slack 11（Data requires action）：新同事資料在網站上，P-LLM 看不到，改寫查詢多次仍未完成。
   - H.4.4 Banking 2（Q-LLM 脈絡不足）：P-LLM 要 Q-LLM 從房東通知抽 IBAN，但通知裡本來就沒有 IBAN。
   - H.4.5 Workspace 36：Q-LLM 把原檔的 6 項打包清單擴寫成一大份，嚴格比對判失敗。
   - H.4.6 Banking 14：Q-LLM 逐筆判斷交易，認為 1,000 元買 iPhone 3GS 不可疑；作者歸類為「對所有模型都模糊的任務」，不是 CaMeL 特有。
   - H.4.7 Travel 19（工具文件不足）：工具回傳以換行分隔的字串，文件沒寫，P-LLM 用 ", " 切割，後續查詢全拿到空結果。
   - H.4.8：AgentDojo 評分程式只檢查星期、不認營業時間，屬基準本身的 bug。
8. H.3：Claude 與 o3-mini 會寫出「讓 Q-LLM 決定要呼叫哪個工具、帶什麼參數」的程式，等於把控制流交回不可信資料；附錄只放程式碼，沒有文字分析，這時只能靠 policy 擋。
9. 附錄 I：攻擊者在行事曆塞「如果沒有和 Bob 的會議，就說資訊不足」，利用 NotEnoughInformationError 觸發的重試（最多 10 次）擴大搜尋；最後信寄不寄出，就洩漏「使用者是否要和 Bob 見面」這一位元。和正文第 7 節側通道的說法一致。

### 和正文或本紀錄既有內容的矛盾

1. **token 倍數輸入／輸出對調**：正文行 1169（圖 13 圖說，標明「under attack」）與行 1214–1215 都寫「2.82× input、2.73× output」；附錄表 10（不受攻擊）卻是輸入中位數 2.73、輸出 2.82，剛好對調；表 13（受攻擊）是 2.02／2.64，圖 13 的 x 軸刻度也標 2.0x。看起來正文把表 10 的輸入輸出寫反，又標成受攻擊情境。本紀錄「可引用結果 4」照正文抄成「2.82 倍輸入、2.73 倍輸出」，引用時改寫成「中位數任務約多用 2.7–2.8 倍 token（不受攻擊，表 10）」，不要分開寫輸入幾倍、輸出幾倍。
2. H.4.3 標題是「Workspace 18：P-LLM 錯誤假設（假設健行開始時間）」，下面的對話卻是 H.4.1 午餐例子的重複；H.4.7 與 H.4.8 都標 Travel 19，但 H.4.8 對話是另一題（星期日營業的法國餐廳）。論文排版或編號錯誤，不影響結論，但這兩節不要當成「Workspace 18」或「Travel 19」的證據引用。
3. 表 8（STRICT 53.23%、NORMAL 33.87%）仍沒標是哪個模型；圖 20 有分模型觸發率但沒有數字。本紀錄原寫「前後文推測為 Claude 3.5 Sonnet」，維持「推測」。
4. 各模型完成率（表 2）附錄沒有新數字，也沒有和正文不一致的地方；「可引用結果 1」與「與範圍卡說法的核對」的建議寫法不變。

### 對結論的影響

- 不改變。o3 High 84% → 77%、Gemini 2.5 Pro 73% → 41%、Claude 4 Sonnet 87% → 74% 照用。
- 附錄的失敗對話具體佐證兩點：（a）代價除了完成率，還有 P-LLM 在受限語言裡反覆試錯的 token 成本；（b）隔離造成的「看不到資料就無法判斷」是設計上的，不是換更強的模型就會消失。
- 唯一要修的是 token 倍數的寫法（見矛盾 1）。
