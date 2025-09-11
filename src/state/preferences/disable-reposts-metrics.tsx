import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableRepostsMetrics – when true, disables reposts metrics on posts

type StateContext = persisted.Schema['disableRepostsMetrics']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableRepostsMetrics']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableRepostsMetrics,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableRepostsMetrics']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableRepostsMetrics'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableRepostsMetrics']) => {
      setState(value)
      persisted.write('disableRepostsMetrics', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableRepostsMetrics', next => {
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

export function useDisableRepostsMetrics() {
  return React.useContext(stateContext)
}

export function useSetDisableRepostsMetrics() {
  return React.useContext(setContext)
}
