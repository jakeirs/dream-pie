import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'

import Button from '@/components/ui/Button/Button'
import { brandColors } from '@/shared/theme'
import { mockSubscriptionPlans } from '@/mockData/dream'

interface PaywallPageProps {
  onClose: () => void
}

export default function PaywallPage({ onClose }: PaywallPageProps) {
  const [availablePlans] = useState(mockSubscriptionPlans)

  const handleUpgrade = (tier: 'pro' | 'premium') => {
    // In real app, this would process payment and upgrade subscription
    console.log('Upgrading to:', tier)
    // Close modal
    onClose()
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-textPrimary text-center mb-2">
          Unlock Dream Pie Pro
        </Text>
        <Text className="text-textSecondary text-center mb-8">
          Create unlimited AI photos with premium features
        </Text>

        <View className="space-y-4 mb-8">
          {availablePlans.filter(plan => plan.tier !== 'free').map((plan) => (
            <View
              key={plan.tier}
              className={`bg-card rounded-xl p-4 ${
                plan.popularBadge ? 'border-2 border-primary' : 'border border-borderLight'
              }`}>

              {plan.popularBadge && (
                <View className="absolute -top-2 left-4 bg-primary px-3 py-1 rounded-full">
                  <Text className="text-xs font-bold" style={{ color: brandColors.primaryForeground }}>
                    MOST POPULAR
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-textPrimary">{plan.name}</Text>
                <Text className="text-lg font-bold text-accent">
                  ${plan.price.monthly}/mo
                </Text>
              </View>

              <Text className="text-textSecondary mb-4">{plan.description}</Text>

              <View className="space-y-2 mb-4">
                <Text className="text-textPrimary">
                  ✓ {plan.features.maxCreationsPerMonth === 999 ? 'Unlimited' : plan.features.maxCreationsPerMonth} creations per month
                </Text>
                {plan.features.watermarkFree && (
                  <Text className="text-textPrimary">✓ Watermark-free exports</Text>
                )}
                {plan.features.premiumPoses && (
                  <Text className="text-textPrimary">✓ Premium pose library</Text>
                )}
                {plan.features.priorityProcessing && (
                  <Text className="text-textPrimary">✓ Priority processing</Text>
                )}
              </View>

              <Button
                onPress={() => handleUpgrade(plan.tier as 'pro' | 'premium')}
                variant={plan.popularBadge ? 'primary' : 'secondary'}
                className="w-full">
                <Text>Upgrade to {plan.name}</Text>
              </Button>
            </View>
          ))}
        </View>

        <Button variant="error" size="small" onPress={onClose}>
          <Text>Maybe Later</Text>
        </Button>
      </ScrollView>
    </View>
  )
}