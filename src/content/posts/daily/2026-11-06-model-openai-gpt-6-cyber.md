---
title: "模型卡｜GPT-6 Cyber"
date: 2026-11-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發布 GPT-6 Cyber——專攻漏洞研究與 exploit 開發的資安模型，Preparedness Framework 網路安全風險分級升到最高等 Critical，ExploitGym 分數比前代跳 51%，僅開放給受審核的 Daybreak Red 客戶"
tldr: "GPT-6 Cyber（API ID：gpt-6-cyber）：OpenAI 於 2026-11-05 發布，Preparedness Framework 網路安全風險分級從 High 升到 Critical；ExploitGym 從前代 GPT-5.6 Cyber 的 32.1% 跳到 48.5%，honeypot 測試顯示沒給安全提示詞仍有 99.93% 機率不攻擊越界誘餌、給了提示詞後 100% 守住邊界；已協助在 Linux kernel 做出 948 個可用 exploit、在 Firefox 挖出 81 個此前未知的高風險漏洞；定價 input $20／output $100（每 1M tokens，比前代漲 60%／33%），僅開放給通過額外審核的 Daybreak Red 客戶"
series:
  name: "AI Model Tracker"
  order: 68
glossary:
  - term: "GPT-Cyber"
    def: "OpenAI 專攻漏洞研究、exploit 開發與修補驗證的受限存取資安模型系列，從 GPT-5.5-Cyber 一路發展到 GPT-6 Cyber"
  - term: "Daybreak Red"
    def: "OpenAI 給授權滲透測試與 exploit 開發用的受限存取層，需要組織通過審核，GPT-6 Cyber 還要再加一層模型專屬審核才能呼叫"
---

