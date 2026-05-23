import type { ExtractedSection } from '../registry/types'

/**
 * Pure section-patch algorithm (Phase 8, design D8). Returns a merged section list where every
 * `original` section whose corresponding `flow_step_run_id === targetStepRunId` is replaced by the
 * next entry (in order) from `regenerated`; all other sections pass through unchanged.
 *
 * `ExtractedSection` carries no step-run id of its own, so the caller supplies a parallel
 * `originalStepRunIds` array (same length + order as `original`, sourced from the persisted section
 * rows' `flowStepRunId`). When `regenerated` provides fewer entries than there are matching
 * sections, the surplus matching sections are dropped (truncation) — the regenerated output is the
 * source of truth for the re-run step.
 */
export function patchSections(
  original: ExtractedSection[],
  regenerated: ExtractedSection[],
  targetStepRunId: string,
  originalStepRunIds: (string | null)[],
): ExtractedSection[] {
  const result: ExtractedSection[] = []
  let regenIndex = 0
  for (let i = 0; i < original.length; i++) {
    if (originalStepRunIds[i] === targetStepRunId) {
      // Matching section: pull the next regenerated entry. If exhausted, drop the section.
      if (regenIndex < regenerated.length) {
        result.push(regenerated[regenIndex])
        regenIndex++
      }
      continue
    }
    result.push(original[i])
  }
  return result
}
