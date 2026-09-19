# Chat header 功能與排版研究（Ask AI 浮動視窗）

- 日期：2026-09-19
- 目標：改 `src/components/Chat/ChatHeader.tsx`
- toolDegradation：Groundlane MCP 未掛載、直連 HTTP 無回應 → Keenable keyless 搜尋 + curl / Playwright 實測 + GitHub 原始碼
- 樣本：通用助理 7、客服 widget 6、文件站 Ask AI + 元件庫 10、設計準則（M3 / Primer / Carbon for AI / NN/g / HAX / PAIR / WAI-ARIA APG / WCAG 2.2）
- 偏誤：偏英語系 SaaS；Comet / Atlas / Dia / Tidio / Freshchat / Cloudflare & Supabase docs 未能實測；M3 規格頁抓不到（64dp 為二手）

## 0. 現況診斷：header 過高的真因
`src/styles/chat.css` 只載 `tailwindcss/theme` + `utilities`，公開頁**沒有 preflight**。
header 內 `<h2>` 吃到 UA 預設 margin（0.83em 上下）、`<p>` 吃到 1em 上下 → 約多出 45px，
和截圖量到的 ~102px（程式預期 ~56px）吻合。[推論，依截圖 2x 量測 + UA 預設值]
修法：h2 / p 加 `m-0`，或在 chat.css 對 `.chat-header :is(h2,p){margin:0}` 做 reset。

## 1. 功能出現頻率（跨四組）
| 功能 | 普遍度 | 位置慣例 | 證據 |
|---|---|---|---|
| 標題 + 品牌 icon（✦ / logo / avatar） | 幾乎全部 | 最左 | A B C |
| 關閉 × | 幾乎全部（例外：Crisp、assistant-ui 由 launcher 關閉） | **最右、永遠最後** | B C D(Carbon) |
| 展開 / 全螢幕 | 常見（側欄類） | 緊貼 × 左側；Intercom 收進 ⋯ | A C |
| 新對話 | 常見 | 單獨 + 按鈕，或 ⋯ 裡；**空對話時隱藏/停用** | A C(DocSearch, Stripe) |
| 歷史對話 | 中 | ⋯ 裡、或標題變 thread 下拉（Stripe、assistant-ui） | A C |
| ⋯ 更多選單 | 常見 | × / 展開左側 | A B C |
| 副標（AI 身分 / 範圍） | 客服類常見（"AI Agent"、"Powered by AI"）；通用助理幾乎沒有 | 標題下一行、單行截斷 | B D(NN/g) |
| 免責聲明 "AI 可能出錯" | 普遍，但**從不在 header 內** | header 正下方灰字，或輸入框下方 | C |
| 狀態（回覆中 / online dot） | 少 | 客服用 online dot；AI 類狀態放訊息區 | B |
| 複製 / 下載 / 分享對話 | 少放 header（Vercel docs 例外） | 多在 ⋯、或每則回答旁、或底部 toolbar | B C |
| 模型切換 | compact 面板不放 header | 輸入框 | A |
| 停止生成 | 不放 header | 輸入框送出鈕變停止 | A C [多數為推論] |

## 2. 排版慣例
- 高度 **44–56px 單列**（assistant-ui 44、CopilotKit / DocSearch 56、Intercom ~54、Mintlify ~50）；1px 下邊框。
- 可見 icon 按鈕 ≤ 3（Carbon for AI / NN/g）；icon 按鈕需 aria-label + tooltip；觸控目標 ≥24px（WCAG 2.2 2.5.8），手機建議 44px。
- 順序：`[icon][標題/副標] ……… [⋯][展開][×]`。
- ⋯ 只放次要與破壞性動作，只有 1–2 項時不值得開 ⋯（NN/g）。
- 標題可動態：首句後換成對話標題（claude.ai、assistant-ui、Stripe）。
- a11y：非 modal 面板用 `role="dialog"` + `aria-labelledby` 指向標題、不加 `aria-modal`；Esc 關閉並把 focus 還給 launcher；訊息列 `role="log"`、「回覆中」用 `role="status"`。
- 手機：全螢幕/bottom sheet、header sticky、隱藏展開鈕。

## 3. 對 quidproquo 的建議（依優先序）
1. 修 margin（上方 §0），header 回到 ~52px 單列。
2. 「新對話」從 ⋯ 拉出成獨立 + 按鈕（空對話時隱藏）；⋯ 留：複製、下載 Markdown、清除（破壞性放最後）。
3. 「停止」從 header 移到輸入框（送出鈕切換成停止），header 不因串流閃出新按鈕。
4. 副標改成短的 AI 身分＋範圍（例：「AI 助理 · 只根據本站文章回答」），單行截斷；免責聲明放 header 下方灰字或輸入框下方。
5. 「回覆中」badge 可保留但加 `role="status"`；或移到訊息區的 typing 指示。
6. 手機隱藏展開鈕；檢查 Esc 關閉與 focus 歸還。
7. （選配）首問後標題換成對話主題；若之後做多對話，歷史用標題下拉。

---
# 附錄：原始蒐集（含來源 URL 與讀取層級 ✅/🟡/[推論]）


# Chat header research — Group A: general-purpose assistants (compact / side-panel / floating)

Date: 2026-09-19. Read levels: ✅ read full page · 🟡 snippet / search highlight only · [推論] inference · ❓ unverified.
Tool chain: Keenable keyless search → curl+strip (OpenAI, Perplexity blocked by Cloudflare) → Exa fetch/search → Tavily extract. Groundlane was not available (toolDegradation).

**Caveat on sources:** first-party help centers describe controls as "at the top" or "upper right". They almost never give pixel heights or a full left-to-right order. Every height or order below that is not cited is marked [推論] or ❓. No screenshots were measured.

## Per-product table

