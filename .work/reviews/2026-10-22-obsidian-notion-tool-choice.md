# 審稿紀錄：知識庫怎麼建 order 4〈工具落地：Obsidian、Notion 與換工具時資料帶不帶得走〉

- 中文：src/content/posts/learning/2026-10-22-obsidian-notion-tool-choice.md
- 英文：src/content/posts/learning/2026-10-22-obsidian-notion-tool-choice-en.md
- 審稿日：2026-10-22；獨立審稿員，沒參與寫作；沒改文章。
- 證據：extractions/ 的 kleppmann-2019-local-first、obsidian-official-docs、notion-export-import、notion-pages-databases、ango-2023-file-over-app、dix-2024-future-of-pim、omnivore-2024-shutdown、pocket-2025-shutdown；必要處回 scratchpad/fulltext/ 全文（localfirst.full.txt、obs-*.txt、notion-export/import.full.txt）。
- 工具：firecrawl 點數用完；exa web_fetch 抓 help.obsidian.md 全部逾時（該站是 Obsidian Publish 的 SPA，任何路徑都回 200，裸 curl 判不出網址真假），改用 Publish 的公開快取 JSON（publish-01.obsidian.md/cache/f786db9f…）核對 permalink。Groundlane 沒有使用。

嚴重度：🔴 必修／🟡 建議修／🟢 可選。

## post-verify

### 🔴 Contradicted／內部矛盾

1. **自我檢查判準把「官方沒寫」說成確定結果**（中 L120／英 L120）
   - 原句：「區塊連結、資料庫的 relation 和 rollup、callout 這類東西，匯出後不是變成純文字、就是變成 HTML，或者直接不見。」
   - 依據：同篇 L84、L92 寫「官方說明沒寫 relation、rollup……匯出後會變成什麼」「要自己試一次才知道」；notion-export-import 抽取「沒寫的事」一節確認匯出頁沒有提 relation／rollup。只有 callout→HTML 有官方依據；區塊連結匯出後檔案裡仍留 `^id` 與 `[[…#^id]]` 字樣（只是連結失效），也不是「不見」。
   - 改法：「callout 會變成 HTML；區塊連結留在檔案裡，但在別的工具點不開；relation、rollup 匯出後變成什麼，官方沒寫，要自己匯出一次才知道。」英文同步。

2. **Omnivore／Pocket 的匯出期限與 order 1 不一致**（中 L17／英 L17）
   - 原句：「使用者只有一到四個月可以把資料匯出來」。
   - 依據：omnivore-2024-shutdown：10/29 宣布，匯出延到 11/30，約一個月。pocket-2025-shutdown：5/22 宣布，匯出到 11/12 才關閉，約五個半月；從 7/8 服務關閉算起是 127 天，約四個月。order 1（L70）寫的是「Omnivore 約一個月；Pocket 5 月宣布、匯出 11 月關閉」，起算點是宣布日，所以 Pocket 是將近半年，不是四個月。
   - 改法：「從宣布到關閉匯出，Omnivore 約一個月，Pocket 不到半年。」或直接跟 order 1 一樣寫月份。

### 🔵 Misframed（來源對，用法偏了）

3. **把 Kleppmann 給開發者的建議寫成「給一般使用者的建議」**（中 L49／英 L49）
   - 原句：「這篇對一般使用者最實用的建議只有一句：軟體要能輕易匯出成 JSON、PDF 這類扁平的標準格式。」
   - 依據：localfirst.full.txt 行 772–781，這句在「Then some strategies for improving each area」底下的 Longevity 項，原文是 "Make sure your software can easily export…"，對象是寫軟體的人；Fast／Offline 等同一串建議都是開發做法，例如 Service Workers、OT。
   - 改法：「作者給開發者的長久性建議是：軟體要能輕易匯出成 JSON、PDF 這類扁平的標準格式。換到使用者這邊，這就是選工具時要檢查的第一件事。」這樣也接得回第一節的判準。

