---
title: "Product Builder 面試日練 — 2026-11-09：Product Sense"
date: 2026-11-09
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "用 Meta 新增的 AI 產品直覺面試看重的『Human Delta』框架,拆一題 Zoom AI 逐字稿讓出席率下降的真實面試題,再用 Wharton 最新研究裡 AI 自動定價把旗艦機種打 85 折掛三小時的真實案例,看少了這層人類判斷會出多大代價。"
tldr: "Human Delta 不是比 AI 更會想點子,是比 AI 更會抓『這個輸出哪裡怪』——面試考的是你有沒有先懷疑 AI 給的結論,而不是直接照著做;案例是一家消費電子公司少了這層審核,AI 自動上架把旗艦機種標成 85 折掛了三小時、700 多筆訂單才被抓到。"
series:
  name: "Product Builder 面試日練"
  order: 82
---

> 🌏 [English version](/posts/daily/2026-11-09-product-builder-interview-daily-en)

## 今日主題

2026 年下半年開始,Meta 在 PM 面試流程裡加了一輪新的關卡——「product sense with AI」,候選人要用 AI 現場把一個產品直覺題生成出方案,但面試官真正在評的不是提示詞寫得多漂亮,是你有沒有能力一眼看出「這個 AI 輸出哪裡怪」,然後把它修對。這個能力有個名字,叫 Human Delta:你比 AI 多加的那一段判斷。今天用這個框架拆一題真實流出的 Meta AI 產品直覺面試題,再用上個月剛發布的 Wharton 研究裡一個真實案例收尾——不是比喻,是一家公司真的因為少了這層審核,賠了好幾週的客服成本。

## 核心框架速記

### Human Delta 四層判斷(Meta product sense with AI 面試評的核心)

面試官拿到的不是你的提示詞,是你怎麼對待 AI 給你的第一版輸出。這四層由淺到深,前兩層省時間,後兩層才是真正拉分的地方:

| 層級 | 面試官在看什麼 | 常見失分 |
|---|---|---|
| **Human Delta** | 你有沒有抓出 AI 輸出裡的幻覺、泛用答案、或跟產品願景不一致的地方,並講清楚怎麼修 | 把 AI 給的方案當成答案直接唸出來,沒有加自己的判斷 |
| **Strategic Leverage** | 你有沒有把「分群、列功能草稿、列指標」這些基本功丟給 AI,把省下來的時間留給真正的取捨決策 | 全程自己手動做基本功,沒有時間討論真正困難的取捨 |
| **Product Direction** | 你能不能把一句模糊的題目翻譯成給 AI 的具體指令,並在輸出不夠深時主動加條件重新生成 | 給 AI 的指令跟題目一樣模糊,得到的輸出自然也模糊 |
| **Audit and Redirect** | 你能不能抓出 AI 沒注意到的可行性、政策、隱私風險或跨部門阻力,主動改方向 | 只檢查方案「聽起來合不合理」,沒檢查「能不能真的做」 |

這四層不是各自獨立的檢查表,是一個會反覆繞回去的迴圈——AI 給方案、人審查抓落差、沒過就加條件重新生成,過了才定案:

```diagram
title: Human Delta 判斷迴圈
desc: AI 生成初版方案後,PM 用稽核把落差抓出來,沒通過就加條件讓 AI 重新生成,通過才定案,而最終判斷責任永遠留在 PM 身上。
caption: 簡化示意:對應 Human Delta(抓落差)與 Audit and Redirect(抓可行性/政策風險)兩層判斷。
step: AI 依照 PM 的指令生成初版方案
step: PM 稽核:抓幻覺、泛用輸出、偏離產品方向的地方
step: 判斷這版稽核有沒有通過
step: 沒通過,加條件重新指令,回到 AI 重新生成
step: 通過,定案輸出,最終判斷責任留在 PM
---
<svg viewBox="0 0 460 460">
  <path class="dg-line" d="M230 84V136" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M230 204V256" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M230 324V376" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M320 292H400V52H320" marker-end="url(#arrow)" data-step="4"/>

  <g data-step="1 4">
    <rect class="dg-box" x="140" y="20" width="180" height="64" rx="6"/>
    <text class="dg-label" x="230" y="44" text-anchor="middle" dominant-baseline="central">AI 生成方案</text>
    <text class="dg-sub" x="230" y="64" text-anchor="middle" dominant-baseline="central">依 PM 指令產出初版</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="140" y="140" width="180" height="64" rx="6"/>
    <text class="dg-label" x="230" y="164" text-anchor="middle" dominant-baseline="central">PM 稽核</text>
    <text class="dg-sub" x="230" y="184" text-anchor="middle" dominant-baseline="central">抓落差、風險、偏離方向</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="140" y="260" width="180" height="64" rx="6"/>
    <text class="dg-label" x="230" y="284" text-anchor="middle" dominant-baseline="central">稽核通過？</text>
    <text class="dg-sub" x="230" y="304" text-anchor="middle" dominant-baseline="central">沒通過回頭重做</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="140" y="380" width="180" height="64" rx="6"/>
    <text class="dg-label" x="230" y="404" text-anchor="middle" dominant-baseline="central">定案輸出</text>
    <text class="dg-sub" x="230" y="424" text-anchor="middle" dominant-baseline="central">PM 承擔最終判斷責任</text>
  </g>

  <text class="dg-edge" x="405" y="172" text-anchor="start" dominant-baseline="central" data-step="4">否：加條件重新指令</text>
  <text class="dg-edge" x="245" y="352" text-anchor="start" dominant-baseline="central" data-step="5">是</text>
</svg>
```

