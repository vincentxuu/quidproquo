---
title: "台大陳縕儂 ADL 2025 Fall 導讀：對話系統與工具使用——從 LU／DST／Policy／NLG 到 LaMDA、WebGPT、Toolformer"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, conversational-ai, task-oriented-dialogue, tool-use]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 16
tldr: "對話系統分成閒聊與任務型兩支。任務型系統傳統上拆成四個模組：語言理解（LU）把句子變成 domain／intent／slot，對話狀態追蹤（DST）累積使用者目標，對話策略決定下一步系統動作，NLG 把動作寫回句子。LLM 能自己把四步演完，卻沒辦法真的去訂位，所以要接外部工具：LaMDA 學會呼叫搜尋、計算機與翻譯器，BlenderBot 2.0 加上網路搜尋與長期記憶，WebGPT 用人類示範、reward model 與 PPO 學會操作瀏覽器，Toolformer 則讓模型自己產生並篩選工具使用的訓練資料。最後是對話怎麼評：自動指標、四種人工評估，以及 LLM-Eval。ADL Fall 2025 只有影片，投影片用 Fall 2024 版補位。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 16 篇導讀，依影片 13.1–13.9 與 Fall 2024 講義 241030_ConvAI.pdf（108 頁）：任務型對話四模組與各自的評估、LaMDA、BlenderBot 1／2／3、WebGPT、Toolformer、對話評估與 LLM-Eval；Plan-and-Execute、User Interaction、Theory-of-Mind 三支影片在 2024 講義找不到對應頁，只列名稱。"
draft: false
glossary:
  - term: "Dialogue State Tracking"
    aliases: ["DST", "對話狀態追蹤"]
    definition: "任務型對話系統中，把多輪對話裡使用者已經說過的需求累積成一組 slot-value（例如 star=5、day=sunday）的模組。"
    context: "ADL ConvAI 講義第 19–22 頁，評估用 slot accuracy 與 joint accuracy。"
  - term: "Toolformer"
    definition: "讓語言模型只靠少量示範，自己在文字裡插入 API 呼叫、篩掉沒用的呼叫，再用留下的資料微調自己，學會何時呼叫哪個工具的方法。"
    context: "ADL ConvAI 講義第 69–72 頁，工具集是 QA、WikiSearch、Calculator、Calendar、MT。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)播放清單上的 L13 影片，投影片則用 Fall 2024 版補位。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 16 篇。前兩篇 [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents) 與 [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning) 講模型怎麼想、怎麼規劃；這一篇退回「和人對話」這個老問題：**從模組化的任務型對話系統，到會自己用工具的 LLM，中間發生了什麼？**

用到的官方材料：

- **影片**：[2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)上的 13.1–13.9。說明欄都寫「2025/11/24 Applied Deep Learning」。課程頁 11/24 那列寫的是「Personalization」，沒有講義也沒有影片連結。
- **投影片**：Fall 2025 沒有公開這一講的講義。本文用 [Fall 2024 的 Conversational Modeling 講義（241030_ConvAI.pdf，108 頁）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf)，它是 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~miulab/f113-adl/)2024/10/30 那一講的材料。**下文引用的頁碼全部指這份 2024 講義。**

