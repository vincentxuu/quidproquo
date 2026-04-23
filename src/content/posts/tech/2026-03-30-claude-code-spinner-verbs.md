---
title: "Claude Code Spinner Verbs：從原始碼挖出 185 個狀態動詞的完整清單"
date: 2026-03-30
type: guide
category: tech
tags: [claude-code, ai-tools, cli, customization, spinner, ux]
lang: zh-TW
tldr: "Claude Code 處理請求時會從 185 個預設動詞中隨機顯示（如 Thinking、Brewing、Clauding），完成時從 8 個動詞中選一個搭配耗時。可透過 settings.json 的 spinnerVerbs 設定自訂，支援 replace 和 append 兩種模式。本文所有資料來自 cli.js 原始碼實際驗證。"
description: "從 Claude Code v2.1.42 原始碼中提取完整的 185 個 spinner verbs 清單和 8 個完成動詞，說明 spinnerVerbs 自訂設定方式，並附上筆者的非官方分類嘗試。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 10
---

用 Claude Code 的時候，輸入指令後終端機會出現一個旋轉的 `✻`，旁邊跟一個動詞——有時是正經的 `Thinking...`，有時是莫名其妙的 `Flibbertigibbeting...`。這些動詞到底有幾個？怎麼選的？能不能換？直接去翻原始碼最快。

## 資料來源

本文所有動詞清單和設定格式來自以下一手來源，不含未經驗證的二手資訊：

| 資料 | 來源 | 位置 |
|------|------|------|
| 185 個 spinner verbs | `cli.js` 中的 `Q51` 變數 | `@anthropic-ai/claude-code@2.1.42` |
| 8 個完成動詞 | `cli.js` 中的 `cW1` 變數 | 同上 |
| `spinnerVerbs` 設定邏輯 | `cli.js` 中的 `ZI4` 函數 + Zod schema | 同上 |
| `spinnerTipsOverride` 設定 | 官方 JSON Schema | `schemastore.org/claude-code-settings.json` |

> 後面的「筆者歸類」段落是我自己按語義分的，原始碼裡沒有任何分類機制。

---

## Spinner Verbs 是什麼

Claude Code 處理請求時，終端會輪流顯示這些動詞：

```
✻ Pondering...
✻ Brewing...
✻ Clauding...
```

完成後換成過去式，加上耗時：

```
✻ Cooked for 1m 23s
✻ Sautéed for 45s
```

機制很單純：從一個陣列隨機挑，沒有根據任務類型或處理階段對應不同動詞。

---

## 完整 185 個預設動詞

從 `cli.js` 中的 `Q51` 陣列提取，按字母排序：

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

## 8 個完成動詞

完成時從 `cW1` 陣列隨機選一個，搭配耗時顯示：

```javascript
cW1 = ["Baked","Brewed","Churned","Cogitated","Cooked","Crunched","Sautéed","Worked"]
```

| 完成動詞 | 顯示範例 |
|----------|---------|
| Baked | `✻ Baked for 45s` |
| Brewed | `✻ Brewed for 1m 2s` |
| Churned | `✻ Churned for 30s` |
| Cogitated | `✻ Cogitated for 2m 15s` |
| Cooked | `✻ Cooked for 1m 23s` |
| Crunched | `✻ Crunched for 55s` |
| Sautéed | `✻ Sautéed for 38s` |
| Worked | `✻ Worked for 3m 10s` |

8 個裡面有 5 個是烹飪主題（Baked、Brewed、Churned、Cooked、Sautéed），這不是推測——就是字面意思。

---

## 筆者嘗試歸類（非官方）

原始碼中 185 個動詞放在同一個扁平陣列，隨機選取，**沒有分類標記**。以下是我按英文語義自己歸的，僅供理解用。

### 烹飪（~20 個）

Baking、Blanching、Brewing、Caramelizing、Cooking、Drizzling、Fermenting、Flambéing、Frosting、Garnishing、Infusing、Julienning、Kneading、Leavening、Marinating、Proofing、Sautéing、Seasoning、Simmering、Stewing、Tempering、Whisking、Zesting

跟完成動詞的烹飪主題呼應——整個 spinner 可以理解為「AI 在煮你的需求，煮好了上菜」。

### 認知思考（~10 個）

Cerebrating、Cogitating、Considering、Contemplating、Deciphering、Deliberating、Elucidating、Musing、Philosophising、Pondering、Ruminating

這批最「正經」，直接在說 AI 在想事情。

### 自然現象（~15 個）

Billowing、Cascading、Ebbing、Evaporating、Flowing、Fluttering、Gusting、Misting、Precipitating、Sprouting、Swirling、Thundering、Undulating、Whirlpooling

用自然界的物理過程類比計算。

### 動物行為（~10 個）

Burrowing、Frolicking、Galloping、Hatching、Herding、Pollinating、Pouncing、Roosting、Scampering、Slithering、Swooping、Waddling

### 科學（~8 個）

