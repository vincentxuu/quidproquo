# 審稿紀錄：知識庫怎麼建 order 8〈寫給同事看：how-to 模板、決策紀錄，與寫少一點〉

- 審稿對象：`src/content/posts/learning/2026-10-22-team-docs-templates-adr.md`（zh）、`src/content/posts/learning/2026-10-22-team-docs-templates-adr-en.md`（en）
- 日期：2026-10-22
- 審稿員：獨立審稿（未參與寫作），一輪做完 post-verify／post-review／post-polish；未改文章
- 證據來源：`.work/research/building-knowledge-bases/extractions/` 的 google-docguide、diataxis-four-types、gao-2025-readme-install-template、nygard-2011-adr、adr-github-madr、ahmeti-2024-adr-action-research、buchgeher-2023-adr-github-msr、miccio-2026-adr-content-mining、nogueira-2026-adr-template-experiment、santana-2026-icsa-adr-oss；有疑義處回 scratchpad `fulltext/` 全文核對（o8-gao-2025-readme-install.txt、o8-adr-templates-2026.txt、o8-adr-textmining-2026.txt、diataxis.txt、o8-madr-adr-template-bare-minimal.md）。規則依 repo 版 `.agents/skills/post/references/writing-guide.md`（比 `~/.claude` 版多了台灣用語表、長文七條、參考資料必讀全文規則）。
- 行號：zh／en 在 ADR 範例（zh 147–171、en 147–173）之前一致；之後 en 比 zh 多 2 行。
- 機器檢查：`check-process-leak.mjs` 中英皆 0；`pnpm check:tw` 0 blocking／0 review；`register-scan.sh` 但書密度 14%（門檻內）、三段單段 ≥4 個數字（見 polish）、模板化轉折 0；`scan-ledger.sh` 0。內嵌 code fence 以 repo 的 `mdast-util-from-markdown@2.0.3` 解析：外層 `~~~markdown` 區塊 zh/en 皆為行 49–76 一整塊，內層 ``` 留在區塊內當文字；ADR 區塊 zh 147–171、en 147–173。渲染正確。

統計：🔴 3／🟡 12／🟢 8

---

## post-verify

### 🔴 V1　Nogueira 分數「一半看填寫時間」讀錯組成

- 位置：zh 138；en 138
- 原句：zh「但這個分數有一半看填寫時間，欄位少本來就寫得快」；en「but half of that score depended on completion time」
- 依據：nogueira-2026-adr-template-experiment.md 行 19（Overall = 0.15×結構理解＋0.50×效率與易用〔完成時間、查閱說明次數、自評客觀性〕＋0.35×採用潛力）；全文 o8-adr-templates-2026.txt 行 375–388（FS2 由 completion time、frequency of consulting supporting materials 與 Perceived Objectivity 合成）。0.50 是整個 FS2，不是單純時間。
- 改法：
  - zh：「但這個分數有一半看『效率與易用』，也就是填寫時間、查說明的次數和自評的客觀程度；欄位少，本來就占便宜」
  - en：「but half of that score came from "efficiency and usability" (completion time, how often participants consulted help, and self-rated objectivity), where fewer fields have a built-in advantage」

### 🔴 V2　Santana 只讀摘要卻列進參考資料，正文也留了查證過程

- 位置：zh 139、204；en 139、206
- 原句：zh「這篇我只讀到摘要。」＋參考資料 Santana 條；en「I read only the abstract of this one.」＋References 同條
- 依據：santana-2026-icsa-adr-oss.md 行 3（read_status=abstract）、行 48（只能用摘要句）、行 53–62（付費牆、無預印本）。repo 寫作指南〈參考資料規則（硬性）〉：「列進 `## 參考資料` 的每一條都必須完整讀過……沒有『這篇讀摘要就夠』這種例外」；〈查證過程不寫進正文〉：「我只讀到摘要」屬過程。兩條都違反。
- 改法：整條 Santana 子彈與參考資料刪除。它支撐的兩件事都有全文來源可以替代：「ADR 跟品質只有小相關」這點本篇不需要；「紀錄裡看不到討論」可改用 Buchgeher 全文轉述的實務報告（buchgeher-2023-adr-github-msr.md 行 46：willhaben 把討論放在 Slack，ADR「not a good discussion format」），但要寫成「Buchgeher 轉述的 willhaben 經驗」。
  - zh（可選替代句，接在 Nogueira 子彈後）：「**討論常不在 ADR 裡。** Buchgeher 等人轉述的一個業界經驗是，ADR 適合記結論，但不適合拿來討論，討論改在聊天室進行。」
  - en：「**The discussion often isn't in the ADR.** One industry report that Buchgeher and colleagues relay says ADRs suit recording the outcome but make a poor discussion format, so the discussion moved to chat.」
  - 若一定要保留 Santana：需先取得全文讀完；讀不到就不能列。

