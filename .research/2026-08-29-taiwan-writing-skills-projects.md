# 台灣寫作 / 語氣 / 校對 Skill 與專案研究

Date: 2026-08-29
Scope: 台灣／繁中社群做的寫作輔助專案，包含白話化、台灣用語、繁中校對、AI 味清理與 agent skill。排除純簡中、公文套版與 SEO 內容農場。
Method: Groundlane `web_search` + `web_fetch`；以 GitHub / gist 原始頁為主。

Update: 補查社群媒體分享線索。社群貼文本身多半只放短摘要或導流，完整 skill 內容通常落在 GitHub / 部落格。

## 結論

若目標是讓 quidproquo 文章與 daily 更「台灣」，最有用的不是單一工具，而是分層吸收：

1. `zhtw-mcp`：詞彙、標點、字形的工具層。適合補自動檢查，不解決敘事位置。
2. `speak-human-tw`：繁中去 AI 味與台灣用語的 agent skill。適合補「先標問題、再改稿」流程與電子報/社群場景。
3. `writing-skills.TW`：完整繁中寫作 skill 工具鏈。最值得借 `good-writing-tw` 的氣口、錯落、句尾規則，以及技術文件保守模式。
4. `shuorenhua-zh-tw`：繁中台灣出版場景版的「說人話」。適合借出版語體、保護片段、台灣化獨立軸與評測集概念。
5. `de-ai-flavor` gist：輕量但有價值，重點是個人風格錨、禁止 AI 捏造第一人稱經驗。

對 quidproquo 的判斷：

- 目前 `post-polish` 已經吸收部分概念，但偏向「研究感太重」的語域掃描。
- `check:tw` 解的是詞彙層；`post-polish` 解的是可讀性層。
- 真正缺的是第三層：**台灣讀者位置**。也就是每篇文章要回答「這件事跟台灣讀者、繁中 builder、台灣市場、台灣教育/工作現場有什麼關係」。
- 外部台灣 writing skills 多半也只能幫到前兩層；第三層需要本站自己的規則與範例。

## 覆蓋矩陣

母群定義：台灣／繁中使用者可直接拿來改善中文寫作、台灣用語或 AI 改稿流程的開源 skill / 工具 / gist。

| 類型 | 代表專案 | 強項 | 缺口 |
|---|---|---|---|
| CLI / MCP linter | `sysprog21/zhtw-mcp` | 教育部標點、國字標準字體、兩岸詞彙、CLI/MCP | 不補文章觀點或台灣讀者位置 |
| Agent skill / 去 AI 味 | `Raymondhou0917/speak-human-tw` | 35+ AI 痕跡、台灣用語、半形標點、annotation mode | 自述不是創作 skill，不會自動補作者觀點 |
| Skill 工具鏈 | `aeopress/writing-skills.TW` | humanizer-tw + good-writing-tw，節奏/氣口/技術文件保守模式 | 偏通用寫作，仍需站內領域規則 |
| 出版場景 humanizer | `tentenco/shuorenhua-zh-tw` | 七種出版語體、台灣化檢查、保護片段、評測集 | 可能偏出版/行銷，需調整到 tech/daily |
| 早期/上游台灣化 humanizer | `tentenco/Better-Humanizer-zh-TW` | 台灣出版業、語體預設、術語一致性 | 已部分併入 `shuorenhua-zh-tw`，可當設計來源 |
| 個人 gist / 寫作規則 | `de-ai-flavor` | 個人風格錨、禁止捏造經驗、17 個 AI 破綻 | 不是完整專案，缺工具化與評測 |
| 泛中文對照組 | `MrGeDiao/shuorenhua` | 工程紀律、保護片段、benchmark | 不是台灣主軸，只能借流程，不能借語感 |

偏誤：這輪偏 GitHub / agent skill 生態；沒有完整掃出版業內部編輯手冊、新聞媒體 stylebook 或付費課程。原因是使用者問的是「專案或 skill」，且 quidproquo 可直接吸收的是可執行或可版本化的規則。

## 個別來源

### 社群媒體上明確分享的案例

#### Hao0321 / claude-skill-social-post

Threads: https://www.threads.com/@hao0321_studio/post/DXi7IO8DuTb/
GitHub: https://github.com/Hao0321/claude-skill-social-post

定位：Hao 在 Threads 直接說自己寫了一個 skill，自動發文到 FB，並表示會開源。GitHub repo 則是完整的社群內容 skill：學本機聲線、規劃內容、草擬平台化貼文、經確認後發布到 FB / IG / Threads / X。

可借：

