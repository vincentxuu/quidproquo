# 證據紀錄：Perplexity Computer 本地模式（2026-10-23）

工具鏈：Groundlane 當時 502／ToolSearch 找不到；firecrawl 額度用完；改用 Exa（search＋fetch 全文）、linkup、WebSearch。

## 一手
- 官方公告（Exa fetch 全文）：https://www.perplexity.ai/hub/blog/perplexity-computer-now-runs-fully-local-on-mac
- 產品頁（Exa fetch 全文）：https://www.perplexity.ai/hub/products/hybrid-compute （36GB/32GB、"Fully local describes where the AI runs. Sending a message or meeting invitation still uses that app's service."）
- Hybrid 公告（Exa 摘錄）：24GB、macOS 15+、三個本地模型

## 二手
- 9to5Mac／MacStories：離線可跑（Perplexity 公告本身沒用 offline）
- AppleInsider／AppDook：Mac 記憶體配置（M6 mini 最高 32GB 等，AppDook 稱查過 Apple 規格頁，未獨立核對）
- tao.media：引用 Perplexity X 串文，本地任務不耗 credits（X 原文未直接讀到）
- Particle：未說明 Full Disk Access 是否需要

## 未解
- PPLX Pro 基底：官方部落格寫 Qwen 3.6；FourWeekMBA 稱 X 貼文寫 Qwen 3.8。文章採官方部落格寫法。
- Personal Computer 發布月份：官方寫 May，AppleInsider 寫 April；文章未寫日期。
- 「不會被拿去微調模型」：來源皆未提及，文章未採用。

## 2026-10-24 補查（Groundlane 恢復後）
- Perplexity X 貼文原文（web_fetch 讀到 meta description，內文被登入牆遮住）：「Local tasks use PPLX Pro, our post-trained version of Qwen 3.8, and don't consume Computer credits.」→ credits 說法確認；Qwen 3.8 與公告的 3.6 不一致，已寫進文章限制段。
- Apple 規格頁（web_fetch 全文）：Mac mini M6 最高 32GB、M5 Pro 48/64GB；Mac Studio M5 Max 起跳 36GB、M5 Ultra 起跳 96GB。→ 記憶體配置已改引 Apple。
- 仍未解：Personal Computer 發布月份（文章未寫日期）；X 串文只讀到兩則 meta description，第三則（36GB）未讀。
