---
title: "Perplexity Computer 本地模式怎麼選：完全本地、Hybrid、記憶體與雲端邊界"
date: 2026-10-23
category: ai
type: deep-dive
tags: [perplexity, ai-agent, local-inference, apple-silicon, privacy, macos]
lang: zh-TW
tldr: "Perplexity Computer 在 10 月 20 日新增完全本地模式：模型與 agent 都跑在 Apple silicon Mac 上，Pro、Max、Enterprise 訂閱者可用，官方建議 36GB 以上記憶體。檔案與推理留在本機，但即時資訊、瀏覽器和寄信仍會連網。"
description: "整理 Perplexity Computer 完全本地與 Hybrid 兩種跑法的差別、Mac 記憶體門檻、哪些步驟仍會出門，以及現有的 Mac 該直接試，還是值得為它升級。"
draft: false
glossary:
  - term: "統一記憶體"
    aliases: ["unified memory"]
    definition: "Apple silicon 讓 CPU 與 GPU 共用的同一塊記憶體。本地模型的權重要放進這一塊，跟其他開著的 app 一起用。"
    context: "官方用統一記憶體的容量來設定完全本地與 Hybrid 的建議配置。"
---

> 🌏 [English version](/posts/ai/2026-10-23-perplexity-computer-local-mac-en)

社群上流傳「拔掉網路也能用、資料零上傳」，大方向是對的，但要補兩個條件：離線只適用於不需要網路的任務，而且官方建議的 36GB 記憶體，比不少新 Mac 能配的上限還高。這篇幫你判斷：完全本地和 Hybrid 差在哪、哪些步驟還是會連網、你的 Mac 該直接試還是先別動。

## 它是什麼：先從 Mac 開始的 Computer

