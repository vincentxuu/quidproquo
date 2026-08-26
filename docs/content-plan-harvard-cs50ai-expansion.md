# Harvard CS50 AI 逐週逐專案擴寫計畫

> 狀態：待授權（超過 20 檔批次，依治理規則需明確同意後開工）
> 授權依據：使用者指示「有完整教材就應該寫完整的」（2026-08-26）
> 前置查核：2026-08-26 對 `cs50.harvard.edu/ai/` 匿名抓取確認，7 週頁面均含 notes、quiz、projects、影片（CDN 2020 錄影）與 SRT/TXT 字幕。

## 目標

把既有的單篇總覽 `ai/2026-08-26-harvard-cs50-ai-guide` 擴充成完整逐週逐專案系列，比照 Stanford CS103／Berkeley CS188 的契約：一篇對應官方一個可自學單元。

## 官方結構與材料狀態（2026-08-26 查核）

| 官方單元 | 影片 | Notes | Quiz | Projects | 公開度 |
|---|---|---|---|---|---|
| Week 0 Search | 2020 CDN mp4＋SRT/TXT | ✓ | ✓ | Degrees、Tic-Tac-Toe | A3 |
| Week 1 Knowledge | 同上 | ✓ | ✓ | Knights、Minesweeper | A3 |
| Week 2 Uncertainty | 同上 | ✓ | ✓ | Heredity、PageRank | A3 |
| Week 3 Optimization | 同上 | ✓ | ✓ | Crossword | A3 |
| Week 4 Learning | 同上 | ✓ | ✓ | Shopping、Nim | A3 |
| Week 5 Neural Networks | 同上 | ✓ | ✓ | Traffic | A3 |
| Week 6 Language | 同上 | ✓ | ✓ | Parser、Questions | A3 |

全系列 A3，無阻塞項。唯一結構性限制：錄影為 2020 春季版，正文須沿用總覽已建立的「概念現行、影像 2020」框架，不得寫成 2026 新錄影。

## 系列模型

- Series name：`Harvard CS50 AI 導讀`（沿用既有總覽的 series name，不另開）
- 總覽維持 order 0（比照 CMU 10-301 慣例），逐講文從 order 1 開始連續編號；prev/next 用 order ± 1，不得缺號
- Slug 前綴 `harvard-cs50ai-`，雙語 `-en` 後缀

## Manifest（20 篇／語言，共 40 檔）

| order | slug | 內容 |
|---|---|---|
| 0 | （既有）harvard-cs50-ai-guide | 總覽，不動內容僅回補連結 |
| 1 | harvard-cs50ai-w00-search | W0 講課：DFS/BFS、A*、minimax、alpha-beta |
| 2 | harvard-cs50ai-p-degrees | Project：Degrees（BFS 實作） |
| 3 | harvard-cs50ai-p-tic-tac-toe | Project：Tic-Tac-Toe（minimax） |
| 4 | harvard-cs50ai-w01-knowledge | W1 講課：命題邏輯、知識推理、model checking |
| 5 | harvard-cs50ai-p-knights | Project：Knights |
| 6 | harvard-cs50ai-p-minesweeper | Project：Minesweeper |
| 7 | harvard-cs50ai-w02-uncertainty | W2 講課：機率、貝氏網路、D-separation、推論 |
| 8 | harvard-cs50ai-p-heredity | Project：Heredity |
| 9 | harvard-cs50ai-p-pagerank | Project：PageRank |
| 10 | harvard-cs50ai-w03-optimization | W3 講課：優化、局部搜尋、simulated annealing |
| 11 | harvard-cs50ai-p-crossword | Project：Crossword（constraint satisfaction） |
| 12 | harvard-cs50ai-w04-learning | W4 講課：監督學習、loss、scikit-learn、強化學習入門 |
| 13 | harvard-cs50ai-p-shopping | Project：Shopping（ML 分類） |
| 14 | harvard-cs50ai-p-nim | Project：Nim（Q-learning） |
| 15 | harvard-cs50ai-w05-neural-networks | W5 講課：神經網路、反向傳播、TensorFlow |
| 16 | harvard-cs50ai-p-traffic | Project：Traffic（CNN 分類） |
| 17 | harvard-cs50ai-w06-language | W6 講課：N-gram 語言模型、CNN 文本分類、注意力 |
| 18 | harvard-cs50ai-p-parser | Project：Parser |
| 19 | harvard-cs50ai-p-questions | Project：Questions（QA，TF-IDF＋問句型態） |

## 執行契約（沿襲 stanford-cs-lecture-series-expansion）

1. 不改任何既有 slug 或 `date`
2. 一篇對應官方一個 week 或 project；project spec 是獨立頁且含 check50，值得獨立成文——這是拆 19 篇而非 7 篇的理由
3. 每篇以該單元官方 notes＋影片＋project spec 為唯一事實來源；影片為 2020 版的事實每篇都要標註
4. 術語表沿用 `scripts/check-tw-terms.mjs` 台灣用語閘門；新術語先進 glossary
5. 預設雙語同步產出（zh-TW／en 各一份）
6. 每篇完成 `post-review`＋`post-verify`；數字、人名、演算法名稱不直接採信字幕
7. 總覽（order 0）在第一批上線時回補全系列連結，之後不再動
8. 完成後在研究 inventory 記錄「完成篇數／官方單元數」，19/19 才標 complete

## 批次切分（每批 ≤ 20 檔）

- 批次一（Phase 1）：W0–W3 共 11 篇 → 22 檔 → **需授權**
- 批次二（Phase 2）：W4–W6 共 8 篇 → 16 檔
- 若要壓在 20 檔內：改按週合併 project 成 7 篇 → 16 檔一次做完（放棄逐 project 拆分）

## 驗收

- `pnpm verify` 全綠（含 series-order、lang-parity、tw-terms）
- 20 篇 × 2 語言全數上線後，Harvard 地圖（learning）CS50 AI 段落改寫成指向系列入口
