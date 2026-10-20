import type { APIRoute } from 'astro'
import { SHARED_GLOSSARY_ASSETS } from '../../lib/glossary/assets'

export const prerender = true

export function getStaticPaths() {
  return SHARED_GLOSSARY_ASSETS.map(({ name, body }) => ({ params: { name }, props: { body } }))
}

export const GET: APIRoute = ({ props }) => new Response(props.body, {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
})
