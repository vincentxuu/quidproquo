# Review — 2026-11-23-ai-model-family-korea-models

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-korea-models/evidence.md`。文章角色是跨家族比較篇，已把 slug 登錄到 `.agents/skills/post/references/model-family-roles.json` 的 comparison（並 `pnpm skills:sync`）。

## post-verify

結論：**規格、授權、價格、評估分數與日期都對到一手來源；寫稿後修正 2 處日期、3 處無來源宣稱、1 處價格框架**。

- 🟢 國家計畫：五隊、獨自 AI 定義、第 1 階段結果（MSIT 英文 nttSeqNo=1212）；第 2 階段四模型與晉級（nttSeqNo=1292）；細分分數表逐格對 MSIT 英文 nttSeqNo=1301 與韓文 08-27 版（AAII 11.9／9.4／8.8／7.8、NIA、專家、使用者、國民、總分 70.6／69.9／69.0／65.8）。NAVER 淘汰原因（Qwen 2.5-VL 權重凍結）取自 Korea Herald，正文標了出處。Motif 補選日期 02-20（Korea Times）。
- 🔴 **日期**：指派寫 A.X K2 08-06、K-EXAONE 2.0 07-29。SKT 新聞稿寫 07-29 當天上 HF（08-06 是 NVFP4／EAGLE3 量化版的 createdAt）；LG 新聞寫 07-31 上 HF（07-29 是 HF 私有建立時間）。正文改用 07-29、07-31。
- 🟢 K-EXAONE 2.0 規格與自報分數逐項對模型卡；LICENSE 全文為 Apache 2.0 聲明；前代 cardData `k-exaone`。部署注意事項（B200 flag、vLLM 不支援 DSpark）對模型卡。
- 🟢 A.X K2 規格（688B／33B、61 層、SGA k=2048、Gated Norm、FP8 647 GiB、800 GiB、8.2T、五語言）與自報分數對模型卡；限制段「agentic moderate」原文對到。repo 無 LICENSE 檔，正文照實寫授權依據。
- 🟢 Motif 3 規格、自報分數、MIT LICENSE.md 全文；發布 08-11 為官方 X 貼文；OpenRouter 價格與唯一供應商 KT 對 `/endpoints` API 與模型頁。
- 🟢 Mi:dm K 3.0 Pro：Token Factory 頁（120B／12B、量化方式、261,795、10-29、折扣 30%）、OpenRouter API（11-05、$0.20／$0.80、快取 $0.04）。KT 說法（速度、地端）只引 iNews24 並標為 KT 說法。
- 🟢 HyperCLOVA X 授權逐條讀全文（可撤銷、第 4 條 MAU 1,000 萬與競品條款、AUP 轉嫁、可隨時修改、韓國法 KCAB 仲裁）。CLOVA Studio 模型表、CLOVA X 停止服務日對官方頁。
- 🟢 Raon-1 nano 規格與自報分數對模型卡；mini 規格對模型卡（daily 卡只當線索）；Raon LICENSE 與 Apache 2.0 官方全文比對一致；Raon-Speech CC BY-NC 4.0 對 README。
- 🟢 AA：從排行頁內嵌 JSON 取 v5.0.1 Intelligence Index（Solar Pro 4 14.16、A.X K2 9.04、K-EXAONE 2.0 7.56、Motif 3 null、HyperCLOVA null）、69 個有分數模型中的名次與開放權重名次、各單項分數。
- 🔵 **AA 版本混用風險**：MSIT「四隊 ≥31」與 Motif 官網「AAII 47（v4.1.1）」是 v4 系列，和 v5.0.1 不同尺度。正文另立一段說明，不把兩組數字放在同一張表。
- 🔴 **Solar 價格框架**：初稿把 OpenRouter 價寫成 Solar 的價格；讀 Upstage 價目頁後確認 $0.15／$0.60、$0.05／$0.20 是 10-20、10-11 起的促銷價，牌價 $0.30／$1.20、$0.10／$0.40，KT 端點以牌價計。中英版都改成「促銷價（牌價）」，context 依官方 512K。與同日 Upstage 單篇一致。
- 🔵 **刪掉的無來源宣稱**：「三大雲都沒上架」（沒有逐一查三家目錄，改寫成已查證的「OpenRouter 上的韓國模型全由 Upstage 或 KT 供應」）；「Motif 約 30 人」（只有二手報導）；「NAVER 最早做韓語大模型」；「v5 題組比六月難很多」改成「題組與尺度不同」；Motif 沒有綜合分的原因改成 AA 頁上缺哪些題組的事實描述；EXAONE 4.0「混合推理」刪掉。
- 🟢 採用度：HF 30 天／累計／likes 與 `filter=base_model:` 衍生數由 API 取得；Ollama 官方 library 只有 exaone-deep 804.2K、exaone3.5 625.6K 與 Upstage 舊模型；OpenRouter rankings 11-22 週。
- 未驗：HCX-007 單價（需登入）、Mi:dm K 3.0 Pro 授權（未公開），正文都寫成未公開。
- 範圍聲明：本次檢查約 90 條宣告，沒有評估是否漏掉韓國其他廠商（NC AI、Trillion Labs、Kakao 未納入，因為沒有在架的國際通路或站內需求）。

## post-review

結論：**符合 `model-family-contract` 的比較篇規則，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 中英 2 篇 0 問題（以 comparison 角色檢查）；`check-process-leak` 通過；`check-lang-parity` 全站 0 問題；`emoji:fix` 0 轉換、`check:no-emoji` 通過；`check:references` 本篇無警告；`check:tw` 0 blocking（「激活」×2 為機器學習 activation，保留）。
- 結構：比較篇依任務安排 H2（格局→國家計畫→各家世代→評測→授權價格→採用度→選型→限制→參考資料），參考資料在最後。開頭三句回答是什麼、寫給誰、能做什麼決定；tldr 與正文數字一致（14、8–9、Motif 無綜合分）。
- 指派要求逐項：每家都有在架世代、參數、授權（讀 LICENSE 全文）、通路與價格、AA 分數（或明寫未收錄）、採用度（HF 下載與衍生、Ollama、OpenRouter）；國家計畫與各家關係有一節；Solar 只寫摘要並連到單篇；選型建議在最後。
- 揭露邊界：官方自報與 AA 第三方分節；自報各表比較對象不同，明寫不跨表排名；本站未實測，沒有宣稱實測。
- 中英語意：逐節對照表格列數、數字、價格、限制條目與選型；修正同步套到 `-en`；英文連結指向 `-en` 版（評測來源指南、Raon 模型卡、Upstage 單篇）。

## post-polish

結論：**完成，改動限於拆長句與統一用詞**。

- 中文：「啟用參數」「共享專家」「投機解碼」全文統一；長規格句保留在各家第一段，其餘段落拆成兩句以內。
- 英文：promotional／list price 用語統一；「sovereign」只用在計畫名稱與 MSIT 定義，不當形容詞濫用。
- 沒有加圖（比較以表格呈現，三張主表足以回答讀者問題）。
