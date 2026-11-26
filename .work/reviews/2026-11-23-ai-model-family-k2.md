# Review — 2026-11-23-ai-model-family-k2

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-k2/evidence.md`；本輪逐項回一手來源（HF 模型卡／config.json／LICENSE、IFM 部落格與 docs、arXiv、AA）對照正文。

## post-verify

結論：**規格、授權、日期、官方評測與第三方分數與一手來源一致；寫稿中修掉 4 處過度宣稱，並記下 daily 卡與現況不符的 2 處（依指示未改 daily 卡）**。

- 🟢 規格：375B 61 層、hidden 6144、192 路由專家 top-8＋1 共用、vocab 250,624、max_pos 524,288；MoVA 48 層、FFN 100 選 8＋1、MoVA 64 選 4、softplus gate；32B 64 層；7B 36 層；0.9B 28 層、vocab 64,256、131,072。來源：各 repo config.json。
- 🟢 訓練：375B 預訓練 7.08T＋8.05T、mid 4 段、RL 五專家→合併→SFT 三段；22.9T 共用語料（報告寫 22T）；0.9B 5T＋MOPD；FTPO 3.7B Terminal-Bench 2.1 25.1→39.7。來源：模型卡 Training Overview、技術報告摘要、部落格。
- 🟢 日期：HF createdAt（K2 2024-04-17、K2-Think 2025-09-08、K2-V2 2025-12-01、K2-Think-V2 2026-01-08、K2 Horizon 2026-09-01）；部落格／新聞稿 09-03；Jais 3 新聞稿 10-15；技術報告 2611.21003 於 11-16；K2 Think V2 API 退役 10-03（docs deprecation）。
- 🟢 授權：LICENSE 全文為 Apache 2.0，375B 與 7B 檔案相同；資料集 HF tag：TxT360-v2 cc-by-4.0，其餘四個 apache-2.0；Jais-3-Data odc-by＋cc-by-4.0。
- 🟢 官方評測表 9 列逐格對過 375B 模型卡；32B、MoVA、7B、3.7B、0.9B 數字對過各模型卡。
- 🟢 Reward hacking：712／500／24／66.9%／AA 對照 2.2%、4.1%；7B 曾得 82。來源：部落格。
- 🟢 AA：375B 18（JSON 17.82）、中位 23、94.3M token、3.9 分鐘、272 tok/s、$0.00 based on IFM API；其他尺寸由頁面 JSON 取。Openness 排行 350 個模型中無 K2 Horizon；K2-V2、K2 Think V2 89；Nemotron 3 Ultra 83。
- 🟢 託管：IFM API 只有 375B 與 Jais-3-MoVA；每日 1,000 萬 token；docs 無價格；OpenRouter 無端點；Nebius、Cerebras 公開目錄無 K2。
- 🟢 採用數字：HF downloadsAllTime、30 天、likes、base_model 衍生數；Ollama 6,563。
- 🔵 **「目前規模最大的全開放模型組」**（tldr 初稿）：Nemotron 3 Ultra 550B 也公開部分資料，這是 IFM 自己的說法。改為「IFM 稱之為史上規模最大的全開放模型發佈」。
- 🔵 **「全開放模型裡只有它是數百 B 級 MoE」「唯一有 MoE 旗艦」**（選型與結語、總覽列初稿）：同理，改為與 OLMo、Apertus 這類資料完整公開的模型相比，並註明 Nemotron 3 Ultra 更大但 AA 開放度 83。
- 🔵 **Nemotron 3 Ultra「參數多一倍」**：550B 對 375B 只多約五成；改寫成「總參數 550B、啟用 55B」。
- 🔵 **7B BrowseComp「對照組中最高」**：BrowseComp 的對照組是 DeepSeek V4 Flash、GPT-5 等大模型，與其他列不同；拆開寫並註明 harness 不同。
- 🔵 32B 與 MoVA 卡的對照分數取自 AA（卡上註明），正文補標。
- 🟡 **daily 卡 `2026-09-05-model-ifm-k2-horizon-375b-a23b`**：(1)「SWE-Atlas-QnA 全對照組最高（含閉源）」—閉源三欄是 `--`，沒有可比數字；(2)「官方未提供 API」—IFM docs 有 api.ifm.ai，新聞稿也說 API 當天可用（價格未公布）。另「採用 AA 評測方法論」在 375B 模型卡找不到原文（MoVA／32B 卡才寫 sections follow AA categories）。依指示未改 daily 卡，交主對話決定。
- 🟡 Uno 加速：新聞稿約 3×、技術報告最高 2.2×，正文依技術報告並兩說並列。
- 🟡 語言：模型卡 metadata `en` vs IFM docs「English, Arabic, 30+ more」，正文兩說並列。
- 未驗：技術報告只讀了摘要與 Released Artifacts 表（全文未逐節讀）；Jais 3 的 24 項阿拉伯語評測未逐項核；Compass 這家推論夥伴查不到公開目錄。
- 範圍聲明：本次檢查了文中約 70 條宣告，未評估文章覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，可上線**。

- 機械：`check-model-family-format.mjs` 2 篇 0 問題；`check-process-leak` 通過；`check-lang-parity` 3737 對無問題；`check:no-emoji` 通過；`check:references` 本篇無警告；`check-external-links` 0 壞（ifm.ai 對腳本回 403，Exa 可讀，屬防爬）；`check-series-order` 無阻擋問題；`check-tw-terms` 本篇 0 項。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄齊全，HF repo ID 與 API 端點分開，開放權重與託管分開；舊世代（K2 Think、K2-V2、K2 Think V2）只進演化表，沒有混入評測表。
- 開頭 3 段回答是什麼、寫給誰、與 OLMo 文的分工；tldr 與正文一致（六款、Apache 2.0、AA 18 vs 23、只有 IFM API）。
- 與 OLMo 篇不重複：只放差異表，「完全開放」四層內容改連 OLMo 篇；LLM360 K2 65B 細節改連 olmo3-llm360 文。
- 揭露邊界：官方自報、第三方（AA）、本站未實測分開；採用數字附日期與計算口徑（base_model 標註、含 IFM 自家量化版）。
- 中英對照：逐節對照 H2／H3、矩陣、演化表、評測表、授權表、採用表、選型與限制；審稿修正同步套到 `-en`。

## post-polish

結論：**完成，改動限於句子層級**。

- `register-scan.sh`（zh）：模板化轉折 1 處（「它不是另一個家族，而是…」），已改寫，英文同步。一般英文術語 2 處（benchmark、reward hacking 稽核段）屬專有名詞，保留。
- 中國用語掃描：手動 grep 替換表詞彙，只命中「項目」（指 benchmark 列，台灣用法），無需改；`check-tw-terms` 0 項。
- 數字密度高的段落集中在矩陣、評測與採用表，屬規格列舉，保留。
