import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['fullsizeFormat']
type SetContext = (v: persisted.Schema['fullsizeFormat']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.fullsizeFormat,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['fullsizeFormat']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('fullsizeFormat'))

  const setStateWrapped = React.useCallback(
    (fullsizeFormat: persisted.Schema['fullsizeFormat']) => {
      setState(fullsizeFormat)
      persisted.write('fullsizeFormat', fullsizeFormat)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('fullsizeFormat', nextFullsizeFormat => {
      setState(nextFullsizeFormat)
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

export function useFullsizeFormat() {
  return React.useContext(stateContext)
}

export function useSetFullsizeFormat() {
  return React.useContext(setContext)
}
