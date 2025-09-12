import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: hideSimilarAccountsRecomm – when true, hides similar accounts recommendations

type StateContext = persisted.Schema['hideSimilarAccountsRecomm']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['hideSimilarAccountsRecomm']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.hideSimilarAccountsRecomm,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['hideSimilarAccountsRecomm']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('hideSimilarAccountsRecomm'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['hideSimilarAccountsRecomm']) => {
      setState(value)
      persisted.write('hideSimilarAccountsRecomm', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('hideSimilarAccountsRecomm', next => {
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

export function useHideSimilarAccountsRecomm() {
  return React.useContext(stateContext)
}

export function useSetHideSimilarAccountsRecomm() {
  return React.useContext(setContext)
}
