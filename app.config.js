const pkg = require('./package.json')

module.exports = function (_config) {
  /**
   * App version number. Should be incremented as part of a release cycle.
   */
  const VERSION = pkg.version

  /**
   * Uses built-in Expo env vars
   *
   * @see https://docs.expo.dev/build-reference/variables/#built-in-environment-variables
   */
  const PLATFORM = process.env.EAS_BUILD_PLATFORM

  const IS_TESTFLIGHT = process.env.EXPO_PUBLIC_ENV === 'testflight'
  const IS_PRODUCTION = process.env.EXPO_PUBLIC_ENV === 'production'
  const IS_DEV =
    process.env.EXPO_PUBLIC_ENV === 'development' ||
    (!IS_TESTFLIGHT && !IS_PRODUCTION)

  const ASSOCIATED_DOMAINS = [
    'applinks:pages.dev.deer-social-7m8',
    // When testing local services, enter an ngrok (et al) domain here. It must use a standard HTTP/HTTPS port.
    ...(IS_DEV || IS_TESTFLIGHT ? [] : []),
  ]

  // const UPDATES_CHANNEL = IS_TESTFLIGHT
  //   ? 'testflight'
  //   : IS_PRODUCTION
  //   ? 'production'
  //   : undefined
  // const UPDATES_ENABLED = !!UPDATES_CHANNEL
  const UPDATES_ENABLED = IS_TESTFLIGHT || IS_PRODUCTION

  return {
    expo: {
      version: VERSION,
      name: IS_DEV ? 'Deer (dev)' : 'Deer',
      slug: 'deer',
      scheme: ['bluesky', 'deer'],
      // owner: 'blueskysocial',
      // owner: 'neema.brown',
      runtimeVersion: {
        policy: 'appVersion',
      },
      icon: IS_DEV
        ? './assets/app-icons/ios_icon_dev.png'
        : './assets/app-icons/ios_icon_default_light.png',
      userInterfaceStyle: 'automatic',
      primaryColor: '#4b9b6c',
      newArchEnabled: false,
      ios: {
        supportsTablet: false,
        bundleIdentifier: 'deer-social-7m8.pages.dev',
        config: {
          usesNonExemptEncryption: false,
        },
        infoPlist: {
          UIBackgroundModes: ['remote-notification'],
          NSCameraUsageDescription:
            'Used for profile pictures, posts, and other kinds of content.',
          NSMicrophoneUsageDescription:
            'Used for posts and other kinds of content.',
          NSPhotoLibraryAddUsageDescription:
            'Used to save images to your library.',
          NSPhotoLibraryUsageDescription:
            'Used for profile pictures, posts, and other kinds of content',
          CFBundleSpokenName: 'Deer',
          CFBundleLocalizations: [
            'en',
            'an',
            'ast',
            'ca',
            'cy',
            'da',
            'de',
            'el',
            'eo',
            'es',
            'eu',
            'fi',
            'fr',
            'fy',
            'ga',
            'gd',
            'gl',
            'hi',
            'hu',
            'ia',
            'id',
            'it',
            'ja',
            'km',
            'ko',
            'ne',
            'nl',
            'pl',
            'pt-BR',
            'pt-PT',
            'ro',
            'ru',
            'sv',
            'th',
            'tr',
            'uk',
            'vi',
            'yue',
            'zh-Hans',
            'zh-Hant',
          ],
          UIDesignRequiresCompatibility: true,
        },
        associatedDomains: ASSOCIATED_DOMAINS,
        entitlements: {
          'com.apple.developer.kernel.increased-memory-limit': true,
          'com.apple.developer.kernel.extended-virtual-addressing': true,
          'com.apple.security.application-groups':
            'group.dev.pages.deer-social-7m8',
        },
        privacyManifests: {
          NSPrivacyAccessedAPITypes: [
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategoryFileTimestamp',
              NSPrivacyAccessedAPITypeReasons: ['C617.1', '3B52.1', '0A2A.1'],
            },
            {
              NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
              NSPrivacyAccessedAPITypeReasons: ['E174.1', '85F4.1'],
            },
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategorySystemBootTime',
              NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
            },
            {
              NSPrivacyAccessedAPIType:
                'NSPrivacyAccessedAPICategoryUserDefaults',
              NSPrivacyAccessedAPITypeReasons: ['CA92.1', '1C8F.1'],
            },
          ],
        },
      },
      androidStatusBar: {
        barStyle: 'light-content',
      },
      // Dark nav bar in light mode is better than light nav bar in dark mode
      androidNavigationBar: {
        barStyle: 'light-content',
      },
      android: {
        icon: IS_DEV
          ? './assets/app-icons/android_icon_dev.png'
          : './assets/app-icons/android_icon_default_light.png',
        adaptiveIcon: {
          foregroundImage: './assets/icon-android-foreground.png',
          monochromeImage: './assets/icon-android-foreground.png',
          backgroundImage: './assets/icon-android-background.png',
          backgroundColor: '#4b9b6c',
        },
        googleServicesFile: './google-services.json',
        package: 'dev.pages.deer_social',
        intentFilters: [
          {
            action: 'VIEW',
            autoVerify: true,
            data: [
              {
                scheme: 'https',
                host: 'deer-social-7m8.pages.dev',
              },
              {
                scheme: 'https',
                host: 'deer-social-7m8.pages.dev',
              },
              {
                scheme: 'https',
                host: 'deer.social',
              },
              {
                scheme: 'https',
                host: 'bsky.app',
              },
              IS_DEV && {
                scheme: 'http',
                host: 'localhost:19006',
              },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
      },
      web: {
        favicon: './assets/favicon.png',
      },
      // updates: {
      //   url: 'https://updates.bsky.app/manifest',
      //   enabled: UPDATES_ENABLED,
      //   fallbackToCacheTimeout: 30000,
      //   codeSigningCertificate: UPDATES_ENABLED
      //     ? './code-signing/certificate.pem'
      //     : undefined,
      //   codeSigningMetadata: UPDATES_ENABLED
      //     ? {
      //         keyid: 'main',
      //         alg: 'rsa-v1_5-sha256',
      //       }
      //     : undefined,
      //   checkAutomatically: 'NEVER',
      //   channel: UPDATES_CHANNEL,
      // },
      updates: {
        url: 'https://updates.bsky.app/manifest',
        enabled: UPDATES_ENABLED,
        fallbackToCacheTimeout: 30000,
        codeSigningCertificate: UPDATES_ENABLED
          ? './code-signing/certificate.pem'
          : undefined,
        codeSigningMetadata: UPDATES_ENABLED
          ? {
              keyid: 'main',
              alg: 'rsa-v1_5-sha256',
            }
          : undefined,
        checkAutomatically: 'NEVER',
      },
      plugins: [
        'expo-video',
        'expo-localization',
        'expo-web-browser',
        [
          'react-native-edge-to-edge',
          {android: {enforceNavigationBarContrast: false}},
        ],
        [
          'expo-build-properties',
          {
            ios: {
              deploymentTarget: '15.1',
              buildReactNativeFromSource: true,
            },
            android: {
              compileSdkVersion: 35,
              targetSdkVersion: 35,
              buildToolsVersion: '35.0.0',
            },
          },
        ],
        [
          'expo-notifications',
          {
            icon: './assets/icon-android-notification.png',
            color: '#4b9b6c',
            sounds: PLATFORM === 'ios' ? ['assets/dm.aiff'] : ['assets/dm.mp3'],
          },
        ],
        'react-native-compressor',
        './plugins/starterPackAppClipExtension/withStarterPackAppClip.js',
        './plugins/withGradleJVMHeapSizeIncrease.js',
        './plugins/withAndroidManifestLargeHeapPlugin.js',
        './plugins/withAndroidManifestIntentQueriesPlugin.js',
        './plugins/withAndroidStylesAccentColorPlugin.js',
        './plugins/withAndroidDayNightThemePlugin.js',
        './plugins/withAndroidNoJitpackPlugin.js',
        './plugins/shareExtension/withShareExtensions.js',
        './plugins/notificationsExtension/withNotificationsExtension.js',
        [
          'expo-font',
          {
            fonts: [
              './assets/fonts/roboto-flex/Roboto-Flex.ttf',
              './assets/fonts/inter/InterVariable.woff2',
              './assets/fonts/inter/InterVariable-Italic.woff2',
              // Android only
              './assets/fonts/inter/Inter-Regular.otf',
              './assets/fonts/inter/Inter-Italic.otf',
              './assets/fonts/inter/Inter-Medium.otf',
              './assets/fonts/inter/Inter-MediumItalic.otf',
              './assets/fonts/inter/Inter-SemiBold.otf',
              './assets/fonts/inter/Inter-SemiBoldItalic.otf',
              './assets/fonts/inter/Inter-Bold.otf',
              './assets/fonts/inter/Inter-BoldItalic.otf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xl-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-2xs-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-3xl-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-4xl-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-5xl-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-lg-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-md-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-sm-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xl-semibold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-bold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-bold.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-medium-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-medium.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-normal-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-normal.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-semibold-italic.ttf',
              './assets/fonts/roboto-flex/RobotoFlex-xs-semibold.ttf',
            ],
          },
        ],
        [
          'expo-splash-screen',
          {
            ios: {
              enableFullScreenImage_legacy: true,
              backgroundColor: '#ffffff',
              image: './assets/splash.png',
              resizeMode: 'cover',
              dark: {
                enableFullScreenImage_legacy: true,
                backgroundColor: '#03180c',
                image: './assets/splash-dark.png',
                resizeMode: 'cover',
              },
            },
            android: {
              backgroundColor: '#4b9b6c',
              image: './assets/splash-android-icon.png',
              imageWidth: 150,
              dark: {
                backgroundColor: '#01331a',
                image: './assets/splash-android-icon-dark.png',
                imageWidth: 150,
              },
            },
          },
        ],
        [
          '@mozzius/expo-dynamic-app-icon',
          {
            /**
             * Default set
             */
            default_light: {
              ios: './assets/app-icons/ios_icon_default_light.png',
              android: './assets/app-icons/android_icon_default_light.png',
              prerendered: true,
            },
            default_dark: {
              ios: './assets/app-icons/ios_icon_default_dark.png',
              android: './assets/app-icons/android_icon_default_dark.png',
              prerendered: true,
            },
            dev: {
              ios: './assets/app-icons/ios_icon_dev.png',
              android: './assets/app-icons/android_icon_dev.png',
              prerendered: true,
            },

            /**
             * Bluesky+ core set
             */
            // core_aurora: {
            //   ios: './assets/app-icons/ios_icon_core_aurora.png',
            //   android: './assets/app-icons/android_icon_core_aurora.png',
            //   prerendered: true,
            // },
            // core_bonfire: {
            //   ios: './assets/app-icons/ios_icon_core_bonfire.png',
            //   android: './assets/app-icons/android_icon_core_bonfire.png',
            //   prerendered: true,
            // },
            // core_sunrise: {
            //   ios: './assets/app-icons/ios_icon_core_sunrise.png',
            //   android: './assets/app-icons/android_icon_core_sunrise.png',
            //   prerendered: true,
            // },
            // core_sunset: {
            //   ios: './assets/app-icons/ios_icon_core_sunset.png',
            //   android: './assets/app-icons/android_icon_core_sunset.png',
            //   prerendered: true,
            // },
            // core_midnight: {
            //   ios: './assets/app-icons/ios_icon_core_midnight.png',
            //   android: './assets/app-icons/android_icon_core_midnight.png',
            //   prerendered: true,
            // },
            // core_flat_blue: {
            //   ios: './assets/app-icons/ios_icon_core_flat_blue.png',
            //   android: './assets/app-icons/android_icon_core_flat_blue.png',
            //   prerendered: true,
            // },
            // core_flat_white: {
            //   ios: './assets/app-icons/ios_icon_core_flat_white.png',
            //   android: './assets/app-icons/android_icon_core_flat_white.png',
            //   prerendered: true,
            // },
            // core_flat_black: {
            //   ios: './assets/app-icons/ios_icon_core_flat_black.png',
            //   android: './assets/app-icons/android_icon_core_flat_black.png',
            //   prerendered: true,
            // },
            // core_classic: {
            //   ios: './assets/app-icons/ios_icon_core_classic.png',
            //   android: './assets/app-icons/android_icon_core_classic.png',
            //   prerendered: true,
            // },
          },
        ],
        ['expo-screen-orientation', {initialOrientation: 'PORTRAIT_UP'}],
      ].filter(Boolean),
      extra: {
        eas: {
          build: {
            experimental: {
              ios: {
                // appExtensions: [
                //   {
                //     targetName: 'Share-with-Bluesky',
                //     bundleIdentifier: 'xyz.blueskyweb.app.Share-with-Bluesky',
                //     entitlements: {
                //       'com.apple.security.application-groups': [
                //         'group.app.bsky',
                //       ],
                //     },
                //   },
                //   {
                //     targetName: 'BlueskyNSE',
                //     bundleIdentifier: 'xyz.blueskyweb.app.BlueskyNSE',
                //     entitlements: {
                //       'com.apple.security.application-groups': [
                //         'group.app.bsky',
                //       ],
                //     },
                //   },
                //   {
                //     targetName: 'BlueskyClip',
                //     bundleIdentifier: 'xyz.blueskyweb.app.AppClip',
                //   },
                // ],
              },
            },
          },
          projectId: '2be8925e-1389-44f9-89b9-d5159691e8af',
        },
      },
    },
  }
}
