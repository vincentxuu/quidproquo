#!/usr/bin/env node

/**
 * Mac Runner — local Node.js agent worker that connects back to Workers
 * via WebSocket and executes sandbox tool commands (exec, readFile, writeFile, glob, grep).
 *
 * Usage:
 *   RUNNER_TOKEN=<your-crawl-secret> RUNNER_URL=wss://your-domain/api/admin/sessions/runner/ws node scripts/mac-runner.mjs
 *
 * Environment:
 *   RUNNER_TOKEN  — Bearer token (must match CRAWL_SECRET on Workers)
 *   RUNNER_URL    — WebSocket endpoint (default: ws://localhost:4321/api/admin/sessions/runner/ws)
 *   RUNNER_WORKDIR — working directory for commands (default: cwd)
 */

import { spawn } from 'node:child_process'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { glob as fsGlob } from 'node:fs'
import { promisify } from 'node:util'
import { hostname } from 'node:os'
import { resolve, dirname } from 'node:path'
import WebSocket from 'ws'

const TOKEN = process.env.RUNNER_TOKEN
const URL = process.env.RUNNER_URL ?? 'ws://localhost:4321/api/admin/sessions/runner/ws'
const WORKDIR = process.env.RUNNER_WORKDIR ?? process.cwd()
const HEARTBEAT_INTERVAL_MS = 30_000
const RECONNECT_DELAY_MS = 5_000
const MAX_OUTPUT_BYTES = 1024 * 1024

if (!TOKEN) {
  console.error('RUNNER_TOKEN is required')
  process.exit(1)
}

let ws = null
let heartbeatTimer = null
let reconnectTimer = null

function connect() {
  console.log(`[runner] connecting to ${URL}...`)

  ws = new WebSocket(URL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'X-Runner-Hostname': hostname(),
    },
  })

  ws.on('open', () => {
    console.log('[runner] connected')
    startHeartbeat()
  })

  ws.on('message', async (data) => {
    const text = data.toString()
    let cmd
    try {
      cmd = JSON.parse(text)
    } catch {
      return
    }

    if (cmd.type === 'heartbeat_ack') return

    if (cmd.id && cmd.type) {
      const result = await handleCommand(cmd)
      ws.send(JSON.stringify(result))
    }
  })

  ws.on('close', (code) => {
    console.log(`[runner] disconnected (code ${code}), reconnecting in ${RECONNECT_DELAY_MS}ms...`)
    cleanup()
    scheduleReconnect()
  })

  ws.on('error', (err) => {
    console.error(`[runner] error: ${err.message}`)
  })
}

function startHeartbeat() {
  clearInterval(heartbeatTimer)
  heartbeatTimer = setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat' }))
    }
  }, HEARTBEAT_INTERVAL_MS)
}

function cleanup() {
  clearInterval(heartbeatTimer)
  heartbeatTimer = null
  ws = null
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
}

async function handleCommand(cmd) {
  const { id, type, params } = cmd
  const sessionId = params?.sessionId

  try {
    let result
    switch (type) {
      case 'exec':
        result = await execCommand(params.command)
        break
      case 'readFile':
        result = await readFileCommand(params.path)
        break
      case 'writeFile':
        await writeFileCommand(params.path, params.content)
        result = { ok: true }
        break
      case 'glob':
        result = await globCommand(params.pattern)
        break
      case 'grep':
        result = await grepCommand(params.pattern, params.paths)
        break
      case 'start':
        console.log(`[runner] session ${sessionId} started`)
        result = { ok: true }
        break
      case 'stop':
        console.log(`[runner] session ${sessionId} stopped`)
        result = { ok: true }
        break
      default:
        return { id, sessionId, error: `unknown command type: ${type}` }
    }
    return { id, sessionId, result }
  } catch (err) {
    return { id, sessionId, error: err.message }
  }
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(command) || command.length === 0) {
      return reject(new Error('command must be a non-empty array'))
    }

    const [cmd, ...args] = command
    const proc = spawn(cmd, args, {
      cwd: WORKDIR,
      timeout: 120_000,
      maxBuffer: MAX_OUTPUT_BYTES,
      env: { ...process.env, HOME: process.env.HOME },
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (d) => {
      stdout += d.toString()
      if (stdout.length > MAX_OUTPUT_BYTES) stdout = stdout.slice(0, MAX_OUTPUT_BYTES)
    })
    proc.stderr.on('data', (d) => {
      stderr += d.toString()
      if (stderr.length > MAX_OUTPUT_BYTES) stderr = stderr.slice(0, MAX_OUTPUT_BYTES)
    })

    proc.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode ?? 1 })
    })
    proc.on('error', (err) => {
      reject(new Error(`spawn error: ${err.message}`))
    })
  })
}

async function readFileCommand(path) {
  const fullPath = resolve(WORKDIR, path)
  const content = await readFile(fullPath, 'utf-8')
  if (content.length > MAX_OUTPUT_BYTES) {
    return content.slice(0, MAX_OUTPUT_BYTES)
  }
  return content
}

async function writeFileCommand(path, content) {
  const fullPath = resolve(WORKDIR, path)
  await mkdir(dirname(fullPath), { recursive: true })
  await writeFile(fullPath, content, 'utf-8')
}

async function globCommand(pattern) {
  const { glob } = await import('fast-glob')
  const files = await glob(pattern, { cwd: WORKDIR, dot: false, onlyFiles: true })
  return files.slice(0, 1000)
}

function grepCommand(pattern, paths) {
  return new Promise((resolve, reject) => {
    const args = ['-rnH', '--', pattern, ...paths]
    const proc = spawn('grep', args, {
      cwd: WORKDIR,
      timeout: 30_000,
      maxBuffer: MAX_OUTPUT_BYTES,
    })

    let stdout = ''
    proc.stdout.on('data', (d) => {
      stdout += d.toString()
      if (stdout.length > MAX_OUTPUT_BYTES) stdout = stdout.slice(0, MAX_OUTPUT_BYTES)
    })

    proc.on('close', () => {
      const results = stdout
        .split('\n')
        .filter(Boolean)
        .slice(0, 500)
        .map((line) => {
          const match = line.match(/^(.+?):(\d+):(.*)$/)
          if (!match) return { file: '', line: 0, content: line }
          return { file: match[1], line: parseInt(match[2], 10), content: match[3] }
        })
      resolve(results)
    })

    proc.on('error', (err) => reject(new Error(`grep error: ${err.message}`)))
  })
}

// Start
connect()

process.on('SIGINT', () => {
  console.log('[runner] shutting down...')
  clearInterval(heartbeatTimer)
  clearTimeout(reconnectTimer)
  if (ws) ws.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('[runner] shutting down...')
  clearInterval(heartbeatTimer)
  clearTimeout(reconnectTimer)
  if (ws) ws.close()
  process.exit(0)
})