- 用作者既有貼文學「本機聲線」，而不是只靠通用語氣規則。
- 把內容工作分成 plan、learn voice、draft/publish、log outcome、optimize patterns 等 mode。
- 對社群貼文有平台差異規則，例如 Threads 不能直接套 FB 長文節奏。
- 把發文結果、復盤、修正寫成結構化資料，讓 skill 會隨實際表現修正。

對本站：

- 對 daily / 文章最值得借的不是自動發文，而是「voice sample + outcome log + 每兩週復盤」。
- 若要更台灣，應該收集本站自己表現好的台灣語氣文章，反向整理成 voice anchor，而不是直接套別人的社群公式。

#### Raymond Hou / speak-human-tw

Newsletter: https://raymondhouch.com/newsletter/184/
Blog: https://raymondhouch.com/lifehacker/digital-workflow/claude-code-skill/
GitHub: https://github.com/Raymondhou0917/speak-human-tw

定位：Raymond 在自己的內容渠道公開分享「說人話」skill，說明它原本是個人使用的繁中去 AI 味流程，後來整理開源。Blog 文也提到他有 `content-writing` 這類個人寫作 skill，但公開可驗證的主要是 `speak-human-tw`。

可借：

- 社群分享不是只丟 repo，而是搭配 before/after、使用邊界與安裝方式。
- 強調「校對不是創作」，避免 AI 自動補作者沒有寫的經驗。

對本站：

- 適合當 `post-polish` 的外部對照；但若要 quidproquo 自己的台灣聲音，還是要把站內文章當樣本。

#### cai.chengkai / kevintsai1202 Humanizer-zh-TW

Threads: https://www.threads.com/@cai.chengkai/post/DTtj0mPkhhT/

定位：Threads 上分享「看到去 AI 化 skill，順手改成繁體中文版」，並導向 `kevintsai1202/Humanizer-zh-TW`。這是社群上直接分享繁中 humanizer skill 的例子，但從搜尋結果看，偏「繁體中文版本」而非完整台灣語氣工程。

對本站：

- 可當作社群傳播案例，不宜作為主要語氣參考。本站需要的是台灣讀者位置與作者聲音，不只是繁中化。

#### 過勞熊 / humanizer-zh-tw 分享

Threads: https://www.threads.com/@tootiredbear/post/DVxIiwnkoQS/

定位：Threads 上分享降低 AI 味工具，列簡體版與繁體版 humanizer。屬於工具推薦，不是作者自己的深度寫作 skill。

對本站：

- 可作為「這類工具在台灣社群有被轉貼」的旁證，但實作參考價值低於 GitHub 原始 repo。

#### Oberon Lai / 技術部落格寫作 Skill

Blog: https://oberonlai.blog/2026-03-04-claude-code-skill-creator-blog-writing/

定位：不是社群短貼文，而是台灣作者公開記錄團隊如何打造「技術部落格寫作」skill。內容包含分析既有文章、參考 humanizer-tw、語氣校準表、AI 寫作問題分類、品質評分。

可借：

- 先分析自己的文章，再寫 skill。
- 技術部落格語氣要有「太正式 / 適當 / 太隨便」三欄校準。
- 去 AI 味和注入人味是兩件事。

對本站：

- 這篇很適合直接借方法論：先挑 3 篇 quidproquo 正樣本，做語氣校準表，再把規則補進 `post-polish`。

### zhtw-mcp

URL: https://github.com/sysprog21/zhtw-mcp

定位：Traditional Chinese zh-TW linguistic linter，支援 CLI 與 MCP。

可借：

- 以教育部《重訂標點符號手冊》、國字標準字體、OpenCC TWPhrases/TWVariants 做基礎。
- 把 zh-CN regional drift 當成 AI 輸出的結構性問題，而非偶發錯字。
- 區分 `base` / `strict` profile 與 `detect_ai` flag。

對本站：

- 適合做定期外部檢查或補 `check:tw` 詞表來源。
- 不適合單獨判斷「文章是否夠台灣」，因為它主要看詞彙/標點/字形。

### speak-human-tw

URL: https://github.com/Raymondhou0917/speak-human-tw

定位：繁體中文去 AI 味改寫 skill，給 Claude Code / Codex / Cursor 用。

可借：

- 先保事實，再去 AI 味，最後才加人味。
- 預設兩輪：先標問題，使用者確認後才改。
- 覆蓋電子報、社群貼文、銷售頁、客服回信、公告、Email。
- 明確說明它是校對，不是創作；作者的觀點與故事仍要作者自己補。

對本站：

- 適合借 annotation mode 與「去 AI 味不是補個人風格」這條邊界。
- 可補 daily：半形標點、公司名冒號條列、新聞稿腔、價值上升詞。

### writing-skills.TW

URL: https://github.com/aeopress/writing-skills.TW

