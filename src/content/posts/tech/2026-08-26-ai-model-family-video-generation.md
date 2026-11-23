---
title: "影片生成模型家族——Sora 退場之後，Wan 3.0、MiniMax H3、Gemini Omni Flash 與 Kling 4.0 的新格局"
date: 2026-08-26
category: tech
tags: [video-generation, model-family-video, wan, minimax, kling, gemini-omni, sora, diffusion-transformer]
lang: zh-TW
type: deep-dive
tldr: "2026-11 的影片生成已經換了一批主角：Sora app 在 2026-04-26 關閉、API 在 2026-09-24 關閉且沒有替代；Google 在 Gemini API 把 Veo 換成 Gemini Omni Flash（1.2 版 2026-11-05 GA）。Artificial Analysis 含音訊文生影片榜 v2.1 第一是只有 API 的 Wan 3.0（1175），開放權重第一是 MiniMax H3（1163），但它的授權排除美國、歐盟、英國、南韓，產品年營收超過 2,000 萬美元要另取書面授權。前段班分數擠在一起，選型要看單次長度、取得方式、授權與價格，而不是名次。"
description: "影片生成跨家族比較（2026-11）：Sora 退場與 Veo 換代、Wan 2.x 開源到 Wan 3.0 閉源、MiniMax H3 開放權重與授權限制、Kling 3.0→4.0、Seedance 2.5、Runway 轉向多模型平台；附 AA-Video-T2V v2.1 榜單、規格定價對照與選型建議。"
series:
  name: "AI 模型家族"
  order: 18
draft: false
glossary:
  - term: "Diffusion Transformer（DiT）"
    definition: "把擴散模型的主幹從 U-Net 換成 Transformer 的架構。影片生成的主流做法：先用 VAE 把影片壓縮成時空 latent，再由 Transformer 在 latent 上做去擴散。Sora 的 spacetime patches、MiniMax H3 的 Omni Transformer 都屬此路線。"
  - term: "原生音訊"
    aliases: ["native audio"]
    definition: "畫面與聲音（對白、音效、環境音）在同一個生成過程中一起產出，而非後製配音。優勢是唇形同步與音畫一致性。Veo 3 是第一家大規模落地者，2026 年的主流模型都已內建。"
  - term: "Credit"
    definition: "生成平台的虛擬計費單位，不同模型的每秒扣量不同。Runway、Kling 等平台都用 credit 制，實際換算成每秒影片成本後才能跨平台比價。"
  - term: "C2PA"
    definition: "內容來源與真實性聯盟的內容憑證標準，把 AI 生成的出處寫進檔案 metadata。OpenAI 的 Sora 輸出自第一天起就帶 C2PA 加浮水印。"
  - term: "SynthID"
    definition: "Google DeepMind 的隱形浮水印技術，直接嵌在生成的像素或音訊波形裡，肉眼不可見但偵測工具可讀。Veo 與 Imagen 輸出皆內建。"
---

> :globe: [English version](/posts/tech/2026-08-26-ai-model-family-video-generation-en)

2024 年 2 月 OpenAI 丟出 Sora 預覽，把文生影片的競爭議程定了下來；兩年後 Sora 自己先退場了。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的影片生成跨家族比較，寫給要把影片生成接進產品或 agent 工作流的人：讀完你會知道 2026-11 有哪些模型在架、哪些已經關閉、開放權重能不能用在你的市場，以及按用途該先試哪一個。榜單與價格是 2026-11-23 的資料，排名每幾週就會變，引用時請帶日期。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 2026-11 格局：榜單與在架模型

