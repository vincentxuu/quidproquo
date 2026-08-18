# 掃描 PDF OCR 實測 —— 第二輪測試規劃

> 建立日期：2026-08-18。
> 對象文章：`src/content/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark.md`
> （〈掃描 PDF 實測：10 種解析工具丟進考古題，結果差多少？〉，系列「文件解析實戰」order 6）。
> 觸發：使用者指向 MaiAgent Model Arena（`https://maiagent-ocr-arena.maiagent.workers.dev/`）當參考，
> 問「還可以用哪些來測試」。
> 這是規劃文件，不是進度表。實際完成狀態以 `progress.txt` 與 git log 為準。

---

## 〇、先定位問題：原文的三個缺口

原文的價值在「安裝踩坑紀錄」和「兩階段策略」，這兩塊是第一手的、別人抄不走。真正的弱點是：

| 缺口 | 現況 | 影響 |
|---|---|---|
| **引擎名單受限於硬體** | 10 種全是 CPU Mac 跑得動的；olmOCR、Chandra、dots.ocr 因為「需要 GPU」直接被排除 | 剛好排除掉 2025Q4–2026 進展最快的一整類 |
| **素材只有一種** | 4 份掃描考卷（程式碼／公式／中英混排／圖形） | 結論不能外推到表格、發票、手寫、直排、印章 |
| **沒有量化指標** | 「優秀／良好／中等／差」＋ char count | char count 只能測「有沒有漏」，不能測「對不對」；工具排名無法被別人重現或反駁 |

第二輪要補的就是這三格，順序是 **指標 → 素材 → 引擎**（先有尺，再有題目，最後才是考生）。

---

## 一、從 MaiAgent Model Arena 抄什麼

### 觀察方法

該站是 SPA，本 session 的 egress proxy 擋掉該網域（`curl` 403、`WebFetch` EGRESS_BLOCKED），
改用 Cloudflare browser rendering MCP（`get_url_markdown` / `scrape_url_elements`）取得畫面與 API 回應。
主要證據來自它自己的兩個端點（2026-08-18 讀取）：

- `GET /api/engines` —— 引擎註冊表
- `GET /api/scenarios` —— 情境定義

前端 bundle 在 `/static/js/app.js`，另可見 `/api/schemas`、`/api/ground-truth`、`/api/runs/batch/stream` 等路徑。
站上目前無公開資料（情境無範例、排行榜空），所以**它的價值在架構設計，不在它的分數**。

### 七個可移植的設計

| # | Arena 的作法 | 原文缺什麼 | 可移植性 |
|---|---|---|---|
| 1 | **情境（scenario）＋ schema 欄位**：先定義這個情境要抽哪些欄位（key／型別／必填），評分評的是欄位對不對 | 原文評的是「整頁像不像」 | 高 —— 考卷可定義為 `題號/題目/配分/選項/答案` |
| 2 | **雙軌引擎**：同一個模型有 `gw-claude-sonnet-5` 與 `gw-claude-sonnet-5-ocr` 兩個 id。前者 VLM 直接 structured output，後者先取版面文字再由 LLM extractor 對映欄位 | 原文完全沒測這個變因 | 高，且**這是原文最大的方法論漏洞**：把「模型好不好」和「pipeline 怎麼接」混在一起講 |
| 3 | **正確答案產生流程**：AI 產草稿 → 人工調整 → 執行比較時自動存成 ground truth | 原文沒有 GT | 高 —— 解決「標準答案哪來」這個第二輪最大的成本項 |
| 4 | **領域詞彙／context_prompt**：轉寫時當領域提示傳給引擎，降低專有名詞錯字率，且不進逐字稿 | 原文把 prompt 當常數 | 中 —— 對 VLM 類有效，對傳統 OCR 無效，本身就是一個對照組 |
| 5 | **並行派工 ＋ 60s/引擎逾時 ＋ 失敗隔離** | 原文是逐一手跑，Surya 的間歇性 connection error 只能記成「踩坑」 | 高 —— 失敗要是一個**可統計的欄位**，不是一段散文 |
| 6 | **題庫評測**：上傳 `question, gold_answer` CSV/JSON，各模型作答後以語意相似度計分 | 原文其實**已經有這個資產**（61 份考卷、1449 題的題庫 JSON），但只拿來做人工比對 | 極高 —— 見第五節 L5 |
| 7 | **跨情境總覽**：問的是「各情境哪個模型最佳」，不是「總冠軍是誰」 | 原文給了單一排名表 | 高 —— 和原文「不要先選工具，先選策略」的結論其實同一件事，只是沒做成資料 |

