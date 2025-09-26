import {createThemes, type Palette} from '@bsky.app/alf'

import {
  BLUE_HUE,
  defaultScale,
  dimScale,
  GREEN_HUE,
  RED_HUE,
} from '#/alf/util/colorGeneration'

const hues = {
  primary: BLUE_HUE,
  negative: RED_HUE,
  positive: GREEN_HUE,
  accent: 145,
  accentDim: 140,
} as const

const PALETTE: Palette = {
  white: '#ffffff',
  black: '#000000',
  like: '#ec4899',

  contrast_0: `hsl(${hues.primary}, 20%, ${defaultScale[14]}%)`,
  contrast_25: `hsl(${hues.primary}, 20%, ${defaultScale[13]}%)`,
  contrast_50: `hsl(${hues.primary}, 20%, ${defaultScale[12]}%)`,
  contrast_100: `hsl(${hues.primary}, 20%, ${defaultScale[11]}%)`,
  contrast_200: `hsl(${hues.primary}, 20%, ${defaultScale[10]}%)`,
  contrast_300: `hsl(${hues.primary}, 20%, ${defaultScale[9]}%)`,
  contrast_400: `hsl(${hues.primary}, 20%, ${defaultScale[8]}%)`,
  contrast_500: `hsl(${hues.primary}, 20%, ${defaultScale[7]}%)`,
  contrast_600: `hsl(${hues.primary}, 24%, ${defaultScale[6]}%)`,
  contrast_700: `hsl(${hues.primary}, 24%, ${defaultScale[5]}%)`,
  contrast_800: `hsl(${hues.primary}, 28%, ${defaultScale[4]}%)`,
  contrast_900: `hsl(${hues.primary}, 28%, ${defaultScale[3]}%)`,
  contrast_950: `hsl(${hues.primary}, 28%, ${defaultScale[2]}%)`,
  contrast_975: `hsl(${hues.primary}, 28%, ${defaultScale[1]}%)`,
  contrast_1000: '#000000',

  primary_25: `hsl(${hues.accent}, 30%, 97%)`,
  primary_50: `hsl(${hues.accent}, 30%, 95%)`,
  primary_100: `hsl(${hues.accent}, 30%, 90%)`,
  primary_200: `hsl(${hues.accent}, 32%, 80%)`,
  primary_300: `hsl(${hues.accent}, 34%, 70%)`,
  primary_400: `hsl(${hues.accent}, 35%, 58%)`,
  primary_500: `hsl(${hues.accent}, 35%, 45%)`,
  primary_600: `hsl(${hues.accent}, 38%, 38%)`,
  primary_700: `hsl(${hues.accent}, 40%, 32%)`,
  primary_800: `hsl(${hues.accent}, 42%, 25%)`,
  primary_900: `hsl(${hues.accent}, 45%, 18%)`,
  primary_950: `hsl(${hues.accent}, 48%, 10%)`,
  primary_975: `hsl(${hues.accent}, 50%, 7%)`,

  positive_25: `hsl(${hues.positive}, 82%, 97%)`,
  positive_50: `hsl(${hues.positive}, 82%, 95%)`,
  positive_100: `hsl(${hues.positive}, 82%, 90%)`,
  positive_200: `hsl(${hues.positive}, 82%, 80%)`,
  positive_300: `hsl(${hues.positive}, 82%, 70%)`,
  positive_400: `hsl(${hues.positive}, 82%, 60%)`,
  positive_500: `hsl(${hues.positive}, 82%, 50%)`,
  positive_600: `hsl(${hues.positive}, 82%, 42%)`,
  positive_700: `hsl(${hues.positive}, 82%, 34%)`,
  positive_800: `hsl(${hues.positive}, 82%, 26%)`,
  positive_900: `hsl(${hues.positive}, 82%, 18%)`,
  positive_950: `hsl(${hues.positive}, 82%, 10%)`,
  positive_975: `hsl(${hues.positive}, 82%, 7%)`,

  negative_25: `hsl(${hues.negative}, 91%, 97%)`,
  negative_50: `hsl(${hues.negative}, 91%, 95%)`,
  negative_100: `hsl(${hues.negative}, 91%, 90%)`,
  negative_200: `hsl(${hues.negative}, 91%, 80%)`,
  negative_300: `hsl(${hues.negative}, 91%, 70%)`,
  negative_400: `hsl(${hues.negative}, 91%, 60%)`,
  negative_500: `hsl(${hues.negative}, 91%, 50%)`,
  negative_600: `hsl(${hues.negative}, 91%, 42%)`,
  negative_700: `hsl(${hues.negative}, 91%, 34%)`,
  negative_800: `hsl(${hues.negative}, 91%, 26%)`,
  negative_900: `hsl(${hues.negative}, 91%, 18%)`,
  negative_950: `hsl(${hues.negative}, 91%, 10%)`,
  negative_975: `hsl(${hues.negative}, 91%, 7%)`,
} as const

