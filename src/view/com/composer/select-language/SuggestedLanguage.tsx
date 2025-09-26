import {useEffect, useMemo, useState} from 'react'
import {View} from 'react-native'
import {parseLanguage} from '@atproto/api'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {eldr} from 'eldr'

import {code3ToCode2, codeToLanguageName} from '#/locale/helpers'
import {
  toPostLanguages,
  useLanguagePrefs,
  useLanguagePrefsApi,
} from '#/state/preferences/languages'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {Earth_Stroke2_Corner2_Rounded as EarthIcon} from '#/components/icons/Globe'
import {Text} from '#/components/Typography'

// fallbacks for safari
const onIdle = globalThis.requestIdleCallback || (cb => setTimeout(cb, 1))
const cancelIdle = globalThis.cancelIdleCallback || clearTimeout

export function SuggestedLanguage({
  text,
  replyToLanguage: replyToLanguageProp,
}: {
  text: string
  replyToLanguage?: string
}) {
  const replyToLanguage = cleanUpLanguage(replyToLanguageProp)
  const [suggestedLanguage, setSuggestedLanguage] = useState<
    string | undefined
  >(text.length === 0 ? replyToLanguage : undefined)
  const langPrefs = useLanguagePrefs()
  const setLangPrefs = useLanguagePrefsApi()
  const languageHistory = useMemo(
    () =>
      new Set(langPrefs.postLanguageHistory.map(lang => code3ToCode2(lang))),
    [langPrefs.postLanguageHistory],
  )
  const postLanguage = code3ToCode2(langPrefs.postLanguage)
  const t = useTheme()
  const {_} = useLingui()

  useEffect(() => {
    // For replies, suggest the language of the post being replied to if no text
    // has been typed yet
    if (replyToLanguage && text.length === 0) {
      setSuggestedLanguage(replyToLanguage)
      return
    }

    const textTrimmed = text.trim()

    // Don't run the language model on small posts, the results are likely
    // to be inaccurate anyway.
    if (textTrimmed.length < 20) {
      setSuggestedLanguage(undefined)
      return
    }

    const idle = onIdle(() => {
      setSuggestedLanguage(
        guessLanguage(textTrimmed, languageHistory, postLanguage),
      )
    })

    return () => cancelIdle(idle)
  }, [text, replyToLanguage, languageHistory, postLanguage])

  if (
    suggestedLanguage &&
    !toPostLanguages(langPrefs.postLanguage).includes(suggestedLanguage)
  ) {
    const suggestedLanguageName = codeToLanguageName(
      suggestedLanguage,
      langPrefs.appLanguage,
    )

    return (
      <View
        style={[
          t.atoms.border_contrast_low,
          a.gap_sm,
          a.border,
          a.flex_row,
          a.align_center,
          a.rounded_sm,
          a.px_lg,
          a.py_md,
          a.mx_md,
          a.my_sm,
          t.atoms.bg,
        ]}>
        <EarthIcon />
        <Text style={[a.flex_1]}>
          <Trans>
            Are you writing in{' '}
            <Text style={[a.font_semi_bold]}>{suggestedLanguageName}</Text>?
          </Trans>
        </Text>

        <Button
          color="secondary"
          size="small"
          variant="solid"
          onPress={() => setLangPrefs.setPostLanguage(suggestedLanguage)}
          label={_(msg`Change post language to ${suggestedLanguageName}`)}>
          <ButtonText>
            <Trans>Yes</Trans>
          </ButtonText>
        </Button>
      </View>
    )
  } else {
    return null
  }
}

/**
 * This function is using the eldr language model to attempt to detect the language
 * We want to only make suggestions when we feel a high degree of certainty
 * The magic numbers are based on debugging sessions against some test strings
 */
function guessLanguage(
  text: string,
  languageHistory: Set<string>,
  postLanguage: string,
): string | undefined {
  const scores = eldr.detect(text).getScoresArray()

  let selected: string | undefined
  let selectedScore = 0.3

  for (const [lang, score] of scores) {
    const weightedScore =
      score *
      (languageHistory.has(lang) ? 2 : 1) *
      (postLanguage === lang ? 2 : 1)

    if (weightedScore >= selectedScore) {
      selected = lang
      selectedScore = weightedScore
    }
  }

  return selected
}

function cleanUpLanguage(text: string | undefined): string | undefined {
  if (!text) {
    return undefined
  }

  return parseLanguage(text)?.language
}
