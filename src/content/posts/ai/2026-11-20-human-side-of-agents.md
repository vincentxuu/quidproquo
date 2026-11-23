---
title: "人的那一面：交給常駐 agent 越多，你會失去什麼，信任又該怎麼調"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, automation, human-ai-interaction, trust]
lang: zh-TW
tldr: "常駐 agent 出錯時，最後要抓到錯的是你；但你交給它越多，抓錯的能力越差。這是 1983 年 Bainbridge 說的「自動化的諷刺」。2025 年以來的研究在 AI 上看到同樣的跡象：常用 AI 偵測息肉的內視鏡醫師，不用 AI 時的偵測率下降（觀察性研究，有其他解釋）；越相信 AI 的知識工作者，越少動腦檢查。信任也不對稱：一次時機不對的介入，扣掉的信任比一次對的介入補回來的多。做法是依兩題分配工作：出錯你能不能承受、你檢查得出它錯嗎；交出去之後，定期確認自己還做得來、還在看它做什麼。"
description: "Bainbridge 的「自動化的諷刺」放到常駐 agent 上是什麼意思，2025 年後關於 AI 去技能化、過度依賴與批判思考的研究與反證，Proactivity-Gym 30 人研究裡信任怎麼漲跌，確認疲勞為什麼讓人無腦按同意，以及替自己決定哪些事親手做、哪些交出去、用一陣子後要回頭檢查什麼。"
series:
  name: "常駐型 AI agent"
  order: 19
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-human-side-of-agents-en)

| 你交出去的 | 可能失去的 | 證據的強度 |
|---|---|---|
| 例行的判斷 | 判斷的手感，需要你接手時接不住 | 工業與醫療研究一致，AI 的長期資料還少 |
| 檢查它的工作 | 抓錯的能力：越信它，越少檢查 | 調查與實驗研究 |
| 安排行程、記待辦 | 對自己工作的掌握感 | 記者與使用者的個人經驗 |
| 每一次確認 | 確認本身的意義：按太多次就變成反射動作 | 廠商自己的說法 |

The Verge 的記者 Allison Johnson 把工作信箱、行事曆、Google 文件和 Slack 全部交給 Claude Duet 一週。[Johnson 在上手文裡寫](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)，Duet 有時真的幫上忙。例如它發現 Johnson 休假回來只剩兩個工作天就要交下一份大稿，主動提議調整，還擬好給編輯的 Slack 訊息。

但有一個念頭一直揮不去：

> I wonder if it would change how I work if I knew I didn't really need to take responsibility for putting things on my calendar, writing down a to-do list, or paying attention in a meeting because Duet will just handle it. Maybe that's how CEOs live.

Johnson 擔心自己會因此跟工作有點脫節。

前兩篇講 agent 做錯事。這篇轉向人：交給它越多，你會失去什麼，信任又該怎麼調。

## 自動化的諷刺

1983 年，倫敦大學學院的心理學家 Lisanne Bainbridge 發表了一篇只有五頁的短文〈[Ironies of Automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf)〉。Bainbridge 研究的是工廠控制室和飛機駕駛艙，但結論幾乎可以原封不動搬到常駐 agent 上。

自動化的設計者想把「不可靠的人」排除掉，結果留給人的是兩件最難的事：

- **出事時接手**：自動化處理不了的狀況，才會交回給人；但人很久沒親手做，技能已經退化。原文寫：「a formerly experienced operator who has been monitoring an automated process may now be an inexperienced one.」
- **監看它有沒有做對**：自動化之所以被裝上去，是因為它做得比人好；現在卻要人判斷它有沒有做好。Bainbridge 的結論是：「The human monitor has been given an impossible task.」

文中還引用警覺性研究：人很難對一個幾乎不出事的來源保持注意力超過半小時。系統越長時間正常運作，人越不會認真看它。

最後是這篇最常被引用的一句：系統越先進，人的角色可能越關鍵。原文是「the more advanced a control system is, so the more crucial may be the contribution of the human operator」。

密西根大學研究人機互動的 Vera Liao 對 [Vox 的記者](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent)總結了套到 AI agent 上的意思。自動化越先進，出錯的後果越嚴重；人越依賴自動化，越抓不到這些錯。

## 2025 年後的研究看到什麼

Bainbridge 的論點來自工業現場。AI 普及之後，開始有研究直接測這件事。

