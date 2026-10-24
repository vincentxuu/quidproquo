# L4「Agent Design I: context management and tool design」主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L4 投影片（`sources/slides/4_agent_design_1.pdf`，56 頁；頁碼 = PDF 頁序，已用 `pdftotext -f N -l N` 逐頁對過，跟研究筆記一致；投影片頁尾印的號碼在 p40 之後比 PDF 頁多 1）。p26、p43 為圖表頁，已渲染成圖讀取。
- 工具：本 session 沒有掛 Groundlane MCP 工具；Groundlane 直接 HTTP 在本 session 先前回 401。降級到 Keenable keyless（`api.keenable.ai/v1/search/public`，可用，做一次候選搜尋）；一手頁面全部用 `curl -sL` 直接抓原頁（arXiv abs 與 HTML 全文、Chroma、Anthropic Engineering、Aider docs、GitHub README），全部 200，沒有再往下降級。Karpathy 的 X 貼文用 `api.fxtwitter.com` 鏡像讀全文。toolDegradation：Groundlane MCP 不可用 → Groundlane HTTP 401 → Keenable（搜尋）＋直接抓原頁。
- 判定：Confirmed（原文支持）｜Outdated（原文成立但有更新的反面證據）｜Contradicted（與原文不符）｜Not found（原文查不到該數字或說法）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 11 |
| Confirmed（需加條件） | 3 |
| Outdated | 1 |
| Contradicted | 2 |
| Not found | 1 |

## 查證表