## 今日練習題

### 題目

「你是 Zoom 的 PM。想像現在 AI 功能會把會議逐字稿寄給所有受邀者,結果會議出席率突然下降。你會怎麼辦?」(You're the sole PM for Zoom. Imagine that AI is sending transcripts of meeting notes to all invitees, and suddenly, meeting attendance is down. What do you do? 來源:Meta PM product sense with AI 面試真題,IGotAnOffer 整理自 2026 年候選人回報)

### 拆解思路

1. **釐清問題**:先問面試官——「出席率下降」是受邀者直接拒絕邀請,還是接受後中途離開或不開鏡頭?這個下降是從逐字稿功能上線後才開始,還是本來就有的趨勢?問清楚時間點跟定義,才知道自己要解的是不是真的是逐字稿造成的。
2. **定義使用者,先別急著定義問題是「壞事」**:這一步是今天的 Human Delta 核心——AI 把「出席率下降」這個現象丟給你,但這只是相關性,不是結論。先把會議切成兩種:一種是本來價值就不高、靠逐字稿就能補足資訊的會議(被跳過其實是好事,代表大家在用逐字稿省時間);另一種是真正需要即時互動、卻也被逐字稿取代掉的高價值會議(這才是真正的問題)。
3. **結構化分析**:用 Audit and Redirect 檢查逐字稿功能本身——逐字稿是寄給所有受邀者還是只有確認出席者?寄送時間是會議結束後還是提前預告「反正有逐字稿」?另外逐字稿裡可能包含敏感資訊,外部受邀者或可選參加者收到會不會有政策或隱私風險,這是 AI 自己不會主動提醒你的部分。
4. **提出方案**:短期先把逐字稿寄送分級——詳細逐字稿只寄給確認出席或主持人指定的對象,其他人拿到的是重點摘要,讓「出席」重新變成取得完整資訊的理由,而不是逐字稿讓出席這件事變得不必要;長期則是把這個訊號反過來用,主動標出「出席率低但逐字稿下載率高」的會議類型,建議主持人改成非同步形式,把真正省下來的時間還給團隊。
5. **定義成功**:北極星別用「整體出席率」,改用「高互動會議的出席率」,因為低價值會議被篩掉本來就是訊號應該往的方向;輸入指標盯逐字稿分級寄送後的出席率變化,護欄指標盯「逐字稿含敏感資訊卻寄給非出席者」的次數有沒有歸零。

### 範例回答(面試時可以這樣講)

> **先懷疑 AI 給的結論,不要直接接受**:「這題我會先確認『出席率下降』的定義——是拒絕邀請還是接受後沒出現,下降時間點是不是跟逐字稿功能上線吻合。但即使時間點吻合,我也不會馬上把這當成壞消息,因為出席率下降有兩種完全不同的意思:一種是大家發現某些會議本來就不用開,靠逐字稿就夠了,這其實是產品幫公司省了時間;另一種是真正需要討論的會議也被跳過,這才是我要解的問題。」
>
> **接問題跟方案**:「我會先把逐字稿寄送分級——目前是不管出席與否、所有受邀者都收到完整逐字稿,我會改成只有確認出席或主持人指定的人拿到完整版,其他人拿到的是重點摘要,這樣『出席』重新變成拿到完整資訊的理由。同時我會檢查逐字稿有沒有寄給外部或可選參加者這類本來不該看到敏感內容的人,這是 AI 自動生成時不會主動提醒我的風險,得自己去稽核。」
>
> **收在指標**:「北極星我會用『高互動會議的出席率』而不是整體出席率,因為低價值會議被篩掉是這個功能該有的效果;再加一個護欄指標盯逐字稿有沒有外流到不該看到的人手上。如果高互動會議的出席率也在跌,我才會認定這是真正的問題,回頭檢討分級寄送有沒有做對。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有沒有先懷疑「出席率下降」只是相關性,不是直接接受 AI 給的因果結論 | |
| 有沒有把會議拆成「被篩掉是好事」跟「真正需要互動卻被跳過」兩種 | |
| 有沒有抓出逐字稿本身的政策/隱私風險(這是 AI 不會主動提的) | |
| 方案有沒有分短期(分級寄送)跟長期(反過來當訊號用) | |
| 有沒有講出北極星跟護欄指標各是什麼 | |
| 加分項:有沒有把「出席率下降」反過來論證成產品在做對事 | |

## 今日案例

**少了 Human Delta 的代價:一家消費電子公司的旗艦機種,被 AI 自動上架成 85 折掛了三小時**

賓州大學華頓商學院(Wharton)與顧問公司 GBK Collective 在 2026 年 10 月中發布的報告指出,企業主管對「AI 代理犯下重大錯誤該算誰的責任」幾乎沒有共識——約四分之一的人認為是操作員工的責任,四分之一認為是主管,四分之一認為是公司風險團隊,剩下的算到供應商或答不出來。報告共同作者、GBK Collective 合夥人 Jeremy Korst 說,他問高階主管這個問題時,最常聽到的回答是「他們還沒想過」。報告裡引用員工監控軟體公司 Teramind 副總裁 Leeron Walter 提到的真實案例:一家美國消費電子公司的行銷員工用 AI 自動生成並發布產品定價,一個提示詞錯誤讓旗艦機種被標成 85 折,掛了整整三小時才被抓到,期間有超過 700 筆訂單成立,後續客服善後花了好幾週才收尾。另一個案例是某美國零售商用 AI 自動回覆客戶信件,一個提示詞錯誤讓系統在不到六小時內,把錯誤的退款與取消通知寄給超過 18,000 名顧客。

**面試連結**:這兩個案例是「少了 Human Delta 會發生什麼事」的真實版本——AI 自動生成定價、自動回覆客戶信件,看起來都是把基本功丟給 AI 做的正確動作(對應 Strategic Leverage),但中間缺了一層「有人在上線前稽核這個輸出合不合理」,風險就直接變成真金白銀的損失。面試被問到「你會不會讓 AI 自動發布」這類題目時,這兩個案例可以直接拿來當反例:凡是 AI 輸出會直接觸碰定價、客戶通知、對外內容這類不可逆的動作,流程裡一定要留一個人類稽核的關卡,而不是全自動。

## 延伸閱讀

- [Meta Product Sense Interview (questions, framework, prep)](https://igotanoffer.com/blogs/product-manager/facebook-product-sense-interview) — Human Delta 四層判斷框架的完整說明,以及 Meta product sense with AI 面試的真實題庫。
- [Product Manager Interview Questions 2026: 60 Questions That Reveal Real Skill](https://www.kore1.com/product-manager-interview-questions-2026/) — AI product literacy 在 2026 年面試裡怎麼被拆進各輪評分,以及「eval harness、fallback path」這類具體追問方向。
- [Product Manager Interview Practice & Mock](https://www.pmmockr.com/product-manager-interview-practice) — 可以接著練的產品設計、指標、策略類真題與解法大綱。

## 參考資料

- [Meta Product Sense Interview (questions, framework, prep)](https://igotanoffer.com/blogs/product-manager/facebook-product-sense-interview) — Human Delta、Strategic Leverage、Product Direction、Audit and Redirect 四層框架,以及 Zoom AI 逐字稿練習題出處。
- [Who's to blame if AI fails at work? Wharton study shows a split](https://www.thestar.com.my/tech/tech-news/2026/10/15/who039s-to-blame-if-ai-fails-at-work-wharton-study-shows-a-split) — 消費電子公司 85 折定價事故與零售商 18,000 封錯誤通知事故的原始出處(Bloomberg,引用 Wharton／GBK Collective 2026 年 10 月報告)。
- [Product Manager Interview Questions 2026: 60 Questions That Reveal Real Skill](https://www.kore1.com/product-manager-interview-questions-2026/) — AI product literacy 面試評分重點出處。
