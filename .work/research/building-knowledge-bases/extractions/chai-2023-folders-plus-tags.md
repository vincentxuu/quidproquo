# 2020–2026 標籤 vs 資料夾／多重分類實證研究搜尋 — 選定 Chai, Zhang & Yi 2023

> 讀取狀態：**abstract／blocked**。選中的那篇正文沒讀到，下面只有摘要層級的資訊，不能當成已精讀的證據使用。

## 搜尋紀錄（mcp__exa__web_search_exa，2026-10-22）

1. 查詢："empirical study 2021 2022 2023 2024 tags versus folders personal information management retrieval efficiency multiple categorization user study"
   - 2020 後的結果只有：Chai, Zhang & Yi 2023（Advanced Design Research，資料夾 vs 資料夾＋標籤）、Chaudhry & Alajmi 2022/2024（科學家 PIM 質性訪談，只提到資料夾與關鍵字搜尋，沒有比較標籤）、Najork 等 2024（搜尋個人集合專書章節，已另有抽取紀錄）、Feng, Ding & Liu 2025（跨裝置檔案管理的導覽模式，LNCS，只有書目）。其餘為 2008–2018 舊研究（Bergman 2012/2013、Gao 2011、Bergman 2018 nudge）。
2. 查詢："study of how users organize notes in note-taking apps (Obsidian, Evernote, Notion) using tags, folders and links, empirical analysis of personal knowledge base vaults"
   - Horváth 2024（CogInfoCom，Obsidian 高教個人化整理策略，只有片段）、Ferreira et al. 2025（Obsidian 研究者案例，已另有抽取紀錄 ferreira-2025-second-brains-obsidian.md）、Bauer 2016（Evernote 論壇內容分析，德文，2016 年非區間內）、Willett et al. 2015（Evernote 筆記 metadata，非區間內）。
3. 查詢："CHI or CSCW paper 2020-2025 user study tagging vs hierarchical folders re-finding personal files or notes, controlled experiment, open access pdf"
   - 沒有新的 2020 後比較實驗；只回到 Voit 2011/2012（tagstore）、Whittaker 2011、Bergman 2012/2014 等舊文，以及 Balogh & Billingsley 2025（個人紀錄管理原型試用，以資料夾分類為主，不是標籤 vs 資料夾比較）。
4. 查詢（針對 Chai 正文）："Chai Zhang Yi 2023 single-organization folders only versus multi-organization folders plus tags designers NASA-TLX retrieval task results participants experiment method" → 只回摘要與參考文獻。

結論：2020–2026 年直接比較「標籤 vs 資料夾」或「多重分類 vs 單一分類」找回效率的對照實驗很少；唯一找到的是 Chai 2023，而且情境是設計師的靈感素材，不是筆記軟體。筆記軟體方面只有質性案例研究（Ferreira 2025、Horváth 2024），沒有量化找回效率。

## 書目（選定）

- Chai, C., Zhang, X., & Yi, X. (2023). Research on the influence of organizational form of inspirational information in conceptual design: Workload and creativity. *Advanced Design Research*（Elsevier／浙江大學）。DOI 10.1016/j.ijadr.2023.09.002；PII S2949782523000178；線上 2023-10-09。OpenAlex 標為 OA（hybrid）。
- 實際讀的版本：摘要＋參考文獻清單（exa web_fetch 的 ScienceDirect 頁）。正文未取得。未建立全文檔。

## 設計（僅摘要層級）

- 實驗比較兩種靈感素材組織方式對概念設計階段的影響：single-organization（只用資料夾）vs multi-organization（資料夾＋標籤）。
- 量了：工作負荷（參考文獻含 NASA-TLX，推測用此量表）、找回過程的心智與時間需求、設計方案的創意（新穎性等）。
- 受試者人數、任務、找回時間的具體數字：未讀到。

## 可引用結果（摘要原句，未經正文驗證）

- "The use of tags in the multi-organization form facilitates a more in-depth and involved processing of inspiration information, and significantly improves the effort score."
- "In addition, it reduces the mental and temporal demands in the retrieval process and does not add too much workload to the subjects."
- "The results show that by using a multi-organization method, the novelty of design solutions can be improved."

## 作者限制

- 未讀到正文，無法列出。

## 與摘要或常見轉述不一致處

- 比較的是「資料夾 vs 資料夾＋標籤」，不是「資料夾 vs 純標籤」；不能拿來反駁或支持 Bergman 2013「純標籤找回較慢」。
- 摘要說「significantly improves the effort score」：NASA-TLX 的 effort 是負荷分項，分數「提高」字面上是負荷變大，作者卻把它寫成正面（更深入處理）。未讀正文前，這句的方向與含義要保留。
- 摘要說找回的心智與時間需求降低，但沒有報找回時間或成功率；「需求降低」是自陳負荷，不等於找回更快。
- 情境是設計靈感素材（多為圖片）＋創意任務，外推到文字筆記知識庫需謹慎。

## 讀取紀錄（逐管道失敗原因）

1. Unpaywall API：回 None（無紀錄）；OpenAlex：is_oa true、hybrid，但 pdf_url 為空、any_repository_has_fulltext false。
2. curl -L doi.org → linkinghub.elsevier.com（2.7 KB 轉址頁）；ScienceDirect /pdfft 與 /pdf → 403。
3. Crossref 給的 api.elsevier.com text/plain 連結 → 400 INVALID_INPUT（需 API key）。
4. mcp__exa__web_fetch_exa（ScienceDirect 文章頁）→ 只回摘要、作者、參考文獻。
5. mcp__tavily__tavily_extract（advanced, text）→ 空結果。
6. Playwright 開 ScienceDirect → Cloudflare "Just a moment..." 403，等 8 秒仍卡住；已關閉並刪除本次 .playwright-mcp 暫存檔。
7. Cloudflare browser rendering MCP（get_url_markdown）→ 伺服器未連線。
8. Groundlane、jina、linkup：同 Bergman 2013 紀錄（未連線／額度用完）。firecrawl 依指示不使用。

## 後續線索（未精讀，勿直接引用）

- Willett et al. 2015 "Understanding Digital Note-Taking Practice"（Evernote API metadata，35 人、12,982 筆筆記）：exa 片段寫「只有 8/35（約 23%）在超過一半的筆記上用標籤」「重度用標籤者也是搭配筆記本使用，不是只用標籤」。2015 年，不在 2020–2026 區間，但與本題最相關；PDF 在 petra.isenberg.cc，可另派精讀。
- Bauer 2016（Evernote 論壇內容分析）：摘要說沒有顯著偏好標籤或資料夾，而是偏好兩者並用。
