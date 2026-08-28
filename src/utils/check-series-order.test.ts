import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findProblems, groupBySeries } from '../../scripts/check-series-order.mjs';

describe('series order checker', () => {
  it('counts additionalSeries memberships when checking gaps', () => {
    const files = [
      'src/content/posts/learning/2026-08-21-global-ai-cs-course-map.md',
      'src/content/posts/learning/2026-08-20-stanford-cs-course-map.md',
      'src/content/posts/learning/2026-08-21-cmu-ai-ml-course-map.md',
    ].map(file => path.resolve(file));

    const groups = groupBySeries(files);
    const umbrella = groups.get('世界名校 AI／CS 課程地圖\tzh-TW') as
      | Array<{ order: number }>
      | undefined;

    expect(umbrella?.map(item => item.order)).toEqual([0, 91, 92]);
    expect(findProblems(groups).problems).toEqual([]);
  });
});
