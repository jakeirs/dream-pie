import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button, Icon, ICON_FAMILY_NAME } from '@/components/ui'

interface SelfieGuidePageProps {
  onClose: () => void
}

export default function SelfieGuidePage({ onClose }: SelfieGuidePageProps) {

  const tips = [
    {
      icon: 'sun',
      title: 'Good Lighting',
      description: 'Use natural light or well-lit indoor spaces for the best results.'
    },
    {
      icon: 'camera',
      title: 'Clear Face',
      description: 'Make sure your face is clearly visible and not obscured by hair or objects.'
    },
    {
      icon: 'user',
      title: 'Center Yourself',
      description: 'Position yourself in the center of the frame for optimal AI processing.'
    },
    {
      icon: 'eye',
      title: 'Look at Camera',
      description: 'Direct eye contact with the camera creates the most natural results.'
    }
  ]

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-6 border-b border-borderLight">
        <Text className="text-xl font-bold text-textPrimary">Smart Selfie Tips</Text>
        <Button variant="secondary" size="small" onPress={onClose}>
          <Text>Got it!</Text>
        </Button>
      </View>

      <ScrollView className="flex-1 p-6">
        <Text className="text-textSecondary text-center mb-8">
          Follow these tips for the best AI generation results
        </Text>

        <View className="space-y-6">
          {tips.map((tip, index) => (
            <View key={index} className="bg-card rounded-xl p-4 flex-row">
              <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-4">
                <Icon
                  family={ICON_FAMILY_NAME.Feather}
                  name={tip.icon as any}
                  size={20}
                  color="#FDE047"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-textPrimary mb-2">
                  {tip.title}
                </Text>
                <Text className="text-textSecondary">
                  {tip.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="bg-success/10 rounded-xl p-4 mt-8">
          <Text className="text-success font-semibold mb-2">💡 Pro Tip</Text>
          <Text className="text-textSecondary">
            The better your selfie quality, the more amazing your AI-generated results will be!
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}