### 🔴 V3　Ahmeti 研究在本篇從未有行內連結

- 位置：zh 116（第一次提到）、130、143、184；en 116、130、143、186
- 原句：zh「order 6 提過的 Ahmeti 研究裡，團隊在導入 ADR 之前……」；en「In the Ahmeti study mentioned in order 6, …」
- 依據：任務規則「第一次提到來源要有行內連結」；repo 寫作指南〈Inline 連結規則〉「論文名稱第一次出現時就設為超連結」。參考資料有 DOI 10.1007/978-3-031-70797-1_22（ahmeti-2024-adr-action-research.md 行 10），正文沒連。
- 改法：
  - zh：「order 6 提過的 Ahmeti 等人 2024 年行動研究裡（[Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)），團隊在導入 ADR 之前……」
  - en：「In the 2024 action research study by Ahmeti and colleagues mentioned in order 6 ([Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)), …」

### 🟡 V4　Gao 的 PR 回應數少算了拒絕的 4 個

- 位置：zh 80；en 80
- 原句：zh「作者把改寫送成 30 個 PR，回應的 8 個專案裡有 2 個不滿意」；en「of the 8 projects that responded when the authors submitted the rewrites as 30 pull requests, 2 were unhappy」
- 依據：gao-2025-readme-install-template.md 行 38（8 個回應且接受 LLM 改寫：6 正面 2 負面；另 4 個拒絕 LLM 內容或質疑不請自來的 PR）；全文 o8-gao-2025-readme-install.txt 行 3602–3607。實際回應的是 12 個，「8 個」是願意看 LLM 內容的那群。現寫法讓負面比例看起來較低。
- 改法：
  - zh：「作者把改寫送成 30 個 PR，願意看 LLM 改寫的 8 個專案裡有 2 個不滿意，另有 4 個直接拒絕 LLM 產生的內容」
  - en：「of the 30 pull requests the authors submitted, 8 projects were willing to consider LLM-written changes and 2 of those were unhappy; another 4 refused LLM-generated content outright」
  - （與 P2 數字密度一起改時，可只留「30 個 PR 裡，滿意的只有 6 個」一個數字。）

### 🟡 V5　「最常被省略」比 Miccio 原文強

- 位置：zh 8（tldr）、137（子彈標題）；en 8、137
- 原句：zh「『考慮過的選項』那段最常被省略」「**最常被省略的是『考慮過的選項』。**」；en「the "options considered" section is the one most often left out」「**"Considered options" is the section most often left out.**」
- 依據：miccio-2026-adr-content-mining.md 行 29、45；全文 o8-adr-textmining-2026.txt 行 759–760：「The most problematic section was Considered Options……absent or misplaced in most ADRs」。原文是「問題最大」（缺、放錯、寫了沒發揮作用三者合計），各段落百分比在圖裡讀不到，不能排「最常省略」。Decision Drivers 也是「frequently misplaced」。
- 改法：
  - zh tldr：「『考慮過的選項』那段問題最多，常常沒寫或寫錯地方」；子彈標題：「**問題最多的是『考慮過的選項』。**」
  - en tldr：「the "considered options" section is the most problematic, often missing or misplaced」；子彈標題：「**"Considered options" is the most problematic section.**」

### 🟡 V6　Buchgeher「2023 年找出」容易被讀成 2023 年的專案

