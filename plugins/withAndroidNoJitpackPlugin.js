const {withProjectBuildGradle} = require('@expo/config-plugins')

const jitpackRepository = "maven { url 'https://www.jitpack.io' }"

module.exports = function withAndroidNoJitpackPlugin(config) {
  return withProjectBuildGradle(config, config => {
    if (config.modResults.contents.includes(jitpackRepository)) {
      config.modResults.contents = config.modResults.contents.replaceAll(
        jitpackRepository,
        '',
      )
    }
    return config
  })
}
