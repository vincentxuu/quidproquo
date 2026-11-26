# AI 資安實戰：整合研究筆記
日期：2026-10-22。狀態：課綱提案；未執行攻擊、平台操作或教材實驗。

## 使用者已決定的範圍
共用入門後分三線：AI如何輔助攻擊、保護AI系統、AI輔助調查與修補。使用者明確指出實作不應局限本機；納入CTF、公開訓練平台、自架雲端、明確授權真實系統與bug bounty scope。案例分析包含公開真實事件，不把全部案例縮成mock。
完整範圍定義及子問題見scope.md；站內盤點見inventory.md。

## 母群、覆蓋與選擇
先依工作流程掃描：目標理解→攻擊假設→漏洞驗證→工具編排→攻擊鏈；輸入→檢索→工具→輸出→執行→監控；程式審查→修補→日誌→分流→處置→評估。
再從官方風險文件、原作者框架／評測、平台規則與第一手事件選來源。完整候選登錄於sources.jsonl，未精讀候選不作成效佐證。
| 維度 | 覆蓋 | 已讀依據 | 保留缺口 |
|---|---|---|---|
|角色|攻擊／防護／分析修補|O2/O3/O5/O6；P1–P5；D1–D4|各篇仍須實作|
|環境|CTF／公開實驗／雲端／授權目標|O2/O5/O6/O8/O9|具體平台及實驗選定後讀當期規則|
|信任層|內容／資料／工具／身份／執行|P1–P4|產品版本與設定需驗證|
|證據|指引／研究方法／工具文件／事件|N1/P；O2/O7/D3；O3/O5；O10|不把不同證據混成同等強度|
|失敗|誤判／污染／越權／外推|P4/P5/D1–D4/O7/O10|不使用尚未精讀研究的成功率|
|語言與時間|英中查詢、2024後一手|三線搜尋原始紀錄|主要來源仍偏英文、Microsoft/GitHub與西方研究團隊|