- 位置：zh 136；en 136
- 原句：zh「Buchgeher 等人 2023 年找出 GitHub 上 921 個用 ADR 的專案」；en「Buchgeher and colleagues found 921 GitHub projects using ADRs in 2023」
- 依據：buchgeher-2023-adr-github-msr.md 行 18（資料截至 2020 年底）。en 語序尤其會讀成「2023 年在用 ADR 的專案」。
- 改法：
  - zh：「Buchgeher 等人 2023 年發表的研究，找出到 2020 年底為止 GitHub 上用 ADR 的 921 個專案」
  - en：「In a 2023 study, Buchgeher and colleagues found 921 GitHub projects that had used ADRs by the end of 2020」

### 🟡 V7　「怎麼確認成功是最常被漏掉的一段」沒有來源

- 位置：zh 78；en 78
- 原句：zh「『怎麼確認成功』是最常被漏掉的一段。」；en「"How to confirm it worked" is the section most often left out.」
- 依據：gao-2025-readme-install-template.md 行 32 只把 Verification 列進模板；全文 grep "verif"（行 1488、2336）只看到「有些修改是補上驗證步驟」，沒有「最常漏掉」的計數。其他紀錄也沒有。屬作者判斷寫成事實。
- 改法（改成作者建議語氣）：
  - zh：「我覺得『怎麼確認成功』最容易被漏掉。少了它，……」
  - en：「In my experience, "How to confirm it worked" is the section people skip. Without it, …」

### 🟡 V8　「團隊最常寫、也最常寫壞的是 how-to」沒有來源

- 位置：zh 32；en 32
- 原句：zh「四種裡，團隊最常寫、也最常寫壞的是 how-to。」；en「Of the four, the one teams write most, and most often write badly, is the how-to guide.」
- 依據：diataxis-four-types.md 行 50（Diátaxis 說的是「the single most common conflation……is that between the tutorial and the how-to guide」）、行 84（how-to「likely to be the most-read」，沒有資料）。「最常寫、最常寫壞」兩者都不是來源的話。
- 改法：
  - zh：「Diátaxis 的作者說，軟體文件裡最常見的混淆，就是把教學和 how-to 寫在一起。」
  - en：「Diátaxis's author says the single most common mix-up in software documentation is between tutorials and how-to guides.」

### 🟡 V9　「團隊說」其實是作者的結論

- 位置：zh 184；en 186
- 原句：zh「Ahmeti 研究裡的團隊說，存放位置和清楚的指引，是 ADR 用不用得起來的關鍵。」；en「The teams in the Ahmeti study said the storage location and clear guidance were what made ADRs work.」
- 依據：ahmeti-2024-adr-action-research.md 行 47–48：「We have learned that the storage location……」「clear guidelines……are crucial」——是研究者的 lessons learned，不是受訪團隊的話。
- 改法：
  - zh：「Ahmeti 等人的結論是，存放位置和清楚的『該記什麼』指引，是 ADR 用不用得起來的關鍵。」
  - en：「Ahmeti and colleagues concluded that where ADRs are stored, and clear guidance on what to record, are what make them work.」

### 🟢 V10　Miccio 流程類例子「版本發布」不在原文

- 位置：zh 143；en 143
- 原句：zh「例如測試、審核流程、版本發布」；en「such as testing, review processes and releases」
- 依據：miccio-2026-adr-content-mining.md 行 24；全文行 736–737：「CI/CD, change logs, approval workflows, testing, and feature flags」。
- 改法：zh「例如 CI/CD、變更紀錄、審核流程、測試」；en「such as CI/CD, changelogs, approval workflows and testing」

### 🟢 V11　Nygard 標題範例不是名詞片語

- 位置：zh 120、148；en 120、148
- 原句：zh「例如『ADR 7：前端部署改用 GitHub Actions』」；en「"ADR 7: Frontend deployment moves to GitHub Actions"」
- 依據：nygard-2011-adr.md 行 33（Title 是 short noun phrase，例「ADR 1: Deployment on Ruby on Rails 3.0.10」）。範例是完整句。說「短的名詞片語，例如……」卻舉句子，自相矛盾。
- 改法：zh「ADR 7：前端部署改用 GitHub Actions」可改「ADR 7：以 GitHub Actions 部署前端」；en「ADR 7: Frontend deployment on GitHub Actions」。或把定義改成「短標題」。兩處（定義與範例）一起改。

