---
title: "Cloudflare Hyperdrive 怎麼用：讓 Workers 接上既有 Postgres / MySQL"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-hyperdrive, database, postgres, mysql, serverless]
lang: zh-TW
tldr: "Hyperdrive 解的是 Workers 連到既有 Postgres / MySQL 的延遲與連線池問題。它用 edge connection setup、靠近資料庫的 connection pool、read query cache，讓單區資料庫比較適合被全球 Workers 存取。"
description: "從 Cloudflare Hyperdrive 的定位、Postgres/MySQL 連線、Workers binding、connection pooling、query caching、read-after-write、limits、pricing 與 observability，拆解它適合放在 Edge Platform 的哪一層。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 10
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-hyperdrive-existing-database-en)

把 API 搬到 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 後，資料庫通常是第一個卡住的地方。你可能已經有一顆 [Postgres](https://www.postgresql.org/) 或 [MySQL](https://www.mysql.com/) 跑在 AWS、GCP、Azure、Neon、Supabase、PlanetScale、RDS、Aurora。應用程式可以跑在全球邊緣，資料庫卻仍在某個 region。

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) 解的是這個縫隙：Workers 這種 serverless runtime 從世界各地連到既有資料庫時，連線建立太慢、連線數太多、熱門 read query 重複打回 origin。它不要求你把資料搬到 D1，也不要求你改掉 ORM。它提供一個 Workers binding，讓你用原本的 driver 連到 Hyperdrive，再由 Hyperdrive 管 connection pool 和可快取的 read query。

這篇放在 Cloudflare Edge Platform 的 D1、Durable Objects、Queues、Workflows 後面，因為它處理的是很常見的遷移題：「我不想重寫資料層，但想把 app runtime 搬到 Cloudflare。」

## Hyperdrive 的位置

Hyperdrive 最適合接在「Workers app」和「既有關聯式資料庫」中間。

```txt
Browser / API client
        |
        v
Cloudflare Worker
        |
        v
Hyperdrive binding
        |
        +--> connection setup near Worker
        +--> connection pool near database
        +--> optional read query cache
        |
        v
Existing Postgres / MySQL
```

官方文件把 Hyperdrive 描述成讓既有區域資料庫「像全球分散式資料庫一樣被存取」。這句要小心讀。資料仍然在原本的資料庫；transaction、schema、write path、backup、replication、migration 都還是你的資料庫負責。Hyperdrive 幫你處理的是 Workers 連過去的網路與連線層。

它和其他 Cloudflare data services 的分工可以這樣看：

| 需求 | 服務 |
|---|---|
| 新專案需要 SQLite 關聯式資料庫 | [D1](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database) |
| 既有 Postgres / MySQL 要給 Workers 存取 | Hyperdrive |
| 每個 entity 需要強一致狀態、鎖、WebSocket | [Durable Objects](/posts/tech/2026-08-22-cloudflare-durable-objects) |
| 慢工作或批次處理 | [Queues](/posts/tech/2026-08-22-cloudflare-queues) |
| 多步驟長流程 | [Workflows](/posts/tech/2026-08-30-cloudflare-workflows-durable-steps) |

如果你還沒選資料庫，而且資料模型適合 SQLite，D1 比較簡單。如果資料已經在 Postgres/MySQL，或團隊已經有 Prisma、Drizzle、Kysely、node-postgres 這套工具，Hyperdrive 通常是遷移成本比較低的入口。

## 它怎麼讓單區資料庫變快

Workers 是分散在全球的 runtime。傳統資料庫通常在單一 region，而且連線建立很貴。Cloudflare 的 getting started 文件把這個成本拆得很直：真的送出 SQL 之前，TCP、TLS、資料庫 authentication 可能已經消耗多個 round trips。

Hyperdrive 用三件事處理這個問題：

- **Edge connection setup**：Worker 先和附近的 Hyperdrive 建立連線，少掉從使用者所在地一路連到資料庫 region 的握手成本。
- **Connection pooling**：Hyperdrive 在靠近 origin database 的區域維持連線池，盡量重用既有 database connections。
- **Query caching**：對可快取的 read-only query，Hyperdrive 可以直接回 cached response，減少 origin database load。

