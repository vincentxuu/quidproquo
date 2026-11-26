import { describe, expect, it } from 'vitest';
import { chapterLink, formatTimestamp, pickChapters } from './videoChapters';

describe('formatTimestamp', () => {
  it('uses mm:ss under an hour and h:mm:ss above', () => {
    expect(formatTimestamp(0)).toBe('00:00');
    expect(formatTimestamp(455)).toBe('07:35');
    expect(formatTimestamp(3673)).toBe('1:01:13');
  });
  it('clamps negative and fractional input', () => {
    expect(formatTimestamp(-3)).toBe('00:00');
    expect(formatTimestamp(59.9)).toBe('00:59');
  });
});

describe('pickChapters', () => {
  it('needs at least two chapters', () => {
    expect(pickChapters([{ videoId: 'a' }])).toEqual([]);
  });
  it('keeps only the video most sections point into', () => {
    const picked = pickChapters([{ videoId: 'a', n: 1 }, { videoId: 'b', n: 2 }, { videoId: 'a', n: 3 }]);
    expect(picked.map((c) => c.n)).toEqual([1, 3]);
  });
  it('shows nothing when no single video has two chapters', () => {
    expect(pickChapters([{ videoId: 'a' }, { videoId: 'b' }])).toEqual([]);
  });
});

describe('chapterLink', () => {
  const watch = 'https://www.youtube.com/watch?v=DGI4vucR71w';
  it('reads the t parameter', () => {
    expect(chapterLink({ href: `${watch}&t=455s`, textContent: '錄影 07:35–22:01' })).toEqual({ id: 'DGI4vucR71w', seconds: 455 });
  });
  it('treats an untimed link labelled from 00:00 as the start', () => {
    expect(chapterLink({ href: watch, textContent: '錄影 00:00–07:35' })).toEqual({ id: 'DGI4vucR71w', seconds: 0 });
  });
  it('ignores untimed links that are just the source', () => {
    expect(chapterLink({ href: watch, textContent: '原始影片：Lecture 1' })).toBeNull();
    expect(chapterLink({ href: watch, textContent: 'Recording 12:00' })).toBeNull();
  });
});

describe('clampSize', () => {
  it('keeps the size within bounds', async () => {
    const { clampSize } = await import('./videoChapters');
    expect(clampSize(200, 300, 700)).toBe(300);
    expect(clampSize(900, 300, 700)).toBe(700);
    expect(clampSize(412.6, 300, 700)).toBe(413);
  });
  it('never returns less than the minimum on a narrow window', async () => {
    const { clampSize } = await import('./videoChapters');
    expect(clampSize(500, 300, 120)).toBe(300);
  });
});

describe('mini player corners', () => {
  it('moves to the neighbouring corner with arrow keys', async () => {
    const { cornerAfterKey } = await import('./videoChapters');
    expect(cornerAfterKey('bl', 'ArrowRight')).toBe('br');
    expect(cornerAfterKey('bl', 'ArrowUp')).toBe('tl');
    expect(cornerAfterKey('tr', 'ArrowDown')).toBe('br');
    expect(cornerAfterKey('tr', 'ArrowRight')).toBe('tr');
    expect(cornerAfterKey('bl', 'Enter')).toBeNull();
  });
});

describe('sidebarWidth', () => {
  it('toggles between the normal size and half the screen', async () => {
    const { sidebarWidth } = await import('./videoChapters');
    expect(sidebarWidth(false, 1440)).toBe(340);
    expect(sidebarWidth(true, 1440)).toBe(696);
    expect(sidebarWidth(true, 1920)).toBe(936);
  });
  it('keeps about 600px for the article on a narrow desktop', async () => {
    const { sidebarWidth } = await import('./videoChapters');
    expect(sidebarWidth(true, 1200)).toBe(510);
    expect(sidebarWidth(true, 1000)).toBe(340);
  });
});

