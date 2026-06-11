---
title: "OpenClaw Installation Guide (Part 2): Cloud Platforms, K8s & VPS Deployment"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deployment, kubernetes, fly-io, hetzner, gcp, azure, ansible, vps]
lang: en
tldr: "OpenClaw supports deployment to 9 cloud platforms, K8s, and Ansible automated provisioning — you can run a 24/7 Gateway for as little as $5/month."
description: "Complete OpenClaw cloud deployment guide: Kubernetes, Fly.io, Hetzner, GCP, Azure, Ansible, and general-purpose VPS deployment."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-install-cloud)

The previous post covered local installation; this one covers how to deploy OpenClaw to the cloud. From a $5/month Hetzner VPS to enterprise-grade Azure Bastion, there's documentation for every scenario.

## General VPS Architecture

Regardless of which cloud platform you use, the architecture is the same:

```
Your phone/computer → SSH tunnel or Tailscale → Gateway on VPS (port 18789) → AI model API
```

The Gateway runs on the VPS and serves as the single source of truth for state and workspace. The secure approach is to bind the Gateway to loopback and access it via SSH tunnel or Tailscale. If you need to bind to a broader network, you must set an auth token.

### Performance Tuning

Recommendations for low-power VMs and ARM hosts:
- Enable Node's module compile cache (`NODE_COMPILE_CACHE` environment variable)
- Use SSD storage for state and cache directories
- Set systemd restart policy to `Restart=always`, `RestartSec=2`, `TimeoutStartSec=90`

### Team Deployment

Sharing an agent within the same trust boundary is fine. However, if there are untrusted users, isolate them with separate OS user accounts and independent OpenClaw instances.

## Kubernetes

OpenClaw provides Kustomize-based deployment (no Helm, because "the interesting customization is in agent content, not infrastructure").

**Requirements:** Any K8s cluster (AKS, EKS, GKE, k3s, kind, OpenShift all work).

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
./scripts/k8s/deploy.sh
```

After deployment, access via port-forward:

```bash
kubectl port-forward svc/openclaw 18789:18789 -n openclaw
```

**Created resources:**
- Dedicated namespace
- Single Pod Deployment (with security hardening)
- ClusterIP Service (port 18789)
- 10 GB PVC
- ConfigMap (agent configuration)
- Secret (API key + gateway token)

Customization options:
- Agent instructions: edit `AGENTS.md` in the ConfigMap
- Gateway settings: modify `openclaw.json`
- Multi-provider: patch the Secret to add more API keys
- External exposure: configure `gateway.bind` + Ingress

For local testing, you can use Kind:

```bash
./scripts/k8s/kind-create.sh  # Auto-detects Docker or Podman
```

## Fly.io

Approximately $10-15/month. Includes persistent storage and automatic HTTPS.

**Requirements:** flyctl CLI + Fly.io account + API key.

Key considerations:
- **Memory: 512 MB is insufficient, 2 GB recommended** — otherwise you'll get OOM silent restarts
- The process command needs `--bind lan`, otherwise Fly's proxy can't reach it
- `internal_port` must match the gateway port
- Set `OPENCLAW_STATE_DIR=/data` to ensure data persistence

Security hardening: use `fly.private.toml` to remove the public IP, and access via SSH / WireGuard VPN / local proxy instead.

Recommended specs: `shared-cpu-2x`, 2 GB RAM.

## Hetzner

One of the cheapest options, ~$5/month. Run with Docker on an Ubuntu/Debian VPS.

```bash
# After SSH into the VPS
# Install Docker + Docker Compose
# Configure .env (gateway token, keyring password)
# Configure docker-compose.yml (bind mount ~/.openclaw)
# Start
```

Key points:
- `.env` holds secrets — **do not commit**
- Keep the Gateway on loopback, access via SSH tunnel
- Set restart policy to `unless-stopped`

A community-maintained Terraform module is available for automated provisioning, security hardening, and backup/restore.

## GCP (Google Cloud)

Approximately $5-12/month (e2-small).

| Machine Type | Specs | Monthly Cost | Notes |
|---|---|---|---|
| e2-medium | 2 vCPU, 4 GB RAM | ~$25 | Most stable for Docker builds |
| e2-small | 2 vCPU, 2 GB RAM | ~$12 | Minimum recommended |
| e2-micro | 2 vCPU shared, 1 GB RAM | Free tier | Frequently OOMs |

```bash
# Create VM
gcloud compute instances create openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --boot-disk-size=20GB

