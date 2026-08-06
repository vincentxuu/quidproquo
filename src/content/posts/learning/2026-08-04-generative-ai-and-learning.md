---
title: "AI 讓你在該困難的地方變順：生成式 AI 對學習做了什麼"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [ai-and-learning, learning-science, llm, metacognition, self-learning]
lang: zh-TW
series:
  name: "Learning How to Learn"
  order: 2
tldr: "AI 教育界被引用最多的那篇 meta-analysis（g = 0.867、瀏覽近 50 萬次）已於 2026 年 4 月被 Nature 撤稿。但正向結論沒被推翻——問題是它測的是「AI 在手時的表現」。Bastani 的 PNAS RCT 測了另一件事：練習時用 GPT-4 正確率 +48%，收走後考試比從沒用過的低 17%。"
description: "生成式 AI 對學習的實證：撤稿事件、未撤稿的正向 meta-analysis 為何與 Bastani 的 RCT 不矛盾，以及認知卸載相關研究該引用到什麼強度。"
draft: false
faq:
  - q: "用 ChatGPT 學習，會讓我學得比較差嗎？"
    a: "如果你用它直接要答案，會。Bastani 等人 2025 年發表於 PNAS 的隨機對照試驗把近千名高中生分三組：練習時能用原生 GPT-4 的那組成績提升 48%，但存取權被收走後，考試成績比從來沒用過 AI 的對照組還低 17%。改用只給提示不給答案的版本，傷害被抵銷，但考試成績也只是跟對照組打平——防護能止血，不會讓你學得更好。"
  - q: "那些說 AI 有助學習的研究是錯的嗎？"
    a: "不是全錯，但它們測的多半是另一件事。多數正向 meta-analysis 量的是「AI 在手時的表現」，而不是「AI 收走之後還剩下什麼」。Deng 等人 2025 年那份 meta-analysis 自己就指出這個問題，並建議改用監考評量，以區分「ChatGPT 產出的品質」與「學生真的學到的東西」。另外要注意：被引用最多的那篇（g = 0.867）已在 2026 年 4 月被 Nature 撤稿。"
  - q: "怎麼用 AI 才不會傷害學習？"
    a: "把 AI 放在提示的位置，不要放在答案的位置——先自己卡一次，再問。這條規則有兩個實驗支撐：Bastani 的 GPT Tutor 組只給教師設計的提示，就把傷害消掉了；MIT 的研究裡，從自己寫再換成用 LLM 的那組表現最好。判斷訊號很簡單：如果過程變順了，那通常就是你沒在學的時候。"
---

> 🌏 [English version](/posts/learning/2026-08-04-generative-ai-and-learning-en)
>
> 本文是「Learning How to Learn」下篇。[上篇拆解了學習科學本身的證據](/posts/learning/2026-08-04-learning-how-to-learn)——哪些技術站得住、哪些只是比喻、哪些已被推翻。這篇只處理一個問題：**LLM 進來之後，那些原則怎麼變。**

上篇的結論可以壓縮成一句話：**學習的主觀流暢感，跟長期保留度是反相關的。** 幾乎所有有實證支撐的技術，都長得像「讓當下變難一點」——這就是 Robert Bjork 說的 desirable difficulties。

如果這句話成立，那生成式 AI 對學習的威脅就不只是抄襲，而是更根本的東西：**它的產品定位，就是讓困難消失。** 這篇要看的是這個直覺有沒有實證支撐、支撐到什麼強度。

先從一件該講而很少人講的事開始。

## 被引用最多的那份證據，已經被撤稿了

2025 年 5 月，Wang 與 Fan 在 Springer Nature 旗下的 *Humanities and Social Sciences Communications* 發表一篇 meta-analysis，統合 51 個研究，結論是 ChatGPT 對學習表現有「大幅正向影響」，g = 0.867。這個數字後來被政策簡報、教育科技行銷、無數論文引用。[到撤稿前它累積約 486,000 次瀏覽、266 篇引用、Altmetric 分數約 1,023](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns)。