這代表兩個設計結論。

第一，如果 request 只打一個 query，Worker 靠近使用者通常仍然合理；Hyperdrive 已經處理連線建立和 pool。第二，如果一個 request 會連續打多個 uncached query，Cloudflare 文件建議考慮 [Placement](https://developers.cloudflare.com/workers/configuration/placement/)，把 Worker 放近資料庫 region，避免每個 SQL round trip 都跨半個地球。

```jsonc
{
  "placement": {
    "region": "aws:us-east-1"
  }
}
```

這不是每個 Worker 都要設定。它適合資料庫互動密集、而且 query 無法靠 cache 吃掉的 request path。

## 建立 Hyperdrive configuration

Hyperdrive 目前支援 Postgres、MySQL，以及相容協定的資料庫。官方支援表列出 PostgreSQL 9.0 到 17.x、MySQL 5.7 到 8.x，也列出 Aurora、Neon、Supabase、Timescale、Materialize、CockroachDB、PlanetScale、MariaDB 等相容服務。SQL Server 和 MongoDB 目前不支援。

建立時給它資料庫 connection string：

```sh
npx wrangler hyperdrive create app-prod-db \
  --connection-string="postgres://user:password@database.example.com:5432/app"
```

或 MySQL：

```sh
npx wrangler hyperdrive create app-prod-db \
  --connection-string="mysql://user:password@database.example.com:3306/app"
```

成功後 wrangler 會回傳 Hyperdrive config id，放進 `wrangler.jsonc`：

```jsonc
{
  "compatibility_date": "2026-08-30",
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<your-hyperdrive-id>"
    }
  ]
}
```

如果你的 Worker compatibility date 在 2026-08-04 以前，資料庫 driver 需要 `nodejs_compat` flag；2026-08-04 以後的 Workers/Pages 專案，Cloudflare 文件寫明 Node.js compatibility v1/v2 預設啟用，不需要再用這些 flags 打開。舊專案可以保留既有設定，不必為了更新日期硬刪。

本機開發可以加 `localConnectionString`：

```jsonc
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<your-hyperdrive-id>",
      "localConnectionString": "postgres://local:local@127.0.0.1:5432/app"
    }
  ]
}
```

正式 connection string 不該進 repo。用 wrangler 建 config 時把 secret 交給 Cloudflare，Worker 裡只拿 binding。

## Workers 裡怎麼用

Postgres 範例用 `pg` 很直覺：

```ts
import { Client } from "pg";

export default {
  async fetch(request, env): Promise<Response> {
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString,
    });

    try {
      await client.connect();
      const result = await client.query(
        "SELECT id, title FROM posts WHERE published = $1 ORDER BY created_at DESC LIMIT 20",
        [true],
      );

      return Response.json({ posts: result.rows });
    } finally {
      await client.end();
    }
  },
} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
```

看起來像每個 request 都 new client，這在一般 Node server 會讓人緊張。但 Hyperdrive 文件特別說，可以每次建立 client，因為底層 database connection pool 由 Hyperdrive 維持。

MySQL 則可以用 `mysql2/promise`，並把 Hyperdrive binding 拆成 host/user/password/database/port：

```ts
import { createConnection } from "mysql2/promise";

export default {
  async fetch(request, env): Promise<Response> {
    const connection = await createConnection({
      host: env.HYPERDRIVE.host,
      user: env.HYPERDRIVE.user,
      password: env.HYPERDRIVE.password,
      database: env.HYPERDRIVE.database,
      port: env.HYPERDRIVE.port,
      disableEval: true,
    });

    try {
      const [rows] = await connection.query(
        "SELECT id, title FROM posts WHERE published = ? ORDER BY created_at DESC LIMIT 20",
        [true],
      );
      return Response.json({ posts: rows });
    } finally {
      await connection.end();
    }
  },
} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
```

`disableEval: true` 是 Workers runtime 的現實限制：`mysql2` 不能用 eval-based parser。

## Query caching：好用，但要知道哪裡不能用

Hyperdrive 預設開啟 query caching。預設 `max_age` 是 60 秒，`stale_while_revalidate` 是 15 秒，`max_age` 最高可以設到 1 小時。

它會解析 database protocol，判斷 query 是 mutating 還是 non-mutating。`SELECT` 這類 read-only query 有機會被 cache；`INSERT`、`UPDATE`、`DELETE`、`CREATE` 不會。Postgres 的 `NOW()`、`CURRENT_TIMESTAMP`、`RANDOM()`、`LASTVAL()` 這類 stable/volatile function 也不會被 cache。文件建議把這種時間值移到應用程式，當參數傳進 SQL。

```sql
-- 比較容易 cache：時間由 app 算好後當參數傳入
SELECT * FROM events WHERE created_at > $1 ORDER BY created_at DESC LIMIT 50;
```

最大警告是 read-after-write。Hyperdrive 不會在你的 app 寫入資料庫時自動清掉相關 read cache。也就是說，剛寫完一筆資料，下一個一模一樣的 `SELECT` 仍可能在 `max_age` 內拿到舊結果。

我的預設切法是兩組 Hyperdrive configuration：

```sh
npx wrangler hyperdrive create app-prod-cached \
  --connection-string="<DATABASE_CONNECTION_STRING>"

npx wrangler hyperdrive create app-prod-fresh \
  --connection-string="<DATABASE_CONNECTION_STRING>" \
  --caching-disabled
```

Wrangler 綁兩個 binding：

```jsonc
{
  "hyperdrive": [
    {
      "binding": "DB_CACHED",
      "id": "<cached-config-id>"
    },
    {
      "binding": "DB_FRESH",
      "id": "<cache-disabled-config-id>"
    }
  ]
}
```

用法很簡單：

- 公開內容、商品目錄、排行榜、dashboard summary：走 `DB_CACHED`。
- auth、session、permission、billing、admin settings、寫入後立刻讀：走 `DB_FRESH`。

這樣比全域關掉 cache 更務實。你仍然保留熱門 read 的加速，也不會把一致性需求藏在某個 SQL comment 或 application convention 裡。

## Connection pooling 的幾個坑

Hyperdrive 的 pool 是 transaction mode。query 或 transaction 結束後，connection 會回到 pool，並做 reset。這帶來幾個實務影響：

- 不要假設 connection-level `SET` 會留到下一個 query。
- 如果每個 query 都需要特定 session setting，就每次 query/transaction 明確設定。
- 不要為了保留 `SET` 狀態，把一堆操作包成長 transaction；長 transaction 會卡住 pool，降低 Hyperdrive scaling。
- 如果有多個 Hyperdrive config 指向同一個資料庫，要把總 connection 數一起算。

官方 limits 頁目前列出的每個 configuration origin database connections 約是 Free 20、Paid 100，最小連線數是 5。這些是靠近 origin database 的連線，不是 Workers client concurrency；Hyperdrive 不限制 Workers 到 Hyperdrive 的 concurrent client connections。

你最該監控的是 pool 有沒有卡住。常見錯誤包含：

- `Failed to acquire a connection from the pool.`
- `Server connection attempt failed: connection_refused`

前者通常代表 connection 被長 query 或長 transaction 卡太久；後者常見於 firewall、ACL、資料庫 provider connection limit。

## Observability：看 cache status 和 pool 壓力

Hyperdrive 提供 dashboard metrics，也能透過 [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) 查。官方文件列出兩組 dataset：

- `hyperdriveQueriesAdaptiveGroups`
- `hyperdrivePoolSizesAdaptiveGroups`

我會先看這幾個指標：

- query volume
- query latency
- connection latency
- cache status：`hit`、`miss`、`uncacheable`、`volatile`、`transaction`、`parseerror` 等
- avg/max open connections
- waiting clients

`volatile` 特別有用，代表 query 裡有 Postgres stable/volatile function，例如 `NOW()` 或 `RANDOM()`，導致 cache 不生效。`waitingClients` 上升則代表 pool 壓力變大，該查長 query、transaction、connection count，或確認 database provider 的連線上限。

## Limits 和 pricing

截至 2026-08-30 查到的官方文件：

- Hyperdrive 可用於 Workers Free 和 Paid plans。
- Free plan 每天 100,000 database queries；Paid plan database queries unlimited。
- database query 指任何經 Hyperdrive 發出的 statement，包含 `SELECT`、`INSERT`、`UPDATE`、`DELETE`、`CREATE`、`ALTER`、`DROP`。
- Free 最多 10 個 configured databases；Paid 最多 25 個。
- initial connection timeout 15 秒，idle connection timeout 10 分鐘。
- query statement duration 上限 60 秒。
- cached query response size 上限 50 MB；超過仍會回給 Worker，但不會 cache。
- connection pooling 和 query caching 在 Workers Paid plan 內含，不另外收費。
- Hyperdrive 不收 data transfer / egress。

這些數字容易變，正式發布前要再重查 pricing 和 limits。文章裡真正穩定的判斷是：Hyperdrive 的成本與限制主要看經過它的 database statements、configuration 數、origin connection pool、query duration，而不是傳統 app server 那種機器規格。

## 什麼時候不該用 Hyperdrive

幾個情境我不會先選 Hyperdrive：

- 新專案資料量小、schema 單純，直接用 D1 比較省。
- request 需要大量長 transaction 或 connection-level session state。
- 資料庫完全在 private network，且你還沒設 Workers VPC 或對外連線方案。
- 主要瓶頸是 SQL 本身太慢，缺 index、缺查詢優化；Hyperdrive 只能減少連線與網路成本，不能修壞掉的 query plan。
- 你需要多區寫入、一致性 replication、資料庫 HA；那些仍然是 database layer 的事。

比較好的使用場景：

- 既有 SaaS 後端想把 API edge 化，但資料庫短期不能搬。
- Postgres/MySQL 已經是團隊標準，ORM 和 migration pipeline 都成熟。
- 大量全球 read traffic 打到同一個資料庫。
- 熱門 read 可以接受 15 到 60 秒等級的短暫 stale。
- Workers 需要接 Neon、Supabase、Aurora、PlanetScale 這類既有資料庫。

## production 前的檢查清單

上線前我會逐項確認：

- database hostname 是 public DNS；若是 private network，先設 Workers VPC。
- TLS 設定正確；Hyperdrive 不支援 insecure plaintext database connection。
- database user 權限剛好足夠，不用 root/admin。
- compatibility date 與 Node.js compatibility 符合 driver 需求。
- Postgres driver 版本符合官方最低版本；MySQL driver 設好 `disableEval`。
- public read 和 fresh read 分成不同 Hyperdrive binding。
- auth、permission、billing、read-after-write 不走 cached binding。
- long transaction 有 timeout 和監控。
- GraphQL / dashboard metrics 會看 cache status、query latency、pool size、waiting clients。
- database provider firewall / ACL 允許 Hyperdrive 連線。

Hyperdrive 的價值不在於取代資料庫，而是在你不想重寫資料層時，讓 Workers 比較自然地接上現有 Postgres/MySQL。對 Edge Platform 來說，它是一個遷移橋：先把 runtime 搬近使用者，再逐步決定哪些資料該留在原本資料庫，哪些該搬到 D1、R2、KV 或 Durable Objects。

## 參考資料

- [Cloudflare Hyperdrive — Overview](https://developers.cloudflare.com/hyperdrive/)
- [Cloudflare Hyperdrive — Getting started](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Cloudflare Hyperdrive — How Hyperdrive works](https://developers.cloudflare.com/hyperdrive/concepts/how-hyperdrive-works/)
- [Cloudflare Hyperdrive — Query caching](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/)
- [Cloudflare Hyperdrive — Connection pooling](https://developers.cloudflare.com/hyperdrive/concepts/connection-pooling/)
- [Cloudflare Hyperdrive — Connect to PostgreSQL](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)
- [Cloudflare Hyperdrive — Supported databases and features](https://developers.cloudflare.com/hyperdrive/reference/supported-databases-and-features/)
- [Cloudflare Hyperdrive — Metrics and analytics](https://developers.cloudflare.com/hyperdrive/observability/metrics/)
- [Cloudflare Hyperdrive — Limits](https://developers.cloudflare.com/hyperdrive/platform/limits/)
- [Cloudflare Hyperdrive — Pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/)
