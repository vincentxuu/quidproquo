---
title: "GPUtw.ai 是什麼：台灣在地 GPU 雲端、短租算力與研究者工作流"
date: 2026-08-29
category: tech
type: deep-dive
tags: [gputw-ai, gpu-cloud, machine-learning, model-training, taiwan, self-hosting]
lang: zh-TW
tldr: "GPUtw.ai 是台灣在地的短租 GPU 雲端，核心不是最大規模的算力，而是台灣機房、預付點數、Jupyter/ComfyUI/Ollama/vLLM 範本、Vault 與團隊帳務。公開資料足夠做服務介紹，還不足以當正式採購或 production 背書。"
description: "介紹 GPUtw.ai 的產品定位、GPU 目錄、範本、Vault、API、團隊帳務、和 RunPod/Vast/Lambda Cloud 的差異，以及目前公開資料看不到的採購風險。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud-en)

[GPUtw.ai](https://gputw.ai/en) 是台灣在地的 GPU 雲端平台。它提供可短租的 GPU 執行個體，主打台灣機房、中文支援、預付點數、按秒計費、可開統編，以及給研究者和小團隊使用的 Jupyter、ComfyUI、Ollama、vLLM、Unsloth 等範本。

它不是 AWS、GCP、Azure 那種完整 public cloud，也不是只賣一台長租裸機的傳統主機商。比較接近 [RunPod](/posts/tech/2026-08-22-runpod-gpu-cloud) 或 [Lambda Cloud](/posts/tech/2026-08-22-lambda-cloud-gpu) 的某一小塊：使用者選 GPU、選 container image 或範本，等執行個體跑起來，再用 Web UI、SSH 或 API 工作。

這篇是服務介紹，不是實測評測。我查了官網、文件、公開 API、Terms、Privacy 和替代方案公開資料；沒有登入付款、部署 notebook，也沒有跑 benchmark。所以能確認的是公開設計與產品邊界，不能確認實際穩定性、客服速度、發票流程或長任務成功率。

## 它解決的不是最大算力，而是本地摩擦

GPUtw.ai 的存在理由很明確：人在台灣，想用 GPU，但不想先買顯卡、排學校叢集、或把互動式 notebook 放到海外節點。

這個定位會影響你怎麼看它。若你要的是上百張 H100 的分散式訓練，公開目錄不支持這個期待。若你要的是今晚開一張 RTX 3090 跑 PyTorch、LoRA、ComfyUI 或 vLLM，那它的摩擦就比傳統採購小很多。

官方首頁強調專屬 GPU、沒有共享 tenancy、台灣資料中心、2 分鐘部署和 99.9% uptime SLA。這些主張裡，前幾項在文件和 API 中有對應設計；SLA 則要更小心，因為我在公開 Terms 裡沒有看到補償條款或 incident history。

## 目前公開目錄能看到什麼

GPUtw.ai 的 [active GPU catalog API](https://gputw.ai/api/gpus/active) 是公開的，會回傳 GPU 型號、架構、VRAM、目錄價格欄位、可用數和需求狀態。2026-08-29 查詢時，自助可用主要是 RTX 3090 24GB 與 RTX 3090 x2 48GB NVLink；H100、H200、B200、RTX 4090、V100 x8、RTX A5000 等項目多數顯示售罄或沒有硬體。

這個數字要當成快照，不是固定庫存。同日重抓時，RTX 3090 可用數從 3 變成 2。這反而說明 catalog 不是死資料，但也提醒你：文章裡不能寫「它穩定提供 H100」這種公開資料撐不起來的話。

價格也要小心。API 中有 `hourlyPrice`、`liveRentablePrice`、`cpuPerCoreHr`、`diskPerGbHr` 等欄位，但 JSON 本身沒有明示幣別。Threads 搜尋摘要中的台幣價格語境和 API 數值換算大致對得上，但正式判斷仍要以登入部署頁顯示的最終價格為準。

## 範本是它對個人使用者最有感的地方

[GPUtw.ai templates API](https://gputw.ai/api/templates) 會列出公開環境範本。查詢時可看到 JupyterLab、PyTorch 2.x + JupyterLab、Ubuntu 22.04 Base、Ubuntu + CUDA 12、ComfyUI、Ollama + Open WebUI、llama.cpp Server、vLLM Inference Server、Unsloth Fine-Tuning Notebook，以及 DGX Spark ARM64 專用範本。

這代表它不是單純丟一台空機器給你。對個人或學生來說，範本的價值很直接：不用先花半天處理 CUDA、Jupyter、模型服務和 Web UI，能先把模型跑起來。想學模型訓練的人，可以從我另外整理的 [個人學模型訓練要租 GPU 嗎](/posts/ai/2026-08-29-gputw-ai-learning-gpu) 接著看。

要注意一個細節：官方範本 API 裡的 `dockerImage` 多數使用 `gputw/...:latest`，但文件要求使用者部署自訂映像時使用非 `latest` tag 或 `sha256` digest。這不一定矛盾，因為官方維護範本和使用者自訂映像不是同一件事；寫部署腳本時還是應該固定版本。

## Vault、workspace 與資料保存

GPUtw.ai 文件把 `/vault` 和 `/workspace` 分開。`/vault` 是跨工作階段保存資料集、模型權重、checkpoint 和輸出的地方；`/workspace` 是執行個體自己的磁碟，適合安裝套件、解壓縮很多小檔案、編譯或暫存。

短租 GPU 常見的失誤，是跑完才發現成果留在會被刪掉的地方。文件也寫明：若帳戶餘額為 NT$0 或以下，Vault 資料保留 30 天，未儲值則刪除。

Vault 的 API 設計有成熟訊號。文件提到直接 HTTPS 上傳、可續傳分段上傳、單檔最大 2TB、選填 `sha256`、下載支援 byte range，並且有 `upload.gputw.ai` 這個大檔傳輸主機。我有查到 `https://upload.gputw.ai/health` 公開回傳 `status: ok`，但主站 `/api/health` 需要授權。

## API 與權限邊界

GPUtw.ai 的 [REST API quickstart](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart) 涵蓋 GPU 目錄、可用節點、建立執行個體、停止執行個體、管理 HTTP 連接埠、建立 raw TCP/UDP exposure，以及在執行個體中執行指令。這表示它不是只能用網頁點按，也能做自動化。

[API key 文件](https://docs.gputw.ai/zh-TW/docs/api-keys) 把權限切得很細：`catalog:read`、`instances:read`、`instances:create`、`instances:manage`、`instances:exec`、`ports:manage`、`vault:read`、`vault:write`、`billing:read`、`org:manage` 等。`instances:exec` 被獨立列為高風險權限，文件說它會以 root 在容器內執行指令，並寫入稽核紀錄。

這些是加分項。短租 GPU 平台如果把所有能力都塞進一支 full-access token，團隊使用時很快會變成帳號共用和憑證外洩。GPUtw.ai 至少在公開文件中把最小權限、上傳權杖、exec 權限和不可自動化的帳戶安全操作分開了。

## 連接埠與暴露服務

GPUtw.ai 支援 HTTP 連接埠和 raw TCP/UDP exposure。HTTP 連接埠可以是 private、public，或 unlisted + password；raw TCP/UDP 則是 L4 直通，適合本身已有驗證的非 HTTP 服務。

文件在這裡寫得很明確：不要把 Jupyter、ComfyUI、terminal 或其他未驗證 Web UI 用 raw 方式暴露出去。這是好事，因為 AI 學習平台最容易出事的地方，就是把本來只該自己看的 notebook 變成公開服務。

若只是個人學習，最簡單的策略是：Web UI 用 private 或 password-protected unlisted；SSH 用自己的公開金鑰；不要公開 raw TCP/UDP，除非你真的知道該服務本身怎麼驗證。

## 團隊帳務是研究室會在意的功能

GPUtw.ai 的 [Teams 文件](https://docs.gputw.ai/zh-TW/docs/teams) 說，可以把個人帳戶轉成團隊帳戶，邀請已註冊成員，讓成員部署使用 owner 的預付餘額。owner 可以設定每月費用上限、同時執行個體上限，以及是否暫停某個成員部署。

這很對台灣研究室、課程助教或小團隊的需求。問題也在這裡：公開文件只能證明功能設計，不能證明它能順利通過學校報帳流程。我用地址、support email、公司、統一編號等關鍵字查，沒有找到可交叉驗證的公司登記結果。正式採購前，應直接請 GPUtw.ai 提供公司抬頭、統編、發票樣式、付款方式和退款規則。

## 跟 RunPod、Vast、Lambda Cloud 差在哪

相對 [RunPod](/posts/tech/2026-08-22-runpod-gpu-cloud)，GPUtw.ai 的公開產品線小很多。RunPod 有 Pods、Serverless、Clusters 和全球 30+ regions；GPUtw.ai 的優勢是台灣在地、中文支援、預付點數、統編與研究/教學場景。

相對 Vast.ai，GPUtw.ai 比較不像全球 GPU 市集。Vast 的優勢通常是市場供給多、價格可能很低；代價是節點品質、地點、資料邊界和機主差異要自己判斷。GPUtw.ai 比較像受控平台，選項少，但地點和帳務更集中。

相對 Lambda Cloud，GPUtw.ai 不是多節點 cluster 或企業算力雲的替代品。Lambda Cloud 更適合需要 VM、Kubernetes、Slurm 或大型訓練拓撲的團隊；GPUtw.ai 更像「台灣在地、可短租、個人和研究者先用起來」的入口。

## 適合誰，不適合誰

適合：

- 沒有 NVIDIA 顯卡，但想學 PyTorch、LLM 推論、LoRA/QLoRA、ComfyUI 的個人。
- 台灣學生、研究室、小團隊，需要短時間多一張 GPU。
- 需要中文支援、台灣付款、統編發票或台灣資料中心的使用者。
- 想用 API 自動化開關 GPU 執行個體，但規模還不到正式 cluster 的工作。

不適合：

- 需要保證大量 H100/H200/B200 產能的分散式訓練。
- 需要明確 SLA credit、status page、incident history、SOC2/ISO 文件的企業 production。
- 需要 serverless inference、autoscaling、多區域高可用的正式線上服務。
- 不能接受自己負責備份資料的人；Terms 明確把資料備份責任放在使用者身上。

## 整體來說

GPUtw.ai 最合理的定位，是台灣個人與研究者的短租 GPU 工作台。它的公開文件和 API 有不少實作細節，不像只有 landing page；但它也還缺公開第三方評測、正式 SLA 細則、公司登記交叉證據和實測 benchmark。

所以介紹它時，分寸要抓準：可以說它是值得個人小額試用的台灣 GPU cloud，也可以說它適合研究室評估；但不能寫成已驗證可正式採購，更不能寫成 production 推論平台。最好的下一步很簡單：用一筆小額預算開 RTX 3090，測部署、Jupyter/SSH、Vault、停止計費與發票流程。跑過那一輪，才知道它是不是適合你的實際工作流。

## 參考資料

- [GPUtw.ai](https://gputw.ai/en)
- [GPUtw.ai About](https://gputw.ai/about)
- [GPUtw.ai documentation](https://docs.gputw.ai/)
- [GPUtw.ai active GPU catalog API](https://gputw.ai/api/gpus/active)
- [GPUtw.ai templates API](https://gputw.ai/api/templates)
- [GPUtw.ai REST API quickstart](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart)
- [GPUtw.ai API keys](https://docs.gputw.ai/zh-TW/docs/api-keys)
- [GPUtw.ai Vault](https://docs.gputw.ai/zh-TW/docs/vault)
- [GPUtw.ai Teams](https://docs.gputw.ai/zh-TW/docs/teams)
- [GPUtw.ai Terms of Service](https://gputw.ai/terms)
- [GPUtw.ai Privacy Policy](https://gputw.ai/privacy)
- [RunPod pricing](https://www.runpod.io/pricing)
