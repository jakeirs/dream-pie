import { View, ScrollView } from 'react-native'
import { router } from 'expo-router'
// components
import PoseLibraryContent from '@/components/PAGE/pose-library-bottomsheet'
import SelfieChooserContent from '@/components/PAGE/selfie-chooser-bottomsheet'
import { Top } from './components/Top'
import { Bottom } from './components/Bottom'
//ui
import PageHeader from '@/components/ui/PageHeader/PageHeader'
import BottomSheet from '@/components/ui/BottomSheet/BottomSheet'
// hooks
import { useBottomSheets } from './hooks/useBottomSheets'
//constants
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

export default function CreatePage() {
  // Bottom Sheet management
  const { poseLibraryRef, handlePoseLibraryClose, selfieChooserRef, handleSelfieChooserClose } =
    useBottomSheets()

  const handleSettingsPress = () => {
    router.push('/settings')
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="Dream Pie"
        rightIcon={{
          name: 'settings',
          family: ICON_FAMILY_NAME.Feather,
          onPress: handleSettingsPress,
        }}
      />

      {/* Original Components */}
      <ScrollView className="flex-1">
        <Top />
        <Bottom />
      </ScrollView>

      {/* Pose Library Bottom Sheet */}
      <BottomSheet
        ref={poseLibraryRef}
        isModal={false}
        enablePanDownToClose={true}
        scrollView={true}
        snapPoints={['30%', '60%', '95%']}
        backdropAppearsIndex={0}
        index={-1}>
        <PoseLibraryContent onClose={handlePoseLibraryClose} />
      </BottomSheet>

      {/* Selfie Chooser Bottom Sheet */}
      <BottomSheet
        ref={selfieChooserRef}
        isModal={false}
        enablePanDownToClose={true}
        scrollView={true}
        snapPoints={['30%', '60%', '95%']}
        backdropAppearsIndex={0}
        index={-1}>
        <SelfieChooserContent onClose={handleSelfieChooserClose} />
      </BottomSheet>
    </View>
  )
}
