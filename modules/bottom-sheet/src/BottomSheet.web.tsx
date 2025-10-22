import {type BottomSheetViewProps} from './BottomSheet.types'

// Diagnostic logging for debugging Babel scope tracker issue
// This will help us understand the module loading behavior
console.log('DEBUG: BottomSheet.web.tsx module loaded')
console.log(
  'DEBUG: Available exports from BottomSheet.types:',
  Object.keys(require('./BottomSheet.types')),
)

export function BottomSheet(_: BottomSheetViewProps) {
  console.log('DEBUG: BottomSheet function called')
  throw new Error('BottomSheet is not available on web')
}
