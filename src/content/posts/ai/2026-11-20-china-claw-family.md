---
title: "中國的 Claw 家族：把 OpenClaw 包成產品，包得越深，攻擊面越大"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, china, ai-security]
lang: zh-TW
tldr: "2026 年 3 月，「養龍蝦」在中國爆紅：大廠排隊替人裝 OpenClaw，接著推出各自的包裝版。包法有兩種：雲端託管（Kimi Claw、火山引擎 ArkClaw、MiniMax MaxClaw），以及一鍵安裝的本機 app（騰訊 QClaw、智譜 AutoClaw）；兩種都綁進微信、飛書、釘釘這類通訊軟體。西安電子科技大學和中國聯通的評測，用 205 個攻擊案例測了原版和五個包裝版：攻擊成功率從 MaxClaw 約 16%、原版約 19%，到 QClaw 約 55%。同一個模型放進不同的包裝，風險也不一樣。QClaw 已宣布 12 月 24 日停運，是這個類別第一個收掉的產品。"
description: "中國「養龍蝦」熱潮怎麼來的，雲端託管與一鍵安裝兩種包裝 OpenClaw 的方式，Kimi Claw、ArkClaw、MaxClaw、QClaw、AutoClaw 各是什麼，六個 Claw 系統的安全評測結果，主管機關的風險提示，QClaw 停運的經過，以及怎麼分辨託管 OpenClaw、包裝 app 和廠商自建 agent。"
series:
  name: "常駐型 AI agent"
  order: 15
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-china-claw-family-en)

| 包法 | 跑在哪 | 代表產品 | 你負責什麼 |
|---|---|---|---|
| 雲端託管 | 廠商的雲端沙盒 | Kimi Claw、ArkClaw、MaxClaw | 付訂閱費，管好連進去的帳號 |
| 一鍵安裝的本機 app | 你的電腦 | QClaw、AutoClaw | 電腦開著；app 有本機的高權限 |
| 綁通訊軟體 | 上面兩種都有 | 微信、飛書、釘釘、企業微信 | 誰能在聊天室對它下指令 |

