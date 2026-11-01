# Review record — AI 通病總覽（order 0，中英）

- 日期：2026-10-28
- 檔案：
  - `src/content/posts/ai/2026-10-28-ai-common-failures-overview.md`（以下行號指中文版；英文版行號平行，同列）
  - `src/content/posts/ai/2026-10-28-ai-common-failures-overview-en.md`
- 規劃：`.work/series-plans/ai-common-failures.md` order 0 範圍卡
- 工具降級（toolDegradation）：Groundlane 只有 authenticate 入口、未授權；Jina search 額度用完。一手來源改用 `curl` 直抓 arXiv PDF（`pdftotext`）、PMC 全文 HTML、Oregon DOT 的 NISO PDF、Wikipedia `action=raw`，全部全文落地後逐段核對，沒有用搜尋摘要判 Confirmed。
- 未修改文章檔案。

## post-verify

### 結論

逐條抽出 24 條宣告。數字本身大多抄對，問題集中在**數字的框架**：把某一範圍的結果寫成更寬的結論。這正好是文章在講的第四個通病。🔴 Contradicted 2 條、🔵 Misframed 6 條、🟡 Unverifiable 1 條，其餘 Confirmed。

### 🔴 Contradicted

1. **「這也是四個通病裡唯一一個各家模型差異很大的」**（L69；EN L69 "This is also the failure where models differ most"）
   - 同一篇文章引的另外兩份研究都顯示模型差異很大：Zamaraeva 2026 Table 6–7，GPT-4o 與 Tülu 3 三個階段幾乎不用 `rather than`，GPT-5.6-sol、GPT-6-sol 每篇都用；Peng 2026 五個商用模型之間就差 2.5 到 9.2 倍。規劃表「排序原則」也寫明「Zamaraeva 的模型間差異也大」。
   - 建議改法：刪掉「唯一」這半句，改寫成「這一型各家差很多：同一份研究裡，Claude 2、3.5、3.7 的摘要跟原文沒有顯著差異，GPT-4o、LLaMA 3.3、DeepSeek 最嚴重」。
2. **「後來改成規定 tldr 要寫什麼…才寫出可用的版本」**（L81；EN L81 "What finally worked…"）
   - repo 現況打臉：`src/content/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points.md` 的 `tldr` 目前仍是表格第 3 版（「Cloudflare Agents 的四個起點不是四種功能，是四種『loop 歸誰跑』的安排…」）。讀者點進 L20 的連結，看到的正是文章說「被退」的那一版。
   - 建議改法：先把入口文的 tldr 換成可用版（post-review SKILL §4 已有範本：「已有 harness 用 PiHarness；做 chat 且要自己組 model call 用 AIChatAgent，交給框架用 Think；不是 chat 但要 state、排程、MCP 用 Agent」），再在本篇表格加第 4 列「可用版」。兩篇要一起發。

### 🔵 Misframed（數字對，推論或範圍錯）

3. **「Zamaraeva 等人觀察到，Claude Sonnet 5.5、Opus 5.5 和 GPT-6-sol 修訂自己的論文時，`rather than` 不一定變多，換成後置的『X, not Y』卻大幅增加。對比的功能還在，只是換了一種寫法。」**（L79；放在「只禁字通常不夠」節下）
   - 數字成立（Table 6–7：GPT-6-sol X, not Y 1.23→1.77、1.42→1.94；Sonnet 5.5 0.10→0.31；Opus 5.5 0.07→0.32；§5.1 "Revision by the same model does not raise the rate of rather than consistently"）。
   - 但 (a) 實驗沒有禁令：修訂是依 GPT-4o 審稿意見重寫，§4.2 明寫 "None of the prompts contains rather than or another antithesis construction"，放在「在 prompt 寫不要用…」之後會讓讀者以為這是禁令實驗；(b) 「換成」暗示逐句替換，原文 §5.1 說 "a form that replaces a removed rather than is the exception, not the rule (Appendix H)"；(c) 「禁字面會換形」在原文是 §6 的推測（"simply suppressing the phrase would likely shift the same function to another form"）。規劃表 order 7 也要求「句式層禁令導致換形沒有受控實驗，寫成跡象不寫成發現」。第 1 篇（`2026-10-28-ai-contrast-framing.md` L103）有寫「例外，不是常態」，總覽漏掉，系列前後不一致。
   - 建議改法：「沒有人做過『禁掉一個句型』的受控實驗，但有跡象。Zamaraeva 等人讓模型依審稿意見修訂自己寫的論文（prompt 裡沒提任何對比句型），Sonnet 5.5、Opus 5.5 和 GPT-6-sol 修訂後 `rather than` 沒有一致變多，後置的『X, not Y』卻多了兩到四倍。作者據此推測，只壓一個說法，同樣的功能會換一種形式出現。」