describe('pipSidebarWidth', () => {
  it('fits the 16:9 stage, controls and some TOC in one screen height', async () => {
    const { pipSidebarWidth } = await import('./videoChapters');
    expect(pipSidebarWidth(1288, 620)).toBe(587);
    expect(pipSidebarWidth(1920, 1080)).toBe(1152);
  });
  it('keeps the article about 600px wide', async () => {
    const { pipSidebarWidth } = await import('./videoChapters');
    expect(pipSidebarWidth(1288, 900)).toBe(598);
    expect(pipSidebarWidth(1000, 900)).toBe(340);
  });
});

describe('nextPipCorner', () => {
  it('cycles clockwise from bottom-right', async () => {
    const { nextPipCorner } = await import('./videoChapters');
    expect(nextPipCorner('br')).toBe('bl');
    expect(nextPipCorner('bl')).toBe('tl');
    expect(nextPipCorner('tl')).toBe('tr');
    expect(nextPipCorner('tr')).toBe('br');
  });
});

describe('free-moving windows', () => {
  const area = { left: 24, top: 56, width: 1000, height: 600 };
  it('places a spot inside the area, edges at 0 and 1', async () => {
    const { placeBox } = await import('./videoChapters');
    expect(placeBox({ x: 0, y: 0 }, 320, 180, area)).toEqual({ left: 24, top: 56 });
    expect(placeBox({ x: 1, y: 1 }, 320, 180, area)).toEqual({ left: 704, top: 476 });
    expect(placeBox({ x: 0.5, y: 0.5 }, 320, 180, area)).toEqual({ left: 364, top: 266 });
  });
  it('round-trips a dropped position and clamps past the edges', async () => {
    const { placeBox, spotFromBox } = await import('./videoChapters');
    const spot = spotFromBox(364, 266, 320, 180, area);
    expect(placeBox(spot, 320, 180, area)).toEqual({ left: 364, top: 266 });
    expect(spotFromBox(-500, 9999, 320, 180, area)).toEqual({ x: 0, y: 1 });
  });
  it('keeps the same relative place when the area shrinks', async () => {
    const { placeBox } = await import('./videoChapters');
    const at = placeBox({ x: 1, y: 1 }, 320, 180, { left: 24, top: 56, width: 500, height: 300 });
    expect(at.left + 320).toBe(24 + 500);
    expect(at.top + 180).toBe(56 + 300);
  });
  it('reads saved spots and legacy corners', async () => {
    const { parseSpot } = await import('./videoChapters');
    expect(parseSpot('0.250,1.000', 'bl')).toEqual({ x: 0.25, y: 1 });
    expect(parseSpot('tr', 'bl')).toEqual({ x: 1, y: 0 });
    expect(parseSpot('junk', 'br')).toEqual({ x: 1, y: 1 });
    expect(parseSpot(null, 'bl')).toEqual({ x: 0, y: 1 });
    expect(parseSpot('5,-2', 'bl')).toEqual({ x: 1, y: 0 });
  });
  it('names the quadrant and nudges with arrow keys', async () => {
    const { spotCorner, spotAfterKey } = await import('./videoChapters');
    expect(spotCorner({ x: 0.2, y: 0.9 })).toBe('bl');
    expect(spotCorner({ x: 0.7, y: 0.1 })).toBe('tr');
    expect(spotAfterKey({ x: 0.5, y: 0.5 }, 'ArrowRight')).toEqual({ x: 0.6, y: 0.5 });
    expect(spotAfterKey({ x: 0.95, y: 0.5 }, 'ArrowRight')).toEqual({ x: 1, y: 0.5 });
    expect(spotAfterKey({ x: 0.5, y: 0.5 }, 'ArrowUp', true)).toEqual({ x: 0.5, y: 0 });
    expect(spotAfterKey({ x: 0.5, y: 0.5 }, 'Enter')).toBeNull();
  });
});
