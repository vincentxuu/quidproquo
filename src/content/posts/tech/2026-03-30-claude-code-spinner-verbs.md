---
title: "Claude Code Spinner Verbs 完全指南：185 個狀態動詞背後的設計巧思"
date: 2026-03-30
category: tech
tags: [claude-code, ai-tools, cli, customization, spinner, ux]
lang: zh-TW
tldr: "Claude Code 在處理請求時會隨機顯示 185 個狀態動詞，從 Thinking 到 Clauding，分為烹飪、認知、動感、科學、音樂、異想天開等主題類別。v2.1.23 起可透過 settings.json 的 spinnerVerbs 自訂，支援 replace 和 append 兩種模式。"
description: "深入解析 Claude Code 的 spinner verbs 功能——185 個預設狀態動詞的分類、設計意圖、自訂方式，以及完成狀態的烹飪主題彩蛋。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 10
---

## TL;DR

Claude Code 工作時在終端機顯示的「Thinking...」「Brewing...」「Clauding...」不是隨便選的——它有 **185 個預設動詞**，分成烹飪、認知、動感、科學等主題類別。v2.1.23 起可以自訂，用 `spinnerVerbs` 設定替換或擴充。完成時還有烹飪主題的彩蛋（Cooked、Baked、Sautéed）。

---

## 什麼是 Spinner Verbs？

當你在 Claude Code 輸入指令後，終端機會顯示一個旋轉的 `✻` 符號，旁邊跟著一個動詞：

```
✻ Pondering...
✻ Brewing...
✻ Clauding...
```

這些動詞會在處理過程中隨機輪換。完成後，則會顯示帶有烹飪主題的完成訊息：

```
✻ Cooked for 1m 23s
✻ Sautéed for 45s
✻ Baked for 2m 10s
✻ Broiled for 30s
```

看起來是個小細節，但它背後有明確的 UX 設計意圖：**讓等待變得有趣，同時透過動詞的語義暗示處理的複雜度。**

---

## 185 個預設動詞分類

Claude Code 的預設 spinner verbs 可以按主題分成以下幾個大類：

### 烹飪類（Culinary）— 20 個

最具代表性的主題，與完成狀態的烹飪彩蛋呼應：

| 動詞 | 中文 | 隱含語意 |
|------|------|---------|
| Baking | 烘焙中 | 需要時間等待成品 |
| Brewing | 酝酿中 | 思路正在形成 |
| Caramelizing | 焦糖化中 | 轉化中 |
| Cooking | 烹飪中 | 標準處理 |
| Fermenting | 發酵中 | 慢速深度處理 |
| Flambeing | 火焰炙燒中 | 高強度處理 |
| Frosting | 裝飾糖霜中 | 最後修飾階段 |
| Garnishing | 擺盤中 | 輸出優化 |
| Julienning | 切絲中 | 細緻分解處理 |
| Kneading | 揉麵中 | 反覆加工 |
| Leavening | 發酵膨脹中 | 結果正在成形 |
| Marinating | 醃製中 | 暗示較長處理時間 |
| Proofing | 醒麵中 | 等待最佳狀態 |
| Sauteing | 快炒中 | 快速處理 |
| Seasoning | 調味中 | 微調輸出 |
| Simmering | 慢燉中 | 長時間推理 |
| Stewing | 燉煮中 | 多資料來源融合 |
| Tempering | 調溫中 | 精確控制 |
| Whisking | 攪拌中 | 混合多種元素 |
| Zesting | 刨皮中 | 提取精華 |

### 認知思考類（Cerebral）— 8 個

直接對應 AI 的推理過程：

| 動詞 | 中文 | 隱含語意 |
|------|------|---------|
| Cerebrating | 深度思考 | 高層抽象推理 |
| Cogitating | 深思熟慮 | 仔細分析問題 |
| Contemplating | 沉思中 | 分析目標與約束 |
| Deliberating | 權衡中 | 比較多個候選方案 |
| Musing | 冥想中 | 自由聯想 |
| Philosophising | 哲學思考 | 元認知層面 |
| Pondering | 琢磨中 | 深度語義解析 |
| Ruminating | 反覆思考 | 多輪上下文融合 |

