import { useEffect, useRef, useState } from 'react'

interface RelatedPost {
  slug: string
  title: string
  url: string
}

interface RelatedPostsResponse {
  slug?: string
  results?: RelatedPost[]
}

export default function RelatedPosts({ slug }: { slug: string }) {
  const [posts, setPosts] = useState<RelatedPost[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/related-posts?slug=${encodeURIComponent(slug)}&limit=3`)
      .then(r => r.ok ? r.json() as Promise<RelatedPostsResponse> : null)
      .then(data => {
        const results = data?.results
        if (results && results.length > 0) {
          setPosts(results)
          const fallback = ref.current?.parentElement?.querySelector('.related-fallback')
          if (fallback) (fallback as HTMLElement).style.display = 'none'
        }
      })
      .catch(() => {})
  }, [slug])

  if (!posts) return <div ref={ref} />

  return (
    <div ref={ref} className="related-list">
      {posts.map(p => (
        <a key={p.slug} href={p.url} className="related-item">
          <span className="related-title">{p.title}</span>
        </a>
      ))}
    </div>
  )
}
