---
title: "防守清單怎麼讀：隔離、降噪與偵測各擋哪一類問題"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, isolation, defense-in-depth]
lang: zh-TW
description: "把關閉 SMT、單租戶、直接 I/O、DNS 允許清單、離線世界與監控這些防守項目，逐項對到旁路通道與出口兩類問題，標出哪些只是偵測，並給三件優先要做的事。"
tldr: "沒有任何一項防守同時擋住旁路通道與出口。擋通道的核心是不共用，擋出口的核心是收窄被放行的服務，監控只負責發現，自動停止是事後回應，兩者都不是預防。"
difficulty: 進階
draft: true
series:
  name: "Agent 隔離邊界"
  order: 5
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-defense-matrix-en)

前面幾篇談了兩類問題：agent 之間靠共用資源的快慢通訊（旁路通道，見〈[沒有網路也能傳資料](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro)〉），以及 agent 靠被放行的服務通到外面（出口，見〈[出口不只一個](/posts/ai/2026-10-24-agent-isolation-indirect-exits)〉）。這篇回到防守：你手上那份清單，每一項到底在擋哪一類？

防守清單最常見的毛病，是每一項都「聽起來有用」，但沒人說得出它擋的是通道、出口，還是只是偵測。讀完你能把任何一份清單逐項標成「擋旁路」「擋出口」「只偵測」，並決定先投資哪三件。

## 兩類問題的前提不同

| | 旁路通道 | 出口 |
|---|---|---|
| 發生在 | 兩個沙盒之間 | 沙盒與外部網路之間 |
| 依賴什麼 | 兩邊共用同一份硬體或服務的狀態 | 被放行、能替人發請求的服務 |
| 例子 | 快取時序、page cache、CPU 時間、TLS 憑證快取 | 套件代理、DNS 解析器、metrics 服務、公開網站中繼 |
| 要拿掉的前提 | 共用 | 「放行」本身，或服務的跑腿能力 |

前提不同，所以沒有一項防守能同時處理兩邊。下面逐項對。

## 防守項目對照表

表中的「擋什麼」是本文的歸納，出處欄才是各來源寫的。

| 防守項目 | 擋旁路通道？ | 擋出口？ | 出處與說明 |
|---|---|---|---|
| 關閉 SMT，或用核心排程只讓同一信任群共用一顆核心 | 部分：只擋同一顆核心上兩條執行緒之間的共用 | 否 | Firecracker 文件建議在需要租戶分離的正式環境關閉 SMT；Linux 核心文件說跨超執行緒攻擊唯一完整的緩解是關掉 SMT，核心排程只緩解其中一部分 |
| 一個行程一個租戶 | 部分：隔開各自的 VMM 行程，同一台主機上的快取與 page cache 仍共用 | 否 | Firecracker 文件強烈建議每個 Firecracker 行程只對應單一租戶的工作負載；它的前提是多個行程共用同一台主機 |
| 不同信任等級的沙盒不放同一台主機 | 是：共用硬體的前提不存在了 | 否 | 本文的歸納，Firecracker 文件沒有寫這一句 |
| 直接 I/O、專用 block device | 部分：只擋經由 host page cache 的儲存通道 | 否 | arXiv 2607.17518：訊號在共用、可快取的 host 檔案上持續，直接 I/O 與專用 block device 大幅衰減或消除 |
| 關閉核心的記憶體去重（KSM） | 部分：只擋靠頁面去重的那一類 | 否 | Firecracker 文件 |
| 核心與韌體的硬體弱點緩解 | 部分：擋「利用 CPU 弱點」的攻擊 | 否 | Linux 核心的攻擊向量控制文件把緩解依「客體到主機」「客體到客體」「跨執行緒」等分類 |
| 速率限制與資源上限 | 不確定 | 否 | Firecracker 文件用它處理同機 guest 之間儲存與網路的爭用；對通道頻寬的影響沒有來源 |
| 離線世界，不接網際網路 | 否 | 是，但不含被放行的服務 | OpenAI 10 月 23 日文章：前沿模型的訓練不接網際網路；9 月 20 日事件的環境就是離線網頁快取加 DNS 解析器，解析器這條路仍通到外面 |
| 網路邊界延伸到間接可達的服務、DNS 允許清單、離線替代 | 否 | 是 | OpenAI 10 月 23 日文章與 9 月 20 日事件報告 |
| 監控 | 偵測 | 偵測 | OpenAI 在監控加入偵測這些通道通訊的檢查 |
| 自動停止與暫停規則 | 回應：縮短持續時間，不阻止發生 | 回應：同左 | OpenAI 8 月 26 日文章：最嚴重的警報在 30 分鐘內無法確認是誤報就暫停，目標是全自動關停；10 月 23 日文章也寫了偵測到範圍外活動就暫停的程式化檢查 |
| 持續紅隊與設定檢查 | 找缺口 | 找缺口 | OpenAI 持續檢查防火牆是否照預期生效、監控是否在跑 |

