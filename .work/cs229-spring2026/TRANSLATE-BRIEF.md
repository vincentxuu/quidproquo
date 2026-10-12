# CS229 Spring 2026 逐堂導讀：英文版翻譯說明

repo 根目錄：`/Users/vincent/Work/study/quidproquo`（以下路徑皆相對於此）。

## 背景

quidproquo.cc 是雙語站（zh-TW 為主、en 在 `/en/...`）。「Stanford CS229 導讀」系列剛改成照 Spring 2026 公開錄影一堂一篇，中文稿已寫完並通過獨立審稿。你負責把其中一篇翻成英文版。英文讀者一樣是照這份錄影自學的人。

中文稿是定稿，**不要改中文檔**。翻譯過程中若發現中文稿有錯（算錯、連結錯、事實可疑），不要自己在英文版偷偷修成另一個說法：照中文翻，並在回報裡列出來。

## 必讀

- `.agents/skills/post-translate/SKILL.md`：站上翻譯流程與規則，照它做（雙向連結、frontmatter、不逐字硬翻等）。它若要求你跑 `pnpm verify` 或做 git 操作，這次都不要做，原因見下方「不要做的事」。
- `.agents/skills/post/references/course-guide-contract.md` 的「標題與課程位置」一節：英文標題格式。
- 英文版範本（看格式，不看內容）：`src/content/posts/ai/2026-09-30-cs231n-image-classification-linear-en.md`。

## 這個系列的固定對應

**檔名**：中文檔名去掉 `.md` 加 `-en.md`，放同一個資料夾。

**frontmatter**：

- `title`：`<Topic>: <optional core question> | Stanford CS229 Lecture N`；課程總覽那篇是 `... | Stanford CS229 Course Overview`。主題與問句自然翻譯，不要逐字。
- `lang: en`
- `series.name`：`"Reading Stanford CS229"`，`order` 與中文相同。
- `additionalSeries`（只有總覽有）：`"Reading Stanford's Main-Line CS Courses"`，order 與中文相同。
- `date`、`category`、`type`、`tags`、`draft` 照中文。`tldr`、`description` 翻譯。

**開頭**：

1. `> 🌏 [中文版](/posts/ai/<中文 slug>)`
2. 影片狀態行必須以 `**Video status: Videos included.**` 開頭（檢查器比對這個字串），同段接著翻譯中文的底本說明。
3. 導言。
4. youtube 嵌入區塊原樣保留（`url`、`title`、`captions` 三行不翻）。

**結尾區塊標題**：`## 課程影片來源` → `## Course video sources`；`## 更新紀錄` → `## Update Log`；`## 參考資料` → `## References`；`## 自我檢查` → `## Self-check`；`## 對應閱讀` → `## Corresponding reading`。

「課程影片來源」裡的固定行：

- `原始影片：` → `Original video: `
- `查核日期：2026-10-12。` → `Checked: 2026-10-12.`
- `內容核對：已依字幕核對（2026-10-12）：…` → `Content check: verified against the video transcript (2026-10-12): …`（檢查器比對 `Content check: verified against the video` 這個開頭）

**站內連結**：連到本系列其他篇的連結一律改成對應的英文版路徑（原路徑加 `-en`）。其他堂的英文版會同時由別人翻，檔案可能還不存在，照規則寫就好。連結文字用 `.work/cs229-spring2026/titles.md` 裡的中文標題自然翻成英文主題（例如 `Lecture 6: bias and variance, regularization, and model selection`），不需要跟別人的英文標題逐字一致。連到系列外站內文章的連結：先用 `ls` 確認 `<原路徑>-en.md` 存在，存在就連英文版，不存在就保留原連結。

## 翻譯要求

- **內容等量**。每一節、每一步推導、每個例子、每題自我檢查與答案都要在，不摘要、不省略、不新增內容。公式（`$...$` 與 `$$` 區塊）原樣搬過去，不要重打，避免抄錯；數字、時間戳、頁碼、式號一個都不能變。
- **英文引句**：中文稿裡引用的講者英文原句，原樣保留，不要改寫或「修文法」。中文稿對引句的中文解說則翻成英文。
- **術語**：用這個領域的標準英文（log partition function、posterior、ELBO、reward-to-go 等），不要從中文回譯出怪詞。中文稿在術語後附的英文原文括號，英文版就直接用那個詞，不要留下「regularization (regularization)」這種重複。中文稿裡解釋中文譯名選擇的句子（例如說明 row／column 的中文慣例）在英文版沒有意義，刪掉並在回報說明。
- **標示**：中文的「本文補充」「本文自擬」「本文整理」翻成一致的說法，例如 "an addition in this article"、"an example made up for this article, not from the lecture"。課堂說法與本文補充的界線要跟中文一樣清楚。
- **文字**：寫成自然、直接的英文技術文章，不是逐句對譯。台灣特有的說法換成英文讀者懂的說法。

## 不要做的事

- 不要 `git add`、commit、push。不要改中文檔或任何其他檔案；只新增你這一個 `-en.md`。
- 不要跑 `pnpm verify`、`pnpm build`（十幾個人同時在翻，會互相干擾，而且其他篇的英文版還沒出來，連結檢查一定紅）。
- 可以跑：`node .agents/skills/post/scripts/check-course-titles.mjs <英文檔路徑>`、`node .agents/skills/post/scripts/check-course-guide-layout.mjs`。

## 完成前自己檢查

1. 用一小段腳本比對中英兩檔：`$$` 區塊數量相同、行內公式數量相同（差異要能解釋）、H2／H3 數量相同、youtube 區塊相同、中文檔裡出現的每個阿拉伯數字串在英文檔都找得到（列出找不到的，逐一確認是合理差異還是漏翻）。
2. 用 repo 的 katex（`node_modules/katex`）把英文檔所有公式渲染一遍，0 錯誤。
3. 英文檔裡不應殘留中文字，除了開頭的「中文版」連結文字（用 grep 找 CJK 字元確認）。

## 回報

最後一則訊息給我：英文檔路徑與字元數、英文標題、上述三項檢查的結果、刪掉或調整的句子（如中文慣例說明）、你發現的中文稿疑似錯誤（沒有就說沒有）、標題檢查器輸出。
