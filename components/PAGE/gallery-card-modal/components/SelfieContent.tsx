import { View, Text } from 'react-native'

import { Selfie } from '@/types'
import { useRouter } from 'expo-router'
import { useSelfieChooserStore } from '@/stores'
import Button from '@/components/ui/Button/Button'
import { ICON_FAMILY_NAME } from '@/components/ui/icons'

interface SelfieContentProps {
  item: Selfie
  onClose: () => void
}

export default function SelfieContent({ item, onClose }: SelfieContentProps) {
  const router = useRouter()
  const setSelectedSelfie = useSelfieChooserStore((state) => state.setSelectedSelfie)

  const handleGoToCreate = () => {
    setSelectedSelfie(item)
    onClose()
    setTimeout(() => {
      router.push(`/(tabs)`)
    }, 300)
  }

  return (
    <>
      {/* Selfie Details */}
      <View className="mt-4 px-6">
        <Text className="text-center text-2xl font-bold text-textPrimary">{item.name}</Text>
        {item.description && (
          <Text className="mt-2 text-center text-base text-textSecondary">{item.description}</Text>
        )}
        <View className="mt-4 flex-row flex-wrap justify-center gap-2">
          {item.tags.map((tag, index) => (
            <View key={index} className="rounded-full bg-primaryForeground px-3 py-1">
              <Text className="text-sm text-textLight">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View
        className="mt-12 w-full flex-1"
        style={{ borderTopLeftRadius: 44, borderTopRightRadius: 44 }}>
        <View className="flex-1 justify-center px-10">
          <Button
            title="Use this Selfie"
            variant="primary"
            size="lg"
            icon={{
              family: ICON_FAMILY_NAME.SimpleLineIcons,
              name: 'magic-wand',
              position: 'left',
            }}
            onPress={() => handleGoToCreate()}
          />
        </View>
      </View>
    </>
  )
}
