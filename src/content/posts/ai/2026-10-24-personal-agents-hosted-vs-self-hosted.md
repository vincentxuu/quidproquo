---
title: "個人 AI 助理怎麼選：代管的 Duet、Muse、Dots、Grok Bot，對上自架的 OpenClaw、Hermes"
date: 2026-10-24
category: ai
type: deep-dive
tags: [ai-agent, personal-agent, openclaw, hermes-agent, security, self-hosted]
lang: zh-TW
tldr: "Duet、Muse、Dots、Grok Bot 和 OpenClaw、Hermes 都能在背景替你處理信件與帳號，差別在電腦、憑證、審批和資料由誰掌握。代管型省設定，但模型和資料政策由廠商決定；自架型可換模型、能看原始碼，但沙盒要自己開。"
description: "比較四個廠商代管的個人 AI 助理與兩個開源自架方案：執行環境、憑證、審批、資料去向、模型自由度，以及各家公開了多少可以檢查的安全資料。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted-en)

2026 年 8 月到 10 月，xAI、Meta、OpenAI、Anthropic 先後推出一種新產品：不等你開口、會在背景自己做事的個人 AI 助理。它們有自己的雲端電腦，碰得到你的信箱和行事曆，你關掉 app 之後還繼續跑。開源這邊的 OpenClaw 和 Hermes Agent 早就在做同一件事。這篇回答一個決定：這類助理該用廠商代管的，還是自己架？

## 六個助理各是什麼

