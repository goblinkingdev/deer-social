import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['thumbnailFormat']
type SetContext = (v: persisted.Schema['thumbnailFormat']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.thumbnailFormat,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['thumbnailFormat']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('thumbnailFormat'))

  const setStateWrapped = React.useCallback(
    (thumbnailFormat: persisted.Schema['thumbnailFormat']) => {
      setState(thumbnailFormat)
      persisted.write('thumbnailFormat', thumbnailFormat)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('thumbnailFormat', nextThumbnailFormat => {
      setState(nextThumbnailFormat)
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

export function useThumbnailFormat() {
  return React.useContext(stateContext)
}

export function useSetThumbnailFormat() {
  return React.useContext(setContext)
}