| Product / surface | Header controls (documented) | Order (L→R) | Overflow menu contents | Notes | Sources + read level |
|---|---|---|---|---|---|
| **ChatGPT web** (chatgpt.com) | Share button (top right). Model picker: on web it moved **out of the header into the composer**. On iOS/Android it is still at the top of the conversation. | …→ Share at the right. Left side ❓ | Conversation ⋯ menu (Share etc.) ❓ exact items | The model picker moving off the web header into the composer is a notable 2026 change. | help.openai.com/articles/7925741 (🟡 "share button on the top right of the chat screen"; the ✅ Tavily read of the current version says only "Select Share"); help.openai.com/…/6825453-chatgpt-release-notes (🟡 "On web, it appears directly in the message composer") |
| **ChatGPT Windows companion window** (Alt+Space) | **New chat** at the top of the window. Close. | ❓ | none documented | Small floating window. Remembers its position and resets to bottom-center. When closed, the conversation continues in the main app's history. | help.openai.com/en/articles/9982051 ✅ |
| **ChatGPT macOS Chat Bar** (⌥Space) | Effectively **no header**: a draggable single-row input ("Ask anything") with a + attach menu, a model chip and voice. | input · + · model chip · voice/send | + menu: Upload File / Upload Photo / Take Screenshot | Header-less launcher pattern. The first message starts a new conversation. | help.openai.com/en/articles/9295241 ✅ (text + screenshot alt text) |
| **ChatGPT Atlas "Ask ChatGPT" sidebar** | Opened by "Ask ChatGPT" at the top right of the browser. Panel shows quick options (chat / Agent mode) and an "Ask anything" box with mic. No header controls documented. | ❓ | ❓ | Agent mode is chosen from the composer's + menu, not the header. | help.openai.com/en/articles/12628199 ✅ (the header itself is not described) |
| **Claude web** (claude.ai) | **Conversation title** at top (click → dropdown Rename/Delete in the older docs; current docs move rename/delete to the sidebar row ⋮). **Files** button (per-conversation file tray). **Share** (top right). | title (left/center) … Files · Share (right) [推論 order] | title dropdown: Rename / Delete (older); sidebar ⋮: Rename / Delete / Select | The title is auto-generated from the conversation (third-party observation). The model picker lives in the composer ("model pill"), not the header. | support.claude.com/…/10593882 ✅ ("Share" button in the upper right corner); support.claude.com/…/8230524 ✅ (rename via sidebar ⋮); privacy.claude.com/…/10023670 🟡 ("Click on the name of the conversation at the top… Select Delete or Rename from the dropdown"); weloveclaude.com/reference/web-sitemap ✅ third-party UI map (header buttons: Files, Share; model pill in composer) |
| **Claude in Chrome side panel** (now a Cowork session) | **⋯ (three dots) upper right**. Classic panel also has a **clock icon, upper right** (scheduled tasks) and a **record** icon. Permission-mode control (starts in "Automatically approve"). | … → ⋯ at the far right | ⋯ → "Switch back to classic" (other items ❓) | Sessions are saved to account history and can be resumed on web, desktop or mobile, so the header does not need its own history. | support.claude.com/…/12012173 ✅; claude.com/blog/cowork-chrome-side-panel ✅ |
| **Gemini in Chrome** (side panel) | At the top: **Pop-out chat / Dock to original tab**, **Start new chat** (moves into More options if space is tight), **More options** (recent chats). The model picker is in the text box. Tab sharing ("Update tabs" / "Show shared tabs") sits in or above the composer. | ❓ (all described as "at the top") | More options → recent Gemini chats; also Start new chat when it does not fit | **Responsive overflow:** "Start new chat… If it's not there, first click More options". Pop-out ↔ dock toggle in the header. Chrome's side-panel close is provided by the browser [推論]. | support.google.com/chrome/answer/16283624 ✅ |
| **Gemini in Gmail / Workspace side panel** | **More options at TOP LEFT** (history, Gems, settings). **Close**. Add source. | More options (left) … Close (right) [推論 for Close position] | More options: **History (View all) · More suggestions · Gems · Settings · Send feedback** | History and feedback are pushed into a left-side overflow. The header stays minimal. | support.google.com/mail/answer/14199860 ✅ |
| **Microsoft Copilot in Edge** (sidebar pane) | **"Start new chat"** at the top of the Chat panel. **X close** in the upper-right corner. Open in a new tab via right-click on the sidebar icon (not in the header). | … Start new chat … X (far right) | ❓ | Response actions (good/bad, share, copy) sit under each message, not in the header. | teachucomp.com/copilot-chat-in-microsoft-edge 🟡; easytweaks.com 🟡 (open in new tab); support.microsoft.com getting-started ✅ (confirms the sidebar surface, no header detail) |
| **Perplexity Comet Assistant** (sidebar, Alt+A) | Opened from the Assistant button at the top right of the browser. Collapsible panel. **Header controls not documented.** | ❓ | ❓ | @tab mentions and voice live in the composer. The first-party help article has no header info. | perplexity.ai/comet/resources/…/comet-quick-start-guide ✅; perplexity.ai/help-center/comet/…/11734688-assistant-panel ✅ (no header info); theverge.com 🟡 |
| **Notion AI / Notion Agent** (floating ↔ sidebar ↔ full page) | **"Switch chat mode"** at the top of the chat window (Sidebar / Floating). **Pin icon** in the corner of the chat window. ⋯ menu on the right with **View History**. The model picker ("Auto") is in the composer. | ❓ (Switch mode at top; pin "in the corner"; ⋯ on the right) | ⋯ → View History (older guide) | Chats are auto-named "based on what the conversation was about". A floating face button (bottom right) opens it, and the chat can be promoted to a sidebar or a full page. | notion.com/help/notion-agent 🟡 (Exa highlights; the Exa ✅ read was truncated before these sections); notion.com/en-gb/help/guides/everything-you-can-do-with-notion-ai 🟡; notion.com/help/navigate-with-the-sidebar 🟡 |
| **Dia** (Browser Company) | "Chat" button at the top right opens the chat sidebar (Cmd+E). Header controls ❓ | ❓ | ❓ | Low-confidence sources only. | en.namu.wiki/w/Dia 🟡; dassi.ai review 🟡 |

**Header height / single- vs two-line title:** no source documents pixel heights. [推論] Every documented side-panel or floating header is a **single row of icon buttons** with at most a one-line title. None document a subtitle or status line.

