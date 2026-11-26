/** Fixed origin allowlist, shared by article transforms and the asset endpoint. */
export const SLIDE_ASSETS = Object.fromEntries(
  Array.from({ length: 9 }, (_, index) => {
    const lecture = String(index + 1).padStart(2, '0')
    return [`cs329z-lecture${lecture}`, {
      source: `https://web.stanford.edu/class/cs329z/slides/lecture${lecture}.pdf`,
      key: `slides/cs329z/lecture${lecture}.pdf`,
    }]
  }),
) as Record<string, { source: string; key: string }>

export function cachedSlideUrl(source: string): string | null {
  const entry = Object.entries(SLIDE_ASSETS).find(([, asset]) => asset.source === source)
  return entry ? `/api/slides/${entry[0]}.pdf` : null
}
