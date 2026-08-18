---
title: "OpenClaw Installation Guide (Part 2): Four Decisions for Cloud Deployment, and the Real Traps on K8s"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deployment, kubernetes, fly-io, hetzner, gcp, azure, ansible, vps]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 3
tldr: "Deploying OpenClaw to the cloud comes down to four decisions: where the Gateway binds, where state lives, who can reach it, and how you recover. Which platform you pick is the least important of them."
description: "An OpenClaw cloud deployment guide: the architecture shared by VPS and K8s setups, the hard rules on binding and authentication, separating admin access from Gateway access, and several places Kubernetes deployment bites."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-install-cloud)

The previous article covered local installation. This one does not walk through each cloud platform — the official [Linux server](https://docs.openclaw.ai/vps) page has the full provider picker (DigitalOcean, Hetzner, Hostinger, Fly.io, GCP, Azure, Railway, Northflank, Oracle Cloud, Raspberry Pi, with AWS EC2/Lightsail working fine too), and pricing and instance types move constantly.

This article is about **the four decisions that do not change no matter whose machine you rent**.

## Decision 1: where the Gateway binds

Whoever's hardware it runs on, the architecture is the same:

```
Your phone/laptop → SSH tunnel or Tailscale → Gateway on the VPS (port 18789) → model API
```

The Gateway runs on the cloud host and **owns state and workspace as the single source of truth**. Practically, that means treating that machine as something to back up, not as a disposable execution environment you can rebuild at will.

The secure default is binding to loopback and reaching it over an SSH tunnel or Tailscale Serve. One hard rule is worth committing to memory: **binding to `lan` or `tailnet` makes the Gateway require a shared secret** (`gateway.auth.token` or `gateway.auth.password`) unless authentication is delegated to a trusted proxy. That is not advice — it will refuse.

## Decision 2: secure admin access before Gateway access

This is the step most often skipped and most likely to hurt: **administering the host itself and reaching the Gateway are two separate concerns**, decided separately.

The recommended order is to install Tailscale first, join the VPS to your tailnet, **verify that a second SSH session over the Tailscale IP or MagicDNS name actually connects**, and only then restrict public SSH. That second session is not ceremony — it is how you confirm another door is open before closing the only one you have.

Once that is done, the Gateway can still stay on loopback with the dashboard reached over an SSH tunnel or Tailscale Serve. The two layers are independent.

## Decision 3: who this agent is for

One shared agent for a team is a legitimate deployment, provided **every user sits inside the same trust boundary** and the agent is business-only.

Three lines to hold in practice: run it on a dedicated runtime (VPS/VM/container plus a dedicated OS account); **do not** sign that machine into personal Apple/Google accounts or personal browser and password-manager profiles; and if users are adversarial toward each other, split by gateway, host, or OS user rather than trying to isolate them through configuration.

A cloud Gateway does not stop you from pairing **nodes** on local devices — screen, camera, canvas, and `system.run` stay on the local hardware while state stays centralized in the cloud.

## Decision 4: how a small machine survives

For low-power VMs and ARM hosts, the official combination is:

```bash
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
```

`NODE_COMPILE_CACHE` improves repeated CLI startup time (the first run warms the cache). `OPENCLAW_NO_RESPAWN=1` keeps routine Gateway restarts in-process, which means one less process handoff and simpler PID tracking on a small host.

On the systemd side, the settings worth having are `Restart=always`, `RestartSec=2`, and `TimeoutStartSec=90`, with state and cache paths on SSD. `openclaw onboard --install-daemon` installs a user unit; edit it with `systemctl --user edit openclaw-gateway.service`.

**Exit 137 means the OOM killer took it**, not that your config is broken — most often during an image build.

## Kubernetes: a starting point, not a production deployment

The docs are blunt about it: the K8s manifests are "a minimal starting point, not a production-ready deployment." They use Kustomize rather than Helm, on the reasoning that OpenClaw is one container plus some config files, and **the interesting customization lives in agent content (Markdown, skills, config overrides), not in infrastructure templating**.

```bash
# Replace with your provider: ANTHROPIC, GEMINI, OPENAI, or OPENROUTER
export <PROVIDER>_API_KEY="..."
./scripts/k8s/deploy.sh
kubectl port-forward svc/openclaw 18789:18789 -n openclaw
```

`deploy.sh` creates token auth by default, and you have to retrieve that token to get into the Control UI:

```bash
kubectl get secret openclaw-secrets -n openclaw -o jsonpath='{.data.OPENCLAW_GATEWAY_TOKEN}' | base64 -d
```

For local testing, use Kind: `./scripts/k8s/create-kind.sh` (it auto-detects Docker or Podman), with `--delete` to tear it down.

What gets deployed: a dedicated namespace, a single-pod Deployment (init container plus gateway), a ClusterIP Service on 18789, a 10 Gi PVC, a ConfigMap (`openclaw.json` and `AGENTS.md`), and a Secret (gateway token plus API keys).

Three places it actually bites:

**1. Probes cannot check the status code alone.** The manifests assert a JSON probe contract on both `/readyz` (startup and readiness, with a five-minute startup budget) and `/healthz` (liveness), for a concrete reason: **the Control UI answers unknown paths with a catch-all `200`**, so a status-only check would pass forever even against an image where the probe route does not exist.

**2. `/startupz` is the better traffic-admission probe**, because it ignores channel health — one failing channel account then cannot evict an otherwise healthy Gateway from the Service endpoints. The catch is that it requires a newer image.

**3. The ConfigMap is no longer the source of truth for config.** The init container seeds files only when they are missing from the PVC; **after first boot, the copy on the PVC is authoritative**. Changes made through `onboard`, `channels add`, `doctor --fix`, or the Control UI survive pod restarts, and updating the ConfigMap does not overwrite the existing PVC copy. To deliberately reseed from an updated ConfigMap, delete the persisted file and restart:

```bash
kubectl exec -n openclaw deploy/openclaw -- rm /home/node/.openclaw/openclaw.json
kubectl rollout restart -n openclaw deploy/openclaw
```

**This is a behavior change**: the previous template applied ConfigMap edits on every pod start and discarded config changes made through OpenClaw itself. If your workflow relied on that, switch to the reseed steps above.

Note also that the default manifests bind the gateway to loopback inside the pod. That is fine for `kubectl port-forward`, but a Service or Ingress path that reaches the pod IP directly will not work until you change the binding.

## Automated provisioning

What `openclaw-ansible` provides is security-oriented provisioning of the whole machine: a VPN mesh so the Gateway is only visible privately, a firewall that leaves only the necessary ports, containers for the agent sandbox, and systemd units with privilege restrictions. Its value is not the typing it saves — it is **turning "what this machine should expose" into a file you can run again**, rather than something someone has to remember.

Verification is equally direct: scan the ports from outside and check that only the one you intended is still there.

## The big picture

Platform choice is the least important decision here — the gap between Hetzner and GCP is far smaller than the gap between binding to loopback and binding to `lan`. Ranked by what actually matters: **binding and authentication** (can someone connect directly), **admin isolation** (can you lock yourself out), **trust boundary** (who this agent serves), and **recoverability** (is state backed up, and how do you repair it).

Prices and instance types will change. Those four will not.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **One command that would fail was corrected**: the Kind cluster script is now `./scripts/k8s/create-kind.sh` (the original text said `kind-create.sh`). The article was also refocused: per-platform steps and the monthly-cost/instance-type comparison tables for nine clouds were removed (prices move, and the official provider picker is a better entry point), replaced by the four decisions that hold across platforms. Added: the rule that binding to `lan`/`tailnet` forces a shared secret, the ordering that verifies a second tailnet SSH session before restricting public SSH, why K8s probes must assert the JSON contract (the Control UI's catch-all 200), the `/startupz` versus `/readyz` trade-off, and the changed ConfigMap seeding behavior (the PVC copy is authoritative after first boot).

## References

This article draws on the following official OpenClaw documentation:

- [Linux server](https://docs.openclaw.ai/vps) — provider picker, cloud architecture, admin hardening, and small-host tuning
- [Kubernetes](https://docs.openclaw.ai/install/kubernetes) — Kustomize deployment, probe contracts, and ConfigMap seeding behavior
- [Install](https://docs.openclaw.ai/install/) — install overview and hosting entry points
- [Docker](https://docs.openclaw.ai/install/docker) — containerized deployment and image upgrade behavior
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — Gateway binding, authentication, and operations
