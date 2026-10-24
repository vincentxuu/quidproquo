# 抽取紀錄：Ahmed, Galke Poech & Röttger (2026) Stale-Document Poisoning: When Outdated Retrieval Overrides Correct Model Answers

read_status=full（arXiv v1 PDF 全文 17 頁，正文＋附錄 A–P、Table 1–15 全讀）

## 書目

- Md Shamim Ahmed、Lukas Galke Poech、Richard Röttger（University of Southern Denmark）
- arXiv:2609.31342 v1，cs.CL，2026-09-25 提交。17 pages, 3 figures。預印本，未見同儕審查發表資訊。
- 讀取方式：curl https://arxiv.org/pdf/2609.31342（789,252 bytes）→ pdftotext -layout → o18-stale.txt（1,008 行，109,438 bytes），已讀 1–1008。abs 頁另存 o18-stale-abs.html。
- 目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 行號指 o18-stale.txt（雙欄排版，同一行可能混兩欄文字）。

## 研究設計

- Benchmark：317 個「知識反轉」（medicine 87、law 100、software/API 60、platform policy 70），每題有現行答案與已被取代的舊答案，各配一份同格式文件，取自有日期的官方來源（行 138–141、552–560）。
- 「中毒」定義是條件式的（行 129–131、595–606）：只算模型不給文件時答對、給了一份過時文件後答錯的題；分母是各模型各領域「不給文件就答對」的題數，所以每格 n 不同。「答錯」含 unclear（行 731）。
- 文件不是真的檢索出來的：中毒實驗把一份過時文件直接塞進 context（行 574–575）。只有 3.5 節／附錄 N 的防禦實驗才用真的檢索（每題一份新文件＋兩份舊文件，all-MiniLM-L6-v2，行 847–851）。
- 指令強度四檔（行 583–594；Table 10）：organic（「Retrieved documentation from {year}」、無指示）→ document-only（「Most current retrieved documentation」標頭、無指示）→ consider → instructed（「if it conflicts with prior knowledge, follow the dated documentation」）。
- 模型：12 個（GPT-4o、GPT-4.1、Claude-Opus-4.5、Claude-Sonnet-4.6、DeepSeek-V3/R1、Qwen2.5-7B/72B、Llama-3.1-8B/70B、MedGemma-4B/27B）；跨領域只跑 Qwen 與 Llama 四個開源模型；另做 GPT-5.5 壓力測試（行 175–186）。
- 自動評審：GPT-4o 三分類；另一家族模型重判 840 筆 κ=0.93；200 筆人工盲標（兩位 PhD 學生，初始一致 76.0%、κ=0.621，48 筆仲裁），評審對人工 92.5% 準確（95% CI 88.9–95.9%）、macro-F1 0.894（行 187–223；Table 2 行 671–682）。policy 領域評審準確只有 0.84、unclear 類 F1 0.533（行 677）。

## 可引用結果（數字照原文）

