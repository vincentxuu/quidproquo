# 抽取紀錄：Pai (2026) Evaluating Prompting-Based Defenses Against Domain-Camouflaged Injection Attacks

read_status=full（arXiv v1 PDF 全文，含附錄 A–D 表格）

## 書目

- Aaditya Pai（Data Science Institute, Columbia University），單一作者。"Preprint. Under review."
- arXiv:2606.18530 v1（2026-06-16），cs.CR。9 頁。程式碼 https://github.com/aaditya79/defense-eval-camouflage-injection
- 讀取方式與全文檔：curl https://arxiv.org/pdf/2606.18530（192,528 bytes）→ pdftotext → /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o14-pai.txt（1,020 行、24,227 bytes；表格被拆成一格一行），已讀 1–1020 全部。

## 研究設計

- 45 題合成專業文件（金融、法律、一般各 15，沿用作者前作 Pai 2026, arXiv:2605.22001）（行 95–99）。
- 攻擊：靜態（"IGNORE ALL PREVIOUS INSTRUCTIONS…"）與「領域偽裝」（攻擊者 LLM 讀完文件後，寫成看起來像正常分析段落的結論，例如 "Supplementary Analyst Commentary: … revised SELL recommendation"）（行 73–74、100–103）。
- 防禦 7 種：無、spotlighting（文件前後加 `<<<UNTRUSTED EXTERNAL CONTENT>>>`）、paraphrasing（Claude Haiku 先改寫文件）、sandwiching、兩種組合、Llama Guard 4（行 77–82、133–136）。
- 模型：Claude Haiku 4.5、Llama 3.1 8B Instruct、Gemini 2.0 Flash（行 137）。ASR 由 Claude Haiku 當評審（行 138–140）。
- 每格 n = 90（Llama Guard 4 為 45），共 3,510 次（行 145–147）。

## 可引用結果（數字照原文，表 1 在行 180–333）

1. Spotlighting 依模型而異（行 164–166）："It halves Haiku's camouflage ASR (14.4% → 6.7%) but provides no benefit on Llama (22.2% → 23.3%, non-significant …)"；Gemini 21.1% → 20.0%（表 1）。
   - 失敗原因（行 419–421）："Llama 3.1 8B's weaker instruction-following means provenance markers are processed as inert content."
2. Paraphrasing 最穩（行 159–163）：Haiku 14.4% → 4.4%、Llama 22.2% → 10.0%、Gemini 21.1% → 3.3%；摘要說降 55–84%（行 20–21）。
3. **偵測器的誤拒**（行 345–348、441–442）：Llama Guard 4 的偽裝攻擊 ASR 仍有 11.1%／24.4%／20.0%，而且 "90%+ over-refusal"；表 4（行 839–975）Haiku 失敗中 90.0%、Llama 90.6%、Gemini 62.5% 是誤拒。
4. 金融領域殘餘風險最高（行 353–357、445–446）：基線 26.7–33.3%，改寫後仍有 6.7–13.3%。
5. 入庫偵測抓不到偽裝攻擊（引前作，行 41–44）："production classifiers including Llama Guard 3 detected zero camouflage payloads"——這是前作的結果，本篇沒重做。
6. 輸入端防禦的極限（行 422–424）："64.5% (91/141) of breaches are task alignment failures, in which the agent output is structurally identical to a legitimate conclusion, the fundamental limit of input-side defenses."

## 可引用原句

- 「別假設能跨模型套用」（行 443–444）："Do not assume cross-model transferability. Spotlighting halves Haiku ASR but raises Llama's by +1.1 pp; evaluate on your deployment model before relying on benchmarks."
- 自承外推限制（行 28–30、468–470）："All tasks use synthetically constructed professional documents; whether these benchmark rankings generalize to real enterprise documents remains an open question."

## 限制與可信度問題

- 單一作者、未審查預印本；效果量小（Cohen's h 0.34–0.59），作者自己算出 80% 檢定力需每組 56–389（行 462–465）。Llama 的 spotlighting 結果「non-significant」。
- 評審與改寫器都是 Claude Haiku，作者有討論但沒有做多改寫器消融（行 413–418）。
- 只有三個模型；「小模型」只有 Llama 3.1 8B 一個，不能推廣成「小模型都無效」。
- 本文的 spotlighting 只是前後標記，等於 Hines 2024 說的 delimiting（Hines 自己不推薦）；沒有測 datamarking 或 encoding。
- 參考文獻有錯：把 arXiv:2312.14197（Yi et al.）標成 Hines et al. 的 "hierarchical instruction following"；CaMeL 的作者列錯（行 988–995）。引用時不要轉引它的參考文獻。
- 只做單次注入、沒有適應性攻擊（行 473–475）。

## 與範圍卡說法的核對

- 「spotlighting 對小模型無效」：出處是本篇，但要縮小說法——「一篇 2026 年預印本發現，在文件前後加『不可信內容』標記，對 Claude Haiku 能讓偽裝攻擊成功率減半（14.4% → 6.7%），對 Llama 3.1 8B 沒有效果（22.2% → 23.3%，差異不顯著）」。不要寫成通則。
- 「防禦有代價」：Llama Guard 4 的 90% 以上誤拒是很好的例子（偵測器擋攻擊，也擋掉正常內容）。

## 對 order 14 的用法

- 「入庫偵測抓不到寫得像正常內容的攻擊」：行 41–44（引前作）、行 422–424。
- 「防禦效果依模型而異，要用自己的模型測」：行 443–444。
- 「偵測器誤報代價」：行 345–348。
- 入庫改寫（paraphrasing）可列為選項之一，但要說明：只在合成文件、單篇預印本上測過；而 PoisonedRAG 的結果顯示改寫「問題」擋不住知識投毒（兩者改寫的對象不同：Pai 改寫文件，PoisonedRAG 改寫查詢）。
