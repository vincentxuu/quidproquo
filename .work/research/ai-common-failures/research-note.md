# 研究筆記：AI 通病（ai-common-failures）

步驟零（series-curriculum-design）研究，**不含篇目規劃**。流程：research-selection（母群→覆蓋矩陣→偏誤）→ deep-research（掃描、選讀、精讀分開）。研究日期 2026-10-28。
來源登錄：同目錄 `sources.jsonl`（一行一個來源；讀取程度以它為準，本筆記與它一致）。

- **slug**：`ai-common-failures`。本站系列 slug 是小寫英文連字號（見 `src/utils/series.ts`，如 `ai-security`、`building-knowledge-bases`），符合慣例。暫定名「AI 寫作的空話」改成「AI 通病」後，slug 從 `ai-writing-filler` 改成這個；若之後把非寫作通病（諂媚、宣稱完成）排除在外，`ai-writing-failures` 會更準，到時再定。
- **工具降級（toolDegradation）**：Groundlane 只有 authenticate 入口、未授權，照 fallback 鏈改用 Exa、Tavily、Jina、firecrawl、`curl r.jina.ai`、Wayback、`gh api`、arXiv HTML／PDF 直抓。Jina search_arxiv 研究中途額度用完。
- **分工**：主線（成因、否定式對比、過度概括、Wikipedia 清單、站內盤點）自己讀；三個子題派 agent（中文 AI 腔、防護工程、摘要＋反證），各自的抽取紀錄存在同目錄 `extractions/`（`zh-ai-speak.md`、`guards.md`、`summary-and-counterevidence.md`），重點已併入本筆記。抽查：從子 agent 紀錄挑 8 個數字回原文核對（Peng 2026「2.5 to 9.2」與人類 0.942、Antislop「drops by 73%」、FABLES 38.5%、Liang 61.22%、Graphite「Corrective framing」與 12x、R15「about 4%」、Peng 獎勵模型 73.1–78.3%），全部對得上。

## 讀取程度標記

| 標記 | 意思 | 能怎麼用 |
|---|---|---|
| ✅ 讀過 | 整份正文進到輸出，或全文落地後逐節讀過方法、結果、限制 | 可引；論文數字要連同對照條件 |
| 🟡 部分 | 讀了指定的節，或只讀摘要 | 只能引已讀段落；動筆前補讀 |
| 🔎 片段 | 只看過搜尋片段 | 不引，只當線索 |
| ⚪ | fallback 鏈試完，確認無公開資料 | 寫進限制 |
| ✉️ | 只能寫信或借閱 | 寫出該問誰 |

**狀態**：sources.jsonl 共 71 筆（與第九節來源表逐列對應；子 agent 讀過但未進表的次要來源見 `extractions/`）。論文類大多是「全文落地、讀了方法／結果／限制」，標 🟡；整份讀完的論文只有 Reinhart 2025、Peters & Chin-Yee 2025、Antislop v2、Jang 2022、Rana 2026、Peng 2026、Geng & Trotta 2025（ACL Findings）。**每篇動筆前仍要依 deep-research §2.5 做該篇的精讀抽取紀錄**；本筆記是系列層的掃描與選讀結果。

---

## 一、站內盤點

掃法：`src/content/posts/*/*.md` 2,396 篇中文非 daily 文章的標題，grep「寫作／摘要／tldr／AI 腔／slop／空話／諂媚／sycophan／unslop／Signs of AI／BLUF」，再讀命中檔的 frontmatter；另查 `src/utils/series.ts`、`.claude/skills/`、`scripts/`。

### 會重疊或可連結的文章與系列

| 項目 | 關係 | 處理建議 |
|---|---|---|
| `ai/2026-05-10-llm-writing-pipeline-learnings`（別人怎麼用 LLM 寫文章：11 個 pipeline） | 寫作流程防護的前作，談 pipeline 層級，沒談句型通病 | 防護篇連過去，不重講 pipeline |
| `learning/2026-10-14-site-case-agents`（本站的寫作與審查管線：AI 協作個案研究，屬「教學文章怎麼寫」系列） | 本站審稿管線的個案 | 防護篇以它為本站案例的前情，只補 tldr 規則與 linter 這段 |
| 系列 `articles-that-teach`（教學文章怎麼寫，learning） | 從寫的人一側談文章組織；`teaching-text-questions-feedback` 有「寫作規格」 | 不重疊（它談教學法，本系列談 LLM 句型），互相連結 |
| `tech/2026-08-21-zh-tw-terminology-linters-tested`（實測五個繁中用語檢查工具） | 「linter 精確率」的本站實測先例（zhtw-mcp 精確率 29.4%） | 防護篇引用，作為「規則式檢查器誤報」的本站證據 |
| `daily/2026-10-18-tool-aislopmeter`（AI Slop Meter 工具推薦） | 偵測工具，偏網站版型 | 防護篇可提一句 |
| `ai/2026-08-26-understanding-ai-models-training-stages`（預訓練、SFT、RLHF） | 成因篇的前置知識 | 成因篇連過去，不重講 RLHF |
| `ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization`、`ai/2026-09-29-cme295-preference-tuning`、`ai/2026-09-30-cs2881r-lecture-11-emotional-reliance`（含諂媚） | 偏好學習與諂媚的課程導讀 | 成因篇與非寫作候選的連結 |
| `ai/2026-10-16-pstack-cursor-agent-skills-guide` | 提到 `/unslop` skill | 防護篇可提 |

**沒有找到**：任何以 LLM 寫作句型、tldr 寫法或 AI 腔為主題的既有文章或系列。缺口確認存在。

### 站內已有的防護（系列本身的案例材料）

- `.claude/skills/post/references/writing-guide.md` §「tldr / description 原則」（2026-10-28 補）：要求資訊型摘要、BLUF，禁自指與否定式對比，並記了一筆踩坑：Cloudflare Agents SDK 入口文 tldr 連退三輪，三版分別是指示型、鉤子、否定式對比。
- `scripts/check-post-quality.mjs` 的 `TLDR_FILLER_PATTERNS`（warn 級）：「自指／指示型」`/本篇|這篇|本文|整理了|帶你/`、「否定式對比」`/不是…而?是|不只…(更|還)/`。
- `.claude/skills/post-polish/SKILL.md` 的「模板化轉折」條與 `.claude/skills/writing-phrase-ledger/`（ledger 51 行）。
- **觀察**：規則早就寫在 post-polish 裡，但 tldr 仍大量出現同類句型；檢查器 2026-10-28 才補上。這本身是「規則寫了但沒進到產出點」的案例。

### 本站 tldr 的計數（重算，定義與使用者給的數字不同）

