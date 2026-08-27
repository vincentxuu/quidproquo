# Stanford CS229 逐講系列版本研究

- 研究日期：2026-08-22
- 目標：判定 CS229 是否能依 CS230／CS161 的標準，製作成單一學期、逐講、雙語、可追溯來源的系列。
- 停止條件：選定可忠實製作的學期，列出逐講材料覆蓋、缺口、檔案量與實作批次；若無完整公開版本，明確標示阻塞。

## 研究問題

1. 哪一個 CS229 學期具有明確、不可混用的課程版本？
2. 該學期有幾講，各講日期、主題、講師與公開材料為何？
3. 哪些錄影或材料受 Stanford 權限限制，哪些講次存在來源缺口？
4. 若製作雙語逐講文章，需要新增多少檔案、如何排序與分批？

## 結論

目前的 CS229 課程頁不適合直接擴寫成逐講系列：Summer 2026、Spring 2026、Winter 2026 的課程文件與 syllabus 都要求 Stanford 帳號，無法以公開官方資料確認完整逐講內容。Fall 2025 雖公開 20 講的日期與題目，但逐講文件仍受限，不能達到 CS230／CS161 的來源忠實度。

目前最可行的版本是 **CS229 Spring 2021**：官方 syllabus 公開 19 講的日期、主題與對應閱讀，前 18 講至少有一份公開官方講義、投影片或 live notes；第 19 講「Societal impact」在 syllabus 中沒有公開材料連結。錄影則全部僅限 Canvas。

因此建議採以下決策：

- 系列名稱明示為「Stanford CS229 Spring 2021 導讀」，不得與 2025／2026 資料混寫成同一學期。
- 現階段可製作 L1–L18，共 **18 講 × 2 語言 = 36 個 Markdown 檔案**。
- L19 維持 blocked，不以其他年份或非官方內容補洞；找到同一學期的官方材料後才補齊，完整系列屆時為 **19 講 × 2 = 38 個檔案**。
- 2026 主講義可放在個別文章的「延伸閱讀」，但必須標示為現行版本，不可當成 Spring 2021 的逐講原始材料。
- 若產品要求一次完成全部正式講次，下一門應改做公開來源更完整的 CS111 或 CS221，不應先寫 CS229。

## 來源清單