4. **「判準主要根據官方說明」跟實際來源不符**（中 L107／英 L107）
   - 原句：「上面的判準和建議，主要根據的是工具的官方說明」。
   - 依據：五個判準（格式、連結、搜尋、同步、離線）在官方說明裡找不到；其中離線、多裝置、長久三條對得上 local-first 七個理想，連結和搜尋是作者自己加的。只有 Obsidian／Notion 的功能描述和實作步驟出自官方說明。
   - 改法：「五個判準是我從 local-first 的七個理想裡挑出跟個人筆記有關的，再加上連結和搜尋；兩個工具的行為則出自官方說明，說明會隨版本改……」寫成作者主張，全篇只講這一次。

5. **Ango 原句的對象是 Obsidian，正文擴大成「某個 app」**（中 L72／英 L72）
   - 原句（中）：「以為某個 app 能永遠存在是一種錯覺」；（英）"it's a delusion to think any app will last forever"。
   - 依據：fileoverapp 行 31："These days I write using an app I help make called Obsidian, but it's a delusion to think it will last forever."，it 指的是 Obsidian。
   - 改法：中「他也寫，以為 Obsidian 會永遠存在是一種錯覺，能留下來的是他寫的純文字檔」；英 "…it's a delusion to think Obsidian will last forever; what's designed to last is the plain-text files."

### 🟡 Unverifiable／超出來源

6. **「網路上說『這篇認定 Obsidian 是 local-first』是錯的轉述」**（中 L47／英 L47）
   - 依據：抽取紀錄的「常見轉述」沒有附任何出處；本次也沒有找到具體的網路說法可以引用。另外，讀者沒看過那個說法，這句是在更正編輯過程中的假想錯誤。
   - 改法：刪掉這句，前一句「表裡沒有評任何筆記軟體，Obsidian 2019 年還沒推出」已經足夠，可以接「把筆記工具套進這七條，是你自己的判斷」。

7. **properties 連結被歸到「官方說明自己點出」**（中 L64–68／英 L64–68）
   - 原句：導言「官方說明自己點出了幾種專屬語法」，第三點「properties 裡的連結……在其他工具裡只是一串文字」。
   - 依據：obs-properties 只說屬性裡的連結必須加引號（行 154–161），沒說這是 Obsidian 專屬，也沒說在其他工具會變成什麼；抽取表這一格是「—」。第三點是作者推論。
   - 改法：把第三點移到列表後面，寫成一句主張：「同理，properties 裡加了引號的 `"[[某則筆記]]"`，在別的工具裡只是 YAML 字串。」導言保持只涵蓋前兩點。

8. **「官方說明直接建議把 Wikilink 關掉」語氣比原文強**（中 L60）
   - 依據：obs-internal-links 行 35："If interoperability is important to you, you can disable Wikilinks"，原文是 can，不是 recommend。英文版 "you can turn off" 是對的。
   - 改法：「官方說明寫，如果在意和其他工具互通，可以把 Wikilink 關掉……」

9. **改名自動更新沒講適用範圍**（中 L60、L99／英同）
   - 依據：obs-internal-links 行 15–17 只講「在 Obsidian 裡改名」。抽取紀錄也提醒，用 Finder 或其他編輯器改名不會更新連結（文件沒寫，屬推論）。「預設開啟」是從 "If you want to be prompted instead, you can disable it" 推出來的，可以接受。
   - 改法：「在 Obsidian 裡改檔名時，預設會自動更新……」

10. **Notion CSV 匯入限制少寫了 relation**（中 L84／英 L84）
    - 依據：notion-import.full.txt 行 1025–1029：新的 CSV 匯入不能建立 rollup、formula，也不能建立 relation（只有加進既有資料庫時，才能把欄位對應到既有的 relation）。例子剛好用 relation，所以這點讀者用得到。
    - 改法：「用 CSV 匯入時不能建立 relation、rollup 和 formula，要匯入後在 Notion 裡重建」。

11. **反向連結「不寫進檔案」的出處放錯頁**（中 L62／英 L62）
    - 依據：Backlinks 頁沒有講儲存方式；有依據的是 How Obsidian stores data 的 Metadata cache 一節（obs-stores-data 行 48–54），但那節點名的是 Graph view、Outline view，沒有點名 backlinks。這句是合理推論。
    - 改法：保留，但把連結改到 data-storage；或縮成「反向連結是 Obsidian 即時算出來的，檔案裡不會多一份清單」，寫成作者主張。

