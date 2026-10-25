import type { SpeakingScenario } from './english-speaking';

export type EnglishContentSection = 'materials' | 'methods' | 'courses';

export interface EnglishContentEntry {
  /** The original Chinese post id; English counterparts append -en. */
  id: string;
  section: EnglishContentSection;
  scenario?: SpeakingScenario;
  /** Reading order in the unified English Speaking Practice series. */
  order: number;
}

// Explicit membership keeps research about English-language software, instructional
// design, and other incidental tag matches out of the speaking-learning directory.
export const englishContentEntries: readonly EnglishContentEntry[] = [
  { id: 'learning/2026-10-19-english-speaking-practice-overview', section: 'courses', order: 0 },
  { id: 'learning/2026-09-03-work-english-speaking-tips', section: 'methods', order: 1, scenario: 'work' },
  { id: 'learning/2026-10-08-shadowing-evidence', section: 'methods', order: 2 },
  { id: 'learning/2026-10-10-agency-ai-shadowing', section: 'methods', order: 3 },
  { id: 'learning/2026-10-08-travel-airport-hotel-restaurant-english', section: 'materials', order: 4, scenario: 'travel' },
  { id: 'learning/2026-10-07-climbing-trip-english', section: 'materials', order: 5, scenario: 'climbing' },
  { id: 'learning/2026-10-07-work-standup-english', section: 'materials', order: 6, scenario: 'work' },
  { id: 'learning/2026-10-08-work-english-from-teaching-materials', section: 'materials', order: 7, scenario: 'work' },
  { id: 'learning/2026-10-07-job-hunt-chat-english', section: 'materials', order: 8, scenario: 'daily' },
  { id: 'learning/2026-10-07-interview-experience-english', section: 'materials', order: 9, scenario: 'interview' },
  { id: 'learning/2026-10-07-interview-agent-stories-english', section: 'materials', order: 10, scenario: 'interview' },
  { id: 'learning/2026-10-08-interview-english-from-teaching-materials', section: 'materials', order: 11, scenario: 'interview' },
  { id: 'learning/2026-10-12-coding-interview-english', section: 'materials', order: 12, scenario: 'interview' },
  { id: 'learning/2026-10-12-interview-thinking-time-english', section: 'materials', order: 13, scenario: 'interview' },
  { id: 'learning/2026-10-12-system-design-interview-english', section: 'materials', order: 14, scenario: 'interview' },
  { id: 'learning/2026-10-25-daily-health-lunch-english', section: 'materials', order: 15, scenario: 'daily' },
  { id: 'learning/2026-10-25-travel-delays-lost-baggage-english', section: 'materials', order: 16, scenario: 'travel' },
  { id: 'learning/2026-10-25-surf-conditions-entry-english', section: 'materials', order: 17, scenario: 'surf' },
  { id: 'learning/2026-10-25-climbing-gym-beta-english', section: 'materials', order: 18, scenario: 'climbing' },
  { id: 'learning/2026-10-19-nativecamp-speaking-practice', section: 'courses', order: 19 },
  { id: 'learning/2026-10-19-cambly-speaking-practice', section: 'courses', order: 20 },
  { id: 'learning/2026-10-19-italki-speaking-practice', section: 'courses', order: 21 },
  { id: 'learning/2026-10-19-british-council-taiwan-speaking-practice', section: 'courses', order: 22 },
  { id: 'learning/2026-10-19-ntnu-extension-speaking-practice', section: 'courses', order: 23 },
  { id: 'learning/2026-10-19-preply-speaking-practice', section: 'courses', order: 24 },
  { id: 'learning/2026-10-19-engoo-speaking-practice', section: 'courses', order: 25 },
  { id: 'learning/2026-10-19-amazingtalker-speaking-practice', section: 'courses', order: 26 },
  { id: 'learning/2026-10-19-speak-speaking-practice', section: 'courses', order: 27 },
  { id: 'learning/2026-10-19-elsa-speaking-practice', section: 'courses', order: 28 },
  { id: 'learning/2026-10-19-wimbledon-school-english-speaking-practice', section: 'courses', order: 29 },
  { id: 'learning/2026-10-19-ev-academy-speaking-practice', section: 'courses', order: 30 },
  { id: 'learning/2026-10-19-tandem-speaking-practice', section: 'courses', order: 31 },
  { id: 'learning/2026-10-19-speaking-practice-review-routine', section: 'courses', order: 32 },
  { id: 'learning/2026-10-19-speaking-practice-selection-guide', section: 'courses', order: 33 },
];

const entriesById = new Map(englishContentEntries.map(entry => [entry.id, entry]));

/** Accept Astro post ids or internal article paths, including English counterparts. */
export function englishContentContext(postId: string): EnglishContentEntry | undefined {
  const id = postId.replace(/^\/?posts\//, '').replace(/^\/+|\/+$/g, '').replace(/-en$/, '');
  return entriesById.get(id);
}

/** A suggested practice destination, not a claim that every article is a card set. */
export function englishPracticeHref(entry: EnglishContentEntry): string {
  if (entry.scenario) return `/english/#home/${entry.scenario}`;
  if (entry.id === 'learning/2026-10-08-shadowing-evidence') return '/english/#shadow/travel';
  return '/english/#practice-area';
}
