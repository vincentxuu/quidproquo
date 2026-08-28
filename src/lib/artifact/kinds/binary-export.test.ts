import { describe, expect, it } from 'vitest'
import { pdfExportKind } from './pdf-export'
import { pptxExportKind } from './pptx-export'

describe('pdfExportKind', () => {
  it('serializes the document model deterministically', () => {
    const payload = { title: 'Doc', blocks: [{ type: 'heading', text: 'H' }] }
    const a = pdfExportKind.serializer(payload)
    const b = pdfExportKind.serializer(payload)
    expect(a).toBe(b)
    expect(JSON.parse(a)).toEqual(payload)
  })

  it('extracts one section per block', () => {
    const sections = pdfExportKind.sectionExtractor!({
      title: 'Doc',
      blocks: [{ text: 'one' }, { text: 'two' }],
    })
    expect(sections.map((s) => s.bodyText)).toEqual(['one', 'two'])
  })
})

describe('pptxExportKind', () => {
  it('serializes the deck model deterministically with sorted keys', () => {
    const payload = { title: 'Deck', slides: [{ title: 'S1', bullets: ['a', 'b'] }] }
    expect(pptxExportKind.serializer(payload)).toBe(pptxExportKind.serializer(payload))
  })

  it('extracts one section per slide with heading + joined bullets', () => {
    const sections = pptxExportKind.sectionExtractor!({
      title: 'Deck',
      slides: [{ title: 'Intro', bullets: ['x', 'y'] }],
    })
    expect(sections[0]).toEqual({ sectionKey: 'slide.0', bodyText: 'x\ny', heading: 'Intro' })
  })
})
