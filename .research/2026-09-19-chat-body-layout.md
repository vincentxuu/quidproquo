# Chat 內部配置研究（Ask AI 浮動視窗：空狀態／訊息區／輸入區）

- 日期：2026-09-19；延續 `.research/2026-09-19-chat-header.md`
- toolDegradation：Groundlane 未掛載 → Keenable keyless + curl + Playwright 實測 + GitHub 原始碼
- 讀取程度：元件庫（AI Elements / assistant-ui / CopilotKit / DocSearch）讀原始碼 ✅；Stripe / Vercel / Mintlify / kapa 實測 📸；ChatGPT / Claude / Perplexity / Gemini / Fin 多為 🟡 摘要或 [推論]
- 未驗證：Mintlify 對話中畫面（CAPTCHA）、手機斷點、Intercom 400px 寬度

## 現況盤點（quidproquo Ask AI body）
- 容器 `ChatFloating.tsx`：520×680（min 100vw-2rem / 100vh-8rem），bottom 5rem right 1.5rem；展開 = inset 1rem；無專門手機全螢幕分支。
- 空狀態 `ChatWidget.tsx:271-300`：建議問題區塊在 header 與 thread **之間**（border-b 獨立帶），2 欄 grid、可「換一批」；歡迎語是 messages[0]。額度 `QuotaIndicator` 也夾在 thread 上方。
- 訊息 `ChatMessageRow.tsx`：兩側都有頭像（**外連 api.dicebear.com** SVG，:61-62），AI 走 assistantPanel、使用者 bubble；ActivityLine 在答案上方；sources / related 以 LinkSection 列在答案底部。
- **無逐則動作**：沒有複製、重新產生、👍👎、追問建議。
- Thread `ChatThread.tsx`：ai-elements `Conversation`（use-stick-to-bottom、`role="log"`）＋ `ConversationScrollButton`；gap-4 p-4、背景 bg-subtle。
- Composer：ai-elements `PromptInput`，IME 已處理（prompt-input.tsx:978 isComposing）；**串流時 textarea 與送出鈕 disabled**；`PromptInputSubmit` 支援 `onStop`（:1213-1256）但 ChatThread 沒傳 → 停止鈕目前在 header。
- 無免責聲明、無「只根據本站文章」範圍說明（僅 header 副標）。
- IME 細節：prompt-input.tsx 有 compositionStart/End state + `nativeEvent.isComposing`，**沒有 `keyCode===229` 檢查**（Safari 選字 Enter 可能誤送，待真機驗證）；未設 `enterKeyHint`。

## 跨組模式（業界慣例）
| 區塊 | 慣例 | 我們現況 | 差距 |
|---|---|---|---|
| 空狀態 | 文件站 widget 沒有招呼語；建議問題 3–4 題、窄面板用直列、貼在輸入框上方；開始打字/對話後消失 | 建議區塊獨立一條夾在 header 下、2 欄 grid、可換一批；歡迎語是一則訊息 | 位置與密度 |
| 範圍/免責 | 一行灰字：header 正下方或輸入框下方 | 無 | 缺 |
| 頁面脈絡 | 少數（Mintlify 依頁面產生建議、Stripe 頁面 chip 可移除、Gemini 分享分頁） | 無 | 選配（我們是部落格，文章頁很適合） |
| 使用者訊息 | 右側淡色 bubble，≤~80% 寬 | bubble + 頭像 | 頭像可拿掉 |
| AI 訊息 | 無 bubble、滿版、無頭像（compact 面板） | 面板 + 外連 dicebear 頭像 | 省空間、去外部請求 |
| 來源 | 答案下方收合「使用了 N 個來源」或 inline chip＋hover card；同網域顯示文章標題 | sources + related 兩段 LinkSection 全展開 | 收合、改標題 |
| 工具活動 | 答案上方一行、執行中 shimmer、完成收合 | ActivityLine（已做，f090b57f） | ✓ 對齊 |
| 逐則動作 | 答案下方：複製、👍👎、重新產生（只在最後一則）；串流中隱藏 | 無 | 缺 |
| 追問建議 | 最後一則答案下 2–3 個 chip | 無（related 是文章連結） | 選配 |
| 捲動 | ⚠️ 見衝突表 | use-stick-to-bottom + ↓ 按鈕 | — |
| 錯誤 | 串內淡色 alert + 重試；「找不到」是正常回答不是錯誤 | 錯誤訊息直接寫進 content | 缺重試 |
| 輸入框 | 自動長高 textarea（上限 5–8 行）；Enter 送出、Shift+Enter 換行；IME 檢查 isComposing＋keyCode 229；送出鈕串流中變 ■ 停止 | 長高 ✓、IME 缺 229、串流時整個 disabled、停止在 header | 停止移進來、允許串流時先打字 |
| 行動版 | 輸入字 ≥16px 防 iOS 縮放、`enterkeyhint="send"`、safe-area | 未確認 | 待驗 |
| 快捷鍵 | ⌘K 被搜尋佔用時用 ⌘I 開 AI，按鈕上顯示 kbd | 無 | 選配 |
| 尺寸 | Carbon 浮窗 380 寬 / ≤640 高；支援放大 | 520×680 | 偏寬，可接受 |
| a11y | thread `role="log"`＋label；串流不逐字朗讀，隱藏 `role="status"` 報「回覆中／完成」；送出後 focus 留在輸入框 | role=log ✓（無 label）；status 未設 | 小修 |

## 衝突（不選邊，請拍板）
| 議題 | 說法 A | 說法 B |
|---|---|---|
| 串流時捲動 | 元件庫（AI Elements、assistant-ui）預設黏底，使用者上捲才停並出現 ↓ | NN/g：別捲到串流尾端，停在新回答開頭讓人從頭讀 |
| Stripe docs Ask AI 是否存在 | header 組與空狀態組 📸 實測看到 | composer 組、訊息組找不到一手證據（可能是 A/B 或地區限定）[推論] |

## 建議（依優先序）
1. 串流時允許打字、把停止鈕放回送出鈕位置（`PromptInputSubmit` 已支援 `onStop`，只差接線），header 拿掉停止。
2. 答案下方加動作列：複製、👍👎（串流結束才出現）；錯誤訊息加「重試」。
3. 來源改收合：「參考了 N 篇文章」→ 展開顯示文章標題；related 併入或只在最後一則顯示。
4. 空狀態：建議問題搬到輸入框上方、直列 3–4 題；加一行範圍/免責灰字（例：「只根據本站文章回答，AI 可能出錯」）。
5. 拿掉兩側頭像（尤其外連 dicebear），AI 訊息改滿版。
6. IME 補 `keyCode===229`、輸入字 16px、`enterKeyHint="send"`（需 Safari/iOS 真機驗證）。
7. a11y：log 加 aria-label、加 `role="status"` 回覆狀態。
8. 選配：文章頁的頁面 chip / 依文章產生建議問題；⌘I 快捷鍵；捲動策略依衝突表拍板。

---
# 附錄：原始蒐集（含來源 URL 與讀取層級）


# Body A — AI chat widget 空狀態 / 歡迎畫面研究

研究日期：2026-09-19。範圍：header 以下、第一則訊息之前的區域。
閱讀等級：✅ 全文或原始碼已讀 · 📸 本次用 Playwright 實際觀察（headless, 1440×900）· 🟡 只看到搜尋摘要 · [推論] 無一手來源，依先前認知或推論
截圖存於 `scratchpad/es/*.png`（stripe-ai、vercel-ai、mint-ai2）。

## 1. 各產品對照表