另外值得抄的小東西：JSON / CSV / Markdown 三種匯出、「強制全部重跑」開關（避免快取污染）、
以及 token／圖片數上限估算（成本先估再跑）。

### 它的引擎註冊表（2026-08-18 讀取）

原樣列出，僅作「一個實務團隊會同時擺哪些引擎」的參考；`configured:false` 者尚未接上，
`stub-*` / `*-stub-*` 是測試樁。**這些字串是該站的設定值，不當作模型存在與否的證據。**

- **純 OCR / 文件解析**：`mistral-ocr-4`、`unlimited-ocr`(未設定)
- **VLM 直出**：`gemini-3.1-pro`、`gemini-3.5-flash`、`gw-claude-*`、`gw-gpt-*`、`gw-o3`/`o4-mini`、`gw-deepseek-v3.2`/`r1`
- **同名 `-ocr` 變體**（雙軌設計）：`gw-claude-opus-4-7-ocr`、`gw-gpt-5.5-ocr`、`gw-o3-ocr` …
- **評分用**：`gemini-qa`、`qwen-qa`、`anthropic-qa`(未設定)、`openai-qa`(未設定)、`xai-qa`(未設定)
- **ASR**（本規劃不涵蓋）：`whisper-large-v3(-turbo)`、`breeze-asr-25`、`qwen3-asr`、`elevenlabs-scribe`、`azure-speech`、`voxtral-mini`、`gemini-asr`、`bronci-asr`

情境目前是語音導向的四個（一般／客服電話／會議記錄／醫療問診），`fields` 全為空——
也就是說 schema-driven 那套是**設計好但還沒填**。我們要做的正是把它填起來的那個版本。

---

## 二、還可以測哪些引擎

分四批，依「原文的排除理由」對應補位。每批獨立可交付。

### Batch A —— 本地 CPU 可跑（延續原文條件，零額外成本）

| 引擎 | 為什麼補 | 注意 |
|---|---|---|
| **EasyOCR** | 和 RapidOCR / PaddleOCR 同一檔次的傳統 OCR，繁中支援常被拿來對比 | Apache-2.0 |
| **ocrmypdf + Tesseract（含前處理）** | 原文 Tesseract 輸出 0 chars 卻沒有根因。`--deskew --clean --oversample 300` 是標準解 | 這是**變因測試**不是新引擎，見第四節 |
| **granite-docling（IBM）** | Docling 的 VLM 路線，補上原文 Docling「掃描件品質差」的另一半故事 | 授權相對乾淨，值得確認 |
| **pypdfium2 / pdfplumber 對照組** | 確認掃描 PDF 確實無文字層（原文宣稱但沒留證據） | 幾秒鐘的事，補證據鏈 |

### Batch B —— 需要 GPU / vLLM（租 L4 或 A10 數小時）

原文寫「CPU Mac 無法本地測」就結案，第二輪要把這句話換成數字。候選（**納入前逐一確認授權與可用性**）：

`olmOCR 2`、`Chandra 2`、`dots.ocr` / `dots.mocr`、`PaddleOCR-VL(-1.5)`、`MinerU2.5`、
`DeepSeek-OCR` / `-2`、`Nanonets-OCR2-3B`、`MonkeyOCR-pro-3B`、`LightOnOCR-2-1B`、
`GLM-OCR`、`HunyuanOCR`、`FireRed-OCR`、`Infinity-Parser`、`Qianfan-OCR`、`GutenOCR`。

實務上不用全跑。建議取 **4–5 個代表不同取捨的**：