## Patterns

**Near-universal**
- **New chat in the header**: ChatGPT companion, Gemini in Chrome, Copilot Edge, and Notion via the sidebar "+". It is the most consistently documented header action.
- **Close / collapse at the far right**: Copilot X, Gemini Gmail Close. In browser side panels the close is often supplied by the host chrome [推論].
- **Model picker is NOT in the compact header.** It lives in the composer for Gemini in Chrome, Notion "Auto", Claude's model pill, and ChatGPT web (moved there in 2026). A launcher bar like the Chat Bar has a model chip inside the input.
- **History is behind an overflow (⋯ / More options)** rather than being a top-level header button: Gemini Chrome, Gemini Gmail, Notion "View History". Sometimes it is outside the panel entirely (Claude Cowork and Copilot rely on the account-level history).

**Common**
- One **⋯ overflow** holding the less-used items (history, settings, feedback, Gems, "switch to classic"). Gemini Gmail puts it at the top **left**; Claude in Chrome puts it at the top **right**.
- **Pop-out / dock or mode switch** (floating ↔ sidebar ↔ full page): Gemini in Chrome (Pop-out/Dock), Notion (Switch chat mode). ChatGPT has a separate main window.
- **Share** appears only on full-page chat surfaces (ChatGPT web, claude.ai). It is absent from compact panels.

**Rare**
- An avatar/status/subtitle line. None was documented in this group.
- A responsive overflow that collapses a header action into ⋯ when narrow (Gemini in Chrome "New chat" → More options).
- A pin icon (Notion), a scheduled-task clock (Claude classic), and a Files tray (claude.ai).
- An auto-generated conversation title in the header: documented for full-page claude.ai and for Notion chat names. Compact panels mostly don't show a title.


# Chat header research: customer-support AI widgets (Group B)

Research date: 2026-09-19. Method: official help-center pages fetched with curl and stripped to text, plus **live DOM probes** run with headless Playwright (Chromium, 1366x900) on each vendor's own marketing site. For each probe the launcher was clicked, then button `aria-label`s and bounding boxes were dumped from the widget frame. Raw captures are in `scratchpad/hdr/` (`probe_*.txt`, `p2_*.txt`, `*.png`).

Read-level legend:
- ✅ = read the full page, or observed live in the DOM/screenshot (marked **[live]**)
- 🟡 = seen only in a search snippet
- [推論] = inference

Live-probe caveat: a vendor's own site is one configuration of the widget. Customers can configure theirs differently.

---

## Per-product table