| 產品 | 問候 / 引導文字 | 泡泡 vs 置中主視覺 | 建議問題（數量／版型／刷新／是否感知頁面） | 免責聲明位置 | 開始對話後收起？ | 能力清單 | 頁面脈絡指示 | 來源 |
|---|---|---|---|---|---|---|---|---|
| **Stripe Docs Ask AI**（右側面板） | 無問候語。底部靠 composer 的說明文字：「Ask questions about Stripe and get help with your integration.」＋提示「Tip: you can highlight any text to ask questions about it with ⌘ + I」 | 都不是：純文字說明**靠底對齊**在 composer 上方，面板主體留白 | 這次觀察沒看到建議問題 | **header 正下方**一行小灰字：「Responses are generated using AI and may contain mistakes.」 | [推論] 說明文字應會被訊息取代 | 沒有 | **有**：composer 上方顯示頁面 chip「📖 Build a payments page ×」（可移除）；頁面本體另有「Ask about this page」按鈕 | 📸 docs.stripe.com/payments/checkout |
| **Vercel Docs Ask AI**（右側面板） | 無問候語、無標題主視覺 | 都不是：建議清單**靠底對齊**在 composer 上方 | **4 則**，**帶 icon 的垂直清單**（純文字列，不是 chip）：What is Vercel? / What can I deploy with Vercel? / What is Fluid Compute? / How much does Vercel cost?。在 /docs/functions 頁面上仍是通用問題 → 這一頁**不感知頁面**（只看了一頁） | 空狀態沒看到 | [推論] 會 | 沒有；只有「Tip: You can open and close chat with ⌘ I」 | 沒看到 | 📸 vercel.com/docs/functions |
| **Mintlify assistant**（右側面板） | 無問候語 | 靠底：「Suggestions」標籤＋問題列在 composer 上方 | 觀察到 **1 則**（「What is the contextual menu?」，品牌色文字連結）。文件寫明**最多 3 則**；可以由 assistant **依使用者目前頁面產生**，也可以設成跨頁共用；後台有「Ask Assistant」按鈕推薦問題 | **header 正下方**置中小灰字：「Responses are generated using AI and may contain mistakes.」（跟 Stripe 同一句） | [推論] 會 | 沒有 | 文件：「Builds context from the page a user is viewing」；UI 上沒有 chip | 📸 mintlify.com/docs/ai/assistant；✅ mintlify.com/docs/ai/assistant、✅ mintlify.com/docs/assistant/configure |
| **kapa.ai** 網站 widget（modal） | 標題預設「[project] Docs AI」；沒有 intro 訊息設定 | 置中 modal，header 下方是免責聲明，再來是範例問題 | `data-modal-example-questions`：逗號分隔的**靜態清單**（預設不設定）；**按鈕網格**（`example-questions-col-span` 預設 6 → 12 欄網格中每列 2 顆）；不會刷新 | `data-modal-disclaimer`：放在 **modal 頂端**，支援 Markdown，預設不設定（小字、灰底 #F8F9FA、0.75rem） | [推論] 會 | 沒有；有 `data-uncertain-answer-callout`，信心低時附加在回答後 | 沒有；另有 `source-group-ids-include` 用來限縮知識範圍 | ✅ docs.kapa.ai/integrations/website-widget/configuration/legacy |
| **Inkeep**（cxkit ChatButton / EmbeddedChat） | `introMessage`：「Welcome message (supports markdown)」，例如「How can I help you today?」、「Welcome back ${userName}!」 | [推論] intro 以助理訊息呈現；這次沒有實際觀察 | `exampleQuestions: string[]`＋`exampleQuestionsLabel`（例如「Popular Questions」）＋`isFirstExampleQuestionHighlighted`（強調最常見的問題）；範例有 3 則；靜態 | `disclaimerSettings {isEnabled, label:"AI Assistant", tooltip:"Responses are AI-generated and may require verification."}` → **標籤＋tooltip**，不是一整段文字 | [推論] 會 | 沒有；`getHelpOptions` 在右下角提供支援管道按鈕 | 沒有 | ✅ docs.inkeep.com/cloud/ui-components/common-settings/ai-chat |
| **Algolia DocSearch v5 Ask AI** | 未確認 | 新對話畫面（嵌在 DocSearch modal 裡） | 三個不同的來源：①**Suggested questions**（新對話畫面，從專屬 index 抓已發布的紀錄，**最多 3 則**，含 `locale` 與 `order` 欄位）；②**Prompt suggestions**（使用者在關鍵字搜尋中**打字時**出現，預設 hitsPerPage 3，排在「直接問 AI」這個動作之後）；③**Streamed follow-ups**（只出現在最新一則回答下方） | 未確認 | 是：新對話畫面才有 suggested questions，後續問題只接在最新回答後 | 沒有 | 沒有（但第 ② 種會隨輸入內容變化） | ✅ docsearch.algolia.com/docs/agent-studio/prompt-suggestions |
| **Intercom Fin**（Messenger） | Messenger **Home** 區塊：Intro title「Ask a question」＋ subtext「AI Agent and team can help」＋ Fin 頭像＋ CTA 按鈕 | 首頁卡片（不是聊天泡泡）；可以設定成「Launch directly into Conversation」跳過 Home | 在這份文件裡沒有讀到 | subtext 本身就是 AI 揭露（「AI Agent and team…」）；關閉轉真人時這段 subtext 會移除 | 會；Home 和 Conversation 是不同的 space | 沒有 | 沒有 | ✅ intercom.com/help/en/articles/7837525；🟡 intercom.com/help/en/articles/6612589 |
| **HubSpot**（chatflow bot） | 歡迎訊息是 bot 的**第一顆聊天泡泡**；widget 收起時也會以 pop-up 顯示 | **泡泡** | quick replies（按鈕）接在歡迎訊息之後；屬於規則式設計 | 未確認 | 否，歡迎泡泡會留在對話紀錄裡 | 沒有 | 沒有（chatflow 可以依 URL 指定頁面觸發） | 🟡 github.com/HubSpot/bots-workshop、🟡 knowledge.hubspot.com/conversations/a-guide-to-bot-actions |
| **assistant-ui**（`ThreadWelcome`） | 「How can I help you today?」（text-2xl，淡入動畫） | **標題文字，不是泡泡**；thread 為空時 viewport 會 `justify-center` | `ThreadSuggestions` 渲染在 **composer 下方**，條件是 `isNewChatView && composer.isEmpty` → **使用者開始打字就隱藏**；**垂直清單**，每列有 `>` 前綴、Title＋灰色 Description，會 truncate；來源是 runtime 提供的 suggestions。另有 `ThreadFollowupSuggestions` 放在 composer 上方 | 預設模板沒有 | **會**：`<AuiIf condition={isNewChatView}><Welcome/>`；載入中的 thread 顯示 skeleton 而不是 welcome | 沒有 | 沒有 | ✅ github.com/assistant-ui/assistant-ui packages/ui/.../thread.aui.tsx（第 188–245、376–417 行） |
| **CopilotKit**（`labels.initial`） | `labels.initial: string \| string[]`，例如「Hi! 👋 How can I assist you today?」 | **泡泡**：`makeInitialMessages` 會轉成 `role:"assistant"` 訊息，接在真正訊息的前面 | `suggestions`：`"auto"`（預設，**開啟時由 AI 產生**，每次交流後重新產生，並透過 `useCopilotChatSuggestions` 帶入 app 狀態／頁面脈絡）／`"manual"`／靜態 `SuggestionItem[]` | 沒有內建 | **不會**：initial 泡泡會一直留在訊息串頂端 | 沒有 | 間接：AI 產生建議時會用到 readable 的 app 狀態 | ✅ github.com/CopilotKit/CopilotKit packages/react-ui/src/components/chat/Messages.tsx、Chat.tsx |
| **Vercel AI Elements**（`Suggestion`） | 元件本身不處理 | 元件本身不處理 | `<Suggestions>` 是**橫向單列、可捲動**（`flex-nowrap`、隱藏捲軸）的 `rounded-full` outline 小按鈕 → **chips**；demo 有 3 則；點擊會直接送出 | 不處理 | 由開發者決定 | 不處理 | 不處理 | ✅ github.com/vercel/ai-elements packages/elements/src/suggestion.tsx、docs suggestion.mdx |
| **ChatGPT**（主 app） | 置中大標題，例如「What can I help with?」／「Ready when you are.」 | 置中主視覺，composer 也在中間 | 曾有 4 張建議卡片，後來改成 composer 下方的少量 chip／工具膠囊，並且會變動 [推論，本次未驗證] | composer 下方小字「ChatGPT can make mistakes. Check important info.」[推論] | 會：第一則訊息送出後 composer 移到底部 [推論] | 沒有 | 不適用 | [推論] 無一手擷取（需要登入，這次沒有觀察） |
| **Claude.ai** | 置中、依時段的問候，例如「Good evening, {name}」 | 置中主視覺 | composer 下方有分類 chip（Write / Learn / Code…），點下去會展開範例 prompt [推論] | 回答下方／頁尾小字「Claude can make mistakes…」[推論] | 會 [推論] | 沒有明確清單 | 不適用 | [推論] 未驗證 |
| **Gemini**（Web ＋ Chrome 側邊面板） | Web 版：「Hello, {name}」置中 [推論]。Chrome 側邊面板：打開後會讀取目前分頁 | 置中 | 側邊面板有根據目前頁面的 prompt chip（摘要、要點等）[推論，只有第三方摘要] | 頁尾小字 [推論] | [推論] 會 | 沒有 | **有**：側邊面板以目前分頁作為脈絡（第三方摘要：「reads whatever page you are on」） | 🟡 digitbin.com/ask-gemini-in-chrome…、🟡 note.com/google_gemini/n/ne840249aec6a |
| **Perplexity** | 置中 wordmark＋搜尋框，沒有對話式問候 [推論] | 置中主視覺（搜尋引擎風格） | 搜尋框下方有少量輪替的趨勢／主題 chip；Discover 動態另外放 [推論] | 未確認 | 會（改成回答頁）[推論] | 沒有 | 不適用 | [推論] 未驗證 |

## 2. 模式

