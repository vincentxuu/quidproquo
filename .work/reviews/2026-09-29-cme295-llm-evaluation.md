# 審稿紀錄：2026-09-29-cme295-llm-evaluation（zh + en）

## 2026-11-23：依 2026 第 7 講錄影與投影片改寫「2026 版改了什麼」

範圍：「2026 版改了什麼」整節、開頭 2026 版提示段、tldr 追加句、課程影片來源、更新紀錄、參考資料。一手資料與查證紀錄在 `.work/cme295-2026-l7/`（`evidence.md`）。

審稿方式：另開獨立子代理，只給 diff 與一手資料（2026／2025 投影片逐頁文字、2026 錄影機器轉錄稿、課表），逐條核對事實、中英一致、查證過程外洩、zh-TW 用語、與 2025 正文是否矛盾。

### 必須修（已修）

1. 漏寫 2025 的評估面向清單與事實性分解評分在 2026 刪除，開頭提示段又說評審段大致相同 → LLM-as-a-Judge 小節加一條「事實性評分刪掉了」，提示段改成「但事實性評分那節拿掉了」。
2. 「v4.2 到 v5.0.1 成分幾乎全換」說過頭（投影片 p125：AA-Omniscience、AA-Briefcase、GDP.pdf、CritPt 都保留）→ 改成「成分有換有留，多項升版，權重也重新分配」。

### 建議改（已採納）

- cons@k 的用途改標為錄影說法（投影片 p25 只有定義）。
- 刪掉「評分準則寫清楚改由調整流程處理」這個沒有出處的因果。
- Elo：整段推導課堂沒講，改寫成「只在投影片裡」。
- 資料污染：補「這個顧慮在 2026 併進 benchmaxxing 那段」。
- 小標「刷的不只是模型」改為「指數也跟著改」，內文明寫指數方回應使用者觀感。
- METR 調查點名 OpenAI／Hugging Face 事件；GitHub 改 GitHub／GitLab。
- 用語：「逐條依二元 rubric 判過或不過」、「拆成幾個可量化的面向」、「掩蓋瑕疵」、「最後一講」（避免讀成期末考）。
- 2025 結尾不只 Chatbot Arena，還有「自己試幾個模型」。

英文版同步套用同樣修改。

### 審稿確認無誤的部分（摘要）

章節與日期、開場三類指標與四個難處、kappa 0.8、pass@k／pass@1／cons@k、評審好處四條、調整評審四步與口述細節、五條原則、decision models、agent 段沿用與 time horizon、刪除清單（2026 投影片 grep 皆 0 筆）、綜合指數權重、四個 benchmark 的題數與設定、MaxxBench、三種補救、BenchGuard、作弊四列、Pareto 軸、Goodhart、Arena 推導與四條限制、實務段落 p160–169；中英語意一致；正文無查證過程；無中國用語。

### 檢查

- `node scripts/check-process-leak.mjs`（兩檔）：通過。
- `node scripts/check-lang-parity.mjs`：本篇無問題（全站唯一一筆在 cme295-ai-agents，非本次範圍）。
- `pnpm check:course-videos`：本篇無問題（兩筆問題都在 cme295-ai-agents）。
- `pnpm check:references`：本篇無錯誤或警告。
- `pnpm emoji:fix` + `pnpm check:no-emoji`：無 emoji 在程式碼區塊外。
