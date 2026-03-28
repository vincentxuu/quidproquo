---
title: "OpenClaw 安裝指南（下）：雲平台、K8s 與 VPS 部署"
date: 2026-03-28
category: ai
tags: [openclaw, deployment, kubernetes, fly-io, hetzner, gcp, azure, ansible, vps]
lang: zh-TW
tldr: "OpenClaw 支援部署到 9 個雲平台、K8s、Ansible 自動化佈建，最低每月 $5 就能跑 24/7 Gateway。"
description: "OpenClaw 雲端部署完整指南：Kubernetes、Fly.io、Hetzner、GCP、Azure、Ansible 與 VPS 通用部署。"
draft: false
---

上一篇講本機安裝，這篇講怎麼把 OpenClaw 部署到雲端。從 $5/月的 Hetzner VPS 到企業級的 Azure Bastion，都有對應的文件。

## VPS 通用架構

不管用哪個雲平台，架構都一樣：

```
你的手機/電腦 → SSH tunnel 或 Tailscale → VPS 上的 Gateway（port 18789）→ AI 模型 API
```

Gateway 跑在 VPS 上，是 state 和 workspace 的唯一權威來源。安全做法是 Gateway 綁定 loopback，透過 SSH tunnel 或 Tailscale 存取。如果要綁到更廣的網路，必須設 auth token。

### 效能調校

低功耗 VM 和 ARM 主機的建議：
- 啟用 Node 的 module compile cache（`NODE_COMPILE_CACHE` 環境變數）
- SSD 儲存給 state 和 cache 目錄
- Systemd restart policy 設 `Restart=always`、`RestartSec=2`、`TimeoutStartSec=90`

### 團隊部署

共用 agent 在同一信任邊界內沒問題。但如果有不信任的使用者，用獨立的 OS user account 和獨立的 OpenClaw 實例做隔離。

## Kubernetes

OpenClaw 提供 Kustomize 部署（不用 Helm，因為「有趣的自訂是在 agent 內容，不是基礎設施」）。

**需求：** 任何 K8s 叢集（AKS、EKS、GKE、k3s、kind、OpenShift 都行）。

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
./scripts/k8s/deploy.sh
```

部署後用 port-forward 存取：

```bash
kubectl port-forward svc/openclaw 18789:18789 -n openclaw
```

**建立的資源：**
- 專用 namespace
- 單 Pod Deployment（有安全強化）
- ClusterIP Service（port 18789）
- 10 GB PVC
- ConfigMap（agent 設定）
- Secret（API key + gateway token）

自訂方式：
- Agent 指令：編輯 ConfigMap 裡的 `AGENTS.md`
- Gateway 設定：改 `openclaw.json`
- 多供應商：patch Secret 加更多 API key
- 對外曝露：設定 `gateway.bind` + Ingress

本機測試可以用 Kind：

```bash
./scripts/k8s/kind-create.sh  # 自動偵測 Docker 或 Podman
```

## Fly.io

月費約 $10-15。有持久儲存、自動 HTTPS。

**需求：** flyctl CLI + Fly.io 帳號 + API key。

關鍵注意事項：
- **記憶體：512 MB 不夠，建議 2 GB**，不然會 OOM silent restart
- process command 要加 `--bind lan`，否則 Fly 的 proxy 連不到
- `internal_port` 要對到 gateway port
- 設 `OPENCLAW_STATE_DIR=/data` 確保資料持久化

安全強化：用 `fly.private.toml` 去掉 public IP，改用 SSH / WireGuard VPN / local proxy 存取。

推薦規格：`shared-cpu-2x`、2 GB RAM。

## Hetzner

最便宜的選項之一，~$5/月。用 Docker 跑在 Ubuntu/Debian VPS 上。

```bash
# SSH 到 VPS 後
# 裝 Docker + Docker Compose
# 設定 .env（gateway token、keyring password）
# 設定 docker-compose.yml（bind mount ~/.openclaw）
# 啟動
```

重點：
- `.env` 放 secrets，**不要 commit**
- Gateway 保持 loopback，用 SSH tunnel 存取
- restart policy 設 `unless-stopped`

社群維護的 Terraform module 可以做自動化佈建、安全強化、備份還原。

## GCP (Google Cloud)

月費約 $5-12（e2-small）。

| 機型 | 規格 | 月費 | 備註 |
|---|---|---|---|
| e2-medium | 2 vCPU, 4 GB RAM | ~$25 | Docker build 最穩 |
| e2-small | 2 vCPU, 2 GB RAM | ~$12 | 最低建議 |
| e2-micro | 2 vCPU shared, 1 GB RAM | Free tier | 常 OOM |

```bash
# 建 VM
gcloud compute instances create openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --boot-disk-size=20GB

