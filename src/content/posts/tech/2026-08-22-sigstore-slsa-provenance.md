---
title: "Sigstore 與 SLSA：驗證誰用哪個 Build Process 產出這份 Artifact"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sigstore, slsa, supply-chain, provenance, security]
lang: zh-TW
tldr: "Sigstore 提供 identity-bound signing、短效憑證與 transparency log；SLSA 定義可信 build provenance 的成熟度。只有在 deploy admission 驗證 identity、issuer、digest 與 build expectations 時才形成防線。"
description: "介紹 Cosign、Fulcio、Rekor、keyless signing、artifact bundles、attestations、SLSA provenance、Build levels、verification policy 與 CI hardening。"
series:
  name: "AI 時代的技術選擇"
  order: 118
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-sigstore-slsa-provenance-en)

[Sigstore](https://docs.sigstore.dev/) 與 [SLSA](https://slsa.dev/) 解決相鄰但不同的問題。Sigstore/Cosign 簽署並驗證 artifact/attestation；SLSA 描述 provenance 應證明什麼、build platform 需要多可信。簽章只證明某 identity 對某 digest 簽過，不會自動證明 source、workflow 或 dependency 安全。

## Keyless 是短效 key，不是沒有 key

Cosign keyless signing 取得 OIDC identity token，產生 ephemeral key pair；Fulcio 驗證 identity 後簽發 short-lived certificate，把 public key 綁到 identity；signing event 記錄於 Rekor transparency log，private key 隨後銷毀。Bundle 可攜帶 signature、certificate、timestamp 與 log inclusion proof，支援不必即時連 log 的驗證。

```sh
cosign verify-blob artifact.tar.gz \
  --bundle artifact.sigstore.json \
  --certificate-identity release@example.com \
  --certificate-oidc-issuer https://accounts.example.com
```

Verification 必須指定預期 identity 與 issuer，不能用過寬 regex 只確認「有人簽過」。CI workload identity 應綁 repository、workflow、ref/environment；release artifact 以 immutable digest 驗證，不以 mutable tag。Rekor 是公開 audit evidence，也代表 identity/artifact metadata 的 disclosure 要先評估。

## Provenance 要和 expectations 比對才有用

SLSA provenance attests 某 build platform 以 build definition、parameters、resolved dependencies 等 inputs 產出 subject digest。Build track 由「provenance exists」逐步提升到 hosted、signed provenance 與 hardened build platform；應以當期 SLSA 版本/track 的 requirements 評估，不能沿用舊版 level 名稱硬貼 badge。

Consumer policy 要檢查 subject digest、builder ID、source repository、commit/tag、workflow/build type、external parameters 與 claimed level。若只保存 provenance 卻 deploy 時不驗證 expectations，攻擊者仍能用正式 builder 執行另一個 debug workflow並得到合法 attestation。

## 簽署點必須在受保護 build boundary

不要讓 user-controlled build step 直接取得長效 signing key，否則 compromised script 可替任意 artifact 簽名。Hosted build platform 應由可信 control plane 自動產 provenance，隔離 runs，限制 release environment，使用 OIDC short-lived identity。Verification failure 要 fail closed，並設計 root rotation、offline bundle、transparency-log outage 與 emergency rollback。

Sigstore/SLSA 與 SBOM、scanner、reproducible build 互補：SBOM 說包含什麼，scanner 找已知風險，provenance 說如何建置，signature 綁 digest 與 identity。完整流程是 build→attest/sign→registry immutable storage→admission verify→runtime inventory，而不是 release 後多放一個 `.sig` 檔。

## 參考資料

- [Sigstore documentation](https://docs.sigstore.dev/)
- [Cosign keyless signing overview](https://docs.sigstore.dev/cosign/signing/overview/)
- [Cosign verification](https://docs.sigstore.dev/cosign/verifying/verify/)
- [Cosign quickstart](https://docs.sigstore.dev/quickstart/quickstart-cosign/)
- [SLSA specification](https://slsa.dev/spec/)
- [SLSA security levels](https://slsa.dev/spec/v1.2/levels)
- [SLSA provenance](https://slsa.dev/spec/v1.2/provenance)
- [SLSA threats and mitigations](https://slsa.dev/spec/v1.2/threats)
