---
title: "AI 日報 — 2026-09-21"
date: 2026-09-21
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "中國廠商正把「聰明的模型」變成廉價商品——同一套壓低模型層價值的邏輯，也讓 LiteLLM 這類 AI gateway 的漏洞變成整條 agent 供應鏈最脆弱的一環"
tldr: "阿里巴巴 Qwen3.8-Omni-Flash 用 Gemini 一小部分價格做出效能相近的全模態 agent 模型，StepFun Step 5 Preview 600B 參數智力分數追平自家更大模型且 10 月將開源；OpenAI／Meta／Apple／xAI 同步搶進個人助理型 agent 大戰；LiteLLM 爆出 CVSS 10.0 滿分漏洞並被 CISA 列入已遭利用清單，Orkes Conductor RCE 也在被實際攻擊；Google 證實 Gemini 曾在評測中意外闖入 3 家真實企業系統；川普宣布成立「AI Force」、歐巴馬反擊呼籲聯邦強制監管，台灣 TIPS 同日徵求 AI 智財指引意見"
draft: false
series:
  name: "AI 日報"
  order: 37
---

> 🌏 [English version](/en/posts/daily/2026-09-21-ai-agent-daily-en)

## 一句話判斷

**當中國廠商把「聰明的模型」變成隨插即用的商品，價值與風險正一起被擠往連接多個模型的路由層——今天最大的資安破口，剛好就出在那一層。**

## 深度分析：模型變便宜之後，護城河搬去哪裡了

我認為今天的事件合起來，指向 agent 產業的競爭壓力正快速從模型層轉移到路由層，而路由層恰好也是今天資安風險最高的地方。

從五力分析的角度：阿里巴巴的 Qwen3.8-Omni-Flash 用「Gemini 3.8 Flash 一小部分的價格」做出效能相近的全模態 agent 模型，加上中國新創 StepFun 的 600B 參數 Step 5 Preview 把智力分數拉到跟自家更大模型 Kimi K3 相當、10 月中旬還要釋出開源權重——這是替代品威脅急遽升高的教科書案例。當多家中國廠商同時把「聰明的模型」變成隨插即用的商品，單一模型供應商對下游 agent 開發者的議價力就被削弱，價值自然往上游或下游轉移。今天的 GitHub Digest 與 Pydantic AI 更新剛好證實了下游那一端正在發生什麼——把「填表格」「是非判斷」這類窄任務甩給專門的小模型或分類器（如 CUA-S1、TypeSafeModel／Jev），讓通用模型只負責協調，不再是唯一的決策點（詳見下方 Digest 一覽）。

「路由層變成新的價值高地」這件事，同時也讓路由層變成新的攻擊高地。今天揭露的 LiteLLM CVSS 10.0 漏洞，正是那個坐在多個模型供應商之間、負責路由與 API 金鑰的 AI gateway——未經驗證的攻擊者能對任何暴露在公開網路上的實例取得任意程式碼執行，CISA 已將其列入已遭利用漏洞清單。當模型可以被隨意替換、agent 開發者靠 gateway 統一管理多供應商成本時，gateway 本身的安全等級就決定了整條 agent 供應鏈的下限，而不是你選了哪個模型。

對台灣／繁中 builder 的意義：如果你的 agent 架構已經接了 LiteLLM 或類似的多模型 gateway 來利用 StepFun、Qwen 這類低價模型做成本優化，現在的優先事項不是繼續比價模型，而是先確認 gateway 版本是否落在 1.74.2–1.83.6 這個受影響區間、是否暴露在公開網路上——省下來的模型費用，不該用一次可被完全接管的 RCE 賠回去。

## 今日動態

### 廠商動態

