# Research: Harvard AI／ML 課程地圖

## 子問題

1. CS50 AI、CS1810、CS1820 在 2025–2026 是否實際開課？
2. CS50 AI 畫面上的 2026 課程、錄影與作業是否同一版本？
3. 匿名讀者能取得哪些影片、講義、作業、starter、解答與評分工具？
4. Harvard CS 的正式數學／程式地基如何接到 AI、ML、RL 與 vision？

## 來源清單

- [CS50 AI OpenCourseWare](https://cs50.harvard.edu/ai/) — 官方；訪問日：2026-08-22
- [CSCI S-80 Summer 2026](https://cs50.harvard.edu/summer/ai/2026/) — 官方；訪問日：2026-08-22
- [CSCI S-80 Summer 2026 Lectures](https://cs50.harvard.edu/summer/ai/2026/lectures/) — 官方；訪問日：2026-08-22
- [CSCI S-80 Summer 2026 Projects](https://cs50.harvard.edu/summer/ai/2026/projects/) — 官方；訪問日：2026-08-22
- [CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html) — 官方課程 repo；訪問日：2026-08-22
- [CS1810 Spring 2026 homework repo](https://github.com/harvard-ml-courses/cs181-s26-homeworks) — 官方課程 repo；訪問日：2026-08-22
- [Harvard CS course listing](https://seas.harvard.edu/computer-science/courses) — 官方；訪問日：2026-08-22
- [Harvard CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/) — 官方；訪問日：2026-08-22
- [Harvard CS course tags](https://csadvising.seas.harvard.edu/concentration/courses/tags/) — 官方；訪問日：2026-08-22
- [CS1820 Fall 2022 archive](https://procaccia.info/courses/CS182-F22/) — 官方教師站；訪問日：2026-08-22

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| CS50 AI OCW | ✅ 首頁、七週索引、Project 0 與 Degrees 規格 | 無 |
| CSCI S-80 Summer 2026 | ✅ syllabus、lectures、projects、Lecture 0、Project 0 與 Degrees 規格 | 無 |
| CS1810 Spring 2026 | ✅ syllabus、公開 repo 與 homework tree | Google Sheet schedule 由 JS／Google 權限呈現，但不影響本文版本判斷 |
| Harvard CS listing／requirements／tags | ✅ 全頁 | 無 |
| CS1820 Fall 2026 catalog | ✅ catalog 描述與開課資料 | 2026-09-02 才開課，當期教材尚未形成完整學期 |
| CS1820 Fall 2022 archive | 🟡 課程索引與多份 notes／sections | 歷史教師站沒有完整當期影片鏈 |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| CS50 AI Summer 2026 是正式 Harvard Summer School CSCI S-80 | 2026 course home | 2026 syllabus | ✅ |
| Summer 2026 Lecture 0 使用 2020 Spring 錄影資產 | Lecture 0 HTML 的 CDN URL | 同頁 transcript／slides URL | ✅ |
| Summer 2026 Degrees 使用 2020 Spring distribution | Summer Degrees specification | CDN URL | ✅ |
| OCW Degrees 使用 2023 distribution、2024 check50 slug | OCW Degrees specification | 頁內 download／check50 指令 | ✅ |
| CS1810 Spring 2026 的作業公開，但授課本身全為實體 | Spring 2026 syllabus | s26-homeworks repo | ✅ |
| CS1820 下一個已公告班次是 Fall 2026 | Harvard SEAS listing | my.harvard catalog | ✅ |
| Harvard CS 地基包含程式、線代、機率與 formal reasoning | concentration requirements | advising pages | ✅ |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| CS50 AI 可判 A3，但 canonical edition 應寫成「OCW rolling edition」，不能稱 2026 完整新版 | 七週錄影、notes、projects 可匿名使用；底層年份混合 | 後續 OCW 可能無聲更新其中一部分資產 |
| CS1810 Spring 2026 可判 A3（教材／作業路線），但不是完整影音公開課 | syllabus、homework、notes、sections 公開；官方明寫 all learning in-person | 若校方日後公開錄影，需重判 recordings 欄 |
| CS1820 Fall 2026 目前只能判 A1；Fall 2022 archive 可列歷史 A2 | 當期只有 catalog／課站預覽；歷史站有 notes／sections | Fall 2026 完課後可能升級 |

## 草稿骨架

### 核心概念

Harvard 沒有一條由 CS50 AI 直接接到所有 AI 分支的公開 MOOC 主幹。校外可執行路線應分成：CS50 AI 實作入口、CS1810 數學 ML 主幹、CS1820 classical AI 補線，再接 RL／vision。

### 關鍵設計決定

每門課拆成 offering、lecture assets、assignment assets、feedback 四層，不用單一「公開」標籤。

### 限制

CS50 AI 混合 2020、2023、2024 與 rolling OCW；CS1810 無當期公開錄影；CS1820 Fall 2026 尚未開課。

## 待解問題

- Fall 2026 CS1820 完課後重查影片、作業與 code。
- CS1870 下一個實際開課學期確認後再補 NLP 當期欄。

