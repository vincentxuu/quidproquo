---
title: "AI 時代的 React 套件選型：從 TanStack 三件組到整層 Stack 的地圖"
date: 2026-08-19
category: tech
type: deep-dive
tags: [react, tanstack-router, tanstack-query, zustand, ai-agent, frontend]
lang: zh-TW
tldr: "以 TanStack Router（19.7M 週下載）+ Query（55.8M）+ Zustand（44.5M）為核心，配 Vite、react-hook-form + Zod（224M）、Tailwind + shadcn、Vitest + Playwright，整理純 SPA 的當代預設 stack。AI 時代選套件多了三個判準：文件有沒有 llms.txt（TanStack 全家有、React Router 沒有）、型別安全能不能當 agent 護欄、原始碼是不是在你 repo 裡讓 agent 讀得到。"
description: "記錄 React SPA 的完整套件選型地圖：路由、伺服器狀態、client 狀態、表單、樣式、表格、測試各層的預設選擇與替代方案（附 npm 實查數據），並整理 AI coding agent 時代的選型新判準：llms.txt、型別安全護欄、複製原始碼模式與訓練語料存量的拉扯。"
series:
  name: "AI 時代的技術選擇"
  order: 1
draft: false
---

🌏 [English version](/posts/tech/2026-08-19-react-stack-ai-era-en)

React 套件選型的老三樣判準——功能覆蓋、生態規模、維護活躍度——現在要加上第四樣：**你的 AI coding agent 用它順不順手**。當越來越多程式碼由 agent 產出，「這個庫 agent 會不會寫、寫錯了能不能自己發現」開始實質影響開發速度。這篇記錄純 SPA 陣營目前最有共識的一套組合（以 TanStack Router + TanStack Query + Zustand 為核心），把周邊每一層的預設選擇與替代方案攤開（npm 下載數據全部 2026-08 實查），最後整理 AI 時代冒出來的新選型判準。

## 核心三件組的分工

核心邏輯是**把狀態按性質拆給三個各司其職的工具**，而不是找一個全能框架：

```
URL 狀態          → TanStack Router（路由、params、search params）
伺服器狀態        → TanStack Query（API 快取、去重、重新驗證）
殘餘 client 狀態  → Zustand（UI 偏好、彈窗、跨元件暫存）
```

**[TanStack Query](/posts/tech/2026-03-27-tanstack-query-server-state) 是三者中最沒有爭議的**：伺服器資料不是 state 而是快取，`useEffect` 手刻 fetch 缺快取、缺去重、缺背景刷新，每個專案最後都會自己長出一個劣化版的 Query——不如直接用。**[Zustand](/posts/tech/2026-03-27-zustand-state-management)** 則是「痛了再上」：伺服器資料歸 Query 之後，真正的 client 狀態往往少到 Context + useReducer 也夠用；store 越做越小是這套架構運作正常的訊號。

**TanStack Router** 是相對年輕的一塊（2023 年底 1.0），它對上 React Router 的差異化是架構層的：100% 型別安全（路徑、params、search params 全部編譯期推導，導航到不存在的路由是型別錯誤不是執行期 404）、search params 當一等公民（validate + 型別化 + 序列化內建）、route loader 與 Query 整合消掉瀑布式載入。

### 路由市場現況：主流與挑戰者

npm 週下載（2026-08 實查）：react-router **44.2M**、@tanstack/react-router **19.7M**。所以精確的說法是：**React Router 仍是主流，TanStack Router 是「主流的第二選擇」**——約前者四成，對一個 1.0 才兩年多的路由器是罕見的追趕速度。React Router 這幾年版本動盪（v5→v6 破壞性重寫、v7 併入 Remix 又分裂出 library/framework 兩種形態）累積了社群疲勞；TanStack Router 打的型別安全和 search params 是後補追不平的架構層差距。既有專案沒有理由遷移；新的 TypeScript 重度後台，天平已經倒向 TanStack。

## 整層 Stack 的其他選擇

三件組只解決路由和狀態。一個真實專案的完整地圖長這樣（括號內為 npm 週下載，2026-08 實查）：