這一年最大的兩個變化都是「退場」：OpenAI 的 [Sora app 在 2026-04-26 關閉、Sora API 在 2026-09-24 關閉](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)，[API deprecations 頁](https://developers.openai.com/api/docs/deprecations)對 `sora-2`、`sora-2-pro` 與 Videos API 寫的替代是「No one-to-one replacement」；Google 則在 Gemini API 把 Veo 3.1 的 preview 端點在 2026-10-22 關掉，[官方建議的替代是 `gemini-omni-1.2-flash`](https://ai.google.dev/gemini-api/docs/deprecations)。

[Artificial Analysis AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video) 用盲測投票排含音訊的文生影片，2026-11-23 的前段如下：

| 模型 | AA Elo（含音訊） | 95% 區間名次 | 類型 | $/分鐘 | 開發方 |
|---|---|---|---|---|---|
| Wan 3.0 | 1175 | 1–3 | 閉源 API | $12.00 | 阿里雲 |
| Utopai X | 1171 | 1–3 | 閉源 | 無 API | Utopai |
| MiniMax H3 (768p) | 1163 | 2–6 | 開放權重（自訂授權） | $4.80 | MiniMax |
| Hyperflow H3 | 1157 | 3–9 | 開放權重（H3 衍生） | 尚未定價 | VideoRebirthAI |
| Dreamina Seedance 2.5 | 1156 | 3–8 | 閉源 | $34.12 | ByteDance |
| Gemini Omni Flash 1.2 | 1154 | 3–9 | 閉源 | $6.26 | Google |
| FLUX 3 Max | 1151 | 4–9 | 閉源 | $8.70 | Black Forest Labs |
| HeyGen Video 1 | 1150 | 4–10 | 閉源 | $2.40 | HeyGen |
| Pika H3 Flex | 1125 | 11–15 | 開放權重（H3 衍生） | $2.10 | Pika |
| Kling 3.0 1080p (Pro) | 1000 | 23–24 | 閉源 | $10.08 | 快手；本榜的 Elo 基準點 |
| Veo 3.1 | 962 | 26–28 | 閉源 | $24.00 | Google 上一代 |

讀這張表要注意三件事。第一，前八名的 95% 區間互相重疊，1150 和 1175 的差距不足以排出穩定的先後，名次只能當「同一梯隊」看。第二，v2.1 把 Kling 3.0 1080p (Pro) 固定在 1000，分數跟舊版榜單（例如本文 2026-08 版引用的 Gen-4.5 1,247 Elo）不能直接比。第三，$/分鐘是 AA 在它的測試設定下（有 1080p 就用 1080p）換算出的 API 價，H3 是 768p，跟別家的 1080p 不是同一個輸出規格。

榜上沒出現的也值得記一下：Kling 4.0 在 2026-10-15 上線，但官方公告時 API 還沒開放，v2.1 榜上只有 Kling 3.0 系列；Runway 的 Gen-4.5 不在 v2.1 的含音訊榜上。開放權重前三名裡，Hyperflow H3 與 Pika H3 Flex 的 Hugging Face 頁都把 MiniMax H3 標為 base model，等於開放權重這一格目前是 H3 一個家族。

## 各家族演化

### Sora：定義了領域，沒撐到第二代

Sora 1 在 2024 年 12 月隨 ChatGPT Plus/Pro 開放，只做無聲影片。2025-09-30 的 [Sora 2](https://openai.com/index/sora-2/) 補上原生同步音訊與 cameo 真人授權機制，iOS App 上線即爆紅。2026-03-24 OpenAI 發出 Sora 2 與 Videos API 的退役通知，app 與網頁版在 2026-04-26 關閉，API 在 2026-09-24 停止接受請求。OpenAI 沒有推出替代的影片 API，還在用 Sora API 的整合必須換供應商；已購買的 Sora credits 可以轉用在 Codex。

### Google：從 Veo 到 Gemini Omni Flash

[Veo](https://deepmind.google/models/veo/) 從 2024 年 5 月首發，2025-05-20 的 Veo 3 是第一個大規模落地的原生音訊模型，2025-10-15 的 [Veo 3.1](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) 補上參考圖鎖角色與首尾幀控制。2026 年 Gemini API 上的影片生成改由 Gemini Omni 這條原生多模態產品線接手：2026-06-30 推出 preview，[2026-08-27 的 Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash) 轉成 GA，[2026-11-05 的 1.2 版](https://ai.google.dev/gemini-api/docs/changelog)把單次生成拉到 15 秒、參考圖增加到 6 張、影片輸出單價降 30%。1.1 的端點從 2026-12-03 起自動轉到 1.2。Gemini API 上的 Veo 2／3.0 端點已在 2026-06-30 關閉，Veo 3.1 系列的 preview 端點在 2026-10-22 關閉，替代都是 `gemini-omni-1.2-flash`。

### Kling：快手的迭代速度

Kling 1.0 在 2024 年 6 月亮相，之後的迭代密度全場最高。[Kling 3.0](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be/)（2026-02-05）把文生、圖生、參考生成與影片編輯併成單一多模態架構，單次 15 秒、多語言原生音訊、多鏡頭分鏡；[2026-04-23 再補上原生 4K](https://kling.ai/blog/kling-ai-introduces-native-4k-video-model)。[Kling 4.0](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-officially-launches-next-generation-kling-40-raising/) 在 2026-10-15 正式上線：單次 30 秒、最多 15 個參考素材與 10 個關鍵幀、最高 10-bit HDR，並接上 Kling MCP 與 CLI；官方公告時 API 還是「即將開放」。商業面的里程碑是 [2025 年 12 月年化營收 run rate 達 2.4 億美元](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)。

### Wan：從開源標竿到只有 API

阿里的 Wan 2.1／2.2 曾是最重要的開源影片模型，[Wan2.2 的權重以 Apache-2.0 釋出](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B)，到今天仍可下載商用。2.5 之後轉向 API，[Wan 3.0](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) 在 2026-08-24 正式推出：單次最長 30 秒、最高 1080P、原生音訊，可以同時拿最多 10 張圖、5 段影片、5 段音訊當參考，也能吃文件與網頁；API 不必申請，按秒計費、生成失敗不收費。Hugging Face 的 Wan-AI 組織沒有 3.0 的權重。發佈當時的細節見 [Wan3.0 模型卡](/posts/daily/2026-08-26-model-alibaba-wan3-0)。

### MiniMax：Hailuo 到 H3 開放權重

MiniMax 的影片線原本以 Hailuo 品牌提供 API。[MiniMax H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) 的權重在 2026 年 7 月底上架 Hugging Face（授權日期 2026-08-02），是目前 AA 榜上分數最高的開放權重模型。要注意釋出的範圍：權重只含 H3-Base，輸出 768p；把輸出升到 2K 的 H3-Regenerate-2K 與前處理系統 H3-Context-IR 都沒有開源，要走 MiniMax 的 API。模型卡寫明單次 4–15 秒、24 fps、32 kHz 立體聲。授權限制見下方「授權、浮水印與商業使用」。

### Seedance：ByteDance 的 30 秒一鏡到底

[Seedance 2.5](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5) 在 2026-07-31 發佈，延續 2.0 的音視訊聯合生成架構，單次生成從 15 秒拉到 30 秒、可多輪延長，單次最多吃 30 張圖、10 段影片、10 段音訊當參考，並支援以時間戳指定要修改的片段。上線在即夢、豆包專業版與 Dreamina，API 走 BytePlus ModelArk（發佈時標為即將上線）。它在 AA 榜上屬於第一梯隊，但 $34.12／分鐘是前段班最貴的。

### Runway：從模型商轉成多模型平台

Runway 是最早商用化的那家：Gen-1、Gen-2（2023）、Gen-3 Alpha（2024-06），[Gen-4.5](https://runwayml.com/research/introducing-runway-gen-4.5) 在 2025-12-01 發佈時登上當時的 AA 文生影片榜第一。2026 年 Runway 沒有推出新一代影片基礎模型，[產品更新紀錄](https://runway.com/changelog)裡的主線是把 Wan 3.0、Seedance 2.5、MiniMax Hailuo 3.0、Gemini Omni Flash、Kling 3.0 等第三方模型接進自家介面與 Runway MCP，加上 Aleph 2.0 影片編輯、Runway Agent、Studio 時間線、Ruby HDR 調色，以及 Premiere Pro、After Effects、DaVinci Resolve 外掛。換句話說，選 Runway 現在是選一個製作環境，不是選一個模型。

**其他**：xAI 的 Grok Imagine Video 1.5 在 v2.1 榜上 1051、$15.00／分鐘；Lightricks 的 LTX-2.5 在 935 左右。Luma 的 Ray3.2 不在 v2.1 榜上，2026-08 時[官方文件](https://lumalabs.ai/llm-info)寫的上限是 1080p，主打 16-bit HDR 輸出。

## 規格與定價對照

只列目前在架、建議選用的世代。價格優先用官方定價；官方沒有公開每秒價時用 AA 的 $/分鐘換算，並標明來源。

| 模型 | 單次最長 | 解析度 | 音訊 | 價格（每秒） | 取得方式 |
|---|---|---|---|---|---|
| Wan 3.0 | 30 秒 | 最高 1080P | 原生 | 1080P 約 $0.20（AA $12.00／分鐘） | 阿里雲 Model Studio API；無權重 |
| MiniMax H3 | 4–15 秒 | 開放權重 768p；2K 要走 API | 原生立體聲 32 kHz | 768p 約 $0.08（AA $4.80／分鐘） | 權重（自訂授權）＋MiniMax API |
| Seedance 2.5 | 30 秒，可多輪延長 | 本文引用的官方頁未列上限 | 原生 | 約 $0.57（AA $34.12／分鐘） | 即夢、Dreamina、BytePlus ModelArk |
| Gemini Omni 1.2 Flash | 15 秒；延伸到最長 30 秒 | 720p 原生；1080p、4K 為升頻 | 原生 | 720p 約 $0.07、1080p 約 $0.104、4K 約 $0.209（官方） | Gemini API |
| Kling 3.0 | 15 秒 | 最高原生 4K | 原生（多語言） | 1080p Pro 約 $0.17（AA $10.08／分鐘） | 官方 API 與第三方平台 |
| Kling 4.0 | 30 秒 | 最高 10-bit HDR；4K、1080p、21:9 標為即將支援 | 原生 | 未公開 API 價 | Kling 平台、MCP、CLI；API 即將開放 |
| Runway Gen-4.5 | 短片段（本文引用來源未列上限） | 本文引用來源未列原生上限 | 原生 | credit 制 | Runway 平台與 API |

Gemini Omni 1.2 Flash 的每秒價是官方按 token 換算的結果（影片輸出 $12.00／百萬 token，720p 每秒 5,792 token），1080p 與 4K 都是升頻，不是原生解析度。各家調價頻繁，採購前以官方定價頁為準。

## 架構共識：大家都在同一條路上

技術主幹高度收斂在 **latent 上的 diffusion transformer**：先把影片壓進時空 latent，切成 patch，交給 Transformer 去擴散。Sora 的 spacetime patches 是最早的公開表述；今天公開得最完整的是 MiniMax H3 的模型卡：33B 參數的稠密單流 Transformer（其中約 13B 在 AdaLN 分支，推論時可預先計算、不必載入），文字由 Qwen3-VL-32B 的第 50 層隱藏狀態編碼，影像 VAE 是空間 16 倍、時間 4 倍壓縮，影像與音訊 latent 由同一個 Transformer 一起預測。

2026 年的三個共識：

- **音視訊聯合生成成了門票。** Veo 3 之後一年內各家全部跟進，Seedance 2.5、Kling 3.0、H3 都把音訊和畫面放在同一個生成過程。
- **單次 30 秒成了新的上限。** Wan 3.0、Seedance 2.5、Kling 4.0 都在 2026 下半年把單次生成拉到 30 秒；Gemini Omni 1.2 Flash 則是 15 秒加對話式延伸。
- **參考素材從「幾張圖」變成「一整包」。** Wan 3.0 可用 10 圖＋5 影片＋5 音訊，Seedance 2.5 是 30 圖＋10 影片＋10 音訊，Kling 4.0 最多 15 個參考加 10 個關鍵幀，H3 的 Ref2VA 版最多 12 個檔案。一致性控制已經從賣點變成基本功能，差別在能塞多少、能不能指定時間點修改。

## 授權、浮水印與商業使用

**開放權重的授權要逐條讀。** [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) 只在「適用地區」授權，而適用地區明文排除歐盟、英國、南韓與美國；商用產品或服務年營收超過 2,000 萬美元要先寄信取得書面授權；商用產品的介面上要明顯標示「MiniMax H3」。使用政策另外要求：在公開環境發佈生成內容時，要清楚標示是機器生成。授權把蒸餾與衍生模型都算進「MiniMax H3 Works」，所以 Hyperflow H3、Pika H3 Flex 這類衍生權重也要一併確認。需要無地區限制的開放權重，目前最穩的是 Apache-2.0 的 Wan2.2，但品質落後一個世代。

**浮水印有三種做法並存。** OpenAI 走「可見＋可驗」：Sora 下載檔帶動態浮水印加 [C2PA 內容憑證](https://openai.com/index/creating-with-sora-safely/)（Sora 已停止服務，這是歷史做法）；Google 用隱形的 [SynthID](https://deepmind.google/models/synthid/) 直接嵌進像素與波形；部分平台把去浮水印列為付費權益。兩個陷阱：metadata 可被剝除，偵測不到訊號不等於人類拍的；各平台對真人肖像與版權角色的限制逐條不同，商用前讀服務條款，不要只看 demo 影片。

## 選型建議

- **要含音訊的最高品質**：Wan 3.0。30 秒單鏡頭與文件、網頁當輸入，適合行銷與教育內容自動化。分數同梯隊、價格約一半的是 Gemini Omni 1.2 Flash（1080p 是升頻），適合已經在 Gemini API 上的團隊。
- **要長敘事與細部編輯**：Seedance 2.5 的 30 秒加多輪延長和時間戳編輯最完整，但單價最高，先用短片段試成本。Kling 4.0 規格相近，等 API 開放後再評估是否能接進自動化流程。
- **要自架**：MiniMax H3 是開放權重第一，模型卡的 SGLang 範例用 4 張 GPU 跑。先確認你的使用者與營運地點不在美國、歐盟、英國、南韓，年營收不超過 2,000 萬美元，並注意開放的只有 768p 的 H3-Base。不符合條件就退回 Apache-2.0 的 Wan2.2，或改用 API。
- **預算有限的批次生成**：Pika H3 Flex（$2.10／分鐘）或 HeyGen Video 1（$2.40／分鐘）；Gemini Omni 1.2 Flash 的 360p 草稿檔約 $0.023／秒，適合先低成本迭代再出成品。
- **影視與剪輯工作流**：Runway。它的價值在 Aleph 2.0 編輯、Studio 時間線與 Adobe、DaVinci 外掛，而且同一個介面能切換 Wan 3.0、Seedance 2.5、Gemini Omni Flash 等模型。
- **還在用 Sora API 或 Veo preview 端點**：這兩組端點都已關閉，要遷移。Veo 的官方替代是 `gemini-omni-1.2-flash`；Sora 沒有官方替代，依上面的用途挑。

在 agent 裡接影片生成時，建議用 Runway Model Router 或自己的路由層把模型 ID 抽出來：這一年 Sora、Veo、Gemini Omni 1.1 都在幾個月內被關閉或改路由，直接寫死模型名稱的整合最容易斷。

## 整體來說

這一年的故事有三條線。第一，先驅退場：Sora 用一支預覽定義了領域，卻在第二代上線一年內關閉；Google 在 Gemini API 上也把 Veo 換成 Gemini Omni。第二，中國廠商佔據前段：Wan、MiniMax、Seedance、Kling 都在第一梯隊或剛推出新世代，而開放權重這一格幾乎全是 H3 家族，授權卻排除美國與歐盟。第三，單一模型的領先期越來越短，Runway 乾脆轉成多模型平台。對選型的意義是：不要押單一模型，把能力需求（長度、參考素材、音訊、解析度）、授權地區與每秒成本列清楚，讓路由層去換模型。

---

## 更新紀錄

- 2026-11-23：資料更新到 2026-11。新增「2026-11 格局」一節，改用 Artificial Analysis AA-Video-T2V v2.1（2026-11-23）的含音訊榜；規格定價表換成目前在架的世代（Wan 3.0、MiniMax H3、Seedance 2.5、Gemini Omni 1.2 Flash、Kling 3.0／4.0、Runway Gen-4.5），新增 Wan、MiniMax、Seedance 三個家族段落與 H3 授權說明。Sora 2、Veo 3.1 降為歷史：Sora API 已於 2026-09-24 關閉，Gemini API 的 Veo 3.1 preview 端點已於 2026-10-22 關閉、官方替代為 `gemini-omni-1.2-flash`；舊版表格的 Sora 2 與 Veo 3.1 價格移除，發佈當時的細節見 [Wan3.0](/posts/daily/2026-08-26-model-alibaba-wan3-0) 與 [Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash) 模型卡。修正錯誤：Hailuo H3 原寫「原生 2K」「5–15 秒、可延至約 30 秒」，依模型卡改為開放權重只到 768p、2K 要走 API，單次 4–15 秒；移除無法以一手來源核對的 Runway Gen-4.5「A2D 架構、Qwen2.5-VL」描述。
- 2026-10-11：統一系列名稱與文末順序，保留跨家族比較層級、既有來源與日期；本次未重新查證事實。

## 參考資料

- [AA-Video-T2V v2.1 — Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/text-to-video) — 含音訊文生影片榜、開放權重排名與 $/分鐘（2026-11-23）
- [What to know about the Sora discontinuation — OpenAI Help](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) — App 2026-04-26、API 2026-09-24 關閉
- [Deprecations — OpenAI API](https://developers.openai.com/api/docs/deprecations) — Sora 2 與 Videos API 退役，通知日 2026-03-24，無一對一替代
- [Sora 2 — OpenAI](https://openai.com/index/sora-2/) — 2025-09-30 發佈公告
- [Creating with Sora safely — OpenAI](https://openai.com/index/creating-with-sora-safely/) — C2PA 與浮水印政策
- [Gemini API Release Notes — Google AI for Developers](https://ai.google.dev/gemini-api/docs/changelog) — Gemini Omni 1.2 Flash（2026-11-05）
- [Gemini deprecations — Google AI for Developers](https://ai.google.dev/gemini-api/docs/deprecations) — Veo 各端點關閉日與替代
- [Gemini Developer API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing) — Gemini Omni 1.2 Flash 各解析度每秒價
- [Veo — Google DeepMind](https://deepmind.google/models/veo/)
- [Introducing Veo 3.1 and new creative capabilities in the Gemini API — Google Developers Blog](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
- [Video generation model Wan3.0 officially launched — Alibaba Cloud](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) — 30 秒、1080P、參考素材上限、API 不必申請
- [Wan-AI/Wan2.2-T2V-A14B — Hugging Face](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B) — Apache-2.0 權重
- [MiniMaxAI/MiniMax-H3 — Hugging Face](https://huggingface.co/MiniMaxAI/MiniMax-H3) — 模型卡：架構、768p／2K、4–15 秒、部署範例
- [MiniMax H3 Community License — Hugging Face](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) — 排除地區、2,000 萬美元門檻、標示義務
- [VideoRebirthAI/hyperflow-h3-flash — Hugging Face](https://huggingface.co/VideoRebirthAI/hyperflow-h3-flash) — base model 標為 MiniMax-H3
- [Introducing Seedance 2.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5) — 2026-07-31 發佈
- [Kling AI Launches 3.0 Model — Kuaishou IR](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be/) — 2026-02-05
- [Kling AI Introduces the World's First Native 4K Video Model — Kling AI](https://kling.ai/blog/kling-ai-introduces-native-4k-video-model) — 2026-04-23 原生 4K
- [Kling AI Officially Launches Kling 4.0 — Kuaishou IR](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-officially-launches-next-generation-kling-40-raising/) — 2026-10-15 上線、30 秒、API 即將開放
- [Kling AI Annualized Revenue Run Rate Hits USD240 Million — PR Newswire](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)
- [Introducing Runway Gen-4.5 — Runway Research](https://runwayml.com/research/introducing-runway-gen-4.5) — 2025-12-01
- [Product Updates & Changelog — Runway](https://runway.com/changelog) — 2026 年第三方模型整合、Aleph 2.0、外掛
- [SynthID — Google DeepMind](https://deepmind.google/models/synthid/) — 隱形浮水印技術
- [Luma model information — lumalabs.ai](https://lumalabs.ai/llm-info) — Ray3.2、1080p 上限
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