Perplexity Computer 是會自己規劃、呼叫工具、做完多步驟任務的 agent。Perplexity 在 2026 年 10 月 20 日發表[完全本地模式](https://www.perplexity.ai/hub/blog/perplexity-computer-now-runs-fully-local-on-mac)，Mac 版 App 因此有兩種開場方式：

- **完全本地**：任務從 Mac 開始，模型、agent、規劃、推理與檔案處理都在本機。
- **Hybrid Compute**：9 月推出，任務從雲端開始，雲端模型負責研究與推理，Mac 上的模型處理私人檔案，個資在送出前會被遮蔽、留在本機，或先問你。

本地模型有兩個：Qwen 3.6，以及 PPLX Pro，後者是 Perplexity 在 Qwen 之上 post-train 的版本。模型在 App 裡按指示下載。

## 給誰用、需要什麼

- **訂閱**：Perplexity Pro、Max、Enterprise。免費版不能用。
- **硬體**：Apple silicon Mac。完全本地建議 36GB 以上統一記憶體，Hybrid 的[產品頁](https://www.perplexity.ai/hub/products/hybrid-compute)建議 32GB；9 月的 [Hybrid 公告](https://www.perplexity.ai/hub/blog/introducing-hybrid-compute-on-mac)寫的最低是 macOS 15 加 24GB。
- **先備知識**：知道 agent 會讀你的檔案、操作 Notes、Mail 這類 app，授權前要想清楚給哪些範圍。

## 兩種跑法怎麼選

| 面向 | 完全本地 | Hybrid |
|---|---|---|
| 任務起點 | Mac | 雲端 |
| 規劃與推理 | Mac 上的 Qwen 3.6 或 PPLX Pro | 雲端前沿模型 |
| 私人檔案 | 在 Mac 上處理，不送雲端模型 | Mac 上的模型處理，送出前遮蔽、留本機或問你 |
| 即時資訊、瀏覽器 | 你授權後才走雲端 | 本來就是雲端起手 |
| 記憶體建議 | 36GB | 32GB |
| 官方舉的例子 | 私人持股加下載好的行情資料，做投組檢查 | 機密財報加最新市場研究，做交易審查 |

兩個例子畫出了分界：任務需要的資料都已經在你的 Mac 上，選完全本地；需要最新的外部資訊，又不想讓機密檔案原樣出門，選 Hybrid。另外，Perplexity 在 X 上說本地任務不消耗 Computer credits，走到雲端的步驟才會算。

## 一個範例：週一早上的待辦清單

這是官方三個範例裡最容易複製的一個，只用到 Messages、Mail 和 Notes。

1. 在 Perplexity Mac App 選「完全本地」，授權 Messages、Mail、Notes。
2. 下指令：看最近的對話與信件，找出要我處理的請求和期限，在 Notes 建一份行動清單，草擬回覆讓我檢查。
3. 本地 agent 讀對話、整理請求與期限、建立清單、找出相關的本機文件，並寫好回覆草稿。
4. 你審過草稿再寄。

信件與訊息內容、清單、草稿全程留在 Mac。第 4 步寄出時，Mail 會用它自己的服務連網；這一步本來就要網路，跟 agent 在哪裡跑無關。如果指令改成「再對照今天的市場新聞」，就需要即時資訊，得授權雲端或改走 Hybrid。

## 限制：哪些還是會出門

```diagram
title: 完全本地模式下，哪些留在 Mac、哪些會出門
desc: 模型、agent 與檔案都在 Mac 內；雲端前沿模型、網頁與連線 app、各 app 自家的服務在 Mac 外，只在授權或送出動作時才連線。
caption: 依 Perplexity 官方公告與產品頁整理；虛線是離開 Mac 的路徑。
---
<svg viewBox="0 0 640 388">
  <rect class="dg-zone dg-zone--solid" x="20" y="40" width="320" height="280" rx="8"/>
  <text class="dg-tag" x="36" y="62" dominant-baseline="central">你的 MAC</text>

  <path class="dg-line" d="M180 128V152" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M180 224V248" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 172H396Q404 172 404 164V108Q404 100 412 100H444" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 188H444" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 204H396Q404 204 404 212V268Q404 276 412 276H444" marker-end="url(#arrow-link)"/>

  <rect class="dg-box" x="92" y="76" width="176" height="48" rx="6"/>
  <text class="dg-label" x="180" y="92" text-anchor="middle" dominant-baseline="central">本地模型</text>
  <text class="dg-sub" x="180" y="112" text-anchor="middle" dominant-baseline="central">Qwen 3.6・PPLX Pro</text>

  <rect class="dg-box dg-box--accent" x="92" y="156" width="176" height="64" rx="6"/>
  <text class="dg-label" x="180" y="180" text-anchor="middle" dominant-baseline="central">本地 agent</text>
  <text class="dg-sub" x="180" y="200" text-anchor="middle" dominant-baseline="central">規劃、呼叫工具、沙盒</text>

  <rect class="dg-box dg-box--store" x="92" y="252" width="176" height="48" rx="6"/>
  <text class="dg-label" x="180" y="268" text-anchor="middle" dominant-baseline="central">檔案與 Mac app</text>
  <text class="dg-sub" x="180" y="288" text-anchor="middle" dominant-baseline="central">Notes・Mail・Numbers</text>

  <rect class="dg-box dg-box--link" x="448" y="72" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="92" text-anchor="middle" dominant-baseline="central">雲端前沿模型</text>
  <text class="dg-sub" x="534" y="112" text-anchor="middle" dominant-baseline="central">15+ 個・需你授權</text>

  <rect class="dg-box dg-box--link" x="448" y="160" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="180" text-anchor="middle" dominant-baseline="central">網頁與連線 app</text>
  <text class="dg-sub" x="534" y="200" text-anchor="middle" dominant-baseline="central">即時資訊・需你授權</text>

  <rect class="dg-box dg-box--link" x="448" y="248" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="268" text-anchor="middle" dominant-baseline="central">App 自家服務</text>
  <text class="dg-sub" x="534" y="288" text-anchor="middle" dominant-baseline="central">寄信、傳訊息要連網</text>

  <line class="dg-rule" x1="20" y1="344" x2="620" y2="344"/>
  <text class="dg-tag" x="20" y="368" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--link" x="72" y="360" width="16" height="16" rx="3"/>
  <text class="dg-small" x="96" y="368" dominant-baseline="central">Mac 以外的服務</text>
  <path class="dg-line dg-line--link dg-line--dashed" d="M236 368H268" marker-end="url(#arrow-link)"/>
  <text class="dg-small" x="280" y="368" dominant-baseline="central">離開 Mac 的路徑</text>
</svg>
```

「完全本地」說的是 AI 在哪裡跑，不是整個任務都不碰網路。產品頁寫明：傳訊息或會議邀請，仍然會用該 app 的服務。實際使用時有幾件事要先知道：

- **雲端是你授權後才開的門。** 即時資訊、瀏覽器、連線 app 需要授權；本地 agent 也能呼叫 15 個以上的前沿模型，那一步的內容會送到雲端。
- **離線能不能跑，看任務。** 9to5Mac 和 MacStories 都報導無網路也能完成任務；Perplexity 自己的公告強調的是資料不送雲端，沒有用「離線」一詞。
- **36GB 是建議，不是下限。** 官方沒有說明這個數字怎麼來的，也沒有公布本地模型與雲端模型的能力比較。
- **權限細節沒有展開。** 沙盒與存取控制，官方只用一段話描述；macOS 的完整磁碟存取之類是否需要，[Particle 的整理](https://particle.news/story/perplexitys-computer-can-run-fully-locally-on-apple-silicon-macs)提到官方沒有說清楚。

## 怎麼用：先試，再決定要不要換機

1. 到「關於這台 Mac」確認晶片與記憶體。
2. 依記憶體分流：
   - **36GB 以上**：直接試完全本地。
   - **24 到 32GB**：先用 Hybrid；想試完全本地也可以，但低於建議值，速度與穩定度要自己觀察。
   - **低於 24GB**：連 Hybrid 的最低門檻都沒到，繼續用雲端版 Computer。
3. 第一個任務挑只用 Notes 的，開飛航模式跑一次。能做完，代表這類任務不靠雲端。
4. 授權範圍從單一 app、單一資料夾開始，用得順再放大。
5. 要不要為它換機：不必為這一個功能單獨換。本來就要換的話，記憶體至少挑 36GB 那一檔。[AppleInsider](https://appleinsider.com/articles/26/10/20/perplexity-computer-can-run-completely-local-on-mac-with-a-big-caveat) 整理的配置是：M6 Mac mini 最高 32GB，達不到建議值；M5 Pro Mac mini 要選 48GB 或 64GB；M5 Max Mac Studio 起跳就是 36GB。

## 參考資料

- [Perplexity Computer now runs fully local on Mac](https://www.perplexity.ai/hub/blog/perplexity-computer-now-runs-fully-local-on-mac)：官方公告，2026-10-20
- [Run Computer locally on your Mac](https://www.perplexity.ai/hub/products/hybrid-compute)：官方產品頁，兩種模式與記憶體建議
- [Introducing Hybrid Compute on Mac](https://www.perplexity.ai/hub/blog/introducing-hybrid-compute-on-mac)：Hybrid 公告，2026-09-01
- [Perplexity's Computer can now run entirely on your Mac, even offline](https://9to5mac.com/2026/10/20/perplexitys-computer-can-now-run-entirely-on-your-mac-even-offline/)：9to5Mac
- [Perplexity Computer's Local-First Approach to Agents](https://www.macstories.net/news/perplexity-computers-local-first-approach-to-agents/)：MacStories
- [Perplexity computer now runs on Mac with 36GB memory catch](https://appleinsider.com/articles/26/10/20/perplexity-computer-can-run-completely-local-on-mac-with-a-big-caveat)：AppleInsider，Mac 記憶體配置
- [Perplexity Adds Fully Local Computer Agent for Apple Silicon Macs](https://www.tao.media/perplexity-adds-fully-local-computer-agent-for-apple-silicon-macs/)：整理 Perplexity 的 X 串文（本地任務不消耗 credits）
- [Perplexity's Computer can run fully locally on Apple silicon Macs](https://particle.news/story/perplexitys-computer-can-run-fully-locally-on-apple-silicon-macs)：Particle
