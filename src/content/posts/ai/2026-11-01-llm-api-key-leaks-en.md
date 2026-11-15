---
title: "Preventing LLM API Key Leaks: Custody, Supply Chains, and Egress Controls"
date: 2026-11-01
category: ai
type: deep-dive
tags: [ai-security, security, llm, supply-chain]
lang: en
tldr: "A customer's LLM API key can escape through logs, malicious packages, proxy settings, or a hosting platform even when the credential database is encrypted. Reduce the services that can obtain the raw key, then restrict where the provider will accept it."
description: "Compare credential incidents and vulnerability research involving OpenCode Console, LiteLLM, DeepSeek, Hugging Face, and others, then assess encryption, secret stores, isolated model callers, fixed egress IPs, and short-lived identities."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-11-01-llm-api-key-leaks)

An organization asks your AI product to use its own model API key. Your platform stores the credential, makes requests on its behalf, and the provider bills usage to the organization's account. This arrangement is often called bring your own key, or BYOK. Here, that means a model access credential, rather than a customer-managed data encryption key.

For teams building customer support, course summaries, or internal assistants, the harder question is: could someone compromise the platform and copy the complete key? An attacker holding that copy may call the provider directly, bypassing your platform's user permissions and request limits.

This article follows those escape paths through public cases and proposes a custody architecture. The cases favor English-language technical disclosures and cover AI services and related supply chains. Some involve actual intrusions; others demonstrate what researchers could access. They illustrate different defenses rather than form a complete incident census.

## TL;DR

Keep database encryption, then ask three questions: **who can decrypt the key, where does the plaintext travel, and can a copied key work elsewhere?**

Ordinary business services should hold credential references. Only an isolated model-calling service should retrieve the raw key. Keep customer keys out of builds, tests, and logs. Where supported, add provider-side fixed-IP restrictions or use short-lived workload identities.

## Context: accepting a customer's key creates a custody obligation

