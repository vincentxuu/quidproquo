// Chat feature temporarily disabled to stay within Cloudflare Workers 3 MiB free-plan limit.
// To re-enable: restore imports from ../../lib/rag/graph, ../../lib/langfuse, @langchain/core/messages
import type { APIRoute } from 'astro'

export const POST: APIRoute = async () => {
  return new Response(
    `event: error\ndata: ${JSON.stringify({ type: 'maintenance', message: 'Chat is temporarily unavailable. Please check back later.' })}\n\n`,
    {
      status: 503,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    }
  )
}
