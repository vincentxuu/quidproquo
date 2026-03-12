---
title: "Cloudflare D1 batch insert 超過 100 筆會 timeout 的解法"
date: 2026-03-12
category: tech
tags: [cloudflare, d1, typescript]
lang: zh-TW
tldr: "D1 batch 單次上限 100 筆，用 chunkArray 分批送"
description: "解決 Cloudflare D1 batch insert 超過 100 筆靜默 timeout 的問題"
draft: false
---

## TL;DR

D1 batch 單次上限 100 筆，用 chunkArray 分批送。

## 情境

在建立 quidproquo 的 build-time sync script 時，需要把多篇文章一次同步到 D1。

## 問題

批次 insert 沒有錯誤訊息，但資料只有前 100 筆寫入，其餘靜默消失。

## 嘗試過程

- 以為是 SQL 語法問題，改用 `db.batch()` — 同樣結果
- 加上 `console.log` 確認資料有送出 — 送出了，但寫入不完全

## 解法

把陣列切成每份 100 筆，分批用 `db.batch()` 送：

```typescript
function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const chunks = chunkArray(statements, 100);
for (const chunk of chunks) {
  await db.batch(chunk);
}
```

## 為什麼會這樣

D1 的 `batch()` 方法有每次請求 100 個 statement 的上限，超過的部分會被丟棄而非報錯。

## 學到的事

D1 batch 有隱性上限，資料量大時一定要分批。