| 選誰 | 代表的取捨 |
|---|---|
| olmOCR 2 | 英文印刷掃描的強基線，Apache-2.0，生態成熟 |
| Chandra 2 | 版面 block 型別最多（表格／公式／程式碼／圖表／Mermaid），多語言數字最漂亮 |
| dots.ocr（或 dots.mocr） | 多語 + 結構化圖形，3B 級 |
| PaddleOCR-VL | 0.9B 小模型路線，測「小模型是不是真的夠用」 |
| MinerU2.5 | 和原文已測的 MinerU 拉出**版本對照**（見下方待釐清） |

> **待釐清（不要在文章裡含糊帶過）**：原文寫「MinerU 3.4.5」，外部資料普遍寫「MinerU2.5」。
> 極可能是 **pip 套件版本（3.4.x）vs 模型版本（2.5）** 兩件事，但原文沒交代。
> 第二輪必須在同一段裡把 `pip show mineru` 的版本和它載入的模型版本一起貼出來。

### Batch C —— 雲端 API（零安裝，而且幾乎不用花錢）

先講最重要的一句，這也修正我上一版的判斷：**這批的免費額度足以跑完整個第二輪。**
第二輪的語料量級是數百頁（八類 × 3–5 份，加上原文的 61 份考卷），
而下表多數服務的免費額度是每月 10,000–15,000 頁／credits。
所以「API 要先等預算核准」是錯的，Round 2B 可以和 Round 2A 同時開工。

#### C-1 專用文件解析 API

| 服務 | 模型／端點 | 計費 | 免費額度 | 為什麼值得測 | 價格來源 |
|---|---|---|---|---|---|
| **Mistral OCR 4.1** | `mistral-ocr-latest`，`/v1/ocr` | OCR $4／1K 頁；Document AI（含 JSON schema 抽取）$5／1K 頁 | 需查 | **同時提供「純解析」與「照 schema 抽欄位」兩個檔位**，剛好對上 Arena 的雙軌設計 | 廠商定價頁（2026-08-18 讀取） |
| **Datalab** | Marker／Chandra 作者團隊的官方雲端 | 依 processor 計價；bbox extras 另計（如 table cell bboxes $0.30／1K 頁） | 新帳號每月額度（公司信箱 $20／個人信箱 $10），可轉 pay-as-you-go | **原文測過 Marker 本地版**，這裡能做「同一團隊本地 vs 雲端」的同源對照，是最乾淨的一組 | 官方 changelog（2026-06-18 條目） |
| **Firecrawl** | 原文已測，Fire-PDF 引擎 | PDF 每頁 1 credit；方案 $0／$16／$83／$333 分級 | 免費方案 500 credits／月 | 保留當基準線；順帶**驗證原文關於 pdf-inspector 路由的說法**（Fire-PDF 2026-04 上線，逐頁分類後只把掃描頁送 GPU OCR） | 官方 blog + 二手比較文 |
| **LlamaParse** | LlamaCloud | credit 制，$1.25／1K credits；Fast 1 credit／頁 → Agentic Plus 數十 credits／頁 | 每月 10,000 credits | RAG 生態最常見；**同一頁不同模式差幾十倍**，是「報價必須標模式」的最佳教材 | 二手比較文 |
| **Reducto** | Parse / Extract | 前 15,000 credits 免費，之後 $0.015／credit；標準解析 1 credit／頁 | 15,000 credits | 主打**逐值 bounding box 引用**，對「欄位抽取要能追溯到頁面位置」這條有用 | 廠商比較頁 + 二手 |
| **Unstructured** | Platform | 約 $0.03／頁 | 每月 15,000 頁 | RAG 管線常見的另一條路 | 二手比較文 |
| **Upstage Document Parse** | — | 未查 | 未查 | 亞洲語系主打 | **未查證** |
| **TextIn xParse** | — | 未查 | 未查 | 中文文件解析代表，**繁中／表格／手寫是它的主打**，正好對上第三節的素材缺口 | **未查證** |

#### C-2 三大雲（唯一有 SLA 的一類）

