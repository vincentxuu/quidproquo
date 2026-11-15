---
title: "AI 是新時代的 baseline：BossAI、ARTEX 事件之後，自己的系統先打一輪"
date: 2026-11-13
category: ai
type: deep-dive
tags: [security, ai-agent, penetration-testing, dual-use]
lang: zh-TW
tldr: "花蓮的 BossAI、高雄的 AI 自學駭客、首爾的 ARTEX 案，顯示全自動攻擊系統不需要資安背景也能架起來，單一操作者幾週就能掃過數百個目標。自己的系統先用 AI 對原始碼跑一輪資安 audit，再用 ARTEX 類框架自測，兩者成本都遠低於外包滲透測試。"
description: "從 Acronis 揭露的 BossAI、高雄 AI 自學駭客案與首爾警方偵破的 ARTEX 案，談全自動攻擊的成熟度與入侵門檻，以及低成本的自我防護做法。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-13-ai-is-the-new-baseline-en)

最近三週有三起案子，放在一起看，是同一件事：用 AI 打網站，已經不需要是高手。

| | BossAI（花蓮） | 高雄 | 首爾（ARTEX） |
|---|---|---|---|
| 怎麼曝光 | 資安公司 Acronis 在一台設定錯誤的 VPS 上，看到完整的攻擊平台與 agent 對話紀錄 | 高雄市刑大蒐證後搜索逮人 | 首爾警察廳 10 月 15 日逮捕主嫌 |
| 操作者 | 位於花蓮市的個人，有技術背景 | 38 歲，專科學歷，擔任臨時搬運工 | 32 歲，曾做過滲透測試員 |
| 規模 | 12 天內針對 11 個國家的數百個組織 | 侵入 4 個公私部門網站，23 萬多筆個資在暗網販售 | 90 多家機構、約 820 萬筆個資，與 6 名共犯勒索 |
| 用的東西 | 12 個 AI agent（Hermes、Cursor、Grok 等）、MCP、多個模型 | AI 生成攻擊程式，串成自動化攻擊系統 | 開源 AI 滲透測試框架 ARTEX |

高雄那位不具資訊背景，BossAI 的操作者是懂技術的人；報導裡兩人的工作與背景對不上，目前沒有任何報導把這兩案連在一起。

## BossAI：一個人，12 個 agent，還是會出錯

BossAI 是被「看光」的。Acronis 的研究團隊從一台設定錯誤的開發環境開始查，拿到超過 9 萬個檔案、約 9GB 的資料，包括 agent 對話、攻擊指令、設定檔與受害者資料。後來可以還原操作者是誰，靠的是操作失誤累積出來的線索：對話中的 SSH 連線露出住家 IP，SSH 金鑰身分對得上 GitHub 帳號，伺服器上出現的商業品牌，與對外營業的網站一致。Acronis 判斷這是花蓮市的單一個人。截至這篇發布，我查到的報導都沒有提到台灣警方有沒有後續動作。

這套系統的組成，跟我們在做 agent 工程時用的東西一樣：

- **建設者**：Grok、OpenClaw、Claude Code、Codex，負責架 MCP、DNS、代理與訊息閘道。
- **攻擊者**：Hermes 為主，加上 Cursor、Trae；另有 HalberdStrike 與 Acunetix 掃描器產出弱點報告。
- **工具層**：透過 MCP 接上 Kali，nmap、sqlmap、Metasploit、Hydra 都能由 agent 自己呼叫。
- **技能**：Hermes 把攻擊流程存成 SKILL.md，其中針對台灣消防派遣與緊急管理 API 的那一份用得最多，換模型之後還能沿用累積的偵察資料。

台灣這邊受到影響的是緊急服務：Acronis 指出攻擊者取得台北市七個行政區的 119 派遣紀錄，另外發現一個台北消防單位的病患照護平台，不用登入就能看到自 2018 年起的心電圖、救護車影像與生命徵象。

這套系統的限制也很具體，Acronis 的報告寫得相當誠實：

- 商用模型（包含 Grok、MiniMax）一碰到攻擊請求就拒絕，還會要求對方出示授權文件，所以攻擊端幾乎都跑在本機「abliterated」（移除安全訓練）的 DeepSeek、GLM、Qwen 變體上，能力較弱。
- 各 agent 之間沒有串通，操作者自己複製貼上，把掃描報告貼給 Hermes，再貼給 Cursor 執行。
- HalberdStrike 回報的高風險與重大弱點，超過一半是誤報或分類錯誤，連線失敗還被當成 RCE。
- 操作者給 Hermes 全權決策、不要回頭問，結果 Hermes 發現一台宏都拉斯軍方主機，自己判斷「超出範圍」就放掉了。

