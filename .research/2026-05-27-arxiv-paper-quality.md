# 如何判斷 arXiv 論文品質

> Research note — 2026-05-27
> 狀態：草稿，待使用者確認後可進 `post` skill 發文

---

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| arXiv 自 2004 年起要求首次投稿者須經 endorsement | arxiv.org 官方 endorsement 頁 | Wikipedia arXiv 條目 | ✅ |
| endorser 不需要審核論文正確性，只需確認「適合該領域」 | arxiv.org 官方 endorsement 頁 | AstroWright 部落格 (PSU) | ✅ |
| 來自公認學術機構的新作者通常自動獲得 endorsement | Wikipedia arXiv 條目 | Academia SE | ✅ |
| arXiv moderator 是志工，擁有該領域終端學位 | arxiv.org 官方 moderation 頁 | Wikipedia | ✅ |
| arXiv 約 6% 投稿被 hold，約 2% 被拒 | Scientific American 報導 | — | ⚠️ 單源 |
| arXiv moderation 不是 peer review | arxiv.org 官方 moderation 頁 | 多個 Academia SE 回答 | ✅ |
| 論文可被重新分類至 general 類別（被視為降級） | Scientific American | Academia SE | ✅ |
| 公告後的論文成為永久學術紀錄，arXiv 僅在授權問題時移除 | arxiv.org 官方 moderation 頁 | — | ✅ (官方一手) |
| Papers With Code 於 2025 年 7 月被 Meta 關閉 | CodeSOTA 報導 (含時間線) | TIB-Blog | ✅ |
| PWC 關閉前追蹤 9,327 benchmarks、79,817 papers、5,628 datasets | CodeSOTA | HyperAI 報導 | ✅ |
| arXiv 自 2023/12 起提供 HTML 版本（新投稿的 TeX/LaTeX） | arXiv 官方部落格 | arxiv.org info 頁 | ✅ |
| ar5iv 是 arXiv 的替代 HTML 渲染服務 | arXiv 官方 | arXiv Vanity 停止服務公告 | ✅ |
| Raff (2019) 嘗試復現 255 篇論文，成功率 63.5% | arxiv 2407.10239 | petewarden.com | ✅ |
| ML Reproducibility Checklist 已被 NeurIPS 採用 | arxiv 2605.17273 | arxiv 2407.10239 | ✅ |
| REFORMS checklist 包含 32 項、8 個模組 | arxiv 2308.07832 | Cell Press 出版版 | ✅ |
| Semantic Scholar 索引 200M+ 論文、2.4B+ 引用邊 | S2 Open Data Platform 論文 (2301.10140) | — | ✅ (官方一手) |
| Connected Papers 基於 Semantic Scholar 資料，使用相似度指標（非引用圖） | connectedpapers.com | HKUST Library 介紹 | ✅ |
| DORA 宣言反對以 Journal Impact Factor 作為個別論文品質的代理指標 | sfdora.org | — | ✅ (官方一手) |

---

## 1. arXiv 自身的品質機制

### 1.1 Endorsement 制度

arXiv 自 2004 年起要求新用戶在首次投稿（或投稿至新類別）前必須獲得 endorsement。

**endorser 的責任邊界**：endorser 不需要審核論文的正確性，只需確認：
- 作者熟悉該領域的基本事實
- 論文內容與該領域的當前研究相關

來自公認學術機構的新作者通常會自動獲得 endorsement，實務上不需要經過這個流程。endorser 必須在過去 3 個月至 5 年內在該領域有投稿紀錄。

**關鍵理解**：endorsement 是一個「信任網路」機制，確保投稿者屬於科學社群，而非品質認證。

### 1.2 Moderation 流程

arXiv moderator 是**志工領域專家，擁有終端學位**，由各學科的編輯諮詢委員會核准。

moderation 發生在投稿之後、公開之前。moderator 可以：
- **重新分類**：將論文移至更適合的類別（包括移至 general 類別，這在社群中被視為降級）
- **拒絕投稿**：基於以下理由——
  - 不符合學術交流標準（格式、語言、中立語氣）
  - 缺乏原創性、新穎性、重要性
  - 包含抄襲或嚴重錯誤陳述
  - 不是研究論文（課程作業、研究提案、新聞）
  - 重複內容
  - 投稿頻率過高（上限約每天 3 篇）

**不是 peer review**：moderator 不提供論文反饋，也不驗證研究結果是否正確。

