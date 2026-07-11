import { colorPalette } from '@design-tokens/colors'
import { typography } from '@design-tokens/typography'
import { spacing } from '@design-tokens/spacing'
import { animations } from '@design-tokens/animations'
import { breakpoints } from '@design-tokens/breakpoints'
import { shadows, borderRadius } from '@design-tokens/shadows'

export function useDesignTokens() {
  return {
    colors: colorPalette,
    typography,
    spacing,
    animations,
    breakpoints,
    shadows,
    borderRadius,
  }
}
