import {BottomSheet} from './src/BottomSheet'
import {
  BottomSheetSnapPoint,
  type BottomSheetState,
  type BottomSheetViewProps,
} from './src/BottomSheet.types'
import {BottomSheetNativeComponent} from './src/BottomSheetNativeComponent'
import {
  BottomSheetOutlet,
  BottomSheetPortalProvider,
  BottomSheetProvider,
} from './src/BottomSheetPortal'

export {
  BottomSheet,
  BottomSheetNativeComponent,
  BottomSheetOutlet,
  BottomSheetPortalProvider,
  BottomSheetProvider,
  BottomSheetSnapPoint,
}

// Export types separately to avoid Babel scope tracker issues
export type {BottomSheetState, BottomSheetViewProps}