### 動感類（Kinetic）— 10 個

把計算過程想像成有趣的肢體動作：

| 動詞 | 中文 |
|------|------|
| Cascading | 傾瀉而下 |
| Frolicking | 嬉戲中 |
| Gallivanting | 遊玩中 |
| Galloping | 飛奔中 |
| Moonwalking | 月球漫步中 |
| Scampering | 蹦跳中 |
| Scurrying | 急匆匆 |
| Shimmying | 搖擺中 |
| Skedaddling | 溜走中 |
| Waddling | 搖搖晃晃走 |

### 異想天開類（Whimsical）— 10 個

純粹為了好玩的詞彙，有些甚至是造字：

| 動詞 | 中文 | 備註 |
|------|------|------|
| Booping | 輕觸中 | 可愛的擬聲詞 |
| Canoodling | 親暱中 | 跟程式碼「調情」 |
| Dilly-dallying | 磨蹭中 | 故意磨時間 |
| Flibbertigibbeting | 胡言亂語中 | 來自《乘風破浪的瑪麗亞》 |
| Lollygagging | 閒晃中 | 悠閒地處理 |
| Razzle-dazzling | 炫技中 | 花式操作 |
| Shenaniganing | 搞怪中 | 調皮搗蛋 |
| Tomfoolering | 耍寶中 | 胡鬧 |
| Topsy-turvying | 顛倒乾坤中 | 打亂重組 |
| Whatchamacalliting | 那個什麼來著 | 故意忘詞的幽默 |

### 科學類（Scientific）— 8 個

用化學和物理隱喻計算過程：

| 動詞 | 中文 | 隱含語意 |
|------|------|---------|
| Crystallizing | 結晶中 | 想法成形 |
| Ionizing | 電離中 | 拆解元素 |
| Nebulizing | 霧化中 | 分散處理 |
| Nucleating | 成核中 | 從核心開始建構 |
| Osmosing | 滲透中 | 資訊滲透融合 |
| Photosynthesizing | 光合作用中 | 轉化能量 |
| Precipitating | 沉澱中 | 結果析出 |
| Sublimating | 昇華中 | 質的飛躍 |

### 音樂類（Musical）— 7 個

把程式設計比喻成演奏：

| 動詞 | 中文 |
|------|------|
| Beboppin' | 即興爵士中 |
| Grooving | 入groove中 |
| Harmonizing | 和聲中 |
| Improvising | 即興演奏中 |
| Jitterbugging | 搖擺舞中 |
| Jiving | 搖擺中 |
| Sock-hopping | 舞會中 |

### 存在主義類（Existential）— 5 個

讓人困惑又好笑的詞：

| 動詞 | 中文 | 備註 |
|------|------|------|
| Discombobulating | 使困惑中 | 反諷——AI 也會困惑 |
| Flummoxing | 茫然中 | 被難倒了 |
| Befuddling | 迷糊中 | 腦袋打結 |
| Combobulating | 整理中 | Discombobulating 的反義造詞 |
| Recombobulating | 重新整理中 | 源自密爾沃基機場的標語 |

### 品牌彩蛋

最特別的一個：**Clauding** — Claude 式處理中。這是唯一一個以產品名命名的動詞，類似 Google 的「Googling」。

### 其他常見動詞

除了上述主題類別，還有大量通用動詞：

- **執行類**：Accomplishing、Actioning、Actualizing、Creating、Crafting、Generating、Processing、Working
- **整合類**：Coalescing、Composing、Synthesizing、Concocting
- **計算類**：Computing、Calculating、Crunching、Inferring
- **探索類**：Spelunking、Wandering、Meandering、Moseying
- **修補類**：Tinkering、Finagling、Wrangling、Puttering
- **神秘類**：Conjuring、Enchanting、Wizarding、Channelling、Divining
- **經典彩蛋**：Reticulating — 致敬《模擬市民》的經典 loading 訊息「Reticulating Splines」

---

## 完成狀態的烹飪主題

Claude Code 完成任務後的訊息統一使用烹飪動詞的過去式：

