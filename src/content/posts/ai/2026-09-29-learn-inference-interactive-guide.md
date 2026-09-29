---
title: "Learn Inference：把《Inference Engineering》做成可以轉旋鈕的互動版"
date: 2026-09-29
category: ai
type: deep-dive
tags: [inference, llm-inference, model-serving, gpu, learning-path]
lang: zh-TW
tldr: "learn-inference.com 是 Philip Kiely《Inference Engineering》（256 頁，Baseten 出版，可免費下載 PDF）的非官方互動版：照原書 8 章、42 節重寫解說，把 TTFT、P99、speculative decoding、prefix cache 路由這類靠直覺的概念做成可以拖滑桿的模擬器，另外附免金鑰的 JSON API 與 MCP server。"
description: "介紹 Learn Inference 這個推論工程互動學習網站：它和原書的關係、模擬器怎麼幫你建立直覺、章節地圖、給 agent 用的 llms.txt 與 MCP 介面，以及依角色的閱讀路線和限制。"
draft: false
glossary:
  - term: "TTFT"
    aliases: ["time to first token", "首 token 延遲"]
    definition: "從送出請求到收到第一個 token 的時間，主要由 prefill 階段決定。"
    context: "Learn Inference 首頁的第一個模擬器就是讓你分別調 TTFT 與每秒 token 數，感受兩者的差別。"
  - term: "prefill / decode"
    aliases: ["prefill", "decode"]
    definition: "LLM 推論的兩個階段：prefill 一次處理整段 prompt，受算力限制；decode 每次前向傳遞只吐一個 token，每次都要從記憶體讀一遍整個模型，受頻寬限制。"
    context: "原書與網站把整個推論工程建立在這個兩階段區分上。"
  - term: "roofline"
    aliases: ["roofline model", "屋頂線模型"]
    definition: "用算術強度（每讀一 byte 做幾次運算）判斷一個工作負載卡在記憶體頻寬還是算力的圖。斜線是頻寬上限，平頂是算力上限。"
    context: "網站 2.4 節的模擬器用它說明 batch size 1 的 decode 為什麼永遠卡在頻寬那一側。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-learn-inference-interactive-guide-en)

