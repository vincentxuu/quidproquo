---
title: "Pagefind 完整介紹：Astro 靜態網站如何做到零後端全文搜尋"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pagefind, astro, search, static-site, blog]
lang: zh-TW
tldr: "Pagefind 在 Astro build 完成後掃描靜態 HTML，把索引與 WebAssembly 搜尋程式一起輸出；瀏覽器只按查詢載入需要的索引切片，因此不必維護搜尋伺服器。"
description: "從 build-time indexing、瀏覽器查詢、篩選與多語系一路拆解 Pagefind，說明 Astro 整合方式、適用情境與零後端搜尋的限制。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-pagefind-static-search-en)

[Pagefind](https://pagefind.app/docs/) 是給靜態網站用的全文搜尋工具。它不在使用者查詢時呼叫搜尋 API，而是在網站 build 完成後掃描產出的 HTML，建立可跟網站一起部署的索引、JavaScript 與 WebAssembly 檔案。搜尋發生在瀏覽器裡，所以 production 不需要另外養 Elasticsearch、Meilisearch 或資料庫查詢端點。

「搜尋發生在瀏覽器」不等於第一次開頁就下載整站內容。Pagefind 把索引拆成切片，等使用者輸入查詢後才載入相關部分；搜尋結果的標題、網址與摘要也能延後逐筆取得。它的核心取捨很明確：把索引更新移到每次部署，把查詢運算移到訪客裝置，換掉常駐搜尋服務。

這使 Pagefind 特別適合 Astro、Hugo、Eleventy 等產出靜態 HTML 的內容站。它不是託管搜尋服務，也不是語意搜尋或 RAG 系統；它處理的是可重建、可隨站部署的關鍵字全文搜尋。以下按資料流拆解：build-time indexing → browser search → filtering/localization → limits。

## Build-time indexing：先有 HTML，才有搜尋索引

Pagefind 通常放在靜態網站產生器之後：

```text
Markdown / CMS
      │
      ▼
 Astro build
      │  dist/**/*.html
      ▼
   Pagefind
      │  dist/pagefind/*
      ▼
 Static host / CDN
```

最小指令只有一行：

```bash
npx pagefind --site dist
```

`--site` 指向完成 build 的目錄。Pagefind 預設尋找其中的 `**/*.html`，解析頁面後把搜尋 bundle 寫進 `pagefind/` 子目錄。這個順序不能反過來：開發伺服器裡只有原始路由時，Pagefind 還沒有最終 HTML 可掃。官方入門文件也要求它在每次 build 後、部署前執行。

在 Astro 裡可以把它掛到 `astro:build:done`：

```js
{
  name: 'pagefind',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { execSync } = await import('child_process');
      execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
    },
  },
}
```

這正是本站目前的 build 設定。Pagefind 會隨 Astro 成品一起產生，但要說清楚使用範圍：本站的 404 頁載入預製 Pagefind UI；主要 `/search` 頁目前走自己的 D1 關鍵字與混合檢索 API。也就是說，這裡有真實整合案例，卻不是「所有站內搜尋都只靠 Pagefind」的假 benchmark。

### 決定哪些內容可以被搜到

依[索引設定文件](https://pagefind.app/docs/indexing/)，Pagefind 預設從 `<body>` 索引，並自動略過 `nav`、`footer`、`script`、`form` 等元素。內容站通常還是應該在文章主體加上 `data-pagefind-body`，避免側欄、導覽文字與每頁重複的頁尾稀釋結果：

```html
<main data-pagefind-body>
  <h1>Pagefind 完整介紹</h1>
  <article>...</article>
</main>
```

一旦網站任何頁面出現 `data-pagefind-body`，沒有這個屬性的頁面就不會進索引。這是很好用、也很容易誤踩的全站開關：不要只替一個 layout 加完就假設其他頁仍會被收錄。局部內容則可用 `data-pagefind-ignore` 排除；程式語言文件若需要搜尋 `<head>`、`$` 等符號，可用 `include_characters` 保留指定字元。

## Browser search：按查詢下載，而不是整包載入

Pagefind 提供現成 UI，也允許直接呼叫 JavaScript API。自訂介面的基本流程是：

```js
const pagefind = await import('/pagefind/pagefind.js');
const search = await pagefind.search('astro');
const firstResult = await search.results[0].data();

console.log(firstResult.url, firstResult.meta.title);
```

`search()` 先回傳結果識別碼與延後載入資料的 `data()` 函式。這個介面揭露了 Pagefind 的頻寬策略：搜尋索引按字母切片，結果內容也不必一次下載。官方 API 文件建議在使用者輸入時呼叫 `preload()`，先下載可能需要的切片，再對真正查詢做 debounce；重複 preload 不會造成重複網路請求。

這跟 Fuse.js 一類「先把完整 JSON 清單交給瀏覽器，再在記憶體比對」的做法不同。它也不同於 Meilisearch 或 Algolia：瀏覽器不必把查詢送到遠端服務。Pagefind 的索引仍由 CDN 提供，但查詢本身不用應用伺服器。對公開、讀多寫少的文件與部落格，這通常是最省維運的落點。

相對地，內容每改一次都要重新 build 與索引。若資料每分鐘變動、搜尋結果受登入身分約束，或必須跨私有資料庫即時查詢，這個資料流就不合適。

## Filtering and localization：把 metadata 一起編進靜態索引

全文搜尋不只是一個文字框。依[篩選設定文件](https://pagefind.app/docs/filtering/)，Pagefind 可從 HTML 的 `data-pagefind-filter` 收集分類、作者或標籤，再由同一個 browser API 查詢：

```html
<meta data-pagefind-filter="category[content]" content="tech">
<span data-pagefind-filter="tag">astro</span>
```

```js
const search = await pagefind.search('search', {
  filters: {
    category: 'tech',
    tag: ['astro', 'blog'],
  },
});
```

每頁可有多個同名 filter 值；`pagefind.filters()` 還會回傳各組合的可用結果數。要做 facet sidebar，第一步不是另外建 API。先在文章 layout 把既有 frontmatter 輸出成這些 HTML attributes，再於 build 後打開 Pagefind playground 檢查值。

[多語系文件](https://pagefind.app/docs/multilingual/)說明 Pagefind 如何沿著 HTML 工作：它讀取 `<html lang>`，為偵測到的語言各建獨立索引；瀏覽器初始化時再依目前頁面的 `lang` 載入相符索引。中文、日文與韓文使用 extended release 的分詞支援，`npx pagefind` 預設就是這個版本。中文可以切分沒有空白的句子，但目前不做 stemming；這表示它能處理連續中文字詞，卻不會像部分語言那樣把不同詞形自動歸到同一字根。

對 Astro 雙語站，必要動作很單純：確認每個 layout 的 `<html lang>` 真的輸出 `zh-TW` 或 `en`，不要只靠 URL 前綴。若網站以 client-side 切換語言而沒有重新載入頁面，則要 `destroy()` 後再 `init()`，讓 Pagefind 重讀目前語言。

## Limits：零後端省掉了什麼，也放棄了什麼

Pagefind 適合「部署時就已經知道內容」的公開網站。它省掉搜尋叢集、同步工作與 production 查詢 API，也讓索引跟網站版本一起發布、一起回滾。但以下情境應該直接考慮別的工具：

- **即時更新**：商品庫存、聊天室或頻繁變動資料不能等下次 build。
- **權限搜尋**：索引檔是公開靜態資產，不該放進只有特定使用者能看的內容。
- **複雜排序與分析**：需要營運後台、查詢分析、同義詞治理或高度客製 relevance 時，託管搜尋與專用引擎較完整。
- **語意意圖**：Pagefind 是詞彙檢索；「那篇談 agent 為什麼會忘記的文章」不一定含使用者輸入的字。這類問題要靠向量或混合檢索補上。
- **純 SSR 資料**：若頁面內容只在請求時產生、build 目錄沒有完整 HTML，Pagefind 沒東西可索引。

還有一個內容品質限制：Pagefind 只會忠實索引你交給它的 HTML。若每頁都混入同一段導覽、cookie banner 或隱藏文字，搜尋結果也會忠實變差。導入後先做三件事：限制 `data-pagefind-body`、排除重複區塊、用實際讀者會輸入的十組查詢驗收。這比先調排名參數更有用。

## 整體來說

Pagefind 的設計不是把伺服器搜尋縮小，而是讓搜尋成為靜態網站的一部分。它在 build 時讀 HTML、部署時發布切片索引、查詢時由瀏覽器按需載入。對 Astro 文件站、作品集與部落格，這套資料流簡單、可攜，也幾乎沒有 production 維運面。

代價同樣來自這個設計。索引的新鮮度跟部署綁定，公開索引不能承載權限資料，關鍵字搜尋也不會自動理解語意。若內容符合「公開、以頁面為單位、更新跟著部署」三個條件，Pagefind 往往比開一套搜尋服務合理。其中任一條不成立，就應先把需求畫清楚，再決定是否改用 Meilisearch、Algolia、資料庫全文搜尋或混合檢索。

## 參考資料

- [Pagefind — Getting Started](https://pagefind.app/docs/)
- [Pagefind — Configuring what content is indexed](https://pagefind.app/docs/indexing/)
- [Pagefind — Using the search API](https://pagefind.app/docs/api/)
- [Pagefind — Setting up filters](https://pagefind.app/docs/filtering/)
- [Pagefind — Multilingual search](https://pagefind.app/docs/multilingual/)
- [Pagefind — CLI configuration options](https://pagefind.app/docs/config-options/)
- [Pagefind GitHub repository](https://github.com/Pagefind/pagefind)
