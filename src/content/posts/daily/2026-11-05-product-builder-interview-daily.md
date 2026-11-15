---
title: "Product Builder 面試日練 — 2026-11-05：AI Product Design"
date: 2026-11-05
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "AI Product Design 面試日練：用可逆性、可稽核性、影響範圍三道關卡，判斷 AI agent 的動作該自動跑還是等人核准。"
tldr: "今天的核心框架是風險分級：用可逆性、可稽核性、影響範圍三道關卡，決定 AI agent 的動作該自動跑還是等人核准；練習題是重新設計一個客服退款 agent 的審核流程。"
series:
  name: "Product Builder 面試日練"
  order: 78
---

> 🌏 [English version](/posts/daily/2026-11-05-product-builder-interview-daily-en)

## 今日主題

2026 年企業大規模導入 AI agent 之後，面試裡「AI product design」這題已經很少停在抽象的「要不要讓 AI 自主」，而是直接給一個具體場景：某個動作該不該等人核准。Kore.ai 今年 5 月調查超過 400 位美國企業 IT 主管，79% 說自己撤銷過 AI agent 執行的動作，70% 遇過團隊沒抓到的失誤——這代表面試官手上有大量真實失敗案例可以拿來考你，光喊「human-in-the-loop」口號不夠，要能講出具體的分級規則。

## 核心框架速記

### 風險分級表（人機任務分配）

把 AI agent 的動作依「做錯了能不能收回」分成四級，每一級配不同的把關方式：

| 等級 | 例子 | 把關方式 |
|------|------|---------|
| 讀取 | 查訂單、搜尋文件 | 不卡，但限制只能看使用者有權限看的範圍 |
| 建議／草擬 | 寫回信草稿、提出一筆分類建議 | 不卡，輸出是文字不是動作，人看了再決定 |
| 可逆的寫入 | 標記票單狀態、建立草稿 | 輕量把關：確認＋容易復原 |
| 難復原的寫入 | 退款、發出對外訊息、刪除紀錄 | 明確核准：看得到動作本身、前後對照、agent 給的理由 |

（這張表整合了 Orbilon、Nordbeam、Arize 三篇 2026 年文章一致的分級邏輯，各家用詞略有差異，但「依後果分級、不是齊頭式審查」是共同結論。）

### Trust Calibration 三問

判斷一個動作要不要落到「難復原的寫入」那一級，問三個問題（出自 Viktor 2026 年部落格的決策規則）：

1. **可逆性**：系統能在一分鐘內復原最後一步嗎？不能就先攔下來。
2. **可稽核性**：審核這個結果，會比重做一次更快嗎？不行就要求 agent 先附證據，不能只靠信任。
3. **影響範圍**：出錯的話，除了提問的人以外還會傷到誰？如果答案包含顧客、金錢或正式環境，就該由人拍板。

