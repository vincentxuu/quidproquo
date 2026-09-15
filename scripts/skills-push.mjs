// scripts/skills-push.mjs
// Sync local .agents/skills/ to D1 (skill + skill_version tables) + R2 production.
// Usage: pnpm skills:push [--dry-run]

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const SKILLS_DIR = '.agents/skills'
const DB_NAME = 'quidproquo-db'
const R2_BUCKET = 'quidproquo-agent-artifact'
const DRY_RUN = process.argv.includes('--dry-run')

function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { name: '', description: '', body: content }
  const fm = match[1]
  const body = match[2]
  let name = ''
  let description = ''
  for (const line of fm.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx < 0) continue
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key === 'name') name = value
    if (key === 'description') description = value
  }
  return { name, description, body }
}

function escapeSql(str) {
  return str.replace(/'/g, "''")
}

function d1Execute(sql) {
  if (DRY_RUN) {
    console.log(`  [dry-run] SQL: ${sql.slice(0, 120)}...`)
    return '{}'
  }
  // Write SQL to temp file to avoid shell escaping issues
  const tmpFile = `/tmp/skills-push-${Date.now()}.sql`
  writeFileSync(tmpFile, sql)
  try {
    const result = execSync(`wrangler d1 execute ${DB_NAME} --remote --file ${tmpFile}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return result
  } catch (e) {
    console.error(`  D1 error: ${e.stderr || e.message}`)
    return ''
  } finally {
    try { unlinkSync(tmpFile) } catch {}
  }
}

function r2Put(key, filePath) {
  if (DRY_RUN) {
    console.log(`  [dry-run] R2 PUT: ${key}`)
    return
  }
  try {
    execSync(`wrangler r2 object put ${R2_BUCKET}/${key} --file ${filePath}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (e) {
    console.error(`  R2 error: ${e.stderr || e.message}`)
  }
}

function d1Query(sql) {
  try {
    const result = execSync(`wrangler d1 execute ${DB_NAME} --remote --command "${escapeSql(sql)}" --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const parsed = JSON.parse(result)
    return parsed[0]?.results ?? []
  } catch {
    return []
  }
}

function collectFiles(skillDir, subdir) {
  const fullDir = join(skillDir, subdir)
  if (!existsSync(fullDir) || !statSync(fullDir).isDirectory()) return []
  const files = []
  for (const name of readdirSync(fullDir)) {
    const filePath = join(fullDir, name)
    if (!statSync(filePath).isFile()) continue
    const content = readFileSync(filePath, 'utf8')
    files.push({
      path: `${subdir}/${name}`,
      content,
      filePath,
    })
  }
  return files
}

// Main
if (!existsSync(SKILLS_DIR)) {
  console.error(`Directory not found: ${SKILLS_DIR}`)
  process.exit(1)
}

const skillDirs = readdirSync(SKILLS_DIR).filter(name => {
  const p = join(SKILLS_DIR, name)
  return statSync(p).isDirectory()
})

console.log(`Found ${skillDirs.length} skills in ${SKILLS_DIR}`)
if (DRY_RUN) console.log('(dry-run mode — no changes will be made)\n')
else console.log()

// Fetch existing skills from D1 for diff
let existingSkills = new Map()
try {
  const rows = d1Query("SELECT slug, latest_version_id FROM skill")
  for (const row of rows) {
    existingSkills.set(row.slug, row.latest_version_id)
  }
} catch {
  // Table may not exist yet
}

let existingHashes = new Map()
try {
  const rows = d1Query("SELECT sv.id, sv.content_hash, s.slug FROM skill_version sv JOIN skill s ON s.latest_version_id = sv.id")
  for (const row of rows) {
    existingHashes.set(row.slug, { versionId: row.id, hash: row.content_hash })
  }
} catch {
  // Table may not exist yet
}

let created = 0
let updated = 0
let skipped = 0
const now = Math.floor(Date.now() / 1000)

for (const slug of skillDirs) {
  const skillDir = join(SKILLS_DIR, slug)
  const skillMdPath = join(skillDir, 'SKILL.md')

  if (!existsSync(skillMdPath)) {
    // Look for any .md file
    const mdFiles = readdirSync(skillDir).filter(f => f.endsWith('.md'))
    if (mdFiles.length === 0) {
      console.log(`  skip ${slug} (no SKILL.md)`)
      continue
    }
  }

  const skillContent = readFileSync(
    existsSync(skillMdPath) ? skillMdPath : join(skillDir, readdirSync(skillDir).find(f => f.endsWith('.md'))),
    'utf8',
  )
  const { name, description } = parseFrontmatter(skillContent)
  const displayName = name || slug

  // Collect all files for content hash
  const attachedFiles = [
    ...collectFiles(skillDir, 'references'),
    ...collectFiles(skillDir, 'templates'),
    ...collectFiles(skillDir, 'scripts'),
  ]

  // Compute content hash over SKILL.md + all attached files
  const hashInput = skillContent + attachedFiles.map(f => f.path + f.content).join('')
  const contentHash = sha256(hashInput)

  // Check if unchanged
  const existing = existingHashes.get(slug)
  if (existing && existing.hash === contentHash) {
    console.log(`  skip ${slug} (unchanged)`)
    skipped++
    continue
  }

  const isNew = !existingSkills.has(slug)
  const skillId = isNew ? genId('skill') : undefined
  const versionId = genId('skillver')
  const version = existing ? 2 : 1
  const bodyR2Key = `skills/${contentHash}.md`

  // Upload SKILL.md body to R2
  const tmpBody = `/tmp/skills-push-body-${Date.now()}.md`
  writeFileSync(tmpBody, skillContent)
  r2Put(bodyR2Key, tmpBody)
  try { unlinkSync(tmpBody) } catch {}

  // Upload attached files to R2
  for (const file of attachedFiles) {
    const fileHash = sha256(file.content)
    const blobKey = `skill-files/${fileHash}`
    r2Put(blobKey, file.filePath)
  }

  // SQL: create or update skill + version + files
  const statements = []

  if (isNew) {
    statements.push(
      `INSERT OR IGNORE INTO skill (id, slug, display_name, scope, source, latest_version_id, created_at)
       VALUES ('${skillId}', '${escapeSql(slug)}', '${escapeSql(displayName)}', 'personal', 'custom', '${versionId}', ${now});`
    )
  }

  // Get the actual skill ID for existing skills
  const effectiveSkillIdExpr = isNew
    ? `'${skillId}'`
    : `(SELECT id FROM skill WHERE slug = '${escapeSql(slug)}')`

  statements.push(
    `INSERT INTO skill_version (id, skill_id, version, name, description, body, body_r2_key, content_hash, status, published_at, created_at)
     VALUES ('${versionId}', ${effectiveSkillIdExpr}, ${version}, '${escapeSql(displayName)}', '${escapeSql(description)}', '', '${bodyR2Key}', '${contentHash}', 'published', ${now}, ${now});`
  )

  statements.push(
    `UPDATE skill SET latest_version_id = '${versionId}' WHERE slug = '${escapeSql(slug)}';`
  )

  // Attached files
  for (const file of attachedFiles) {
    const fileHash = sha256(file.content)
    const blobKey = `skill-files/${fileHash}`
    const fileId = genId('sf')
    statements.push(
      `INSERT OR IGNORE INTO skill_file (id, version_id, path, blob_key, size_bytes, created_at)
       VALUES ('${fileId}', '${versionId}', '${escapeSql(file.path)}', '${blobKey}', ${file.content.length}, ${now});`
    )
  }

  d1Execute(statements.join('\n'))

  if (isNew) {
    console.log(`  + ${slug} (created v${version}, ${attachedFiles.length} files)`)
    created++
  } else {
    console.log(`  ~ ${slug} (updated v${version}, ${attachedFiles.length} files)`)
    updated++
  }
}

console.log(`\nDone: ${created} created, ${updated} updated, ${skipped} unchanged`)
