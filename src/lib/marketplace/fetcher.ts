import type { PluginManifest } from './types'

export async function fetchManifest(repoUrl: string): Promise<PluginManifest> {
  const rawUrl = toRawGitHubUrl(repoUrl)
  const res = await fetch(rawUrl)
  if (!res.ok) throw new Error(`Failed to fetch manifest from ${rawUrl}: ${res.status}`)
  const manifest = (await res.json()) as PluginManifest
  if (!manifest.name || !manifest.version) {
    throw new Error('Invalid manifest: missing name or version')
  }
  return manifest
}

export async function fetchSkillContent(repoUrl: string, filePath: string): Promise<string> {
  const base = toRawGitHubBase(repoUrl)
  const res = await fetch(`${base}/${filePath}`)
  if (!res.ok) throw new Error(`Failed to fetch skill file ${filePath}: ${res.status}`)
  return res.text()
}

function toRawGitHubUrl(repoUrl: string): string {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error(`Not a GitHub URL: ${repoUrl}`)
  const [, owner, repo] = match
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/manifest.json`
}

function toRawGitHubBase(repoUrl: string): string {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error(`Not a GitHub URL: ${repoUrl}`)
  const [, owner, repo] = match
  return `https://raw.githubusercontent.com/${owner}/${repo}/main`
}