使用者給的分母是 1,388 篇；我用「中文、有 tldr、非 `-en.md`」重算是 3,153 篇（含 daily）或 2,377 篇（不含 daily），數字對不上，推測原計數有其他篩選條件，動筆前要問清楚或固定一個定義。不含 daily 的 regex 命中：自指 237、否定對比 144、「真正／關鍵在／重點是」100、「整理／介紹／帶你／說明」176。**regex 精確率未量**：抽樣看到合理用法，例如 `drone-airframe-configurations` 的「VTOL 的代價不是轉換時燒掉的能量…」是帶數字的實質對比。要當文章數字用，得先人工標一批樣本算精確率。

---

## 二、母群、掃描、覆蓋矩陣、偏誤（research-selection）

### 母群定義

**AI 通病**＝LLM 產出的文字中，(a) 有人公開點名為 AI 特徵，或有研究量到相對人類過度使用，且 (b) 會讓讀者拿不到資訊或被誤導的寫作型態（句型、詞彙、篇章結構、摘要方式）。
不算：純排版或格式（Markdown、emoji、標題大小寫，只當旁證）；事實錯誤與幻覺本身（另一個主題）；程式碼風格。非寫作的行為通病（諂媚、宣稱完成）只列候選。

### 掃描方法

1. 分類目錄：Wikipedia:Signs of AI writing（2026-10 版 wikitext 全讀）＋其 References；tropes.fyi directory；Pangram〈9 Signs〉；Graphite〈AI Tells〉；vale-ai-tells 規則表。
2. 學術：Reinhart 2025 的引用與被引；Kobak、Juzek、Geng & Trotta、Russell、Shaib、Antislop 的 related work；以句型名（negative parallelism、antithesis、rather than、tricolon、generalization bias、indicative summary）限定 2024 年後重搜。
3. 中文：知乎、虎嗅、果殼、CCL、arXiv 中文研究（用簡繁兩種關鍵字：AI味、AI腔、不是而是、套路）。
4. 媒體語料分析：Washington Post 2025-11、Barron's 2026-04、Atlantic 2026-07、Economist 2026-07、Pew 2026-08、Graphite 2026-09。
5. 反證：每個子題加 criticism／replication／does not／false positive／人類也 重搜一輪。

### 掃到的通病候選（完整清單，19 個）

指示型摘要；自指（「本篇」）；拿鉤子當重點；否定式對比（not X but Y／X, not Y／rather than）；加強型對比（not just X but Y）；意義抬高（serves as／testament／標誌著）；空泛分析（-ing 分詞尾巴）；模糊歸因（experts argue）；模糊關聯（associated with）；過度概括丟限定條件；三連排比；AI 詞彙（delve 類）；公式化結尾（In summary／挑戰與展望）；同義詞輪替（elegant variation）；避用 is／are；em dash；Markdown／粗體／條列；諂媚語氣（great question）；宣稱完成（false success）。

### 覆蓋矩陣

維度判準：沿這個維度的不同值，會不會讓讀者得出不同的修法。

| 維度 | 值 | 選入的通病 | 缺口 |
|---|---|---|---|
| 層級 | 詞彙 | AI 詞彙、意義抬高詞 | — |
| 層級 | 句型 | 否定式對比、三連排比、分詞尾巴 | — |
| 層級 | 篇章／摘要 | 指示型摘要、鉤子當重點、公式化結尾 | 公式化結尾只有 Wikipedia 的觀察 |
| 層級 | 語意（內容失真） | 過度概括丟限定條件、模糊歸因 | 模糊歸因無量化研究 |
| 證據 | 有對照的實證 | 否定式對比、過度概括、AI 詞彙、三連排比（語料統計） | — |
| 證據 | 只有清單與觀察 | 指示型摘要（LLM 部分）、鉤子、意義抬高（中文） | 見各卡 |
| 語言 | 英文 | 幾乎全部 | — |
| 語言 | 中文 | 否定式對比（Peng 2026）、並列成分（朱君輝 2023） | 意義抬高、自指、結尾無中文統計（⚪） |
| 生命週期 | 已退燒 | delve、em dash（2025 起被壓） | — |
| 生命週期 | 新冒出 | rather than／X, not Y、less X more Y | — |
| 防護 | 有效 | Antislop sampler、前沿模型的明確禁令 | 只在創作文體量過 |
| 防護 | 失敗／副作用 | token ban 品質崩、替代句式、linter 誤報 | 句式層級替代無受控實驗（⚪） |

### 偏誤

1. **英語偏誤**：實證幾乎都是英文。中文只有 Peng 2026（否定式對比）與 CCL 的整體特徵研究。中文「意義抬高」「自指」「空泛結尾」沒有語料統計，文章要寫明「這部分只有觀察」。
2. **文體偏誤**：證據集中在學術論文（Kobak、Geng、Zamaraeva）、創作（Antislop、EQ-Bench）、百科（Wikipedia），部落格 tldr 這種文體沒有直接研究。
3. **模型時間差**：多數研究用 2024–2025 年的模型（GPT-4o、Llama 3）。2026 年的研究（Zamaraeva、Graphite、Economist）顯示 tell 換得很快，舊數字不能當現況。
4. **商業利益**：Pangram、Graphite、vale-ai-tells、tropes.fyi 都是賣偵測或改寫服務的人做的，方法多半不公開。
5. **倖存者偏誤**：被點名的通病是讀者已經會認的；讀者還沒察覺的新型態（例如 Claude 的 less X more Y）必然被低估。

---

## 三、通病卡

每張卡：定義／一手證據（標實證或作者主張）／真實案例／成因／修法／反證／是否夠獨立成篇。

### 1. 指示型摘要（含自指「本篇／這篇／本文」）

- **定義**：摘要只說文章談什麼（「這篇用一張圖、四個條件說明…」），不給結論。標準用語：indicative vs informative abstract。
- **一手證據**
  - 定義與規範（標準，非實證）：ANSI/NISO Z39.14-1997 (R2009) §6–7 ✅🟡：informative 是預設；§7.4「avoid naming the type of document (e.g., 'This article evaluates,' … 'This study presents')」。ISO 214:1976 §2 🟡：「as informative as is permitted」，註 3 說指示型「less expensive to prepare」，經濟考量「should not be confused with true standards」。
  - 讀者效果（實證）：**沒有找到直接比較兩型對讀者決策的受控實驗（⚪）**。相鄰：Hartley 2004 回顧結構式摘要較有資訊、較好讀，但資訊量和長度混在一起；Tombros & Sanderson 1998 篩選任務中，摘要有用正是因為它是指示型（反證，見下）。
  - LLM 是否特別愛寫指示型（實證）：**沒有直接研究（⚪）**。最接近的：FABLES 2024（書籍摘要）Vague/Generic 評語比例 GPT-3.5 38.5%、Mixtral 38.5%、Claude-3-Opus 0%；Belém 2024 多文件摘要的「pedantic」錯誤類（正確但沒新資訊，含 opening remarks、takeaway）；Cao 2024 財報摘要 GPT-3.5 平均 0.46 個數字、Claude 11.09。三者都顯示**弱模型**才明顯。
