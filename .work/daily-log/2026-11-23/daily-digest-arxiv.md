# daily-digest-arxiv — 2026-11-23

產出：3 篇入選，主題「Agent 的記憶：怎麼留、能不能信、壓縮後還剩什麼」——CompAct-Bench（2611.25673，評測/極限）、MemFolder（2611.26427，能力/方法）、DriftGuard（2611.25583，應用/安全）。中英雙版皆已寫完，各含 1 張對照圖（CompAct-Bench 的壓縮階段差異）。

例外與備註：

- toolDegradation：groundlane 需 OAuth 登入，本輪視為不可用，全程改用 `firecrawl_research_search_papers` / `read_paper` / `inspect_paper` 做 Layer A/B 候選搜尋與正文核對，`firecrawl_scrape` 讀 arXiv 摘要頁與 HuggingFace Daily Papers API；直接 `firecrawl_scrape` 打 Semantic Scholar REST API 吃到 429，改用 Alexandria `semanticscholar-org` provider 補上第一輪背景信號查詢，隨後 Alexandria 當日額度用盡（下一次 refresh 約 22 小時後），第三篇入選論文（MemFolder）的機構與限制改由論文正文與 GitHub repo 核對，未能查到 Semantic Scholar 的正式引用數字（直接標註為「尚無引用資料」已足夠）。
- 流程修正（重要）：初始候選池原本選出「How Much Should an Agent Remember?」(2611.26361) 作為入選論文之一，深度核對正文後才做 `seen-arxiv-ids.txt` 交叉比對，發現該篇與另一篇 watch 候選「Evolve Where It Matters」(2611.25429) 其實已於 2026-11-21 入選發布過，屬於 hard dedup 漏檢。兩篇已自候選池移除，前者替換為新核對過的 MemFolder（2611.26427）。已在篩選紀錄 `.research/daily-arxiv-screening/2026-11-23.json` 的 `toolDegradation` 欄位記下教訓：下次應該在 Layer A/B 搜尋結果出來後立刻做 `seen-arxiv-ids.txt` 交叉比對，再進入深度可信度核對，避免做了白工。
- Layer C 59 篇回溯候選中，另外 3 篇（2611.14320、2611.15729、2611.17068）比對後發現也已在期間被其他日期選入發布，一併排除，不列入今日候選池。
- 圖解：各語言版本各畫 1 張（CompAct-Bench 的 Search vs Coding 壓縮階段對照），座標相同；其餘段落未見適合畫圖的結構。
- diagram-preview 未跑：本機無瀏覽器（`/opt/pw-browsers` 找不到 chrome-headless-shell），`check:diagram-text` 已過（7407 篇、530 張圖、0 錯誤）。
- `pnpm install --frozen-lockfile` 成功（node_modules 原本缺失）。