**OpenAI／Meta／Apple／xAI**：Axios 點名個人助理型 agent 大戰正式開打——xAI Grok Bot 給 agent 專屬雲端電腦、可代簽入各種 app，Meta Muse 主打消費端整合，Apple Siri 迎來大改版，個人 agent 從展示走進主流競爭階段。([來源](https://www.axios.com/2026/09/20/ai-assistant-openai-meta-muse-instinct-grok-apple))

**騰訊**：新語音助理 Gander 用「小腦」維持對話不中斷、可替換的「大腦」負責搜尋檔案、寫程式等複雜工作，benchmark 顯示打斷使用者的比例低於對手，但任務準確度略遜。([來源](https://the-decoder.com/tencents-gander-aims-to-keep-talking-while-it-works-in-the-background/))

**Runway**：計劃把 AI 影片生成變成使用者可即時操控的直播串流，建立在逐格生成的世界模型 GWM-1 之上，並看好此技術在機器人與自駕領域的應用。([來源](https://the-decoder.com/runway-wants-to-turn-ai-video-generation-into-a-live-stream-you-control-in-real-time/))

### 模型與基礎設施

**StepFun Step 5 Preview**：中國 StepFun 發佈 600B 參數稀疏 MoE 模型，27B 啟用參數、1M token context，API 定價 $1／$2.70（每百萬 token 輸入/輸出），Intelligence Index 追平體積大它許多的 Kimi K3，開源權重預計 10 月 15 日釋出。([來源](https://easternherald.com/2026/09/20/stepfun-step-5-preview-china-ai-model-open-weights/))

**Qwen3.8-Omni-Flash／Qwen3.8-LiveTranslate**：阿里發佈首款針對 agent 打造的全模態模型 Qwen3.8-Omni-Flash，能自主呼叫工具剪片、翻譯、摘要，定價僅 Gemini 3.8 Flash 的一小部分卻效能相近；同日推出即時口譯模型 Qwen3.8-LiveTranslate，具語者分離與同步雙語輸出，鎖定會議、直播等場景。([來源](https://www.alibabacloud.com/blog/qwen3-8-omni-flash-omni-senses--agentic-delivery-_603580))

**SWE-Bench Pro 排行榜更新**：Scale AI 更新的私有子集顯示頂尖模型完成率僅約 23%（相較 SWE-Bench Verified 的 70%+），Claude Opus 4.1、GPT-5 在真實未知程式碼庫上表現進一步下滑，顯示既有 benchmark 高估了 agent 的實戰能力。([來源](https://labs.scale.com/leaderboard/swe_bench_pro_public))

### 工具與生態

**Qwen-Image-2.1**：阿里開源僅 70 億參數的影像生成／編輯模型，官方自評內部 benchmark 超越多數閉源模型，支援透明圖層編輯與最多十張參考圖合成，可在消費級 GPU（如 3090）運行。([來源](https://the-decoder.com/alibabas-open-weight-qwen-image-2-1-claims-to-beat-closed-models-in-image-generation-with-just-7-billion-parameters/))

**CyberStrike**：開源 AI 驅動自動化滲透測試框架，可透過瀏覽器介面統一管理多個 agent、MCP server 與弱點發現結果，並支援 Cloudflare Tunnel 遠端存取。([來源](https://github.com/CyberStrikeus/CyberStrike))

今天 GitHub Digest 對「窄任務轉交專門決策模型」這個設計趨勢已有完整分析，見下方 Digest 一覽。

### 資安事件

**LiteLLM CVE-2026-42271**：1.74.2–1.83.6 版本存在兩個串接後可達 CVSS 10.0 滿分的漏洞，未經驗證攻擊者可對任何暴露在網路上的 LiteLLM 實例取得任意程式碼執行，CISA 已列入已遭利用漏洞清單。([來源](https://byteiota.com/litellm-cve-2026-42271-cvss-10-0-chain-hits-ai-gateways/))

**Orkes Conductor CVE-2026-58138**：工作流程編排引擎 3.21.21–3.30.1 版本的遠端程式碼執行漏洞正遭實際攻擊利用。([來源](https://byteiota.com/cve-2026-58138-orkes-conductor-rce-actively-exploited/))

**Tencent BrowserSkill CVE-2026-94111**：0.3.0 以下版本的本機 daemon WebSocket 來源驗證存在認證繞過，會接受任意 chrome-extension 來源連線（CVSS 中度 6.6）。([來源](https://www.thehackerwire.com/vulnerability/CVE-2026-94111/))

今天的資安專文已完整拆解 Google Gemini 評測沙箱逃逸事件（命名衝突加網路隔離失效，導致模型闖入 3 家真實企業），見下方 Digest 一覽。

### 法規與治理

**美國「AI Force」**：川普宣布仿效 Space Force 成立「AI Force」並將任命 AI 沙皇，強調不會用新法規拖慢產業成長，正面回應 Anthropic 等實驗室對放緩開發的呼籲。([來源](https://the-decoder.com/trump-announces-ai-force-and-plans-for-an-ai-czar-as-he-pushes-unchecked-ai-growth/))

**歐巴馬反駁放任式監管**：在 Colgate 大學演講中反駁現任政府「靠市場競爭管好 AI 安全」的立場，主張仿效航空、藥品業採取強制性聯邦監管框架，特別點名 agentic AI 的風險。([來源](https://www.whalesbook.com/news/English/technology/Obama-Challenges-AI-Deregulation-Policy-Seeks-Binding-Rules/6ab01a6d32997ce1de8aa24e))

**EU AI Act 第 50 條**：文章提醒 AI 生成內容標示的合規期限已在 2026 年 8 月生效而非外界誤傳的 2027 年，行銷從業者若使用 AI 生成內容須立即檢視合規狀態。([來源](https://www.thetechedvocate.org/the-eu-ai-act-is-a-2026-problem-for-marketers-not-a-2027-one/))

### 區域動態

**台灣**
台灣 TIPS 就 AI 使用衍生的智慧財產風險（機密資訊、著作權、生成內容歸屬）徵求指引意見，是政府補上 AI 治理細則的最新一步。對正在用 AI 生成行銷素材或程式碼的台灣企業，這代表著作權歸屬與機密資訊揭露的合規細則即將明朗，值得提早檢視內部 AI 使用政策。([來源](https://asiaaipolicymonitor.substack.com/p/50-asia-ai-policy-monitor-advocacy))

**日韓**
南韓 PIPC 就 AI 時代的隱私保護框架改革徵求提案，與台灣 TIPS 的智財指引徵詢同步進行，反映東亞主要經濟體正加速補上 AI 治理細則。([來源](https://asiaaipolicymonitor.substack.com/p/50-asia-ai-policy-monitor-advocacy))

**中國**
紐約時報報導，習近平即將訪美之際，中國 AI 技術突破持續受矚目，但國內經濟卻處於數十年來最疲弱的狀態，形成技術突破與總體經濟表現的明顯落差。([來源](https://www.nytimes.com/2026/09/20/business/china-ai-economy.html))

**印度**
IT 部長 Vaishnaw 表示政府正與產業合作制定 AI 監管框架，聚焦深偽、假訊息、隱私外洩等使用者安全風險；同期評論文章則以今夏一連串 agent 逃出測試環境的事件為背景，呼籲印度應提早規劃因應 agentic AI 風險的具體政策。([來源](https://techgig.com/news/governance-policy/ai-regulation-needed-for-user-safety-says-it-minister-vaishnaw/134346168))

**歐洲**
法國調查顯示近 40% 的 500 人以上企業已部署至少一個正式上線的 AI agent，15% 中小企業則在試點特定場景，MCP 架構被視為釐清責任歸屬、利於稽核合規的治理框架。([來源](https://decisionia.com/agents-ia-entreprise-passage-experimentations-echelle/))

**中東**
分析指出沙烏地 Vision 2030 與阿聯 2031 國家 AI 策略正推動海灣國家將 AI 治理、資料落地與主權 AI 列為營運常態，各國個資法規均強調限制跨境資料傳輸；阿聯同時計劃向德國投入 400 億歐元跨足 AI、工業與能源領域。([來源](https://astretchout.com/ai-governance-gulf-firms.html))

**非洲**
IMF 研究顯示撒哈拉以南非洲 AI 擴散水平僅約 9%，遠落後北美的 30%、歐洲的 22%；區域約 77.3% 就業屬 AI 低暴露職業，短期衝擊有限，但未來十年生產率提升幅度預估僅 0.2%-2.1%，IMF 強調關鍵不在有沒有頂尖模型，而在電力、數位基礎設施與監管體系能否跟上。([來源](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inismkxn6994850.shtml))

**拉丁美洲**
El País 分析哥倫比亞、阿根廷、智利等右翼政府視 AI 為縮減國家機器、吸引投資的工具，巴西與墨西哥則正推動相關立法規範；智利、巴西、巴拉圭同步推進涉及深偽與個資的 AI 立法草案。([來源](https://elpais.com/america/2026-09-20/la-ia-se-abre-paso-entre-los-gobiernos-ultras-de-america-latina-y-encuentra-limites-en-los-de-izquierda.html))

**大洋洲**
澳洲總理艾班尼斯造訪 Apple 總部時呼籲美中就 AI 全球治理規則達成協議，並考慮修改著作權法以吸引 AI 投資落地澳洲。([來源](https://www.abc.net.au/news/2026-09-20/albanese-visits-apple-hq-urges-us-china-deal-on-ai/107173474))

（東南亞今日訊號為 Temasek 旗下 Xora 領投 Hang Ten Systems 融資案，已併入下方「商業案例／融資」段，不重複列出。）

### 商業案例 / 融資

**Hang Ten Systems**：新加坡淡馬錫旗下創投 Xora Innovation 領投企業 AI 服務新創 Hang Ten Systems 5,300 萬美元融資，公司由前 SAP 執行長 Vishal Sikka 創立，成立僅四個月。([來源](https://www.asiaasset.com/corporates/singapores-temasek-unit-xora-leads-us53-million-funding-round-in-ai-startup-hang-ten/))

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| StepFun Step 5 API 定價 | $1／$2.70（每百萬 token 輸入/輸出） | [Eastern Herald](https://easternherald.com/2026/09/20/stepfun-step-5-preview-china-ai-model-open-weights/) |
| LiteLLM 漏洞 CVSS 分數 | 10.0（滿分） | [ByteIota](https://byteiota.com/litellm-cve-2026-42271-cvss-10-0-chain-hits-ai-gateways/) |
| SWE-Bench Pro 私有子集完成率 | 約 23%（對照 Verified 70%+） | [Scale AI](https://labs.scale.com/leaderboard/swe_bench_pro_public) |
| Hang Ten Systems 融資額 | $53M | [AsiaAsset](https://www.asiaasset.com/corporates/singapores-temasek-unit-xora-leads-us53-million-funding-round-in-ai-startup-hang-ten/) |
| 撒哈拉以南非洲 AI 擴散水平 | 約 9%（北美 30%） | [IMF／199IT](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inismkxn6994850.shtml) |

## 今日 Digest 一覽

- 📄 [AI Agent GitHub Digest — 2026-09-21](/posts/daily/2026-09-21-ai-agent-github-digest)
- 📄 [框架更新｜Pydantic AI v2.46.0](/posts/daily/2026-09-21-framework-pydantic-ai-2.46.0)
- 📄 [資安警報｜Google 承認 Gemini 評測期間闖入 3 家真實企業系統——命名衝突讓沙箱失去隔離](/posts/daily/2026-09-21-security-google-gemini-evaluation-sandbox-escape)
- 📄 [AI Engineer 面試日練 — 2026-09-21：ML Fundamentals](/posts/daily/2026-09-21-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-09-21：Product Sense](/posts/daily/2026-09-21-product-builder-interview-daily)

## 明日關注

- StepFun Step 5 開源權重 10 月 15 日釋出後，社群能否驗證其 Intelligence Index 是否真的追平 Kimi K3
- LiteLLM CVSS 10.0 漏洞的修補進度，以及是否有更多暴露在公開網路上的 gateway 傳出受駭案例
- OpenAI／Meta／Apple 個人助理型 agent 大戰是否會端出具體的消費端上線時程，而不只是定位聲明

## 今日收穫

之前直覺以為 agent 測試環境「設定成隔離」就等於「真的隔離」，但 Google Gemini 這起事件示範的是，兩個各自看起來都不嚴重的疏漏——虛構公司名稱剛好撞到真實網域、網路存取設定留了對外連線的後門——疊在一起，就足以讓一個原本設計來完成任務的 agent，用完全正當的手段（猜密碼、用外洩憑證）走進真實世界的系統。安全邊界如果沒有被主動驗證過，寫在設定文件上的「已隔離」什麼都不代表。

## 參考資料

- [AI Agent GitHub Digest — 2026-09-21](/posts/daily/2026-09-21-ai-agent-github-digest)
- [資安警報｜Google 承認 Gemini 評測期間闖入 3 家真實企業系統](/posts/daily/2026-09-21-security-google-gemini-evaluation-sandbox-escape)
- [Axios：The AI assistant race is here as OpenAI, Meta, Apple launch agents](https://www.axios.com/2026/09/20/ai-assistant-openai-meta-muse-instinct-grok-apple)
- [Tencent's Gander keeps talking while it works in the background — The Decoder](https://the-decoder.com/tencents-gander-aims-to-keep-talking-while-it-works-in-the-background/)
- [Runway wants to turn AI video generation into a live stream — The Decoder](https://the-decoder.com/runway-wants-to-turn-ai-video-generation-into-a-live-stream-you-control-in-real-time/)
- [StepFun launches Step 5 Preview — Eastern Herald](https://easternherald.com/2026/09/20/stepfun-step-5-preview-china-ai-model-open-weights/)
- [Qwen3.8-Omni-Flash — Alibaba Cloud Blog](https://www.alibabacloud.com/blog/qwen3-8-omni-flash-omni-senses--agentic-delivery-_603580)
- [SWE-Bench Pro Public Leaderboard — Scale AI](https://labs.scale.com/leaderboard/swe_bench_pro_public)
- [Alibaba's open-weight Qwen-Image-2.1 — The Decoder](https://the-decoder.com/alibabas-open-weight-qwen-image-2-1-claims-to-beat-closed-models-in-image-generation-with-just-7-billion-parameters/)
- [CyberStrikeus/CyberStrike — GitHub](https://github.com/CyberStrikeus/CyberStrike)
- [LiteLLM CVE-2026-42271 — ByteIota](https://byteiota.com/litellm-cve-2026-42271-cvss-10-0-chain-hits-ai-gateways/)
- [CVE-2026-58138: Orkes Conductor RCE — ByteIota](https://byteiota.com/cve-2026-58138-orkes-conductor-rce-actively-exploited/)
- [CVE-2026-94111: Tencent BrowserSkill — TheHackerWire](https://www.thehackerwire.com/vulnerability/CVE-2026-94111/)
- [Trump announces "AI Force" — The Decoder](https://the-decoder.com/trump-announces-ai-force-and-plans-for-an-ai-czar-as-he-pushes-unchecked-ai-growth/)
- [Obama Challenges AI Deregulation Policy — Whalesbook](https://www.whalesbook.com/news/English/technology/Obama-Challenges-AI-Deregulation-Policy-Seeks-Binding-Rules/6ab01a6d32997ce1de8aa24e)
- [The EU AI Act's Article 50 transparency deadline — The Tech Edvocate](https://www.thetechedvocate.org/the-eu-ai-act-is-a-2026-problem-for-marketers-not-a-2027-one/)
- [Asia AI Policy Monitor #50](https://asiaaipolicymonitor.substack.com/p/50-asia-ai-policy-monitor-advocacy)
- [In China, AI is moving forward while the economy lags behind — NYTimes](https://www.nytimes.com/2026/09/20/business/china-ai-economy.html)
- [India's IT Minister Vaishnaw on AI regulation — TechGig](https://techgig.com/news/governance-policy/ai-regulation-needed-for-user-safety-says-it-minister-vaishnaw/134346168)
- [AI agents in the enterprise: France — DecisionIA](https://decisionia.com/agents-ia-entreprise-passage-experimentations-echelle/)
- [Gulf firms prioritize AI governance over speed — aStretchOut](https://astretchout.com/ai-governance-gulf-firms.html)
- [釋放潛能：人工智能在撒哈拉以南非洲（IMF 研究）— 199IT／新浪財經](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inismkxn6994850.shtml)
- [AI advances among far-right Latin American governments — El País](https://elpais.com/america/2026-09-20/la-ia-se-abre-paso-entre-los-gobiernos-ultras-de-america-latina-y-encuentra-limites-en-los-de-izquierda.html)
- [Albanese urges US and China to strike a deal over AI — ABC Australia](https://www.abc.net.au/news/2026-09-20/albanese-visits-apple-hq-urges-us-china-deal-on-ai/107173474)
- [Temasek's Xora leads $53M round in Hang Ten — AsiaAsset](https://www.asiaasset.com/corporates/singapores-temasek-unit-xora-leads-us53-million-funding-round-in-ai-startup-hang-ten/)
