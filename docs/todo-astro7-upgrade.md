# Astro 7 升級待辦

## 目標

升級 Astro 6.3.7 → 7.3.2+，開啟 `experimental.incrementalBuild`，將 CI build 從 ~4 min 壓到 < 1 min。

## 套件升級

| 套件 | 現行版本 | 目標版本 |
|---|---|---|
| `astro` | 6.3.7 | ^7.3.2 |
| `@astrojs/cloudflare` | 13.1.0 | ^14.3.1 |
| `@astrojs/mdx` | 5.0.0 | ^8.0.1 |
| `@astrojs/react` | 5.0.4 | ^6.0.5 |
| `@astrojs/rss` | 4.0.17 | ^4.0.19 |
| `@astrojs/sitemap` | 3.7.1 | ^3.7.4 |
| `@astrojs/check` | 0.9.7 | ^0.9.10 |
| `wrangler` | 4.127.1 | >=4.131.1 |
| `@astrojs/markdown-remark` | (新增) | latest |

## 必要修正

### 1. Markdown 處理器（Sätteri 取代 remark/rehype）

Astro 7 預設用 Sätteri，不再內建 unified/remark/rehype。需安裝 `@astrojs/markdown-remark` 讓現有的三個 plugin 繼續運作：

- `remarkReadingTime`
- `rehypeExternalLinks`（自訂）
- `rehypeLazyImages`（自訂）

### 2. Fragment shorthand `<>...</>` → `<Fragment>...</Fragment>`

Astro 7 的 Rust compiler 不接受 JSX Fragment shorthand。10 個檔案共 18 處：

- `src/components/SeriesDirectory.astro`
- `src/components/admin/console/PresetSummaryPanel.astro`
- `src/pages/admin/sessions/[id]/evidence.astro`
- `src/pages/admin/sessions/artifacts.astro`
- `src/pages/admin/sessions/evidence.astro`
- `src/pages/admin/settings/access/audit.astro`
- `src/pages/admin/settings/access/index.astro`
- `src/pages/admin/settings/models/[id].astro`
- `src/pages/admin/settings/models/cost.astro`
- `src/pages/shared/[token].astro`

修法：`perl -pi -e "s/(?<![a-zA-Z\/])<>/<Fragment>/g; s/<\/(?=[^a-zA-Z])>/<\/Fragment>/g"`

### 3. HTML 標籤平衡（Rust compiler 更嚴格）

- `src/pages/about.astro` — 多 2 個 `</div>`（line 327-328）
- `src/pages/en/about.astro` — 多 1 個 `</div>`（line 329）

### 4. Admin 頁面 "Unexpected token" 排查

`src/pages/admin/flows/new.astro:155` 報 CompilerError。可能還有更多 admin 頁面有類似問題，需要逐個 `pnpm build` 排查修正。

建議用腳本掃：
```bash
# 掃全部 .astro 的 div 平衡
python3 -c "
import re, glob
for f in sorted(glob.glob('src/**/*.astro', recursive=True)):
    with open(f) as fh: lines = fh.readlines()
    depth = 0
    for i, line in enumerate(lines, 1):
        depth += len(re.findall(r'<div[\s>]', line)) - len(re.findall(r'<div[^>]*/>', line)) - len(re.findall(r'</div>', line))
    if depth != 0: print(f'{f}: depth={depth}')
"
```

## 設定變更

### astro.config.mjs

```js
experimental: {
  incrementalBuild: true,
},
```

### CI cache（已完成）

`node_modules/.astro/` 的 cache step 已加入 deploy.yml 和 preview.yml。

## 參考資料

- [Astro v7 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Astro 7.0 Blog Post](https://astro.build/blog/astro-7/)
- [Incremental Build Docs](https://docs.astro.build/en/reference/experimental-flags/incremental-build/)
- Astro Docs 實測：incremental build 從 4m58s → ~60s（80% 加速）

## 建議做法

開 `feature/astro-7-upgrade` 分支，逐步修到 `pnpm build` 全綠再合入 main。