| Product | Header controls (L→R) | Overflow / more menu | Home vs. conversation | Height / density | Notes | Sources + read level |
|---|---|---|---|---|---|---|
| **Intercom Messenger (Fin)** | **Conversation:** `‹` back ("Go back, Messages") · avatar · **name "Fin"** plus subtitle "The team can also help" · `…` ("Conversation options") · `✕` Close. **Messages list:** centred title "Messages" · `✕` only. A bottom tab bar (Home / Messages / Help / News) sits outside the header. | `…` opens a dropdown whose (only observed) item is **"Expand window"**. Expand lives inside the overflow menu, not as a top-level icon. The 2025 redesign **removed** the old three-dot menu entry for previous conversations; history is reached via Home or Messages. | intercom.com launches **straight into a conversation** (the "Launch directly into a conversation" setting), so the conversation header comes first. Home uses a branded header (logo, optional teammate avatars, background colour, gradient or image). Conversation headers are plain white. | Header row about 54px: 38px icon buttons with 8px padding. Messenger width 400px. | Jan 2025 "Updates to the Messenger": conversation headers were "simplified to focus on the content". A Fin conversation shows **Fin's name and avatar in the header**, and Fin's first message is the only element. Team intro and special notice are hidden while Fin handles the chat and return for workflows or humans. Fin, workflow bots and humans are told apart by **per-message labels** ("Fin · AI Agent · Just now"), not by the header. The typical reply time moved **out of the header to above the composer** and disappears after handover. The branded nav bar was dropped; conversations use a white background. AI-generated conversation titles appear in the list, not the header. | ✅ https://www.intercom.com/help/en/articles/9319961-updates-to-the-messenger ; ✅ https://www.intercom.com/help/en/articles/6612589-messenger-explained (home header styling, avatars, sound setting) ; ✅ **[live]** intercom.com probe (`p2_intercom.txt`, `probe_intercom.png`) |
| **Zendesk Web Widget (Messaging, AI agents)** | Admin sets **Logo** ("appears at the top of the frame"), **Title** (business name or CTA such as "Contact us") and an optional **Description** under the title. With **multi-conversations** on, the conversation header shows: **back button** (to the conversation list) · **conversation title** (defaults to the start date/time; can be set via the SunCo API) · **avatar of whoever sent the latest message** (AI agent avatar until a human replies). | End users can **download a transcript** from the Web Widget when the admin enables it. The docs don't say where the entry point sits; a header menu is [推論]. **Sound notifications** can be turned off by the customer "on their end" (entry point unverified). | **Multi-conv:** the launcher opens the most recent active conversation; back leads to the list; the list has a "New conversation" button **at the bottom**, not in the header. If every conversation is inactive, the list opens first. Single-conversation mode keeps the header static: logo, title, description. | Unverified (the live probe was geo-redirected to zendesk.tw and no widget loaded). | The header avatar is **dynamic**: it follows whoever spoke last, so AI to human handover shows up in the header. | ✅ https://support.zendesk.com/hc/en-us/articles/4500747797914 (Style: logo, title, description, sound) ; ✅ https://support.zendesk.com/hc/en-us/articles/8195486407706 (multi-conversations end-user experience) ; ✅ https://support.zendesk.com/hc/en-us/articles/4408818625690 (transcript download) ; 🟡 https://internalnote.com/multi-conversations |
| **Crisp (Hugo AI agent)** | **Row 1:** 🏠 Home icon · segmented tabs **Messages / Articles / Search** · `⋮` "Quick Actions" (far right). **Row 2 (identity):** avatar · **"Questions? Chat with us."** plus subtitle "Our team can also help". The subtitle's aria-label is "Support is online.", so status text doubles as the presence signal. **No close ✕ in the header**: the launcher turns into an ✕ ("Close chat"). | `⋮` Quick Actions exists, but the probe could not open it. **Menu items unverified.** | Tabs sit in the header, so Home, Messages, Articles and Search are switched from the top rather than a bottom tab bar. "Answers by hugo" attribution is in the footer, not the header. | Two rows, about 110px total (tabs 32px plus identity row about 50px) [live]. Panel 400×730. | Crisp documents a header status line, "**Header: ongoing status metrics**" (expected reply time), which can be hidden or reworded. | ✅ **[live]** crisp.chat probe (`p2_crisp*.txt`, `p2_crisp_1.png`) ; ✅ https://help.crisp.chat/en/article/how-to-hide-the-estimated-response-time-from-the-chatbox-1776ho6/ ; ✅ https://help.crisp.chat/en/article/how-to-customize-the-crisp-chatbox-1hj537j/ (general only) |
| **HubSpot chat (HubBot / Customer Agent)** | avatar (with **green online dot**) · **name "HubBot"** plus subtitle **"Powered by AI"** · ⤢ **"Expand widget"** · ✕ **"Close live chat"**. No back button and no `…` menu observed. | None observed. Transcripts are an admin setting ("Chat transcript" toggle, sent automatically), not a visitor control. | Chatflow-driven: opens straight into the bot conversation with quick-reply chips. The admin picks the header name and avatar via "**Chat heading**" and can show a "typical reply time" when available. | About 72px header on a dark background, 40px icon buttons [live]. | An AI disclosure appears **twice**: "Powered by AI" in the header and "AI-generated content may be inaccurate." under the composer. Expand is a **top-level** icon here. | ✅ **[live]** hubspot.com probe (`probe_hubspot.png`) ; ✅ https://knowledge.hubspot.com/help-desk/connect-and-customize-a-chat-channel-in-help-desk ; ✅ https://knowledge.hubspot.com/chatflows/create-a-live-chat |
| **Freshchat (Freddy)** | Admin settings: **Title + Sub-title** (bot name and brand message), a bot **avatar icon** (recommended 25×25px), header style and background pattern, and custom CSS for "header and footer elements". Actual end-user controls **unverified**: freshworks.com runs Qualified rather than Freshchat, so no live probe. | Notification sound and browser-notification toggles are admin-side. Visitor-side menu unverified. | Unverified. | Unverified. | The tiny 25px avatar suggests a compact header [推論]. | ✅ https://support.freshchat.com/en/support/solutions/articles/50000003404 ; ✅ https://crmsupport.freshworks.com/en/support/solutions/articles/50000005560 |
| **Tidio (Lyro)** | A third-party guide says the logo/avatar "appears in the chat widget header" and that the header bar carries white text on the brand colour. The live probe failed (the widget iframe never loaded behind Cookiebot). **Controls unverified.** | Unverified. | Unverified. | Unverified. | The official knowledge page returned an empty body to curl. | 🟡 https://tidio.com/knowledge/getting-started/customizing-your-chat-widget ; ✅ (3rd-party) https://aiproductivity.ai/guides/tidio-live-chat-customization |
| **Drift / Salesloft** | Not researched further. **Drift was sunset.** Clari + Salesloft announced on 2026-03-06 a gradual sunset, with 1mind named as successor. It is no longer a useful current reference. | – | – | – | – | 🟡 https://marqeable.com/blog/drift-alternative-migration ; 🟡 https://leadgenius.com/resources/... ; ✅ https://naoma.ai/blog/drift-replacement-guide (3rd-party) |

---

## Patterns

