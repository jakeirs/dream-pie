import { View } from 'react-native'
import { useRouter } from 'expo-router'

import GenerateButton from './Bottom/GenerateButton'
import HowItWorks from './Bottom/HowItWorks'
import Button from '@/components/ui/Button/Button'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  const router = useRouter()
  return (
    <View className="flex-1 justify-end bg-red-50 pb-10">
      <HowItWorks />
      <GenerateButton />

      {/*

        <CollageGenerator />

        <Button
          variant="secondary"
          className="mb-8 mt-4 px-6 py-4"
          title="Go to Generation Page"
          onPress={() => {
            router.push('/generation')
          }}
        /> */}
    </View>
  )
}
