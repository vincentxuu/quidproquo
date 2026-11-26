# 審稿紀錄：認識 benchmark 總覽（order 0，中英）

## post-verify

每個數字先對抽取紀錄（✅ 條目），再回原文核對（2026-11-24 curl 抓 arXiv HTML、Epoch、OpenAI 頁面，存 scratchpad/pv/）。兩源皆符合者標 🟢。

- 🟢 HAL：o4-mini Low，SWE-bench Verified Mini（50 題），SWE-Agent 54.0% vs HAL Generalist 6.0%。O1-gaps 缺口 1 以 PDF p.58 原表目視核對。依 O1 但書：寫成「HAL 論文的附錄表」，不寫成線上榜。
- 🟢 Epoch GLM-4.6 GPQA Diamond：Z.ai 約 73–83%、經 OpenRouter 的 Fireworks 約 2–21%（各 4 次，API 錯誤記答錯）。C 批看圖讀值；原文頁確認 GLM-4.6 經 OpenRouter 的 RateLimitError、Fireworks (via OpenRouter) 屬受影響供應商。正文用「約」。
- 🟢 Epoch 引句 "Bugs and instabilities in the chosen API provider are the biggest source of evaluation errors, which particularly affects newer models." 原文逐字一致。該文是 Gradient Updates（作者觀點），正文寫「Epoch 研究員在這篇分析裡的結論」。
- 🟢 OpenAI 2026-02-23：停止回報 SWE-bench Verified；引句 "increasingly reflect how much the model was exposed to the benchmark at training time" 逐字一致；138 題＝o3 在 64 次獨立執行中無法穩定解出；至少 59.4% 有缺陷測試。正文寫「過半題目的測試或題目描述有問題，其中一類是測試擋掉正確修法」，依 A 批但書不把 59.4% 全寫成「拒絕正確解」。
- 🟢 τ-bench trivial agent 航空 38%、GPT-4o agent 35%：ABC 原文 "This trivial agent achieves a 38% success rate and outperforms a GPT-4o-based agent"、"a GPT-4o-based agent resolves 35% of tasks on τ-bench-Airline"。
- 🟢 Bean et al.：445 篇、16.0% 用不確定性估計或統計檢定。原文逐字一致。「牛津團隊」依研究筆記。
- 🟢 Miller：約 969 題 → 建議至少 1,000 題，80% 檢定力、α=0.05、差 3 個百分點；作者 Affiliation: Anthropic。**修正**：原寫「一組典型假設」，原文是 "fictional, they are reasonable"，改為「作者自訂、但他認為合理的參數」（中英）。
- 🟢 Leaderboard Illusion：Llama 4 發布前一個月最多 27 個 Meta 模型私測，原文逐字一致；best-of-N 必然上偏依 E 批附錄 C。正文只寫「廠商可以只公開最好的那一個」，不寫 Meta 實際只公開一個。
- 🟢 ECI 取最高分：原文 "aggregate across model evaluation settings (e.g. thinking effort and inference provider), taking the highest score for each benchmark"。
- 🟢 HAL 排行榜表是 best run：C 批 A10.1 原句。
- 🟢 MMLU 57 科四選一、比 A–D token 機率（F 批）；SWE-bench Verified 500 題、有 Python 經驗的開發者標註（H 批）；Arena 匿名雙模型投票（E 批）。
- 🟢 站內連結：三篇既有文章路徑存在（評測來源指南在 tech）；〈模型成績單怎麼看〉講 cherry-pick、污染、飽和三陷阱，〈Coding Benchmark〉六個 benchmark，皆對照原文。
- 修正（寫稿時已改）：參考資料中未經抽取紀錄確認的作者名（τ-bench、Chatbot Arena、GPQA、MMLU、ABC、Leaderboard Illusion）拿掉，只留 Kapoor、Miller、Bean。

## post-review

機械檢查：check:references 0 error（order 1 英文版出現後，指向 `-benchmark-anatomy-en` 的連結已解得開）；lint 0；check:post-quality OK；astro check 依 writer brief 不在本機跑。

- 🟢 frontmatter：必填齊全、date 2026-11-24、category ai、type deep-dive、tags 4 個沿用既有（benchmark、llm-evaluation、evaluation、agent-evaluation），series name 中英各用登錄名、order 0；tldr 資訊型含數字，description 與 tldr 不重複。
- 🟢 結構：照介紹文骨架（是什麼 → 一個分數的一生〔五環＋圖〕→ 系列地圖 → 從哪開始讀 → 不涵蓋的 → 自我檢查 → 參考資料）；主脊照五個環節一條。每環節一個代表性失真＋對應篇次，細節指向各篇，沒越過範圍卡「不講」。
- 🟢 系列地圖：25 列表格（篇次、標題、回答的問題），只有 order 1 加連結，其餘只列標題；五段各回答什麼另列。
- 🟢 讀完能做到：自我檢查第 1 題用範圍卡原題與判準；第 2 題直接對應「說出五個環節並指出要追問哪一環」。
- 🟢 站內三篇既有文章都有連結；評測來源指南用實際 category（tech）。
- 🟡→已修：開場直接丟 SWE-bench Verified Mini、GPQA Diamond，沒接觸過的人不知道它們是考卷。補括號說明（50 道真實程式修改題／研究所程度的科學選擇題），並在第二段加一句「這兩份考卷都是 benchmark，也就是拿來比較 AI 模型的標準化考卷」（中英）。
- 🟢 保留：「第 21 篇開頭有對照表」「家族文開頭有踩坑小表」是規劃表斷崖處理已定的做法，屬系列承諾，寫到該篇時要兌現。

## post-polish

力度 standard、範圍 in-place（總覽不刪內容）。

- 掃描（中文版）：長句 5 句（其中 105 字那句是三個問號連成的提問，實際氣口短，保留）；但書 3/54 段；引述區塊 0；姓名當主詞 0；模板化轉折 0；scan-ledger 0 命中；check:tw 0；process-leak 0；check:post-quality OK。
- 數字密度：命中的段落多是篇次編號（「第 2 篇 → 第 6 篇」）與開場反差的兩個百分比區間，屬讀者做判斷用的數字，保留。開場已在寫稿時拆成 HAL、Epoch 兩段。
- 已修：Miller 那句 83 字，拆成「誰估算」與「估算結果」兩句（中英）。
- 已修：自我檢查兩題原本是分號串起的長段，改成子項清單，判準與參考答案逐項可對照（中英）。
- 台灣讀者位置：本篇是全球議題的系列入口，繁中評測集中在第 18 篇，「不涵蓋」一節已說明中文範圍，沒有硬塞台灣案例。
- 可執行動作：讀法路線每條都寫出下一步動作（看到「領先 2 分」先找題數與設定）；自我檢查附判準。
- 一般英文術語：benchmark、agent、API 是系列主題詞與產品類別，保留；scaffold 在正文一律寫「外殼」，首次出現時以 glossary 對照英文。
- 圖：diagram-geometry／text 0 錯；diagram-preview 中英全 ✓，淺色、深色、手機截圖看過，五個框文字未溢出，第 3 環 accent 對應正文「開頭兩組反差都在第 3 環」。
- 保真回讀：數字、引句、連結未動；改完 check:references 0 error、lint 0。
