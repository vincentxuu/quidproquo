---
title: "Replicate：把模型版本變成 Prediction API，而不是租一台 GPU"
date: 2026-08-22
category: tech
type: deep-dive
tags: [replicate, model-api, inference, machine-learning, cog]
lang: zh-TW
tldr: "Replicate 以 versioned model、prediction、Cog 與 deployment 抽象 GPU；整合者要負責版本釘選、async workflow、webhook 驗證、資料保存與成本上限。"
description: "介紹 Replicate public/custom models、Cog、prediction lifecycle、deployments、webhooks、data retention 與自架推論選型。"
series:
  name: "AI 時代的技術選擇"
  order: 62
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-replicate-model-api-en)

[Replicate](https://replicate.com/docs/reference/how-does-replicate-work) 的核心資源不是 VM，而是 model version 與 prediction。你可以呼叫公開模型，也能用 [Cog](https://replicate.com/docs/get-started/deploy-a-custom-model) 把自己的 weights、dependency 與 `predict()` 打包，再讓平台提供 API 與 GPU scaling。

## Version 要釘死，模型名稱不夠

同一 model 的新 version 可能改 weights、程式、dependency、input schema 或 output。production 請求要固定 version digest，先以 golden inputs 評估新版本，再更新 deployment。公開 community model 也要檢查 license、作者、source、敏感資料政策與供應鏈；能呼叫不等於可商用或可信。

Cog 降低 packaging 成本，卻不是 model quality 保證。local `cog predict`、unit/eval、adversarial input、resource limit 與 output validation 仍要進 CI。

## Prediction 是非同步狀態機

[Create prediction](https://replicate.com/docs/topics/predictions/create-a-prediction/) 支援 sync 與 async。生成圖片、影片或長推論通常用 async：建立 prediction、保存 id、由 webhook/polling 取得 terminal state，再把 output 搬到自己的 storage。client timeout 不代表 prediction 已取消，retry 也不能盲目建立第二份昂貴工作。

[Webhooks](https://replicate.com/docs/topics/webhooks/) 可能重送或亂序。先驗 signature 與 timestamp，再以 webhook id/prediction id 去重；只有狀態允許時轉移。不要信任 payload 內任意 output URL，下載時限制 scheme、host、size、content type 與 timeout，避免 SSRF 與資源耗盡。

## Deployment 用容量換 latency

[Deployments](https://replicate.com/docs/topics/deployments/) 提供 private dedicated endpoint、hardware、min/max instance、rolling/canary/rollback 與 metrics。min=0 可省 idle，但會 cold boot；warm instance 改善 latency。以 queue depth、startup、inference、error、GPU memory 與 cost per successful prediction 調整，而不是只追求零冷啟動。

[Data retention](https://replicate.com/docs/topics/predictions/data-retention/) 對 API prediction 的 input/output/log 有自動清除行為；需要的檔案要立即複製。反過來，機密 input 是否允許送第三方、region/residency、training use、刪除與 audit 必須先過資料治理。

Replicate 適合快速產品化公開或自訂模型。需要完整 training cluster、特殊 runtime/network 或極致成本調校時，RunPod/CoreWeave/Nebius 等較低階平台更合理。驗收要重送 webhook、讓 output 過期、切換 model version、打滿 max instance，確認冪等、保存、rollback 與 budget。

## 參考資料

- [How Replicate works](https://replicate.com/docs/reference/how-does-replicate-work)
- [Deploy a custom model with Cog](https://replicate.com/docs/get-started/deploy-a-custom-model)
- [Create a prediction](https://replicate.com/docs/topics/predictions/create-a-prediction/)
- [Replicate deployments](https://replicate.com/docs/topics/deployments/)
- [Replicate webhooks](https://replicate.com/docs/topics/webhooks/)
- [Replicate data retention](https://replicate.com/docs/topics/predictions/data-retention/)