An API key is usually a bearer credential: possession enables use. A platform can show organization members only the last few characters, but something must still obtain the complete value to authenticate with the provider. [OpenAI's safety guidance](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety) directs production requests through a backend rather than shipping keys in browsers or mobile apps.

Hiding the value in the interface reduces readback and accidental sharing. Services, deployment identities, debugging systems, and dependencies behind that interface may still reach it. The security review has to follow the credential further.

## The problem: the credential table is only one possible exit

The evidence levels matter. “Research” below means researchers demonstrated access, rather than proved criminal exploitation. General supply-chain cases were not necessarily targeting LLM keys.

| Case and timing | How secrets became exposed | Evidence boundary and relevant defense |
|---|---|---|
| [OpenCode Console, reported October 2026](https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/) | Reporting relayed the platform's notice of an intrusion affecting some third-party model keys saved in hosted workspaces | Concerns Console, not all locally stored CLI keys; reporting did not establish the full intrusion path or storage design |
| [LiteLLM / Telnyx, March 2026](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/) | Legitimate packages were published with credential-harvesting malware | A supply-chain compromise, not evidence that every deployment using either package lost secrets |
| [Google / Gemini, disclosed February 2026](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules) | Public Google keys could gain sensitive API access when Gemini was enabled in the same project | A historical permission and default-setting problem; separate public identifiers from AI credentials |
| [AWS / Bedrock, reported February 2026](https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes) | Attackers obtained cloud credentials from public storage, escalated privileges, and abused model services | An observed cloud intrusion involving cloud identities, not an OpenAI API key leak |
| [DeepSeek, January 2025](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak) | Researchers queried an unauthenticated logging database containing plaintext records with API keys | Demonstrated readability; the report did not establish every key's type or validity, or criminal downloads |
| [AgentSmith / LangSmith Prompt Hub, disclosed June 2025](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses) | Adopting a public template with malicious proxy settings could send model traffic and keys to that proxy | Research demonstration; fixed the previous year, with no evidence of active abuse found |
| [Hugging Face Spaces, May 2024](https://huggingface.co/blog/space-secrets-disclosure) | The vendor detected unauthorized access related to Spaces secrets and suspected some secrets might have been read | Some tokens were revoked; this does not establish that all external model-provider keys were stolen |
| [SAP AI Core / SAPwned, disclosed July 2024](https://www.wiz.io/blog/sapwned-sap-ai-vulnerabilities-ai-security) | Researchers crossed isolation boundaries and retrieved plaintext cloud secrets from their own test account | Cross-tenant risk research, since fixed; the report states no customer data was compromised |
| [tj-actions / reviewdog, March 2025](https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5) | A malicious CI action extracted runner-memory secrets and printed encoded copies into workflow logs | General supply chain; public logs could expose decodable copies without a separate exfiltration website |
| [The first Shai-Hulud wave, September 2025](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) | Malicious packages searched for secrets during installation and used stolen tokens to compromise more packages | General credential theft and worm propagation; not every affected environment necessarily contained an LLM key |

Each route requires different work. Public databases need network and authentication controls. Proxy settings require control over authenticated destinations. Malicious packages require a review of every secret their execution environment can reach.

### A platform can send out a key without displaying it

The [AgentSmith research](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses) is especially relevant to workflow products. If an imported template can choose the proxy carrying model requests, a user's credential may leave through an apparently normal request.

Permission to use a credential should therefore be separate from permission to change its destination. Checking whether a user may generate a summary leaves another question unanswered: where will this authenticated request actually go?

### Logs and installation environments create additional copies

The [DeepSeek logging database](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak) shows why the credential table is not the only place to inspect. The [LiteLLM vendor notice](https://docs.litellm.ai/blog/security-update-march-2026) describes malware collecting environment variables and cloud credentials, then sending them to a nonofficial domain.

Moving a key out of source code and into an environment variable can prevent some hardcoding mistakes. It does not stop malicious code in that environment from reading it. The [tj-actions investigation](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised) also shows that encoded workflow output can itself become the leak.

## Reviewing the usual protections against the actual threat

Use this table to identify missing boundaries. It synthesizes the incidents above and the [OWASP Secrets Management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

| Existing protection | What it primarily protects | What still needs attention |
|---|---|---|
| Database encryption | Readability when a database or backup is obtained on its own | Separate key custody and minimal decrypt permissions |
| Environment variables | Keeping keys out of hardcoded source | Malicious code in the same environment, dependencies, and execution identities |
| Secret Manager | Central storage, authorization, and auditing | Services permitted to retrieve secrets and plaintext handling after retrieval |
| Masked UI and last characters | Ordinary readback and accidental screenshots | APIs, logs, tracing, and runtime memory |
| Platform request quotas | Calls that pass through the platform | Provider-side source restrictions and revocation; copied keys can bypass the platform |

[Key Management Services (KMS) and secret stores](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html) are useful controls. They do not make a service with decrypt permissions immune to compromise. Encrypting separately for each customer also does not create access isolation if one identity may retrieve every customer's secret.

## The solution: reduce custody of the raw key

### Create a service dedicated to model calls

For a typical BYOK product, I would place secret retrieval and provider calls in a separate service. After authenticating and authorizing the organization, the business backend sends a credential reference and a constrained request. Only the model-calling service can retrieve the corresponding secret and send it to an approved provider endpoint.

```diagram
title: Keep the raw key inside the model-calling boundary
desc: The business backend sends a credential reference. A separate service retrieves the secret and calls the provider; the ordinary backend cannot read the raw key.
caption: Proposed architecture; initial key ingestion is omitted and must also avoid plaintext logging.
---
<svg viewBox="0 0 400 592">
  <line class="dg-line" x1="200" y1="104" x2="200" y2="188" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="268" x2="200" y2="340" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M328 228 H368 V524 H328" fill="none" marker-end="url(#arrow-link)"/>
  <rect class="dg-box" x="72" y="32" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="58" text-anchor="middle" dominant-baseline="central">Business backend</text>
  <text class="dg-sub" x="200" y="80" text-anchor="middle" dominant-baseline="central">Authorizes the org; cannot read keys</text>
  <text class="dg-edge" x="268" y="144" text-anchor="middle" dominant-baseline="central">Credential ref</text>
  <rect class="dg-box dg-box--accent" x="72" y="188" width="256" height="80" rx="6"/>
  <text class="dg-label" x="200" y="216" text-anchor="middle" dominant-baseline="central">Isolated model caller</text>
  <text class="dg-sub" x="200" y="240" text-anchor="middle" dominant-baseline="central">Only app allowed to retrieve keys</text>
  <rect class="dg-box dg-box--store" x="72" y="340" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="366" text-anchor="middle" dominant-baseline="central">Secret store</text>
  <text class="dg-sub" x="200" y="390" text-anchor="middle" dominant-baseline="central">Per-credential access and audit</text>
  <rect class="dg-box dg-box--link" x="72" y="488" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="514" text-anchor="middle" dominant-baseline="central">Model provider</text>
  <text class="dg-sub" x="200" y="538" text-anchor="middle" dominant-baseline="central">Approved endpoint and fixed egress</text>
</svg>
```

Give this service its own workload identity with narrow permissions. It must not forward arbitrary URLs or accept any supplied credential ID. It still verifies the organization, permitted purpose, and ownership of the referenced credential. Do not offer ordinary administrators a “reveal full key” or bulk-export function.

The initial ingestion endpoint still briefly receives plaintext. Use TLS, disable request-content logging, and return only status after writing. This architecture reduces the number of holders; it does not eliminate every plaintext contact point.

**A first action:** list every service identity allowed to retrieve secrets or decrypt data. Remove permissions that the business backend does not need. [AWS guidance](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html) similarly emphasizes restricted secret access, auditing, and private networking.

### Tighten dependencies, logging, and outbound networking together

The key-holding service should load few nonessential dependencies and should not execute user-uploaded code, external agent tools, or shell jobs. Do not provide customer keys while building or installing packages. Retrieve them through the service identity at runtime.

Pin dependencies with versions and integrity checks, and review updates. Apply a waiting period to ordinary updates while retaining a fast path for urgent security patches. [PyPI's post-incident guidance](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/) recommends lockfiles, dependency cooldowns, and safer release workflows. Pinning a malicious version does not make it safe.

Use an allowlist for logged fields: organization ID, credential version, request ID, and outcome. Do not directly collect complete keys, authentication headers, request contents, or raw upstream errors in logs and tracing. The [OWASP Logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) explicitly identifies access tokens, encryption keys, and primary secrets as data to remove or sanitize.

Enforce outbound restrictions through network policy, allowing only required providers and secret services. The application must also validate the final authenticated destination and redirects. These controls block common arbitrary-host exfiltration paths while leaving other risks, such as abuse through permitted endpoints, to address.

**A first action:** use a synthetic test key through successful requests, invalid inputs, timeouts, and provider errors. Search API responses, logs, traces, and session replays for it. Do not use a real customer key for this test.

### Restrict what someone can do with a copied key

Where supported, restrict the customer's dedicated credential to the platform's fixed egress IPs. [OpenAI's current documentation](https://help.openai.com/en/articles/20001201-ip-allowlisting-for-openai-api) states that requests from other IPs are rejected even with a valid key.

This addresses moving the copy outside the platform. If an attacker controls an allowed host or can proxy traffic through it, source restrictions may be bypassed. Browser CORS and website-origin checks are not substitutes for provider-side IP verification.

Integrations that can avoid long-lived keys should evaluate short-lived workload identities. [OpenAI workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation) exchanges a trusted external identity for a short-lived access token. Organization administrators must configure trust and service-account mappings beforehand; this is not automatic support for arbitrary providers' BYOK credentials.

**A first action:** have the customer create a dedicated project and minimally privileged credential for the product, then test from allowed and disallowed egress addresses. Confirmed leaks require revocation at the provider. Deleting your stored copy does not invalidate the attacker's copy.

## Why this happens: encryption protects a state; requests cross boundaries

A secret may gain another copy as it moves from storage to decryption, SDK configuration, and the outgoing request. Encryption mainly protects stored data. At runtime, some identity still needs a usable credential. This is why [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) treats access control, secrets in memory, auditing, rotation, and revocation separately.

Masking and secret references reduce accidental recording. Process isolation and service identity determine who can actually read the value. For one tool's handling of references and runtime plaintext, see [OpenClaw access control](/posts/ai/2026-03-28-openclaw-auth-secrets-en).

## What to verify: other services cannot obtain the key

For a product holding customer credentials, I would require these outcomes:

- A database backup alone cannot recover raw keys.
- The business backend's identity cannot retrieve secrets or decrypt them.
- The model-calling service cannot send authenticated requests to arbitrary URLs.
- Success and failure paths leave no complete key in logs, errors, or tracing.
- With source restrictions enabled, another egress address cannot use the same key.
- After provider-side revocation, the old copy is unusable.

Budgets and unusual-spend alerts remain useful for limiting losses. To reduce the chance of a complete key being stolen, start with its holders, copies, and outbound destinations.

## References

- [PyPI: LiteLLM / Telnyx supply-chain incident and guidance](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/)
- [LiteLLM: March 2026 security incident notice](https://docs.litellm.ai/blog/security-update-march-2026)
- [Truffle Security: Google API keys and Gemini permission expansion](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules)
- [Google: current Gemini API key types and security settings](https://ai.google.dev/gemini-api/docs/api-key)
- [Sysdig: public-storage credentials, cloud intrusion, and Bedrock abuse](https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes)
- [Wiz: DeepSeek's exposed logging database](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak)
- [Noma: AgentSmith malicious proxy configuration research](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses)
- [Hugging Face: Spaces secrets unauthorized-access notice](https://huggingface.co/blog/space-secrets-disclosure)
- [Wiz: SAPwned isolation research](https://www.wiz.io/blog/sapwned-sap-ai-vulnerabilities-ai-security)
- [tj-actions: changed-files security advisory](https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5)
- [StepSecurity: tj-actions memory and workflow-log disclosure](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised)
- [GitHub: Shai-Hulud and npm supply-chain security](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/)
- [TechCrunch: OpenCode Console incident reporting](https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/)
- [AWS Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OpenAI API key safety guidance](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [OpenAI IP allowlisting](https://help.openai.com/en/articles/20001201-ip-allowlisting-for-openai-api)
- [OpenAI workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation)