| 助理 | 誰做的 | 怎麼用 | 費用與門檻（2026-10 查詢） |
|---|---|---|---|
| [Claude Duet](https://claude.com/resources/articles/claude-duet) | Anthropic | iOS、Android、claude.ai | 研究預覽，限美國 Pro／Max 候補，含在訂閱內 |
| [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) | Meta | App、WhatsApp | 有免費層與付費方案，目前以美國為主 |
| [Dots](https://openai.com/index/introducing-dots/) | OpenAI | ChatGPT、Slack | Pro 與 Business Premium 方案（[CBS](https://www.cbsnews.com/news/sam-altman-openai-dots-chatgpt-agents-safety/) 報導每月 100 美元起、20 美元）；第一個 Dot 含在方案內 |
| [Grok Bot](https://x.ai/bot) | xAI | 桌面、手機 | Premium 30、Super 100、Ultra 200 美元／月 |
| [OpenClaw](https://github.com/openclaw/openclaw) | 獨立基金會，MIT | 你自己的電腦，接 20 多個聊天頻道 | 軟體免費，模型 API 與主機自付 |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Nous Research，MIT | 終端機，接 Telegram、Discord 等 | 軟體免費，可選 Nous Portal 訂閱 |

前四個是代管型：你拿到 app，電腦、模型和審批都在廠商那邊。後兩個是自架型：程式在你手上，你決定它跑在哪。OpenClaw 和 Hermes 在站上各有一篇導讀，見〈[OpenClaw 文件導讀](/posts/ai/2026-03-28-openclaw-overview)〉和〈[Hermes Agent 導讀](/posts/ai/2026-08-18-hermes-agent-intro)〉。

對台灣讀者，第一個問題是用不用得到。Duet 目前限美國 Pro／Max 候補，Muse 以美國為主，Dots 只開放給官方所說的「合格市場」，註冊前先到各家說明頁確認你所在的地區有沒有開放。OpenClaw 和 Hermes 用安裝指令就能裝，沒有候補或地區名單。

## 五個該問的問題

### 1. 它在哪台電腦上跑

四個代管型都給你一台廠商的雲端電腦，你關機它照跑。Duet 是帶瀏覽器的虛擬機；Muse 是每人一台隔離的 Linux VM；Dots 有自己的雲端電腦，要用你的筆電得另外授權；Grok Bot 的電腦由 Cursor 營運，[安全文件](https://docs.x.ai/grok-bot/security)寫明不支援地端部署。

OpenClaw 和 Hermes 跑在你指定的機器。OpenClaw 的 Gateway 裝在筆電或常開主機上，狀態、記憶和憑證都留在那台。Hermes 的終端後端有本機、Docker、SSH、Modal 等六種，README 說一台 5 美元的 VPS 就能跑，內建排程，也能常駐。

所以「常駐在背景」不是代管型的專利，差別只在那台電腦是誰的。

### 2. 憑證在誰手上

代管型的共同做法是讓模型看不到密碼。Duet 照 [Managed Agents](https://www.anthropic.com/engineering/managed-agents) 的設計處理憑證；Muse 讓 agent 只拿到替身 token，真的憑證在網路出口才換上去；Dots 登入時暫停，由你在安全表單輸入；Grok Bot 的連接器 token 留在後端，登入、雙因素和付款時把電腦交還給你。

這些保護有範圍。Dots 的 [FAQ](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs) 寫明，不涵蓋你自己貼在對話或文件裡的密碼。

OpenClaw 的憑證放在你自己的機器上，受保護的秘密值用 handle 和出口代換處理。但主 session 的工具預設直接在主機上跑，要自己設沙盒才有隔離。

### 3. 誰決定一個動作能不能做

代管型都有「寄信、付款、刪除之前先問你」的預設，差別在誰把關。Muse 把審批交給與 agent 分開的 Sentinel，核准視窗不經過你和 Muse 的對話。Dots 和 Grok Bot 用獨立的審查模型（Auto-review）。Duet 沿用 Claude Code 的 [auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) 分類器。Dots 的自訂規則關不掉核心要求，改密碼和轉帳一定交還給你。

自架型這一層要自己顧。OpenClaw 的工具政策寫在程式碼裡，陌生寄件人預設要先配對；沙盒和執行核准預設是關的，官方說預設的 OpenClaw 是「受信任的單一操作者助理」。Hermes 的文件列有指令核准、DM 配對和容器隔離。

### 4. 資料會去哪裡

代管型的資料政策由廠商訂。

- **Muse**：Meta 在[安全設計文章](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)說不把對話交給廣告系統，但瀏覽行為仍可能間接影響你看到的廣告；互動軌跡去識別化後預設拿去訓練，要自己在設定關掉。目前的架構也不阻止 Meta 在必要時存取你的 VM，完全加密的 Confidential VM 預計今年稍後推出。
- **Dots**：依 [FAQ](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs)，個人方案由「Improve the model for everyone」開關決定是否用於改善模型；關掉之後，安全相關情況仍可能有人工審閱。你不能檢視或修改個別記憶，只能整個 Dot 刪掉。
- **Duet**：依[說明頁](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)，沿用你 Claude 帳號的記憶、技能和連接器，也能搜尋過去的對話，由「搜尋與參照對話」設定控制。
- **Grok Bot**：[文件](https://docs.x.ai/grok-bot/security)說隱私模式開啟時不拿資料訓練；模型由 Cursor 挑選，可能包含第三方模型。

OpenClaw 預設除了每日一次的版本檢查，不對外連線，提示詞只送給你設定的模型供應商。

### 5. 模型換得掉嗎

四個代管型各綁自家模型：Duet 建在 Claude Opus 5.5 上，Muse 用 Muse Spark，Dots 用 GPT-6 Astra，Grok Bot 沒有給使用者的模型選擇器。

OpenClaw 和 Hermes 都能換模型供應商。OpenClaw 還能把 Codex、Claude Code 這類廠商自己的 harness 當外掛接進來。自由的另一面是，模型本身的安全表現也跟著換，代管型那層由廠商做的防護要自己補。

## 公開了多少可以檢查的東西

安全承諾本身驗證不了，能驗證的是對方公開了什麼。

OpenAI 在 Dots 的[系統卡附錄](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2)寫出自己做的測試設計和結果：批次攻擊的 16,600 封攻擊信沒有計分的成功；任務進行到一半被撤掉權限的測試，49 次通過 45 次。同一份文件也承認有中等程度的越界，並說已知漏洞仍在處理。

Meta 的[安全設計文章](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)公開的架構最詳細：隔離容器、Sentinel、替身 token。它沒有給攻擊成功率，但 bug bounty 對所有人開放，最高 30 萬美元。

Duet 的[公告](https://claude.com/resources/articles/claude-duet)表示之後會再公布安全設計細節。目前能參考的是 Claude Code 的 [auto mode 工程文](https://www.anthropic.com/engineering/claude-code-auto-mode)，Anthropic 在 Claude Code 的測試裡，對真實的過度積極行為漏放 17%。這是 Claude Code 的數字，Duet 的實際表現要等它自己的資料。

Grok Bot 的[安全文件](https://docs.x.ai/grok-bot/security)逐層列出控制項，並說 Cursor 的母公司 Anysphere 持有 ISO/IEC 27001 和 42001，Grok Bot 在範圍內。這些控制多數只給 Enterprise。

自架型最大的差別是原始碼你自己看得到。OpenClaw 和 Hermes 都是 MIT 授權，OpenClaw 另有公開的[信任模型和安全公告](https://docs.openclaw.ai/start/why-openclaw)。程式碼公開不等於被審過，你得自己審，或信任審過的人。

## 限制：已經發生的事

OpenAI、Meta、Anthropic、xAI 的文件都明寫，提示注入只能降低風險，沒有一家說防得住。已經發生的事：

- **Muse**：分享對話的連結可以被列舉，研究者用被動 DNS 找到 6,800 個，樣本裡有貸款申請和未公開的營收檢討，Meta 暫停了分享功能（[Ars Technica](https://arstechnica.com/security/2026/10/meta-muse-exposes-users-personal-and-business-secrets-when-they-share-conversations/)）。Amazon 以服務條款封鎖 Muse，理由是它不表明身分、似乎儲存客戶憑證，這是 Amazon 的說法（[GeekWire](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/)）。[404 Media](https://www.404media.co/meta-tests-muse-ai-agent-calls-that-are-actually-made-by-humans-in-a-call-center/) 取得的內部文件顯示，Meta 在內部測試由真人代打電話，測試者事後才知道，Meta 說公開上線時會附揭露。
- **Dots**：[系統卡附錄](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2)的連續任務測試裡，任務數加倍，被標記的越界比例也約加倍。官方歸為中等越界，例如把資訊帶到不相關的任務。
- **Grok Bot**：[文件](https://docs.x.ai/grok-bot/bots)寫明同一帳號的 Bot 共用一台電腦，瀏覽器登入和檔案是共享的，Bot 之間沒有隔離。
- **OpenClaw**：高風險的一鍵遠端執行漏洞 CVE-2026-25253（[runZero](https://www.runzero.com/blog/openclaw/)），2026.1.29 版起修補，之後又加了來源驗證（[SonicWall](https://www.sonicwall.com/blog/openclaw-auth-token-theft-leading-to-rce-cve-2026-25253)）。
- **Duet**：[公告](https://claude.com/resources/articles/claude-duet)自述可能誤判郵件串與急迫性，也只每隔幾小時檢查一次帳號。

## 怎麼選，今晚能做的事

**想先試，而且已經在付 ChatGPT 或 Claude 訂閱**：選你訂閱所屬的那家，Duet 和 Dots 都含在方案裡。第一晚做四件事：

1. 先只連唯讀權限。Muse 把讀和寫分開授權，Dots 的外掛權限也能分開設，看它跑幾天再開寫入。
2. 到設定裡找訓練開關（Muse 設定裡的訓練開關、Dots 的「Improve the model for everyone」），決定要不要關。
3. 密碼只在它跳出的登入表單裡輸入，不要貼進對話或文件。
4. 寄信、付款、刪除維持每次核准，不要為了少按幾下而預先核准。

**想自己掌握資料和模型**：選 OpenClaw 或 Hermes，放在一台專用機器或 VPS，不要放在日常工作機。OpenClaw 照官方的[強化設定](https://docs.openclaw.ai/start/why-openclaw)走：`agents.defaults.sandbox.mode: "all"` 開沙盒，Gateway 前面放 Tailscale 或有身分驗證的 proxy，私訊策略維持配對，裝完執行 `openclaw security audit --deep`。Hermes 把終端後端選 Docker 或遠端沙盒。連接的帳號一律用專用的低權限帳號，做法見〈[需要登入的網站怎麼交給 Agent](/posts/ai/2026-08-22-authenticated-web-agent-safety)〉。

**團隊或公司**：代管型的控制多數是企業版功能。Dots 的本機存取和自訂規則在 Enterprise 預設關閉，由管理員開；Grok Bot 的網路白名單、稽核日誌、強制 Auto-review 只有 Enterprise 有，自助的 Teams 方案預設允許所有網路連線。先確認你的方案有哪些控制，再決定給誰用。

## 整體來說

代管型換到的是廠商做好的隔離和審批、少量的設定，付出的是模型、資料政策和更新節奏都由廠商決定。自架型換到的是這三件事自己決定，代價是沙盒、更新和稽核也自己扛。兩邊都沒解決的是提示注入：常駐助理讀到一封惡意信件，擋住它的是審批和隔離，不是模型的保證。選哪一邊，等於選你想自己管哪幾層。

## 參考資料

**代管型**
- [Introducing Claude Duet](https://claude.com/resources/articles/claude-duet)（Anthropic）
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)（Claude Help Center）
- [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)（Anthropic）
- [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)（Anthropic）
- [Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)（Meta）
- [How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)（Meta AI Research）
- [Introducing dots](https://openai.com/index/introducing-dots/)（OpenAI）
- [Dots privacy, security, and safety FAQs](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs)（OpenAI Help Center）
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls)、[Connect computers and apps to your dot](https://learn.chatgpt.com/docs/dots/computers-and-apps)、[Manage dots permissions and capabilities](https://learn.chatgpt.com/docs/enterprise/dots-admin-guide)（ChatGPT Learn）
- [GPT-6 Astra System Card：dots 附錄](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2)（OpenAI Deployment Safety Hub）
- [Sam Altman unveils "dots"](https://www.cbsnews.com/news/sam-altman-openai-dots-chatgpt-agents-safety/)（CBS News，方案價格）
- [Grok Bot](https://x.ai/bot)、[Create and manage Bots](https://docs.x.ai/grok-bot/bots)、[Grok Bot security](https://docs.x.ai/grok-bot/security)（xAI）

**自架型**
- [openclaw/openclaw](https://github.com/openclaw/openclaw)、[Why OpenClaw](https://docs.openclaw.ai/start/why-openclaw)
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- [OpenClaw RCE vulnerability: CVE-2026-25253](https://www.runzero.com/blog/openclaw/)（runZero）、[OpenClaw Auth Token Theft Leading to RCE](https://www.sonicwall.com/blog/openclaw-auth-token-theft-leading-to-rce-cve-2026-25253)（SonicWall）

**事件報導**
- [Meta Muse exposes users' personal and business secrets when they share conversations](https://arstechnica.com/security/2026/10/meta-muse-exposes-users-personal-and-business-secrets-when-they-share-conversations/)（Ars Technica）
- [Amazon blocks Meta's Muse AI assistant](https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/)（GeekWire）
- [Meta Tests Muse AI Agent Calls That Are Actually Made By Humans in a Call Center](https://www.404media.co/meta-tests-muse-ai-agent-calls-that-are-actually-made-by-humans-in-a-call-center/)（404 Media）
- [Anthropic takes on Grok Bot, Meta's Muse, and OpenAI's Dots](https://the-decoder.com/anthropic-takes-on-grok-bot-metas-muse-and-openais-dots-with-its-always-on-agent-claude-duet/)（The Decoder，Grok Bot 8 月上線）
