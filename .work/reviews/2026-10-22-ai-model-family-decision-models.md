# Review — 2026-10-22-ai-model-family-decision-models

中英共用（`-en` 不另建檔）。審稿日期 2026-10-22。角色：**總覽／跨家族比較**（slug 已登錄 `model-family-roles.json` 的 `comparison` 陣列），因此不套用家族篇的固定七節骨架，改以「這是什麼／有哪些／怎麼比／能力邊界／成本／接進去／安全／不該用／速查」九節自由骨架；只守「References 在最後、無空標題、中英 H2 數與順序對齊、參考資料有外部連結」。

## post-verify

結論：**通過，且逐項核對中改掉草稿的 11 處事實錯誤**。完整逐項證據見 `.work/2026-10-22-ai-model-family-decision-models/evidence.md`。

- 🔴 **`confidence` 跨廠語意不一致（草稿的範例算錯）**：草稿範例寫 `probabilities {billing:0.98, technical:0.02}` 配 `confidence: 0.98`。TypeSafe 實際公式是正規化集中度 `(p_max − 1/n)/(1 − 1/n)`，n = 2 時 = 0.96；`noul` 根本不回 confidence 欄位；`score` 要回 `legend` 與每級 `probabilities`。vLLM d3 走的是另一套——`confidence` 就是被選項的機率（卡上明寫），其 noul 另回 `probabilities:{yes,no}`；OpenAI 有 confidence 但未公開公式。正文已新增一節說明，並把實務結論定成「門檻掛 `probabilities[choice]`」（Baseten 文件原話）。
- 🔴 **AA「不亂猜」欄的分母搞錯了**：AA 方法學原文是「hallucination rate 是**答錯的題目**裡被用錯答案回答的比例」，所以不亂猜率的分母是錯誤集合，不是全部題目。草稿用「模型在不會的題目上選擇回答我不知道的比例」描述，且推論方向不對。改寫後另做交叉驗證：用 Claude Opus 5.5 (Max) 反推，另一種解讀會要求「自信答錯 69.7%」但它正確率 93.4 只可能錯 6.6%，故條件式解讀是唯一自洽解；16 個決策模型列三桶相加全等 100.0。
- 🔴 **成本結論寫反**：草稿說「最貴的決策模型 Clef 每百萬題 $199 還比 Claude Haiku 5.5 (Low) 便宜」——$199 > $184，錯了。已改寫成「決策模型不一定比較便宜」，並補上 AA 官方註明的基準差異（決策模型只計 input token、語言模型連 output 一起計），另補最便宜的對照（GPT-6 Luna Non-reasoning $88）與延遲全距（決策模型 63–500 ms、語言模型 1,136–14,388 ms）。
- 🔴 **社群榜名次用了原始 rank_v**：站方顯示的是 0.9 分同分帶的名次（並列顯示 `=N`），不是資料檔的 `rank_v`。草稿的 41／66／177 全部換成顯示名次 =10／=15／=43，並補上「226 列中有 40 列高於 Jev 1.14」。
- 🔴 **「輸出 token 是零」不成立**：TypeSafe 官方範例 `usage.output_tokens` 是 12，d3 才是 0。改寫成「輸出是固定欄位、沒有東西要 parse」＋「output token 不計價」（TypeSafe／OpenAI／Perplexity／d1-ultra／Baseten／Celeris 皆已核對）。
- 🟡 **時間軸寫成「10 月新增」不準**：Mercury Decide 與 GLiDE 是 2026-09-30，TypeSafe 提出 System One 是 09-15。處理方式分兩層：**標題與 H2 不放時間框**（時間限制不是選型指南的賣點，放進標題會變成倒數計時的語氣），時間只在內文以「TypeSafe 在 09-15 提出 System One 之後，到 10-21 已經十幾家」帶過；tldr、description、glossary 同步改寫，英文版鏡射。
- 🟡 **vLLM 對 d3 的支援狀態過時**：vLLM v0.32.0（2026-10-18）已內建 `POST /v1/systemone` 且預設開啟（點名 clef-omni、d1-3B、DiffusionGemma）；但 d3 自己的合併（PR #61565，10-14）在 v0.32.0 這條線之外（`compare` = diverged / behind_by 144），所以跑 d3 仍要 nightly。兩件事分開寫。
- 🟡 **StartLux 延遲數字配錯欄**：草稿的「1024 token 從 52 毫秒變成 13,308 毫秒」是 256 token 的數字配錯列，且 13,308 不在表內。改用同提示長度的比較：1,024 token 在 H200 上 vLLM BF16 為 98 ms、64 GB M5 Pro 上 MLX 4-bit 為 3,308 ms（約 34 倍），並補 MLX BF16 在 64 GB 放不下。
- 🟡 **Perplexity 的 joint request 是 27B 專長**：Flash 官方說「more accurate with one question per request」，公開分數一題一送 60.05 > joint 58.88，且多題併送會重複計費 state。正文已把「一次呼叫問完」改成有條件的建議。
- 🟡 **Microsoft-Decision-1 的 OpenRouter 呼叫路徑**：正確 id 是 `microsoft/microsoft-decision-1`，走 alpha decisions 端點，不是 `microsoft/decision-1`（不存在）也不是一般 chat API。
- 🟡 **授權寫法**：mammoth-1／elephant-1 模型卡 frontmatter 標 `license: mit`，但 repo 內沒有 LICENSE 檔（`/raw/main/LICENSE` 回 404，tree 也沒有）。正文寫成「模型卡標 MIT，但 repo 裡沒有 LICENSE 檔，授權要自己向廠商確認」，沒有替廠商下結論。
- 🟡 **Mercury Decide 端點**：Inception 自己的端點是 `POST /v1/decisions` / model `mercury-decide`，比 System One 多一種 `extract` 題型；OpenRouter 頁面才寫「與 Jev 相同的 /v1/systemone schema」與「每秒 14 個決策」。兩邊分開寫，2026-09-30 上線、66K context、$0.02（牌價 $0.04）皆對到 OpenRouter 頁面。
- 🟡 **GLiDE 底盤**：社群榜 meta 的 `base_model` 為 null、`served_params` 27.8B、kind 為 full fine-tune、`weights_note` 為「Open weights coming soon」、模型庫私有（實驗室用作者分享的權重跑）。草稿寫的「27.8B 底盤」已改成「27.8B 全參數微調、底盤未公開」。
- 🟢 兩張榜單的母體與分數：AA 2026-10-22 榜單解析出 16 個決策模型 + 15 個語言模型，決策模型 16 列與本文表格逐格一致；社群榜快照 226 列、42 基準（公開面板 37）、五領域、110,201 次請求／109,759 可計分、單一 RTX PRO 6000、Full score = 0.60 同技能 + 0.40 新領域皆對到 `data/index.json`。
- 🟢 廠商自報與第三方分開：Base Labs 10-21 部落格的自報數字（208 模型第一、71.24、AA 65.9／65.2 並列）與兩個榜單的落差逐項點名，正文寫成「第三個數字是廠商自報，而它最容易過期」；Microsoft 的 36 基準／15 萬題／速度比較標「官方自報」。
- 🔵 未揭露／無法覆現：社群榜私有測試從不公開（無法第三方重現）、該 Space 非 TypeSafe 官方、GLiDE 底盤與權重未公開、mammoth-1 訓練資料未公開、elephant-1 用了 Decision Index train split（作者自陳）、Baseten 免費一週是當期活動故不寫死結束日期、Celeris「唯一附一句話解釋」無法跨 12 家驗證故改寫成「明說可以附」。
- 🔵 本站未實測：沒有實際呼叫任何決策 API，`<script>` 範例是 Baseten 文件的改寫（換成中文工單與託管端點），正文已標明。

