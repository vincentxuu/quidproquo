export interface PublishablePostData {
  date: Date
  draft?: boolean
  search?: boolean
}

export function isPublishedAt(date: Date, now = new Date()): boolean {
  const taipeiOffset = 8 * 60 * 60 * 1000
  const taipeiNow = new Date(now.getTime() + taipeiOffset)
  const taipeiToday = new Date(Date.UTC(
    taipeiNow.getUTCFullYear(),
    taipeiNow.getUTCMonth(),
    taipeiNow.getUTCDate(),
    23,
    59,
    999,
  ))
  return date.getTime() <= taipeiToday.getTime()
}

export function isPublishedPostData(
  data: Pick<PublishablePostData, 'date' | 'draft'>,
  now = new Date(),
): boolean {
  return !data.draft && isPublishedAt(data.date, now)
}

export function isSearchIndexEligiblePostData(
  data: PublishablePostData,
  now = new Date(),
): boolean {
  return isPublishedPostData(data, now) && data.search !== false
}