```diagram
title: AI agent 的動作要不要等人核准
desc: 用可逆性與影響範圍兩道關卡判斷 AI agent 的動作能不能自動跑，過不了才讓人核准
caption: 簡化示意：完整版還有「審核是否比重做快」的可稽核性關卡，見上方三問
step: 動作準備執行
step: 判斷一分鐘內能不能復原
step: 能復原就自動跑，只留紀錄
step: 不能復原就接著看影響範圍
step: 範圍小就自動跑，但定期抽查
step: 會波及顧客或金流就等人核准
---
<svg viewBox="0 0 640 480">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 108V144" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M376 188H432" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M280 232V268" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M376 312H432" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 356V392" marker-end="url(#arrow-warn)" data-step="6"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="184" y="60" width="192" height="48" rx="6"/>
    <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">agent 想執行一個動作</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 144L376 188L280 232L184 188Z"/>
    <text class="dg-label" x="280" y="178" text-anchor="middle" dominant-baseline="central">一分鐘內能復原？</text>
    <text class="dg-sub" x="280" y="200" text-anchor="middle" dominant-baseline="central">可逆性</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="432" y="164" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="188" text-anchor="middle" dominant-baseline="central">自動跑，只留紀錄</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M280 268L376 312L280 356L184 312Z"/>
    <text class="dg-label" x="280" y="302" text-anchor="middle" dominant-baseline="central">波及顧客或金流？</text>
    <text class="dg-sub" x="280" y="324" text-anchor="middle" dominant-baseline="central">影響範圍</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="432" y="288" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="312" text-anchor="middle" dominant-baseline="central">自動跑，定期抽查</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="168" y="392" width="224" height="64" rx="6"/>
    <text class="dg-label" x="280" y="412" text-anchor="middle" dominant-baseline="central">等人核准</text>
    <text class="dg-sub" x="280" y="434" text-anchor="middle" dominant-baseline="central">附理由與前後對照</text>
  </g>

  <text class="dg-edge" x="404" y="176" text-anchor="middle" dominant-baseline="central" data-step="3">是</text>
  <text class="dg-edge" x="290" y="250" text-anchor="start" dominant-baseline="central" data-step="4">否</text>
  <text class="dg-edge" x="404" y="300" text-anchor="middle" dominant-baseline="central" data-step="5">否</text>
  <text class="dg-edge dg-text--warn" x="290" y="374" text-anchor="start" dominant-baseline="central" data-step="6">是</text>
</svg>
```

這三問背後是同一個洞見：**over-trust 和 under-trust 都是設計失敗，只是代價不同**。把所有動作都卡人審，代價是主管被淹沒、agent 形同虛設；把所有動作都放手，代價是一次退款出錯就毀掉客戶信任。面試考的就是你能不能把這個抽象取捨，落成一張具體的分級表。

## 今日練習題

### 題目

你的客服 AI agent 現在不管做什麼動作都要人核准：讀取訂單、草擬回信、更新票單、退款，一律卡在同一關。支援主管一天要核准六十件，大多是機械式的複製貼上，一個月後主管幾乎不看內容就直接放行。主管抱怨人力卡在審核上，但產品團隊擔心一放寬審核，退款出錯會變成客訴甚至信任危機。你會怎麼重新設計這個審核流程？

(來源: 自擬，based on 真實客服退款 agent 審核重設計案例，見 codestringers.com「Human in the Loop AI: Gate the Irreversible Step」)

### 拆解思路

1. **釐清問題**：先問面試官現在卡審核的動作種類有哪些、各占比多少、過去被主管推翻或改動的比例是多少——這決定哪些動作其實從沒出過事。
2. **定義使用者**：誰在審核（支援主管）、誰承擔風險（顧客信任、公司財務）、誰因為流程卡住而受害（主管的時間、agent 的反應速度）。
3. **結構化分析**：套用風險分級表，把讀取、草擬、更新票單、退款四種動作分別歸到四個等級，而不是用「AI 功能」或「部門」這種跟風險無關的切法。
4. **提出方案**：讀取和草擬完全放手；更新票單用輕量確認＋可復原；只有退款和對外訊息要人看到完整的前後對照與 agent 給的理由才能放。
5. **定義成功**：審核量要降到主管能認真看完的量（而不是看都不看直接放行），同時退款誤發率、客訴量不能因為放寬審核而上升。

### 範例回答（面試時可以這樣講）

