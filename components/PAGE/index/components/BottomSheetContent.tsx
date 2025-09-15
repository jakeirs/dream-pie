import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button } from '@/components/ui';
import { mockPostsWithAuthors, mockUsers } from '@/mockData';

interface BottomSheetContentProps {
  demo?: any; // For future extensibility with demo configs
  onClose: () => void;
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({ demo, onClose }) => {
  return (
    <View className="flex-1 bg-card p-6">
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
          {mockUsers.slice(0, 2).map((user) => (
            <View
              key={user.id}
              className="mb-3 rounded-lg border border-border bg-cardSecondary p-4">
              <View className="flex-row items-center">
                <Image source={{ uri: user.avatar }} className="mr-3 h-10 w-10 rounded-full" />
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
          {mockPostsWithAuthors.slice(0, 2).map((post) => (
            <View
              key={post.id}
              className="mb-4 rounded-lg border border-border bg-cardSecondary p-4">
              <View className="mb-2 flex-row items-center">
                <Image source={{ uri: post.author.avatar }} className="mr-2 h-8 w-8 rounded-full" />
                <Text className="font-semibold text-accent">@{post.author.username}</Text>
              </View>
              <Text className="mb-2 text-textSecondary">{post.content}</Text>
              <View className="flex-row justify-between">
                <Text className="text-sm text-success">❤️ {post.likesCount} likes</Text>
                <Text className="text-sm text-accent">💬 {post.commentsCount} comments</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="items-center pb-4">
          <Button title="Close Mock Data" onPress={onClose} variant="error" size="lg" />
        </View>
      </ScrollView>
    </View>
  );
};