**用了 AI，不用時表現變差**：波蘭四家內視鏡中心在 2021 年底導入 AI 輔助偵測大腸息肉。[Budzyń 等人 2025 年發表在 The Lancet Gastroenterology & Hepatology](https://pubmed.ncbi.nlm.nih.gov/40816301/) 的研究，比較導入前後各三個月沒用 AI 的大腸鏡檢查。腺瘤偵測率從 28.4% 降到 22.4%。參與的 19 位醫師都做過兩千次以上的檢查。

這份研究有明顯的限制，作者自己也承認：它是觀察性研究。[英國 Science Media Centre 整理的專家意見](https://www.sciencemediacentre.org/expert-reaction-to-observational-study-looking-at-detection-rate-of-precancerous-growths-in-colonoscopies-by-health-professionals-who-perform-them-before-and-after-the-routine-introduction-of-ai/)裡，有學者指出導入 AI 後檢查量幾乎加倍，工作負荷變重本身就可能讓偵測率下降。三個月就讓資深醫師退化，也讓人懷疑是習慣改變，而不是技能流失。它是第一份大規模的真實世界證據，不是定論。

**越相信 AI，越少檢查**：微軟研究院和卡內基美隆大學的 [Lee 等人在 CHI 2025 發表](https://dl.acm.org/doi/full/10.1145/3706598.3713778)。他們調查 319 位每週都在工作上用生成式 AI 的知識工作者，收集了 936 個實際使用例子。結果是：對「AI 能做好這件事」越有信心，越少動用批判思考；對「自己能做好這件事」越有信心，越會去檢查 AI 的結果。

這是自評的問卷，量的是「覺得自己有沒有思考」，不是實際的表現。但它跟 Bainbridge 的方向一致：真正會檢查的，是自己本來就會做的人。

## 信任不是越高越好

人因工程講的是「信任校準」：信任要跟它實際的可靠程度對得上。信任太低，好用的工具也不敢用；信任太高，就會像上面那樣不再檢查。

Oh 等人在 2026 年提出 [Proactivity-Gym](https://harryoh99.github.io/foundations_of_proactive_agents/)，專門評估主動型 agent。他們找了 30 個人閱讀一週的互動紀錄、比較不同 agent 的做法，看到幾件事：

- **做對了，時機錯了，人照樣不領情**：在內容品質一樣的情況下，88.3% 的比較裡受試者選了介入方式合他們意的 agent。正確但跟手上工作搶時間的協助，只有 26.7% 被接受；在睡覺時做好、隔天早上還需要修改的協助，接受率是 97.8%。
- **信任掉得快、補得慢**：從一次對的介入變成一次不對的介入，信任平均掉 1.86 分（五分量表）；反過來只補回 1.27 分。「對、錯、對」的順序走完，信任停在 3.43，回不到一開始的 4.43。一位受試者說：「After one wrong action, an agent has to consistently behave well for a long time to recover trust.」

這份研究讓受試者讀的是寫好的情境，不是用自己的 agent 一段時間，作者也這樣註明。它測的是方向，不是你實際會有的反應。

另一個值得知道的發現是，過度依賴不全是心理的弱點。[史丹佛的 Vasconcelos 等人](https://dl.acm.org/doi/10.1145/3579605)做了五個實驗（共 731 人），發現人會「策略性地」決定要不要檢查 AI：檢查的成本越高，越容易直接照單全收。所以讓檢查變便宜，例如 agent 把它依據哪封信、哪個檔案講清楚，比叫人「多注意一點」有用。

## 確認疲勞

常駐 agent 的標準答案是「重要的事先問你」。但問得太多，問題就變了。

[OpenAI 在說明內部怎麼管理常駐 agent 時](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai)寫得很直接：一直要人審查，會造成審查疲勞，人會被訓練成對所有權限提示都盲目接受。他們的做法是讓第二個模型先過濾，把人的注意力留給真正重要的核准。[order 13](/posts/ai/2026-11-20-openclaw-enterprise) 講過這個設計。

這是 Bainbridge 的監看問題換了一個樣子：你按「同意」的次數越多，每一次按下去的意義越少。

## 交出去不一定是壞事

把事情交給工具，心理學叫「認知卸載」。[Risko 和 Gilbert 在 2016 年的回顧](https://samgilbert.net/pubs/Risko2016TiCS.pdf)指出，它有真正的好處：設提醒比靠記憶可靠，存起來的資訊比腦中的不容易走樣。

代價也有實證：開車全程跟導航走的人，事後記不太得路上的景物，第二次不靠導航時開得比較差。而人常常高估卸載的好處，連根本記得住的東西也想寫下來。

所以重點不是「不要交出去」，而是挑對的東西交。Liao 給 Vox 的建議是：「Choose to use agents for tasks that you can tolerate the consequences of errors.」

MIT 的 Pattie Maes 在同一篇報導裡提醒了另一個代價。每個人都把事情丟給 agent，世界上會有越來越多 AI 產生的訊息、信件和預約；最後被迫應付它們的，是另一端的人。系列的 order 22 會講這一端。

## 替自己分配：哪些交出去、哪些留著

用兩個問題把要交給 agent 的事分成四格：

| | 你檢查得出它錯 | 你檢查不出它錯 |
|---|---|---|
| **出錯你承受得起** | 放心交出去，偶爾抽查 | 可以交，但要接受錯了也不知道 |
| **出錯你承受不起** | 交出去，但每次都要你核准 | 留著自己做 |

再加一個問題：**這件事的能力，你需不需要保持？**

- 需要（例如你的專業判斷、寫作、跟重要客戶的關係）→ 就算放在「放心交出去」那格，也定期自己做一次。
- 不需要（例如整理收據、排會議時間）→ 交出去就好。

Johnson 的結論可以當例子。讓 Duet 在各處訊息之間找出被漏掉的矛盾，是「as a backstop for my own organizational systems, not as a replacement for them」；寫稿這件事，完全不交。

## 用一陣子後要回頭檢查什麼

交出去兩到四週後，問自己這幾題：

1. **最近一次發現它出錯是什麼時候？** 如果想不起來，不一定代表它沒錯，可能是你沒在看。
2. **不靠它，你還做得來嗎？** 挑一件交出去的事，自己做一次。
3. **你按「同意」之前，還有在讀嗎？** 如果大多直接按，就該減少要你確認的項目，把剩下的變得值得讀。
4. **它的介入時機還對嗎？** 在你專心時打斷你的通知，即使內容是對的，也該調成整理好、晚點再給。
5. **你對它的信任，跟它的表現對得上嗎？** 它出過一次大錯之後，你是不是從此不敢用；或是它一直沒出錯，你就完全不檢查了。

## 特別要留意的情況

這篇不是產品篇，換成「什麼情況要特別留意」：

- 你交出去的是自己的專業核心，而且已經很久沒親手做。
- agent 很少出錯，你已經不太看它做了什麼。
- 確認通知多到你看都不看就按。
- 你剛入行，還在學這份工作：Bainbridge 提醒過，後來的人沒機會培養前一代靠手做累積的技能。

這些問題跟產品無關，台灣用得到的每一個常駐 agent，以及自架的 OpenClaw、Hermes 都一樣。

信任要靠證據校準。[下一篇](/posts/ai/2026-11-20-evaluating-always-on-agents)看怎麼評估一個常駐 agent 到底有沒有用：記者實測的價值與限制，以及現有評測量到什麼、量不到什麼。

## 參考資料

- [Ironies of Automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf)（Lisanne Bainbridge，Automatica 19(6)，1983）
- [Claude's Duet agent is a little neurotic and surprisingly helpful](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)（The Verge，2026-11-13）
- [AI agents like Muse and Instinct can do your tedious tasks. But should they?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent)（Vox，2026-10-16）
- [Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy](https://pubmed.ncbi.nlm.nih.gov/40816301/)（Budzyń 等，The Lancet Gastroenterology & Hepatology，2025）
- [Expert reaction to observational study looking at detection rate of precancerous growths in colonoscopies](https://www.sciencemediacentre.org/expert-reaction-to-observational-study-looking-at-detection-rate-of-precancerous-growths-in-colonoscopies-by-health-professionals-who-perform-them-before-and-after-the-routine-introduction-of-ai/)（Science Media Centre，2025-08-12）
- [The Impact of Generative AI on Critical Thinking](https://dl.acm.org/doi/full/10.1145/3706598.3713778)（Lee 等，CHI 2025）
- [Foundations of Proactive Agents](https://harryoh99.github.io/foundations_of_proactive_agents/)（Oh 等，2026，含 Proactivity-Gym）
- [Explanations Can Reduce Overreliance on AI Systems During Decision-Making](https://dl.acm.org/doi/10.1145/3579605)（Vasconcelos 等，CSCW 2023）
- [Cognitive Offloading](https://samgilbert.net/pubs/Risko2016TiCS.pdf)（Risko 與 Gilbert，Trends in Cognitive Sciences，2016）
- [Securing persistent agents like OpenClaw at OpenAI](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai)（OpenAI Developers）
