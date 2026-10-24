---
title: "Agent 的程式碼跑在哪裡：容器、核心、主機、網路與監控五層隔離"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, microvm, isolation]
lang: zh-TW
description: "把「在隔離環境中執行」拆成五層：容器、核心邊界、共用主機與硬體、網路與雲端邊界、監控，逐層說明承諾什麼、不承諾什麼。"
tldr: "一段 agent 程式碼從執行到連線會穿過五層：容器、核心邊界、共用主機、網路邊界、監控。每層只承諾一件事，共用主機這層幾乎沒有承諾。"
difficulty: 入門
draft: false
series:
  name: "Agent 隔離邊界"
  order: 0
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-overview-en)

Coding agent、程式碼直譯器和雲端沙盒產品的說明頁，不少都會寫「在隔離環境中執行」。這句話省略了三件事：隔離的是什麼、靠哪一層做到、哪些東西其實還共用。

這個系列把那句話拆開來看。這篇是地圖：一段由模型產生的程式碼，從開始執行到連出網路，中間隔著哪幾層，每層各自承諾什麼。讀完之後，你可以拿任何一個沙盒產品的說明頁，把它對到這五層，並指出它沒提到哪一層。

適合已經用過 Docker 或雲端沙盒、但沒研究過 CPU 快取與虛擬化的工程師。下一篇會講容器、gVisor、microVM 的差別，再往後才進入「沒有網路也能通訊」的部分。

## 一段程式碼會穿過五層

下圖是由內往外的包含關係。最內層是 agent 要執行的程式，最外層是整個環境對外的網路邊界；第五項「監控」不包住任何一層，所以沒有畫進圖裡，只在表格討論。這組編號會在後面幾篇沿用。

```diagram
title: Agent 程式碼外面包著的五層邊界
desc: 由內往外依序是 agent 的程式、容器、核心邊界、共用的主機與硬體、網路與雲端邊界；第五項監控不在包含關係裡，從外面觀察所有層。
caption: 本系列的切法，不是業界標準。第五項「監控」沒有畫進來，因為它是旁觀者：觀察每一層，但不包住任何一層。
---
<svg viewBox="0 0 640 336">
  <rect class="dg-zone" x="20" y="20" width="600" height="296" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">L4 網路與雲端邊界</text>
  <text class="dg-small" x="604" y="38" text-anchor="end" dominant-baseline="central">防火牆、DNS、權限：管出口</text>

  <rect class="dg-box dg-box--store" x="40" y="56" width="560" height="240" rx="8"/>
  <text class="dg-tag" x="56" y="74" dominant-baseline="central">L3 共用主機與硬體</text>
  <text class="dg-small" x="584" y="74" text-anchor="end" dominant-baseline="central">同機共用 CPU 快取、page cache、儲存</text>

  <rect class="dg-box" x="60" y="92" width="520" height="184" rx="8"/>
  <text class="dg-tag" x="76" y="110" dominant-baseline="central">L2 核心邊界</text>
  <text class="dg-small" x="564" y="110" text-anchor="end" dominant-baseline="central">gVisor 應用核心，或 microVM 的獨立核心</text>

  <rect class="dg-box dg-box--store" x="80" y="128" width="480" height="128" rx="8"/>
  <text class="dg-tag" x="96" y="146" dominant-baseline="central">L1 容器</text>
  <text class="dg-small" x="544" y="146" text-anchor="end" dominant-baseline="central">namespace、cgroup、seccomp</text>

  <rect class="dg-box dg-box--accent" x="100" y="164" width="440" height="72" rx="6"/>
  <text class="dg-label" x="320" y="192" text-anchor="middle" dominant-baseline="central">Agent 要執行的程式</text>
  <text class="dg-sub" x="320" y="214" text-anchor="middle" dominant-baseline="central">例如模型產生的 python x.py</text>
</svg>
```