### 已核對無誤（摘要）

Google docguide 引文與「Link to it instead」（google-docguide.md 行 28–29、38）；文件骨架（行 46–47）；Diátaxis how-to 定義（行 40）、how-to 可分支（diataxis.txt 行 730、806–808）；Gao 模板七段、20 份、30 人、8/10 面向、structure 最大、clarity/consistency 無差、只量閱讀感受、LLM 混淆（gao 行 19、32–35、48、53）；Nygard 兩條路、五欄、四種狀態、編號不重用、superseded 原句、一到兩頁、「conversation with a future developer」、範圍五類（nygard 行 24–39）；MADR `superseded by ADR-0123`、minimal 與 bare-minimal 都含 Considered Options（adr-github-madr 行 38–40；bare-minimal.md 原檔）；Ahmeti 加選項欄、C4 記憶依賴、架構師引文、三個月（ahmeti 行 17–19、30、44）；Buchgeher 超過一半 1–5 份、作者「likely」與沒調查原因（行 28–29、60）；Miccio 4,316、混淆說明、預印本（行 16、46、56）；Nogueira 33 名學生、Nygard 較高、P13/P32 質性引述（行 18、28、36）；DOI／arXiv ID 全部與紀錄一致；order 6／7 連結 slug 存在。

---

## post-review

### 🟡 R1　「how-to 和教學」一節的表格跟開頭例子對不上

- 位置：zh 30–41；en 30–41
- 原句：zh 41「開頭那份『一大段文字』的部署文件，問題就是把說明和操作混在一起。」；en 41 同義
- 問題：整節標題與表格比的是「教學 vs how-to」，結尾卻拿「說明 vs how-to」的例子收尾，讀者會以為表格就是在講這個問題。新手讀到這裡會卡：例子缺的是「說明」那一欄。
- 改法：表格加一欄「說明（explanation）」，或在第 41 行前加一句轉場。
  - zh：「how-to 也不放『為什麼』：那是說明類文件的事。開頭那份……」
  - en：「A how-to also leaves out the "why"; that belongs in an explanation document. The "single long paragraph" document from the opening…」

### 🟡 R2　建議「就停在這裡」，範例卻多了決策者和日期

- 位置：zh 141 vs 150–151；en 141 vs 150–151
- 原句：zh 141「用 Nygard 的五個欄位，加上一段『考慮過的選項』，就停在這裡。」；範例「**狀態**：已採用（2026-03-02）；取代 ADR 3」「**決策者**：前端小組」
- 依據：nygard-2011-adr.md 行 49（Nygard 沒有日期、決策者欄位）；adr-github-madr.md 行 36（date、decision-makers 是 MADR 的 metadata）。讀者照建議做會得到一份跟範例不同的模板。
- 改法（二選一）：
  - 範例拿掉「決策者」一行；或
  - 把建議改成 zh「用 Nygard 的五個欄位，加上一段『考慮過的選項』，頂多再補日期和決策者，就停在這裡。」en「use Nygard's five sections, add "considered options", at most add a date and the decision makers, and stop there.」

### 🟡 R3　限制重複說了兩次（限制不疊加）

- 位置：zh 80、137、139 與 177；en 80、137、139 與 179
- 原句：zh 177「模板的證據只有 Gao 一篇，而且是對外的 README 安裝說明……量到的也是閱讀感受而不是能不能照著做完。」——閱讀感受、LLM 改寫已在 80 行講過；Miccio「預印本」也已在 137 講過。
- 依據：repo 寫作指南長文第 6 條「但書換位置，不要堆疊」與任務規則「限制不疊加」。
- 改法：Gao 的限制只留一處。建議 80 行保留「LLM 改寫、只讀不做」，177 行只留新資訊「是對外 README，不是團隊內部文件」。
  - zh 177 改：「模板的證據只有 Gao 一篇，研究的是對外的 README 安裝說明，不是團隊內部文件。」
  - en 179 改：「The evidence on templates is a single paper, Gao's, and it studied external README installation instructions, not a team's internal docs.」

