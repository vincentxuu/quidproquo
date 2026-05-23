// matchesRegion('us-east-1', 'us-*') → true
// matchesRegion('eu-west-1', 'us-*') → false
// matchesRegion('us-east-1', 'us-east-1') → true
export function matchesRegion(providerRegion: string, policyRegion: string): boolean {
  if (!policyRegion.includes('*')) return providerRegion === policyRegion
  const pattern = new RegExp('^' + policyRegion.replace(/\*/g, '.*') + '$')
  return pattern.test(providerRegion)
}