據 Scientific American 報導 [⚠️ 單源]，約 6% 投稿被 hold，約 2% 被拒。相比之下，Nature/Science 接受率低於 10%。

### 1.3 公告後政策

一旦論文公告，即成為**永久學術紀錄**。arXiv 僅在以下情況考慮移除：
- 提交者無合法授權同意授權條款
- 違反 arXiv 政策（此時會 withdraw，但 metadata 保留）

### 1.4 AI 生成內容政策

arXiv 要求作者報告任何顯著使用的工具（包括生成式 AI），作者須對所有內容承擔全部責任。AI 工具不可列為作者。

---

## 2. 外部品質信號

### 2.1 會議收錄（最強信號）

論文首頁或 abstract 下方標註 "Accepted at [會議名]" 代表通過了同行審查。

**AI/ML 領域頂級會議分級**（按社群共識排序）：

| 等級 | 會議 | 特點 |
|---|---|---|
| Tier 1 | NeurIPS, ICML, ICLR | ML 核心，接受率 ~20-25% |
| Tier 1 | ACL, EMNLP, NAACL | NLP 核心 |
| Tier 1 | CVPR, ICCV, ECCV | Computer Vision 核心 |
| Tier 2 | AAAI, IJCAI, AISTATS, UAI, COLT | 廣泛 AI / 理論 |
| Workshop | 各大會議附設 workshop | 審查較寬鬆，但仍有同行評估 |

**注意**：沒有會議標註不代表論文差。很多高品質工作（尤其是工業界論文、技術報告）選擇不投會議。

### 2.2 引用指標（需謹慎解讀）

**引用數本身**：
- 受領域、時間、是否 open access 等因素嚴重影響
- DORA 宣言（San Francisco Declaration on Research Assessment）明確反對以 Journal Impact Factor 作為個別論文品質代理
- 同領域內的相對比較比絕對數字有意義

**更有價值的引用分析**：
- **Semantic Scholar "Highly Influential Citations"**：區分「順便引用」和「真正建立在此基礎上」的引用
- **引用速度**（citation velocity）：短期內快速增長的引用代表社群正在積極驗證
- **引用圖譜而非引用數**：「被 30 個獨立團隊延伸方法」比「被 200 篇論文在 related work 提一句」更有價值

### 2.3 開源復現

論文是否附帶可運行的程式碼已成為 AI/ML 領域的準品質信號：
- 有程式碼的論文被引用率顯著較高
- **2025 年後的現實**：Papers With Code 已於 2025/07 被 Meta 關閉，替代方案見下方工具章節
- 「有 GitHub 連結但 README 之後零 commit」是已知的表面功夫模式

---

## 3. 實用工具生態（2026 現況）

### 3.1 仍然活躍的工具

| 工具 | 定位 | 最佳使用場景 | 免費額度 |
|---|---|---|---|
| **Semantic Scholar** | 學術搜尋引擎，200M+ 論文 | 看 Highly Influential Citations、TLDR 摘要、引用趨勢 | 完全免費 |
| **Connected Papers** | 視覺化論文關聯圖 | 從一篇種子論文探索相關領域、找 Prior/Derivative Works | 每月 5 張圖（免費） |
| **OpenReview** | 公開審稿平台 | 直接看 ICLR 等會議的 reviewer 意見和評分 | 完全免費 |
| **Hugging Face Daily Papers** | 社群推薦的每日 AI 論文 | 追蹤 AI 領域熱門新論文、看社群投票 | 完全免費 |
| **ar5iv / arXiv HTML** | arXiv 論文 HTML 版 | 快速瀏覽（比 PDF 好讀）、搜尋內文 | 完全免費 |
| **DBLP** | 計算機科學書目資料庫 | 確認作者發表紀錄、查會議論文列表 | 完全免費 |
| **Google Scholar** | 通用學術搜尋 | 快速查引用數、找全文連結 | 完全免費 |
| **CodeSOTA** | PWC 的精神繼承者 | SOTA leaderboard（有復現驗證） | 完全免費 |

### 3.2 已關閉 / 變動的工具

| 工具 | 狀態 | 替代方案 |
|---|---|---|
| **Papers With Code** | 2025/07 被 Meta 關閉，重定向至 HF Trending Papers | CodeSOTA（leaderboard）、HF Trending Papers（論文發現）、歷史資料在 GitHub `paperswithcode-data` |
| **arXiv Vanity** | 已停止服務（arXiv 原生 HTML 取代） | arXiv 內建 HTML、ar5iv |

