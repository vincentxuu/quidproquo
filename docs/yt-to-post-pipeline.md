# YouTube → Blog Post Pipeline 規劃

## 目標

輸入一個 YouTube URL，自動產出符合 quidproquo 格式、Ernest Chiang 風格的文章草稿，存到 `src/content/posts/`。

## 參考來源

- 風格參考：[Ernest Chiang 部落格](https://www.ernestchiang.com/zh/posts/)
- NotebookLM 工具：[notebooklm-py 非官方 API](https://quidproquo.cc/posts/ai/2026-04-05-notebooklm-py-unofficial-api/)

---

## 流程

```
YouTube URL
  │
  ▼
notebooklm-py
  ├─ 建立 Notebook
  ├─ 加入 YouTube 來源（自動抓字幕）
  └─ 問結構化問題 → 取得 JSON 回應
  │
  ▼
組裝模板（Python）
  ├─ 填入 frontmatter
  ├─ 產生 ✳️ / ⌬ 段落結構
  └─ 產生 Mermaid 知識圖譜
  │
  ▼
輸出 .md 草稿
  └─ src/content/posts/ai/YYYY-MM-DD-{slug}.md
```

---

## Ernest 風格拆解

Ernest 每篇文章的固定結構：

```
1. 封面圖 + 個人故事說明文字        ← 人工補充
2. ## ✳️ 文章標題
3. 引言段落（介紹來源、主講者）
4. ⌬ 核心論點一
   - 重點 bullet（含引用）
   - 個人觀點連結                  ← 人工補充
5. ⌬ 核心論點二
6. ⌬ 核心論點三
7. 結語段落
8. ## ✳️ 延伸閱讀（YouTube embed + 相關文章）
9. ## ✳️ 知識圖譜（Mermaid flowchart）
```

---

## quidproquo Frontmatter 格式

```yaml
---
title: "文章標題"
date: YYYY-MM-DD
category: ai          # ai / tech / product / life
tags: [tag1, tag2]
lang: zh-TW
tldr: "一句話摘要"
description: "SEO 描述，說明文章涵蓋的核心內容"
draft: true           # 草稿，人工審閱後改 false
---
```

---

## NotebookLM 問法（Prompts）

### Prompt 1：引言
```
用一到兩段話介紹這個影片：主講者是誰、背景為何、Lenny/主持人問了什麼核心問題。
```

### Prompt 2：三個核心論點（結構化）
```
列出這段影片最重要的 3 個論點。
每個論點回傳：
- title: 論點標題（10 字以內）
- bullets: 3-5 個重點（含原文引用，標記哪句最重要）
- key_quote: 最值得引用的原話
回傳 JSON 格式。
```

### Prompt 3：知識圖譜關係
```
列出影片中所有重要概念，以及它們之間的關係。
回傳 Mermaid flowchart 格式，節點不超過 10 個。
```

### Prompt 4：延伸閱讀關鍵字
```
這部影片的核心概念，適合搜尋哪些關鍵字找延伸資料？列 5 個。
```

---

## 輸出模板

```markdown
---
title: "{title}"
date: {date}
category: ai
tags: {tags}
lang: zh-TW
tldr: "{tldr}"
description: "{description}"
draft: true
---

{intro}

## ✳️ {title}

{lead_paragraph}

**⌬ {point_1_title}**

{point_1_bullets}

**⌬ {point_2_title}**

{point_2_bullets}

**⌬ {point_3_title}**

{point_3_bullets}

{closing}

---

## ✳️ 延伸閱讀

<iframe
  src="https://www.youtube.com/embed/{video_id}"
  title="{title}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  style="width:100%;aspect-ratio:16/9;border:0"
></iframe>

---

## ✳️ 知識圖譜

```mermaid
{mermaid_graph}
```
```

---

## 人工補充清單（草稿產出後）

- [ ] 封面圖（個人照片 or 相關圖）
- [ ] 封面圖說明文字（個人故事連結）
- [ ] 個人觀點段落（「這讓我想到...」）
- [ ] 連結到自己過去相關文章
- [ ] 審閱 Mermaid 圖是否正確
- [ ] 改 `draft: false` 後發布

---

## 實作步驟

### Phase 1：MVP 腳本
- [ ] `scripts/yt_to_post.py`
- 輸入：YouTube URL
- 使用 `notebooklm-py` 建 notebook、加來源、跑 4 個 prompts
- 組裝模板輸出 `.md` 草稿

### Phase 2：可選增強
- [ ] 加 Claude API 做最後潤稿（讓語氣更像 Ernest）
- [ ] 自動偵測 category（ai / tech / product）
- [ ] 批次處理多個 URL

---

## 依賴

```
notebooklm-py[browser]
playwright（已包含在上述）
python-slugify
```

## 腳本位置

```
scripts/
  yt_to_post.py        ← 主腳本
  templates/
    post_template.md   ← 文章模板
```
