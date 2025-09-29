import { View, Text, ActivityIndicator } from 'react-native'
import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import Alert from '@/components/ui/Alert/Alert'
import { usePoseAnalyzer } from '../hooks/usePoseAnalyzer'
import { AnalyzeButtonProps } from '../types'
import { brandColors } from '@/shared/theme/colors'

export default function AnalyzeButton({ onPress, isAnalyzing, disabled }: AnalyzeButtonProps) {
  const [showAlert, setShowAlert] = useState(false)

  const handlePress = async () => {
    await onPress()
    setShowAlert(true)
  }

  return (
    <>
      <Button
        variant="primary"
        onPress={handlePress}
        disabled={disabled}
        className="flex-row items-center justify-center space-x-2 px-6 py-4">
        {isAnalyzing && (
          <ActivityIndicator size="small" color={brandColors.primaryForeground} className="mr-2" />
        )}
        <Text
          className="text-center font-semibold"
          style={{ color: brandColors.primaryForeground }}>
          {isAnalyzing ? 'Analyzing Pose...' : 'Analyze Pose Photo'}
        </Text>
      </Button>
    </>
  )
}
