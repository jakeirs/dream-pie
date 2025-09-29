import { View, Text } from 'react-native'
import { useEffect } from 'react'

// 2. UI components (@/components/ui)
import PoseCard from '@/components/ui/PoseCard/PoseCard'

// 3. Constants, Types, Mock Data
import { usePoseStore } from '@/stores'
import { mockPoses } from '@/mockData/dream/poses'
import { loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'
import type { Pose } from '@/types'
import { USER_POSES } from '@/stores/AsyncStorage/keys'
import { allPoses } from '@/shared/assets/poses'

export const PoseGrid = () => {
  const { setSelectedPose, selectedPose, poses, setPoses } = usePoseStore()

  // Load poses on mount if empty - now async to handle file system sync
  useEffect(() => {
    const loadPoses = async () => {
      const loadedPoses = await loadItemsFromAsyncStorage<Pose>(USER_POSES)

      if (loadedPoses.length === 0) {
        await setPoses(allPoses)
        return
      }
      setPoses(loadedPoses)
    }

    loadPoses()
  }, [setPoses])

  // Safety check for poses array
  if (!poses || poses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-textSecondary">Loading poses...</Text>
      </View>
    )
  }
  const handlePoseSelect = (poseId: string) => {
    const pose = poses.find((p) => p.id === poseId)
    if (pose) {
      setSelectedPose(pose)
    }
  }

  return (
    <View className="flex-row flex-wrap p-1">
      {poses.map((pose) => {
        const isSelected = selectedPose?.id === pose.id

        return (
          <View key={pose.id} className="w-1/3 p-1">
            <PoseCard pose={pose} isSelected={isSelected} onSelect={handlePoseSelect} />
          </View>
        )
      })}
    </View>
  )
}
