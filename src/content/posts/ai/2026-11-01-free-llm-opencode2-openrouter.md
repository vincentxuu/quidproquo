---
title: "如何免費使用 LLM：OpenCode 2 內建模型與 OpenRouter 入門教學"
date: 2026-11-01
category: ai
type: guide
tags: [opencode, openrouter, llm, coding-agent]
lang: zh-TW
tldr: "安裝 OpenCode 2 後，先直接選用內建免費模型，完成第一個生活小任務；想換更多模型或在自己的程式呼叫免費 API，再接 OpenRouter。"
description: "從 OpenCode 2 內建免費模型開始，不必先接 OpenRouter；附生活提問範例、OpenRouter 免費模型串接與 API 範例。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-11-01-free-llm-opencode2-openrouter-en)

想用 AI 想晚餐、整理待辦或修改文字，卻還不想訂閱付費方案，可以先裝 **OpenCode 2，直接選它提供的免費模型**。不需要先註冊 OpenRouter，也不用先準備其他供應商的 API key。

OpenCode 2 是能讀檔、改檔、使用工具的 AI coding agent；它除了讓你接外部模型，也提供可以直接在 OpenCode 裡使用的雲端免費模型。這篇先走最短的入門路線，完成一個小任務，再介紹 OpenRouter 這個延伸選項。

## 兩條免費路線，先選最簡單的

| 你想做什麼 | 使用方式 | 要準備什麼 |
|---|---|---|
| 先試日常問答、整理文字 | OpenCode 2 內建免費模型 | 終端機與 OpenCode 2 |
| 在 OpenCode 裡換其他免費模型 | OpenCode 2 接 OpenRouter | 另外建立 OpenRouter API key |
| 在自己的程式裡呼叫免費 LLM | 直接呼叫 OpenRouter API | API key 與 HTTP 工具 |

本文先走第一條。你只需要會開終端機、切換資料夾。不用自己訓練模型，也不需要 GPU。

這裡的「內建」指 OpenCode 已整合的模型服務，推論仍在雲端進行。免費模型適合學習與低用量實驗，可用名單與額度可能調整。

## 第一步：安裝 OpenCode 2

以下使用 **OpenCode 2 的終端機介面**。macOS 或 Linux、已經有 Node.js 與 npm 的讀者，可以用官方 V2 文件中的套件安裝方式：

```bash
npm install --global @opencode/cli
opencode --version
```

確認版本是 `2.x`，再往下做。如果顯示 `1.x`，先檢查終端機實際找到的執行檔：

```bash
which opencode
```

OpenCode 1 與 2 都使用 `opencode` 這個指令名稱。電腦上如果原本裝過第一版，可能會先找到舊的執行檔；不要只看到指令能執行，就以為已經換成第二版。

