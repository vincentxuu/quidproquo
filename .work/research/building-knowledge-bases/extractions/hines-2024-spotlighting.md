# 抽取紀錄：Hines et al. (2024) Defending Against Indirect Prompt Injection Attacks With Spotlighting（Microsoft）

read_status=full（arXiv v1 PDF 全文，含附錄 8.1–8.2）

## 書目

- Keegan Hines, Gary Lopez, Matthew Hall, Federico Zarfati, Yonatan Zunger, Emre Kıcıman（Microsoft）。
- arXiv:2403.14720 v1（2024-03-20），cs.CR。EchoLeak 論文引為 CAMLIS'24（CEUR Workshop Proceedings vol. 3920）。8 頁。
- 讀取方式與全文檔：curl https://arxiv.org/pdf/2403.14720（383,223 bytes）→ pdftotext（不加 -layout，雙欄依閱讀順序）→ /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o14-spotlight.txt（786 行、43,581 bytes），已讀 1–786 全部。圖表為長條圖，數字取自正文與圖說。

## 研究設計

- 模型：text-davinci-003、GPT-3.5-Turbo（2023-06）、GPT-4（2023-06），temperature 1.0（行 262–266）。
- 攻擊資料：自製 1,000 份含注入的合成文件，payload 是「忘掉前面指令、只回一個關鍵字」（行 275–283）。ASR 只算「整個任務被接管」，不算「受到影響」（附錄 8.1，行 707–726）。
- 任務：文件摘要、文件問答；另用 SQuAD、IMDB、SuperGLUE WiC／BoolQ 測對正常任務的影響（行 384–395）。
- 三種 spotlighting：delimiting（前後加符號）、datamarking（每個空白換成特殊符號）、encoding（base64 等）（行 172–258）。

## 可引用結果（數字照原文）

1. **只在系統提示寫「不要聽文件裡的指令」效果很小**（行 303–308）："This approach, while simple, has only modest effects. … For GPT-3.5-Turbo, the addition of instructions about prompt injection has almost no added benefit. For Text-003, the impact is noticeably better, but with a significantly high ASR remaining." 圖 3 圖說：GPT-3.5-Turbo 基線 ASR 約 60%，加指示 "a very modest effect"，加分隔符 "can reduce the ASR by half"（行 312–317）。
2. Datamarking（行 332–336、349–357）：摘要任務 GPT-3.5-Turbo 約 50% → 3.10%；text-003 40% → 0.00%；問答任務 GPT-3.5-Turbo → 8.0%、GPT-4 → 1.0%、text-003 → 0.00%。
3. Encoding（行 342–346、359–362）：GPT-3.5-Turbo 摘要 0.0%、問答 1.8%。
4. 對正常任務：datamarking 無負面影響（行 390–395）；**encoding 讓 GPT-3.5 表現明顯變差**（圖 8 圖說，行 370–375）："With GPT3.5, there is a very detrimental impact of encoding the text, as the model is less able to accurately decode and reason over the input document. The encoding technique should not be used with earlier-generation models." 建議 encoding 只用在最高能力的模型（行 402–404）。
5. 摘要的總結數字（行 26–28）："spotlighting reduces the attack success rate from greater than 50% to below 2% in our experiments with minimal impact on task efficacy."
6. Few-shot 示範也能把 GPT-3.5 ASR 降到 5% 以下，但作者不信任：示範與測試題都來自已知攻擊手法，"It is challenging to avoid 'leaking the label'"（行 760–785）。

## 可引用原句

- 根因（行 50–60）："The prompt injection problem stems from the LLM's inability to distinguish between valid system instructions and invalid instructions that arrive from external inputs. In security parlance, the LLM is not able to distinguish code from data."
- 「無心的注入」（行 131–134）："instructive text residing in a variety of sources yields a very real problem of 'accidental' XPIA, whereby instructive text that is intended for a human reader ends up being acted upon by an overeager LLM."——知識庫裡的 SOP、操作手冊本來就是指令，這句可直接用。
- 分隔符容易被繞過（行 450–457）："If an adversary gains knowledge of our system prompt … it would be simple to craft a string that contains our delimiters … we do not recommend using delimiting in practice"。
- 作者自己的保留（行 500–505、548–549）："we lack a clear understanding of why spotlighting actually helps." ；"spotlighting helps to create separation but is not perfectly secure against interference."

## 沒寫的事／限制

- 攻擊只有一種（關鍵字 payload），非適應性攻擊；作者沒測知道防禦細節的攻擊者（只在 5.4 節討論）。
- 只測 GPT 家族三個 2023 年模型；**沒有測任何開源小模型**。
- 沒有測 agent 或工具呼叫情境。
- 1,000 份合成文件的生成方式沒有公開細節。

## 與範圍卡說法的核對

- 範圍卡「spotlighting 對小模型無效」**不是出自 Hines**。Hines 的相關結果有兩個，意思都不同：
  1. 「只寫系統提示指示」對 GPT-3.5 "almost no added benefit"（支持自我檢查，但講的是指示，不是 spotlighting）。
  2. encoding 讓 GPT-3.5 的**正常任務表現**變差（是效用代價，不是防禦無效）。
- 「對小模型無效」實際出自 Pai 2026（見 pai-2026-camouflage-defenses.md）：標記式 spotlighting 對 Llama 3.1 8B 沒有效果。而且 Pai 的 spotlighting 只是在文件前後加 `<<<UNTRUSTED EXTERNAL CONTENT>>>` 標記，等於 Hines 自己不推薦的 delimiting，不是 datamarking 或 encoding。
- 另有反證：Nasr et al. 2025（The Attacker Moves Second）在 AgentDojo 用適應性攻擊，spotlighting 在 Gemini-2.5 Pro、GPT-5 Mini、Llama-3.3 70B、MetaSecAlign 70B 上 ASR 都達 99%。
- 建議寫法：「spotlighting 在 Microsoft 的原始測試（GPT 家族、固定攻擊）把攻擊成功率從 50% 以上降到 2% 以下；但效果依模型而異，一篇 2026 年預印本發現同類標記對 Llama 3.1 8B 沒有效果，而針對防禦調整的攻擊仍能把成功率拉回 99%。」

## 對 order 14 的用法

- 自我檢查的直接證據：行 303–308（只寫指示幾乎沒用）。
- 「內容是資料不是指令」與「SOP 本身就是指令」的張力：行 131–134。
- spotlighting 可以當回答階段的一道防線（入庫時加標記、回答時說明標記），但要和限制動作搭配。

## 更正（2026-10-22，依 _spotcheck-batch10）
- 第 47–48 行「spotlighting 在四個模型上都是 99%」不正確：Nasr 表 7 只有 Gemini-2.5 Pro、Llama-3.3 70B、MetaSecAlign 70B 為 99%，GPT-5 Mini 為 47%（見 nasr-2025-attacker-moves-second 附錄補讀）。
