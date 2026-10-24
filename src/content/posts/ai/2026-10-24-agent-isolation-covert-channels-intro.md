---
title: "沒有網路也能傳資料：共用快取、儲存與 CPU 時間怎麼變成訊號"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, side-channel, isolation]
lang: zh-TW
description: "說明隱蔽通道與旁路攻擊的差別，快取、儲存與 CPU 時間如何用「變快或變慢」傳一個位元，以及為什麼這類通道又慢又吵，附一個可執行的本機小實驗。"
tldr: "兩個互不連線的程式可以靠共用資源的快慢傳位元：一方改變資源狀態，另一方計時。這類通道要先約好協定，而且速度慢、容易被雜訊蓋掉；本機實驗在 50 bps 以下零錯誤，100 bps 以上接近亂猜。"
difficulty: 進階
draft: true
series:
  name: "Agent 隔離邊界"
  order: 2
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en)

上一篇最後留了一個問題：容器、gVisor、microVM 都隔開了核心，但同一台主機上的沙盒仍共用 CPU 快取、儲存和 CPU 時間。兩個互不連線、也沒有共用可寫檔案的程式，能不能只靠這些共用資源交換資料？

答案是可以，但條件很多。這篇先講原理，再用一個你可以在自己機器上跑的小實驗，量出這種通道有多慢、什麼時候會壞掉。讀完你能判斷：一個共用資源能不能當通道，並用「慢、吵、要先約好協定」三個尺度估計它有多大威脅。

先讀過〈[Agent 的程式碼跑在哪裡](/posts/ai/2026-10-24-agent-isolation-overview)〉與〈[容器、gVisor、microVM 差在哪](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm)〉會比較容易接上，這篇都落在 L3「共用主機與硬體」。

## 兩個名詞：隱蔽通道與旁路攻擊

