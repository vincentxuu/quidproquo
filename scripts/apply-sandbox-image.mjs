#!/usr/bin/env node
//CI only: point the generated Worker config at a pre-built sandbox image.
//
//`scripts/create-cron-entry.mjs` injects `containers[].image` as a local
//Dockerfile path, which makes every `wrangler deploy` rebuild the image (about
//2.3 min on CI). The deploy workflow builds and pushes the image in a separate
//job, then calls this script with SANDBOX_IMAGE_REF so the deploy step just
//uses the registry reference.
//
//Local builds leave SANDBOX_IMAGE_REF unset and keep the Dockerfile path, so
//`pnpm dev` / `pnpm deploy` behaviour is unchanged.

import { readFileSync, writeFileSync } from 'node:fs'

const CONFIG_PATH = 'dist/server/wrangler.json'
const imageRef = process.env.SANDBOX_IMAGE_REF?.trim()

if (imageRef && !imageRef.startsWith('registry.cloudflare.com/')) {
  throw new Error(`[sandbox-image] unexpected image reference: ${imageRef}`)
}

if (!imageRef) {
  console.log('[sandbox-image] SANDBOX_IMAGE_REF not set; keeping Dockerfile image')
  process.exit(0)
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
const containers = config.containers
if (!Array.isArray(containers) || containers.length === 0) {
  throw new Error('[sandbox-image] generated config has no containers; refusing to guess')
}

let patched = 0
for (const container of containers) {
  if (container.class_name === 'AgentSandbox') {
    container.image = imageRef
    patched += 1
  }
}

if (patched === 0) {
  throw new Error('[sandbox-image] no AgentSandbox container found; refusing to deploy with wrong image')
}

writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`)
console.log(`[sandbox-image] patched ${patched} container image(s) -> ${imageRef}`)
