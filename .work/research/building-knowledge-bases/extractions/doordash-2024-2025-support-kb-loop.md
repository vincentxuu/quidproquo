# 抽取紀錄：DoorDash Engineering — Dasher 客服 RAG 的監控與知識庫回流（2024、2025 兩篇）

read_status=full（兩篇全文，從標題讀到作者介紹）

## 書目

1. Zhe Jia、Shuai Wang、Aditi Bamba、Martin Wang，"Path to high-quality LLM-based Dasher support automation"，DoorDash Engineering Blog，2024-09-17。https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/
2. Tony Luo、Zhe Jia、Gisselle Xie，"A scalable LLM approach to enhancing chatbot knowledge with user-generated content"，2025-08-18。https://careersatdoordash.com/blog/doordash-llm-chatbot-knowledge-with-ugc/
- 讀取：curl 直連拿到 284 KB 空殼（內容由 JS 載入）；r.jina.ai 第一次回 Cloudflare 驗證頁，第二次成功。全文檔（scratchpad/fulltext/）：o19-doordash2024-dasher-support.md（217 行、17,070 bytes）、o19-doordash2025-ugc-kb.md（163 行、12,204 bytes），兩檔全讀；2024 篇另用 Exa web_fetch 交叉核對內容一致。

## 性質

- 企業工程部落格，自述經驗；數字無方法細節、無信賴區間、未獨立驗證。

## 可引用內容（行號：A＝2024 檔，B＝2025 檔）

1. 模型自身知識是風險來源（A 49）："These discrepancies often stem from outdated or incorrect DoorDash-related information included during the LLM's training phase. Because LLMs typically draw from publicly available text, including discussions on platforms such as Quora, Reddit, and Twitter, there is a heightened risk of propagating erroneous information."
2. 線上 guardrail：先做回答與 KB 段落的語意相似度淺檢，沒過再交 LLM 評審看 groundedness、連貫、合規；自述「hallucinations 減少 90%、嚴重合規問題減少 99%」（A 90）。
3. 粗指標不能指導改進（A 94）："We can evaluate the LLM's quality from multiple perspectives, including Dasher feedback, human engagement rate, and delivery speed. None of these perspectives, however, provide actionable feedback"；於是人工讀了數千份對話，歸成五類：retrieval correctness、response accuracy、grammar/language、coherence、relevance。
4. 人工校準（A 104）："a dedicated human team that reviews random subset transcript samples. A continuous calibration between this human review and the automated system ensures effective coverage."
5. 回流到知識庫（A 114–116）："LLM Judge's quality evaluation has allowed us to conduct thorough reviews and KB updates to eliminate misleading terminology."
6. 回歸測試（A 135）：Promptfoo 測試組在 prompt 變更時自動跑，失敗就擋；新發現的問題加進測試組。
7. 從轉人工的對話找知識缺口（B 38）："selecting only those conversations that were escalated to a live agent so that we can zero in on the cases where our chatbot fell short"；依頻率與嚴重度排序。分群門檻 cosine 0.70–0.90，要人工看前 K 群確認（B 44）。
8. 人工審稿佇列（B 68–73）：內容專員與營運夥伴審 LLM 草稿；"every correction is logged and fed back into our future iteration."
9. 成效（B 90）：A/B 測試中，高流量的轉人工訊息群，轉人工率由對照組 78% 降到實驗組 43%；實驗組約 75% 的 KB 檢索只用到新產生的 UGC 文章。

## 沒寫的事

- 沒說 LLM 評審與人工的一致率；沒說樣本量。
- 「90%／99%」沒有基準定義。
- 沒有「文件 owner」這個角色名稱；回流對象是內容專員與營運夥伴（B 68），2024 篇說要做 KB 管理入口（A 116）。

## 對 order 19 的用法

- 「上線後失敗案例回流到文件 owner」的企業實務：用轉人工（escalation）當失敗訊號 → 分群排序 → 草稿 → 人審 → 上線 → A/B 量轉人工率。order 19 可簡化成「每週撈轉人工／按讚踩的對話 → 標失敗類型 → 缺文件的交給該文件 owner」。
- 自我檢查的旁證：模型自身知識在私有領域常常是過時的公開說法（A 49）。
- 「LLM 評審要人工校準」：A 104。
- 數字要標「DoorDash 自述」。