12. **「常被引用」**（中 L72／英 "widely cited"）
    - 依據：沒有來源。
    - 改法：刪掉「常被引用」，直接寫「Steph Ango 有一篇〈File over app〉」。

13. **「第一條最常被忽略」**（中 L33／英 L33）
    - 依據：沒有研究或調查支持「最常」。後半句的理由（格式問題要到換工具時才會發現）本身就成立。
    - 改法：「第一條最難事後補救：其他四條用起來就知道好不好……」

14. **找不到研究的範圍**（中 L107／英 L107）
    - 依據：dix-2024 抽取的搜尋紀錄：exa 搜了四次，找的是訪談或問卷型的實證研究。正文只寫了年份和主題，沒寫研究類型；但查證過程本身（工具、次數）不該進正文。
    - 改法：「我找不到 2020 到 2026 年間以換筆記軟體為主題的訪談或問卷研究」，補研究類型就好，不寫工具和次數。另外可以加半句：最接近的實證是 2008 年 Jones 等人研究人為什麼放棄資訊管理方法（時間範圍外，抽取紀錄只看過搜尋摘要，引用前要精讀）。

### 🟢 Confirmed

- 七個理想的名稱與順序：Fast、Multi-device、Offline、Collaboration、Longevity、Privacy、User control（localfirst 行 236–242），中英轉述都忠於章節標題。「隱私：預設就安全」對應 "Security and privacy by default"，可以接受。
- 評比表範圍：有 Files+email、Google Docs、Trello、Pinterest、Dropbox、Git+GitHub，加上開發者基礎設施表；沒有筆記軟體（筆記類只有 Evernote 出現在衝突處理的反例，不在表內）✓。「很多工具能滿足其中幾條，但沒有一個全部做到」出自行 227 ✓；「Git 最接近」出自行 379（原文有 perhaps）✓；「作者自己打的分數，不是量測」出自行 225，只有符號定義 ✓。「沒列 Pinterest」不算錯，因為用了「等」。
- local-first 定義（行 111）✓；開頭引句（行 21）✓；備份、勒索軟體的責任（行 215）✓；Obsidian 2019 年還沒推出（Dix 2024 Table 1，首站 2020-04-10）✓。
- Obsidian 五個 permalink：/data-storage、/links、/plugins/backlinks、/properties、/obsidian-flavored-markdown，在 Obsidian Publish 線上快取 JSON 裡都對到正確頁面（How Obsidian stores data、Internal links、Backlinks、Properties、Obsidian Flavored Markdown）✓。注意：裸 curl 任何路徑都回 200，不能拿 HTTP 狀態當證據。
- vault 是本機 Markdown 資料夾、可用其他編輯器改、會自動刷新、可以用 Sync／Dropbox／iCloud／Git 同步 ✓（obs-stores-data 行 10–14）。
- 兩種連結格式、預設 Wikilink（因為精簡）✓；設定路徑「Files and links → Use [[Wikilinks]]」與「Automatically update internal links」✓（obs-internal-links 行 15–17、行 37–40）；英文 Markdown 連結用 %20 符合 URL encode 規定 ✓。
- Backlinks 是核心外掛，有 Linked／Unlinked mentions ✓；properties 存成 YAML ✓。
- 專屬語法：區塊連結的英文原句逐字正確（行 146–147）✓；internal links、comments、highlights「may show them as plain text」✓（obs-flavored-md 行 43）；`[[2023-01-01#^37066d]]` 是官方原例 ✓。正文沒有把 callout、嵌入說成官方點名的專屬語法，這點做得對。
- Notion 匯出：Markdown／CSV＋每筆一個 Markdown ✓（行 304）；只能匯出目前或預設檢視 ✓（行 460）；callout→HTML ✓；沒權限的頁面不匯出 ✓（行 398，脈絡是整個 workspace 匯出）；Enterprise 可關閉匯出 ✓（行 442，原文是 workspace／teamspace owner，「管理者」可以接受）；"You can't instantly recreate…" 逐字正確 ✓；匯入不支援非標準 Markdown 擴充 ✓；「Wikilink、區塊連結大概帶不過去」有「大概」，屬合理推論 ✓。
- Notion 用頁面＋資料庫、多種檢視 ✓（notion-pages-databases）。
- Ango 是 Obsidian CEO、file over app 的定義（行 13）✓。
- Dix 2024：觀點文章、作者自承不是系統性研究（行 71）✓；切換成本有學習、workaround、匯出匯入 ✓（行 282–284）；廠商傾向把客戶留在自家平台 ✓（行 214）。
- 外部連結：pnpm check:links 10 條沒有壞連結；doi.org/10.1080/07370024.2024.2356155 回 403（出版社擋機器人），抽取時已經用 exa 讀過全文。
- 歸因標籤：全篇「官方說」「官方說明……」這類歸因約 8 處。大部分是功能描述必要的，但第 4、6、7、8 條改完後會少 2–3 處，不必再加。