1. **文件型／嵌入型 widget 不放問候語。** Stripe、Vercel、Mintlify 都省略問候（📸）。它們只放一行短的範圍說明或提示文字，而且**靠底對齊、貼在 composer 上方**，面板上半部留白。置中的主視覺問候（「How can I help…」「Good evening…」）是全頁 app（ChatGPT、Claude、Gemini）和 assistant-ui 預設模板的做法。
2. **歡迎訊息做成泡泡，基本上只出現在客服／CRM 系產品**：HubSpot 和 CopilotKit `labels.initial`，這類泡泡會一直留在訊息串裡。文件 AI 系產品（Stripe、Vercel、Mintlify、kapa、assistant-ui）用的是**非訊息的空狀態區塊，開始對話就消失**。
3. **建議問題數量控制在 3–4 則。** 硬上限：Mintlify 最多 3、Algolia 最多 3；Vercel 4；Inkeep 範例 3；AI Elements demo 3。版型分兩派：**垂直文字清單**（Vercel 附 icon、assistant-ui 用 `>` 前綴、Mintlify 放在「Suggestions」標籤下）或**橫向可捲動 chips**（AI Elements）；kapa 則用 2 欄按鈕網格。窄的側邊面板偏好垂直清單。
4. **感知目前頁面是差異化功能，不是業界預設。** Mintlify 可依頁面產生問題；CopilotKit 的 `auto` 模式由 AI 產生；Stripe 用可移除的**頁面 chip** 顯示脈絡。Vercel、kapa、Inkeep 則用靜態清單。Algolia 另外把「新對話建議」「打字時建議」「回答後續問題」拆成三個來源。
5. **免責聲明都是一行小字、固定在 header 正下方。** Stripe 和 Mintlify 用的是同一句：「Responses are generated using AI and may contain mistakes.」；kapa 放在 modal 頂端；Inkeep 做成標籤＋tooltip。聊天型 app 則放在 composer 下方 [推論]。
6. **輔助提示**：用鍵盤快捷鍵提示（⌘I）取代能力清單。這次看的產品都沒有「我能做什麼」清單。
7. **輸入即隱藏**：assistant-ui 在 composer 一有內容就隱藏建議；Inkeep 可以強調第一則問題。

## 3. 對 quidproquo「Ask AI」widget 的建議（僅供參考）[推論]
- 不放問候泡泡。空狀態分成三層：header 下一行免責聲明 → 空白 → 靠底的一行範圍說明（「根據本站文章回答，附引用」）＋ 3 則建議（垂直清單）。
- 在文章頁：composer 上方放可移除的「本文」chip（參考 Stripe），並把 1 則建議換成跟本文相關的問題（參考 Mintlify）；首頁／列表頁用 3 則精選的通用問題（zh-TW／en 各一組，Algolia 的 `locale` 欄位是先例）。
- 第一則訊息送出後整個空狀態收起；使用者開始打字時隱藏建議（參考 assistant-ui）。


# Body B — Message-area layout in AI chat panels & compact widgets

Research date: 2026-09-19. Context: redesign of quidproquo floating "Ask AI" widget (RAG over own posts, shows tool activity).

Read levels: ✅ full read (source code / full doc page) · 📸 live observed · 🟡 snippet / third-party teardown / search result · [推論] my inference.
Raw captures: `scratchpad/r/` (aie_src_*.tsx, aui_thread.tsx, ck_*.tsx, alg_*.tsx, *.txt).

Coverage honesty: the component libraries (AI Elements, assistant-ui, CopilotKit) and Algolia DocSearch have **source-level** evidence. kapa / Inkeep / Mintlify / Vercel have **first-party docs**. ChatGPT / Perplexity / Gemini / Claude / Fin are **snippet or third-party teardown only** (no logged-in live observation). Stripe docs Ask AI: **no first-party evidence found** (only Stripe *Dashboard* assistant doc surfaced) — treat as unverified. Live observation of the Mintlify assistant was **blocked by an hCaptcha** after submitting a question (📸 only the composer bar was seen).

---

## Q1. User vs AI message styling

| Product | Evidence | Level |
|---|---|---|
| Vercel AI Elements `Message` | `Message` = `group flex w-full max-w-[95%] flex-col gap-2`; user adds `ml-auto justify-end`. `MessageContent`: user → `rounded-lg bg-secondary px-4 py-3`; assistant → plain `text-foreground` (no bubble). Docs: "Minimalist flat design with user messages in secondary background and assistant messages full-width". No avatar in current `message.tsx` (grep for `Avatar` = 0 hits). `ConversationContent` = `flex flex-col gap-8 p-4` (32px between messages). https://github.com/vercel/ai-elements/blob/main/packages/elements/src/message.tsx , https://ai-sdk.dev/elements/components/message | ✅ |
| assistant-ui Thread | User message: grid `grid-cols-[minmax(72px,1fr)_auto]` → right-aligned bubble `bg-muted rounded-(--composer-radius) px-4 py-2`; user action bar sits to the bubble's left. Assistant: unbubbled. Thread column `--thread-max-width: 44rem`. https://github.com/assistant-ui/assistant-ui/blob/main/packages/ui/src/components/react/assistant-ui/elements/thread.aui.tsx | ✅ |
| CopilotKit v2 | User bubble `bg-muted max-w-[80%] rounded-[18px] px-4 py-1.5` (py-3 when multiline), right-aligned (`justify-end`). Assistant = `prose max-w-full`, no bubble. https://github.com/CopilotKit/CopilotKit/blob/main/packages/react-core/src/v2/components/chat/CopilotChatUserMessage.tsx | ✅ |
| Inkeep | Avatars are opt-in config: `aiAssistantAvatar` (40×40 recommended, light/dark), `userAvatar`. https://docs.inkeep.com/ui-components/common-settings/ai-chat | ✅ |
| kapa.ai widget | Stylable components named "Conversation Item Question — the user's question bubble" and "Conversation Item Answer — the AI's answer bubble". https://docs.kapa.ai/integrations/website-widget/configuration/component-styles | ✅ (docs; visual not observed) |
| Perplexity | Treats "each query as a small report, not a chat bubble" (Answer/Links/Images tabs over the answer). https://aiuxplayground.com/teardowns/perplexity/output | 🟡 third-party teardown |

**Pattern:** The dominant 2025–26 pattern is **user = right-aligned muted bubble (≈80% max), assistant = unbubbled full-width prose**, no avatars in compact panels (avatars are optional config only in support-style widgets like Inkeep). Vertical rhythm between turns is large (AI Elements gap-8 = 32px). [推論] For a ~380–420px floating panel, drop avatars and give the AI full width; the user bubble cap 80–85% keeps short questions visually distinct.

---

## Q2. Citations / sources for RAG answers

| Product | Evidence | Level |
|---|---|---|
| AI Elements `Sources` | Collapsible trigger text **"Used {count} sources"** + chevron; closed by default (Radix Collapsible, no defaultOpen). In the docs example it's rendered **above** the assistant message. Each source = BookIcon + title link. https://github.com/vercel/ai-elements/blob/main/packages/elements/src/sources.tsx | ✅ |
| AI Elements `InlineCitation` | Inline **Badge pill showing first source hostname + "+N"**, HoverCard (openDelay 0, `w-80`) with carousel to page through multiple sources. https://github.com/vercel/ai-elements/blob/main/packages/elements/src/inline-citation.tsx | ✅ |
| Algolia DocSearch Ask AI (sidepanel) | Sources live in the **answer footer**: `SourcesPanel` = a "N related sources" button opening a **popover** list (default `open=false`), links extracted from the answer; sits next to `FeedbackActions`. https://github.com/algolia/docsearch/blob/main/packages/docsearch-react/src/components/SourcesPanel.tsx , .../Sidepanel/ConversationScreen.tsx | ✅ |
| kapa.ai | "Answer Sources Button — the 'Sources' button **below an answer** that opens the sources popover"; source link has primary + secondary heading. (component-styles doc above) | ✅ |
| Mintlify assistant | "Cites sources and provides navigable links to take users directly to referenced pages." https://www.mintlify.com/docs/guides/assistant | ✅ (layout not observed) |
| ChatGPT (search) | Inline **publisher chips** (favicon + name, "+1" for multi-source) on the claim; hover/click popover with headline+snippet and 2/2 pager; a **Sources row** at the end opens a full sidebar list. https://aiuxplayground.com/teardowns/chatgpt/citations | 🟡 third-party teardown |
| Perplexity | Numbered inline markers [1]; "Sources" row with favicons + count ("10 sources") next to share/copy/rewrite; tabs Answer/Links/Images at top. https://aiuxplayground.com/teardowns/perplexity/output , https://searchscore.io/guides/how-perplexity-cites-sources | 🟡 |
| Claude.ai | Inline source citations on factual claims when web search used. https://aeoupdates.com/articles/anthropic-claude-inline-citations-brand-visibility | 🟡 (no first-party UI doc read) |
| Gemini | "Double-check response" cross-references Google Search and highlights. https://book.st-hakky.com/data-science/gemini-pro-double-check-feature | 🟡 |