- **真實案例**：本站 tldr（使用者提供）「這篇用一張圖、四個條件說明…」；本站 writing-guide 記的 Cloudflare Agents SDK 連退三輪；NISO 附錄 II 範例 B（Leira 1994）是人類寫的教科書級指示型摘要。
- **成因**：無直接證據。可引的間接證據：Reinhart 2025 指出指令微調後的風格偏離體裁慣例；BiomedTLDR（Lyu & Ke 2025）發現**人類**寫的 TLDR 也以「This study…」開頭。推論：自指開場是人類舊習，模型學到了；這是推論，不是發現。
- **修法**：NISO §7.4；BLUF（AR 25-50 §1-36／1-38：主要論點放開頭，memorandum 是目的句之後馬上接結論）；量法用 QuestEval 的 recall 端或 SUMMAC Q&A：只看摘要能不能回答原文的關鍵問題（QAGS 只量忠實，空泛但正確的摘要會拿高分）。本站檢法「遮掉正文只看 tldr，能不能說出結論」就是 Q&A 測法的簡化版。
- **反證**：指示型有正當用途（NISO §6.2 社論、書、長篇回顧；Tombros 1998 篩選任務）。Louis & Nenkova 2011：太具體的摘要內容分數反而低，一般句是必要的。所以通病要界定成「文本有結論、讀者要的是結論，卻只給指示」。
- **獨立成篇**：✅ 可以。證據是「標準＋相鄰實證＋本站案例」，LLM 特有性要誠實寫成「沒有直接研究」。**自指併入這篇**，不另開（證據只有 NISO §7.4 與 Pangram 的 "AI-style headers" 2×）。

### 2. 拿鉤子當重點

- **定義**：開頭放懸念、衝突或反差（「文件叫你用 A，README 卻用 B，兩個都對」），結論延後或沒寫。
- **一手證據**：**沒有 LLM 相關研究（⚪）**。規範層有 AR 25-50（BLUF）、NN/g inverted pyramid（Schade 2018，✅，作者主張，五項好處沒引研究）。NN/g〈How Little Do Users Read?〉（Nielsen 2008，✅）的 20–28% 是由 25 人瀏覽器日誌**推算的上限**，不是眼動量測；F-pattern（Pernice 2017，✅）只在三條件同時成立時出現。歸納 vs 演繹結構實驗（JBTC 2020，🔎）顯示西方讀者兩種結構評分相同、回憶不受影響，中國讀者偏好歸納式。
- **成因**：無證據。可能和「鉤子在偏好資料裡得分高」有關，但沒人量過（推論）。
- **反證**：BLUF 的證據比名聲薄；鉤子在部落格開頭本來是正當寫法，問題只出在摘要欄位。
- **獨立成篇**：❌ 證據太薄。**併入第 1 篇**，當作「指示型摘要的變體：答案被延後」，用 BLUF 一起處理。

### 3. 否定式對比（不是 X 而是 Y／X, not Y／rather than）

- **定義**：先否定一個沒人主張的說法，再給出「正解」。分三型（Zamaraeva 2026 Table 5）：替換（rather than、instead of）、否定（not X but Y、X, not Y）、加強（not only X but also Y）。中文對應「不是…而是…」「不只…更…」。
- **一手證據（本系列證據最強的一張卡）**
  - **Zamaraeva et al. 2026**（arXiv 2610.10092，預印本，🟡 讀約六成：摘要、§4.5–4.6、§5.1–5.4、§7、Limitations 開頭）：rather than 在 arXiv 2026 論文是 ACL 2019 的約 7 倍（0.993 vs 0.134／千字）；GPT-5.6-sol、GPT-6-sol 每篇都用。兩位盲評標註者覺得 2019 用例幾乎都不煩人（1.6%、0%），2026 用例約一成煩人（11.5%、8.3%）；但兩人對「哪幾句」意見分歧（κ 0.18）。煩人用例的特徵：把被否定的選項講得更差、更常是稻草人。
  - 成因（同篇 §5.4）：四份公開偏好資料裡 rather than 被選中的勝算比 0.99–1.37（人類評分的兩份最高）；四個開源獎勵模型都偏好帶 rather than 子句的句子，換成等長的非對比子句仍輸；UltraFeedback 隨機指派「honesty」system prompt 會讓 rather than（OR 1.15）、not X but Y（OR 1.34）變多。Tülu 3 8B 的 SFT／DPO／final 三階段都很少用，所以作者把來源放在商業模型的偏好資料與目標，而非 post-training 本身。
  - **Peng et al. 2026**（arXiv 2610.22249，中文，✅，子 agent 讀）：五個商用模型「不是X，而是Y」密度是人類參考語料的 2.5–9.2 倍（人類 0.942／萬漢字，DeepSeek 8.68）；307 個模型用例中 45.9% 實質、52.8% 可選、1.3% 有缺陷；三個獎勵模型 73.1–78.3% 偏好原句序。限制：人類語料回答不同題目；人類用例的標註未經審核；作者說不能拿來判個別文本。
  - **Pangram〈9 Signs〉**（✅，廠商自家語料，方法未公開）："Not just X but Y" 人類 1、AI 3／萬詞＝3×。**這是加強型，不是替換型**。
  - **Antislop 2025**（✅）：部分模型 "It's not X, it's Y" 是人類的 6.3 倍；sampler 可壓到 0。
  - 語料趨勢（媒體自做）：Washington Post 2025-11（328,744 則 GPT-4o 訊息；6% 的數字只見於二手轉述，互動頁抓不到，🟡）；Barron's 2026-04（市值百億美元以上美國公司文件，"not just a" 四字內接 "it's a"，2023 年 49 份→2025 年 208 份，計文件數，不是 AI 對人類）；Pew 2026-08（🔎，Common Crawl 每萬字 0.87→2.36）；Graphite 2026-09（🟡，GPT-6 Astra 的 corrective framing 是人類 12 倍；Claude 的 "less X, more Y" 是 82 倍）。
