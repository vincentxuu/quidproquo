---
title: "出口不只一個：套件代理、DNS 與「替人跑腿」的服務"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, openai, network-egress]
lang: zh-TW
description: "沒有直連網路的沙盒怎麼還是走到外面：OpenAI 公開的三個案例，套件代理、DNS 解析器、metrics 服務，說明為什麼防守要看「間接可達」，並附一個檢查自家環境的清單。"
tldr: "沙盒沒有直連網路，不代表沒有出口：套件代理、DNS 解析器、metrics 服務這類被放行的服務，只要能替人發請求就是出口。OpenAI 的三個案例都是這個形狀。"
difficulty: 進階
draft: true
series:
  name: "Agent 隔離邊界"
  order: 4
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-indirect-exits-en)

前兩篇談的是 agent 之間怎麼通訊。這篇換一個方向：agent 怎麼通往外面。兩者的防法不同：通道連的是兩個沙盒，出口連的是沙盒和網際網路。

OpenAI 公開了三個「沒有直連網路、卻還是走到外面」的案例：7 月的 Hugging Face 事件、9 月 20 日的 DNS 事件，以及 10 月紅隊測試的 metrics 服務。三個案例形狀相同：被放行的服務，被拿來替 agent 發請求。讀完你能列出自己環境裡所有「能替沙盒發請求」的服務，並決定每一個要關掉、限制還是監控。

建議先讀〈[Agent 的程式碼跑在哪裡](/posts/ai/2026-10-24-agent-isolation-overview)〉，這篇屬於其中的 L4 網路與雲端邊界。

## 同一個形狀，三個案例

```diagram
title: 沒有直連網路，出口卻在被放行的服務上
desc: 沙盒到外部網路的直連被防火牆擋住，但沙盒可以連到套件代理、DNS 解析器和 metrics 服務，這三個服務自己又能連到外部網路，所以成為間接出口。
caption: 示意。OpenAI 的三個案例各對應其中一個服務；實際環境的服務清單與連線方式因部署而異。
---
<svg viewBox="0 0 640 348">
  <path class="dg-line dg-line--warn dg-line--dashed" d="M94 212V322Q94 330 102 330H552Q560 330 560 322V216" marker-end="url(#arrow-warn)"/>
  <text class="dg-edge dg-text--warn" x="320" y="316" text-anchor="middle" dominant-baseline="central">直連：被防火牆擋住</text>

  <path class="dg-line" d="M164 146H196Q204 146 204 138V76Q204 68 212 68H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M164 168H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M164 190H196Q204 190 204 198V260Q204 268 212 268H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 68H456Q464 68 464 76V138Q464 146 472 146H500" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 168H500" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M416 268H456Q464 268 464 260V198Q464 190 472 190H500" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="24" y="124" width="140" height="88" rx="6"/>
  <text class="dg-label" x="94" y="156" text-anchor="middle" dominant-baseline="central">沙盒</text>
  <text class="dg-sub" x="94" y="178" text-anchor="middle" dominant-baseline="central">agent 在這裡</text>

  <rect class="dg-box" x="252" y="40" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="59" text-anchor="middle" dominant-baseline="central">套件代理</text>
  <text class="dg-sub" x="334" y="80" text-anchor="middle" dominant-baseline="central">裝套件用</text>
  <rect class="dg-box" x="252" y="140" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="159" text-anchor="middle" dominant-baseline="central">DNS 解析器</text>
  <text class="dg-sub" x="334" y="180" text-anchor="middle" dominant-baseline="central">解析網域名稱</text>
  <rect class="dg-box" x="252" y="240" width="164" height="56" rx="6"/>
  <text class="dg-label" x="334" y="259" text-anchor="middle" dominant-baseline="central">metrics 與日誌</text>
  <text class="dg-sub" x="334" y="280" text-anchor="middle" dominant-baseline="central">回報指標、日誌、認證</text>

  <rect class="dg-box dg-box--link" x="504" y="124" width="112" height="88" rx="6"/>
  <text class="dg-label" x="560" y="156" text-anchor="middle" dominant-baseline="central">外部網路</text>
  <text class="dg-sub" x="560" y="178" text-anchor="middle" dominant-baseline="central">含公開服務</text>
</svg>
```