# SSH 進去裝 Docker + OpenClaw
# 遠端存取用 SSH tunnel
gcloud compute ssh openclaw-gateway --zone=us-central1-a -- -L 18789:127.0.0.1:18789
```

Gateway 綁 `127.0.0.1:18789`，透過 SSH port forward 從筆電存取。

build 失敗出現 exit code 137 = OOM，升級到至少 e2-small。

## Azure

月費較高（VM ~$55 + Bastion ~$140），但安全性最好。

架構：
- **NSG** 三層規則：只允許 Bastion 子網 SSH、封鎖公網 SSH、封鎖 VNet 其他來源 SSH
- **Ubuntu 24.04 LTS VM**，沒有 public IP
- **Azure Bastion**（Standard SKU + tunneling）

```bash
# 透過 Bastion SSH 進 VM
az network bastion ssh --name "$BASTION" --resource-group "$RG" --target-resource-id "$VM_ID"

# VM 裡裝 OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
```

省錢方式：
- 不用時 deallocate VM
- 不用時刪掉 Bastion（用時再建）
- Bastion 降級到 Basic SKU（~$38/月，但不支援 CLI tunneling）

清理：`az group delete -n "${RG}" --yes --no-wait`

## Ansible（自動化佈建）

用 `openclaw-ansible` 做安全導向的自動化部署。

```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

**需求：** Debian 11+ 或 Ubuntu 20.04+，root/sudo 存取。

自動安裝的元件：
- **Tailscale** — VPN mesh，Gateway 只在 VPN 內可見
- **UFW** — 只開 SSH (22) 和 Tailscale (41641/udp)
- **Docker CE** — agent sandbox 用（Gateway 本身跑在 host 上）
- **Node.js 24 + pnpm**
- **Systemd service** — 有 `NoNewPrivileges`、`PrivateTmp` 等安全強化

四層防禦架構：
1. 防火牆只開 SSH + Tailscale
2. Gateway 只在 VPN mesh 可見
3. Docker DOCKER-USER chain 封鎖外部 port
4. Systemd 限制權限提升

驗證外部曝露：`nmap -p- YOUR_SERVER_IP` 應該只看到 port 22。

Playbook 可以重複執行（idempotent）。

## 其他雲平台

OpenClaw 文件還涵蓋這些平台（本篇未深入，各有獨立文件）：

| 平台 | 特點 |
|---|---|
| DigitalOcean | 簡單的 VPS，適合入門 |
| Oracle Cloud | 有 free tier 的 ARM 機器 |
| Railway | PaaS，部署最簡單 |
| Render | PaaS，自動 HTTPS |
| Northflank | 容器 PaaS |

## Node 配對

不管 Gateway 在哪裡，都可以從本地 Mac/iOS/Android 配對 Node。Gateway 在雲端、Node 在本地，讓你用手機的 camera、螢幕、位置等功能，但 state 集中在雲端。

## 整體來說

部署選擇的核心考量：

| 需求 | 推薦 |
|---|---|
| 最便宜 | Hetzner VPS (~$5/月) 或 GCP e2-micro (free tier) |
| 安全性最高 | Azure Bastion 或 Ansible + Tailscale |
| 最簡單 | Fly.io 或 Railway |
| 最靈活 | K8s（自己的叢集）|
| 自動化 | Ansible playbook |

不管選哪個，核心原則不變：Gateway 綁 loopback、SSH tunnel 或 Tailscale 存取、資料持久化到 host 目錄、設 auth token。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/vps.md](https://github.com/openclaw/openclaw/blob/main/docs/vps.md) — VPS 通用部署指南
- [docs/install/kubernetes.md](https://github.com/openclaw/openclaw/blob/main/docs/install/kubernetes.md) — Kubernetes 部署
- [docs/install/fly.md](https://github.com/openclaw/openclaw/blob/main/docs/install/fly.md) — Fly.io 部署
- [docs/install/hetzner.md](https://github.com/openclaw/openclaw/blob/main/docs/install/hetzner.md) — Hetzner 部署
- [docs/install/gcp.md](https://github.com/openclaw/openclaw/blob/main/docs/install/gcp.md) — GCP 部署
- [docs/install/azure.md](https://github.com/openclaw/openclaw/blob/main/docs/install/azure.md) — Azure 部署
- [docs/install/ansible.md](https://github.com/openclaw/openclaw/blob/main/docs/install/ansible.md) — Ansible 自動化佈建
- [docs/install/docker.md](https://github.com/openclaw/openclaw/blob/main/docs/install/docker.md) — Docker 安裝（VPS Docker 部分）
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/main/docs/ci.md) — CI/CD 整合
- [docs/install/digitalocean.md](https://github.com/openclaw/openclaw/blob/main/docs/install/digitalocean.md) — DigitalOcean 部署
- [docs/install/oracle.md](https://github.com/openclaw/openclaw/blob/main/docs/install/oracle.md) — Oracle Cloud 部署
- [docs/install/railway.md](https://github.com/openclaw/openclaw/blob/main/docs/install/railway.md) — Railway 部署
- [docs/install/render.md](https://github.com/openclaw/openclaw/blob/main/docs/install/render.md) — Render 部署
- [docs/install/northflank.md](https://github.com/openclaw/openclaw/blob/main/docs/install/northflank.md) — Northflank 部署
