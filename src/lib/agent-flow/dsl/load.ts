import { parse } from 'yaml'

/**
 * Parse a raw YAML or JSON string into a plain object.
 * Throws on parse failure with a descriptive message.
 */
export function loadFlow(source: string, format: 'yaml' | 'json' = 'yaml'): unknown {
  if (format === 'json') {
    try {
      return JSON.parse(source)
    } catch (err) {
      throw new Error(`Flow JSON parse error: ${(err as Error).message}`)
    }
  }

  try {
    return parse(source)
  } catch (err) {
    throw new Error(`Flow YAML parse error: ${(err as Error).message}`)
  }
}
