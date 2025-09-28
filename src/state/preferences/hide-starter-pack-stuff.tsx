import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['hideStarterPackStuff']
type SetContext = (v: persisted.Schema['hideStarterPackStuff']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.hideStarterPackStuff,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['hideStarterPackStuff']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('hideStarterPackStuff'),
  )

  const setStateWrapped = React.useCallback(
    (hideStarterPackStuff: persisted.Schema['hideStarterPackStuff']) => {
      setState(hideStarterPackStuff)
      persisted.write('hideStarterPackStuff', hideStarterPackStuff)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'hideStarterPackStuff',
      nexthideStarterPackStuff => {
        setState(nexthideStarterPackStuff)
      },
    )
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useHideStarterPackStuff() {
  return React.useContext(stateContext)
}

export function useSetHideStarterPackStuff() {
  return React.useContext(setContext)
}