Windows 請從 [OpenCode 2 官方下載入口](https://opencode.ai/v2/docs)選擇對應架構的獨立 CLI 執行檔。V2 文件目前不支援 Windows 套件管理器安裝，別直接套用第一版教學的安裝指令。

## 第二步：直接選 OpenCode 的免費模型

先建立練習資料夾，再啟動 OpenCode：

```bash
mkdir llm-playground
cd llm-playground
opencode
```

進入終端機介面後，輸入：

```text
/models
```

先不要只憑名稱猜。照下面的順序找：

1. 在 `/models` 搜尋 `big-pickle`，或找 OpenCode 供應商下標示 Free／免費的項目。
2. 開啟 [OpenCode 官方模型表](https://opencode.ai/v2/docs/console/models)，找到同一個名稱，檢查 Pricing 表的 **Input 與 Output 都是 Free**。例如 Big Pickle 的完整 ID 是 `opencode/big-pickle`；名稱沒有 Free 字樣，也可能是免費模型。
3. 回到 `/models` 選擇該項目，確認目前選中的模型名稱，再進行下一節的練習。這條路不必先連接 OpenRouter。

如果選單裡不好找，另開終端機分頁、切到同一個練習資料夾，列出目前可用的 OpenCode 模型：

```bash
opencode models | awk '/^opencode\//'
```

你可能會看到這樣的模型 ID：

```text
opencode/big-pickle
opencode/glm-5.3-flash-free
```

這是輸出格式範例，實際名單以當下結果為準。這條指令只篩選 `opencode/` 供應商，**不會替你檢查價格**；已連接付費帳號時，也可能列出付費項目。把候選 ID 拿去對照官方 Input／Output 價格，再回 `/models` 搜尋名稱並選取。

OpenCode 同時提供付費模型與訂閱方案，選單裡的模型不會全部免費。看清楚你選的是免費項目即可，不需要為這個入門練習先購買 Go 方案或儲值。

如果選單沒有顯示免費模型，先搜尋完整模型 ID、確認版本與服務是否正常。已有自訂設定的電腦，也要檢查是否把免費模型隱藏了：OpenCode 2 的 `OPENCODE_DISABLE_FREE_MODELS` 設為 `1` 或 `true` 時，會隱藏這些選項。

免費使用仍有額度限制，部分模型是限時提供。遇到免費用量已用完，就先停止、稍後再試，或試下文的 OpenRouter 路線；不要把內建免費方案當成無限使用的 API。

## 第三步：問它今晚可以煮什麼

選完模型後，就可以像聊天一樣直接提問。假設你下班回家，不想再出門買菜，可以貼上：

```text
我冰箱有雞蛋、豆腐和高麗菜，家裡有油、鹽、醬油。
幫我想一份兩人吃的晚餐，不要辣，希望 30 分鐘內做好。
請列出菜單和簡單做法，盡量只用這些食材。
```

看看它有沒有照你的條件回答：有沒有突然多出家裡沒有的食材？做法會不會太麻煩？你不用一次就把問題想完整，看到答案後，可以接著說：

```text
今天很累，能不能改成只做一道菜，而且少洗一個鍋子？
```

這就是第一個任務：把生活裡正在煩惱的小事說清楚，再根據回答補上條件。即使用的是 coding agent，也可以先拿它問日常問題；不需要先準備一個程式專案。

同樣的問法也可以拿來整理冰箱採買清單、把一段訊息改得更有禮貌，或拆解週末要做的家事。先問一件你現在真的用得到的事，比為了試工具硬想一個任務容易得多。

## 想換更多免費模型，再接 OpenRouter

內建免費模型已經能讓你練習基本工作流程。如果想試其他供應商的模型，或準備把 LLM 接進自己的程式，再建立 OpenRouter 帳號。OpenRouter 將不同供應商的模型放在同一套 API 後面；它是另一個可選的模型入口。

### 建立 API key

登入 [OpenRouter](https://openrouter.ai/)，進入 [API Keys](https://openrouter.ai/settings/keys) 頁面，建立一把新的 key。可以取名 `opencode-learning`，讓你之後看得出用途。

API key 是讓工具代表你呼叫服務的憑證。接下來直接貼到 OpenCode 的連接介面，不必寫進專案檔案。也不要把它放進 Git、前端網頁或公開截圖。

這個練習只選免費模型，不需要先購買額度來使用付費模型。免費請求仍受帳號與供應商限制；想提高額度時，再另外評估是否值得付費。

### 在 OpenCode 2 連接 OpenRouter

進入終端機介面後，輸入：

```text
/connect
```

選擇 **OpenRouter**，依畫面提示貼上剛才的 API key。完成後再輸入：

```text
/models
```

### 怎麼找出能給 OpenCode 用的免費模型？

先從網站找一個候選，再確認它的完整 ID 與能力：

1. 開啟 [OpenRouter 零輸入價格候選清單](https://openrouter.ai/models?max_price=0)，點進感興趣的模型。這只是縮小範圍，仍要看輸出價格。
2. 確認模型 ID **結尾是 `:free`**，並檢查輸入與輸出價格都是 0。不要把付費版本與同名免費版本混在一起，也不能任意在付費 ID 後加上 `:free`。
3. 查看模型的支援參數或能力，確認有 **tools／tool calling**。工具呼叫就是讓模型請 OpenCode 讀檔、改檔等操作的能力；只會聊天不一定能完成程式任務。
4. 複製完整模型 ID，回到 OpenCode 的 `/models`，在 OpenRouter 模型中搜尋並選擇同一個項目。若找不到，使用下一節的設定方式。

以 `recursive/flint-v1.0:free` 為例，OpenRouter 的 API 使用這個原始 ID；放到 OpenCode 設定時，則是 `openrouter/recursive/flint-v1.0:free`。前面多出的 `openrouter/` 是 OpenCode 的供應商前綴。範例型號日後可能下架，找法與判斷條件仍相同。

#### 用指令直接篩選免費、支援工具的模型

如果網頁不好找，而且電腦已安裝 Python 3，也可以在一般終端機執行下面的程式。它讀取公開模型目錄，不需要 API key，也不會呼叫模型推論：

```bash
python3 - <<'PYCODE'
import json
from decimal import Decimal
from urllib.request import urlopen

url = "https://openrouter.ai/api/v1/models?supported_parameters=tools&q=%3Afree"
with urlopen(url, timeout=30) as response:
    models = json.load(response)["data"]

for model in models:
    price = model.get("pricing", {})
    if (
        model["id"].endswith(":free")
        and Decimal(price.get("prompt", "-1")) == 0
        and Decimal(price.get("completion", "-1")) == 0
        and "tools" in model.get("supported_parameters", [])
    ):
        print(model["id"])
PYCODE
```

它會每行列出一個完整模型 ID。挑一個回 OpenCode 選用；如果結果為空，代表這次目錄裡沒有符合這些條件的候選，先不要自行換成付費版本。目錄支援工具呼叫也不保證每個程式任務都做得好，實際拿來讀檔、改程式時，仍要確認它能正確執行操作。

### OpenRouter 模型沒有出現在選單時怎麼辦？

先確認是在目前的專案裡連接 OpenRouter，再重新開啟 `/models`。OpenCode 2 的模型可用性會受到專案、供應商連接與模型啟用狀態影響；另一個專案選過，不代表這裡也一定可用。

若免費模型確實還在 OpenRouter 目錄，卻不在選單中，可以在練習資料夾建立 `opencode.json`，用 V2 的 `providers` 欄位加入模型。以下是**結構範例**，要先把兩處 `vendor/model-name:free` 換成你選定的完整 ID：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/vendor/model-name:free",
  "providers": {
    "openrouter": {
      "models": {
        "vendor/model-name:free": {}
      }
    }
  }
}
```

`model` 最前面的 `openrouter/` 是 OpenCode 的供應商前綴；後面的 `vendor/model-name:free` 才是 OpenRouter 模型 ID。不要把這個前綴多貼到 OpenRouter API 裡。

加入設定不會讓不支援工具的模型突然具備工具能力，也不會讓已下架的模型恢復。設定完成後，重新開啟 OpenCode，在 `/models` 確認實際選中的模型。原本已開啟的 session 可能保留舊選擇，改預設設定並不會自動切換它。

## 只想試免費 API，不一定要裝 OpenCode

如果你想做的是文字摘要、翻譯或在程式裡接 LLM，可以直接呼叫 OpenRouter。先依上一節建立 OpenRouter API key，再執行下面的例子。OpenCode 官方免費聊天模型要求從 OpenCode 使用，不要把它當成可直接搬到自己產品的免費 API。

最簡單的起點是 `openrouter/free`：它會從目前可用的免費模型中，篩選符合請求能力的候選，再隨機選一個。它適合確認 API 能不能連通；如果要比較模型表現或維持同一個 coding 工作階段，我會選固定的 `:free` 模型。

下面使用 macOS 預設的 zsh，或 Linux 的 Bash。先以隱藏輸入的方式設定 key，避免把真實憑證寫進指令歷史：

```bash
printf '貼上 OpenRouter API key：'
read -rs OPENROUTER_API_KEY
printf '\n'
export OPENROUTER_API_KEY
```

接著送出請求：

```bash
curl --fail-with-body https://openrouter.ai/api/v1/responses \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/free",
    "input": "請用繁體中文，一句話解釋什麼是 API。"
  }'
```

成功時會收到 JSON，回答文字位於 `output` 裡的 message 內容，`model` 欄位則會顯示這次實際使用的模型。每次文字不必完全相同；先確認有正常回答，再把同一種呼叫搬進自己的程式。

## 額度用完、連不上，先看哪裡？

| 狀況 | 先做什麼 |
|---|---|
| OpenRouter 認證失敗或 `401` | 確認貼的是 OpenRouter API key，沒有漏字；必要時重新連接 |
| `429`、請求過於頻繁 | 等待後再試；有 `Retry-After` 時依它等待，不要連續重送 |
| OpenCode 內建免費用量已用完 | 停止重試，依服務提示等待；也可以另接 OpenRouter 免費模型 |
| 免費模型暫時無法服務 | 換另一個仍在目錄、支援工具的免費模型 |
| 模型不存在或 `Model unavailable` | 核對完整 ID、供應商連接與啟用狀態 |
| 聊天有回答，但不會讀檔或修改 | 檢查工具呼叫支援與 OpenCode 的權限提示 |
| `402`、額度相關錯誤 | 查看帳號餘額與 key 的限制；帳號負餘額也可能影響免費模型 |

OpenRouter 免費模型的每分鐘、每日與上游容量限制，請看 [OpenRouter Limits](https://openrouter.ai/docs/api/reference/limits)。換一把同帳號的 key 不會繞過整體限制。

OpenCode 各免費模型的資料使用條款可能不同，例如官方對 Big Pickle 的說明允許用資料改善模型。選模型前可看 [OpenCode Console 模型與隱私說明](https://opencode.ai/v2/docs/console/models)。

另外，雲端免費模型仍會把請求送到服務商。先用不含私人資料的日常問題練習就好；要處理公司程式碼、客戶資料或機密內容，先確認組織規範與供應商資料政策。工具免費與資料能不能上傳，是兩個不同的判斷。

## 接下來拿它做什麼？

從「解釋一個函式」「替小函式補測試」「修正一個有明確預期輸出的錯誤」開始。把範圍說清楚、檢查實際改動，再執行原本的測試。

免費模型能讓你先學會這套工作方式。等你真的碰到穩定性、品質或用量瓶頸，再決定是否付費；不用在第一次試用前，就先把整套訂閱買齊。

想比較其他免費服務，可以接著看[LLM 推論服務免費額度與定價整理](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)；想理解背後的多模型服務，再看 [OpenRouter 路由層介紹](/posts/ai/2026-08-22-openrouter-model-routing)。

## 更新紀錄

- 2026-11-01：第一個任務改成用冰箱現有食材想晚餐，示範日常提問與追加條件，不要求寫程式或建立檔案。
- 2026-11-01：補上免費模型查找步驟、輸入／輸出價格核對、工具呼叫篩選與完整 ID 對照。
- 2026-11-01：以 OpenCode 2 內建免費模型作為入門主線，OpenRouter 改為延伸選項，補上免費模型與外部 API 的使用差異。

## 參考資料

- [OpenCode 2：安裝與入口](https://opencode.ai/v2/docs)
- [OpenCode 2：CLI Commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode 2：Providers](https://opencode.ai/v2/docs/providers/)
- [OpenCode 2：Console 模型、免費項目與隱私](https://opencode.ai/v2/docs/console/models)
- [OpenCode 2：Models](https://opencode.ai/v2/docs/models/)
- [OpenRouter：模型目錄 API 與篩選參數](https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties)
- [OpenRouter：Free Variant](https://openrouter.ai/docs/guides/routing/model-variants/free)
- [OpenRouter：Free Models Router](https://openrouter.ai/docs/guides/routing/routers/free-router)
- [OpenRouter：Quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter：Limits](https://openrouter.ai/docs/api/reference/limits)
- [OpenRouter：Data Collection](https://openrouter.ai/docs/guides/privacy/data-collection)