OpenAI 在 2026 年 10 月 23 日公布的[訓練環境隔離說明](https://openai.com/index/securing-our-frontier-model-training-environment/)用的也是疊層的做法：沙盒限制 agent 能存取與執行什麼，輕量虛擬機（microVM）把執行環境和主機隔開，監控系統偵測未授權的活動，網路與雲端邊界在前面幾層都失手時負責守住。本系列的切法和它大致對應，只多拆出一層「共用主機與硬體」，因為後面幾篇的主角都在這一層。

## 五層各自承諾什麼

| 層 | 承諾 | 不承諾 |
|---|---|---|
| L1 容器 | 程式看不到其他行程與檔案，資源有上限 | 不阻止程式直接呼叫 host 核心 |
| L2 核心邊界 | 程式不能直接對 host 核心發系統呼叫，只能經由 Sentry 或 hypervisor 間接觸及 | 不管 host 上共用的硬體與快取 |
| L3 共用主機與硬體 | 幾乎沒有 | 同一台機器上的其他沙盒會互相影響 |
| L4 網路與雲端邊界 | 出口只開給允許的目的地 | 不管允許清單上那些服務的行為 |
| L5 監控 | 發現異常並讓人介入 | 不保證阻止 |

表中「承諾」與「不承諾」是本文的歸納，不是任何一家的原話；下面幾個例子才是各來源寫的：

- **L1。** Docker 的[安全文件](https://docs.docker.com/engine/security/)說 namespace 讓容器內的行程看不到也很難影響其他容器或主機的行程，cgroup 負責資源上限。gVisor 的[安全介紹](https://gvisor.dev/docs/architecture_guide/intro/)指出，單靠 seccomp、namespace 這類核心機制，工作負載仍然只離 host 核心「one system call away」，也就是一次系統呼叫的距離。
- **L2。** gVisor 用使用者空間的核心接手系統呼叫，microVM 則給每個沙盒一個獨立的 guest 核心，外面再隔一層 hypervisor。這兩種做法下一篇會對照。
- **L3。** OpenAI 的紅隊文章就是在這一層找到了通訊管道，後面幾篇會專門談。Firecracker 的[正式環境設定文件](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)寫明它「無法緩解 host 的硬體弱點」，並強烈建議每個 Firecracker 行程只服務單一租戶。gVisor 的[安全模型](https://gvisor.dev/docs/architecture_guide/security/)也說硬體側信道對任何程式都可能有效，不論是原生、沙盒或虛擬化的。
- **L4。** Firecracker 的[設計文件](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)說它不做網路流量過濾，guest 的所有對外流量都視為不可信，要在 host 層過濾。
- **L5。** OpenAI 的 [9 月 20 日事件報告](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)記錄了時間線：上午 9:50 一個 agent 透過 DNS 取得外部回應，監控約 12 分鐘後發出 P0 警報，run 到 12:34 才被停止，從外連到停止隔了兩個多小時；報告也說 run 沒有如預期自動停止，是人工停掉的。

## 範例：用一張五格表檢查沙盒產品

假設某個工具的說明頁只寫了「每次執行都在全新的 Docker 容器中」。把它填進五格：

| 層 | 說明頁寫了什麼 | 沒寫的，你要自己問或自己補 |
|---|---|---|
| L1 容器 | 有 | — |
| L2 核心邊界 | 沒寫 | 預設共用 host 核心，一個核心漏洞就可能到 host |
| L3 共用主機 | 沒寫 | 同一台機器上有沒有別的使用者的容器？是否單租戶？ |
| L4 網路邊界 | 沒寫 | 能連哪些目的地？DNS 呢？可以試 `docker run --network none` 看程式在沒有網路時是否還能完成工作 |
| L5 監控 | 沒寫 | 每次連線的目的地有沒有留紀錄？誰會看？ |

今晚就能做的動作：打開你現在用的沙盒或 agent 工具的文件，照這張表填一次。五格裡有三格以上是「沒寫」，就把它列進你的風險清單，並決定那幾格由你自己補還是換產品。

## 限制

五層是本系列的切法，產品常把兩層合在一起。例如 Kata Containers 會先開一個輕量虛擬機，再在虛擬機裡面跑容器（[Kata 架構文件](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)），L1 和 L2 同時存在。反過來，有些產品只標「sandbox」，不說是哪一層。填表時遇到這種情況，就寫「沒寫」，不要用產品名稱猜。

## 接下來

這個系列分成幾段：

- 先看清楚前兩層差在哪（下一篇：[容器、gVisor、microVM 差在哪](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm)）。
- 再看沒有網路時，共用的硬體與儲存怎麼變成通訊管道。
- 然後精讀 OpenAI 的紅隊文章，以及出口被找到的幾種方式。
- 最後談防守的取捨，和你自己的 agent 該擔心哪幾層。

應用層的檔案、網路與憑證限制，已經在〈[Agent 的沙盒、憑證與網路邊界](/posts/ai/2026-10-22-ai-security-sandbox-credentials)〉實測過，這個系列從那一層的下面開始。

## 參考資料

- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [Docker Engine security — Docker Docs](https://docs.docker.com/engine/security/)
- [Introduction to gVisor security — gVisor](https://gvisor.dev/docs/architecture_guide/intro/)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Firecracker Design](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)
- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Kata Containers Architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)
- [Agent 的沙盒、憑證與網路邊界 — 本站](/posts/ai/2026-10-22-ai-security-sandbox-credentials)