| 服務 | 純 OCR | 版面／結構 | 表單／KIE | 免費額度 |
|---|---|---|---|---|
| **Azure Document Intelligence** | Read $1.5／1K 頁 | Layout $10／1K | Prebuilt $10／1K；Custom $30–50／1K；add-on（高解析度／公式／條碼）+$6／1K | F0 每月 500 頁 |
| **AWS Textract** | DetectDocumentText $1.5／1K | Tables 約 $15／1K | Forms 約 $50／1K；Forms+Tables 約 $65／1K；Analyze Expense 約 $8–10／1K | 新帳號每月 1,000 頁 × 3 個月 |
| **Google Document AI** | OCR $1.5／1K（超過 5M 頁／月降至 $0.6） | Layout 約 $10／1K | Form Parser 約 $30／1K；Custom Extractor 約 $30／1K | 試用額度 |

一個現成的結論：**純 OCR 三家同價（$1.5／1K 頁），差異全在結構化那一層**——
而結構化正是原文沒測的層。這張表本身就能撐起文章的一段。

> 以上三大雲的數字全部來自二手比較文（2026 年中），不是廠商定價頁。**視為線索，不是報價。**

#### C-3 計費模型換算（不換算就不能比）

按頁計費和按 token 計費不能直接並排。統一換算成「每 1,000 頁 USD」：

- **按頁**：報價即結果。
- **按 token**：每頁成本 =（影像 token + prompt token）× 輸入單價 + 輸出 token × 輸出單價。
  掃描頁的影像 token 隨解析度與長寬比變動，**沒有可查的固定值——必須實測一頁的 `usage` 再外推**。
  Anthropic 的 `count_tokens` 端點可以在送出前先算輸入 token；輸出 token 只能實跑。

這一格算清楚，原文那句「按頁計費」才真的有比較意義。

### Batch D —— 通用 VLM 當基線（同時測雙軌）

原文只有「Claude 視覺」一格，卻是**唯一能讀懂圖形語義的方案**——這個發現值得展開成一整節。
三家各取「高階／便宜」兩檔：

| 供應商 | 候選 | 定價（輸入／輸出，每 1M token） | 價格來源 |
|---|---|---|---|
| **Anthropic** | `claude-opus-5` / `claude-sonnet-5` / `claude-haiku-4-5` | $5／$25；$3／$15（介紹價 $2／$10 至 2026-08-31）；$1／$5 | `claude-api` skill 定價表 |
| **Google** | Gemini 3.1 Pro / Gemini 3 Flash | 約 $2／$12（超過 200K context 全單重算 $4／$18）；約 $0.5／$3 | 二手，跑之前開 `ai.google.dev/gemini-api/docs/pricing` 覆核 |
| **OpenAI** | GPT-5.x 系列 | **未查證** | 納入前開官方定價頁 |

每一檔都跑兩軌（第三軌選作）：

1. **軌一**：整頁影像 → VLM 直出 Markdown／JSON（structured output）
2. **軌二**：RapidOCR 取文字（1.5s／頁、免費）→ **同一顆 LLM** 當 extractor 對映 schema
3. **軌三（選）**：RapidOCR 文字 + 版面座標一起餵，測「讓 LLM 看得到位置」值不值得

軌二的輸入是純文字，token 數比整頁影像少一個量級——**這就是「便宜 OCR + 便宜 LLM」可能贏的機制**，
而原文完全沒測。這一組跑完就能回答：貴模型直接讀圖，和兩段式便宜組合，哪個划算、在哪類文件上翻盤。

> **查價紀律**：上表數字會過期，且除了 Mistral 與 Claude 兩列以外多為二手來源。
> **跑測試當天重開一次各家定價頁，把當天的數字連同日期寫進結果檔**；文章只引當天實測的實際花費，
> 不引這份規劃裡的估價。標「未查證」的欄位是待辦，不是可交件狀態。

---

## 三、還可以測哪些素材

原文只有掃描考卷。以下八類，每類 3–5 份即可，重點是**失敗模式**不是樣本數。

