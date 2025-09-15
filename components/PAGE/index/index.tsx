import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAnimationControls } from './hooks';
import { AnimationControls, FeatureList } from './components';
import { Button, PageHeader, ICON_FAMILY_NAME } from '@/components/ui';
import { IndexPageProps } from './types';
import { mockPostsWithAuthors, mockUsers } from '@/mockData';
import { brandColors } from '@/shared/theme';

export default function IndexPage({ className = '' }: IndexPageProps) {
  const { values, animations } = useAnimationControls();

  // Bottom Sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

  // Bottom sheet functions
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSettingsPress = useCallback(() => {
    console.log('Settings pressed!');
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: values.scale.value },
        { rotate: `${values.rotation.value}deg` },
        { translateX: values.translateX.value },
        { translateY: values.translateY.value },
      ],
      opacity: values.opacity.value,
    };
  });

  const colorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(values.colorProgress.value, [0, 1], [brandColors.accent, brandColors.error]),
    };
  });

  return (
    <View className={`flex-1 bg-background ${className}`}>
      <PageHeader
        title="Home"
        rightIcon={{
          name: 'cog',
          family: ICON_FAMILY_NAME.FontAwesome5,
          onPress: handleSettingsPress,
        }}
      />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-8 text-center text-3xl font-bold text-textPrimary">
          Reanimated 4 + Bottom Sheet Demo
        </Text>

        {/* Animated Box */}
        <View className="mb-8 items-center">
          <Animated.View
            style={[animatedStyle, colorAnimatedStyle]}
            className="h-24 w-24 items-center justify-center rounded-2xl shadow-lg">
            <Text className="text-lg font-bold text-white">🎯</Text>
          </Animated.View>
        </View>

        {/* Animation Controls using new component */}
        <AnimationControls animations={animations} />

        {/* Bottom Sheet Controls */}
        <View className="mb-8 space-y-4">
          <Text className="text-center text-xl font-semibold text-textSecondary">Bottom Sheet Demo</Text>
          <View className="items-center">
            <Button
              title="Show Mock Data"
              onPress={handleOpenBottomSheet}
              variant="primary"
              size="lg"
              className="px-8"
            />
          </View>
        </View>

        {/* Feature List using new component */}
        <FeatureList />
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: brandColors.textMuted }}
        backgroundStyle={{ backgroundColor: brandColors.card }}>
        <BottomSheetView className="flex-1 p-6 bg-card">
          <Text className="mb-4 text-center text-2xl font-bold text-textPrimary">
            📱 Mock Data Demo
          </Text>

          <Text className="mb-6 text-center text-textSecondary">
            Displaying typed mock data from our structured data system
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Users Section */}
            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-textPrimary">👥 Users</Text>
              {mockUsers.slice(0, 2).map(user => (
                <View key={user.id} className="mb-3 rounded-lg bg-cardSecondary p-4 border border-border">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: user.avatar }}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-textPrimary">@{user.username}</Text>
                      <Text className="text-sm text-textSecondary">{user.bio}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Posts Section */}
            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-textPrimary">📝 Posts</Text>
              {mockPostsWithAuthors.slice(0, 2).map(post => (
                <View key={post.id} className="mb-4 rounded-lg bg-cardSecondary p-4 border border-border">
                  <View className="flex-row items-center mb-2">
                    <Image
                      source={{ uri: post.author.avatar }}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <Text className="font-semibold text-accent">@{post.author.username}</Text>
                  </View>
                  <Text className="text-textSecondary mb-2">{post.content}</Text>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-success">❤️ {post.likesCount} likes</Text>
                    <Text className="text-sm text-accent">💬 {post.commentsCount} comments</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="items-center pb-4">
              <Button
                title="Close Mock Data"
                onPress={handleCloseBottomSheet}
                variant="error"
                size="lg"
              />
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
