---
title: "執行環境與沙箱怎麼選：從 Namespace、gVisor 到 Firecracker、E2B、Lambda MicroVMs 的隔離光譜"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, firecracker, gvisor, docker, e2b, cloudflare, ai-agent]
lang: zh-TW
tldr: "沙箱不是單一套件，而是 Namespace、cgroups、seccomp、gVisor、Firecracker 層層疊起的光譜；本地 OS 級沙箱管爆破半徑，雲端 microVM 管多租戶隔離，選型關鍵在信任邊界與維運成本。"
description: "以 Anthropic sandbox-runtime、gVisor、Firecracker、nsjail、Hades 以及 E2B、Daytona、Modal、Cloudflare 與 AWS Lambda MicroVMs 為例，拆解執行環境與沙箱設計的四大支柱、隔離層級與選型取捨。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-30-execution-environment-sandbox-comparison-en)

讓模型幫你跑程式碼之前，先回答一個比模型能力更重要的問題：程式碼在哪裡跑、能看到什麼、能碰到誰。這篇把近一年各家執行環境的實際設計，整理成一條可對照的隔離光譜。

讀完你會得到三件事：沙箱設計的四根柱子與三種建構模式、從 [Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) 到 [Firecracker](https://github.com/firecracker-microvm/firecracker)、[gVisor](https://gvisor.dev/)、[E2B](https://e2b.dev/)、[AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) 各家的定位與取捨，以及一份今晚就能照著做的選型決策樹。

## 沙箱是什麼：先對齊名詞

沙箱（Sandbox）不是某個套件名稱，而是「把不可信程式關在限定範圍內跑」的組合技。比喻很直觀：在沙坑裡玩沙，沙子弄亂了也只落在坑內，不會弄髒客廳。

沙箱有三個核心動作，可歸納為：

- **隔離（Isolation）**：讓程式看不到不該看的東西
- **限制（Restriction）**：只給最小必要權限與資源
- **重置（Reset）**：用完即丟，回到乾淨狀態

而設計上則有四大支柱：

1. **隔離層級**：決定防禦硬度與成本，見下一節光譜
2. **存取控制與資源限制**：檔案系統唯讀掛載或 Copy-on-Write、網路預設無出口（no-egress）、CPU/記憶體/PID 上限
3. **欺騙與擬真**：資安沙箱會模擬滑鼠軌跡、假文件、時間膨脹，騙過會偵測沙箱的惡意程式
4. **生命週期**：從基礎映像啟動 → 執行並記錄行為 → 逾時或完成後銷毀，瞬態（ephemeral）是預設

這四點可以拿來體檢任何一家方案：缺了哪一根，就得用其他手段補。

## 第一層：容器預設的隔離 —— Namespace、cgroups、seccomp

這是絕大多數團隊的第一個沙箱，也是最容易誤解的層次。單純執行 `docker run python:3.12` 已經有隔離，但不等於「為了跑不可信程式設計的沙箱」。

四個原語各管一件事，一句話記最清楚：

- **Namespace → 你看得到什麼**：PID、Network、Mount、User、IPC、UTS 各自獨立，讓容器內的程式以為自己是唯一住戶。看不到 host 的其他行程與網路介面。
- **cgroups → 你能用多少**：限制 CPU、記憶體、磁碟 I/O、行程數量。`while True: x.append("hello")` 這類無限吃記憶體的程式，到上限就被 OOM kill，而不是拖垮整台機器。
- **seccomp → 你能要求核心做什麼**：攔截 system call 白名單，擋掉 `reboot`、`mount` 等危險呼叫。
- **capabilities / AppArmor / SELinux → 你能越權多少**：把 root 拆成細粒能力，預設丟掉 `SYS_ADMIN` 等高危能力。

```bash
# 這是「有隔離」
docker run python:3.12 python -c "print(1)"

# 這才是「為不可信程式設計的沙箱」
docker run --network none --memory 512m --cpus 1 \
  --cap-drop ALL --read-only --pids-limit 64 \
  --security-opt seccomp=default.json \
  python:3.12 python /work/task.py
```

**設計哲學**：在同一顆核心內做軟隔離，效能最好、啟動最快。**與替代方案比較**：比 [gVisor](https://gvisor.dev/) 與 [Firecracker](https://github.com/firecracker-microvm/firecracker) 都便宜，但共享核心意味著核心漏洞可能導致容器逃逸（container escape）。**適合**：內部可信程式、CI 任務。**不適合**：把使用者上傳的任意程式直接丟進來跑，或需要硬體級多租戶隔離。**限制**：預設的 `docker run` 幾乎沒開限制，必須顯式收緊才能稱為沙箱。

## 第二層：使用者態核心 —— gVisor

[gVisor](https://gvisor.dev/) 是 Google 開源的沙箱運行時（runtime），用 Go 重寫了一個使用者態核心（Sentry）加上檔案系統代理（Gofer），攔在應用程式與 host 核心之間。

```
一般容器：  App → Linux Kernel
gVisor：    App → gVisor (Sentry/Gofer) → Linux Kernel
```

- **設計哲學**：不換掉容器生態，只在 system call 路徑上加一層攔截。所有 `open`、`exec`、`socket` 都先經過 Sentry，不直接碰 host。
- **與替代方案比較**：比純容器安全得多，比輕量虛擬機便宜與輕量；但相容性不是 100%，少用的 syscall、ioctl、`/proc` 行為可能不同。社群回報少數長尾測試可能遇到差異（非官方 SLA，依工作負載而異）。大量小檔案 I/O 或頻繁網路呼叫的場景，實測延遲常見一至三成增加，依工作負載而異。
- **適合**：想在現有 [Docker](https://www.docker.com/) / Kubernetes 上快速加強多租戶隔離，且工作負載是常見語言（Python、Node、Go）的團隊。
- **不適合**：重度依賴底層核心行為、需要完整 GPU 直通，或極端 I/O 效能敏感的任務。
- **怎麼做**：在 Kubernetes 以 [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) 接上 `runsc`：

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
---
apiVersion: v1
kind: Pod
metadata:
  name: untrusted-job
spec:
  runtimeClassName: gvisor
  containers:
  - name: worker
    image: python:3.12-slim
    resources:
      limits: { memory: "512Mi", cpu: "1" }
```

GKE 的 [GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods) 即是此路線的託管版，[Cloud Run](https://cloud.google.com/run) 底層也使用 gVisor。[EKS](https://aws.amazon.com/eks/) 上可自行在節點安裝 `containerd-shim-runsc-v1` 後以同樣方式啟用，但要自行處理版本與 [Karpenter](https://karpenter.sh/) 節點映像。

## 第三層：輕量虛擬化 —— Firecracker、Kata Containers、Cloud Hypervisor

當信任邊界要求「就算對方突破核心也出不去」，就要靠硬體虛擬化。每個工作負載帶自己的精簡核心，彼此不共享核心。

- **[Firecracker](https://github.com/firecracker-microvm/firecracker)**：AWS 為 [Lambda](https://aws.amazon.com/lambda/) 與 [Fargate](https://aws.amazon.com/fargate/) 打造的 microVM 虛擬機監視器（VMM），以 [KVM](https://www.linux-kvm.org/) 為後端，毫秒級啟動、記憶體開銷可低至數 MB，已支撐每月超過 15 兆次 Lambda 呼叫。特性是極簡裝置模型與快照（snapshot）快速恢復。
- **[Kata Containers](https://katacontainers.io/)**：符合 [OCI](https://opencontainers.org/) 標準的輕量虛擬機容器，每個 Pod 即一台微型虛擬機，兼顧 Docker 體驗與虛擬機安全保證，適合已上 Kubernetes 且需要硬體級隔離的叢集。
- **[Cloud Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)**：以 Rust 撰寫的現代 VMM，定位與 Firecracker 類似，強調模組化與安全性。

**設計哲學**：用硬體邊界換取最強隔離與接近 100% 的 Linux 相容性。**與替代方案比較**：比 gVisor 慢一點點、維運複雜度高，但不再受使用者態核心的相容性缺口限制。**適合**：執行高度不信任程式、多租戶高價值資料、合規要求明確寫「需虛擬機隔離」。**限制**：網路（tap/bridge）、映像（kernel + rootfs）、生命週期與快照都要自理，或交給託管服務。

AWS 在 2026-06-22 推出的 [Lambda MicroVMs](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-lambda-microvms/) 正是把這層託管化：從 Dockerfile 建映像、上傳至 S3 後產生 Firecracker 快照，每個使用者或任務拿到獨立 microVM、獨立 HTTPS 端口（支援 HTTP/2、gRPC、WebSocket），可暫停並在 8 小時內恢復，狀態與記憶體一併保留。這讓團隊不必自建 Firecracker 調度器就能得到類似 [Hades](#案例xai-hades-如何把這幾層疊起來) 的體驗。

## 無容器的沙箱：Anthropic sandbox-runtime、nsjail、bubblewrap

並非所有沙箱都要先有容器。另一條常見路線是「直接對任意行程加邊界」。

### Anthropic sandbox-runtime（ASRT）

[Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime)（`@anthropic-ai/sandbox-runtime`，Apache-2.0，2025-10-20 開源）在 [Claude Code](https://code.claude.com/docs/en/sandbox-environments) 沙箱設計文件中被完整揭露，核心是「不需要容器化的 OS 層級限制」。

其設計是雙軌：

- **檔案系統採 deny-then-allow**：預設可讀，再用 `denyRead: ["~/.ssh"]` 封大範圍，`allowRead` 優先於 `denyRead` 重新開放；寫入則是 allow-only，預設拒絕。
- **網路採強制走代理**：Linux 側直接移除 bubblewrap 的 network namespace，實體上沒有網路，所有流量必須經由 Unix domain socket（`socat` 橋接）送到外部的 HTTP/SOCKS5 代理；macOS 側以 [Seatbelt](https://reverse.put.as/wp-content/uploads/2011/09/Apple-Sandbox-Guide-v1.0.pdf) profile 只允許連向本機代理埠；Windows 側以 [Windows Filtering Platform](https://learn.microsoft.com/en-us/windows/win32/fwp/windows-filtering-platform-start-page) 的 `ALE_AUTH_CONNECT` 過濾器達成同樣效果。

關鍵洞察是：`HTTP_PROXY` 等環境變數只是引導，真正的邊界是 OS 層過濾。就算工具清空環境變數或無視代理設定，底層的 Seatbelt / WFP / network namespace 仍會擋住。這解決了許多沙箱「不乖的工具就繞過代理」的通病。在 [Claude Code](https://code.claude.com/docs/en/sandbox-environments) 中，此機制讓自動核准模式下的權限提示減少約 84%。

### nsjail、bubblewrap、Isolate

- **[nsjail](https://github.com/google/nsjail)**（Google 開源）：把 Namespace、cgroups、seccomp-bpf、capabilities、chroot 打包成單一 CLI，最適合理解「沙箱怎麼組出來」，常用於 CTF 與程式碼託管。
- **[bubblewrap](https://github.com/containers/bubblewrap)（bwrap）**：Linux 桌面與 CLI 沙箱的底層工具，靠 bind mount 把目錄標成唯讀或可寫，搭配 seccomp 過濾。
- **[Isolate](https://github.com/ioi/isolate)**（IOI 競賽常用）：以 C++ 實作的高效能程式碼執行沙箱，底層同樣是 namespaces 與 seccomp。

這條路線的價值在於「輕、快、易組合」，很適合做 coding agent 的本地執行層：不需要先有映像建置流程，就能在開發者機器上把 bash 呼叫包進可審計的邊界。

## 雲端 Agent 專用沙箱：E2B、Daytona、Modal、Vercel、Cloudflare

把「本地沙箱」與「雲端沙箱」拆成兩個問題是關鍵——前者問「在你的機器上爆破半徑多大」，後者問「如何把程式安全地搬到別人的機器上跑，憑證不落地、生命週期有人管、結果安全傳回」。此拆法與 [xAI 官方 Sandbox 文件](https://docs.x.ai/build/features/sandbox)對 `workspace`/`strict` 本地 profile（Landlock/Seatbelt）及 [grok-build Sandbox Mode](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/18-sandbox.md) 對雲端 `devbox` 的區分一致。

| 需求優先 | 先看 | 判斷理由 |
|---|---|---|
| Agent 原生 SDK、完整記憶體暫停與恢復、可自架 | [E2B](https://e2b.dev/) | 物件模型僅 Template 與 Sandbox，pause/resume 保留檔案、記憶體與行程；Firecracker microVM，支援 [AWS](https://aws.amazon.com/) / [GCP](https://cloud.google.com/) 自架 |
| 同平台還要 GPU 推論或訓練 | [Modal](https://modal.com/) | [Sandbox API 可指定 GPU](https://modal.com/docs/guide/sandbox)（T4 至 H100），沙箱跑在 gVisor 上 |
| 長期開發工作區、多種 VM/容器類別與快照 | [Daytona](https://www.daytona.io/) | 預設保留檔案系統，支援 hot snapshot、fork 與多 runtime 類別 |
| 評測、Blueprint 與 Devbox 工作流 | [Runloop](https://docs.runloop.ai/) | [Devbox](https://docs.runloop.ai/docs/devboxes/overview) 以 repository、快照與開發機器語意為中心 |
| 應用已在 Vercel，偏 TypeScript 整合 | [Vercel Sandbox](https://vercel.com/docs/sandbox) | 與 Vercel [OIDC](https://vercel.com/docs/sandbox) 與 preview workflow 最短路徑整合，2026-01-30 GA |
| 控制面已在 Workers，想沿用 Durable Objects / R2 | [Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/) | 直接長在 [Workers](https://workers.cloudflare.com/) + [Containers](https://developers.cloudflare.com/containers/) 上，憑證由 Worker 以代理方式注入 |
| 不想維運且要 VM 級隔離與 8 小時狀態保留 | [AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) | 託管 Firecracker，無共享核心，快照恢復，2026-06-22 發布 |

補兩個工程細節，避免選型時踩坑：

- **暫停與計費**：[E2B 的 pause](https://e2b.dev/docs/sandbox/persistence) 保留記憶體與行程，暫停期不計執行費，但每 GiB 記憶體暫停約需 4 秒；大量記憶體工作負載不能當成零成本操作。Hobby 與 Pro 的連續執行上限分別為 1 小時與 24 小時，暫停後恢復會重設計時器。
- **憑證邊界**：把整份 `.env` 烤進映像是最常見的錯誤。正確做法是讓每個沙箱只拿短效、可撤銷的 token，或如 [Cloudflare 的憑證代理模式](https://developers.cloudflare.com/sandbox/concepts/security/)由 Worker 在請求時注入，沙箱內永遠不落地長期金鑰。

## 案例：xAI Hades 如何把這幾層疊起來

[Hades](https://x.ai/) 的實地探測是極佳的對照組，因為它不是理論，而是「為 AI Agent 打造可執行任意程式的平台」長什麼樣子。**以下為筆者基於線上實例的實地探測與推測，未經 xAI 官方文件確認，細節可能隨版本異動，交叉可參考社群探測（見參考資料）**。

分層如下：

```
Kubernetes 叢集 (hades-openbar)
  └── Hades Runtime（自研）
        ├── 隔離後端（可插拔：gVisor / 自研 Hypervisor / runc）
        ├── catatonit（PID 1，回收 zombie）
        ├── xai-hades-styx（Rust 靜態編譯，負責 exec、timeout、OOM、session）
        ├── grok-computer-server.mjs（Node.js 控制面，監聽 127.0.0.1:4242）
        └── Ubuntu 24.04 userland + grok-files FUSE（遠端工作目錄，JWT 認證，虛擬無限容量）
              └── erofs + OverlayFS（/.hades-container-tools 唯讀壓縮，root 為 OverlayFS）
```

目前線上實例的隔離後端是 [KVM](https://www.linux-kvm.org/) 輕量虛擬機，由 `xai-hades-charon` 管理，證據包含 `Hypervisor detected: KVM`、`hvc0`、`vsock`、`/dev/vda` 等 Virtio 裝置與 `HADES_CLHV_BOOT_TIMEOUT` / `HADES_RUNSC_START_TIMED_OUT` 等多後端錯誤碼。工作目錄 `/home/workdir/artifacts` 並非本地磁碟，而是透過 [FUSE](https://github.com/libfuse/libfuse) 掛載的 `grok-files` 遠端檔案系統，透過 `TERMINAL_JWT_VAL` 與後端 gRPC 通訊。

這個案例的啟示有三點：第一，隔離後端做成可插拔；第二，控制面與執行面分離（Node.js 接 tool call，Rust 層管資源）；第三，檔案系統遠端化後，沙箱銷毀也不丟失工作產物。這正是前一節雲端沙箱強調的「準備環境」與「使用環境」分離。

## 怎麼選：決策樹與成本

用信任邊界與工作負載特徵做第一分流，比直接比較功能清單有效。

**先問三題**：

1. 程式碼有多不信任？（自己寫的工具 vs. 使用者上傳或模型生成）
2. 是否多租戶共用實體機？
3. 是否需要長時間狀態或 GPU？

```
不信任多租戶任意程式 ──→ Firecracker / Kata / Lambda MicroVMs / E2B
        │
        ├── 已在 Kubernetes 且想沿用生態 ──→ Kata + Firecracker 或 gVisor RuntimeClass
        │
        └── 以速度與自架彈性優先 ──→ gVisor（runsc）先上，不夠再升 microVM

本地開發者機器上的 agent ──→ sandbox-runtime / nsjail / bubblewrap / Docker SBX
雲端託管且要少維運 ──→ E2B / Daytona / Modal / Cloudflare / Lambda MicroVMs（依 GPU/狀態/生態選）
```

**成本要分兩本帳**：

| 成本 | Docker + gVisor | Firecracker / microVM |
|---|---|---|
| 機器資源 | 每容器約 50–100 MB 額外開銷，密度中 | 單 microVM 控制面額外開銷可低至約 5 MB（不含 guest 記憶體，Firecracker 預設 128 MiB，見 [Firecracker spec](https://firecracker-microvm.github.io/)），密度可更高 |
| 維運與工程 | 換 runtime 即可，生態現成 | 網路、映像、快照、調度自理，排查較複雜 |
| 雲端託管 | [GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods) 等整合度高 | [Lambda MicroVMs](https://aws.amazon.com/lambda/pricing/) 按使用量計費，短任務可能更省 |

一句話：機器帳單未必差很多，差的是把系統穩定跑起來的人力成本。這也是實務常見結論：規模小時先用 Docker + gVisor，遇到相容性或隔離天花板再投資 microVM。

### 即使與主服務分離，仍有的殘餘風險

把沙箱與主服務分離是必要但非充分條件，仍需補齊：

- **沙箱逃逸**：任何軟體都可能有漏洞，gVisor 雖大幅提高門檻，仍非理論上不可能
- **資源耗盡**：CPU/記憶體/磁碟/網路被耗盡，拖慢同節點其他工作負載
- **橫向移動與憑證外洩**：若沙箱能讀 [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)、[ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) 或雲端 [IAM](https://aws.amazon.com/iam/) 角色，仍可能外洩
- **出網濫用**：自由出網的沙箱可能被拿去挖礦、對外攻擊或外傳資料；[webfetch](https://modelcontextprotocol.io/) 這類能力會放大此風險，需走代理、白名單、限速與完整日誌

對應的收斂動作：預設拒絕的 [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)、每沙箱獨立 [ServiceAccount](https://kubernetes.io/docs/concepts/security/service-accounts/) 與最小權限 IAM、強制資源上限、禁止 privileged 與 hostPath、出網強制代理、執行期防護（如 [Falco](https://falco.org/)）與用完即銷毀。

## 整體架構

```
                        信任邊界與成本由左至右遞增
  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
  │  一般容器 │→ │  gVisor  │→ │   microVM    │→ │  託管沙箱     │
  │ Namespace │  │ runsc    │  │ Firecracker  │  │ E2B/Daytona  │
  │ cgroups   │  │ Sentry   │  │ Kata/CLH     │  │ Modal/Vercel │
  │ seccomp   │  │ Gofer    │  │ (KVM)        │  │ Cloudflare/  │
  │           │  │          │  │              │  │ Lambda µVMs  │
  └──────────┘  └──────────┘  └──────────────┘  └──────────────┘
         ↑             ↑              ↑                ↑
    本地開發      叢集加固      自建強隔離        少維運產品化
         └─────────────┴──────────────┴────────────────┘
                    上層：sandbox-runtime / nsjail / bubblewrap
                    （對任意行程加邊界，不依賴映像）
```

本地 OS 級沙箱回答「爆破半徑多大」，雲端 microVM 與託管沙箱回答「如何把不可信執行搬離你的主機」。兩者不是二選一，而是像 [Defence in depth](https://csrc.nist.gov/glossary/term/defense_in_depth) 一樣疊加：即使跑在 [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/) 或 Lambda MicroVM 內，容器內的行程仍值得再套一層 seccomp / Landlock。

## 整體來說

沙箱不是「要不要做」的選擇題，而是「在哪一層做、做多緊、誰來維運」的取捨題。容器的 Namespace / cgroups / seccomp 讓你快速起步，[gVisor](https://gvisor.dev/) 用最小改動換取明顯更強的邊界，[Firecracker](https://github.com/firecracker-microvm/firecracker) 與 [Kata Containers](https://katacontainers.io/) 用硬體虛擬化換取最接近虛擬機的保證，[Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) 與 [nsjail](https://github.com/google/nsjail) 則補上「不需要容器也能對任意行程加邊界」的能力；而 [E2B](https://e2b.dev/)、[Daytona](https://www.daytona.io/)、[Modal](https://modal.com/)、[Vercel Sandbox](https://vercel.com/docs/sandbox)、[Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/) 與 [AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) 則把這些原語包裝成產品，讓團隊不必先成為虛擬化專家就能交付安全的程式執行環境。

若今晚就要動手，做三件事就好：把所有不可信執行收斂到單一入口並預設無網路，將每個任務的憑證換成短效可撤銷的 token 並走代理注入，以及為每個沙箱加上明確的資源上限與銷毀策略。隔離層級可以逐步升級，但這三個動作不做，換哪一層都補不回來。

## 參考資料

- [Anthropic sandbox-runtime (GitHub)](https://github.com/anthropic-experimental/sandbox-runtime)
- [Anthropic sandbox-runtime (npm)](https://www.npmjs.com/package/@anthropic-ai/sandbox-runtime)
- [Claude Code — Sandbox environments](https://code.claude.com/docs/en/sandbox-environments)
- [Anthropic — Code execution tool (sandboxed containers)](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool)
- [Claude Platform — Self-hosted sandboxes (AWS Lambda MicroVMs / E2B / Modal / Cloudflare)](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)
- [gVisor Documentation](https://gvisor.dev/docs/)
- [Firecracker](https://github.com/firecracker-microvm/firecracker)
- [Kata Containers](https://katacontainers.io/)
- [Cloud Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)
- [nsjail](https://github.com/google/nsjail)
- [bubblewrap](https://github.com/containers/bubblewrap)
- [Docker — seccomp security profiles](https://docs.docker.com/engine/security/seccomp/)
- [Isolate — IOI sandbox](https://github.com/ioi/isolate)
- [Kubernetes — RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/)
- [GKE Sandbox (gVisor)](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods)
- [E2B Documentation](https://e2b.dev/docs)
- [E2B — Sandbox persistence](https://e2b.dev/docs/sandbox/persistence)
- [E2B — Internet access](https://e2b.dev/docs/network/internet-access)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal — Sandbox guide](https://modal.com/docs/guide/sandbox)
- [Vercel Sandbox](https://vercel.com/docs/sandbox)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Sandbox — Security](https://developers.cloudflare.com/sandbox/concepts/security/)
- [AWS — Introducing Lambda MicroVMs](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-lambda-microvms/)
- [AWS — Run isolated sandboxes with full lifecycle control: Lambda introduces MicroVMs](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms)
- [AWS Lambda MicroVMs — Product page](https://aws.amazon.com/lambda/lambda-microvms/)
- [Firecracker — firecracker-microvm.io](https://firecracker-microvm.github.io/)
- [Falco — Runtime security](https://falco.org/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [xAI — Sandbox (profiles: Landlock/Seatbelt)](https://docs.x.ai/build/features/sandbox)
- [xAI grok-build — Sandbox Mode (Landlock 5.13+, Seatbelt, bubblewrap)](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/18-sandbox.md)
- [Reddit — Exploring Grok 4's code execution sandbox (hades-container-tools) — 社群探測，非官方](https://www.reddit.com/r/grok/comments/1lyex1l/exploring_grok_4s_code_execution_sandbox_with_bash/)
- [本站：E2B Agent Sandbox：把模型產生的程式碼關進可恢復的 microVM](/posts/ai/2026-08-22-e2b-agent-sandbox)
- [本站：AI Agent 沙箱逃逸與權限邊界：Container 不是 Security Boundary 的全部](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries)
- [本站：跟成熟 coding agent 學設計（11）：沙箱與遠端執行——Cloudflare Sandbox 部署實戰](/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution)
