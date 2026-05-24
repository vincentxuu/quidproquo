import { describe, expect, it } from 'vitest'
import { parseArxivAtom } from './arxiv-reading'

const SAMPLE_ATOM = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ArXiv Query: id_list=2401.11817</title>
  <entry>
    <id>http://arxiv.org/abs/2401.11817v1</id>
    <title>Hallucination is Inevitable: An Innate Limitation of Large
      Language Models</title>
    <summary>  We show that hallucination is inevitable for any computable LLM,
  regardless of model architecture or training.  </summary>
    <author><name>Ziwei Xu</name></author>
    <author><name>Sanjay Jain</name></author>
    <author><name>Mohan Kankanhalli</name></author>
  </entry>
</feed>`

describe('parseArxivAtom', () => {
  it('extracts the entry title, abstract, and authors (collapsing whitespace)', () => {
    const meta = parseArxivAtom(SAMPLE_ATOM)
    expect(meta).not.toBeNull()
    expect(meta?.title).toBe('Hallucination is Inevitable: An Innate Limitation of Large Language Models')
    expect(meta?.abstract).toBe(
      'We show that hallucination is inevitable for any computable LLM, regardless of model architecture or training.',
    )
    expect(meta?.authors).toEqual(['Ziwei Xu', 'Sanjay Jain', 'Mohan Kankanhalli'])
  })

  it('does not pick up the feed-level title', () => {
    const meta = parseArxivAtom(SAMPLE_ATOM)
    expect(meta?.title).not.toContain('ArXiv Query')
  })

  it('decodes XML entities and CDATA', () => {
    const xml = `<feed><entry><title>A &amp; B &lt;tag&gt;</title><summary><![CDATA[x > y & z]]></summary></entry></feed>`
    const meta = parseArxivAtom(xml)
    expect(meta?.title).toBe('A & B <tag>')
    expect(meta?.abstract).toBe('x > y & z')
  })

  it('returns null when there is no entry', () => {
    expect(parseArxivAtom('<feed><title>empty</title></feed>')).toBeNull()
  })
})