4. **tldr「四個都和訓練用的偏好資料有關，所以只在 prompt 裡禁字，常會換成另一種寫法」**（L8；EN L8）與 **L73「這四種寫法有一個共通點…在一對一的比較裡容易勝出」**
   - 偏好資料的直接證據只涵蓋否定式對比（Zamaraeva §5.4、Peng 獎勵模型）。意義抬高只有 Reinhart 的「指令微調後偏離人類」（Reinhart 自己說 "As the instruction tuning processes are not publicly documented, it is not possible to determine the cause more precisely"）；過度概括 Peters 沒有歸因到偏好資料；指示型摘要研究筆記明記「成因：無直接證據」。「所以禁字會換形」又疊上第 3 條的問題。
   - 建議改法：tldr 改成「否定式對比已有研究追到偏好資料與獎勵模型，其他三型的成因證據較弱」；L73 改成「否定式對比有直接證據：Zamaraeva 等人發現…；其他三型目前只有間接跡象，第 5 篇整理」。
5. **「Peters 與 Chin-Yee（2025）比較 10 個模型產生的 4,900 份科學摘要，LLM 摘要出現過度概括的機率約是人類專家摘要的 5 倍」**（L69）
   - 4,900 份、10 個模型、OR 4.85（95% CI 3.06–7.70）、"nearly five times more likely" 都對。但跟人類比的是另一個子分析：只用 GPT-4 Turbo（API／UI）、ChatGPT-4o、DeepSeek 摘要 100 篇全文，對照 NEJM Journal Watch（§2.3）。併成一句後，讀者會以為 10 個模型（包括下一句沒差異的 Claude）整體都是 5 倍。
   - 建議改法：「Peters 與 Chin-Yee（2025）測了 10 個模型、4,900 份科學摘要。拿其中 4 個模型（GPT-4 Turbo、ChatGPT-4o、DeepSeek）跟 NEJM Journal Watch 的專家摘要比，LLM 摘要出現過度概括的機率約是專家的 5 倍。」
6. **「其中 GPT-4o 在句尾掛現在分詞子句（"…, marking a pivotal moment"）的頻率是人類的 5.3 倍」**（L57）
   - 5.3 倍（d=1.38）對。但 Reinhart 算的是 Biber 的 present participial clauses，全部位置、全部用途都算；論文自己舉的例子是 "Bryan, leaning on his agility, dances around the ring"，跟評價無關。「句尾」與「意義抬高」是 Wikipedia 的解讀（Wikipedia 引 Reinhart 時寫 "often done by attaching a present participle phrase at the end of sentences"）。
   - 另外「比較指令微調前後的模型…其中 GPT-4o」：前後對照只做了 Llama 3（base vs instruct）；GPT-4o 沒有 base 版可比（原文 "While we do not have access to untuned versions of GPT"）。
   - 建議改法：「Reinhart 等人（2025）發現 Llama 3 指令微調後的寫作風格比 base 版離人類更遠；GPT-4o 用現在分詞子句的頻率是人類的 5.3 倍。這個數字涵蓋所有分詞子句，句尾掛評價的 ', marking…' 只是其中一種。」
