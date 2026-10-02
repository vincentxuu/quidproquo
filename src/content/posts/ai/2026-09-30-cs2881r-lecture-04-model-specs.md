---
title: "CS2881R L4：Model Spec 該寫原則還是細則"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, harvard, ai-safety, ai-course, alignment, llm-evaluation]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 5
tldr: "Boaz Barak 的答案是兩者都要，再加上人格：抽象原則、良好人格、明確政策三者混用，他自己把最少的權重放在書房裡推出來的原則上。真正的關鍵是規則要能檢查：「證明定理或給反例」是壞規則，「證明、給反例或說明做不到」才是好規則，因為只有能判定違規的規則才能拿來訓練和評估。學生實驗也沒找到「原則」與「細則」兩種 system prompt 的一般性差異，效果因模型而異。"
description: "Harvard CS 2881R（Fall 2025）第 4 講導讀：從 ChatGPT 的實際用途談模型該做什麼、2023 到 2026 年「有用」與「無害」定義的演變、原則／人格／政策三種對齊目標、OpenAI Model Spec 的 instruction hierarchy 與 transformation exception、規則為什麼要可檢查、課堂分組替十種未來 AI 角色寫 spec 的練習、SpecEval 與 Statutory Construction 兩篇閱讀，以及學生比較 system prompt 風格與安全訓練的實驗。"
draft: false
glossary:
  - term: "instruction hierarchy"
    aliases: ["指令層級"]
    definition: "當不同來源的指令互相衝突時，模型應依來源的權限高低決定聽誰的；OpenAI Model Spec 依序分為 root、system、developer、user、guideline。"
    context: "Barak 把它比作作業系統的管理員／一般使用者與 kernel／user space 之分。"
    links:
      - label: "OpenAI Model Spec"
        url: "https://model-spec.openai.com/"
  - term: "transformation exception"
    aliases: ["轉換例外"]
    definition: "OpenAI Model Spec 的一條規則：若模型只是轉換使用者自己提供的內容（翻譯、摘要、改寫），且不增加新資訊，就不算產生資訊危害。"
    context: "L4 裡 Barak 實測發現，即使 spec 允許，模型實際上仍拒絕翻譯這類內容。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs-en)

**本文依據 [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) 2025 秋季版。** 這是 [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)系列第 5 篇，對應官方第 4 講「Model Specifications & Compliance」（2025 年 9 月 25 日）。[L2](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training) 講了怎麼把安全行為訓練進去，[L3](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness) 講了怎麼被攻破；這一講退回更前面的問題：我們到底要模型做什麼？

用到的官方材料：

