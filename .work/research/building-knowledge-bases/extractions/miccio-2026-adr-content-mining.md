# 抽取紀錄：Miccio, Tommasel & Diaz-Pace 2026, A Text Mining and Classification Approach for Analyzing Architecture Decision Records

read_status=full（arXiv 2609.07375v1 預印本全文，16 頁；投稿處未標示）

角色：order 8 的反證／限制——有模板也不保證寫出「考慮過的選項」與「決策驅動因素」；ADR 常只記結論。

## 書目

- 作者：Nicolas Miccio、Antonela Tommasel、J. Andres Diaz-Pace（ISISTAN, CONICET-UNCPBA, Argentina；Tommasel 另屬 JKU Linz）
- arXiv:2609.07375v1 [cs.SE] 2026-09-07
- 資料與程式：https://github.com/tommantonela/ADRminer（未開）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o8-adr-textmining-2026.txt（pdftotext 非 layout，909 行，50,939 bytes）

## 設計、樣本、量了什麼

- 資料：Buchgeher 2023 資料集（2013–2020，行 297）。原 867 個可取得專案、6,061 份 ADR → 去重、去非英文、去純模板、去「少於 5 份 ADR 或平均短於 500 字元」的專案 → 547 個專案、4,316 份 ADR（行 306–312）。
- 方法：BERTopic 主題模型；GPT-4.1-mini（temperature 0）依 Kruchten、Zimmermann 分類與品質屬性分類；LLM-as-a-judge 檢查五個 MADR 段落的存在、替代標題、內容品質、用途一致性（行 433–441）。
- 驗證：人工標 200 份 ADR 當 ground truth（兩人各 125、重疊 50，行 358–360）；LLM 與人工一致率 46%–66%（行 408–421）；LLM-as-judge 抽 100 份人工複查（行 451–462）。

## 可引用結果（行號指 o8-adr-textmining-2026.txt）

1. 寫了什麼決策（行 698–739）
   - Kruchten 分類：existence 64%、executive 18%、property 14%、少量 non-existence（行 698–699）。
   - Zimmermann 分類：近 40% design、約四分之一 technology、約 20% organizational/process（CI/CD、changelog、審核流程、測試、feature flag）（行 733–737）。
   - 「ADRs are often used to document not only product-level architectural choices, but also decisions related to development and governance practices.」（行 737–739）——對「ADR 可以拿來記非架構的團隊決策」是支持證據。
2. 模板欄位的實際使用（行 756–764）
   - 「The Context and Problem Statement and Decision Outcome sections were generally present, correctly placed, and contained relevant content.」（行 756–757）
   - 「Decision Drivers were frequently misplaced (e.g., in the context or decision sections) and often lacked substantive content.」（行 758–759）
   - 「The most problematic section was Considered Options, which is mandatory in the MADR template ... This section was absent or misplaced in most ADRs and, when present, often failed to fulfill its intended purpose.」（行 759–760）
   - 摘要：「alternatives, decisions drivers, and some quality concerns remain under-documented」（行 20–21）
3. 對實務的意涵（行 786–791）
   - 「ADRs from open-source repositories should not necessarily be treated as exemplary documentation artifacts. Teams adopting ADR practices may unintentionally inherit incomplete documentation habits that emphasize solution choices while neglecting rationale and trade-offs」（行 786–788）
   - 建議在 PR 審 ADR、注意被省略的段落（行 789–791）。
4. 省略原因只是推測（行 795–799）
   - 時間壓力、輕量習慣、或「理由已在 code review／issue 裡」——「Although these explanations remain hypothetical」（行 798）。

## 作者限制（行 806–834）

- 結構偵測主要靠段落標題，可能漏掉自訂格式（行 809–810）。
- 單一標籤分類，會抹掉次要類別（行 816–818）。
- 只看英文、公開 GitHub、Markdown；40% 專案來自 2020 年（資料最後一年），需要 2021 後的資料（行 827–834）。

## 沒寫的事

- 正文沒給 Figure 5 的各段落百分比（「most ADRs」缺 Considered Options 是多少，只在圖裡；圖是圖片讀不到）。引用只能用「多數」，不能給數字。
- 沒區分用 Nygard 模板與用 MADR 模板的 ADR——Nygard 本來就沒有 Considered Options 欄，若多數 ADR 用 Nygard（Buchgeher：約 75% repo），「缺選項」有一大部分可能只是「模板沒要求」。作者把所有 ADR 都拿 MADR 標準檢查，沒討論這個混淆。這是我讀全文後的判斷。

## 與摘要或常見轉述不一致處

- 「ADR 不寫替代方案」：證據是 LLM 判讀，人工一致率只有 46%–66%（分類任務；段落檢查的一致率另以 100 份人工複查，沒給數字）。
- 摘要說檢查「the degree to which ADRs adhere to the MADR template」，但資料集裡多數是 Nygard 格式（見上），「不符 MADR」不等於「寫得不好」。
- 摘要說 "≈ 550 open-source repositories"，正文是 547（行 312）。

## 限制

- 預印本，未同儕審查。
- LLM 分類與判讀有誤差，作者承認 executive／existence 常混淆（行 721–722）。

## 讀取紀錄

- 管道：arXiv API 搜尋找到 → `curl -sL https://arxiv.org/pdf/2609.07375` → 200 PDF → `pdftotext`（非 layout）。
- 一次讀完行 1–909（含 Table 1–3 文字、參考文獻）。Figure 1–5 為圖片，只讀到圖說。