### 🟡 R4　「ADR 的實證研究幾乎都只看公開 GitHub」與本篇自己引的研究不符

- 位置：zh 177；en 179
- 原句：zh「ADR 的實證研究幾乎都只看公開的 GitHub 專案」；en「Almost all empirical ADR research looks only at public GitHub projects」
- 依據：本篇引的 ADR 實證研究五篇中，Ahmeti 是公司現場（ahmeti 行 18）、Nogueira 是學生實驗（nogueira 行 18），只有 Buchgeher、Miccio（、Santana）是 GitHub。
- 改法：
  - zh：「看大量 ADR 的研究都只看公開的 GitHub 專案，放在公司 wiki 裡的 ADR 看不到」
  - en：「The studies that look at ADRs at scale cover only public GitHub projects, so ADRs kept in company wikis are invisible to them」

### 🟢 R5　how-to 範例連到的 ADR 標題跟 ADR 範例不同

- 位置：zh 110 vs 148；en 110 vs 148
- 原句：zh「〈為什麼從 Jenkins 換到 GitHub Actions〉（決策紀錄）」；ADR「ADR 7：前端部署改用 GitHub Actions」
- 問題：兩個例子刻意串在一起，連結文字卻跟目標標題不同，讀者會以為是兩份文件。
- 改法：zh「〈ADR 7：前端部署改用 GitHub Actions〉」；en「"ADR 7: Frontend deployment moves to GitHub Actions"」（若照 V11 改標題就同步）。

### 🟢 R6　Nogueira 的專家評分翻轉沒提

- 位置：zh 138；en 138
- 依據：nogueira-2026-adr-template-experiment.md 行 25、53（第一階段專家評分 MADR 0.900 > Nygard 0.868，實驗才反過來）。不提不算錯，但「短模板寫得快」的結論會顯得比實際單面。
- 改法（可選，半句即可，不加數字）：zh「作者自己先評時 MADR 略勝，學生實驗才反過來」；en「in the authors' own initial assessment MADR came out slightly ahead; the student experiment reversed it」。

### 銜接與範圍卡（無問題）

- 與 order 6 銜接：order 6 行 67「決策紀錄……order 8 會談怎麼寫」、行 35 已連 Ahmeti；本篇第 19、116 行有接上（連結問題見 V3）。
- 與 order 7 銜接：order 7 行 19「頁面內文怎麼寫留給 order 8」、行 110「另寫一份決策紀錄（order 8 會談怎麼寫）」；本篇第 19 行接上。
- 範圍卡（series plan order 8）：講 Google 最小可用文件與不重複 ✓、Diátaxis 寫法差異（只做 tutorial vs how-to，見 R1）△、ADR 五欄與 superseded ✓、ECSA 2024 存放位置與指引 ✓（第 184 行，歸屬見 V9）、how-to 模板 ✓；不講誰維護 ✓（第 19、28 行交給 order 9）。讀完能寫兩份模板 ✓；例子兩份 ✓；自我檢查「ADR 被推翻時該刪嗎→不刪、標 superseded 並連新決定」✓，判準與第 128、173 行一致。
- 承諾兌現：導言「讀完你能替團隊寫出兩份模板」→ how-to 模板（49–76）與 ADR 範例（147–171）都給了 ✓。開頭三份部署文件的三種問題：沒先決條件（模板「開始之前」）、說明混操作（第 41 行）、三個月沒更新（交給 order 9）✓。
- ADR 例子與 how-to 例子自洽：Jenkins 太慢 ↔ 20 分鐘；部署約 5 分鐘兩處一致；secrets 在 GitHub 兩處一致；ADR 3 被取代與第 173 行一致 ✓（只差 R5 標題）。

---

## post-polish

### 🟡 P1　單段數字太多（每主張最多一個數字）