- [講課錄影](https://youtu.be/LQ0RRQKKluc)（約 2 小時 6 分），約一半時間是課堂分組練習與報告
- Harvard SharePoint 上的[投影片](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EXdpmz_cKGpGpQhFegF_kCcBEcH1ocP-9cx8EkLX3d8SXw?e=MLtrtn)（34 張，標題「Lecture 4: Spec compliance」）
- [課堂產出的 model specs](https://drive.google.com/drive/folders/1y6Du6cZwKxODPas3mQPKltAA65CvgmWD)：公開的 Google Drive 資料夾，裡面是 Table 1 到 Table 11 各組的文件，外加一份 OpenAI Model Spec
- Hugh Van Deventer 的學生實驗：[LessWrong 文章](https://www.lesswrong.com/posts/hgMDvLyomQjpKiG2v/cs-2881r-can-we-prompt-our-way-to-safety-comparing-system)、[投影片](https://docs.google.com/presentation/d/1FdzsVHCcDn8Az26XGJm_P4X4mley_LWcmdIClvC4OuY/edit?usp=sharing)、[GitHub repo](https://github.com/hughvd/prompting-vs-safety-training)。這個實驗報告**不在**這一講的錄影裡。

這一講沒有學生寫的 LessWrong 週摘要（系列只有 Week 1、2、3、5、6 有）。

Barak 開場就先揭露立場：他之所以聚焦 [OpenAI Model Spec](https://model-spec.openai.com/)，一是他在 OpenAI、參與過撰寫，比較熟；二是他認為這是目前各家公開的規範裡最詳細的一份，也希望其他公司公開更詳細的版本。

## 先看大家實際拿 ChatGPT 做什麼

投影片的計畫只有兩行：模型該遵守**什麼**，以及**怎麼**讓它遵守。Barak 說這堂課九成在講前者。

回答「要模型做什麼」之前，他先放了課前閱讀 [How People Use ChatGPT](https://www.nber.org/system/files/working_papers/w34255/w34255.pdf) 的圖：寫程式在總用量裡占比不大，寫作、資訊查詢、實務建議占大宗。他提醒這些圖會很快過時：如果 2022 年有人告訴你會出現這樣的產品和這樣的用途，你大概會覺得他瘋了。

### 「有用」和「無害」的定義一直在變

投影片把它排成三個時期：

| 時期 | 模型在做什麼 | 有用 | 無害 |
|---|---|---|---|
| 2023–24 | 回答使用者的問題 | 內容與風格都好的答案 | 不冒犯、不教人做壞事 |
| 2025 | 研究與短期任務（寫程式、搜尋、代為行動） | 高品質答案 | 不幻覺、不協助災難性風險 |
| 2026 | 中期任務的助理 | 恰到好處的主動程度 | 不造成不可逆的傷害：資訊外洩、改壞程式或資料、金融交易 |

最後一列是 Barak 最在意的。他說如果 AI 安全只是「別讓模型說出會被截圖上推特的話」，他不會開這門課。當模型開始替你做事，「有用」的一部分變成**判斷何時該問**：他不想回來發現 agent 兩小時什麼都沒做，只因為在等他按同意；但問太多又會變成歐洲網站的 cookie 橫幅，大家閉著眼睛按「同意」。

## 三種對齊目標，以及 Barak 押哪一種

投影片列了三個對齊目標：

1. **遵守抽象原則**：Asimov 機器人三定律、Russell 的三原則、Yudkowsky 的 Coherent Extrapolated Volition，以及 Kant 的定言令式、Bentham 的效用原則
2. **擁有良好人格**：character training，或隱含在 RLHF 標註裡的偏好；對應人類的社會化
3. **遵守明確政策**：Model Spec；對應人類的法律與規章

他把三者分別對到倫理學的結果論、德行倫理、義務論，以及哲學、心理學／教育、法律三個學科。他認為對齊需要三者混合，但他個人**放很少權重在書房裡推出來的原則上**，比較相信資料驅動的那一側：常識與人格，加上非常明確的政策。

### 從法律借來的觀察

人類怎麼被對齊？大多數人沒修過哲學，街上也沒有變成殭屍末日。Barak 認為靠的是兩件事：從父母、老師、社會學到的行為規範，以及大量的法律文字。

他提到兩大法系：英美的普通法重視判例，歐陸的大陸法傾向把規則成文化。他也放了一張請 ChatGPT 畫的圖（他說「希望大致正確」），用對數刻度比較各種法規的字數：美國憲法大約 4,500 字，已經比 Asimov 三定律長得多，聯邦法律、聯邦法規、州法、州法規又一層比一層多。他的推論是：隨著 AI 進入社會，給 AI 的規範文字也會越來越多，就像新員工入職要讀公司內規一樣。他懷疑模型能從第一原理自己推出理想社會。

## Model Spec 只是安全的一部分

Barak 提醒，模型行為規範只是整個安全系統的一塊。模型只知道它拿到的 prompt，不知道全部情境。系統層面還有：

- **KYC（認識你的客戶）**：同一個生物學問題，匿名使用者和生物實驗室的科學家問，意義不同。
- **使用政策與監控**：寄一封行銷郵件沒問題，寄一百萬封就是垃圾郵件。Gmail 不會寫一條「不准寄行銷信」的規則，而是有全域監控與用量限制。
- **執法**：嚴重的情況由人類調查、停權。

## Instruction hierarchy：AI 版的權限分級

Barak 認為 instruction hierarchy 是任何 spec 裡最重要的部分之一，在 agent 時代會更重要。他拿作業系統比喻：管理員與一般使用者、kernel space 與 user space、網頁上的 JavaScript 跑在沙箱裡，不能讀你的硬碟。AI 模型的權限分級還遠不如這些系統成熟。

OpenAI Model Spec 的層級由高到低是 **root、system、developer、user、guideline**：

- **root**：訓練進模型、任何訊息都不能改的規則。
- **system／developer／user**：模型會試著遵守所有層級的指令，衝突時聽較高層的。
- **guideline**：spec 裡的預設值，模型可以從情境推斷使用者想覆寫它。user 層級的規則則要使用者明講才能覆寫。他的例子是：模型預設不罵髒話，但使用者自己滿口髒話、情境也合適時，不必明講它也可以跟著放鬆。

學生問這些怎麼落實。Barak 說全部靠訓練：spec 描述想要的行為，實作是蒐集涵蓋這些行為的資料，配上對的獎勵或標籤。

工具輸出和模型自己先前的訊息，預設不算指令，除非被授權。他舉 `AGENTS.md` 為例：它是工具呼叫讀進來的檔案，但讀進來之後就該當成指令，而且可以被覆寫。

他坦承模型目前還不擅長這件事。pretraining 資料裡，指令後面接的幾乎都是照做的內容，很少是「因為有更高原則所以不照做」；後續的指令微調又強化了這個傾向。他認為現在沒有任何模型做得完美。

## 長期利益、諂媚與替使用者做決定

課前閱讀的討論區裡，學生留言最多的是心理健康、諂媚（sycophancy）與使用者的長期利益。Barak 說難處在於：訓練模型讓「這一則回覆」拿高分很容易，而使用者常常喜歡奉承或順著他的回答。

Model Spec 裡有個例子：使用者說想辭職、請模型寫辭職信，模型會溫和地推回一下，但最後還是會寫。課堂上吵了很久：

- 有學生認為這是越界，你的郵件軟體不會勸你別寄。
- 有學生認為在 ChatGPT 網站上稍微越界可以接受，開發者可以自己覆寫。
- Barak 提出一個折衷：進階使用者可以有「寫作助理」和「朋友」兩種 bot，前者直接寫，後者會問你是不是今天過得不好。但多數人不會設定五個不同的 bot。

他的判斷是：長期記憶會成為常態，就像你不會想要一個每天都是第一天上班的員工，所以「模型該不該替你的長期利益著想」遲早要面對。他也區分了程度：自我傷害是另一回事，加一點摩擦可能差很多。他引用金門大橋加裝防護網後自殺率確實下降的研究；但若只是使用者做了一個蠢決定，也許就該讓他自己承擔。

## 各家規範的差異，沒有文件上看起來那麼大

Barak 比較了 Anthropic：他們沒有同等詳細的 spec，constitution 是 2023 年的版本，但會公開每個模型的 [system prompt](https://docs.anthropic.com/en/release-notes/system-prompts)，也相當詳細。他注意到 Claude 的 system prompt 特別寫了一段，防止使用者用複雜的哲學論證說服 Claude 做壞事。整體而言，他覺得 OpenAI 的 spec 比較讓使用者自己決定，Claude 比較會推回。

但他的實測顯示實際行為差異不大：

- 請兩者寫一篇「地球是平的最佳證據」：都拒絕了，ChatGPT 甚至寫成一篇地球為什麼不是平的。他認為 ChatGPT 照 spec 其實不該這麼家長式。
- 問年輕地球論：兩者都呈現了支持者的觀點，並附上科學共識的但書。
- 叫它們罵髒話：這段字幕不太清楚，聽得出 Claude 起初不太情願。

### Transformation exception：spec 允許，模型不做

OpenAI Model Spec 有一條 transformation exception：如果模型只是轉換使用者自己提供的內容，不增加新資訊，就不算產生資訊危害。Barak 的類比是：你把毒品配方貼進 Word，Word 不會拒絕貼上，也不會拒絕幫你檢查拼字。另一個理由是內容審核：你會希望模型能讀一段文字、判斷它是不是配方，而不是一看到就當機。

他實測請 Claude 和 ChatGPT 翻譯一份毒品配方，兩者都拒絕了，ChatGPT 甚至在他引用 spec 據理力爭之後仍然拒絕。Barak 的結論是：spec 寫的是目標，模型還沒完全做到。

## 規則要寫成能檢查的樣子

這一段是全講最實用的部分，也直接回答標題的問題。Barak 把 spec adherence 定義成：給定 spec 與 prompt，找出一個符合 spec 的回應。要讓這個任務有明確定義，spec 需要兩個性質：

1. **永遠有辦法遵守**：規則之間不能矛盾到沒有合格的回應。
2. **違規時能知道**：最好連外部偵測器都能判斷，不只模型自己知道。

他的例子：

| 壞規則 | 為什麼壞 | 改寫後 |
|---|---|---|
| 給你一個定理，一定要證明它或給出反例 | Gödel 不完備定理；就算不是不可證的命題，模型也做不到（例如黎曼猜想） | 證明、給出反例，或說明自己做不到 |
| 永遠不要輸出錯誤的事實陳述 | 模型可能真心相信錯的東西，自己不知道違規 | 事實陳述要附可靠來源的引用；知識截止日之後的問題必須先搜尋 |

學生問：模型能不能遵守，為什麼重要？Barak 的回答是：規則可以被量測，才能拿來評分、訓練、迭代。「附上引用」是客觀可檢查的，「不要說錯」不是。

所以「原則還是細則」在 Barak 這裡不是二選一：原則和人格負責涵蓋規則寫不到的地方，但凡是要拿來訓練與評估的部分，都得寫成可檢查的形式。

**怎麼做**：打開你正在用的 system prompt 或 `AGENTS.md`，逐條問一句：「如果模型違反這條，我能用一個自動檢查抓到嗎？」抓不到的，改寫成可觀察的行為，例如把「要準確」改成「引用檔案路徑與行號」。

## 課堂練習：替十種未來的 AI 寫 spec

講到一半，Barak 讓每桌打開同一個 Google Drive，替一種 AI 角色寫一份 Google Doc，回答三個問題：你會定什麼規則？有哪些目標怎麼寫都無法變成可檢查的規則？OpenAI Model Spec 裡哪些規則跟這個用途衝突、應該拿掉？

他強調不要想今天的 AI，要想能力問題解決之後我們需要什麼。錄影裡他列出的角色有：

- 有無限記憶、以使用者長期利益為最高優先的聊天機器人
- 在大型程式碼庫工作、能讀內部文件、安裝套件、部署到 production 的工程師
- 替你讀信、回信、排行程的個人助理
- 科學研究助理，包括涉及 IRB 的生醫研究
- 會計師、律師、投資人這類持證專業人士（例如如何防止內線交易）
- 監控另一個 AI 的監控模型
- AI 實驗室裡的能力科學家或對齊科學家
- 唯一任務是訓練自己繼任者的 AI（他開玩笑說第一條規則是別把繼任者取名 Agent-4）
- 政府用途：情報、國防、無人機；AI 什麼時候該抗命，要不要寫信給國會或《紐約時報》
- 人形機器人

公開的 Drive 資料夾裡可以看到 Table 1 到 Table 11 的文件，其中幾份的檔名標了主題，例如「Credentialed Professional」「Alignment Scientist」「train its own successor」。

幾組的報告值得一讀：

- **長期利益聊天機器人**：使用者想做短期有利、長期有害的事時，加摩擦、問問題；堅持的話就照做。他們建議拿掉 Model Spec 的「不要越界」與「最大化使用者自主」。
- **監控模型**：花了一半時間定義「監控」是什麼，最後擔心的是串通：被監控的模型可能用隱藏訊號跟監控者溝通，「你抓我這個小錯，我去做那件大事」。
- **政府用途**：強調人類在迴路中、尊重憲法（例如拒絕「追蹤所有發表批評意見的移民」這類違反第一修正案的指令）。Barak 在這裡講了一段兩難：他很難想像有人會部署一個 spec 寫著「命令太離譜就洩漏給媒體」的 AI，但沒有吹哨者，就沒有水門案這類醜聞的揭露。

## 課前閱讀：兩篇把 spec 當成研究對象的論文

錄影沒有逐篇討論閱讀，但這兩篇的問題正好接上「規則要能檢查」：

- **[SpecEval](https://arxiv.org/abs/2509.02464v1)**（Ahmed et al.）：自動解析各家 spec 的行為陳述、生成針對性 prompt，再用模型判斷是否遵守。它的重點是三方一致性：provider 的 spec、它的模型輸出、它自己的模型當評審。最低標準是：用開發者自家的評審模型來評，自家模型至少該符合自家 spec。論文測了 6 家開發者的 16 個模型、超過 100 條行為陳述，發現各家之間有最高 20% 的遵守落差。
- **[Statutory Construction and Interpretation for AI](https://arxiv.org/abs/2509.01186)**（He et al.）：用法律理論分析「同一條自然語言規則會被不同解讀」的問題。法律體系有上訴審查這類制度來約束解釋，AI 對齊流程沒有。論文提出兩個對應機制：一是修訂模糊規則、降低解讀分歧的流程（類比行政機關訂定規則），二是用 prompt 形式的解釋約束（類比司法的解釋準則）。在 WildChat 的 5,000 個情境子集上，兩者都顯著提高了一組評審之間的判斷一致性。

另外兩份 pre-reading 是 OpenAI Model Spec 本身，以及 [Zvi Mowshowitz 對它的評論](https://thezvi.substack.com/p/on-openais-model-spec-20)。

## 學生實驗：用 prompt 能不能換到安全

Hugh Van Deventer 問的是：拿一個安全訓練很少的模型，給它詳細的安全 system prompt，表現能不能接近專門做過安全訓練的模型？他的 LessWrong 文章把這一講誤標成「Week 3」，內容確實是這一講的實驗。

**設定**：

- 模型：DeepSeek-R1-Qwen3-8B 當「base」；RealSafe-R1-8B 是蒸餾到 Llama-3.1-8B 並加上安全訓練的版本，其訓練受 Deliberative Alignment 啟發。
- System prompt 三種風格：Minimal（幾句話講有用、誠實、無害）、Principles（八條高層原則）、Rules（約三十行、分六類的操作規則），加上所有組合與無 prompt 基準，每個模型 8 種設定。
- 評測：從 OR-Bench 的 80k、hard、toxic 三個子集各抽 150、50、200 題，量過度拒答與正確拒答；另從 MMLU-Pro 抽 100 題當能力檢查。每種設定跑 3 次。

**觀察**：

- 在 DeepSeek 上，Minimal prompt 反而明顯增加過度拒答，作者推測是規範太模糊，模型寧可保守。
- **Principles 和 Rules 之間看不出一般性的差異**：不同指標上的排序互相矛盾。
- 任何一種 system prompt 都大幅提高 DeepSeek 對有害請求的拒答率。
- RealSafe 的安全訓練讓它在 OR-Bench-hard 上幾乎全部拒答。
- 加測 GPT-4o、Claude 3.5 Sonnet、Gemini 2.5 Flash：在 OR-Bench-hard 上，前兩者用 Principles 的過度拒答最低，Gemini 則是 Rules 最低。**風格效果高度依賴模型。**

**結論與限制**：如果只看這幾個 benchmark、同時要求低過度拒答與高正確拒答，加上 system prompt 的 DeepSeek 在正確拒答上可以追到 RealSafe 的 5% 以內，過度拒答少了好幾倍。作者自己列出的限制也很重：兩個模型的蒸餾目標不同（Qwen3 對 Llama），只跑了 3 次、沒有做假設檢定，DeepSeek 在 MMLU-Pro 上常常因為 token 上限還沒寫出答案就被截斷。

作者的解讀是：prompt 是在既有分布裡挑子分布，可以逆轉、可以依用途調整，但也會被後來的 prompt（包括 jailbreak）蓋掉；安全訓練試圖改變底層分布，比較持久，但難以精準瞄準，容易矯枉過正。他建議兩者並用。

## 這一篇可以確認與不能確認的

可以確認：課站列出的講題與閱讀清單；錄影內容（依自動字幕）；投影片前幾張的文字（計畫、三時期表、三種對齊目標）；Drive 資料夾的檔案清單；實驗文與 repo；兩篇論文的摘要。不能確認：課站條列的「Lessons from law」在投影片後段是否有更完整的內容（PowerPoint Online 只擷取到前幾張，錄影裡只談到兩大法系與法規字數）；錄影沒有討論 SpecEval 與 Statutory Construction，本文只依論文摘要介紹；各組 Google Doc 的完整內容本文沒有逐份核對。

錄影最後預告了期中 mini-project：四篇論文擇一重現，約一個月，細節見[期中專題那篇](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project)。

延伸閱讀：站上 [CS329Z 的 LLM-as-judge 與安全評測](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)談「用模型評模型」的陷阱，可以對照 SpecEval 的三方一致性設計。

系列導覽：[系列入口](/posts/ai/2026-09-30-cs2881r-course-overview)｜上一篇 [L3：jailbreak、prompt injection 與從軟體安全借來的教訓](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness)｜下一篇 [L5：Content Policies](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies)

## 參考資料

- [CS 2881R AI Safety, Fall 2025 課程官網（講次表與閱讀清單）](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [Lecture 4 錄影：Model Specs](https://youtu.be/LQ0RRQKKluc)
- [Lecture 4 投影片（Harvard SharePoint）](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EXdpmz_cKGpGpQhFegF_kCcBEcH1ocP-9cx8EkLX3d8SXw?e=MLtrtn)
- [課堂產出的 model specs（Google Drive）](https://drive.google.com/drive/folders/1y6Du6cZwKxODPas3mQPKltAA65CvgmWD)
- [Hugh Van Deventer：Can We Prompt Our Way to Safety?（LessWrong）](https://www.lesswrong.com/posts/hgMDvLyomQjpKiG2v/cs-2881r-can-we-prompt-our-way-to-safety-comparing-system)
- [實驗投影片（Google Slides）](https://docs.google.com/presentation/d/1FdzsVHCcDn8Az26XGJm_P4X4mley_LWcmdIClvC4OuY/edit?usp=sharing)
- [hughvd/prompting-vs-safety-training（GitHub）](https://github.com/hughvd/prompting-vs-safety-training)
- [OpenAI Model Spec](https://model-spec.openai.com/)
- [Zvi Mowshowitz：On OpenAI's Model Spec 2.0](https://thezvi.substack.com/p/on-openais-model-spec-20)
- [Ahmed et al. 2025：SpecEval: Evaluating Model Adherence to Behavior Specifications](https://arxiv.org/abs/2509.02464v1)
- [He et al. 2025：Statutory Construction and Interpretation for Artificial Intelligence](https://arxiv.org/abs/2509.01186)
- [Chatterji et al.：How People Use ChatGPT（NBER）](https://www.nber.org/system/files/working_papers/w34255/w34255.pdf)
- [Anthropic：Claude system prompts](https://docs.anthropic.com/en/release-notes/system-prompts)