7. **Russell 2025：「讓不常用 LLM 的人判斷…約有一半的人類文章被誤判成 AI」→「只靠肉眼判斷『像不像 AI』並不可靠」**（L85）
   - URL 正確：arXiv 2501.15654 = "People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text"（ACL 2025，arXiv comments 欄）。FPR 數字對（Table 1 51.7%、正文 52.5%）。
   - 框架問題：(a) 這組只有 4 人，定義是「完全不用 LLM，或只用在寫作以外」，不是「不常用 LLM」；(b) 論文主結論相反：常用 LLM 寫作的 5 位專家多數決 300 篇只錯 1 篇，FPR 4.0%。只引非專家那半，等於用論文支持它標題反對的結論。
   - 建議改法：「眼力因人而異：[Russell 等人（2025）](…)找 4 位不用 LLM 寫作的人判斷，約一半的人類文章被誤判成 AI；常用 LLM 寫作的 5 位專家多數決，300 篇只錯 1 篇。沒練過的人用『像不像 AI』當判準會冤枉一半的人類作者，所以本系列的判準一律是『這句缺了什麼資訊』。」
8. **「ANSI/NISO Z39.14 以資訊型為預設，並要求避免『This article evaluates…』這種開頭」**（L61）
   - 標準 §6 寫兩型依用途選擇：§6.1 實驗、調查類用資訊型；§6.2 社論、論述、書、名錄用指示型。沒有「預設」一詞；附錄 V 的 Example C（指示型範例）加註 "preparing an informative abstract when the document permits it"。§7.4 原文是 "avoid naming the type of document (e.g., 'This article evaluates,' …) **when this information may be inferred from the title, bibliographic reference, or the text of the full abstract**"，有條件，而且理由是重複，不是指示型。
   - 建議改法：「美國摘要標準 ANSI/NISO Z39.14 規定：報告實驗、調查結果的文件寫資訊型；指示型留給社論、書、名錄這類沒有單一結果可報的文件。標準也建議別用『This article evaluates…』開頭，因為從標題就看得出文件類型。」參考資料條目補版本：`ANSI/NISO Z39.14-1997 (R2009)`。

### 🟡 Unverifiable

9. **表格第 2 版 tldr 原文「Cloudflare 文件叫你從 Pi harness 開始，repo README 的第一個範例卻是 Agent。兩個都對，差別在 agent loop 歸誰跑…」**（L27）
   - 入口文不在 git 歷史裡（新加入暫存區，只有現版）；`.work/reviews/2026-10-28-cloudflare-agents-sdk-entry-points.md` 沒有記 tldr 版本；研究筆記 L123 只有改寫過的片段「文件叫你用 A，README 卻用 B，兩個都對」。需作者對照自己的對話紀錄確認。

### 🟢 Confirmed

