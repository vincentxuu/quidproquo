---
title: "常駐型 agent 怎麼自己醒來：時鐘、條件觸發、自主巡檢三級，以及它的電腦和記憶"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, proactive-agent, openclaw, hermes-agent]
lang: zh-TW
tldr: "常駐型 agent 醒來的方式分三級：照時鐘跑你寫好的問題（Mistral Vibe、豆包工作）、照你設的條件觸發（Gemini 的 Gmail 與主題監控）、依你的脈絡定期問「有什麼要處理」且沒事就不說話（OpenClaw 的 Proactive check、Claude Duet 的巡檢）。判斷一個產品在哪一級，看四件事：問題誰寫、問題開不開放、醒來時有沒有你的記憶、沒事能不能保持安靜。"
description: "拆開常駐型 agent 的零件：三種觸發與三級階梯、各家怎麼做、為什麼要有自己的電腦、結果送到哪、記憶看不看得到，以及打開設定頁時該先找哪三個開關。"
series:
  name: "常駐型 AI agent"
  order: 1
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-20-always-on-agent-anatomy-en)

假設你想要一件事：「信用卡帳單有怪東西就告訴我。」交給三種 agent，會得到三種完全不同的行為。

- 第一種：你寫一段提示「每天早上九點讀信用卡帳單，列出所有扣款」，它每天九點把整份清單送給你，不管有沒有異常。
- 第二種：你設一個條件「收到銀行寄來的帳單信時」，它在信到的時候跑一次，幫你看有沒有異常。
- 第三種：你只說過一次「我很在意不明扣款」，它每隔一段時間醒來，看看你的信箱、帳單和最近的對話，發現一筆沒見過的訂閱費才來找你；什麼都沒發現就不吵你。

三種都「關掉 app 還在跑」，差別在醒來之後誰決定做什麼。[上一篇總覽](/posts/ai/2026-11-20-always-on-agents-overview)把第 2 條定義寫成「醒來後自己決定做什麼」，這篇把它拆開：一輪工作怎麼開始、三級階梯怎麼分、它醒來時在哪台電腦上、結果送去哪、記得什麼。

## 一輪工作是怎麼開始的

