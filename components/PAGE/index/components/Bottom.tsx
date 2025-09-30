import { View } from 'react-native'

import GenerateButton from './Bottom/GenerateButton'
import CollageGenerator from './Bottom/CollageGenerator/CollageGenerator'
import PoseAnalyzer from './Bottom/PoseAnalyzer/PoseAnalyzer'
import Button from '@/components/ui/Button/Button'
import { useRouter } from 'expo-router'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  const router = useRouter()
  return (
    <>
      <View className="flex-1">
        <GenerateButton />

        <PoseAnalyzer />

        <CollageGenerator />

        <Button
          variant="secondary"
          className="mb-8 mt-4 px-6 py-4"
          title="Go to Generation Page"
          onPress={() => {
            router.push('/generation')
          }}
        />
      </View>
    </>
  )
}