## post-review

結論：**符合跨家族比較規格，可進潤稿**。

- 骨架：9 個內容 H2 ＋ References，References 在最後，中英各 10 個 H2、順序對齊（`check-model-family-format` 2 篇 0 problems）。對照角色不要求家族篇的七節固定骨架，也不要求開頭版本矩陣——本文的版本矩陣放在第二節，符合比較文的「有哪些」提問位置。
- 開頭 3 句回答「這是什麼、適合誰、讀完能做什麼決定」；`tldr` 與正文一致（社群榜 GLiDE V1.2 71.5、AA 榜 d1-ultra 65.2、Jev 1.14 57.1 三個數字都對到榜單頁面）；兩版 `series` 分別 `AI 模型家族` / `AI Model Families`，order 33、category `tech`、type `deep-dive`、`draft: false`。
- 資訊揭露邊界分四層寫清楚：第三方榜單（社群榜、AA）、廠商自報（Base Labs、Microsoft、d3 卡、Fastino）、官方文件（型別、定價、授權）、本站未實測（範例程式碼）。沒有把任何一層寫成另一層。
- 數字皆附時效：榜單分數標 2026-10-22、快照標 2026-10-22 05:40 UTC、上線日標 2026-10-13、版本漂移用「0.3.2 是 10-12 的快照」這類相對說明示範。
- 中英語意對照：三張表格（社群榜 12 列、AA 榜 19 列、成本 21 列、AA 三桶換算 8 列）逐格同值；H2/H3 數相同；英文沒有多出中文沒有的宣稱（英文版把「中文內容」段落寫成 d1-3B 語言欄含中文，但同樣標明那是底盤語言支援、不是決策品質量測）。
- 站內互補連結四條都存在且語意相符：Cloudflare 模型家族（系列 order 32）、資安警報、decisionkit、Jev 模型卡。
- 參考資料 34 條，覆蓋官方文件、模型卡、兩張榜單的方法學頁、廠商部落格、兩份安全報告與兩份 arXiv；`check:references` 新兩檔 0 warning。
- 圖：門檻路由流程圖（zh/en 各一張，同構不同語），`diagram-preview.ts` 兩張都過——light／dark／375px 手機三種寬度都無文字重疊、裁切或過小；節點 7、連線 8、accent 1、步驟 4，皆在 primitives 上限內。
- 審稿時修掉：範例 JSON 的 confidence 與 score 欄位（改用可自我驗算的官方數值）、三個表格的列值與名次、兩段結論的成本敘述、開頭與 H2 的時間軸、兩處模板化轉折句。