**Pattern:** Two layers. (a) **Collapsed source summary** ("Used N sources" / "N related sources") — docs widgets (Algolia, kapa) put it **in the answer footer as a popover**, AI Elements' example puts it **above**; all are closed by default. (b) Optional **inline chip/marker** with hover card (ChatGPT, Perplexity, AI Elements InlineCitation); chip shows hostname/title + "+N" rather than stacking. [推論] For a single-site blog every source is the same domain, so hostname chips are useless → use **post title** in the chip/list; a footer "N 篇文章" disclosure is the lowest-cost fit for a 400px panel.

---

## Q3. Tool / reasoning activity display

| Product | Evidence | Level |
|---|---|---|
| AI Elements `Reasoning` | Collapsible; **auto-opens while streaming, auto-closes 1000 ms after finish** (`AUTO_CLOSE_DELAY = 1000`). Label: shimmer "Thinking..." → "Thought for N seconds". `mb-4`, sits above text. https://github.com/vercel/ai-elements/blob/main/packages/elements/src/reasoning.tsx | ✅ |
| AI Elements `Tool` | Bordered collapsible card: wrench icon + tool name + status badge (Pending / Running (pulsing clock) / Completed (green check) / Error (red X) / Awaiting Approval); expands to Parameters + Result/Error. https://github.com/vercel/ai-elements/blob/main/packages/elements/src/tool.tsx | ✅ |
| AI Elements `ChainOfThought` | Collapsible step list, step status complete/active/pending, search-result badges. https://ai-sdk.dev/elements/components/chain-of-thought | ✅ |
| assistant-ui `ToolGroup` | "collapses a run of consecutive tool calls behind a **single row**: a count, a status icon while any are still running, and a chevron that expands into every call underneath." Also `ReasoningGroup`. https://www.assistant-ui.com/docs/ui/tool-group | ✅ |
| Algolia Ask AI | Inline, in part order, before the text: streaming reasoning → shimmer "Reasoning..."; tool → "Searching..." then **"Searched for q1, q2 and q3"** (aggregated one-liner, `AggregatedSearchBlock`); pre-first-token → "Thinking..." + 2 shimmer skeleton lines. https://github.com/algolia/docsearch/blob/main/packages/docsearch-react/src/Sidepanel/ConversationScreen.tsx | ✅ |
| Perplexity | Expandable **"Completed N steps"** (e.g., Searching the web…) **collapsed by default** above the answer. (teardown above) | 🟡 |
| Claude in Chrome | Side panel next to the page; acts (read/click/type); default "Automatically approve" mode pauses to ask for approval. https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome | ✅ (no per-step UI detail) |

**Pattern:** Activity is rendered **inline, above the answer text, in stream order**, as a **one-line summary that is expanded (or shimmering) while running and collapses when done** ("Searched for …", "Completed N steps", "Used N tools"). Detail (queries, args, results) is one click deep. Status icons: pulse/spinner → check → red X. [推論] Matches the repo's recent "一行摘要＋兩層展開" direction; AI Elements' auto-close-after-1s is a good concrete default.

---

## Q4. Per-message actions

| Product | Evidence | Level |
|---|---|---|
| assistant-ui | Assistant ActionBar = Copy (→check on copy), 👍/👎 (only if feedback capability), Refresh, "More" (Export Markdown). `hideWhenRunning` + `autohide="not-last"` (last message always visible, others hidden until hover [推論 on exact semantics of not-last]). User ActionBar (Edit) also `not-last`. Footer row under assistant message. (thread.aui.tsx) | ✅ source / 🟡 semantics |
| CopilotKit v2 | Assistant toolbar: copy, 👍, 👎, read-aloud, regenerate (each only if handler supplied); **visible on all assistant messages**, hidden only on the latest one while running and when message has only tool calls. User toolbar `invisible group-hover:visible` (hover-only). (CopilotChatAssistantMessage.tsx L216-224; UserMessage L276) | ✅ |
| AI Elements | `MessageActions` (Retry/Like/Dislike/Copy/Share with tooltips). Docs example renders Regenerate + Copy **only on the last assistant message** (`isLastMessage`). | ✅ |
| Algolia Ask AI | Footer: Sources popover + FeedbackActions (copy, 👍/👎). `showActions` = not stopped AND (not last exchange OR status==='ready') → **hidden while streaming**. 👎 opens a note panel with reason chips (Incorrect / Not what I asked / Slow or buggy / Style or tone / Safety or legal / Other) + textarea; after submit → "thanks" state. | ✅ |
| kapa.ai | Below answer: feedback 👍/👎, copy, Sources, optional CTA button, "Create ticket" handoff button (triggers: always / conversation-length / uncertainty / downvote). Plus satisfaction & exit surveys (on by default). https://docs.kapa.ai/integrations/website-widget/configuration/behavior | ✅ |
| Inkeep | Thread-level toolbar: Share Chat, Copy Chat, Get Help (support channels). https://docs.inkeep.com/ui-components/common-settings/ai-chat | ✅ |
| Vercel docs AI Chat | "Copy chat as Markdown", load page as context. https://vercel.com/changelog/ai-chat-now-available-on-vercel-docs | ✅ |
| Perplexity | Share / copy / rewrite beside Sources row. (teardown) | 🟡 |

**Pattern:** Standard set = **Copy + 👍/👎 (+ Regenerate)**, placed in a **small footer row under the assistant message**, **hidden while that message streams**, then either always visible (CopilotKit, Algolia, kapa) or visible on last / hover on older (assistant-ui, AI Elements example). Docs widgets add a **thread-level** Copy-chat/Share and a human-handoff CTA; negative feedback often opens a reason picker. [推論] For a blog: Copy + 👍/👎 on every finished answer, Regenerate only on the last; skip Share.

---

## Q5. Streaming behaviour

| Product | Evidence | Level |
|---|---|---|
| AI Elements `Conversation` | Built on `use-stick-to-bottom` (`initial="smooth" resize="smooth" role="log"`); `ConversationScrollButton` = round outline ArrowDown icon button, `absolute bottom-4` centered, **rendered only when `!isAtBottom`**. Empty state: icon + "Start a conversation". https://github.com/vercel/ai-elements/blob/main/packages/elements/src/conversation.tsx | ✅ |
| assistant-ui | `ThreadPrimitive.ScrollToBottom`; auto-scroll part of Thread; while running, an **"●" pulse indicator** part (`aria-label="Assistant is working"`); composer send ↔ cancel swap (`isRunning`). Welcome suggestions only for empty thread with empty composer; **`ThreadFollowupSuggestions`** after answers. | ✅ |
| AI Elements `Suggestion` | Horizontal row of clickable suggestion pills. https://ai-sdk.dev/elements/components/suggestion | ✅ |
| Algolia Ask AI | Pre-token: "Thinking..." shimmer + skeleton lines (`role="status"`); "You stopped this response" note after Stop; **"Suggested prompts" only on the last exchange** (from agent parts). Disclaimer: "Answers are generated with AI which can make mistakes. Verify responses." | ✅ |
| CopilotKit | Suggestion pills/view components exist (CopilotChatSuggestionPill/View). | ✅ (file names only) |
| Perplexity | Contextual follow-up chips below answer; teardown advises capping visible chips (~3). | 🟡 |
| Mintlify | Floating bottom composer "Ask a question..." with ⌘I hint, stop button during generation, panel has Maximize / Clear chat history / Close. 📸 https://www.mintlify.com/docs/guides/assistant (answer body not seen: hCaptcha) | 📸 partial |

**Pattern:** Stick-to-bottom auto-scroll that **releases when the user scrolls up**, plus a **floating centered ↓ button shown only when not at bottom**. Before first token: shimmer "Thinking…" (sometimes skeleton lines), not a three-dot bubble. Stop button replaces Send while running; stopped answers get an explicit "you stopped this" note. Follow-up suggestion chips appear **only under the last completed answer**, 2–3 max.

---

## Q6. Error / rate-limit / no-answer states

| Product | Evidence | Level |
|---|---|---|
| assistant-ui | `MessagePrimitive.Error` inside the assistant message: bordered destructive box `border-destructive bg-destructive/10 rounded-md p-3 text-sm`, message `line-clamp-2`. Also a documented "Stopped run" and "Regenerate" pattern. | ✅ |
| AI Elements `Tool` | Tool-level error: red XCircle badge "Error"; expanded section titled "Error" instead of "Result". | ✅ |
| Algolia Ask AI | Stream error → inline `role="alert"` block with AlertIcon, title **"Chat error"** + error message (non-blocking errors only; blocking errors go to prompt). **Thread-depth limit**: "This conversation is now closed to keep responses accurate." + **"Start a new conversation"** button. | ✅ |
| Mintlify | No-answer: "If it cannot find relevant information after searching, it responds that it doesn't have enough information to answer." | ✅ |
| kapa.ai | `data-uncertain-answer-callout`: Markdown appended to the answer when uncertainty is detected; handoff button can trigger on `uncertainty` or `downvote`. | ✅ |
| Intercom Fin | Clarifies questions; "detects when to escalate to humans". https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained | ✅ (no UI detail) |

