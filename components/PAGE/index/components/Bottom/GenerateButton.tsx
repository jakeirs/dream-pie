import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import Button from '@/components/ui/Button/Button'
import Alert from '@/components/ui/Alert/Alert'
import Result from '@/components/ui/Result/Result'
import { useGeneratePhotoLogic } from '../../hooks/useGeneratePhotoLogic'
import { brandColors } from '@/shared/theme'

interface GenerateButtonProps {
  className?: string
}

export default function GenerateButton({ className = '' }: GenerateButtonProps) {
  const {
    generatePhoto,
    canGenerate,
    isProcessing,
    isConvertingImage,
    isGenerating,
    result,
    error,
    resetGeneration,
  } = useGeneratePhotoLogic()

  const [showResult, setShowResult] = useState(false)

  // Auto-show Alert when processing starts or result/error is available
  useEffect(() => {
    if (isProcessing || result || error) {
      setShowResult(true)
    }
  }, [isProcessing, result, error])

  const handleGeneratePhoto = () => {
    generatePhoto()
  }

  const handleRetry = () => {
    resetGeneration()
    generatePhoto()
  }

  const handleCloseResult = () => {
    setShowResult(false)
    resetGeneration()
  }

  const getButtonText = () => {
    if (isConvertingImage) return '📷 Preparing image...'
    if (isGenerating) return '🎨 Generating...'
    if (isProcessing) return '⚙️ Processing...'
    return '🎨 Generate Photo →'
  }

  const getAlertTitle = () => {
    if (isConvertingImage) return 'Preparing Image'
    if (isGenerating) return 'Generating Photo'
    if (isProcessing) return 'Processing'
    if (error) return 'Generation Failed'
    if (result) return 'Photo Ready!'
    return ''
  }

  return (
    <>
      {/* Generate Photo Button */}
      <View className={`mb-8 px-6 ${className}`}>
        <Button
          onPress={handleGeneratePhoto}
          disabled={!canGenerate || isProcessing}
          className="w-full"
          style={{
            backgroundColor: isProcessing ? brandColors.cardSecondary : brandColors.primary,
            paddingVertical: 24,
          }}>
          <Text
            className="text-xl font-bold"
            style={{
              color: isProcessing
                ? brandColors.textMuted
                : brandColors.primaryForeground,
            }}>
            {getButtonText()}
          </Text>
        </Button>
      </View>

      {/* Result Alert */}
      <Alert
        visible={showResult}
        onClose={handleCloseResult}
        title={getAlertTitle()}>
        <Result
          result={result}
          error={error}
          isProcessing={isProcessing}
          isConvertingImage={isConvertingImage}
          isGenerating={isGenerating}
          onRetry={handleRetry}
          onClose={handleCloseResult}
        />
      </Alert>
    </>
  )
}