2026 年 4 月 22 日，[期刊發出撤稿公告](https://www.nature.com/articles/s41599-026-07310-z)：

> 編輯決定撤回本文，原因是對該 meta-analysis 中的差異存有疑慮。這些疑慮最初由 Magnus Ingebrigtsen 與 Marko Lukic 提出。綜合而言，所發現的問題削弱了編輯對該分析效度及其結論的信心。作者未回應關於本次撤稿的通信。

引用它的兩百多篇論文不會跟著被撤。這件事本身就是本文主題的元層次示範：**流暢、好聽、可引用，不等於真的。**

## 正向結論沒被推翻，但它測的不是同一件事

但不要因此走到另一個極端。**正向結論本身沒有被這次撤稿推翻。** 同一份期刊在 2026 年刊出[另一篇 meta-analysis](https://www.nature.com/articles/s41599-026-07019-z)，統合 35 個研究、134 個效果量，得到 g = 0.670（95% CI [0.495, 0.844]），且偏誤檢定未發現顯著發表偏誤；[IRRODL 的 22 研究 meta](https://www.irrodl.org/index.php/irrodl/article/view/8775) 得到 g = 0.573。方向一致，只是效果量比那個 0.867 收斂。

那到底該信誰？我認為問題問錯了——**這些研究跟 Bastani 測的根本是不同的東西**。而這句話不是我的推測：[Deng 等人 2025 年發表於 *Computers & Education* 的 meta-analysis](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025) 在報告完正向結果後，自己就寫了：

> 然而，方法學上的限制——例如缺乏統計檢定力分析，以及對介入後評量的疑慮——使結果的詮釋需要謹慎。……（建議之一是）區分「ChatGPT 產出的品質」與「介入對學業表現的正向效果」，做法包括把介入後評量從定義良好的問題轉向更複雜、需要展示技能的專案式評量，採用監考評量……

翻成白話：**如果評量的時候 AI 還在手邊，你量到的可能是 AI 的輸出品質，不是學生的學習。** 這正是為什麼真正該問的是「AI 收走之後還剩下什麼」——而有人直接測了。

## AI 收走之後，還剩下什麼

Bastani 等人 2025 年發表於 PNAS 的隨機對照試驗 [Generative AI without guardrails can harm learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635) 把土耳其近千名高中生分三組做數學練習：一組用接近原生 ChatGPT 的 GPT Base、一組用加了教師設計提示的 GPT Tutor、一組只有課本和筆記。

> 有 GPT-4 可用時解題表現顯著提升（GPT Base 成績提升 48%，GPT Tutor 提升 127%）。然而我們另外發現，當存取權隨後被收走時，學生的表現反而比從未有過存取權的學生更差（GPT Base 成績下降 17%）——也就是說，不受限制的 GPT-4 存取可能危害教育成果。

GPT Tutor 那組的結果同樣值得看：練習時漲了 127%，考試時跟對照組**打平**。「只給提示不給答案」的防護能把傷害抵銷掉，但沒有讓學習變得更好。研究者對此的比喻是自動駕駛——[Hechinger Report 的報導](https://hechingerreport.org/kids-chatgpt-worse-on-tests)提到，作者拿 FAA 建議飛行員減少使用自動駕駛來類比，重點是確保系統失效時人還會飛。

第二個發現更刺：學生完全沒察覺。GPT Base 組考差了，卻不覺得自己學得比較少；GPT Tutor 組沒考得比較好，卻覺得自己表現顯著更佳。這跟開頭那個「重讀感覺有效」是同一個病，只是工具升級了。

## 兩份要小心引用的補充材料

它們常跟上面那份 RCT 被一起引用，但強度差很多：

- **MIT Media Lab 的 [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt)** 用 EEG 測寫作時的神經連結度，提出 cognitive debt（認知負債）概念，發現 LLM 組連自己剛寫的句子都引用不出來。但樣本只有 54 人（第四場僅 18 人完成），且未經同儕審查。[官方專案頁的 FAQ](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview) 特別列了一段請求媒體不要使用 "brain damage"、"brain rot" 這類字眼，因為論文根本沒用這種詞彙。方向可以引，強度不能放大。
- **[The Memory Paradox](https://arxiv.org/abs/2506.11015)（arXiv:2506.11015）** 走得更遠，把 Flynn effect 的反轉跟認知卸載連在一起。作者群正是 Oakley 與 Sejnowski——同樣兩個人，十年前教你怎麼建立內部記憶，現在在論證為什麼 AI 時代更需要它。**但這條推論鏈需要拆開檢查。** 反轉本身是真的：[Bratsberg 與 Rogeberg 2018 年在 PNAS 分析了 73 萬名以上挪威役男](https://www.pnas.org/doi/10.1073/pnas.1718793115)（1962–1991 年出生），IQ 在 1975 年出生世代達到頂點後逐年下降，而且**在家族內部也成立**——弟弟考得比哥哥低——這個設計乾淨地排除了基因與移民因素。但同一批作者在[自己撰寫的科普說明](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame)裡寫得很清楚：「我們的分析並未指出這些潛在的環境成因究竟是什麼。那仍是未來研究的課題。」把它接到認知卸載，是 Oakley 的推測，不是那份研究支持的結論。

## 整體來說

把這幾份放在一起，可操作的規則其實很簡單：**AI 讓你在該困難的地方變順，而順就是學不到東西的訊號。** 先自己做，再問 AI——Kosmyna 研究裡從 brain-only 換到 LLM 的那組表現最好，Bastani 的 GPT Tutor 防護也是同一個原理：把 AI 放在提示的位置，不要放在答案的位置。


最後補一個元層次的教訓。那篇被撤稿的 meta-analysis 提醒的不只是「AI 教育研究品質參差」——**連「有證據」本身都需要查證**。一篇被引用兩百多次、瀏覽近五十萬次的論文可以是錯的，而引用它的兩百多篇文章不會跟著更正。這剛好就是[上篇](/posts/learning/2026-08-04-learning-how-to-learn)那門課想教的習慣，只是這次要應用在學術文獻上。

## 參考資料

每條標註**取用層級**（一手／摘要／轉引／未驗證），未經我核實的 DOI 一律不列。學習科學本身的完整書目見[上篇的參考資料](/posts/learning/2026-08-04-learning-how-to-learn)。

- 【一手·全文】Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). [Generative AI without guardrails can harm learning: Evidence from high school mathematics](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635). *PNAS*, 122(26), e2422633122. DOI: 10.1073/pnas.2422633122 — 另有 2025-08-20 之作者單位更正啟事（不影響結果）。
- 【二手】[Without Guardrails, Generative AI Can Harm Education — Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)；[Kids who use ChatGPT as a study assistant do worse on tests — Hechinger Report](https://hechingerreport.org/kids-chatgpt-worse-on-tests)（自動駕駛／FAA 類比之出處）
- 【一手·官方】Wang, J., & Fan, W. (2026). [Retraction Note: The effect of ChatGPT on students' learning performance, learning perception, and higher-order thinking: insights from a meta-analysis](https://www.nature.com/articles/s41599-026-07310-z). *Humanities and Social Sciences Communications*, 13, 528. 撤稿日 2026-04-22；公告於 2026-07-02 更新，補列提出疑慮者 Magnus Ingebrigtsen 與 Marko Lukic。
- 【一手·官方】被撤稿之原文（頁面已標記 RETRACTED）：Wang & Fan (2025). *Humanit Soc Sci Commun*, 12, 621. DOI: 10.1057/s41599-025-04787-y <https://www.nature.com/articles/s41599-025-04787-y>
- 【二手·新聞】撤稿報導：[EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns)（486,000 次瀏覽／266 引用／Altmetric 1,023）、[GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt)、[NEPC 轉載 404 Media](https://nepc.colorado.edu/blog/nature-publisher)。**三方報導的瀏覽數與引用數略有出入（485k–498k、262–275 引用），此處採 EdTech Innovation Hub 版本。**
- 【一手·全文】[ChatGPT's impact on student learning outcomes: a meta-analysis](https://www.nature.com/articles/s41599-026-07019-z). *Humanities and Social Sciences Communications* (2026). — 未撤稿；35 研究／134 效果量，g = 0.670，95% CI [0.495, 0.844]。
- 【摘要】Deng, R., Jiang, M., Yu, X., Lu, Y., & Liu, S. (2025). [Does ChatGPT enhance student learning? A systematic review and meta-analysis of experimental studies](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025). *Computers & Education*, 227, 105224. — 文中引用的是**該文摘要原句**（介入後評量的疑慮、建議採監考評量）。此前版本曾引用 g+ = 0.712，該數字來源為 Academia.edu 的 AI 生成摘要、無法核實，已移除。
- 【摘要】[A Meta-Analysis of ChatGPT's Influence on Learning Achievement](https://www.irrodl.org/index.php/irrodl/article/view/8775). *IRRODL* (2025). — 22 研究，g = 0.573。
- 【一手·官方 + 未同儕審查】Kosmyna, N., et al. (2025). [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt). MIT Media Lab, arXiv:2506.08872. — n = 54（第四場僅 18 人完成）；[官方專案頁列有媒體用語限制聲明](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview)。
- 【一手·未同儕審查】Oakley, B., et al. (2025). [The Memory Paradox](https://arxiv.org/abs/2506.11015). arXiv:2506.11015. — Springer 專書章節之預印本；屬論證，非實證因果。
- 【一手·全文】Bratsberg, B., & Rogeberg, O. (2018). [Flynn effect and its reversal are both environmentally caused](https://www.pnas.org/doi/10.1073/pnas.1718793115). *PNAS*, 115(26), 6674–6678. DOI: 10.1073/pnas.1718793115 — 730,000+ 挪威役男，1962–1991 出生世代。
- 【一手·作者撰文】Bratsberg & Rogeberg. [Norwegian IQ scores are falling – but genes are not to blame](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame). TheScienceBreaker. — 「本分析未指出環境成因為何」一語之出處。
