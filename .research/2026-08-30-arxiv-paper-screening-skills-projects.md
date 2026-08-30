# 新論文篩選相關 skills 與專案研究

- 日期：2026-08-30
- 問題：是否已有公開 skill、開源專案或 API，在做類似 QuidProQuo daily 的新論文候選蒐集、相關性排序與品質篩選？
- 母群：能從一批新論文候選中挑出「值得讀／值得報導」項目的工具。排除只摘要單篇論文、只整理引用格式、沒有篩選或排序能力的工具。
- 比較面向：候選池完整性、相關性排序、研究品質判斷、可複現性、導入成本。

## 結論

沒有一個成熟方案能包辦三層工作：

1. **候選池**：arXiv API 是當日 arXiv 論文的主來源；OpenAlex 可補跨來源 metadata，Semantic Scholar 可從正負 seed 擴展相關論文。
2. **相關性**：ASReview 最值得參考。它把編輯標註的 relevant／irrelevant 回饋給 active-learning 排序器；Scholar Inbox 與 arxiv-sanity-lite 則證明「依使用者歷史偏好做每日推薦」可行。
3. **品質**：現成 literature-review skills 多半提供系統性篩選與品質檢核表，但沒有針對剛上 arXiv 的 ML／Agent 論文建立已驗證的統一分數。PaperBench、ARA 比較接近可複現性評估，但成本高，仍不適合作為每日第一輪篩選器。

因此不建議直接安裝某一個 skill 取代現行流程。較合理的組合是：**ECC 的可追溯 screening protocol + ASReview 式編輯回饋 + 本站自己的 ML／Agent 品質 rubric**。

## Skills 比較

