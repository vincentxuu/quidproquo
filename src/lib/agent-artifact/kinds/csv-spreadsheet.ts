import type { ArtifactKindDefinition, ExtractedSection } from '../registry/types'

type CsvCell = string | number | null

interface CsvPayload {
  headers?: string[]
  rows?: CsvCell[][]
}

/** RFC 4180: quote a field containing comma, double-quote, CR or LF; escape `"` as `""`. */
function encodeField(cell: CsvCell): string {
  const value = cell === null || cell === undefined ? '' : String(cell)
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function encodeRow(row: CsvCell[]): string {
  return row.map(encodeField).join(',')
}

function serializer(payload: CsvPayload): string {
  const lines: string[] = []
  if (Array.isArray(payload.headers)) lines.push(encodeRow(payload.headers))
  if (Array.isArray(payload.rows)) {
    for (const row of payload.rows) lines.push(encodeRow(row))
  }
  // RFC 4180 uses CRLF line endings.
  return lines.join('\r\n')
}

function sectionExtractor(payload: CsvPayload): ExtractedSection[] {
  if (!Array.isArray(payload.rows)) return []
  return payload.rows.map((row, index) => ({
    sectionKey: `row.${index}`,
    bodyText: encodeRow(row),
  }))
}

export const csvSpreadsheetKind: ArtifactKindDefinition = {
  kind: 'csv_spreadsheet',
  version: 1,
  contentType: 'text/csv',
  payloadSchema: {
    type: 'object',
    required: ['headers', 'rows'],
    properties: {
      headers: { type: 'array' },
      rows: { type: 'array' },
    },
  },
  serializer,
  sectionExtractor,
}