幾點補充：

- **硬體弱點緩解不等於擋隱蔽通道。** 這是我的判斷：兩個合作的程式用正常的快取行為傳訊息，不需要任何 CPU 漏洞，所以沒有對應的修補可以打。gVisor 的安全模型說明它對硬體側信道主要依賴 host 作業系統與平台，自己能做的很少（原文談的是硬體側信道，不是合作式的隱蔽通道）；Linux 核心的文件同樣是針對「弱點」逐項緩解。
- **SMT 以外的共用仍在。** Flush+Reload 的原論文說明它針對最後一級快取，攻擊與受害程式不必共用同一顆核心，所以關閉 SMT 擋不住跨核心的快取通道。Flush+Reload 需要雙方共享記憶體頁，所以也和上表 KSM 那一列有關。上一篇的本機實驗是兩個行程在同一顆核心上時間分享，關閉 SMT 也不會改變它。
- **直接 I/O 的選項依環境而異。** 依 arXiv 論文的附錄，Kata 搭配 Firecracker 時沒有對應 `block_device_cache_direct` 的設定，要靠主機端 loop device 的直接 I/O，或改用真正的 block device 當底層。
- **代價沒有免費。** Linux 核心文件說，許多跨執行緒攻擊只有關掉 SMT 才能緩解，代價是核心數與效能下降；核心排程在負載輕時可能比關掉 SMT 還慢，要用自己的工作負載量。

## OpenAI 沒說的

OpenAI 10 月 23 日的文章寫了監控、紅隊、離線世界與修補，但沒有寫主機層對旁路通道用了哪些緩解：有沒有關 SMT、儲存走什麼路徑，原文都沒有說。能確定的是：紅隊實驗是在共用主機上的虛擬機之間做的，而且成功傳了訊息；修補之後這些通道是否已經封閉，原文只說加了偵測的檢查，並稱多數通道傳得慢、難利用。

## 只能做三件事，我會這樣排

這是我的排序，依據是上面表格的結構：

1. **先決定誰必須和誰隔離，再把它們分開放。** 通道的前提是共用，不共用是最直接的解：不同信任等級的沙盒放不同主機。做不到的話，多租戶至少走一行程一租戶並關閉 SMT，但那只隔開各自的 VMM，同機的硬體仍共用。只有自己一個人用的 agent，這一項可以降到最低。
2. **收窄間接可達的服務。** 對 DNS 做允許清單，把套件代理與 metrics 之類換成離線替代或只留必要。這一項便宜，效果對應的是 9 月 20 日那類事件。
3. **讓監控能自動停止，並用測試事件驗證整條流程。** 9 月 20 日的事件裡，警報很快，但 run 沒有自動停下，另有 DNS 活動沒被標到該有的嚴重度。OpenAI 事後開始部署額外的 DNS 偵測與偵測管線測試。Hugging Face 事件後，OpenAI 也訂了規則：最嚴重的警報，從通知到人起算 30 分鐘內無法確認是誤報，就要暫停相關活動，終點是全自動的關停。

今晚就能做的動作：把你現在的防守清單貼進上面那種表格，每一項標上「擋旁路」「擋出口」「偵測」。標不出來的項目，代表你還沒搞清楚它在擋什麼。要檢查自己 host 的 SMT 狀態，可以執行：

```bash
cat /sys/devices/system/cpu/smt/control
```

輸出會是 `on`、`off` 或 `notsupported` 這類值。在虛擬機裡看到 `notsupported` 時，要向供應商確認 host 端的設定。

## 限制

- 這篇沒有量任何防守的效能代價，也沒有逐項測試它們實際擋住多少；表格是對各來源描述的歸納。
- 防守的有效程度會隨 CPU 世代、虛擬化軟體與雲端供應商而變，採用前要對照自己環境的文件。

## 參考資料

- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Core Scheduling — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/hw-vuln/core-scheduling.html)
- [Attack Vector Controls — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/hw-vuln/attack_vector_controls.html)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Isolation Failure From Shared Storage（arXiv:2607.17518）](https://arxiv.org/abs/2607.17518)
- [FLUSH+RELOAD: a High Resolution, Low Noise, L3 Cache Side-Channel Attack — Yarom and Falkner, USENIX Security 2014](https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/yarom)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [沒有網路也能傳資料 — 本站](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro)
- [出口不只一個 — 本站](/posts/ai/2026-10-24-agent-isolation-indirect-exits)