```
建置        Vite (142.9M)
  │
  ├─ 路由        TanStack Router (19.7M)   ／替代：React Router (44.2M)
  ├─ 伺服器狀態  TanStack Query (55.8M)    ／替代：SWR (13.5M)
  ├─ client 狀態 Zustand (44.5M)           ／替代：Redux Toolkit (23.4M)、Jotai (4.9M)
  ├─ 表單        react-hook-form (50.5M)
  ├─ 驗證        Zod (224.1M)
  ├─ 樣式        Tailwind CSS (106.0M) + shadcn/ui（copy-in）
  ├─ 表格/虛擬化 TanStack Table (15.9M) / Virtual (18.4M)
  ├─ AI 介面     AI SDK (ai 18.4M) + AI Elements（copy-in）
  │
  └─ 測試        Vitest (77.6M) + Playwright (70.0M)
```

逐層講選擇理由：

**建置：Vite，沒有懸念。** Create React App 已於 2025 年正式棄用，React 官方文件現在只推薦「用框架」或「用 Vite 這類 build tool」兩條路。142.9M 的週下載代表這一層已經沒有選型問題。

**表單 + 驗證：react-hook-form + Zod。** 表單是 client 狀態裡唯一複雜到值得專門工具的一塊：uncontrolled 架構讓輸入不觸發整表重渲染，50.5M 下載是明確的社群共識。Zod 的 224.1M 更誇張——因為它早已越出表單，成為 TypeScript 生態「執行期驗證 + 型別推導」的通用標準：API 回應驗證、環境變數、LLM structured output（AI SDK 的 tool schema 首選就是 Zod，也接受 JSON Schema）全都是它。**Zod schema 是給 agent 的合約**：schema 寫清楚，agent 產出的資料處理程式碼就有了可機器驗證的邊界。TanStack Form（2.3M）走型別優先路線但還年輕，暫時不構成挑戰。

**樣式：Tailwind + shadcn/ui。** Tailwind 106.0M；[shadcn/ui](/posts/tech/2026-03-27-shadcn-ui-component-library) 不是套件而是複製進 repo 的元件原始碼。這對組合對 agent 特別友善，後面判準三會展開。

**表格與虛擬滾動：TanStack Table / Virtual。** headless 設計——只給邏輯（排序、篩選、分頁、虛擬化計算），渲染完全自己來，跟 Tailwind/shadcn 的樣式體系無縫。後台應用遲早會撞到「一萬列的表格」，這兩個是到時候的答案，不用一開始就裝。

**伺服器狀態的替代：SWR。** Vercel 出品、更輕更簡單（13.5M），mutation、樂觀更新、無限捲動它都有（`useSWRMutation`、`useSWRInfinite`），但完整度與周邊（devtools、offline、分頁工具）普遍被認為不如 Query。合理場景是 Next.js 專案順手用；SPA 直接 Query。

**client 狀態的替代：Redux Toolkit 與 Jotai。** RTK 23.4M 主要是存量——既有 Redux 專案的現代化路徑，新專案已少見首選。Jotai（4.9M）是 atom 模型，狀態圖是細粒度依賴網（表單編輯器、畫布類應用）時比 Zustand 的單一 store 更自然；一般後台用不到這個複雜度。

**AI 介面：AI SDK + AI Elements。** 產品要做 AI 對話介面的話，AI SDK（`ai` 套件 18.4M）的 `useChat` 管串流與 message parts，[AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) 提供 Conversation、Reasoning、Sources 等 copy-in 元件。這層跟 shadcn 同一個模式，詳見站內專文。

**測試：Vitest + Playwright。** Vitest（77.6M）原生吃 Vite 設定，單元/元件測試零額外配置；Playwright（70.0M）管 E2E。測試在 agent 工作流裡的地位比從前更高——它是 agent 自我驗證迴圈的最後一環，這也是下一節的主題。

## AI 時代的新判準

以下三個判準是這兩年才變得重要的，而且會越來越重要。

### 一、文件的「agent 可讀性」：llms.txt

llms.txt 是讓 LLM 直接抓取全站文件純文字版的慣例。實測各家（2026-08，HTTP 狀態碼）：

| 文件站 | /llms.txt |
|---|---|
| tanstack.com | ✅ 200 |
| ui.shadcn.com | ✅ 200 |
| zustand.docs.pmnd.rs | ✅ 200 |
| ai-sdk.dev | ✅ 200 |
| nextjs.org | ✅ 200 |
| reactrouter.com | ❌ 404 |

