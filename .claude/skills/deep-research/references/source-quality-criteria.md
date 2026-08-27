# 來源品質評估標準

研究蒐集階段判斷來源品質時，按下列標準排序與過濾。

## 通用來源分級

| 等級 | 定義 | 範例 | 處理 |
|---|---|---|---|
| **A — 官方一手** | 產品/技術的製造者或維護者直接發佈 | 官方 docs、release notes、官方 blog、GitHub repo README/CHANGELOG、RFC、官方 API reference | 優先引用，仍需交叉驗證版本與日期 |
| **B — 一手作者** | 作者本人（非官方但直接參與者）的非正式發佈 | 作者 X/Mastodon 貼文、個人 blog、會議演講投影片、podcast 逐字稿 | 可引用，但標明為作者觀點而非官方立場 |
| **C — 高品質二手** | 有獨立查證或附帶實測的第三方分析 | HN/Reddit 高分討論串、高 star repo issue、知名技術 blog 附跑過的 benchmark | 可引用，需標來源，事實需回溯到 A/B 級驗證 |
| **D — 低品質二手** | 無獨立查證、改寫或聚合為主 | Medium 抄稿、SEO 導向 blog、AI 生成摘要站、新聞聚合站 | 通常跳過；若為唯一來源則標 `[unverified]` |

## 學術論文品質判斷

### 硬指標

| 指標 | 怎麼查 | 怎麼用 |
|---|---|---|
| **引用數 vs 發表時間** | Semantic Scholar / Google Scholar | 同齡比較：2024 論文 500+ 引用 ≫ 2020 論文 500+ 引用。< 6 個月的新論文引用低是正常的，看其他指標 |
| **發表場所** | 論文首頁 / arXiv abstract 的 comments 欄 | Tier-1 會議（NeurIPS / ICML / ICLR / ACL / EMNLP / AAAI）或期刊（JMLR / TMLR）加分。arXiv preprint 本身不算品質保證 |
| **作者與機構** | 論文 affiliation | Anthropic / OpenAI / DeepMind / Meta FAIR / Microsoft Research / Stanford / CMU / Berkeley 等有更好的實驗資源與 review 品質 |

### 軟指標（通常更重要）

| 指標 | 怎麼判斷 |
|---|---|
| **有無跑真實 benchmark** | 只有概念框架沒有實驗的論文價值有限；在 SWE-bench / HumanEval / MATH / MMLU 等標準 benchmark 上有結果的更可信 |
| **方法可重現性** | 有開源 code、完整實驗設定、ablation study |
| **被誰引用** | 被 ReAct / Toolformer / AutoGen 等後來成為基礎設施的工作引用，比單純高引用更有意義 |
| **Survey 論文覆蓋度** | 好的 survey 提出有洞察力的 taxonomy（分類法），而不只是論文列表排一排 |

### 論文品質分級（A / B / C）

**A 級**——滿足至少一項：
- 被 tier-1 會議接收：NeurIPS / ICML / ICLR / ACL / EMNLP / AAAI / CVPR / SIGCHI
- 被 tier-1 期刊接收：JMLR / TMLR / ACM TOSEM / TSE / CACM
- 引用數 > 200 **且**有開源 code
- 知名 AI lab 發表（Anthropic / OpenAI / DeepMind / Meta FAIR / Microsoft Research / Google Research）**且**有實驗數據（非純觀點文）

**B 級**——滿足至少一項：
- 引用數 > 50 或知名機構（CMU / Stanford / Berkeley / MIT / ETH / TU München 等）
- 有開源 code **且** ablation study
- tier-2 會議或 workshop（ICSE workshop / NAACL / EACL / COLM / AAAI workshop 等）
- 持續更新的 survey（多版本、覆蓋面廣、有結構化 taxonomy）

**C 級**——不滿足以上任何條件：
- 無 peer review + 機構不明或弱
- 通常降級為 Honorable Mention 或從清單移除

**分級應用**：
- research note 只在主清單列 A + B 級論文
- C 級降到 Honorable Mentions，標明降級原因
- 每篇論文標明：arXiv ID、場所、機構、引用數、是否開源

### 常見陷阱

- **arXiv 爆發領域**（multi-agent LLM、RAG、prompt engineering）充斥「我把 3 個 ChatGPT 串起來跑了一下」等級的論文，引用數不代表品質
- 看論文有沒有回答「**為什麼**多 agent 比單 agent 好」這個根本問題，而不只是「我這樣做 work 了」
- Workshop paper 不等於 main conference paper，注意區分
- 預印本（preprint）和已接收（accepted）的差距可以很大——有些預印本從未通過 peer review
- 新論文（< 6 個月）引用數低是正常的，此時看機構 + 開源 + 實驗品質判斷

## 技術文品質判斷

| 信號 | 好 | 差 |
|---|---|---|
| **有沒有跑過** | 附原始碼、跑過的輸出、截圖、benchmark 數據 | 只有概念描述、轉述官方文件 |
| **深度** | 分析設計取捨（tradeoffs）、指出限制（limitations）、比較替代方案 | 只列功能、只說好話 |
| **作者背景** | 在該領域有 production 經驗、維護相關開源專案 | 內容行銷、無法確認作者身份 |
| **時效性** | 標明適用版本、測試日期 | 無日期、混用多個版本的資訊 |
| **原創性** | 有獨立觀點或實測發現 | 改寫官方 docs 或其他文章 |

## 在 deep-research 流程中的應用

1. **步驟 2（蒐集）**：按 A → B → C → D 排序候選來源，D 級通常跳過
2. **步驟 3（交叉驗證）**：事實驗證表中標明每個事實的來源等級
3. **步驟 5（產出）**：research note 的 Sources 段落標明每個來源的等級
4. **學術論文清單**：附引用數、發表場所、是否有開源 code