| # | 宣告（行） | 一手來源與核對 |
|---|---|---|
| 10 | 版本 1 節錄（L26） | 與使用者提供的版本 1 原文後半逐字相符（「…同一個 SDK 有四個 loop 歸屬不同的起點。這篇用一張分層圖、四個條件和三個 delegation 機制，說明第一版該從哪裡開始。」）。註：版本 1 前半也有「官方文件叫你先用 Pi harness，README 卻是 Agent class」這個反差，表格把它歸到第 2 版的特徵，屬節錄取捨，不算失真 |
| 11 | 版本 3 節錄（L28） | 與入口文現行 tldr 前半逐字相符 |
| 12 | L20「我會怎麼選」轉述 | 對到入口文 L226–234；省略了第 1 題「能接受 experimental API」與第 5 題 plain `DurableObject`，節錄可接受 |
| 13 | Zamaraeva：`rather than` 2019→2026 約 7 倍（L49） | Abstract "Its rate in 2026 is seven times the 2019 rate"；§5.1；0.134→0.993／千字。小修：2019 是 ACL Anthology 論文、2026 是 ACL 風格 arXiv 論文，「統計 ACL 風格論文…從 2019 年到 2026 年」可接受 |
| 14 | Zamaraeva：偏好資料評分者和開源獎勵模型都偏好 `rather than`（L73） | Abstract "Raters of preference data and open reward models favor the construction"；§5.4 Table 24 |
| 15 | Zamaraeva 的推測：成對比較看得到單一回答的好處、看不到全文累積的代價，且是推測（L75） | Abstract "We conjecture… pairwise preferences, which credit a disavowal in a single response and cannot register its cost across a text"。「八次」是作者自己加的示意數字，原文沒有；第 1 篇也用了，建議改成「整篇反覆出現」或明寫是示意 |
| 16 | Peng：五個商用模型、2.5–9.2 倍（L49） | Abstract "Five commercial models use the construction 2.5 to 9.2 times as densely as a human reference" |
| 17 | Peng：「多半沒錯，一半以上可有可無」（L49） | 307 個用例：defective 1.30%、optional 52.8%（"correct but unneeded"）、substantive 45.9% |
| 18 | Wikipedia 引文逐字（L55）與「2024 年的條目修訂」（L53） | `action=raw` L45–46：September 2024 revision（Special:Diff/1252053288），句子逐字相同，原文其後接 `[...]`；所在節為 "Undue emphasis on significance, legacy, and broader trends" |
| 19 | Reinhart：5.3 倍（L57） | PMC11874169 Results："GPT-4o uses present participial clauses at 5.3 times the rate of humans (paired Cohen's d = 1.38)" |
| 20 | Reinhart：微調後離人類更遠（L57） | "instruction tuning appears to make the model output less human, not more: The Llama 3 base models use features at rates similar to human texts"（僅限 Llama 3，見第 6 條） |
| 21 | Peters：要求準確反而更糟（L69） | §2.2 "LLM summaries retrieved with the accuracy prompt were about twice as likely to contain generalized conclusions (OR = 1.90, 95% CI [1.11, 3.26])" |
| 22 | Peters：Claude 幾個版本無顯著差異（L69） | Results "both the older and most recent versions of Claude (i.e. 2, 3.5 and 3.7) did not significantly differ in generalizations from the abstracts"。建議寫出版本號，免得讀者以為涵蓋到現行 Claude |
| 23 | Russell URL 與 ACL 2025（L85、L121） | arXiv abs 頁標題與 comments "ACL 2025" |
| 24 | 參考資料 7 條外部連結可用 | `check:links` 7/7 OK |

### 必修／建議

| 級別 | 位置 | 問題 | 建議改法 | 修了什麼 |
|---|---|---|---|---|
| 必修 | L69 | 「唯一一個各家模型差異很大的」與 Zamaraeva、Peng 相反 | 見第 1 條 | |
| 必修 | L81＋入口文 tldr | 入口文 tldr 仍是第 3 版 | 見第 2 條 | |
| 必修 | L79 | 修訂實驗被寫成禁令證據，漏「替換是例外」 | 見第 3 條 | |
| 必修 | L8、L73 | 偏好資料成因與禁字換形擴到四型 | 見第 4 條 | |
| 必修 | L69 | 5 倍是 4 個模型對 NEJM JW 的子分析 | 見第 5 條 | |
| 必修 | L85 | Russell 只引非專家半邊 | 見第 7 條 | |
| 建議 | L57 | 5.3 倍不限句尾；GPT-4o 無前後對照 | 見第 6 條 | |
| 建議 | L61、L120 | NISO「預設」與 §7.4 條件 | 見第 8 條 | |
| 建議 | L27 | 第 2 版原文待作者確認 | 見第 9 條 | |
| 建議 | L75 | 「八次」非原文 | 改「整篇反覆出現」 | |

範圍聲明：本次只檢查了文中已提出的 24 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

### 機械檢查

- `pnpm verify`：4 項紅。本篇相關的只有 `check:series-plan`（缺本審稿紀錄，寫完本檔即解除；同一檢查也點名 `2026-10-28-ai-contrast-framing` 缺紀錄）。`check:references`、`check:tw`、`check:series-order` 的紅來自其他既有文章，本篇不在名單內。
- `check:post-quality`（兩檔）：無警告。tldr 沒有自指、否定式對比、意義抬高字樣。
- `check:tw`（中文版）：0 blocking、0 to review。
- `check:links`：7 個外部連結全部正常。
- 無 diagram 區塊，不需 `diagram-preview`。

### 結論

