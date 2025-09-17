import { View, Text } from 'react-native'
import { Button, PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

// Import content components
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
      {/* Main Header */}
      <View className="px-6 pb-8 pt-8">
        <Text className="mb-4 text-center text-3xl font-bold text-textPrimary">
          Let's create something new!
        </Text>
      </View>

      <View className="flex-1">
        {/* Generate Photo Button */}
        <View className="mb-8 px-6">
          <Button
            onPress={() => router.push('/(creation)/generation')}
            className="w-full"
            style={{
              backgroundColor: brandColors.success,
              paddingVertical: 24,
            }}>
            <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
              🎨 Generate Photo →
            </Text>
          </Button>
        </View>
      </View>

      {/* Pose Library Button */}
      <View className="border-t border-borderLight bg-background">
        <View className="px-6 py-6">
          <Button
            onPress={handlePoseChange}
            className="w-full"
            style={{
              backgroundColor: brandColors.warning,
              paddingVertical: 18,
            }}>
            <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
              Choose Pose
            </Text>
          </Button>
        </View>
      </View>

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