| # | 影片（2025） | 中文副標 | 長度 | 2024 講義對應頁 |
|---|---|---|---|---|
| 13.1 | [Learning to Converse and Interact](https://youtu.be/8EV-Qw2iYYE) | 機器學習如何與人對話互動 | 15:02 | 2–37 |
| 13.2 | [Tool Use in LLMs – LaMDA](https://youtu.be/LHhxbXKfnKs) | Google 推出的對話模型讓員工都以為機器出現意識!? | 13:15 | 38–49 |
| 13.3 | [Tool Use in LLMs – BlenderBot](https://youtu.be/B5s3XJIbQtc) | 能記憶使用者過去互動與外部知識的對話模型 | 9:49 | 50–58 |
| 13.4 | [Tool Use in LLMs – WebGPT](https://youtu.be/SVIgPfF16pE) | 整合搜尋引擎能力的GPT | 7:14 | 59–68 |
| 13.5 | [Toolformer](https://youtu.be/PdPK_f-aH3I) | 產生讓 GPT 使用工具的訓練資料 | 7:43 | 69–72 |
| 13.6 | [Plan-and-Execute](https://youtu.be/FK-r_-dVHcI) | 規劃策略後執行 | 15:11 | 找不到 |
| 13.7 | [User Interaction](https://youtu.be/fzzOlH0t0_w) | 與使用者互動比單獨執行更有效 | 15:11 | 找不到 |
| 13.8 | [Theory-of-Mind](https://youtu.be/rThWbHBA6e4) | 了解使用者互動時的內心 | 12:47 | 找不到 |
| 13.9 | [Conversation Evaluation](https://youtu.be/gjiKrxiAyNI) | 評估對話系統的好壞 | 13:07 | 99–106 |

「對應頁」是本文依主題比對的結果，影片實際放的投影片是不是這幾頁，沒有辦法從公開資訊確認。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=8EV-Qw2iYYE
title: 13.1
```

```youtube
url: https://www.youtube.com/watch?v=LHhxbXKfnKs
title: 13.2 LaMDA
```

原始影片：[13.1](https://www.youtube.com/watch?v=8EV-Qw2iYYE)、[13.2 LaMDA](https://www.youtube.com/watch?v=LHhxbXKfnKs)、[13.3 BlenderBot](https://www.youtube.com/watch?v=B5s3XJIbQtc)、[13.4 WebGPT](https://www.youtube.com/watch?v=SVIgPfF16pE)、[13.5 Toolformer](https://www.youtube.com/watch?v=PdPK_f-aH3I)、[13.6 Plan-and-Execute](https://www.youtube.com/watch?v=FK-r_-dVHcI)、[13.7 User Interaction](https://www.youtube.com/watch?v=fzzOlH0t0_w)、[13.8 Theory-of-Mind](https://www.youtube.com/watch?v=rThWbHBA6e4)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

字幕嘗試（2026-10-10）：嵌入的 13.1（15:02）與 13.2（13:15）在 YouTube 上沒有可取得的字幕，影片內容未核對；文章本來就聲明沒有逐字聽寫，內容依 Fall 2024 講義，對影片只引用標題、副標、長度與說明欄。兩支的上傳日是 2025-11-25、說明欄寫 2025/11/24，與文章一致。

## 對話系統的兩支

講義第 3 頁用四句話分出人為什麼需要對話系統：「我想聊天」是社交閒聊，要通過圖靈測試那種像人；「我有問題」是資訊查詢；「我要把這件事辦完」是任務完成，例如訂高雄到台北的車票、訂鼎泰豐今晚 7 點 5 人；「我該怎麼做」是決策支援。第 4 頁把它收成兩支：**閒聊（chit-chat）與任務型（task-oriented）**。

## 任務型對話：四個模組

第 5 頁的架構引 Young（2000）：語音辨識之後，依序經過 **LU → DST → Dialogue Policy → NLG**，再接語音合成。整份講義用同一個例子串起來：使用者說「Can you help me book a 5-star hotel on Sunday?」，系統回「For how many people?」。

**語言理解 LU（第 10–17 頁）** 分三步：先判斷 domain（旅館），再判斷 intent（Hotel_Book），最後做 slot filling，用 B-／O 標籤標出 star=5、day=sunday 這類欄位。三步都要預先定義好 ontology 或 schema。第 15–16 頁介紹把 intent 與 slot 一起做的 joint 模型，包括 Goo 等人（2018）的 Slot-Gated 模型。評估（第 17 頁）分兩層：domain／intent 準確率與 slot F1，以及整個 frame 是否全對的 frame accuracy。

**對話狀態追蹤 DST（第 18–22 頁）** 把多輪對話累積成一個狀態。使用者第二輪補一句「For two people, thanks!」，狀態就從 Hotel_Book(star=5, day=sunday) 變成多了 people_num=2。第 20–21 頁處理「slot 值不在固定清單裡」的問題（Xu & Hu 2018、TripPy）。評估用 slot accuracy 與 joint accuracy。

**對話策略 Dialogue Policy（第 23–29 頁）** 根據狀態決定系統下一個動作，例如 request(people_num) 或 inform(hotel_name=B&B)。第 25 頁對比兩種學法：監督式是「跟老師學」，老師說看到 Hello 就回 Hi；強化學習是「跟評論者學」，只知道整段對話最後好不好。第 27–28 頁用 Li 等人（2017）的 Deep Q-Network 對話管理器與端到端 TC-Bot 示範。評估分成回合層級（系統動作準確率）與對話層級（任務成功率、reward）。

**NLG（第 30–33 頁）** 把 inform(name=B&B) 寫回「I have book a hotel B&B for you.」這類句子。第 32 頁用微調預訓練 GPT-2 做條件生成，理由是預訓練模型寫出來的句子比較流暢。評估分自動指標與人工評估。

**怎麼做**：挑一個你常用的訂位或客服聊天機器人，照第 5 頁的四格各寫一行：它這一輪理解到的 intent 和 slot 是什麼、目前狀態累積到哪、下一個系統動作是什麼、最後寫出的句子是什麼。寫不出來的那一格，通常就是它答非所問的地方。

## LLM 自導自演，但訂不到位

第 36 頁的標題是「自導自演」。使用者請 LLM 訂台北 101 上的餐廳，LLM 很自然地追問日期與人數，接著說「讓我查看餐廳的可用性」，過一陣子再回報沒有位子。整段看起來很像任務型對話，但它其實沒有連到任何訂位系統，查詢結果是編出來的。這頁的結論是：**必須能存取外部工具。** 第 37 頁把四個模組重畫一次，說明 LLM 一個模型就能把 LU、DST、Policy、NLG 演完，缺的是接到外部世界的那一步。

接下來四個模型，就是四種接工具的方式。

## LaMDA：學會查資料來修正自己（第 38–49 頁）

[LaMDA（Thoppilan et al., 2022）](https://arxiv.org/abs/2201.08239)。

- **預訓練**：用公開對話資料，講義寫 1.56T 個詞；輸入是對話歷史，輸出是當下這一句。第 39 頁舉的例子是問它對蔡依林演唱會的看法。
- **品質與安全微調（第 40 頁）**：同一個模型同時負責生成與判別。訓練資料寫成「對話 + RESPONSE + 回應 + 屬性名稱 + 分數」的格式，屬性有 SENSIBLE、INTERESTING、UNSAFE，這樣就能先生成、再用同一個模型打分。
- **Groundedness（第 42–49 頁）**：教 LaMDA 用搜尋引擎驗證或修正自己的說法。系統分成三個角色：LaMDA-Base 是原本的預訓練模型，LaMDA-Research 決定要不要用外部工具、查詢要怎麼寫，Tool Set 是外部工具，包括計算機（「135+7721」→「7856」）、翻譯器與資訊檢索系統。第 49 頁的例子：Base 先寫「他現在 31 歲」，Research 去查 Nadal 的年齡，查到 35，再把回應改成 35 歲。講義也寫到，有 4 萬個對話回合被標成正確或錯誤，拿來訓練排序。

第 49 頁的收尾句：LaMDA 已經把 RAG、工具使用與事實對齊這三個概念放進同一個系統。

## BlenderBot：搜尋、記憶與安全（第 50–58 頁）

- **BlenderBot 1（[Roller et al., 2020](https://arxiv.org/abs/2004.13637)，第 51 頁）**：用 15 億段對話預訓練，模型大小有 90M、2.7B、9.4B 三種。微調資料叫 Blended Skill Talk，混合三種能力：個性（PersonaChat）、知識（Wizard of Wikipedia）、同理心（Empathetic Dialogues）。生成時用「先檢索、再修改」的策略。
- **BlenderBot 2.0（第 52–55 頁）**：加上網路搜尋與長期記憶，分別對應 Wizard of the Internet 與 Multi-Session Chat 資料。安全面的做法是：在 BAD 資料集上學會在不安全的回應後面接一個 `_POTENTIALLY_UNSAFE_` 標記。
- **BlenderBot 3.0（[Shuster et al., 2022](https://arxiv.org/abs/2208.03188)，第 56–58 頁）**：兩個訓練技巧。SeeKeR 依序生成搜尋查詢、知識片段、最後的回應；Director 學會避開不想要的序列，講義列出矛盾、重複與有毒內容三種。它也透過與真人互動收集回饋來持續改進。

## WebGPT：跟人學怎麼用瀏覽器（第 59–68 頁）

[WebGPT（Nakano et al., 2021）](https://arxiv.org/abs/2112.09332) 的三步和 InstructGPT 很像：

1. **監督式微調（第 60 頁）**：題目來自 ELI5，例如「哈利波特和魔戒哪個字數比較多？」，人類示範者寫出附參考來源的答案，拿來微調 GPT-3。
2. **Reward model（第 64 頁）**：同一題的兩個模型輸出，由人標出哪個比較好。
3. **用 PPO 做強化學習（第 65 頁）**：reward model 打分，再更新生成策略。

第 62–63 頁用中文例子說明「產生搜尋查詢」本身也是一種 token 接續；第 66 頁用 TruthfulQA 評估真實性。第 68 頁列出 WebGPT 的動作集，並留下一個問題：**沒有人類示範時，模型要怎麼學會使用這些動作？** 這就是 Toolformer 要解決的事。

## Toolformer：自己產生工具使用資料（第 69–72 頁）

[Toolformer（Schick et al., 2023）](https://arxiv.org/abs/2302.04761) 的副標是「語言模型能自己教自己用工具」。講義用中文例子講兩步：

1. **用 prompt 產生候選資料（第 70 頁）**：輸入「台北房價最高的區域是大安區。」，模型在句子裡插入一個工具呼叫：「台北房價最高的區域是 [QA("台北哪一行政區房價平均單價最高？")]。」
2. **只保留驗證過的資料來微調（第 71 頁）**：真的去呼叫 QA 工具，拿回「大安區」，和原句後面的答案對得上，這筆資料才留下來微調。講義只用這個例子示意，篩選的精確條件請看原論文。

第 72 頁列出工具集：QA、WikiSearch、Calculator、Calendar、MT，任務是補完一句缺了事實（日期或地點）的短句。第 108 頁的結語把兩者並排對照：**WebGPT 從人類的操作步驟學，Toolformer 從自己產生的資料學。**

講義第 73–98 頁接著講 GPT Store、ChatGPT Plugins、推薦系統與 SalesBot（把閒聊自然轉到任務型對話），這幾頁在 2025 影片標題裡沒有對應，本文不展開。

## 2025 新增的三支影片：只列名稱

下面三支影片在 2024 講義裡找不到對應頁，Fall 2025 又沒有公開投影片。本文只寫標題與副標：

- **13.6 Plan-and-Execute**：規劃策略後執行
- **13.7 User Interaction**：與使用者互動比單獨執行更有效
- **13.8 Theory-of-Mind**：了解使用者互動時的內心

規劃這條線可以接回[第 14 篇 Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents) 講義裡 planning 那一段；更完整的整理見延伸閱讀的 CMU 11-768。

## 對話怎麼評（第 99–106 頁）

**自動評估（第 100 頁）**：拿模型回應和標準答案比。講義列四種：perplexity（模型生成標準答案的可能性）、n-gram 重疊（BLEU 等）、slot error rate（該提的 slot 有沒有提到）、distinct n-grams（回應的多樣性）。

**人工評估有四種（第 101–104 頁）**，差別在兩個維度：看一個模型打分，還是兩個模型比較；看單一回應，還是實際聊完一段再評。

| | 單一回應 | 聊完整段 |
|---|---|---|
| 打 0–5 分 | Likert | Dynamic Likert |
| 兩個選一個 | A/B | A/B Dynamic |

四種都依「像人、流暢、連貫」三個面向評。後兩種動態評估引 [ACUTE-EVAL（Li et al., 2019）](https://arxiv.org/abs/1909.03087)，而 A/B Dynamic 等於在做對話層級的評估。

**LLM-Eval（第 105–106 頁）**：陳縕儂老師實驗室自己的工作（[Lin & Chen, 2023](https://arxiv.org/abs/2305.13711)）。講義寫 LLM 評對話回應有一定能力，LLM-Eval 在單輪與多輪都表現不錯，和人工分數的相關性比既有指標都好。結論是 LLM-Eval 的分數可以當人工評估的替代指標。

**怎麼做**：下次比較兩個聊天機器人時，不要只看一則回應。照 A/B Dynamic 的做法，拿同一個任務和兩邊各聊完一整段，再依「像人、流暢、連貫」三項選邊。這是四種人工評估裡最接近真實使用情境的一種。

## 本文能確認與不能確認的

能確認：九支影片的標題、中文副標、長度與說明欄（YouTube oEmbed 與 yt-dlp 核對）；Fall 2024 ConvAI 講義 108 頁的標題與列點；上面引用論文的 arXiv 標題。

不能確認：Fall 2025 影片實際放的投影片是不是這份 2024 講義，或改了多少。13.6–13.8 三支影片的內容。本文沒有逐字聽寫影片，老師口頭的補充與例子沒有寫進來。講義裡的數字（1.56T 個詞、15 億段對話等）照講義轉述，精確數字請以原論文為準。

## 延伸閱讀

- [CMU 11-768 第 2 講：Tool Use](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use) 與 [第 5 講：Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning)：比本篇更新的工具使用與規劃整理，可以補 13.6 的空白。
- [CS224N：RAG 與 Language Agents](/posts/ai/2026-08-22-cs224n-rag-language-agents)。
- [CS224N：Benchmark 與評估](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)、[CME295：LLM Evaluation](/posts/ai/2026-09-29-cme295-llm-evaluation)：LLM-as-judge 的更多討論。
- 本系列 [RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3) 也講到 WebGPT，這篇著重它的工具使用面。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning)｜下一篇 [超越監督學習與多模態](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：嘗試依字幕核對 13.1、13.2，但兩支都取不到字幕，內容未核對；文章未改動。

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[13.1](https://youtu.be/8EV-Qw2iYYE)、[13.2 LaMDA](https://youtu.be/LHhxbXKfnKs)、[13.3 BlenderBot](https://youtu.be/B5s3XJIbQtc)、[13.4 WebGPT](https://youtu.be/SVIgPfF16pE)、[13.5 Toolformer](https://youtu.be/PdPK_f-aH3I)、[13.6 Plan-and-Execute](https://youtu.be/FK-r_-dVHcI)、[13.7 User Interaction](https://youtu.be/fzzOlH0t0_w)、[13.8 Theory-of-Mind](https://youtu.be/rThWbHBA6e4)、[13.9 Conversation Evaluation](https://youtu.be/gjiKrxiAyNI)
- [241030_ConvAI.pdf（Conversational Modeling，Fall 2024 講義）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf)
- [ADL Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~miulab/f113-adl/)
- [LaMDA: Language Models for Dialog Applications（arXiv 2201.08239）](https://arxiv.org/abs/2201.08239)
- [Recipes for building an open-domain chatbot（BlenderBot，arXiv 2004.13637）](https://arxiv.org/abs/2004.13637)
- [BlenderBot 3（arXiv 2208.03188）](https://arxiv.org/abs/2208.03188)
- [WebGPT: Browser-assisted question-answering with human feedback（arXiv 2112.09332）](https://arxiv.org/abs/2112.09332)
- [Toolformer: Language Models Can Teach Themselves to Use Tools（arXiv 2302.04761）](https://arxiv.org/abs/2302.04761)
- [ACUTE-EVAL（arXiv 1909.03087）](https://arxiv.org/abs/1909.03087)
- [LLM-Eval（arXiv 2305.13711）](https://arxiv.org/abs/2305.13711)
