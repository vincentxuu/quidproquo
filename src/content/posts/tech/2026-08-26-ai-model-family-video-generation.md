---
title: "影片生成模型家族——Sora 退場、Veo 3.1／Kling 3.0／Gen-4.5 三強割據的兩年軍備競賽"
date: 2026-08-26
category: tech
tags: [video-generation, sora, veo, kling, runway, model-family-video, diffusion-transformer]
lang: zh-TW
type: deep-dive
tldr: "2024 年 2 月 Sora 預覽震撼業界，兩年半後格局翻轉：OpenAI 於 2026 年 4 月關閉 Sora 消費者 App、API 排定 9 月 24 日退役；Veo 3.1 以原生音訊與 Flow 工具鏈成為敘事首選；快手 Kling 3.0 轉型統一多模態、年化營收 2.4 億美元；Runway Gen-4.5 曾登頂 Artificial Analysis 榜（2025-11 快照）、靠企業工作流站穩專業市場。這篇以家族×世代時間線拆解四大家的演化、規格定價對照與選型建議。"
description: "影片生成模型家族深度介紹：Sora 1→2 退場時間線、Veo 2→3.1 原生音訊與 Flow、Kling 1.0→3.0 商業化、Runway Gen-3→Gen-4.5 企業定位，規格定價對照表與行銷／影視／批次生成選型指南。"
series:
  name: "AI 模型家族"
  order: 15
draft: false
glossary:
  - term: "Diffusion Transformer（DiT）"
    definition: "把擴散模型的主幹從 U-Net 換成 Transformer 的架構。影片生成的主流做法：先用 VAE 把影片壓縮成時空 latent，再由 Transformer 在 latent 上做去擴散。Sora 的 spacetime patches、Kling 的 DiT＋3D VAE 都屬此路線。"
  - term: "原生音訊"
    aliases: ["native audio"]
    definition: "畫面與聲音（對白、音效、環境音）在同一個生成過程中一起產出，而非後製配音。優勢是唇形同步與音畫一致性。Veo 3 是第一家大規模落地者。"
  - term: "Credit"
    definition: "生成平台的虛擬計費單位，不同模型的每秒扣量不同。Runway、Kling、Flow 都用 credit 制，實際換算成每秒影片成本後才能跨平台比價。"
  - term: "C2PA"
    definition: "內容來源與真實性聯盟的內容憑證標準，把 AI 生成的出處寫進檔案 metadata。OpenAI 的 Sora 輸出自第一天起就帶 C2PA 加浮水印。"
  - term: "SynthID"
    definition: "Google DeepMind 的隱形浮水印技術，直接嵌在生成的像素或音訊波形裡，肉眼不可見但偵測工具可讀。Veo 與 Imagen 輸出皆內建。"
---

2024 年 2 月，OpenAI 丟出 Sora 預覽：一分鐘的東京街景、逼真的物理反射，整個業界第一次意識到「文生影片」要認真了。當時 Sora 只給少數電影人測試，連公開產品都不是——但它把未來兩年的競爭議程定死了。兩年半後的今天，這是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第十五篇家族深拆，主角換了一批人：Sora 本尊已宣布退場，取而代之的是 Veo、Kling、Runway 的三強割據。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列第十五篇家族深度介紹。

## 四大家族演化時間線

### Sora：從震撼彈到退役

