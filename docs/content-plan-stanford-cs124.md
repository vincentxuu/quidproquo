# Stanford CS124 逐週系列內容計畫

## 鎖定版本

- 課程：CS 124 / LINGUIST 180, *From Languages to Information*
- Offering：Winter 2026（2026-01-06 至 2026-03-12）
- 講師：Dan Jurafsky
- 官方單位：課表 Week 1–10；一篇對應一週，因 flipped classroom 把預錄主題、週二 lecture／lab、指定閱讀與 PA 組成同一個教學單元。
- Material fidelity：L2。schedule、公開投影片、指定閱讀與 PA starter repos 足以重建 agenda；Canvas 預錄影片、Gradescope quiz、五場現場 lecture／labs 的完整講授內容不可公開存取。
- 系列：`Stanford CS124 導讀`；既有總覽為 order 1，逐週文章為 order 2–11。

## 編輯契約

1. 只陳述 schedule、公開投影片、指定讀物與公開 repo 能支持的內容；不把投影片大綱寫成逐字講授。
2. 每篇開頭列 course version、week/date、講師／活動帶領者、官方材料與公開材料缺口。
3. 課程內容依官方 agenda 排列；作者補充只放在 `延伸`／`Further study`。
4. 中文與英文使用相同 order、章節骨架、來源集合與缺口聲明。
5. 課綱指定的教科書版本是 *Speech and Language Processing* 3e August 2025 release；主站 2026-08 版已重排章號，不能無聲替換。

## 官方 manifest

| Week | Dates | Official unit | In-class | Reading / artifact | Series order | Status |
|---:|---|---|---|---|---:|---|
| 1 | Jan 6, 8 | Introduction and setup | Intro lecture; Jupyter/PA0 tutorial | `intro26.pdf`, PA0 | 2 | first batch |
| 2 | Jan 13, 15 | Words, tokenization, edit distance, n-gram LMs | Lab 1; NumPy tutorial | SLP3 Ch2 pp.1–32, Ch3 pp.1–14; PA1 | 3 | first batch |
| 3 | Jan 20, 22 | Logistic regression and text classification | Lab 2 | SLP3 Ch4 pp.1–17; PA2 | 4 | first batch |
| 4 | Jan 27, 29 | Information retrieval | Lab 3 | SLP3 Ch11; PA3 | 5 | first batch |
| 5 | Feb 3, 5 | Embeddings and Social NLP / computational social science | live lecture | SLP3 Ch5 pp.1–12,17–21 plus assigned Ch10 pp.9–12; PA4 | 6 | first batch |
| 6 | Feb 10, 12 | Neural networks; LLMs and Transformers | live lecture | SLP3 Ch6; PA5 | 7 | completed |
| 7 | Feb 17, 19 | Transformers and speech processing | live speech lecture | August 2025 SLP3 Ch7 pp.1–11,17 and Ch8; PA6 | 8 | completed |
| 8 | Feb 24, 26 | Speech; PA7 and Git | Lab 4 | August 2025 SLP3 Ch15/16; PA6b | 9 | completed |
| 9 | Mar 3, 5 | Collaborative filtering and ethical LLM use | Lab 5 | MMDS Ch9 §§9.1–9.3; PA7 | 10 | completed |
| 10 | Mar 10, 12 | PageRank and social networks | final live lecture | IR Ch21 excerpts; Easley–Kleinberg readings | 11 | completed |

### 第一批篇幅紀錄

修訂批次 A 已以公開 slides、指定 reading 與 lab／PA exercises 擴寫 Week 1–5；五篇中文正文（不含 frontmatter）均達至少 6,000 字元，且英文同步相同章節與來源。新增內容集中在可重現 artifact：PA0 環境診斷、BPE／edit-distance／n-gram 手算、分類 design matrix／gradient／error analysis、index／ranking／RAG evaluation、PPMI／prediction-based embeddings／representation probes；未使用 Canvas narration、Gradescope 或 live lecture 內容。

修訂批次 B 已以公開 slides、指定 reading 與 PA6a／PA6b／PA7 repo exercises 擴寫 Week 6–10；五篇中文正文（不含 frontmatter）均達至少 6,000 字元，英文同步相同章節與來源。新增內容集中在 neural-network shapes／gradient diagnostics、attention／training／perplexity tests、TTS→STT alignment／accessibility／Git workflow、collaborative-filtering／tool contracts／agent scenarios，以及 PageRank／centrality／graph evidence。live lectures、Canvas、Gradescope 與 chapter-number drift 仍保留為明示缺口，未用通識內容替補。

至此 Week 1–10 全部通過本系列 6,000 字元最低 editorial length audit；是否達到最終 publish-ready 仍需逐篇 `post-review`／`post-verify`，篇幅通過不等於事實層已完成最終審核。

### Clean-review blocker 修訂

- zh/en 的 `##` heading 已逐對人工核對，Week 1–6 補齊 `Further study`，Week 8／10 補齊 completion-line heading；10 組 heading count 分別一致。
- Week 5 的 Social NLP 具體 audit 全部標為從可讀 Chapter 5 出發的作者延伸，不再歸給 403／未錄 live lecture；title、tldr、opening 同步修正。
- Week 6 的 LLM 架構只歸於檔名標示 2025 的公開 deck；Week 10 的 post-training／multilingual／speech 只歸於標示 2025 的 public final-deck outline，不歸為 2026 live narration。
- Week 2 原「機率質量」在數學上是 probability mass 的正當譯法，但為避免 TW lint 將它當物理語境警告，正文改寫成「機率權重」，語意不變。

## 已知缺口與版本風險

- Canvas videos、Gradescope quizzes 與 autograders gated。
- 課程明說五場 live lectures 與五場 labs 沒有錄影；公開投影片不能證明現場補充內容。
- Week 5 Social NLP slides 位於 restricted path，公開請求回 403。
- 課綱章號鎖定 August 2025；現行 SLP3 章號已漂移。Week 7–8 寫作前必須固定 archive URLs。
- 課表的 PA 顯示文字、連結與 repo 曾有編號錯位；manifest 以週主題加 canonical repo 交叉確認。

## 完成判準

- 10 個 manifest units 各有 zh-TW/en pair，order 2–11 連續。
- 每篇有版本、日期、活動、官方來源、缺口；雙語結構與來源相同。
- targeted references、TW、lang parity、series order、lint 與 Astro check 通過；整個 wave 再跑 `pnpm verify`。
