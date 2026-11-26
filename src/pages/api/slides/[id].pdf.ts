import type { APIRoute } from 'astro'
import { getEnv } from '@/lib/config/env'
import { serveLecturePdf } from '@/lib/slides/pdfAsset'

export const prerender = false
export const GET: APIRoute = ({ request, params }) => serveLecturePdf(request, getEnv().R2_IMAGES, fetch, params.id ?? '')
export const HEAD: APIRoute = GET
