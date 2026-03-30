---
title: "Claude Code Spinner Verbs 完全指南：從原始碼解析 185 個狀態動詞"
date: 2026-03-30
category: tech
tags: [claude-code, ai-tools, cli, customization, spinner, ux]
lang: zh-TW
tldr: "Claude Code 處理請求時會從 185 個預設動詞中隨機選擇顯示，完成時從 8 個烹飪主題動詞中選擇。可透過 settings.json 的 spinnerVerbs 設定自訂，支援 replace 和 append 兩種模式。本文所有資料均來自 Claude Code v2.1.42 原始碼及官方 JSON Schema。"
description: "從 Claude Code v2.1.42 原始碼中提取完整的 185 個 spinner verbs 清單和 8 個完成狀態動詞，並說明 spinnerVerbs 自訂設定的使用方式。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 10
---

## TL;DR

Claude Code 工作時顯示的狀態動詞不是隨便選的——原始碼中硬編碼了 **185 個預設動詞**和 **8 個完成動詞**。可透過 `spinnerVerbs` 設定自訂。本文所有資料直接來自 `@anthropic-ai/claude-code@2.1.42` 的 `cli.js` 原始碼和官方 JSON Schema。

---

## 什麼是 Spinner Verbs？

當你在 Claude Code 輸入指令後，終端機會顯示一個旋轉的 `✻` 符號，旁邊跟著一個動詞：

```
✻ Pondering...
✻ Brewing...
✻ Clauding...
```

這些動詞在處理過程中隨機輪換。完成後會顯示完成動詞加上耗時：

```
✻ Cooked for 1m 23s
✻ Sautéed for 45s
```

---

## 資料來源說明

本文的所有動詞清單和設定格式均來自以下一手來源：

