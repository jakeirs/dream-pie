import React, { useRef, useEffect } from 'react'
import { View } from 'react-native'
import BottomSheetLib, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useAppStores } from '@/stores'
import { brandColors } from '@/shared/theme'

// Import all PAGE components that should render as BottomSheets
import SettingsPage from '@/components/PAGE/settings/index'
import PoseLibraryPage from '@/components/PAGE/pose-library/index'
import PaywallPage from '@/components/PAGE/paywall/index'
import SelfieGuidePage from '@/components/PAGE/selfie-guide/index'

export default function BottomSheetContainer() {
  const { navigation } = useAppStores()

  // Refs for each BottomSheet
  const settingsRef = useRef<BottomSheetLib>(null)
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetLib>(null)
  const selfieGuideRef = useRef<BottomSheetLib>(null)
  const shareOptionsRef = useRef<BottomSheetLib>(null)

  // Effect to sync navigation store state with BottomSheet visibility
  useEffect(() => {
    if (navigation.bottomSheets.settings.isOpen) {
      settingsRef.current?.snapToIndex(navigation.bottomSheets.settings.snapIndex)
    } else {
      settingsRef.current?.close()
    }
  }, [navigation.bottomSheets.settings.isOpen, navigation.bottomSheets.settings.snapIndex])

  useEffect(() => {
    if (navigation.bottomSheets.poseLibrary.isOpen) {
      poseLibraryRef.current?.snapToIndex(navigation.bottomSheets.poseLibrary.snapIndex)
    } else {
      poseLibraryRef.current?.close()
    }
  }, [navigation.bottomSheets.poseLibrary.isOpen, navigation.bottomSheets.poseLibrary.snapIndex])

  useEffect(() => {
    if (navigation.bottomSheets.paywall.isOpen) {
      paywallRef.current?.snapToIndex(navigation.bottomSheets.paywall.snapIndex)
    } else {
      paywallRef.current?.close()
    }
  }, [navigation.bottomSheets.paywall.isOpen, navigation.bottomSheets.paywall.snapIndex])

  useEffect(() => {
    if (navigation.bottomSheets.selfieGuide.isOpen) {
      selfieGuideRef.current?.snapToIndex(navigation.bottomSheets.selfieGuide.snapIndex)
    } else {
      selfieGuideRef.current?.close()
    }
  }, [navigation.bottomSheets.selfieGuide.isOpen, navigation.bottomSheets.selfieGuide.snapIndex])

  // Backdrop component with dismiss functionality
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      onPress={() => {
        // Close the currently open BottomSheet
        navigation.closeAllBottomSheets()
      }}
    />
  )

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }} pointerEvents="box-none">

      {/* Settings BottomSheet */}
      <BottomSheetLib
        ref={settingsRef}
        index={-1}
        snapPoints={['50%', '90%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: brandColors.background }}
        handleIndicatorStyle={{ backgroundColor: brandColors.textMuted }}>
        <SettingsPage />
      </BottomSheetLib>

      {/* Pose Library BottomSheet */}
      <BottomSheetLib
        ref={poseLibraryRef}
        index={-1}
        snapPoints={['50%', '90%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: brandColors.background }}
        handleIndicatorStyle={{ backgroundColor: brandColors.textMuted }}>
        <PoseLibraryPage />
      </BottomSheetLib>

      {/* Paywall BottomSheet */}
      <BottomSheetLib
        ref={paywallRef}
        index={-1}
        snapPoints={['60%', '90%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: brandColors.background }}
        handleIndicatorStyle={{ backgroundColor: brandColors.textMuted }}>
        <PaywallPage />
      </BottomSheetLib>

      {/* Selfie Guide BottomSheet */}
      <BottomSheetLib
        ref={selfieGuideRef}
        index={-1}
        snapPoints={['50%', '80%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: brandColors.background }}
        handleIndicatorStyle={{ backgroundColor: brandColors.textMuted }}>
        <SelfieGuidePage />
      </BottomSheetLib>

    </View>
  )
}