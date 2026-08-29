import { describe, expect, it } from 'vitest'

import { privateKeyPemToPkcs8Der } from './app'

const PKCS8_SAMPLE = [0x30, 0x03, 0x02, 0x01, 0x00]
const PKCS1_SAMPLE = [0x30, 0x03, 0x02, 0x01, 0x00]
const RSA_ENCRYPTION_OID = [0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01]

function bytesToBase64(bytes: number[]): string {
  return btoa(String.fromCharCode(...bytes))
}

function pem(label: string, body: string): string {
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`
}

function bytes(buffer: ArrayBuffer): number[] {
  return Array.from(new Uint8Array(buffer))
}

function includesSubarray(source: number[], needle: number[]): boolean {
  return source.some((_, index) => needle.every((value, offset) => source[index + offset] === value))
}

describe('privateKeyPemToPkcs8Der', () => {
  it('passes PKCS#8 private keys through', () => {
    const der = privateKeyPemToPkcs8Der(pem('PRIVATE KEY', bytesToBase64(PKCS8_SAMPLE)))

    expect(bytes(der)).toEqual(PKCS8_SAMPLE)
  })

  it('wraps GitHub App RSA private keys as PKCS#8', () => {
    const der = bytes(privateKeyPemToPkcs8Der(pem('RSA PRIVATE KEY', bytesToBase64(PKCS1_SAMPLE))))

    expect(der[0]).toBe(0x30)
    expect(includesSubarray(der, RSA_ENCRYPTION_OID)).toBe(true)
    expect(includesSubarray(der, [0x04, PKCS1_SAMPLE.length, ...PKCS1_SAMPLE])).toBe(true)
  })

  it('accepts escaped newline secrets', () => {
    const escaped = pem('PRIVATE KEY', bytesToBase64(PKCS8_SAMPLE)).replace(/\n/g, '\\n')

    expect(bytes(privateKeyPemToPkcs8Der(escaped))).toEqual(PKCS8_SAMPLE)
  })

  it('reports invalid PEM base64 clearly', () => {
    expect(() => privateKeyPemToPkcs8Der(pem('RSA PRIVATE KEY', 'not-a-valid-pem-body'))).toThrow(
      /invalid base64 payload/,
    )
  })
})
