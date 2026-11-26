# 證據紀錄：AI Agent 的資安工具怎麼分（series order 0）

研究筆記：`.work/research/ai-agent-security-tooling/research-note.md`。以下每個正文主張對應的來源與讀取程度。

| 正文主張 | 來源 | 讀取程度 | 備註 |
|---|---|---|---|
| Adversa 測 8 個開源掃描器，每個都讓至少一個惡意 skill 通過（關閉 LLM 判斷） | adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/ | agent 全文分 5 段讀完（70,161 字元） | Adversa 賣同類產品；作者自述測試離線 |
| Strix 在沙箱內被間接 prompt injection 執行任意指令；沙箱限制波及範圍 | baldur.dk/blog/strix-ai-pentester-rce/ | 我自己用 linkup 重抓全文 | 作者自己寫沙箱「significantly lowers the impact」；沒有示範逃逸；未寫 Strix 版本號 |
| Claude Code：大多數事件上 hook 失敗或逾時，動作照常執行；`onFailure: "block"`，v2.1.295 以上 | code.claude.com/docs/en/hooks | 我讀了 onFailure 欄位表、「Block the action when a hook fails」整節與失敗清單；整頁 297,231 字元，未整頁讀 | 文件原句「On most events, when a hook fails or times out, Claude Code still carries out the action」 |
| Claude Code 沙箱預設關閉，開啟後只包 shell 指令 | code.claude.com/docs/en/sandboxing | agent 讀官方文件（deepD S1、S2）；我未自讀 | post-verify 需回原文核對措辭 |
| AgentDojo 評模型或 agent 抗注入，不是工具偵測力 | arXiv 2406.13352 | agent 讀 1–5 節全文，附錄 A–F 未讀 | 見 sources/deepGHI-standards-eval.md §4.1 |
| MalSkillBench：VirusTotal recall 全體 21.6%、野外子集 87.9% | arXiv 2606.07131，§4.5.3 | agent 讀 HTML 版（Groundlane 截在 10 萬字元，後段用 cloudflare 補）；圖 3–8 內數字讀不到；我讀了 deepBench §6.2 的整理表 | 作者無被評廠商隸屬，無 Limitations／COI 章節 |
| OWASP Top 10 for Agentic Applications 2026 | genai.owasp.org 資源頁 + 官方 PDF | agent 讀 PDF 全文（約 99,868 字元）；我讀了其中 6 項描述段 | 本篇只當連結，沒引用內容 |
| 站上兩篇理論文 | 站內 | — | — |

## 寫作紀律
- 不放可複製的攻擊步驟；不放個人歸因。
- 「沒有逐一安裝實測」為會影響讀者判斷的限制，已在開頭交代一句。

## 2026-10-24 重新核對
所有主張已回一手來源逐句重讀（hooks／sandboxing／permissions 官方頁、Adversa 全文、baldur.dk 全文、MalSkillBench §4.5、AgentDojo 摘要）。差異與來源網址見 `.work/reviews/2026-10-24-ai-agent-security-tooling-map.md` 同名段。更正：Adversa 分類（六被繞過／一幾乎不檢查／一純 LLM 被檔案左右）；hook 「大多數事件」；Strix 歸屬 Baldur Security，日期 2026-05-27。