| Skill | Skills CLI 安裝量快照 | 做得好的部分 | 不適合直接照搬的部分 | 判定 |
|---|---:|---|---|---|
| [affaan-m/ecc `literature-review`](https://skills.sh/affaan-m/ecc/literature-review) | 5.2K | 先定問題與搜尋協定；去重；title → abstract → full text；記錄排除理由；結構化擷取方法、資料、比較組、限制；驗證引用 | 沒有針對當日 ML 預印本的數值品質分數 | **最適合借流程骨架** |
| [ByteDance DeerFlow `systematic-literature-review`](https://skills.sh/bytedance/deer-flow/systematic-literature-review) | 1.9K | 有 arXiv 搜尋腳本、日期／分類限制、摘要擷取與綜合；候選少時不硬補數量 | 主要沿用 arXiv relevance 排序；不判斷實驗嚴謹、baseline 公平性、可複現性 | 適合候選擷取，不足以當品質閘門 |
| [academic-research-skills `academic-paper-reviewer`](https://skills.sh/imbad0202/academic-research-skills/academic-paper-reviewer) | 7.9K | 從方法、統計、可複現性、領域價值、反方觀點做多視角審查；區分科學有效性與投稿成熟度 | 每篇成本高；是模擬 peer review，不是經 benchmark 證實的自動審稿器；沒有 discovery/ranking | 適合 shortlist 後深審 |
| [K-Dense `literature-review`](https://skills.sh/k-dense-ai/scientific-agent-skills/literature-review) | 1.5K | 多資料庫、PRISMA、分層 screening、quality assessment、引用驗證 | Cochrane／Newcastle-Ottawa／AMSTAR 2 偏生醫；另有優先 citation、venue、author reputation 的規則，會對零引用的新 arXiv 論文與非名校作者造成結構性偏誤 | 借可追溯流程，不宜原樣導入 |

### Skills 生態的共同缺口

- 多數是「系統性回顧」或「讀完後摘要」，不是每日新論文編輯台。
- 常把引用數、期刊／會議、作者聲望當品質 proxy；這些訊號對剛發布的預印本無效，而且會放大知名度偏誤。
- 沒有看到兼具新論文 recall、本站主題相關性、研究品質三者，且提供公開 validation set 的成熟 skill。

## 專案與服務比較

| 專案 | 核心機制 | 可用在哪一層 | 主要限制 |
|---|---|---|---|
| [ASReview LAB](https://asreview.readthedocs.io/en/stable/lab/about.html) / [論文](https://www.nature.com/articles/s42256-020-00287-7) | 人先標 relevant／irrelevant，active learning 不斷把最可能相關的 record 排到前面；保留透明、可匯出的 screening 記錄 | **相關性排序首選**；用歷史 daily 收錄／淘汰結果訓練本站偏好 | 找「相關」而非判斷論文研究品質；需要累積標註與停止準則 |
| [Scholar Inbox](https://arxiv.org/abs/2504.08385) | 用使用者評分做個人化推薦；用 science map 處理 cold start，並以 active learning 主動詢問評分 | 證明個人化 daily paper feed 的方向可行 | 是公開可用平台與研究成果，但未找到可直接採用的公開實作 repo；同樣不是品質評分器 |
| [arxiv-sanity-lite](https://github.com/karpathy/arxiv-sanity-lite) | 定期抓 arXiv；使用者標記有興趣的論文；用 abstract TF-IDF + SVM 推薦；支援 daily email | **最輕量可讀的參考實作**；很像本站 daily 的回饋式候選排序 | 模型簡單、偏好相似度不等於品質，不能取代 evidence review |
| [Semantic Scholar Recommendations API](https://www.semanticscholar.org/product/api/tutorial) | 單一 seed，或 positive／negative seed lists；結果依 relevance 降序 | 從已收錄與已排除論文擴展候選／補漏 | 外部服務與 rate limit；結果是相關性，不是研究品質 |
| [OpenAlex Works](https://help.openalex.org/data/works/) | 聚合 arXiv、Crossref、DataCite、PubMed 等來源；支援搜尋、filter、sort、group | 補 metadata、跨來源查重與候選池完整性 | 不提供符合本站目的的品質或推薦判斷 |
| [PaperBench](https://openai.com/index/paperbench/) | 把 20 篇 AI 論文的重現工作拆成 8,316 個可評分子任務，並用作者共同制定的 rubric 評估 | 借鏡「可複現性要拆成可觀察欄位」的設計 | 評估的是 agent 能否重現論文，完整執行成本遠超 daily screening |
| [ARA](https://arxiv.org/abs/2605.02651) | 從論文抽取來源、方法、實驗、輸出的 workflow graph，再評估 reconstructability | 可作 shortlist 後的實驗性 reproducibility audit | 2026 年的新研究，論文回報約 61% accuracy；不能當成熟自動品質裁判 |

## 對 QuidProQuo 的建議設計

### 第一階段：先把規則變成可稽核資料

每次 run 保存完整候選集，不只保存最後三篇。每篇至少記錄：

- arXiv ID、版本、提交時間、分類、搜尋命中原因
- 可信度門檻結果、明確排除理由與支持判斷的正文證據
- 方向新意、今日重要性、實務連結、證據成熟度、可復現性與編輯信心等文字標籤
- 最終 editorial label：收錄／不收錄／待觀察
- 若未滿門檻，允許少於三篇，不拿低分項目補版面

### 第二階段：建立適合新 ML／Agent 論文的 rubric

最終採用兩關式 rubric，不把不同判斷壓成單一總分：

| 關卡／標註 | 要回答的問題 |
|---|---|
| 可信度門檻 | 方法與證據是否足以支持文章準備陳述的有限主張？ |
| 本站相關性 | 是否直接改變 AI Agent 的建構、評估、部署或產品決策？ |
| 方向新意 | 新增的是方法、資料、問題設定或評估，還是只換包裝？ |
| 今日重要性 | 讀者今天知道後，是否會改變觀察重點或近期決策？ |
| 實務連結 | 能否指出具體受影響的工程或產品情境？ |
| 證據成熟度 | 核心主張、baseline、消融與限制覆蓋到什麼程度？ |
| 可複現性 | code、data、config、outputs 或預註冊是否足以重跑？ |
| 編輯信心 | 目前證據是否支持文章採用的敘述強度？ |
| Clarity／Presentation | 方法、實驗與限制是否足以被準確理解？只留內部紀錄 |

引用數、作者聲望、機構與 venue 不進可信度門檻或方向排序。它們可當 metadata 顯示，不能當新論文品質的替代指標。頂會常見的 5／6／10 分制依賴多位 reviewer 與校準母群，本站 daily 不仿造看似精確的 Overall score。

### 第三階段：讓排序器學習編輯決策

累積足夠的收錄／淘汰紀錄後，採 ASReview 或 arxiv-sanity-lite 類型的 relevance model：

1. 模型只負責把「較可能值得人工審」的候選往前排。
2. 品質 rubric 與來源證據仍由後續流程產生。
3. 定期抽查低排名論文，估算漏掉重要論文的比例，避免 feedback loop 只強化既有口味。

## 風險與偏誤

- **冷啟動**：舊文章的收錄結果可能沒有一致的淘汰紀錄，不能直接當乾淨標註集。
- **主題窄化**：只用已收錄論文做 positive seed，會一直推薦相似主題；需要 exploration quota 或低排名抽查。
- **LLM 自信分數**：若分數沒有對應論文原文證據，只是換成數字的主觀判斷。
- **預印本不確定性**：arXiv 上架不等於同行評審通過；daily 文章應把「作者主張」與「我們確認的證據」分開。
- **品質與新聞價值不同**：研究嚴謹但對本站讀者影響小，或新聞性高但證據初步，應分欄評分，不能混成一個模糊 relevance score。

## 來源完整度

- 完整讀取：ECC、DeerFlow、academic-paper-reviewer、K-Dense 的公開 skill 內容；ASReview 官方文件與論文；Scholar Inbox arXiv 摘要；arxiv-sanity-lite README；Semantic Scholar 官方 API tutorial；OpenAlex Works 文件；PaperBench 官方頁；ARA arXiv 摘要。
- 僅作生態發現、未列為推薦依據：Skills CLI 中安裝量極低的 `arxiv-paper-rater`、`paper-discovery`、`asreview-screening` skills。
- 未驗證：各方案在 QuidProQuo 歷史文章上的 precision／recall；需另建本站 validation set 才能比較。
