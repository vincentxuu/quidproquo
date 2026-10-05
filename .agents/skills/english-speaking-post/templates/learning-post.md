# 文章與證據模板

模板是起點；按使用者卡點調整，不把所有欄位原封不動塞進文章。

```yaml
---
title: "<中文需求＋關鍵說法>"
date: YYYY-MM-DD
category: learning
type: guide
tags: [english-speaking]
lang: zh-TW
description: "<具體情境與能學到什麼>"
tldr: "<核心差異，避免沒有證據的唯一／最常用判斷>"
draft: true
---
```

英文 sibling 保留日期、tags、draft 等 metadata，lang 為 en。用目前可用的站內路由互連。

## 我當時想說什麼

原始中文；對話對象與動作。如果有多種意思，分支寫出。

## 在這個情境可以怎麼說

參考英文與意思；來源支持的部分附連結。依來源句型自行改寫時簡短交代。

## 也可以這樣說嗎

| 英文 | 對誰／做什麼時用 | 是否仍是同一個意思 |
| --- | --- | --- |

不要用「錯」取代意義差異。沒有根據的常見度比較刪掉或保留待查。

## 換內容再說一次

保持句型，換自己會遇到的地點／物品／工作問題。先給中文提示，再給參考英文；不要讓練習只變成閱讀答案。

## 一段短對話

讓參考說法出現在有目的的對話；自寫對話標為練習示例。

## 不看英文，你會怎麼說

中文情境 → 試說 → 參考說法／也可用 → 差異提醒。自評含義是是否能表達意思，不是字串比對。

## 參考資料

- [來源標題](來源的具體頁面)：支持哪些差異。

## evidence.md（工作紀錄，不放研究流水帳到文章）

| 主張／卡片 ID | URL與段落 | 核對日期 | 支持範圍 | 直接示例／改寫／待查 | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |

## practice-cards.json（尚未整合時存工作目錄）

每卡包含：id、scenario（travel/surf/climbing/work/daily/interview）、context、zh、en、alternatives（text＋usage）、usageNote、swap、articlePath、sources（url＋supports＋evidenceType＋contextEvidenceType）。

來源支持句型的卡需 evidenceType=adapted；原文直接示例需 direct；pending 不加入正式練習。此為交付草稿契約，不要求修改 content schema。
