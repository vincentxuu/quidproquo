---
title: "常駐型 AI agent 是什麼：四個條件、四條路線、台灣現在用得到哪些"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, personal-agent, always-on-agent, proactive-agent]
lang: zh-TW
tldr: "常駐型 agent 要同時做到四件事：你不在時繼續跑、醒來後自己決定做什麼、跨對話記得你的目標、能代你寄信付款。台灣現在用得到的是 Tasks in Gemini（要 AI Pro）、OpenAI Dots（Pro 與逐步開放的部分 Plus）、Grok Bot（X Subscription）與自架的 OpenClaw、Hermes；Claude Duet 還只在美國，Muse 開放美、加、日、新加坡，還沒到台灣。"
description: "2026 年 5 到 11 月出現的一批常駐型 AI agent：怎麼判斷一個產品算不算、依「它在哪台電腦上跑」分成哪四條路線、各有哪些代表產品，以及台灣讀者現在能用哪些。"
series:
  name: "常駐型 AI agent"
  order: 0
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-always-on-agents-overview-en)

週一早上七點，你還沒起床。聊天機器人什麼都沒做，因為沒人問它。另一種 agent 已經讀過你的信箱和行事曆，發現十點的會議和一封「改到十點半」的信衝突，草擬好一封回信，等你醒來按下送出。