結構與規劃表 order 0 範圍卡對得上：定義、四型各一例、共同成因、禁字不夠、閱讀路線、四句 tldr 自我檢查都有，篇幅合理。主要問題有三個：(1) 文章本身在三處犯了過度概括（見 post-verify 第 1、4、5、7 條），在一篇教人抓過度概括的總覽裡，這是最傷可信度的地方；(2) 開場案例沒有收尾：讀者看到三個壞版本，卻看不到好版本，而入口文本身還掛著壞版本；(3) 規劃表要求的連結沒放。

### 用文章自己的四個通病檢查

| 通病 | 命中 | 判斷 |
|---|---|---|
| 否定式對比 | L32「不是 AI 獨有」、L63「不是永遠錯」、L75「是作者的推測，不是實驗結果」、L85「不是『這句像不像 AI』」 | 四處的 X 都是讀者可能真的相信的說法，照本系列判準可留。但一篇 120 行的總覽用了四次，再加上 L47、L99 的例句，讀者會注意到。建議 L75 改成正面句「這是作者的推測，還沒有實驗驗證」 |
| 意義抬高 | L85「用得好的時候很有力」 | 輕微，沒給具體資訊。建議換成第 1 篇的例子（如 Heritage & Greatbatch 的政治演說掌聲）或刪 |
| 指示型摘要 | 無。tldr 寫出了四型定義與修法；L81、L90 的「第 N 篇談…」是導覽，合理 | 通過 |
| 過度概括 | tldr（L8）、L69「唯一」、L69 Peters 5 倍、L73 共同成因、L79 換形、L85 Russell | **命中六處**，全部是把某個範圍的結果寫成更寬的通則。見 post-verify 第 1、3、4、5、7 條 |

### 🔴 必修

1. **tldr 放大正文、句數超標**（L8；EN L8）
   - 「四個都和訓練用的偏好資料有關，所以只在 prompt 裡禁字，常會換成另一種寫法」超出來源（post-verify 第 4 條）。
   - 三句話，writing-guide §tldr 規定 1–2 句。
   - 建議改法（中）：「LLM 寫作有四個常見通病：否定式對比（先駁倒沒人說過的 X）、意義抬高（把普通事實包成轉折）、指示型摘要（只說談什麼、不給結論）、過度概括（摘要丟掉條件與範圍）；前三個刪空話、直接寫答案，第四個拿原文逐句對。否定式對比已追到偏好資料，只禁字面時模型會改用別的對比句型。」英文同步。
2. **開場案例沒有給出好版本，且入口文仍掛壞版本**（L22–30、L81）
   - 表格只有三個失敗版本。讀者讀完最需要的是「可用版長什麼樣」，這正是本篇要教的事。
   - 建議改法：表格加第 4 列「可用版」，內容取自入口文「我會怎麼選」；入口文 tldr 同步換掉（post-verify 第 2 條）。
3. **L69 Peters 段三處過度概括、L85 Russell 只引一半、L79 修訂寫成禁令**：改法見 post-verify 第 1、3、5、7 條。
4. **規劃表要求的連結沒放**
   - order 0 範圍卡：「連結：成因 → order 5；訓練階段 → ai/2026-08-26-understanding-ai-models-training-stages」。L73「訓練 LLM 時，偏好資料是…」沒有連到訓練階段導讀。
   - 建議改法：L73 第一次出現「偏好資料」時連到 `/posts/ai/2026-08-26-understanding-ai-models-training-stages`（英文版連 `-en`）。
   - 第 1 篇已存在（`2026-10-28-ai-contrast-framing`），L38 表格「第 1 篇」與 L89 閱讀路線應連過去；其他篇尚未發布，維持純文字。

### 🟡 建議修

