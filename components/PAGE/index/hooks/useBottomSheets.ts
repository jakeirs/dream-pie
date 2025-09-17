import { useRef, useEffect } from 'react'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useAppStores } from '@/stores'

export const useBottomSheets = () => {
  // Get Zustand store
  const { navigation } = useAppStores()

  // Create refs
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  // Register refs with Zustand store on mount ONCE
  useEffect(() => {
    navigation.setPoseLibraryRef(poseLibraryRef)
    navigation.setPaywallRef(paywallRef)
  }, []) // ✅

  const handlePoseLibraryClose = () => {
    navigation.poseLibraryRef?.current?.close()
  }

  return {
    poseLibraryRef,
    handlePoseLibraryClose,
  }
}