範圍聲明：本次只檢查了文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

### 機械檢查

- `pnpm check:links`：通過（1 條 403 要人工確認，見上）。
- `pnpm check:tw`：0 blocking、0 to review。
- `pnpm verify`：紅，4 項失敗，都不是這兩篇造成的。check:references 與 check:post-quality 的唯一 ERROR 都是 tech 文章連到不存在的 `2026-10-22-ai-model-family-decision-models-en`；check:lang-parity 是同一篇缺英文版；check:series-plan 是 order 5（weekly-review-summarize-ai）沒有審稿紀錄。這兩篇沒有 ERROR，也沒有 WARN。全站仍是紅的，修好前不能 commit。
- 沒有 diagram 區塊，不需跑 diagram-preview。

### 🔴 必修

1. **自我檢查的判準和正文矛盾**：同 post-verify 第 1 條。理解檢查的答案本身錯了，讀者會帶走錯誤的判斷。

### 🟡 建議修

2. **規劃表承諾的「各自匯出結果」沒有兌現**（「例子」一節，L86–94）
   - 範圍卡寫「例子：同一組筆記在 Obsidian 與 Notion 的樣子，以及各自匯出結果」。正文只寫了兩邊的想像樣子，Notion 那半是「relation 匯出後變成什麼，官方沒寫，要自己試一次才知道」，讀者拿不到結果。
   - 改法（需作者補）：用 order 3 的兩則筆記加 MOC，在 Notion 實際建一次、匯出一次，把 zip 的檔案樹和 CSV 裡 relation 欄位的實際樣子貼成 `text` 區塊，Obsidian 那邊配一個 vault 檔案樹，兩邊並排。這樣例子就成了「預期結果」，正文 L84 和自我檢查也能從「官方沒寫」改成「我實測是……（日期、版本）」。如果不實測，就把範圍卡的這句改掉，正文留現狀。

3. **實作第 1 步的 Johnny.Decimal 結構和 order 2 不一致**（中 L98／英 L98）
   - 原句：「`00-09 系統` 底下的 `00.01 收件匣`」。order 2 的樹（L94–96）是 `00-09 系統 → 00 系統 → 00.01 收件匣`，中間還有一層 category `00`。照這篇建資料夾會少一層，ID 和 category 對不上。
   - 改法：「用 Johnny.Decimal 就建 `00-09 系統/00 系統/00.01 收件匣`，再照你的 area 和 category 開資料夾。」

4. **實作第 3 步的對應關係錯位**（中 L100／英 L100）
   - 原句：「加一個 `用途` 或 `狀態` 欄位，對應 order 1 的『一句話』和 order 2 的『標籤只標狀態』。」
   - 問題：order 1 的「一句話」是用自己的話寫的那句，應該寫在內文；`用途` 對應的是 order 1 的第一步「說得出用途嗎」。order 2 說狀態用「標籤」標，這裡改成 property 欄位，沒有交代為什麼換。
   - 改法：「加一個 `用途` 欄位，對應 order 1 第一步的用途；狀態照 order 2 用標籤標（`#待讀`），或者用一個 `狀態` property，兩種擇一，不要兩種都用。」英文同步（"order 1's one sentence" 改成 "order 1's first question, the use"）。

