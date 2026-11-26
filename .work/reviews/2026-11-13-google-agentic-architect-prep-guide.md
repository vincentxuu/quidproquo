# 2026-11-13-google-agentic-architect-prep-guide 中英審稿紀錄
日期：2026-11-13。稿件為本機 draft false；未 commit／push／部署。

## post-verify
依官方來源逐條核對：官方認證頁（`cloud.google.com/learn/certification/agentic-architect`，2026-11-13 取得）、官方 exam guide PDF（`services.google.com/fh/files/misc/professional_agentic_architect_exam_guide_english.pdf`）、Google Cloud Certification Help FAQ（`support.google.com/cloud-certification/answer/18080541`）、官方 blog（`cloud.google.com/blog/.../google-cloud-agentic-architect-certification-dont-just-prompt-ai-design-it`）。

- GA 規格（2026-11-13）：2 小時、50-60 題選擇題、$200、英文、線上或現場監考、無先修、效期一年；hybrid 兩部分（Pearson 選擇題 + Google Skills labs，過 labs 才有 credential、GA labs 2 個月期限）。
- beta 規格（對照）：9/8-9/30、3 小時、約 80 題、$120。
- 五章權重約 13 / 17 / 33 / 22 / 15；第 3.3 節考 MCP、A2A、多 agent 交接。
- 自訂 agent（S3，33%）與評估部署（S4，22%) 為最重章節；與 PMLE 的關係、兩部分必修、效期一年均以官方為準。

## post-review
獨立全文審查中英兩篇：結構（適合誰 → 規格 → 權重 → 逐章 → 時程 → 坑 → 續期 → 變動資訊 → 更新紀錄 → 參考資料）與 PMLE 前作一致；每段「考什麼」都回指官方考證 domain，沒有寫「題目會怎麼出」。tldr 資訊型、無自指／否定式對比；標題採「廠商 代號（認證名稱）備考路徑」慣例。

## post-polish
中文 register-scan、phrase-ledger 回讀；英文獨立從頭回讀。未引入中英之外的語言；long-form 未見嚴重堆疊。機械驗證：`pnpm verify` 全綠、check:references／check:post-quality／check:tw／check:lang-parity／check:series-order／check:glossary 全過；未跑 diagram（無適合段落），未跑 browser 截圖。

## 既有文章跟進（2026-11-13 補）
- PMLE 兩篇：補 GA 時間線與更新紀錄。
- 總表文 Google 一節：補「能報名的三張」與 AI-500 段落的 GA 措辭。
- AWS which-one 兩版：補「Google 生態能報名的技術類 AI 證照有兩張」。
- B1：補 GA 狀態與第七張對照措辭。
