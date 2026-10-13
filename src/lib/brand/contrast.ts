const HEX_PATTERN = /^#[0-9a-f]{6}$/i

function channelToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string): number {
  if (!HEX_PATTERN.test(hex)) {
    throw new Error(`Expected a #rrggbb colour, got "${hex}"`)
  }
  const [r, g, b] = [1, 3, 5].map((i) => channelToLinear(parseInt(hex.slice(i, i + 2), 16)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2 contrast ratio between two #rrggbb colours (1 to 21). */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