**Pattern:** Errors are rendered **in the thread at the position of the failed answer** (not toast), as a compact tinted alert with a short title + 1–2 lines + a recovery action (retry / start new conversation). Hard limits (thread depth, quota) close the thread with a clear CTA. **No-answer is a content state, not an error**: the model says it lacks info, optionally with an appended "uncertain" callout and a next step (handoff / search / related links). [推論] For a blog: no-answer → "站內沒有相關文章" + link to search page; rate-limit → inline alert with reset time, disable composer.

---

## Cross-cutting summary (for the widget redesign)

1. User right bubble (muted, ≤80–85%), AI unbubbled full width, no avatars, ~24–32px between turns.
2. Activity: inline one-liner above answer ("搜尋了 X、讀了 N 篇"), expanded/shimmer while running, auto-collapse ~1s after done, one click to detail.
3. Sources: collapsed "N 篇文章" disclosure (footer popover or list) + optional inline title chips with hover card; closed by default.
4. Actions footer: Copy + 👍/👎 always after completion, Regenerate on last only; hidden during streaming; 👎 → reason chips.
5. Stick-to-bottom + ↓ button only when scrolled up; shimmer "Thinking…" before first token; Stop replaces Send; 2–3 follow-up chips under the last answer only.
6. Inline alert for errors with retry; no-answer as a normal answer with next step.


# Body C — Composer / input area in AI chat panels & compact widgets

Research date: 2026-09-19. Scope: bottom input area of AI chat panels, for redesigning quidproquo's floating "Ask AI" widget (text-only Q&A over blog posts).

Read-level legend: ✅ full read (source/doc read) · 📸 live observed (Playwright, headless Chromium 1280×720-ish, 2026-09-19) · 🟡 search snippet only · [推論] my inference · [未驗證] from memory, not verified this session.

Raw captures: `scratchpad/src/*.tsx` (component source), `scratchpad/pages/*.txt` (docs text), `scratchpad/shots/*.png` (screenshots).

---

## 1. Component libraries (read from source — the most reliable evidence)

### assistant-ui `ComposerPrimitive.Input` ✅
Source: https://github.com/assistant-ui/assistant-ui/blob/main/packages/react/src/primitives/composer/ComposerInput.tsx
- **Auto-grow**: built on `react-textarea-autosize` (`TextareaAutosize`); row limits are passed through as `minRows`/`maxRows` props (the primitive sets no default max itself).
- **Submit modes**: `submitMode: "enter" | "ctrlEnter" | "none"` (default `"enter"`, where Enter sends and Shift+Enter adds a newline). The older `submitOnEnter` prop is still supported.
- **Mobile**: `unstable_insertNewlineOnTouchEnter`. On touch-primary devices (`(pointer: coarse) and (not (any-pointer: fine))`), Enter inserts a newline and the send button is how you submit. This is a useful pattern for mobile.
- **IME**: `handleKeyPress` returns early on `e.nativeEvent.isComposing`. It also tracks `compositionRef` through `onCompositionStart`/`onCompositionEnd`. In `onChange` it recovers a stuck `compositionRef` when the browser never fires `compositionend`, and it keeps the controlled value in sync mid-IME so React does not reset the textarea to a stale value. The Escape handler also ignores keys pressed during composition.
- **While streaming**: Enter is blocked while `thread.isRunning`, unless queueing is supported. Cmd/Ctrl+Shift+Enter sends a "steer" message when a queue exists. When `cancelOnEscape` is set, Esc cancels the run.
- **Focus**: `autoFocus` is off by default. `unstable_focusOnScrollToBottom` and `unstable_focusOnThreadSwitched` both default to true.
- The Send and Cancel buttons are separate primitives (`ComposerPrimitive.Send` / `.Cancel`). The UI decides which one to show based on `thread.isRunning` [推論 from primitive split; thread.tsx not fetched — GitHub path 404 / rate limit].

### Vercel AI Elements `PromptInput` ✅
Source: https://github.com/vercel/ai-elements/blob/main/packages/elements/src/prompt-input.tsx (doc: https://ai-sdk.dev/elements/components/prompt-input)
- **Anatomy** (exports): `PromptInput` > `PromptInputHeader` (attachments/context chips) · `PromptInputBody` > `PromptInputTextarea` · `PromptInputFooter` > `PromptInputTools` (left side: `PromptInputActionMenu`, `ActionAddAttachments`, `ActionAddScreenshot`, `PromptInputSelect` for model, `PromptInputButton`) + `PromptInputSubmit` (right). Tools sit at the bottom left and submit sits at the bottom right.
- **Textarea**: `field-sizing-content max-h-48 min-h-16` (CSS-native auto-grow up to 12rem, about 8 lines). Default placeholder is **"What would you like to know?"**, and `name="message"`.
- **Enter**: Enter submits. Shift+Enter is the newline. **IME**: it keeps local `isComposing` state (set by `onCompositionStart`/`End`) *and* checks `e.nativeEvent.isComposing`, then returns without submitting. Before submitting on Enter it checks whether the submit button is disabled. Backspace in an empty textarea removes the last attachment.
- **Submit button state machine** (`status` prop from AI SDK `useChat`): idle → `CornerDownLeftIcon` (↵); `submitted` → spinner; `streaming` → `SquareIcon` (■ stop); `error` → `XIcon`. It uses `aria-label={isGenerating ? "Stop" : "Submit"}`, and `type="button"` when generating with `onStop`, so the click calls `onStop` instead of submitting.

### CopilotKit ✅
v2 source: https://github.com/CopilotKit/CopilotKit/blob/main/packages/react-core/src/v2/components/chat/CopilotChatInput.tsx · v1: `packages/react-ui/src/components/chat/Input.tsx` · labels: `packages/angular/src/lib/chat-config.ts`
- **IME (most defensive of the three)**: `if (e.nativeEvent.isComposing || e.keyCode === 229) return;`. The keyCode 229 check covers Safari, which fires the committing Enter keydown after `compositionend` with `isComposing=false`. It also keeps an `isComposingRef` that the auto-resize logic uses to skip recomputing during composition.
- **Auto-grow**: v2 computes `maxHeight = lineHeight * 5 + padding`, so the cap is **5 rows**, starting at `rows={1}`. v1 uses `maxRows={MAX_NEWLINES}` with `MAX_NEWLINES = 6`. The container has `rounded-[28px]` and switches between `data-layout="compact"` (single-line pill) and `"expanded"` as text grows.
- **Font size**: the textarea is **`text-[16px]`**, which avoids iOS zoom on focus.
- **Enter while streaming**: with text in the composer, Enter **always sends**. With an empty composer while a run is in progress, Enter calls `onStop()`. The button behaves differently: during a run it renders as a Stop (square) icon, and a click stops the run regardless of text. It is `disabled: isProcessing ? !canStop : !canSend`.
- Slash-command menu (`/`, max 5 visible, arrows/Enter/Esc). A tools/“+” menu is on the left, and transcribe (voice) mode is available.
- **Placeholder** default "Type a message..." (v2 labels). **Disclaimer** default: **"AI can make mistakes. Please verify important information."**, rendered centered as `text-xs text-muted-foreground` **below the input**. It is shown by default only when the input is absolutely positioned (`showDisclaimer ?? positioning === "absolute"`).

---

## 2. Docs-site / support widgets