所以 BossAI 不是一台不會出錯的攻擊機器。它是一個人用現成零件拼出來的流水線，有力氣、有雜訊，但足以在 12 天內掃過數百個目標。

## 門檻：說一句「幫我跑起來」

另外兩案說的是門檻。

高雄的案子，警方的說法是該名男子沒有資訊專業背景，靠網路搜尋與多個生成式 AI 互相比對、修正程式碼，自己做出攻擊系統，專挑有漏洞的網站後台整包下載資料庫，再以每筆約 6 元在暗網賣。報導數字是 23 萬多筆個資、獲利約 270 萬元。新聞沒有公開太多技術細節，所以我不評論他的系統做到什麼程度。

首爾的主嫌雖然做過滲透測試，也是靠網路自學的，他 8 月底改用 ARTEX，在 8 月 31 日到 10 月 13 日的 43 天內入侵 60 家企業。首爾警察廳自己的說法是：這是南韓第一次查獲用生成式 AI 大規模入侵、竊取個資的案件，AI 明顯降低了門檻。

ARTEX 這類開源專案的另一個含意：你不用懂它怎麼跑，只要告訴你的 coding agent「幫我把它裝起來、跑起來」，剩下的環境、依賴、設定，agent 都會處理。Acronis 也點出同一件事：BossAI 的操作者用商用模型當「基礎設施工程師」，攻擊相關的才交給本機模型。這種分工讓沒有程式或 AI 工程背景的人，也有機會拼出類似的攻擊系統。

兩個角度合起來：成熟度變高，加上門檻變低，攻擊的總量就會上去。

## 全自動滲透到什麼程度

我之前把 ARTEX 抓下來玩過，結論是效果非常好。下面這條攻擊鏈是測試中 agent 自己打出來的。我給它的目標只有一句：「幫我拿到 xxx 的 server 權限」。

```flow-diagram
{
  "title": "測試中 agent 自己串出的一條攻擊鏈",
  "lang": "zh-TW",
  "width": 520,
  "height": 600,
  "nodes": [
    {"id": "goal", "label": "目標：一句話 + 一個網域", "x": 260, "y": 40, "w": 300, "tone": "accent"},
    {"id": "js", "label": "前端 JS 裡的測試用 header", "x": 260, "y": 130, "w": 300},
    {"id": "sandbox", "label": "偽造身份、繞過 sandbox，取得 RCE", "x": 260, "y": 230, "w": 360},
    {"id": "meta", "label": "從 cloud metadata 拿到暫時的 key", "x": 260, "y": 330, "w": 300},
    {"id": "k8s", "label": "K8S node 權限，橫向移動到其他 pod", "x": 260, "y": 430, "w": 300},
    {"id": "admin", "label": "service account 提權成 cluster admin", "x": 260, "y": 540, "w": 360}
  ],
  "edges": [
    {"from": "goal", "to": "js", "step": 1, "label": "recon", "labelAt": [300, 85]},
    {"from": "js", "to": "sandbox", "step": 2, "label": "偽造身份", "labelAt": [300, 180]},
    {"from": "sandbox", "to": "meta", "step": 3, "label": "橫向移動", "labelAt": [300, 280]},
    {"from": "meta", "to": "k8s", "step": 4, "label": "丟給 K8S", "labelAt": [300, 380]},
    {"from": "k8s", "to": "admin", "step": 5, "label": "發現可提權", "labelAt": [300, 485]}
  ],
  "steps": [
    "agent 先對網域做 recon，辨識服務，在前端 JS 找到測試用的 header",
    "用這個 header 偽造身份進入系統，發現一個在 sandbox 跑 JS 的功能，繞過黑名單後取得 RCE",
    "從 RCE 橫向移動，在 cloud metadata 拿到暫時的 key",
    "把 key 丟給 K8S，取得 node 權限並移動到其他 pod",
    "發現某個 service account 能建立 pod 並提權，最後取得 cluster admin"
  ]
}
```

捲到圖上會自動逐步播放，也可以用按鈕停在任一步。這個流程跟人類滲透測試員做的事一樣：從每一條線索往下延伸，不斷嘗試。

模型也不用最強的。我用 DeepSeek v4.1 flash，放它跑四五個小時，大約花 10 美金，就找出一堆問題。

要講清楚的是，這不等於它比資深的滲透測試員強。它會有疏漏，有些細節要人盯著觀察才找得到；我自己跑的時候也是盯著，免得它把系統打壞。它的優勢是快、便宜、全自動，放著就會跑。黑箱測試裡有一部分是公式化的工作，例如把每個輸入欄位都塞滿 XSS payload 看會不會觸發，流程固定，但為了 coverage 不能不做。這類事情交給 AI 剛剛好，省下的時間可以拿去看真正需要人腦的地方。

