import { describe, expect, it } from 'vitest'
import { selectStaleAgentBranches, type AgentBranch } from './agent-branch-cleanup'

const now = Date.parse('2026-11-27T00:00:00Z')
const branch = (name: string, committedAt: string, openPullRequests = 0): AgentBranch => ({ name, committedAt, openPullRequests })
const select = (branches: AgentBranch[], keep: string[] = []) =>
  selectStaleAgentBranches(branches, { now, maxAgeDays: 14, keep: new Set(keep) })

describe('selectStaleAgentBranches', () => {
  it('deletes agent branches older than the retention window', () => {
    expect(select([
      branch('agent/sess_old', '2026-11-01T00:00:00Z'),
      branch('agent/sess_new', '2026-11-20T00:00:00Z'),
    ])).toEqual(['agent/sess_old'])
  })

  it('keeps a branch exactly at the cutoff', () => {
    expect(select([branch('agent/sess_edge', '2026-11-13T00:00:00Z')])).toEqual([])
  })

  it('keeps branches with an open pull request', () => {
    expect(select([branch('agent/sess_pr', '2026-10-01T00:00:00Z', 1)])).toEqual([])
  })

  it("keeps a routine's latest run branch", () => {
    expect(select([branch('agent/sess_latest', '2026-10-01T00:00:00Z')], ['agent/sess_latest'])).toEqual([])
  })

  it('ignores other branches and unknown commit dates', () => {
    expect(select([
      branch('main', '2020-01-01T00:00:00Z'),
      branch('claude/feature', '2020-01-01T00:00:00Z'),
      branch('agent/sess_nodate', ''),
    ])).toEqual([])
  })
})