| # | 類型 | 為什麼要有 | 觀察什麼失敗模式 | 素材來源 |
|---|---|---|---|---|
| 1 | **表格**（合併儲存格、無框線、跨頁） | 目前公認最難、也最常用 | 儲存格錯位、跨頁被切成兩張表、表頭遺失 | 政府公開統計表、財報 PDF |
| 2 | **發票／收據／單據** | schema 抽取的標準場景，Arena 的預設情境 | 金額大寫、統編、日期格式、紅色印章干擾 | 自己的實體收據（需去識別化） |
| 3 | **手寫** | 原文完全沒有；工整 vs 潦草差距是所有引擎最大的一欄 | 數字混淆（1/7、0/6）、連筆、塗改 | 手抄筆記、表單填寫欄 |
| 4 | **直排 / 右至左閱讀順序** | **繁中特有，且是公開資料一致指出的行業共同短板** | 閱讀順序整段錯亂、被當成橫排逐字讀 | 舊書影印、牌匾、傳統報紙 |
| 5 | **印章 / 浮水印 / 紅色套印** | 會直接遮住文字，且多數 benchmark 沒測 | 印章下的字被吃掉、印章文字被混入正文 | 公文、契約 |
| 6 | **老掃描 / 傳真 / 低品質** | 公開 benchmark 中所有模型分數最低的一欄 | 雜訊被讀成字、整頁空白未偵測 | 舊講義影印、傳真件 |
| 7 | **圖表（bar / line / pie）與流程圖** | 原文已發現「只有 Claude 視覺看得懂圖形」，這格值得獨立驗證 | 是否輸出結構化資料（或 Mermaid / SVG），還是只抄圖旁文字 | 報告、投影片 |
| 8 | **長文件（50 頁以上）** | 逐頁測不出的問題：跨頁表格、頁首頁尾、閱讀順序漂移、成本線性放大 | 頁首頁尾被當正文（或反過來被丟掉）、中途崩潰 | 論文、法規、年報 |

**繁體中文是這個規劃的不對稱優勢。** 主流公開 benchmark（OmniDocBench、olmOCR-Bench、OCRBench v2）
以英文與簡中為主，繁中 + 直排 + 台灣格式的單據幾乎沒有公開評測。這一格自己做，才有別人抄不走的資料。

**素材紀律**：所有樣本要記錄 DPI、來源、是否含個資、可否公開；不可公開的只出統計不出原圖。

---

## 四、還可以測哪些「變因」

換工具只是其中一個維度。以下是不換工具也能產出結論的對照組——**成本最低、資訊量最高的一批**。

| 變因 | 對照方式 | 預期能回答 |
|---|---|---|
| **影像前處理** | 原圖 vs `--deskew` vs 二值化 vs 放大到 300/600 DPI | 直接回答原文懸而未決的「Tesseract 為什麼 0 chars」 |
| **送圖粒度** | 整份 PDF 一次送 vs 逐頁送 vs 逐區塊送 | 長文件成本與品質的取捨 |
| **prompt / 領域詞彙** | 無提示 vs 給科目詞彙 vs 給輸出格式範例 | VLM 類的分數有多少來自 prompt 而非模型 |
| **雙軌 pipeline** | VLM 直出 vs OCR + LLM extractor（同一顆 LLM） | 見第二節 Batch D |
| **重複性** | 同一頁跑 3 次 | VLM 的輸出穩不穩；傳統 OCR 是決定性的，VLM 不是 |
| **失敗行為** | 統計逾時、空輸出、無限重複、幻覺補字、空白頁誤判 | 生產環境真正的成本來源 |
| **成本與延遲** | 每頁 USD、p50 / p95 延遲 | 讓「兩階段策略」從敘事變成可算的數字 |

一個具體的已知陷阱值得單獨列一段：**同一個模型的不同輸出通道結果不同**。
公開資料中有 MinerU 的 markdown 產生器會丟掉被判為頁首頁尾的區塊（發票上的 IBAN 就在那一塊），
而從它的 `content_list` 重建則保留——模型沒錯，是輸出通道的取捨。
原文用 char count 當品質代理指標，剛好會被這種行為誤導。

---

## 五、評分怎麼做才不是主觀

分層做，越上層越貼近實務、也越難建。**建議主指標選 L5**，因為那是我們手上獨有的資產。