- **Pangram「三倍」追查結論**：原始出處是 Pangram 官網〈9 Signs of AI Writing, Backed by Data〉，英文、"not just/not only X but (also) Y"、每萬詞 1 對 3；頁面中繼資料標 2025-03-27，但內文提到 Gemini 3 Pro，Wayback 最早快照 2026-09-22，初版日期 ✉️（問 info@pangram.com）。最早二手引用是 The Atlantic 2026-07-12（Oremus，引 founding engineer Elyas Masrour，用 "estimate"）。中文轉述：果殼／虎嗅、知乎郝澤良轉對；**知乎孫學瑛（2026-07-29）與 Podwise 摘要轉錯成「不是A而是B」**；虎嗅與知乎也把 Barron's 的英文企業文件統計說成「不是而是」。Pangram 中文頁自己的翻譯就混了兩型。
- **真實案例**：本站「四個起點不是四種功能，是四種 loop 歸屬的安排」；Wikipedia 收的 Kusama 自畫像條目（"not a mirror but a portal"）；虎嗅數字生命卡茲克引的 B 站解說文案。
- **修法**：Zamaraeva 的判準可直接用：問「被否定的 X 有沒有人真的這樣主張」，沒有就刪掉 X，直接寫 Y。post-polish 已有「能具體化就具體化」。**不要只禁字面**（見反證）。
- **反證**：(1) 人類修辭利器：Heritage & Greatbatch 1986 英國黨代會 476 篇演講，contrast 佔集體掌聲 33.2%（經 Bull 2016 轉述，🟡）；高考議論文教材把「不是……而是……」列為經典句式。(2) 人類基準不是零：Peng 的人類 0.942／萬漢字；黑暗執行緒 22 年部落格約 0.42／萬字。(3) Peng：「Suppressing the form would remove its appropriate uses along with the rest」；Pangram CEO：「no smoking gun」。(4) **禁字面會換形**：Zamaraeva 的 GPT-6-sol 修訂稿 rather than 變少、X, not Y 變多；Claude Sonnet／Opus 5.5 修訂時也加 X, not Y。作者原句：「simply suppressing the phrase would likely shift the same function to another form」。這是修訂（revision）造成的換形，不是禁令實驗，但方向一致。
- **獨立成篇**：✅ 最強。可以是系列入口或第一篇。中英文都有實證、有成因實驗、有反證。

### 4. 意義抬高與空泛分析（含 AI 詞彙）

- **定義**：把普通事實包裝成「標誌著、深遠意義、扮演關鍵角色、反映更廣泛的趨勢」；或在句尾掛分詞片語做空泛評論（", highlighting its importance"）。中文：「賦能、不可或缺、具有重要意義」。
- **一手證據**
  - **Reinhart et al. 2025 PNAS**（✅）：GPT-4o 用現在分詞子句是人類的 5.3 倍（d=1.38）、名詞化 2.1 倍；指令微調版偏離人類比 base 版大，作者據此推論差異來自指令微調。詞彙 tapestry 出現在 23% 的 GPT-4o 輸出；作者詮釋這類詞「may signal a preference for grandiose, if hollow, summative sentences」（作者詮釋）。
  - **Kobak et al. 2025 Science Advances**（🟡，子 agent 讀 arXiv v5）：2024 年 PubMed 摘要至少 13.5% 經 LLM 處理；超額詞 454 個，66% 動詞。
  - **Juzek & Ward 2025**（arXiv 2508.01930，✅ 讀方法、結果、討論、限制、結論）：Llama Instruct 相對 Base 多用 nuanced（+8342%）等；文獻點名的 32 個 AI 詞有 28 個在清單上；400 名 Prolific 受試者（九成非洲）選擇時偏好「LHF 詞」多的版本，52.4% 對 47.6%（p<0.01），效果小但顯著。限制：只有 Llama、英文、模擬 LHF 情境。
  - Wikipedia:Signs of AI writing（✅，社群觀察，非實證）：「Undue emphasis on significance」「Superficial analyses」兩節，含年代詞表（GPT-4：delve、tapestry；GPT-5：emphasizing、highlighting；GPT-6：leverage、quietly）。導言的解釋（迴歸平均：具體事實被換成泛用正面描述）屬作者主張。
  - 中文：**沒有語料統計（⚪）**。只有實作者清單（知乎郝澤良：「綜上所述、賦能、抓手、閉環」）。
- **反證**：詞彙會退燒（delve 2024 年中後回落，Yakura 2024／2026、Geng & Trotta 2025）；人類也在吸收這些詞（Yakura：podcast 口語的 delve 一度比對照高 44%）；Russell 2025：非專家看到「華麗詞」就判 AI，偽陽性約 52%。Wikipedia「Ineffective indicators」明說華麗、學術腔本身不是訊號。
- **獨立成篇**：✅ 可以，但要以「意義抬高」這個**動作**為主，詞表只當例子（詞表會過期）。中文部分只能寫觀察。

### 5. 過度概括、丟掉限定條件

- **定義**：摘要把「在 X 條件下、與 Y 相比、有關聯」改寫成泛稱、現在式、建議句。
- **一手證據**：**Peters & Chin-Yee 2025 Royal Society Open Science**（✅ PMC 全文：摘要、結果、討論、建議、限制、結論；方法讀概要）。10 個模型、4,900 份摘要。人寫的 NEJM Journal Watch 摘要和原文沒有顯著差異；LLM 摘要含泛化結論的機率是 NEJM JW 的 4.85 倍（95% CI 3.06–7.70）。最常見的轉換是「量化陳述→泛稱」。**要求「準確、不要引入不準確」的 prompt 反而讓泛化增加約一倍**（OR 1.90），作者連到「ironic rebound」（推測）。溫度 0 比 0.7 少 76%。**Claude 2／3.5／3.7 與原文沒有顯著差異**；GPT-4o、LLaMA 3.3、DeepSeek 最嚴重。所以「新模型更差」只對部分家族成立，引用時不能省這個但書。
  - 限制（作者列）：只測三種 prompt；人類對照只有 NEJM JW（專家寫給專家）；以醫學為主。
  - 與它一致的旁證：FABLES 的 omissions（遺漏 52–85%）；Ravaut 2024 摘要偏開頭；Wan 2025 U 形忠實度。
- **真實案例**：論文 Table 3 的原句對照（aspirin vs enoxaparin、dulaglutide）可直接用。
- **成因**：作者推測 RLHF 讓模型偏好自信、廣泛適用的說法（作者主張）；Sharma 2023（諂媚）與 Singhal 2024（長度偏誤）是同一機制家族的實證（偏好資料的偏向被放大）。
- **修法**：作者建議溫度 0、避免「accuracy」型禁令、強制過去式、做泛化基準測試。本站可轉成檢查：摘要裡每個結論有沒有保留原文的對象、條件、時態。
- **反證**：人類科學寫作本身就有 generalization bias（作者引用）；undergeneralization 也存在但少很多。
- **獨立成篇**：✅ 可以。單一研究很強；它也是「prompt 禁令反效果」的第二個實證，可以和防護篇互相連結。注意它比較偏「內容失真」，要說清楚和第 1 篇（指示型）的差別：第 1 篇是沒給結論，這篇是給了錯的結論範圍。

### 6. 三連排比（rule of three）