## post-polish

結論：**完成，模板化轉折已清零**。

- `register-scan.sh`（zh）：正文 51 段；模板化轉折 0 處（審稿前 2 處，已改寫）；引述區塊 0；研究者姓名當主詞 0；一般英文術語 4 次，全部落在掃描器自己允許的範圍（計價單位與 API 欄位：`input token`、`output`、`benchmark`、`training split`、`joint request`、`marker token`、`one question per request`），逐句核對後沒有需要翻譯的一般敘述用語。
- `register-scan.sh`（en）：51 段，模板化轉折 0 處。
- 長句 35 句（>60 字）與但書密度 35%：剩下的長句集中在四處（開頭的 12 家模型連結清單、AA 快照描述、兩張榜單落差段、self-host 成本段），全部是規格列舉或連結清單，拆開會損失可核對性或讀起來更彆扭；依掃描器說明「數字與規格就是內容，保留」。
- 數字密度：單段 ≥4 個數字的有 12 段，都是榜單列值與成本列值本身（這是比較文的內容，不是修飾）。
- `scan-ledger.sh`（zh）：模板化轉折 0、台灣中文高風險用詞 0、標題壓縮分類語氣 0。
- 英文版同步鏡射所有改動（confidence 段落、三桶換算表、名次表、成本結論、時間軸、joint request 條件、流程圖標籤），沒有只改中文。
- 未做：沒有實際呼叫任何決策模型 API 驗證門檻行為；正文〈門檻〉一節已標明範例是文件改寫。

## 驗證紀錄

| 檢查 | 結果 |
|---|---|
| `check-model-family-format.mjs`（zh + en） | 2 articles, 0 problems |
| `diagram-preview.ts`（zh） | 1 diagram, no overlapping / clipped / tiny text |
| `diagram-preview.ts`（en） | 1 diagram, no overlapping / clipped / tiny text |
| `pnpm check:references` | 新兩檔 0 warning |
| `pnpm check:lang-parity` | 3206 組全過，0 parity issue |
| `pnpm check:tw` | 0 blocking，新兩檔 0 命中 |
| `pnpm check:series-order` | 無阻擋（僅既有系列缺號 warning） |
| `pnpm check:post-quality` | 0 blocking |
| `pnpm astro check` | 0 errors, 0 warnings |
| `pnpm lint` | 0 warnings, 0 errors |
| `check-process-leak.mjs` | 0 |
| `scan-ledger.sh` | 0 命中 |
| `pnpm verify` | 僅 `check:series-plan` 紅燈，原因是**另一工作流**的 `learning/2026-10-22-ai-kb-source-inventory`（中英兩檔）尚未建立審稿紀錄，與本篇無關，未代為補建他人文章的審稿檔 |

## 尚未取得的使用者決定

- 本篇尚未 commit／push，等使用者看過中英草稿後再提交。
- `pnpm verify` 的 `check:series-plan` 紅燈屬另一工作流，需要該工作流的作者補 `.work/reviews/2026-10-22-ai-kb-source-inventory.md`；本篇不代勞。