| Product | Container & open | Input | Placeholder | Send / Stop | Disclaimer / branding placement | Context / attachments / modes | Evidence |
|---|---|---|---|---|---|---|---|
| **Mintlify assistant** | Right **side panel** (maximize/close in header). Header button + a bottom-center pill "Ask a question... ⌘I". **⌘I** opens it; ⌘K is search | `<textarea rows=2>`, **14px**, no maxlength, fixed field-sizing | "Ask a question..." | Round ↑ button at the bottom right, **disabled when empty** ("Send message") | "Responses are generated using AI and may contain mistakes." sits at the **top** of the panel (small, grey, centered), not under the input | 📎 "Add attachment" at the bottom left inside the input. "Suggestions" list above the input. Doc says it "builds context from the page a user is viewing" (implicit, no chip) | 📸 https://www.mintlify.com/docs/ai/assistant ; ✅ same page text |
| **kapa.ai widget** | Right **side panel/modal** ("Ask kapa.ai"). Header "Ask AI ⌘K" button + a floating launcher at the bottom right. Cmd+K is **opt-in** (`data-modal-open-on-command-k`, default false) | `<textarea rows=2>`, **14px**, no maxlength | "Ask me a question about kapa.ai..." (default template "Ask me a question about [project name]...", `data-ask-ai-input-placeholder`) | ↑ button at the bottom right, disabled while empty | **Under the input**: "Powered by kapa.ai" (left) + "Protected by hCaptcha" (right). Welcome/disclaimer box at the top of the conversation. Configurable `data-chat-disclaimer` (Markdown), `data-modal-footer-text`, `data-privacy-links-links` | "+" at the bottom left. **Mode toggle "⚡ Fast"** at the bottom right next to send. 3 example-question pills above the input | 📸 https://docs.kapa.ai/ ; ✅ https://docs.kapa.ai/integrations/website-widget/configuration/behavior ; ✅ …/component-styles |
| **Vercel docs Ask AI** | Right **side panel**, opened from the header "Ask AI" button. Tip in the empty state: "**You can open and close chat with ⌘ I**" | `<textarea rows=2>`, **14px** | "Ask a question..." | "Submit" button, **disabled when empty** | None seen in the empty state. Header actions: Copy chat as markdown / Share / Clear / Close (disabled until there are messages) | 4 suggested questions. No attachment button | 📸 https://vercel.com/docs |
| **Inkeep** | Modal / sidebar / embedded chat components | configurable | `placeholder` (examples in docs: "Ask me anything about our API...", "How do I get started?") | `toolbarButtonLabels.stop: 'Stop'` (stop is a toolbar action) | `disclaimerSettings {isEnabled, label:'AI Assistant', tooltip:'Responses are AI-generated and may require verification.'}`. It is a **label with a tooltip**, not a line of text | `exampleQuestions`. "Get help" actions at the bottom right. Context comes through `prompts` / user context (not a visible chip) | ✅ https://docs.inkeep.com/cloud/ui-components/common-settings/ai-chat |
| **Algolia DocSearch Ask AI (v4)** | Inside the **⌘K search modal** (switch from search to Ask AI) | — | — | — | — | Index is the context. Token limit is set on the admin side | ✅ https://docsearch.algolia.com/docs/v4/v4/askai (setup-only, no composer UI detail; not live-observed) |
| **Stripe docs** | Not verified. Stripe's public "assistant" doc covers the **Dashboard** assistant, not a docs Ask AI | — | — | — | — | — | 🟡 https://docs.stripe.com/assistant |
| **Intercom Fin (Messenger)** | Messenger launcher at the bottom right | "**Expanded Composer on Web**: a larger message field … supports file attachments" | — | — | — | Attachments | 🟡 https://intercom.com/changes/en/114298-fin-ui-messenger-experience-updates (short changelog, ✅ read but thin) |

## 3. Consumer chat apps

| Product | Relevant facts | Evidence |
|---|---|---|
| **ChatGPT** | Disclaimer "ChatGPT can make mistakes. Check important info." appears in small type under the composer. Enter sends, Shift+Enter adds a newline. Placeholder "Ask anything" [未驗證] | 🟡 https://decidi.ai/check-important-info (compiles the disclaimer strings); 🟡 deckoholic.ai tutorial (Shift+Enter) |
| **Claude.ai** | Footer disclaimer "Claude can make mistakes. Please double-check responses." sits below the input | 🟡 decidi.ai; 🟡 devme.me (describes a screenshot with that footer text) |
| **Gemini (web)** | "Gemini can make mistakes, so double-check it" | 🟡 decidi.ai |
| **Gemini in Chrome (side panel)** | The **current tab is shared by default** as context, and you can turn that off in settings. A **"Show shared tabs" control above the text box** lets you remove a tab. Type `@` in the text box to add an open tab (up to 10). **"Update tabs"** is in the text box. `/` opens a Skills menu. The shared tab gets a glowing underline. Pop-out/dock toggle. Shortcut: Alt+G (Win) / Ctrl+G (Mac) | ✅ https://support.google.com/gemini/answer/16283624 ; 🟡 https://support.google.com/chrome/answer/16988996 ; 🟡 https://fastshortcuts.com/shortcuts/gemini (shortcut) |
| **Perplexity** | Enter submits, Shift+Enter adds a newline. Cmd/Ctrl+K starts a new search. Focus-mode selector sits in the input bar | 🟡 https://linuru.com/perplexity ; 🟡 https://shortcut-tools.com/en/shortcuts/perplexity (third-party, not first-party) |

## 4. Mobile

- **iOS Safari zooms when you focus an input whose font-size is below 16px.** The common fix is `font-size: 16px` or larger on the input, not `maximum-scale=1`, which hurts accessibility. 🟡 https://stackoverflow.com/a/46254706/172651 ; 🟡 https://guidefari.com/safari-ios-input-zoom ("Avoid text-sm on inputs"). CopilotKit uses exactly `text-[16px]` ✅.
- Note: all three live docs widgets (Mintlify, kapa, Vercel) use **14px** on desktop 📸. Whether they bump it to 16px on mobile breakpoints was **not checked** (desktop viewport only).
- Enter on touch devices: assistant-ui's `unstable_insertNewlineOnTouchEnter` is the only library switch found that makes Enter insert a newline on touch and leaves sending to the button ✅.
- Virtual keyboard / safe area: no first-party source read this session. [推論] Standard approach: `padding-bottom: max(12px, env(safe-area-inset-bottom))` with `viewport-fit=cover`; use `dvh`/`visualViewport` for full-screen sheet height so the composer stays above the keyboard; set `enterkeyhint="send"` (none of the 3 observed widgets set `enterkeyhint` 📸).

## 5. Cross-product patterns (synthesis)

1. **Textarea that grows, capped at about 5–8 rows.** CopilotKit caps at 5 (v1: 6), AI Elements at max-h-48 (about 8 lines), and assistant-ui leaves `maxRows` to the caller. Docs widgets start at `rows=2` (Mintlify, kapa, Vercel 📸); CopilotKit starts at 1 row inside a pill that expands.
2. **Enter sends, Shift+Enter adds a newline** is universal. **IME guard**: `e.nativeEvent.isComposing` everywhere. CopilotKit also checks `keyCode === 229` for Safari, and assistant-ui adds composition refs plus stuck-state recovery. **For zh-TW input, copy CopilotKit's `isComposing || keyCode===229` plus a compositionstart/end ref.**
3. **Send button**: an icon (↑ or ↵) at the bottom right, **disabled when empty**. **During streaming the same slot becomes a ■ Stop** (AI Elements, CopilotKit), with `aria-label` switched to "Stop". AI Elements adds a spinner for `submitted` and ✕ for `error`. Enter with text during streaming either sends/queues (CopilotKit) or is blocked (assistant-ui without a queue). Esc to cancel is optional.
4. **Placeholder** is short and question-framed. "Ask a question..." (Mintlify, Vercel), "Ask me a question about {project}..." (kapa), "What would you like to know?" (AI Elements). Naming the scope ({project}) tells readers what the assistant knows.
5. **Open shortcut**: **⌘I** for the assistant when ⌘K is search (Mintlify, Vercel "open and close chat with ⌘ I"). **⌘K** when the AI lives inside search (kapa opt-in, Algolia). The shortcut is shown as a `<kbd>` hint on the trigger button.
6. **Disclaimer / branding**: either a one-line, small, grey, centered line **under the input** (ChatGPT, Claude, CopilotKit default, kapa "Powered by" + captcha) or a line at the **top of the empty conversation** (Mintlify, kapa welcome box). Inkeep uses a compact "AI Assistant" label with a tooltip. Common wording: "AI can make mistakes. Please verify important information."
7. **Character limit / counter**: **none of the observed widgets set `maxlength` or show a counter** (Mintlify, kapa, and Vercel all have `maxLength=-1` 📸). Limits are enforced on the server or by tokens (Algolia admin token limit).
8. **Attachments and modes** sit in a **footer row inside the input box**: "+"/📎 at the bottom left, mode/model selector plus send at the bottom right (kapa "⚡ Fast", AI Elements Tools/Select/Submit). For a text-only widget, drop the left slot.
9. **Context chips**: the strongest first-party example is Gemini in Chrome, where the current tab is shared by default and shown as a removable chip or list above the text box, with `@` to add more. Mintlify builds page context silently. AI Elements has a `PromptInputHeader` slot above the textarea for chips. No "selected text → Add to assistant" evidence was collected this session [not researched in depth].
10. **Suggested questions sit directly above the input** in the empty state (Mintlify "Suggestions", kapa 3 pills, Vercel 4 buttons).


# Ask AI 浮動面板：訊息區與輸入區的版面／UX 準則（研究 D）

研究日期：2026-09-19 · 工具：Keenable keyless 搜尋 + `curl` 抓全文 + python 摘錄（Groundlane MCP 無法使用 → toolDegradation: groundlane→keenable+curl）
閱讀深度標記：✅ 全文讀過（或已讀完相關段落）· 🟡 只看過摘要／片段 · [推論] 我自己的推論，無來源背書
原始擷取檔：`scratchpad/bodyD/*.txt`

