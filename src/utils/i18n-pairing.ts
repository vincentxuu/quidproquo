// src/utils/i18n-pairing.ts
import type { CollectionEntry } from 'astro:content';
import { isPublishedPost } from './content';

// Bilingual pairing convention (see the post-translate skill):
// the English counterpart shares the same id as its zh-TW source plus an `-en` suffix.
// e.g. `ai/<slug>` (zh-TW) <-> `ai/<slug>-en` (en).

const EN_SUFFIX = '-en';

/**
 * Return the published translation counterpart for a given post id, or null.
 * - en post (id ends with `-en`) -> the zh-TW source (id without the suffix)
 * - zh-TW post -> the en counterpart (id + `-en`)
 * Only published counterparts are considered valid.
 */
export function getTranslation(
  postId: string,
  allPosts: CollectionEntry<'posts'>[]
): CollectionEntry<'posts'> | null {
  const targetId = postId.endsWith(EN_SUFFIX)
    ? postId.slice(0, -EN_SUFFIX.length)
    : postId + EN_SUFFIX;
  const match = allPosts.find(post => post.id === targetId);
  return match && isPublishedPost(match) ? match : null;
}
