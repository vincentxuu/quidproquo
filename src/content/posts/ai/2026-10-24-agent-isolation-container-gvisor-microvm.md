---
title: "容器、gVisor、microVM 差在哪：核心、系統呼叫與硬體誰和誰共用"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, microvm, isolation]
lang: zh-TW
description: "比較容器、gVisor 和 microVM（Kata、Firecracker）各自把 agent 的程式擋在哪個核心之外，以及三者還共用哪些硬體與儲存狀態。"
tldr: "容器共用 host 核心，gVisor 在中間插一個使用者空間核心，microVM 多一個 guest 核心加 hypervisor；三種都還共用同一台 host 的 CPU 快取與儲存。"
difficulty: 進階
draft: true
series:
  name: "Agent 隔離邊界"
  order: 1
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm-en)

Agent 沙盒通常是三種做法之一：一般容器、[gVisor](https://gvisor.dev/)，或 microVM（Kata Containers、Firecracker 這類）。它們都叫「隔離」，但隔開的位置不同。這篇回答兩個問題：agent 的程式要跨過幾道核心邊界才碰到 host？三種做法跨過去之後，還共用什麼？

先讀〈[Agent 的程式碼跑在哪裡](/posts/ai/2026-10-24-agent-isolation-overview)〉會比較順，這篇對應其中的 L1 容器與 L2 核心邊界。讀完你能判斷：一則漏洞公告或一個攻擊，是破了哪一道邊界、離 host 還有幾道。

## 容器：行程隔離，核心共用

容器靠 Linux 的 namespace 和 cgroup。Docker 的[安全文件](https://docs.docker.com/engine/security/)說，namespace 讓容器內的行程看不到、也很難影響其他容器或 host 的行程，cgroup 管資源上限，主要用來擋資源耗盡類的攻擊。

這些機制都由同一個 Linux 核心執行，而容器內的程式可以直接對這個核心發系統呼叫。gVisor 的[安全介紹](https://gvisor.dev/docs/architecture_guide/intro/)講得很直接：seccomp、namespace、AppArmor 這類機制只縮小攻擊面，工作負載「只離 host 入侵一次系統呼叫的距離」；而且 seccomp 過濾要依工作負載逐項設定，程式如果需要 `ioctl` 或 `io_uring` 這類範圍很大的呼叫，很難寫出安全的過濾規則。

所以容器的邊界在系統呼叫介面：只要 host 核心這個介面上有可利用的漏洞，程式就能一步到位。

## gVisor：在中間插一個使用者空間的核心

gVisor 的做法是自己當核心。依官方文件，它的 Sentry 用 Go 從頭重寫了 Linux 的系統呼叫、記憶體管理、檔案系統、網路堆疊等，並「從不把任何系統呼叫直接轉給 host」；沒有重新實作的核心功能，沙盒內的程式就用不了。Sentry 自己對 host 只發有限的系統呼叫，而且被 seccomp、namespace 等機制包起來；需要更多權限的檔案操作交給旁邊較受信任的 Gofer 行程。

gVisor 的[安全模型](https://gvisor.dev/docs/architecture_guide/security/)把這條路和虛擬機放在一起看：兩者都是讓應用程式面對一個「替身」介面，再由替身去呼叫 host。官方文件的說法是，要逃出 gVisor 得同時攻破 Sentry 和 host 核心，兩者不共用程式碼。

## microVM：多一個核心，再隔一層 hypervisor

microVM 直接開一台輕量虛擬機。依 Kata Containers 的[架構文件](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)，它由 runtime 啟動 hypervisor，hypervisor 載入專用的 guest 核心與映像檔，容器再在虛擬機裡面執行。虛擬機裡面還有一層容器，原因是把工作負載和虛擬機環境本身分開。

Firecracker 的[設計文件](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)從威脅模型出發：每個 Firecracker 行程只包一台 microVM，所有 vCPU 執行緒從啟動起就被視為在跑惡意程式，因此信任區層層相套，從最不可信的 vCPU 執行緒到最可信的 host，最外面還有 seccomp 與 jailer。依 gVisor 文件對虛擬機的描述，離開虛擬機只能經過 VM exit，由 hypervisor 處理。

## 並排看：要跨幾道，還共用什麼

```diagram
title: 三種隔離的堆疊與共用的硬體
desc: 容器的程式直接面對 host 核心；gVisor 在中間多一個使用者空間的核心；microVM 多一個 guest 核心和 hypervisor。三種做法最底下都是同一台 host 的硬體與快取。
caption: 簡化示意。gVisor 另有 Gofer 行程與多種平台，microVM 的 VMM 以 host 行程執行，這裡省略。
---
<svg viewBox="0 0 640 332">
  <text class="dg-label" x="112" y="26" text-anchor="middle" dominant-baseline="central">容器</text>
  <text class="dg-label" x="320" y="26" text-anchor="middle" dominant-baseline="central">gVisor</text>
  <text class="dg-label" x="528" y="26" text-anchor="middle" dominant-baseline="central">microVM</text>

  <rect class="dg-box" x="20" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="112" y="68" text-anchor="middle" dominant-baseline="central">容器內的程式</text>
  <text class="dg-sub" x="112" y="88" text-anchor="middle" dominant-baseline="central">agent 的程式碼</text>
  <rect class="dg-box" x="228" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">容器內的程式</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">agent 的程式碼</text>
  <rect class="dg-box" x="436" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="68" text-anchor="middle" dominant-baseline="central">容器內的程式</text>
  <text class="dg-sub" x="528" y="88" text-anchor="middle" dominant-baseline="central">agent 的程式碼</text>

  <rect class="dg-box dg-box--store" x="20" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="112" y="132" text-anchor="middle" dominant-baseline="central">host Linux 核心</text>
  <text class="dg-sub" x="112" y="152" text-anchor="middle" dominant-baseline="central">與其他容器共用</text>
  <rect class="dg-box" x="228" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="132" text-anchor="middle" dominant-baseline="central">gVisor Sentry</text>
  <text class="dg-sub" x="320" y="152" text-anchor="middle" dominant-baseline="central">使用者空間的核心</text>
  <rect class="dg-box" x="436" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="132" text-anchor="middle" dominant-baseline="central">guest Linux 核心</text>
  <text class="dg-sub" x="528" y="152" text-anchor="middle" dominant-baseline="central">每台 VM 一個</text>

  <rect class="dg-box dg-box--ghost" x="20" y="176" width="184" height="52" rx="6"/>
  <text class="dg-sub" x="112" y="202" text-anchor="middle" dominant-baseline="central">沒有第二道</text>
  <rect class="dg-box dg-box--store" x="228" y="176" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="196" text-anchor="middle" dominant-baseline="central">host Linux 核心</text>
  <text class="dg-sub" x="320" y="216" text-anchor="middle" dominant-baseline="central">只收到有限的呼叫</text>
  <rect class="dg-box dg-box--store" x="436" y="176" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="196" text-anchor="middle" dominant-baseline="central">hypervisor＋host 核心</text>
  <text class="dg-sub" x="528" y="216" text-anchor="middle" dominant-baseline="central">VM exit 才進得來</text>

  <rect class="dg-box dg-box--accent" x="20" y="248" width="600" height="60" rx="6"/>
  <text class="dg-label" x="320" y="270" text-anchor="middle" dominant-baseline="central">同一台 host 的 CPU 快取、記憶體、儲存</text>
  <text class="dg-sub" x="320" y="292" text-anchor="middle" dominant-baseline="central">三種做法都共用</text>
</svg>
```

| | 容器 | gVisor | microVM |
|---|---|---|---|
| 程式直接面對的核心 | host 核心 | Sentry | guest 核心 |
| 要碰到 host 核心還得跨過 | 沒有 | Sentry 的有限呼叫 | hypervisor 與裝置模擬 |
| 同機沙盒共用 CPU 快取 | 是 | 是 | 是 |

一個例子說明「破了哪一道」。Kata Containers 的安全公告 [GHSA-wwj6-vghv-5p64（CVE-2026-24834）](https://github.com/kata-containers/kata-containers/security/advisories/GHSA-wwj6-vghv-5p64)描述：在 Cloud Hypervisor 設定下，容器內有 `CAP_MKNOD` 的使用者可以改寫 guest 虛擬機的根檔案系統，最後在虛擬機裡取得 root。公告摘要寫的是「依我目前的理解」不影響 host 與同機的其他容器、虛擬機，Impact 欄則寫「容器到 guest microVM 的逃逸，沒有逃到 host，覆寫的映像也不會留存」；回報者另外註明，arm64 加 QEMU 時寫入是否會碰到映像檔，他沒有驗證。換成本篇的語言（這是本文的歸類，不是公告原話）：L1 容器被破了，L2 核心邊界在這個案例裡還在。OpenAI 在 10 月 23 日的文章把這個 CVE 列在它回饋給 Kata 上游的修補之中。

## 三種都還共用的東西

「沒有逃到 host」不等於「和旁邊的沙盒毫無關係」。同一台 host 上的沙盒共用 CPU 快取、記憶體頻寬，以及 host 作業系統的 page cache。

2026 年 7 月的預印本〈[Isolation Failure From Shared Storage](https://arxiv.org/abs/2607.17518)〉把這件事測在 Docker、gVisor、Kata（搭配 QEMU、Cloud Hypervisor、Firecracker）和 QEMU/KVM 上。它的結論有兩個：只要 I/O 路徑讓 host 上可快取的檔案物件被共用（例如 OverlayFS 疊層、virtio-fs、以檔案為底的 loop device），沙盒之間就量得到 page cache 的時序差；改用 direct I/O 或專用的 block device，訊號大幅變弱或消失。論文說明它的 WordPress 案例不是端對端的攻擊示範，並指出虛擬化主要是增加延遲與雜訊，沒有讓這種依賴消失。

Firecracker 的[正式環境設定文件](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)也有對應的提醒：寫入量大會很快填滿 host 的 page cache，形成積壓，拖慢同機其他 guest 的 I/O，要靠 jailer 的資源限制與速率限制來控管。

下一篇會從這裡開始：兩個彼此不連線的程式，怎麼只靠這種「變慢了」的訊號傳資料。

## 怎麼選

選型先回答三個問題，答案決定要不要往 microVM 與更嚴格的租戶分離走：

| 問題 | 偏容器就夠 | 往 microVM、一行程一租戶走 |
|---|---|---|
| 誰寫的程式？ | 你自己或團隊 | 模型產生、或來自外部使用者 |
| 同一台機器上還有誰？ | 只有你 | 其他使用者的沙盒 |
| 儲存怎麼接？ | 不重要 | 看是否共用可快取的 host 檔案 |

Firecracker 的文件強烈建議每個 Firecracker 行程只對應單一租戶的工作負載；它的單位是行程，不是整台主機。把同一台主機也留給單一租戶，是比文件更保守的做法，要不要走到這一步，看你前面三題的答案。

今晚可以做的動作：在你的 Linux host 或 VM 上執行下面的指令，看核心對各種硬體弱點寫了什麼狀態。

```bash
grep . /sys/devices/system/cpu/vulnerabilities/*
cat /sys/devices/system/cpu/smt/active
```

每個檔案會寫出 `Not affected`、某種 `Mitigation` 或 `Vulnerable`。在虛擬機裡，有些項目會寫 `SMT Host state unknown`；需要確認 host 的 SMT（超執行緒）狀態時，向供應商詢問。Firecracker 的文件建議在需要租戶分離的正式環境關閉 SMT。

## 限制

- 這篇比的是邊界的數量與位置，不是漏洞的多寡，也不能用來排「哪種最安全」：該防什麼，才決定該選什麼。
- gVisor 有多個執行平台，各自細節不同；這篇以官方文件的通用描述為準。
- 預印本是實驗室裡的時序量測，不等於真實 agent 平台上已有可用的攻擊。

## 參考資料

- [Docker Engine security — Docker Docs](https://docs.docker.com/engine/security/)
- [Introduction to gVisor security — gVisor](https://gvisor.dev/docs/architecture_guide/intro/)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Kata Containers Architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)
- [Firecracker Design](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)
- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Kata Container to Guest micro VM privilege escalation（GHSA-wwj6-vghv-5p64）](https://github.com/kata-containers/kata-containers/security/advisories/GHSA-wwj6-vghv-5p64)
- [Isolation Failure From Shared Storage（arXiv:2607.17518）](https://arxiv.org/abs/2607.17518)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Agent 的程式碼跑在哪裡 — 本站](/posts/ai/2026-10-24-agent-isolation-overview)
