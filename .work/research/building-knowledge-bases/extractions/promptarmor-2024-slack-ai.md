# 抽取紀錄：PromptArmor (2024) Data Exfiltration from Slack AI via Indirect Prompt Injection ＋ Slack 官方回應

read_status=full（PromptArmor 原文全文；Slack 官方公告全文）

## 書目

- PromptArmor Threat Intelligence Team，"Data Exfiltration from Slack AI via Indirect Prompt Injection"，2024-08-20（Exa 搜尋結果的 published 欄；頁面本身沒印日期）。
  - URL：https://www.promptarmor.com/resources/data-exfiltration-from-slack-ai-via-indirect-prompt-injection
  - 同文 Substack 鏡像：https://promptarmor.substack.com/p/data-exfiltration-from-slack-ai-via（2024-08-20，未另存，只在搜尋結果比對過段落一致）
- Slack 官方回應：Slack，"Slack Security Update"，2024-08-21。URL：https://slack.com/blog/news/slack-security-update-082124
- 讀取方式與全文檔（scratchpad/fulltext/，完整路徑 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/）：
  - PromptArmor：2026-10-22 curl（138,083 bytes HTML）→ 取 <main> → pandoc plain → 刪空行 → o14-promptarmor.txt（73 行、10,930 bytes），已讀 1–73 全部。圖片只有 alt 文字（截圖內容未逐張目視）。
  - Slack：curl（136,901 bytes HTML）→ pandoc plain → o14-slack.txt（43 行、2,084 bytes），已讀 1–43；正文只有行 14–16 三句。
- 下文「P 行」為 o14-promptarmor.txt、「S 行」為 o14-slack.txt。

## 性質

- 資安廠商的漏洞揭露部落格（概念驗證＋截圖），不是同儕審查研究；沒有成功率數字，只示範一次成功。Slack 公告是三句話的官方聲明，沒有技術細節。

## 攻擊鏈（P 行 12–35）

1. 受害者把 API key 貼在只有自己的私人頻道（含自己對自己的 DM）（P 行 16）。
2. 攻擊者在同一 workspace 開一個**只有自己一人的公開頻道**，貼一段指令：要 Slack AI 在被問到 API key 時，把 key 填進連結參數，並以「Error loading message, click here to reauthenticate」顯示（P 行 18–20）。
3. 受害者問 Slack AI 自己的 API key → 檢索把私人頻道訊息和攻擊者的公開頻道訊息放進同一個 context（P 行 27）。
4. Slack AI 照攻擊者指令輸出帶 key 的 Markdown 連結；**受害者點了連結**才外洩（P 行 29、35）。
5. 引用只指向受害者的私人頻道、沒指向攻擊者訊息，而且攻擊者訊息不在搜尋結果第一頁（P 行 31–33）→ 難追查。
- 第二條鏈：同樣手法做釣魚連結；這次引用有列出攻擊者頻道，作者說 "it seems as if the citation behavior is fairly stochastic"（P 行 36–46）。

## 可引用原句

- 前提（P 行 6）："An attacker can prompt Slack AI to exfil data from private channels where the attacker (malicious prompt author) isn't a member, by posting in a public channel. The victim does not have to be in the public channel for the attack to work"
- 根因（P 行 10）："Prompt injection occurs because an LLM cannot distinguish between the 'system prompt' created by a developer and the rest of the context that is appended to the query."
- 不需要知道秘密是什麼（P 行 14）："the attacker does not have to know what confidential data someone put in a private channel to exfiltrate it."
- 檔案入庫擴大攻擊面（P 行 47–53）：2024-08-14 起 Slack AI 也讀上傳檔案與 Google Drive；"If a user downloads a PDF that has one of these malicious instructions (e.g. hidden in white text) and subsequently uploads it to Slack, the same downstream effects of the attack chain can be achieved." **但**同段明說 "we did not test for this functionality explicitly as the testing was conducted prior to August 14th"。
- 揭露時間線（P 行 56–68）：08-14 通報；08-19 Slack 回覆 "deemed the evidence insufficient"，並說公開頻道訊息全 workspace 可搜尋 "This is intended behavior."；PromptArmor 08-20 公開。
- Slack 官方（S 行 14–15）："under very limited and specific circumstances, a malicious actor with an existing account in the same Slack workspace could phish users for certain data. We deployed a patch to address the reported issue on August 20, 2024, and have no evidence at this time of unauthorized access to customer data."

## 沒寫的事

- 沒有成功率、沒有重複試驗次數。
- 沒說 Slack 修了什麼（Slack 公告也沒說）。
- 白字 PDF 情境是推測，沒有實測。
- 沒有說 Slack AI 用什麼模型或 RAG 架構。

## 與範圍卡說法的核對

- 範圍卡「Slack AI（2024，公開頻道藏指令偷私人頻道的 API key）」：大致正確，但三個條件要寫出來，否則誇大：
  1. 攻擊者必須**已在同一 workspace 有帳號**（內部人或已入侵帳號），不是外部人；Slack 官方用語是 "a malicious actor with an existing account in the same Slack workspace"。
  2. **受害者要點連結**才外洩（one-click），和 EchoLeak 的零點擊不同。
  3. Slack 官方把它定性為「釣魚」並在 08-20 修補，「沒有證據顯示客戶資料遭未授權存取」；PromptArmor 稱為資料外洩。
- 「白字藏指令的文件」在本案是作者推測的延伸情境，不是被示範的攻擊；文章若用履歷白字例子，出處要用 OWASP LLM08 情境 1（見 owasp-2025-llm08-vector-embedding.md）或 Greshake 2023，不能說 Slack 案示範了白字 PDF。

## 對 order 14 的用法

- 「內容永遠是資料不是指令」：P 行 10 的根因句。
- 「入庫範圍一擴大，攻擊面就擴大」：P 行 47–53（從只讀訊息擴到讀檔案）。
- 「引用不可靠，不能當安全機制」：P 行 31–33、45（被利用的訊息沒被引用、引用行為隨機）。
- 「限制模型能做的動作」：外洩靠的是 Markdown 連結渲染；這是輸出端可以擋的（連結白名單），接 EchoLeak 的輸出過濾段。