- **一手證據**：Pangram：Triads 人類 5、AI 19／萬詞＝4×（✅，方法未公開）；朱君輝等 CCL 2023（中文 HC3，🟡）：並列短語數人類 0.813、ChatGPT 4.600（是並列成分，不等於修辭排比）；Economist 2026-07 社論（✅，經 NRC 轉載）：「AI tends to use the "rule of three" far more than humans」，舉「not partially, not ambiguously, but definitively」；Russell 2025 專家線索把三項列舉歸在 Sentence Structure（35.9%）。
- **反證**：underslop 自家紀錄只在 12 個模型中 4 個看到（🔎）；Heritage & Greatbatch 1986 三項列舉佔集體掌聲 12.6%；高考範文「是……是……是……」。
- **獨立成篇**：❌ 證據不足以單獨成篇。**併入第 3 篇或第 4 篇**（Economist 的例句正好是否定＋三連的混合體）。

### 7. 其他候選（不建議獨立成篇）

| 通病 | 證據 | 建議 |
|---|---|---|
| 模糊歸因（experts argue） | 只有 Wikipedia 觀察 | 併入第 4 篇一段 |
| 公式化結尾（In summary／挑戰與展望） | Wikipedia 把 In summary 列為「歷史指標」（舊模型）；FABLES 有「過度強調結尾」 | 併入第 4 篇或省略 |
| em dash | Pangram 10×；但 Economist 2026：只有 Claude 比專業作者多，ChatGPT 比人少；Russell 專家把 dash 當**人類**訊號 | 只在反證／防護篇當例子：已退燒的 tell |
| 同義詞輪替 | Wikipedia（repetition penalty 推測）、Russell 專家觀察 | 防護篇當「前一代防護造成新 tell」的類比 |

---

## 四、橫向主題

### A. 為什麼會發生（成因）

證據分三層，強度遞減：

1. **偏好資料偏好這些形式（直接實驗）**：Juzek & Ward 2025（受試者偏好 LHF 詞，52.4%）；Zamaraeva 2026（人類評分的偏好資料偏好 rather than，OR 1.24–1.37；獎勵模型最小對照）；Peng 2026（獎勵模型 73–78% 偏好「不是X而是Y」原序）；Zhang et al. 2025 Verbalized Sampling（🟡 讀摘要與 §3）：HelpSteer 6,874 組正確性相同的配對，評分者偏好 base model 機率較高（較「典型」）的回答，α=0.57±0.07，作者稱 typicality bias 是 mode collapse 的資料層成因。
2. **指令微調／RLHF 後輸出變窄（相關）**：Reinhart 2025（base 接近人類、instruct 偏離）；Kirk et al. 2024 ICLR（🟡）：RLHF 比 SFT 泛化好但多樣性顯著下降；Singhal et al. 2024（🟡 摘要）：RLHF 的獎勵提升大多來自變長，純長度獎勵就能重現大部分改進。
3. **同家族的行為通病（旁證）**：Sharma et al. 2024 ICLR（🟡 摘要）諂媚由偏好判斷驅動。

**反證與限制**：Zamaraeva 的 Tülu 3 三階段**沒有**出現高頻率，表示 post-training 本身不一定產生這個習慣，要看偏好資料與目標；Juzek 只有 Llama；Lazovic 整理的觀點（🔎）指出 em dash 在 base model 就已存在。結論：「RLHF 造成 AI 腔」要寫成「偏好資料裡有些形式被偏好，訓練會放大它們；不同家族差很多」。
**獨立成篇**：✅ 一篇，放在具體通病之後（螺旋式：每張卡先提一句成因，這篇再統整）。

### B. 偵測與防護的工程做法

- **規則式 linter**：vale-ai-tells 77 條規則，第三方實測（mdd R15，實務紀錄）在四篇文章上精確率約 4%（約 118 個命中、約 5 個值得改），42 條從沒觸發；proselint 自承「for lack of an open corpus」量不了精確率。本站實測繁中 linter 精確率 29.4%（zhtw-mcp）可連結。
- **prompt 禁令**：Anthropic 文件原文「Tell Claude what to do instead of what not to do」（文件自述），但自己的範例仍有 DO NOT，重點是否定句搭正面描述與理由。實證：Jang 2022（否定 prompt，舊模型 inverse scaling）、Castricato 2024（Pink Elephant：基線 OpenHermes 加禁令後提及率不降反升，GPT-4 0.33→0.13）、Rana 2026（單一 7B 模型，違規率隨基準機率呈 logistic；87.5% 的違規是 priming）、Freeburg 2026（同一句 em dash 禁令：Opus 4.6 0.00、GPT-4.1 長文仍 6.97／千字）、Peters 2025（accuracy 型禁令讓泛化加倍）。結論：**有效但不穩，取決於模型與目標詞的基準機率；前沿模型比 2022–24 的開源模型聽話**。
- **解碼期與訓練期**：Antislop（ICLR 2026，✅ v2）：sampler 100% 抑制且品質不降（GPT-5 評分、創作文體）；token banning 8k 禁詞品質掉到 28/100；FTPO 83–92% 抑制、品質在 1% 內；吞吐量損失 69–96%。
- **禁令後的替代（使用者點名的反例）**：
  - 字詞層級有實證：Antislop ICLR 版附錄 L，FTPO 後新冒出 lysandra、unusualness、outlandishness，但 top-40 平均過度比降 73%（1,439×→394×）。替代存在、強度較低；只對 FTPO 量過。
  - 句式層級：**沒有以禁令為自變數的受控實驗（⚪）**。間接證據：Zamaraeva 修訂稿換形（見卡 3）；Graphite（廠商壓掉知名 tell 後，corrective framing 仍 12 倍）；vale-ai-tells changelog 有多條規則是因為 agent 繞過舊規則才加的（SemicolonUsage「the semicolon used as an em-dash substitute」、ServesAsDodge 用冒號取代 is）；slop-gate（🔎）「cleared two tells and introduced three」；SillyTavern 社群 Sukino 指南。Wikipedia「改用逗號句號」那句帶 `{{cn}}`，**不可引**；Economist 二手轉述是「標點變少」，兩者不一致。
- **LLM 當審稿員**：Shaib et al. 2025（🟡）：GPT-5 等判斷 slop 與人類 κ≈0；Chakrabarty et al. CHI 2025（🟡）：最佳偵測精確率 0.46，低於專家互評 0.57；**改寫才是瓶頸**：用作家標的 span 和自動偵測的 span 改寫，結果幾乎一樣；作家自己改的版本 65% 被選為最佳。
- **人工審稿**：Wikipedia AI Cleanup：特徵只當線索，「Please do not merely treat these signs as the problems to be fixed; that could just make detection harder」；最可靠的是查出處支不支持內文。
- **獨立成篇**：✅ 至少一篇，可能兩篇（「規則與 linter」、「禁令的反效果與替代」）。本站的 tldr 規則＋check-post-quality 是現成案例。