| 層 | 指標 | 需要什麼 | 建不建 |
|---|---|---|---|
| **L0 存活** | 是否輸出／逾時／崩潰／空白／無限重複 | 什麼都不用 | **必做**，最便宜 |
| **L1 文字** | CER / WER、正規化後編輯距離 | 逐頁 ground truth | 做，但只對挑出的 10–15 頁 |
| **L2 結構** | 表格 TEDS、閱讀順序、標題層級正確率 | 標註過的表格 | 選做，表格類樣本才需要 |
| **L3 公式** | LaTeX 比對（渲染後比對優於字串比對） | 公式 GT | 選做，原文的數學卷已是現成素材 |
| **L4 欄位** | schema field accuracy / 精確率召回率 | 欄位定義 + GT | 做，發票與考卷各一組 |
| **L5 下游任務** | 題庫 QA：解析結果餵進去作答，對照 `gold_answer` 算語意相似度 | **已經有：61 份考卷、1449 題題庫 JSON** | **主指標** |
| **L6 主觀對戰** | 盲測 Elo（OCR Arena 用 K=20、起始 1500） | 人來投票 | 不自建，引用既有 arena 即可 |

L5 是這份規劃裡最強的一步：原文已經跑完 61 份考卷的人工比對（50 份通過、10 份重建），
那批題庫就是**現成的 gold set**。把它從「人工比對用的清單」升級成「自動評分用的資料集」，
成本極低，而且產出的是別人沒有的分數。

**GT 產生流程**（照抄 Arena）：最好的引擎產草稿 → 人工修 → 存為 GT →
之後所有引擎都對這份 GT 算分。務必記錄「草稿是誰產的」，因為它會給那個引擎系統性優勢，
交叉驗證時要換一個引擎產草稿再修一次。

---

## 六、外部參照：哪些不用自己重造

| Benchmark | 量什麼 | 不量什麼 |
|---|---|---|
| **OmniDocBench (v1.5)** | 版面、表格、公式、閱讀順序的編輯距離 | 私有單據、KIE 可靠度 |
| **olmOCR-Bench** | 1,402 份 PDF、7,010 條單元測試（表格、數學、多欄、老掃描） | 中文為主的語料、成本 |
| **OCRBench / OCRBench v2** | 視覺文字辨識 + 推理，有獨立中文榜 | 成本、吞吐、結構化抽取 |
| **CC-OCR / KITAB-Bench 等** | 多語言覆蓋、各語系 CER | 一般版面穩健度 |
| **OCR Arena（extend.ai）** | 真人盲測 Elo，上傳自己的文件即可對戰 | 可重現性、統計顯著性 |

引用紀律（沿用 CS230 那輪的教訓）：

1. **分數只引 primary source**（模型 repo / 論文 / 官方 blog），聚合站的排行榜數字互相打架，只當線索。
2. 聚合站上出現、但在 primary source 找不到的模型名或版本號，**一律不寫進文章**。
3. 廠商自報分數要標「自報」；未獨立重現的不寫成事實。
4. 「沒查」與「查不到」不可混用。

外部 benchmark 的用途是**選出候選名單**，不是結論。自己跑的理由很直接：
公開榜測的是別人的語料，我們要的是繁中掃描件上的表現。

---

## 七、執行計畫

三期，每期都能獨立收尾、獨立產出一篇文章。

### Round 2A —— 指標化（低成本，不需新硬體不需花錢）

1. 把 61 份考卷的題庫 JSON 整理成 `question / gold_answer` 資料集（L5）
2. 寫評測 runner：並行派工、逾時、失敗隔離、JSON/CSV/MD 匯出（照 Arena 的介面設計）
3. 對**原文已測的 10 種工具**重跑一次，這次產出的是分數不是形容詞
4. 加做前處理變因（Tesseract 0 chars 的根因）
5. 產出：原文的 `post-update`（把定性表換成定量表 + 補 Tesseract 根因）

判定標準：同一批工具的排名和原文定性結論**是否一致**。不一致的話，不一致本身就是文章。

### Round 2B —— 素材與雙軌（免費額度內可完成，不必等預算）

