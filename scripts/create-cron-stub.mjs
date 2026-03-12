// scripts/create-cron-stub.mjs
// pre-build：建立 dist/cron-entry.js stub，讓 wrangler config 驗證通過
// 真正的內容由 scripts/create-cron-entry.mjs 在 astro build 後覆寫

import { writeFileSync, mkdirSync } from 'node:fs'

mkdirSync('./dist', { recursive: true })
writeFileSync('./dist/cron-entry.js', '// stub - will be replaced by post-build script\n')
console.log('✅ Created dist/cron-entry.js stub')
