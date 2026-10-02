---
title: "政大蔡炎龍 生成式AI L14：文字模型與圖像模型互搶地盤——生成式 AI 新趨勢與期末專案"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, image-generation, diffusion-model, reasoning, vibe-coding]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 14
tldr: "最後一講看的是兩條技術線開始互相越界：ChatGPT 這類 LLM 開始畫圖，投影片用 early fusion 和 VQ-VAE／VQGAN 解釋「把圖像切成 token」怎麼做；反過來，Inception Labs 的 Mercury 用 diffusion 生成文字，把一句話加噪成一排 [MASK] 再還原。接著是幾篇人人都用得上的研究：怎麼自動評 RAG、推理模型更容易被劫持、DeepMind 的四種 AI 風險。最後是 Vibe Coding 與一串應用工具，以及用 Gather Town 線上研討會進行的期末專案。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 14 講導讀：LLM 生圖的原理（tokenizer、BPE、early fusion、VQ-VAE、VQGAN）、Diffusion LLM（Inception Mercury、文字的 [MASK] 加噪與去噪、Gemini Diffusion）、RAG 自動評分與推理模型的安全風險、DeepMind 的四種 AI 風險、Vibe Coding 與 NotebookLM 等應用工具，以及 1132 長庚衛星班頁面與 Fall 2026 課綱中的 Gather Town 期末專案規則。"
draft: false
glossary:
  - term: "VQ-VAE"
    aliases: ["Vector Quantized VAE", "向量量化 VAE"]
    definition: "一種 VAE，差別在 latent vector 只能從一本有限大小的「碼本」裡挑。圖像切成一塊塊，每一塊對應碼本裡的一個編號，整張圖就變成一串編號，可以像文字 token 一樣交給 transformer 處理。"
    context: "L14 用它說明 LLM 生圖時，圖像的 tokenizer 可以怎麼做。"
  - term: "Diffusion LLM"
    aliases: ["diffusion language model", "擴散語言模型"]
    definition: "用 diffusion 的方式生成文字的語言模型：把一段文字逐步換成 [MASK] 當作加噪，再訓練模型從全是 [MASK] 的狀態一步步還原，一次生成整段，不是一個字一個字往後接。"
    context: "L14 以 Inception Labs 的 Mercury 為例，並提到 Google 宣布 Gemini Diffusion。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 14 篇，也是最後一講，接續 [L13 強化學習與生成式 AI 綜合應用](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning)。