這個表本身就說明了各團隊對 agent 開發流的態度。當你的 agent 需要查一個 API 的正確用法，有 llms.txt 的文件站可以整包餵進 context；沒有的就得靠爬頁面或訓練語料的記憶——後者正是幻覺的來源。

### 二、型別安全 = agent 的護欄

這是 TanStack Router 在 AI 時代被低估的優勢：**agent 寫錯路由、漏帶參數、拼錯 search param，是編譯期錯誤，不是執行期 404**。agent 的自我修正迴圈依賴快速、明確的錯誤訊號——`tsc` 一跑就紅的錯誤，agent 自己就修掉了；要點開瀏覽器才看得到的 404，就得靠人（或昂貴的 E2E 迴圈）去發現。同樣的邏輯貫穿整個 stack：Zod schema 讓資料邊界可驗證、Vitest 讓行為可驗證、Playwright 讓整條使用者路徑可驗證。**選型時每一層都問一句「agent 寫錯這裡，機器抓得到嗎」**，答案是「抓得到」的層越多，agent 產出就越能在提交前收斂，這比「agent 熟不熟這個庫」更根本。

### 三、原始碼在不在你的 repo 裡

shadcn 模式（shadcn/ui、AI Elements）把元件原始碼直接複製進專案，這在 AI 時代多了一層原本沒人預料的好處：**agent 讀得到、改得到**。傳統 npm 套件對 agent 是黑盒子，要客製只能在外面包；複製進來的元件 agent 可以直接 grep、理解、修改。官方也在往這個方向配套：shadcn 有官方 MCP server（`ui.shadcn.com/docs/mcp`）讓 agent 直接瀏覽與安裝 registry 元件，AI Elements 的 repo 裡附了給 coding agent 用的 `SKILL.md`。

### 反向判準：訓練語料存量

要誠實記錄的一個反作用力：**主流 = 訓練語料多 = agent 徒手就會寫**。React Router 44.2M 的存量意味著海量教學文與開源程式碼進了模型訓練集，agent 不查文件也大致寫得對；TanStack Router 年輕、語料少，agent 更容易把 API 寫成舊版或混進 React Router 的慣用法。Zod 224M 對上任何驗證庫的新秀也是同一個故事——**下載量前段班的庫，本身就自帶「agent 開箱即用」屬性**。這個劣勢可以用 llms.txt / MCP / context 餵文件來補，但補救有成本。所以這條判準跟前三條是拉扯的：工作流越成熟（會餵文件、有型別檢查迴圈），越吃得下「冷門但配套好」的紅利；工作流還在徒手 vibe coding 的團隊，選最主流的反而錯得少。

## 整體來說

不做 SSR 的認真 SPA（dashboard、SaaS 後台、內部工具），這套地圖是當代預設：Vite + Query + react-hook-form + Zod + Tailwind 幾乎無懸念；Zustand 痛了再上；Router 看團隊對型別安全的重視程度在 TanStack 與 React Router 之間選；Table/Virtual 撞到大表格再裝。內容導向、SEO 攸關的站去 Next.js 或 Astro；需要 SSR 也有 TanStack Start 這條官方升級路徑，不是死巷。

而 AI 時代的選型心法可以濃縮成一句：**選錯誤能被機器抓到的（強型別）、文件能被機器讀到的（llms.txt / MCP）、原始碼能被機器改到的（copy-in 模式）**——因為寫程式碼的那個「人」，越來越常不是人。

## 參考資料

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- [react-hook-form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [AI SDK](https://ai-sdk.dev/)
- [TanStack llms.txt](https://tanstack.com/llms.txt)
- [shadcn/ui MCP Server](https://ui.shadcn.com/docs/mcp)
- [llms.txt 規範](https://llmstxt.org/)
- [npm 下載量 API（數據來源）](https://api.npmjs.org/downloads/point/last-week/react-router)
- 站內相關：[TanStack Query：Server State 的標準解法](/posts/tech/2026-03-27-tanstack-query-server-state)、[Zustand：React 最輕量的全域狀態管理](/posts/tech/2026-03-27-zustand-state-management)、[shadcn/ui：不是套件，是複製貼上的元件原始碼](/posts/tech/2026-03-27-shadcn-ui-component-library)、[AI Elements：Vercel 把 ChatGPT 式介面拆成可複製的 shadcn 積木](/posts/tech/2026-08-19-vercel-ai-elements)
