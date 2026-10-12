# CS329A Autumn 2025：逐堂材料與交付範圍

查核日期：2026-10-11。目標 offering：[官方 Autumn 2025 課表](https://cs329a.stanford.edu/)。本表區分原課堂次、公開影片 Part 與本站 order；不是全網錄影不存在的證明。

| 原課 session | 主題 | 公開影片／底本 | 本站 order／文章角色 |
|---|---|---|---|
| 1 | Course Overview | [Part 1](https://www.youtube.com/watch?v=6YnLB0XbTnI) | 1，既有總覽承接課程定位 |
| 2 | Test-time Compute Scaling | [Part 2](https://www.youtube.com/watch?v=-Ggc37xLj_Y)＋當堂指定閱讀 | 2，錄影對應概念導讀 |
| 3 | Robust Verification | [Part 3](https://www.youtube.com/watch?v=p7TdPUcPoik)＋當堂指定閱讀 | 3，錄影對應概念導讀 |
| 4 | Learning from feedback with tools/code | [Part 4](https://www.youtube.com/watch?v=Lxh9RF5S-K0)＋當堂指定閱讀 | 4，錄影對應概念導讀 |
| 5 | Multi-step Reasoning/Planning | [Part 5](https://www.youtube.com/watch?v=Ml_fp9XkB8Y)＋當堂指定閱讀 | 5，錄影對應概念導讀 |
| 6 | Train Time Scaling/Scaling RL | [Part 6](https://www.youtube.com/watch?v=yVnmHSAy3ck)＋當堂指定閱讀 | 6，錄影對應概念導讀 |
| 7 | Open-Ended Evolution | 指定閱讀；公開錄影未確認 | 7，paper-based 閱讀導讀 |
| 8 | Search & Deep Research Agents | [Part 7](https://www.youtube.com/watch?v=Uni9dqyuuDM)＋當堂指定閱讀 | 8，錄影對應概念導讀 |
| 9 | Melvin Johnson guest | 可歸屬該場材料未取得 | 等待；不寫推測稿 |
| 10–12 | Midterm presentations | 學生專案報告 | 不當成三堂通用概念課 |
| 13 | Software Engineering | 指定閱讀；公開錄影未確認 | 9，paper-based 閱讀導讀 |
| 14 | Memory / Junchen Jiang | 指定閱讀；公開錄影未確認 | 10，paper-based 閱讀導讀 |
| 15 | Denny Zhou guest | 可歸屬該場材料未取得 | 等待；不混 Winter 2025 |
| 16 | Thang Luong guest | 可歸屬該場材料未取得 | 等待；不混 Winter 2025 |
| 17 | Evaluations & Long-Horizon Tasks | [Part 8](https://www.youtube.com/watch?v=8JAqLnTaZu4)＋當堂指定閱讀 | 11，錄影對應概念導讀 |
| 18 | Misha Laskin guest | 可歸屬該場材料未取得 | 等待；不混 Winter 2025 |
| 19 | Danny Driess guest | 可歸屬該場材料未取得 | 等待；不混 Winter 2025 |
| 20 | Future Research Areas | [Part 9](https://www.youtube.com/watch?v=AyO6wyu4DEg) | 12，錄影對應概念導讀 |

## 來源判定

九支影片皆確認公開頁標題與主題。Parts 1–6、8、9 的官方影片描述有授課日期，可直接與課表匹配。Part 7 以 Deep Research/Search 的獨特主題及字幕內容對到 session 8，未取得描述中的精確授課日期；不能把頁面上傳日期當作授課日期。

Groundlane `web_fetch` 取得官網與影片頁。Firecrawl provider 回 `PROVIDER_UNAVAILABLE`；Groundlane `web_content` 的 `you` provider 取得 Parts 1–6、8、9 字幕文字且回報 `truncated: false`。Part 7 遇到 malformed response／HTTP 500，改以 Exa MCP 取得文字，這一支不列為 Groundlane 字幕成功證據。字幕人工／自動生成類型未核實，沒有時間碼；來源服務未截斷不等於完成原音回聽。

來源原文與工具 JSON 存 `/tmp/cs329a-research/`；範圍卡、教學審稿與驗證記錄存隔離工作區 `.work/cs329a/`。原音回聽、同步字幕片段及播放器重播尚未驗收，文章不承諾完成 shadowing 或頁內全文逐字稿。

## 修正的判定錯誤

2026-08-21 的 inventory 把 material identity conflict 簡化為「無 recordings」，擴寫計畫遂把全部 17 場列為 blocked。此次以原課 session mapping 取代整課判定；一篇既有總覽加十一篇新導讀，共十二組中英文，覆蓋十二個有可用材料的內容場次。剩餘五場客座保留來源缺口。

第 7 堂另有原始來源衝突：官方列出的 *Automated design of agentic systems* 連結指向 [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954)，真正的 [ADAS](https://arxiv.org/abs/2408.08435) 是不同論文。閱讀導讀說明實際讀取底本，不把兩篇視為同一篇。

## 驗收邊界

文章標題、身份與 order 可由機械檢查驗證；課程映射與教學機制以原始來源核對；例子與練習需獨立語意審稿。`pnpm verify`、提交、推送、部署與正式站讀回是不同狀態。本機內容已可審閱；提交與推送依使用者後續授權執行，正式站是否上線另依 CI／部署及讀回證據判定。