第二種就是這個系列要談的常駐型 agent。2026 年 5 月到 11 月，Google、xAI、Meta、OpenAI、Anthropic、Cognition、微軟先後推出這類產品；開源的 [OpenClaw](https://github.com/openclaw/openclaw) 和 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 更早就在做。它們的共同點是有自己的電腦、關掉 app 還在跑、會在沒人叫的時候自己找事做。

這篇是系列入口：先講怎麼判斷一個產品算不算常駐型，再用一張地圖把二十幾個產品分成四條路線，最後是台灣讀者現在用得到哪些。

## 怎麼判斷一個產品算不算

各家用詞都不一樣：OpenAI 說 always-on agent，Anthropic 說 proactive agent，xAI 說 AI teammate，Meta 和 Google 說 personal AI agent，Cognition 說 persistent agent，微軟乾脆叫 Autopilot。名字靠不住，要看它做到哪幾件事。這個系列用四個條件：

1. **你不在時繼續跑。** 它跑在廠商的雲端電腦，或一台你讓它常開的機器上，你闔上筆電、鎖上手機都不會停。
2. **醒來後自己決定做什麼。** 它會在沒人傳訊息時自己開始一輪工作，而且醒來後是看著你的目標和資料判斷「現在有什麼要處理」，不是只照你事先寫好的一段提示執行。
3. **跨對話記得你的目標。** 你上週說過的偏好、交辦過的長期目標，下次醒來還在。
4. **能代你對外做事。** 寄信、付款、改資料、開 PR，通常在這類動作前停下來問你。

第 2 條最容易混淆，也是這個系列最重視的一條。拿它可以切開三種相鄰的東西：

- **聊天機器人**：你問它才答，關掉視窗就停。四條一條都沒有。
- **一次性的 agent 模式**：你交一個任務，它在雲端跑幾分鐘到幾小時，做完就結束。有第 1、4 條，沒有第 2、3 條。
- **排程自動化**：到點就跑你寫好的那段提示。[Mistral Vibe 的排程任務](https://docs.mistral.ai/vibe/work/scheduled-tasks)目前只能按時間觸發，跑完一定把結果送回側欄；[豆包工作的自動任務](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks)也是照預設時間執行、完成後推送通知。這類工具做到第 1、3、4 條，但醒來做什麼完全由你寫死，沒事也不會安靜。

差別在哪一步、為什麼「沒事能不說話」這麼重要，下一篇〈零件與三級階梯〉會拆開講。

## 半年內出現了哪些

```diagram
title: 2026 年常駐型 agent 的主要發表
desc: Google 在 5 月最早推出 Gemini Spark，8 到 10 月 xAI、Meta、OpenAI、Anthropic 接連推出，11 月 17 日同一天有 Cognition、微軟、Google 三家的新動作。
caption: 只標出系列有專篇的主要個人與企業產品；開源的 OpenClaw、Hermes 在這之前就已推出。
---
<svg viewBox="0 0 640 296">
  <path class="dg-axis" d="M40 128H616"/>
  <path class="dg-axis" d="M64 128V134M142 128V134M217 128V134M295 128V134M373 128V134M449 128V134M527 128V134"/>
  <text class="dg-small" x="68" y="148" dominant-baseline="central">5</text>
  <text class="dg-small" x="146" y="148" dominant-baseline="central">6</text>
  <text class="dg-small" x="221" y="148" dominant-baseline="central">7</text>
  <text class="dg-small" x="299" y="148" dominant-baseline="central">8</text>
  <text class="dg-small" x="377" y="148" dominant-baseline="central">9</text>
  <text class="dg-small" x="453" y="148" dominant-baseline="central">10</text>
  <text class="dg-small" x="531" y="148" dominant-baseline="central">11</text>
  <text class="dg-small" x="604" y="148" text-anchor="middle" dominant-baseline="central">月</text>

  <line class="dg-rule" x1="109" y1="80" x2="109" y2="122"/>
  <circle class="dg-dot dg-dot--accent" cx="109" cy="128" r="6"/>
  <text class="dg-label" x="109" y="44" text-anchor="middle" dominant-baseline="central">Gemini Spark</text>
  <text class="dg-sub" x="109" y="66" text-anchor="middle" dominant-baseline="central">Google・5/19</text>

  <line class="dg-rule" x1="321" y1="134" x2="321" y2="180"/>
  <circle class="dg-dot" cx="321" cy="128" r="4"/>
  <text class="dg-label" x="321" y="196" text-anchor="middle" dominant-baseline="central">Grok Bot</text>
  <text class="dg-sub" x="321" y="218" text-anchor="middle" dominant-baseline="central">xAI・8/11</text>

  <line class="dg-rule" x1="391" y1="80" x2="391" y2="122"/>
  <circle class="dg-dot" cx="391" cy="128" r="4"/>
  <text class="dg-label" x="391" y="44" text-anchor="middle" dominant-baseline="central">Muse</text>
  <text class="dg-sub" x="391" y="66" text-anchor="middle" dominant-baseline="central">Meta・9/8</text>

  <line class="dg-rule" x1="444" y1="134" x2="444" y2="180"/>
  <circle class="dg-dot" cx="444" cy="128" r="4"/>
  <text class="dg-label" x="444" y="196" text-anchor="middle" dominant-baseline="central">Dots</text>
  <text class="dg-sub" x="444" y="218" text-anchor="middle" dominant-baseline="central">OpenAI・9/29</text>

  <line class="dg-rule" x1="499" y1="80" x2="499" y2="122"/>
  <circle class="dg-dot" cx="499" cy="128" r="4"/>
  <text class="dg-label" x="499" y="44" text-anchor="middle" dominant-baseline="central">Claude Duet</text>
  <text class="dg-sub" x="499" y="66" text-anchor="middle" dominant-baseline="central">Anthropic・10/21</text>

  <line class="dg-rule" x1="567" y1="134" x2="567" y2="180"/>
  <circle class="dg-dot dg-dot--accent" cx="567" cy="128" r="6"/>
  <text class="dg-label" x="567" y="196" text-anchor="middle" dominant-baseline="central">11/17 同一天</text>
  <text class="dg-sub" x="567" y="218" text-anchor="middle" dominant-baseline="central">Devin Bots</text>
  <text class="dg-sub" x="567" y="238" text-anchor="middle" dominant-baseline="central">Autopilot</text>
  <text class="dg-sub" x="567" y="258" text-anchor="middle" dominant-baseline="central">Gemini Tasks</text>
</svg>
```

最早的是 Google。[2026 年 5 月 19 日的 I/O](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/) 推出 Gemini Spark，強調「關掉筆電、鎖上手機也在背景工作」；8 月到 10 月，xAI 的 [Grok Bot](https://docs.x.ai/grok-bot/bots)、Meta 的 [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)、OpenAI 的 [Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)、Anthropic 的 [Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) 一個接一個上線。

11 月 17 日同一天又有三件事：Cognition 推出替工程團隊扛長期責任的 [Devin Bots](https://devin.ai/blog/introducing-devin-bots)，微軟的 [Autopilot](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/) 開始對 Frontier 企業客戶推出，Google 則把 Spark 改名 [Tasks in Gemini](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)，在美、日、韓、加、澳、印六國免費開放。

## 前身：只會提醒、不會動手的那十年

「不等你開口」不是 2026 年才有的想法。

- **Google Now（2012）**：[Google 在 2012 年 I/O 推出](https://android.googleblog.com/2012/)，說它「gets you just the right information at just the right time」。它用你的搜尋紀錄、位置紀錄和行事曆，推算你什麼時候需要什麼：出門前告訴你路況、航班延誤時通知你，以卡片的形式自己跳出來。2017 年 Google Now 這個名字收掉，改成 Google Feed，[2018 年再改名 Discover](https://blog.google/products-and-platforms/products/search/introducing-google-discover/)，變成一條個人化的內容動態。
- **iOS 9 的主動建議（2015）**：[Apple 在 iOS 9 加入 proactive assistance](https://www.apple.com/newsroom/2015/06/08Apple-Previews-iOS-9/)。它依使用習慣建議要開的 app 和要聯絡的人，也依路況提醒你何時該出發去赴約。Apple 強調這些都在裝置上處理，不上雲端。

拿四個條件來看，它們在背景跑、也記得你的習慣，但只做到「提醒」：最後一步一定是你自己按。2026 年這一批的差別在第四個條件：它們會代你對外做事，寄信、下單、改設定。這也是為什麼審批、憑證這些問題，到現在才變成主角。

## 四條路線：看它在哪台電腦上跑

產品很多，但讀者真正要做的決定是：**這個 agent 跑在誰的電腦上，誰替它負責。** 依這點分成四條路線：

| 路線 | 它跑在哪 | 誰管 | 代表產品 |
|---|---|---|---|
| 一、廠商替你開一台雲端電腦（個人用） | 廠商的雲端 VM | 廠商管電腦，你管授權 | Tasks in Gemini、Muse、Hark Pro、Instinct、Claude Duet、OpenAI Dots、Grok Bot |
| 二、替團隊與企業做事 | 廠商雲端或公司租戶 | 團隊或 IT 設權限、身分與稽核 | Devin Bots、Perplexity teammates、Microsoft Autopilot、Salesforce long-horizon agents、OpenClaw Enterprise |
| 三、跑在你自己的機器上 | 你的筆電、常開主機或 VPS | 你自己 | OpenClaw、Hermes Agent 等開源專案；中國的 Kimi Claw、QClaw、AutoClaw 等「Claw 家族」 |
| 四、住進你已經在用的 app | 超級 app 的後台 | 平台 | LINE、KakaoTalk、Naver（多數還在預告或封測） |

四條路線的取捨很不一樣。路線一最省事，但電腦、模型、審批都在廠商手上；路線二多了一層「agent 出事誰負責」的組織問題，所以微軟給每個 Autopilot 一個自己的身分和一位具名的負責人；路線三什麼都能改，代價是安全和維運都要自己扛；路線四不用另外開一台電腦，平台本來就有你的聊天紀錄和付款方式，這是便利，也是隱私問題的來源。

系列接下來就照這四條路線走，每條路線底下一個產品一篇；核心設計相同、只差在包裝的產品，例如中國的 Claw 家族，放在同一篇的對照表裡。

## 相鄰但這個系列不收的

有些產品常和上面這些放在一起比較，但按四個條件不算常駐型：

- **Mistral Vibe、豆包工作的排程**：前面提過，醒來做什麼由你寫死，沒事也照樣送出結果。下一篇會拿它們當對照。
- **一次性的雲端 agent**：交一個任務、做完就結束的產品，沒有第 2、3 條。

它們不比較差，只是解決的問題不同。你的需求如果是「每週一早上整理一份固定格式的週報」，排程自動化反而更可預期。

## 台灣現在用得到哪些

只寫能、不能、有條件；方案、價格與怎麼申請放在系列最後一篇〈[從唯讀開始](/posts/ai/2026-11-20-start-read-only)〉，那是會常變動的部分，只維護一處。

| 產品 | 台灣 | 條件 |
|---|---|---|
| Tasks in Gemini | 有條件 | 要 Google AI Pro 或 Ultra；[說明頁](https://support.google.com/gemini/answer/17094710?hl=en)只排除歐洲經濟區、奈及利亞、瑞士、英國，免費開放的六國不含台灣 |
| OpenAI Dots | 有條件 | ChatGPT Pro，或逐步開放中的部分 Plus 帳號；排除歐洲經濟區、瑞士、英國 |
| Grok Bot | 有條件 | X Subscription 的 Premium 以上；官方文件沒有列地區限制 |
| Meta Muse | 不能 | 開放美國、加拿大、[日本](https://k-tai.watch.impress.co.jp/docs/news/2150682.html)、[新加坡](https://about.fb.com/news/2026/10/muse-is-now-available-in-singapore-the-worlds-first-personal-ai-agent-built-for-everyone/)，台灣還沒有 |
| Hark Pro | 有條件 | [台灣 App Store 有上架](https://apps.apple.com/tw/app/hark-pro/id6772362941)、有新台幣方案；官方示範幾乎都是美國網站，沒有公布支援國家 |
| Claude Duet | 不能 | 研究預覽只開放美國帳號，採候補名單 |
| OpenClaw、Hermes Agent | 能 | 開源，自己裝；模型費用自付 |
| LINE | 還沒有 | [LINE 台灣](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html)預告 2027 年第一季推出官方帳號 AI 代理平台，購物與送禮助手也在 2027 年 |

團隊與企業用的產品（Devin Bots、Autopilot 等）看公司的合約和方案，不在這張表裡。

## 讀這個系列之前要知道的限制

- **以美國產品為主。** 路線一、二幾乎都是美國公司；中國和日韓的產品分別在路線三、四各一篇，但讀到的一手資料比美國產品少。
- **產品都很新。** 這些產品上線大多不到半年，沒有長期使用的研究；文中的判斷都是「截至 2026 年 11 月」。
- **證據大多是廠商自己說的。** 獨立證據只有幾篇記者實測、一家 benchmark 公司、幾篇學術評測，而且學術評測測的是模型配研究者自己的 agent，不是這些商品。各篇會把廠商數字標成廠商自報。
- **系列寫到 2026 年 11 月為止。** 之後的新產品，會先放進對應路線篇的對照表，帶來新的設計取捨才另寫一篇。

## 這個系列怎麼讀

- **從頭讀**：先讀下一篇〈零件與三級階梯〉，它會讓後面每篇產品文都看得懂「它醒來做什麼」。
- **只讀一條路線**：例如只想自架，讀第三條路線的兩篇加上〈[從唯讀開始](/posts/ai/2026-11-20-start-read-only)〉。
- **只查一個產品**：每篇產品文開頭都有一張小表，標出它符合四個條件裡的哪幾條。

已經寫好的安全專文〈[個人 AI 助理怎麼選：代管的 Duet、Muse、Dots、Grok Bot，對上自架的 OpenClaw、Hermes](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)〉會收進系列，放在共通問題那一段：用一封釣魚信，看它在電腦、憑證、審批、資料、模型五層各會被誰擋下。

## 更新紀錄

- 2026-11-23：新增「前身」一節（Google Now、iOS 9 主動建議），說明它們跟 2026 年這批差在會不會代你動手。
- 2026-11-20：修正 Muse 的開放地區（美、加、日、新加坡，原寫只在美國）；台灣可用性表補上 Hark Pro。

## 參考資料

- [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)（Google，2026-05-19）
- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)（Google，2026-11-17）
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en)（Gemini Apps Help）
- [Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)（Meta，2026-09-08）
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)（OpenAI Help Center）
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)（Claude Help Center）
- [Create and manage Bots](https://docs.x.ai/grok-bot/bots)、[Grok Bot FAQ](https://docs.x.ai/grok-bot/faq)（SpaceXSI Docs）
- [Introducing Devin Bots: from tasks to outcomes](https://devin.ai/blog/introducing-devin-bots)（Cognition，2026-11-17）
- [Copilot at Microsoft Ignite](https://www.microsoft.com/en-us/copilot/blog/2026/11/17/copilot-at-microsoft-ignite-expanding-whats-possible-with-intelligence-built-for-work/)（Microsoft，2026-11-17）
- [Schedule tasks](https://docs.mistral.ai/vibe/work/scheduled-tasks)（Mistral Docs）
- [使用自动任务模式](https://www.doubao.com/work/docs/zh-cn/articles/340417925583-auto-tasks)（豆包工作幫助中心，簡體中文）
- [科技巨擘掀代理式AI大戰　競逐全天候個人助理](https://www.cna.com.tw/news/ait/202609270039.aspx)（中央社，2026-09-27）
- [LINE Taiwan "LINE CONVERGE 2026" Report](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html)（LY Corporation，2026-11-13）
- [openclaw/openclaw](https://github.com/openclaw/openclaw)、[NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)（GitHub）
- [Android @ I/O: the playground is open](https://android.googleblog.com/2012/)（Official Android Blog，2012-06-27）
- [Apple Previews iOS 9](https://www.apple.com/newsroom/2015/06/08Apple-Previews-iOS-9/)（Apple，2015-06-08）
- [Introducing Google Discover](https://blog.google/products-and-platforms/products/search/introducing-google-discover/)（Google，2018-09-24）