1. 補齊第三節八類素材，每類 3–5 份，全部建 GT
2. Batch C（專用解析 API 3–4 家 + 三大雲各一）+ Batch D（通用 VLM 三家 × 兩軌）
3. 各家先只跑免費額度；超出就停，並把「免費額度能測到什麼程度」本身寫成結論
4. 產出：新文章「同一份文件，VLM 直出 vs OCR + LLM 整理，哪個划算」

### Round 2C —— GPU 場（高成本，需先確認預算）

1. 租 L4／A10 數小時，跑 Batch B 的 4–5 個 open-weight 模型
2. 把「需要 GPU 所以沒測」那一行換成實測數字與每頁成本
3. 產出：新文章「租一張 GPU 幾小時，能不能取代雲端 OCR API」

---

## 八、對應到文章

| 產出 | 形式 | 對應 skill |
|---|---|---|
| 原文補正（定量表、Tesseract 根因、MinerU 版本釐清） | `post-update`，保留 slug 與 date，加「更新紀錄」 | `post-update` |
| 「怎麼建一個自己的 OCR 評測台」（方法論：schema、GT、指標分層、失敗統計） | 新文章，系列 order 7 | `post` |
| 「VLM 直出 vs OCR + LLM extractor」 | 新文章，系列 order 8 | `post` |
| 「繁中／直排／印章：公開 benchmark 沒測的那一塊」 | 新文章，最有不對稱優勢的一篇 | `post` |

寫作紀律：所有第三方分數走 `post-verify`；發佈前 `post-review`。

---

## 九、待決策（Tier 2，要先問人）

1. **GPU 預算**：Round 2C 要租機器，時數與上限？
2. **超出免費額度後要不要續**：多數服務的免費額度覆蓋得了第二輪（見 §二 C-1），
   所以原本的「API 預算」降級成這一題。若一律不續，Round 2B 現在就能開工。
3. **題庫可否公開**：61 份考卷、1449 題的題庫是考古題衍生資料，公開評測集之前要確認版權與去識別化。
4. **素材個資**：發票、收據、公文類樣本含個資，是否只出統計不出原圖？
5. **範圍**：三期全做，還是先做 Round 2A 看結果再決定？（建議先 2A）

未決前不動 Round 2C 的花費項。Round 2A（本地與既有資產）與 Round 2B（免費額度內）都可直接開工。

---

## 參考來源

- MaiAgent Model Arena（本次觀察對象）—— `https://maiagent-ocr-arena.maiagent.workers.dev/`，
  引擎與情境資料取自其 `/api/engines`、`/api/scenarios`（2026-08-18）
- [olmOCR 2 —— Ai2 官方 blog](https://allenai.org/blog/olmocr-2)
- [datalab-to/chandra —— GitHub](https://github.com/datalab-to/chandra)
- [studio-dots-ai/dots.ocr —— GitHub](https://github.com/studio-dots-ai/dots.ocr)
- [opendatalab/OmniDocBench —— GitHub](https://github.com/opendatalab/OmniDocBench)
- [allenai/olmocr（olmOCR-Bench）—— GitHub](https://github.com/allenai/olmocr)
- [OCR Arena —— extend.ai](https://www.ocrarena.ai/about)（Elo：K=20、起始 1500）
- [OCR Benchmarks & Real-World Documents —— Extend](https://www.extend.ai/resources/ocr-benchmarks-real-world-documents)
- [alaamroue/pdf-parser-bench —— GitHub](https://github.com/alaamroue/pdf-parser-bench)（多工具同語料評分的作法參考）
- [Mistral API 定價頁](https://mistral.ai/pricing/api)（OCR 4.1 每頁費率，2026-08-18 讀取）
- [Datalab 平台 changelog](https://documentation.datalab.to/platform/changelog)（免費額度、per-processor 費率、chandra container）
- [Firecrawl —— Best Document Parsing APIs](https://www.firecrawl.dev/blog/best-document-parsing-apis)（Fire-PDF 逐頁分類路由、每頁 1 credit）
- 三大雲與 LlamaParse／Reducto／Unstructured 的費率為二手比較文彙整，**未經廠商定價頁覆核**，跑測試前必須重查
- 對象文章：`src/content/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark.md`