| 來源 | 版本／日期 | 用途 | 限制 |
| --- | --- | --- | --- |
| [CS229 current course page](https://cs229.stanford.edu/) | Summer 2026，查閱於 2026-08-22 | 確認現行學期、講師與 Stanford 權限限制 | syllabus 與課程文件受限 |
| [CS229 Spring 2026](https://cs229.stanford.edu/index.html-spr26) | Spring 2026，查閱於 2026-08-22 | 確認講師與文件權限 | 無公開逐講表 |
| [CS229 Winter 2026](https://cs229.stanford.edu/index.html-win26) | Winter 2026，查閱於 2026-08-22 | 確認講師與文件權限 | 無公開逐講表 |
| [CS229 Fall 2025](https://cs229.stanford.edu/index.html-fall25) | Fall 2025，查閱於 2026-08-22 | 確認 20 講公開排程 | 逐講文件受限 |
| [CS229 Summer 2025](https://cs229.stanford.edu/index.html-summer25) | Summer 2025，查閱於 2026-08-22 | 確認 16 講公開排程 | 逐講文件受限 |
| [CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html) | Spring 2021，查閱於 2026-08-22 | 19 講日期、主題、閱讀與材料的主錨點 | 錄影為 Canvas-only；L19 無材料連結 |
| [CS229 current main notes](https://cs229.stanford.edu/main_notes.pdf) | 2026-08-18 | 現行課程範圍與延伸閱讀 | 不是 Spring 2021 逐講材料 |
| [CS229 full materials archive](https://cs229.stanford.edu/materials.html-full) | 歷史彙整，查閱於 2026-08-22 | 交叉檢查舊主題講義 | 未必對應 Spring 2021 排程 |

## 來源完整性

| 候選版本 | 公開逐講表 | 公開逐講材料 | 公開錄影 | 可用層級 | 判定 |
| --- | --- | --- | --- | --- | --- |
| Summer 2026 | 否 | 否 | 未能由課程頁確認 | L0 | 不可製作 |
| Spring 2026 | 否 | 否 | 未能由課程頁確認 | L0 | 不可製作 |
| Winter 2026 | 否 | 否 | 未能由課程頁確認 | L0 | 不可製作 |
| Fall 2025 | 是，20 講 | 否，文件受限 | 未公開於課程頁 | L1 | 只能建立題目清單，不能逐講導讀 |
| Summer 2025 | 是，16 講 | 否，文件受限 | 未公開於課程頁 | L1 | 只能建立題目清單，不能逐講導讀 |
| Spring 2021 | 是，19 講 | L1–L18 有；L19 無 | Canvas-only | L2 | 可做 18 講歷史版，1 講阻塞 |

層級定義：L0 = 無法取得公開逐講依據；L1 = 有排程但沒有足以支撐文章的逐講材料；L2 = 多數講次有官方材料但仍有缺口；L3 = 全部講次均有公開官方材料。

## Spring 2021 逐講 manifest

| 講次 | 日期 | 官方主題 | 公開材料狀態 | 製作狀態 |
| --- | --- | --- | --- | --- |
| L1 | 2021-03-29 | Introduction | Slides | ready |
| L2 | 2021-03-31 | Supervised learning setup; LMS | Live notes／class notes | ready |
| L3 | 2021-04-05 | Weighted least squares; logistic regression; Newton's method | Class notes／live notes | ready |
| L4 | 2021-04-07 | Data split; exponential family; GLM | Class notes／live notes | ready |
| L5 | 2021-04-12 | GDA; Naive Bayes | Class notes／live notes | ready |
| L6 | 2021-04-14 | Naive Bayes; Laplace smoothing | Class notes／live notes | ready |
| L7 | 2021-04-19 | Kernels; SVM | Class notes／live notes | ready |
| L8 | 2021-04-21 | Neural networks I | Slides／notes | ready |
| L9 | 2021-04-26 | Neural networks II; backpropagation | Slides／notes | ready |
| L10 | 2021-04-28 | Bias–variance; regularization; model selection | Class notes／live notes | ready |
| L11 | 2021-05-03 | K-means; GMM; EM | Class notes／live notes | ready |
| L12 | 2021-05-05 | GMM; EM; factor analysis | Class notes／live notes | ready |
| L13 | 2021-05-10 | Factor analysis; PCA | Class notes／live notes | ready |
| L14 | 2021-05-12 | Weakly supervised and unsupervised learning | Slides／notes | ready |
| L15 | 2021-05-17 | Self-supervised learning: language and image models | Slides | ready |
| L16 | 2021-05-19 | Advice for applying machine learning | Slides／notes | ready |
| L17 | 2021-05-24 | RL basics; value and policy iteration | Official RL notes | ready |
| L18 | 2021-05-26 | Model-based RL; value function approximation | Official RL notes | ready |
| L19 | 2021-06-02 | Societal impact | Syllabus 無材料連結 | blocked |

所有講次錄影皆標示為 Canvas-only，不列為公開來源。L1 投影片標示 Moses Charikar 與 Chris Ré；這可支持該 offering 的授課者辨識，但每篇仍應以各自材料署名為準，不推定所有材料都由同一人主講。

## 事實交叉表

| 主張 | 現行課程頁 | Fall 2025 | Spring 2021 syllabus | 2026 main notes | 信心 |
| --- | --- | --- | --- | --- | --- |
| 現行文件需要 Stanford 身分 | 支持 | 支持 | 不適用 | 不適用 | 高 |
| Fall 2025 有 20 講公開排程 | 不適用 | 支持 | 不適用 | 不適用 | 高 |
| Spring 2021 有 19 講 | 不適用 | 不適用 | 支持 | 不適用 | 高 |
| Spring 2021 L1–L18 有公開官方材料 | 不適用 | 不適用 | 支持 | 不適用 | 高 |
| Spring 2021 L19 缺公開逐講材料 | 不適用 | 不適用 | 支持 | 不適用 | 高 |
| 2026 main notes 可代表 Spring 2021 逐講內容 | 不支持 | 不支持 | 不支持 | 僅支持現行主題範圍 | 高 |

## 推論與邊界

| 推論 | 依據 | 不確定性／處理方式 |
| --- | --- | --- |
| Spring 2021 是目前最佳歷史 fallback | 唯一同時公開完整排程，且 18/19 講有 offering-linked 官方材料 | 尚未證明所有年份中絕對不存在更完整版本；只主張在已核實候選中最佳 |
| 可立即新增 36 檔 | 18 個 ready 講次 × zh-TW/en | 不含 overview 與 blocked L19 |
| 不應用其他年份材料補 L19 | 系列要求單一版本與來源忠實 | 若找到 Spring 2021 官方 L19 材料，可解除阻塞 |
| 現有 CS229 overview 可保留 | overview 本身定位為整體課程與現行資料導讀 | series 說明與逐講頁必須明示 Spring 2021，避免讀者誤認為同一 offering |

## 建議文章契約

每篇逐講文章至少包含：

1. 明示 `Stanford CS229, Spring 2021, Lecture N`。
2. 列出該講日期、官方題目、主要材料與材料類型。
3. 只重建該講公開材料能支持的概念順序，不從其他年份拼接成「本堂課內容」。
4. 以自己的話解釋核心概念、公式直覺、適用條件與常見錯誤。
5. 如引用 2026 main notes，放在「延伸閱讀」並標示版本差異。
6. 中英文文章互相連結，並使用相同 lecture 編號與 series order。

## 系列排序與批次

- 既有 bilingual overview：order 1。
- L1–L18：orders 2–19；每講 zh-TW/en 共兩檔。
- L19：找到同一 offering 的官方材料後使用 order 20。
- 建議批次：L1–L6（12 檔）、L7–L12（12 檔）、L13–L18（12 檔）。每批完成後執行 frontmatter／系列導航檢查，全部完成後再跑 `pnpm verify`。

## 實作前決策

這是超過 20 檔的批次變更。依專案治理，開始新增 36 檔前需取得使用者對下列範圍的明確批准：

- 接受歷史版本 Spring 2021，而不是目前受限的 2026 offering。
- 接受先發布 L1–L18、L19 保持 blocked；或要求等 L19 解鎖後再整批發布。
- 接受系列頁清楚標示歷史 offering，且不把跨年份資料描述成該堂授課內容。
# Editorial decision update — 2026-08-22

The Spring 2021 lecture-by-lecture draft plan was retired before publication. Although that offering had a coherent public syllabus, its lecture videos were Canvas-gated and its topic sequence no longer represented the current public CS229 notes. The replacement series follows the 278-page `main_notes.pdf` dated August 18, 2026, using its 21 numbered chapters as the editorial units. The old 36 untracked bilingual drafts remain recoverable under `.research/archived-drafts/cs229-spring2021/` and are not active site content.
