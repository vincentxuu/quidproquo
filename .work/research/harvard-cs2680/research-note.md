# Harvard CS2680 Part I 研究筆記（規劃用）

研究日期：2026-10-21
系列 slug：`harvard-cs2680`
規劃表：`.work/series-plans/harvard-cs2680.md`
逐堂拆解（本筆記的底稿）：`lectures-01-04.md`、`lectures-05-08.md`（同目錄）
原始素材：`sources/slides/*.pdf|txt`（8 份講師 deck＋A3 說明 deck）、`sources/pages/*.html|txt`（首頁、policy、project、discussion、A1–A3、readings 六頁、三份 notes、computing 頁）

## 母群定義

CS2680 Fall 2026（cs2680.com，講師 Juncheng Yang）**Part I（9/2–10/14）講師主講、有公開投影片的堂次**，加上 Part I 期間發布且頁面公開的作業（A1–A3）。
不算：學生主講場次（9/21、10/14）、客座（10/5 Snowflake）——三場都沒有投影片或筆記；Part II（10/19 起）——截至 2026-10-21 沒有投影片；A4、A5——頁面 redirect 到 `/to_release`。

掃描方法：抓首頁課表 HTML，逐列列出 slide／readings／notes 連結；猜測未掛連結的檔名（`9_serving_1.pdf` 等 6 個）全 404；作業頁 1–5 逐一抓。不是從「已知」挑，課表就是母群。

## 覆蓋矩陣

| 維度 | 值 | 素材 | 缺口 |
|---|---|---|---|
| 活動類型 | 講師講課 | L1–L8 共 8 份 deck ✅ | — |
| 活動類型 | 作業 | A1、A2、A3 頁面 ✅＋A3 deck ✅ | A4、A5 未公開 |
| 活動類型 | 學生／客座 | 9/21、10/5、10/14 | 無素材；10/14 只有 18 篇閱讀清單 |
| 層次 | agent 使用者視角 | L2、L3、A1 | — |
| 層次 | agent 設計者視角 | L4–L8、A2、A3 | — |
| 層次 | serving 系統 | L1 只預告 | Part II 待公開 |
| 課堂口述 | 錄影 | policy 頁：不錄影 | ⚪ 確認無公開錄影；底本只有投影片＋課程頁 |

## 偏誤

- 只有投影片沒有口述：投影片上的一句話（例：L2 p12「prefix-cache reads 佔大部分成本」）背後的說明拿不到，文章要自己補橋接，並標成本文說明。
- 課程頁的閱讀摘要是 AI 生成（readings 頁每篇都有 Background/Problem/Key idea 格式）；L6 的部分摘要提到 deck 沒有的內容，疑似沿用其他版本。寫文時以 deck 和原論文為準，不引用這些摘要。
- 大量 Claude Code 產品行為（`/goal`、`/loop`、`ultracode`、agent teams、auto memory）會隨版本改變，寫文當天要對照官方文件。

## 一手來源讀取盤點

| 來源 | 程度 | 備註 |
|---|---|---|
| L1–L8 deck、A3 deck | ✅ 全文（pdftotext＋關鍵圖頁渲染） | PDF 頁序 ≠ 投影片印的頁碼，引用用 PDF 頁序 |
| 首頁、policy、project、A1、A2、A3 頁 | ✅ | 配分三套說法，以 policy 頁為準 |
| notes：agent-evaluation、cost-effective-agents | ✅ 全文 | eval note 含 pass@k 不偏估計、paired bootstrap |
| notes：transformers | ✅ 大綱 | 被取消的 LLM 背景課替代閱讀，首頁入口被註解掉 |
| readings 已開：Claude Code best practices、Simon Willison agentic engineering patterns、agent teams 文件、OpenAI research acceleration、Codex evidence paper、ReAct、OpenAI practical guide、Lewis（arXiv 2608.26218）、Anthropic multi-agent research system、Cognition Don't Build Multi-Agents、arXiv 2512.08296、arXiv 2509.25370、MemGPT、OWASP Agentic Top 10 | ✅ 確認身分與主旨 | 逐篇動筆前再讀與該篇主張相關的段落 |
| 其餘 readings | 🟡 只有標題 | 不是規劃階段的缺口：每篇動筆前依範圍卡讀該篇引用的那幾篇 |
| L4 p26 SWE-agent 消融圖 | ⚪ 投影片未標出處 | 寫 L4 時去 SWE-agent 論文（arXiv 2405.15793）找原圖；找不到就不用數字 |
| Superpowers、Caveman 兩個 plugin | 🟡 投影片有、閱讀清單沒有 | 寫 L3 前讀兩個 repo 的 README／SKILL.md |

## 跨堂觀察（影響規劃）

1. 原本預告的「LLM basics」堂次被延後（L2 p2），L2–L4 把 LLM 當黑盒，但 L4 p42、L8 都用到 prefill/decode、prefix cache。
2. L3 一份 deck 有四段（plugin 案例、多 agent 擴展、Programming 3.0 與不確定性、OpenAI 使用數據）；L8 前後兩半無轉場（成本／速度 vs harness 架構＋8 個 harness 比較）。
3. 主題在相鄰兩堂之間漂移：L5 的 plan 列了 memory，實際在 L6 講；L7 的 plan 列了 cost，實際在 L8 講。
4. 螺旋主題：memory（L2→L4→L6→L8）、成本（L2→L7→L8）、失敗分類（L5 分解失敗、L6 五層歸因、閱讀 MAST）。
5. 站上重疊：CMU 11-768 AI Agents（loop、tool、context、memory、eval 各有對應篇）、Claude Code 深入介紹、Multi-Agent 系統實戰、CMU 11-868（KV cache）。依「課程系列各自講完整」原則，重疊處只加延伸連結。

## 研究足夠的五關（規劃階段）

1. 一手來源：每堂的主張都來自讀過全文的 deck；作業規格來自讀過全文的作業頁。✅
2. 證據類型：投影片多是講者整理的設計框架（作者主張）。帶實證數字的有 Lewis 2× harness、SWE-agent 消融、Codex/OpenAI 使用數據、L7 benchmark 數字、L8 學生 session 資料，已在範圍卡標「需回原論文」。✅（規劃層級）
3. 時效：課程本身是 2026 秋季，閱讀多為 2025–2026。✅
4. 反證：課程自己放了反方（Cognition〈Don't Build Multi-Agents〉對 L5、L4「有些 prompt 技巧已過期」）；其餘各堂的反證在動筆前補搜（關鍵字見範圍卡）。🟡 規劃層級可接受，逐篇關卡
5. 飽和：母群是課表本身，已逐列掃完、未掛連結的投影片檔名也試過。✅
