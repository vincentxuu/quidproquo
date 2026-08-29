# Keenable 台灣文章結構測試

Date: 2026-08-29
Target: `src/content/posts/ai/2026-08-29-keenable-agentic-search.md`
Reference: `.agents/skills/post/references/taiwan-voice-structure.md`

## 適用模板

Keenable 是外國工具／新創／API 題材，應用三個模板：

1. iThome／INSIDE／數位時代型：科技事件與產品選型。
2. TechOrange／換日線型：從台灣看國際趨勢。
3. 研之有物型：NEEDLE benchmark 的研究方法轉譯。

## 結果

### iThome／INSIDE／數位時代型：通過

- 誰推出什麼：第 18 行說明 Keenable 是 AI 搜尋基礎設施公司。
- 解什麼問題：第 24-30 行說明 agentic search 和人類搜尋不同。
- 影響誰：第 20 行已改成台灣／繁中 agent 團隊的搜尋供應商選型。
- 核心數字與限制：第 22、38、42-44、76-80 行處理文件數、延遲、價格、rate limit、融資與未公開客戶。
- 市場位置與採用判斷：第 84-94 行明確寫成 provider matrix，不直接替換現有供應商。

評估：結構成立。它已經不是單純公司介紹，而是工具選型文。

### TechOrange／換日線型：部分通過

- 國際事件本身：第 18、22、64-80 行有公司、產品、採用與融資訊號。
- 為何不是單純外國新聞：第 20 行已把問題轉成台灣／繁中 agent 團隊是否需要 provider matrix。
- 台灣讀者位置：第 20、84、92-94 行成立。
- 哪些可借、哪些不能照搬：第 84-90 行有實測流程，第 100-102 行有保留。
- 結尾給本地選擇題：第 102 行仍偏全球總結，可以再強一點。

評估：已達可發布，但結尾可以再補一句「對台灣團隊的實際結論」。

### 研之有物型：局部通過

- 讀者誤解：第 56-62 行打掉「benchmark 開源就等於中立」。
- 研究問題：NEEDLE 被整理成評測類別與方法。
- 方法與結果只保留必要部分：第 58-60 行有 query generation、engine clients、scoring、metrics。
- 限制：第 62 行說明 LLM judge 尚未做 systematic human-agreement audit。
- 接回生活／工作／學習情境：第 62、90 行接回「自己重跑或抽樣審查 artifact」。

評估：NEEDLE 段落成立，但這不是整篇主結構；它只是中段的研究判讀。

## 機械檢查

- `pnpm check:tw src/content/posts/ai/2026-08-29-keenable-agentic-search.md`: 0 blocking, 0 to review.
- `register-scan`: 0 長句；但書密度 6 / 48 段（12%）；4 段數字密度偏高。

數字密度判斷：可接受。這些段落在處理價格、rate limit、融資和 benchmark，屬於選型必要資訊，不為了降低密度刪資料。

## 改寫後結論

新規則有抓到原本缺口：開頭缺台灣／繁中讀者位置。補完後，文章從「英文來源整理」變成「台灣團隊的搜尋 provider 選型判斷」。

後續依結構模板再做一版改寫：

- 標題從「AI Agent 搜尋基礎設施怎麼變」改成「Keenable 該放進台灣 Agent 團隊的搜尋備選嗎？」。
- 開頭先講台灣團隊不會自建 web index，因此問題是 provider matrix，而不是單純介紹 Keenable。
- 「自有 index」「NEEDLE」「採用訊號」三段標題改成判斷句，降低英文文件摘要感。
- NEEDLE 段落補上研之有物型轉譯：評測方法可以借，答案不能直接借；需要補繁中／台灣 query slice。
- 結尾收回本地採用判斷：先放進 matrix、補繁中／台灣 query、測 latency 和 snippet quality，測贏再提高流量。

驗證：

- `pnpm check:tw src/content/posts/ai/2026-08-29-keenable-agentic-search.md`: 0 blocking, 0 to review.
- `register-scan`: 0 長句；但書密度 8 / 53 段（15%）。
- `pnpm verify`: all green.