| # | 主張 | 頁 | 來源 URL | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | ReAct：推理與行動交錯；只推理會累積幻覺、只行動沒有計畫 | p4 | https://arxiv.org/abs/2210.03629 | "generate both reasoning traces and task-specific actions in an interleaved manner … ReAct overcomes issues of hallucination and error propagation prevalent in chain-of-thought reasoning by interacting with a simple Wikipedia API" | Confirmed（「act only 會重複自己」是投影片的概括，論文摘要沒有這句） |
| 2 | SWE-agent 消融：Purpose-built 18.0%、Full interaction history 15.0%、Full-file view 12.7%、Shell only 11.0%、No specialized editor 10.3% | p26 | https://arxiv.org/html/2405.15793v3 | Table 3：SWE-agent 18.0；No edit 10.3 ↓7.7；Full file 12.7 ↓5.3；Full history 15.0 ↓3.0。Table 1：Shell-only agent w/ GPT-4 Turbo，Lite 11.00。"We perform an ablation study on a subset of 300 SWE-bench test instances (SWE-bench Lite)"；"All results … are based on … GPT-4 Turbo (gpt-4-1106-preview)" | Confirmed（需加條件：資料集是 SWE-bench Lite 300 題、模型 GPT-4 Turbo、2024 年；Shell only 那列來自主結果表不是消融表，但同條件可比） |
| 3 | 只給 shell 在 GPT-4 上不行（p26 紅字 "No on GPT-4"） | p26 | 同上 | "An LM-friendly ACI's value is confirmed by SWE-agent's 64% relative increase compared to Shell-only, both with GPT-4 Turbo." | Confirmed |
| 4 | 反證／近況：只給 bash 的 agent 現在表現如何 | — | https://github.com/SWE-agent/mini-swe-agent | "Does not have any tools other than bash — it doesn't even need to use the tool-calling interface of the LMs."；"Scores >74% on the SWE-bench verified benchmark" | Outdated（p26 的結論只對 2024 年的 GPT-4 Turbo 成立；同一團隊 2025–26 的 mini-swe-agent 只用 bash，配現行模型在 SWE-bench Verified 超過 74%。投影片自己也把答案留給作業，沒有下定論） |
| 5 | Lewis（模型 Qwen3.6-35B-A3B，跟作業 2 同一個）：SWE-bench Verified 43/169 → 72/169；SWE-bench Pro 31/316 → 72/316 | p52 | https://arxiv.org/abs/2608.26218；全文 https://arxiv.org/html/2608.26218 | Table 2：Verified 43 → 72；Pro 31 → 72；FeatureBench 2 → 3。摘要："Under tight context … The tight-window Verified comparison uses 169 tasks, a 20,480-token window, and a fixed 480-second attempt endpoint"；"In the wide-window Qwen3.6 comparisons, observed arm outcomes are close on Verified and Pro" | Confirmed（需加條件：數字是 Qwen3.6、20,480-token 的緊 context 視窗下測得；視窗放寬後兩組在 Verified、Pro 差不多。投影片沒寫這個前提） |
| 6 | Lewis 的改動：舊工具輸出壓縮、保留近期觀察、偵測重複與停滯、卡住時介入 | p52 | 同上 | "the treatment keeps the same record but mechanically shortens older tool results as the context fills and responds to repeated or stalled work" | Confirmed |
| 7 | 「Changing the Harness Improves Accuracy by 2×」 | p52 | 同上 | Verified 43→72 是 1.7×；Pro 31→72 是 2.3×（自算）；論文 Table 3 自己寫 "43 → 72 (+29; 1.7×)" | Confirmed（需加條件：2× 是兩個 benchmark 的概略，Verified 是 1.7×） |
| 8 | Karpathy："Context engineering is the delicate art and science of filling the context window with just the right information for the next step" | p41 | https://x.com/karpathy/status/1937902205765607626（經 api.fxtwitter.com 讀全文，2025-06-25） | "+1 for 'context engineering' over 'prompt engineering'. … context engineering is the delicate art and science of filling the context window with just the right information for the next step." | Confirmed |
| 9 | Chroma Context Rot：輸入變長準確率下降，有干擾項時降得更快 | p43 | https://research.trychroma.com/context-rot（2025-07-14，Hong、Troynikov、Huber） | "we evaluate 18 LLMs … performance grows increasingly unreliable as input length grows"；"Across all experiments, model performance consistently degrades with increasing input length."；"Distractors have non-uniform impact on model performance" | Confirmed（趨勢） |
| 10 | p43 左圖的具體數字：400K 時 simple lookup 73%、with distractors 46% | p43 | 同上 | 報告按模型分圖呈現，找不到這兩個彙總數字 | Not found（文章只用趨勢，不引用 73%／46%） |
| 11 | Lost in the Middle：答案在 20 份文件中的第 1／5／10／15／20 位，準確率 76%／61%／55%／59%／71% | p43 | https://arxiv.org/html/2307.03172v3 | Table 6（20 documents）GPT-3.5-Turbo：75.8%／57.2%／53.8%／55.4%／63.2%；Claude-1.3：59.9／55.9／56.8／57.2／60.1。摘要："performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle" | Contradicted（U 形趨勢成立，但投影片的五個數字跟論文任何一列都對不上；最接近的是 GPT-3.5-Turbo，第 5 位與第 20 位差最多。文章改引論文 GPT-3.5-Turbo 那列） |
| 12 | 五種 context 失敗（Poisoning、Distraction、Confusion、Clash、Drift）出自 Breunig 2025 | p50 | https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html | 原文列四種："Context Poisoning … Context Distraction … Context Confusion … Context Clash"；全文沒有 drift | Contradicted（Breunig 只有四種；Drift 是投影片加的第五種。文章標明出處差異） |
| 13 | Aider repo map：檔案樹加排序過的符號 | p11 | https://aider.chat/docs/repomap.html | "a concise map of your whole git repository that includes the most important classes and functions along with their types and call signatures"；"using a graph ranking algorithm, computed on a graph where each source file is a node and edges connect files which have dependencies"；"--map-tokens switch, which defaults to 1k tokens" | Confirmed |
| 14 | 工具設計原則：少而正交、專用勝過通用、輸出省 token、錯誤訊息要教得會 | p25 | https://www.anthropic.com/engineering/writing-tools-for-agents（2025-09-11） | "Too many tools or overlapping tools can also distract agents"；"implement a search_contacts or message_contact tool instead of a list_contacts tool"；"For Claude Code, we restrict tool responses to 25,000 tokens by default"；"prompt-engineer your error responses to clearly communicate specific and actionable improvements, rather than opaque error codes or tracebacks" | Confirmed（「idempotent by default」Anthropic 這篇沒提，是投影片自己的原則） |
| 15 | Context 是有限資源；工具集膨脹是常見失敗；just-in-time 載入；compaction、筆記、subagent | p42、p45–49 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents（2025-09-29） | "Context, therefore, must be treated as a finite resource with diminishing marginal returns"；"One of the most common failure modes we see is bloated tool sets"；"agents built with the 'just in time' approach maintain lightweight identifiers"；"One of the safest lightest touch forms of compaction is tool result clearing" | Confirmed（差異：Anthropic 把 compaction 稱為「the first lever」，並把清舊工具結果算進 compaction；投影片把清舊結果歸「transformation」、把 LLM 摘要放最後手段。切法不同，不衝突） |
| 16 | 作業 2 提供的工具與模型 | p26、p53 | `sources/pages/assignments_assignment2.txt`（cs2680.com/assignments/assignment2） | "bash(command) / read_file(path) / edit_file(path, old_string, new_string) / done(summary)"；"Use qwen3.6-35b-a3b as the model" | Confirmed |
| 17 | p44 token 預算、p46–48 的前後數字 | p44、p46–48 | 投影片 | p44 標 "Illustrative token budget"；p46–48 沒有標出處 | Confirmed（文章一律標成投影片的示意數字） |
| 18 | 用語年份（Prompt 2023–24、Context 2025–26、Harness 2026、Goal Now→Next） | p28 | 投影片 | 講者自己註明 "People love coining terms … that doesn't mean I agree or like them." | Confirmed（文章寫成講者的整理，不當成業界定論） |

## 文章處理

- #2：寫明「SWE-bench Lite、GPT-4 Turbo、2024 年」。
- #4：補 mini-swe-agent 當反證，說明 p26 的答案跟模型世代有關，交給作業 2 自己驗。
- #5、#7：寫明緊 context（20,480 token）的前提與 1.7× / 2.3×。
- #10：不引用 73%／46%。
- #11：改用論文 GPT-3.5-Turbo 的 75.8／53.8／63.2，並註明投影片數字對不上。
- #12：寫「Breunig 原文四種，Drift 是投影片加的」。
