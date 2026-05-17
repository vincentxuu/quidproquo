export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

export function forbidden(): Response {
  return json({ error: 'forbidden' }, 403)
}

export function badRequest(message = 'bad request'): Response {
  return json({ ok: false, error: message }, 400)
}

export function notFound(message = 'not found'): Response {
  return json({ ok: false, error: message }, 404)
}

export function serverError(message = 'server error'): Response {
  return json({ ok: false, error: message }, 500)
}
