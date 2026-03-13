---
title: "對話即文件：用 Claude Code 把 Debug 過程直接變成文章"
date: 2026-03-13
category: tech
tags: [claude-code, workflow, documentation]
lang: zh-TW
tldr: "Debug 完直接說「把錯誤寫成文章」，Claude Code 會從對話裡萃取內容，套用模板、生成 frontmatter、commit 到 repo。不需要額外寫任何東西。"
description: "一個把技術文件摩擦力降到零的工作流：用 Claude Code 的 post skill，在 debug session 結束後直接把過程轉成結構化文章。"
draft: false
---

每次解完一個問題，我都知道應該記下來。但大多數時候不會，因為要重新整理思緒、打開編輯器、想標題、寫 frontmatter，光是這些就夠讓人放棄了。

這幾天在用 Claude Code 做部落格改版，遇到兩個問題、解完之後，我就直接說：

> 把錯誤寫成文章

然後兩篇文章就出現在 repo 裡了。

## 為什麼有效

傳統的技術文件流程是這樣：

```
解決問題 → 事後回憶 → 重新整理 → 寫文章
```

摩擦力在「事後回憶」和「重新整理」這兩步。問題解完你已經累了，要再回頭把思路整理成文字，很難發生。

換成這個流程：

```
解決問題（對話中）→ 說「寫成文章」→ 文章出現
```

對話本身就是素材。Claude Code 在整個 debug 過程中都在場，它知道你遇到什麼錯誤、試了什麼方法、最後怎麼解的、根本原因是什麼。不需要重新解釋，那些資訊已經在對話裡了。

## 實際怎麼運作

`post` skill 定義了幾個模板，針對不同類型的內容有不同結構。對於技術踩坑，模板是：

```
情境 → 問題 → 嘗試過程 → 解法 → 為什麼會這樣 → 學到的事
```

說「把錯誤寫成文章」，Claude 會：

1. 從對話裡萃取對應的內容填入這個結構
2. 判斷 category 和 tags
3. 產生完整的 frontmatter
4. 把檔案存到正確路徑（`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`）
5. commit 進 repo

整個過程不需要我做任何事，除了確認草稿。

![Claude Code 從對話萃取內容，產出完整文章草稿](/images/posts/2026-03-13/claude-code-post-skill.png)

![commit 完成，兩個檔案進了 repo](/images/posts/2026-03-13/claude-code-commit.png)

## 今天的例子

今天改版過程遇到兩個問題：

**Astro scoped CSS 不套用到 MDX 內容**：Copy 按鈕跑到 nav 旁邊，prose 樣式全部沒生效。根本原因是 Astro scope hash 機制，`<Content />` 渲染的 HTML 沒有 hash，所以 selector 永遠 match 不到。

**Cloudflare Workers 打包 native module 失敗**：`@resvg/resvg-js` 是 `.node` binary，即使 route 有 `prerender = true`，Rollup 還是會嘗試解析它，然後炸掉。

兩個問題解決後，我說「兩個錯誤分開寫兩篇文章」，幾分鐘後兩篇都進了 repo。

![文章出現在首頁](/images/posts/2026-03-13/blog-posts-live.png)

## 什麼時候用

不是每件事都值得寫文章，但這幾種情況特別適合：

- 花了超過 30 分鐘才解開的問題
- 踩到設計上不直覺的地方（像 Astro scoped CSS）
- 試了幾個方向最後才找到對的解法

這些情況下，對話本身就已經是一篇好文章的素材了。說一句話，讓它成為文章。
