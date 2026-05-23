import { describe, expect, it } from 'vitest'
import { csvSpreadsheetKind } from './csv-spreadsheet'

describe('csvSpreadsheetKind', () => {
  it('serializes a header + rows as RFC 4180 CSV', () => {
    const csv = csvSpreadsheetKind.serializer({
      headers: ['name', 'count'],
      rows: [
        ['alpha', 1],
        ['beta', 2],
      ],
    })
    expect(csv).toBe('name,count\r\nalpha,1\r\nbeta,2')
  })

  it('quotes fields with embedded comma, quote, or newline (RFC 4180)', () => {
    const csv = csvSpreadsheetKind.serializer({
      headers: ['a', 'b', 'c'],
      rows: [['x,y', 'he said "hi"', 'line1\nline2']],
    })
    expect(csv).toBe('a,b,c\r\n"x,y","he said ""hi""","line1\nline2"')
  })

  it('renders null cells as empty', () => {
    const csv = csvSpreadsheetKind.serializer({ headers: ['a', 'b'], rows: [['x', null]] })
    expect(csv).toBe('a,b\r\nx,')
  })

  it('extracts one section per row', () => {
    const sections = csvSpreadsheetKind.sectionExtractor!({
      headers: ['a'],
      rows: [['one'], ['two']],
    })
    expect(sections).toEqual([
      { sectionKey: 'row.0', bodyText: 'one' },
      { sectionKey: 'row.1', bodyText: 'two' },
    ])
  })
})