---

## 1. 浮動聊天面板尺寸

| 規則 | 來源 |
|---|---|
| **Carbon AI Chat 浮動版預設值**：`--cds-aichat-width: min(380px, var(--cds-aichat-max-width))`；`--cds-aichat-height: calc(100vh - 4rem)`；`--cds-aichat-max-height: 640px`；`--cds-aichat-min-height: max(150px, calc(min(256px, 100vh) - bottom))`；距底 48px、距右 32px；z-index 99999。另有 `cds-aichat-float--mobile` class 負責手機版位置（文件**沒有**寫出斷點數值）。 | ✅ https://github.com/carbon-design-system/carbon-ai-chat/blob/main/packages/ai-chat/docs/Layout.md |
| **Carbon 訊息欄寬 token**：`--cds-aichat-messages-max-width: 672px`（含輸入列）、`--cds-aichat-messages-min-width: 320px`、`--cds-aichat-card-max-width: 424px`、workspace 最小寬 480px。→ 展開／全螢幕時訊息欄不要超過約 672px，其餘空間留白。 | ✅ 同上 |
| **讓使用者能調整大小或放到最大**（NN/g 指引 #8）：多數聊天窗預設很小，問快速問題還行，但遇到內容豐富的回答（地圖、長清單、商品圖）就不夠用。研究中只有 Scoutly 支援調整大小，受試者會把它放大。 | ✅ https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ （2026-04-24） |
| Intercom 使用者抱怨 Messenger 固定尺寸塞長程式碼區塊時「根本讀不了」，要求出放大模式（Intercom 的說明中心文章本來就能開得比較大）。可見固定窄面板＋程式碼是已知的痛點。 | ✅ https://community.intercom.com/topic/show?tid=6777 |
| **Intercom「400px」**：開發者文件只寫了 `alignment`、`horizontal_padding`、`vertical_padding`（範例值 20）、`z_index`，**沒有**寫寬度。「400px」這個數字**尚未查證**，不要當作有出處引用。 | ✅（文件沒寫這個數字）https://developers.intercom.com/installing-intercom/docs/configuration |
| **WCAG 1.4.10 Reflow**：內容在 **320 CSS px** 寬時（等於 1280px 放大到 400%）不能需要雙向捲動；**資料表格、圖表屬於例外**，可以雙向捲動。→ 瀏覽器放大到 400% 時，面板不能再用固定 400px 蓋住畫面。 | ✅ https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| 手機版改全螢幕的斷點：我找到的官方設計系統**都沒有**明確數值（Carbon 只有 `float--mobile` 這個 class）。[推論] 在大約 `max-width: 480–600px` 以下就切成全螢幕 sheet（`100dvh`），因為 380–400px 面板加上左右留白，在 ≤480px 的手機上就放不下。 | [推論] |

**建議做法** [推論，以上述來源為基礎]：預設 `width: min(400px, 100vw - 32px)`、`height: min(640px, 100dvh - 4rem)`；展開模式約 `min(720px, 100vw - 64px)` 寬，訊息欄 `max-width ≈ 672px`；在約 480px 以下或瀏覽器放大到 400% 時切成全螢幕。

## 2. 訊息的字級與間距

| 規則 | 來源 |
|---|---|
| **WCAG 1.4.8（AAA）**：每行不超過 **80 字元（CJK 為 40 字）**；不要左右對齊；行距至少 **1.5 倍**，段距至少是行距的 **1.5 倍**；文字放大到 200% 時不能需要橫向捲動。 | ✅ https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html |
| [推論] 面板寬約 400px、內距約 16px 時，內容寬約 340–360px；16px 中文約每行 21–22 字，遠低於 40 字上限，所以窄面板的問題**不是行太長**，而是一則回答會變得非常高。這正是下面 NN/g 談的精簡原則所要處理的。 | [推論] |
| **NN/g「少聊天、多答案」**：「聊天視窗比網頁小得多，一小段文字看起來就像一堵牆。」句子要短、**每段不超過 2–3 句**；答案較長時用清單、粗體、標題和留白。先給答案，細節放到後續問題裡（「truncated pyramid」原則）。不要客套、不要「好問題！」這類恭維。 | ✅ https://www.nngroup.com/articles/less-chat-more-answer/ （2026-04-17） |
| **NN/g 漸進揭露**（指引 #6）：額外細節**在原地展開／收合**，不要另外產生一則新訊息把前文往上推。 | ✅ https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ |
| **程式碼區塊與表格要能橫向捲動**：WCAG 1.4.10 允許資料表格雙向捲動（例外）；但可捲動區域**必須能用鍵盤操作**（axe `scrollable-region-focusable`，WCAG 2.1.1 A，影響程度 Serious）→ 捲動容器要加 `tabindex="0"`，並附上標籤。 | ✅ reflow 同上；✅ https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable |
| **輸入框字級 ≥16px**：iOS Safari 在 input 字級小於 16px 時，focus 會自動放大畫面。 | 🟡 https://guidefari.com/safari-ios-input-zoom 、🟡 https://stackoverflow.com/a/46254706 （社群來源，非 Apple 官方文件） |
| 內文字級 14 vs 16px：官方設計系統**沒有**針對聊天內文給明確數值。[推論] 內文用 15–16px；14px 只給中繼資料或引用標籤用。Carbon AI label 的 inline 尺寸是配合 12/14/16px 字級（sm/md/lg），可見 14–16px 是他們預期的內文範圍。 | [推論]；AI label 尺寸 ✅ https://carbondesignsystem.com/components/ai-label/usage/ |
| **不要只靠位置或顏色區分發話者**：每則訊息用 `<article>`，加上 sr-only 標題（例如「AI 回答」）。GOV.UK 的 App 版拿掉頭像，改用顏色與對比區分發話者以節省空間。 | ✅ https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui ；✅ https://insidegovuk.blog.gov.uk/2026/08/19/designing-gov-uk-chat-for-the-gov-uk-app |

## 3. 串流時的 UX

| 規則 | 來源 |
|---|---|
| **NN/g 指引 #7「不要自動捲到回答末尾」**：串流時自動捲動，會讓已經開始閱讀的使用者找不到讀到哪（MISSI、Turo 都有這問題；有受試者直接說「等它跑完再說」）。「**回答比視窗還長時，讓捲動位置停在新訊息的開頭**，不要跳到底部。」 | ✅ https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ |
| NN/g：串流長回答會「加重資訊過載感」（受試者說：「資訊一直湧進來，讓我覺得被淹沒」）。 | ✅ https://www.nngroup.com/articles/less-chat-more-answer/ |
| **跟隨底部（pinned）狀態機**：只有在使用者已經貼著底部、且有新內容時才自動捲動；判斷貼底用門檻值（例如距底 ≤32px），不要用 `===` 比對；使用者往上捲就停止跟隨；離開底部時顯示「捲到最新」按鈕，點了才重新跟隨。 | ✅（第三方技術文章，非設計系統）https://codeables.dev/article/how-do-i-handle-auto-scroll-in-a-streaming-chat-when-the-user-scrolls |
| 整合 NN/g 與 pinned 規則 [推論]：送出後把**使用者的問題（或回答開頭）捲到可視區頂端**，接著停止跟隨；答案往下長，不拖動畫面；再顯示「↓ 最新」按鈕。這和 ChatGPT／Claude 目前的做法一致（我沒有另外查證）。 | [推論] |
| **CSS 捲動錨定**：`overflow-anchor` 在 2026-09 已達 Baseline（新近可用），瀏覽器會自動調整捲動位置以減少內容位移。→ 串流時要避免上方內容撐高導致位移；需要時在 sentinel 元素上管理 `overflow-anchor`。 | ✅ https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor |
| **減少動態效果**：`prefers-reduced-motion: reduce` 代表使用者想移除、減少或替換非必要動畫（前庭障礙）。MUI X Chat 在 reduced-motion 下會自動暫停骨架屏的 shimmer；[推論] 此時平滑捲動也改成 `behavior: 'auto'`，打字機游標、淡入效果都關掉。 | ✅ https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion ；✅ https://mui.com/x/react-chat/accessibility |
| GOV.UK：刻意設計訊息怎麼出現、送出按鈕怎麼切換狀態，以及用清楚的載入狀態表示「正在產生回答」。 | ✅ GOV.UK 2026-08-19（同上） |

## 4. 聊天紀錄的無障礙