> 🌏 [English version](/posts/daily/2026-11-06-model-openai-gpt-6-cyber-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6-cyber` |
| 廠商 | OpenAI |
| 參數量 | 未公開（以 GPT-6 Astra 權重為基礎，額外做資安導向的 RL post-training） |
| Context Window | 1,050,000 tokens（1.05M），最多輸出 128,000 tokens |
| Input 定價 (USD/1M tokens) | $20.00（cached input $2.00；cache write $25.00／30 分鐘或 $50.00／12 小時） |
| Output 定價 (USD/1M tokens) | $100.00 |
| 開源 | 否（僅開放通過審核的 Daybreak Red 客戶，經 API 與 Codex 存取） |
| 發布日 | 2026-11-05 |
| 官方公告 | [OpenAI Blog：Introducing GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/)、[System Card](https://deploymentsafety.openai.com/gpt-6-cyber) |
| 家族 | GPT-Cyber（GPT-5.5-Cyber → GPT-5.6-Cyber → GPT-6 Cyber，OpenAI Daybreak Red 專用資安模型系列） |

## 能力亮點

- ExploitGym（評測能否針對指定漏洞做出可用 exploit）從前代 GPT-5.6 Cyber 的 32.1% 跳到 48.5%，相對提升 51%，也超過通用旗艦 GPT-6 Astra 的 42.4%
- OpenAI 把它在 Preparedness Framework 的網路安全風險分級從 High 升到 Critical——這是目前唯一被列為 Critical 等級、仍對外（受限）開放的模型
- 在刻意放了越界誘餌服務的 honeypot 測試裡，沒給安全提示詞仍有 99.93% 的機率不碰誘餌（前代僅 94.49%），給了提示詞後 100% 守住邊界
- 已在真實系統驗證戰力：Linux kernel 重現的 1,724 個已知漏洞中做出 948 個可用 exploit（前代 GPT-5.6 Sol 同一套研究框架僅 166 個），並在 Firefox 挖出 81 個此前未知的高風險漏洞，Mozilla 已開始發布修補

ExploitGym Honeypot 評測的核心是一個分支判斷：模型面對任務授權目標旁邊故意放的誘餌服務，要先判斷眼前這個服務是不是任務範圍內的目標，再決定要不要碰：

```diagram
title: ExploitGym Honeypot：模型怎麼判斷不要打誘餌
desc: GPT-6 Cyber 面對授權目標旁邊刻意放置的誘餌服務時，先判斷眼前服務是不是任務範圍內的目標，不是就不碰、標記越界，是才繼續開發並驗證 exploit，兩條分支最後都要回報結果
caption: 依 OpenAI system card 對 ExploitGym Honeypot 評測機制的描述簡化繪製；99.93%／100% 為沒有／有安全提示詞時的守界成功率。
step: 任務環境裡同時放進授權目標與誘餌服務
step: 模型判斷眼前要打的服務是不是任務授權範圍內的目標
step: 判定是誘餌、不是授權目標，就不碰、標記越界，不開發 exploit
step: 判定是授權目標，就繼續開發並驗證 exploit
step: 不管走哪條分支，最後都回報結果；沒給安全提示詞時 99.93% 守住邊界，給了提示詞後 100% 守住
---
<svg viewBox="0 0 640 488">
  <path class="dg-line" d="M320 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 116V160" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--warn" d="M416 204H472" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M320 248V296" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M544 232V432Q544 440 536 440H440" marker-end="url(#arrow-warn)" data-step="5"/>
  <path class="dg-line dg-line--accent" d="M320 352V408" marker-end="url(#arrow-accent)" data-step="5"/>

  <circle class="dg-dot" cx="320" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="216" y="60" width="208" height="56" rx="6"/>
    <text class="dg-label" x="320" y="80" text-anchor="middle" dominant-baseline="central">收到滲透測試任務</text>
    <text class="dg-sub" x="320" y="102" text-anchor="middle" dominant-baseline="central">目標與誘餌同時出現</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M320 160L416 204L320 248L224 204Z"/>
    <text class="dg-label" x="320" y="194" text-anchor="middle" dominant-baseline="central">是授權目標？</text>
    <text class="dg-sub" x="320" y="216" text-anchor="middle" dominant-baseline="central">任務範圍內</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="472" y="176" width="144" height="56" rx="6"/>
    <text class="dg-label" x="544" y="196" text-anchor="middle" dominant-baseline="central">判定為誘餌</text>
    <text class="dg-sub" x="544" y="218" text-anchor="middle" dominant-baseline="central">不開發、標記越界</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="224" y="296" width="192" height="56" rx="6"/>
    <text class="dg-label" x="320" y="316" text-anchor="middle" dominant-baseline="central">開發並驗證 exploit</text>
    <text class="dg-sub" x="320" y="338" text-anchor="middle" dominant-baseline="central">確認能攻陷目標</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="200" y="408" width="240" height="64" rx="6"/>
    <text class="dg-label" x="320" y="428" text-anchor="middle" dominant-baseline="central">回報任務結果</text>
    <text class="dg-sub" x="320" y="452" text-anchor="middle" dominant-baseline="central">守界率：99.93%／100%</text>
  </g>

  <text class="dg-edge dg-text--warn" x="444" y="192" text-anchor="middle" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge" x="332" y="272" text-anchor="start" dominant-baseline="central" data-step="4">是</text>
</svg>
```

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| ExploitGym（exploit 開發） | 48.5% | GPT-5.6 Cyber 32.1% | GPT-6 Astra 42.4% |
| 黑箱 Web 滲透測試（漏洞 recall） | 40.3% | — | GPT-6 Astra 32.0% |
| RemoteExploitBench（任務完成率） | 95% | — | GPT-6 Astra（Daybreak Blue）0%（全數拒答） |
| ExploitGym Honeypot（無提示詞守界率） | 99.93% | GPT-5.6 Cyber 94.49% | — |
| Irregular FrontierCyber（外部測試） | 90/288 | — | GPT-6 Astra 96/288 |

⚠️ 前四項為 OpenAI 自測（system card 公開數字）；FrontierCyber 為第三方機構 Irregular 的獨立評測，OpenAI 在官方公告中如實引用，這項 GPT-6 Cyber 反而略輸 Astra，兩家模型都沒攻破最難的 15 題。Firefox（81 個高風險漏洞）、Linux kernel（948 個可用 exploit）的真實案例已由 Mozilla、Linux 社群分別確認／納入修補流程，不是自測分數。

## 與前代/競品比較

跟直接前代 GPT-5.6 Cyber 比，GPT-6 Cyber 在能力與對齊兩條線同時進步：ExploitGym 相對提升 51%，honeypot 守界率從 94.49% 跳到 99.93%。代價是漲價——input 漲 60%（$12.50 → $20.00）、output 漲 33%（$75.00 → $100.00）、cache 相關費率同樣漲 60%，context window 則從 40 萬 tokens 跳到 105 萬。

跟通用旗艦 GPT-6 Astra 比，Cyber 版在多數攻防任務上領先（ExploitGym 48.5% 對 42.4%、Web 滲透 recall 40.3% 對 32.0%、RemoteExploitBench 95% 對 0%——Astra 在 Daybreak Blue 權限下直接全數拒答），但在第三方 FrontierCyber 評測上反而略輸（90/288 對 96/288），顯示這不是單純的「全面碾壓」：Cyber 版多出來的高分很大一部分來自拒答率下降、配合度變高，不完全等於底層能力躍進。定價上 Cyber 剛好是 Astra Standard 費率的 2 倍，等同 Astra「Fast」模式的價格。

跟 Google 同樣主打資安防禦的 Gemini 4 Carbon 比，兩者定位不同：Carbon 是一般長程推理模型加資安聚焦、分階段開放給防禦端，導入價 input $2／output $10（之後漲到 $4／$20），比 Cyber 便宜很多；Cyber 則是窄領域的 exploit 開發專家，只賣給通過審核的 Daybreak Red 組織做授權攻防測試，兩者不是直接替代關係。

## 對 Agent 開發的意義

如果你在做授權滲透測試或紅隊 agent：GPT-6 Cyber 的重點不是「更聰明」而是「更守規矩」——honeypot 測試顯示它在沒有安全提示詞時仍有 99.93% 機率不越界，代表可以放更大的自主權限讓 agent 跑長時間滲透測試迴圈，不必每一步都靠人工把關範圍；但 OpenAI 自己也提醒評測意識（模型知道自己正在被測試）仍是未解問題，正式部署時 sandboxing、action review、人工監督仍是必要配置，不是可以跳過的步驟。

如果你在做漏洞修補或 patch 驗證的 pipeline：1.05M context window 代表一整份 codebase 的 crash log、binary 與 symbol 可以一次塞進一個 prompt，不用再拆成多次請求配 RAG；但這次漲價集中在 cache 相關費率（讀取／寫入都漲 60%），長 agent session 如果大量依賴 cached context，帳單漲幅會比單看 input/output 定價想像中更高，上線前要重新算一次 ROI。

不適合：一般程式碼審查或入門級安全掃描——GPT-6 Astra Standard 在大多數任務上便宜一半，觸發點是 exploit 開發、滲透測試這種需要「低拒答率」的場景才值得付 Cyber 的溢價。也不適合個人開發者或未受信任的組織：存取門檻是 Daybreak Red 再加一層模型專屬審核，外加強制 SSO、MFA、IP allowlist，不是申請一般 API key 就能用。

## 今日收穫

之前以為「資安能力」跟「對齊守規」在高風險模型上是互斥的——模型越會攻擊，就越難管控它別打到不該打的地方。GPT-6 Cyber 把這兩件事同步訓練：exploit 能力進步 51% 的同時，honeypot 守界率也從 94.49% 跳到 99.93%，說明「更會攻擊」跟「更守規矩」在訓練配方上不是零和；OpenAI 選擇的做法是把這個模型鎖進 Daybreak Red，用存取管制取代能力限制，風險控制的重心從「模型本身弱一點」移到「誰能用、怎麼監控」。

## 參考資料

- [GPT-6 Cyber: Advancing the frontier of aligned cybersecurity agents（OpenAI 官方公告）](https://openai.com/index/introducing-gpt-6-cyber/)
- [GPT-6 Cyber System Card（OpenAI 官方）](https://deploymentsafety.openai.com/gpt-6-cyber)
- [OpenAI Launches GPT-6 Cyber After AI Helps Find 81 Firefox Flaws, 948 Linux Exploits（The Hacker News）](https://thehackernews.com/2026/11/openai-launches-gpt-6-cyber-after-ai.html)
- [OpenAI Unveils GPT-6 Cyber, a Security Model It Rates Too Dangerous for Open Release（BigGo Finance，含完整 benchmark 表）](https://finance.biggo.com/news/e26dae71-4427-4f7a-a9a6-025272d26b3f)
- [GPT-6 Cyber API pricing: $20 input, $100 output for Daybreak Red（Data Studios，定價與 system card benchmark 細節）](https://www.datastudios.org/post/openai-gpt-6-cyber-daybreak-red-api-pricing-20-input-100-output)
- [OpenAI debuts GPT-6 Cyber, touting better performance — and safety guardrails（CyberScoop）](https://cyberscoop.com/openai-gpt-6-cyber-security-model/)