Sora 1 於 2024 年 12 月隨 ChatGPT Plus/Pro 開放（sora.com），只做無聲影片。真正的分水嶺是 2025 年 9 月 30 日的 [Sora 2](https://openai.com/index/sora-2/)：原生同步音訊、物理正確性大躍進、邀請制 iOS App 加上「cameo」真人授權機制，上線即爆紅。但劇本急轉直下——2026 年 3 月 OpenAI 通知開發者 Videos API 全線退役，[消費者 App 於 4 月 26 日關閉](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)，[API 將於 2026 年 9 月 24 日停止接受請求](https://developers.openai.com/api/docs/guides/video-generation)，且官方文件列明無後繼模型。第三方估算其一生運算成本遠高於營收，「GPT-1 moment」的自我定位成了預言：是開端，不是產品。

### Veo：原生音訊定義戰場

[Veo](https://deepmind.google/models/veo/) 的路徑最穩：2024 年 5 月 I/O 首發、12 月 Veo 2 上 VideoFX 與 Vertex AI；2025 年 5 月 20 日 Veo 3 是全行業第一個大規模原生音訊模型（對白、音效、環境音一次生成），同時推出 AI 影片創作工具 [Flow](https://blog.google/technology/ai/veo-updates-flow/)；2025 年 10 月 15 日 [Veo 3.1](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) 強化音訊品質、Ingredients to Video（三張參考圖鎖角色）、首尾幀控制與 Extend 串接多段。[Gemini API 更新日誌](https://ai.google.dev/gemini-api/docs/changelog)顯示 2026 年 1 月加入 4K 輸出與全解析度直立影片支援，舊版 Veo 2/3.0 端點已排定 2026 年 6 月底關閉。Google 另在 2026 年 6 月與 A24 達成研究合作，往影視端滲透。

### Kling：快手的商業化奇襲

[Kling 1.0](https://en.wikipedia.org/wiki/Kling_AI) 2024 年 6 月亮相、同年 7 月全球開放測試，以物理真實感著稱。之後迭代密度全場最高：1.5（2024-09）、1.6（2024-12）、2.0 Master（2025-04）、2.1（2025-05，大幅降價）、2.5 Turbo（2025-09，登頂 [Artificial Analysis 榜](https://www.openpr.com/news/4208084/)）、2.6（2025-12，補上原生音訊）、3.0（2026-02）：統一多模態架構、五語言原生音訊、多鏡頭分鏡與角色共指、影片最長 15 秒。商業數字是重點：[2025 年 12 月年化營收 run rate 達 2.4 億美元](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)，上線 19 個月、6,000 萬創作者——快手把它接進自家短影音與廣告體系，是目前唯一跑通「模型即電商基礎設施」的玩家。

### Runway：企業工作流護城河

Runway 是最早商用化的那個：Gen-1（2023-02，video-to-video）、Gen-2（2023-03，文生影片）、Gen-3 Alpha（2024-06）。[Gen-4.5](https://runwayml.com/research/introducing-runway-gen-4.5) 於 2025 年 12 月 1 日發佈，以 1,247 Elo 登上 [Artificial Analysis 文生影片榜第一](https://www.cnbc.com/2025/12/01/runway-gen-4-5-video-model-google-open-ai.html)；一週後[TechCrunch 報導](https://techcrunch.com/2025/12/11/runway-releases-its-first-world-model-adds-native-audio-to-latest-video-model/)其隨 GWM-1 世界模型補上原生音訊。2026 年的動作全部朝平台走：Aleph 2.0 影片編輯模型、Runway Agent、Studio 時間線，7 月推出 Runway Dev 開發者平台與 Media Router，並經 [API changelog](https://docs.dev.runwayml.com/api-details/api_changelog) 於 7 月底退役 Gen-3 系列端點。客戶含 Lionsgate 等好萊塢片方，說明定位：不是單點模型，是嵌入專業製作流程的那一層。

**第二梯隊一句帶過**：Luma 已從 Dream Machine 走到 Ray3.2（16-bit HDR 先驅、文件上限 1080p）；Pika 主打短影音快速迭代；MiniMax Hailuo 3.0（H3）2026 年 8 月開源 33B 基座權重、原生 2K；xAI Imagine 影片 $0.05/s 起（旗艦 1.5 檔最高約 $0.25/s @1080p）綁 X 生態。

## 規格與定價對照

| 模型 | 最長時長 | 解析度上限 | 音訊 | 定價（每秒） | API |
|---|---|---|---|---|---|
| Sora 2 / 2 Pro | 4–25 秒（檔位而異） | 1080p（Pro）| 原生 | $0.10；Pro $0.30–$0.70（Batch 半價）| 有，2026-09-24 退役 |
| Veo 3.1 Quality / Fast | 8 秒基底，可 Extend 串接 | 1080p／4K（2026-01 起）| 原生 | 約 $0.40 / $0.15（無音訊約減三分之一）| Gemini API + Vertex AI |
| Kling 3.0 | 15 秒（多鏡頭分鏡）| 影片高解析檔位；圖像 2K/4K | 原生（5 語言）| credit 制，2.x 代約為旗艦級一半以下 | 官方 + fal/Replicate 等第三方 |
| Runway Gen-4.5 | 短片段為主（確切上限各來源不一）| 4K（Gen-4 Turbo 起支援）| 原生（2025-12 補上）| credit 制（入門訂閱約 $12–15/月） | 官方 API + Runway Dev |
| Hailuo 3.0（H3）| 5–15 秒，可延至約 30 秒 | 2K | 原生立體聲 | 約 $0.13–$0.26（依解析度與通路報價不一）| 官方 API，權重已開源 |

價格為撰寫時的近似值，各家調價頻繁，採購前請以官方定價頁為準。

## 架構共識：大家都在同一條路上

四家看似各說各話，技術主幹卻高度收斂：**diffusion transformer over latents**。先把影片經 3D VAE 壓進時空 latent 空間，切成 patch，交給 Transformer 做去擴散——Sora 的 spacetime patches 是最早的公開表述，Kling 明載 DiT＋3D VAE，Runway Gen-4.5 的 A2D 架構則是往前一步：用視覺語言模型（Qwen2.5-VL）自迴規劃、平行擴散解碼。第二個共識是**音視同步**：Veo 3 之後，Kling 2.6、Sora 2、Gen-4.5、H3 一年內全部跟進原生音訊——「會出聲」已從賣點變門票。第三是**一致性控制**：參考圖鎖角色（Veo Ingredients、Kling 元素一致性、Runway 多鏡頭）取代了早期「每個 shot 換一批演員」的窘境。

## 版權、浮水印與商業使用

三種做法並存。OpenAI 走「可見＋可驗」：Sora 下載檔帶動態浮水印加 [C2PA 內容憑證](https://openai.com/index/creating-with-sora-safely/)；Google 用隱形的 [SynthID](https://deepmind.google/models/synthid/) 直接嵌進像素與波形，官方稱已標記上百億份內容；部分平台把去浮水印列為付費會員權益、免費層匯出帶浮水印。商業權利方面，主流平台的付費方案普遍允許商用。兩個陷阱值得記住：一是 metadata 可被剝除，偵測不到訊號不等於人類拍的；二是各平台對真人肖像（Sora cameo、真實人物條款）與版權角色的限制逐條不同，商用前必讀服務條款而非看 demo 影片。

## 選型建議

- **行銷短片**：Veo 3.1 是預設答案——原生音訊省掉整段後製配樂流程，Fast 檔迭代草稿、Quality 檔出成品；要壓成本或需要中文口播，Kling 2.6/3.0 的音訊與價格組合更划算。
- **影視前視覺化**：Runway。Gen-4.5 的角色一致性和 Aleph 2.0 的影片編輯是為「導演改稿」設計的，加上 Studio 時間線與 Adobe Firefly 整合，最容易塞進既有製作管線；Luma Ray3.2 的 HDR/EXR 輸出是調色特殊需求。
- **程式化批次生成**：避開所有 credit 制訂閱，直接走按秒計費的 API。Hailuo H3（約 $0.18/秒起、各通路報價不一、權重可自架）適合大批量低成本；Vertex AI 上的 Veo 適合要企業合約與資料治理的場景。唯一不能選的是 Sora——API 正在倒數計時，新工作流別再往上蓋。

## 整體來說

這兩年的故事有三幕：Sora 用一支預覽定義了賽道卻沒贏得比賽；Veo 用原生音訊重新定義了「及格線」，讓所有人一年內被迫跟進；Kling 證明中國短影音體系能把影片模型做成印鈔機，Runway 則證明專業工作流比單點榜單更能留住客戶。下一階段的分水嶺已經很清楚——世界模型（Runway GWM-1、Google 的 Genie 線）與開源權重（H3、Wan）正在把戰場從「誰的片子好看」推向「誰能模擬世界」和「誰能被自己部署」。

---

## 參考資料

- [Sora 2 — OpenAI](https://openai.com/index/sora-2/) — 2025-09-30 發佈公告
- [Video generation with Sora — OpenAI API Docs](https://developers.openai.com/api/docs/guides/video-generation) — sora-2 定價與 2026-09-24 退役公告
- [What to know about the Sora discontinuation — OpenAI Help](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) — App 關閉與資料匯出
- [Creating with Sora safely — OpenAI](https://openai.com/index/creating-with-sora-safely/) — C2PA 與浮水印政策
- [Veo — Google DeepMind](https://deepmind.google/models/veo/) — 現役 Veo 3.1 官方頁
- [Introducing Veo 3.1 and new creative capabilities in the Gemini API — Google Developers Blog](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
- [Gemini API Release Notes — Google AI for Developers](https://ai.google.dev/gemini-api/docs/changelog) — 4K 支援與舊版 Veo 端點退役時程
- [Veo updates coming to Flow — Google Blog](https://blog.google/technology/ai/veo-updates-flow/) — Flow 工具鏈
- [Kling AI — Wikipedia](https://en.wikipedia.org/wiki/Kling_AI) — 1.0（2024-06）到 3.0 的版本時間線與迭代節奏
- [Kling AI Annualized Revenue Run Rate Hits USD240 Million — PR Newswire](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)
- [Introducing Runway Gen-4.5 — Runway Research](https://runwayml.com/research/introducing-runway-gen-4.5) — 2025-12-01、1247 Elo
- [Runway releases its first world model, adds native audio to latest video model — TechCrunch](https://techcrunch.com/2025/12/11/runway-releases-its-first-world-model-adds-native-audio-to-latest-video-model/)
- [Runway API Changelog — docs.dev.runwayml.com](https://docs.dev.runwayml.com/api-details/api_changelog) — Gen-3 系列退役紀錄
- [SynthID — Google DeepMind](https://deepmind.google/models/synthid/) — 隱形浮水印技術
- [Luma model information — lumalabs.ai](https://lumalabs.ai/llm-info) — Ray3.2 為現役模型、1080p 上限
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
