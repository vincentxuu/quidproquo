# Review — 2026-11-23-ai-model-family-minicpm

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-minicpm/evidence.md`，原始抓取在同目錄 `raw/`；本輪逐項對照 raw 檔與模型卡圖片重讀。

## post-verify

結論：**規格、授權、價格、採用數字與兩張官方評測表逐格吻合；修掉 2 處 Contradicted、2 處 Misframed**。

- 🟢 MiniCPM5-2B：LlamaForCausalLM、2,516,756,480 參數、42 層、GQA 16/2、131,072、`enable_thinking`、SGLang `minicpm5` parser、400B SFT、16 個 RL 專家（5 agentic）、OPD 反向 KL、+10.96／+6.96。來源：HF README。MiniCPM5-1B 1,080,632,832、24 層、131,072。
- 🟢 MiniCPM5-2B 評測表 10 列 × 5 欄逐格對 HF README（HTML 表），† 標記對應「Scores marked † come from the official Artificial Analysis release」。
- 🟢 MiniCPM-V 4.7 評測表：下載 `overall_performance_35ba3b_instruct.png`、`_language.png` 以 ffmpeg 裁切逐格讀，9 列 × 4 欄吻合；註腳「public reports and our local evaluation」「instruct mode」照寫。
- 🟢 MiniCPM-V 4.7 骨幹：config `qwen3_5_moe_text`（40 層、256 專家 top-8）、1B `qwen3_5_text`；致謝 Qwen3.5／3.6、SigLIP2。13+ tok/s、3GB、iPhone 17 Pro Max；GitHub「5× speedup on real devices」。
- 🔴 **多模態線骨幹史**：初稿寫「多模態線從自家底座轉向 Qwen」「V 2.6 用 Qwen2」。查 HF：V 4.0 為 MiniCPM4-3B、V 4.5 為 Qwen3-8B、V 4.6 為 Qwen3.5-0.8B；V 2.6 repo 現為 gated、讀不到 README。改寫為「V 4.0 用自家、V 4.5 起改用 Qwen3 系列」，刪掉 V 2.6 骨幹說法；限制段同步從「V 4.6 之後」改為「V 4.5 之後」。
- 🔴 **MiniCPM4 稀疏注意力**：初稿把可訓練稀疏注意力寫在 MiniCPM4；GitHub changelog 的措辭掛在 MiniCPM4.1（「trainable sparse-attention model with hybrid reasoning」），MiniCPM4 是「5x generation acceleration on typical edge chips」。已改。
- 🔵 **MiniCPM-2B 一列**：初稿「中國團隊少見的端側路線」是無來源評語，改成 changelog 的「performs similarly to Mistral-7B」。
- 🔵 **日期**：HF createdAt、GitHub changelog、面壁官網差 1–2 天（5-2B：09-06／09-07／09-08；V 4.7：10-06／10-12／10-13）。正文用月份，不採 daily 卡的「無官方公告」說法（官網有 9-08 發佈文；依指示未改 daily 卡）。
- 🟢 授權：HF cardData 全為 apache-2.0；HF repo 內無 LICENSE；GitHub MiniCPM、MiniCPM-V、MiniCPM-OCR、VoxCPM LICENSE 全文為標準 Apache 2.0，無附加條款。
- 🟢 API：開放平台 2026-11-12 版價格表 8 列逐格吻合；積分換算未公開照寫；RPM 30。
- 🟢 OpenRouter `/api/v1/models` 477 個模型無 MiniCPM。
- 🟢 採用：HF 30 天下載依前綴加總（V 4.7 2,750,379、MiniCPM5 2,357,438、OCR 638,447、V 4.6 353,215、o 4.5 300,279）；衍生數 `filter=base_model:` 扣 openbmb 自家；Ollama Downloads 欄逐頁讀 HTML。VoxCPM 依指示不計入採用度表。
- 🟢 Artificial Analysis：文章（2026-09-07）15 分 v4.2、Granite 4.2 3B 11、GDPval 831、τ³ 21%、HLE 9%、TB v2.1 9%、CritPt 0%、Omniscience 29%／78%／8%、19k／11k；模型頁 v5.0.1 顯示 N/A。
- 🟢 部署：新華網（吉利銀河 M9、長安馬自達 EZ-60、3,800 萬下載至 6-30）、中國經濟網（定點車企五家、EZ-60 首款、9B 需下一代晶片的說法出自雷升濤）、面壁官網（三星備案）；三星未公開確認細節（KrASIA、WindowsForum、Inside China AI）。
- 🟢 跨廠商：korea-models 文 Raon-1 表 BFCL v4 61.0 vs 面壁 66.6。
- 未驗：MiniCPM-V 2.6 是 Ollama `minicpm-v` 的版本，依頁面「8b、updated 2 years ago」推定。
- 範圍聲明：檢查文中約 70 條宣告，未評估覆蓋完整性。

## post-review

結論：**符合 `model-family-contract`，可上線**。

- 機械：`check-model-family-format.mjs` 2 篇 0 問題；series order 41 在 AI 模型家族系列無撞號；`check:no-emoji`、`check-process-leak` 通過；`check-lang-parity` 無 minicpm 相關問題（唯一一筆是別的 session 的 amazon-nova）；`check:references` 無 minicpm 相關錯誤；站內連結逐一確認檔案存在。
- 骨架：7 個固定 H2 依序、參考資料在最後；矩陣四欄齊全，權重與 API 分開，VoxCPM 只帶過並轉手語音篇；舊世代只進演化時間線，MiniCPM5-2B 首發分數連 daily 卡。
- 開頭 3 段回答是什麼、寫給誰、能做什麼決定；tldr 與正文一致（15 分標明 v4.2、無 OpenRouter）。
- 揭露邊界：第三方（AA）與官方自報分節；V 4.7 表註明混合引用與重跑；OCR 指標標自建基準；部署案例標公司說法；積分換算未公開明寫。
- 採用度依指派只寫有數字的指標（HF 下載與衍生、Ollama、具名車型與手機備案），沒有「很常見」類描述。
- 中英語意對照：逐節對照矩陣、兩張評測表、價格表、採用表、選型與限制；修正同步套到 `-en`，英文站內連結全部改 `-en`，簡中來源標 (in Chinese)。

## post-polish

結論：**完成，未做整篇改寫**。

- `register-scan.sh`（zh）：模板化轉折 0；一般英文術語 2 處（benchmark，屬評測專名，保留）。
- 中國用語掃描：writing-guide 替換表逐詞 grep 0 命中；`check:tw` 唯一提示「智能」出自公司名「面壁智能」，保留。
- 限制段「不適合當需要大量事實的 RAG 骨幹以外的知識來源」句構不通，改為「沒有檢索輔助時不適合單獨當知識來源」，英文同義。
- 無 diagram 區塊。