### 3.3 推薦工作流

```
發現階段：HF Daily Papers / Semantic Scholar / X (Twitter)
     ↓
初步篩選：看作者、機構、是否有會議收錄標記
     ↓
深入評估：OpenReview 看審稿意見 / Semantic Scholar 看引用品質
     ↓
延伸探索：Connected Papers 找相關工作 / DBLP 查作者紀錄
     ↓
復現驗證：CodeSOTA / GitHub / HF Models 找實作
```

---

## 4. 品質紅旗與常見陷阱

### 4.1 論文本體的紅旗

| 紅旗 | 為什麼是問題 |
|---|---|
| **Related work 引用了不存在的論文** | 代表使用了未經驗證的 AI 生成內容，全文可信度歸零 |
| **只在自製 dataset 上測試，無公開 benchmark 對比** | 無法與其他方法公平比較 |
| **沒有 ablation study** | 無法知道哪個組件真正有貢獻 |
| **只報告最有利的 metric** | 選擇性報告（cherry-picking） |
| **沒有 error bar / confidence interval** | 結果可能是隨機波動 |
| **baseline 過時（最新 baseline 超過 2 年前）** | 比較不公平 |
| **宣稱大幅超越 SOTA 但無程式碼** | 2025 年後，不附程式碼是負面信號 |
| **Abstract 的聲稱與 Results 表格數字差距大** | 論文在過度包裝 |
| **拼寫錯誤多、圖表品質差** | 缺乏基本的學術嚴謹性 |

### 4.2 arXiv 特有的陷阱

- **Version bombing**：短期內頻繁更新版本，可能在修正被發現的問題但不透明說明
- **標題黨**：誇張標題吸引注意但內容不符
- **自引灌水**：大量引用自己先前的（可能也未經審查的）arXiv 論文
- **假冒機構**：聲稱來自知名機構但實際上沒有關聯
- **general physics / general math 分類**：被 moderator 從專門類別移至 general 通常是降級信號

### 4.3 引用陷阱

- **引用數 ≠ 品質**：survey 論文引用數天然高但不代表原創貢獻高
- **跨領域引用不可比**：NLP 領域的 100 引用可能等同數學領域的 10 引用
- **新論文引用數低是正常的**：發表 6 個月內的論文看引用數沒有意義
- **引用卡特爾**（citation cartel）：一群作者互相引用灌水

---

## 5. AI/ML 領域特殊考量

### 5.1 可復現性危機

- Raff (2019) 嘗試獨立復現 255 篇論文，**成功率僅 63.5%**
- 主要原因：缺少程式碼、未報告 hyperparameter、random seed 影響、framework 版本差異
- Henderson et al. 發現深度強化學習論文的性能可因 random seed 等「看似微小的選擇」而劇烈變化
- 大型語言模型（LLM）加劇問題：proprietary model 無法復現、API 行為隨時間漂移

### 5.2 Benchmark gaming

已知的 43 種 Questionable Research Practices (QRPs) 包括：
- **Train/test leakage**：訓練資料汙染了測試集
- **Benchmark contamination**：模型可能在預訓練時已見過 benchmark 資料
- **選擇性 metric 報告**：只報告表現最好的那個指標
- **不公平 baseline 比較**：對自己的模型精心調參，對 baseline 用預設值
- **Ablation 不足**：宣稱某模組有貢獻但未驗證移除後的影響

### 5.3 實用的品質 checklist（綜合 REFORMS + ML Reproducibility Checklist + CodeSOTA 指南）

**Datasets**
- [ ] 使用了該任務的標準 benchmark？
- [ ] 資料集大小足以支撐統計意義？
- [ ] 資料前處理有足夠細節可復現？
- [ ] train/val/test 切分是標準的還是自定義的？

**Baselines**
- [ ] baseline 是近期的（12-18 個月內）？
- [ ] baseline 是作者自己跑的還是從其他論文抄數字？
- [ ] baseline 使用了相同的計算預算和 hyperparameter 搜尋？

**Metrics & 統計**
- [ ] 報告了該任務的所有標準 metrics？
- [ ] 有 error bar / confidence interval？
- [ ] 有統計顯著性檢驗？
- [ ] 有報告計算成本和推理速度？

