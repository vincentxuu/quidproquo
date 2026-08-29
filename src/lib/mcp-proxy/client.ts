import type { McpToolDefinition, McpToolCallResult } from './types'

const CALL_TIMEOUT_MS = 30_000

export interface McpClientOptions {
  url: string
  headers?: Record<string, string>
}

export async function listTools(opts: McpClientOptions): Promise<McpToolDefinition[]> {
  const res = await fetch(opts.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
  })
  if (!res.ok) throw new Error(`MCP tools/list failed: ${res.status}`)
  const body = await res.json() as { result?: { tools?: McpToolDefinition[] }; error?: { message: string } }
  if (body.error) throw new Error(`MCP error: ${body.error.message}`)
  return body.result?.tools ?? []
}

export async function callTool(
  opts: McpClientOptions,
  toolName: string,
  input: Record<string, unknown>,
): Promise<McpToolCallResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS)

  try {
    const res = await fetch(opts.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: toolName, arguments: input },
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`MCP tools/call failed: ${res.status}`)
    const body = await res.json() as { result?: McpToolCallResult; error?: { message: string } }
    if (body.error) return { content: body.error.message, isError: true }
    return body.result ?? { content: null }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { content: `MCP tool call timed out after ${CALL_TIMEOUT_MS}ms`, isError: true }
    }
    return { content: String(err), isError: true }
  } finally {
    clearTimeout(timer)
  }
}
