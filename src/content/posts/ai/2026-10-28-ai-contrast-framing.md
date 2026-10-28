---
title: "「不是 X，是 Y」怎麼改：否定式對比的三種句型、頻率與留刪判準"
date: 2026-10-28
category: ai
type: deep-dive
tags: [llm-writing, llm, writing-process]
lang: zh-TW
tldr: "對每一句否定式對比問兩件事：讀者心裡真的有 X 嗎？否定 X 會讓讀者多知道什麼嗎？任一個沒有，就刪掉 X 直接寫 Y。NLP 論文的 rather than 從 2019 到 2026 年變成約 7 倍，五個商用模型寫中文時，這類句式的密度是人類參考語料的 2.5–9.2 倍；模型幾乎沒用錯，但一半以上可有可無，一篇用了八次，總有一句會讓讀者煩。"
description: "LLM 常寫的否定式對比（不是 X 而是 Y、rather than、X, not Y）有哪三型、2026 年的研究量到多常見、為什麼多數單句沒錯卻讓人煩，以及每一句該留或該刪的兩個判準與改寫範例。"
series:
  name: "AI 通病"
  order: 1
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-28-ai-contrast-framing-en)

## 這是什麼句型

否定式對比是先講一個說法不對，再給出作者要的說法：「四個起點不是四種功能，是四種 loop 歸屬的安排」。這是[「AI 通病」系列](/posts/ai/2026-10-28-ai-common-failures-overview)的第一個通病，也是目前證據最多的一個：中英文都有語料統計，也有實驗追到訓練資料。

