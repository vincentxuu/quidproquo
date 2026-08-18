---
title: "OpenClaw 安裝指南（下）：雲端部署的四個決定，與 K8s 上的實際坑"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deployment, kubernetes, fly-io, hetzner, gcp, azure, ansible, vps]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 3
tldr: "雲端部署 OpenClaw 要決定的其實只有四件事：Gateway 綁哪裡、state 放哪裡、誰能連進來、壞了怎麼復原。平台選擇是最不重要的一項。"
description: "OpenClaw 雲端部署指南：VPS 與 K8s 的共同架構、綁定與認證的硬性規則、管理面與 Gateway 存取的分離，以及 Kubernetes 部署裡幾個會咬人的地方。"
draft: false
---

上一篇講本機安裝。這篇不逐一走過每個雲平台——官方的 [Linux server](https://docs.openclaw.ai/vps) 頁面有完整的 provider picker（DigitalOcean、Hetzner、Hostinger、Fly.io、GCP、Azure、Railway、Northflank、Oracle Cloud、Raspberry Pi，AWS 的 EC2／Lightsail 也可以），而且價格與機型隨時在動。

這篇談的是**換哪個平台都不會變的那四個決定**。

## 決定一：Gateway 綁在哪裡

不管跑在誰家的機器上，架構都一樣：

```
你的手機／筆電 → SSH tunnel 或 Tailscale → VPS 上的 Gateway（port 18789）→ 模型 API
```

Gateway 跑在雲端主機上，**是 state 與 workspace 的唯一權威來源**——這句話的實際意義是：那台機器要當成真相來源備份，不是當成隨時可以砍掉重建的執行環境。

安全預設是 Gateway 綁 loopback，靠 SSH tunnel 或 Tailscale Serve 存取。這裡有一條硬性規則值得先記住：**綁到 `lan` 或 `tailnet` 時，Gateway 會要求一組 shared secret**（`gateway.auth.token` 或 `gateway.auth.password`），除非你把認證委派給 trusted proxy。不是建議，是它自己會擋。

## 決定二：先顧管理面，再顧 Gateway

這是最容易跳過、也最容易出事的一步：**主機本身的管理存取，跟 Gateway 的存取是兩件事**，要分開決定。

官方建議的順序是先裝 Tailscale、把 VPS 加進 tailnet、**確認第二條走 Tailscale IP 或 MagicDNS 的 SSH session 真的連得上**，然後才收緊公網 SSH。那個「第二條 session」不是儀式——它是你在關掉唯一一扇門之前，先確認另一扇門開著。

做完這步之後，Gateway 仍然可以維持 loopback，dashboard 走 SSH tunnel 或 Tailscale Serve。兩層是獨立的。

## 決定三：這台 agent 給誰用

一個團隊共用一個 agent 是合理的部署，前提是**所有使用者在同一個信任邊界內**，而且 agent 只做公務。

實務上的三條線：跑在專用的 runtime（VPS／VM／容器 + 專用 OS 帳號）；**不要**用個人的 Apple／Google 帳號或個人瀏覽器、密碼管理器 profile 登入那台機器；如果使用者之間彼此不信任，就按 gateway／主機／OS 帳號拆開，不要靠設定去隔離。

Gateway 在雲端不影響你在本地裝置配對 **node**——螢幕、相機、canvas、`system.run` 這些能力留在本地裝置，state 集中在雲端。

## 決定四：小機器怎麼活下來

低功耗 VM 與 ARM 主機的調校，官方給的組合是：

```bash
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
```

`NODE_COMPILE_CACHE` 改善重複執行 CLI 的啟動時間（第一次會先暖 cache）；`OPENCLAW_NO_RESPAWN=1` 讓例行的 Gateway 重啟留在同一個 process 裡，小主機上少一次 process 交接、PID 也好追。

systemd 那邊值得設的是 `Restart=always`、`RestartSec=2`、`TimeoutStartSec=90`，state 與 cache 路徑放 SSD。`openclaw onboard --install-daemon` 裝的是 user unit，用 `systemctl --user edit openclaw-gateway.service` 改。

看到 **exit 137 就是被 OOM 砍了**，不是設定壞掉——這在 build image 的階段最常發生。

## Kubernetes：起點，不是生產部署

官方講得很直白：K8s manifests 是「最小起點，不是 production-ready 部署」。用 Kustomize 而不是 Helm，理由是 OpenClaw 是單一容器加幾個設定檔，**有趣的自訂在 agent 內容（Markdown、skills、config overrides），不在基礎設施模板**。

```bash
# 換成你的供應商：ANTHROPIC、GEMINI、OPENAI 或 OPENROUTER
export <PROVIDER>_API_KEY="..."
./scripts/k8s/deploy.sh
kubectl port-forward svc/openclaw 18789:18789 -n openclaw
```

`deploy.sh` 預設建立 token 認證，token 要自己撈出來才進得去 Control UI：

```bash
kubectl get secret openclaw-secrets -n openclaw -o jsonpath='{.data.OPENCLAW_GATEWAY_TOKEN}' | base64 -d
```

本機測試可以用 Kind：`./scripts/k8s/create-kind.sh`（會自動偵測 Docker 或 Podman），`--delete` 拆掉。

部署出來的東西是：專用 namespace、單 Pod Deployment（init container + gateway）、ClusterIP Service（18789）、10 Gi PVC、ConfigMap（`openclaw.json` + `AGENTS.md`）、Secret（API key + gateway token）。

三個實際會咬人的地方：

**一、探針不能只看狀態碼。** 官方的 manifests 對 `/readyz`（startup + readiness，五分鐘啟動預算）和 `/healthz`（liveness）都會驗 JSON 探針契約，理由很具體——**Control UI 會用 catch-all `200` 回應不認識的路徑**，所以只看狀態碼的檢查，即使 image 根本沒有那條探針路由也會永遠通過。

**二、`/startupz` 才是比較好的流量准入探針**，因為它不看頻道健康狀態，一個掛掉的頻道帳號就不會把本來健康的 Gateway 踢出 Service endpoints。代價是它需要較新的 image。

**三、ConfigMap 不再是設定的真相來源。** init container 只在 PVC 裡缺檔案時才種子化，**第一次開機之後，PVC 上那份才是真相**——透過 `onboard`、`channels add`、`doctor --fix`、Control UI 做的修改會活過 pod 重啟，而更新 ConfigMap 不會覆蓋既有的 PVC 副本。要刻意從 ConfigMap 重種，得先刪掉持久化的那份再 rollout：

```bash
kubectl exec -n openclaw deploy/openclaw -- rm /home/node/.openclaw/openclaw.json
kubectl rollout restart -n openclaw deploy/openclaw
```

**這一條是行為變更**：舊版模板每次 pod 啟動都會套用 ConfigMap 編輯，並丟掉透過 OpenClaw 本身做的設定變更。如果你的流程依賴舊行為，要改用上面的重種步驟。

另外預設 manifests 讓 gateway 綁 pod 內的 loopback——這對 `kubectl port-forward` 沒問題，但要走 Service 或 Ingress 直接打到 pod IP 就不通，得先改綁定。

## 自動化佈建

`openclaw-ansible` 做的是安全導向的整台機器佈建：VPN mesh 讓 Gateway 只在私網可見、防火牆只留必要的埠、agent 沙箱用容器、systemd 單元加上權限限制。它的價值不在省下打指令的時間，在於**把「這台機器對外只該露出什麼」寫成可重複執行的檔案**，而不是靠人記得。

驗證方式也很直接：從外面掃一次 port，看看是不是只剩你打算留的那個。

## 整體來說

平台選擇是這裡面最不重要的決定——Hetzner 和 GCP 的差別，遠小於「Gateway 綁 loopback 還是綁 lan」的差別。四個決定按重要性排：**綁定與認證**（會不會被人直接連上）、**管理面隔離**（你會不會把自己鎖在外面）、**信任邊界**（這個 agent 給誰用）、**復原能力**（state 有沒有備份、壞了怎麼修）。

平台的價格與機型會變，這四項不會。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修掉一個會失敗的指令**：Kind 建立叢集的腳本已改名為 `./scripts/k8s/create-kind.sh`（原文寫 `kind-create.sh`）。改寫體裁：移除九個雲平台的逐項步驟與月費／機型比較表（價格易變，且官方 provider picker 是更好的入口），改為換平台都不會變的四個決定。新增：綁定 `lan`／`tailnet` 時強制 shared secret 的規則、先驗證第二條 tailnet SSH session 再收緊公網 SSH 的順序、K8s 探針要驗 JSON 契約的理由（Control UI 的 catch-all 200）、`/startupz` 與 `/readyz` 的取捨，以及 ConfigMap 種子化行為變更（PVC 副本才是第一次開機後的真相來源）。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Linux server](https://docs.openclaw.ai/vps) — provider picker、雲端架構、管理面加固與小主機調校
- [Kubernetes](https://docs.openclaw.ai/install/kubernetes) — Kustomize 部署、探針契約與 ConfigMap 種子化行為
- [Install](https://docs.openclaw.ai/install/) — 安裝總覽與各託管方式入口
- [Docker](https://docs.openclaw.ai/install/docker) — 容器化部署與 image 升級行為
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — Gateway 綁定、認證與營運
