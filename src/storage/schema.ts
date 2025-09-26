import {type ID as PolicyUpdate202508} from '#/components/PolicyUpdateOverlay/updates/202508/config'

/**
 * Device data that's specific to the device and does not vary based account
 */
export type Device = {
  fontScale: '-2' | '-1' | '0' | '1' | '2'
  fontFamily: 'roboto-flex' | 'system' | 'inter'
  lastNuxDialog: string | undefined

  trendingBetaEnabled: boolean
  devMode: boolean
  demoMode: boolean

  // deer
  deerGateCache: string
  activitySubscriptionsNudged?: boolean

  /**
   * Policy update overlays. New IDs are required for each new announcement.
   */
  policyUpdateDebugOverride?: boolean
  [PolicyUpdate202508]?: boolean
}

export type Account = {
  searchTermHistory?: string[]
  searchAccountHistory?: string[]
}
