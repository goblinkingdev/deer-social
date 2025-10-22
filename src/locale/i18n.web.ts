import {useEffect} from 'react'
import {i18n} from '@lingui/core'

import {sanitizeAppLanguageSetting} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'
import {useLanguagePrefs} from '#/state/preferences'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: AppLanguage) {
  let mod: any

  switch (locale) {
    case AppLanguage.an: {
      mod = await import(`./locales/an/messages.js`)
      break
    }
    case AppLanguage.ast: {
      mod = await import(`./locales/ast/messages.js`)
      break
    }
    case AppLanguage.ca: {
      mod = await import(`./locales/ca/messages.js`)
      break
    }
    case AppLanguage.cy: {
      mod = await import(`./locales/cy/messages.js`)
      break
    }
    case AppLanguage.da: {
      mod = await import(`./locales/da/messages.js`)
      break
    }
    case AppLanguage.de: {
      mod = await import(`./locales/de/messages.js`)
      break
    }
    case AppLanguage.el: {
      mod = await import(`./locales/el/messages.js`)
      break
    }
    case AppLanguage.en_GB: {
      mod = await import(`./locales/en-GB/messages.js`)
      break
    }
    case AppLanguage.eo: {
      mod = await import(`./locales/eo/messages.js`)
      break
    }
    case AppLanguage.es: {
      mod = await import(`./locales/es/messages.js`)
      break
    }
    case AppLanguage.eu: {
      mod = await import(`./locales/eu/messages.js`)
      break
    }
    case AppLanguage.fi: {
      mod = await import(`./locales/fi/messages.js`)
      break
    }
    case AppLanguage.fr: {
      mod = await import(`./locales/fr/messages.js`)
      break
    }
    case AppLanguage.fy: {
      mod = await import(`./locales/fy/messages.js`)
      break
    }
    case AppLanguage.ga: {
      mod = await import(`./locales/ga/messages.js`)
      break
    }
    case AppLanguage.gd: {
      mod = await import(`./locales/gd/messages.js`)
      break
    }
    case AppLanguage.gl: {
      mod = await import(`./locales/gl/messages.js`)
      break
    }
    case AppLanguage.hi: {
      mod = await import(`./locales/hi/messages.js`)
      break
    }
    case AppLanguage.hu: {
      mod = await import(`./locales/hu/messages.js`)
      break
    }
    case AppLanguage.ia: {
      mod = await import(`./locales/ia/messages.js`)
      break
    }
    case AppLanguage.id: {
      mod = await import(`./locales/id/messages.js`)
      break
    }
    case AppLanguage.it: {
      mod = await import(`./locales/it/messages.js`)
      break
    }
    case AppLanguage.ja: {
      mod = await import(`./locales/ja/messages.js`)
      break
    }
    case AppLanguage.km: {
      mod = await import(`./locales/km/messages.js`)
      break
    }
    case AppLanguage.ko: {
      mod = await import(`./locales/ko/messages.js`)
      break
    }
    case AppLanguage.ne: {
      mod = await import(`./locales/ne/messages.js`)
      break
    }
    case AppLanguage.nl: {
      mod = await import(`./locales/nl/messages.js`)
      break
    }
    case AppLanguage.pl: {
      mod = await import(`./locales/pl/messages.js`)
      break
    }
    case AppLanguage.pt_BR: {
      mod = await import(`./locales/pt-BR/messages.js`)
      break
    }
    case AppLanguage.pt_PT: {
      mod = await import(`./locales/pt-PT/messages.js`)
      break
    }
    case AppLanguage.ro: {
      mod = await import(`./locales/ro/messages.js`)
      break
    }
    case AppLanguage.ru: {
      mod = await import(`./locales/ru/messages.js`)
      break
    }
    case AppLanguage.sv: {
      mod = await import(`./locales/sv/messages.js`)
      break
    }
    case AppLanguage.th: {
      mod = await import(`./locales/th/messages.js`)
      break
    }
    case AppLanguage.tr: {
      mod = await import(`./locales/tr/messages.js`)
      break
    }
    case AppLanguage.uk: {
      mod = await import(`./locales/uk/messages.js`)
      break
    }
    case AppLanguage.vi: {
      mod = await import(`./locales/vi/messages.js`)
      break
    }
    case AppLanguage.zh_CN: {
      mod = await import(`./locales/zh-CN/messages.js`)
      break
    }
    case AppLanguage.zh_HK: {
      mod = await import(`./locales/zh-HK/messages.js`)
      break
    }
    case AppLanguage.zh_TW: {
      mod = await import(`./locales/zh-TW/messages.js`)
      break
    }
    default: {
      mod = await import(`./locales/en/messages.js`)
      break
    }
  }

  i18n.load(locale, mod.messages)
  i18n.activate(locale)
}

export function useLocaleLanguage() {
  const {appLanguage} = useLanguagePrefs()
  useEffect(() => {
    const sanitizedLanguage = sanitizeAppLanguageSetting(appLanguage)

    document.documentElement.lang = sanitizedLanguage
    dynamicActivate(sanitizedLanguage)
  }, [appLanguage])
}