- 位置：zh 80、136、139；en 同行
- 原句：zh 80「用 ChatGPT 依這份模板改寫了 20 份 README，請 30 位 IT 從業者盲評。改寫後的版本在十個面向裡有八個……30 個 PR，回應的 8 個專案裡有 2 個」（register-scan：5 個）；136「921 個……超過一半只有 1 到 5 份」（5 個）
- 依據：repo 寫作指南長文第 4 條「正文每個主張最多一個數字……挑那個讀者會拿來做判斷的數字留下」。
- 改法：
  - zh 80：「Gao 等人用 ChatGPT 依模板改寫一批 README，請 IT 從業者盲評，十個面向裡有八個評分較高，進步最多的是結構……作者把改寫送成 PR 給各專案，願意看的專案裡有人不滿意……」（只留「十個面向裡有八個」）
  - en 80：「Gao and colleagues had ChatGPT rewrite a set of READMEs to the template and asked IT practitioners to rate them blind; the rewrites scored higher on eight of ten aspects…」
  - zh 136：「Buchgeher 等人找出的 921 個用 ADR 的 GitHub 專案裡，超過一半只寫了寥寥幾份」；en「Of the 921 GitHub projects using ADRs that Buchgeher and colleagues found, more than half had written only a handful」
  - 139 若照 V2 刪除即解決。

### 🟡 P2　tldr 開頭的「原則是寫少一點」與正文「重點不是越少越好」打架

- 位置：zh 8 vs 23；en 8 vs 23
- 原句：zh tldr「原則是寫少一點」；正文「重點是新鮮和正確，不是越少越好。」
- 依據：google-docguide.md 行 62（常見轉述誤為「越少越好」）。tldr 是讀者最可能只讀的一段，現寫法正好落入轉述誤區。
- 改法：zh tldr「原則是寧可少而新鮮：Google 的文件指南說……」；en「The principle is fewer but fresh: Google's documentation guide says…」

### 🟢 P3　英文模板與範例用了全形空格

- 位置：en 54、98
- 原句：「**Owner**: [name or role]　**Last confirmed**: [date]」（中間是 U+3000）
- 改法：en 版改成半形空格或「·」；或拆成兩行。zh 版保留全形無妨。

### 🟢 P4　「它適用的是 Google 內部……在一般團隊也一樣成立」是作者判斷寫成事實

- 位置：zh 28；en 28
- 改法：zh「它寫的是 Google 內部的工程文件，不過我覺得『寫少一點、別重複』搬到一般團隊也成立」；en「They're written for Google's internal engineering docs, but I think "write less, don't duplicate" carries over to ordinary teams」。

### 🟢 P5　zh「把 PR merge 到 main」中英夾雜

- 位置：zh 103（範例改寫後步驟）、90（改寫前，口語可保留）
- 改法：改寫後版本是示範「好的 how-to」，建議 zh「把 PR 合併到 `main`」。

### 🟢 P6　before/after 例子用 12 段引述區塊

- 位置：zh／en 88–110
- 依據：register-scan 第 3 項報 12（門檻 3）。這是例子內容不是引述，屬誤報，但可考慮改成 ` ```markdown ` 區塊或加框，讓讀者一眼看出「這是一份文件」而不是引文。可不改。

### 中英一致

除上述各條需同步改之外，中英段落、表格、清單、範例逐段對照一致；en 的 tldr、description 與 zh 對等；en 連結都指向 `-en` 版。台灣用語：`check:tw` 0 筆，人工掃過「支援、預設、專案、程式、品質、使用者」等皆為台灣用法，未見中國用語。翻譯腔四型逐句看過，未見明顯問題。

## 修正紀錄（2026-10-22）

- 採用：V1、V2（Santana 整條與參考資料刪除，改用 Buchgeher 轉述的業界經驗）、V3、V4（改寫成不帶數字的說法，同時處理 P1）、V5、V6、V7、V8、V9、V10、V11（標題改「以 GitHub Actions 部署前端」，定義與範例同步）、R1（轉場句）、R2（建議改為「頂多再補日期和決策者」）、R3、R4、R5、R6、P1、P2、P3、P4、P5。
- 不採用：P6（例子用引述區塊是刻意的，渲染正常）。