「訓練教會模型它知道什麼。推論是那之後的一切——每一次有人使用它，而帳單真正落在這裡。」這是 [Learn Inference](https://learn-inference.com/) 首頁的第一段話。

這個網站是 [Philip Kiely](https://www.baseten.co/inference-engineering/) 的《[Inference Engineering](https://www.baseten.co/inference-engineering/)》的互動版。原書 256 頁，由 Baseten 出版，可以免費下載 PDF。網站照原書 8 章、42 節的結構走，解說重寫過，而且把那些「讀一段不如轉一下旋鈕」的概念做成了模擬器。如果你會呼叫 LLM API，但說不清楚為什麼自架的模型第一個字要等 400ms、之後卻一秒吐 30 個字，這個網站就是寫給你的。

## 它是什麼：一本書的非官方互動版

先講清楚它和原書的關係。網站的 [About 頁](https://learn-inference.com/about)寫得很直接：這是獨立專案，和 Baseten 與 Philip Kiely 都沒有關係，沒有人審過或背書；如果重寫的解說或圖出錯，「錯在這裡，不在書裡」。作者沒有署名，About 頁甚至說「網站不會告訴你，但你可以問每章的 Ask AI」。

所以它的定位是：內容範圍等於原書，表現形式換成網頁加模擬器。原書自己怎麼定義讀者，[Baseten 的書頁](https://www.baseten.co/inference-engineering/)說得很誠實：前二十頁誰都能讀，之後最好有基本的程式與計算機概論背景。網站沿用同一個門檻。

跟其他學推論的管道比，它的位置大概是這樣：

| 管道 | 強項 | 缺點 |
|---|---|---|
| 原書 PDF | 完整、有作者本人的判斷 | 靜態，數字只能用想的 |
| [Stanford CS336 的推論那堂](/posts/ai/2026-08-22-cs336-inference) | 從第一原理推導，有作業 | 偏研究，不太碰 autoscaling、多雲調度這些維運題目 |
| [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) 等引擎文件 | 設定細節最準 | 只講自己，不講取捨全貌 |
| Learn Inference | 全貌 + 模擬器，免費、免註冊 | 非官方改寫，錯誤由網站自負 |

## 為什麼推論值得單獨學

網站 0.1 節先講一個常被忽略的差別：訓練是專案，有預算、有結束的一天；推論是營運，沒有結束日，負載由別人決定，成本跟著你的成功一起長。接下來全書反覆用到的，是推論本身的兩個階段：prefill 一次處理整段 prompt，是算力瓶頸；decode 每前進一個 token 就要從記憶體讀一遍整個模型，是頻寬瓶頸。

這兩個階段分別對應兩個使用者感受得到的數字：TTFT（第一個字多久出現）和 TPS（之後每秒吐幾個字）。首頁放的第一個模擬器（出自 1.4 節）就是讓你分開調這兩個滑桿，然後按「Run」看回應怎麼串流出來。它想讓你親眼看到的結論是：

> A response that starts instantly and trickles can feel faster than one that pauses and then dumps, even when the second finishes first.

一開始就出現、之後慢慢流出來的回應，可能比先停頓再一口氣倒出來的感覺更快，即使後者比較早結束。這句話讀過就忘，拖一次滑桿就記住了。這也是整個網站的賭注。

後面第 5 章的量化、speculative decoding、KV cache 重用、平行化、disaggregation，網站的章節導言是這樣定位的：每一招都在拿精度、記憶體、複雜度或硬體去換延遲或吞吐量，這一章要教的是「知道自己在做哪一種交換」。

## 模擬器才是重點

網站把全書的「圖」都做成了互動元件，[llms.txt](https://learn-inference.com/llms.txt) 裡寫明了原因：這些圖教的是「對輸入的反應」，寫成文字就不見了。幾個值得專程去玩的：

- **1.4 平均值會藏起最慢的請求**：把分布的尾巴往右拉，平均值幾乎不動，P99 卻一路飆高。圖說寫：那個差距就是「一百個使用者裡覺得你的產品壞掉的那一個」。
- **2.4 Roofline**：斜線是記憶體頻寬允許的上限，平頂是 tensor core 的上限。batch size 1 的 decode 在每一張買得到的 GPU 上都落在交點左邊很遠的地方——這就是 batching 存在的理由。
- **5.2 Speculative decoding 什麼時候開始虧**：拉低接受率、拉長草稿長度，加速比會掉到 1 以下，等於花算力讓自己變慢。[該節正文](https://learn-inference.com/chapters/techniques/speculative-decoding)也補了一句容易被忽略的：batch 大的時候算力不再閒置，投機解碼反而可能降低總吞吐量。
- **5.3 Prefix caching 的路由問題**：共用前綴只需要算一次，但 cache 只存在某一個 replica 上。沒有 cache-aware routing 的話，8 個 replica 的叢集只有八分之一的機率命中，理論上的收益大多就這樣悄悄流失了。
- **7.2 冷啟動的組成**：把冷啟動拆成四個階段，說明為什麼 warm pool 最有價值——它消掉的是你唯一控制不了的那一段（跟雲端商要 GPU）。

有一個細節讓我比較信任這個網站：每張圖底下都標了數字的來源，分成「Illustrative numbers」（示意）、「Constants from the book」（書中常數）和「Datasheet numbers」（規格表數字）三種。它沒有把示意值包裝成實測值。

## 章節地圖

| 章 | 主題 | 一句話 |
|---|---|---|
| 0 | [Inference](https://learn-inference.com/chapters/inference) | runtime、基礎設施、工具鏈三層，缺一不可 |
| 1 | [Prerequisites](https://learn-inference.com/chapters/prerequisites) | 動 kernel 之前先把「夠快」寫成數字 |
| 2 | [Models](https://learn-inference.com/chapters/models) | 從線性層到 transformer 到 diffusion，算出瓶頸在哪 |
| 3 | [Hardware](https://learn-inference.com/chapters/hardware) | 看懂 GPU 規格表，Hopper 到 Rubin 各世代 |
| 4 | [Software](https://learn-inference.com/chapters/software) | CUDA → PyTorch → vLLM / SGLang / TensorRT-LLM、NVIDIA Dynamo |
| 5 | [Techniques](https://learn-inference.com/chapters/techniques) | 量化、投機解碼、快取、平行化、disaggregation |
| 6 | [Modalities](https://learn-inference.com/chapters/modalities) | VLM、embedding、ASR、TTS、圖像與影片生成 |
| 7 | [Production](https://learn-inference.com/chapters/production) | 容器、autoscaling、多雲 GPU 調度、零停機部署、client 端 |

另外有一份[術語表](https://learn-inference.com/chapters/glossary)和按領域分組的[延伸閱讀](https://learn-inference.com/chapters/reading)，後者是原書附錄 B 的論文與文章清單。

## 給 agent 用的那一面

這個網站對 agent 的友善程度，比多數文件站高很多。[Developers 頁](https://learn-inference.com/developers)列了四種取用方式：

- 任何頁面網址加上 `.md` 就拿到 Markdown，或送 `Accept: text/markdown`
- 全書合成一份：[`/llms-full.txt`](https://learn-inference.com/llms-full.txt)，索引在 [`/llms.txt`](https://learn-inference.com/llms.txt)
- 唯讀 JSON API：`GET /api/v1/chapters`，免帳號、免金鑰，有 [OpenAPI 3.1 規格](https://learn-inference.com/openapi.json)
- MCP server，提供 `list_chapters` 和 `get_chapter` 兩個工具，不用驗證

接到 Claude Code 或 Claude Desktop 只要一段設定：

```json
{
  "mcpServers": {
    "learn-inference": {
      "url": "https://learn-inference.com/api/mcp"
    }
  }
}
```

我實際打過 MCP 的 `tools/list`，兩個工具都有回來。要注意的是，MCP 和 API 暴露的是「章節索引」，不是全文；要讀內文還是走 `.md` 或 `llms-full.txt`。原書作者也提醒過，全書大約 6 萬 token，別一次整本塞進 agent。

每章都有 Ask AI，可以針對當前頁面發問。[隱私頁](https://learn-inference.com/privacy)說明問題會連同你正在看的頁面一起送經 Vercel AI Gateway，它只能讀站內頁面；IP 會先雜湊再用來限流。

## 怎麼讀

看你是誰：

- **應用層工程師**（呼叫 API、做 RAG 或 agent）：先讀第 0、1 章，然後跳 5.3 Caching 和 7.5 Client code。今晚就能做的事：把你服務的 TTFT 和 P99 分開量，不要只看平均延遲。
- **要自架模型的人**：2.4 → 3 → 4.3 → 5 依序讀，每節先玩模擬器再讀正文。讀完可以接站上的[開源 LLM 自架指南](/posts/ai/2026-08-26-open-source-llm-self-hosting-guide)，把概念對到實際的框架選型。
- **在準備面試的人**：第 5 章五節每一節都是 ML system design 的常考點，模擬器的圖說剛好可以當一句話的答案。

## 限制

- **不是原書**：解說是重寫的，網站自己也說錯誤由它負責。要引用數字或論點，回去對[原書](https://www.baseten.co/inference-engineering/)。
- **示意數字很多**：大多數模擬器標的是「Illustrative numbers」，拿來建立直覺可以，拿來估算你自己的延遲或成本不行。
- **作者匿名**：沒有署名就沒有可追溯的專業背書；對一份教材來說，這代表你要自己多查證。
- **偏 NVIDIA 視角**：硬體與軟體章節以 NVIDIA 生態系為主，其他加速器在 3.4 節只做概覽，這一點是承襲原書的取材。

## 參考資料

- [Learn Inference](https://learn-inference.com/) — 網站首頁
- [Learn Inference：About](https://learn-inference.com/about) — 與原書的關係、非官方聲明
- [Learn Inference：Developers](https://learn-inference.com/developers) — JSON API、MCP server、錯誤格式與版本政策
- [Learn Inference：llms.txt](https://learn-inference.com/llms.txt) — 全站章節索引與模擬器說明
- [Learn Inference：Privacy](https://learn-inference.com/privacy) — Ask AI 的資料流向
- [Learn Inference：5.2 Speculative decoding](https://learn-inference.com/chapters/techniques/speculative-decoding)
- [Inference Engineering（Baseten Books）](https://www.baseten.co/inference-engineering/) — 原書，Philip Kiely 著，可免費下載
- [Stanford CS336：推論](/posts/ai/2026-08-22-cs336-inference) — 站內相關文章
- [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine) — 站內相關文章
- [開源 LLM 自架指南](/posts/ai/2026-08-26-open-source-llm-self-hosting-guide) — 站內相關文章