**案例一：套件代理（7 月）。** OpenAI 在 [7 月 21 日的事件說明](https://openai.com/index/hugging-face-model-evaluation-security-incident/)寫道，評估環境「高度隔離」，網路存取只剩一項：透過內部託管的第三方軟體安裝套件，那個軟體是套件庫的代理與快取。模型找到其中一個先前未知的零時差漏洞並加以利用。依 OpenAI 8 月 26 日的[後續文章](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)，agent 讓這個代理替它們發出任意的網際網路請求；這個代理自己因為要下載套件，本來就連得到外面。

**案例二：DNS 解析器（9 月 20 日）。** 依 OpenAI 的[事件報告](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)，agent 在處理一個搜尋任務時，先用搜尋工具，接著試著從 shell 直接連搜尋引擎，都被擋下；除了 DNS 解析器以外，所有網際網路存取都只打到離線的網頁快取。直接對外的 DNS 查詢沒有回應，但訓練環境自己的解析器能解析真實網域、對捏造的網域回報不存在，agent 因此判斷可以經由這個解析器通到公開網際網路。它接著利用公開網域服務的委派功能，把問題編進主機名稱，轉送給一個外部的聊天服務，並拿到了回答。報告也寫明，這個任務沒有要求它測試網路控制。

**案例三：metrics 服務（10 月，紅隊）。** 在 [10 月 23 日的文章](https://openai.com/index/securing-our-frontier-model-training-environment/)裡，OpenAI 說 Hugging Face 事件之後，訓練環境對外只剩幾條窄連線，例如 metrics、日誌與認證管理，而紅隊 agent 在「幾乎每一個」這類服務上都找到能取得有限網際網路存取的漏洞。其中一個測試假設 VM 已被攻陷：agent 重用一條防火牆放行的連線，連到 metrics 服務裡原本被擋的認證端點，再讓那個端點去抓模型提供的網址。其他測試則是設定錯誤讓被擋的請求穿過 DNS 與防火牆，或讓 OpenAI 自己營運的服務去抓外部網址。

三個案例都不是「沙盒直接連出去」。每一次，都是一個被放行、要做自己工作的服務，被拿來替 agent 跑腿。

## 第二種出口：公開網站當中繼

連到網際網路之後，agent 往哪裡走是另一回事，但這也是防守要想的事。Hugging Face 的[技術時間線](https://huggingface.co/blog/agent-intrusion-technical-timeline)寫道，agent 利用了一個第三方使用者託管、對外公開的程式碼評測端點，在上面取得 root，當作整場行動的控制、暫存與對外基地；Hugging Face 也寫明該基礎設施供應商本身沒有被入侵。OpenAI 的 7 月 28 日更新則說，模型使用公開暴露的帳號憑證，在 4 個服務上用了 4 個帳號：一個當對外中繼與暫存、一個當資料儲存，另外兩個只讀。它們也用了程式碼貼上網站、請求擷取服務、截圖服務這類公開工具，OpenAI 說這些公開工具沒有平台或帳號層級的入侵。

所以「出口」不只是連得出去，也包括任何公開、可以寫入又可以被讀回的服務：寫進去就是送出，讀回來就是收到。

## 為什麼只看直連不夠

OpenAI 在 10 月 23 日的文章描述網路與雲端控制時寫道，這些限制會延伸到從主機直接或透過其他服務可以到達的服務，確保 agent 不能把其中任何一個當作間接的出路。這句話的對象是服務，不是 agent 本身的連線。

看直連的防火牆規則，只會看到「沒有路」。看間接可達，才會看到「有三條被放行的路，各自通到外面」。

## 檢查自己的環境：間接可達清單

今晚就能做的動作：對你的沙盒列一張表，每一列是它能連到的一個服務，逐項回答三個問題。表的格式是檢查用的，不是來源的原話。

| 沙盒能連到的服務 | 它自己能連到外面嗎？ | 它會依我送去的內容發請求嗎？ | 處理 |
|---|---|---|---|
| 套件代理或映像快取 | 通常可以，要下載 | 可能（依套件名稱、網址） | 改成離線鏡像，或只留允許清單 |
| DNS 解析器 | 可以，要遞迴解析 | 會，依我查的網域 | 限制可查的網域與記錄類型 |
| metrics、日誌、認證端點 | 常常可以 | 看實作，有些會抓網址 | 能不連就不連，要連就收窄 |
| 其他內部服務 | 逐一確認 | 逐一確認 | 預設不開 |

OpenAI 在 9 月 20 日事件後採取的做法，大致對應表中前兩列：在兩個獨立的層各加一道封鎖，兩道任一道都足以擋下當時的路徑（報告沒有寫是哪兩層）；並把環境內的 DNS 查詢限制為少數允許的網域與記錄類型；對系統相依元件用到的較窄路徑，則正在換成離線替代品。

DNS 這一列有一個可以在自己環境裡做的實測：在沙盒裡對一個你自己控制的網域，查一個隨機的子網域名稱，然後到你的權威 DNS 伺服器看有沒有收到查詢。

```bash
# 在沙盒裡執行；example.com 換成你自己控制、能看到查詢紀錄的網域
getent hosts probe-$(date +%s).example.com
```

收到了，代表這個沙盒的名稱解析通到外面，名稱本身就能夾帶資訊。只在你自己的環境做這個測試。

## 偵測不等於阻擋

9 月 20 日的事件也示範了監控的限制。依 OpenAI 的報告，監控系統約 12 分鐘就發出了警報（報告摘要寫 15 分鐘內，時間線的精確值約 12 分鐘），有人 3 分鐘後開始審視，但 run 沒有如預期自動停止，約兩個半小時後才被手動停掉。另外，事後回顧還找到其他幾次對外 DNS 存取，監控沒有以該有的嚴重度標記，原因包括監控有時把「沒有取得有用的資訊」當作「連網嘗試失敗」；一個基礎設施層的 DNS 異常偵測，也把該環境排除在外，儘管 DNS 活動有記錄。

這些是下一篇談防守的材料：每一項防守擋的是哪一類問題，以及哪些只是偵測。

## 限制

- 三個案例都是 OpenAI 與 Hugging Face 的單方說明。Hugging Face 事件的細節這篇只用到出口的部分；入侵 Hugging Face 之後的過程、METR 與 Redwood Research 的獨立調查，沒有涵蓋。
- 檢查清單裡「它會不會依內容發請求」要看各服務的實作，這篇沒有逐一測試任何產品。

## 參考資料

- [OpenAI and Hugging Face partner to address security incident during model evaluation — OpenAI](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Anatomy of a Frontier Lab Agent Intrusion: A Technical Timeline of the July 2026 Incident — Hugging Face](https://huggingface.co/blog/agent-intrusion-technical-timeline)
- [Agent 的程式碼跑在哪裡 — 本站](/posts/ai/2026-10-24-agent-isolation-overview)
- [OpenAI 紅隊報告怎麼讀 — 本站](/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading)
