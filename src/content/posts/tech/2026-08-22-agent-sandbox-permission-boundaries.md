---
title: "AI Agent 沙箱逃逸與權限邊界：Container 不是 Security Boundary 的全部"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ai-agent, sandbox, security, least-privilege, containers]
lang: zh-TW
tldr: "Agent execution 要同時限制 kernel、filesystem、process、network、credentials 與 tool authorization；沙箱逃逸只是其中一條路，過寬 API token 往往更直接。"
description: "介紹 AI agent sandbox threat model、container/VM/isolate boundaries、Linux capabilities、seccomp、filesystem、network egress、ephemeral credentials、tool permissions、human approval 與 escape testing。"
series:
  name: "AI 時代的技術選擇"
  order: 121
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries-en)

能執行 shell、Python、browser、MCP 或 cloud API 的 AI agent，必須被視為會處理 attacker-controlled instructions 的 untrusted workload。Prompt injection 不必先突破模型「人格」：只要 repository README、web page、email 或 tool output 能誘導 agent 呼叫高權限能力，就可能造成資料外洩或破壞。

## 先列 capability，不先選 container

Threat model 要列清楚 agent 能讀寫哪些 host/workspace paths、能 spawn 哪些 process、是否可碰 Docker socket/kernel device、能連哪些 network destinations、持有哪些 user/service credentials、可呼叫哪些 tools/actions，以及 output 會送給誰。每一項都要有 deny default、scope、期限、rate/size limit 與 audit。

普通 container 共用 host kernel，不等同 VM boundary。高風險 arbitrary code、多租戶或 hostile artifact 可考慮 microVM/VM、sandboxed runtime 或專用 node；任何邊界仍會有 escape vulnerability與 patch責任。Kubernetes `restricted` Pod Security Standard 是 baseline，不是完整 sandbox：另需 non-root、read-only root filesystem、drop capabilities、seccomp/AppArmor/SELinux、no privileged/hostPath/host namespaces、resource/PID limits 與隔離 runtime class。

## 最常見的逃逸是合法使用過大權限

Agent 在 sandbox 內若拿到 production database admin token 或 unrestricted cloud key，不需 kernel exploit 就能從 HTTPS 正常外洩/刪除。Credentials 應由 broker 依 user、task、resource、action 發 short-lived capability，避免把完整 secret 注入 environment。Tool gateway 每次檢查 end-user authorization、argument schema、object scope 與 idempotency；send/delete/pay/deploy 需要 step-up auth 或 human approval。

Filesystem 使用 per-run ephemeral workspace，只掛必要 input，output 經 allowlist export；阻擋 SSH keys、cloud metadata、host sockets與其他 tenant data。Network預設 deny egress，依 hostname/service proxy allowlist，並防 DNS rebinding、redirect 到 private IP、loopback/metadata endpoints 與 data tunnel。Browser download、archive extraction、symlink/hardlink、Git hooks、package install scripts 都是跨 boundary 路徑。

## 驗收要證明「做不到」

Red-team cases 應嘗試讀 protected files、跨 workspace、連 metadata/private network、fork bomb、耗盡 disk/memory/PID、escape via mount/socket、偷 credentials、繞過 tool approval、在 agent chain 中借用另一個 agent 的權限。觀察 syscall/network/tool audit，強制 timeout與 kill，完成後銷毀環境並驗證 secret revoke。

Model Armor 等 classifier 只能降低惡意內容進入，Promptfoo 可重放攻擊；真正 impact boundary 是 sandbox、network policy、credential broker 與 authorization。設計目標不是保證模型永不受騙，而是即使受騙也只有最小、可回復、可歸責的能力。

## 參考資料

- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Kubernetes security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/)
- [Docker seccomp security profiles](https://docs.docker.com/engine/security/seccomp/)
- [Docker rootless mode](https://docs.docker.com/engine/security/rootless/)
- [Linux capabilities manual](https://man7.org/linux/man-pages/man7/capabilities.7.html)
