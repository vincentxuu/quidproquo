# 抽取紀錄：Pinecone docs — Filter by metadata

read_status=full（curl 取 HTML → 取 <main> → pandoc plain，從標題讀到頁尾）

## 書目

- Pinecone Docs，"Filter by metadata"，https://docs.pinecone.io/guides/search/filter-by-metadata
- HTML 內 dateModified 2026-10-20；範例 API 版本 X-Pinecone-Api-Version: 2026-07。讀取日 2026-10-22。
- 全文檔：scratchpad/fulltext/o15-pinecone-filter-by-metadata.md（442 行，16,705 bytes）。已讀 1–442 全部。

## 可引用內容

1. 每筆紀錄的組成（行 17）："Every record in an index must contain an ID and a dense or sparse vector. In addition, you can include metadata key-value pairs … When you search the index, you can then include a metadata filter to limit the search to records matching the filter expression."——Pinecone 的 metadata 掛在**每筆紀錄（通常是 chunk）**上，和 OpenAI 掛在檔案上不同。
2. 運算子（行 350–363）：$eq、$ne（數字、字串、布林）；$gt、$gte、$lt、$lte **只支援 Number**（範例都是 year）；$in、$nin（字串、數字）；$exists；$and、$or、$not。
3. 上限（行 367）：每個 $in／$nin 最多 10,000 個值。
4. 清單型欄位（行 369–389）：`{"genre": ["comedy","documentary"]}` 表示同時具有兩個值；`$and` 要求 comedy 且 drama 就不會命中。→ 「適用範圍可以多值」的寫法。
5. text-match 過濾（行 405–430）：$match_phrase、$match_all、$match_any，用在有 full_text_search 設定的欄位，"narrow the candidate set before scoring, the same way metadata operators do"（行 407）。

## 沒寫的事

- 本頁沒有過濾對召回或延遲的影響數字；「Metadata filter limits」連到別頁，本次未讀。

## 對 order 15 的用法

- 補 OpenAI／Bedrock 之外第三家的同一個事實：數值比較只吃數字，日期與年份要存成數字。
- 多值欄位（行 369–389）可用來示範「一份文件適用多個地區／方案」。
