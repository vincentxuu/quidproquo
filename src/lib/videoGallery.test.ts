import { describe, expect, it } from 'vitest';
import { createGalleryClickGuard } from './videoGallery';

describe('gallery click intent', () => {
  it('allows a tap with normal pointer jitter', () => {
    const guard = createGalleryClickGuard();
    guard.begin(100, 100, 0, 0);
    guard.move(103, 104);
    expect(guard.suppress(1)).toBe(false);
  });

  it('blocks horizontal swipes, even when the pointer returns to its origin', () => {
    const guard = createGalleryClickGuard();
    guard.begin(100, 100, 0, 0);
    guard.move(160, 100);
    guard.move(100, 100);
    expect(guard.suppress(1)).toBe(true);
  });

  it('blocks vertical scrolling, native scroll displacement and canceled gestures', () => {
    const guard = createGalleryClickGuard();
    guard.begin(100, 100, 0, 0);
    guard.move(100, 120);
    expect(guard.suppress(1)).toBe(true);
    guard.begin(100, 100, 0, 0);
    guard.scroll(12, 0);
    expect(guard.suppress(1)).toBe(true);
    guard.begin(100, 100, 0, 0);
    guard.cancel();
    expect(guard.suppress(1)).toBe(true);
  });

  it('preserves keyboard activation and allows a fresh click after a swipe', () => {
    const guard = createGalleryClickGuard();
    guard.begin(100, 100, 0, 0);
    guard.move(160, 100);
    expect(guard.suppress(0)).toBe(false);
    guard.begin(160, 100, 50, 0);
    expect(guard.suppress(1)).toBe(false);
  });
});
