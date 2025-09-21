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
    stopGeneration,
    canGenerate,
    isProcessing,
    isCancelling,
    result,
    error,
    resetGeneration,
  } = useGeneratePhotoLogic()

  const [showResult, setShowResult] = useState(false)

  // Auto-show Alert when result or error is available
  useEffect(() => {
    if (result || error) {
      setShowResult(true)
    }
  }, [result, error])

  const handleGeneratePhoto = () => {
    generatePhoto()
  }

  const handleStopGeneration = () => {
    stopGeneration()
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
    if (isCancelling) return '🎨 Cancelling...'
    if (isProcessing) return '🎨 Generating...'
    return '🎨 Generate Photo →'
  }

  const getAlertTitle = () => {
    if (isCancelling) return 'Cancelling Generation'
    if (isProcessing) return 'Generating Photo'
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
          disabled={!canGenerate || isProcessing || isCancelling}
          className="w-full"
          style={{
            backgroundColor:
              isProcessing || isCancelling ? brandColors.cardSecondary : brandColors.primary,
            paddingVertical: 24,
          }}>
          <Text
            className="text-xl font-bold"
            style={{
              color:
                isProcessing || isCancelling
                  ? brandColors.textMuted
                  : brandColors.primaryForeground,
            }}>
            {getButtonText()}
          </Text>
        </Button>

        {/* Stop Generating Button - Only show when processing */}
        {isProcessing && (
          <Button
            onPress={handleStopGeneration}
            disabled={isCancelling}
            className="mt-4 w-full"
            style={{
              backgroundColor: isCancelling ? brandColors.cardSecondary : brandColors.error,
              paddingVertical: 20,
            }}>
            <Text
              className="text-lg font-semibold"
              style={{
                color: isCancelling ? brandColors.textMuted : brandColors.primaryForeground,
              }}>
              {isCancelling ? '⏹️ Cancelling...' : '⏹️ Stop Generating'}
            </Text>
          </Button>
        )}
      </View>

      {/* Result Alert */}
      <Alert visible={showResult} onClose={handleCloseResult} title={getAlertTitle()}>
        <Result
          result={result}
          error={error}
          isProcessing={isProcessing}
          onRetry={handleRetry}
          onClose={handleCloseResult}
        />
      </Alert>
    </>
  )
}
