# 站內文章摘要：order 19 可連結的三篇評估文

讀取：三篇中文版全文（2026-10-22），行號為檔案行號。英文版同 slug 加 `-en`，未讀。

## 1. RAG 評估框架與工具選型：Promptfoo、RAGAS、DeepEval、TruLens

- 檔案：src/content/posts/ai/2026-03-12-rag-evaluation-frameworks.md（452 行；date 2026-03-12，updated 2026-08-30；系列「RAG 技法大全」order 37）
- 連結：/posts/ai/2026-03-12-rag-evaluation-frameworks
- 要點：
  - 行 23–37：沒有指定工具的業界標準（NIST AI RMF、ISO/IEC 42001 只要求衡量）；評估分 Retrieval／Generation／Operation 三層，「不要平均成一個總分」（行 37）。→ order 19「分開評」可直接連這段，不重講。
  - 行 45–48：CI 分兩級——PR 必跑 deterministic checks（必要 slug、禁止來源、延遲），model-graded 每日跑、先不擋部署。
  - 行 134–139：RAGAS 限制：judge 換了分數就漂、英文 prompt 要做語言適配、Context Recall 需 reference、成本高。
  - 行 340–361：golden dataset 與每次 run 的產物分開存；production feedback → 人工 triage → 加成有固定 ID 的 regression case（行 361）。→ order 19 回流流程可連這段。
  - 行 363–378：Ask AI「有哪些課程文章」事故：D1 裡有資料、問題在 retrieval（泛詞展開占滿 top-k、同篇 chunk 重複）；寫成 regression contract（行 369–374）。可作 order 19 的例子（真實事故 → 一題）。
  - 行 378：截至 2026-08-30，live eval 沒進 CI；既有分數是 deterministic scoring，不是 model judge。
  - 行 384–392：每週抽 100 個 production 查詢跑評估、指標下降觸發告警（作者流程示意，非實測）。
  - 行 409：「先建立 20 個能重現真實失敗的案例」——與 order 19 的「20 題題庫」例子對得上。
- 要注意的不一致：
  - 行 54、58–94 把 context precision／context recall 列為 RAGAS「四個核心指標」，但 Es et al. 2024 論文只定義 faithfulness、answer relevance、context relevance 三個；四指標是之後函式庫的。order 19 若引用論文，要寫三個。
  - 行 425 參考資料標 RAGAS 為 "(2023)"；正式出版是 EACL 2024 demo。

## 2. 私有語料 Retrieval Eval 實測：先把繁中題庫變成可重跑的 benchmark

- 檔案：src/content/posts/ai/2026-08-22-private-corpus-retrieval-eval.md（131 行；系列「私有語料管線」order 4）
- 連結：/posts/ai/2026-08-22-private-corpus-retrieval-eval
- 要點：
  - 行 18–20、62–69：repo 有 20 題 golden dataset，但沒有 qrels、run、延遲原始值，「benchmark 尚未執行」，表格全是破折號。→ order 19 不能引這篇當「實測數字」。
  - 行 26–44：檢索評估需要文件或 chunk 層級的 qrels（0–3 分級），ID 用 canonical ID；單位（chunk vs 文章）不能算分時臨時換。
  - 行 46–56：Recall@k、MRR、nDCG@k、p50/p95 延遲、ACL violation count 各答不同問題，不壓成總分。
  - 行 89–97：繁中切片（中英混寫術語、繁簡、全半形、知識庫外題、權限切片）；20 題只適合 smoke test。
  - 行 99–111：錯誤分類表（annotation gap、lexical miss、semantic miss、ranking miss、stale hit、ACL leak、corpus gap）。→ order 19 回流時「失敗類型 → 誰修」可直接用；annotation gap 對應 Salemi 2024 的反證。
  - 行 113：知識庫外題不能用 Recall@k 硬算，要分開報。→ 呼應 Azure negative examples、Peng 2024。
  - 行 115–121：五步可重跑執行順序（凍結 manifest → 雙人標 qrels → 跑配置 → script 算分 → 逐題標錯誤類型）。

## 3. Ask AI Retrieval Eval 怎麼做：Golden Contract、Fixture、Live Run 與證據邊界

- 檔案：src/content/posts/ai/2026-08-30-ask-ai-retrieval-evaluation.md（181 行；系列「Ask AI 實戰」order 9）
- 連結：/posts/ai/2026-08-30-ask-ai-retrieval-evaluation
- 要點：
  - 行 24–31：四種證據分開放：golden contract、offline fixture、live output、production observation。
  - 行 63：fixture 全綠只證明 harness 可重現，不證明 retriever 找得到。
  - 行 86–96：baseline 的 contextRecall／answerRelevance／faithfulness 名稱要照實解讀——都是 deterministic heuristic，不是模型評審。
  - 行 98–110：q21 retrieval contract（四篇必要來源、兩篇禁止來源、≥4 個不同來源、≤30 秒、不走快取）。
  - 行 112–121：從新事故增加 case 的六步（固定 ID、寫 answer points 而非逐字答案、只放可驗證的 expected sources、加 forbidden claims、獨立 fixture）。→ order 19「失敗案例回流」的題庫端操作可連這段。
  - 行 136–140：q21 production 觀察（26.821 秒、8/8 項）未提交 raw artifact，不能當延遲 benchmark。
  - 行 144–155：promotion gate 讀 artifact。
- 用法提醒：這篇是站內 Ask AI 的工程記錄，數字只有一筆 production 觀察，不能當 order 19 的評估結果例子。

## 對 order 19 的整體建議

- 「不講評估框架比較」→ 連文章 1。
- 「qrels 與指標定義」→ 連文章 2（行 26–56），order 19 只講怎麼跑一次與怎麼讀。
- 「事故變題目」→ 連文章 1 行 361–374 與文章 3 行 112–121。
- 三篇都沒有一份真正跑完的檢索評估數字；order 19 的「20 題一次評估結果」例子需要另做或明寫為示意。
