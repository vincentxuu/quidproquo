# Attack line independent cross-review

2026-10-22。Reviewer: defense_series。完整閱讀orders4–9中英12稿、attack-runner.py、attack-hypotheses.json，以及完整來源正文。初始唯讀發現後，主agent明確指派審者接手自製lab固定runner的錯誤證據保存及六份review；因此修補的實作與負例由同一審者完成，主agent仍負責最終品質閘門。沒有第三方測試、沒有雲端部署、沒有LLM呼叫。

## 結論

兩項必修均已修正並覆核，無剩餘必修。

1. **失敗會丟證據**：原main在assertion error時不寫--out，臨時audit也刪掉。實際錯資源回應負例觸發wrong_resource_content，原本exit1且out不存在。已改失敗時保存status=inconclusive、error、完成trace與可得server_audit，仍非零退出，沒有把錯誤改叫attack_blocked。中英order6同步說明。
2. **研究來源登錄只留下metadata**：prepare.py以所有H1切分，source1–5僅87–407字，卻標完整read。原fetch1/2含全文。現只以H1+URL文件header切分，原文/字符數/registry重建；正文原主張由獨立重新閱讀全文確認。source4尾端未選URL的CRAWL_NOT_FOUND剔除，不當README正文；Meta已讀方法頁另存source7。

另完成description與tldr分開，避免同一摘要重複。

## 獨立實際執行

PYTHONDONTWRITEBYTECODE=1，沒有在public新增pycache。先後兩輪對本機自製子服務重跑所有模式；最後一輪在runner修正後完成：

| mode | vulnerable HTTP / audit | fixed HTTP / audit |
|---|---|---|
|surface|2 / 1|2 / 1|
|hypotheses|5 / 4|5 / 4|
|verify|5 / 4|5 / 4|
|injection|3 / 2|3 / 2|
|loop|5 / 4|4 / 3|
|chain|5 / 4|5 / 4|

合計49真HTTP、37audit，每個回應由另寫的owner規格核對，不import目標policy。拒絕必須403且只有error，正常AliceN1/BobN2仍200；注入輸出必須human-authored候選且not_measured；loop分支數正確。額外4個selftest：scope、budget、未核對目標、非法參數，發送前拒絕。

錯誤負例僅在臨時目錄複製自製service，讓AliceN2回wrong-resource而BobN2正常：
- 原始runner正確assert但沒有out，必修重現。
- 修後外部loopback模式exit1，保存inconclusive與5trace。
- 修後本機子服務模式exit1，保存inconclusive、5trace、4server_audit；wrong_resource_content錯誤明確，正常Bob對照仍存在。
- 測後子程序都terminate/wait；沒有改canonical ticket-lab.py。

最後逐篇42項process-leak/anchored-link/TW/register/ledger全部exit0；未代跑全站verify/astro，避免干擾主agent統一閘門。

## 來源與教學核對

- source1 PortSwigger IDOR完整918字元：已讀題目與solution，帳號頁id、指定API key主張吻合。
- source2 Anthropic完整9696字元：已讀起首至2025-11-14更正，速度修正存在；文章不引用舊錯速度。
- source3 NIST完整13256字元：已讀方法限定、§2.1污染、§2.2grader、§2.3本機修改未影響遠端、末尾更新日；不泛化模型排名/失敗率。
- source4 AutoPenBench完整README正文12755字元：已讀安裝、任務、milestones、tools、FinalAnswer；只取工程機制不取benchmark數字。
- source5 PortSwigger indirect injection完整3945字元：已讀liveLLM提示、評論→API→刪指定帳號、非決定性警告；文章沒有假稱作者完成平台關卡。
- source6 Anthropic報告21557字元：已讀changelog/executive/infrastructure/六階段/response/implications；人類目標與升級、模型幻覺、Claude-only可視限制吻合。圖表未視覺渲染，不引用圖形依賴數字。
- source7 Meta CyberSecEval既有完整方法頁5407字元：已讀已知起始主機、雲端成對range、prompt、tool時間與完整transcript輸出；無能力成效引用。

每篇都有先備、連續工單例子、命令、預期、反例/未決與練習答案；中英一致。固定規劃器與HTTP重播未冒稱真AI，前半模型能力由讀者自己的adapter或指定liveLLM實驗另驗。公開事件保留供應商歸因，不填未見受害端證據。CTF/雲端遷移具體且不把本機當上限。

## 最終檔案與雜湊

- runner SHA256: `c020d5ad7f28b75b201a611991fe02dfa8993e4fb4fbf2f90a27eac9ba044faa`
- 正式六份三節review：`.work/reviews/2026-10-22-ai-security-{attack-surface,vulnerability-hypotheses,exploit-verification,prompt-injection-attacks,attack-agent-loop,attack-chains}.md`
- 來源證據：`.work/ai-security/full/attack/raw/source-1.md` 至 `source-7.md`、`sources.jsonl`、`claims.md`；原始fetch1/2保留。
- 原作者測試/掃描紀錄：attack/test-results.json、checks.log、style-scans.log；本審新增獨立執行結果為上述49HTTP/錯誤負例，未改寫成作者原執行。
