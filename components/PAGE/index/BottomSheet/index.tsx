import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BottomSheet } from '@/components/ui';
import { useBottomSheetDemo } from './hooks';
import { DemoCard, BottomSheetContent } from './components';
import { BottomSheetPageProps } from './types';

export default function BottomSheetPage({ className = '' }: BottomSheetPageProps) {
  const {
    scrollViewBottomSheetRef,
    viewBottomSheetRef,
    demoConfigs,
    openBottomSheet,
    closeBottomSheet,
  } = useBottomSheetDemo();

  return (
    <View className={`flex-1 bg-gray-100 ${className}`}>
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-2 text-center text-3xl font-bold text-gray-800">
          BottomSheet Component Demo
        </Text>

        <Text className="mb-8 text-center text-gray-600">
          Demonstrating the reusable BottomSheet UI component with different configurations
        </Text>

        <View className="mb-6">
          <Text className="mb-4 text-xl font-semibold text-gray-700">📋 Component Features</Text>

          <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <Text className="font-medium text-gray-800 mb-2">🎛️ Default Configuration</Text>
            <View className="space-y-1">
              <Text className="text-sm text-gray-600">• Snap Points: 25%, 50%, 90%</Text>
              <Text className="text-sm text-gray-600">• Backdrop with 50% opacity</Text>
              <Text className="text-sm text-gray-600">• Pan-down-to-close enabled</Text>
              <Text className="text-sm text-gray-600">• Professional styling</Text>
            </View>
          </View>

          <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <Text className="font-medium text-gray-800 mb-2">⚙️ Configurable Props</Text>
            <View className="space-y-1">
              <Text className="text-sm text-gray-600">• <Text className="font-mono">scrollView?: boolean</Text> - Toggle scroll behavior</Text>
              <Text className="text-sm text-gray-600">• <Text className="font-mono">children: React.ReactNode</Text> - Content to display</Text>
              <Text className="text-sm text-gray-600">• All @gorhom/bottom-sheet props supported</Text>
            </View>
          </View>
        </View>

        <Text className="mb-4 text-xl font-semibold text-gray-700">🧪 Interactive Demos</Text>

        {demoConfigs.map((demo) => (
          <DemoCard
            key={demo.id}
            demo={demo}
            onPress={() => openBottomSheet(demo.id)}
          />
        ))}

        <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
          <Text className="font-medium text-blue-800 mb-2">💡 Usage Example</Text>
          <View className="bg-white p-3 rounded border">
            <Text className="font-mono text-xs text-gray-700">
              {`import { BottomSheet } from '@/components/ui';

<BottomSheet
  ref={bottomSheetRef}
  scrollView={true}
>
  <YourContent />
</BottomSheet>`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Scrollable BottomSheet Demo */}
      <BottomSheet
        ref={scrollViewBottomSheetRef}
        scrollView={true}
      >
        <BottomSheetContent
          demo={demoConfigs[0]}
          onClose={() => closeBottomSheet('scrollView')}
        />
      </BottomSheet>

      {/* Non-scrollable BottomSheet Demo */}
      <BottomSheet
        ref={viewBottomSheetRef}
        scrollView={false}
      >
        <BottomSheetContent
          demo={demoConfigs[1]}
          onClose={() => closeBottomSheet('view')}
        />
      </BottomSheet>
    </View>
  );
}