Crystallizing、Ionizing、Nebulizing、Nucleating、Osmosing、Photosynthesizing、Sublimating、Symbioting

### 音樂 / 舞蹈（~7 個）

Beboppin'、Boogieing、Grooving、Harmonizing、Improvising、Jitterbugging、Sock-hopping

### 古怪造詞和幽默（~15 個）

Booping、Canoodling、Combobulating、Dilly-dallying、Discombobulating、Fiddle-faddling、Flibbertigibbeting、Flummoxing、Hullaballooing、Lollygagging、Razzle-dazzling、Razzmatazzing、Recombobulating、Shenaniganing、Tomfoolering、Topsy-turvying、Whatchamacalliting

其中 `Combobulating` 和 `Recombobulating` 是從 `Discombobulate` 逆向造出來的詞，標準英文字典裡不存在。`Recombobulating` 有個來歷：密爾沃基機場在安檢後設了一個 "Recombobulation Area" 的標誌，讓旅客「重新組裝自己」。

### 彩蛋

- **Clauding** — 唯一用產品名造的動詞
- **Gitifying** — 致敬開發者日常
- **Reticulating** — 經典遊戲《模擬市民》(The Sims) 的 loading 畫面彩蛋 "Reticulating Splines"
- **Prestidigitating** — 魔術手法，意思是變戲法
- **Newspapering** — 把名詞硬變成動詞的幽默

---

## 自訂 Spinner Verbs

在 `settings.json` 中設定 `spinnerVerbs`。以下是原始碼中的實際處理邏輯（`ZI4` 函數，簡化後）：

```javascript
function getSpinnerVerbs() {
  const config = getSettings().spinnerVerbs;
  if (!config) return DEFAULT_VERBS;              // 沒設定 → 用預設 185 個
  if (config.mode === "replace")
    return config.verbs.length > 0
      ? config.verbs                               // replace → 完全替換
      : DEFAULT_VERBS;                             // 空陣列 → 退回預設
  return [...DEFAULT_VERBS, ...config.verbs];      // append → 合併
}
```

### 完全替換

只顯示你指定的動詞：

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Hacking", "Shipping", "Deploying", "Scaling"]
  }
}
```

### 追加到預設

你的動詞加進 185 個裡一起隨機：

```json
{
  "spinnerVerbs": {
    "mode": "append",
    "verbs": ["Bubble-tea-ing", "Boba-sipping"]
  }
}
```

### Schema 定義

從官方 JSON Schema（schemastore.org）確認：

```json
{
  "spinnerVerbs": {
    "type": "object",
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

`mode` 不在 `required` 中——從原始碼看，省略 `mode` 時走 `append` 邏輯。

設定位置：`~/.claude/settings.json`（全域）或 `.claude/settings.json`（專案層級）。

---

## Spinner Tips 自訂

除了動詞，等待時顯示的提示文字也能改。從 JSON Schema 確認的結構：

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

`excludeDefault` 設 `true` 只顯示你的提示，`false` 或省略則跟預設混合。

---

## 幾個有趣的事實

從原始碼觀察到的，不是推測：

1. **英式 vs 美式拼法混用**：`Philosophising`（英式）和 `Channelling`（英式）跟 `Channeling`（美式）同時存在。

2. **最長的動詞**：`Flibbertigibbeting`（18 字母）和 `Photosynthesizing`（17 字母）。

3. **自造詞不少**：`Combobulating`、`Recombobulating`、`Gitifying`、`Quantumizing`、`Symbioting` 都不是標準英文。

4. **完成動詞跟 spinner verb 有對應**：`Churned ↔ Churning`、`Cogitated ↔ Cogitating`、`Cooked ↔ Cooking`、`Crunched ↔ Crunching`——但不是每個完成動詞都有對應的 spinner verb（例如 `Baked` 對應的 `Baking` 有，`Brewed` 對應的 `Brewing` 也有）。

5. **烹飪是隱藏主線**：spinner verbs 裡約 20 個烹飪相關，完成動詞 8 個中 5 個是烹飪。比例從 11% 跳到 63%。

---

## 整體來說

Spinner verbs 是個純裝飾功能，不影響任何實際行為。但它是 Claude Code CLI 品牌個性的一部分——跟其他 AI coding assistant 的差異化不只在能力，也在這些小細節上。

如果你覺得預設的 185 個不夠，用 `append` 加幾個自己的。如果你覺得 `Flibbertigibbeting` 太鬧，用 `replace` 換成你喜歡的。設定檔改完立即生效，不用重啟。

## 參考資料

- [Claude Code 官方文件：功能總覽與 spinner 設定](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Claude Code GitHub 原始碼（cli.js 的 spinner verbs 來源）](https://github.com/anthropics/claude-code)
- [Anthropic 官方部落格：Claude Code 發布公告](https://www.anthropic.com/news/claude-code)
- [npm - @anthropic-ai/claude-code（spinner verbs 自訂設定文件）](https://www.npmjs.com/package/@anthropic-ai/claude-code)
