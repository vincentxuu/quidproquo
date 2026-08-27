# MaiAgent 三個 repo 的目錄地圖

本機位置：`~/Work/maiagent-django`、`~/Work/maiagent-admin-vue`、`~/Work/maiagent-vue`（另一份 clone 在
`~/Work/maiagent-builder-brain/repositories/`）。主分支都是 `develop`。工作樹常停在 feature 分支，
分析前先 `git -C <repo> log -1 --oneline` 記基準；要看 develop 最新版用 `git show origin/develop:<path>`，不要動別人的工作樹。

## maiagent-django（後端 API）

```
whizchat/
├── chat/           # 聊天核心邏輯
├── chatbots/       # Chatbot 管理
├── dataset/        # 資料集處理
├── knowledge/      # 知識庫管理
├── organizations/  # 組織與權限
├── webchat/        # Web Chat SDK
└── api/            # REST API endpoints
```

| 類型 | 路徑模式 |
|---|---|
| Models | `whizchat/*/models.py` |
| API Views | `whizchat/*/api/*.py` |
| Serializers | `whizchat/*/serializers.py` |
| URL Routes | `whizchat/*/urls.py` |
| Celery tasks | `whizchat/*/tasks.py` |

## maiagent-admin-vue（管理後台）

```
src/
├── views/         # 頁面元件
├── components/    # 共用元件
├── stores/        # Pinia 狀態管理
├── api/           # API 呼叫封裝
├── router/        # Vue Router 設定
└── composables/   # 組合式函數
```

| 類型 | 路徑模式 |
|---|---|
| 頁面 | `src/views/**/*.vue` |
| API 呼叫 | `src/api/*.ts` |
| Store | `src/stores/*.ts` |
| 型別定義 | `src/types/*.ts` |

## maiagent-vue（使用者端 webchat）

```
src/
├── views/
├── components/
└── api/
```

## 定位指令

```bash
grep -rnw "class ModelName" ~/Work/maiagent-django/whizchat/
grep -rnE "def endpoint_name|class \w+ViewSet" ~/Work/maiagent-django/whizchat/
grep -rnw "ComponentName" ~/Work/maiagent-admin-vue/src/
grep -rn "endpoint" ~/Work/maiagent-admin-vue/src/api/
```

## 追資料流

1. 前端 → API：Vue component → `src/api/*.ts`。
2. API → 後端：`urls.py` → ViewSet。
3. 後端 → DB／非同步：ViewSet → Serializer → Model；`tasks.py` 的 Celery 分支另列一條線。

## 速查

| 分析需求 | 先看 |
|---|---|
| 某功能的 API | `maiagent-django/whizchat/*/api/` |
| 前端頁面邏輯 | `maiagent-admin-vue/src/views/` |
| 資料 Model | `maiagent-django/whizchat/*/models.py` |
| 狀態管理 | `maiagent-admin-vue/src/stores/` |
| 權限控制 | `maiagent-django/whizchat/organizations/` |
| WebChat SDK | `maiagent-django/whizchat/webchat/` |
| 資料庫實際內容 | 改用 `maiagent-db-query`（唯讀） |