- **旁路（側信道）攻擊**：一方在不知情的對象身上觀察「執行時留下的副作用」，例如耗時。Flush+Reload 的原論文把它定義為：攻擊目標是一個實作透過與環境互動而洩漏的資訊。[Meltdown 與 Spectre 的官方頁面](https://spectreattack.com/)說兩者都用旁路取得資料，在雲端可能偷到其他客戶的資料。
- **隱蔽通道**：兩方串通，故意用共用資源傳訊息。2009 年的 EC2 論文把它描述成「兩個執行個體合作，透過共用資源送訊息」，並指出隱蔽通道的存在，是可利用旁路存在的證據。

差別在有沒有一方是被動的受害者。本系列要談的是隱蔽通道：兩個 agent 都是自己人，目的是繞過「彼此不能通訊」這條規則。技術上，兩者用的是同一批共用資源。

## 原理：共用資源的狀態，用快慢讀出來

快取是一小塊很快的記憶體，放最近用過的資料。從快取讀資料比從主記憶體讀快，兩者的時間差就是訊號。Flush+Reload 的作者 Yarom 與 Falkner 把攻擊者的做法分成兩步：先把快取設成已知狀態，等對方動作之後，量自己再讀同一筆資料要多久。

把它變成通訊，只要雙方約好：發送端要傳 1，就把那筆資料從快取驅逐掉；要傳 0，就什麼都不做。接收端每個時段重讀同一筆資料並計時：慢，代表被驅逐了，判讀為 1；快，判讀為 0。

```diagram
title: 用快取的快慢傳一個位元
desc: 發送端驅逐共用快取裡的一筆資料，接收端重讀時變慢，判讀為 1；發送端什麼都不做，接收端重讀仍快，判讀為 0。
caption: 示意：這裡取最簡單的一位元對應。OpenAI 的報告只寫了「一方驅逐資料、另一方計時重讀」，沒有說明實際的編碼方式。
step: 發送端想傳 1，把共用快取裡的一筆資料驅逐掉
step: 接收端重新讀這筆資料並計時
step: 資料得從記憶體取回，讀得慢，接收端判讀為 1
step: 發送端想傳 0，什麼都不做
step: 接收端重新讀同一筆資料並計時
step: 資料還在快取裡，讀得快，接收端判讀為 0
---
<svg viewBox="0 0 640 420">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="404"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="404"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="404"/>

  <text class="dg-tag" x="24" y="96" dominant-baseline="central">傳 1</text>
  <g data-step="1">
    <path class="dg-line" d="M96 132H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="120" text-anchor="middle" dominant-baseline="central">驅逐這筆資料</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M544 172H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="160" text-anchor="middle" dominant-baseline="central">重讀並計時</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M324 212H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="200" text-anchor="middle" dominant-baseline="central">慢：從記憶體取回</text>
    <text class="dg-small" x="536" y="232" text-anchor="end" dominant-baseline="central">→ 判讀 1</text>
  </g>

  <text class="dg-tag" x="24" y="260" dominant-baseline="central">傳 0</text>
  <g data-step="4">
    <text class="dg-sub" x="108" y="296" dominant-baseline="central">什麼都不做</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M544 332H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="320" text-anchor="middle" dominant-baseline="central">重讀並計時</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 372H540" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="436" y="360" text-anchor="middle" dominant-baseline="central">快：還在快取裡</text>
    <text class="dg-small" x="536" y="392" text-anchor="end" dominant-baseline="central">→ 判讀 0</text>
  </g>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">發送端</text>
  <rect class="dg-box dg-box--store" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">共用快取</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">接收端</text>
</svg>
```

這只是共用快取的一種用法。Flush+Reload 要用到雙方共用的記憶體頁，並用 `clflush` 指令驅逐；2009 年的 EC2 研究用的是 Prime+Probe，也就是用自己的資料把快取填滿，再計時重讀，不需要共用頁。OpenAI 的文章沒說它的 agent 用了哪一種，下一篇會再回到這點。

## 不只快取：儲存與 CPU 時間

同樣的道理適用於任何「用的人多就變慢」的共用資源。2009 年那篇論文做過一個硬碟版：發送端要傳 1，就在共用磁碟上隨機讀取；要傳 0，什麼都不做；接收端不斷計時讀取固定位置，讀得慢就是 1。作者另外量了記憶體匯流排競爭的通道，同樣是兩個執行個體合作、靠共用資源傳訊息。CPU 時間也一樣：一方空轉時，同一顆 CPU 上的另一方分到的時間就變少。

2026 年 7 月的預印本〈[Isolation Failure From Shared Storage](https://arxiv.org/abs/2607.17518)〉則是 page cache 版：發送端把兩個檔案頁中的一個讀進快取，接收端計時讀兩頁，哪個快就是哪個位元。它在 Docker、gVisor、Kata 等環境量得到訊號，也就是上一篇提到的「沒有跨過 host 卻仍共用 page cache」。

## 三把尺：慢、吵、要先約好協定

**慢。** 這類通道的頻寬很低，而且差距很大：

| 來源 | 通道 | 實測頻寬 |
|---|---|---|
| 2009 EC2 論文（未經最佳化） | 記憶體匯流排 | 0.006 bps |
| 同上 | 硬碟 | 0.0005 bps |
| 同上（改良版） | 快取 | 約 0.2 bps |
| 2026 預印本（桌機等級硬體、實驗室） | Docker 上的 page cache | 約 480 bps，錯誤率低於 2% |

兩者的硬體、虛擬化與測量條件都不同，不能直接比。能說的是：頻寬從每秒不到一位元到每秒數百位元都有人量過，離網路連線差好幾個數量級。

**吵。** 真實主機上有別人的工作在跑。Flush+Reload 的原論文說明它的跨虛擬機實驗是在實驗室裡、閒置的機器上做的。2026 年的預印本則發現，背景的檔案快取壓力並沒有蓋掉訊號，反而讓「沒被預先讀入」那一側變得更慢，在一些設定下加大了差距；同一份研究也顯示換一個儲存路徑，訊號可以完全消失。雜訊有時蓋掉通道，有時不會，要看是哪個資源。

**要先約好協定。** 發送端和接收端要知道何時開始、每個位元多長、慢代表 0 還是 1。2009 年的快取通道，作者描述了在虛擬機被排到不同核心時要回到準備階段重來。這些約定本身也要想辦法傳過去，或事先寫死。

## 實驗：兩個行程搶同一顆 CPU

下載[這支 Python 程式](/examples/agent-isolation/cpu-contention-channel.py)，只用標準函式庫，需要 Linux。兩個行程都被綁在同一顆 CPU 上：發送端要傳 1 就全速空轉整個時段，要傳 0 就睡覺；接收端數自己在這個時段能跑幾小圈。發送端空轉時，接收端分到的時間變少，圈數就少。雙方事先約好起始時間、位元時段和一段 `10101010` 的前導，接收端用前導算出判讀門檻。

```bash
python3 cpu-contention-channel.py
```

在一台 4 核心的 Linux 虛擬機上，我依序用三組不同的隨機訊息各傳 64 位元，結果是：

| 位元時段 | 速度 | 三次的錯誤位元數（共 64） |
|---|---|---|
| 200、100、50、20 ms | 5、10、20、50 bps | 全部 0 |
| 10 ms | 100 bps | 35、19、7 |
| 5 ms | 200 bps | 43、23、25 |

速度在 50 bps 以內，三次都完全正確；到 100 bps 以後，錯誤數落在 7 到 43 之間，高的時候已經接近亂猜（64 位元亂猜約錯 32 個）。我的推測是和排程切換的間隔有關：位元時段短到接近那個間隔時，接收端數到的圈數就分不出 1 和 0。這就是「慢」和「吵」的實例：快一點就壞。

幾點要說清楚：

- 這是同一個作業系統內的兩個行程，沒有跨過容器或虛擬機的邊界，也不是快取攻擊。它示範的是「共用資源的快慢可以當訊號」。
- 前導與起始時間是我事先寫進程式的協定。沒有它們，接收端不知道從哪開始、門檻在哪。
- 你的數字會不同。今晚可以做的動作：把 `main()` 裡的位元時段清單改成你想試的值，找出你的機器開始出錯的速度；再試試把其中一個行程綁到別顆 CPU（修改 `pin_to_cpu` 的參數），看通道是否消失。

## 限制

- 實驗與引用的數字都來自受控環境：本機一台虛擬機、2009 年的 EC2、2026 年預印本的桌機測試台。它們說明原理與量級，不等於任何一個雲端沙盒平台上的真實風險。
- 這篇沒有討論防守：關閉超執行緒、直接 I/O、速率限制各自擋哪一類通道，是第 5 篇的主題。

## 參考資料

- [Hey, You, Get Off of My Cloud: Exploring Information Leakage in Third-Party Compute Clouds — Ristenpart et al., CCS 2009](https://rist.tech.cornell.edu/papers/cloudsec.html)
- [FLUSH+RELOAD: a High Resolution, Low Noise, L3 Cache Side-Channel Attack — Yarom and Falkner, USENIX Security 2014](https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/yarom)
- [Meltdown and Spectre](https://spectreattack.com/)
- [Isolation Failure From Shared Storage（arXiv:2607.17518）](https://arxiv.org/abs/2607.17518)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Agent 的程式碼跑在哪裡 — 本站](/posts/ai/2026-10-24-agent-isolation-overview)
- [容器、gVisor、microVM 差在哪 — 本站](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm)
