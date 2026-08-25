---
title: "Sigstore and SLSA: Verifying Who Built an Artifact with Which Process"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sigstore, slsa, supply-chain, provenance, security]
lang: en
tldr: "Sigstore provides identity-bound signing, short-lived certificates, and transparency logs; SLSA describes trustworthy build provenance. They protect only when admission verifies identity, issuer, digest, and build expectations."
description: "Cosign, Fulcio, Rekor, keyless signing, artifact bundles, attestations, SLSA provenance, Build levels, verification policy, and CI hardening."
series:
  name: "Technology Choices in the AI Era"
  order: 118
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-sigstore-slsa-provenance)

[Sigstore](https://docs.sigstore.dev/) and [SLSA](https://slsa.dev/) solve adjacent problems. Sigstore and Cosign sign and verify artifacts and attestations. SLSA defines what provenance should establish and how trustworthy a build platform is. A signature proves an identity signed a digest, not that source, workflows, or dependencies are safe.

## Keyless means ephemeral keys, not no keys

Cosign keyless signing obtains an OIDC identity token and creates an ephemeral key pair. Fulcio validates the identity and issues a short-lived certificate binding the public key to it. Rekor records the signing event in a transparency log, and the private key is destroyed. A bundle carries the signature, certificate, timestamp, and inclusion proof for offline verification.

```sh
cosign verify-blob artifact.tar.gz \
  --bundle artifact.sigstore.json \
  --certificate-identity release@example.com \
  --certificate-oidc-issuer https://accounts.example.com
```

Verification must specify expected identity and issuer; a broad regex merely proves somebody signed. Bind CI identity to repository, workflow, ref, and environment, and verify immutable release digests rather than tags. Rekor provides public evidence and may expose identity or artifact metadata, which needs review.

## Provenance matters when compared with expectations

SLSA provenance attests that a build platform produced subject digests from a build definition, parameters, and resolved dependencies. The Build track progresses from provenance existence toward hosted, authenticated provenance and hardened build platforms. Evaluate the current SLSA version and track requirements rather than applying an obsolete level badge.

Consumer policy should verify the subject digest, builder ID, source repository, commit or tag, workflow or build type, external parameters, and claimed level. Storing provenance without checking expectations still permits a malicious actor to run an unexpected debug workflow on an official builder and receive a legitimate attestation.

## Sign inside a protected build boundary

Do not expose long-lived signing keys to user-controlled build steps. A compromised script could sign arbitrary outputs. Trusted control planes should generate provenance automatically, isolate runs, protect release environments, and use short-lived OIDC identities. Fail closed on verification and plan root rotation, offline bundles, transparency-log outages, and emergency rollback.

Sigstore and SLSA complement SBOMs, scanners, and reproducible builds. SBOMs list contents, scanners find known risk, provenance explains the build, and signatures bind identity to digest. A complete path is build, attest and sign, immutable registry storage, admission verification, and runtime inventory—not an extra `.sig` file after release.

## References

- [Sigstore documentation](https://docs.sigstore.dev/)
- [Cosign keyless signing overview](https://docs.sigstore.dev/cosign/signing/overview/)
- [Cosign verification](https://docs.sigstore.dev/cosign/verifying/verify/)
- [Cosign quickstart](https://docs.sigstore.dev/quickstart/quickstart-cosign/)
- [SLSA specification](https://slsa.dev/spec/)
- [SLSA security levels](https://slsa.dev/spec/v1.2/levels)
- [SLSA provenance](https://slsa.dev/spec/v1.2/provenance)
- [SLSA threats and mitigations](https://slsa.dev/spec/v1.2/threats)