5. **L20 轉述簡化了選擇條件**：入口文第 1 題是「有想用的 harness，而且能接受它 experimental 的 API」，總覽寫成「已經有現成 harness 就用 `PiHarness`」。建議補「而且能接受 experimental API」，免得讀者照著選錯。
6. **L32 「差別在 LLM 寫得更頻繁」**：指示型摘要沒有 LLM 頻率研究（研究筆記：成因無直接證據、LLM 特有性要寫成沒有直接研究）。建議改成「否定式對比、意義抬高、過度概括都有研究量到 LLM 寫得比人頻繁；指示型摘要還沒有」，或縮成「LLM 常這樣寫」。
7. **L43「前兩個是句子層，後兩個是摘要層」**：很實用，但 tldr 與 description 都沒帶到；可放進 tldr 取代第三句。
8. **type**：本篇標 `guide`，第 1 篇標 `deep-dive`。總覽較像 `guide`，可留；只是 `guide` 預期結構（前置→步驟→預期輸出→常見錯誤）對不上，若站上總覽慣例是 `deep-dive` 可統一。
9. **L90 閱讀路線**：「先讀第 3 篇（指示型摘要最常出現在 tldr 和 PR 摘要）」——「最常出現」無來源。建議改成「本站最常退的是 tldr，第 3 篇就是在講這件事」。
10. **參考資料 NISO 條目**補版本 `Z39.14-1997 (R2009)`；Russell 條目寫的是論文標題，正文卻只引非專家結果，修第 7 條後自然一致。

### 🟢 可選

11. description（L9）以「用一則被退三次的 tldr」開頭，SEO 上可以；若想讓搜尋結果更直接，可改成「LLM 寫作四個通病怎麼認、怎麼修：否定式對比、意義抬高、指示型摘要、過度概括，附閱讀路線與自我檢查」。
12. tags `llm-writing`（站上 8 篇）、`llm`、`writing-process`（6 篇）與第 1 篇一致，數量 3 個在下限，可考慮補 `prompt-engineering` 一類讀者會搜的 tag（先查站上現有拼法）。

### 中英一致

- 結構、表格、自我檢查、參考資料逐段平行；行號一一對應。
- 上述必修項中英都有，要一起改。英文 L85 "annotators who rarely use LLMs" 同樣要改成 "four annotators who don't use LLMs for writing"。
- EN L109 答案 3 多了 "and a single result became a rule"，中文沒有；意思一致，可留。

## post-polish

### 結論

只標問題，不改稿。語域整體健康：段落短、但書密度 2%（1/34 段）、引述區塊 1 個、姓名當主詞 0、無台灣用語問題。需要處理的是數字密度與幾個長句，以及模板化轉折在一篇講否定式對比的文章裡的觀感。

### 掃描結果（`register-scan.sh`、`scan-ledger.sh`）

| 指標 | 結果 | 判斷 |
|---|---|---|
| 長句 >60 字 | 3 句（L20 72 字、L49 70 字、L57 77 字） | 未達密度閾值，但三句都在開場或證據段，建議斷 |
| 但書密度 | 2% | 綠 |
| 引述區塊 | 1 | 綠 |
| 單段 ≥4 數字 | 5 段（L49 7 個、L57、L69、L90、L100） | L49、L57、L69 該處理；L90（篇次編號）、L100（自我檢查題目）是誤判 |
| 姓名當主詞 | 0 | 綠 |
| 可執行動作 | 「怎麼做」段 0 | 見下 |
| 模板化轉折 | 3 處（L49、L79 是命中「不是」字串的引述／描述，L99 是自我檢查題） | 合計未超標；但正文另有 L32、L63、L75、L85 四處「不是…」骨架（掃描沒抓到「不是…是…」無「而」字型） |
| 一般英文術語 | 0 | 綠 |

### 必修／建議