聊天機器人只有一種開始方式：你傳訊息。常駐型 agent 多了三種不需要你開口的方式。Pinggy 在 2026 年 10 月底實測六個產品後，把它們整理成三類（[Pinggy 比較文](https://pinggy.io/blog/proactive_ai_agents_compared/)）：

- **時鐘**：到某個時間點就跑，例如每天早上 8 點。
- **事件**：外部發生了某件事就跑，例如收到某類郵件、GitHub 開了新 issue、有人在 Slack 提到它。
- **自己醒來**：agent 自己決定什麼時候再看一次，或定期跑一輪「有什麼需要處理嗎」。

同一篇比較文點出一個關鍵：自己醒來這招，**只有在 agent 可以什麼都不說的時候才有用**。每 30 分鐘醒來一次、每次都傳一則「目前沒事」，一天就是 48 則廢話，使用者很快會把通知關掉。

## 三級階梯

```diagram
title: 常駐型 agent 醒來的三個等級
desc: 由下往上，第一級照時鐘跑你寫好的問題並一律回報，第二級在你設定的條件成立時才跑，第三級帶著你的脈絡定期巡檢、自己判斷要不要找你，沒事就保持安靜。
caption: 一個產品可以同時有好幾級，例如 Gemini 同時有時鐘與條件觸發；這裡依它最高能做到哪一級分。
---
<svg viewBox="0 0 640 296">
  <path class="dg-axis" d="M36 256V48" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">AGENT 決定</text>
  <text class="dg-tag" x="36" y="276" text-anchor="middle" dominant-baseline="central">你決定</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="88" rx="6"/>
  <text class="dg-tag" x="92" y="68" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="44" dominant-baseline="central">帶著你的脈絡巡檢，沒事就不說話</text>
  <text class="dg-sub" x="124" y="68" dominant-baseline="central">問題是開放的：「有什麼要處理？」</text>
  <text class="dg-sub" x="124" y="90" dominant-baseline="central">OpenClaw Proactive check、Claude Duet、Dots</text>

  <rect class="dg-box" x="72" y="120" width="552" height="64" rx="6"/>
  <text class="dg-tag" x="92" y="152" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="140" dominant-baseline="central">你設的條件成立才跑</text>
  <text class="dg-sub" x="124" y="164" dominant-baseline="central">Gemini 的 Gmail／主題監控、Hermes 的 webhook</text>

  <rect class="dg-box" x="72" y="192" width="552" height="64" rx="6"/>
  <text class="dg-tag" x="92" y="224" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="212" dominant-baseline="central">照時鐘跑你寫好的問題，一律回報</text>
  <text class="dg-sub" x="124" y="236" dominant-baseline="central">Mistral Vibe 排程任務、豆包工作自動任務</text>
</svg>
```

### L1：照時鐘跑你寫好的問題

[Mistral Vibe 的排程任務](https://docs.mistral.ai/vibe/work/scheduled-tasks)可以設成一次、每天、每週、每月、每年，到點就把你寫的那段提示拿來執行；文件寫明目前只能按時間觸發，事件觸發「之後可能會加」。跑完的結果一律出現在側欄、標一個未讀點。[豆包工作的自動任務](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks)也一樣：依預設時間執行，完成後推送結果通知，雲電腦模式下你的電腦關機也照跑。

這一級的好處是可預期：你知道它幾點跑、跑什麼、會交回什麼。代價是你沒寫到的事，它不會去看。

### L2：你設的條件成立才跑

[Tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en) 有三種排程：時間、Gmail 監控（收到符合篩選條件的信時跑）、主題監控（新聞、財經、體育、在地活動出現特定事件時跑）。Google 的說明頁把分工寫得很直白：「You tell Gemini what to do and when to do it.」也就是做什麼、什麼時候做，都由你說。

說明頁也寫了這一級的限制：監控「不適合追蹤變化很快的資料，或時間緊迫的任務」，排程的執行時間是「大約」，流量高時可能延遲。

Hermes Agent 的 [webhook](https://pinggy.io/blog/proactive_ai_agents_compared/) 屬於同一級：GitHub 開了新 issue，就把 issue 內容套進你寫好的提示跑一次。

### L3：帶著你的脈絡巡檢，沒事就不說話

這一級的問題是開放的。agent 收到的提示是「看看有什麼需要你處理」，要看哪些資料、要不要找你，由它自己判斷。

- **OpenClaw**：第一次設定時會建立一個 [Proactive check](https://docs.openclaw.ai/gateway/heartbeat)，預設每 30 分鐘跑一次，用的是你和 agent 的主對話，只在 agent 閒著時跑，結果送到你的私訊；沒有需要注意的事就回 `NO_REPLY`，不送出任何訊息。這個機制以前叫 heartbeat，現在併進一般的自動化工作，你可以改頻率、改提示，或整個刪掉。
- **Claude Duet**：[每天早上](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)看過你的信箱和行事曆，挑出最需要你注意的事；白天會跟進已經沉寂的討論串，並以固定間隔檢查你連接的帳號。主對話只在任務完成或需要你決定時才出聲。
- **OpenAI Dots**：沒有你直接交辦時，它會在背景做「[主動研究](https://learn.chatgpt.com/docs/dots/controls)」，看你連接的 app 找可以幫忙的地方，還會從中形成記憶。這時它只能用唯讀工具：不能寄訊息、不能改 app 內容、不能控制瀏覽器或電腦。
- **Grok Bot**：每個帳號有一個[主 bot](https://docs.x.ai/grok-bot/bots)，它會自己找你 check in，並協調其他 bot 的工作。

Dots 再往上走了一步：Pinggy 的整理指出，dot 會自己決定什麼時候暫停、什麼時候再回來看，所以後續追蹤不需要固定排程。也就是連「多久醒一次」都交給 agent 決定。

## 階梯分的不是產品，是你給它的問題

看到這裡會有一個疑問：如果我在 L1 的工具裡寫一段開放的提示，例如「看看我的信箱和行事曆，只告訴我今天需要我決定的事；沒有的話就不要回報」，它不就變成 L3 了嗎？

Pinggy 實際在 Hermes Agent 上這樣做過：Hermes 的排程任務只要最後的回應裡含 `[SILENT]`，就不會送出任何訊息（[Hermes cron 文件](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)）。於是一個「每個工作日早上 8 點檢查信箱，沒事就回 `[SILENT]`」的任務，行為上已經很接近 L3。

差別在脈絡。Hermes 的文件寫明，排程任務跑在**全新的 session**，不帶任何對話歷史，所以提示要寫得完全自足；但長期記憶（`MEMORY.md`、`USER.md`）會照常載入（[cron 運作原理](https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals)）。所以你如果讓它記過「我很在意不明扣款」，排程醒來時它知道；你上週只在聊天裡順口提過、沒存進記憶的，它不知道。官方指南也提醒，工作上非知道不可的細節，要寫進提示，不要靠記憶。

所以要判斷一個產品（或你自己設的一個任務）在哪一級，看四件事：

| 問題 | L1 | L2 | L3 |
|---|---|---|---|
| 問題是誰寫的 | 你 | 你 | 產品預設，你可以改 |
| 問題開放還是固定 | 固定 | 固定 | 開放 |
| 醒來時有沒有你的脈絡 | 只有提示裡寫的 | 提示加上觸發的事件 | 主對話、記憶、連接的資料 |
| 沒事能不能保持安靜 | 多半不能 | 看產品 | 能 |

Mistral Vibe 和豆包工作卡在最後一列：跑完一定交回結果，就算你把提示寫成開放的，它也會每次回報。Hermes 不一樣：寫一個開放的提示、讓它沒事回 `[SILENT]`、再加上會載入的長期記憶，你可以自己組出一個接近 L3 的任務，差的是它不帶主對話，而且要你自己設。OpenClaw 的 Proactive check 是產品預設就幫你設好、用的又是主對話，所以四列都做到，雖然它底層其實也是一個排程。

這也是為什麼總覽說排程自動化「不比較差」。L3 的開放問題和記憶，換來的是你比較難預測它這次會做什麼；這個代價在〈主動過頭〉那篇會看到實例。

## 它在哪台電腦上醒來

「關掉 app 還在跑」的前提，是 agent 醒來時有一台開著的電腦。

- **廠商的雲端電腦**：Gemini 說明頁寫，Gemini 在雲端跑，不在你的手機或電腦上，所以你的裝置關機它照樣工作。Grok Bot 的 [FAQ](https://docs.x.ai/grok-bot/faq) 也寫，關掉 app、筆電或手機，都不會中斷背景工作和例行任務。
- **你自己的機器**：OpenClaw 的 Gateway 跑在你的機器上，Pinggy 的實測寫得很直接：Gateway 停了，什麼排程都不會觸發。Hermes 也是，`hermes gateway run` 沒在跑，排程就不會動。所以自架等於要有一台常開的主機或 VPS。
- **兩者混用**：Dots 有自己的雲端電腦，也可以選擇連到你的電腦，[預設關閉](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)；連了之後，你的電腦要保持上線、ChatGPT app 要開著。

雲端電腦的另一個作用是隔離：agent 在那台電腦上開瀏覽器、裝工具、跑程式碼，碰不到你筆電上的檔案。但隔離的範圍各家不同。Grok Bot 的 FAQ 寫明，同一個帳號的所有 bot 共用一台電腦，共享檔案、瀏覽器登入狀態和 app 登入，「不要把不同的 bot 當成安全邊界」。這在路線一的 Grok Bot 篇會再展開。

## 醒來之後，結果送到哪

常駐型 agent 會在你不在的時候做很多事，所以每家都有一個「收件匣」，讓你回來時一眼看到該處理什麼：

- **Dots**：桌面版的個人檔案裡有 Activity（進行中的工作，含背景工作）和 Scheduled（排程任務）；在等你決定、登入或核准的任務會標出來。
- **Claude Duet**：Tasks 分頁列出進行中的工作並標出需要你輸入的；主對話保持安靜，只在任務完成或需要決定時出聲。它可以建議某個任務看起來完成了，但只有你能把任務標成完成。
- **Gemini**：Scheduled 頁面分成進行中、暫停、已完成。
- **OpenClaw**：Proactive check 的結果送到擁有者的私訊；沒事就 `NO_REPLY`，不留訊息。

找到這個收件匣，是使用任何一個常駐型 agent 的第一步：它是你唯一能看到「它在你不在時做了什麼」的地方。

## 它記得什麼，你看得到嗎

第 3 條定義（跨對話記得你的目標）在各家的實作差很多，而且直接影響你能不能管住它：

- **Grok Bot**：bot [自己決定](https://docs.x.ai/grok-bot/bots)什麼值得記，不會先問你，也不一定在對話裡提到；個人 bot 沒有記憶頁面，要看、要改、要刪，都得在對話裡問它。官方文件還特別提醒：記憶不能當成事實來源，重要的決定要叫它回去看原始資料。
- **Dots**：會從 ChatGPT 的記憶開始，也會從你連接的 app 主動形成自己的記憶；[想刪掉 dot 自己存的記憶](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)，只能把整個 dot 刪掉。中斷某個 app 的連接，也不會刪掉它已經從那個 app 拿到的資訊。
- **Claude Duet**：沿用你 Claude 帳號的記憶、技能和連接器；中斷某個 app 後，它從那個 app 得到的舊資訊仍會留在記憶裡。

三家都有同一個現象：你中斷連接或刪掉對話，**已經進到記憶裡的東西不會跟著消失**。

## 打開設定頁時，先找這三個開關

不管你用哪一家，第一次打開設定都先找這三樣：

1. **背景會讀什麼。** 它在沒人叫時會碰哪些 app？Dots 的主動研究會讀所有連接的 app（企業版管理員不能單獨關掉這項）；Duet 的巡檢會讀你連接的帳號，而且背景工作計入你的方案用量。
2. **它在哪一級醒來，多久醒一次。** 有沒有 L3 的巡檢？間隔多久？Duet 的說明頁寫，它是按固定間隔檢查，所以緊急的事可能在兩次檢查之間進來。OpenClaw 的 Proactive check 可以改頻率、改成只在活躍時段跑，或刪掉。
3. **收件匣在哪。** 找到能看到「它做過什麼、在等你什麼」的那一頁，加進書籤。

自我檢查：Dots 在背景做主動研究時，發現一封該回的信，它能直接回嗎？不能。主動研究只用唯讀工具；要回信，得是你交辦的工作，或你在自訂規則裡允許的動作，而且還要經過自動審查。

下一篇從路線一的邊界案例開始：[Tasks in Gemini](/posts/ai/2026-11-20-gemini-tasks) 為什麼停在 L2，而這對你來說可能剛好夠用。

## 參考資料

- [Proactive AI Agents Compared: Dots vs Muse vs Grok Bot vs Instinct vs Hermes vs OpenClaw](https://pinggy.io/blog/proactive_ai_agents_compared/)（Pinggy，2026-10-31）
- [Schedule tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks)（Mistral Docs）
- [使用自动任务模式](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks)（豆包工作幫助中心，簡體中文）
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en)（Gemini Apps Help）
- [Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)、[Cron Internals](https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals)、[Automate Anything with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron)（Hermes Agent Docs）
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat)、[Automation](https://docs.openclaw.ai/automation)（OpenClaw Docs）
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)（Claude Help Center）
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls)（ChatGPT Learn）
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)（OpenAI Help Center）
- [Create and manage Bots](https://docs.x.ai/grok-bot/bots)、[Grok Bot FAQ](https://docs.x.ai/grok-bot/faq)（SpaceXSI Docs）
- 站內：[OpenClaw 自動化（一）：六種機制怎麼選](/posts/ai/2026-03-28-openclaw-automation-cron-webhook)、[Hermes Agent 的 Gateway 與排程](/posts/ai/2026-08-18-hermes-agent-gateway-cron)
