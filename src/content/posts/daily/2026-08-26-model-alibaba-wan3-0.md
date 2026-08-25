---
title: "模型卡｜Wan3.0"
date: 2026-08-26
category: daily
tags: [ai-agent, model-release, daily, alibaba, model-family-wan]
lang: zh-TW
description: "阿里雲通義萬相正式發布 Wan3.0——單次生成 30 秒影片、支援文件／簡報／試算表當輸入素材，定價每秒 $0.05～$0.20，且首度放棄 Wan 系列的開源權重傳統"
tldr: "Wan3.0：單次生成長度從 Wan2.7 的 15 秒翻倍到 30 秒、最高 1080P、支援 doc/xls/ppt/pdf/md 文件與網頁當生成素材、定價 480P $0.05／720P $0.10／1080P $0.20（每秒），比 Google Veo 3.1 標準檔便宜約 50%，但改為閉源 API-only，且尚未經第三方獨立測試"
series:
  name: "AI Model Tracker"
  order: 6
glossary:
  - term: "Wan"
    def: "阿里雲通義萬相（Tongyi Wan）開發的影片生成模型家族"
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `wan3.0-video` |
| 廠商 | Alibaba Cloud（阿里雲，通義萬相 Wan 團隊） |
| 參數量 | 未公開 |
| Context Window | 非文字模型，無 context window 概念；單次最長生成 30 秒影片，最高 1080P／30fps |
| Input 定價 (USD/1M tokens) | 不適用（按生成秒數計費，見下方定價說明） |
| Output 定價 (USD/1M tokens) | 480P $0.05／秒、720P $0.10／秒、1080P $0.20／秒（30 秒 1080P 影片約 $6.00） |
| 開源 | 否（Wan 2.1／2.2 曾以 Apache 2.0 開源權重，Wan3.0 起改為 API-only 閉源） |
| 發布日 | 2026-08-24（公開 beta 自 2026-08-06 起） |
| 官方公告 | [Alibaba Cloud Model Studio：Wan 3.0](https://modelstudio.console.alibabacloud.com/model-releases/wan3.0-video) |
| HuggingFace | 無（閉源，未上架） |
| 家族 | Wan 3.x（前代 Wan2.7，2026-04-03 發布） |

## 能力亮點

- 單次生成長度從 Wan2.7 的 15 秒翻倍到 30 秒，是目前主流影片模型中少數支援半分鐘單鏡頭敘事的產品
- 新增「Omni Reference」：doc、xls、ppt、pdf、md 檔案與一般網頁都能當生成素材，把表格、簡報、文件內容直接轉成影片
- 可用最多 10 張參考圖同時鎖定角色、場景、道具的一致性，並在多鏡頭切換中維持外觀與空間關係
- 原生音畫同步生成，支援多語言口型對嘴（官方展示同一角色連續切換 8 種語言演唱）

## Benchmark 表現

| 比較項目 | Wan3.0 | Wan2.7（前代） | 競品最強（Google Veo 3.1 標準檔） |
|---|---|---|---|
| 單次生成長度 | 30 秒 | 15 秒 | 未公開明確上限（Veo 3.1 單次約 8 秒） |
| 最高解析度 | 1080P | 1080P | 1080P |
| 1080P 定價（每秒） | $0.20 | 未列每秒價（按次計費） | $0.40 |
| 文件／網頁輸入 | 支援（doc/xls/ppt/pdf/md/網頁） | 不支援 | 不支援 |

⚠️ 以上生成長度、一致性、口型同步等品質相關描述均為 Alibaba 官方展示案例，尚未有第三方獨立測試或標準化 benchmark 分數；定價欄位為官方公告數字。

## 與前代/競品比較

跟 Wan2.7 比，最大進步是生成長度直接翻倍（15 秒→30 秒），且新增了「任何檔案都能當素材」的 Omni Reference 能力——過去只能餵圖片、影片、音訊，現在簡報、試算表、PDF、網頁都能轉成影片腳本的輸入來源，這對行銷、教育、企業內容製作是實用的定位差異，而不只是參數堆疊。

跟 Google Veo 3.1 比，Wan3.0 在 1080P 檔位每秒 $0.20，只有 Veo 3.1 標準檔 $0.40 的一半，價格優勢明顯；但 Veo 3.1 已有較多第三方測試與生態整合，Wan3.0 目前仍只能透過申請制的 API 預覽使用，尚未全面開放，這點在報導中被多次提及為「品質宣稱尚待驗證」的保留條件。

值得注意的策略轉向：Wan 2.1／2.2 曾是少數在 Hugging Face／GitHub 開源權重（Apache 2.0）的主流影片模型，Wan 2.5 之後陸續轉為 API-only，Wan3.0 延續閉源路線——如果你原本依賴 Wan 的開源版本自架推論，Wan 2.2 會是目前唯一還能下載的版本，Wan3.0 只能透過雲端 API 使用。

## 對 Agent 開發的意義

Omni Reference 把「文件轉影片」變成一個 API 呼叫就能完成的任務，對做內容自動化 pipeline 的 agent 有直接影響：過去要先用另一個 agent 把 PDF／簡報摘要成文字腳本，再餵給影片模型，現在可以省略中間的摘要步驟，直接把原始文件丟給 Wan3.0。

- 如果你在做行銷/教育內容自動化 agent：可以設計「上傳簡報→直接產出 30 秒短影音」的單步驟工作流，不用自己維護文件轉腳本的中間層
- 如果你在做多模態內容審核或本地化 agent：30 秒長度加上多語言口型同步，適合拿來做同一支影片的多語系版本批次生成
- 不適合：需要離線／本地部署的場景（Wan3.0 沒有開源權重，只能走雲端 API），以及需要嚴格品質保證的正式生產內容（目前品質宣稱尚未經第三方驗證，且 API 仍是申請制預覽，穩定性與配額都待觀察）

## 今日收穫

以前以為「影片模型的軍備競賽」只會往解析度和生成長度堆規格，但 Wan3.0 的 Omni Reference（把 doc/xls/ppt/pdf/md 都當生成輸入）提醒我，真正的產品差異化常常在「輸入介面多開放」而不是「輸出規格多誇張」。同時它也是一個提醒：開源不是廠商的長期承諾，Wan 從 2.1/2.2 的 Apache 2.0 一路收斂到 Wan3.0 全面 API-only，代表選型時不能只看「這個家族以前有沒有開源」，要看最新版本的實際授權條款。

## 參考資料

- [Alibaba Cloud Model Studio：Wan 3.0 Video Generation](https://modelstudio.console.alibabacloud.com/model-releases/wan3.0-video)
- [Reuters：Alibaba launches Wan3.0 AI video model after $10 billion share sale](https://www.reuters.com/business/retail-consumer/alibaba-launches-wan30-ai-video-model-after-10-billion-share-sale-2026-08-24/)
- [TechNode：Alibaba launches Wan3.0 video model with 30-second generation and document input](https://technode.com/2026/08/24/alibaba-launches-wan3-0-video-model-with-30-second-generation-and-document-input/)
- [eWeek：Alibaba's Wan3.0 Generates 30-Second AI Videos From Documents](https://www.eweek.com/news/alibaba-wan3-ai-video-documents-apac-china/)
- [TheNextWeb：Alibaba launches Wan3.0, its 30-second video model, days after raising $10bn](https://thenextweb.com/news/alibaba-wan3-video-model-after-share-sale)
- [Alibaba Cloud Help Center：Wan3.0 Video Generation API Reference](https://help.aliyun.com/en/model-studio/wan3-video-generation-api-reference)
- [vidcella.ai：Wan 2.7 vs Wan 2.6 — What Actually Changed](https://vidcella.ai/posts/wan-2-7-vs-wan-2-6)
