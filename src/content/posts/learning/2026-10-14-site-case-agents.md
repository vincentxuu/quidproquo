---
title: "本站的寫作與審查管線：AI 協作個案研究"
date: 2026-10-14
category: learning
type: guide
tags: [series, writing-process, review]
lang: zh-TW
series:
  name: "教學文章怎麼寫"
  order: 29
draft: false
---

## 一篇文章怎麼從草稿走到可發佈

本站的「教學文章怎麼寫」系列同時包含研究整理、寫作建議與網站實例。以這種文章為例，AI 可以協助整理來源、提出結構或翻譯，但稿件能產生出來，離內容可靠還有幾道檢查。

這篇用本站可讀取的規則與程式碼說明這條管線。它不宣稱每篇歷史稿件都已完成全部審查，也不把工具產出的審查文字當作獨立驗證。

## 把寫作、查證與潤稿分開

寫作先定讀者與任務。例如「讀者看完能決定影片放在哪裡」，比「介紹多媒體學習」更容易檢查是否做到。草稿需要把研究觀察與作者建議分清楚：研究比較的是課堂分組，不等於已證明某個部落格版型更有效。

查證時回到原始來源，核對研究對象、比較條件與結果。AI 摘要可以提供線索，卻不能取代論文中的方法與限制。若來源只支持課後測驗，就不要把結論寫成長期記憶提升。

結構審查再問：開頭答應的事，正文有沒有做到？例子能不能讓目標讀者跟上？潤稿處理句子與段落，讓讀者找得到重點。這些工作由不同角色或分次閱讀完成，可以提供不同觀點；仍要檢查每一項意見背後的證據。

## 中英稿要對齊同一個主張

翻譯不只是句子通順。中文版寫「這是在特定課程裡觀察到的結果」，英文版也要保留條件；兩邊的數字、連結與建議範圍都應一致。修改原文後，應同步檢查另一語版本。

可以拿同一段做三項對照：主張是否相同、來源是否相同、限制是否仍在。若中文刪掉一項缺乏證據的保證，英文也要刪掉，不能只更新標題。

## 程式檢查能擋住什麼

本站文章採用 Astro content collections。Astro 支援以 schema 描述文章資料的形狀；本站的 `src/content.config.ts` 定義欄位要求。格式不正確的日期或不符合列舉值的欄位，可能在內容載入時就失敗。

本站的 `scripts/verify.mjs` 是 `pnpm verify` 的入口，包含參考資料、系列順序等檢查；品質工作流程呼叫這個指令。這些規則能找出缺少來源段落、編號衝突等可定義的問題。實際檢查項目以程式碼為準。

例如系列總覽若把資安課程的綱要貼到教學寫作系列，日期與 YAML 即使合法，讀者仍會走錯路。這就需要對照總覽承諾、系列文章與雙語版本，不能只看命令是否成功。

## 通過檢查後還要看什麼

本機檢查、遠端 CI、建置、部署與公開頁面是不同狀態。GitHub Actions 讓工作流程執行檢查或部署，但某個工作成功，只能證明該工作所執行的步驟成功。

對文章而言，最後還應開啟公開頁面，確認正文、語言切換、系列導覽與來源連結符合預期。要宣稱教學有效，則需要另外設計讀者任務或學習評量。格式合規、可公開閱讀與能幫人學會，各有自己的證據。

## 更新紀錄

- 2026-10-15：以可核對的寫作與檢查流程取代工作交接、帳號額度與未證實的完成紀錄；同步中英內容。

## 參考資料

- [Astro：Content collections](https://docs.astro.build/en/guides/content-collections/)：內容集合與 schema 的用途。
- [GitHub：Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)：工作流程、工作與步驟的關係。
- [本站文章 schema](https://github.com/vincentxuu/quidproquo/blob/main/src/content.config.ts)、[品質檢查入口](https://github.com/vincentxuu/quidproquo/blob/main/scripts/verify.mjs)、[品質工作流程](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/quality.yml)：本站實作依據。
- [用 AI 寫教材、當家教，研究測到什麼](/posts/learning/2026-10-14-ai-written-materials-and-ai-tutors)：AI 教材的研究與限制。