> **先把「審核」這個詞拆開**：我會先去看過去一個月的審核紀錄，發現讀取和草擬類的動作幾乎從來沒被主管改過或退回，真正需要人判斷的只有退款和對外訊息這兩類，但現在四種動作混在一起審，主管才會一天看六十件、看到疲乏。
>
> **接著套風險分級**：讀取訂單、搜尋歷史紀錄完全放手跑，因為查錯了不會造成任何後果；草擬回信也放手，因為那只是文字，人要發出去前還會看一眼；更新票單狀態我會做成「自動跑＋留紀錄＋一鍵復原」，因為標記錯了成本很低；只有退款和發出對外訊息這兩個難復原、會直接影響顧客和公司財務的動作，才要求明確核准，而且核准畫面要同時給 agent 判斷的依據、金額和顧客歷史，不是只給一個「同意／拒絕」按鈕。
>
> **取捨與風險**：這麼做之後主管一天要看的件數會從六十件掉到個位數，但每一件的審核品質會比之前「秒放行」高很多；風險是前兩週可能會抓到幾個原本該卡在票單層的邊緣案例，我會先用 10% 流量做漸進放量，同時盯退款誤發率和客訴量，確認沒有真的升高才全量放手。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 問題定義：先拆解現有審核動作的種類與過去被推翻的比例 | |
| 框架運用：套用依後果分級，而不是齊頭式審查 | |
| 具體方案：哪些動作放手、哪些要人核准、核准畫面長怎樣 | |
| 成功指標：審核量下降 + 誤發率／客訴量沒有上升 | |
| 風險或 edge case：漸進放量、邊緣案例怎麼抓 | |
| 加分項：點出 over-trust／under-trust 是對稱的設計失敗，不是只防一邊 | |

## 今日案例

**某 120 人規模 B2B 公司的客服退款 agent：重新分級審核流程**

這家公司原本每個 agent 動作都要人核准，支援主管一天要核准約六十件，一個月後幾乎每一件都在幾秒內被放行——審核已經名存實亡。重新設計後把動作拆成三級：讀取和草擬完全自由跑，只抽樣一成給主管看；更新票單與訂單備註算可復原寫入，記錄但不卡人；只有退款本身和對外訊息屬於難復原動作，才要求人看過訂單、agent 依據的政策條款與金額後才能放行。重新分級後主管一天只看約十五件，其中約八分之一會被拒絕或修改——審核終於變成真的在判斷，不是蓋章儀式。

**面試連結**：這個案例可以直接拿來回答「怎麼設計 AI 功能的人機協作邊界」類問題，示範你知道怎麼把抽象的「human-in-the-loop」落成可執行的分級規則與數字（審核量、拒絕率），而不是停在「都要人審」這種沒有取捨的答案。

## 延伸閱讀

- [Human in the Loop AI: Gate the Irreversible Step](https://www.codestringers.com/articles/human-in-the-loop-put-the-gate-at-the-irreversible-step) — 今日案例的完整退款 agent 分級重設計過程。
- [What AI Agents Cannot Do Yet: An Honest Take (2026)](https://viktor.com/blog/what-ai-agents-cant-do) — 今日練習題三問框架（可逆性、可稽核性、影響範圍）的出處。
- [AI Product Designer: Role, Skills, Salary & Challenges (2026)](https://provn.co/roles/product-designer) — trust calibration 作為 AI 產品設計師正式職責的說明，以及 EU AI Act Article 50 揭露義務。

## 參考資料

- [79% of Enterprises Have Undone an AI Agent's Action](https://orbilontech.com/ai-agent-rollback-audit-trail) — 今日主題開頭引用的 Kore.ai 79%／70% 調查數字。
- [Human in the Loop AI: Gate the Irreversible Step](https://www.codestringers.com/articles/human-in-the-loop-put-the-gate-at-the-irreversible-step) — 核心框架表與今日案例的分級邏輯來源。
- [What AI Agents Cannot Do Yet: An Honest Take (2026)](https://viktor.com/blog/what-ai-agents-cant-do) — Trust Calibration 三問的原始出處。
- [Human-in-the-Loop AI Agents: Approval Design](https://nordbeam.io/blog/human-in-the-loop-ai-agents) — 風險分級表交叉比對來源之一。
- [What Are AI Agents? Architecture, Tools & How They Work](https://arize.com/ai-agents) — 風險分級表交叉比對來源之二。
