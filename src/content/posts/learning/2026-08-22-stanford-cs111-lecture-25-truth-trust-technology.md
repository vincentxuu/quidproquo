---
title: "Stanford CS111 Lecture 25：Truth, Trust, and Technology——演算法、生成式 AI 與 deepfake 如何改寫信任"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 26
tldr: "第 25 講把 trust 拆成假設、推論與替代三種建立方式，再檢視社群推薦、生成式 AI 與合成媒體如何放大過度信任；實務答案是保留來源、交叉驗證並協調責任。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 25，涵蓋 trust、confirmation bias、社群推薦、AI hallucination、deepfake 與來源驗證。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-25-truth-trust-technology-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 26 篇，對應 **Stanford CS111, Spring 2026, Lecture 25**。2026-05-27 由 Mendel Rosenblum 主講，官方題目是 [Truth, Trust, and Technology](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf)。本文依 13 頁公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)逐頁整理；錄影在 Canvas／Panopto，未把它當成已讀來源。

這堂課刻意離開傳統 OS 機制，接回 Lecture 12 的 trust 框架：當人無法親自驗證所有資訊，如何把判斷委託給平台、AI 與媒體？主旨不是「科技都不可信」，而是信任能延伸行動能力，也同步帶來被誤導的風險。

## 逐頁 agenda

- 第 1–2 頁：題目與無指定選讀。
- 第 3 頁：信任定義；假設、推論、替代；過度信任與不值得信任。
- 第 4–5 頁：基本事實的分歧；資訊成本、confirmation bias 與「很多人都這樣說」。
- 第 6–7 頁：社群媒體的注意力誘因、個人化內容與責任分配。
- 第 8–9 頁：生成式 AI 的權威語氣、具體細節、hallucination 與獨立驗證。
- 第 10–11 頁：deepfake、真假皆可被否認，以及標示、偵測與制度回應。
- 第 12–13 頁：可信來源的可觀察訊號、小組討論與結論。

## 信任是延伸 agency，也是一種暴露

第 3 頁引用 [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244) 所採用的定義：信任者預期另一方會完成對自己重要的事，因此願意暴露在對方的行動之下，即使無法監看或控制對方。重點不在情感，而在**願意承受依賴產生的脆弱性**。

投影片列出三條建立路徑。**假設**是不查核先相信，成本低但脆弱；**推論**從過往紀錄、能力與行為推估，資訊量最大，也可能受偏誤污染；**替代**則建立在另一個已信任的機制或機構上，例如採用揭露方法、接受審查並保留更正紀錄的來源，而不是親自重做每項實驗。

失敗也有兩面：信任者可能把信任延伸得太遠，也就是 over-trust；受託者可能缺乏可靠性、誠信或照護，不值得這份信任。信任能讓人完成單靠自己做不到的事，但三種路徑都不會自動保證真實。

## 從事實分歧到 confirmation bias

第 4 頁以選舉、經濟、犯罪與氣候說明群體可能連基本事實都不同意。投影片用「真相只有一個，因此有數千萬人錯了」凸顯邏輯衝突，不是要本文替每個例子裁判。

第 5 頁把原因寫成「我相信的」遠大於「我親自感知的」。個人沒有資源重做所有統計、調查或科學量測，只能選擇他人的資訊與結論。這項必要委託碰上兩種易錯捷徑：因來源肯定既有信念而信它，以及把聲量或重複次數誤認成真實性。後者忽略許多訊息可能都回溯到同一個來源。

實用的自查不是要求自己「沒有偏見」，而是改變流程：搜尋前先記下哪些證據會改變判斷；閱讀立場相反但有可追溯來源的材料；看到多個相同說法時，沿連結往回確認是否真有多份獨立證據。

## 社群推薦：互動訊號不是 truth signal

第 6 頁的誘因鏈是：注意力可轉成收入，強化恐懼或既有立場可能增加互動，個人化推薦便持續供應符合信念的材料。這不只讓每人看到不同內容，也可能把「我反覆看到」錯覺成「大家都相信」。第 7 頁因此強調：按讚、互動與分享是參與訊號，不是真實性證明；「演算法顯示給我」也不同於編輯依可問責程序選入。

投影片列出焦慮、憂鬱、身體意象困擾與自殺念頭，但原句把因果與法院判決壓得過短。較穩妥的對照是美國 Surgeon General 的[青少年社群媒體與心理健康 advisory](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html)：它認為有重大風險與可能益處，也明說證據仍有缺口，不能推成「任何使用必然導致特定疾病」。本文也不把投影片的法院概述當成法律結論。

誰負責？投影片列出平台、政府／立法與使用者，答案是需要協調。平台掌握排序目標與資料，政策制定者能建立透明與安全要求，使用者能調整分享與查核習慣；任何一方都缺少獨力處理問題所需的全部權限與資訊。

