// Build-time switches for experimental article UI. Flip to false and redeploy to turn a feature off.
export const uiFeatures = {
  /** Video posts, desktop: move the main embed into the sticky sidebar above the TOC (src/lib/videoChapters.ts). */
  videoSidebar: true,
  /** Video posts: list each section's start time in the TOC and beside the pinned player. */
  videoChapters: true,
  /** Video posts: a playing embed scrolled out of view shrinks to a corner player. */
  videoMiniPlayer: true,
} as const;