### C. 反證（人類也這樣寫、偵測誤判、過度矯正）

- **人類偵測力**：Russell et al. ACL 2025（🟡）：常用 LLM 寫作的 5 位專家多數決 300 篇只錯 1 篇；非專家 TPR 56.7%、FPR 約 52%（Table 1 寫 51.7%，正文寫 52.5%）；非專家把中性語氣、罕用詞都當 AI；專家把 dash 當人類訊號。prompt 式 humanizer 讓自動偵測器大跌，專家仍 100%。
- **偵測器**：Liang et al. 2023 Patterns（🟡）：91 篇 TOEFL 作文平均偽陽性 61.22%，限於舊的 perplexity 型偵測器；RAID 2024：開源偵測器預設閾值偽陽性極高，商用的低於 1.7%；Jabarian & Imas 2025（NBER，🟡）：Pangram 在嚴格門檻下近零誤判。結論：**統計分類器可以很準，但不是靠人眼看的那幾個特徵**。
- **中文偵測誤判**：新華每日電訊 2025-05（✅）：《荷塘月色》片段 AI 疑似度 62.88%；同一篇論文在 PaperYY 50%、PaperPass 70%、知網 5%。
- **人類趨同**：Yakura 2024／2026（🟡）、Geng & Trotta 2024（🟡）、Kobak 2025 自承無法區分「直接用 LLM」與「人類學了 LLM 的詞」。
- **過度矯正**：模型端（Anthropic 自承舊的反格式規則在新模型上壓掉需要的結構；Graphite：GPT、Gemini 的 em dash 壓到比人類低 88%）；人類端（Poynter 2026 報導編輯為避嫌刪 em dash，🔎）；具名誤指個案多起（🔎 新聞）。
- **修辭傳統**：Heritage & Greatbatch 1986（對比 33.2%、三項列舉 12.6% 的集體掌聲，經 Bull 2016 轉述）。
- **獨立成篇**：✅ 一篇，放在防護之後，當護欄；每張通病卡也各帶一段自己的反證。

---

## 五、非寫作通病（候選，不展開）

| 候選 | 一手證據 | 和寫作的連結 |
|---|---|---|
| 宣稱完成（false success） | Advani 2026 arXiv 2606.09863（🔎→摘要與引言片段）：tau2-bench 9,876 條軌跡，false success 佔單控制領域失敗的 45–48%，AppWorld 75.8%；**LLM 評審被「自信收尾語言」騙**，AUROC 不超過 0.65 | 強：通病本身就是一段文字（「已成功更新」），和本系列的「空話被當成資訊」同構 |
| 諂媚 | Sharma et al. 2024 ICLR（🟡 摘要）：五個助理一致諂媚，偏好資料偏好附和使用者的回答 | 中：成因與寫作通病同機制（偏好資料）；Economist 社論也點名「LLMs are sycophants」 |
| 自信但無據的建議 | Peters 2025 的「描述→建議」轉換（卡 5 已涵蓋） | 已在卡 5 |

建議：false success 證據足、與寫作同構，可以當系列最後一篇或附錄；諂媚站上已有課程導讀，連過去即可。

---

## 六、證據強度總表（給排篇目用，不是篇目）

| 主題 | 一手實證 | 2024 後 | 反證 | 中文證據 | 夠獨立成篇 |
|---|---|---|---|---|---|
| 否定式對比 | 強（Zamaraeva、Peng、Pangram、Antislop） | ✅ | ✅ | ✅ Peng | ✅ 最強 |
| 過度概括 | 強（Peters 單一大型研究） | ✅ | ✅ | ⚪ | ✅ |
| 意義抬高／AI 詞彙 | 中（Reinhart、Kobak、Juzek；「抬高」本身是作者詮釋） | ✅ | ✅ | ⚪ | ✅（以動作為主） |
| 指示型摘要＋自指＋鉤子 | 規範強、LLM 特有性弱 | ✅（相鄰） | ✅ | ⚪ | ✅ 合成一篇 |
| 三連排比 | 弱（廠商數字、並列成分） | ✅ | ✅ | 🟡 間接 | ❌ 併入 |
| 成因 | 中強（多個直接實驗，各有範圍限制） | ✅ | ✅ | ✅ Peng | ✅ |
| 防護工程 | 中（Antislop、禁令研究；替代無句式實驗） | ✅ | ✅ | ⚪ | ✅（一到兩篇） |
| 反證 | 強 | ✅ | — | 🟡 偵測誤判報導 | ✅ |
| 宣稱完成（非寫作） | 中（單一研究） | ✅ | 未搜 | ⚪ | 候選 |

**會改變系列規劃的發現**

1. 「一篇一個通病」只撐得起 4 個：否定式對比、過度概括、意義抬高、指示型摘要（含自指與鉤子）。三連排比、自指、鉤子各自證據太薄，要合併。
2. 成因不必每篇重講：同一套「偏好資料放大」證據適用多張卡，適合獨立一篇統整。
3. 「禁令導致替代」字詞層有實證，句式層只有修訂換形與工具紀錄。防護篇不能寫成「禁令一定會換形」，要寫成「字詞層量到了，句式層有跡象、沒有實驗」。
4. 「新模型更差」（Peters）只對部分家族成立，Claude 各版本沒有顯著過度概括；Zamaraeva 的 Claude 初稿也比 GPT-6-sol 少煩人用例，修訂後才追上。系列不能寫成「LLM 都這樣」。
5. 中文只有否定式對比有實證。其他通病的中文部分只能用本站自己的 tldr 資料（要先算 regex 精確率）當主要證據，這反而是本站能補的原創資料。
6. 本站 tldr 計數的分母跟使用者給的對不上（見一節），動筆前要固定定義。

---

## 七、五關檢查結果