## 生成式 AI：流暢與具體不等於可靠

第 8 頁承認 ChatGPT、Claude 等工具能產生有用資訊，再問它們為何容易獲得信任。投影片列出權威語氣、詳細解釋、大量具體「事實」，以及答錯時仍可能表現自信。[Bansal et al. 2021](https://dl.acm.org/doi/10.1145/3411764.3445717) 探討 AI 輔助決策中對解釋的適當依賴；[Bower et al. 2024](https://link.springer.com/article/10.3758/s13423-023-02433-9)研究專家與新手如何從語言判斷他人的知識程度。兩者支持的是「呈現方式會影響信任判斷」這個較窄命題，不等於所有 AI 回答都會欺騙所有人。

NIST 的[生成式 AI 風險管理框架](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)用 **confabulation** 指模型自信地產生錯誤、虛假或前後矛盾內容，也提醒貌似合理的推理或引用可能加深不當信任。這是風險描述，不表示每個輸出都錯。

AI 藏進搜尋、文件或通訊軟體後，使用者也可能忘記一句話來自模型；同一個 hallucination 經複製與摘要，還可能看似得到多個來源支持。第 9 頁的操作結論是：把輸出視為待檢驗假說，不把生成本身當證據；涉及重要事實時，回到獨立的一手資料完成「替代式」驗證。

## Deepfake：不只相信假的，也可能否認真的

第 10 頁指出，製作可信的照片、聲音與影片曾經成本較高，人們因此有理由從媒介形式推論可信度；生成技術降低了製作逼真假內容的門檻。投影片並列兩種錯誤：把標示為 AI 的影片當真，以及把可能真實的錄音斥為 deepfake。後者說明傷害不只是假內容被相信，也包括任何不利證據都更容易被否認，讓整體 epistemic trust 崩解。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf)）

第 11 頁要求放棄對影像與聲音的無條件信任，改以附加驗證建立判斷。它提出標示 AI 內容、改善偵測、支持記者與可信機構，以及防止未經同意複製聲音或肖像。[C2PA Content Credentials 規格](https://spec.c2pa.org/)能提供可驗證的來源與編輯歷程，但規格明確不替內容判斷真假或善惡：能驗證 provenance，不等於證明命題為真；缺少 credential 也不能單獨證明內容為假。

投影片另引用一段歸於 Hannah Arendt、談人民不再相信任何事物時便失去判斷能力的話。本文保留它在課堂論證中的功能，但不把投影片視為逐字引文的一手出處；若要引用原句，仍應查作品、版本與上下文。

## 把討論題變成查核表

第 12 頁問哪些 observable 能提示來源可信或不可信。以下不是官方答案，而是把題目轉成可執行流程。

1. **找原始來源**：能否回到資料、判決、論文、官方紀錄或完整陳述？
2. **查方法與更正**：來源是否揭露方法、限制與可見的更正紀錄？
3. **辨識獨立性**：多個來源是否都在轉述同一貼文、新聞稿或模型輸出？
4. **拆開訊號**：追蹤數、分享數、流暢文字與高畫質影像只能說明傳播或呈現。
5. **先寫反證條件**：搜尋前記下什麼證據會推翻目前看法。
6. **依風險調整門檻**：醫療、法律、財務或公共決策要提高來源權威性與交叉驗證要求。

## 這講在 CS111 的位置

Lecture 25 看似偏離檔案系統，實際延續整門課的習慣：不要只看介面輸出，要追問誰維護狀態、保證什麼不變量、失敗時能觀察到什麼。這次共享資源是社會對資訊的信任，失敗模式是來源模糊、錯誤複製與判斷外包。

第 13 頁沒有提供偵測器或法規作為萬靈丹。信任不可或缺，確認偏誤也難完全避免；科技讓不可靠來源顯得可信，也讓人更容易過度依賴熟悉、方便的來源。課堂認為最有希望的是擁有長期可信紀錄的機構，卻留下問題：人們是否願意信任它們？設計題因此是讓來源、程序、更正與責任更可觀察，而不是要求使用者憑直覺猜真假。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 25 slides: Truth, Trust, and Technology](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf)
- [Gabriel et al., The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244)
- [Bansal et al., Does the Whole Exceed its Parts?](https://dl.acm.org/doi/10.1145/3411764.3445717)
- [Bower et al., How experts and novices judge other people’s knowledgeability from language use](https://link.springer.com/article/10.3758/s13423-023-02433-9)
- [U.S. Surgeon General, Social Media and Youth Mental Health](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html)
- [NIST AI 600-1, Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [C2PA Content Credentials specifications](https://spec.c2pa.org/)
