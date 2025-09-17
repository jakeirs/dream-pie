import { useRef } from 'react'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'

export const useBottomSheets = () => {
  // Refs for different BottomSheet instances
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  // Handler functions for BottomSheet controls
  const handlePoseLibraryOpen = () => {
    poseLibraryRef.current?.expand()
  }

  const handlePoseLibraryClose = () => {
    poseLibraryRef.current?.close()
  }

  const handlePaywallOpen = () => {
    paywallRef.current?.present()
  }

  const handlePaywallClose = () => {
    paywallRef.current?.dismiss()
  }

  return {
    // Refs
    poseLibraryRef,
    paywallRef,
    // Handlers
    handlePoseLibraryOpen,
    handlePoseLibraryClose,
    handlePaywallOpen,
    handlePaywallClose,
  }
}