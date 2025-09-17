import { useRef, useEffect } from 'react'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useStore, useNavigationStore } from '@/stores'

export const useBottomSheets = () => {
  // ✅ Optimized: Get only the actions and ref we need
  const setPoseLibraryRef = useStore(useNavigationStore, (state) => state.setPoseLibraryRef)
  const setPaywallRef = useStore(useNavigationStore, (state) => state.setPaywallRef)
  const poseLibraryRefFromStore = useStore(useNavigationStore, (state) => state.poseLibraryRef)

  // Create refs
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  // Register refs with Zustand store on mount ONCE
  useEffect(() => {
    setPoseLibraryRef(poseLibraryRef)
    setPaywallRef(paywallRef)
  }, [setPoseLibraryRef, setPaywallRef])

  const handlePoseLibraryClose = () => {
    poseLibraryRefFromStore?.current?.close()
  }

  return {
    poseLibraryRef,
    handlePoseLibraryClose,
  }
}
