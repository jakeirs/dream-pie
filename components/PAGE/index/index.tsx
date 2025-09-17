import { View } from 'react-native'
import { PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui'
import { router } from 'expo-router'

// components
import { Top } from './components/Top'
import { Bottom } from './components/Bottom/Bottom'
import PoseLibraryContent from '@/components/PAGE/pose-library'
// hooks
import { useBottomSheets } from './hooks/useBottomSheets'

export default function CreatePage() {
  // Bottom Sheet management
  const { poseLibraryRef, handlePoseLibraryOpen, handlePoseLibraryClose } = useBottomSheets()

  const handlePoseChange = () => {
    handlePoseLibraryOpen()
  }

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
      <Top />
      <Bottom onPoseChange={handlePoseChange} />

      {/* Bottom Sheet Modals */}
      <BottomSheet
        ref={poseLibraryRef}
        isModal={false}
        enablePanDownToClose={false}
        scrollView={false}
        snapPoints={['30%', '60%', '95%']}
        backdropAppearsIndex={1}
        index={1}>
        <PoseLibraryContent onClose={handlePoseLibraryClose} />
      </BottomSheet>
    </View>
  )
}