const SUBDUED_PALETTE: Palette = {
  white: '#ffffff',
  black: '#000000',
  like: '#ec4899',

  contrast_0: `hsl(${hues.primary}, 20%, ${dimScale[14]}%)`,
  contrast_25: `hsl(${hues.primary}, 20%, ${dimScale[13]}%)`,
  contrast_50: `hsl(${hues.primary}, 20%, ${dimScale[12]}%)`,
  contrast_100: `hsl(${hues.primary}, 20%, ${dimScale[11]}%)`,
  contrast_200: `hsl(${hues.primary}, 20%, ${dimScale[10]}%)`,
  contrast_300: `hsl(${hues.primary}, 24%, ${dimScale[9]}%)`,
  contrast_400: `hsl(${hues.primary}, 24%, ${dimScale[8]}%)`,
  contrast_500: `hsl(${hues.primary}, 28%, ${dimScale[7]}%)`,
  contrast_600: `hsl(${hues.primary}, 28%, ${dimScale[6]}%)`,
  contrast_700: `hsl(${hues.primary}, 28%, ${dimScale[5]}%)`,
  contrast_800: `hsl(${hues.primary}, 28%, ${dimScale[4]}%)`,
  contrast_900: `hsl(${hues.primary}, 28%, ${dimScale[3]}%)`,
  contrast_950: `hsl(${hues.primary}, 28%, ${dimScale[2]}%)`,
  contrast_975: `hsl(${hues.primary}, 28%, ${dimScale[1]}%)`,
  contrast_1000: `hsl(${hues.primary}, 28%, ${dimScale[0]}%)`,

  primary_25: `hsl(${hues.accentDim}, 55%, ${dimScale[13]}%)`,
  primary_50: `hsl(${hues.accentDim}, 50%, ${dimScale[12]}%)`,
  primary_100: `hsl(${hues.accentDim}, 48%, ${dimScale[11]}%)`,
  primary_200: `hsl(${hues.accentDim}, 45%, ${dimScale[10]}%)`,
  primary_300: `hsl(${hues.accentDim}, 42%, ${dimScale[9]}%)`,
  primary_400: `hsl(${hues.accentDim}, 38%, ${dimScale[8]}%)`,
  primary_500: `hsl(${hues.accentDim}, 35%, ${dimScale[7]}%)`,
  primary_600: `hsl(${hues.accentDim}, 32%, ${dimScale[6]}%)`,
  primary_700: `hsl(${hues.accentDim}, 28%, ${dimScale[5]}%)`,
  primary_800: `hsl(${hues.accentDim}, 25%, ${dimScale[4]}%)`,
  primary_900: `hsl(${hues.accentDim}, 22%, ${dimScale[3]}%)`,
  primary_950: `hsl(${hues.accentDim}, 18%, ${dimScale[2]}%)`,
  primary_975: `hsl(${hues.accentDim}, 15%, ${dimScale[1]}%)`,

  positive_25: `hsl(${hues.positive}, 82%, ${dimScale[13]}%)`,
  positive_50: `hsl(${hues.positive}, 82%, ${dimScale[12]}%)`,
  positive_100: `hsl(${hues.positive}, 82%, ${dimScale[11]}%)`,
  positive_200: `hsl(${hues.positive}, 82%, ${dimScale[10]}%)`,
  positive_300: `hsl(${hues.positive}, 82%, ${dimScale[9]}%)`,
  positive_400: `hsl(${hues.positive}, 82%, ${dimScale[8]}%)`,
  positive_500: `hsl(${hues.positive}, 82%, ${dimScale[7]}%)`,
  positive_600: `hsl(${hues.positive}, 82%, ${dimScale[6]}%)`,
  positive_700: `hsl(${hues.positive}, 70%, ${dimScale[5]}%)`,
  positive_800: `hsl(${hues.positive}, 60%, ${dimScale[4]}%)`,
  positive_900: `hsl(${hues.positive}, 50%, ${dimScale[3]}%)`,
  positive_950: `hsl(${hues.positive}, 40%, ${dimScale[2]}%)`,
  positive_975: `hsl(${hues.positive}, 30%, ${dimScale[1]}%)`,

  negative_25: `hsl(${hues.negative}, 91%, ${dimScale[13]}%)`,
  negative_50: `hsl(${hues.negative}, 91%, ${dimScale[12]}%)`,
  negative_100: `hsl(${hues.negative}, 91%, ${dimScale[11]}%)`,
  negative_200: `hsl(${hues.negative}, 91%, ${dimScale[10]}%)`,
  negative_300: `hsl(${hues.negative}, 91%, ${dimScale[9]}%)`,
  negative_400: `hsl(${hues.negative}, 91%, ${dimScale[8]}%)`,
  negative_500: `hsl(${hues.negative}, 91%, ${dimScale[7]}%)`,
  negative_600: `hsl(${hues.negative}, 88%, ${dimScale[6]}%)`,
  negative_700: `hsl(${hues.negative}, 84%, ${dimScale[5]}%)`,
  negative_800: `hsl(${hues.negative}, 80%, ${dimScale[4]}%)`,
  negative_900: `hsl(${hues.negative}, 70%, ${dimScale[3]}%)`,
  negative_950: `hsl(${hues.negative}, 60%, ${dimScale[2]}%)`,
  negative_975: `hsl(${hues.negative}, 50%, ${dimScale[1]}%)`,
} as const

const DEFAULT_THEMES = createThemes({
  defaultPalette: PALETTE,
  subduedPalette: SUBDUED_PALETTE,
})

export const themes = {
  lightPalette: DEFAULT_THEMES.light.palette,
  darkPalette: DEFAULT_THEMES.dark.palette,
  dimPalette: DEFAULT_THEMES.dim.palette,
  light: DEFAULT_THEMES.light,
  dark: DEFAULT_THEMES.dark,
  dim: DEFAULT_THEMES.dim,
}

/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const lightPalette = DEFAULT_THEMES.light.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const darkPalette = DEFAULT_THEMES.dark.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const dimPalette = DEFAULT_THEMES.dim.palette
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const light = DEFAULT_THEMES.light
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dark = DEFAULT_THEMES.dark
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dim = DEFAULT_THEMES.dim
