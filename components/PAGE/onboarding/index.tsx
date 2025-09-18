import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'

import PageHeader from '@/components/ui/PageHeader/PageHeader'
import PoseCard from '@/components/ui/PoseCard/PoseCard'
import Button from '@/components/ui/Button/Button'

import { mockPoses } from '@/mockData/dream/poses'

export default function OnboardingPage() {
  const [selectedPoseId, setSelectedPoseId] = useState<string | null>(null)

  const handlePoseSelect = (poseId: string) => {
    // Toggle selection - if same pose clicked, deselect
    setSelectedPoseId((current) => (current === poseId ? null : poseId))
  }

  const handleContinue = () => {
    if (selectedPoseId) {
      const selectedPose = mockPoses.find((pose) => pose.id === selectedPoseId)
      console.log('Selected pose:', selectedPose)
      // Navigate to next step
      router.push('/(auth)/login')
    }
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Choose Your Style" />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="py-6">
          <Text className="mb-2 text-2xl font-bold text-textPrimary">
            Select Your Favorite Pose
          </Text>
          <Text className="text-base leading-6 text-textSecondary">
            Choose a pose style that resonates with you. This will help us personalize your Dream
            Pie experience.
          </Text>
        </View>

        {/* Pose Grid */}
        <View className="mb-8 gap-4">
          {mockPoses.map((pose) => (
            <PoseCard
              key={pose.id}
              pose={pose}
              isSelected={pose.id === selectedPoseId}
              onSelect={handlePoseSelect}
            />
          ))}
        </View>

        {/* Statistics */}
        <View className="bg-surface mb-6 rounded-xl p-4">
          <Text className="mb-2 font-semibold text-textPrimary">Pose Collection Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-textSecondary">Total Poses</Text>
              <Text className="text-lg font-bold text-primary">{mockPoses.length}</Text>
            </View>
            <View>
              <Text className="text-sm text-textSecondary">Categories</Text>
              <Text className="text-lg font-bold text-primary">
                {new Set(mockPoses.map((pose) => pose.category)).size}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-textSecondary">Selected</Text>
              <Text className="text-lg font-bold text-primary">{selectedPoseId ? '1' : '0'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-border bg-card p-4">
        <Button
          variant={selectedPoseId ? 'primary' : 'secondary'}
          disabled={!selectedPoseId}
          onPress={handleContinue}
          className="w-full"
          title={selectedPoseId ? 'Continue with Selection' : 'Select a Pose to Continue'}
        />

        {selectedPoseId && (
          <Button
            variant="secondary"
            onPress={() => setSelectedPoseId(null)}
            className="mt-2 w-full"
            title="Clear Selection"
          />
        )}
      </View>
    </View>
  )
}