## 來源正文與用途
以下✅代表完整順讀本次工具抽取文字，不代表連結的論文／圖像也讀完。原始輸出和長度在各線筆記，來源層級同步sources.jsonl。
|代號|已讀來源|用於什麼|
|---|---|---|
| N1 | ✅ [Managing Cybersecurity and Privacy Risks in the Age of Artificial Intelligence](https://www.nist.gov/blogs/cybersecurity-insights/managing-cybersecurity-and-privacy-risks-age-artificial-intelligence) | 區分保護AI、應對AI強化攻擊與AI輔助防禦；不作最新標準宣稱 |
| P1 | ✅ [how-microsoft-defends-against-indirect-prompt-injection-attacks](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks) | 間接注入影響與分層控制 |
| P2 | ✅ [Design a Secure Multitenant RAG Inferencing Solution - Azure Architecture Center | Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag) | 多租戶RAG檢索前授權 |
| P3 | ✅ [Security Best Practices - Model Context Protocol](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices) | 鎖定2025-11-25的MCP安全邊界 |
| P4 | ✅ [MCP Security - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) | MCP執行、工具來源與metadata控制限制 |
| P5 | ✅ [AI 红队测试代理 - Microsoft Foundry | Microsoft Learn](https://learn.microsoft.com/zh-cn/azure/foundry/concepts/ai-red-teaming-agent) | 自動紅隊的支援條件與judge限制 |
| D1 | ✅ [Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning) | Autofix的修補責任與驗證 |
| D2 | ✅ [Security Copilot Agent Responsible AI FAQ](https://learn.microsoft.com/en-us/copilot/security/rai-faqs-security-copilot-agents) | 資安助手任務、資料與權限 |
| D3 | ✅ [Generative AI and SOC Productivity: Evidence from Live Operations](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Generative-AI-and-Security-Operations-Center-Productivity-Evidence-from-Live-Operations_v2.5-FINAL.pdf) | 觀察研究與效率測量的外推限制 |
| D4 | ✅ [Application card: GitHub Copilot Agents (code-review URL)](https://docs.github.com/en/copilot/responsible-use/code-review) | Code review輸入與誤判／漏報限制 |
| O1 | ✅ [Cybench](https://cybench.github.io/) | 評測入口，不當獨立實證 |
| O2 | ✅ [Stanford CRFM](https://crfm.stanford.edu/2024/08/19/cybench.html) | CTF任務、提示與子任務測量 |
| O3 | ✅ [GreyDGL/PentestGPT](https://github.com/GreyDGL/PentestGPT) | 攻擊Agent的分階段狀態與工具編排 |
| O4 | ✅ [CyberSecEval 4 | CyberSecEval 4](https://meta-llama.github.io/PurpleLlama/CyberSecEval/) | 評測入口 |
| O5 | ✅ [lucagioacchini/auto-pen-bench](https://github.com/lucagioacchini/auto-pen-bench) | 里程碑與最終狀態的判定方法 |
| O6 | ✅ [Autonomous Offensive Cyber Operations | CyberSecEval 4](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift) | 乾淨環境、預算與完整transcript |
| O7 | ✅ [2. Examples of cheating in CAISI’s agent evaluations | NIST](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) | 答案污染、grader gaming與假成功 |
| O8 | ✅ [Safe Harbor Overview & FAQ | HackerOne Help Center](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq) | safe harbor不擴大scope |
| O9 | ✅ [Security Page | HackerOne Help Center](https://docs.hackerone.com/en/articles/8490833-security-page) | 個別security page界定資產與規則 |
| O10 | ✅ [Disrupting an AI-orchestrated cyber espionage campaign](https://www.anthropic.com/research/disrupting-AI-espionage) | 公開真實攻擊鏈，明確歸因Anthropic觀測；不引未讀長PDF細節 |

## 交叉驗證後會影響課綱的發現
1. 攻擊線不能只有工具介紹：O2/O5/O6都提供環境與目標判定；O7反證說明拿到答案或改錯副本會造成假成功，因此每篇都要有可獨立驗證的目標狀態。
2. 防護線不能只有prompt：P1機率防線限制與P4執行控制相互補充，故依內容、資料、授權、執行分篇。這是指引與設計，不是防禦效果排名。
3. 程式碼審查與修補應分開：D4指出review誤判與漏報；D1對修補另有驗證責任。因此finding與patch各有交付產物。
4. SOC效率與安全品質分開：D3的資料和方法測量結案時間，觀察性與樣本篩選不允許推成因果或正確率。第22篇用多指標評估是教學推論。
5. 本機不是實作邊界：O6本來就用雲端；O8/O9重點是授權資產與規則。從環境移轉的練習保留相同證據格式，但不能直接比較成功率。
6. MCP文件須鎖revision：P3舊版session說明與P4現行描述有版本差異，不拼成單一現行協定主張。
7. O10公開事件可教攻擊鏈，但只有供應商觀測；分析時分開人類選目標、模型行動、已確認與模型虛構內容，不把其自主程度套到所有系統。

## 研究足夠的五關與停止條件
|關|本輪結果|正式寫作前必做|
|---|---|---|
|一手正文|課綱關鍵分類/方法有完整官方或原作者正文；D3完成方法與限制抽取|逐篇技術主張重新映射，不能拿partial論文補數字|
|證據類型|指引、產品自述、研究方法、供應商事件分開|效果主張補獨立實證與對照條件|
|時效|有2024/2025來源與本次live文件；不宣稱舊benchmark代表最新能力|API、CLI、協定與平台規則寫作時再驗|
|反證|三線均搜失敗、limitations、誤報/漏報；P4/P5、D1/D3/D4、O7/O10有正文限制|每篇至少保留一個會失敗或安全的對照|
|飽和|近義/中文/年份補搜仍有新候選；領域飽和未通過，不宣稱全面研究完成|對該篇有限聚焦問題繼續補搜補讀至結論穩定；未過不發文|
本輪可交的是附證據與明示研究缺口的課綱草案，不是逐篇研究完成或可直接發表的文章。不能把未飽和改寫成全綠。下一輪由agent收斂每篇研究，不要求使用者代查。

## 偏誤與不採用的結論
英文官方文件、Microsoft/GitHub、CTF與公開研究環境偏重；缺少實際操作與跨工具對照。新選題不是全領域全貌，模型訓練/硬體/社交工程仍在延伸範圍。
不作工具推薦排名，不引partial/snippet論文數字，不把廠商事件當獨立攻擊歸因，不以CTF成績保證真實系統能力，不以設定存在推定防線有效。

## 交付位置與下一步
課綱：`.work/series-plans/ai-security.md`，24篇範圍卡、前置與驗收。
支線詳證：protect-ai/research-note.md、ai-for-security/research-note.md、ai-for-offense/research-note.md；站內inventory.md。
待使用者確認篇目與弧線後，先完成總覽與第1篇所需的窄範圍補研、實作與審稿，再依skill逐批交稿。研究未選具體平台，未替使用者承諾真實漏洞或測試成果。