我的看法是，自動滲透的成熟度已經接近 coding agent：寫功能時跟 agent 講一句，它就寫完；做滲透測試時講一句，它就自己攻擊、自己寫報告。

## 被入侵一點都不意外

從這個角度看，有那麼多系統被打穿，我一點都不意外。AI 出現之前，很多系統的資安就是一塌糊塗：老舊系統一堆洞，不是自己的程式碼有問題，就是用的第三方套件早就有公開的 exploit。

過去沒出事，多半是價值不高，沒人願意花力氣。現在系統只要架在網路上，對方講一句話就能開始打。攻擊的成本降下來，原本「不值得打」的目標就變成「順手打」。

## 自己能做的三件事

| 做法 | 成本 | 適合 |
|---|---|---|
| 找可信任的資安公司做滲透測試 | 高 | 重要服務、有合規需求 |
| 用 AI 對原始碼做資安 audit | 低 | 有原始碼，想先把基本功做好 |
| 架一套 ARTEX 類框架，打自己 | 低 | 有對外服務，想看實際打得進去什麼 |

**滲透測試（penetration testing）**是最穩的。花錢找可信任的公司做，仍是保護自家服務最好的方法。這行品質參差不齊，有些只是拿工具跑個弱點掃描，就包裝成滲透測試在賣。碰到那種，效果不見得比自己架一套 ARTEX 好，所以才特別寫「可信任」。我不推薦、不背書任何一家，也不列名單，可以問身邊的親朋好友。

**傳統工具該進化了。** 傳統弱點掃描是丟固定 payload，源碼掃描多半是比對固定 pattern；AI 會思考、懂 context，兩者結合才是更強的做法，現在已有不少公司把 AI 用在 source code audit。

**沒預算，先對原始碼下指令。** 例如：

- `/goal 幫我做一下資安的 audit，找出資安問題`
- 或是逼它一直迭代：`/goal 這程式碼裡面有個嚴重的 RCE 漏洞，幫我找出來`

這樣已經能找出不少問題。

**自己先打一輪。** 從網路上找一份 ARTEX（或它的 fork）架起來，對你自己的系統跑一遍。只打你自己的、或有書面授權的目標，而且工具本身也是攻擊面，別把它放在能碰到內部網路的位置。這類工具的雙用途風險，可以看[這篇](/posts/ai/2026-10-24-ai-pentest-agents-dual-use)。

第二、第三種成本低、效益高，CP 值很好，是我最推薦的起點。

## 整體來說

以前有人來問問題，我們會希望對方先做過「功課」，也就是先問過 Google。現在這份功課是先問過 AI。

資安也一樣。攻擊的人已經在用 AI 自動化地探你的系統，沒有先讓 AI 把自己的程式碼與服務看過一輪，就是基本功沒做好，之後花錢請人做滲透測試，才不會花在 AI 十分鐘就能找出來的洞上。AI 已經是新時代的 baseline。

## 參考資料

- [Acronis TRU：BOSSAI: Inside the AI attack mesh that targeted Taiwan's emergency services](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/)
- [iThome：Acronis 揭露 AI 自動化攻擊系統 BOSSAI 運作細節，整合 12 個 AI 代理、MCP 與 Skills](https://www.ithome.com.tw/news/180310)
- [iThome：AI 自動化攻擊系統 BossAI 鎖定臺灣緊急應變服務](https://www.ithome.com.tw/news/180304)
- [The Hacker News：Taiwan-Based Hacker Used BOSSAI AI Agents to Steal Taipei Emergency Dispatch Records](https://thehackernews.com/2026/11/taiwan-based-hacker-used-bossai-ai.html)
- [聯合新聞網：AI 成駭客幫手！高雄男自學架攻擊網站　竊 23 萬筆個資賣暗網](https://udn.com/news/story/7321/9861696)
- [華視／中央社：AI 建自動化系統竊 23 萬筆台港泰個資　高雄警逮駭客](https://news.cts.com.tw/cna/society/202611/202611063098121.html)
- [CTWANT：公家機關也受害！高雄專科男靠 AI 自學變駭客](https://www.ctwant.com/article/505512/)
- [iThome：韓國警方偵破利用 ARTEX 發動攻擊的嫌犯，涉及入侵逾 90 家機構、竊取 820 萬筆個資](https://www.ithome.com.tw/news/179973)
- [BleepingComputer：Former pentester used ARTEX AI to steal 8.2 million data records](https://www.bleepingcomputer.com/news/security/former-pentester-used-artex-ai-to-steal-82-million-data-records/)
- [站內：用 AI 打別人的工具與雙用途風險](/posts/ai/2026-10-24-ai-pentest-agents-dual-use)