1. **Minimal right cluster.** The right side of the header holds at most two or three icons. Close ✕ is the one constant (Crisp even moves close onto the launcher). Everything else is either promoted to one icon (HubSpot ⤢ expand) or hidden in the overflow menu (Intercom `…` → "Expand window"). ✅ live
2. **Identity block = avatar + name + one-line subtitle.** The subtitle is used for AI disclosure or reassurance ("Powered by AI", "The team can also help"), not for a long "typically replies in…" line. Intercom moved reply-time copy **out of the header to above the composer**, and it disappears after handover. ✅
3. **Back ‹ appears only when there is a list to go back to.** Intercom and Zendesk multi-conversation show back on the left. HubSpot (single-thread chatflow) has none. "New conversation" lives on the **list screen** (a bottom button), not in the conversation header. ✅
4. **Home and conversation headers differ.** Home is the branded area (logo, gradient or image, team avatars). Conversation is plain, content-first and white (Intercom 2025). The trend is **launching directly into the conversation**. ✅
5. **The header shows who's talking now.** Zendesk's avatar follows the last sender. Intercom shows Fin in the header while Fin handles the chat, and marks AI vs. bot vs. human with per-message labels. ✅
6. **Navigation is in the header or at the bottom, not both.** Crisp puts Home / Messages / Articles / Search tabs in the header (2 rows, about 110px). Intercom uses a bottom tab bar and keeps a single header row of about 54px. ✅ live
7. **Utility actions go in the overflow menu or admin settings** (transcript download, sound). None of them are top-level header icons in any product verified here. [推論 partly: Zendesk's transcript entry point is unverified]


# Chat header research — Group C: docs-site "Ask AI" widgets + chat UI libraries

Date: 2026-09-19. Read levels: ✅ read full page / source file · 📸 live DOM probe + screenshot (Playwright, 1440×900, 2026-09-19) · 🟡 snippet only · [推論] inference.
Raw material (screenshots, source dumps): `scratchpad/hdr/` (`*_crop.png`, `ds_sph.tsx`, `aui_modal.tsx`, `cpk_modalheader.tsx`, `kapas.txt`, `inkeep.txt`).

## Per-product table

| Product | Header controls, left → right | Configurable (header-relevant) | Disclaimer placement | Density / height | Notes | Sources + read level |
|---|---|---|---|---|---|---|
| **kapa.ai widget** (modal) | Logo · Title … [MCP "Use MCP" button, opt-in] · Close | `data-project-name` ("name displayed at the top of the widget modal"), `data-project-logo`; `data-modal-logo-hidden`, `-hidden-on-mobile`, `-src-ask-ai` / `-src-search` (logo per mode); `data-modal-title` (default `"[project name] Docs AI"`), `-title-ask-ai` / `-title-search`; `data-modal-close-button-hidden`; `data-mcp-button-hidden` (default true) / `-text`; header styleable via `data-modal-header-*` (bg, color, padding-y…) | `data-chat-disclaimer` (Markdown, default empty) = "disclaimer text shown at the top of the conversation" → **top of body, below header**, not in header. Separate opt-in consent screen. Kapa branding + privacy links are separate components (footer area [推論]) | Not stated; `modal-header` padding-y is configurable | Search vs Ask-AI is a **mode** (`data-search-mode-enabled`), and title/logo can differ per mode. **Clear-thread and copy are "conversation buttons" beside answers, not header**. Exit-feedback survey fires on close | ✅ https://docs.kapa.ai/integrations/website-widget/configuration/component-styles ; ✅ https://docs.kapa.ai/integrations/website-widget/configuration/behavior . Exact left/right order: [推論] from component list (Modal Header → Logo, Title, Close Button) |
| **Inkeep** (AI chat) | Header content not documented on this page. Action buttons live in a **toolbar at the bottom-right**: Start Over / Share Chat / Copy Chat / Get Help / Stop | `aiAssistantName`, `chatSubjectName`, `aiAssistantAvatar`; `isShareButtonVisible`, `shareChatUrlBasePath`, `isCopyChatButtonVisible`; `toolbarButtonLabels {clear, share, getHelp, stop, copyChat}`; `getHelpOptions` (support links) | `disclaimerSettings {isEnabled, label:"AI Assistant", tooltip:"Responses are AI-generated and may require verification."}` → a **short label with tooltip**, not a sentence; exact position not stated on page [推論: compact badge] | n/a | Key lesson: Inkeep deliberately moves reset/share/copy **out of the header** into a toolbar near the input | ✅ https://docs.inkeep.com/ui-components/common-settings/ai-chat ; base settings page ✅ https://docs.inkeep.com/ui-components/common-settings/base (only custom `close` icon found) |
| **Mintlify Assistant** (right side panel, ⌘I) | ✦ sparkle icon + "Assistant" … Expand (↗↙) · Close (×) | Dashboard: enable/disable, starter questions, bot protection; no header options documented | "Responses are generated using AI and may contain mistakes." — small grey centered text, **first line of body right under header** | Compact (~50px) [推論 from screenshot] | Opened via ⌘I, "Ask Assistant" button next to search, `?assistant=` URL param, highlight→"Add to assistant". No new-chat/history in header (empty state) | 📸 https://www.mintlify.com/docs/quickstart ; ✅ https://www.mintlify.com/docs/assistant/use ; ✅ https://www.mintlify.com/docs/assistant/configure |
| **GitBook Assistant** (right side panel) | Logo icon + "GitBook Assistant" … Expand · Close | Not documented | No sentence disclaimer; input footer shows "AI · Based on your context (ⓘ)" chip → **input footer** | Compact | Empty state: avatar + greeting ("Good afternoon / I'm here to help you with the docs") + 3 suggested questions; input placeholder "Ask, search, or explain…" (unified search/ask) | 📸 https://gitbook.com/docs ; ✅ https://gitbook.com/docs/ai-for-your-readers/gitbook-ai-assistant (no header detail) |
| **Vercel docs "Ask AI"** (400px right panel) | H2 "Ask AI" … Copy chat as markdown · Share chat · Clear chat · Close chat (4 icon buttons, 34px pitch) | n/a (first-party) | No disclaimer seen in empty state; footer shows "Tip: You can open and close chat with ⌘ I" | Buttons at y≈16 → ~56–64px header [推論] | Most "action-heavy" header in the group: copy/share/clear all in header | 📸 https://vercel.com/docs (aria-labels read from DOM) |
| **Stripe docs "Ask AI"** (~345px right panel) | ✦ sparkle · "New chat ▾" (title doubles as **thread switcher dropdown**) … + (new chat) · Expand · Close | n/a | "Responses are generated using AI and may contain mistakes." — small grey centered, **directly below header** (sticky top of body) | ~55px [推論] | Page-context chip ("Payments") above input; tip "highlight any text to ask… ⌘+I". Input placeholder "Ask a question about the page" | 📸 https://docs.stripe.com/payments |
| **Algolia DocSearch v4 — Sidepanel** | Left: [Back (mobile)] · New conversation (edit icon) · Conversation history (folder) — only in history state. Center: ✦ Sparkles icon + H2 "Ask AI" (or history title). Right: ⋮ menu {Start a new conversation, Conversation history} · Expand/collapse · Close | `translations`: `title` ("Ask AI"), `conversationHistoryTitle`, `newConversationText`, `viewConversationHistoryText` | `promptDisclaimerText` = "Answers are generated with AI which can make mistakes." → **beneath the prompt form (footer)** | `height: 3.5rem` (56px), padding .2rem 1rem, border-bottom; title centered on desktop, left-aligned on mobile (left group hidden) | New/history hidden in overflow ⋮ menu; menu hidden when nothing to show (no new-chat when empty, no history when none); all disabled while streaming | ✅ source https://github.com/algolia/docsearch/blob/main/packages/docsearch-react/src/Sidepanel/SidepanelHeader.tsx ; ✅ `packages/docsearch-css/src/sidepanel.css` ; ✅ `Sidepanel/PromptForm.tsx` |
| **Algolia DocSearch v4 — modal Ask AI** | No separate chat header: the search box row becomes a "← Back to keyword search" button + input + clear | `backToKeywordSearchButtonText` / `AriaLabel` | `disclaimerText` default "Answers are generated with AI which can make mistakes." (component defined; placement in modal not confirmed) | — | Mode switch = back arrow in the search bar, not tabs | ✅ `components/AskAiSearchBox.tsx`, ✅ `AskAiScreen.tsx` (same repo) |
| **CopilotKit v1** `CopilotPopup/Sidebar` | Title text · [DevConsole (dev only)] · Close | `labels.title` (+ `labels.initial`), `icons.headerCloseIcon`; custom `Header` component via props | none built in | `height: 56px`, padding 0 1.5rem, border-bottom, radius 8px top on ≥640px | Minimal: title + close only | ✅ `packages/react-ui/src/components/chat/Header.tsx`, ✅ `packages/react-ui/src/css/header.css` (github.com/CopilotKit/CopilotKit); ✅ https://docs.copilotkit.ai/reference/v1/components/chat/CopilotPopup |
| **CopilotKit v2** `CopilotModalHeader` | 3 equal flex columns: Left = DrawerLauncher "Open threads" (only if a threads drawer is registered) · Center = Title (centered) · Right = Close | Slots: `title`, `titleContent`, `closeButton`, `children` render-prop | none | `px-4 py-4` + border-b | Threads/history as left-side drawer toggle | ✅ `packages/react-core/src/v2/components/chat/CopilotModalHeader.tsx` |
| **assistant-ui** `AssistantModal` (registry) | Title (current thread title, or "New Chat"; "Threads" in list view; 13px medium, truncate) … History (toggle, `aria-pressed`, disabled if no threads) · New Thread (+). **No close button in header** — the floating trigger toggles the modal | Title comes from thread state; header is copy-in source (shadcn-style), so fully editable | none | `h-11` (44px), `ps-3.5 pe-2`, border-b — densest in group | User-resizable modal (size persisted in localStorage); history is an in-panel view swap, not a drawer | ✅ `packages/ui/src/components/react/assistant-ui/elements/assistant-modal.aui.radix.tsx` (github.com/assistant-ui/assistant-ui) |
| **Vercel AI Elements** | No header component. `ConversationDownload` is an outline round button **absolutely positioned top-4 right-4 over the conversation** (exports messages to Markdown) | Compose-your-own | none | — | Signal: "download/copy transcript" is treated as a top-right affordance | ✅ `packages/elements/src/conversation.tsx` (github.com/vercel/ai-elements) |
| Cloudflare docs, Supabase docs, shadcn chat blocks, NLUX, Chatbot UI kits | **Not verified** — Playwright could not find/open an Ask-AI panel on developers.cloudflare.com/workers or supabase.com/docs; others skipped for budget | — | — | — | — | — |

## Patterns

1. **Minimal core = identity left, window controls right.** Every product has title (usually with a ✦ sparkle or brand logo) on the left and Close on the far right. Side-panel products (Mintlify, GitBook, Stripe, DocSearch) add **Expand** immediately left of Close. Libraries default to title + close only (CopilotKit v1).
2. **Conversation actions are the variable part — and several vendors keep them out of the header.** Kapa puts clear/copy next to answers; Inkeep puts Start Over/Share/Copy/Get Help in a bottom toolbar; DocSearch hides new/history in a ⋮ overflow menu. Only Vercel puts copy/share/clear in the header. When present, **New chat (+ / edit icon)** is the most common header action (Stripe, DocSearch, assistant-ui), followed by **history/threads** (DocSearch, assistant-ui, CopilotKit v2 drawer, Stripe's title dropdown).
3. **Title is often dynamic**: thread title / "New chat" (assistant-ui, Stripe dropdown), or per-mode title (kapa search vs ask; DocSearch history title).
4. **Disclaimer never lives inside the header bar.** Either the first small grey line right under the header (Mintlify, Stripe, kapa's `chat-disclaimer`) or under the input (DocSearch, GitBook's "AI · Based on your context" chip, Inkeep's short label + tooltip). The wording is standardized: "Responses/Answers are generated (with) AI and may contain/can make mistakes."
5. **Height ≈ 44–56px** with a 1px bottom border (assistant-ui 44px; CopilotKit and DocSearch 56px). Icon-only buttons with aria-label/title tooltips.
6. **Controls react to state**: hide new-chat when empty, hide history when none, disable while streaming (DocSearch, assistant-ui).
7. **Search-vs-Ask mode**: handled by mode-specific titles (kapa) or a back arrow to keyword search (DocSearch modal), never by header tabs in the products verified here.


# Floating chat panel header: layout and design guidelines (research D)

Date: 2026-09-19. Read-level legend: ✅ full page fetched and grepped / 🟡 snippet or secondary source only / [推論] my inference.
Tool degradation: Groundlane MCP unavailable, so I used the Keenable keyless API for search and curl + python strip for page reads. Raw text dumps are in `scratchpad/hd/*.txt`.

---

## 1. Header height and density

| Rule / number | Source | Read |
|---|---|---|
| M3 **small** and **center-aligned** top app bar: **64dp** height. Medium flexible: 64dp collapsed and 112dp expanded (136dp with a subtitle). Large: 64dp collapsed and 152dp expanded. | alexzh.com visual guide to Compose TopAppBar variants (secondary source quoting Compose defaults) https://alexzh.com/visual-guide-to-topappbar-variants-in-jetpack-compose | 🟡 (secondary; m3.material.io is SPA and could not be fetched) |
| M3 2025 "expressive" update to the small app bar: "**Reduced overall height**", a subtitle is supported, and left- or center-aligned text is an option. Implementation uses `minHeight="?attr/actionBarSize"` with `wrap_content`, so the bar can grow when the font scale increases. | material-components-android TopAppBar.md https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md | ✅ |
| M3 puts the subtitle *inside* the single-row small bar (title and subtitle stacked, not a taller bar). Only medium and large bars add expanded height. | same + alexzh | ✅/🟡 |
| Primer Dialog header region: **title (required) + optional description + close button (required, never visually hidden)**. The title and description may wrap. Content sits inside a **16px safe area**, and the **close button is placed 8px from the edges** (the × glyph stays within the safe area). Secondary-action IconButtons may sit next to close. | Primer Dialog guidelines https://primer.style/product/components/dialog/guidelines/ | ✅ |
| Fluent 2 Dialog: the header (title + dismiss icon) and footer **stay persistent (sticky) at top and bottom on scroll**, and the body scrolls behind them. Titles use sentence case and should be concise and specific. | Fluent 2 Dialog usage https://fluent2.microsoft.design/components/web/react/core/dialog/usage | ✅ |
| Apple toolbar (the navigation bar is now merged into Toolbars): aim for a title **under 15 characters**. **Don't use the app name as the title.** If the title seems redundant, leave it empty. | Apple HIG Toolbars https://developer.apple.com/design/human-interface-guidelines/toolbars (JSON data endpoint) | ✅ |
| Apple sheets: if the top-leading text looks like a page or app title, people won't know how to dismiss the sheet. Use the standard Close/Cancel. | Apple HIG Sheets https://developer.apple.com/design/human-interface-guidelines/sheets | ✅ |
| Apple nav bar height "44pt" | Not stated on the current HIG pages I fetched. Don't cite it as HIG. | not found |
| **Derived target for a web floating chat header:** a single row of about **48–56px** (≥ 2×24px targets + padding), with title and subtitle stacked with **~0–2px gap** (use line-height rather than margin). The subtitle is one line at a smaller font size and is truncated (ellipsis) instead of wrapping. The M3 64dp figure is a *mobile app-bar* ceiling, not a floor for a compact web panel. | [推論] from M3 subtitle-in-small-bar + Primer 16px/8px spacing + WCAG 24px | [推論] |

## 2. Order and placement of header actions

| Rule | Source | Read |
|---|---|---|
| Close sits at the **top-right** of web dialogs. Fluent: "Non-modal dialogs contain a Close button in the top right by default". Non-modal dialogs **cannot** be dismissed by clicking outside, only by Close, Esc, or a footer button. | Fluent 2 Dialog https://fluent2.microsoft.design/components/web/react/core/dialog/usage | ✅ |
| "A close button in the header should always be used, except in extremely rare circumstances." The modal title is an h1. | Atlassian Modal dialog https://atlassian.design/components/modal-dialog/usage | ✅ |
| **Carbon AI Chat header order**: custom `actions` render first and overflow into a menu when space is tight, then "the built-in restart and close buttons are appended after them". So **close is last (rightmost)**. The minimize icon can be close, minimize, or side-panel. Extra items go in `menuOptions`, an overflow menu. The **AI label is shown in the header by default**. | Carbon AI Chat Header.md https://github.com/carbon-design-system/carbon-ai-chat/blob/main/packages/ai-chat/docs/Header.md | ✅ |
| Primer: secondary-action IconButtons go **next to** the close button, and close is required. | Primer Dialog guidelines | ✅ |
| Apple: the trailing edge holds important always-available items and the **More menu**. Group critical actions like Done/Close/Save in a distinct section. Aim for a **maximum of three groups**. "Try to include all actions in the toolbar if possible, and only add [a More menu] if you really need it". "Prioritize less important actions for inclusion in the More menu." | Apple HIG Toolbars | ✅ |
| NN/g: use contextual (⋯/kebab) menus **only for secondary, noncritical actions**. **Don't hide 1–2 actions** behind a menu if they fit. The AT&T chat anti-pattern: "End Chat" buried in a menu. It "should be displayed on the primary level, ideally represented by an 'x' in the top right corner". Surface a few action icons before the overflow icon to raise information scent. Don't use a hamburger for a contextual menu. Menu icons need adequate size and contrast and must be visible without hover. Menus must be keyboard and screen-reader operable. | NN/g "Designing Effective Contextual Menus: 10 Guidelines" https://www.nngroup.com/articles/contextual-menus-guidelines/ | ✅ |
| NN/g: allow users to **resize or maximize** the chat window. Rich answers need more space, which justifies an **Expand** control. | NN/g "AI Chatbots: 10 design guidelines" https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ (#8) | ✅ |
| Destructive items (e.g. "Clear conversation" or "Delete") belong in the overflow menu, grouped with related items. NN/g's example groups Archive/Report/**Delete** in the ChatGPT ⋯ menu. For irreversible steps, focus the least-destructive option (APG). | NN/g contextual menus; APG dialog https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | ✅ |
| **Recommended order (LTR):** `[title/subtitle …] [AI label?] [⋯ more] [expand ⤢] [close ×]`. Close is always rightmost. Expand/minimize sits adjacent to close (a window-control pair). Keep **≤3 visible icon buttons**. Move "new chat / clear / feedback / about" to ⋯ unless there are only 1–2 of them, in which case show them directly. | [推論] synthesized from Carbon (close appended last), Fluent, NN/g, Apple ≤3 groups | [推論] |

## 3. Accessibility

| Rule | Source | Read |
|---|---|---|
| A dialog container has `role="dialog"` with **`aria-labelledby` pointing to the visible title**. `aria-describedby` is optional. It can point at the subtitle if that is short, but should be omitted when the content is long or structured. `aria-modal="true"` applies only to modal dialogs. | WAI-ARIA APG Dialog (Modal) https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | ✅ |
| Focus: on open, focus moves inside the dialog (first focusable element, or a static title with `tabindex=-1` if content is long). On close, focus **returns to the invoking element**. **Esc closes.** The tab sequence should include a **visible close button**. Non-modal dialogs let focus leave without closing. | APG Dialog; Atlassian and Fluent say the same thing about returning focus | ✅ |
| `complementary`/`<aside>` is a landmark for supporting content that stands alone (sidebars). If there are several on a page, each needs `aria-label`/`aria-labelledby`. Use landmarks sparingly. | MDN complementary role https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/complementary_role | ✅ |
| For a **non-modal floating chat**, use `role="dialog"` **without** `aria-modal` (APG/Fluent non-modal semantics) *or* `<aside aria-labelledby=title>` if it is a persistent docked side panel. Don't use both. Carbon notes that a custom header "owns its landmark role and accessible name". | [推論] from APG + MDN + Carbon Header.md | [推論] |
| The **message list** uses `role="log"` (implicit `aria-live="polite"`). New messages are announced when the user is idle. | MDN log role https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role | ✅ |
| The "**Replying…**" indicator uses `role="status"` (implicit `aria-live="polite"` and `aria-atomic="true"`). It is advisory, not an `alert`. | MDN status role https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role | ✅ |
| Icon buttons must have an **accessible name describing the action** (aria-label). Primer IconButton shows a **visible tooltip on hover *and* keyboard focus** that replicates the name. The tooltip can be dismissed with Esc. | Primer IconButton https://primer.style/product/components/icon-button/ + /accessibility/ | ✅ |
| NN/g: use tooltips or labels to clarify ambiguous menu icons. | NN/g contextual menus #6 | ✅ |
| **WCAG 2.2 SC 2.5.8 (AA)**: targets are **≥24×24 CSS px**. Undersized targets pass only if 24px-diameter circles centered on them don't intersect other targets or circles (the spacing exception). Other exceptions: equivalent control, inline, user-agent control, essential. | W3C Understanding 2.5.8 https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | ✅ |
| Apple: minimum control size is **44×44 pt** on iOS/iPadOS (28×28 pt minimum on macOS). Use ~12pt padding around bezeled elements and ~24pt around non-bezeled ones. | Apple HIG Accessibility https://developer.apple.com/design/human-interface-guidelines/accessibility | ✅ |
| Material/Android: touch targets are **≥48×48dp**. A 24dp icon gets padding up to 48dp. | Google Accessibility Help https://support.google.com/accessibility/android/answer/7101858 ; Compose a11y defaults https://developer.android.com/develop/ui/compose/accessibility/api-defaults | ✅ |
| **Practical:** on desktop, header icon buttons of 32×32px (with ≥24px effective and spacing) clear WCAG AA. On touch/mobile full-screen, grow the buttons to 44px, or 48px to satisfy Apple and Material. | [推論] | [推論] |

## 4. Chatbot / AI-specific (what the subtitle should do)

| Rule | Source | Read |
|---|---|---|
| **Disclose AI upfront.** "Users prefer upfront disclosure… legally required in some regions, including the EU starting in August 2026. At a minimum, use a **persistent indicator — such as an AI icon or an AI agent label**." | NN/g "Dimensions of AI chatbots" https://www.nngroup.com/articles/dimensions-of-ai-chatbots/ | ✅ |
| On first open, **clearly and concisely state what it can do**. Vague greetings such as "Ask me anything" overpromise. List the topics or tasks without overwhelming, and tailor them to the current page. Use **suggested prompts as buttons**. | NN/g AI chatbots design guidelines #3–#4 | ✅ |
| When a question is out of scope, acknowledge the limit and redirect ("I don't have access to X, but I can…"). | NN/g dimensions | ✅ |
| HAX G1 "Make clear what the system can do". G2 "how well": the Copilot in Word example uses an **introductory blurb + suggested use cases**, plus a **disclaimer that it could make mistakes**. | HAX G1 https://www.microsoft.com/en-us/haxtoolkit/guideline/make-clear-what-the-system-can-do/ ; HAX example https://www.microsoft.com/en-us/haxtoolkit/example/copilot-in-word-1a-introductory-blurb-and-g2-make-clear-how-well-the-system-can-do-what-it-can-do/ | ✅ |
| Google PAIR: "Onboard in stages… explain what it can do, what it can't do, how it may change". Communicate the algorithmic nature and limits to avoid unintended deception. Template: "Right now, it's not able to {primary limitations}". | PAIR Guidebook, Mental Models https://pair.withgoogle.com/chapter/mental-models/ | ✅ |
| Carbon for AI: the **AI label** is the primary indicator that AI is present *and* the trigger for an explainability popover. Don't use it as an action button. Size it one step smaller than adjacent ghost icon buttons. Place it consistently. The Carbon AI Chat header shows the AI label by default. | Carbon AI label usage https://carbondesignsystem.com/components/ai-label/usage/ ; Carbon for AI https://carbondesignsystem.com/guidelines/carbon-for-ai/ ; Header.md | ✅ |
| **Placement synthesis:** header = title + a one-line subtitle that carries the *scope*, e.g. "Answers from this blog's posts". Put the **AI disclosure** as a persistent label or icon in the header. The longer "what I can do", suggested prompts, and "may make mistakes, check sources" go in the **empty-state intro message** or near the composer, not in a tall header. Optionally put the explainability detail behind the AI label popover or an ⋯ → "About". | [推論] from NN/g + HAX + PAIR + Carbon | [推論] |

## 5. Mobile / small screens

| Rule | Source | Read |
|---|---|---|
| Primer: a center-aligned Dialog **becomes fullscreen on narrow viewports** or **becomes a bottom sheet** (full-width, dims the background, tap the backdrop to dismiss). Centered dialogs keep a 16px viewport margin at all sizes. | Primer Dialog guidelines | ✅ |
| M3: full-screen dialogs exist for mobile. Anatomy includes a **close affordance icon** in the top app bar. There is no dedicated Material component. | material-components-android Dialog.md https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md | ✅ |
| Apple sheets: detents are **large** (full) and **medium** (~half). Include a **grabber** in a resizable sheet (it is VoiceOver-operable). Use the standard Close/Cancel. Closing returns to the parent context. | Apple HIG Sheets | ✅ |
| Fluent: header stays sticky while the body scrolls. | Fluent 2 Dialog | ✅ |
| Carbon AI Chat: in narrow ("mobile mode") layouts the header renders a menu for secondary panels such as history. Custom headers must provide those affordances themselves. | Carbon Header.md | ✅ |
| **Mobile header behavior:** on full-screen, hide Expand (it is meaningless) or swap it for a Minimize/collapse chevron. Keep Close top-right at ≥44px. Keep the header sticky. Respect `env(safe-area-inset-top)`. Truncate the subtitle to one line or drop it. | [推論] | [推論] |

## Gaps / not verified
- The m3.material.io spec pages (the SPA would not fetch). The 64dp figure comes from a secondary source that matches Compose defaults.
- Fluent 2 / Copilot-specific chat header guidance: no official page found.
- Shopify Polaris modal: the page was deprecated and yielded no header specs.
- The Apple 44pt *navigation bar height* is not stated on the current HIG. Only the 44×44pt *control* minimum is.
