---
title: "Socket.dev：在 Dependency Diff 當下攔截惡意 Package 行為"
date: 2026-08-22
category: tech
type: deep-dive
tags: [socket-dev, supply-chain, dependencies, security, npm]
lang: zh-TW
tldr: "Socket.dev 不只比對 CVE，而是分析新增套件的 install scripts、obfuscation、network、shell 與 ownership 變化，在 dependency merge 前暴露供應鏈行為風險。"
description: "介紹 Socket.dev package behavior analysis、PR alerts、Socket Firewall、policy tuning、lockfiles、malware response 與 SCA 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 111
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-socket-dev-supply-chain-security-en)

[Socket.dev](https://docs.socket.dev/) 聚焦 open-source dependency supply chain。傳統 SCA 常問「這個版本有沒有已知 CVE」；Socket 也觀察 package 是否新增 install script、obfuscated code、native binary、network/filesystem/shell/environment access、可疑 ownership change、typosquat 或 non-immutable Git dependency。這能在惡意套件還沒有 CVE 前提供訊號。

## 最有價值的時刻是 dependency diff

GitHub App 讀取 manifest 與 lockfile 變更，在 PR 留下 alerts。Reviewer 應看到「哪個 direct change 帶進哪個 transitive package、版本行為與上版差在哪裡」，而不是月底才收到整倉庫報表。`socket.yml` 可設定 issue rules、trigger/ignore paths 與 bot handling；policy 應版本控制，ignore 要有 owner、理由與到期日。

Install script 或 network access 不等於惡意：native build、telemetry、download binary 都可能合理。正確流程是確認 package identity、publisher/ownership history、source-to-artifact、script 內容、必要權限與替代方案。Known malware 則應停止 install、移除版本、輪替可能暴露的 credentials、搜尋 IOC，不能只升級後結案。

Socket Firewall 可在 package manager 與 registry 間攔截安裝，降低 developer laptop/CI 在 dependency resolution 階段執行惡意程式的機會。仍要搭配 lockfile、frozen install、registry allowlist、最小 CI token、isolated build、SBOM/provenance 與 artifact signing。Scanner 本身或 GitHub App 也有高權限，要限制 repository scope、審查權限並準備 outage fallback。

Socket.dev 適合 npm 等快速變動 ecosystem 的行為與異常偵測；Snyk 側重 CVE、fix path 與多種 AppSec surfaces；Renovate 負責更新 automation；Sigstore/SLSA 證明 artifact provenance。它們處理不同問題，不能用單一「security check 綠」代替完整供應鏈控制。

## 參考資料

- [Socket documentation](https://docs.socket.dev/)
- [Socket for GitHub](https://docs.socket.dev/docs/socket-for-github)
- [Supply chain risk alerts](https://docs.socket.dev/docs/supply-chain-risk)
- [socket.yml](https://docs.socket.dev/docs/socket-yml)
- [Responding to Socket alerts](https://docs.socket.dev/docs/what-to-do-with-socket-alerts)
- [Getting started and Socket Firewall](https://docs.socket.dev/docs/getting-started)