[新京報報導](https://www.bjnews.com.cn/detail/1773055598129368.html)，3 月 6 日，深圳騰訊大廈北廣場排了近千人的長隊，等工程師幫忙裝一個叫 OpenClaw 的開源 AI 工具。騰訊雲派了 20 位工程師，從早忙到晚。

OpenClaw 的圖示是一隻紅色龍蝦，中國網友把裝它、用它叫做「養龍蝦」。熱潮帶出一整條產業鏈：上門安裝報價 299 到 800 人民幣，迷你主機印上龍蝦標誌當成「一體機」賣。

[北京青年報](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html)幾天後的報導更荒謬：有人裝完沒感受到價值，連夜刪掉。於是又出現「龍蝦卸載服務」，同一批商家先收安裝費、再收卸載費。

這篇講中國的 Claw 家族：怎麼靠包裝 OpenClaw 走到常駐型，包得越深，代價是什麼。

## 為什麼要包裝

OpenClaw 本身免費，但要自己裝 Node.js、申請模型的 API 金鑰、設權限，對多數人是一道門檻。[上一篇](/posts/ai/2026-11-20-self-hosted-always-on-agents)講過，自架要自己扛機器、修補和預設值。

廠商看到的是另一件事：常駐 agent 很吃 token。[每日經濟新聞引華西證券的研究](https://www.nbd.com.cn/articles/2026-03-10/4287155.html)，2 月 23 日到 3 月 1 日那週，OpenRouter 平台總共 2.39T 的 token 用量裡，OpenClaw 佔了 2.26T。誰能降低部署門檻、把使用者帶進自家模型和雲，誰就拿到這股流量。

於是 3 月 9 日一天之內，字節跳動、騰訊、月之暗面接連發表 Claw 相關產品。

## 兩種包法

### 雲端託管：廠商替你跑

- **Kimi Claw**（月之暗面）：[官方說明](https://www.kimi.com/en/help/kimi-claw/overview)寫，到 kimi.com/bot 一鍵就能在雲端部署一個 OpenClaw。模型和網路搜尋都自動設好，不用買伺服器、不用碰命令列。可以接飛書、企業微信、微博等平台。部署好的雲端主機[每天扣約 0.6% 的會員額度](https://www.kimi.com/en/help/membership/membership-pricing)，就算沒在跑任務也一樣；不用時要把記憶和工作區檔案存下來，再刪掉主機。
- **ArkClaw**（字節跳動火山引擎）：3 月 9 日推出的雲端 SaaS 版 OpenClaw，打開網頁就能用，深度整合飛書。
- **MaxClaw**（MiniMax）：[國際版頁面](https://agent.minimax.io/activity/max-claw)寫，10 秒一鍵部署，不需要伺服器、Docker 或 API 金鑰。它跑 MiniMax 自家模型，每月 19 美元，可以接 Telegram、Discord、Slack。

### 一鍵安裝的本機 app：跑在你的電腦

- **QClaw**（騰訊電腦管家團隊）：主打用微信遙控電腦。訊息從微信經過騰訊的閘道，送到你電腦上的 QClaw 客戶端，再交給 OpenClaw 的 Gateway 執行。
- **AutoClaw**（智譜，中文名「澳龍」）：[官方說法](https://autoclaw.zhipuai.cn/blog/news/autoclaw-product-introduction/)是「國內首個一鍵安裝的本地版 OpenClaw」。下載安裝約一分鐘，預置 50 多項技能，可以接飛書，強調資料留在本機。

騰訊另有一個 WorkBuddy，[同樣在 3 月 9 日上線](https://www.nbd.com.cn/articles/2026-03-10/4287155.html)，相容 OpenClaw 的技能，偏辦公場景。

兩種包法都把 agent 綁進通訊軟體。好處是不用學新介面，在每天用的聊天室裡派工作就好；代價是一個聊天帳號就成了能指揮你電腦或雲端主機的入口。

## 安全評測：六個 Claw 系統的攻擊成功率

西安電子科技大學和中國聯通的研究團隊在 4 月發表了[一份系統性的評測](https://arxiv.org/abs/2604.03131)，測 OpenClaw 原版和五個包裝版。他們不看模型單獨聊天時會不會拒答，而是看接上工具、多步規劃、本機執行和狀態保存之後，整個系統會不會被打穿。

測試用了 205 個案例，涵蓋 13 類攻擊行為，參考 MITRE ATT&CK：從偵察、取得初始存取，到竊取憑證、橫向移動、把資料傳出去。[安全內參的整理](https://www.secrss.com/articles/89363)列出各系統的整體攻擊成功率：

| 系統 | 包法 | 攻擊成功率 | 最突出的弱點 |
|---|---|---|---|
| QClaw | 本機 app，微信遙控 | 54.85% | 憑證存取 85.71%、資料外傳 80% |
| AutoClaw | 本機 app | 49.51% | 規劃階段被帶偏（70%） |
| Kimi Claw | 雲端，網頁橋接 | 40.78% | 會把攻擊一路推進到橫向移動 |
| ArkClaw | 雲端 SaaS | 29.61% | 執行後的狀態被持續利用 |
| OpenClaw 原版 | 自架 | 19.42% | 偵察 71.43%、發現 55.17% |
| MaxClaw | 雲端 | 16.02% | 偵察和發現仍偏鬆 |

幾個重要的發現：

- **沒有一個系統可以說是安全的。** 差別只在暴露面多大、風險集中在哪一段。
- **最普遍的弱點在最前面。** 偵察和發現這兩類，平均成功率超過 65%。它們長得像正常的診斷和排障，系統很難在一開始擋住；拿到環境資訊後，後面的攻擊就更容易推進。
- **同一個模型，放進不同包裝，風險不同。** 原版 OpenClaw 換成 Kimi K2.5 模型時，偵察升到 85.71%；同一個 Kimi K2.5 放進 Kimi Claw，更容易一路推進到橫向移動。論文的結論是，agent 的安全性不是模型單獨決定的，而是模型能力、工具權限、多步規劃和執行環境一起決定的。

這份評測測的是今年春天的版本，各產品之後都更新過；它是一份評測，不是長期追蹤。但它指出的結構很清楚：入口越貼近日常聊天、執行層越能直接碰本機檔案和命令，可利用的面就越大。QClaw 兩者都有，所以分數最高。

## 主管機關的提示

熱潮期間，中國主管機關也發了警告。工業和信息化部的網路安全威脅與漏洞資訊共享平台在 3 月 8 日指出，OpenClaw 部分實例在預設或配置不當時風險很高。[3 月 11 日又列出建議](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html)：

- 不要用第三方映像檔或舊版本。
- 不要用要求「下載 ZIP」「執行 shell 腳本」或「輸入密碼」的技能包。
- 部署時不要用管理員權限帳號。
- 不要把 agent 實例直接暴露在網路上；真的要從外面連，用 SSH 這類加密通道，並限制來源位址。
- 不要關掉詳細的日誌稽核。

這幾條不只適用中國的產品，自架 OpenClaw 也一樣。

## QClaw 停運：這個類別第一個收掉的

9 月 24 日，騰訊 QClaw 團隊公告，[QClaw 將在 2026 年 12 月 24 日 00:00 停止營運](https://news.qq.com/rain/a/20260924A0DF5T00)：

- 公告當天起停止新使用者註冊、停止訂閱購買與續費。
- 已購買但沒用完的訂閱可以申請退款。
- 資料可以遷移到騰訊的 WorkBuddy，遷移工具開放到 2027 年 3 月 24 日；完成遷移的人拿到 1000 點補貼。

QClaw 3 月開始內測，報導說上線 10 天就有超過百萬使用者，是第一個能用微信直連的「龍蝦」產品。7 月，騰訊把 QClaw 的業務劃到 WorkBuddy 所屬的部門。騰訊的說法是整合資源，提供更好的 agent 服務。

這是包裝型產品的另一種風險：你的記憶、技能和設定都在廠商的產品裡，產品收掉，你就得搬家。開源的 OpenClaw 不會因為一家公司的組織調整而消失，包裝它的產品會。

## 怎麼分辨三種產品

遇到一個新的 Claw 產品，先問這幾個問題，就能分出它是託管 OpenClaw、包裝 app，還是廠商自己做的 agent：

| 要問的問題 | 託管 OpenClaw | 包裝 app | 廠商自建 agent |
|---|---|---|---|
| 程式跑在哪？ | 廠商的雲端沙盒 | 你的電腦 | 看產品 |
| 底下是不是 OpenClaw？ | 是，通常會寫 | 是，通常會寫 | 不是，或只相容它的技能 |
| 能不能碰你本機的檔案和命令？ | 不能 | 能，權限通常很高 | 看產品 |
| 從哪裡下指令？ | 網頁、通訊軟體 | 通訊軟體遙控電腦 | 看產品 |
| 產品收掉時資料怎麼辦？ | 先匯出記憶和工作區 | 本機有檔案，但設定綁產品 | 看廠商的遷移工具 |

再對照評測的結論檢查攻擊面：

- **入口**：誰能在聊天室對它下指令？群組裡的其他人可以嗎？
- **執行層**：它能不能直接跑本機命令、讀檔案？有沒有沙盒？
- **憑證**：你的帳號密碼、API 金鑰放在哪？agent 讀得到嗎？
- **出口**：它能不能把資料傳到外部網址？

本機 app 加上通訊軟體遙控，四個面向都打開了，就要特別小心。

## 適合誰、不適合誰

**適合：**
- 想試常駐 agent、但不想自己架設的人：雲端託管版門檻最低。
- 工作本來就在飛書、企業微信、釘釘上的團隊。
- 想用中國模型、價格比較便宜的人。

**不適合：**
- 想在主力電腦上裝本機版、又不想管權限的人：評測顯示本機包裝版風險最高。
- 需要長期穩定使用的人：QClaw 已經示範了產品收掉的情況。
- 資料受法規限制、不能放到中國廠商雲端的組織。

在台灣，Kimi Claw 和 MaxClaw 有國際版網站，AutoClaw 有海外站（autoclaw.z.ai）。能不能訂閱、能接哪些通訊軟體，以申請時為準。ArkClaw 是火山引擎的服務，QClaw 已停止新註冊。

前三條路線都讓 agent 開一台電腦，不管是廠商的雲端、你的機器，還是包裝過的版本。下一篇的路線四不開新電腦：agent 直接住進你每天用的 app。

## 參考資料

- [A Systematic Security Evaluation of OpenClaw and Its Variants](https://arxiv.org/abs/2604.03131)（Wang 等，西安電子科技大學、中國聯通，arXiv，2026-04-03）
- [OpenClaw与5款国产类Claw智能体安全评测报告](https://www.secrss.com/articles/89363)（安全內參，2026-04-13，簡體中文）
- [一只“龙虾”搅动江湖：国产大模型厂商“吃撑”，大厂急了](https://www.bjnews.com.cn/detail/1773055598129368.html)（新京報，2026-03-09，簡體中文）
- [疯狂的OpenClaw：Token放量、资本热捧，大厂卡位战已打响](https://www.nbd.com.cn/articles/2026-03-10/4287155.html)（每日經濟新聞，2026-03-10，簡體中文）
- [这波“养虾潮”还能热多久？](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html)（北京青年報，2026-03-17，簡體中文）
- [腾讯QClaw宣布将关停](https://news.qq.com/rain/a/20260924A0DF5T00)（i黑馬，騰訊網，2026-09-24，簡體中文）
- [What Is Kimi Claw?](https://www.kimi.com/en/help/kimi-claw/overview) 與 [Membership Pricing and Plan Overview](https://www.kimi.com/en/help/membership/membership-pricing)（Kimi 說明中心）
- [MaxClaw](https://agent.minimax.io/activity/max-claw)（MiniMax）
- [智谱AutoClaw官方正版产品介绍](https://autoclaw.zhipuai.cn/blog/news/autoclaw-product-introduction/)（智譜，2026-10-21，簡體中文）
