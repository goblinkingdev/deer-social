import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableViaRepostNotification – when true, disables notifications sent when liking/reposting a post someone else reposted

type StateContext = persisted.Schema['disableViaRepostNotification']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableViaRepostNotification']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableViaRepostNotification,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableViaRepostNotification']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableViaRepostNotification'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableViaRepostNotification']) => {
      setState(value)
      persisted.write('disableViaRepostNotification', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableViaRepostNotification', next => {
      setState(next)
    })
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useDisableViaRepostNotification() {
  return React.useContext(stateContext)
}

export function useSetDisableViaRepostNotification() {
  return React.useContext(setContext)
}
