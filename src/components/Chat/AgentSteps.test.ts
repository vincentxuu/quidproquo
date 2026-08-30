import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AgentSteps } from './AgentSteps'

describe('AgentSteps', () => {
  it('shows unique post sources instead of raw evidence chunks', () => {
    const html = renderToStaticMarkup(createElement(AgentSteps, {
      steps: [{
        agent: 'Research',
        status: 'completed',
        sources_found: 8,
        evidence_chunks: 15,
      }],
    }))

    expect(html).toContain('搜尋文章')
    expect(html).toContain('8 篇')
    expect(html).not.toContain('>15<')
  })
})
