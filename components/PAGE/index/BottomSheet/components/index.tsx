import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui';
import { DemoConfig } from '../types';

interface DemoCardProps {
  demo: DemoConfig;
  onPress: () => void;
}

export const DemoCard = ({ demo, onPress }: DemoCardProps) => {
  return (
    <View className="mb-4 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
      <Text className="mb-2 text-lg font-semibold text-gray-800">{demo.title}</Text>
      <Text className="mb-3 text-sm text-gray-600">{demo.description}</Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-500 mr-2">scrollView:</Text>
          <View className={`px-2 py-1 rounded ${demo.scrollView ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Text className={`text-xs font-medium ${demo.scrollView ? 'text-green-700' : 'text-blue-700'}`}>
              {demo.scrollView ? 'true' : 'false'}
            </Text>
          </View>
        </View>
        <Button
          title="Open Demo"
          onPress={onPress}
          variant={demo.scrollView ? 'success' : 'info'}
          size="sm"
        />
      </View>
    </View>
  );
};

interface BottomSheetContentProps {
  demo: DemoConfig;
  onClose: () => void;
}

export const BottomSheetContent = ({ demo, onClose }: BottomSheetContentProps) => {
  const generateLongContent = () => {
    const items = [];
    for (let i = 1; i <= 20; i++) {
      items.push(
        <View key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
          <Text className="font-medium text-gray-800">List Item {i}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            This is sample content item #{i}. In a real app, this could be user data, product listings, or any dynamic content.
          </Text>
        </View>
      );
    }
    return items;
  };

  return (
    <View className="flex-1 p-6">
      <Text className="text-center text-2xl font-bold text-gray-800 mb-2">
        {demo.title}
      </Text>

      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-gray-600 mr-2">Component Type:</Text>
        <View className={`px-3 py-1 rounded-full ${demo.scrollView ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Text className={`font-medium ${demo.scrollView ? 'text-green-700' : 'text-blue-700'}`}>
            {demo.scrollView ? 'BottomSheetScrollView' : 'BottomSheetView'}
          </Text>
        </View>
      </View>

      <Text className="text-center text-gray-600 mb-6">{demo.content}</Text>

      {demo.scrollView ? (
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-4">📜 Scrollable Content</Text>
          <Text className="text-sm text-gray-600 mb-4">
            Try scrolling through the content below. This demonstrates how BottomSheetScrollView
            handles long content lists perfectly.
          </Text>
          {generateLongContent()}
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <View className="bg-blue-50 p-6 rounded-lg mb-6">
            <Text className="text-center text-blue-800 font-medium mb-2">🎯 Fixed Content Demo</Text>
            <Text className="text-center text-blue-600 text-sm">
              This content is displayed in a BottomSheetView, which doesn&apos;t scroll.
              Perfect for forms, controls, or short content that fits within the sheet height.
            </Text>
          </View>

          <View className="w-full space-y-3">
            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-800">Form Field Example</Text>
              <Text className="text-sm text-gray-600 mt-1">This could be an input field</Text>
            </View>

            <View className="bg-white p-4 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-800">Another Control</Text>
              <Text className="text-sm text-gray-600 mt-1">This could be a switch or picker</Text>
            </View>
          </View>
        </View>
      )}

      <View className="items-center mt-6 pt-4 border-t border-gray-200">
        <Button
          title="Close Demo"
          onPress={onClose}
          variant="primary"
          size="lg"
        />
      </View>
    </View>
  );
};