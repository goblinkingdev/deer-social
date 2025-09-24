import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['loadAsPngs']
type SetContext = (v: persisted.Schema['loadAsPngs']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.loadAsPngs,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['loadAsPngs']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('loadAsPngs'))

  const setStateWrapped = React.useCallback(
    (loadAsPngs: persisted.Schema['loadAsPngs']) => {
      setState(loadAsPngs)
      persisted.write('loadAsPngs', loadAsPngs)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('loadAsPngs', nextLoadAsPngs => {
      setState(nextLoadAsPngs)
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

export function useLoadAsPngs() {
  return React.useContext(stateContext)
}

export function useSetLoadAsPngs() {
  return React.useContext(setContext)
}