| 段落 | ① 一手來源 | ② 證據類型分清 | ③ 時效 | ④ 反證 | ⑤ 飽和 |
|---|---|---|---|---|---|
| 否定式對比 | ✅ Zamaraeva（🟡六成）、Peng ✅、Pangram ✅ | ✅ | ✅ 2026 | ✅ 修辭傳統、人類基準、換形 | ✅ 英文 negative parallelism／antithesis／rather than／contrastive negation、中文 不是而是／AI味，都回到已讀來源 |
| 過度概括 | ✅ Peters 全文 | ✅ | ✅ 2025 | ✅ 人類也過度概括、Claude 例外 | 🟡 只搜了 generalization bias、overgeneralization summary、scope；**沒找到同作者後續或獨立重複驗證**，動筆前補搜 replication |
| 意義抬高／AI 詞彙 | ✅ Reinhart ✅、Juzek ✅；Kobak 🟡 | ✅（「抬高」是作者詮釋） | ✅ | ✅ 退燒、趨同 | 🟡 中文 ⚪（試過 Exa ×3、Tavily ×1、Jina arXiv ×3 額度用完） |
| 指示型摘要 | ✅ NISO、ISO 預覽 | ✅ 標準 vs 實證分開 | ✅ FABLES、Cao、Belém 2024 | ✅ Tombros、Louis & Nenkova | ✅ indicative summary LLM、vague summary、summary specificity、meta-description 都只回相鄰研究 |
| 鉤子 | ❌ 沒有 LLM 一手 | ✅ | 🟡 | ✅ | ⚪ → 已決定併入 |
| 三連排比 | 🟡 廠商、CCL 間接 | ✅ | ✅ | ✅ | 🟡 廣告文案語料研究**未搜夠**（子 agent 自報） |
| 成因 | ✅ Juzek、Zamaraeva、Peng；VS、Kirk 🟡 | ✅ | ✅ | ✅ Tülu 3 反例 | ✅ |
| 防護 | ✅ Antislop、Jang、Rana；其餘 🟡 | ✅ 實證／實務紀錄／文件自述分三層 | ✅ | ✅ | 🟡 句式替代 ⚪（見下） |
| 反證 | 🟡 多數讀方法／結果／限制 | ✅ | ✅ | — | ✅ |
| 中文 AI 腔 | ✅ Peng、虎嗅、知乎、新華 | ✅ | ✅ | ✅ 教材範式 | ✅ 否定式對比；其餘 ⚪ |

**沒過或部分過的關**：過度概括的獨立重複驗證（⑤）；中文意義抬高、自指、結尾的語料統計（①⑤，⚪）；句式層級替代的受控實驗（①，⚪）；三連排比在廣告文案的量化研究（⑤，未搜夠）；Zamaraeva 只讀約六成（①，動筆前讀完 §1–4 與附錄 H「替換是例外不是常態」那段）。

---

## 八、試過但讀不到的管道

| 來源 | 結局 | 試過 |
|---|---|---|
| Peters & Chin-Yee 出版社頁 | ✅ 改讀 PMC12042776 全文 | royalsocietypublishing.org（Cloudflare 驗證頁）→ arXiv abs（只有摘要）→ PMC |
| Washington Post 2025-11 互動頁的 6% 數字 | 🟡 只讀到方法段 | r.jina.ai、Exa fetch（互動投影片內容抓不到）；6% 只見於 Lazovic 部落格與 Wikipedia 轉述。可試 Playwright |
| Economist 2026-07-30〈How to spot AI writing〉 | ✉️ 訂閱 | Exa（付費牆導言）、r.jina.ai（導覽列）、Wayback 20260910（605 字元空殼）；社論部分改讀 NRC 轉載 ✅ |
| Atlantic 2026-07-12 | ✅（子 agent） | Exa（付費牆）→ r.jina.ai（Cloudflare）→ Wayback `id_` 快照 |
| Pangram 頁面初版日期、語料組成 | ✉️ info@pangram.com 或 Elyas Masrour | Wayback CDX、sitemap |
| Borko & Bernier 1975 原書 | ✉️ 借閱 | archive.org 為 access-restricted |
| ISO 214 全文 | ✉️ 付費 | 只有預覽頁（定義段已在內） |
| Heritage & Greatbatch 1986 原表 | ✉️ 付費（AJS） | 經 Bull 2016 開放取用轉述 |
| Verbalized Sampling arXiv PDF | 🟡 改讀 Exa 擷取的 HTML 段落 | r.jina.ai 對 PDF 與 HTML 回空 |
| Juzek & Ward 2025 的完整 Table 1 | 🟡 | 已讀正文；表格未逐列核 |
| 中文意義抬高詞頻率 | ⚪ | Exa ×3、Tavily ×1、Jina arXiv（額度用完）；✉️ 可問 Peng 2026 通訊作者 Ying Liu（清華） |
| 句式層級替代實驗 | ⚪ | Exa 兩組查詢、Antislop 兩版、Last Fingerprint、Jina arXiv（額度用完） |
| tropes.fyi AI Vetter 評估 | ⚪ | `/vetter`、`/about` 2026-10-28 回 404 |

---

## 九、來源表（最終狀態，與 sources.jsonl 一致）

證據類型：實證＝有對照的實驗或語料統計；廠商自評；媒體語料分析；作者主張；規範／標準；實務紀錄；二手。

