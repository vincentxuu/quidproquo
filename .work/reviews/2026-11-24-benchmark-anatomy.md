# 審稿紀錄：拆開一個 benchmark（order 1）

檔案：`src/content/posts/ai/2026-11-24-benchmark-anatomy.md`、`-en.md`

## post-verify

方法：每個數字與引文先對抽取紀錄（N-building、H-coding-terminal、O3-gaps、F-knowledge、J-agent-env、A-methodology），再回原文核對（curl 原文 grep）。題目範例另讀一手原始檔：`harbor-framework/terminal-bench-2` 的 `fix-git` 全部檔案、HF `cais/mmlu` high_school_computer_science test 第 0 列。

🟢 Confirmed（抽取紀錄＋原文兩處一致）
- MMLU 57 科、15,908 題；prompt「The following are multiple choice questions (with answers) about [subject].」、最多 5 題範例、以「Answer: 」結尾（MMLU PDF §4.1、§3；F 批）。
- MMLU 範例題文字與 `answer: 2`（HF datasets-server 回傳列）。
- HELM：OPT 175B HellaSwag 79.1% → 30.2%（HELM PDF §1.2 第 23 條；N 批）。
- MMLU-Redux 6.49%，寫成「題目有問題」含五類錯誤，不寫成答案錯（Redux PDF；F 批、O1 缺口 7）。
- Terminal-Bench 2.0 89 題；§2.1 任務格式與「final container state」原句；no-op agent 必須失敗；表 2 Opus 4.5 Terminus 2 57.8%、Claude Code 52.1%；「model selection is usually more important than agent scaffold」（arXiv HTML；H 批）。
- fix-git：instruction 原句、task.toml（easy、5／20 分鐘、agent 900 秒、allow_internet true）、Dockerfile 基底、setup.sh 布置 detached HEAD、test_outputs.py MD5 比對、test.sh 寫 reward.txt、solve.sh 讀 `.git/logs/HEAD`（GitHub 原始檔）。
- Anthropic：「evaluating the harness and the model working together」原句；CORE-Bench 42% → 95%、「96.12」vs「96.124991…」；0% pass@100「most often a signal of a broken task」（原文頁；N 批）。
- Inspect：一個 eval＝dataset＋solver＋scorer 原句；scorer 四種形式；未指定評審時「Else the model currently being evaluated is used.」（model-graded.html.md；N 批）。
- Harbor：任務「an instruction, environment, and test script」；oracle 步驟 `harbor run -p … -a oracle` 要 reward 1 與失敗檢查清單（create-a-task.md）；v0.25.0（2026-10-25）新任務預設 separate verifier（changelog）；只收宣告的 artifacts（separate-verifier.md）；正式指令 `harbor task init`（O3 缺口 7 讀原始碼）。
- Terminal-Bench 排行榜 2026-04-19 起通過 trial 須附 ATIF 軌跡（tbench.ai 公告原文）。
- GAIA 466 題、quasi exact match、Level 1 GPT-4 9.1% vs GPT-4＋plugins 30.3%，plugin 為人工挑選、不可重現（arXiv HTML Table 4、§4；J 批）。
- ABC R.6「說明受測對象是模型還是 agent 框架」（A 批）。

🟠 修正
- CORE-Bench 句原寫「修掉這類評分錯誤、模糊的題目敘述」，原文的問題清單還有「stochastic tasks that were impossible to reproduce」：已補上（中英）。

🟡 標註
- Harbor `harbor task init` 產生 `tests/Dockerfile` 與 separate 預設，依 O3 批讀原始碼與文件，未實跑；正文以一句「依原始碼與文件整理，未實際執行」標明。

🔴 無。

## post-review

機械檢查：`check:references` 0 error（本篇無 warning）、`lint` 0；`astro check` 依寫稿規格不跑。frontmatter 必填齊全、`type: deep-dive`、series name 中英各自用已登錄名稱。

🔴 無。

🟡 已修
- tags 少了總覽用的 `evaluation`，同系列不一致：補上（中英），現為 5 個，全是既有 tag。
- 「評審」段「代價是不決定」是翻譯腔：改成「同一份答案每次評的結果可能不同，而且要先跟人工標註比對過才知道準不準」。

🟡 判斷後不改
- 範本的「整體來說」節：本系列 order 0 與同類系列文都以「自我檢查＋下一篇」收尾，範圍卡要求文末放自我檢查題，所以不另加總結節。
- tldr 偏長（三個子句）：但第一句就是結論、含讀者可用的數字（57.8%→52.1%），符合 BLUF，不再縮。

🟢 確認過
- 開頭三段內讓讀者看到兩個實際題目，前三段就知道對象。
- 每個第一次出現的專名（MMLU、資料集、Terminal-Bench、fix-git、Inspect、Harbor、Anthropic 文章、HELM、ABC、MMLU-Redux、GAIA、總覽）都有 inline 連結；參考資料清單逐條對應。
- 範圍卡要求逐項對照：五塊、oracle、三類評分、MMLU 與 Terminal-Bench 對拆、受測對象判斷、GAIA 自我檢查與判準都有；沒有講怎麼自己寫（只有 Harbor oracle 步驟用來解釋 oracle）、沒有講統計。
- 「讀完能做到」對應「拿一份說明文件練習」表與 fix-git 示範填表。

## post-polish

力度 standard、範圍 in-place（新稿，寫稿規格要求照結論修，故直接改，不另停下詢問）。保護片段（數字、引文、網址、指令、立場強度）未動。

掃描結果與處理：
- 長句 13 句 → 10 句：拆開開場「第二題沒有答案可以對」、總覽回扣句、Harbor v0.25.0 段。剩下 10 句多數含英文原文引述（Inspect、Terminal-Bench §2.1、Anthropic、MMLU prompt），引文是保護片段，不拆。
- 模板化轉折 2 處（「不是 A，而是 B」）→ 0：改成「分數量到的就變成偷看答案的本事」「它不給受測系統看，用途是檢查題目本身」；英文版同步改 oracle 那句。
- 但書密度 8%、引述區塊 3（兩題範例＋無第三個 blockquote 以外的長引），皆在綠區。
- 數字密度：fix-git／Harbor 那段命中 7 個，多為版本號與日期（v0.25.0、2026-10-25、2.0），屬讀者核對版本所需，留著。
- 一般英文術語 9 次：多為 benchmark、agent、trial、verifier log 這類本系列定義過或官方欄位名，保留；開頭與結論已用中文敘述。
- 台灣讀者位置：本篇是通用方法篇，台灣脈絡由系列第 18 篇處理，不硬塞。
- 可執行動作：「拿一份說明文件練習」給了六格表與 fix-git 示範填法。

回讀：從頭讀到尾一次，開頭以兩個實際題目入題，段落都直接對讀者說話，沒有稽核 memo 口吻；章節標題可單獨讀懂。

改完重跑：`check:tw` 0、`check-process-leak` 通過、`check:references` 本篇 0 warning、`lint` 0、兩支 diagram 檢查 0 錯誤。