5. **「今晚可以做的事」第 1、2 步缺失敗判準**（L111–112）
   - 第 2 步叫讀者「看看哪些變成亂碼、哪些連結斷了」，但沒說看到什麼算有問題、下一步做什麼。
   - 改法：補一句「如果超過一成的連結打不開，或資料庫只剩一個檢視的欄位，就把這些列進第 3 步的清單」，或者指回第 3 步。

6. **local-first 一節和選型判準之間沒有接上**（L35–49 與 L21–33）
   - 七個理想列完後沒有回到「所以五個判準是從這裡來的」，讀者看不出兩節的關係。改 post-verify 第 3、4 條時順便接上就好，不必新增段落。

### 🟢 可選

7. **圖表**：「例子」一節做成兩欄 `text` 檔案樹（Obsidian vault 和 Notion 匯出 zip 並排），比文字更快懂。跟第 2 條一起做。
8. **主題歸屬**：站上有 `ai/2026-04-03-llm-knowledge-vault`（Obsidian vault 搭 LLM）。這篇沒有越界；規劃表把它安排在 order 5 連結，這篇不必加。
9. **tags**：`knowledge-base, knowledge-management, note-taking` 跟系列其他篇一致。`obsidian`、`notion`、`local-first` 是新 tag，站上只有這兩篇用。可以考慮把 `local-first` 換成系列其他篇用的 `personal-information-management`，或兩個都留（總數 7 個，仍在範圍內）。
10. **台灣讀者位置**：全球工具題目，不必硬塞台灣案例。如果作者有在台灣團隊或學校用 Notion／Obsidian 的經驗（例如公司禁用雲端筆記），可以補一句；需作者補，不替作者發明。

### 逐項看過，沒有問題的

- frontmatter：必填齊全，type: guide 跟內容相符，tags 6 個，description 和 tldr 不重複。
- tldr 衍生內容：五件事、Obsidian 區塊連結、Notion 匯出三項限制都跟正文一致，強度沒有放大。
- 結構：guide 的前置（判準）→ 步驟（實作）→ 預期結果與檢查（今晚、自我檢查）齊全；開頭第二段有交代讀完能做什麼，也說了不比較外掛，符合範圍卡。
- 範圍卡「講」的項目逐項找過，都有：選型判準、vault、兩種連結、改名更新、反向連結、properties、block reference、Notion 匯出（Markdown＋CSV、callout→HTML、沒權限的頁面）、七個理想。
- 文體比例：Obsidian 一節約 24%、Notion 約 13%、local-first 約 12%，介紹類占多數，跟 guide 的承諾一致。
- 跨節指代：「下面五件事」「上面的判準」都指得到。
- inline 來源：數據、引語、公司行為都有就地連結。
- 中英：段落、清單項目數、連結一一對應，語意一致（差異見 post-polish 第 4 條）。

## post-polish

掃描結果（register-scan）：長句 4 句（8%，綠）、但書段落 8%、引述區塊 0、單段 4 個以上數字 1 段（L107，年份居多，可以接受）、姓名當主詞 0、模板化轉折 0、一般英文術語 0；phrase ledger 沒有命中。整體語域健康，以下是人工讀出來的。

### 🟡 建議修

1. **L107 一句 78 字，塞了三件事**
   - 原句：「比較接近的是 Alan Dix 2024 年的一篇觀點文章，他提到換系統的成本不只是匯出匯入，還有學新工具、放棄已經摸熟的變通做法，而廠商也常傾向讓使用者留在自家平台裡（Dix 2024）。」
   - 改法：拆成兩句。「比較接近的是 Alan Dix 2024 年的一篇觀點文章。他說換系統的成本不只是匯出匯入，還有重新學一套工具、放棄已經摸熟的變通做法；廠商也常想把使用者留在自家平台（Dix 2024）。」

2. **L99 實作第 2 步 64 字，條件和兩個動作擠在一起**
   - 改法：「打開設定的 Files and links。如果你在意以後換工具，關掉 Use [[Wikilinks]]，改用 Markdown 連結；再確認 Automatically update internal links 是開的。」設定名稱照官方 UI 逐字寫（現在中文版寫「把 Wikilink 關掉」，讀者在設定頁找不到對應的字）。

