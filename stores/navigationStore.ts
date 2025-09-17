import { RefObject } from 'react'
import { create } from 'zustand'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'

interface NavigationStore {
  // Bottom Sheet Refs
  poseLibraryRef: RefObject<BottomSheetLib | null> | null
  paywallRef: RefObject<BottomSheetModal | null> | null

  // Actions - Ref Management
  setPoseLibraryRef: (ref: RefObject<BottomSheetLib | null>) => void
  setPaywallRef: (ref: RefObject<BottomSheetModal | null>) => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial State

  // poseLibraryRef - only available on (tabs)/index
  poseLibraryRef: null,
  paywallRef: null,

  // Ref Setters
  setPoseLibraryRef: (ref) => set({ poseLibraryRef: ref }),
  setPaywallRef: (ref) => set({ paywallRef: ref }),
}))