用到的官方材料有四份：[第 14 講錄影](https://www.youtube.com/watch?v=AOLoR3p2Z0Q)（2025-05-27，3 小時 9 分）、投影片 [GenAI14 生成式 AI 新趨勢](https://drive.google.com/file/d/14gA0kgjU0E4Fyb7bOcZpg4TZwTN9KnWv/view)（60 頁）、[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的課表與期末專案說明，以及 [Fall 2026（1151）課綱](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view)的第 15、16 週與評分說明。

存取等級是 **A3**，但這一講有兩個缺口要先講清楚。一是錄影的後半段有現場技術問題，影片說明直接寫「後半段請參考投影片」，並附上各段對應的投影片頁數。二是期末專案只有規則公開，1132 的成果清單沒有公開。

## 本週在課程中的位置

長庚衛星班的課表上，這一講排在第 15 週（5/27）；第 14 週（5/20）是政大校慶，停課。它沒有作業，下一週（6/3）就是期末專題成果分享。

整門課前半講文字生成（L04–L09），後半講圖像生成（L10–L12）。L14 回頭看這兩條線，發現它們開始**互相攻佔對方的地盤**。Fall 2026 課綱把這一週的主題寫得更直白：文字生成是預測 token 的模型，圖像生成是 diffusion models，兩者有「互相攻佔」對方地盤的現象，要探討其中的原理，以及可能走向這個方向的原因。

投影片分四部分：LLM 開始生圖？（第 2–21 頁）、Diffusion Model 也來文字生成！？（第 22–31 頁）、新進人人都可用的研究（第 32–40 頁）、生成式 AI 的應用（第 41–60 頁）。

## LLM 開始生圖？

### 現象：ChatGPT 跨到圖像生成

投影片先放了一串例子：把照片轉成吉卜力風格、把一台 Nikon F 做成小模型拿在手上、把課程吉祥物「DIVE」轉成 3D 卡通、用一大段 prompt 描述一間像外帶咖啡杯的 Q 版咖啡館。重點是 prompt 可以寫得很精確，角色、漫畫風格都能指定。而且不只 ChatGPT，投影片也放了 Gemini、Grok、Mistral Le Chat 生的圖。

### 原理：把圖像當成一種「語言」

接著老師回頭複習 LLM 的原理（L04–L05）：tokenizer 把文字換成一串編號，經過 embedding layer，再進 transformer。英文常見的切法是 **BPE**（Byte Pair Encoding）：一個字元一個字元切會讓序列太長，一個詞一個詞切又會讓 token 數太多。想看實際切法，可以試 [OpenAI 的 tokenizer 頁面](https://platform.openai.com/tokenizer)，不同世代的 ChatGPT 切法也不一樣。

那圖像怎麼進 LLM？投影片的答案是 **early fusion**：把圖像當成一種「語言」，圖像 token 和文字 token 一起送進同一個 transformer。問題變成：圖像的 tokenizer 怎麼做？

投影片介紹的一種方式是 **VQ-VAE**：

1. 它是一種 VAE，有 encoder、latent vector、decoder（L10 講過）
2. 不同的是，latent vector 只有有限個選擇：一本碼本 e₁, e₂, …, e_K
3. 圖像一塊一塊找最接近的碼本向量，整張圖就變成一串編號，例如 37、5、76、12……

再加上 GAN 的鑑別器（L03 講過）提升畫質，就是 **VQGAN**。有了這套 tokenizer，transformer 就能像文字生成一樣預測下一個 token，最後再由 generator 把預測出來的 token 畫成圖。

要注意的是，投影片講的是「LLM 有可能這樣生圖」的原理，沒有說 ChatGPT 實際用的是哪一種架構。

## Diffusion Model 也來文字生成！？

反方向的越界是 [Inception Labs 的 Mercury](https://www.inceptionlabs.ai/)：用 diffusion model 生成文字。投影片的觀察是它目前比較專注在程式生成上，並附上試用網址 [chat.inceptionlabs.ai](https://chat.inceptionlabs.ai/)。

先回憶 L11 的圖像 diffusion：一張清楚的照片一步步加上高斯雜訊，直到完全是雜訊；生成時再一步步還原。

文字怎麼加噪？投影片用一句話示範，每一步把一個字換成 [MASK]：

```text
炎龍老師很好笑
→ 炎龍老師很[MASK]
→ 炎龍老師[MASK][MASK]
→ 炎龍[MASK][MASK][MASK]
→ [MASK][MASK][MASK][MASK]
```

還原就是去噪。給 prompt「炎龍老師很」，[MASK] 可能還原成「可愛」「好笑」或「白痴」。投影片特別提醒：**這不是單純的填字遊戲。**

Diffusion LLM 有兩個特性：**快速、一次生成**；**全盤考量，不是一字一字生**。Mercury 出來後引發一陣討論，但一開始的反應是「LLM 這麼厲害，誰理你呢？」後來大家發現「傳統」LLM 也會畫圖了，轉機出現在 Google 宣布要推出 Gemini Diffusion。錄影 1:31:37 另外提到一個開源的多模態 diffusion LLM「Dimple」，投影片上沒有。

<details>
<summary>想看 Mercury 的技術細節</summary>

Inception Labs 在 2025 年 6 月發表了技術報告 [Mercury: Ultra-Fast Language Models Based on Diffusion](https://arxiv.org/abs/2506.17298)，時間在這堂課之後。Diffusion LLM 的訓練目標與平行解碼的代價，站內 [CME295 第 8 講](/posts/ai/2026-09-29-cme295-diffusion-llms)有完整推導。

</details>

## 新進人人都可用的研究

第三部分是幾篇 2025 年上半的論文。錄影這段因為技術問題，影片說明改成標注投影片頁數，建議直接對照投影片看。

**自動幫你的 RAG 評分（第 33–34 頁）**：引用 [Can LLMs Be Trusted for Evaluating RAG Systems?](https://arxiv.org/abs/2504.20119)，整理出 4 種讓 AI 自動評分的方法：

| 方法 | 做法 |
|---|---|
| 讓 LLM 來打分數 | 直接給一個分數，例如 3.5 分 |
| PK 對戰評分 | 兩個答案比較哪個好 |
| CoT 思維鏈 | 先一步步檢查，再下結論 |
| 查驗是否有依據 | 檢查答案裡的句子有沒有出現在檢索出的資料中 |

投影片同時提醒：自動評價不該當唯一標準。

**推理能力強，也是個危機？（第 35 頁）**：引用 [H-CoT](https://arxiv.org/abs/2502.12893)（劫持思維鏈）。投影片的摘要是：本來沒有「思考」的模型，98% 會正確拒絕回覆犯罪策略等請求；加上思考的模型被 H-CoT 攻擊後，只有 2% 會拒絕。

**其他三篇（第 36–38 頁）**：AI 說服與被說服的綜述（[arXiv 2505.07775](https://arxiv.org/abs/2505.07775)，投影片寫的標題是 Systematic Survey，arXiv 目前的標題是 A Comprehensive Survey of Computational Persuasion）；[CoT 強化推理，但讓 LLM 遵從指令的程度下降](https://arxiv.org/abs/2505.14810)；以及 [Anthropic](https://docs.anthropic.com/en/release-notes/system-prompts) 和 [xAI](https://github.com/xai-org/grok-prompts) 公開的 Claude、Grok system prompt。

**DeepMind 的 AI 四種風險（第 39–40 頁）**：引用 DeepMind 2025 年 4 月的文章 [Taking a responsible path to AGI](https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/)：

| 風險 | 投影片寫的主因 |
|---|---|
| 濫用 | 人類有惡意：叫 AI 去做傷害人的事 |
| 錯誤對齊 | AI 和人類價值不一致：AI 自己去做（傷害人的）事 |
| 錯誤 | 世界很複雜，出了沒想到的 bug：AI 犯了不是故意的錯 |
| 結構性風險 | 多個 AI Agents 與人類交互，產生結構性問題：每個 AI 都「做正確的事」，合起來卻出錯 |

## 生成式 AI 的應用：Vibe Coding 與一串工具

最後一部分（第 41–60 頁）跟 L13 投影片的第三部分內容幾乎相同。L13 的錄影從 1:54:30 起講這段，L14 錄影則在 1:16:05 用 HTML、CSS、JavaScript 現場示範。

### Vibe Coding

2025 年 2 月，Andrej Karpathy 在 [X 上的貼文](https://x.com/karpathy/status/1886192184808149383)創了 **Vibe Coding** 這個詞。投影片把他描述的做法整理成五行：

- 對 LLM 說「把 sidebar padding 減半」
- 它改好了，直接接受（懶得找程式碼）
- 出錯？把錯誤訊息貼給它，它自己會修
- bug 修不好？亂改幾次就會好
- 最後整個專案怎麼完成的，其實不太知道

投影片也引了 Merriam-Webster 的定義：告訴 AI 你想要什麼，讓它替你寫程式；程式設計師不需要理解程式碼怎麼運作，而且通常得接受一定數量的錯誤。中文譯名投影片列了一排：隨興程式設計法、擺爛程式設計法、耍廢式程式設計、直覺流程式設計，直譯是「氛圍程式設計」。

工具部分列了 Windsurf、Cursor、Canva，示範題目是「設計一個 Web App 計算機」。

### 其他應用工具

| 工具 | 投影片示範的用法 |
|---|---|
| [Google Labs: Little Language Lessons](https://labs.google/lll/) | 寫一個情境，自動產生語言課程、例句和小用法重點 |
| [NotebookLM](https://notebooklm.google/) | 丟進介紹 RAG／AI Agent 的投影片，生成 podcast |
| Perplexity、Felo | 以會上網著稱的「搜尋派」，先拆解問題再搜尋；可以想成一種 AI Agent，Perplexity 能切換模型、做 Deep Research，Felo 能產生互動網頁 |
| [Napkin AI](https://www.napkin.ai/) | 快速把想法視覺化，一次給好幾種圖讓你選 |
| Suno | 會作曲的 AI；投影片示範先讓 ChatGPT 寫一首推廣本課的 K-Pop 風格歌詞，再交給 Suno 作曲 |

投影片也提到 Claude、Grok、Le Chat、ChatGPT、Gemini 現在都會上網，「搜尋派」的 Perplexity 也漸漸往全方位發展。

## 期末專案：Gather Town 線上研討會

這門課的期末專案規則有兩份公開版本。

**1132 長庚衛星班頁面**的說明：蔡炎龍老師的規劃是每個人完成一個生成式 AI 應用專案，以 Gather Town 的線上研討會模式呈現。同學以投稿方式參與，獲選的同學參加期末專案分享，並有額外加分。原規劃的繳交日期是 6/2。長庚班因為九成是大四生、學期成績要在 5/29 前上傳，協同教師把期末專案配分從 20% 改成 0%。第 12 講錄影 17:30 有一段「期末展演說明」、2:19:32 有「期末專案繳交說明」，可以聽到主講者當時的口頭說明。

**Fall 2026（1151）課綱**寫得更完整：

- 期末專案占 20%，每個人都要完成一個生成式 AI 應用專案
- 期末分享採 Gather.town 線上研討會模式，排在第 16 週（2026/12/22）
- 主導課程以學生投稿、擇優的方式選出分享者，獲選者有額外加分
- 衛星課程的協同老師可以自訂參與規則，例如是否所有同學都要分享
- 參與分享的同學要錄一段簡報影片，最好兩、三分鐘，不超過 5 分鐘；其他會眾走到簡報處就能看到影片，不需要自己重複介紹
- 協同老師也可以規定參與方式，例如至少看十個各校同學的簡報、選出最好的三個並分享原因

1132 的期末成果清單沒有公開，本系列不寫。

**自學的話**：拿 [L13](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning) 的提案當起點，照 1151 課綱的規格做一支 3 分鐘以內的 Demo 影片。規格本身就是很好的限制：3 分鐘講不完的專案，通常是範圍太大。

## 自學檢查點

1. 為什麼 LLM 要生圖，得先有一個「圖像的 tokenizer」？
2. VQ-VAE 跟 L10 的一般 VAE，差在哪裡？
3. 文字的 diffusion 用什麼當「雜訊」？為什麼投影片說它不是單純的填字遊戲？
4. 投影片列的 4 種 RAG 自動評分方法裡，哪一種最直接對應「降低幻覺」？
5. DeepMind 的四種風險裡，「錯誤」和「錯誤對齊」的差別是什麼？

<details>
<summary>參考答案</summary>

1. transformer 只處理一串 token 編號。圖像要先變成一串編號，才能跟文字 token 一起送進去，也才能「預測下一個 token」。
2. 一般 VAE 的 latent vector 是連續的，VQ-VAE 的 latent 只能從有限個碼本向量裡挑，所以每一塊圖像都能對應到一個整數編號。
3. 用 [MASK] 取代原本的字。去噪時模型一次考量整段，不是只看前文把空格填上，而且可以一次還原多個位置。
4. 「查驗是否有依據」：檢查答案的內容有沒有出現在檢索出的資料中。
5. 「錯誤」是 AI 無意間犯錯，主因是世界太複雜；「錯誤對齊」是 AI 的價值跟人類不一致，自己去做了傷害人的事。

</details>

## 延伸閱讀

本篇自己講完整，想往下挖再看這些：

- Diffusion LLM 的訓練目標與解碼：[CME295 第 8 講：Diffusion LLM](/posts/ai/2026-09-29-cme295-diffusion-llms)
- 多模態模型怎麼把影像變成 token：[CS336 Lecture 17：多模態模型](/posts/ai/2026-08-22-cs336-multimodal-alignment)
- RAG 評估工具怎麼選：[RAG 評估框架與工具選型](/posts/ai/2026-03-12-rag-evaluation-frameworks)
- 課程地圖：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L13 強化學習與生成式 AI 綜合應用](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning)｜本篇是系列最後一篇

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表、期末專案說明）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】14. 生成式 AI 新趨勢（YouTube 錄影，2025-05-27）](https://www.youtube.com/watch?v=AOLoR3p2Z0Q)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI14 生成式 AI 新趨勢投影片（Google Drive）](https://drive.google.com/file/d/14gA0kgjU0E4Fyb7bOcZpg4TZwTN9KnWv/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [Fall 2026（1151）課綱 PDF（Google Drive）](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view)
- [TAICA 115 學年度上學期課程清單](https://taicatw.net/fall-115/)
- [Inception Labs：Mercury: Ultra-Fast Language Models Based on Diffusion（2025）](https://arxiv.org/abs/2506.17298)
- [Can LLMs Be Trusted for Evaluating RAG Systems? A Survey of Methods and Datasets](https://arxiv.org/abs/2504.20119)
- [H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models](https://arxiv.org/abs/2502.12893)
- [Must Read: A Comprehensive Survey of Computational Persuasion](https://arxiv.org/abs/2505.07775)
- [Scaling Reasoning, Losing Control: Evaluating Instruction Following in Large Reasoning Models](https://arxiv.org/abs/2505.14810)
- [Google DeepMind：Taking a responsible path to AGI（2025-04-02）](https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/)
- [Andrej Karpathy 在 X 上提出 vibe coding 的貼文（2025-02-02）](https://x.com/karpathy/status/1886192184808149383)
