import {useEffect, useState} from 'react'
import {View} from 'react-native'
import {parseLanguage} from '@atproto/api'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import lande from 'lande'

import {
  code2ToCode3,
  code3ToCode2Strict,
  codeToLanguageName,
  koreanRegex,
} from '#/locale/helpers'
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
  const languageHistory = langPrefs.postLanguageHistory.map(language =>
    code2ToCode3(language),
  )
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
      setSuggestedLanguage(guessLanguage(textTrimmed, languageHistory))
    })

    return () => cancelIdle(idle)
  }, [text, replyToLanguage, languageHistory])

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
            <Text style={[a.font_bold]}>{suggestedLanguageName}</Text>?
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
 * This function is using the lande language model to attempt to detect the language
 * We want to only make suggestions when we feel a high degree of certainty
 * The magic numbers are based on debugging sessions against some test strings
 */
function guessLanguage(
  text: string,
  languageHistory: string[],
): string | undefined {
  let scores = lande(text).filter(
    ([lang, value]) =>
      (value >= 0.9 || (languageHistory.includes(lang) && value >= 0.6)) &&
      !(lang === 'kor' && !koreanRegex.test(text)),
  )

  if (scores.length !== 1) {
    return undefined
  }
  const [lang, _] = scores[0]
  return code3ToCode2Strict(lang)
}

function cleanUpLanguage(text: string | undefined): string | undefined {
  if (!text) {
    return undefined
  }

  return parseLanguage(text)?.language
}