| 級別 | 位置 | 問題 | 建議改法 | 修了什麼 |
|---|---|---|---|---|
| 建議 | L49 | 一段 7 個數字（2019、2026、7 倍、五個、2.5、9.2、一半） | 正文留「約 7 倍」「2.5 到 9.2 倍」兩個，年份與比例細節交給第 1 篇：「`rather than` 在 NLP 論文裡七年多了約 7 倍（Zamaraeva 等人，2026）；中文的『不是X，而是Y』，五個商用模型的密度是人類語料的 2.5 到 9.2 倍，多數用法沒錯，只是可有可無（Peng 等人，2026）。」 | |
| 建議 | L57 | 77 字長句＋4 個數字，同時塞進 Reinhart 的方法、結論和數字 | 依 post-verify 第 6 條拆成兩句：第一句講微調前後對照，第二句講 5.3 倍與它的範圍 | |
| 建議 | L69 | 三個主張擠一段（5 倍、準確 prompt、Claude 例外），每個都帶數字 | 拆成兩段：一段講 5 倍（帶子分析範圍），一段講「要求準確反而更糟」與模型差異 | |
| 建議 | L20 | 72 字長句把四種選擇塞在一句 | 用分號後改成短句，或直接做成 2×2 小表（是否 chat × 是否自己組 model call） | |
| 建議 | L32、L63、L75、L85 | 一篇教人少用否定式對比的總覽，正文用了四次「不是…是／而是…」骨架；讀者會拿文章的標準檢查文章本身 | L75 改「這是作者的推測，還沒有實驗驗證」；L85 改「本系列一律問『這句缺了什麼資訊』，不問『像不像 AI』」仍是對比，可改成「本系列的判準一律是：這句缺了什麼資訊」；L32、L63 的 X 是讀者真有的誤解，可留 | |
| 建議 | L89–92 閱讀路線、L94 自我檢查 | 可執行動作只有自我檢查一處；總覽承諾「讀完能在自己的草稿裡指出四種通病」，但沒給「今晚就能做」的一步 | 在自我檢查後加一句動作：「打開你最近一篇文章或 PR 的摘要，遮掉正文只看摘要：讀者能做決定嗎？不能，就回正文的決策段把結論搬上來。」（取自 writing-guide 的檢法） | |
| 可選 | L85 | 「用得好的時候很有力」空泛 | 換成具體例子或刪 | |

保護片段提醒：上列改寫建議都保留原數字（7 倍、2.5–9.2 倍、5.3 倍、4,900、4.85／約 5 倍）與 Wikipedia 引文，不動；改的是數字的範圍說明與句子切分。

## 修正紀錄（2026-10-28，主 session）

必修 6 項全部處理，中英同步：

1. 「唯一一個各家差異很大」：刪掉「唯一」，改寫成 Claude 2／3.5／3.7 無顯著差異、GPT-4o／LLaMA 3.3／DeepSeek 最嚴重。
2. 入口文 tldr 仍是第 3 版：本篇表格加第 4 列「改寫」，內容取自入口文「我會怎麼選」；L81 改成「才寫出上表最後一列」，不再宣稱入口文已換。**入口文本身沒改**：它屬於另一個 session 進行中的稿件，交使用者決定；兩篇要一起發。
3. 修訂實驗被寫成禁令證據：改成「沒有受控實驗，只有跡象」，寫明 prompt 沒提對比句型，並保留「替換是例外」。H2 改「只禁字面，未必擋得住習慣」。
4. 偏好資料成因與禁字換形擴到四型：tldr 與成因節都改成只有否定式對比有直接證據，其他三型只有間接跡象。
5. Peters 5 倍：寫明是 4 個模型對 NEJM Journal Watch 的子分析；拆成兩段。
6. Russell：兩邊都寫出（4 位不用 LLM 寫作者約一半誤判；5 位專家多數決 300 篇錯 1 篇）；成因節補訓練階段導讀連結，第 1 篇在對照表加連結。

建議項採納：Reinhart 5.3 倍寫明涵蓋所有分詞子句並改成 Llama 3 前後對照；NISO 改寫成依文件類型分、刪掉「預設」與 §7.4 那句，參考資料補版本；L20 改成三點清單並補「能接受 experimental API」；L32 改成三型有研究量到頻率；閱讀路線改「本站最常退的是 tldr」；「八次」改「反覆出現」；L75 改正面句；L85 刪「用得好的時候很有力」；自我檢查後補今晚可做的動作；L49 數字縮成兩個。另將「多了好幾倍」改「明顯增加」（GPT-6-sol 只約 1.4 倍）、「多數用法沒錯，只是可有可無」改「幾乎都沒用錯，但一半以上可有可無」。

未採納：第 2 版 tldr 原文「待確認」——原文見使用者貼上的對話紀錄，與表格節錄一致。
