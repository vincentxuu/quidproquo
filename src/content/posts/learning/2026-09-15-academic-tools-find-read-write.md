---
title: "論文工作流三件套：Google Scholar 找、Moonlight 讀、CorTeX 寫"
date: 2026-09-15
category: learning
type: guide
tags: [academic-research, paper-reading, paper-writing, ai-tools, google-scholar, moonlight, cortex, latex]
lang: zh-TW
tldr: "把論文工作流拆成三個動作——找、讀、寫，各推薦一個工具：Google Scholar 搜論文、Moonlight AI 讀論文、CorTeX 協作寫論文。三個工具免費就能用，合在一起覆蓋從文獻探索到投稿的完整流程。"
description: "用 Google Scholar、Moonlight、CorTeX 三個工具串起論文的找、讀、寫流程。介紹各工具的核心功能、適用場景與上手方式。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-09-15-academic-tools-find-read-write-en)

做研究的日常可以壓縮成三個動作：找到論文、讀懂論文、寫出論文。每個動作都有工具可以幫忙，但工具太多反而不知道從哪裡開始。

這篇整理三個工具，各負責一個動作，串成一條從搜尋到投稿的流程。

---

## 找論文：Google Scholar

[Google Scholar](https://scholar.google.com/) 是 Google 的學術搜尋引擎，索引範圍涵蓋期刊論文、會議論文、預印本、學位論文、書籍章節和專利。

### 為什麼它仍然是第一站

- **覆蓋率最廣**：跨出版商、跨學科，一次搜到 Springer、IEEE、ACM、arXiv、PubMed 等來源
- **引用追蹤**：每篇論文底下顯示被引用次數，點進去就能看到誰引了它，往回追文獻脈絡很快
- **「被引用」加上「相關文章」**：這兩個連結是滾雪球式文獻搜尋的核心——從一篇種子論文出發，幾輪就能摸到一個主題的邊界
- **作者 Profile**：可以追蹤特定研究者的發表與 h-index
- **提醒功能**：針對關鍵字或作者設定 email 通知，有新論文就寄信

### 小技巧

| 語法 | 作用 | 範例 |
|---|---|---|
| `"..."` | 精確搜尋 | `"chain of thought"` |
| `author:` | 指定作者 | `author:"Yann LeCun"` |
| `intitle:` | 標題包含 | `intitle:transformer` |
| 左側年份滑桿 | 限定發表年份 | 只看 2024 以後 |

**連結**：[Google Scholar](https://scholar.google.com/)

---

## 讀論文：Moonlight

[Moonlight](https://www.themoonlight.io/tw) 是韓國 Corca 團隊開發的 AI 論文閱讀器，定位是你的「AI 研究夥伴」。它不只是 PDF viewer——你可以一邊讀一邊跟 AI 對話，遇到看不懂的段落、公式或圖表，圈起來就有解釋。

### 核心功能

- **即時解釋**：選取任何句子、段落或數學公式，AI 會根據上下文產生解釋，不是丟給通用 ChatGPT，而是在論文語境裡回答
- **圖表解讀**：點擊圖片，AI 會摘要圖表的重點、解釋趨勢和結論
- **自動高亮**：Moonlight 自動偵測並標記論文中的方法、結果、新貢獻等關鍵段落，讓你快速抓到骨架
- **論文內對話**：可以針對整篇論文問問題，例如「這篇的 baseline 跟前一篇差在哪？」
- **翻譯**：選取文字或整頁翻譯，對非英文母語的研究者特別有用
- **引用卡片**：點擊引用編號就能預覽被引論文的摘要，不用跳出去查
- **文獻收藏**：收藏後元資料自動解析保存，方便管理讀過的論文

### 平台

| 平台 | 連結 |
|---|---|
| 網頁版 | [themoonlight.io](https://www.themoonlight.io/tw) |
| iOS | [App Store](https://apps.apple.com/tw/app/moonlight-ai-pdf-reader/id6738034562) |
| Android | [Google Play](https://play.google.com/store/apps/details?id=com.corca.moonlight) |
| Chrome 擴充套件 | [Chrome Web Store](https://chromewebstore.google.com/detail/moonlight-ai-colleague-fo/lhipdkibljepmfojllcfflfflhflcbgi) |

核心功能免費。進階 AI 模型和無限使用需要升級 Pro 或 Premium 方案。

---

## 寫論文：CorTeX

[CorTeX](https://cortex.corca.ai/) 同樣出自 Corca 團隊，是一個支援 Markdown 和 LaTeX 的協作式學術寫作平台。

### 核心功能

- **Markdown + LaTeX 混寫**：用 Markdown 寫正文、LaTeX 寫公式，即時預覽排版結果，不需要本地安裝 TeX Live
- **即時協作**：多人同時編輯同一份稿件，適合跨實驗室合作
- **模板庫**：內建學術期刊與會議的投稿模板，省去排版設定的時間
- **即時預覽**：寫的同時看到最終排版，降低「編譯→查看→修改」的來回成本

### 跟 Overleaf 的差別

Overleaf 是純 LaTeX 生態，CorTeX 額外支援 Markdown，進入門檻更低。如果你的團隊有人不熟 LaTeX，CorTeX 的 Markdown 模式讓他們也能直接參與寫作，不用先學一套排版語言。

**連結**：[CorTeX](https://cortex.corca.ai/)

---

## 三個工具怎麼串

```
Google Scholar          Moonlight              CorTeX
  搜尋 → 找到論文 PDF → 閱讀 + AI 輔助理解 → 動筆寫作 + 協作
         ↑                    │                     │
         └── 引用追蹤 ←───── 引用卡片 ──────→ 插入引用 ─┘
```

1. **在 Google Scholar 搜尋**，用引用追蹤和相關文章找到核心文獻
2. **把 PDF 丟進 Moonlight 讀**，用 AI 解釋加速理解，自動高亮抓重點，讀完收藏
3. **在 CorTeX 開始寫稿**，用模板排版、Markdown 起草、LaTeX 插公式，多人協作到完稿

三個工具各有免費方案，不用花錢就能跑完整條流程。

---

## 總結

| 動作 | 工具 | 一句話 |
|---|---|---|
| 找 | Google Scholar | 覆蓋最廣的學術搜尋，引用追蹤是殺手功能 |
| 讀 | Moonlight | AI 即時解釋公式、圖表和段落，讀論文不再硬啃 |
| 寫 | CorTeX | Markdown + LaTeX 協作寫作，模板一鍵套用 |

工具只是工具，重點還是你讀了什麼、想了什麼、寫了什麼。但好的工具能把摩擦力降到最低，讓你把時間花在真正重要的地方。

---

## 參考資料

- [Google Scholar](https://scholar.google.com/)——官方學術搜尋首頁
- [Moonlight（themoonlight.io）](https://www.themoonlight.io/tw)——AI 論文閱讀器官網
- [Moonlight iOS App](https://apps.apple.com/tw/app/moonlight-ai-pdf-reader/id6738034562)
- [Moonlight Chrome 擴充套件](https://chromewebstore.google.com/detail/moonlight-ai-colleague-fo/lhipdkibljepmfojllcfflfflhflcbgi)
- [CorTeX](https://cortex.corca.ai/)——Corca 團隊的協作學術寫作平台官網