[Zamaraeva 等人（2026）](https://arxiv.org/abs/2610.10092)把這個句型家族分成三型，中文都有對應：

| 型 | 英文 | 中文 | 例句 |
|---|---|---|---|
| 替換 | rather than、instead of | 「而非」「與其…不如」 | 「它管理的是狀態而非連線」 |
| 否定 | not X but Y、X, not Y | 「不是 X，而是 Y」「是 Y，不是 X」 | 「問題不在模型，在資料」 |
| 加強 | not only/just X but Y | 「不只 X，更 Y」 | 「它不只快，更省錢」 |

三型的作用相同：用一個被拒絕的 X 來定義 Y。差別只在 X 和 Y 誰先出現、X 被否定得多徹底。

## 多常見

Zamaraeva 等人比對 4,744 篇 ACL 2019 論文與 1,821 篇 2026 年的 ACL 風格 arXiv 論文：

- `rather than` 從每千字 0.134 次增加到 0.993 次，約 7 倍。
- 後置的「X, not Y」從 0.049 增加到 0.201 次。
- `instead of`、`as opposed to` 反而變少了。增加的不是整個家族，主要集中在 `rather than` 和後置否定。

他們也讓模型只看真實論文的標題與摘要，從頭寫一篇論文。GPT-5.6-sol 和 GPT-6-sol 寫的每一篇都用了 `rather than`；Claude Haiku 4.5、Sonnet 5.5、Opus 5.5 幾乎每篇都用，密度比這兩個 GPT 模型低。

中文的情況由 [Peng 等人（2026）](https://arxiv.org/abs/2610.22249)量化：五個商用模型寫「不是X，而是Y」的密度，是人類參考語料的 2.5 到 9.2 倍。

### 被轉錯的「三倍」

中文圈流傳一個說法：AI 寫「不是A而是B」的頻率是人類的三倍，出處掛 AI 偵測公司 Pangram（例如[這篇知乎文章](https://zhuanlan.zhihu.com/p/2065864387496251506)）。[Pangram 的原始頁面](https://www.pangram.com/signs-of-ai-writing)量的是英文的 "Not just X but Y"，也就是加強型，每萬字人類 1 次、AI 3 次。語言和句型都轉錯了。中文否定型的數字要看 Peng 等人的 2.5–9.2 倍。

## 多數單句沒錯，用多了總會踩到

這個句型難處理的地方，是大部分句子單獨看都沒有錯。

Peng 等人把 307 個模型寫出的「不是X，而是Y」分成三類（標籤由 Claude Sonnet 5.5 產生，再經人工審核）：

- **實質**：上下文裡真的有人可能相信 X，否定它讓讀者多知道一件事。約 46%。
- **可有可無**：句子正確，但拿掉 X 什麼也沒少。52.8%。
- **有缺陷**：用錯了。只有 1.3%。

所以模型的問題出在用得太多，錯誤率其實很低。

Zamaraeva 等人找了兩位常審 ACL 論文的研究者，在不知道出處的情況下標注每個 `rather than` 煩不煩人。2019 年的用法幾乎沒有人覺得煩；2026 年的用法約十個有一個。兩位標注者很少同意是哪一句，但一篇 2026 年論文平均用這個句型約八次，所以約一半的論文裡，至少有一句會讓其中一位標注者覺得煩。

被標成煩人的那些句子有一個共同點：被否定的 X 被講得比較差，其他人也比較常判斷它是稻草人，也就是沒人真的主張的說法。

## 判準：兩個問題

Peng 等人用一棵決策樹判斷每個用法屬於哪一類。濃縮成寫作時能用的版本，就是兩個問題：

1. **讀者心裡真的有 X 嗎？** 前文提過、讀者常見的誤解、對方說過的話，都算有。作者自己想像出來的不算。
2. **否定 X 會讓讀者多知道什麼嗎？** 例如糾正一個會讓讀者做錯事的誤解。

兩個都是「有」才留。任一個是「沒有」，就刪掉 X，直接寫 Y。

還有第三個要看整篇的問題：**這是這一節的第幾次？** 單一句子留著合理，一節裡出現三次，讀者就開始注意句型，不注意內容了。我的做法是一節最多留一句。

## 改寫範例

**例一：X 沒人主張，刪掉**

> 四個起點不是四種功能，是四種「loop 歸誰跑」的安排。

沒有讀者以為這四個 class 是四種功能，X 是作者自己架的。刪掉 X 之後，「四種 loop 歸屬的安排」本身也是抽象說法，所以要再往下寫到答案：

> 已經有 harness 就用 PiHarness；做 chat、每次模型呼叫要自己組，用 AIChatAgent，想交給框架就用 Think；不是 chat 但需要狀態、排程、MCP，用 Agent。

（改寫後的句子裡也有「不是 chat」，但這是分流條件，不是對比：它告訴讀者什麼情況走這條路。）

**例二：X 是被拿來墊高 Y 的**

[Wikipedia 的 AI 寫作特徵整理](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)收錄了一段草間彌生自畫像條目的修訂：

> The viewer is presented with a self-image that is not grounded in visual mastery, but in what Amelia Jones terms "the performative enactment of subjectivity".

沒有人主張這幅畫的重點在技法，否定它只是為了讓後半句顯得有分量。改成：「這幅自畫像是一種主體性的表演（借用 Amelia Jones 的說法）。」

**例三：X 是真實誤解，留下**

> HTTPS 加密的是傳輸內容，不是你連到哪個網域：TLS 握手時的 SNI 欄位預設是明文（除非雙方都支援 ECH）。

很多人以為用了 HTTPS，別人就看不到自己連去哪個網站。這個 X 真實存在，否定它會改變讀者的判斷，所以留著。

## 同一家族：三連排比

否定式對比常和另一個習慣一起出現：把東西湊成三個一組（「過去、現在與未來」）。Pangram 的語料統計裡，三連排比在 AI 文字每萬字 19 次、人類 5 次，約 4 倍。判準一樣：三項各自帶來新資訊就留；第三項只是為了湊節奏，就刪掉。

## 模型修訂時，對比會換一種句型

Zamaraeva 等人讓模型依審稿意見修訂自己寫的論文（prompt 裡沒有任何關於對比句的指示）。Claude Sonnet 5.5、Opus 5.5 和 GPT-6-sol 修訂後，`rather than` 沒有一致變多，後置的「X, not Y」卻明顯增加。作者逐句檢查後也說，被刪掉的 `rather than` 剛好換成另一種對比句型，是例外而非常態。

這個實驗沒有下任何禁令，但它提醒了一件事：只壓一個說法，未必壓得住背後的習慣。比較穩的指示是告訴模型要寫什麼，例如「直接陳述結論；只有在糾正讀者可能真的相信的說法時才用對比」。禁令什麼時候有用，留給第 7 篇。

## 為什麼模型愛用

兩篇研究都追到了訓練資料：

- Zamaraeva 等人發現，公開偏好資料裡的人類評分者偏好帶 `rather than` 的回答，四個開源獎勵模型也偏好；在 system prompt 裡要求模型「誠實」，會讓這類句型變多。
- Peng 等人發現，好幾個獎勵模型偏好這個句式，就算拿品質相當的改寫版本來比也一樣；LLM 評審在上下文不需要對比時也偏好它。

Zamaraeva 等人的推測是：訓練時的偏好比較一次只看一個回答，看得到「這句劃清了界線，顯得嚴謹」的好處，看不到同一篇用了八次的代價。這還是推測。

兩篇研究也有一處結果相反：Zamaraeva 等人測 Tülu 3 8B 的 SFT、DPO 和最終版本，這個句型在三個階段都沒有變多；Peng 等人在同一個模型家族上，卻看到 SFT 和偏好最佳化之後頻率上升。到底是哪個訓練階段帶進來的，目前還沒有定論，第 5 篇會一起整理。

## 什麼時候該留

否定式對比本來就是好用的修辭，人類寫作裡它一直都在：Peng 等人的人類參考語料一樣有這個句式，只是密度低得多。Pangram 自己也在同一頁寫明，單一特徵不能證明一篇文字是 AI 寫的。

所以判斷這個句型，要看 X 存不存在、否定它有沒有用，不看「像不像 AI」。人寫的稻草人對比一樣是空話；AI 寫的、糾正了真實誤解的對比，一樣該留。

## 今晚就能做的事

1. 打開一篇自己（或 AI）寫的草稿，搜尋「不是」「而是」「不只」「而非」，英文稿搜尋 `rather than`、`not just`、`, not`。
2. 從標題、tldr、每節第一句開始看，這些位置的空話最傷。
3. 每個命中問那兩個問題，任一個答不出來就改寫成直接陳述。
4. 同一節留下來的超過一句，挑最有用的那句留。

## 自我檢查

下面五句該留還是該改？要改的話怎麼改？

1. 「這個工具不只是一個編輯器，而是一個完整的開發平台。」
2. 「`git reset --hard` 刪掉的不是 commit，是還沒 commit 的修改；被移開的 commit 還能從 reflog 找回來（預設保留 30 天）。」
3. 「成功的關鍵不是技術，而是團隊文化。」
4. 「我們選 PostgreSQL 而非 MongoDB，因為訂單資料需要跨表交易。」
5. 「這篇文章不是要教你寫程式，而是要帶你理解背後的思維。」

<details>
<summary>參考答案</summary>

1. 改。沒有人以為它只是編輯器，X 是稻草人。直接寫它多了什麼：「它內建終端機、除錯器和部署流程。」
2. 留。很多人以為 reset 會把 commit 弄丟，否定它會改變讀者的做法。
3. 改。X 和 Y 都很抽象，讀者拿不到任何東西。寫出具體做法，或刪掉。
4. 留。兩個選項都是讀者實際在考慮的，「而非」後面還給了理由。
5. 改。這是指示型的自我介紹（系列第 3 篇的通病），X 也沒人主張。直接寫讀者讀完能做什麼。

</details>

## 參考資料

- [Zamaraeva et al. (2026). I would rather quit NLP than read another paper like this: The rise of antithesis in NLP papers. arXiv:2610.10092](https://arxiv.org/abs/2610.10092)
- [Peng et al. (2026). Not X, but When: Diagnosing a Mandarin LLM Writing Tic through Contextual Appropriateness. arXiv:2610.22249](https://arxiv.org/abs/2610.22249)
- [Pangram: 9 Signs of AI Writing, Backed by Data](https://www.pangram.com/signs-of-ai-writing)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [知乎：「不是，而是」成了 AI 的口頭禪](https://zhuanlan.zhihu.com/p/2065864387496251506)（中文，轉述 Pangram 數字的例子）
