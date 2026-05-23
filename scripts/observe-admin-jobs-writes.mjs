#!/usr/bin/env node
// Usage: node scripts/observe-admin-jobs-writes.mjs <write-count>
// Step 1: Run this query via wrangler:
//   wrangler d1 execute quidproquo-db --remote --command="SELECT COUNT(*) AS cnt FROM admin_jobs WHERE started_at > date('now', '-1 day')"
// Step 2: Pass the count to this script
// Step 3: This script appends the observation to the tracking file

import { appendFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const count = process.argv[2] ?? '0'
const outputFile = process.env.OBSERVATION_OUTPUT ?? '.omc/research/agent-pipelines-unify-phase5-observation.md'
const date = new Date().toISOString().slice(0, 10)
const line = `${date} writes=${count}\n`

mkdirSync(dirname(outputFile), { recursive: true })
appendFileSync(outputFile, line, 'utf8')
console.log(`Recorded: ${line.trim()}`)
