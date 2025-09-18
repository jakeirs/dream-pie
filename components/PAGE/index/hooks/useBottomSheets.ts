import { useRef, useEffect } from 'react'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useStore, useNavigationStore } from '@/stores'

export const useBottomSheets = () => {
  // ✅ Optimized: Get only the actions and ref we need
  const setPoseLibraryRef = useStore(useNavigationStore, (state) => state.setPoseLibraryRef)
  const setPaywallRef = useStore(useNavigationStore, (state) => state.setPaywallRef)
  const setSelfieChooserRef = useStore(useNavigationStore, (state) => state.setSelfieChooserRef)
  const poseLibraryRefFromStore = useStore(useNavigationStore, (state) => state.poseLibraryRef)
  const selfieChooserRefFromStore = useStore(useNavigationStore, (state) => state.selfieChooserRef)

  // Create refs
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)
  const selfieChooserRef = useRef<BottomSheetLib>(null)

  // Register refs with Zustand store on mount ONCE
  useEffect(() => {
    setPoseLibraryRef(poseLibraryRef)
    setPaywallRef(paywallRef)
    setSelfieChooserRef(selfieChooserRef)
  }, [setPoseLibraryRef, setPaywallRef, setSelfieChooserRef])

  const handlePoseLibraryClose = () => {
    poseLibraryRefFromStore?.current?.close()
  }

  const handleSelfieChooserClose = () => {
    selfieChooserRefFromStore?.current?.close()
  }

  return {
    poseLibraryRef,
    handlePoseLibraryClose,
    selfieChooserRef,
    handleSelfieChooserClose,
  }
}
