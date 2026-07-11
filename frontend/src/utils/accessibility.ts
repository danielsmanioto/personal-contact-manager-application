export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((x) => {
      x = x / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const parseRgb = (rgb: string): [number, number, number] => {
    const match = rgb.match(/\d+/g)
    return match ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])] : [0, 0, 0]
  }

  const [r1, g1, b1] = parseRgb(rgb1)
  const [r2, g2, b2] = parseRgb(rgb2)
  const l1 = getLuminance(r1, g1, b1)
  const l2 = getLuminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function meetsWCAGAA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5
}

export function createFocusStyle(): string {
  return 'outline-2 outline-primary-500 outline-offset-2'
}
