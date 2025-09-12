import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Card, Button, AnimatedBox } from '../../../ui';
import { InteractiveStarProps, FeatureShowcaseProps } from '../types';

export const InteractiveStar = ({ animations }: InteractiveStarProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: animations.values.scale.value },
      { rotate: `${animations.values.rotate.value}deg` },
    ],
  }));

  return (
    <View className="mb-8 items-center">
      <AnimatedBox
        size="xl"
        shape="circle"
        className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
        <Animated.View style={animatedStyle}>
          <Text className="text-4xl">🌟</Text>
        </Animated.View>
      </AnimatedBox>

      <View className="items-center space-y-2">
        <Button
          title="Animate Star!"
          onPress={animations.handleStarAnimation}
          variant="secondary"
          size="lg"
        />
        <Text className="text-sm text-gray-600">Animations: {animations.animationCounter}</Text>
        {animations.animationCounter > 0 && (
          <Button title="Reset" onPress={animations.resetAnimations} variant="warning" size="sm" />
        )}
      </View>
    </View>
  );
};

export const FeatureShowcase = ({ cards, features }: FeatureShowcaseProps) => {
  return (
    <View className="space-y-4">
      {features.map((feature) => (
        <Card
          key={feature.id}
          title={`${feature.icon} ${feature.title}`}
          description={feature.description}
          variant={feature.variant}
          interactive={true}
          onPress={() => cards.handleCardPress(feature.id)}>
          {cards.activeCard === feature.id && feature.details && (
            <View className="mt-3 space-y-2">
              {feature.details.map((detail, index) => (
                <Text key={index} className="text-sm text-gray-700">
                  • {detail}
                </Text>
              ))}
            </View>
          )}
        </Card>
      ))}
    </View>
  );
};

export const NavigationSuccess = () => {
  return (
    <Card
      title="🚀 Navigation Success!"
      description="You've successfully implemented Expo Router with tab navigation. This explore tab demonstrates that routing is working perfectly!"
      variant="info"
      className="mb-6"
    />
  );
};

export const UserJourneyCard = () => {
  const journeySteps = [
    '1. App launches on Home tab',
    '2. All animations work perfectly',
    '3. Bottom sheet opens/closes smoothly',
    '4. Tab switching is seamless',
    '5. State is preserved across tabs',
    '6. Interactive components respond beautifully',
  ];

  return (
    <Card title="📱 User Journey" variant="success" className="mt-4">
      {journeySteps.map((step, index) => (
        <Text key={index} className="mb-1 text-green-700">
          {step}
        </Text>
      ))}
    </Card>
  );
};