| 規則 | 來源 |
|---|---|
| `role="log"` = 「新資訊依有意義的順序加入、舊資訊可能消失」的 live region，例子就是聊天紀錄。隱含 `aria-live="polite"`、`aria-atomic="false"`；**必須有無障礙名稱**（`aria-label`／`aria-labelledby`）。 | ✅ https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role |
| **串流中的回答本文不要自動朗讀**。另外用一個 sr-only 的 `role="status" aria-live="polite" aria-atomic="true"`，只念簡短狀態：「正在產生回答」→「回答完成」（加上取消、失敗）。ChatGPT 就是這樣做；Claude 用 `role="feed"` + `role="article"` + `aria-posinset/setsize`；OpenClaw 因為 NVDA+Firefox 會逐 token 朗讀，改成 `role="log" aria-live="off"` 加獨立的 status。各函式庫做法不一，開始／完成的通知都要自己補。 | ✅ https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui （2026-08-11，在 VoiceOver + Chrome 驗證） |
| **MUI X Chat 的實作**：捲動容器是 `role="log" aria-live="polite"`；串流中的訊息加 `aria-busy="true"`；隱藏的 `role="status"` 只念「Assistant is responding」／「Response complete」**各一次、從不逐 token 朗讀**；每則訊息是 `role="article"`，標記為「Message from {author}」；對話串是有標籤的 `role="region"`，輸入區是有標籤的 form。 | ✅ https://mui.com/x/react-chat/accessibility |
| **送出後焦點留在輸入框**：產生回答開始或結束時都不要搶焦點；「停止」按鈕是一般的 `<button>`；按下停止後按鈕消失，焦點回到輸入框。status role 的規範也要求不因狀態改變而移動焦點。 | ✅ azukiazusa（同上）；✅ https://accessibility.build/guides/accessible-ai-chat （WCAG 2.4.3、4.1.3 對照表） |
| **訊息間的鍵盤操作**（MUI）：整個訊息清單只算一個 Tab 停駐點（roving tabindex）；↑/↓ 在訊息間移動，Home/End 跳到第一則／最新一則；PgUp/PgDn 保留原生捲動；Enter 進入訊息內的連結或按鈕（引用、複製），Esc 返回；訊息內的操作按鈕在 hover 或進入前是 `visibility:hidden`。→ 讓一則回答裡的 10 個引用連結不會塞滿 Tab 順序。 | ✅ https://mui.com/x/react-chat/accessibility |
| hover 才出現的單則訊息工具列，必須也能用鍵盤操作、可關閉（WCAG 1.4.13）；停止、重新產生、複製、捲動對話紀錄都要能只用鍵盤完成（2.1.1）；泡泡、placeholder、停用狀態的送出按鈕對比要 ≥4.5:1。 | ✅ https://accessibility.build/guides/accessible-ai-chat |
| GOV.UK：確保使用者放大手機字級時輸入框仍然好用；讓 VoiceOver／TalkBack 念出字數上限。 | ✅ GOV.UK 2026-08-19 |
| **Fluent / Microsoft agents**：用中性、偏技術的措辭，避免「理解」、「思考」、「感覺」，改用「處理」、「分析」；一開始就說明輸出可能有差異、需要檢查。**沒有找到** Fluent 2 專門寫 Copilot 聊天版面的頁面。 | ✅（相關段落）https://learn.microsoft.com/en-us/agents/design-guidelines/human-centered-design |
| **IBM Carbon 聊天模式詳細指引**只給 IBM 員工看（Carbon for AI 頁面寫「For IBMers only: Design for AI: Chat pattern」）；公開的是元件庫文件。 | ✅ https://carbondesignsystem.com/guidelines/carbon-for-ai/ |

## 5. 對話中的 AI 信任設計

| 規則 | 來源 |
|---|---|
| **引用（NN/g Explainable AI）**：使用者**很少點引用連結**，但光是看到有引用，信任就會上升（過度信任）。設計上要做到：引用與內文**樣式分開**；**放在它所支撐的那句話旁邊**；盡量**連到來源裡的相關段落**；**標籤要有意義**（寫文章標題，不要只寫「Source」）；在介面上提醒使用者去核對。範例：Copilot 的引用 chip + hover 預覽 +「查看全部」；Perplexity 的行內引用標籤。 | ✅ https://www.nngroup.com/articles/explainable-ai/ （2025-12-12） |
| **免責聲明**（NN/g）：用白話、搭配一個動作（例如「請再次確認」），**放在輸入框附近**，不要塞在頁尾或說明圖示後面；在初次使用引導中就說清楚。不要用擬人化的說法（例如「我想了一下」），改成「本回答依據以下來源：[連結]」。不要把逐步推理包裝成可靠的解釋。 | ✅ 同上 |
| **說不到就直說**（NN/g）：無法回答時直接講，不要用一堆建議填補；可以做到的替代方案要放在**第一句**（Redfin 把替代方案放在第二段，使用者沒讀到）。答案要具體，不要叫使用者「去看其他頁面」。問題有歧義時，偶爾問一句釐清問題。 | ✅ https://www.nngroup.com/articles/less-chat-more-answer/ |
| **GOV.UK Chat**：提醒使用者 AI 會出錯，**每個回答都附上來源指引的連結**，讓使用者方便核對；受試者本來就預期會有準確度警語，也喜歡能回到原始來源確認的功能。處理答不出的問題：加入**釐清提問**，提高回答率；範圍只限 GOV.UK 內容。 | ✅ https://insidegovuk.blog.gov.uk/2026/08/19/designing-gov-uk-chat-for-the-gov-uk-app ；✅（相關段落）https://insidegovuk.blog.gov.uk/2026/03/16/5-things-we-learned-testing-gov-uk-chat-an-ai-assistant-for-government |
| **NN/g 開場訊息**（指引 #3）：開場就說明聊天機器人能做什麼、範圍在哪；不要只說「什麼都可以問我」；建議問題依使用者所在頁面調整（Rufus 的範例）；建議問題做成按鈕，不要做成純文字（#4）。 | ✅ https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ |
| **Microsoft HAX 18 條準則**中和這裡相關的：G1 說明系統能做什麼、G2 說明做得多好、G10 不確定時縮小服務範圍、G11 說明系統為什麼這樣做、G15 鼓勵細部回饋。 | ✅（準則清單）https://www.microsoft.com/en-us/haxtoolkit/library/ |
| **Google PAIR**：幫使用者**校準**信任，而不是追求最大信任；「資料來源一定要是解釋的一部分」；風險高時要說明「為什麼」，不能只給「是什麼」；把錯誤狀態當成說明 AI 需要什麼輸入、如何運作的機會。 | ✅（相關段落）https://pair.withgoogle.com/chapter/explainability-trust ；🟡 https://pair.withgoogle.com/chapter/errors-failing |
| **Carbon AI label**：用來標示 AI 產生的內容，同時是開啟「可解釋性 popover」的入口；**不要拿來裝飾、不要當「重新產生」按鈕**；在容器中放右上角，不要貼齊邊緣；inline 尺寸 sm 16px / md 18px / lg 22px，分別對應 12/14/16px 字級。Carbon for AI 要求在各層級標示 AI 的存在，解釋只在需要或使用者要求時才顯示。 | ✅ https://carbondesignsystem.com/components/ai-label/usage/ ；✅ https://carbondesignsystem.com/guidelines/carbon-for-ai/ |
| **回饋（讚／倒讚）**：Carbon AI Chat 在**每個回應項目**上提供讚／倒讚（`message_item_options.feedback: { is_on, id }`），另有可自訂的 footer slot（例如複製）。Carbon v10 聊天機器人模式：「在適當時機給使用者回饋的機會」；並確認使用者知道自己在跟機器人說話。 | ✅ https://github.com/carbon-design-system/carbon-ai-chat/blob/main/packages/ai-chat/docs/MessageFormat.md ；✅ https://v10.carbondesignsystem.com/community/patterns/chatbot/usage |

---

## 可直接套用到 quidproquo Ask AI 的規則（整合）

1. 尺寸：預設約 380–400 × min(640, 100dvh−4rem)；可展開，訊息欄上限 ≈672px；手機或放大到 400% 時改全螢幕。（Carbon ✅、NN/g ✅、WCAG 1.4.10 ✅；斷點是 [推論]）
2. 送出後把使用者的問題錨定在頂端，**不要**在串流時跟著捲到底；使用者離開底部就顯示「↓ 最新」按鈕；reduced-motion 時關掉平滑捲動和 shimmer。（NN/g ✅、MUI ✅）
3. 容器用 `role="log"` + aria-label；串流中的訊息加 `aria-busy="true"`（或整個紀錄設 `aria-live="off"`）；另用 sr-only 的 `role="status"` 只念「回答中／完成／失敗」；焦點留在輸入框。（MDN ✅、MUI ✅、azukiazusa ✅）
4. 回答內容：段落 2–3 句、答案先講、細節用建議問題或在原地展開；表格和程式碼放在 `tabindex=0`、可橫向捲動的容器裡；輸入框 ≥16px。
5. 信任：行內引用連到文章標題（有錨點就連到錨點）；「部落格裡找不到」要放在第一句；免責聲明放在輸入框附近、搭配一個動作；AI 標記＋每則回答的讚／倒讚；避免擬人化措辭。
