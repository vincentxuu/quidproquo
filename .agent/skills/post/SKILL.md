---
name: post
description: Convert a conversation, notes, or experience into a structured post for quidproquo.cc
---

# post skill

把任何內容（解決問題的過程、攀岩心得、電影感想、咖啡筆記...）轉換成結構化的文章，存到 `src/content/posts/<category>/`。

## 觸發方式與模板對應

| 使用者說 | 模板 |
|---------|------|
| 「寫成文章」、「記錄一下」、「write post」 | `templates/tech-post.md`（踩坑/問題解決） |
| 「寫成介紹文」、「寫成深入介紹」、「deep dive」 | `templates/tech-deep-dive.md`（工具/技術/架構介紹） |
| 其他分類（climbing、film、life...） | `templates/general-post.md` |

## 支援的分類

`tech` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `ai` / `product` / `marketing` / `travel` / `design` / `education` / `policy` / `anime` / `career`

## 執行步驟

1. **判斷分類**：根據內容選擇最適合的 category
2. **選擇模板**：依觸發方式對應上表，不猜測
3. **收集資訊**：從對話或筆記提取關鍵內容
4. **產生檔案**：
   - 遵守 `references/writing-guide.md`
   - 欄位說明見 `references/frontmatter-schema.md`
   - 檔名：`YYYY-MM-DD-<slug>.md`（slug 用英文 kebab-case）
   - 存到 `src/content/posts/<category>/`
   - 如果文章引用工具、框架、官方文件、論文、版本資訊、數據比較或外部說法，文末必須補 `## 參考資料`
   - `tech` / `ai` / `learning` / `education` / `policy` / `design` / `marketing` / `product` 類，預設要附參考資料
5. **請使用者 review**：展示草稿，詢問是否修改
6. **確認後執行**：
   ```bash
   git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md
   git commit -m "post(<category>): <title summary>"
   ```