| 資料 | 來源 | 驗證方式 |
|------|------|---------|
| 185 個 spinner verbs | `cli.js` 中的 `Q51` 變數 | `grep -oP` 提取陣列 |
| 8 個完成動詞 | `cli.js` 中的 `cW1` 變數 | 同上 |
| `spinnerVerbs` 設定格式 | `cli.js` 中的 Zod schema 定義 | 原始碼字串比對 |
| `spinnerTipsOverride` 設定 | [JSON Schema Store](https://www.schemastore.org/claude-code-settings.json) | WebFetch 取得 |
| 套件版本 | `@anthropic-ai/claude-code@2.1.42` | `npm list -g` 確認 |

> 注意：動詞的「主題分類」是筆者自行歸類，原始碼中並無分類機制——所有 185 個動詞存放在同一個扁平陣列中，隨機選取顯示。

---

## 完整的 185 個預設動詞

以下是從原始碼中提取的完整清單，按字母排序：

```
Accomplishing    Actioning        Actualizing      Architecting
Baking           Beaming          Beboppin'        Befuddling
Billowing        Blanching        Bloviating       Boogieing
Boondoggling     Booping          Bootstrapping    Brewing
Burrowing        Calculating      Canoodling       Caramelizing
Cascading        Catapulting      Cerebrating      Channeling
Channelling      Choreographing   Churning         Clauding
Coalescing       Cogitating       Combobulating    Composing
Computing        Concocting       Considering      Contemplating
Cooking          Crafting         Creating         Crunching
Crystallizing    Cultivating      Deciphering      Deliberating
Determining      Dilly-dallying   Discombobulating Doing
Doodling         Drizzling        Ebbing           Effecting
Elucidating      Embellishing     Enchanting       Envisioning
Evaporating      Fermenting       Fiddle-faddling  Finagling
Flambéing        Flibbertigibbeting Flowing        Flummoxing
Fluttering       Forging          Forming          Frolicking
Frosting         Gallivanting     Galloping        Garnishing
Generating       Germinating      Gitifying        Grooving
Gusting          Harmonizing      Hashing          Hatching
Herding          Honking          Hullaballooing   Hyperspacing
Ideating         Imagining        Improvising      Incubating
Inferring        Infusing         Ionizing         Jitterbugging
Julienning       Kneading         Leavening        Levitating
Lollygagging     Manifesting      Marinating       Meandering
Metamorphosing   Misting          Moonwalking      Moseying
Mulling          Musing           Mustering        Nebulizing
Nesting          Newspapering     Noodling         Nucleating
Orbiting         Orchestrating    Osmosing         Perambulating
Percolating      Perusing         Philosophising   Photosynthesizing
Pollinating      Pondering        Pontificating    Pouncing
Precipitating    Prestidigitating Processing       Proofing
Propagating      Puttering        Puzzling         Quantumizing
Razzle-dazzling  Razzmatazzing    Recombobulating  Reticulating
Roosting         Ruminating       Sautéing         Scampering
Schlepping       Scurrying        Seasoning        Shenaniganing
Shimmying        Simmering        Skedaddling      Sketching
Slithering       Smooshing        Sock-hopping     Spelunking
Spinning         Sprouting        Stewing          Sublimating
Swirling         Swooping         Symbioting       Synthesizing
Tempering        Thinking         Thundering       Tinkering
Tomfoolering     Topsy-turvying   Transfiguring    Transmuting
Twisting         Undulating       Unfurling        Unravelling
Vibing           Waddling         Wandering        Warping
Whatchamacalliting Whirlpooling   Whirring         Whisking
Wibbling         Working          Wrangling        Zesting
Zigzagging
```

---

## 8 個完成狀態動詞

完成時從以下 8 個動詞中隨機選取，搭配耗時顯示：

| 完成動詞 | 中文 | 顯示範例 |
|----------|------|---------|
| Baked | 烤好了 | `✻ Baked for 45s` |
| Brewed | 沖好了 | `✻ Brewed for 1m 2s` |
| Churned | 攪好了 | `✻ Churned for 30s` |
| Cogitated | 想好了 | `✻ Cogitated for 2m 15s` |
| Cooked | 煮好了 | `✻ Cooked for 1m 23s` |
| Crunched | 算好了 | `✻ Crunched for 55s` |
| Sautéed | 炒好了 | `✻ Sautéed for 38s` |
| Worked | 做好了 | `✻ Worked for 3m 10s` |

> 來源：`cli.js` 中的 `cW1` 陣列
> `cW1=["Baked","Brewed","Churned","Cogitated","Cooked","Crunched","Sautéed","Worked"]`

值得注意的是，8 個完成動詞中有 5 個是烹飪主題（Baked、Brewed、Churned、Cooked、Sautéed），1 個是認知主題（Cogitated），1 個是計算主題（Crunched），1 個是通用（Worked）。

---

## 筆者嘗試歸類（非官方）

原始碼中 185 個動詞存放在同一個陣列，**沒有任何分類標記**。以下分類是筆者根據英文語義自行歸納，僅供參考：

### 烹飪相關 — 約 20 個

Baking、Blanching、Brewing、Caramelizing、Cooking、Drizzling、Fermenting、Flambéing、Frosting、Garnishing、Infusing、Julienning、Kneading、Leavening、Marinating、Proofing、Sautéing、Seasoning、Simmering、Stewing、Tempering、Whisking、Zesting

### 認知思考 — 約 10 個

Cerebrating、Cogitating、Contemplating、Considering、Deciphering、Deliberating、Elucidating、Musing、Philosophising、Pondering、Ruminating

### 自然現象 — 約 15 個

Billowing、Cascading、Drizzling、Ebbing、Evaporating、Flowing、Fluttering、Gusting、Misting、Precipitating、Sprouting、Swirling、Thundering、Undulating、Whirlpooling

### 動物 / 生物 — 約 10 個

Burrowing、Frolicking、Galloping、Hatching、Herding、Pollinating、Pouncing、Roosting、Scampering、Slithering、Swooping、Waddling

### 科學 — 約 8 個

Crystallizing、Ionizing、Nebulizing、Nucleating、Osmosing、Photosynthesizing、Precipitating、Sublimating

### 音樂 / 舞蹈 — 約 7 個

Beboppin'、Boogieing、Grooving、Harmonizing、Improvising、Jitterbugging、Sock-hopping

### 古怪造詞 / 幽默 — 約 15 個

Booping、Canoodling、Combobulating、Dilly-dallying、Discombobulating、Fiddle-faddling、Flibbertigibbeting、Flummoxing、Hullaballooing、Lollygagging、Razzle-dazzling、Razzmatazzing、Recombobulating、Shenaniganing、Tomfoolering、Topsy-turvying、Whatchamacalliting

### 品牌 / 彩蛋

- **Clauding** — 唯一以產品名命名的動詞
- **Gitifying** — Git 相關彩蛋
- **Reticulating** — 遊戲《模擬市民》(The Sims) 經典 loading 畫面 "Reticulating Splines" 的致敬
- **Quantumizing** — 量子運算的幽默化
- **Hyperspacing** — 科幻主題
- **Prestidigitating** — 魔術手法（字面意思：變戲法）
- **Newspapering** — 少見的動詞化名詞

---

## 如何自訂 Spinner Verbs

在 `settings.json` 中使用 `spinnerVerbs` 設定。

原始碼中的處理邏輯（從 `cli.js` 提取）：

```javascript
// 簡化後的邏輯
function getSpinnerVerbs() {
  let config = getSettings().spinnerVerbs;
  if (!config) return DEFAULT_VERBS;              // 沒設定就用預設 185 個
  if (config.mode === "replace")
    return config.verbs.length > 0
      ? config.verbs                               // replace：完全替換
      : DEFAULT_VERBS;                             // 空陣列就退回預設
  return [...DEFAULT_VERBS, ...config.verbs];      // append：合併
}
```

> 來源：`cli.js` 中的 `ZI4` 函數，使用 `Q51`（預設動詞陣列）和 `a4()`（取得設定）

### 完全替換預設

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Hacking", "Shipping", "Deploying"]
  }
}
```

### 追加到預設

```json
{
  "spinnerVerbs": {
    "mode": "append",
    "verbs": ["Bubble-tea-ing", "Boba-sipping"]
  }
}
```

### Schema 定義

從官方 JSON Schema（schemastore.org）確認的結構：

```json
{
  "spinnerVerbs": {
    "type": "object",
    "description": "Customize the verbs shown in spinner progress messages",
    "properties": {
      "mode": {
        "type": "string",
        "enum": ["append", "replace"]
      },
      "verbs": {
        "type": "array",
        "items": { "type": "string", "minLength": 1 },
        "minItems": 1
      }
    },
    "required": ["verbs"]
  }
}
```

> 注意：`mode` 不在 `required` 中。從原始碼邏輯看，省略 `mode` 時預設行為是 `append`（合併）。

設定層級：`~/.claude/settings.json`（全域）或專案目錄下的 `.claude/settings.json`（專案層級）。

---

## Spinner Tips 也能自訂

從 JSON Schema 確認的另一個設定：

```json
{
  "spinnerTipsOverride": {
    "type": "object",
    "description": "Customize the tips displayed in the spinner while Claude is working",
    "properties": {
      "excludeDefault": {
        "type": "boolean",
        "description": "If true, only show custom tips. If false or absent, custom tips merge with built-in tips",
        "default": false
      },
      "tips": {
        "type": "array",
        "items": { "type": "string", "minLength": 1 },
        "minItems": 1
      }
    },
    "required": ["tips"]
  }
}
```

使用範例：

```json
{
  "spinnerTipsOverride": {
    "tips": [
      "用 /compact 壓縮對話，釋放 context window",
      "Shift+Tab 快速切換權限模式"
    ],
    "excludeDefault": true
  }
}
```

---

## 幾個有趣的觀察

以下是基於已確認事實的觀察（非推測）：

1. **烹飪是主線主題**：185 個 spinner verbs 中約 20 個是烹飪相關，8 個完成動詞中 5 個是烹飪相關。烹飪比例在完成動詞中遠高於 spinner verbs。

2. **英式 vs 美式拼法混用**：`Philosophising`（英式）、`Channelling`（英式）和 `Channeling`（美式）同時存在。

3. **自造詞**：`Combobulating`、`Recombobulating`、`Gitifying`、`Quantumizing`、`Symbioting` 等在標準英文字典中並不存在。

4. **最長的動詞**：`Photosynthesizing`（17 個字母）和 `Flibbertigibbeting`（18 個字母）。

5. **唯一的品牌詞**：`Clauding`。

6. **完成動詞和 spinner verb 的重疊**：完成動詞 `Churned` 對應 spinner verb `Churning`、`Cogitated` 對應 `Cogitating`，但完成動詞 `Worked` 對應的 `Working`、`Cooked` 對應的 `Cooking` 等也都存在於 spinner verbs 中。

---

## 小結

| 項目 | 數據 |
|------|------|
| Spinner verbs 數量 | 185 個 |
| 完成動詞數量 | 8 個（Baked, Brewed, Churned, Cogitated, Cooked, Crunched, Sautéed, Worked） |
| 自訂設定 | `spinnerVerbs`（`append` / `replace` 模式） |
| Tips 自訂 | `spinnerTipsOverride`（`excludeDefault` + `tips`） |
| 資料來源 | `@anthropic-ai/claude-code@2.1.42` 原始碼 + 官方 JSON Schema |
