# Research Note 模板

研究完成後存成 `.research/<YYYY-MM-DD>-<slug>.md`，**不是直接發文**。`.research/` 不入版控。

## 完整格式

```markdown
# Research: <題目>

## 子問題
1. ...
2. ...

## 來源清單
- [標題](URL) — 官方 / 一手 / 二手；訪問日：YYYY-MM-DD

## 事實交叉表
| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| ... | ... | ... | ✅ / ⚠️ unverified / ❌ conflict |

## 草稿骨架
（以下段落可直接丟給 `post` skill 的 `tech-deep-dive` 模板）

### 核心概念

### 關鍵設計決定

### 跟替代方案的比較

### 適合 / 不適合的情境

### 限制 / 已知問題

### 取捨總結

## 待解問題
- ...
```

## 子問題拆解範例

題目：研究 LangGraph 1.x 的變動

```text
1. 1.x release note 有哪些 breaking changes？
2. State / Channel / Annotation 模型怎麼變？
3. 跟 0.x 的 migration path 是什麼？
4. 社群實際遷移時踩到什麼坑？
5. 跟 LangChain 主套件的關係怎麼變？
```

## 事實交叉表範例

```markdown
| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| LangGraph 1.0 release date | 官方 blog | GitHub release | ✅ |
| 預設 checkpointer 改 Postgres | 官方文件 | （只此一源） | ⚠️ unverified |
| 移除 `StateGraph.add_edge` | 官方 changelog | HN 討論 | ❌ conflict |
```