```
✻ Cooked for 1m 23s     — 煮好了
✻ Sautéed for 45s       — 炒好了
✻ Baked for 2m 10s      — 烤好了
✻ Broiled for 30s       — 烤好了（上火烤）
```

這個設計很妙——**整個互動被框架為「烹飪」的隱喻**：AI 在「烹調」你的請求，完成後「上菜」。跟烹飪類 spinner verbs 形成完整的語義迴圈。

---

## 如何自訂 Spinner Verbs

從 **v2.1.23**（2026 年 1 月 28 日）開始，你可以在 `~/.claude/settings.json` 中自訂 spinner verbs。

### 完全替換預設

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": [
      "Hacking",
      "Shipping",
      "Deploying",
      "Scaling",
      "Refactoring"
    ]
  }
}
```

這會用你的 5 個動詞**完全取代**預設的 185 個。

### 追加到預設

```json
{
  "spinnerVerbs": {
    "mode": "append",
    "verbs": [
      "Bubble-tea-ing",
      "Boba-sipping",
      "Taiwan-numbah-one-ing"
    ]
  }
}
```

你的自訂動詞會**加入**預設的 185 個一起隨機輪換。

### 注意事項

- 動詞應使用**現在分詞形式**（-ing 結尾）
- `mode` 只接受 `"replace"` 或 `"append"`
- 設定層級：`~/.claude/settings.json`（全域）或 `.claude/settings.json`（專案層級）

---

## Spinner Tips 也能自訂

從 **v2.1.45**（2026 年 2 月 17 日）開始，等待時顯示的提示文字也可以自訂：

```json
{
  "spinnerTipsOverride": {
    "tips": [
      "用 /compact 壓縮對話，釋放 context window",
      "先用 plan mode 規劃再動手",
      "Shift+Tab 快速切換權限模式"
    ],
    "excludeDefault": true
  }
}
```

- `tips`：你的自訂提示文字陣列
- `excludeDefault`：設為 `true` 只顯示你的提示，`false` 則混合預設提示

---

## 設計哲學

這些 spinner verbs 不只是裝飾，它們反映了幾個設計原則：

### 1. 降低等待焦慮

研究顯示，有趣的 loading 訊息能讓使用者**感知等待時間更短**。比起無聊的「Processing...」，看到「Moonwalking...」會讓人會心一笑。

### 2. 擬人化但不過度

動詞的選擇在「AI 在思考」和「AI 在搞笑」之間取得平衡。認知類動詞建立專業感，異想天開類動詞建立親切感。

### 3. 彩蛋文化

- **Clauding**：品牌認同感
- **Reticulating**：向遊戲文化致敬（模擬市民的 "Reticulating Splines"）
- **Combobulating / Recombobulating**：語言學遊戲（從 discombobulate 逆向造詞）

### 4. 可自訂 = 個人化

讓使用者自訂 spinner verbs 是個聰明的決定——它把一個純功能性的 loading indicator 變成了**個人表達的空間**。社群已經創造了超過 1,800 個主題動詞包，涵蓋遊戲、科幻、運動、流行文化等 75 個類別。

---

## 社群資源

如果你想探索更多 spinner verbs：

- **Spinner Verbs Dictionary** — 完整的 191 個詞條字典，附 IPA 音標，有免費 PDF 下載
- **Awesome Claude Spinners** — 社群策展的 spinner verbs 主題包
- **1,800+ Spinner Verbs** — 按 75 個主題分類的大型動詞庫

---

## 小結

Claude Code 的 spinner verbs 是個典型的「小功能，大巧思」設計：

1. **185 個預設動詞**涵蓋烹飪、認知、動感、科學、音樂、異想天開等類別
2. **完成狀態**統一使用烹飪隱喻（Cooked / Baked / Sautéed / Broiled）
3. 從 **v2.1.23** 起可透過 `spinnerVerbs` 設定自訂
4. 從 **v2.1.45** 起連 spinner tips 也能自訂
5. 背後的設計哲學：降低等待焦慮、適度擬人化、彩蛋文化、個人化空間

下次看到 Claude Code 顯示「Flibbertigibbeting...」的時候，你就知道——這不是 bug，是 feature。
