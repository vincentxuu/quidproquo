import type { CloudPost } from './content-posts'
import { runContentOps } from './content-ops'

export interface MetadataSuggestionsReport {
  generated_at: string
  pipeline: 'metadata-suggestions'
  target_post: {
    slug: string
    title: string
    category: string
    lang: string
  }
  existing: {
    has_tldr: boolean
    has_description: boolean
  }
  suggestions: {
    tldr: {
      status: 'existing' | 'suggested'
      value: string | null
      reason: string
    }
    description: {
      status: 'existing' | 'suggested'
      value: string | null
      reason: string
    }
    social_snippet: {
      value: string
      reason: string
    }
  }
}

export function runMetadataSuggestions(post: CloudPost): MetadataSuggestionsReport {
  const baseReport = runContentOps([post])
  const op = baseReport.posts[0]
  const contentText = extractText(post.content)

  const tldrValue =
    post.tldr || (op?.suggestions.tldr ?? firstSentence(contentText, 140))
  const descriptionValue =
    post.description || (op?.suggestions.description ?? firstSentence(contentText, 155))

  return {
    generated_at: new Date().toISOString(),
    pipeline: 'metadata-suggestions',
    target_post: {
      slug: post.slug,
      title: post.title,
      category: post.category,
      lang: post.lang,
    },
    existing: {
      has_tldr: Boolean(post.tldr),
      has_description: Boolean(post.description),
    },
    suggestions: {
      tldr: {
        status: post.tldr ? 'existing' : 'suggested',
        value: tldrValue,
        reason: post.tldr ? 'existing_tldr_kept' : 'generated_from_post_intro',
      },
      description: {
        status: post.description ? 'existing' : 'suggested',
        value: descriptionValue,
        reason: post.description ? 'existing_description_kept' : 'generated_from_post_intro',
      },
      social_snippet: {
        value: buildSocialSnippet(contentText),
        reason: 'social_snippet_suggested_for_platform_summary',
      },
    },
  }
}

function extractText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[`*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstSentence(content: string, maxLength: number): string {
  const sentence = content.split(/[。.!?！？]\s*/).find((item) => item.trim().length >= 16) ?? content
  return sentence.trim().slice(0, maxLength).trim()
}

function buildSocialSnippet(content: string): string {
  const sentence = firstSentence(content, 100)
  return sentence || '此篇文章摘要待補'
}