3. **「工具落地」當標題開頭不夠白話**（中 title）
   - 「落地」是簡報和職場用語，單獨念不出這篇在回答什麼。英文 "Choosing a Tool" 反而比較清楚，兩邊也不對稱。
   - 改法：「選筆記工具：Obsidian、Notion，與換工具時資料帶不帶得走」，或者沿用規劃表標題但把「落地」換掉。改標題要同步規劃表。

4. **英文版的幾處自然度**
   - L84 "In other words, moving from Obsidian to Notion, wikilinks and block references probably won't survive." 是懸垂修飾，改成 "So if you move from Obsidian to Notion, your wikilinks and block references probably won't survive."
   - L100 "matching order 1's one sentence" 讀不懂，照 post-review 第 4 條改。
   - L74 標題 "databases are great, and exports cost you"：and 接不起對比，改成 "great databases, costly exports" 或 "databases are great, exports are where you pay"。
   - L17 "Note tools are no different" 可以接受；全篇 "note tool" 和 "note-taking app" 混用，選一個（建議 note-taking app）。

### 🟢 可選

5. **L47「要注意兩件事。第一……第二……」**：刪掉 post-verify 第 6 條那句以後，這段只剩兩點，直接寫「這張表是作者自己打的分數，不是量測；表裡也沒有任何筆記軟體」，不必用「第一、第二」。
6. **L53「依 Obsidian 官方說明（2026 年 10 月）」和 L76「依 Notion 官方的匯出說明（2026 年 10 月）」**：日期是讀者用得到的限制，可以留；但 L107 又說了一次「官方說明會隨版本改變」，三處擇二即可。
7. **L90 的例子**：「`[[自己放的檔案靠位置找，email 靠捲動和搜尋]]`」是 order 3 的原標題，保留。這段讀起來順，不必改。

### 保護片段核對

數字、英文原句引文（三句）、連結、設定名稱、order 3 的筆記標題，上面的建議都沒有動到。作者立場句（「換工具之前，先匯出一次」）也保留原強度。

### 中英一致

段落、清單、表格逐段對過，意思一致。兩個版本的事實問題相同（post-verify 第 1–14 條都要兩邊一起改）；只有中文才有的是 post-verify 第 8 條「直接建議」。

## 修正紀錄（2026-10-22，寫作者依本審稿與 2026-10-22-editor-pass-order4-5.md 修改，中英同步）

- 必修：自我檢查改為依官方說明分開寫（區塊連結留在檔案但點不開、callout 變 HTML、relation／rollup 官方未寫要自己試）；匯出期限改為「從宣布到不能匯出：Omnivore 約一個月、Pocket 約半年」。
- 建議：local-first 壓成一段並說明五個判準哪幾條對應七個理想、哪兩條是作者加的；刪掉「網路上說」一句；開發者建議不再寫成給使用者；「主要根據官方說明」改成只指兩個工具的行為描述；Ango 改「以為 Obsidian 會永遠存在」；properties 連結改「同理」；Wikilink 改「可以」關掉；改名自動更新限定在 Obsidian 內；CSV 匯入補 relation；Johnny.Decimal 補 `00 系統` 層；用途 property 對應 order 1 第一步、狀態用標籤對應 order 2；找不到研究補類型；刪「常被引用」「最常被忽略」；今晚第 2 步補三個檢查點；標題改白話；tags 加 personal-information-management。
- 編輯審稿：新增 Obsidian／Notion 逐條比較表；同步依官方說明分平台（iOS 建議只有 Obsidian Sync、iCloud，Git 要手動），新增 obsidian-sync-import-bases.md 抽取紀錄；新增「要不要換，怎麼換」（Importer：API 匯入保留資料庫轉 Bases、zip 匯入建議 HTML）；補 Bases、%20、永久筆記與 MOC 位置、備份步驟、非管理員匯出限制。
- 未採納：實際匯出 Notion 貼出結果（無工作區，已改規劃表範圍卡）；Apple Notes／Logseq／Google Docs 小表（未讀官方說明，不寫）。