| 來源 | 年 | 類型 | 讀取 | 用於 |
|---|---|---|---|---|
| Wikipedia:Signs of AI writing（2026-10 wikitext） | 2026 | 作者主張（社群觀察，附實例） | ✅ | 清單、卡 3、4、7、反證 |
| Reinhart et al., PNAS 122(8) | 2025 | 實證 | ✅ | 卡 4、成因 |
| Peters & Chin-Yee, R Soc Open Sci（PMC12042776） | 2025 | 實證 | ✅（方法讀概要） | 卡 5、防護 |
| Juzek & Ward, arXiv 2508.01930 | 2025 | 實證 | ✅（方法、結果、討論、限制、結論） | 卡 4、成因 |
| Juzek & Ward, COLING 2025（Why Does ChatGPT Delve） | 2025 | 實證 | 🟡 | 反證（delve 反彈） |
| Zamaraeva et al., arXiv 2610.10092 | 2026 | 實證（預印本，作者兼標註者） | 🟡 約六成 | 卡 3、成因 |
| Peng et al., arXiv 2610.22249 | 2026 | 實證 | ✅（子 agent） | 卡 3、中文 |
| Pangram〈9 Signs of AI Writing〉 | 2025／更新 | 廠商自評 | ✅ | 卡 3、6、追查 |
| The Atlantic, Oremus | 2026 | 媒體 | ✅（子 agent，Wayback） | 追查 |
| Barron's, Mishkin（moomoo 轉載） | 2026 | 媒體語料分析 | ✅（子 agent） | 卡 3 |
| Washington Post, Merrill et al. | 2025 | 媒體語料分析 | 🟡 方法段 | 卡 3 |
| Brandon Lazovic〈Why AI Keeps Writing 'Not X, But Y'〉 | 2026 | 二手 | 🟡 | 線索 |
| Graphite〈AI Tells〉 | 2026 | 業界語料分析（單一 prompt） | 🟡（子 agent） | 卡 3、防護 |
| Pew Research 圖表 | 2026 | 語料統計 | 🔎 | 線索 |
| Economist 社論（NRC 轉載） | 2026 | 作者主張＋自做語料 | ✅ | 卡 6、反證 |
| Economist〈How to spot AI writing〉 | 2026 | 媒體語料分析 | 🔎 付費牆 | 二手轉述 |
| Dataconomy 轉述 Economist | 2026 | 二手 | 🔎 | 線索 |
| Kobak et al., Science Advances（arXiv v5） | 2025 | 實證 | 🟡（子 agent） | 卡 4、反證 |
| Geng & Trotta, arXiv 2404.08627 | 2024 | 實證 | 🟡（子 agent） | 反證 |
| Geng & Trotta, ACL Findings 2025（Coevolution） | 2025 | 實證 | ✅（子 agent） | 防護、反證 |
| Yakura et al., arXiv 2409.01754v4 | 2024–26 | 實證 | 🟡（子 agent） | 反證 |
| Russell, Karpinska & Iyyer, ACL 2025 | 2025 | 實證 | 🟡（子 agent） | 反證、防護 |
| Liang et al., Patterns | 2023 | 實證 | 🟡（子 agent） | 反證 |
| Dugan et al., RAID, ACL 2024 | 2024 | 實證 | 🟡（子 agent） | 反證 |
| Jabarian & Imas, NBER w34223 | 2025 | 實證（工作論文） | 🟡 摘要＋引言 | 反證 |
| Emi & Spero, Pangram 技術報告 arXiv 2402.14873 | 2024 | 廠商自評 | 🟡 | 反證 |
| Heritage & Greatbatch, AJS（經 Bull 2016） | 1986 | 實證 | 🟡 二手數字 | 反證 |
| Bull, J Social and Political Psychology | 2016 | 回顧 | 🟡 | 反證 |
| ANSI/NISO Z39.14 | 1997/R2015 | 標準 | 🟡 §1–7 全讀 | 卡 1 |
| ISO 214:1976（預覽） | 1976 | 標準 | 🟡 | 卡 1 |
| AR 25-50（2013、2020） | 2013/2020 | 規範 | 🟡 相關條文 | 卡 1、2 |
| NN/g Inverted Pyramid（Schade） | 2018 | 作者主張 | ✅ | 卡 2 |
| NN/g How Little Do Users Read?（Nielsen） | 2008 | 日誌再分析 | ✅ | 卡 2 |
| NN/g F-Shaped Pattern（Pernice） | 2017 | 眼動摘要 | ✅ | 卡 2 |
| Hartley, JMLA（PMC442180） | 2004 | 回顧 | 🟡 | 卡 1 |
| Tombros & Sanderson, SIGIR | 1998 | 實證 | 🟡 | 卡 1 反證 |
| Mani, Summarization Evaluation Overview | 2001 | 回顧 | 🟡 | 卡 1 量法 |
| Zhang et al., TACL 2024（新聞摘要） | 2024 | 實證 | 🟡 | 卡 1 反證 |
| Kim et al., FABLES, COLM 2024 | 2024 | 實證 | 🟡 | 卡 1、5 |
| Ravaut et al., ACL 2024 | 2024 | 實證 | 🟡 | 卡 5 |
| Wan et al., NAACL 2025 | 2025 | 實證 | 🟡 | 卡 5 |
| Cao et al., COLM 2024（財報） | 2024 | 實證 | 🟡 | 卡 1 |
| Belém et al., arXiv 2410.13961 | 2024 | 實證 | 🟡 | 卡 1 |
| Lyu & Ke, BiomedTLDR, arXiv 2512.23206 | 2025 | 實證 | 🟡 | 卡 1 反證 |
| QAGS（Wang 2020）、QuestEval（Scialom 2021） | 2020–21 | 方法 | 🟡 | 卡 1 量法 |
| Louis & Nenkova 2011 | 2011 | 實證 | 🟡 | 卡 1 反證 |
| Zhang et al., Verbalized Sampling, arXiv 2510.01171 | 2025 | 實證 | 🟡 摘要＋§3 | 成因 |
| Kirk et al., ICLR 2024 | 2024 | 實證 | 🟡 摘要＋結論 | 成因 |
| Singhal et al., COLM 2024 | 2024 | 實證 | 🟡 摘要 | 成因 |
| Sharma et al., ICLR 2024（諂媚） | 2024 | 實證 | 🟡 摘要 | 成因、候選 |
| Advani, arXiv 2606.09863（false success） | 2026 | 實證 | 🟡 摘要＋引言片段 | 候選 |
| Paech et al., Antislop（arXiv v2＋ICLR 2026） | 2025–26 | 實證 | ✅ v2；🟡 ICLR 附錄 | 防護 |
| Jang et al., negated prompts | 2022 | 實證 | ✅（子 agent） | 防護 |
| Castricato et al., Pink Elephants | 2024 | 實證 | 🟡（子 agent） | 防護 |
| Rana, Semantic Gravity Wells, arXiv 2601.08070 | 2026 | 實證（單一模型） | ✅（子 agent） | 防護 |
| Freeburg, The Last Fingerprint, arXiv 2603.27006 | 2026 | 實證（小樣本） | 🟡（子 agent） | 防護 |
| Shaib et al., Measuring AI Slop, arXiv 2509.19163 | 2025 | 實證 | 🟡（子 agent） | 防護 |
| Chakrabarty et al., CHI 2025 | 2025 | 實證 | 🟡（子 agent） | 防護 |
| Anthropic Prompting best practices | 2026 | 文件自述 | 🟡 | 防護 |
| Ars Technica, Edwards（GPT-5.1 em dash） | 2025 | 二手＋非正式測試 | ✅（子 agent） | 防護 |
| vale-ai-tells README／CHANGELOG | 2025–26 | 文件自述／實務紀錄 | 🟡 | 防護 |
| mdd R15（vale-ai-tells 實測） | 2026 | 實務紀錄 | ✅（子 agent） | 防護 |
| Sukino SillyTavern 指南 | 2024–26 | 實務紀錄 | 🟡 | 防護 |
| 虎嗅〈「不是…而是…」刷屏的一年〉（數字生命卡茲克） | 2026-01 | 作者主張 | ✅（子 agent） | 中文 |
| 果殼／虎嗅〈AI 滿篇的「不是……而是……」〉 | 2026 | 媒體 | ✅（子 agent） | 追查 |
| 知乎 孫學瑛、郝澤良 | 2026 | 作者主張 | ✅（子 agent） | 追查 |
| 黑暗執行緒〈我自己有多愛用？〉 | 2026 | 個人語料實測 | ✅（子 agent） | 中文人類基準 |
| 朱君輝等 CCL 2023 | 2023 | 實證 | 🟡 | 卡 6 |
| Li & Zhang CCL 2025（微博） | 2025 | 實證 | 🟡 | 中文 |
| 新華每日電訊（論文 AI 率誤判） | 2025 | 媒體＋記者實測 | ✅ | 反證 |
| 高考議論文句式教材（語文迷等） | 2022–24 | 寫作教材 | 🟡 | 反證 |