# SSH in to install Docker + OpenClaw
# Remote access via SSH tunnel
gcloud compute ssh openclaw-gateway --zone=us-central1-a -- -L 18789:127.0.0.1:18789
```

The Gateway binds to `127.0.0.1:18789` and is accessed from your laptop via SSH port forwarding.

If the build fails with exit code 137 = OOM, upgrade to at least e2-small.

## Azure

Higher monthly cost (VM ~$55 + Bastion ~$140), but the best security.

Architecture:
- **NSG** with three-layer rules: only allow Bastion subnet SSH, block public SSH, block VNet other-source SSH
- **Ubuntu 24.04 LTS VM** with no public IP
- **Azure Bastion** (Standard SKU + tunneling)

```bash
# SSH into VM via Bastion
az network bastion ssh --name "$BASTION" --resource-group "$RG" --target-resource-id "$VM_ID"

# Install OpenClaw inside the VM
curl -fsSL https://openclaw.ai/install.sh | bash
```

Cost-saving tips:
- Deallocate the VM when not in use
- Delete Bastion when not in use (recreate when needed)
- Downgrade Bastion to Basic SKU (~$38/month, but no CLI tunneling support)

Cleanup: `az group delete -n "${RG}" --yes --no-wait`

## Ansible (Automated Provisioning)

Use `openclaw-ansible` for security-oriented automated deployment.

```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

**Requirements:** Debian 11+ or Ubuntu 20.04+, root/sudo access.

Automatically installed components:
- **Tailscale** — VPN mesh, Gateway is only visible within the VPN
- **UFW** — only opens SSH (22) and Tailscale (41641/udp)
- **Docker CE** — used for agent sandbox (Gateway itself runs on the host)
- **Node.js 24 + pnpm**
- **Systemd service** — with security hardening like `NoNewPrivileges`, `PrivateTmp`, etc.

Four-layer defense architecture:
1. Firewall only opens SSH + Tailscale
2. Gateway is only visible within the VPN mesh
3. Docker DOCKER-USER chain blocks external ports
4. Systemd restricts privilege escalation

Verify external exposure: `nmap -p- YOUR_SERVER_IP` should only show port 22.

The playbook is idempotent and can be run repeatedly.

## Other Cloud Platforms

The OpenClaw documentation also covers these platforms (not covered in depth here; each has its own dedicated documentation):

| Platform | Highlights |
|---|---|
| DigitalOcean | Simple VPS, great for getting started |
| Oracle Cloud | Free tier ARM machines available |
| Railway | PaaS, simplest deployment |
| Render | PaaS, automatic HTTPS |
| Northflank | Container PaaS |

## Node Pairing

No matter where the Gateway is, you can pair a Node from your local Mac/iOS/Android device. With the Gateway in the cloud and the Node running locally, you can leverage your phone's camera, screen, location, and other capabilities while keeping state centralized in the cloud.

## Overall Takeaways

Core considerations for choosing a deployment:

| Requirement | Recommendation |
|---|---|
| Cheapest | Hetzner VPS (~$5/month) or GCP e2-micro (free tier) |
| Highest security | Azure Bastion or Ansible + Tailscale |
| Simplest | Fly.io or Railway |
| Most flexible | K8s (your own cluster) |
| Automated | Ansible playbook |

Regardless of your choice, the core principles remain the same: bind the Gateway to loopback, access via SSH tunnel or Tailscale, persist data to a host directory, and set an auth token.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/vps.md](https://github.com/openclaw/openclaw/blob/main/docs/vps.md) — General VPS deployment guide
- [docs/install/kubernetes.md](https://github.com/openclaw/openclaw/blob/main/docs/install/kubernetes.md) — Kubernetes deployment
- [docs/install/fly.md](https://github.com/openclaw/openclaw/blob/main/docs/install/fly.md) — Fly.io deployment
- [docs/install/hetzner.md](https://github.com/openclaw/openclaw/blob/main/docs/install/hetzner.md) — Hetzner deployment
- [docs/install/gcp.md](https://github.com/openclaw/openclaw/blob/main/docs/install/gcp.md) — GCP deployment
- [docs/install/azure.md](https://github.com/openclaw/openclaw/blob/main/docs/install/azure.md) — Azure deployment
- [docs/install/ansible.md](https://github.com/openclaw/openclaw/blob/main/docs/install/ansible.md) — Ansible automated provisioning
- [docs/install/docker.md](https://github.com/openclaw/openclaw/blob/main/docs/install/docker.md) — Docker installation (VPS Docker section)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/main/docs/ci.md) — CI/CD integration
- [docs/install/digitalocean.md](https://github.com/openclaw/openclaw/blob/main/docs/install/digitalocean.md) — DigitalOcean deployment
- [docs/install/oracle.md](https://github.com/openclaw/openclaw/blob/main/docs/install/oracle.md) — Oracle Cloud deployment
- [docs/install/railway.md](https://github.com/openclaw/openclaw/blob/main/docs/install/railway.md) — Railway deployment
- [docs/install/render.md](https://github.com/openclaw/openclaw/blob/main/docs/install/render.md) — Render deployment
- [docs/install/northflank.md](https://github.com/openclaw/openclaw/blob/main/docs/install/northflank.md) — Northflank deployment
