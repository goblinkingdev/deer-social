import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableSavesMetrics – when true, disables saves metrics on posts

type StateContext = persisted.Schema['disableSavesMetrics']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableSavesMetrics']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableSavesMetrics,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableSavesMetrics']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('disableSavesMetrics'))

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableSavesMetrics']) => {
      setState(value)
      persisted.write('disableSavesMetrics', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableSavesMetrics', next => {
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

export function useDisableSavesMetrics() {
  return React.useContext(stateContext)
}

export function useSetDisableSavesMetrics() {
  return React.useContext(setContext)
}