1. 摘要的 30%／37% 與 66%／75%（行 330–340；Table 12 行 876–884）：來自 2×2 prompt 因子實驗，只在醫學子集、Qwen-7B（n=51）與 Llama-8B（n=53）。中性標頭、無指示：Qwen .373、Llama .302；中性標頭＋「照文件」指示：Qwen .745、Llama .660。OR 4.92（95% CI 2.59–9.34）與 4.50（2.46–8.23）。兩模型各 19 題變錯、0 題變好（McNemar p=3.8×10⁻⁶）。
2. 「most current」標頭本身（行 776–781）：無指示時讓 Qwen 中毒上升（OR 2.61），Llama 不顯著（OR 1.19）；有指示後標頭無額外效果。
3. 跨領域（Table 5 行 749–756，instructed 條件）：醫學 0.661–0.906、法律 0.200–0.618、軟體/API 0.167–0.354、平台政策 0.410–0.541。整體 17–91%。Llama-70B 醫學 0.906（58/64），軟體 0.167（7/42）。
4. 指令梯度（Table 10 行 862–870）：organic 條件下，Qwen-7B 醫學 .360、法律 .436、軟體 .292、政策 .405；Llama-8B 醫學 .302、法律 .167、軟體 .158、政策 .146。instructed 在 8 個模型×領域格都高於 document-only，但只有 3 格個別檢定 p<0.05（行 697–701）。
5. 新文件幾乎都會被採用（行 634–642；Table 6）：醫學 87 題換成匹配的新文件，沒有任何原本答對的題變錯；四個模型 87/87、Qwen-7B 與 Llama-8B 86/87；原本答錯的題被新文件救回 97–100%。
6. 越新的變動越難（Table 4 行 732–744）：12 模型在「早已定案」的醫學反轉接近滿分，最近的反轉降到 0.61（Qwen-7B）–0.90（DeepSeek-V3）；10/12 經 BH 校正仍顯著。
7. GPT-5.5（行 180–186；附錄 O 行 888–896）：不給文件答對 0.92–1.00，一份過時文件推翻 74/83 醫學答案（0.89）；code 2/18、policy 2/15、law 12/46，非醫學樣本小，作者說是壓力測試不是盛行率。
8. 只有日期不夠，明講失效界線才夠（Table 7 行 793–801）：同一份文件只換評估日期，date-only 的「適用性差距」.04–.14；寫出「此建議自某日起不再適用」後，Qwen-72B 1.00、Llama-70B .94（散文）/1.00（表格）；7B/8B 只到 .18–.42。
9. 認出過時也不代表不照用（行 317–320；Table 13 行 918–921）：Qwen-7B 把 76/87 份過時文件標成「uncertain」、Llama-8B 87/87 標成 superseded（但也把 39 份新文件誤標 superseded），之後照樣中毒（failure 36/49、35/53）。
10. 檢索端防禦（行 322–335；附錄 N 行 840–910；Table 14 行 932–944）：固定規則 s=0.5·cos+0.5·年份新舊+0.1·取代用語，日期正確時中毒降 4.6–10.0 個百分點（4 格中 3 格 p<0.05）；日期缺失只降 1.0–4.0 點或微升 1.1 點；日期錯誤時選到新文件的比例「falls to zero in every domain」，比不排序還差。理想化的 recency rule 可把 GPT-4o 16/66→0/66、Claude 27/77→0/77，作者明說「not the realistic defense estimate」。

## 可引用原句

- 定義（行 38–43）："it becomes harmful simply because the conditions under which it was valid have changed."
- 實務意涵（行 444–445、386–391）："publication date and applicability are different kinds of metadata." "Reliable retrieval systems should therefore represent temporal validity explicitly where possible—for example, through effective dates, supersession relations, or validity intervals"
- 評估盲點（行 404–408）："Retrieval should be evaluated in both directions … whether superseded evidence can harm a model that was already correct."

## 與範圍卡（Order 18）不一致處

- 範圍卡：「過時文件會翻轉 30–37% 答案，要求『照文件答』時更高」。需要加三個限定，否則會被讀成「RAG 系統平均三成答案被翻」：
  1. 30%／37% 只是醫學子集、7B/8B 兩個小模型、約 50 題，而且是「原本答對的題」的條件比例。
  2. 過時文件是直接塞進 context，不是檢索競爭的結果；真實系統裡過時文件要先被檢索到、而且常與新文件並存。
  3. 領域差很多：軟體/API 在 organic 條件只有 15.8%–29.2%，instructed 也只有 16.7%–35.4%；醫學最高。
  - 「要求照文件答時更高」成立：66%／75%（同樣醫學、小模型），OR 約 4.5–4.9。
  - 建議寫法：「一篇 2026 年預印本把一份過時文件放進 context：原本答對的醫學題，兩個 7B／8B 開源模型各有約三成被翻錯（30%、37%），加上『照文件答』的指示升到 66%、75%；軟體類題目較低（約 16–35%）。」
- 「為什麼要刪」的直接證據是第 5 點的反面：新文件幾乎 100% 被採用，所以問題不是模型不用檢索，而是舊文件還在。

## 限制

- 預印本、單一團隊、未見同儕審查；GPT-5.5 與非醫學格樣本小。
- 中毒只算「本來答對」的題；答錯本來就錯的不計，所以不是整體錯誤率。
- 每份檢索集只放一份新兩份舊，與真實知識庫比例無關。
- MedGemma 的執行 SHA 沒記錄（行 562–564）；48/87 醫學來源頁沒能自動存檔（行 570–573）。
- 不涉及刪除流程本身；它說明「舊文件留著會怎樣」，不是「刪除怎麼做」。

## 對 order 18 的用法

- 回答「為什麼要刪／為什麼要更新」：舊文件不是惡意文件也會翻掉答案；系統提示寫「依文件回答」會放大。
- 支援「metadata 要有生效日／被誰取代」而不只發布日期，可接 order 15 metadata。
- 反證面：日期 metadata 錯了，按新舊排序反而更糟——不能把「按日期加權」當成刪除的替代品。