定位：繁體中文（台灣）寫作工具鏈，包含 `humanizer-tw`、`good-writing-tw`、寓言式概念學習等。

可借：

- 三層流程：去 AI 味 → 琢磨節奏 → 概念生成。
- `good-writing-tw` 的可量測節奏規則：氣口 15-20 字、相鄰句長差 > 5 字、句尾類型不要連續單調。
- 技術文件保守模式：README、API 文件、CLI 說明只跑核心規則，不碰程式碼、URL、表格、英文術語。
- 文體感知：正式文體與部落格/社群不應同一套力度。

對本站：

- `post-polish` 可直接吸收「保守模式」與「氣口/錯落/句尾」作為人工審稿項。
- 對長篇課程導讀尤其有用，因為目前文章常合規但節奏像 technical memo。

### shuorenhua-zh-tw

URL: https://github.com/tentenco/shuorenhua-zh-tw

定位：繁體中文（臺灣）AI 味清理 skill；fork 自簡中 `shuorenhua`，合併 `Better-Humanizer-zh-TW`。

可借：

- 九步流程：判場景、劃保護片段、台灣化檢查、定力度、按模式改、保真回讀、Residual Audit、輸出評分、annotation mode。
- 台灣化檢查獨立成軸，而不是混在去 AI 味裡。
- 出版語體預設：學術、白皮書、雜誌、新聞、內刊、教科書、文學。
- 長文不縮水：整句空話列為「建議刪除」，讓作者拍板。

對本站：

- 可作為 `post-polish` v2 的主要設計參考。
- 但需要把出版語體改成本站語體：tech debug、AI deep-dive、course guide、daily brief、weekly analysis、project log。

### Better-Humanizer-zh-TW

URL: https://github.com/tentenco/Better-Humanizer-zh-TW

定位：台灣出版業專用 humanizer，後續能力被 `shuorenhua-zh-tw` 吸收。

可借：

- 七種出版語體與 60 分品質評分。
- 術語一致性鎖定。
- 台灣化與術語一致獨立計分。

對本站：

- 可借評分架構，但不要照搬出版業語體。
- 最有價值的是把「台灣化」變成明確評分維度。

### de-ai-flavor

URL: https://gist.github.com/pin0513/bf1cc5b99688cce016aa27a41ae56d7c

定位：Claude Code skill gist，整理中文去 AI 味規則。

可借：

- AI 不准替作者捏造第一人稱經驗、對話、日期、地點。
- 個人風格錨：慣用句長、口頭禪、論證方式、價值傾向、禁用詞、代表作。
- 每次手改 AI 稿時，把重複 pattern 回寫成 skill 規則。

對本站：

- 可補 `post` / `post-polish`：如果要讓文章更有「人味」，只能標註「需作者補充」，不能憑空編個台灣場景。
- 適合建立「quidproquo voice anchor」：用站內最像自己的 3-5 篇文章當風格樣本。

## 建議落地

### 1. 新增 `taiwan-reader-position` 檢查

放進 `post-polish` 或 `post-review`：

- 前三段有沒有說明：這篇對台灣讀者/繁中 builder 的用處？
- 如果是外國課程/工具，是否有一段把它翻成台灣讀者可用的問題？
- 是否只是把英文來源改成繁中，沒有在地判讀？

### 2. 把 daily 改成台灣科技電子報語氣

新增規則：

- 半形標點歸零，除程式碼/URL/英文原文外。
- 避免 `證據 A:` 這種 memo 標籤，改成自然段落。
- 每則用「發生什麼 → 為什麼重要 → 對台灣/繁中 builder 的影響」。
- tldr 不塞所有事件，只保留 2-3 個主訊號。

### 3. 建立本站自己的 voice anchor

候選正樣本：

- `src/content/posts/tech/2026-08-23-stock-agent-1-why-taiwan.md`：問題設定最台灣。
- 可再補 2-4 篇使用者認為「這就是我想要的語氣」的文章。

這比外部工具更重要。外部工具能清掉不像台灣的殘留，但不能替本站決定該站在哪裡說話。

## 來源

- `zhtw-mcp`: https://github.com/sysprog21/zhtw-mcp
- `speak-human-tw`: https://github.com/Raymondhou0917/speak-human-tw
- `writing-skills.TW`: https://github.com/aeopress/writing-skills.TW
- `shuorenhua-zh-tw`: https://github.com/tentenco/shuorenhua-zh-tw
- `Better-Humanizer-zh-TW`: https://github.com/tentenco/Better-Humanizer-zh-TW
- `de-ai-flavor`: https://gist.github.com/pin0513/bf1cc5b99688cce016aa27a41ae56d7c