**Reproducibility**
- [ ] 程式碼公開可用？
- [ ] hyperparameter 完整列出？
- [ ] 訓練硬體和時長已揭露？
- [ ] 是否有人獨立復現過結果？

**Integrity**
- [ ] 有 data leakage / contamination 分析？
- [ ] 有展示失敗案例？
- [ ] limitations 段落誠實討論了局限性？
- [ ] ablation study 測試了所有關鍵組件？

---

## 草稿骨架（供 `post` skill 使用）

**建議標題**：arXiv 論文品質判讀指南：從 endorsement 機制到實戰 checklist
**category**：`ai`
**type**：`guide`
**tags**：`arxiv`, `academic-paper`, `research`, `reproducibility`, `machine-learning`

### 大綱

1. **開頭**：arXiv 不是 peer review — 這句話到底意味著什麼？
2. **arXiv 的守門員**：endorsement + moderation 的實際運作（含拒稿率數據）
3. **外部品質信號金字塔**：頂會收錄 > 知名機構 + 開源復現 > 引用品質 > 純 arXiv
4. **2026 年的工具箱**：PWC 已死，現在怎麼辦？（Semantic Scholar / Connected Papers / OpenReview / CodeSOTA / HF Daily Papers）
5. **紅旗清單**：論文本體 + arXiv 特有 + 引用陷阱
6. **ML 論文專屬**：reproducibility crisis、benchmark gaming、43 種 QRPs
7. **實戰 checklist**：讀完一篇 arXiv ML 論文該打的勾
8. **結語**：品質判斷是一種技能，需要練習

---

## 來源清單

1. arXiv 官方 — endorsement 頁：https://info.arxiv.org/help/endorsement.html
2. arXiv 官方 — moderation 頁：https://info.arxiv.org/help/moderation/index.html
3. arXiv 官方 — HTML accessibility：https://blog.arxiv.org/2023/12/21/accessibility-update-arxiv-now-offers-papers-in-html-format
4. Wikipedia — arXiv：https://en.wikipedia.org/wiki/ArXiv
5. Scientific American — "ArXiv.org Reaches a Milestone and a Reckoning"：https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning
6. AstroWright (PSU) — On arXiv endorsements：https://sites.psu.edu/astrowright/2026/03/29/on-arxiv-endorsements
7. CodeSOTA — Papers with Code shutdown：https://www.codesota.com/papers-with-code
8. TIB-Blog — Papers with Code went offline：https://blog.tib.eu/2025/10/02/papers-with-code-went-offline-the-knowledge-doesnt-have-to
9. Semantic Scholar Open Data Platform (2301.10140)：https://ar5iv.labs.arxiv.org/html/2301.10140
10. Connected Papers：https://www.connectedpapers.com
11. HKUST Library — Connected Papers 介紹：https://library.hkust.edu.hk/news-events/news/connected-papers-free-tool-explore-research-papers
12. Hugging Face — Daily Papers 介紹：https://huggingface.co/blog/daily-papers
13. DORA 宣言：https://sfdora.org/read
14. CodeSOTA — How to Read an ML Paper：https://www.codesota.com/guides/reading-ml-papers
15. "Questionable practices in machine learning" (2407.12220)：https://arxiv.org/pdf/2407.12220v1
16. REFORMS checklist (2308.07832)：https://arxiv.org/pdf/2308.07832v2.pdf
17. "How not to do machine learning" (2108.02497)：https://arxiv.org/pdf/2108.02497
18. Ehud Reiter — Is a paper scientifically solid?：https://ehudreiter.com/2020/04/06/is-a-paper-scientifically-solid/
19. Pete Warden — ML Reproducibility Crisis：https://petewarden.com/2018/03/19/the-machine-learning-reproducibility-crisis
20. "State-of-the-Art Claims Require State-of-the-Art Evidence" (2605.17273)：https://arxiv.org/html/2605.17273v1
21. Princeton — Leakage and the Reproducibility Crisis in ML-based Science：https://reproducible.cs.princeton.edu
22. AI Research Slop (DEV Community)：https://dev.to/pickuma/ai-research-slop-how-to-filter-signal-from-the-arxiv-flood-5f9j
23. Bibliometrics tracking research impact (PMC)：https://pmc.ncbi.nlm.nih.gov/articles/PMC4770502
24. Aaron Tay — What Academic Deep Research Is Really For：https://aarontay.substack.com/p/what-academic-deep-research-is-really
